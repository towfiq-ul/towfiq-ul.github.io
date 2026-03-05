export const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({behavior: "smooth"});
    }
};

export const ACTION_TAG_EMAIL_ME = "[ACTION:EMAIL_ME]";
export const ACTION_TAG_WHATSAPP_ME = "[ACTION:WHATSAPP_ME]";
export const TRIGGER_EMAIL_ME = 'TRIGGER_EMAIL';
export const TRIGGER_WHATSAPP_ME = 'TRIGGER_WHATSAPP';
export const TRIGGER_AI_CHAT = 'TRIGGER_AI_CHAT';
