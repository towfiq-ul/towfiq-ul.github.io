/**
 * (Re)builds the AI assistant's RAG index: splits the portfolio content into
 * heading-aware chunks and sends them to the Worker's /ingest route, which
 * embeds them (Workers AI) and upserts them into Vectorize.
 *
 * Sources: public/WEBSITE_CONTEXT.md and public/Towfiqul_Islam.md (regenerated
 * from src/data by `npm run sync:local`, which `rag:ingest` runs first) and the
 * CV (src/data/cv-content.ts).
 *
 * Usage:
 *   npm run rag:ingest              # needs RAG_INGEST_URL + RAG_INGEST_TOKEN in .env
 *   npm run rag:ingest -- --dry-run # print the chunks, send nothing
 */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {CV_MARKDOWN} from '../src/data/cv-content';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const read = (p) => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');

const SOURCES = [
    {key: 'site', name: 'WEBSITE_CONTEXT.md', markdown: read('public/WEBSITE_CONTEXT.md')},
    {key: 'kb', name: 'Towfiqul_Islam.md', markdown: read('public/Towfiqul_Islam.md')},
    {key: 'cv', name: 'cv.md', markdown: CV_MARKDOWN},
];

const TARGET_CHARS = 1200; // merge small sibling sections up to this
const MAX_CHARS = 2000;    // split long sections past this
const STALE_ID_WINDOW = 200; // ids past the new count that get deleted (left over from bigger past runs)

/** Split markdown into sections by heading, keeping the heading path as context. */
function sections(markdown) {
    const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, ''); // drop front matter
    const stack = [];
    const out = [];
    let current = {path: '', parent: '', lines: []};

    for (const line of body.split('\n')) {
        const m = line.match(/^(#{1,6})\s+(.*)$/);
        if (m) {
            if (current.lines.join('').trim()) out.push(current);
            const level = m[1].length;
            stack.length = level - 1;
            stack[level - 1] = m[2].trim();
            const trail = stack.filter(Boolean);
            current = {path: trail.join(' › '), parent: trail.slice(0, -1).join(' › '), lines: []};
        } else {
            current.lines.push(line);
        }
    }
    if (current.lines.join('').trim()) out.push(current);
    return out.map((s) => ({...s, text: s.lines.join('\n').trim()}));
}

/** Pack sections into retrieval-sized chunks: merge small siblings, split long ones. */
function chunk(source) {
    const chunks = [];
    let buffer = null;

    const flush = () => {
        if (buffer) chunks.push(buffer);
        buffer = null;
    };

    for (const section of sections(source.markdown)) {
        const piece = `## ${section.path}\n${section.text}`;

        if (piece.length > MAX_CHARS) {
            flush();
            let part = '';
            for (const para of section.text.split(/\n{2,}/)) {
                if (part && part.length + para.length > MAX_CHARS) {
                    chunks.push({heading: section.path, text: `## ${section.path}\n${part.trim()}`});
                    part = '';
                }
                part += para + '\n\n';
            }
            if (part.trim()) chunks.push({heading: section.path, text: `## ${section.path}\n${part.trim()}`});
            continue;
        }

        if (buffer && buffer.parent === section.parent && buffer.text.length + piece.length <= TARGET_CHARS) {
            buffer.text += `\n\n${piece}`;
        } else {
            flush();
            buffer = {heading: section.path, parent: section.parent, text: piece};
        }
    }
    flush();

    return chunks.map((c, i) => ({id: `${source.key}-${i}`, source: source.name, heading: c.heading, text: c.text}));
}

const all = SOURCES.flatMap(chunk);
const deleteIds = SOURCES.flatMap((s) => {
    const count = all.filter((c) => c.source === s.name).length;
    return Array.from({length: STALE_ID_WINDOW}, (_, i) => `${s.key}-${count + i}`);
});

for (const s of SOURCES) {
    const mine = all.filter((c) => c.source === s.name);
    const avg = Math.round(mine.reduce((n, c) => n + c.text.length, 0) / (mine.length || 1));
    console.log(`${s.name}: ${mine.length} chunks (avg ${avg} chars)`);
}

if (process.argv.includes('--dry-run')) {
    for (const c of all) console.log(`\n--- ${c.id} · ${c.heading}\n${c.text.slice(0, 300)}${c.text.length > 300 ? '…' : ''}`);
    process.exit(0);
}

const url = process.env.RAG_INGEST_URL || process.env.VITE_AI_PROXY_URL;
const token = process.env.RAG_INGEST_TOKEN;
if (!url || !token) {
    console.error('Set RAG_INGEST_URL (or VITE_AI_PROXY_URL) and RAG_INGEST_TOKEN in .env — the token must match the Worker\'s INGEST_TOKEN secret.');
    process.exit(1);
}

const res = await fetch(`${url.replace(/\/+$/, '')}/ingest`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    body: JSON.stringify({chunks: all, deleteIds}),
});
const result = await res.json().catch(() => ({}));
if (!res.ok) {
    console.error(`Ingest failed (HTTP ${res.status}):`, result);
    process.exit(1);
}
console.log(`Indexed ${result.upserted} chunks (cleared up to ${result.deleted} stale ids).`);
