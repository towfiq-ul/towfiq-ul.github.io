import {useEffect, useId, useRef, useState} from "react";
import type {CSSProperties} from "react";
import cx from "classnames";
import styles from "../terminal/terminal.module.css";
import skillStyles from "./skills.module.css";
import {CommandBlock, stagger} from "../terminal/command-block";
import {skills} from "../../data/portfolio-data";
import {calculateLocationData, calculateTechExperience, calculateWorkTypeData} from "../../utils/experience-stats";
import type {StatSlice} from "../../utils/experience-stats";

const PREVIEW_COUNT = 3;
const BAR_SCALE_YEARS = 9;
const SLICE_COLORS = ["var(--t-c1)", "var(--t-c2)", "var(--t-c4)"];

const branch = (last: boolean) => (last ? "└── " : "├── ");
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const truncate = (s: string) => (s.length > 20 ? s.substring(0, 20) + "..." : s);

export function Skills() {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const dialogTitleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (openCategory && !dialog.open) dialog.showModal();
        if (!openCategory && dialog.open) dialog.close();
    }, [openCategory]);

    const techYears = calculateTechExperience();
    const distributions = [
        {title: "Work Type Distribution", data: calculateWorkTypeData()},
        {title: "Location Distribution", data: calculateLocationData()},
    ];
    const openSkills = openCategory ? skills[openCategory as keyof typeof skills] : [];

    return (
        <CommandBlock sectionId="skills" title="Technical Skills">
            <div className={styles.cols} style={{"--min": "270px"} as CSSProperties}>
                {Object.entries(skills).map(([category, list], i) => {
                    const isExpanded = !!expanded[category];
                    const shown = isExpanded ? list : list.slice(0, PREVIEW_COUNT);
                    const hasMore = list.length > PREVIEW_COUNT && !isExpanded;
                    return (
                        <div key={category} className={cx(styles.box, styles.item, skillStyles.card)} style={stagger(i, 0.04)}>
                            <div className={skillStyles.cardHead}>
                                <h3 className={cx(styles.h3, styles.c2)}>{category}/</h3>
                                <span className={styles.muted}>{list.length} skills</span>
                            </div>
                            <ul className={skillStyles.tree}>
                                {shown.map((skill, j) => (
                                    <li key={skill}>
                                        <span className={styles.muted}>{branch(j === shown.length - 1 && !hasMore)}</span>
                                        {isExpanded ? skill : truncate(skill)}
                                    </li>
                                ))}
                            </ul>
                            <div className={skillStyles.actions}>
                                {hasMore && (
                                    <button
                                        type="button"
                                        className={cx(styles.btn, styles.btnDashed)}
                                        onClick={() => setExpanded((prev) => ({...prev, [category]: true}))}
                                    >
                                        └── +{list.length - PREVIEW_COUNT} more
                                    </button>
                                )}
                                <button type="button" className={cx(styles.btn, styles.c1)} onClick={() => setOpenCategory(category)}>
                                    open ↗
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.cols} style={{"--min": "420px"} as CSSProperties}>
                <div className={cx(styles.box, styles.item, skillStyles.chart)} style={stagger(13, 0.04)}>
                    <h3 className={cx(styles.h3, styles.c2)}>Experience by Technology (Years)</h3>
                    {techYears.map((t, i) => (
                        <div key={t.name} className={skillStyles.barRow}>
                            <span>{t.name}</span>
                            <span className={styles.barTrack}>
                                <span
                                    className={styles.bar}
                                    style={{width: `${(t.years / BAR_SCALE_YEARS) * 100}%`, "--bar": i % 2 ? "var(--t-c2)" : "var(--t-c1)"} as CSSProperties}
                                />
                            </span>
                            <span className={skillStyles.barValue}>{t.years}y</span>
                        </div>
                    ))}
                </div>
                <div className={cx(styles.box, styles.item, skillStyles.chart)} style={stagger(14, 0.04)}>
                    {distributions.map((dist) => (
                        <Distribution key={dist.title} title={dist.title} data={dist.data}/>
                    ))}
                </div>
            </div>

            <dialog
                ref={dialogRef}
                className={styles.dialog}
                aria-labelledby={dialogTitleId}
                onClose={() => setOpenCategory(null)}
                onClick={(e) => e.target === e.currentTarget && setOpenCategory(null)}
            >
                {openCategory && (
                    <>
                        <div className={styles.dialogBar}>
                            <span className={styles.muted}>$ tree skills/{slug(openCategory)}</span>
                            <button type="button" className={styles.btn} onClick={() => setOpenCategory(null)} aria-label="Close">×</button>
                        </div>
                        <div className={styles.dialogBody}>
                            <h3 id={dialogTitleId} className={cx(styles.h3, styles.c2)} style={{fontSize: 22, marginBottom: 8}}>
                                {openCategory}/ <span className={styles.muted} style={{fontSize: 15, fontWeight: 400}}>{openSkills.length} skills</span>
                            </h3>
                            {openSkills.map((skill, i) => (
                                <span key={skill} className={styles.fadeUp} style={{animationDelay: `${i * 0.03}s`}}>
                                    <span className={styles.muted}>{branch(i === openSkills.length - 1)}</span>{skill}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </dialog>
        </CommandBlock>
    );
}

function Distribution({title, data}: Readonly<{ title: string; data: StatSlice[] }>) {
    const total = data.reduce((sum, slice) => sum + slice.years, 0) || 1;
    const percent = (slice: StatSlice) => Math.round((slice.years / total) * 100);
    const aria = data.map((slice) => `${slice.name} ${percent(slice)}%`).join(", ");

    return (
        <div className={skillStyles.dist}>
            <h3 className={cx(styles.h3, styles.c2)}>{title}</h3>
            <div className={styles.barTrack} role="img" aria-label={aria} style={{height: 18}}>
                {data.map((slice, i) => (
                    <span
                        key={slice.name}
                        className={styles.bar}
                        style={{width: `${(slice.years / total) * 100}%`, "--bar": SLICE_COLORS[i]} as CSSProperties}
                    />
                ))}
            </div>
            <div className={skillStyles.legend}>
                {data.map((slice, i) => (
                    <span key={slice.name}>
                        <span style={{color: SLICE_COLORS[i]}}>■</span> {slice.name}{" "}
                        <span className={styles.muted}>{slice.years}y · {percent(slice)}%</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
