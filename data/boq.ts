import { src, SRC, type Sourced } from "./types";

export type BoqItem = {
  code: string;
  description: string;
  /** Cross-link to constructionPhases id (chapter 3 ↔ chapter 6). */
  phaseId: string;
  unit: string;
  quantity: Sourced<number>;
  rateEtb: Sourced<number>;
};

// Full elemental Bill of Quantities — TDOMA_Merkato_BOQ.xlsx, "Detailed BOQ".
// Concept-stage elemental estimate in ETB; Amount = Qty × Rate. Every row is
// sourced; re-measure from detailed drawings before tender.
export const boqItems: BoqItem[] = [
  { code: "A.1", description: "Site establishment, hoarding, offices & welfare", phaseId: "substructure", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › A.1")), rateEtb: src(40021990, SRC.boq("Detailed BOQ › A.1")) },
  { code: "A.2", description: "Site management, supervision & staff", phaseId: "substructure", unit: "month", quantity: src(36, SRC.boq("Detailed BOQ › A.2")), rateEtb: src(4002200, SRC.boq("Detailed BOQ › A.2")) },
  { code: "A.3", description: "Insurances, performance bond & permits", phaseId: "substructure", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › A.3")), rateEtb: src(48915770, SRC.boq("Detailed BOQ › A.3")) },
  { code: "A.4", description: "Temporary services (power, water, telecoms)", phaseId: "substructure", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › A.4")), rateEtb: src(26681330, SRC.boq("Detailed BOQ › A.4")) },
  { code: "A.5", description: "Health, safety & environmental management", phaseId: "substructure", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › A.5")), rateEtb: src(31128220, SRC.boq("Detailed BOQ › A.5")) },
  { code: "A.6", description: "Tower crane, hoists & major plant", phaseId: "substructure", unit: "month", quantity: src(36, SRC.boq("Detailed BOQ › A.6")), rateEtb: src(1778760, SRC.boq("Detailed BOQ › A.6")) },
  { code: "A.7", description: "Testing, commissioning & handover", phaseId: "substructure", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › A.7")), rateEtb: src(22234440, SRC.boq("Detailed BOQ › A.7")) },
  { code: "B.1", description: "Site clearance & strip", phaseId: "substructure", unit: "m2", quantity: src(5000, SRC.boq("Detailed BOQ › B.1")), rateEtb: src(360, SRC.boq("Detailed BOQ › B.1")) },
  { code: "B.2", description: "Bulk excavation for 3 basement levels", phaseId: "substructure", unit: "m3", quantity: src(42000, SRC.boq("Detailed BOQ › B.2")), rateEtb: src(1070, SRC.boq("Detailed BOQ › B.2")) },
  { code: "B.3", description: "Secant/contiguous pile retaining wall", phaseId: "substructure", unit: "m2", quantity: src(3600, SRC.boq("Detailed BOQ › B.3")), rateEtb: src(24900, SRC.boq("Detailed BOQ › B.3")) },
  { code: "B.4", description: "Dewatering during construction", phaseId: "substructure", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › B.4")), rateEtb: src(35575110, SRC.boq("Detailed BOQ › B.4")) },
  { code: "B.5", description: "Cart away & disposal of surplus", phaseId: "substructure", unit: "m3", quantity: src(42000, SRC.boq("Detailed BOQ › B.5")), rateEtb: src(620, SRC.boq("Detailed BOQ › B.5")) },
  { code: "B.6", description: "Blinding / lean concrete", phaseId: "substructure", unit: "m2", quantity: src(3000, SRC.boq("Detailed BOQ › B.6")), rateEtb: src(2220, SRC.boq("Detailed BOQ › B.6")) },
  { code: "B.7", description: "RC raft foundation", phaseId: "substructure", unit: "m3", quantity: src(3600, SRC.boq("Detailed BOQ › B.7")), rateEtb: src(28460, SRC.boq("Detailed BOQ › B.7")) },
  { code: "B.8", description: "RC basement retaining walls", phaseId: "substructure", unit: "m3", quantity: src(2400, SRC.boq("Detailed BOQ › B.8")), rateEtb: src(30240, SRC.boq("Detailed BOQ › B.8")) },
  { code: "B.9", description: "RC basement columns, beams & slabs (3 levels)", phaseId: "substructure", unit: "m2", quantity: src(9000, SRC.boq("Detailed BOQ › B.9")), rateEtb: src(19570, SRC.boq("Detailed BOQ › B.9")) },
  { code: "B.10", description: "Tanking / waterproofing to basement", phaseId: "substructure", unit: "m2", quantity: src(6600, SRC.boq("Detailed BOQ › B.10")), rateEtb: src(5780, SRC.boq("Detailed BOQ › B.10")) },
  { code: "B.11", description: "Basement drainage, sumps & pumps", phaseId: "substructure", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › B.11")), rateEtb: src(22234440, SRC.boq("Detailed BOQ › B.11")) },
  { code: "C.1", description: "RC columns (above grade)", phaseId: "superstructure", unit: "m3", quantity: src(3200, SRC.boq("Detailed BOQ › C.1")), rateEtb: src(26680, SRC.boq("Detailed BOQ › C.1")) },
  { code: "C.2", description: "RC beams", phaseId: "superstructure", unit: "m3", quantity: src(4000, SRC.boq("Detailed BOQ › C.2")), rateEtb: src(25790, SRC.boq("Detailed BOQ › C.2")) },
  { code: "C.3", description: "Transfer structure at podium/tower interface", phaseId: "superstructure", unit: "m3", quantity: src(900, SRC.boq("Detailed BOQ › C.3")), rateEtb: src(40020, SRC.boq("Detailed BOQ › C.3")) },
  { code: "C.4", description: "Suspended RC floor slabs (above grade)", phaseId: "superstructure", unit: "m2", quantity: src(28800, SRC.boq("Detailed BOQ › C.4")), rateEtb: src(12450, SRC.boq("Detailed BOQ › C.4")) },
  { code: "C.5", description: "RC roof slab & parapets", phaseId: "superstructure", unit: "m2", quantity: src(1200, SRC.boq("Detailed BOQ › C.5")), rateEtb: src(13340, SRC.boq("Detailed BOQ › C.5")) },
  { code: "C.6", description: "RC staircases (all cores)", phaseId: "superstructure", unit: "m2", quantity: src(1600, SRC.boq("Detailed BOQ › C.6")), rateEtb: src(16010, SRC.boq("Detailed BOQ › C.6")) },
  { code: "C.7", description: "Vehicle ramps", phaseId: "superstructure", unit: "m2", quantity: src(900, SRC.boq("Detailed BOQ › C.7")), rateEtb: src(14230, SRC.boq("Detailed BOQ › C.7")) },
  { code: "D.1", description: "Unitised curtain walling / structural glazing", phaseId: "envelope", unit: "m2", quantity: src(8500, SRC.boq("Detailed BOQ › D.1")), rateEtb: src(28460, SRC.boq("Detailed BOQ › D.1")) },
  { code: "D.2", description: "Kinetic bronze facade shading system", phaseId: "envelope", unit: "m2", quantity: src(3500, SRC.boq("Detailed BOQ › D.2")), rateEtb: src(40020, SRC.boq("Detailed BOQ › D.2")) },
  { code: "D.3", description: "Solid cladding / rendered external walls", phaseId: "envelope", unit: "m2", quantity: src(2500, SRC.boq("Detailed BOQ › D.3")), rateEtb: src(10670, SRC.boq("Detailed BOQ › D.3")) },
  { code: "D.4", description: "Main entrance portals & revolving doors", phaseId: "envelope", unit: "no", quantity: src(4, SRC.boq("Detailed BOQ › D.4")), rateEtb: src(3112820, SRC.boq("Detailed BOQ › D.4")) },
  { code: "E.1", description: "Blockwork / partition walls", phaseId: "divisions", unit: "m2", quantity: src(22000, SRC.boq("Detailed BOQ › E.1")), rateEtb: src(2850, SRC.boq("Detailed BOQ › E.1")) },
  { code: "E.2", description: "Fire-rated & acoustic partitions", phaseId: "divisions", unit: "m2", quantity: src(6000, SRC.boq("Detailed BOQ › E.2")), rateEtb: src(4000, SRC.boq("Detailed BOQ › E.2")) },
  { code: "E.3", description: "Glazed internal partitions", phaseId: "divisions", unit: "m2", quantity: src(3000, SRC.boq("Detailed BOQ › E.3")), rateEtb: src(8000, SRC.boq("Detailed BOQ › E.3")) },
  { code: "E.4", description: "Internal doors (all types)", phaseId: "divisions", unit: "no", quantity: src(900, SRC.boq("Detailed BOQ › E.4")), rateEtb: src(40020, SRC.boq("Detailed BOQ › E.4")) },
  { code: "F.1", description: "Floor finishes - retail & public (tile/stone)", phaseId: "finishing", unit: "m2", quantity: src(12000, SRC.boq("Detailed BOQ › F.1")), rateEtb: src(5780, SRC.boq("Detailed BOQ › F.1")) },
  { code: "F.2", description: "Floor finishes - offices & back of house", phaseId: "finishing", unit: "m2", quantity: src(8000, SRC.boq("Detailed BOQ › F.2")), rateEtb: src(3110, SRC.boq("Detailed BOQ › F.2")) },
  { code: "F.3", description: "Floor finishes - hotel & serviced apts (premium)", phaseId: "finishing", unit: "m2", quantity: src(3500, SRC.boq("Detailed BOQ › F.3")), rateEtb: src(7560, SRC.boq("Detailed BOQ › F.3")) },
  { code: "F.4", description: "Wall finishes, plaster & paint", phaseId: "finishing", unit: "m2", quantity: src(60000, SRC.boq("Detailed BOQ › F.4")), rateEtb: src(1250, SRC.boq("Detailed BOQ › F.4")) },
  { code: "F.5", description: "Suspended ceilings", phaseId: "finishing", unit: "m2", quantity: src(26000, SRC.boq("Detailed BOQ › F.5")), rateEtb: src(2850, SRC.boq("Detailed BOQ › F.5")) },
  { code: "F.6", description: "Feature finishes (lobbies, atrium, rooftop)", phaseId: "finishing", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › F.6")), rateEtb: src(70189680, SRC.boq("Detailed BOQ › F.6")) },
  { code: "G.1", description: "Sanitary fittings & toilet fit-out", phaseId: "finishing", unit: "WC grp", quantity: src(60, SRC.boq("Detailed BOQ › G.1")), rateEtb: src(850000, SRC.boq("Detailed BOQ › G.1")) },
  { code: "G.2", description: "Built-in joinery, reception counters & signage", phaseId: "finishing", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › G.2")), rateEtb: src(48915770, SRC.boq("Detailed BOQ › G.2")) },
  { code: "H.1", description: "Cold & hot water supply, tanks & pumps", phaseId: "mep", unit: "m2", quantity: src(37800, SRC.boq("Detailed BOQ › H.1")), rateEtb: src(1600, SRC.boq("Detailed BOQ › H.1")) },
  { code: "H.2", description: "Soil, waste & rainwater drainage", phaseId: "mep", unit: "m2", quantity: src(37800, SRC.boq("Detailed BOQ › H.2")), rateEtb: src(1070, SRC.boq("Detailed BOQ › H.2")) },
  { code: "H.3", description: "HVAC - ventilation & cooling", phaseId: "mep", unit: "m2", quantity: src(37800, SRC.boq("Detailed BOQ › H.3")), rateEtb: src(4890, SRC.boq("Detailed BOQ › H.3")) },
  { code: "H.4", description: "Electrical LV distribution & small power", phaseId: "mep", unit: "m2", quantity: src(37800, SRC.boq("Detailed BOQ › H.4")), rateEtb: src(3380, SRC.boq("Detailed BOQ › H.4")) },
  { code: "H.5", description: "Standby generators & transformers", phaseId: "mep", unit: "no", quantity: src(3, SRC.boq("Detailed BOQ › H.5")), rateEtb: src(19566310, SRC.boq("Detailed BOQ › H.5")) },
  { code: "H.6", description: "Lighting (internal & feature)", phaseId: "mep", unit: "m2", quantity: src(37800, SRC.boq("Detailed BOQ › H.6")), rateEtb: src(1420, SRC.boq("Detailed BOQ › H.6")) },
  { code: "H.7", description: "Fire detection, sprinklers & hydrants", phaseId: "mep", unit: "m2", quantity: src(37800, SRC.boq("Detailed BOQ › H.7")), rateEtb: src(1960, SRC.boq("Detailed BOQ › H.7")) },
  { code: "H.8", description: "Passenger & goods lifts", phaseId: "mep", unit: "no", quantity: src(8, SRC.boq("Detailed BOQ › H.8")), rateEtb: src(10672530, SRC.boq("Detailed BOQ › H.8")) },
  { code: "H.9", description: "Escalators (podium)", phaseId: "mep", unit: "no", quantity: src(8, SRC.boq("Detailed BOQ › H.9")), rateEtb: src(8004400, SRC.boq("Detailed BOQ › H.9")) },
  { code: "H.10", description: "BMS, ELV, data & IoT cabling", phaseId: "mep", unit: "m2", quantity: src(37800, SRC.boq("Detailed BOQ › H.10")), rateEtb: src(1330, SRC.boq("Detailed BOQ › H.10")) },
  { code: "I.1", description: "Automated logistics (ASRS / AGV / cross-dock)", phaseId: "mep", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › I.1")), rateEtb: src(292513600, SRC.boq("Detailed BOQ › I.1")) },
  { code: "I.2", description: "Data centre / cloud node fit-out", phaseId: "mep", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › I.2")), rateEtb: src(106725320, SRC.boq("Detailed BOQ › I.2")) },
  { code: "I.3", description: "Hydraulic 2-car stacking parking system", phaseId: "mep", unit: "platform", quantity: src(65, SRC.boq("Detailed BOQ › I.3")), rateEtb: src(550000, SRC.boq("Detailed BOQ › I.3")) },
  { code: "I.4", description: "Bonded & cold storage fit-out", phaseId: "mep", unit: "m2", quantity: src(1500, SRC.boq("Detailed BOQ › I.4")), rateEtb: src(40020, SRC.boq("Detailed BOQ › I.4")) },
  { code: "I.5", description: "Cashless, access-control & security systems", phaseId: "mep", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › I.5")), rateEtb: src(48915770, SRC.boq("Detailed BOQ › I.5")) },
  { code: "J.1", description: "Site paving & hardstanding", phaseId: "finishing", unit: "m2", quantity: src(1400, SRC.boq("Detailed BOQ › J.1")), rateEtb: src(5780, SRC.boq("Detailed BOQ › J.1")) },
  { code: "J.2", description: "Surface parking equipment & markings", phaseId: "finishing", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › J.2")), rateEtb: src(5336270, SRC.boq("Detailed BOQ › J.2")) },
  { code: "J.3", description: "Loading dock apron, levellers & equipment", phaseId: "finishing", unit: "no", quantity: src(4, SRC.boq("Detailed BOQ › J.3")), rateEtb: src(4002200, SRC.boq("Detailed BOQ › J.3")) },
  { code: "J.4", description: "Soft landscaping, seating & water feature", phaseId: "finishing", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › J.4")), rateEtb: src(17787550, SRC.boq("Detailed BOQ › J.4")) },
  { code: "J.5", description: "Boundary wall, gates & gatehouse", phaseId: "finishing", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › J.5")), rateEtb: src(10672530, SRC.boq("Detailed BOQ › J.5")) },
  { code: "J.6", description: "External drainage & utility connections", phaseId: "finishing", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › J.6")), rateEtb: src(16008800, SRC.boq("Detailed BOQ › J.6")) },
  { code: "J.7", description: "Site lighting & external power", phaseId: "finishing", unit: "sum", quantity: src(1, SRC.boq("Detailed BOQ › J.7")), rateEtb: src(8004400, SRC.boq("Detailed BOQ › J.7")) },
];

export const totalConstructionEtb = src(4064100000, SRC.boq("Summary › TOTAL CONSTRUCTION WORKS"));
