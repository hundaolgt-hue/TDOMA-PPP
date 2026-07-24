// Per-phase construction detail for S7 — TDOMA_Merkato_BOQ.xlsx (Detailed BOQ).
// Keyed by constructionPhases id. Quantities are the headline BOQ items.

export type PhaseDetail = {
  pctOfWorks: number;
  activities: string[];
  quantities: { label: string; value: string }[];
};

export const phaseDetails: Record<string, PhaseDetail> = {
  substructure: {
    pctOfWorks: 15.2,
    activities: ["Secant / contiguous pile retaining wall", "3 basement levels: raft, walls, slabs", "Dewatering, tanking & waterproofing"],
    quantities: [
      { label: "Bulk excavation", value: "42,000 m³" },
      { label: "Pile retaining wall", value: "3,600 m²" },
      { label: "Raft foundation", value: "3,600 m³" },
      { label: "Tanking", value: "6,600 m²" },
    ],
  },
  superstructure: {
    pctOfWorks: 15.7,
    activities: ["RC columns & beams above grade", "Transfer structure at podium/tower", "Suspended floor slabs, cores & ramps"],
    quantities: [
      { label: "Suspended slabs", value: "28,800 m²" },
      { label: "RC columns", value: "3,200 m³" },
      { label: "RC beams", value: "4,000 m³" },
      { label: "Transfer structure", value: "900 m³" },
    ],
  },
  envelope: {
    pctOfWorks: 10.4,
    activities: ["Unitised curtain walling / structural glazing", "Façade shading & solid cladding", "Entrance portals & revolving doors"],
    quantities: [
      { label: "Curtain walling", value: "8,500 m²" },
      { label: "Façade shading", value: "3,500 m²" },
      { label: "Cladding", value: "2,500 m²" },
      { label: "Entrance portals", value: "4 no" },
    ],
  },
  divisions: {
    pctOfWorks: 3.6,
    activities: ["Blockwork & partition walls", "Fire-rated, acoustic & glazed partitions", "Internal doors, all types"],
    quantities: [
      { label: "Blockwork", value: "22,000 m²" },
      { label: "Fire/acoustic partitions", value: "6,000 m²" },
      { label: "Glazed partitions", value: "3,000 m²" },
      { label: "Internal doors", value: "900 no" },
    ],
  },
  mep: {
    pctOfWorks: 33.1,
    activities: ["HVAC, LV distribution, water & drainage", "8 lifts + 8 escalators, fire systems", "BMS/ELV/IoT, logistics core, data node"],
    quantities: [
      { label: "MEP coverage", value: "37,800 m²" },
      { label: "Lifts / escalators", value: "8 + 8 no" },
      { label: "Generators", value: "3 no" },
      { label: "Logistics + data node", value: "ASRS + cloud" },
    ],
  },
  finishing: {
    pctOfWorks: 12.8,
    activities: ["Floor, wall & ceiling finishes", "Sanitary fit-out & joinery", "External works, landscape & site"],
    quantities: [
      { label: "Wall finishes", value: "60,000 m²" },
      { label: "Suspended ceilings", value: "26,000 m²" },
      { label: "Floor finishes", value: "23,500 m²" },
      { label: "Sanitary groups", value: "60 no" },
    ],
  },
};
