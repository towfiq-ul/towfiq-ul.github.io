"""Regenerate cv/*Cover_Letter*.pdf.

Matches the header/style of cv/build_cv.py so cover letters and CVs look like
one set. Add a new `build_letter(...)` call per target (generic, per-company).
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.colors import HexColor

OUT_DIR = "/home/towfiq/workspace/towfiq-ul.github.io/cv"

styles = getSampleStyleSheet()

name_style = ParagraphStyle(
    "NameStyle", parent=styles["Normal"], fontName="Helvetica-Bold",
    fontSize=22, leading=26, spaceAfter=2,
)
contact_style = ParagraphStyle(
    "ContactStyle", parent=styles["Normal"], fontName="Helvetica",
    fontSize=9.5, leading=13, spaceAfter=1,
)
body_style = ParagraphStyle(
    "BodyStyle", parent=styles["Normal"], fontName="Helvetica",
    fontSize=10, leading=15, spaceAfter=9, alignment=TA_LEFT,
)
sign_style = ParagraphStyle(
    "SignStyle", parent=body_style, spaceAfter=1,
)

CONTACT = [
    'Email: <a href="mailto:towfiq.106@gmail.com">towfiq.106@gmail.com</a> | Phone: '
    '<a href="tel:+8801823923023">+8801823923023</a>',
    'Portfolio: <a href="https://towfiq-ul.github.io">https://towfiq-ul.github.io</a> | GitHub: '
    '<a href="https://github.com/towfiq-ul">https://github.com/towfiq-ul</a>',
]


def build_letter(filename, paragraphs, greeting="Dear Hiring Manager,"):
    doc = SimpleDocTemplate(
        os.path.join(OUT_DIR, filename), pagesize=A4,
        leftMargin=17 * mm, rightMargin=17 * mm, topMargin=15 * mm, bottomMargin=15 * mm,
        title=f"Towfiqul Islam - {filename}",
    )
    story = [Paragraph("Towfiqul Islam", name_style)]
    for line in CONTACT:
        story.append(Paragraph(line, contact_style))
    story.append(Spacer(1, 14))
    story.append(Paragraph(greeting, body_style))
    for para in paragraphs:
        story.append(Paragraph(para, body_style))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Sincerely,", sign_style))
    story.append(Paragraph("Towfiqul Islam", sign_style))
    doc.build(story)
    print("wrote", filename)


# ---------------------------------------------------------------------------
# Generic, Laravel-forward cover letter (no company / role named)
# ---------------------------------------------------------------------------
build_letter(
    "Towfiqul_Islam_Cover_Letter_Laravel.pdf",
    [
        "I'm a Senior Software Engineer with 7+ years building and maintaining backend systems, and I'm "
        "writing to express my interest in a senior Laravel / PHP engineering role on your team. I've "
        "delivered production Laravel applications end-to-end &ndash; schema design, Eloquent, queues and "
        "service providers, Blade, RBAC, and deployment tooling &ndash; alongside a primary career in "
        "Java / Spring Boot microservices for high-throughput fintech, so I bring both Laravel fluency and "
        "the reliability discipline that comes from systems where downtime is measured in lost transactions.",

        "On the Laravel side, I built Aerotia International's public platform end-to-end: a Laravel 12 "
        "(PHP 8.2) JSON API and Blade admin CMS paired with a React/TypeScript frontend. I built Aerotia "
        "Accounting, a Laravel 9 ledger and accounting portal with full CRUD, dashboards, and admin-user "
        "management on a Dockerized stack (MySQL, Mailpit, Adminer); the Laravel backend for PREVENTO, a "
        "healthcare Android app on Google Play with personalized care plans and doctor&ndash;patient "
        "messaging over MySQL, AWS, and Firebase; modular Laravel RBAC drop-in modules for an HRMS; and "
        "government systems including an Annual Confidential Report generator for the Ministry of ICT. I also "
        "author and maintain <b>laravel-gitstamp</b>, an open-source Composer package that is MIT-licensed "
        "and CI-tested across Laravel 10&ndash;12 &ndash; so I keep real Laravel code green in CI, not just "
        "running locally.",

        "The scale and reliability instincts come from fintech. At Exabyting I work as an augmented resource "
        "on bKash Limited's core payment platform &ndash; Bangladesh's #1 mobile financial service &ndash; "
        "building and maintaining queue- and job-centric backend services (Customer App MW, FinRec, PIN "
        "Reset MW) that process 2.5M+ transactions daily. I designed and solo-built a self-contained "
        "TPS-limiting service with interval-based retry that eliminated HTTP 429 rate-limit failures against a "
        "third-party API, later making it dynamically configurable so it could scale to power airtime recharge "
        "automation &ndash; the kind of resilience work that matters when data ingestion from external APIs "
        "is business-critical. I led a framework major-version migration across live services with zero "
        "downtime, and I lean on observability and log tooling to track and debug systems after they ship.",

        "On how I work: I use agentic coding tools (Claude Code, Cursor) day to day in real production "
        "codebases, and I treat the review step as the real work &ndash; I don't ship code I can't explain. "
        "I've worked fully remote and async before, extending an open-source IoT platform into multi-tenant "
        "middleware for a Swiss enterprise client at SELISE, including direct client-facing discussions across "
        "timezones. Outside client work I build and ship things I actually use &ndash; a RAG pipeline over S3 "
        "documents, and an npm chat-widget package that powers the AI assistant on my own portfolio &ndash; "
        "because I care about finishing what I start and about code that holds up once real users depend on it.",

        "I'd welcome the chance to discuss how my Laravel and backend experience could contribute to your "
        "team. Thank you for your time and consideration.",
    ],
)
