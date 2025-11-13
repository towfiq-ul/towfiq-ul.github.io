import styles from "./section-header.module.css";

interface SectionHeaderProps {
  /**
   * The main title of the section
   * @important
   */
  title: string;
  /**
   * Optional subtitle or description
   */
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={className}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}
