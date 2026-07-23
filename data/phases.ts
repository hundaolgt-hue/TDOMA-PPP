import { todo, type Sourced } from "./types";

export type ConstructionPhase = {
  id: string;
  label: string;
  months: Sourced<number>;
};

// Order matters: chapter 3 builds these bottom-up in sequence, and the BOQ
// chapter cross-links rows to these ids.
export const constructionPhases: ConstructionPhase[] = [
  { id: "excavation", label: "Excavation", months: todo(4) },
  { id: "substructure", label: "Substructure", months: todo(6) },
  { id: "superstructure", label: "Superstructure", months: todo(10) },
  { id: "envelope", label: "Envelope", months: todo(6) },
  { id: "mep", label: "MEP fit-out", months: todo(8) },
  { id: "finishing", label: "Finishing", months: todo(6) },
];
