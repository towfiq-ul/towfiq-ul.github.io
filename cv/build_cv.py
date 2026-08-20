"""Regenerate cv/*.pdf with a location added to each Work Experience entry."""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem, HRFlowable
)
from reportlab.lib.colors import HexColor

OUT_DIR = "/home/towfiq/workspace/towfiq-ul.github.io/cv"

GRAY = HexColor("#666666")
LINE_GRAY = HexColor("#bbbbbb")

styles = getSampleStyleSheet()

name_style = ParagraphStyle(
    "NameStyle", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=22, leading=26, spaceAfter=2,
)
role_style = ParagraphStyle(
    "RoleStyle", parent=styles["Normal"], fontName="Helvetica",
    fontSize=11, leading=14, textColor=HexColor("#222222"), spaceAfter=4,
)
contact_style = ParagraphStyle(
    "ContactStyle", parent=styles["Normal"], fontName="Helvetica",
    fontSize=9.5, leading=13, spaceAfter=1,
)
h2_style = ParagraphStyle(
    "H2Style", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=12.5, leading=15, spaceBefore=7, spaceAfter=3,
)
body_style = ParagraphStyle(
    "BodyStyle", parent=styles["Normal"], fontName="Helvetica",
    fontSize=9.5, leading=13, spaceAfter=2, alignment=TA_LEFT,
)
bullet_style = ParagraphStyle(
    "BulletStyle", parent=body_style, leftIndent=14, firstLineIndent=-14,
    spaceAfter=3,
)
job_title_style = ParagraphStyle(
    "JobTitleStyle", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=10.5, leading=13, spaceBefore=4, spaceAfter=0,
)
job_meta_style = ParagraphStyle(
    "JobMetaStyle", parent=styles["Normal"], fontName="Helvetica-Oblique",
    fontSize=9, leading=12, textColor=GRAY, spaceAfter=3,
)
edu_style = ParagraphStyle(
    "EduStyle", parent=styles["Normal"], fontName="Helvetica",
    fontSize=9.5, leading=13,
)
note_style = ParagraphStyle(
    "NoteStyle", parent=styles["Normal"], fontName="Helvetica-Oblique",
    fontSize=9, leading=12, textColor=GRAY, spaceAfter=4,
)


def bullets(items, style=bullet_style):
    return [Paragraph(f"•&nbsp;&nbsp;{t}", style) for t in items]


def heading(text):
    return [Paragraph(text, h2_style), HRFlowable(width="100%", thickness=0.6, color=LINE_GRAY, spaceAfter=4)]


def job(title_company, location, dates, body_text):
    return [
        Paragraph(title_company, job_title_style),
        Paragraph(f"{dates} | {location}", job_meta_style),
        Paragraph(body_text, body_style),
    ]


def build(filename, header_role, contact_lines, summary, sections, work_experience, project_sections, education, awards_title, awards, open_source_title=None, open_source=None, work_heading="Work Experience", work_note=None):
    doc = SimpleDocTemplate(
        os.path.join(OUT_DIR, filename), pagesize=A4,
        leftMargin=17 * mm, rightMargin=17 * mm, topMargin=13 * mm, bottomMargin=13 * mm,
        title=f"Towfiqul Islam - {filename}",
    )
    story = []
    story.append(Paragraph("Towfiqul Islam", name_style))
    story.append(Paragraph(header_role, role_style))
    for line in contact_lines:
        story.append(Paragraph(line, contact_style))
    story.append(Spacer(1, 6))

    story += heading("Professional Summary")
    story.append(Paragraph(summary, body_style))

    for title, content in sections:
        story += heading(title)
        story += content if isinstance(content, list) else [content]

    story += heading(work_heading)
    if work_note:
        story.append(Paragraph(work_note, note_style))
    for title_company, location, dates, body_text in work_experience:
        story += job(title_company, location, dates, body_text)

    for title, items in project_sections:
        story += heading(title)
        story += bullets(items)

    story += heading("Education")
    story.append(Paragraph(education, edu_style))

    story += heading(awards_title)
    story += bullets(awards)

    if open_source:
        story += heading(open_source_title)
        story += bullets(open_source)

    doc.build(story)
    print("wrote", filename)


LOC_EXABYTING = "Dhaka, Bangladesh"
LOC_SELISE = "Zurich, Switzerland (Remote)"

