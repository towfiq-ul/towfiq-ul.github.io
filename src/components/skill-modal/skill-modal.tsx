import { X } from "lucide-react";
import { Badge } from "../ui/badge/badge";
import styles from "./skill-modal.module.css";
import { useEffect } from "react";

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  skills: string[];
}

export function SkillModal({ isOpen, onClose, category, skills }: SkillModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{category}</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <X />
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.skillsGrid}>
            {skills.map((skill, index) => (
              <div key={skill} className={styles.skillItem} style={{ animationDelay: `${index * 0.05}s` }}>
                <Badge variant="default" className={styles.skillBadge}>
                  {skill}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
