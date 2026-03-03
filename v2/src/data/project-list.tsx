export const projects = [
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