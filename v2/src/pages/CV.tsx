import {ArrowLeft, Download} from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Navbar } from "../components/navbar/navbar";
import { Button } from "../components/ui/button/button";
import {
  personalInfo,
  overview,
  workExperience,
  education,
  awards,
  openSource,
  skills,
} from "../data/portfolio-data";
import styles from "./CV.module.css";
import {projects} from "../data/project-list";
import {Particles} from "../components/particles/particles";

interface CVProps {
  onClose?: () => void;
}

export function CV({ onClose }: CVProps) {
  const cvRef = useRef<HTMLDivElement>(null);

  const handleDownloadCVFromStorage = async () => {
    const response = await fetch('/Towfiqul_Islam.pdf');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Towfiqul_Islam.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCV = async () => {
    if (!cvRef.current) return;

    try {
      const button = document.querySelector(`.${styles.downloadButton}`) as HTMLElement;
      if (button) button.style.display = 'none';

      const canvas = await html2canvas(cvRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: cvRef.current.scrollWidth,
        height: cvRef.current.scrollHeight
      });

      if (button) button.style.display = 'flex';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate to fill the width and maintain aspect ratio
      const imgWidth = canvas.width / 3; // Scale 3
      const imgHeight = canvas.height / 3;
      const ratio = pdfWidth / imgWidth;
      const scaledWidth = pdfWidth;
      const scaledHeight = imgHeight * ratio;
      
      // If height exceeds page, scale to fit height instead
      if (scaledHeight > pdfHeight) {
        const heightRatio = pdfHeight / imgHeight;
        const finalWidth = imgWidth * heightRatio;
        const finalHeight = pdfHeight;
        const xOffset = (pdfWidth - finalWidth) / 2;
        pdf.addImage(imgData, 'PNG', xOffset, 0, finalWidth, finalHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
      }
      
      pdf.save(`${personalInfo.name.replace(/\s+/g, '_')}_CV.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className={styles.cvPage}>
        <Particles />

        <Button onClick={onClose} className={styles.backButton} aria-label="Go back">
            <ArrowLeft />
            <span>Back to Portfolio</span>
        </Button>
      
      <Button className={styles.downloadButton} onClick={handleDownloadCVFromStorage}>
        <Download />
        Download CV
      </Button>

      <main className={styles.cvContent} ref={cvRef}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.contactInfo}>
              <p><strong>Email:</strong> {personalInfo.email}</p>
              <p><strong>Phone:</strong> {personalInfo.phone}</p>
              <p><strong>GitHub:</strong> <a href={personalInfo.github}>{personalInfo.github.split('/').pop()}</a></p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <h1 className={styles.name}>{personalInfo.name}</h1>
            <p className={styles.title}>{personalInfo.title}</p>
          </div>
        </header>

        <div className={styles.body}>
          {/* Left Column */}
          <aside className={styles.sidebar}>
            {/* Skills */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Technical Skills</h2>
              <div className={styles.skillsContainer}>
                {Object.entries(skills).map(([category, items]) => (
                  <p key={category} className={styles.skillItem}>
                    <strong>{category}:</strong> {items.join(", ")}
                  </p>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Education</h2>
              {education.slice(0, 1).map((edu, index) => (
                <div key={index} className={styles.educationItem}>
                  <p className={styles.degree}>{edu.degree}</p>
                  <p className={styles.institution}>{edu.institution}</p>
                  <p className={styles.period}>{edu.period}</p>
                </div>
              ))}
            </section>

            {/* Awards */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Awards</h2>
              {awards.map((award, index) => (
                <div key={index} className={styles.awardItem}>
                  <p className={styles.awardTitle}>{award.title}</p>
                </div>
              ))}
            </section>

            {/* Open Source */}
            {/*<section className={styles.section}>*/}
            {/*  <h2 className={styles.sectionTitle}>Open Source</h2>*/}
            {/*  {openSource.map((contrib, index) => (*/}
            {/*    <div key={index} className={styles.openSourceItem}>*/}
            {/*      <p className={styles.osProject}>{contrib.project}</p>*/}
            {/*    </div>*/}
            {/*  ))}*/}
            {/*</section>*/}
          </aside>

          {/* Right Column */}
          <div className={styles.main}>
            {/* Summary */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Professional Summary</h2>
              <p className={styles.summary}>{overview.summary}</p>
            </section>

            {/* Work Experience */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Work Experience</h2>
              {workExperience.slice(0, 2).map((job, index) => (
                <div key={index} className={styles.experienceItem}>
                  <div className={styles.experienceHeader}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <span className={styles.period}>{job.period}</span>
                  </div>
                  <p className={styles.company}>{job.company} - {job.location}</p>
                  {job.responsibilities.length > 0 && (
                    <ul className={styles.responsibilities}>
                      {job.responsibilities.slice(0, 3).map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>

            {/* Key Projects */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Key Projects</h2>
              {projects.slice(0, 4).map((project, index) => (
                <div key={index} className={styles.projectItem}>
                  <div className={styles.projectHeader}>
                    <span className={styles.projectName}>{project.name}</span>
                    <span className={styles.projectTech}>{project.technologies.slice(0, 4).join(", ")}</span>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
