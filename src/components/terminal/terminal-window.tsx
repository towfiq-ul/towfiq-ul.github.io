import {useEffect} from "react";
import type {ReactNode, Ref} from "react";
import styles from "./terminal.module.css";
import {MatrixRain} from "./matrix-rain";
import {useColorScheme} from "../../hooks/use-color-scheme";
import {TRIGGER_TOGGLE_THEME} from "../../config/helper";

interface TerminalWindowProps {
    title: string;
    sidebar?: ReactNode;
    footer?: ReactNode;
    mainRef?: Ref<HTMLElement>;
    /** Full-body view drawn over the session (the `less` pager). */
    overlay?: ReactNode;
    children: ReactNode;
}

/**
 * The bash window the whole site lives in: fixed to the viewport (16px gap top
 * and bottom, 10px sides) over the matrix-rain backdrop. The page never scrolls — only the
 * session scrollback (`main`) does. Footer holds the prompt.
 */
export function TerminalWindow({title, sidebar, footer, mainRef, overlay, children}: Readonly<TerminalWindowProps>) {
    const {resolvedScheme, setColorScheme} = useColorScheme();
    const nextScheme = resolvedScheme === "dark" ? "light" : "dark";

    // The session's `theme` command toggles through this event.
    useEffect(() => {
        const toggle = () => setColorScheme(nextScheme);
        globalThis.addEventListener?.(TRIGGER_TOGGLE_THEME, toggle);
        return () => globalThis.removeEventListener?.(TRIGGER_TOGGLE_THEME, toggle);
    }, [nextScheme, setColorScheme]);

    return (
        <div className={styles.page}>
            <MatrixRain/>
            <div className={styles.frame}>
                <div className={styles.zoom}>
                    <div className={styles.window}>
                        <div className={styles.titleBar}>
                            <span className={styles.dots} aria-hidden="true"><span/><span/><span/></span>
                            <span className={styles.windowTitle}>{title}</span>
                            <span className={styles.titleActions}>
                                <button
                                    type="button"
                                    className={styles.btn}
                                    onClick={() => setColorScheme(nextScheme)}
                                    aria-label={`Switch to ${nextScheme} theme`}
                                >
                                    theme: {resolvedScheme}
                                </button>
                            </span>
                        </div>

                        <div className={styles.body}>
                            {sidebar}
                            <main ref={mainRef} className={styles.main} tabIndex={-1}>{children}</main>
                            {overlay}
                        </div>

                        {footer}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function PromptPrefix({path = "~"}: Readonly<{ path?: string }>) {
    return (
        <>
            <span className={styles.user}>towfiq@portfolio</span>:<span className={styles.path}>{path}</span>$
        </>
    );
}
