/**
 * Local alternative to scrape-website-context.js.
 *
 * The remote scraper renders the LIVE site, so it can only run after a
 * deploy and only sees the default UI state (featured projects, skill
 * previews, collapsed responsibilities). This generator builds the same
 * WEBSITE_CONTEXT.md directly from the src/data source of truth instead:
 * no network, runs pre-push, and includes ALL content (every project,
 * every skill, full responsibility lists).
 *
 * Usage: npm run sync:local
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {
    awards,
    certifications,
    education,
    openSource,
    overview,
    personalInfo,
    skills,
    workExperience,
    writing,
} from '../src/data/portfolio-data';
import {projects} from '../src/data/project-list';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.resolve(__dirname, '../public/WEBSITE_CONTEXT.md');

const lines = [];
const push = (...ls) => lines.push(...ls, '');

push(`Title: ${personalInfo.name} — ${personalInfo.title}`);
push(`URL Source: https://${personalInfo.portfolio}/`);
push(`Generated: ${new Date().toUTCString()} (locally from src/data, full content)`);
push('Markdown Content:');

push(`# ${personalInfo.name}`, '', personalInfo.title);

push('## Professional Overview', '', '### Summary', '', overview.summary);
push('### Key Highlights', '', ...overview.highlights.map((h) => `*   ${h}`));
push('### Core Expertise', '', ...overview.expertise.map((e) => `*   ${e}`));

push('## Technical Skills');
for (const [category, list] of Object.entries(skills)) {
    push(`### ${category}`, '', list.map((s) => `\`${s}\``).join(' · '));
}

push('## Work Experience');
for (const job of workExperience) {
    push(`### ${job.title} — ${job.company}`,
        '',
        `${job.location} · ${job.type} · ${job.period}`,
        '',
        job.description);
    if (job.responsibilities.length > 0) {
        push(...job.responsibilities.map((r) => `*   ${r}`));
    }
}

push('## Projects');
for (const project of projects) {
    push(`### ${project.name}${project.featured ? ' (Featured)' : ''}`,
        '',
        project.subname,
        '',
        `Client: ${project.client}`,
        '',
        project.description);
    if (project.highlights.length > 0) {
        push(...project.highlights.map((h) => `*   ${h}`));
    }
    push(`Technologies: ${project.technologies.join(', ')}`);
    if (project.link) push(`Link: ${project.link}`);
}

push('## Writing');
for (const article of writing) {
    push(`### ${article.title}`,
        '',
        `${article.platform} — ${article.link}`,
        '',
        article.description);
}

push('## Education');
for (const edu of education) {
    push(`*   ${edu.degree} — ${edu.institution} (${edu.period})`);
}

push('## Awards & Achievements');
for (const award of awards) {
    push(`### ${award.title}`, '', award.description);
    if (award.link) push(`Link: ${award.link}`);
}

push('## Open Source Contributions');
for (const item of openSource) {
    push(`### ${item.project} (${item.status})`,
        '',
        item.description,
        '',
        `Contribution: ${item.contribution}`,
        '',
        `Link: ${item.link}`);
}

push('## Certifications');
for (const cert of certifications) {
    push(`*   ${cert.title} — ${cert.issuer}${cert.date ? ` (${cert.date})` : ''} — verify: ${cert.link}`);
}

push('## Contact',
    '',
    `*   Email: ${personalInfo.email}`,
    `*   Phone/WhatsApp: ${personalInfo.phone}`,
    `*   LinkedIn: ${personalInfo.linkedin}`,
    `*   GitHub: ${personalInfo.github}`,
    `*   Stack Overflow: ${personalInfo.stackoverflow}`,
    `*   Open source organization: Morph Technologies — https://github.com/m-tech-org`);

const markdown = lines.join('\n');
fs.writeFileSync(OUTPUT_PATH, markdown, 'utf8');
console.log(`✅ Generated ${markdown.length} characters from src/data → ${OUTPUT_PATH}`);
