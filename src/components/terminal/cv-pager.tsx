import {useEffect, useRef, useState} from "react";
import type {KeyboardEvent} from "react";
import Markdown from "react-markdown";
import cx from "classnames";
import {CV_MARKDOWN} from "../../data/cv-content";
import {downloadCV} from "../../config/helper";
import styles from "./terminal.module.css";
import cv from "./cv-pager.module.css";

interface CvPagerProps {
    onQuit: () => void;
}

const MIN_FONT = 14;
const MAX_FONT = 22;
const SCROLL_STEP = 48;

/**
 * `less cv.md`: the CV rendered from Markdown, taking over the terminal like a
 * pager. q / Esc quits; j / k / space / b / g / G scroll.
 */
export function CvPager({onQuit}: Readonly<CvPagerProps>) {
    const [fontSize, setFontSize] = useState(17);
    const [atEnd, setAtEnd] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.focus();
    }, []);

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const el = scrollRef.current;
        if (!el || e.ctrlKey || e.metaKey || e.altKey) return;
        const page = el.clientHeight - SCROLL_STEP;
        const actions: Record<string, () => void> = {
            q: onQuit,
            Escape: onQuit,
            j: () => el.scrollBy({top: SCROLL_STEP}),
            k: () => el.scrollBy({top: -SCROLL_STEP}),
            " ": () => el.scrollBy({top: page}),
            b: () => el.scrollBy({top: -page}),
            g: () => el.scrollTo({top: 0}),
            G: () => el.scrollTo({top: el.scrollHeight}),
        };
        const action = actions[e.key];
        if (action) {
            e.preventDefault();
            action();
        }
    };

    const onScroll = () => {
        const el = scrollRef.current;
        if (el) setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
    };

    return (
        <div className={cv.pager}>
            <div className={cv.toolbar}>
                <button type="button" className={styles.btn} onClick={onQuit}>q <span className={styles.muted}>quit</span></button>
                <span className={cv.tools}>
                    <button type="button" className={styles.btn} onClick={() => setFontSize((s) => Math.max(MIN_FONT, s - 1))} aria-label="Smaller text">A−</button>
                    <span role="status" className={styles.muted}>{fontSize}px</span>
                    <button type="button" className={styles.btn} onClick={() => setFontSize((s) => Math.min(MAX_FONT, s + 1))} aria-label="Larger text">A+</button>
                    <button type="button" className={cx(styles.btn, styles.btnSolid)} onClick={downloadCV}>↓ Download CV</button>
                </span>
            </div>

            <div
                ref={scrollRef}
                className={cv.scroll}
                tabIndex={0}
                role="document"
                aria-label="CV — press q to quit"
                onKeyDown={onKeyDown}
                onScroll={onScroll}
            >
                <article className={cx(styles.fadeUp, cv.md)} style={{fontSize}}>
                    <Markdown
                        components={{
                            a: ({href, children}) => (
                                <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{children}</a>
                            ),
                        }}
                    >
                        {CV_MARKDOWN}
                    </Markdown>
                </article>
            </div>

            <div className={cv.status}>
                <span>cv.md {atEnd ? "(END)" : ":"}</span>
                <span className={cv.statusHint}>q quit · j/k line · space/b page · g/G top/end</span>
            </div>
        </div>
    );
}
