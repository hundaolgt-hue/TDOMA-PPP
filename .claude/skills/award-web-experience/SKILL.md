---
name: award-web-experience
description: Build high-end, award-caliber interactive websites — scroll-driven narrative sites, WebGL and 3D experiences, cinematic scrollytelling, image-sequence scrubbing, and animated data storytelling. Use this skill whenever the user wants a site that is "premium", "award winning", "Awwwards-level", "cinematic", "buttery smooth", "immersive", or "high-end", or whenever they describe scroll-triggered animation, a 3D model on a page, an exploded-view or turntable presentation, or an animated dashboard — even if they just say "make it look really impressive" and never name a technique.
---

# Award-Caliber Interactive Web Experience

Awards are won on *coherence and craft*, not effect count. A site with three perfectly-tuned interactions beats one with twenty adequate ones. Every instruction here serves that.

## The order of operations (do not reorder)

1. **Narrative spine** — write the chapter list and the single sentence each chapter must land. If a section has no sentence, it has no reason to exist.
2. **Scroll choreography on greybox** — placeholder shapes, real timing. Tune the rhythm here. This is the highest-leverage hour of the entire project and the one everyone skips.
3. **Type and grid system** — before any 3D. The typography carries the "expensive" feeling more than the render does.
4. **Assets in, one chapter at a time.**
5. **Performance pass.**
6. **Polish pass** — cursor, transitions, micro-states, sound.

## Scroll architecture

**One timeline authority.** GSAP ScrollTrigger owns all scroll-linked state. Lenis provides smoothing. Never run a second scroll library, never mix in IntersectionObserver-driven animation for anything scroll-progressive — the two will desync at different scroll velocities and the desync is exactly what reads as "cheap".

Each chapter exposes:
```ts
type ChapterProps = { progress: number } // normalized 0→1, nothing else
```
Chapters must be renderable at any arbitrary progress value with no history — this makes them scrubbable backwards, testable in isolation, and resilient to fast scrolling and anchor jumps.

**Lenis tuning.** Defaults feel generic. Start at `lerp: 0.08, wheelMultiplier: 0.9` and tune by feel on a real trackpad. Too low reads as laggy; too high loses the glide. Disable smoothing entirely on touch — native momentum is better than any emulation.

**Pinning.** Pin the visual, scroll the text past it. Pinned sections should be 200–400vh; longer than 400vh and users feel trapped. Always provide a chapter nav so the pin is escapable.

## Image sequence scrubbing

The technique behind most "how is this so smooth" reactions.

- Windowed loading: hold ±30 frames around current position, evict beyond ±90.
- Decode off the main thread — `createImageBitmap` or WebCodecs. Never assign to `img.src` inside a scroll handler.
- Draw to a single `<canvas>` sized to `devicePixelRatio` capped at 2.
- Round progress→frame with a stable mapping and skip the draw if the frame index is unchanged. Most scroll frames are duplicate frames; drawing them is pure waste.
- Preload frame 0 as a static poster so there is never an empty canvas.

## WebGL discipline

- Bake lighting. Real-time GI is not the trade. Baked lightmaps plus a good HDRI env read as more cinematic than a live three-point setup at a tenth the cost.
- Draco + Meshopt compression; target < 150k triangles for a hero building.
- Cap DPR at 2. Render on demand (`frameloop="demand"`) and invalidate only when progress changes — a static building should cost zero GPU.
- Dispose geometries and materials on chapter unmount. Leaks here kill long-session performance.

## Typography and motion

- Two typefaces maximum. A high-contrast display face for chapter titles, a neutral grotesk for body. Type scale on a fixed ratio, `clamp()` everywhere.
- Text animation: mask-reveal from below by line, 0.6–0.9s, `power3.out`, 40–60ms stagger. Never animate individual letters for body copy — it reads as a template.
- Number counters ease out and land on the exact value; never let a counter overshoot a financial figure.
- **Everything scroll-linked shares the master timeline.** Text on its own timer while the 3D is on scroll is the most common tell of an amateur build.

## Data storytelling

Animated charts must animate *meaningfully* — the transition should show the data changing, not just the chart appearing. Waterfall bars grow from their baseline in sequence; line charts draw along the path; sensitivity toggles morph between states rather than cross-fading. Every chart needs an accessible table equivalent.

## Performance budget (enforce, don't aspire)

| Metric | Budget |
|---|---|
| Initial JS (gzip) | 250 KB |
| LCP | < 2.0s |
| Sustained scroll FPS | 60 (55 floor on mid-tier) |
| Total desktop payload | < 25 MB, streamed per chapter |
| Long tasks during scroll | 0 over 50ms |

Assets for chapter N+1 begin loading only after chapter N is interactive.

## Accessibility (also an awards jury criterion)

- `prefers-reduced-motion`: swap sequences for a curated still per chapter, keep the text reveals as instant fades. This path must be genuinely presentable.
- Semantic HTML underneath every canvas. Chapter nav is keyboard-operable with visible focus.
- Contrast holds against the darkest and lightest frame of any sequence the text sits over.

## The polish pass — where awards are actually decided

- Custom cursor that responds to context — but only if it does something; decorative cursors are a penalty now.
- Page-load sequence that shows real progress, not a fake bar. Reveal on genuine readiness.
- Hover states with intent — magnetic buttons, subtle scale, considered easing curves.
- Optional muted-by-default ambient audio with a persistent, obvious toggle.
- Chapter transitions that carry an element across the boundary rather than cutting.

## Pre-submission checklist

Scroll fast → no tearing. Scroll backwards → identical states. Refresh mid-page → correct state restored. Resize during a pin → no broken layout. Throttle to 4G → still comprehensible. Reduced motion → still tells the story. Screenshot at any scroll position → looks composed.