CONTACT_FULL = [
    'Email: <a href="mailto:towfiq.106@gmail.com">towfiq.106@gmail.com</a> | Phone: '
    '<a href="tel:+8801823923023">+8801823923023</a>',
    'Portfolio: <a href="https://towfiq-ul.github.io">https://towfiq-ul.github.io</a>',
    'GitHub: <a href="https://github.com/towfiq-ul">https://github.com/towfiq-ul</a> | LinkedIn: '
    '<a href="https://www.linkedin.com/in/towfiq106">https://www.linkedin.com/in/towfiq106</a>',
]

CONTACT_UW = [
    'Portfolio: <a href="https://towfiq-ul.github.io">https://towfiq-ul.github.io</a>',
    'GitHub: <a href="https://github.com/towfiq-ul">https://github.com/towfiq-ul</a>',
]

AWARDS_FULL = [
    "IIUC IUPC 2017 – 2nd Position (Coach)",
    "EDU Programming Contest 2018 – 5th Position (Coach)",
    "CSE Week Programming Contest 2016 – 5th Position",
    "Solved 500+ competitive programming problems",
]

EDUCATION = "B.Sc. in Computer Science &amp; Engineering – International Islamic University Chittagong (2014 - 2019)"

# ---------------------------------------------------------------------------
# 1. Towfiqul_Islam_CV.pdf (combined Java + Laravel)
# ---------------------------------------------------------------------------
build(
    "Towfiqul_Islam_CV.pdf",
    "Senior Software Engineer | Java / Spring Boot &amp; PHP / Laravel | Dhaka, Bangladesh",
    CONTACT_FULL,
    "Senior Software Engineer with 7+ years designing and shipping backend systems across two stacks: Java / Spring "
    "Boot microservices for high-throughput fintech platforms, and PHP / Laravel applications delivered for government, "
    "private company, and open-source engagements. Most recently built core payment platform components as "
    "Augmented Staff at bKash Limited, Bangladesh's #1 Unicorn MFS. Equally comfortable owning a Spring Boot "
    "microservice with Kafka and DynamoDB, or a Laravel codebase end-to-end — schema design, Eloquent, queues, "
    "Blade views, and RBAC. Passionate about clean architecture, system reliability, and shipping things that scale, in "
    "either stack.",
    [
        ("Core Expertise", bullets([
            "<b>Backend:</b> Java (11–21), Spring Boot, Spring MVC, Spring Security, Spring Integration, Spring Cloud, PHP, "
            "Laravel 9–12, Composer, Eloquent, Blade, Microservices, REST APIs, gRPC",
            "<b>Frontend Integration:</b> React, TypeScript, Vite, jQuery",
            "<b>Cloud &amp; DevOps:</b> AWS (EC2, S3, SNS, SQS), Docker, Kubernetes, Jenkins, GitHub Actions CI, CI/CD",
            "<b>Databases:</b> MySQL, Oracle, PostgreSQL, DynamoDB, Cassandra, Redis, JPA / Hibernate",
            "<b>Messaging:</b> Kafka, RabbitMQ, ActiveMQ, AWS SNS/SQS",
            "<b>Testing:</b> JUnit, Mockito, TestNG, Rest Assured, Postman",
            "<b>Security &amp; Auth:</b> OAuth2, JWT, KeyCloak, LDAP",
            "<b>Practices:</b> Agile/Scrum, Domain-Driven Design, Event-Driven Design, clean architecture, code review, mentoring",
        ])),
    ],
    [
        ("Senior Software Engineer – Exabyting", LOC_EXABYTING, "April 2024 – August 2026",
         "Augmented resource at bKash Limited. Built and maintained core backend services (Customer App MW, FinRec, "
         "PIN Reset MW) on Java / Spring Boot, DynamoDB, and Kafka, processing 2.5M+ transactions daily. Led the Spring "
         "Boot 2→3 migration on the PIN Reset service (javax→jakarta, AWS SDK v1→v2, Jedis→Lettuce) for zero-downtime "
         "deployment. Mentored junior engineers on best practices, release readiness, and system architecture."),
        ("Software Engineer – SELISE", LOC_SELISE, "November 2021 – April 2024",
         "Extended ThingsBoard (Java, open-source IoT platform, merged contributor) into a multi-tenant IoT middleware "
         "platform for a Swiss enterprise customer, modeling and optimizing time-series telemetry at a scale of millions of "
         "data points."),
        ("Software Engineer – Exabyting", LOC_EXABYTING, "December 2019 – November 2021",
         "Developed both Java and PHP/Laravel government and private web applications and services, including PREVENTO "
         "(a Laravel healthcare app backend) and internal Java tooling for bKash Limited. Worked as partner team with bKash "
         "Limited's Solution Engineering Team."),
    ],
    [
        ("Key Projects", [
            "<b>bKash App</b> – Consumer mobile financial app; Java 11–21 / Spring Boot (WebFlux) microservices, DynamoDB, "
            "Kafka, AWS, gRPC, Kubernetes",
            "<b>Aerotia International</b> – Laravel 12 (PHP 8.2) JSON API + Blade admin CMS, React 18/TypeScript frontend",
            "<b>Tesenso MW</b> – Multi-tenant IoT platform (extended ThingsBoard) for an EV/aerospace client",
            "<b>bKash-FinRec</b> – Financial reconciliation system with LDAP auth, custom AOP access control, SIEM audit logging",
            "<b>PIN Reset MW</b> – Spring Boot SOAP+REST middleware bridging Huawei CPS, JAXB codegen from WSDL/XSD",
            "<b>AMS</b> – Airtime Management System; automated CSV/XLS/PDF generation, SFTP operations, maker-checker "
            "approval flow, TPS-limiting service with interval-based retry",
            "<b>Aerotia Accounting</b> – Laravel 9 ledger/accounting admin portal, Blade, Docker",
            "<b>HRMS User &amp; Role Management</b> – Modular Laravel RBAC package",
            "<b>laravel-gitstamp</b> – Open-source Composer package, MIT-licensed, CI-tested across Laravel 10–12",
            "<b>PREVENTO</b> – Laravel backend for a healthcare Android app (Google Play), doctor-patient messaging, "
            "Firebase-integrated",
        ]),
        ("Key Impacts", [
            "<b>bKash App:</b> built and maintained services processing 2.5M+ transactions/day",
            "<b>AMS:</b> reduced HTTP 429 rate-limit exceptions by solo-designing and building a self-contained, "
            "single-responsibility TPS-limiting service with interval-based retry, later made dynamically configurable and "
            "scalable to support Airtime Mobile Recharge Automation",
            "<b>Spring Boot 2→3 migration:</b> led the migration on the PIN Reset service (javax→jakarta, AWS SDK v1→v2, "
            "Jedis→Lettuce) for zero-downtime deployment",
            "<b>Reactive Kafka:</b> implemented reactive Kafka integration using spring-kafka and reactor-kafka to improve "
            "throughput and resilience across core banking microservices",
            "<b>Tesenso MW:</b> extended to handle millions of IoT data points across a multi-tenant platform for an "
            "EV/aerospace client",
            "<b>API latency:</b> reduced latency by replacing REST with GraphQL for client-facing data-fetching endpoints, "
            "eliminating over-fetching and cutting round trips for nested resources",
            "<b>CI/CD:</b> cut build time from 8m 29s to 4m 56s (~42% faster) by implementing multithreaded build execution "
            "in the pipeline",
            "<b>Developer tooling:</b> built a Bash/shell pipeline streaming live logs from an AWS EC2 instance to "
            "developers' local machines, cutting log-check time by ~15 minutes per check",
        ]),
    ],
    EDUCATION,
    "Certifications &amp; Awards",
    ["Java (Intermediate), C++ (Advanced), Python (Basic) – HackerRank"] + AWARDS_FULL,
    "Open Source Contributions",
    [
        "ThingsBoard (Java, open-source IoT platform) – Pull Request #6614 (Merged)",
        "laravel-gitstamp (PHP/Laravel) – Author &amp; Maintainer, MIT-licensed, CI-tested across Laravel 10–12",
        "chatling – Framework-agnostic AI chat widget (npm), powers this portfolio's own AI assistant",
        "jmbus (Java) – Author &amp; Maintainer; JNA wrapper around the M-Bus (Meter-Bus) protocol library libmbus, "
        "grown out of Tesenso IoT platform work",
        "claude-auto-resume-command – Author &amp; Maintainer; Claude Code /auto-resume slash command plus a "
        "Stop-hook-based session guardian that auto-resumes paused sessions",
    ],
)

