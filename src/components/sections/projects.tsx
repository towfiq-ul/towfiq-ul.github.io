import {useEffect, useState} from "react";
import type {CSSProperties} from "react";
import cx from "classnames";
import styles from "../terminal/terminal.module.css";
import projectStyles from "./projects.module.css";
import {CommandBlock} from "../terminal/command-block";
import {projects} from "../../data/project-list";

const TECH_PREVIEW = 4;
const SKELETON_COUNT = 6;
const LOAD_DELAY_MS = 700;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function linkLabel(url: string) {
    if (url.includes("github.com")) return "View on GitHub";
    if (url.includes("play.google.com")) return "View on Google Play";
    if (url.includes("chromewebstore.google.com")) return "View on Chrome Web Store";
    return "Visit Website";
}

export function Projects() {
    const [showAll, setShowAll] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [techOpen, setTechOpen] = useState<Record<string, boolean>>({});
    const featured = projects.filter((p) => p.featured);
    const list = showAll && !isLoading ? projects : featured;

    useEffect(() => {
        if (!isLoading) return;
        const timer = setTimeout(() => setIsLoading(false), LOAD_DELAY_MS);
        return () => clearTimeout(timer);
    }, [isLoading]);

    const toggleAll = () => {
        if (showAll) {
            setShowAll(false);
            return;
        }
        setShowAll(true);
        setIsLoading(true);
    };

    return (
        <CommandBlock
            sectionId="project"
            title="Featured Projects"
            subtitle="Key projects showcasing expertise in enterprise software development"
        >
            <div className={styles.cols} style={{"--min": "340px"} as CSSProperties}>
                {list.map((project, i) => {
                    const isTechOpen = !!techOpen[project.name];
                    const tech = isTechOpen ? project.technologies : project.technologies.slice(0, TECH_PREVIEW);
                    const hiddenTech = project.technologies.length - TECH_PREVIEW;
                    return (
                        <article
                            key={project.name}
                            className={cx(styles.box, styles.fadeUp, projectStyles.card)}
                            style={{animationDelay: `${(i % 9) * 0.05}s`}}
                        >
                            <div className={projectStyles.cardBar}>
                                <span>drwxr-xr-x</span><span>{slug(project.name)}/</span>
                            </div>
                            <div className={projectStyles.cardBody}>
                                <h3 className={styles.h3} style={{fontSize: 19}}>{project.name}</h3>
                                <p className={cx(styles.c2, projectStyles.p)}># {project.client}</p>
                                <p className={cx(styles.muted, projectStyles.p)}>{project.description}</p>
                                {project.highlights.length > 0 && (
                                    <ul className={styles.list} style={{gap: 4}}>
                                        {project.highlights.slice(0, 3).map((h) => (
                                            <li key={h} className={styles.bullet}><span className={styles.c3}>-</span><span>{h}</span></li>
                                        ))}
                                    </ul>
                                )}
                                <div className={projectStyles.tags}>
                                    {tech.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
                                    {hiddenTech > 0 && !isTechOpen && (
                                        <button
                                            type="button"
                                            className={cx(styles.btn, styles.btnDashed, projectStyles.moreTech)}
                                            aria-label={`Show ${hiddenTech} more technologies`}
                                            onClick={() => setTechOpen((prev) => ({...prev, [project.name]: true}))}
                                        >
                                            +{hiddenTech}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {(project.link || project.githubLink) && (
                                <div className={projectStyles.cardLinks}>
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.linkOut}>→ {linkLabel(project.link)}</a>
                                    )}
                                    {project.githubLink && (
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className={styles.linkOut}>→ View on GitHub</a>
                                    )}
                                </div>
                            )}
                        </article>
                    );
                })}
                {isLoading && Array.from({length: SKELETON_COUNT}, (_, i) => (
                    <div key={i} className={cx(styles.box, projectStyles.skeletonCard)} aria-hidden="true">
                        {["50%", "70%", "45%", "100%", "92%", "80%", "68%"].map((w, j) => (
                            <div key={j} className={styles.skeleton} style={{height: j === 1 ? 18 : 12, width: w}}/>
                        ))}
                    </div>
                ))}
            </div>

            <div className={projectStyles.footer}>
                <span role="status" className={cx(styles.muted, isLoading && styles.spinner)}>
                    {isLoading ? `fetching ${projects.length} entries from projects/ …` : `total ${list.length} of ${projects.length}`}
                </span>
                {projects.length > featured.length && (
                    <button type="button" className={cx(styles.btn, styles.btnAccent)} onClick={toggleAll} disabled={isLoading}>
                        $ {showAll ? "ls projects/ --featured  (Show Featured Only)" : `ls projects/ --all  (View All ${projects.length} Projects)`}
                    </button>
                )}
            </div>
        </CommandBlock>
    );
}
