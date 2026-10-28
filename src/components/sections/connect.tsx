import type {CSSProperties} from "react";
import cx from "classnames";
import styles from "../terminal/terminal.module.css";
import {CommandBlock, stagger} from "../terminal/command-block";
import {personalInfo} from "../../data/portfolio-data";

interface ConnectProps {
    onEmailMe: () => void;
}

export function Connect({onEmailMe}: Readonly<ConnectProps>) {
    const options = [
        {label: "LinkedIn", href: personalInfo.linkedin, external: true},
        {label: "GitHub", href: personalInfo.github, external: true},
        {label: "Call Me", href: `tel:${personalInfo.phone}`, external: false},
        {label: "Stack Overflow", href: personalInfo.stackoverflow, external: true},
    ];

    return (
        <CommandBlock sectionId="contact" title="Let's Connect">
            <div className={styles.box} style={{borderColor: "var(--t-c1)", display: "flex", flexDirection: "column", gap: 14}}>
                <p className={styles.muted} style={{margin: 0, maxWidth: 640}}>
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                </p>
                <p style={{margin: "6px 0 0"}}>? Select an option:</p>
                <div className={styles.cols} style={{"--min": "170px", gap: 10} as CSSProperties}>
                    <button type="button" className={cx(styles.btn, styles.item)} style={{...stagger(0, 0.06), textAlign: "left", fontWeight: 700, minHeight: 48}} onClick={onEmailMe}>
                        <span className={styles.muted}>[1]</span> Email Me
                    </button>
                    {options.map((option, i) => (
                        <a
                            key={option.label}
                            href={option.href}
                            {...(option.external ? {target: "_blank", rel: "noopener noreferrer"} : {})}
                            className={cx(styles.btn, styles.item)}
                            style={{...stagger(i + 1, 0.06), display: "flex", alignItems: "center", gap: 8, fontWeight: 700, minHeight: 48, boxSizing: "border-box"}}
                        >
                            <span className={styles.muted}>[{i + 2}]</span> {option.label}
                        </a>
                    ))}
                </div>
            </div>
        </CommandBlock>
    );
}
