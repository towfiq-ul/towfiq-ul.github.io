let retry = 0;
let maxRetryCount = import.meta.env.VITE_SCRAPPER_RETRY_MAX_COUNT || 1;
const maxTimeout = 10;
const SCRAPPER_DOMAIN = import.meta.env.VITE_SCRAPPER_DOMAIN || '';
const SCRAPPER_WEBSITE = import.meta.env.VITE_AI_CONTEXT_DATA_URL || window.location.href;
const SCRAPPER_URL = SCRAPPER_DOMAIN + SCRAPPER_WEBSITE;


function getHeaders(timeout: number) {

    return new Headers({
        'DNT': '1',
        'X-Cache-Tolerance': '0',
        'X-Engine': 'browser',
        'X-No-Cache': 'true',
        'X-Remove-Selector': 'header, .class, #id',
        'X-Retain-Images': 'none',
        'X-Return-Format': 'markdown',
        'X-Timeout': `${timeout}`,
    });
}

const FetchWebpageAsMarkdown = async (timeout: number = 5) => {
    try {
        const scrapper_key = import.meta.env.VITE_SCRAPPER_TOKEN || '';
        let headers = getHeaders(timeout);

        let response = await fetch(SCRAPPER_URL, {
            method: "GET",
            headers: headers
        });

        if (!response.ok && response.status === 451) {
            headers.append('Authorization', `Bearer ${scrapper_key}`);
            response = await fetch(SCRAPPER_URL, {
                method: 'GET',
                headers: headers
            });
        }

        if (!response.ok) {
            console.error("Failed to fetch context data");
            return "";
        }


        const responseText = await response.text();
        console.log("Response: " + responseText);

        if (responseText.length < 500 && retry < maxRetryCount) {
            retry += 1
            return FetchWebpageAsMarkdown(maxTimeout);
        }
        retry = 0;

        return responseText;
    } catch (error) {
        console.error("Scraping Error:", error);
        return "";
    }
};