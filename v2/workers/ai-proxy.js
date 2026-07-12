const ALLOWED_ORIGIN = "https://towfiq-ul.github.io";

const CORS = {
    "Access-Control-Allow-Origin":  ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

const MAX_BODY_BYTES = 32_000;
const MAX_MESSAGES = 60;
const MAX_MESSAGE_CHARS = 4_000;
const MAX_TOTAL_CHARS = 24_000;
const MAX_TEMPERATURE = 2;
const MAX_TOKENS_CAP = 1024;
const ALLOWED_ROLES = new Set(["system", "user", "assistant"]);
const UPSTREAM_TIMEOUT_MS = 30_000;

export default {
    async fetch(request, env) {

        // Preflight — return immediately, no other logic
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: CORS });
        }

        // Only POST allowed
        if (request.method !== "POST") {
            return json({ error: "Method Not Allowed" }, 405);
        }

        // Only your portfolio domain. Origin is client-supplied and trivially
        // spoofed by non-browser callers, so it's not real auth — the rate
        // limiter below is what actually bounds abuse of the upstream key.
        const origin = request.headers.get("Origin") ?? "";
        if (origin !== ALLOWED_ORIGIN) {
            return json({ error: "Forbidden" }, 403);
        }

        // Guard: secrets must exist
        if (!env.AI_API_KEY || !env.AI_BASE_URL) {
            return json({ error: "Worker secrets not configured" }, 500);
        }

        if (env.RATE_LIMITER) {
            const clientIp = request.headers.get("CF-Connecting-IP") ?? "unknown";
            const { success } = await env.RATE_LIMITER.limit({ key: clientIp });
            if (!success) {
                return json({ error: "Too Many Requests" }, 429);
            }
        }

        const contentLength = Number(request.headers.get("Content-Length") ?? "0");
        if (contentLength > MAX_BODY_BYTES) {
            return json({ error: "Payload Too Large" }, 413);
        }

        let payload;
        try {
            payload = sanitizeChatRequest(await request.json());
        } catch (err) {
            return json({ error: "Bad Request", detail: String(err.message ?? err) }, 400);
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
            return json(data, upstream.status);

        } catch (err) {
            return json({ error: "Proxy error", detail: String(err) }, 502);
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
        if (m.content.length > MAX_MESSAGE_CHARS) throw new Error("message too long");
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

function json(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...CORS, "Content-Type": "application/json" },
    });
}