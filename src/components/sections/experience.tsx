import {useState} from "react";
import cx from "classnames";
import styles from "../terminal/terminal.module.css";
import {CommandBlock, stagger} from "../terminal/command-block";
import {workExperience} from "../../data/portfolio-data";
import {calculateTotalExperience, formatExperience, formatJobDurationYears} from "../../utils/date-utils";

const PREVIEW_COUNT = 3;

/** Stable, decorative 7-char "commit hash" for a job. */
function commitHash(seed: string) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
    return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

export function Experience() {
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});
    const totalExp = calculateTotalExperience(workExperience);

    return (
        <CommandBlock
            sectionId="experience"
            title="Work Experience"
            subtitle={`${formatExperience(totalExp.years, totalExp.months)} of Professional Software Development`}
        >
            <ol className={styles.list} style={{gap: 14}}>
                {workExperience.map((job, i) => {
                    const hash = commitHash(job.company + job.period);
                    const isExpanded = !!expanded[i];
                    const responsibilities = isExpanded ? job.responsibilities : job.responsibilities.slice(0, PREVIEW_COUNT);
                    const hiddenCount = job.responsibilities.length - PREVIEW_COUNT;
                    const refs = i === 0 ? "(HEAD -> main)" : i === workExperience.length - 1 ? "(tag: first-commit)" : "";

                    return (
                        <li key={hash} className={cx(styles.box, styles.item)} style={stagger(i, 0.08)}>
                            <div className={styles.c4}>commit {hash} <span className={styles.c2}>{refs}</span></div>
                            <div><span className={styles.muted}>Author:</span> Towfiqul Islam &lt;<span className={styles.c1}>{job.company}</span> · {job.location}&gt;</div>
                            <div>
                                <span className={styles.muted}>Date:</span> {job.period}{" "}
                                <span className={styles.muted}>({formatJobDurationYears(job.period)})</span>{" "}
                                <span className={styles.c3}>[{job.type}]</span>
                            </div>
                            <div style={{paddingLeft: "4ch", marginTop: 10, display: "flex", flexDirection: "column", gap: 8}}>
                                <h3 className={styles.h3} style={{fontSize: 19}}>{job.title}</h3>
                                <p className={styles.muted} style={{margin: 0}}>{job.description}</p>
                                {responsibilities.length > 0 && (
                                    <ul className={styles.list} style={{gap: 4}}>
                                        {responsibilities.map((resp) => (
                                            <li key={resp} className={styles.bullet}>
                                                <span className={styles.c3}>+</span><span>{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {hiddenCount > 0 && (
                                    <button
                                        type="button"
                                        className={styles.btn}
                                        style={{alignSelf: "flex-start"}}
                                        aria-expanded={isExpanded}
                                        onClick={() => setExpanded((prev) => ({...prev, [i]: !prev[i]}))}
                                    >
                                        {isExpanded ? "$ git show --stat  (collapse)" : `$ git show ${hash}  (+${hiddenCount} more)`}
                                    </button>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </CommandBlock>
    );
}