# ---------------------------------------------------------------------------
# 2. Towfiqul_Islam_CV_Java.pdf
# ---------------------------------------------------------------------------
build(
    "Towfiqul_Islam_CV_Java.pdf",
    "Senior Software Engineer | Java / Spring Boot | Dhaka, Bangladesh",
    CONTACT_FULL,
    "Senior Software Engineer with 7+ years designing and shipping high-throughput distributed systems for fintech and "
    "enterprise clients. Core expertise in Java (11–21) / Spring Boot microservices, event-driven architecture with Kafka, "
    "and cloud-native infrastructure on AWS and Kubernetes. Most recently built core payment platform components as "
    "Augmented Staff at bKash Limited, Bangladesh's #1 Unicorn MFS, handling millions of daily transactions. Passionate "
    "about clean architecture, system reliability, and shipping things that scale.",
    [
        ("Java / Spring Boot Highlights", bullets([
            "Built and maintained core backend services (Customer App MW, FinRec, PIN Reset MW) for bKash Limited's "
            "core payment platform, processing 2.5M+ transactions daily",
            "Built and maintain scalable Java 11–21 / Spring Boot microservices exposing RESTful APIs, using Virtual "
            "Threads, reactive programming (WebFlux), and reactive Kafka (spring-kafka, reactor-kafka)",
            "Delivered bKash-FinRec, a financial reconciliation system with corporate LDAP authentication, custom "
            "AOP-based access-control annotations, and audit-event logging shipped to a SIEM endpoint",
            "Built PIN Reset MW, a Spring Boot SOAP+REST middleware bridging the Huawei CPS mobile-money core "
            "platform, with JAXB codegen from WSDL/XSD",
            "Improved response time by 40% through database query optimization and Redis caching; achieved 85%+ unit "
            "and integration test coverage with JUnit and Mockito",
            "Extended ThingsBoard (open-source IoT platform, merged contributor — PR #6614) into a multi-tenant IoT "
            "middleware handling millions of data points for a Swiss enterprise customer",
            "Established coding standards, development workflows, and CI/CD pipelines using Jenkins and Docker, "
            "improving team productivity by 30%; mentored junior engineers on best practices, release readiness, and "
            "system architecture",
        ])),
        ("Core Expertise", bullets([
            "<b>Backend:</b> Java (11–21), Spring Boot, Spring MVC, Spring Security, Spring Integration, Spring Cloud, "
            "Microservices, REST APIs, gRPC, Domain-Driven Design, Event-Driven Design",
            "<b>Cloud &amp; DevOps:</b> AWS (EC2, S3, SNS, SQS), Docker, Kubernetes, Jenkins, Azure DevOps, CI/CD",
            "<b>Databases:</b> MySQL, Oracle, PostgreSQL, DynamoDB, Cassandra, Redis, JPA / Hibernate, Spring Data",
            "<b>Messaging:</b> Kafka, RabbitMQ, ActiveMQ, AWS SNS/SQS",
            "<b>Testing:</b> JUnit, TestNG, Mockito, Rest Assured, Postman",
            "<b>Security &amp; Auth:</b> OAuth2, JWT, KeyCloak, LDAP",
        ])),
    ],
    [
        ("Senior Software Engineer – Exabyting", LOC_EXABYTING, "April 2024 – August 2026",
         "Augmented resource at bKash Limited. Built and maintained core backend services (Customer App MW, FinRec, "
         "PIN Reset MW) on Java / Spring Boot, DynamoDB, and Kafka, processing 2.5M+ transactions daily. Mentored "
         "junior engineers on best practices and release readiness."),
        ("Software Engineer – SELISE", LOC_SELISE, "November 2021 – April 2024",
         "Extended ThingsBoard into a multi-tenant IoT middleware platform for a Swiss enterprise customer, modeling and "
         "optimizing time-series telemetry across PostgreSQL, TimescaleDB, and Cassandra at a scale of millions of data "
         "points. Orchestrated the Swisscom integration and led direct client-facing discussions."),
        ("Software Engineer – Exabyting", LOC_EXABYTING, "December 2019 – November 2021",
         "Developed government and private Java web applications and services. Worked as partner team with bKash Limited's "
         "Solution Engineering Team. Planned development cycles, prepared release notes, and conducted deployments in an "
         "Agile/Scrum process."),
    ],
    [
        ("Major Java Projects", [
            "<b>bKash App</b> – Consumer mobile financial app; Java 11–21 / Spring Boot (WebFlux) microservices, DynamoDB, "
            "Kafka, AWS, gRPC, Kubernetes",
            "<b>bKash-FinRec</b> – Financial reconciliation system (BanglaQR recon) with LDAP auth, custom AOP access "
            "control, SIEM audit logging",
            "<b>PIN Reset MW</b> – Spring Boot SOAP+REST middleware bridging Huawei CPS, JAXB codegen from WSDL/XSD",
            "<b>Tesenso MW</b> – Multi-tenant IoT platform for an EV/aerospace client",
            "<b>Urstamm</b> – Blockchain-based supply chain system",
            "<b>FDPS</b> – Financial document processing with Apache Camel &amp; Kafka",
            "<b>MULTIBANK</b> – Automated multi-bank integration with SFTP and maker-checker approval flow",
            "<b>AMS</b> – Airtime Management System; automated CSV/XLS/PDF generation, SFTP operations, maker-checker "
            "approval flow, TPS-limiting service with interval-based retry",
        ]),
        ("Key Impacts", [
            "<b>bKash App:</b> built and maintained services processing 2.5M+ transactions/day",
            "<b>AMS:</b> reduced HTTP 429 rate-limit exceptions by solo-designing and building a self-contained, "
            "single-responsibility TPS-limiting service with interval-based retry, later made dynamically configurable and "
            "scalable to support Airtime Mobile Recharge Automation",
            "<b>Spring Boot 2→3 migration:</b> led the migration on the PIN Reset service (javax→jakarta, AWS SDK v1→v2, "
            "Jedis→Lettuce) for zero-downtime deployment",
            "<b>Tesenso MW:</b> extended to handle millions of IoT data points across a multi-tenant platform for an "
            "EV/aerospace client",
            "<b>Urstamm:</b> delivered a 20% performance improvement on the blockchain data pipeline, including a 0.5GB "
            "legacy data migration to blockchain",
            "<b>API latency:</b> reduced latency by replacing REST with GraphQL for client-facing data-fetching endpoints, "
            "eliminating over-fetching and cutting round trips for nested resources",
            "<b>CI/CD:</b> cut build time from 8m 29s to 4m 56s (~42% faster) by implementing multithreaded build execution "
            "in the pipeline",
            "<b>Developer tooling:</b> built a Bash/shell pipeline streaming live logs from an AWS EC2 instance to "
            "developers' local machines, cutting log-check time by ~15 minutes per check",
        ]),
    ],
    EDUCATION,
    "Awards &amp; Achievements",
    AWARDS_FULL,
    "Open Source Contributions",
    [
        "ThingsBoard (Java, open-source IoT platform) – Pull Request #6614 (Merged)",
        "Tech Companies in Bangladesh – Pull Request #44 (Merged)",
        "jmbus (Java) – Author &amp; Maintainer; JNA wrapper around the M-Bus (Meter-Bus) protocol library libmbus, "
        "grown out of Tesenso IoT platform work",
        "claude-auto-resume-command – Author &amp; Maintainer; Claude Code /auto-resume slash command plus a "
        "Stop-hook-based session guardian that auto-resumes paused sessions",
    ],
)

