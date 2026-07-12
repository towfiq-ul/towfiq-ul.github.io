import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {randomUUID} from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRACE_ID = `${Date.now()}-${randomUUID()}`;
const OUTPUT_PATH = path.resolve(__dirname, '../public/WEBSITE_CONTEXT.md');
const TARGET_URL = process.env.VITE_AI_CONTEXT_DATA_URL || "https://towfiq-ul.github.io/";
const SCRAPPER_URL = `${process.env.VITE_SCRAPPER_DOMAIN}${TARGET_URL}`;
const SCRAPPER_TOKEN = process.env.VITE_SCRAPPER_TOKEN || '';
const maxRetryCount = parseInt(process.env.VITE_SCRAPPER_RETRY_MAX_COUNT) || 0;
const RETRY_BACKOFF_BASE_MS = 1000;
let retryCount = 0;

function getHeaders() {
    return new Headers({
        'DNT': '1',
        'X-Engine': 'browser',
        'X-Retain-Images': 'none',
        'Authorization': `Bearer ${SCRAPPER_TOKEN}`,
        'X-Return-Format': 'markdown',
        'X-No-Cache': 'true',
        'X-Timeout': '30',
        'X-Cache-Tolerance': '10',
        // Strips the nav chrome (menu links repeated site-wide) so it doesn't
        // dilute the AI chat's context budget with non-content boilerplate.
        'X-Remove-Selector': 'nav',
        'X-Set-Cookie': `x-trace-id=towfiq-ul-ai-${TRACE_ID}; domain=${TARGET_URL}`,
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function syncWebsiteContext() {
    if (!SCRAPPER_TOKEN) {
        console.error('❌ VITE_SCRAPPER_TOKEN is not set — aborting before making a request.');
        process.exit(1);
    }

    console.log(`🔍 Scraping portfolio for AI context from ${TARGET_URL}...`);

    try {
        const response = await fetch(SCRAPPER_URL, {
            method: 'GET',
            headers: getHeaders()
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}. Message: ${response.statusText}`);

        const markdown = await response.text();
        console.log(`📏 Received ${markdown.length} characters`);
        if (markdown.length < 500 && retryCount < maxRetryCount) {
            retryCount += 1;
            const delay = RETRY_BACKOFF_BASE_MS * 2 ** (retryCount - 1);
            console.log(`⏳ Content too short, retrying in ${delay}ms (attempt ${retryCount}/${maxRetryCount})...`);
            await sleep(delay);
            return syncWebsiteContext();
        }
        retryCount = 0;

        const dir = path.dirname(OUTPUT_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});

        fs.writeFileSync(OUTPUT_PATH, markdown, 'utf8');

        console.log(`✅ Success! Context saved to: ${OUTPUT_PATH}`);
    } catch (error) {
        console.error("❌ Failed to sync context:", error);
        process.exit(1);
    }
}

syncWebsiteContext().then();