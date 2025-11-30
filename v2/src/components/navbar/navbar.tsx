import {useEffect, useState} from "react";
import {Award, Briefcase, Code, FileText, GraduationCap, Home, Mail, Menu, X} from "lucide-react";
import styles from "./navbar.module.css";

interface NavbarProps {
    onNavigateToContact?: () => void;
    onNavigateToCV?: () => void;
    currentPage?: string;
}

export function Navbar({onNavigateToContact, onNavigateToCV, currentPage}: NavbarProps = {}) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Determine active section based on scroll position
            const sections = ["hero", "overview", "skills", "experience", 'project', "education", "awards", "contact", "cv"];
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const scrollBottom = window.scrollY + windowHeight;

            // Check if we're near the bottom of the page (within 200px)
            if (currentPage === 'cv') {
                setActiveSection("cv");
                return;
            }

            // Find the active section
            let foundSection = "hero";
            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        foundSection = sectionId;
                        if (foundSection === 'project') {
                            foundSection = 'experience';
                        }
                        break;
                    }
                }
            }
            setActiveSection(foundSection);
        };

        handleScroll(); // Call once on mount
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({behavior: "smooth"});
            setIsMobileMenuOpen(false);
        }
    };

    const navItems = [
        {id: "hero", label: "Home", icon: Home},
        {id: "overview", label: "Overview", icon: FileText},
        {id: "skills", label: "Skills", icon: Code},
        {id: "experience", label: "Experience", icon: Briefcase},
        {id: "education", label: "Education", icon: GraduationCap},
        {id: "awards", label: "Awards", icon: Award},
        {id: "contact", label: "Contact", icon: Mail},
        {id: "cv", label: "CV", icon: FileText},
    ];

    const handleContactClick = () => {
        if (onNavigateToContact) {
            onNavigateToContact();
            setIsMobileMenuOpen(false);
        } else {
            scrollToSection("contact");
        }
    };

    const handleCVClick = () => {
        if (onNavigateToCV) {
            onNavigateToCV();
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
            <div className={styles.navContainer}>
                {isScrolled ? (
                    <button className={styles.logo} onClick={() => scrollToSection("hero")}>
                        <span className={styles.logoText}>Towfiqul Islam</span>
                        <span className={styles.logoSubtext}>Senior Software Engineer</span>
                    </button>
                ) : (
                    <button className={styles.logo} onClick={() => scrollToSection("hero")}>
                        <span className={styles.logoText}></span>
                        <span className={styles.logoSubtext}></span>
                    </button>
                )}

                <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ""}`}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            item.id === 'cv' ?
                                (<button onClick={handleCVClick}
                                         className={`${styles.navLink} ${activeSection === "cv" ? styles.active : ""}`}>
                                    <FileText className={styles.navIcon}/>
                                    <span>CV</span>
                                </button>) :
                                (<button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`${styles.navLink} ${activeSection === item.id ? styles.active : ""}`}
                                >
                                    <Icon className={styles.navIcon}/>
                                    <span>{item.label}</span>
                                </button>)
                        );
                    })}
                    {/*<button*/}
                    {/*    onClick={handleContactClick}*/}
                    {/*    className={`${styles.navLink} ${activeSection === "contact" ? styles.active : ""}`}*/}
                    {/*>*/}
                    {/*    <Mail className={styles.navIcon}/>*/}
                    {/*    <span>Contact</span>*/}
                    {/*</button>*/}
                </div>

                <button
                    className={styles.mobileMenuToggle}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X/> : <Menu/>}
                </button>
            </div>
        </nav>
    );
}