# ---------------------------------------------------------------------------
# 3. Towfiqul_Islam_CV_Laravel.pdf
# ---------------------------------------------------------------------------
build(
    "Towfiqul_Islam_CV_Laravel.pdf",
    "Senior Software Engineer | PHP / Laravel | Dhaka, Bangladesh",
    CONTACT_FULL,
    "Senior Software Engineer with 7+ years across backend systems, including hands-on delivery of production "
    "Laravel/PHP applications spanning government platforms, private company engagements, and "
    "open-source tooling. Comfortable owning a Laravel codebase end-to-end — schema design, Eloquent, "
    "queues and service providers, Blade views, RBAC, and deployment tooling — alongside a primary "
    "background in Java/Spring Boot microservices for high-throughput fintech platforms.",
    [
        ("Laravel / PHP Highlights", bullets([
            "Delivered Aerotia International's public website end-to-end: Laravel 12 (PHP 8.2) JSON API + Blade "
            "admin CMS, paired with a React 18/TypeScript frontend, as a private company engagement",
            "Built Aerotia Accounting, a Laravel 9 ledger/accounting admin portal with full CRUD, dashboard, and "
            "admin-user management, on a Dockerized local dev stack (MySQL, Mailpit, Adminer)",
            "Authored and maintain laravel-gitstamp, an open-source Composer package generating deploy-time "
            "git version stamps — MIT-licensed and CI-tested across Laravel 10–12 "
            "(github.com/m-tech-org/laravel-gitstamp)",
            "Designed modular Laravel RBAC (roles, permissions, policies) drop-in modules for an HRMS "
            "user/role-management system",
            "Built the Laravel backend for PREVENTO, a healthcare Android app (Google Play) delivering "
            "personalized care plans and doctor-patient messaging, with MySQL, AWS, and Firebase integration",
            "Delivered government Laravel systems: an Annual Confidential Report generator for the Ministry of "
            "ICT, and an Inventory Management System for the Electoral Training Institute",
        ])),
        ("Core Expertise", bullets([
            "<b>Backend:</b> PHP, Laravel 9–12, Composer, Eloquent, Blade, RESTful APIs",
            "<b>Frontend Integration:</b> React, TypeScript, Vite, jQuery",
            "<b>Databases:</b> MySQL",
            "<b>DevOps:</b> Docker, GitHub Actions CI, Git",
            "<b>Cross-stack:</b> Java, Spring Boot, Microservices (primary professional stack)",
        ])),
    ],
    [
        ("Senior Software Engineer – Exabyting", LOC_EXABYTING, "April 2024 – August 2026",
         "Augmented resource at bKash Limited. Built and maintained core backend services (Customer App MW, "
         "FinRec, PIN Reset MW) on Java / Spring Boot, DynamoDB, and Kafka, processing 2.5M+ transactions daily."),
        ("Software Engineer – Exabyting", LOC_EXABYTING, "December 2019 – November 2021",
         "Developed government and private Laravel web applications, including PREVENTO (a healthcare Android "
         "app backend), an inventory management system for the Electoral Training Institute, and an Annual "
         "Confidential Report generator for the Ministry of ICT. Worked as partner team with bKash Limited's Solution "
         "Engineering Team."),
        ("Software Engineer – SELISE", LOC_SELISE, "November 2021 – April 2024",
         "Extended ThingsBoard into a multi-tenant IoT middleware platform for a Swiss enterprise customer "
         "(primarily Java-based; included for continuity of employment history)."),
    ],
    [
        ("Key Laravel Projects", [
            "<b>Aerotia International</b> – Laravel 12 (PHP 8.2) JSON API + Blade admin CMS, React 18/TypeScript "
            "frontend",
            "<b>Aerotia Accounting</b> – Laravel 9 ledger/accounting admin portal, Blade, Docker",
            "<b>HRMS User &amp; Role Management</b> – Modular Laravel RBAC package",
            "<b>laravel-gitstamp</b> – Open-source Composer package, MIT-licensed, CI-tested across Laravel 10–12",
            "<b>PREVENTO</b> – Laravel backend for a healthcare Android app (Google Play), doctor-patient "
            "messaging, Firebase-integrated",
            "<b>HR ACR (Ministry of ICT)</b> – Laravel employee report generator",
            "<b>IMS (Electoral Training Institute)</b> – Laravel inventory management system",
        ]),
    ],
    EDUCATION,
    "Awards &amp; Achievements",
    AWARDS_FULL,
)

