let retry = 0;
const fetchWebpageAsMarkdown = async () => {
    try {
        const url = import.meta.env.VITE_SCRAPPER_DOMAIN + import.meta.env.VITE_AI_CONTEXT_DATA_URL;

        const response = await fetch(url);

        if (!response.ok) {
            console.error("Failed to fetch context data");
            return "";
        }

        const rawHtml = await response.text();

        if (rawHtml.length < 500 && retry < 3) {
            retry += 1
            return fetchWebpageAsMarkdown();
        }

        return cleanHtmlToText(rawHtml);
    } catch (error) {
        console.error("Scraping Error:", error);
        return "";
    }
};

const cleanHtmlToText = (html: string): string => {
    retry = 0;
    if (!html) return "";

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const noiseSelectors = ['script', 'style', 'nav', 'footer', 'header', 'noscript', 'iframe', 'button'];
    noiseSelectors.forEach(selector => {
        doc.querySelectorAll(selector).forEach(el => el.remove());
    });

    const mainContent = doc.querySelector('main') ||
        doc.querySelector('article') ||
        doc.querySelector('#content') ||
        doc.body;

    return (mainContent as HTMLElement).innerText
        .replace(/\s\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
};

let ScrappedContext = fetchWebpageAsMarkdown()


export default ScrappedContext;