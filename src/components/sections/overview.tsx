import styles from "../terminal/terminal.module.css";
import {CommandBlock, stagger} from "../terminal/command-block";
import {overview} from "../../data/portfolio-data";

export function Overview() {
    return (
        <CommandBlock
            sectionId="overview"
            title="Professional Overview"
            subtitle="Summary of experience, achievements, and core competencies"
        >
            <div className={styles.cols}>
                <div className={`${styles.box} ${styles.item}`} style={stagger(0, 0.1)}>
                    <h3 className={`${styles.h3} ${styles.c2}`}>## Summary</h3>
                    <p style={{margin: "10px 0 0", lineHeight: 1.75}}>{overview.summary}</p>
                </div>
                <div className={`${styles.box} ${styles.item}`} style={stagger(1, 0.1)}>
                    <h3 className={`${styles.h3} ${styles.c2}`}>## Key Highlights</h3>
                    <ul className={styles.list} style={{marginTop: 10}}>
                        {overview.highlights.map((highlight) => (
                            <li key={highlight} className={styles.bullet}>
                                <span className={styles.c3}>✓</span><span>{highlight}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={`${styles.box} ${styles.item}`} style={stagger(2, 0.1)}>
                    <h3 className={`${styles.h3} ${styles.c2}`}>## Core Expertise</h3>
                    <ul className={styles.list} style={{marginTop: 10}}>
                        {overview.expertise.map((item) => {
                            const [label, ...rest] = item.split(": ");
                            return (
                                <li key={item} className={styles.bullet}>
                                    <span className={styles.c1}>›</span>
                                    <span>
                                        <span className={`${styles.c1} ${styles.bold}`}>{label}: </span>
                                        <span className={styles.muted}>{rest.join(": ")}</span>
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </CommandBlock>
    );
}
