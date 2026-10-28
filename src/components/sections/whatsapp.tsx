import styles from "../terminal/terminal.module.css";
import {personalInfo} from "../../data/portfolio-data";

const MESSAGE = "Hello Towfiqul! I visited your portfolio and would like to connect with you.";

/** wa.me opens the WhatsApp app when installed, otherwise WhatsApp Web. */
export const WHATSAPP_URL = `https://wa.me/${personalInfo.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(MESSAGE)}`;

/** Opens the chat directly. Call from a click/submit so popup blockers allow it. */
export const openWhatsApp = () => globalThis.open?.(WHATSAPP_URL, "_blank", "noopener,noreferrer");

/** Output of `whatsapp`: confirms the hand-off, with a fallback link if a popup blocker stopped it. */
export function WhatsApp() {
    return (
        <div className={styles.fadeUp} style={{display: "flex", flexDirection: "column", gap: 2}}>
            <span className={styles.muted}>opening WhatsApp chat with Towfiqul… (app if installed, otherwise WhatsApp Web)</span>
            <span className={styles.muted}>
                didn't open?{" "}
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.linkOut}>→ Start Chat on WhatsApp ↗</a>
            </span>
        </div>
    );
}
