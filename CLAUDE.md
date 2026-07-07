# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

Static single-page personal portfolio for Ravi Sarode (Senior Software Engineer / Full Stack .NET Developer). Pure HTML5 + CSS3 + vanilla JS — no framework, no build step, no package manager, no tests, no linter configured. Designed to deploy to GitHub Pages as-is.

## File layout

- `index.html` — all page markup, all content, inline SVG for the hero architecture diagram and social icons
- `styles.css` — CSS custom-property design tokens at `:root`, then all section/component styles
- `script.js` — vanilla JS for: footer year, mobile nav toggle, hero role-typer, scroll-reveal IntersectionObserver, stat-card counter animation, hero canvas particle field, scroll-driven status bar border, contact-form mailto UX
- `favicon.svg` — site favicon (referenced as `assets/images/favicon.svg` in HTML but the file lives at repo root — see Known inconsistencies)
- `Ravi_Sarode_Resume.pdf` — résumé linked from the hero and resume-section Download buttons
- `robots.txt`, `sitemap.xml` — SEO
- `README.md` — full design rationale, content-source notes, deploy instructions, customization guide

## Common commands

There is no build, lint, or test step. To preview locally, serve the folder with any static server:

```bash
python -m http.server 8000
# or, if you don't have Python on Windows
npx serve .
```

On Windows, `python3` is often shadowed by a Microsoft Store stub and won't run — use `python` (or the `py` launcher) instead. Then open `http://localhost:8000`. To deploy, follow the GitHub Pages steps in `README.md` (push to `main`, enable Pages from root).

## Architecture / how the pieces fit together

**Design system** — `:root` in `styles.css` defines all tokens (colors, fonts, radius, transition easing, container width). When changing the look, edit tokens there first; component CSS uses `var(--…)` throughout. No preprocessor, no Tailwind.

**Layout** — fixed top status bar (`<header class="statusbar">`) + `<main>` containing one `<section>` per topic in this order: hero → about → stack → experience → projects → ai → certifications → resume → references → contact, then `<footer>`. Section anchors in the nav match section IDs.

**Status dots** — `dot--live` (pulsing cyan) = current role / production system, `dot--amber` (pulsing amber) = secondary emphasis, `dot--muted` (flat gray) = archived/past. This visual language is the site's core metaphor (dashboard/observability) and is referenced throughout the README.

**Hero diagram** — inline SVG in `index.html` (`#archSvg`) showing Angular/React → ASP.NET Core → C# services → RabbitMQ/Kafka → SQL Server/PostgreSQL → Grafana/Loki/Prometheus. Edges and motion are SMIL (`<animateMotion>` on `<circle>` packets), not JS — so the diagram runs even if `script.js` fails. The hero's ambient particle field, by contrast, is canvas + JS in `script.js`.

**JS behaviors** — all in `script.js`, no modules, no build. Each block is a top-level IIFE-style snippet guarded with feature detection. Every animation falls back to a static state when `prefers-reduced-motion: reduce` is set.

**Contact form** — submits via `mailto:` with `enctype="text/plain"`; opens the visitor's email client, no backend. `script.js` only updates a confirmation note after submit. README documents the path to swap in a form backend.

## Customization hotspots

- **Design tokens** — `:root` block at the top of `styles.css`
- **Content** — edit `index.html` directly; sections are delimited by `<!-- ============ SECTION ============ -->` comments
- **Roles typed in the hero** — the `roles` array at the top of `script.js`
- **Live/archived/draft status of any item** — swap the `dot--*` class on the relevant `.dot` element

## Known inconsistencies

- The favicon lives at `favicon.svg` in the repo root, but `index.html` references `assets/images/favicon.svg` and `README.md` describes an `assets/` tree (with `assets/images/favicon.svg` and `assets/resume/Ravi_Sarode_Resume.pdf`) that does not exist on disk. The PDF is also at the repo root, not under `assets/resume/`. The page works in browsers because the missing-favicon request silently fails and the PDF link resolves at the root, but the paths should be reconciled before the next change.
- The README's deploy steps and Open Graph/sitemap URLs assume a publish target at `https://ravidsarode.github.io/` — confirm those before edits meant to ship.
