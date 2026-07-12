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
// The system message carries the grounding context (RULESET.md + PDF +
// WEBSITE_CONTEXT.md + knowledge doc), measured ~20-25k chars in production —
// it's fixed app content, not a user-controlled conversation turn, so it gets
// a much higher ceiling than the per-turn cap below.
const MAX_SYSTEM_CHARS = 40_000;
const MAX_MESSAGE_CHARS = 4_000;
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
        if (!env.AI_API_KEY || !env.AI_BASE_URL) {
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
            payload = sanitizeChatRequest(await request.json());
        } catch (err) {
            return json({ error: "Bad Request", detail: String(err.message ?? err) }, 400, cors);
        }

        try {
            const upstream = await fetch(`${env.AI_BASE_URL}/chat/completions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${env.AI_API_KEY}`,
                    "Content-Type":  "application/json",
                },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
            });

            const data = await upstream.json();
            return json(data, upstream.status, cors);

        } catch (err) {
            return json({ error: "Proxy error", detail: String(err) }, 502, cors);
        }
    }
};

// Whitelists fields and clamps values so a client can't inflate upstream cost
// (huge max_tokens, unbounded message count/length) or smuggle unexpected params.
function sanitizeChatRequest(body) {
    if (!body || typeof body !== "object") throw new Error("invalid request body");

    const { model, temperature, messages, max_tokens } = body;

    if (typeof model !== "string" || !model) throw new Error("model is required");
    if (!Array.isArray(messages) || messages.length === 0) throw new Error("messages must be a non-empty array");
    if (messages.length > MAX_MESSAGES) throw new Error(`too many messages (max ${MAX_MESSAGES})`);

    let totalChars = 0;
    const safeMessages = messages.map((m) => {
        if (!m || typeof m !== "object") throw new Error("invalid message");
        if (!ALLOWED_ROLES.has(m.role)) throw new Error(`invalid role: ${m.role}`);
        if (typeof m.content !== "string") throw new Error("message content must be a string");
        const limit = m.role === "system" ? MAX_SYSTEM_CHARS : MAX_MESSAGE_CHARS;
        if (m.content.length > limit) throw new Error(`message too long (max ${limit} chars for role "${m.role}")`);
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

    return {
        model,
        temperature: safeTemperature,
        max_tokens: safeMaxTokens,
        messages: safeMessages,
        // Current upstream model (nvidia/nemotron-3-ultra-550b-a55b via
        // OpenRouter) reasons by default at "high" effort, which alone took
        // it from 0.6s to 41.5s on a trivial prompt in testing. Providers
        // that don't recognize this field ignore it.
        reasoning: { enabled: false },
    };
}

function json(body, status = 200, cors = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...cors, "Content-Type": "application/json" },
    });
}