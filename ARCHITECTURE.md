# ARCHITECTURE — decisions and rationale

## Scroll system (the one decision everything hangs on)
- **Single timeline authority:** GSAP ScrollTrigger computes all scroll-linked
  progress; Lenis (lerp 0.08, wheelMultiplier 0.9) smooths; both run on one
  GSAP ticker rAF loop. No second scroll library, no IntersectionObserver
  animation anywhere scroll-progressive.
- **Pinning via CSS `position: sticky`,** not ScrollTrigger pin. Rationale:
  no pin-spacer DOM mutation → zero layout shift, survives resize and
  mid-page refresh with no restore logic, and plays perfectly with static
  export. ScrollTrigger still owns progress math over each section's runway.
- **Chapter contract:** `type ChapterProps = { progress: number }` — chapters
  are pure functions of normalized progress. No chapter reads
  `window.scrollY`, holds tween state, or runs timers. This is what makes the
  page scrubbable backwards, refresh-safe, and testable at any position.
- **Timing:** every chapter's windows live in its own `timeline.ts`. No inline
  magic numbers in components.
- **Easing** is pure math (`lib/scroll/ease.ts`), not GSAP tweens — a tween has
  a clock; a pure function of progress cannot desync.

## Per-chapter pipeline choices (A = pre-rendered sequence, B = real-time WebGL)
| Chapter | Greybox today | Final pipeline | Why |
|---|---|---|---|
| 1 Exploded assembly | CSS slabs | **A** — rendered frame sequence | Fidelity (GI, DOF) matters most; camera is fixed |
| 2 Turntable zoning | CSS 3D box | **B** — r3f, baked lightmaps | Click-to-isolate needs real interactivity |
| 3 Construction phasing | DOM blocks | **A** — rendered sequence | Deterministic, volumetric-heavy |
| 4 Typography | DOM | DOM | Type is the medium |
| 5 Financial dashboard | DOM/SVG | DOM/SVG (D3 if morphs needed) | Crisp, resolution-independent, tiny |
| 6 BOQ | DOM table | DOM table | It's a table; speed and a11y win |
| 7 Company | DOM | DOM | Restraint is the design |

react-three-fiber is deliberately **not** installed in the greybox phase — it
enters in Phase 3 with chapter 2, keeping initial JS far under the 250 KB
budget while scroll rhythm is being tuned.

## Reduced motion
`prefers-reduced-motion` collapses each chapter to its curated final frame
(`progress = 1`), sections lose their scroll runway (no pinning), text reveals
become instant fades, Lenis smoothing disables. The result is a readable
single-scroll document — genuinely presentable, not a stub.

## Data traceability
All rendered figures come from typed files in `/data`, each value wrapped in
`Sourced<T>` with a `source` locator. Greybox values are tagged `TODO_SOURCE`;
`npm run validate:data:strict` fails while any remain. No component hardcodes
a number.

## Static export
`output: "export"` — the site is fully static; no server anywhere.
