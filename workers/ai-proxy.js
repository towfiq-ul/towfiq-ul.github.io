/**
 * Towfiqul's AI Assistant — a RAG Worker on Cloudflare's free tier.
 *
 *   POST /        chat: embed the question (Workers AI) → retrieve the most
 *                 relevant portfolio chunks (Vectorize) → answer with an open
 *                 model (Workers AI), grounded by public/RULESET.md.
 *   POST /ingest  (re)index chunks; Bearer INGEST_TOKEN. Run by
 *                 `npm run rag:ingest` after content changes.
 *
 * The system prompt and context are owned here — the browser only sends the
 * conversation — so the endpoint can't be used as a general-purpose LLM.
 * No third-party API keys: everything runs on the `AI` and `VECTORIZE` bindings.
 */
import RULESET from "../public/RULESET.md";

const PRODUCTION_ORIGIN = "https://towfiq-ul.github.io";
// Local dev on any port, via localhost or 127.0.0.1 (vite dev / preview). Origin
// is client-supplied and spoofable by non-browser callers anyway (see below),
// so allowing loopback doesn't weaken anything a curl script couldn't already
// do by spoofing the production origin directly.
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const isAllowedOrigin = (origin) => origin === PRODUCTION_ORIGIN || LOCAL_ORIGIN.test(origin);

const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5"; // 768 dims — must match the Vectorize index
// Override with the AI_MODELS var (comma-separated, first = primary, rest = fallbacks).
const DEFAULT_CHAT_MODELS = "@cf/meta/llama-3.1-8b-instruct-fp8-fast,@cf/ibm-granite/granite-4.0-h-micro";

const MAX_BODY_BYTES = 80_000;
const MAX_MESSAGES = 60;
const MAX_TOTAL_CHARS = 60_000;
const HISTORY_TURNS = 8; // conversation messages forwarded to the model
const MAX_TEMPERATURE = 2;
const DEFAULT_TEMPERATURE = 0.4;
const MAX_TOKENS = 700;
const TOP_K = 6;
const MIN_SCORE = 0.45; // cosine; weaker matches are noise
const ALLOWED_ROLES = new Set(["user", "assistant"]);
const INGEST_BATCH = 50;
const DELETE_BATCH = 100;
const MAX_INGEST_CHUNKS = 1000;

const BUSY_MESSAGE =
    "I've reached my free daily limit for answering questions. Please try again tomorrow, " +
    "or reach Towfiqul directly via `mail` or `whatsapp` in the terminal.";

function corsHeaders(origin) {
    return {
        "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : "",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin",
    };
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const origin = request.headers.get("Origin") ?? "";
        const cors = corsHeaders(origin);

        // Preflight — return immediately, no other logic
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: cors });
        }

        if (request.method !== "POST") {
            return json({ error: "Method Not Allowed" }, 405, cors);
        }

        if (!env.AI || !env.VECTORIZE) {
            return json({ error: "Worker bindings (AI, VECTORIZE) not configured" }, 500, cors);
        }

        // Ingest is a server-to-server call (no browser Origin): token-protected.
        if (url.pathname === "/ingest") {
            return ingest(request, env);
        }

        // Origin is client-supplied and trivially spoofed by non-browser
        // callers, so it's not real auth — the rate limiter below is what
        // actually bounds abuse of the free allocation.
        if (!isAllowedOrigin(origin)) {
            return json({ error: "Forbidden" }, 403, cors);
        }

        if (env.RATE_LIMITER) {
            const clientIp = request.headers.get("CF-Connecting-IP") ?? "unknown";
            const { success } = await env.RATE_LIMITER.limit({ key: clientIp });
            if (!success) {
                return json({ error: "Too Many Requests" }, 429, cors);
            }
        }

        const contentLength = Number(request.headers.get("Content-Length") ?? "0");
        if (contentLength > MAX_BODY_BYTES) {
            return json({ error: "Payload Too Large" }, 413, cors);
        }

        let chat;
        try {
            chat = sanitizeChatRequest(await request.json());
        } catch (err) {
            return json({ error: "Bad Request", detail: String(err.message ?? err) }, 400, cors);
        }

        try {
            const { context, sources } = await retrieve(env, chat.messages);
            const answer = await generate(env, chat, context);
            // OpenAI-style shape, so the frontend's parsing is provider-agnostic.
            return json({ choices: [{ message: { role: "assistant", content: answer } }], sources }, 200, cors);
        } catch (err) {
            if (isQuotaError(err)) {
                return json({ choices: [{ message: { role: "assistant", content: BUSY_MESSAGE } }], sources: [] }, 200, cors);
            }
            console.error("chat failed:", err);
            return json({ error: "AI error", detail: String(err.message ?? err) }, 502, cors);
        }
    }
};

/** Embed the latest question (plus the previous one, for follow-ups) and fetch matching chunks. */
async function retrieve(env, messages) {
    const userTurns = messages.filter((m) => m.role === "user").slice(-2).map((m) => m.content);
    const query = userTurns.join("\n");
    const { data } = await env.AI.run(EMBEDDING_MODEL, { text: [query] });
    const { matches } = await env.VECTORIZE.query(data[0], { topK: TOP_K, returnMetadata: "all" });

    const hits = (matches ?? []).filter((m) => m.score >= MIN_SCORE && m.metadata?.text);
    const context = hits
        .map((m, i) => `[${i + 1}] (${m.metadata.source} — ${m.metadata.heading ?? ""})\n${m.metadata.text}`)
        .join("\n\n");
    const sources = [...new Set(hits.map((m) => String(m.metadata.source)))];
    return { context, sources };
}

