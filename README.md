# Ravi Sarode — Portfolio

A dark, dashboard-inspired personal portfolio for Ravi Sarode, Senior Software
Engineer / Full Stack .NET Developer. Built with plain HTML5, CSS3 and vanilla
JavaScript — no build step, no framework, ready to deploy straight to GitHub
Pages.

## Design concept

The site borrows its visual language from the observability tooling Ravi
works with every day (Grafana panels, service status dots, event pipelines):

- **Hero** — an animated architecture diagram showing the real shape of his
  stack (Angular/React → ASP.NET Core gateway → C# services → RabbitMQ/Kafka →
  SQL Server/PostgreSQL → Grafana/Loki/Prometheus), with packets pulsing along
  the connections.
- **Status dots** throughout signal whether something is `live` (current
  role, production systems) or `archived` (past roles, retired projects) —
  the same mental model as a service-health dashboard.
- **Palette** — near-black slate background, teal-cyan for "healthy/active",
  amber for secondary emphasis.
- **Type** — Space Grotesk for display headings, Inter for body copy,
  JetBrains Mono for labels, eyebrows and data.

## Project structure

```
.
├── index.html              # all page content/markup
├── styles.css               # design tokens + all styling
├── script.js                 # reveal-on-scroll, typing effect, particles, nav
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── images/
│   │   └── favicon.svg
│   └── resume/
│       ├── Ravi_Sarode_Resume.docx
│       └── Ravi_Sarode_Resume.pdf   # linked from the Download Résumé buttons
└── README.md
```

## Content notes

Everything on the page is sourced directly from Ravi's résumé
(`assets/resume/Ravi_Sarode_Resume.pdf`). Two placeholders were left
intentionally rather than invented:

- **Testimonials** — replaced with a "references available on request" note,
  since no real quotes were supplied.
- **Profile photo** — the hero uses the architecture diagram as its visual
  anchor instead of a headshot placeholder. Swap in a real photo by adding an
  `<img>` inside `.hero__copy` and restyling to taste.
- **Open-source project card** — reserved as a placeholder for a future public
  repo; replace or delete the `.project-card--placeholder` block in
  `index.html` once one exists.

## Running locally

No build tooling required. Either:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then open `http://localhost:8000`.

## Deploying to GitHub Pages

1. Create a new GitHub repository (for a user/organization site, name it
   exactly `<your-username>.github.io`; for a project site, any name works).
2. Push this folder's contents to the repository root:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then **Save**.
6. GitHub will publish the site at:
   - `https://<your-username>.github.io` (if the repo is named
     `<your-username>.github.io`), or
   - `https://<your-username>.github.io/<your-repo>` (for a project repo).
7. Update `index.html`'s `<link rel="canonical">`, the Open Graph `og:url`,
   and `sitemap.xml` / `robots.txt` with your final published URL.

No further configuration, backend, or environment variables are needed — the
whole site is static.

## Performance & accessibility

- No external JS frameworks; two Google Fonts requests, everything else is
  inline SVG/CSS.
- All interactive elements are keyboard-reachable with visible focus rings.
- Animations respect `prefers-reduced-motion` (particles, typing effect and
  scroll reveals fall back to a static state).
- Semantic HTML landmarks (`header`, `main`, `section`, `footer`) and
  descriptive `aria-label`s on icon-only links.

## Customizing

- **Colors / fonts / spacing** — all defined as CSS custom properties at the
  top of `styles.css` under `:root`.
- **Content** — edit directly in `index.html`; sections are clearly labelled
  with HTML comments (`<!-- ============ SECTION ============ -->`).
- **Contact form** — currently submits via `mailto:`, which opens the
  visitor's email client (no backend). To capture submissions server-side,
  swap the form's `action`/`method` for a form backend (e.g. Formspree,
  Getform) or a custom API endpoint.
