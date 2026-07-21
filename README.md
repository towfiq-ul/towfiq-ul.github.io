# Towfiqul Islam — Portfolio

> Senior Software Engineer · Java · Spring Boot · Kafka · Distributed Systems · Fintech

[![Live](https://img.shields.io/badge/Live-towfiq--ul.github.io-6366F1?style=flat-square&logo=github)](https://towfiq-ul.github.io)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vite.dev)
[![License](https://img.shields.io/badge/License-MIT-94A3B8?style=flat-square)](#license)

Source for [Towfiqul Islam's](https://towfiq-ul.github.io) personal portfolio site, deployed via GitHub Pages.
Built with React 19, TypeScript, and Vite. Showcases 7+ years of experience designing and shipping
high-throughput distributed systems for fintech and enterprise — currently building core payment
infrastructure at **bKash**, Bangladesh's #1 mobile financial platform.

---

## Live Demo

**[towfiq-ul.github.io](https://towfiq-ul.github.io)**

Sections: Hero · Overview · Skills · Work Experience · Projects · Writing · Education · Awards · Open Source · Contact

---

## Repository layout

| Path | What it is |
|---|---|
| `src/`, `public/`, `index.html` | The site itself (React 19 + TypeScript + Vite). |
| `workers/` | Cloudflare Worker (`ai-proxy.js`) that proxies the AI chat widget — holds the real API key/model as Worker secrets, never exposed to the browser. |
| `build/` | Generated output (Vite build), served by GitHub Pages from `master`. Gitignored — never hand-edited, rebuilt on every push. |
| `scripts/` | Build-time helper scripts (e.g. regenerating `public/WEBSITE_CONTEXT.md`). |
| `prompts/` | Scaffolding-tool prompt docs — several are stale (see `CLAUDE.md`). |
| `article/` | A published Medium engineering write-up on the AI chat's architecture, kept in-repo for reference (not part of the build). |

---

## Tech Stack

| Layer | Tech |
|---|---|
| UI | React 19, TypeScript, CSS Modules |
| Build | Vite 7 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Components | Radix UI, Shadcn primitives |
| Forms | React Hook Form, Zod |
| Email | EmailJS |
| PDF | jsPDF, pdfjs-dist |
| AI chat | [chatling](https://www.npmjs.com/package/chatling) widget engine + a Cloudflare Worker proxy |
| Notifications | Sonner |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
# or: make install
```

### Environment — Email (Contact Form)

The contact form uses EmailJS. Without this configured it degrades gracefully — the form shows an error,
everything else on the site still works.

```bash
cp .env.example .env
```

Fill in `.env`:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_RECEIVER_EMAIL=your_receiver_email
```

### Environment — AI Chat

The floating AI chat widget calls a Cloudflare Worker proxy (`workers/ai-proxy.js`), which holds the real
model API key as a Worker secret — never in frontend env vars. Point the frontend at your deployed Worker:

```env
VITE_AI_PROXY_URL=https://your-worker.your-subdomain.workers.dev
VITE_OPEN_AI_MODEL=your-model-id
VITE_OPEN_AI_TEMPERATURE=0.5
```

See `deploy.sh` and `workers/wrangler.toml` for one-time Worker secret setup (`wrangler secret put`).

### Development

```bash
npm run start
# → http://localhost:3000

# or, to also run the AI proxy Worker locally (wrangler dev):
make run
```

### Build

```bash
npm run build
# tsc (typecheck) && vite build → output: ./build
```

### Preview Production Build

```bash
make preview
```

### Type Check Only

```bash
make typecheck
```

See `make help` for the full list of available commands (install, run, build, sync, worker-dev,
worker-tail, deploy, release, etc.).

---

## Project Structure

```
.
├── public/
│   ├── favicon.svg
│   ├── og-image.png            # 1200×630 Open Graph banner — required for social previews
│   ├── RULESET.md              # AI chat system prompt / persona rules
│   └── WEBSITE_CONTEXT.md      # generated AI chat context (npm run sync:local)
├── src/
│   ├── components/
│   │   ├── ai/                 # Floating AI chat widget
│   │   ├── navbar/
│   │   ├── particles/
│   │   ├── skill-modal/
│   │   ├── stats-chart/
│   │   ├── experience-chart/
│   │   ├── whatsapp-chat/
│   │   └── ui/                 # Reusable primitives (badge, button, etc.)
│   ├── config/
│   │   ├── navigation-context.tsx
│   │   └── helper.tsx
│   ├── data/
│   │   ├── portfolio-data.tsx  # ← edit this to update most content
│   │   └── project-list.tsx
│   ├── hooks/
│   │   ├── use-color-scheme.tsx
│   │   └── use-toast.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── CV.tsx
│   │   └── Contact.tsx
│   ├── styles/
│   │   ├── tokens/              # CSS custom properties (colors, spacing, typography)
│   │   ├── global.css
│   │   ├── reset.css
│   │   └── theme.css
│   ├── utils/
│   │   └── date-utils.tsx       # experience/duration formatting helpers
│   ├── App.tsx
│   └── main.tsx
├── workers/
│   ├── ai-proxy.js              # Cloudflare Worker — AI chat proxy
│   └── wrangler.toml
├── scripts/                     # WEBSITE_CONTEXT.md generation/scraping
├── index.html                   # Meta, OG tags, JSON-LD structured data
├── vite.config.ts
├── Makefile                     # `make help` for all workflows
└── package.json
```

---

## Updating Content

Most portfolio content lives in **one file**: `src/data/portfolio-data.tsx`

| Export | What it controls |
|---|---|
| `personalInfo` | Name, title, email, phone, social links |
| `summary` | Summary paragraph and key highlights |
| `skills` | Skill categories and lists |
| `workExperience` | Timeline entries |
| `education` | Degrees |
| `awards` | Awards & achievements |
| `openSource` | Open source contributions |
| `writing` | Medium articles |

Projects are in `src/data/project-list.tsx`.

Adding a new Home-page section also requires registering its `id` in both the `sections` array and
`navItems` in `src/components/navbar/navbar.tsx` — see `CLAUDE.md` for details.

---

## SEO & Social Preview

`index.html` includes:
- `<meta name="description">` — crawled by Google
- Open Graph tags (`og:title`, `og:description`, `og:image`) — LinkedIn, Facebook previews
- Twitter Card tags — Twitter/X previews
- `application/ld+json` Person schema — Google rich results
- `<noscript>` static fallback — ensures content is indexed even without JS execution

**The `og:image` at `public/og-image.png` must exist** for social previews to render.
Recommended size: 1200×630 px. Verify after deploy at [opengraph.xyz](https://www.opengraph.xyz).

---

## Deployment

`.github/workflows/deploy.yml` runs on every push/PR to `master`: installs deps, runs `npm run build`
(outputs to `./build`), and deploys `build/` to GitHub Pages via `actions/deploy-pages`. There's no
separate staging environment — pushing to `master` ships to production.

The Cloudflare Worker (AI proxy) deploys separately and is **not** part of the GitHub Pages pipeline:

```bash
make deploy
```

---

## Features

- Glassmorphism dark UI with animated particle background
- Fully responsive (mobile, tablet, desktop)
- Dark / light mode
- Interactive skill modal
- Experience and stats charts (Recharts)
- Floating AI chat assistant, grounded in resume/CV/site content, backed by a hardened Cloudflare Worker proxy —
  starts closed with a chatling-powered greeting nudge, matching chatling's default timing/cooldown
- Writing section linking out to published Medium engineering deep-dives
- WhatsApp quick-contact widget
- EmailJS contact form
- CV download (jsPDF)
- Scroll-to-top
- Accessible components (Radix UI)

---

## License

MIT © 2018–2026 Towfiqul Islam — see [LICENSE](./LICENSE).
