import { src, type Sourced } from "./types";

// Massing concept & program configuration — client-supplied massing sheet.
// Cluster areas, plot/FAR/height metrics already live in data/program.ts and
// are reused there rather than re-keyed here, so the two can never diverge.
const SHEET = "TDOMA_Massing_Concept_Sheet";
const sheet = (loc: string) => `${SHEET} › ${loc}`;

/** A single occupied level in the program stack, roof → basement. */
export type StackLevel = {
  id: string;
  /** Level tag as printed on the sheet (Roof, L15 … G, B1 … Surface). */
  level: string;
  use: string;
  /** Net GLA in m² for the level (basements/surface are gross programme area). */
  areaSqm: number;
  /** Which massing band the level belongs to — drives colour + grouping. */
  band: "roof" | "tower" | "podium" | "basement" | "surface";
};

export const stackLevels: StackLevel[] = [
  { id: "roof", level: "Roof", use: "Crown Pavilion & Sky Lounge", areaSqm: 400, band: "roof" },
  { id: "l15", level: "L15", use: "Events, Banquet & Sky Dining", areaSqm: 864, band: "tower" },
  { id: "l14", level: "L14", use: "TDOMA HQ — Executive Offices", areaSqm: 864, band: "tower" },
  { id: "l13", level: "L13", use: "Hotel Amenities & Sky Restaurant / Hotel Rooms", areaSqm: 864, band: "tower" },
  { id: "l12", level: "L12", use: "Hotel Guest Rooms", areaSqm: 864, band: "tower" },
  { id: "l11", level: "L11", use: "Business Centre / Trade Forum / Secretariat", areaSqm: 864, band: "tower" },
  { id: "l10", level: "L10", use: "Coffee & Commodity Centre / Lab / Incubator / Academy", areaSqm: 864, band: "tower" },
  { id: "l9", level: "L9", use: "Trade Finance / Insurance / Customs / Arbitration", areaSqm: 864, band: "tower" },
  { id: "l8", level: "L8", use: "Commercial Office Suites 3", areaSqm: 864, band: "tower" },
  { id: "l7", level: "L7", use: "Commercial Office Suites 2", areaSqm: 864, band: "tower" },
  { id: "l6", level: "L6", use: "Commercial Office Suites 1", areaSqm: 864, band: "tower" },
  { id: "l5", level: "L5", use: "One-Stop Govt. / Chapel / Clinic / Childcare / Traders’ Lounge", areaSqm: 864, band: "tower" },
  { id: "l4", level: "L4", use: "Expo / AGM Hall / Banquet", areaSqm: 2220, band: "podium" },
  { id: "l3", level: "L3", use: "Wholesale Showrooms & Trade Desks", areaSqm: 2220, band: "podium" },
  { id: "l2", level: "L2", use: "Electronics Retail / Food Hall", areaSqm: 2220, band: "podium" },
  { id: "l1", level: "L1", use: "Textiles Retail / Museum / Artisan Market", areaSqm: 2220, band: "podium" },
  { id: "g", level: "G", use: "Prime Retail / Lobby / Banking", areaSqm: 2220, band: "podium" },
  { id: "b1", level: "B1", use: "Hydraulic-Stacked Parking", areaSqm: 3000, band: "basement" },
  { id: "b2", level: "B2", use: "Automated Logistics (ASRS / AGV)", areaSqm: 3000, band: "basement" },
  { id: "b3", level: "B3", use: "Bonded Storage / Data Backbone", areaSqm: 3000, band: "basement" },
  { id: "surface", level: "Surface", use: "Site Works & External Programs", areaSqm: 2000, band: "surface" },
];

/** Gross GFA by massing band, as bracketed on the stack diagram. */
export const bands = [
  { id: "roof", label: "Roof", note: "Crown", grossSqm: 600, color: "#d6a15a" },
  { id: "tower", label: "Tower", note: "L5–L15", grossSqm: 13200, color: "#9a8fd6" },
  { id: "podium", label: "Podium", note: "G–L4", grossSqm: 15000, color: "#6fb87f" },
  { id: "basement", label: "Basements", note: "B1–B3", grossSqm: 9000, color: "#8f9bb0" },
  { id: "surface", label: "Surface site works", note: "", grossSqm: 2000, color: "#b9c7ae" },
] as const;

/** The four programme families the sheet groups the clusters into. */
export const families = [
  { id: "trading", label: "Trading engine", detail: "Retail, wholesale & trade services", sharePct: 40 },
  { id: "enterprise", label: "Enterprise & capital", detail: "Finance, HQ, offices, community & culture", sharePct: 29 },
  { id: "hospitality", label: "Hospitality & events", detail: "Hotel, events & dining", sharePct: 23 },
  { id: "civic", label: "Civic & inclusive", detail: "Public services, community & culture", sharePct: 5 },
] as const;

