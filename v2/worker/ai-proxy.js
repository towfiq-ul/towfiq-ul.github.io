export default {
    async fetch(request, env) {

        // Preflight
        if (request.method === "OPTIONS") {
            return corsResponse(null, 204);
        }

        // Block non-POST
        if (request.method !== "POST") {
            return corsResponse(JSON.stringify({error: "Method Not Allowed"}), 405);
        }

        // Block requests not from your portfolio
        const origin = request.headers.get("Origin") || "";
        if (!origin.startsWith(ALLOWED_ORIGIN)) {
            return corsResponse(JSON.stringify({error: "Forbidden"}), 403);
        }

        try {
            const body = await request.json();

            const upstream = await fetch(`${env.AI_BASE_URL}/chat/completions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${env.AI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await upstream.json();
            return corsResponse(JSON.stringify(data), upstream.status);

        } catch (err) {
            return corsResponse(JSON.stringify({error: "Proxy error", detail: String(err)}), 500);
        }
    }
};

function corsResponse(body, status) {
    return new Response(body, {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}