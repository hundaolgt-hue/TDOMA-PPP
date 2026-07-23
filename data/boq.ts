import { todo, type Sourced } from "./types";

export type BoqItem = {
  code: string;
  description: string;
  /** Cross-link to constructionPhases id (chapter 3 ↔ chapter 6). */
  phaseId: string;
  unit: string;
  quantity: Sourced<number>;
  rateUsd: Sourced<number>;
};

// GREYBOX PLACEHOLDERS — every row TODO_SOURCE until the real BOQ lands.
export const boqItems: BoqItem[] = [
  { code: "E-01", description: "Bulk excavation", phaseId: "excavation", unit: "m³", quantity: todo(85000), rateUsd: todo(8) },
  { code: "E-02", description: "Shoring & dewatering", phaseId: "excavation", unit: "m", quantity: todo(600), rateUsd: todo(450) },
  { code: "S-01", description: "Raft foundation concrete", phaseId: "substructure", unit: "m³", quantity: todo(12000), rateUsd: todo(180) },
  { code: "S-02", description: "Basement walls", phaseId: "substructure", unit: "m²", quantity: todo(9500), rateUsd: todo(95) },
  { code: "F-01", description: "Structural steel frame", phaseId: "superstructure", unit: "t", quantity: todo(4200), rateUsd: todo(2400) },
  { code: "F-02", description: "Composite floor slabs", phaseId: "superstructure", unit: "m²", quantity: todo(68000), rateUsd: todo(65) },
  { code: "V-01", description: "Unitized curtain wall", phaseId: "envelope", unit: "m²", quantity: todo(14000), rateUsd: todo(620) },
  { code: "V-02", description: "Roof system", phaseId: "envelope", unit: "m²", quantity: todo(17000), rateUsd: todo(140) },
  { code: "M-01", description: "HVAC installation", phaseId: "mep", unit: "m²", quantity: todo(68000), rateUsd: todo(85) },
  { code: "M-02", description: "Smart-building systems", phaseId: "mep", unit: "pt", quantity: todo(5200), rateUsd: todo(310) },
  { code: "N-01", description: "Interior fit-out, mall areas", phaseId: "finishing", unit: "m²", quantity: todo(30000), rateUsd: todo(220) },
  { code: "N-02", description: "External works & landscape", phaseId: "finishing", unit: "m²", quantity: todo(12000), rateUsd: todo(75) },
];