/** Answer from the retrieved context, trying each configured model in turn. */
async function generate(env, chat, context) {
    const system = [
        RULESET,
        "## CONTEXT",
        "Answer ONLY from the context below (Towfiqul's portfolio, CV and project data). " +
        "If it doesn't contain the answer, follow the GROUNDING rule for unknown information.",
        context || "(no relevant context found)",
    ].join("\n\n");

    const messages = [{ role: "system", content: system }, ...chat.messages.slice(-HISTORY_TURNS)];
    const models = String(env.AI_MODELS || DEFAULT_CHAT_MODELS).split(",").map((m) => m.trim()).filter(Boolean);

    let lastError;
    for (const model of models) {
        try {
            const out = await env.AI.run(model, { messages, max_tokens: MAX_TOKENS, temperature: chat.temperature });
            const text = out?.response ?? out?.choices?.[0]?.message?.content;
            if (typeof text === "string" && text.trim()) return text.trim();
            lastError = new Error(`empty response from ${model}`);
        } catch (err) {
            if (isQuotaError(err)) throw err; // every model shares the same daily allocation
            lastError = err;
            console.warn(`model ${model} failed; falling back:`, err);
        }
    }
    throw lastError ?? new Error("no chat model configured");
}

/** POST /ingest {chunks: [{id, text, source, heading}], deleteIds?: string[]} */
async function ingest(request, env) {
    const auth = request.headers.get("Authorization") ?? "";
    if (!env.INGEST_TOKEN || auth !== `Bearer ${env.INGEST_TOKEN}`) {
        return json({ error: "Unauthorized" }, 401);
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return json({ error: "Bad Request" }, 400);
    }
    const chunks = Array.isArray(body?.chunks) ? body.chunks : [];
    if (!chunks.length || chunks.length > MAX_INGEST_CHUNKS) {
        return json({ error: `chunks must be a non-empty array (max ${MAX_INGEST_CHUNKS})` }, 400);
    }
    for (const c of chunks) {
        if (typeof c?.id !== "string" || typeof c?.text !== "string" || c.id.length > 64) {
            return json({ error: "each chunk needs a string id (≤64 bytes) and text" }, 400);
        }
    }

    try {
        let upserted = 0;
        for (let i = 0; i < chunks.length; i += INGEST_BATCH) {
            const batch = chunks.slice(i, i + INGEST_BATCH);
            const { data } = await env.AI.run(EMBEDDING_MODEL, { text: batch.map((c) => c.text) });
            await env.VECTORIZE.upsert(batch.map((c, j) => ({
                id: c.id,
                values: data[j],
                metadata: { text: c.text, source: String(c.source ?? ""), heading: String(c.heading ?? "") },
            })));
            upserted += batch.length;
        }

        // Vectorize accepts at most 100 ids per delete call.
        const deleteIds = Array.isArray(body.deleteIds) ? body.deleteIds.filter((id) => typeof id === "string") : [];
        for (let i = 0; i < deleteIds.length; i += DELETE_BATCH) {
            await env.VECTORIZE.deleteByIds(deleteIds.slice(i, i + DELETE_BATCH));
        }

        return json({ upserted, deleted: deleteIds.length });
    } catch (err) {
        return json({ error: "Ingest failed", detail: String(err.message ?? err) }, isQuotaError(err) ? 429 : 502);
    }
}

// Whitelists fields and clamps values so a client can't inflate cost or
// smuggle a system prompt: only user/assistant turns are accepted.
function sanitizeChatRequest(body) {
    if (!body || typeof body !== "object") throw new Error("invalid request body");

    const { temperature, messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) throw new Error("messages must be a non-empty array");
    if (messages.length > MAX_MESSAGES) throw new Error(`too many messages (max ${MAX_MESSAGES})`);

    let totalChars = 0;
    const safeMessages = messages.map((m) => {
        if (!m || typeof m !== "object") throw new Error("invalid message");
        if (!ALLOWED_ROLES.has(m.role)) throw new Error(`invalid role: ${m.role}`);
        if (typeof m.content !== "string") throw new Error("message content must be a string");
        totalChars += m.content.length;
        return { role: m.role, content: m.content };
    });
    if (totalChars > MAX_TOTAL_CHARS) throw new Error("conversation too long");
    if (safeMessages.at(-1).role !== "user") throw new Error("last message must be from the user");

    const safeTemperature = Number.isFinite(temperature)
        ? Math.min(Math.max(temperature, 0), MAX_TEMPERATURE)
        : DEFAULT_TEMPERATURE;

    return { temperature: safeTemperature, messages: safeMessages };
}

/** Workers AI's error when the free daily Neuron allocation is used up (code 4006). */
function isQuotaError(err) {
    return /4006|daily free allocation|neurons/i.test(String(err?.message ?? err));
}

function json(body, status = 200, cors = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...cors, "Content-Type": "application/json" },
    });
}
