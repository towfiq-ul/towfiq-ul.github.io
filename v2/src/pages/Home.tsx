import {useState} from "react";
import styles from "./Home.module.css";
import {
    Award as AwardIcon,
    Briefcase,
    Calendar,
    ExternalLink,
    Github,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    // Sparkles,
    TrendingUp
} from "lucide-react";
import {Badge} from "../components/ui/badge/badge";
import {SectionHeader} from "../components/section-header";
import {Navbar} from "../components/navbar/navbar";
import {SkillModal} from "../components/skill-modal/skill-modal";
import {StatsChart} from "../components/stats-chart/stats-chart";
import {ExperienceChart} from "../components/experience-chart/experience-chart";
import {ScrollToTop} from "../components/scroll-to-top/scroll-to-top";
import {Particles} from "../components/particles/particles";
import {WhatsAppChat} from "../components/whatsapp-chat/whatsapp-chat";
import {awards, education, openSource, overview, personalInfo, skills, workExperience} from "../data/portfolio-data";
import {calculateTotalExperience, formatExperience} from "../utils/date-utils";
import {projects} from "../data/project-list";

interface HomeProps {
    onNavigateToContact: () => void;
    onNavigateToCV?: () => void;
}

export default function Home({onNavigateToContact, onNavigateToCV}: HomeProps) {
    const [selectedSkill, setSelectedSkill] = useState<{ category: string; skills: string[] } | null>(null);
    const totalExp = calculateTotalExperience(workExperience);
    const totalProjects = projects.length;
    const totalTechnologies = 20;

    return (
        <div className={styles.page}>
            <Particles/>
            <Navbar onNavigateToContact={onNavigateToContact} onNavigateToCV={onNavigateToCV} currentPage={'home'}/>

            {/* Hero Section */}
            <section id="hero" className={styles.hero}>
                <div className={styles.heroBackground}>
                    <div className={styles.heroCircle1}></div>
                    <div className={styles.heroCircle2}></div>
                    <div className={styles.heroCircle3}></div>
                </div>
                <div className={styles.heroContent}>
                    <div className={styles.heroGlass}>
                        <div className={styles.badgeContainer}>
                            {/*<Badge variant="outline" className={styles.heroBadge}>*/}
                            {/*  <Sparkles className={styles.badgeIcon} />*/}
                            {/*  Available for Opportunities*/}
                            {/*</Badge>*/}
                        </div>
                        <h1 className={styles.name}>{personalInfo.name}</h1>
                        <p className={styles.jobTitle}>{personalInfo.title}</p>
                        <p className={styles.heroDescription}>
                            Building scalable enterprise solutions with {totalExp.years}+ years of expertise in Java,
                            Spring Boot, Cloud Technologies, and Full-Stack Development
                        </p>

                        <div className={styles.heroStats}>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>{totalExp.years}+</div>
                                <div className={styles.statLabel}>Years Experience</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>{totalProjects}+</div>
                                <div className={styles.statLabel}>Projects Delivered</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>{totalTechnologies}+</div>
                                <div className={styles.statLabel}>Technologies</div>
                            </div>
                        </div>

                        <div className={styles.socialLinks}>
                            <a
                                href={personalInfo.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="LinkedIn Profile"
                            >
                                <Linkedin className={styles.socialIcon}/>
                            </a>
                            <a
                                href={personalInfo.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="GitHub Profile"
                            >
                                <Github className={styles.socialIcon}/>
                            </a>
                            <a
                                href={personalInfo.stackoverflow}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.socialLink}
                                aria-label="Stack Overflow Profile"
                            >
                                <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H16.85v-2.137H6.111v2.137zm.259-4.852l10.48 2.189.451-2.07-10.478-2.187-.453 2.068zm1.359-5.056l9.705 4.53.903-1.95-9.706-4.53-.902 1.936v.014zm2.715-4.785l8.217 6.855 1.359-1.62-8.216-6.853-1.35 1.617-.01.001zM15.751 0l-1.746 1.294 6.405 8.604 1.746-1.294L15.749 0h.002z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview Section */}
            <section id="overview" className={styles.section}>
                <SectionHeader
                    title="Professional Overview"
                    subtitle="Summary of experience, achievements, and core competencies"
                />
                <div className={styles.overviewContainer}>
                    <div className={styles.overviewCard}>
                        <h3 className={styles.overviewSubtitle}>Summary</h3>
                        <p className={styles.overviewText}>{overview.summary}</p>
                    </div>

                    <div className={styles.overviewCard}>
                        <h3 className={styles.overviewSubtitle}>Key Highlights</h3>
                        <ul className={styles.highlightsList}>
                            {overview.highlights.map((highlight, index) => (
                                <li key={index} className={styles.highlightItem}
                                    style={{animationDelay: `${index * 0.1}s`}}>
                                    {highlight}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.overviewCard}>
                        <h3 className={styles.overviewSubtitle}>Core Expertise</h3>
                        <div className={styles.expertiseGrid}>
                            {overview.expertise.map((item, index) => (
                                <div key={index} className={styles.expertiseItem}
                                     style={{animationDelay: `${index * 0.1}s`}}>
                                    <div className={styles.expertiseDot}></div>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className={styles.section}>
                <SectionHeader
                    title="Technical Skills"
                    // subtitle="Click on any category to explore my expertise in detail"
                />
                <div className={styles.skillsGrid}>
                    {Object.entries(skills).map(([category, skillList], index) => (
                        <div
                            key={category}
                            className={styles.skillCategory}
                            onClick={() => setSelectedSkill({category, skills: skillList})}
                            style={{animationDelay: `${index * 0.1}s`}}
                        >
                            <div className={styles.skillCategoryInner}>
                                <h3 className={styles.categoryTitle}>{category}</h3>
                                <div className={styles.skillCount}>{skillList.length} skills</div>
                                <div className={styles.skillPreview}>
                                    {skillList.slice(0, 3).map((skill) => (
                                        <Badge key={skill} variant="secondary" className={styles.skillBadge}>
                                            {skill.length > 20 ? skill.substring(0, 20) + "..." : skill}
                                        </Badge>
                                    ))}
                                    {skillList.length > 3 && (
                                        <Badge variant="outline" className={styles.moreBadge}>
                                            +{skillList.length - 3} more
                                        </Badge>
                                    )}
                                </div>
                                <div className={styles.clickHint}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className={styles.chartsGrid}>
                    <StatsChart/>
                    <ExperienceChart/>
                </div>
            </section>

            {/* Work Experience Section */}
            <section id="experience" className={`${styles.section} ${styles.sectionAlt}`}>
                <SectionHeader title="Work Experience"
                               subtitle={`${formatExperience(totalExp.years, totalExp.months)} of Professional Software Development`}/>
                <div className={styles.experienceTimeline}>
                    {workExperience.map((job, index) => (
                        <div key={index} className={styles.experienceItem} style={{animationDelay: `${index * 0.15}s`}}>
                            <div className={styles.experienceCard}>
                                <div className={styles.experienceHeader}>
                                    <h3 className={styles.experienceTitle}>{job.title}</h3>
                                    <div className={styles.experienceMeta}>
                    <span className={styles.metaItem}>
                      <Briefcase className={styles.metaIcon}/>
                        {job.company}
                    </span>
                                        <span className={styles.metaItem}>
                      <MapPin className={styles.metaIcon}/>
                                            {job.location}
                    </span>
                                        <span className={styles.metaItem}>
                      <Calendar className={styles.metaIcon}/>
                                            {job.period}
                    </span>
                                    </div>
                                    <Badge variant="outline" style={{marginTop: "8px"}}>
                                        {job.type}
                                    </Badge>
                                </div>
                                <p className={styles.experienceDescription}>{job.description}</p>
                                {job.responsibilities.length > 0 && (
                                    <div className={styles.responsibilitiesContainer}>
                                        <ul className={styles.responsibilitiesList}>
                                            {job.responsibilities.map((resp, idx) => (
                                                <li
                                                    key={idx}
                                                    className={`${styles.responsibilityItem} ${
                                                        idx >= 3 ? styles.responsibilityItemHidden : ""
                                                    }`}
                                                >
                                                    {resp}
                                                </li>
                                            ))}
                                        </ul>
                                        {job.responsibilities.length > 3 && (
                                            <div className={styles.hoverHint}>see more</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Projects Section */}
            <section id="project" className={styles.section}>
                <SectionHeader
                    title="Featured Projects"
                    subtitle="Key projects showcasing expertise in enterprise software development"
                />
                <div className={styles.projectsGrid}>
                    {projects.slice(0, 6).map((project, index) => (
                        <div key={index} className={styles.projectCard} style={{animationDelay: `${index * 0.1}s`}}>
                            <div className={styles.projectHeader}>
                                <h3 className={styles.projectName}>{project.name}</h3>
                                <TrendingUp className={styles.projectIcon}/>
                            </div>
                            <p className={styles.projectClient}>{project.client}</p>
                            <p className={styles.projectDescription}>{project.description}</p>
                            {project.highlights && project.highlights.length > 0 && (
                                <ul className={styles.projectHighlights}>
                                    {project.highlights.slice(0, 3).map((highlight, idx) => (
                                        <li key={idx} className={styles.highlightItem}>
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className={styles.techStack}>
                                {project.technologies.slice(0, 4).map((tech) => (
                                    <Badge key={tech} variant="default" className={styles.techBadge}>
                                        {tech}
                                    </Badge>
                                ))}
                                {project.technologies.length > 4 && (
                                    <Badge variant="outline" className={styles.techBadge}>
                                        +{project.technologies.length - 4}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education Section */}
            <section id="education" className={`${styles.section} ${styles.sectionAlt}`}>
                <SectionHeader title="Education"/>
                <div className={styles.educationList}>
                    {education.map((edu, index) => (
                        <div key={index} className={styles.educationItem} style={{animationDelay: `${index * 0.1}s`}}>
                            <h3 className={styles.degree}>{edu.degree}</h3>
                            <p className={styles.institution}>{edu.institution}</p>
                            <p className={styles.period}>{edu.period}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Awards & Achievements Section */}
            <section id="awards" className={styles.section}>
                <SectionHeader title="Awards & Achievements"
                               subtitle="Recognition in competitive programming and coaching"/>
                <div className={styles.awardsList}>
                    {awards.map((award, index) => (
                        <div key={index} className={styles.awardItem} style={{animationDelay: `${index * 0.1}s`}}>
                            <div className={styles.awardIcon}>
                                <AwardIcon/>
                            </div>
                            <div className={styles.awardContent}>
                                <h3 className={styles.awardTitle}>{award.title}</h3>
                                <p className={styles.awardDescription}>{award.description}</p>
                                {award.link && (
                                    <a href={award.link} target="_blank" rel="noopener noreferrer"
                                       className={styles.awardLink}>
                                        View Details <ExternalLink size={14}/>
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {openSource.length > 0 && (
                    <>
                        <SectionHeader title="Open Source Contributions"
                                       subtitle="Contributing to the developer community"/>
                        <div className={styles.awardsList}>
                            {openSource.map((contribution, index) => (
                                <div key={index} className={styles.awardItem}
                                     style={{animationDelay: `${index * 0.1}s`}}>
                                    <div className={styles.awardIcon}>
                                        <Github/>
                                    </div>
                                    <div className={styles.awardContent}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '4px'
                                        }}>
                                            <h3 className={styles.awardTitle}>{contribution.project}</h3>
                                            <Badge variant="outline" style={{fontSize: '11px'}}>
                                                {contribution.status}
                                            </Badge>
                                        </div>
                                        <p className={styles.awardDescription} style={{marginBottom: '4px'}}>
                                            {contribution.description}
                                        </p>
                                        <p className={styles.awardDescription}
                                           style={{fontSize: '13px', opacity: 0.8, marginBottom: '8px'}}>
                                            {contribution.contribution}
                                        </p>
                                        <a href={contribution.link} target="_blank" rel="noopener noreferrer"
                                           className={styles.awardLink}>
                                            View on GitHub <ExternalLink size={14}/>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* Contact Section */}
            <section id="contact" className={styles.contactSection}>
                <div className={styles.contactGlass}>
                    <h2 className={styles.contactTitle}>Let's Connect</h2>
                    <p className={styles.contactSubtitle}>
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your
                        visions.
                    </p>
                    <div className={styles.contactGrid}>
                        <button onClick={onNavigateToContact} className={styles.contactCard}>
                            <Mail className={styles.contactCardIcon}/>
                            <span className={styles.contactCardTitle}>Email Me</span>
                        </button>
                        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer"
                           className={styles.contactCard}>
                            <Linkedin className={styles.contactCardIcon}/>
                            <span className={styles.contactCardTitle}>LinkedIn</span>
                        </a>
                        <a href={personalInfo.github} target="_blank" rel="noopener noreferrer"
                           className={styles.contactCard}>
                            <Github className={styles.contactCardIcon}/>
                            <span className={styles.contactCardTitle}>GitHub</span>
                        </a>
                        <a href={`tel:${personalInfo.phone}`} className={styles.contactCard}>
                            <Phone className={styles.contactCardIcon}/>
                            <span className={styles.contactCardTitle}>Call Me</span>
                        </a>
                        <a href={personalInfo.stackoverflow} target="_blank" rel="noopener noreferrer"
                           className={styles.contactCard}>
                            <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H16.85v-2.137H6.111v2.137zm.259-4.852l10.48 2.189.451-2.07-10.478-2.187-.453 2.068zm1.359-5.056l9.705 4.53.903-1.95-9.706-4.53-.902 1.936v.014zm2.715-4.785l8.217 6.855 1.359-1.62-8.216-6.853-1.35 1.617-.01.001zM15.751 0l-1.746 1.294 6.405 8.604 1.746-1.294L15.749 0h.002z"/>
                            </svg>
                            <span className={styles.contactCardTitle}>Stack Overflow</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                Crafted with passion and precision.
                <p className={styles.footerText}>
                    © 2018-{new Date().getFullYear()} {personalInfo.name}. All rights reserved.
                </p>
            </footer>

            {/* Skill Modal */}
            <SkillModal
                isOpen={selectedSkill !== null}
                onClose={() => setSelectedSkill(null)}
                category={selectedSkill?.category || ""}
                skills={selectedSkill?.skills || []}
            />

            {/* Scroll to Top Button */}
            <ScrollToTop/>

            {/* WhatsApp Chat */}
            <WhatsAppChat
                phoneNumber={personalInfo.whatsapp}
                message="Hello Towfiqul! I visited your portfolio and would like to connect with you."
            />
        </div>
    );
}
