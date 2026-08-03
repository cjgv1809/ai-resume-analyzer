# Resumind — AI Resume Analyzer (Vue 3 + Pinia)

A browser-only AI resume analyzer: upload a PDF resume and a job description, get an ATS score and detailed, actionable feedback.

## Tech stack

- **Vue 3** (`<script setup>` SFCs) + **TypeScript**
- **Pinia** for global state (wraps the [Puter.js](https://puter.com) SDK: auth, file storage, key-value store, AI chat)
- **Vue Router 4** with a global auth guard
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`)
- **Vite**
- **pdf.js** for client-side PDF → image conversion

There is no custom backend. [Puter.js](https://js.puter.com) provides browser-based auth, file storage, a key-value store, and AI chat (Claude Haiku 4.5) entirely client-side — no API keys or `.env` required.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`vue-tsc`) and build for production
- `npm run preview` — preview the production build locally
- `npm run lint` — ESLint, with `--fix`
- `npm run format` — Prettier

## Deployment

This is a static site (Vite build output only, no server) — deployed on [Vercel](https://vercel.com) as a static project:

1. [Import the GitHub repo](https://vercel.com/new) — Vercel auto-detects the Vite framework preset (build command `vite build`, output directory `dist`).
2. `vercel.json` adds the SPA rewrite rule Vue Router needs so deep links (e.g. `/upload`, `/resume/:id`) don't 404 on refresh.
3. No environment variables are needed — Puter.js handles everything client-side.

Every push to `master` redeploys automatically once the project is imported.

## Project structure

```
src/
├── components/       # Presentational components (Navbar, ResumeCard, ScoreGauge, Accordion, ...)
├── constants/         # AI prompt / response-format contract
├── lib/                # Framework-agnostic helpers (pdf2img, utils)
├── router/            # Vue Router config + global auth guard
├── stores/            # Pinia store wrapping the Puter.js SDK
├── types/              # Shared TypeScript types (Feedback, Resume, Puter SDK)
└── views/              # Route-level pages (Home, Auth, Upload, Resume, Wipe)
```
