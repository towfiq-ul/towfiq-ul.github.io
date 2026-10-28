import {useId} from "react";
import cx from "classnames";
import styles from "../terminal/terminal.module.css";
import hero from "./hero.module.css";
import {openSource, personalInfo, workExperience} from "../../data/portfolio-data";
import {projects} from "../../data/project-list";
import {calculateTotalExperience} from "../../utils/date-utils";
import {useCountUp} from "../../hooks/use-count-up";

const TOTAL_TECHNOLOGIES = 20;

interface HeroProps {
    /** Runs a command in the session (the stat lines are shortcuts). */
    onRun: (command: string) => void;
}

/** Output of `whoami`: the ~/.plan card. */
export function Hero({onRun}: Readonly<HeroProps>) {
    const titleId = useId();
    const progress = useCountUp();
    const totalExp = calculateTotalExperience(workExperience);

    const stats = [
        {key: "Uptime", value: totalExp.years, label: "Years Experience", command: "work"},
        {key: "Projects", value: projects.length, label: "Projects Contributed To", command: "projects"},
        {key: "Packages", value: TOTAL_TECHNOLOGIES, label: "Technologies", command: "skills"},
        {key: "Repos", value: openSource.length, label: "Open Source Contributions", command: "oss"},
    ];

    return (
        <section className={hero.hero} aria-labelledby={titleId}>
            <div className={hero.sweep} aria-hidden="true"/>
            <div className={cx(styles.fadeUp, hero.plan)}>
                <div className={hero.logo} aria-hidden="true">
                    <span className={hero.logoText}>TI</span>
                    <span className={hero.logoVersion}>// v{totalExp.years}.{totalExp.months}.0</span>
                </div>

                <div className={hero.info}>
                    <h1 id={titleId} className={hero.name}>
                        {personalInfo.name}<span className={styles.cursor} aria-hidden="true"/>
                    </h1>
                    <p className={hero.title}>{personalInfo.title}</p>

                    <dl className={hero.facts}>
                        <dt>Status</dt>
                        <dd><span className={styles.c3}>●</span> Available for Opportunities</dd>
                        <dt>About</dt>
                        <dd className={styles.muted}>
                            Designing and shipping high-throughput distributed systems for fintech and enterprise.
                            Specialized in Java · Spring Boot · Kafka · AWS. Working experience with payment
                            infrastructure at Bangladesh's #1 mobile financial platform.
                        </dd>
                        {stats.map((s) => (
                            <div key={s.key} className={hero.fact}>
                                <dt>{s.key}</dt>
                                <dd>
                                    <button type="button" className={hero.statLink} onClick={() => onRun(s.command)}>
                                        <strong className={hero.statValue}>{Math.round(s.value * progress)}+</strong>{" "}
                                        <span className={styles.muted}>{s.label}</span>
                                    </button>
                                </dd>
                            </div>
                        ))}
                        <dt>Links</dt>
                        <dd className={hero.links}>
                            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={styles.linkOut} aria-label="LinkedIn Profile">linkedin ↗</a>
                            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className={styles.linkOut} aria-label="GitHub Profile">github ↗</a>
                            <a href={personalInfo.stackoverflow} target="_blank" rel="noopener noreferrer" className={styles.linkOut} aria-label="Stack Overflow Profile">stackoverflow ↗</a>
                        </dd>
                    </dl>

                    <div className={hero.swatches} aria-hidden="true">
                        {["#15242B", "#1F333C", "#2A9D8F", "#5FC4B6", "#5B9BD5", "#6BAF7F", "#E07A5F", "#EEF5F2"].map((c) => (
                            <span key={c} style={{background: c}}/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
