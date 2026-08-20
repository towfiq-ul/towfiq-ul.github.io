/**
 * Generates public/Towfiqul_Islam.md — the markdown "knowledge doc" fed into
 * the AI chat widget's grounding context (see src/components/ai/ai-chat.tsx) —
 * directly from the src/data source of truth, the same way
 * generate-website-context.js builds WEBSITE_CONTEXT.md. Keeps this file from
 * drifting out of sync with portfolio-data.tsx / project-list.tsx (e.g. dates,
 * responsibilities) since it's no longer hand-maintained.
 *
 * Usage: npm run sync:local
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {
    awards,
    education,
    openSource,
    overview,
    personalInfo,
    skills,
    workExperience,
} from '../src/data/portfolio-data';
import {projects} from '../src/data/project-list';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.resolve(__dirname, '../public/Towfiqul_Islam.md');

// Curated subset of professional (client) projects to highlight here, beyond
// the featured ones already covered by WEBSITE_CONTEXT.md / the portfolio UI.
const MAJOR_PROJECT_NAMES = ["Tesenso MW", "FDPS", "Urstamm", "Agent App MW", "MULTIBANK", "PREVENTO"];

const lines = [];
const push = (...ls) => lines.push(...ls, '');

push('---',
    `name: ${personalInfo.name}`,
    `title: ${personalInfo.title}`,
    'location: Dhaka, Bangladesh',
    `email: ${personalInfo.email}`,
    `phone: ${personalInfo.phone}`,
    `whatsapp: ${personalInfo.whatsapp}`,
    `portfolio: https://${personalInfo.portfolio}`,
    `linkedin: ${personalInfo.linkedin}`,
    `github: ${personalInfo.github}`,
    `stackoverflow: ${personalInfo.stackoverflow}`,
    '---');

push(`# ${personalInfo.name}`);

push('## Professional Summary', '', overview.summary);

push('## Career Highlights', '', ...overview.highlights.map((h) => `- ${h}`));

push('## Core Expertise', '', ...overview.expertise.map((e) => `- ${e}`));

push('# Work Experience');
for (const job of workExperience) {
    push(`## ${job.title}`,
        '',
        `${job.company} — ${job.location}  `,
        `${job.period}  `,
        `Type: ${job.type}`,
        '',
        job.description);
    if (job.responsibilities.length > 0) {
        push('### Responsibilities', '', ...job.responsibilities.map((r) => `- ${r}`));
    }
}

push('# Major Projects');
for (const name of MAJOR_PROJECT_NAMES) {
    const project = projects.find((p) => p.name === name);
    if (!project) continue;
    push(`## ${project.name}`,
        '',
        `Client: ${project.client}`,
        '',
        `Tech: ${project.technologies.join(', ')}`,
        '',
        project.description);
    if (project.highlights.length > 0) {
        push(...project.highlights.map((h) => `- ${h}`));
    }
}

push('# Education');
for (const edu of education) {
    push(`- ${edu.degree} — ${edu.institution} (${edu.period})`);
}

push('# Awards & Achievements');
for (const award of awards) {
    push(`- ${award.title} — ${award.description}`);
}

push('# Open Source Contributions');
for (const item of openSource) {
    push(`## ${item.project} (${item.status})`, '', `${item.contribution} — ${item.link}`);
}

push('# AI Indexing Keywords', '', [...new Set(Object.values(skills).flat())].join(', '));

const markdown = lines.join('\n').trimEnd() + '\n';
fs.writeFileSync(OUTPUT_PATH, markdown, 'utf8');
console.log(`✅ Generated ${markdown.length} characters from src/data → ${OUTPUT_PATH}`);
