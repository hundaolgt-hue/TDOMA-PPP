# Master Prompt — Smart Mall Interactive Proposal Site

Paste this into Claude Code at the root of an empty repo, after dropping your assets into `/assets-raw/` and your documents into `/docs-source/`.

---

## Role

You are the lead engineer and technical art director for an award-targeted (Awwwards SOTD / FWA) scrollytelling website presenting a **Smart Mall** development proposal. The site must feel like a broadcast-quality CGI film that the user scrubs with their scroll wheel — not a website with videos stuck in it.

## Non-negotiable quality bar

- **60fps on a 2019 MacBook Pro.** Every frame budget decision defers to this.
- **Zero layout shift, zero jank on scroll.** No scroll-jacking that steals the user's momentum; the page scrolls natively and the visuals are *driven by* scroll position.
- **Graceful degradation:** full experience → reduced-motion static-frame experience → text/document fallback. All three must be genuinely presentable to an investor.
- **Accessible:** `prefers-reduced-motion` respected, real semantic HTML underneath, keyboard-navigable chapter nav, all figures have text equivalents.
- **Mobile is a first-class deliverable,** not an afterthought. Portrait renders are a separate asset track, not a squashed desktop one.

## Core architectural decision (make this first, then commit)

Two viable pipelines. Evaluate and choose per-chapter, then document the choice in `ARCHITECTURE.md`:

**A. Pre-rendered image sequence / video scrub** (recommended for chapters 1, 2, 3)
- Offline-rendered frames from the DCC tool → encoded to a scrub-optimized format.
- Pros: unlimited visual fidelity — GI, ray-traced glass, volumetrics, DOF. Deterministic performance.
- Cons: heavy payload, fixed camera path, no true interactivity.
- Implementation: frames at 24–30fps, keyframe-dense H.265/AV1 or WebP/AVIF sequence chunks. Decode via `WebCodecs` where available; fall back to a canvas-drawn image sequence with a windowed preloader (load ±N frames around current scroll position, evict the rest).

**B. Real-time WebGL** (recommended for chapter 2 highlighting, and any hover/click interactivity)
- glTF/Draco/Meshopt-compressed model, baked lightmaps, matcaps or a light PBR setup.
- Pros: interactive, tiny payload relative to frames, resolution-independent.
- Cons: needs aggressive poly budget and baked lighting to look cinematic.

**Hybrid is expected.** Chapters 1 and 3 as rendered sequences; chapter 2 as live WebGL so section highlighting can respond to clicks; financial dashboard as pure DOM/SVG.

## Stack

- Next.js (App Router) + TypeScript, static export where possible
- GSAP + ScrollTrigger for scroll orchestration (single global timeline authority — do not mix scroll libraries)
- Lenis for smoothed scroll (tuned, not defaulted — bad lerp values are the #1 cause of "cheap" feel)
- react-three-fiber + drei for the WebGL chapters
- Motion (Framer Motion) only for DOM micro-interactions; GSAP owns anything scroll-linked
- Recharts or D3 for the financial dashboard (D3 if the charts need custom morph transitions)
- Tailwind for layout, CSS custom properties for the design token system

## Chapter spec

Build each as an isolated, independently-testable `<Chapter>` module with a normalized `progress: 0→1` input. No chapter may read `window.scrollY` directly.

1. **Exploded assembly** — building separates into structural frame → façade → electrical → smart/network systems → basement reveal. Each layer has a labeled callout that fades in at its own sub-progress window.
2. **Programmatic rotation** — building rotates on a turntable; retail / anchor / F&B / entertainment / parking / BOH zones illuminate in sequence with per-zone color coding. Clicking a legend item isolates that zone.
3. **Construction phasing** — excavation → substructure → superstructure → envelope → MEP fit-out → finishing, with a synchronized timeline scrubber.
4. **Typographic choreography** — text is scroll-linked to the same master timeline as the 3D, never on independent timers. Split-text reveals, mask-wipes, number counters. Text must be readable in a static screenshot at any scroll position.
5. **Financial dashboard** — animated counters, cash-flow waterfall, IRR/NPV/payback, sensitivity toggles, revenue mix. Numbers animate on enter and are driven by a single typed data file (`data/financials.ts`), never hardcoded in components.
6. **BOQ** — sortable/filterable quantities table cross-linked to chapter 3: hovering a construction phase highlights its BOQ line items and vice versa.
7. **Company profile** — track record, team, delivered projects. Restrained; this is the one chapter that should feel calm.

## Content pipeline

Parse everything in `/docs-source/` into typed data files under `/data/`. Every number rendered on screen traces to a source document. Add a `source` field to each data record and surface it in a build-time validation script that fails the build on orphaned figures.

## Repo layout

```
/app                 routes, chapter composition
/components/chapters one folder per chapter
/components/ui       nav, legend, scrubber, cursor
/lib/scroll          Lenis + ScrollTrigger setup, progress normalization
/lib/sequence        frame loader, decode, cache eviction
/data                financials, boq, program, phases, company
/public/frames       encoded sequences (git-lfs or CDN)
/scripts             asset encode, data validation, perf budget check
ARCHITECTURE.md      decisions + rationale
```

## Process

1. Read `PLAN.md` if present. If not, run `/goal` first and write it.
2. Build a **greybox** end-to-end: all seven chapters, placeholder geometry, real scroll timing, real text. Ship this before any polish. The scroll rhythm is the product; get it right while it's cheap to change.
3. Only then swap in real assets, one chapter at a time, running `/loop` on each.
4. Enforce budgets continuously: initial JS < 250KB gzipped, LCP < 2.0s, first chapter interactive before any later chapter's assets begin loading.

## Rules

- Never fabricate a financial figure, quantity, or project credential. If it's not in `/docs-source/`, leave a typed `TODO_SOURCE` marker that fails validation.
- Commit after each chapter reaches greybox and again after it reaches final.
- No `any`. No inline magic numbers for timing — all timing lives in a per-chapter `timeline.ts`.
