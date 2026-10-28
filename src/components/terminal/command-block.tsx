import {useId} from "react";
import type {CSSProperties, ReactNode} from "react";
import styles from "./terminal.module.css";

interface CommandBlockProps {
    sectionId: string;
    title: string;
    subtitle?: string;
    children: ReactNode;
}

/**
 * A section's output, printed into the session when its command runs (the
 * session renders the prompt line above it). Items fade in on mount.
 */
export function CommandBlock({sectionId, title, subtitle, children}: Readonly<CommandBlockProps>) {
    const titleId = useId();

    return (
        <section className={styles.block} data-section={sectionId} aria-labelledby={titleId}>
            <h2 id={titleId} className={styles.h2}>
                <span className={styles.muted}># </span>{title}
            </h2>
            {subtitle && <p className={styles.sub}>&gt; {subtitle}</p>}
            {children}
        </section>
    );
}

/** Stagger delay for the n-th item inside a section's output. */
export const stagger = (index: number, step = 0.05): CSSProperties => ({animationDelay: `${0.1 + index * step}s`});
