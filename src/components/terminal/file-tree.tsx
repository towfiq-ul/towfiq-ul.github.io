import cx from "classnames";
import styles from "./terminal.module.css";
import {CV_ALIAS, SECTION_ALIASES} from "../../config/aliases";

interface FileTreeProps {
    /** Section most recently printed in the session. */
    activeSection: string | null;
    /** Runs a command in the session. */
    onRun: (command: string) => void;
}

const ENTRIES = [{alias: "whoami", file: "whoami.sh", sectionId: "hero"}, ...SECTION_ALIASES];

/**
 * `tree -L 1` of the portfolio. Hidden until `sidebar enable`; clicking an
 * entry runs its command in the session.
 */
export function FileTree({activeSection, onRun}: Readonly<FileTreeProps>) {
    return (
        <aside className={styles.sidebar} aria-label="Sections">
            <p className={styles.treeLabel}>$ tree -L 1</p>
            <nav className={styles.tree}>
                <span className={styles.treeRoot}>~/portfolio</span>
                {ENTRIES.map((entry, i) => (
                    <button
                        key={entry.sectionId}
                        type="button"
                        className={cx(styles.treeLink, activeSection === entry.sectionId && styles.treeLinkActive)}
                        aria-current={activeSection === entry.sectionId ? "true" : undefined}
                        onClick={() => onRun(entry.alias)}
                    >
                        <span className={styles.treeBranch}>{i === ENTRIES.length - 1 ? "└── " : "├── "}</span>
                        {entry.file}
                    </button>
                ))}
                <button type="button" className={cx(styles.treeLink, styles.c1, styles.bold)} onClick={() => onRun(CV_ALIAS.alias)}>
                    cv.md ↗
                </button>
            </nav>
            <div className={styles.sidebarMeta}>
                <span>branch: <span className={styles.c3}>main ✓</span></span>
                <span>shell: GNU bash</span>
                <span>agent: <span className={styles.c1}>online</span></span>
                <span>tz: Asia/Dhaka</span>
                <span>hide: <span className={styles.c1}>sidebar disable</span></span>
            </div>
        </aside>
    );
}
