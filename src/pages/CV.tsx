import {ArrowLeft, Download} from "lucide-react";
import {Fragment} from "react";
import {Button} from "../components/ui/button/button";
import {personalInfo} from "../data/portfolio-data";
import styles from "./CV.module.css";
import {Particles} from "../components/particles/particles";

interface CVProps {
    onClose?: () => void;
}

/**
 * Content below is a literal transcription of cv/build_cv.py's Towfiqul_Islam_CV.pdf
 * build() call (the combined Java + Laravel CV), including its page break, so this
 * page renders as an on-screen match of that PDF. Keep the two in sync by hand if
 * either changes — they are independent, disconnected sources of the same text.
 */

const CONTACT_LINES: { href: string; label: string }[] = [
    {href: "mailto:towfiq.106@gmail.com", label: "Email: towfiq.106@gmail.com"},
    {href: "tel:+8801823923023", label: "Phone: +8801823923023"},
];

const SUMMARY =
    "Senior Software Engineer with 7+ years designing and shipping backend systems across two stacks: Java / Spring " +
    "Boot microservices for high-throughput fintech platforms, and PHP / Laravel applications delivered for government, " +
    "private company, and open-source engagements. Most recently built core payment platform components as " +
    "Augmented Staff at bKash Limited, Bangladesh's #1 Unicorn MFS. Equally comfortable owning a Spring Boot " +
    "microservice with Kafka and DynamoDB, or a Laravel codebase end-to-end — schema design, Eloquent, queues, " +
    "Blade views, and RBAC. Passionate about clean architecture, system reliability, and shipping things that scale, in " +
    "either stack.";

const CORE_EXPERTISE: { label: string; text: string }[] = [
    {
        label: "Backend",
        text: "Java (11–21), Spring Boot, Spring MVC, Spring Security, Spring Integration, Spring Cloud, PHP, Laravel 9–12, Composer, Eloquent, Blade, Microservices, REST APIs, gRPC",
    },
    {label: "Frontend Integration", text: "React, TypeScript, Vite, jQuery"},
    {label: "Cloud & DevOps", text: "AWS (EC2, S3, SNS, SQS), Docker, Kubernetes, Jenkins, GitHub Actions CI, CI/CD"},
    {label: "Databases", text: "MySQL, Oracle, PostgreSQL, DynamoDB, Cassandra, Redis, JPA / Hibernate"},
    {label: "Messaging", text: "Kafka, RabbitMQ, ActiveMQ, AWS SNS/SQS"},
    {label: "Testing", text: "JUnit, Mockito, TestNG, Rest Assured, Postman"},
    {label: "Security & Auth", text: "OAuth2, JWT, KeyCloak, LDAP"},
    {label: "Practices", text: "Agile/Scrum, Domain-Driven Design, Event-Driven Design, clean architecture, code review, mentoring"},
];

const WORK_EXPERIENCE: { title: string; meta: string; body: string }[] = [
    {
        title: "Senior Software Engineer – Exabyting",
        meta: "May 2024 – August 2026 | Dhaka, Bangladesh",
        body:
            "Augmented resource at bKash Limited. Built and maintained core backend services (Customer App MW, FinRec, " +
            "PIN Reset MW) on Java / Spring Boot, DynamoDB, and Kafka, processing 2.5M+ transactions daily. Led the Spring " +
            "Boot 2→3 migration on the PIN Reset service (javax→jakarta, AWS SDK v1→v2, Jedis→Lettuce) for zero-downtime " +
            "deployment. Mentored junior engineers on best practices, release readiness, and system architecture.",
    },
    {
        title: "Software Engineer – SELISE",
        meta: "November 2021 – April 2024 | Zurich, Switzerland (Remote)",
        body:
            "Extended ThingsBoard (Java, open-source IoT platform, merged contributor) into a multi-tenant IoT middleware " +
            "platform for a Swiss enterprise customer, modeling and optimizing time-series telemetry at a scale of millions of " +
            "data points.",
    },
    {
        title: "Software Engineer – Exabyting",
        meta: "December 2019 – November 2021 | Dhaka, Bangladesh",
        body:
            "Developed both Java and PHP/Laravel government and private web applications and services, including PREVENTO " +
            "(a Laravel healthcare app backend) and internal Java tooling for bKash Limited. Worked as partner team with bKash " +
            "Limited's Solution Engineering Team.",
    },
];

