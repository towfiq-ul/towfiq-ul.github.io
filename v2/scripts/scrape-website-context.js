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
        'X-Set-Cookie': `x-trace-id=towfiq-ul-ai-${TRACE_ID}; domain=${TARGET_URL}`,
    });
}

async function syncWebsiteContext() {
    console.log(`🔍 Scraping portfolio for AI context from ${TARGET_URL}...`);

    try {
        const response = await fetch(SCRAPPER_URL, {
            method: 'GET',
            headers: getHeaders()
        });

        const allHeaders = Object.fromEntries(response.headers.entries());
        console.log('Headers: ', allHeaders)
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}. Message: ${response.statusText}`);


        const markdown = await response.text();
        console.log(`Markdown: ${markdown}, Response: `, response);
        if (markdown.length < 500 && retryCount < maxRetryCount) {
            retryCount += 1;
            return syncWebsiteContext();
        }
        retryCount = 0;

        const dir = path.dirname(OUTPUT_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});

        fs.writeFileSync(OUTPUT_PATH, markdown, 'utf8');

        console.log(`✅ Success! Context saved to: ${OUTPUT_PATH}`);
        console.log(`📏 Content Length: ${markdown.length} characters`);
    } catch (error) {
        console.error("❌ Failed to sync context:", error);
        process.exit(1);
    }
}

syncWebsiteContext().then();