# towfiq-ul.github.io

Source for [Towfiqul Islam's](https://towfiq-ul.github.io) personal portfolio site, deployed via GitHub Pages.

## Repository layout

| Path | What it is |
|---|---|
| `v2/` | **Active site.** React 19 + TypeScript + Vite, plus a Cloudflare Worker (`v2/workers/`) that proxies the site's AI chat widget. See [`v2/README.md`](./v2/README.md) for setup, scripts, and content editing. |
| `v1/` | Legacy static HTML/CSS/JS version, kept for archival purposes. Not under active development. |
| `build/` | Generated output of `v2` (Vite build), served by GitHub Pages from `master`. Never hand-edited — rebuilt on every push. |

## Deployment

Pushes to `master` trigger `.github/workflows/deploy.yml`, which builds `v2/` and publishes `build/` to GitHub Pages. There's no separate staging environment.

## License

MIT — see [LICENSE](./LICENSE).
