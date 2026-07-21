type Project = {
    name: string;
    subname: string;
    client: string;
    technologies: string[];
    description: string;
    highlights: string[];
    link?: string;
    featured?: boolean;
};

export const projects: Project[] = [
    {
        name: "bKash App",
        subname: "bkash App for bKash Limited. Mobile Financial Service",
        client: "bkash Limited (via Exabyting)",
        technologies: [
            "Java (Spring Boot)",
            "Spring Boot Web Flux",
            "Spring Boot Web Client",
            "DynamoDB",
            "Redis",
            "Kafka",
            "AWS - S3, EC2, SNS, SQS",
            "gRPC",
            "REST API",
            "Localstack",
            "Docker",
            "Kubernetes"
        ],
        description:
            "bKash is a leading mobile financial service in Bangladesh that allows users to perform instant money transfers, bill payments, mobile recharges, and merchant transactions securely from their smartphones.",
        highlights: [
            "Built and maintained scalable microservices using Java (11–21) and Spring Boot, exposing RESTful APIs and integrating third-party services",
            "Implemented modern concurrency solutions, including Virtual Threads and reactive programming",
            "Developed full-stack features using Thymeleaf for dynamic UI rendering",
            "Integrated and managed AWS services (EC2, S3, SNS, SQS) for cloud-based deployments",
            "Worked with DynamoDB, optimizing data access and performance",
            "Designed systems with clean architecture principles and maintainable code practices",
            "Improved system resilience using Circuit Breaker, TimeLimiter, and fault-tolerant design",
            "Collaborated in Agile teams, contributing to sprint planning, code reviews, and production support",
            "Built internal tools and automation utilities to improve developer productivity",
            "Performed performance tuning, debugging, and optimization for high-traffic applications",
            "Migrated Spring Boot 2 → 3 services, handling javax → jakarta transition, JAXB upgrades, and AWS SDK v1 → v2 migration",
            "Rewrote DynamoDB layer using DynamoDBEnhancedClient, implementing GSI queries and custom AttributeConverters",
        ],
        link: "https://play.google.com/store/apps/details?id=com.bKash.customerapp&hl=en",
        featured: true,
    },
    {
        name: "Tesenso MW",
        subname: "An IoT Based Project",
        client: "Tesenso (via SELISE)",
        technologies: [
            "Java (Spring Boot)",
            "PostgreSQL",
            "Cassandra",
            "TimescaleDB",
            "Kafka",
            "RabbitMQ",
            "Redis",
            "Angular",
            "WebSocket",
            "MQTT",
            "CoAP",
            "SNMP",
        ],
        description:
            "An IoT project developed for a company that produces electrical vehicles and spaceships. Multi-tenant and multi-role-based platform handling millions of data points. Extended ThingsBoard with custom features, implemented MBUS decoder, designed custom rule nodes, and orchestrated Swisscom integration.",
        highlights: [
            "Handles millions of IoT data points",
            "Multi-tenant architecture",
            "Real-time WebSocket updates",
            "Custom rule nodes for enhanced functionality",
            "Optimized time-series data handling",
        ],
        link: "https://tesenso.ch",
        featured: true,
    },
    {
        name: "AI Query System from S3 Data",
        subname: "RAG-based natural language search over S3 documents",
        client: "Personal Project — Open Source",
        technologies: ["Python", "RAG", "OpenSearch (Vector Search)", "Embeddings", "AWS S3", "LLM Integration"],
        description:
            "A RAG pipeline that answers natural-language queries over documents stored in S3 — chunking, embeddings, vector search, and LLM-grounded answers. Public repository, documented end-to-end in an accompanying Medium deep-dive.",
        highlights: [
            "Public, verifiable repository on GitHub",
            "Full RAG pipeline: chunking → embeddings → vector search → grounded answers",
            "Written up as a Medium engineering deep-dive",
        ],
        link: "https://github.com/towfiq-ul/ai-query-system-from-s3-data",
        featured: true,
    },
    {
        name: "laravel-gitstamp",
        subname: "Deploy-time git version stamping for Laravel",
        client: "Morph Technologies (m-tech-org) — Open Source",
        technologies: ["PHP (Laravel)", "Composer", "GitHub Actions CI"],
        description:
            "Authored and maintained Laravel package that generates a deploy-time version stamp (date + short git SHA) with helpers to display it in your app. MIT-licensed, CI-tested across Laravel 10–12 with runtime support back to Laravel 9.",
        highlights: [
            "Author and maintainer, published under the m-tech-org organization",
            "CI matrix across Laravel 10, 11, and 12",
            "MIT-licensed and installable via Composer",
        ],
        link: "https://github.com/m-tech-org/laravel-gitstamp",
        featured: true,
    },
    {
        name: "Aerotia International",
        subname: "CMS-driven corporate website for an aviation & marine solutions distributor",
        client: "Aerotia International — Freelance (Morph Technologies)",
        technologies: ["PHP (Laravel 12)", "React 18", "TypeScript", "Vite", "MySQL"],
        description:
            "CMS-driven public website for Aerotia International, an authorized distributor of aviation and marine solutions. Laravel 12 (PHP 8.2) JSON API with a Blade-based admin/CMS for managing content, and a React 18 + TypeScript frontend — delivered end-to-end as a freelance engagement under Morph Technologies (m-tech-org).",
        highlights: [
            "Live, public client delivery",
            "Laravel 12 REST API + admin CMS managing all site content",
            "React 18 + TypeScript + Vite frontend, independently deployed",
        ],
        link: "https://aerotia.com",
        featured: true,
    },
    {
        name: "Aerotia Accounting",
        subname: "Ledger/accounting admin portal for Aerotia International",
        client: "Aerotia International — Freelance (Morph Technologies)",
        technologies: ["PHP (Laravel 9)", "MySQL", "Blade", "Vite", "Docker"],
        description:
            "Laravel 9 ledger/accounting tool for Aerotia International tracking organizations, projects, and project costs, with a server-rendered Blade admin panel — CRUD for organizations, projects, cost types, and costs, plus a dashboard and admin-user management.",
        highlights: [
            "Full admin panel with dashboard and cost tracking",
            "Dockerized local dev (MySQL, Mailpit, Adminer)",
            "Dogfoods the self-authored laravel-gitstamp package",
        ],
        featured: true,
    },
    {
        name: "HRMS — User & Role Management",
        subname: "Modular Laravel RBAC modules",
        client: "Morph Technologies (m-tech-org)",
        technologies: ["PHP (Laravel)", "MySQL", "REST API"],
        description:
            "Modular Laravel implementation of user management and role management with full RBAC — self-contained drop-in modules with their own controllers, repositories, services, policies, form requests, migrations, and seeders, wired via service providers.",
        highlights: [
            "Full RBAC: roles, permissions, and policies",
            "Drop-in module architecture with service providers",
            "Layered repository/service design",
        ],
    },
    {
        name: "FDPS",
        subname: "Financial Document Processing System",
        client: "IMTF (via SELISE)",
        technologies: ["Java (Apache Camel)", "Kafka", "Active MQ"],
        description:
            "A financial document processing system providing a proxy route system for a renowned financial organization, making their workflow more efficient.",
        highlights: ["Automated document processing", "Proxy routing system", "High-volume transaction handling"],
    },
    {
        name: "Urstamm",
        subname: "Swiss Date Wood with Digital Proof of Origin",
        client: "Switzerland-based Digital Solution Company (via SELISE)",
        technologies: ["Java 11", "Spring Boot", "Web3J", "PostgreSQL", "Spring Batch", "Blockchain"],
        description:
            "A project focusing on sustainable wood sourcing with blockchain integration for secure data storage. Achieved 20% performance enhancement and developed comprehensive batch process pipeline for legacy data migration.",
        highlights: [
            "Blockchain integration for data integrity",
            "20% performance improvement",
            "Supply chain visualization",
            "Fault-tolerant transaction system",
            "0.5GB legacy data migration to blockchain",
        ],
    },
    {
        name: "Agent App MW",
        subname: "bK-MFS Agent App Middleware",
        client: "bK-MFS Limited",
        technologies: ["Java (Spring Boot)", "DynamoDB", "AWS", "Firebase"],
        description:
            "Middleware service supporting bK-MFS Agent App, one of the most popular financial apps for bK-MFS Agents. Implemented Pay Bill service integration.",
        highlights: ["Core product of bK-MFS Limited", "High-availability architecture", "AWS cloud infrastructure"],
        link: "https://play.google.com/store/apps/details?id=com.bkash.businessapp&hl=en",
    },
    {
        name: "AMS",
        subname: "Airtime Management System (AMS)",
        client: "bK-MFS Limited",
        technologies: ["Java (Spring Boot)", "Oracle", "JavaScript"],
        description:
            "Internal web application for automated airtime management. Features automated CSV/XLS/PDF generation, financial calculations, and email notifications.",
        highlights: [
            "Automated SFTP operations",
            "Maker-checker approval flow",
            "Async email notifications",
            "Logback integration",
        ],
    },
    {
        name: "Saving-DPS",
        subname: "Saving-DPS",
        client: "bK-MFS Limited",
        technologies: ["Java (Spring Boot)", "MySQL", "AWS", "JavaScript"],
        description: "Internal service for bK-MFS App allowing customers to open DPS (Deposit Pension Scheme) accounts.",
        highlights: ["Customer-facing feature", "Integrated with bK-MFS App", "Secure financial transactions"],
    },
    {
        name: "MULTIBANK",
        subname: "MULTIBANK",
        client: "bK-MFS Limited",
        technologies: ["Java (Spring Boot)", "Spring Integration", "MySQL", "jQuery"],
        description:
            "Internal web application for automated bank transactions. Features SFTP inbound/outbound, configurable email notifications, and maker-checker approval flow.",
        highlights: [
            "Automated SFTP operations",
            "Multi-bank integration",
            "Async email system",
            "Financial report generation",
        ],
    },
    {
        name: "PREVENTO",
        subname: "PREVENTO",
        client: "Exabyting",
        technologies: ["PHP (Laravel)", "MySQL", "AWS", "jQuery", "Google Analytics", "Firebase"],
        description:
            "Healthcare app creating personalized health care plans based on user information (gender, age, height, weight, diagnosed illnesses, risk factors). Includes doctor messaging feature.",
        highlights: [
            "Personalized healthcare plans",
            "Doctor-patient messaging",
            "Monthly task assignments",
            "Medical partner integration",
        ],
        link: "https://play.google.com/store/apps/details?id=com.nihs.prevento",
    },
    {
        name: "HR ACR",
        subname: "HR ACR",
        client: "Ministry of ICT",
        technologies: ["PHP (Laravel)", "MySQL", "Docker", "jQuery"],
        description: "Application for Ministry of ICT for generating Annual Confidential Report of employees.",
        highlights: ["Government project", "Automated report generation", "Employee performance tracking"],
    },
    {
        name: "IMS - Inventory Management System",
        subname: "IMS - Inventory Management System",
        client: "Electoral Training Institute",
        technologies: ["PHP (Laravel)", "MySQL", "Docker", "jQuery"],
        description:
            "Inventory management system for managing different types of products, stock, purchases, and tracking distributed items.",
        highlights: ["Complete inventory tracking", "Purchase management", "Distribution tracking"],
    },
];