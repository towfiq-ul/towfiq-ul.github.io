import {personalInfo} from "./portfolio-data";

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
        meta: "November 2021 – May 2024 | Zurich, Switzerland (Remote)",
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

const bullets = (items: string[]) => items.map((item) => `- ${item}`).join("\n");
const labeled = (items: { label: string; text: string }[], separator: string) =>
    bullets(items.map((item) => `**${item.label}**${separator}${item.text}`));

/** The CV as a Markdown document — what `less cv.md` shows, and part of the AI assistant's RAG index. */
export const CV_MARKDOWN = [
    `# ${personalInfo.name}`,
    "**Senior Software Engineer | Java / Spring Boot & PHP / Laravel | Dhaka, Bangladesh**",
    CONTACT_LINES.map((c) => `[${c.label}](${c.href})`).join(" | "),
    `Portfolio: [https://${personalInfo.portfolio}](https://${personalInfo.portfolio})  `,
    `GitHub: [${personalInfo.github}](${personalInfo.github}) | LinkedIn: [${personalInfo.linkedin}](${personalInfo.linkedin})`,
    "## Professional Summary",
    SUMMARY,
    "## Core Expertise",
    labeled(CORE_EXPERTISE, ": "),
    "## Work Experience",
    ...WORK_EXPERIENCE.map((job) => `### ${job.title}\n*${job.meta}*\n\n${job.body}`),
    "## Key Projects",
    labeled([...KEY_PROJECTS_PAGE1, ...KEY_PROJECTS_PAGE2].map((p) => ({label: p.name, text: p.text})), " – "),
    "## Key Impacts",
    labeled(KEY_IMPACTS, ": "),
    "## Education",
    EDUCATION_LINE,
    "## Certifications & Awards",
    bullets(CERTIFICATIONS_AWARDS),
    "## Open Source Contributions",
    bullets(OPEN_SOURCE),
].join("\n\n");

