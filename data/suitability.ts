import { src, type Sourced } from "./types";

// Merkato Mixed-Use Wholesale-Trade Complex — Site-Suitability Feasibility
// Study (planning-stage MCDA screening, 2026-07-14). All figures sourced from
// Merkato_Suitability_Study.html.
const S = (loc: string) => `Merkato_Suitability_Study.html › ${loc}`;

export type Criterion = { label: string; weight: number; dominant?: boolean };

// Nine-criterion weighted-overlay (base weighting — strongly market-forward
// per client direction).
export const criteria: Criterion[] = [
  { label: "Trade gravity & catchment", weight: 0.32, dominant: true },
  { label: "Vacancy / low displacement", weight: 0.18 },
  { label: "Road & freight access", weight: 0.1 },
  { label: "Land-use compatibility", weight: 0.08 },
  { label: "Transit & footfall", weight: 0.08 },
  { label: "Power capacity (proxy)", weight: 0.08 },
  { label: "Height-regulation headroom", weight: 0.06 },
  { label: "Slope & buildability", weight: 0.05 },
  { label: "Flood / drainage risk", weight: 0.05 },
];

export const suitabilityStats = {
  studyAreaKm2: src(1.71, S("§3 study-area delineation")),
  criteriaCount: src(9, S("§5 method")),
  zoneACount: src(30, S("§1 executive summary")),
  zoneAHa: src(17.8, S("§6 priority zones — zone A")),
  zoneBCount: src(25, S("§6 priority zones — zone B")),
  zoneBHa: src(13.7, S("§6 priority zones — zone B")),
  nearestAnchorM: src(58, S("§1 nearest zone-A pocket")),
  excludedPct: src(4.1, S("§5 hard exclusions")),
  footprints: src(131701, S("§4 VIDA building footprints")),
  gridM: src(20, S("meta · 20 m analysis grid")),
  altCorrelation: src(0.98, S("§7 sensitivity · r ≈ 0.983")),
} satisfies Record<string, Sourced<number>>;

// Per-criterion scores for the three illustrative parcels (calibration only).
export type Parcel = {
  id: string;
  areaM2: number;
  areaHa: number;
  suitability: number;
  suitabilityAlt: number;
  distanceM: number;
  landuse: string;
  heightZone: string;
  builtCover: string;
  scores: { key: string; value: number }[];
  note: string;
};

const scoreRow = (vacancy: number, market: number, landuse: number, height: number, freight: number, transit: number, power: number, slope: number, flood: number) => [
  { key: "Market", value: market },
  { key: "Vacancy", value: vacancy },
  { key: "Land use", value: landuse },
  { key: "Height", value: height },
  { key: "Freight", value: freight },
  { key: "Transit", value: transit },
  { key: "Power", value: power },
  { key: "Slope", value: slope },
  { key: "Flood", value: flood },
];

export const parcels: Parcel[] = [
  {
    id: "S1", areaM2: 7455, areaHa: 0.75, suitability: 0.62, suitabilityAlt: 0.59, distanceM: 369,
    landuse: "Higher Level Market", heightZone: "Zone 2", builtCover: "0% big-building",
    scores: scoreRow(0.38, 0.74, 0.96, 0.78, 0.43, 0.69, 0.21, 0.73, 0.85),
    note: "Single-storey market-stall fabric in the dense heart of Merkato — the strongest market position of any feasible parcel, and the heaviest relocation-planning burden.",
  },
  {
    id: "S2", areaM2: 5998, areaHa: 0.6, suitability: 0.6, suitabilityAlt: 0.59, distanceM: 680,
    landuse: "High Density Mixed Residence", heightZone: "Zone 2", builtCover: "0% big-building",
    scores: scoreRow(0.44, 0.6, 0.75, 0.8, 0.6, 0.83, 0.16, 0.76, 0.82),
    note: "Compact low-rise block fronting the arterial / LRT corridor beside a school compound — strong transit and footfall.",
  },
  {
    id: "S3", areaM2: 14784, areaHa: 1.48, suitability: 0.57, suitabilityAlt: 0.56, distanceM: 910,
    landuse: "Parking Building", heightZone: "Zone 2", builtCover: "35% built (emptiest)",
    scores: scoreRow(0.47, 0.53, 0.66, 0.72, 0.58, 0.82, 0.15, 0.8, 0.85),
    note: "A substantially cleared parcel with rubble plus adjacent low sheds and a parking strip — the emptiest of the three.",
  },
];

export const suitabilityCaveat =
  "Planning-stage screening, not a legal determination. Candidate sites meet the stated criteria subject to the City's land-allocation authority. Cadastre, tenure, geotechnical and occupancy verification required before any parcel is relied upon.";