# ---------------------------------------------------------------------------
# 4. Towfiqul_Islam_CV_Python.pdf
# ---------------------------------------------------------------------------
build(
    "Towfiqul_Islam_CV_Python.pdf",
    "Software Engineer | Python – Backend, Automation &amp; AI Tooling | Dhaka, Bangladesh",
    CONTACT_FULL,
    "Senior Software Engineer with 7+ years of professional experience, primarily in Java/Spring Boot, who "
    "applies Python for backend services, automation tooling, and AI/LLM engineering in self-directed and "
    "open-source work. Built a full RAG pipeline over S3-hosted documents, a cross-platform encrypted backup "
    "daemon, and automation tooling for Claude Code. Brings a strong foundation in distributed systems, clean "
    "architecture, and production engineering discipline from a Java/Spring Boot career to Python projects.",
    [
        ("Python Highlights", bullets([
            "Built and published a full RAG pipeline (chunking → embeddings → OpenSearch vector search → "
            "LLM-grounded answers) over documents stored in AWS S3, documented in a public GitHub repo and "
            "a Medium engineering deep-dive",
            "Built Google Drive Backup Utility, a cross-platform Python backup daemon covering files and "
            "databases (MySQL/MariaDB/PostgreSQL) with multiple storage destinations (Google Drive, "
            "Dropbox, OneDrive, email, scp), client-side AES-256-GCM encryption before upload, and "
            "retry-with-backoff on failed uploads — shipped as a freemium product with a Gumroad-gated Pro tier",
            "Authored Claude Code automation tooling in Python/Bash: a Stop-hook-based session guardian that "
            "detects usage-limit banners and resumes sessions automatically, and a session-transcript exporter "
            "that parses Claude Code's JSONL transcripts directly",
            "HackerRank-certified in Python (Basic); taught Python fundamentals, algorithms, and data structures "
            "as a competitive-programming coach",
        ])),
        ("Core Expertise", bullets([
            "<b>Backend &amp; Scripting:</b> Python, Bash, REST/API integration, JSON/YAML tooling",
            "<b>AI / LLM Engineering:</b> RAG pipelines, embeddings, vector search (OpenSearch), prompt "
            "engineering, LLM integration",
            "<b>Cloud &amp; Storage:</b> AWS S3, Google Drive API, Cloudflare Workers",
            "<b>Security:</b> AES-256-GCM client-side encryption",
            "<b>Cross-stack:</b> Java, Spring Boot, Microservices (primary professional stack); PHP/Laravel",
        ])),
    ],
    [
        ("Senior Software Engineer – Exabyting", LOC_EXABYTING, "April 2024 – August 2026",
         "Augmented resource at bKash Limited. Built and maintained core backend services (Customer App MW, "
         "FinRec, PIN Reset MW) on Java / Spring Boot, DynamoDB, and Kafka, processing 2.5M+ transactions daily."),
        ("Software Engineer – SELISE", LOC_SELISE, "November 2021 – April 2024",
         "Extended ThingsBoard into a multi-tenant IoT middleware platform for a Swiss enterprise customer, "
         "modeling and optimizing time-series telemetry at a scale of millions of data points."),
        ("Software Engineer – Exabyting", LOC_EXABYTING, "December 2019 – November 2021",
         "Developed government and private web applications and services. Worked as partner team with bKash "
         "Limited's Solution Engineering Team."),
    ],
    [
        ("Key Python Projects", [
            "<b>AI Query System from S3 Data</b> – RAG pipeline (chunking, embeddings, OpenSearch vector search, "
            "LLM-grounded answers); public GitHub repo + Medium deep-dive",
            "<b>Google Drive Backup Utility</b> – Cross-platform encrypted backup daemon, AES-256-GCM, multiple "
            "storage destinations, freemium Gumroad product",
            "<b>claude-auto-resume</b> – Python/Bash Claude Code automation; Stop-hook-based session guardian "
            "that auto-resumes paused sessions",
            "<b>claude-export-session</b> – Python/Bash Claude Code session-transcript exporter, parses JSONL "
            "transcripts directly",
        ]),
    ],
    EDUCATION,
    "Certifications &amp; Awards",
    ["Python (Basic) – HackerRank"] + AWARDS_FULL,
    work_heading="Professional Experience",
    work_note="Note: the roles below were delivered primarily in Java/Spring Boot; Python work is demonstrated "
               "through the self-directed and open-source projects listed separately.",
)

