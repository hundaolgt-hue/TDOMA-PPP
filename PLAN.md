# PLAN — risk-ordered phases

Ordered by risk descending, not pipeline order. Phase 1 is the end-to-end greybox (highest risk: scroll rhythm).

## Phase 1 — End-to-end greybox (IN-SESSION) ← current
- **Risk retired:** "can native scroll + pinned chapters feel cinematic?" — the project's make-or-break.
- **Entry:** empty repo, stack decided (see ARCHITECTURE.md).
- **Exit:** all 7 chapters scroll-driven with placeholder geometry, real timing, real text; chapter nav; Lenis tuned; builds statically; scrub-safe backwards; mid-page refresh correct.
- **Cost:** ~1 session. **Delegate?** No — scroll rhythm is judgment work, never delegated.

## Phase 2 — Data layer + validation ✅ DONE (in-session)
- **Risk retired:** figures traceability; parsing `/docs-source`.
- **Delivered:** three source docs parsed (audited financial model, elemental
  BOQ, area allocation matrix). Typed `/data/*.ts` — 238 figures carry a real
  `source` locator (filename › sheet/page); only 3 remain TODO_SOURCE
  (warehouse-rent comparable + company track record, both flagged unsourced by
  the docs themselves). Every chapter reads from `/data`; nothing hardcoded.
  Project reframed to its real identity: Liiban Smart Mall, TDOMA S.C.,
  G+15 mixed-use trade complex, Merkato, Addis Ababa; ETB / IFRS.
- Parsing stayed in-session rather than delegated — the schema and the
  narrative reframing were judgment work, not mechanical extraction.

## Phase 3 — Real assets, chapter by chapter (IN-SESSION, `/loop` each)
- **Risk retired:** payload/decode performance of real sequences; WebGL poly/light budgets.
- **Entry:** assets in `/assets-raw`.
- **Progress:**
  - ✅ **Chapter 3** — real CGI construction sequence
    (TDOMA_Presentation.mp4) decoded to 203 frames @ 1280px (~14 MB),
    scroll-scrubbed on a DPR-capped canvas with a windowed loader
    (`lib/sequence`). Sourced BOQ phase data overlays in sync. Coarse-pointer
    devices get a static end-frame. Raw video kept out of git; frames
    committed as the runtime asset.
  - ☐ Chapter 1 (exploded assembly) — still greybox; needs a layered
    render/model.
  - ☐ Chapter 2 (turntable) — still greybox; needs a glTF/GLB for live WebGL.
- **Exit:** chapters 1–3 running real sequences/WebGL within budget.
- **Cost:** largest phase. **Delegate?** No — visual coherence and integration are never delegated.

## Phase 4 — Performance pass (IN-SESSION)
- **Entry:** all assets in.
- **Exit:** budget table measured green: JS < 250 KB gzip, LCP < 2.0 s, 60 fps scroll, 0 long tasks > 50 ms.
- **Cost:** ~half session. **Delegate?** No — perf is cross-cutting.

## Phase 5 — Polish pass (IN-SESSION)
- **Entry:** budgets green.
- **Exit:** load sequence with real progress, chapter-crossing transitions, hover/cursor intent, optional ambient audio toggle.
- **Cost:** ~half session. **Delegate?** No — this is where awards are decided.

## Phase 6 — Audit (`/audit`) (IN-SESSION)
- **Exit:** every GOAL.md done-criterion PASS with evidence; pre-submission checklist green.
