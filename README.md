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
├── styles.css               # design tokens + all styling (incl. Ansh widget)
├── script.js                 # reveal-on-scroll, typing effect, particles, nav, contact form
├── ansh.js                   # Ansh chatbot client (floating widget, fetch to /api/ansh)
├── api/
│   └── ansh.js              # Vercel serverless function — Groq proxy + system prompt
├── package.json              # tells Vercel this is a Node project
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

**Heads up:** the Ansh chatbot (bottom-right floating button) only works in
environments that can serve `/api/ansh` — i.e. on Vercel. Locally you can
preview the UI but the bot will show an "offline" message. To test the
function locally, run `npx vercel dev` (requires a free Vercel account and
`GROQ_API_KEY` set in `.env.local` — see [Set up Ansh](#set-up-ansh) below).

## Deploying to Vercel (recommended — required for Ansh)

GitHub Pages can still host the static files, but the chatbot needs a
serverless function, so the cleanest path is to deploy the whole site to
[Vercel](https://vercel.com) — it's free for personal sites and one repo
becomes one deploy.

1. Push this folder to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Leave the framework preset as **Other**. Vercel auto-detects
   `api/ansh.js` as a serverless function.
4. Click **Deploy**. Your site is live at `https://<project-name>.vercel.app`.
5. (Optional) Add a custom domain in **Settings → Domains**.

To redeploy after edits, just `git push` — Vercel rebuilds automatically.

## Deploying to GitHub Pages (no chatbot)

If you want to keep GitHub Pages and skip the chatbot, either:

- Delete `ansh.js`, the `<script src="ansh.js">` line in `index.html`, and
  the `api/` folder before pushing — the site works as a pure static page.
- Or keep them all; Ansh will just show an "offline" fallback message when
  it can't reach `/api/ansh`. The rest of the site is unaffected.

Follow the original GitHub Pages steps in
[this commit's README](https://github.com/ravidsarode/ravidsarode.github.io)
if you go that route.

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
- **Contact form** — submits via [FormSubmit](https://formsubmit.co) directly
  to `ravidsarode@gmail.com` (no backend needed). On first submission
  FormSubmit sends an activation email — click the link once and you're set.
- **Ansh chatbot knowledge** — edit the `ANSH_SYSTEM_PROMPT` constant at the
  top of `api/ansh.js`. Anytime you update the résumé or want Ansh to know
  about a new project, change the system prompt and redeploy.

## Set up Ansh

Ansh is a small chatbot floating in the bottom-right of the site. It can
answer questions about your work, stack, current role, and background. It
runs on [Groq](https://console.groq.com)'s free tier (very fast, very
cheap — well within portfolio traffic).

**One-time setup:**

1. Sign up at [console.groq.com](https://console.groq.com) (free).
2. **API Keys → Create new key** → copy it.
3. In Vercel, go to your project → **Settings → Environment Variables**.
4. Add:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `<paste the key>`
   - **Environments:** Production, Preview, Development (all three).
5. **Deployments → ⋯ → Redeploy** (env vars only apply to new deploys).
6. Open the live site, click the cyan Ansh button bottom-right, and ask
   "Where do you work?" — you should get a real answer.

**Local testing** (optional):

```bash
# In the project root
echo "GROQ_API_KEY=<your_key>" > .env.local
npx vercel dev
```

The site runs on `http://localhost:3000` with `/api/ansh` working. The key
in `.env.local` is gitignored automatically by Vercel.
