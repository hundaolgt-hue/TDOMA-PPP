import { src, SRC, type Sourced } from "./types";

export type Zone = {
  id: string;
  label: string;
  /** Zone accent for the turntable illumination + legend. */
  color: string;
  areaSqm: Sourced<number>;
  sharePct: Sourced<number>;
};

// Net GLA by programme cluster — Area Allocation Matrix, page 4 ("Net GLA by
// program cluster"). Thirteen clusters, total 21,004 m². Colours are a design
// choice; areas and shares are sourced.
export const zones: Zone[] = [
  { id: "retail", label: "Retail", color: "#e8b04b", areaSqm: src(4160, SRC.area("p4 cluster table")), sharePct: src(19.8, SRC.area("p4 cluster table")) },
  { id: "events", label: "Events & MICE", color: "#d66a5a", areaSqm: src(3084, SRC.area("p4 cluster table")), sharePct: src(14.7, SRC.area("p4 cluster table")) },
  { id: "office", label: "Commercial office", color: "#5aa7d6", areaSqm: src(2592, SRC.area("p4 cluster table")), sharePct: src(12.3, SRC.area("p4 cluster table")) },
  { id: "wholesale", label: "Wholesale", color: "#c98b3a", areaSqm: src(2220, SRC.area("p4 cluster table")), sharePct: src(10.6, SRC.area("p4 cluster table")) },
  { id: "trade", label: "Trade services", color: "#6fb3a8", areaSqm: src(1864, SRC.area("p4 cluster table")), sharePct: src(8.9, SRC.area("p4 cluster table")) },
  { id: "culture", label: "Culture & gastronomy", color: "#b07acc", areaSqm: src(1840, SRC.area("p4 cluster table")), sharePct: src(8.8, SRC.area("p4 cluster table")) },
  { id: "hospitality", label: "Hospitality", color: "#9a6ad6", areaSqm: src(1728, SRC.area("p4 cluster table")), sharePct: src(8.2, SRC.area("p4 cluster table")) },
  { id: "hq", label: "Corporate / HQ", color: "#5a7fd6", areaSqm: src(864, SRC.area("p4 cluster table")), sharePct: src(4.1, SRC.area("p4 cluster table")) },
  { id: "business", label: "Business & convening", color: "#7d8a99", areaSqm: src(864, SRC.area("p4 cluster table")), sharePct: src(4.1, SRC.area("p4 cluster table")) },
  { id: "civic", label: "Community & civic", color: "#5ad68f", areaSqm: src(544, SRC.area("p4 cluster table")), sharePct: src(2.6, SRC.area("p4 cluster table")) },
  { id: "arrival", label: "Arrival & circulation", color: "#8f9aa6", areaSqm: src(500, SRC.area("p4 cluster table")), sharePct: src(2.4, SRC.area("p4 cluster table")) },
  { id: "rooftop", label: "Rooftop / cultural", color: "#d6a15a", areaSqm: src(400, SRC.area("p4 cluster table")), sharePct: src(1.9, SRC.area("p4 cluster table")) },
  { id: "enterprise", label: "Enterprise & digital", color: "#6ad6c4", areaSqm: src(344, SRC.area("p4 cluster table")), sharePct: src(1.6, SRC.area("p4 cluster table")) },
];

export const totalNetGla = src(21004, SRC.area("p3/p4 TOTAL NET GLA"));

export type BuildingLayer = {
  id: string;
  label: string;
  callout: string;
  /** Tied to the BOQ element that funds this system (chapter 1 ↔ BOQ). */
  costEtb: Sourced<number>;
};

// Exploded-assembly system stack (top of the stack first), per the chapter-1
// spec: smart → electrical → façade → frame → basement. Each layer's cost is
// the BOQ element that delivers it (BOQ Summary, elemental A–J).
export const buildingLayers: BuildingLayer[] = [
  { id: "smart", label: "Smart & network systems", callout: "Data/cloud node, cashless access-control, IoT & BMS backbone (BOQ I)", costEtb: src(543934690, SRC.boq("Summary › I Specialist Systems")) },
  { id: "electrical", label: "Electrical & MEP", callout: "HVAC, LV distribution, lifts, escalators, fire systems (BOQ H)", costEtb: src(799684370, SRC.boq("Summary › H Services / MEP")) },
  { id: "facade", label: "External envelope", callout: "Unitised curtain walling, cladding, entrance portals (BOQ D)", costEtb: src(421106280, SRC.boq("Summary › D External Envelope")) },
  { id: "frame", label: "Structural frame", callout: "RC columns, beams, transfer structure, suspended slabs (BOQ C)", costEtb: src(637545000, SRC.boq("Summary › C Superstructure")) },
  { id: "basement", label: "Substructure & basements", callout: "3 basement levels, raft, retaining walls, tanking (BOQ B)", costEtb: src(616199550, SRC.boq("Summary › B Substructure")) },
];

// Massing metrics — Area Allocation Matrix, page 5 ("Massing metrics").
export const massing = {
  plotAreaSqm: src(5000, SRC.area("p5 massing")),
  aboveGradeGrossSqm: src(28800, SRC.area("p5 massing")),
  basementGrossSqm: src(9000, SRC.area("p5 massing")),
  totalHeightM: src(72.8, SRC.area("p5 massing")),
  farRatio: src(5.8, SRC.area("p5 massing")),
  storeys: src(15, SRC.area("p1 header: G+15")),
} satisfies Record<string, Sourced<number>>;
