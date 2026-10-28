const ALLOWED_ORIGINS = new Set([
    "https://towfiq-ul.github.io",
    // Local dev frontend (vite.config.ts server.port). Origin is already
    // client-supplied and spoofable by non-browser callers (see below), so
    // allowing localhost doesn't weaken anything a curl script couldn't
    // already do by spoofing the production origin directly.
    "http://localhost:3000",
]);

function corsHeaders(origin) {
    return {
        "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Vary": "Origin",
    };
}

const MAX_BODY_BYTES = 80_000;
const MAX_MESSAGES = 60;
const MAX_TOTAL_CHARS = 60_000;
const MAX_TEMPERATURE = 2;
const MAX_TOKENS_CAP = 1024;
const ALLOWED_ROLES = new Set(["system", "user", "assistant"]);
const UPSTREAM_TIMEOUT_MS = 30_000;

export default {
    async fetch(request, env) {
        const origin = request.headers.get("Origin") ?? "";
        const cors = corsHeaders(origin);

        // Preflight — return immediately, no other logic
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: cors });
        }

        // Only POST allowed
        if (request.method !== "POST") {
            return json({ error: "Method Not Allowed" }, 405, cors);
        }

        // Origin is client-supplied and trivially spoofed by non-browser
        // callers, so it's not real auth — the rate limiter below is what
        // actually bounds abuse of the upstream key.
        if (!ALLOWED_ORIGINS.has(origin)) {
            return json({ error: "Forbidden" }, 403, cors);
        }

        // Guard: secrets must exist
        if (!env.AI_API_KEY || !env.AI_BASE_URL || !env.AI_MODEL) {
            return json({ error: "Worker secrets not configured" }, 500, cors);
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

        let payload;
        try {
            payload = sanitizeChatRequest(await request.json(), env);
        } catch (err) {
            return json({ error: "Bad Request", detail: String(err.message ?? err) }, 400, cors);
        }

        // AI_MODEL may be a comma-separated list: the first is primary, the rest
        // are fallbacks tried in order when a model is unavailable (404),
        // rate-limited (429) or erroring (5xx) — so one model being pulled or
        // throttled doesn't take the assistant down.
        const models = String(env.AI_MODEL).split(",").map((m) => m.trim()).filter(Boolean);
        const baseUrl = String(env.AI_BASE_URL).replace(/\/+$/, "");

        try {
            let upstream;
            let data;
            for (const [i, model] of models.entries()) {
                upstream = await fetch(`${baseUrl}/chat/completions`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${env.AI_API_KEY}`,
                        "Content-Type":  "application/json",
                    },
                    body: JSON.stringify({ ...payload, model }),
                    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
                });
                data = await upstream.json();

                const retryable = upstream.status === 404 || upstream.status === 429 || upstream.status >= 500;
                if (!retryable || i === models.length - 1) break;
                console.warn(`model ${model} failed with HTTP ${upstream.status}; falling back`);
            }
            return json(data, upstream.status, cors);

        } catch (err) {
            return json({ error: "Proxy error", detail: String(err) }, 502, cors);
        }
    }
};

// Whitelists fields and clamps values so a client can't inflate upstream cost
// (huge max_tokens, unbounded message count/length) or smuggle unexpected params.
function sanitizeChatRequest(body, env) {
    if (!body || typeof body !== "object") throw new Error("invalid request body");

    const { temperature, messages, max_tokens } = body;

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

    const safeTemperature = Number.isFinite(temperature)
        ? Math.min(Math.max(temperature, 0), MAX_TEMPERATURE)
        : 1;
    const safeMaxTokens = Number.isFinite(max_tokens)
        ? Math.min(Math.max(max_tokens, 1), MAX_TOKENS_CAP)
        : MAX_TOKENS_CAP;

    // `model` is filled in per attempt by the fallback loop in fetch().
    const payload = {
        temperature: safeTemperature,
        max_tokens: safeMaxTokens,
        messages: safeMessages,
    };

    // Reasoning controls are provider-specific, so only send what the
    // configured provider understands (strict APIs like Gemini's reject
    // unknown fields). Reasoning at the default "high" effort took a model
    // from 0.6s to 41.5s on a trivial prompt in testing.
    if (String(env.AI_BASE_URL).includes("openrouter.ai")) {
        payload.reasoning = { enabled: false };
    } else if (env.AI_REASONING_EFFORT) {
        // OpenAI-compatible APIs (incl. Gemini): minimal | low | medium | high
        // (Gemini 2.5 also accepts "none"; Gemini 3.x can't fully disable thinking).
        payload.reasoning_effort = env.AI_REASONING_EFFORT;
    }

    return payload;
}

function json(body, status = 200, cors = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...cors, "Content-Type": "application/json" },
    });
}