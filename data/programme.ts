import { src, type Sourced } from "./types";

// 3-year construction programme (CPM) — TDOMA_Construction_Programme_CPM.pdf,
// §13.3. Thirty-seven activities sequenced on construction logic and mapped to
// the ten elemental BOQ sections, so every duration traces to a priced element.
const CPM = "TDOMA_Construction_Programme_CPM.pdf";
const cpm = (loc: string) => `${CPM} › ${loc}`;

/** Week 0 of the programme = Notice to Proceed. */
export const PROGRAMME_START = new Date("2027-01-04T00:00:00Z");
export const TOTAL_WEEKS = 156;

/** Elemental sections, coloured as published on the Gantt legend. */
export const sections = [
  { id: "A", label: "Preliminaries & General", color: "#4a6076" },
  { id: "B", label: "Substructure", color: "#7a3520" },
  { id: "C", label: "Superstructure", color: "#b08d4a" },
  { id: "D", label: "External Envelope", color: "#ddc38a" },
  { id: "E", label: "Internal Divisions", color: "#8a9a72" },
  { id: "F", label: "Finishes", color: "#5b7f96" },
  { id: "G", label: "Fittings & Sanitary", color: "#8a8250" },
  { id: "H", label: "Services / MEP", color: "#5a7fa8" },
  { id: "I", label: "Specialist Systems", color: "#9a6ab0" },
  { id: "J", label: "External Works", color: "#6a9a5a" },
  { id: "K", label: "Commissioning & Handover", color: "#1a2430" },
  { id: "Z", label: "Schedule Contingency", color: "#8a7f70" },
] as const;

export type Activity = {
  code: string;
  name: string;
  /** Elemental section id (A–K, Z). */
  section: string;
  /** Earliest start, in weeks from Notice to Proceed. */
  startWk: number;
  durWk: number;
  /** Total float in weeks; 0 = on the critical path. */
  floatWk: number;
  critical: boolean;
};

