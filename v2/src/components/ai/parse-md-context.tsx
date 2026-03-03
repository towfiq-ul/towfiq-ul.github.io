export const ParsedMdContext = async (filePath: string): Promise<string> => {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            console.error(`Failed to fetch ${filePath}`);
            return "";
        }
        return await response.text();
    } catch (error) {
        console.error("Error parsing Markdown:", error);
        return "";
    }
};