# GOAL — Smart Mall Interactive Proposal Site

## Success, in one sentence
An investor (or an Awwwards juror) scrolls the page once, top to bottom, and comes away feeling they watched a broadcast-quality CGI film about the Smart Mall that they controlled with their scroll wheel — and every number they saw is traceable to a source document.

## Done-criteria (each checkable by looking at something)
1. **Seven chapters exist and are scroll-driven**: exploded assembly, turntable zoning, construction phasing, typographic choreography, financial dashboard, BOQ, company profile. Check: scroll the page; each chapter animates purely from scroll position.
2. **No chapter reads `window.scrollY`**. Check: `grep -r "window.scrollY" components/chapters` returns nothing; each chapter takes a normalized `progress: 0→1` prop.
3. **Scrub-safe**: scrolling backwards produces identical states to scrolling forwards; refreshing mid-page restores correct state. Check: manual scrub test + mid-page reload.
4. **One timeline authority**: GSAP ScrollTrigger owns all scroll-linked state; Lenis smooths; no IntersectionObserver-driven animation on scroll-progressive elements. Check: code inspection of `lib/scroll`.
5. **Data traceability**: every rendered figure comes from a typed file in `/data` with a `source` field; a validation script fails the build on any `TODO_SOURCE`-tagged figure when strict mode is enabled. Check: run `npm run validate:data`.
6. **Performance budget met**: initial JS < 250 KB gzip, LCP < 2.0 s, sustained 60 fps scroll on a 2019 MBP-class machine, zero long tasks > 50 ms during scroll. Check: build output + Lighthouse + performance trace.
7. **Reduced-motion path is genuinely presentable**: `prefers-reduced-motion` swaps animation for curated stills with instant-fade text; the story still reads. Check: toggle the OS setting and scroll.
8. **Keyboard-operable chapter nav** with visible focus, semantic HTML under every canvas. Check: tab through the page.
9. **Static-screenshot composure**: a screenshot at any scroll position looks composed — text readable, layout intentional. Check: screenshots at 10 random positions.
10. **Mobile portrait is first-class**: separate portrait behavior/spec per chapter, not a squashed desktop. Check: 390 px viewport walkthrough.

## Hard constraints
- 60 fps on a 2019 MacBook Pro; frame budget wins every argument.
- Initial JS < 250 KB gzip; LCP < 2.0 s; desktop payload < 25 MB streamed per chapter.
- Native scroll — no scroll-jacking; visuals are driven by scroll position.
- Stack: Next.js (App Router) + TypeScript, GSAP ScrollTrigger, Lenis, react-three-fiber (WebGL chapters), Tailwind. Static export where possible.
- No `any`; all timing in per-chapter `timeline.ts`; no fabricated figures — `TODO_SOURCE` markers only until `/docs-source` is populated.

## Non-goals
- CMS, i18n, auth, analytics.
- True free-camera 3D exploration — cameras are authored paths.
- Server-side anything; the site is static.
- Final rendered CGI sequences in this phase — greybox first; real assets swap in per-chapter later.

## Riskiest assumption + first test
**Assumption:** scroll rhythm across seven pinned chapters can feel cinematic with native scroll and no scroll-jacking.
**Test (first, before any assets):** build the end-to-end greybox — placeholder geometry, real timing, real text — and scrub it. If the rhythm fails on greyboxes, no render will save it.
