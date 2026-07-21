#!/bin/bash

# 1. Install Wrangler
#npm install -g wrangler

# 2. Login
#wrangler login

# 3. From the workers/ folder — set secrets (never in code)
cd workers
#wrangler secret put AI_API_KEY
# → paste your ZhipuAI key when prompted

#wrangler secret put AI_BASE_URL
# → paste https://open.bigmodel.cn/api/paas/v4

# 4. Deploy
wrangler deploy

# 5. Copy the printed *.workers.dev URL into VITE_AI_PROXY_URL in .env