// Page 1 keeps the first 5; page 2 continues with the rest — matches the real PDF's break.
const KEY_PROJECTS_PAGE1: { name: string; text: string }[] = [
    {name: "bKash App", text: "Consumer mobile financial app; Java 11–21 / Spring Boot (WebFlux) microservices, DynamoDB, Kafka, AWS, gRPC, Kubernetes"},
    {name: "Aerotia International", text: "Laravel 12 (PHP 8.2) JSON API + Blade admin CMS, React 18/TypeScript frontend"},
    {name: "Tesenso MW", text: "Multi-tenant IoT platform (extended ThingsBoard) for an EV/aerospace client"},
    {name: "bKash-FinRec", text: "Financial reconciliation system with LDAP auth, custom AOP access control, SIEM audit logging"},
    {name: "PIN Reset MW", text: "Spring Boot SOAP+REST middleware bridging Huawei CPS, JAXB codegen from WSDL/XSD"},
];

const KEY_PROJECTS_PAGE2: { name: string; text: string }[] = [
    {name: "AMS", text: "Airtime Management System; automated CSV/XLS/PDF generation, SFTP operations, maker-checker approval flow, TPS-limiting service with interval-based retry"},
    {name: "Aerotia Accounting", text: "Laravel 9 ledger/accounting admin portal, Blade, Docker"},
    {name: "HRMS User & Role Management", text: "Modular Laravel RBAC package"},
    {name: "laravel-gitstamp", text: "Open-source Composer package, MIT-licensed, CI-tested across Laravel 10–12"},
    {name: "PREVENTO", text: "Laravel backend for a healthcare Android app (Google Play), doctor-patient messaging, Firebase-integrated"},
];

const KEY_IMPACTS: { label: string; text: string }[] = [
    {label: "bKash App", text: "built and maintained services processing 2.5M+ transactions/day"},
    {
        label: "AMS",
        text:
            "reduced HTTP 429 rate-limit exceptions by solo-designing and building a self-contained, single-responsibility " +
            "TPS-limiting service with interval-based retry, later made dynamically configurable and scalable to support " +
            "Airtime Mobile Recharge Automation",
    },
    {
        label: "Spring Boot 2→3 migration",
        text: "led the migration on the PIN Reset service (javax→jakarta, AWS SDK v1→v2, Jedis→Lettuce) for zero-downtime deployment",
    },
    {
        label: "Reactive Kafka",
        text: "implemented reactive Kafka integration using spring-kafka and reactor-kafka to improve throughput and resilience across core banking microservices",
    },
    {label: "Tesenso MW", text: "extended to handle millions of IoT data points across a multi-tenant platform for an EV/aerospace client"},
    {
        label: "API latency",
        text: "reduced latency by replacing REST with GraphQL for client-facing data-fetching endpoints, eliminating over-fetching and cutting round trips for nested resources",
    },
    {
        label: "CI/CD",
        text: "cut build time from 8m 29s to 4m 56s (~42% faster) by implementing multithreaded build execution in the pipeline",
    },
    {
        label: "Developer tooling",
        text: "built a Bash/shell pipeline streaming live logs from an AWS EC2 instance to developers' local machines, cutting log-check time by ~15 minutes per check",
    },
];

const EDUCATION_LINE = "B.Sc. in Computer Science & Engineering – International Islamic University Chittagong (2014 - 2019)";

const CERTIFICATIONS_AWARDS: string[] = [
    "Java (Intermediate), C++ (Advanced), Python (Basic) – HackerRank",
    "IIUC IUPC 2017 – 2nd Position (Coach)",
    "EDU Programming Contest 2018 – 5th Position (Coach)",
    "CSE Week Programming Contest 2016 – 5th Position",
    "Solved 500+ competitive programming problems",
];

const OPEN_SOURCE: string[] = [
    "ThingsBoard (Java, open-source IoT platform) – Pull Request #6614 (Merged)",
    "laravel-gitstamp (PHP/Laravel) – Author & Maintainer, MIT-licensed, CI-tested across Laravel 10–12",
    "chatling – Framework-agnostic AI chat widget (npm), powers this portfolio's own AI assistant",
    "jmbus (Java) – Author & Maintainer; JNA wrapper around the M-Bus (Meter-Bus) protocol library libmbus, grown out of Tesenso IoT platform work",
    "claude-auto-resume-command – Author & Maintainer; Claude Code /auto-resume slash command plus a Stop-hook-based session guardian that auto-resumes paused sessions",
];

