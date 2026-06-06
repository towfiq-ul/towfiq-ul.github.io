const ALLOWED_ORIGIN = "https://towfiq-ul.github.io";

const CORS = {
    "Access-Control-Allow-Origin":  ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

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

        // Only your portfolio domain
        const origin = request.headers.get("Origin") ?? "";
        if (origin !== ALLOWED_ORIGIN) {
            return json({ error: "Forbidden" }, 403);
        }

        // Guard: secrets must exist
        if (!env.AI_API_KEY || !env.AI_BASE_URL) {
            return json({ error: "Worker secrets not configured" }, 500);
        }

        try {
            const body = await request.json();

            const upstream = await fetch(`${env.AI_BASE_URL}/chat/completions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${env.AI_API_KEY}`,
                    "Content-Type":  "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await upstream.json();
            return json(data, upstream.status);

        } catch (err) {
            return json({ error: "Proxy error", detail: String(err) }, 500);
        }
    }
};

function json(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...CORS, "Content-Type": "application/json" },
    });
}