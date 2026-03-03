import * as pdfjs from 'pdfjs-dist';

const FILE_PATHS = import.meta.env.VITE_CV_FILE_PATHS;

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const parsePdfToText = async (): Promise<string> => {
    try {
        let filePaths = getFilePaths()
        let fullText = "";
        for (const filePath of filePaths) {
            const loadingTask = pdfjs.getDocument(filePath);

            try {
                const pdf = await loadingTask.promise;

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();

                    const pageText = textContent.items
                        .map((item: any) => item.str)
                        .join(" ");

                    fullText += pageText + "\n";
                    page.cleanup();
                }
                await pdf.destroy();
            } catch (error) {
                console.error(`Error processing PDF at ${filePath}:`, error);
            }
        }

        return fullText;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        return "";
    }
};

function getFilePaths() {
    let filePathsWithComma = import.meta.env.VITE_CV_FILE_PATHS
    return filePathsWithComma.split(",");
}

let ParsedContext = parsePdfToText()


export default ParsedContext;