/** Callouts pinned to the massing concept diagram, top → bottom. */
export const calloutsMassing = [
  { id: "pavilion", label: "Rooftop pavilion", detail: "Cultural coffee pavilion & sky lounge" },
  { id: "tower", label: "Tower · L5–L15", detail: "Vertical stack of offices, hotel, trade services & enterprise floors" },
  { id: "terraces", label: "Sky terraces", detail: "Breakout gardens & outdoor amenities" },
  { id: "podium", label: "Podium · G–L4", detail: "Market, retail, events & civic programs" },
  { id: "plaza", label: "Arrival plaza", detail: "Colonnade entry, water feature & public realm" },
] as const;

export const massingSheet = {
  siteCoveragePct: src(60, sheet("Key massing metrics › site coverage (podium)")),
  podiumGrossSqm: src(15000, sheet("Key massing metrics › podium gross (G–L4)")),
  towerGrossSqm: src(13200, sheet("Key massing metrics › tower gross (L5–L15)")),
  netGlaExclRoofSqm: src(20604, sheet("Key massing metrics › total net GLA (excl. roof)")),
  podiumFootprintSqm: src(3000, sheet("Footprint & stacking › podium footprint")),
  towerFootprintSqm: src(1200, sheet("Footprint & stacking › tower footprint")),
  basementLevelSqm: src(3000, sheet("Basement configuration › each basement")),
  parkingBays: src(130, sheet("Basement configuration › hydraulic-stacked parking")),
} satisfies Record<string, Sourced<number>>;

/** Plan footprints, with the indicative plan dimensions printed on the sheet. */
export type Footprint = {
  id: string;
  label: string;
  /** Level range, where the sheet prints one. */
  sub?: string;
  areaSqm: number;
  dims: string;
  /** Plate size in px for the schematic plan. */
  w: number;
  h: number;
};

export const footprints: Footprint[] = [
  { id: "plot", label: "Plot", areaSqm: 5000, dims: "~50 m", w: 100, h: 78 },
  { id: "podium", label: "Podium footprint", sub: "(G–L4)", areaSqm: 3000, dims: "~60 m", w: 82, h: 62 },
  { id: "tower", label: "Tower footprint", sub: "(L5–L15)", areaSqm: 1200, dims: "~34.6 m", w: 56, h: 52 },
];

/** Section markers — heights above/below grade printed on the section diagram. */
export const sectionMarks = [
  { id: "roof", label: "Roof pavilion", m: 72.8 },
  { id: "tower", label: "Tower levels L5–L15", m: 41.8 },
  { id: "podium", label: "Podium levels G–L4", m: 26.0 },
  { id: "basement", label: "Basements", m: -13.5 },
] as const;

/** What each basement level carries. */
export const basementUses = [
  { id: "b1", label: "Hydraulic-stacked parking", detail: "~130 bays, 2 cars/space" },
  { id: "b2", label: "Automated logistics core", detail: "ASRS / AGV / cross-dock" },
  { id: "b3", label: "Bonded & dry storage", detail: "+ IoT & data backbone" },
] as const;

/** The 2,000 m² of surface site works, by allocation. */
export const surfaceWorks = [
  { id: "parking", label: "Surface parking (~28 bays)", areaSqm: 700 },
  { id: "docks", label: "Loading & unloading docks", areaSqm: 550 },
  { id: "plaza", label: "Arrival plaza & drop-off", areaSqm: 350 },
  { id: "vending", label: "Outdoor vending / kiosks", areaSqm: 150 },
  { id: "taxi", label: "Taxi / bajaj & 2W bay", areaSqm: 100 },
  { id: "landscape", label: "Landscape / seating / water", areaSqm: 100 },
  { id: "utility", label: "Utility yard / waste & gatehouse", areaSqm: 50 },
] as const;

/** Planning efficiencies and floor-to-floor heights from the sheet footer. */
export const efficiencies = [
  { label: "Podium efficiency", value: "74%" },
  { label: "Tower efficiency", value: "72%" },
  { label: "Podium floor-to-floor", value: "4.5 m" },
  { label: "Tower floor-to-floor", value: "3.8 m" },
  { label: "Expo (L4) clear height", value: "8.0 m" },
  { label: "Roof / plant", value: "5.0 m" },
] as const;

export const massingCaveat =
  "All areas are indicative planning estimates. FAR, height cap and parking ratios must be verified against the plot’s zoning certificate before reliance.";
