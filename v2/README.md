# Towfiqul Islam — Portfolio v2

> Senior Software Engineer · Java · Spring Boot · Kafka · Distributed Systems · Fintech

[![Live](https://img.shields.io/badge/Live-towfiq--ul.github.io-6366F1?style=flat-square&logo=github)](https://towfiq-ul.github.io)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vite.dev)
[![License](https://img.shields.io/badge/License-MIT-94A3B8?style=flat-square)](#license)

Personal portfolio built with React 19, TypeScript, and Vite. Showcases 5+ years of experience designing
and shipping high-throughput distributed systems for fintech and enterprise — currently building core payment
infrastructure at **bKash**, Bangladesh's #1 mobile financial platform.

---

## Live Demo

**[towfiq-ul.github.io](https://towfiq-ul.github.io)**

Sections: Hero · Overview · Skills · Work Experience · Projects · Education · Awards · Open Source · Contact

---

## Tech Stack

| Layer | Tech |
|---|---|
| UI | React 19, TypeScript, CSS Modules |
| Build | Vite 6 |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Components | Radix UI, Shadcn primitives |
| Forms | React Hook Form, Zod |
| Email | EmailJS |
| PDF | jsPDF, pdfjs-dist |
| Notifications | Sonner |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
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
```

See [EMAILJS_SETUP.md](./EMAILJS_SETUP.md) for step-by-step instructions.

### Environment — AI Chat

The floating AI chat uses the Anthropic API.

```env
VITE_ANTHROPIC_API_KEY=your_api_key
```

### Development

```bash
npm run dev
# → http://localhost:5173
```

### Build

```bash
npm run build
# Output → dist/
```

### Preview Production Build

```bash
npm run preview
```

### Type Check

```bash
npm run typecheck
```

---

## Project Structure

```
v2/
├── public/
│   ├── favicon.svg
│   └── og-image.png          # 1200×630 Open Graph banner — required for social previews
├── src/
│   ├── components/
│   │   ├── ai/               # Floating AI chat widget
│   │   ├── navbar/
│   │   ├── particles/
│   │   ├── skill-modal/
│   │   ├── stats-chart/
│   │   ├── experience-chart/
│   │   ├── whatsapp-chat/
│   │   └── ui/               # Reusable primitives (badge, button, etc.)
│   ├── config/
│   │   ├── navigation-context.tsx
│   │   └── helper.ts
│   ├── data/
│   │   ├── portfolio-data.tsx  # ← edit this to update all content
│   │   └── project-list.tsx
│   ├── hooks/
│   │   └── use-color-scheme.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── CV.tsx
│   │   └── Contact.tsx
│   ├── styles/
│   │   ├── tokens/            # CSS custom properties (colors, spacing, typography)
│   │   ├── global.css
│   │   ├── reset.css
│   │   └── theme.css
│   ├── utils/
│   │   └── date-utils.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html                 # Meta, OG tags, JSON-LD structured data
└── package.json
```

---

## Updating Content

All portfolio content lives in **one file**: `src/data/portfolio-data.tsx`

| Export | What it controls |
|---|---|
| `personalInfo` | Name, title, email, phone, social links |
| `overview` | Summary paragraph and key highlights |
| `skills` | Skill categories and lists |
| `workExperience` | Timeline entries |
| `education` | Degrees |
| `awards` | Awards & achievements |
| `openSource` | Open source contributions |

Projects are in `src/data/project-list.tsx`.

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

The built output in `dist/` is a fully static site — deploy anywhere.

### GitHub Pages (current)

Pushes to `master` deploy automatically via GitHub Actions (`.github/workflows/`).

```bash
npm run build
# commit dist/ or let CI handle it
```

### Other platforms

| Platform | Command |
|---|---|
| Vercel | `vercel --prod` |
| Netlify | `netlify deploy --prod --dir=dist` |
| AWS S3 | `aws s3 sync dist/ s3://your-bucket --delete` |
| Cloudflare Pages | Connect repo in dashboard, build command: `npm run build`, output: `dist` |

---

## Features

- Glassmorphism dark UI with animated particle background
- Fully responsive (mobile, tablet, desktop)
- Dark / light mode
- Interactive skill modal
- Experience and stats charts (Recharts)
- Floating AI chat (Anthropic API)
- WhatsApp quick-contact widget
- EmailJS contact form
- CV download (jsPDF)
- Scroll-to-top
- Accessible components (Radix UI)

---

## License

MIT © 2018–2026 Towfiqul Islam