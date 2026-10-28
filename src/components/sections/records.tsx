import type {CSSProperties} from "react";
import cx from "classnames";
import styles from "../terminal/terminal.module.css";
import {CommandBlock, stagger} from "../terminal/command-block";
import {awards, certifications, education, openSource, writing} from "../../data/portfolio-data";

/* The smaller, list-shaped sections: Writing, Education, Awards, Open Source, Certifications. */

export function Writing() {
    return (
        <CommandBlock
            sectionId="writing"
            title="Writing"
            subtitle="Engineering deep-dives on real systems — debugging, hardening, and lessons learned"
        >
            <div className={styles.cols} style={{"--min": "420px"} as CSSProperties}>
                {writing.map((article, i) => (
                    <article key={article.link} className={cx(styles.box, styles.item)} style={stagger(i, 0.1)}>
                        <div className={styles.muted}>{"{"}</div>
                        <div style={{paddingLeft: "2ch", display: "flex", flexDirection: "column", gap: 6}}>
                            <div>
                                <span className={styles.c2}>"title"</span>:{" "}
                                <h3 className={styles.h3} style={{display: "inline", fontSize: 18}}>"{article.title}"</h3>,
                            </div>
                            <div><span className={styles.c2}>"platform"</span>: <span className={styles.c3}>"{article.platform}"</span>,</div>
                            <div><span className={styles.c2}>"description"</span>: <span className={styles.muted}>"{article.description}"</span>,</div>
                            <div>
                                <span className={styles.c2}>"link"</span>:{" "}
                                <a href={article.link} target="_blank" rel="noopener noreferrer" className={styles.linkOut}>"Read Article ↗"</a>
                            </div>
                        </div>
                        <div className={styles.muted}>{"}"}</div>
                    </article>
                ))}
            </div>
        </CommandBlock>
    );
}

export function Education() {
    return (
        <CommandBlock sectionId="education" title="Education">
            <div className={styles.cols}>
                {education.map((edu, i) => (
                    <div key={edu.degree} className={cx(styles.box, styles.item)} style={stagger(i, 0.1)}>
                        <div>
                            <span className={styles.muted}>- </span><span className={styles.c2}>degree</span>:{" "}
                            <h3 className={styles.h3} style={{display: "inline"}}>{edu.degree}</h3>
                        </div>
                        <div style={{paddingLeft: "2ch"}}><span className={styles.c2}>institution</span>: {edu.institution}</div>
                        <div style={{paddingLeft: "2ch"}}><span className={styles.c2}>period</span>: <span className={styles.c4}>{edu.period}</span></div>
                    </div>
                ))}
            </div>
        </CommandBlock>
    );
}

export function Awards() {
    return (
        <CommandBlock sectionId="awards" title="Awards & Achievements" subtitle="Recognition in competitive programming and coaching">
            <div className={styles.rows}>
                {awards.map((award, i) => (
                    <div key={award.title} className={cx(styles.row, styles.item)} style={stagger(i, 0.08)}>
                        <span className={styles.c4}>[{i + 1}]</span>
                        <span style={{flex: "1 1 300px", display: "flex", flexDirection: "column", gap: 2}}>
                            <h3 className={styles.h3}>{award.title}</h3>
                            <span className={styles.muted}>{award.description}</span>
                        </span>
                        {award.link && (
                            <a href={award.link} target="_blank" rel="noopener noreferrer" className={styles.linkOut} style={{alignSelf: "center"}}>View Details ↗</a>
                        )}
                    </div>
                ))}
            </div>
        </CommandBlock>
    );
}

export function OpenSource() {
    return (
        <CommandBlock sectionId="open-source" title="Open Source Contributions" subtitle="Contributing to the developer community">
            <div className={styles.cols} style={{"--min": "420px"} as CSSProperties}>
                {openSource.map((repo, i) => {
                    const statusColor = repo.status === "Merged" ? "var(--t-c2)" : "var(--t-c3)";
                    return (
                        <div key={repo.link} className={cx(styles.box, styles.item)} style={{...stagger(i), display: "flex", flexDirection: "column", gap: 8, fontSize: 15}}>
                            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "6px 12px"}}>
                                <h3 className={cx(styles.h3, styles.c2)}>{repo.project}</h3>
                                <span className={styles.tag} style={{borderColor: statusColor, color: statusColor}}>{repo.status}</span>
                            </div>
                            <p className={styles.muted} style={{margin: 0}}>{repo.description}</p>
                            <p className={styles.bold} style={{margin: 0}}>{repo.contribution}</p>
                            <div style={{display: "flex", flexWrap: "wrap", gap: "4px 16px"}}>
                                <a href={repo.link} target="_blank" rel="noopener noreferrer" className={styles.linkOut}>→ View on GitHub</a>
                                {repo.storeLink && (
                                    <a href={repo.storeLink} target="_blank" rel="noopener noreferrer" className={styles.linkOut}>→ Chrome Web Store</a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </CommandBlock>
    );
}

export function Certifications() {
    return (
        <CommandBlock sectionId="certifications" title="Certifications" subtitle="Verified credentials from HackerRank and Coursera">
            <div className={styles.rows}>
                {certifications.map((cert, i) => (
                    <div key={cert.link} className={cx(styles.row, styles.item)} style={stagger(i)}>
                        <span className={styles.c3}>[✓]</span>
                        <h3 className={styles.h3} style={{fontSize: 16}}>{cert.title}</h3>
                        <span className={styles.muted}>— {cert.issuer}</span>
                        {cert.date && <span className={styles.c4}>{cert.date}</span>}
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" className={styles.linkOut} style={{marginLeft: "auto"}}>Verify Certificate ↗</a>
                    </div>
                ))}
            </div>
        </CommandBlock>
    );
}
