# Resumind — AI Resume Analyzer (Vue 3 + Pinia)

A browser-only AI resume analyzer: upload a PDF resume and a job description, get an ATS score and detailed, actionable feedback.

## Tech stack

- **Vue 3** (`<script setup>` SFCs) + **TypeScript**
- **Pinia** for global state (wraps the [Puter.js](https://puter.com) SDK: auth, file storage, key-value store, AI chat)
- **Vue Router 4** with a global auth guard
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`)
- **Vite**
- **pdf.js** for client-side PDF → image conversion

There is no custom backend. [Puter.js](https://js.puter.com) provides browser-based auth, file storage, a key-value store, and AI chat (Claude 3.7 Sonnet) entirely client-side — no API keys or `.env` required.

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