// Critical-path activities carry the exact durations and finish dates published
// in Table 13.1, from which their start weeks are derived. Non-critical starts
// are read off the published Gantt (Figure 13.1) and are indicative to ±1 week;
// their durations and floats are as published.
export const activities: Activity[] = [
  { code: "A1", name: "Mobilisation & site establishment", section: "A", startWk: 0, durWk: 6, floatWk: 5, critical: false },
  { code: "A2", name: "Site enabling works (hoarding, temp utilities)", section: "A", startWk: 2, durWk: 5, floatWk: 5, critical: false },
  { code: "A3", name: "Design development, permits & approvals", section: "A", startWk: 0, durWk: 10, floatWk: 0, critical: true },

  { code: "B1", name: "Excavation & shoring", section: "B", startWk: 10, durWk: 10, floatWk: 0, critical: true },
  { code: "B2", name: "Piling & foundations", section: "B", startWk: 20, durWk: 8, floatWk: 0, critical: true },
  { code: "B3", name: "Basement 3 structure (slab, walls, columns)", section: "B", startWk: 28, durWk: 6, floatWk: 0, critical: true },
  { code: "B4", name: "Basement 2 structure", section: "B", startWk: 34, durWk: 6, floatWk: 0, critical: true },
  { code: "B5", name: "Basement 1 structure", section: "B", startWk: 40, durWk: 6, floatWk: 0, critical: true },
  { code: "B6", name: "Waterproofing & basement backfill", section: "B", startWk: 46, durWk: 4, floatWk: 0, critical: true },

  { code: "C1", name: "Podium structure (Ground–L4 frame)", section: "C", startWk: 50, durWk: 12, floatWk: 0, critical: true },
  { code: "C2", name: "Tower structure L5–L10", section: "C", startWk: 62, durWk: 15, floatWk: 0, critical: true },
  { code: "C3", name: "Tower structure L11–L15", section: "C", startWk: 77, durWk: 12, floatWk: 0, critical: true },
  { code: "C4", name: "Roof structure & crown", section: "C", startWk: 89, durWk: 4, floatWk: 14, critical: false },

  { code: "D1", name: "Podium facade & bronze-fin cladding", section: "D", startWk: 56, durWk: 10, floatWk: 39, critical: false },
  { code: "D2", name: "Tower facade — lower half (L5–L10)", section: "D", startWk: 68, durWk: 12, floatWk: 17, critical: false },
  { code: "D3", name: "Tower facade — upper half & crown signage", section: "D", startWk: 81, durWk: 10, floatWk: 0, critical: true },

  { code: "E1", name: "Basement internal fit-out (logistics/parking)", section: "E", startWk: 52, durWk: 6, floatWk: 63, critical: false },
  { code: "E2", name: "Podium internal partitions", section: "E", startWk: 63, durWk: 8, floatWk: 39, critical: false },
  { code: "E3", name: "Tower internal partitions — lower", section: "E", startWk: 79, durWk: 10, floatWk: 17, critical: false },
  { code: "E4", name: "Tower internal partitions — upper", section: "E", startWk: 91, durWk: 8, floatWk: 0, critical: true },

  { code: "F1", name: "Basement finishes", section: "F", startWk: 63, durWk: 4, floatWk: 71, critical: false },
  { code: "F2", name: "Podium finishes", section: "F", startWk: 74, durWk: 10, floatWk: 39, critical: false },
  { code: "F3", name: "Tower finishes", section: "F", startWk: 115, durWk: 14, floatWk: 0, critical: true },

  { code: "G1", name: "Fittings, sanitary & FF&E rough install", section: "G", startWk: 117, durWk: 8, floatWk: 0, critical: true },

  { code: "H1", name: "MEP first-fix — basements", section: "H", startWk: 57, durWk: 8, floatWk: 71, critical: false },
  { code: "H2", name: "MEP first-fix — podium", section: "H", startWk: 66, durWk: 10, floatWk: 39, critical: false },
  { code: "H3", name: "MEP first-fix — tower", section: "H", startWk: 99, durWk: 16, floatWk: 0, critical: true },
  { code: "H4", name: "Vertical transport (lifts / escalators)", section: "H", startWk: 95, durWk: 14, floatWk: 14, critical: false },
  { code: "H5", name: "MEP second-fix & testing", section: "H", startWk: 119, durWk: 10, floatWk: 0, critical: true },

  { code: "I1", name: "Automated logistics core (ASRS / AGV)", section: "I", startWk: 57, durWk: 10, floatWk: 60, critical: false },
  { code: "I2", name: "Hydraulic parking stackers", section: "I", startWk: 57, durWk: 8, floatWk: 60, critical: false },
  { code: "I3", name: "IoT / data backbone & smart-systems integration", section: "I", startWk: 117, durWk: 8, floatWk: 4, critical: false },

  { code: "J1", name: "External works — surface parking, loading & docks", section: "J", startWk: 62, durWk: 14, floatWk: 53, critical: false },
  { code: "J2", name: "Landscaping, signage & final external works", section: "J", startWk: 78, durWk: 6, floatWk: 53, critical: false },

  { code: "K1", name: "Integrated testing & commissioning", section: "K", startWk: 129, durWk: 6, floatWk: 0, critical: true },
  { code: "K2", name: "Snagging, defects rectification & handover", section: "K", startWk: 135, durWk: 4, floatWk: 0, critical: true },

  { code: "Z1", name: "Schedule contingency & risk buffer", section: "Z", startWk: 139, durWk: 17, floatWk: 0, critical: true },
];

export type Milestone = { id: string; label: string; date: string; month: number; wk: number };