function SectionHeading({children}: { children: React.ReactNode }) {
    return (
        <Fragment>
            <h2 className={styles.h2}>{children}</h2>
            <hr className={styles.hr}/>
        </Fragment>
    );
}

function LabeledBullets({items, separator}: { items: { label: string; text: string }[]; separator: string }) {
    return (
        <ul className={styles.bullets}>
            {items.map((item, idx) => (
                <li key={idx}>
                    <strong>{item.label}</strong>
                    {separator}
                    {item.text}
                </li>
            ))}
        </ul>
    );
}

function PlainBullets({items}: { items: string[] }) {
    return (
        <ul className={styles.bullets}>
            {items.map((item, idx) => (
                <li key={idx}>{item}</li>
            ))}
        </ul>
    );
}

export function CV({onClose}: CVProps) {
    const handleDownloadCVFromStorage = async () => {
        const response = await fetch('/Towfiqul_Islam_CV.pdf');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Towfiqul_Islam_CV.pdf';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.cvPage}>
            <Particles/>

            <div className={styles.toolbar}>
                <Button onClick={onClose} className={styles.backButton} aria-label="Go back">
                    <ArrowLeft/>
                    <span>Back to Portfolio</span>
                </Button>

                <Button className={styles.downloadButton} onClick={handleDownloadCVFromStorage}>
                    <Download/>
                    Download CV
                </Button>
            </div>

            <div className={styles.pageScroll}>
                <div className={styles.pageStack}>
                    {/* Page 1 */}
                    <article className={styles.page}>
                        <h1 className={styles.name}>{personalInfo.name}</h1>
                        <p className={styles.role}>
                            Senior Software Engineer | Java / Spring Boot &amp; PHP / Laravel | Dhaka, Bangladesh
                        </p>
                        <p className={styles.contactLine}>
                            {CONTACT_LINES.map((c, i) => (
                                <Fragment key={c.href}>
                                    {i > 0 && " | "}
                                    <a href={c.href}>{c.label}</a>
                                </Fragment>
                            ))}
                        </p>
                        <p className={styles.contactLine}>
                            Portfolio: <a href={`https://${personalInfo.portfolio}`} target="_blank" rel="noreferrer">https://{personalInfo.portfolio}</a>
                        </p>
                        <p className={styles.contactLine}>
                            GitHub: <a href={personalInfo.github} target="_blank" rel="noreferrer">{personalInfo.github}</a>
                            {" | "}
                            LinkedIn: <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">{personalInfo.linkedin}</a>
                        </p>

                        <SectionHeading>Professional Summary</SectionHeading>
                        <p className={styles.body}>{SUMMARY}</p>

                        <SectionHeading>Core Expertise</SectionHeading>
                        <LabeledBullets items={CORE_EXPERTISE} separator=": "/>

                        <SectionHeading>Work Experience</SectionHeading>
                        {WORK_EXPERIENCE.map((job) => (
                            <div key={job.title} className={styles.job}>
                                <p className={styles.jobTitle}>{job.title}</p>
                                <p className={styles.jobMeta}>{job.meta}</p>
                                <p className={styles.body}>{job.body}</p>
                            </div>
                        ))}

                        <SectionHeading>Key Projects</SectionHeading>
                        <LabeledBullets
                            items={KEY_PROJECTS_PAGE1.map((p) => ({label: p.name, text: p.text}))}
                            separator=" – "
                        />
                    </article>

                    {/* Page 2 */}
                    <article className={styles.page}>
                        <ul className={styles.bullets}>
                            {KEY_PROJECTS_PAGE2.map((p) => (
                                <li key={p.name}>
                                    <strong>{p.name}</strong> – {p.text}
                                </li>
                            ))}
                        </ul>

                        <SectionHeading>Key Impacts</SectionHeading>
                        <LabeledBullets items={KEY_IMPACTS} separator=": "/>

                        <SectionHeading>Education</SectionHeading>
                        <p className={styles.body}>{EDUCATION_LINE}</p>

                        <SectionHeading>Certifications &amp; Awards</SectionHeading>
                        <PlainBullets items={CERTIFICATIONS_AWARDS}/>

                        <SectionHeading>Open Source Contributions</SectionHeading>
                        <PlainBullets items={OPEN_SOURCE}/>
                    </article>
                </div>
            </div>
        </div>
    );
}
