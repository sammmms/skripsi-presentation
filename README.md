# skripsi-presentation

Mobile/tablet-first **presentation website** for the undergraduate thesis defense:

> **Studi Komparatif Kinerja Deteksi Deepfake Berbasis Arsitektur Hybrid XceptionNet–FFT terhadap Model Domain Tunggal**

Naomi Prisella · Giovanny Halimko · Samuel Onasis — Universitas Mikroskil, Medan (2026)

A static, animated slide deck (24 slides) with a left navigation sidebar, designed to be opened on a phone, tablet, or projector. Content mirrors the thesis defense script.

> **Status:** repository initialized. The application is **not scaffolded yet** — this initial commit contains the README and project metadata only. App code lands in subsequent commits.

---

## Stack (planned)

- **React 19 + Vite 7 + TypeScript**
- **Tailwind CSS v4** (`@theme` design tokens — one-file restyle)
- **Framer Motion** (slide transitions, staggered entrance, count-up) + **GSAP** (decorative loops on cover/closing)
- **lucide-react** (icons)
- **qrcode.react** (QR code to the live URL)
- **vite-plugin-pwa** (installable, works offline during the defense)
- **recharts** or lightweight custom SVG (interactive in/cross-dataset bar charts)

No backend. Deploys as a static site on **Vercel**.

## Architecture — "change once, reflects everywhere"

The deck is **data-driven**. A single discriminated-union data model drives a small set of reusable layout components and content blocks, so editing one slide's data, one theme token, or one layout updates everywhere.

```
src/
├─ types/slide.ts            # Slide discriminated union (layout = cover|bullets|figure|stats|…)
├─ data/
│  ├─ slides.ts              # SINGLE SOURCE OF TRUTH — all 24 slides + speaker notes
│  ├─ sections.ts            # 6 sections (Pendahuluan→Penutup) + colors/icons
│  └─ slidesConfig.tsx       # layout → component registry
├─ components/
│  ├─ layouts/               # one component per layout variant
│  ├─ blocks/                # reusable primitives: Bullets, Figure, StatCard, CountUp,
│  │                         #   DataTable, FlowDiagram, Quote, QRCode, BarChartBlock, Lightbox
│  ├─ Sidebar / MobileSidebar / OverviewGrid / ProgressBar / PresenterDrawer …
│  └─ SlideShell / SlideTransition
├─ hooks/                    # navigation, keyboard, swipe, wheel, hash-sync, reduced-motion
└─ index.css                 # Tailwind v4 @import + @theme tokens (the only restyle file)
```

## Features

- **Left navigation sidebar** grouped by section, with active-slide highlight and progress.
- **Navigation:** keyboard (arrows / space / Home / End), swipe (mobile), wheel (desktop), **deep-link per slide** (`#slide-id`, refresh- and share-safe).
- **Overview grid** (tap a thumbnail to jump).
- **Presenter notes drawer** (press `n`) — speaker notes are hidden from the audience.
- **Animated & attractive:** directional transitions, staggered entrance, **count-up** for key results (AUC, recall).
- **Mobile-friendly content:** tables stack to cards, pipeline diagram goes vertical, figures/tables open in a **lightbox** zoom.
- **Interactive charts** for in-/cross-dataset results; **embedded Hugging Face Spaces demo**; **QR code** to the live site.
- **Accessibility:** respects `prefers-reduced-motion`.
- **PWA:** installable and offline-capable.

## Theme

Academic dark — navy background, **cyan = spatial**, **violet = frequency**, with per-section accent colors. All tokens live in `src/index.css` `@theme`.

## Develop & deploy

```bash
npm install
npm run dev        # local dev
npm run build      # static build → dist/
npm run preview    # preview the production build
```

Deploy on **Vercel** (framework preset: Vite, build `npm run build`, output `dist`). Set env `VITE_DEPLOY_URL` to the live URL so the QR code resolves correctly. Hash-based routing means no `vercel.json` rewrites are required.

## Content & assets

- Slide content is authored from the thesis defense script (`PRESENTASI_Sidang_*.md`).
- Thesis figures are curated into `public/figures/` with stable names.
- **Note (figure mapping):** the thesis figure numbers do not match the source PNG filenames one-to-one, and the confusion-matrix / training-curve figures are not finalized yet. Slides referencing those render a labeled placeholder until the real images are dropped in.

---

🤖 Scaffolding generated with [Claude Code](https://claude.com/claude-code).
</content>