// Table 13.2 — key milestones, mobilisation to contractual completion.
export const milestones: Milestone[] = [
  { id: "M1", label: "Notice to Proceed / mobilisation", date: "04 Jan 2027", month: 1, wk: 0 },
  { id: "M2", label: "Design & permits complete", date: "15 Mar 2027", month: 3, wk: 10 },
  { id: "M3", label: "Excavation complete", date: "24 May 2027", month: 6, wk: 20 },
  { id: "M4", label: "Basement structure complete (B3–B1 watertight)", date: "20 Dec 2027", month: 13, wk: 50 },
  { id: "M5", label: "Podium structure topped out", date: "13 Mar 2028", month: 16, wk: 62 },
  { id: "M6", label: "Tower structure topped out (L15)", date: "18 Sep 2028", month: 23, wk: 89 },
  { id: "M7", label: "Roof & crown structure complete", date: "16 Oct 2028", month: 24, wk: 93 },
  { id: "M8", label: "Building weathertight (facade complete)", date: "02 Oct 2028", month: 23, wk: 91 },
  { id: "M9", label: "MEP first-fix complete (tower)", date: "19 Mar 2029", month: 29, wk: 115 },
  { id: "M10", label: "Tower finishes complete", date: "25 Jun 2029", month: 33, wk: 129 },
  { id: "M11", label: "Specialist systems installed (logistics, parking, IoT)", date: "28 May 2029", month: 32, wk: 125 },
  { id: "M12", label: "Integrated testing & commissioning complete", date: "06 Aug 2029", month: 34, wk: 135 },
  { id: "M13", label: "Practical completion / handover", date: "03 Sep 2029", month: 35, wk: 139 },
  { id: "M14", label: "Contractual completion (incl. schedule contingency)", date: "31 Dec 2029", month: 40, wk: 156 },
];

export const programmeStats = {
  activities: src(37, cpm("§13.3.1 headline")),
  totalWeeks: src(156, cpm("§13.3.1 headline — total programme")),
  criticalActivities: src(18, cpm("§13.3.1 headline — activities on critical path")),
  contingencyWeeks: src(17, cpm("§13.3.1 headline — schedule contingency")),
  technicalWeeks: src(139, cpm("§13.3.1 honest disclosure — technical critical path")),
  capitalWorksEtb: src(4661699280, cpm("§13.3.4 cost-loaded cash-flow")),
} satisfies Record<string, Sourced<number>>;

/** Float bands, as the risk table reads them. */
export const floatBands = [
  { id: "critical", label: "Critical path", range: "0 wks", read: "Any slip delays completion one-for-one", max: 0, color: "var(--orange)" },
  { id: "low", label: "Low float", range: "1–9 wks", read: "Monitor closely — limited absorption capacity", max: 9, color: "#d99a3a" },
  { id: "moderate", label: "Moderate float", range: "10–19 wks", read: "Normal management buffer", max: 19, color: "#7fa86a" },
  { id: "high", label: "High float", range: "20+ wks", read: "Schedule-flexible, low near-term risk", max: Infinity, color: "var(--green)" },
] as const;

export const bandFor = (floatWk: number, critical: boolean) =>
  critical ? floatBands[0] : floatBands.find((b) => floatWk <= b.max) ?? floatBands[3];

export const programmeNotes = {
  method:
    "Thirty-seven activities sequenced on genuine construction logic and mapped to the ten elemental BOQ sections, so every duration and cost basis traces to a priced element rather than an assumed programme. A forward pass sets earliest start and finish; a backward pass sets the latest the project can tolerate. The difference is total float — activities with zero float sit on the critical path.",
  disclosure:
    "The technical critical path completes in 139 weeks (2.7 years). Rather than present an optimistic programme with no visible slack, an explicit 17-week schedule contingency is carried openly as the final activity, bringing contractual completion to exactly three years from mobilisation — the contingency is shown, not hidden inside padded durations.",
  drivers:
    "Two things dominate: the sequential three-level basement, where each level must be structurally complete before the next can start, and the vertical frame, which cannot get ahead of itself floor by floor. Everything downstream inherits that timing on the tower's upper floors — which is why the upper-half activities (D3, E4) are critical while their lower-half equivalents carry real float.",
  scurve:
    "Each BOQ section's cost is mapped to that section's activities in proportion to their duration, then spread evenly across each activity's own calendar span — a slow early ramp through mobilisation and substructure, the steepest draw through superstructure and envelope, and a tapering finish through fit-out and commissioning.",
  limits:
    "A planning-stage schedule prepared from the elemental BOQ and sequencing logic. It has not been tested against an appointed contractor's means, methods and resourcing, or against confirmed long-lead procurement dates for lifts, the automated logistics core, hydraulic parking stackers and imported facade components — all FX- and supply-chain-exposed. Re-issue as a formal Level 3 programme once a main contractor is appointed.",
  source: cpm("§13.3.1–13.3.7"),
} as const;

/** Week index → calendar label, for axis ticks. */
export const weekToDate = (wk: number): Date =>
  new Date(PROGRAMME_START.getTime() + wk * 7 * 86400000);
