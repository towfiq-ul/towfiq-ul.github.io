export const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({behavior: "smooth"});
    }
};

export const ACTION_TAG_EMAIL_ME = "[ACTION:EMAIL_ME]";
export const ACTION_TAG_WHATSAPP_ME = "[ACTION:WHATSAPP_ME]";
export const ACTION_TAG_DOWNLOAD_CV = "[ACTION:DOWNLOAD_CV]";
export const TRIGGER_EMAIL_ME = 'TRIGGER_EMAIL';
export const TRIGGER_WHATSAPP_ME = 'TRIGGER_WHATSAPP';
export const TRIGGER_DOWNLOAD_CV = 'TRIGGER_DOWNLOAD_CV';
export const TRIGGER_AI_CHAT = 'TRIGGER_AI_CHAT';
export const TRIGGER_TOGGLE_THEME = 'TRIGGER_TOGGLE_THEME';

export const CV_PDF_PATH = '/Towfiqul_Islam_CV.pdf';

/** Saves the CV PDF (served from public/) to the visitor's device. */
export const downloadCV = () => {
    const link = document.createElement('a');
    link.href = CV_PDF_PATH;
    link.download = 'Towfiqul_Islam_CV.pdf';
    link.click();
};
