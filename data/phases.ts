import { src, SRC, type Sourced } from "./types";

export type ConstructionPhase = {
  id: string;
  label: string;
  /** BOQ element letters this phase delivers (chapter 3 ↔ chapter 6). */
  boqElements: string[];
  costEtb: Sourced<number>;
};

// Temporal build sequence, each stage costed from its BOQ elements
// (BOQ Summary, elemental A–J). Preliminaries (element A) span the whole
// programme and are shown as a baseline band, not a discrete stage.
export const constructionPhases: ConstructionPhase[] = [
  { id: "substructure", label: "Substructure & basements", boqElements: ["B"], costEtb: src(616199550, SRC.boq("Summary › B")) },
  { id: "superstructure", label: "Superstructure frame", boqElements: ["C"], costEtb: src(637545000, SRC.boq("Summary › C")) },
  { id: "envelope", label: "External envelope", boqElements: ["D"], costEtb: src(421106280, SRC.boq("Summary › D")) },
  { id: "divisions", label: "Internal divisions", boqElements: ["E"], costEtb: src(146718000, SRC.boq("Summary › E")) },
  { id: "mep", label: "MEP & specialist systems", boqElements: ["H", "I"], costEtb: src(1343619060, SRC.boq("Summary › H + I")) },
  { id: "finishing", label: "Finishes, fittings & external", boqElements: ["F", "G", "J"], costEtb: src(521815800, SRC.boq("Summary › F + G + J")) },
];

// Preliminaries & general (element A) — spans the whole build.
export const preliminaries = src(377096310, SRC.boq("Summary › A Preliminaries & General"));

// Total construction works (BOQ A–J) and programme duration.
export const totalConstructionEtb = src(4064100000, SRC.boq("Summary › TOTAL CONSTRUCTION WORKS"));
export const constructionMonths = src(36, SRC.fin("Assumptions › Construction period"));

// Annual S-curve draw across the 3 construction years (Returns sheet, row 3).
export const constructionScurve: { year: string; drawPct: Sourced<number> }[] = [
  { year: "Year 1", drawPct: src(25.93, SRC.fin("Returns › S-curve draw C1")) },
  { year: "Year 2", drawPct: src(48.15, SRC.fin("Returns › S-curve draw C2")) },
  { year: "Year 3", drawPct: src(25.93, SRC.fin("Returns › S-curve draw C3")) },
];

/** Element letter → phase id, for the BOQ ↔ phasing cross-link. */
export const elementToPhase: Record<string, string> = {
  A: "substructure", // preliminaries shown against the first stage
  B: "substructure",
  C: "superstructure",
  D: "envelope",
  E: "divisions",
  F: "finishing",
  G: "finishing",
  H: "mep",
  I: "mep",
  J: "finishing",
};
