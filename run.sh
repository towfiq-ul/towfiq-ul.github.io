#!/bin/bash
# Local dev runner.
#
#   ./run.sh          Starts the AI proxy Worker locally (wrangler dev, reads
#                      v2/workers/.dev.vars for secrets) and the frontend
#                      pointed at that local worker — a fully local loop with
#                      no dependency on the deployed Cloudflare Worker.
#
#   ./run.sh prod      Starts only the frontend, pointed at the deployed
#                      production Worker instead of a local one. Useful for
#                      testing frontend changes against real prod behavior
#                      (rate limiting, upstream latency, etc.) without
#                      running wrangler dev.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKER_PORT=8787
PROD_PROXY_URL="https://portfolio-ai-proxy.towfiq-ul.workers.dev"

WRANGLER_PID=""
cleanup() {
    if [[ -n "$WRANGLER_PID" ]]; then
        kill "$WRANGLER_PID" 2>/dev/null || true
        wait "$WRANGLER_PID" 2>/dev/null || true
    fi
}
trap cleanup EXIT INT TERM

if [[ "${1:-}" == "prod" ]]; then
    echo "Frontend only — AI chat will call the deployed Worker at $PROD_PROXY_URL"
    VITE_AI_PROXY_URL="$PROD_PROXY_URL" npm --prefix "$ROOT_DIR/v2" run start
    exit 0
fi

if [[ ! -f "$ROOT_DIR/v2/workers/.dev.vars" ]]; then
    echo "Missing v2/workers/.dev.vars (needs AI_API_KEY and AI_BASE_URL for local wrangler dev)." >&2
    echo "Copy the values you'd otherwise pass to 'wrangler secret put' into that file, or run './run.sh prod' to skip the local worker." >&2
    exit 1
fi

echo "Starting AI proxy Worker locally on http://localhost:$WORKER_PORT ..."
(cd "$ROOT_DIR/v2/workers" && npx wrangler dev --port "$WORKER_PORT") &
WRANGLER_PID=$!

echo "Starting frontend, pointed at the local worker..."
VITE_AI_PROXY_URL="http://localhost:$WORKER_PORT" npm --prefix "$ROOT_DIR/v2" run start