# ---------------------------------------------------------------------------
# 5. Towfiqul_Islam_CV_UW.pdf (Upwork-safe: no direct contact details)
# ---------------------------------------------------------------------------
build(
    "Towfiqul_Islam_CV_UW.pdf",
    "Senior Software Engineer | Java / Spring Boot &amp; PHP / Laravel | Dhaka, Bangladesh",
    CONTACT_UW,
    "Senior Software Engineer with 7+ years designing and shipping backend systems across two stacks: Java / Spring "
    "Boot microservices for high-throughput fintech platforms, and PHP / Laravel applications delivered for government, "
    "private company, and open-source engagements. Most recently built core payment platform components as "
    "Augmented Staff at bKash Limited, Bangladesh's #1 Unicorn MFS. Equally comfortable owning a Spring Boot "
    "microservice with Kafka and DynamoDB, or a Laravel codebase end-to-end — schema design, Eloquent, queues, "
    "Blade views, and RBAC. Passionate about clean architecture, system reliability, and shipping things that scale, in "
    "either stack.",
    [
        ("Core Expertise", bullets([
            "<b>Backend:</b> Java (11–21), Spring Boot, Spring MVC, Spring Security, Spring Integration, Spring Cloud, PHP, "
            "Laravel 9–12, Composer, Eloquent, Blade, Microservices, REST APIs, gRPC",
            "<b>Frontend Integration:</b> React, TypeScript, Vite, jQuery",
            "<b>Cloud &amp; DevOps:</b> AWS (EC2, S3, SNS, SQS), Docker, Kubernetes, Jenkins, GitHub Actions CI, CI/CD",
            "<b>Databases:</b> MySQL, Oracle, PostgreSQL, DynamoDB, Cassandra, Redis, JPA / Hibernate",
            "<b>Messaging:</b> Kafka, RabbitMQ, ActiveMQ, AWS SNS/SQS",
            "<b>Testing:</b> JUnit, Mockito, TestNG, Rest Assured, Postman",
            "<b>Security &amp; Auth:</b> OAuth2, JWT, KeyCloak, LDAP",
            "<b>Practices:</b> Agile/Scrum, Domain-Driven Design, Event-Driven Design, clean architecture, code review, mentoring",
        ])),
    ],
    [
        ("Senior Software Engineer – Exabyting", LOC_EXABYTING, "April 2024 – August 2026",
         "Augmented resource at bKash Limited. Built and maintained core backend services (Customer App MW, FinRec, "
         "PIN Reset MW) on Java / Spring Boot, DynamoDB, and Kafka, processing 2.5M+ transactions daily. Led the Spring "
         "Boot 2→3 migration on the PIN Reset service (javax→jakarta, AWS SDK v1→v2, Jedis→Lettuce) for zero-downtime "
         "deployment. Mentored junior engineers on best practices, release readiness, and system architecture."),
        ("Software Engineer – SELISE", LOC_SELISE, "November 2021 – April 2024",
         "Extended ThingsBoard (Java, open-source IoT platform, merged contributor) into a multi-tenant IoT middleware "
         "platform for a Swiss enterprise customer, modeling and optimizing time-series telemetry at a scale of millions of "
         "data points."),
        ("Software Engineer – Exabyting", LOC_EXABYTING, "December 2019 – November 2021",
         "Developed both Java and PHP/Laravel government and private web applications and services, including PREVENTO "
         "(a Laravel healthcare app backend) and internal Java tooling for bKash Limited. Worked as partner team with bKash "
         "Limited's Solution Engineering Team."),
    ],
    [
        ("Key Projects", [
            "<b>bKash App</b> – Consumer mobile financial app; Java 11–21 / Spring Boot (WebFlux) microservices, DynamoDB, "
            "Kafka, AWS, gRPC, Kubernetes",
            "<b>Aerotia International</b> – Laravel 12 (PHP 8.2) JSON API + Blade admin CMS, React 18/TypeScript frontend",
            "<b>Tesenso MW</b> – Multi-tenant IoT platform (extended ThingsBoard) for an EV/aerospace client",
            "<b>bKash-FinRec</b> – Financial reconciliation system with LDAP auth, custom AOP access control, SIEM audit logging",
            "<b>PIN Reset MW</b> – Spring Boot SOAP+REST middleware bridging Huawei CPS, JAXB codegen from WSDL/XSD",
            "<b>AMS</b> – Airtime Management System; automated CSV/XLS/PDF generation, SFTP operations, maker-checker "
            "approval flow, TPS-limiting service with interval-based retry",
            "<b>Aerotia Accounting</b> – Laravel 9 ledger/accounting admin portal, Blade, Docker",
            "<b>HRMS User &amp; Role Management</b> – Modular Laravel RBAC package",
            "<b>laravel-gitstamp</b> – Open-source Composer package, MIT-licensed, CI-tested across Laravel 10–12",
            "<b>PREVENTO</b> – Laravel backend for a healthcare Android app (Google Play), doctor-patient messaging, "
            "Firebase-integrated",
        ]),
        ("Key Impacts", [
            "<b>bKash App:</b> built and maintained services processing 2.5M+ transactions/day",
            "<b>AMS:</b> reduced HTTP 429 rate-limit exceptions by solo-designing and building a self-contained, "
            "single-responsibility TPS-limiting service with interval-based retry, later made dynamically configurable and "
            "scalable to support Airtime Mobile Recharge Automation",
            "<b>Spring Boot 2→3 migration:</b> led the migration on the PIN Reset service (javax→jakarta, AWS SDK v1→v2, "
            "Jedis→Lettuce) for zero-downtime deployment",
            "<b>Reactive Kafka:</b> implemented reactive Kafka integration using spring-kafka and reactor-kafka to improve "
            "throughput and resilience across core banking microservices",
            "<b>Tesenso MW:</b> extended to handle millions of IoT data points across a multi-tenant platform for an "
            "EV/aerospace client",
            "<b>API latency:</b> reduced latency by replacing REST with GraphQL for client-facing data-fetching endpoints, "
            "eliminating over-fetching and cutting round trips for nested resources",
            "<b>CI/CD:</b> cut build time from 8m 29s to 4m 56s (~42% faster) by implementing multithreaded build execution "
            "in the pipeline",
            "<b>Developer tooling:</b> built a Bash/shell pipeline streaming live logs from an AWS EC2 instance to "
            "developers' local machines, cutting log-check time by ~15 minutes per check",
        ]),
    ],
    EDUCATION,
    "Certifications &amp; Awards",
    ["Java (Intermediate), C++ (Advanced), Python (Basic) – HackerRank"] + AWARDS_FULL,
    "Open Source Contributions",
    [
        "ThingsBoard (Java, open-source IoT platform) – Pull Request #6614 (Merged)",
        "laravel-gitstamp (PHP/Laravel) – Author &amp; Maintainer, MIT-licensed, CI-tested across Laravel 10–12",
        "chatling – Framework-agnostic AI chat widget (npm), powers this portfolio's own AI assistant",
        "jmbus (Java) – Author &amp; Maintainer; JNA wrapper around the M-Bus (Meter-Bus) protocol library libmbus, "
        "grown out of Tesenso IoT platform work",
        "claude-auto-resume-command – Author &amp; Maintainer; Claude Code /auto-resume slash command plus a "
        "Stop-hook-based session guardian that auto-resumes paused sessions",
    ],
)
