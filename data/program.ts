import { todo, type Sourced } from "./types";

export type Zone = {
  id: string;
  label: string;
  /** Zone accent for the turntable illumination + legend. */
  color: string;
  areaSqm: Sourced<number>;
};

export const zones: Zone[] = [
  { id: "retail", label: "Retail units", color: "#e8b04b", areaSqm: todo(18000) },
  { id: "anchor", label: "Anchor tenants", color: "#5aa7d6", areaSqm: todo(12000) },
  { id: "fnb", label: "F&B", color: "#d66a5a", areaSqm: todo(6000) },
  { id: "entertainment", label: "Entertainment", color: "#9a6ad6", areaSqm: todo(8000) },
  { id: "parking", label: "Parking", color: "#7d8a99", areaSqm: todo(20000) },
  { id: "boh", label: "Back of house", color: "#5ad68f", areaSqm: todo(5000) },
];

export type BuildingLayer = {
  id: string;
  label: string;
  callout: string;
};

// Exploded-assembly order, top of the stack first.
export const buildingLayers: BuildingLayer[] = [
  { id: "smart", label: "Smart & network systems", callout: "IoT backbone, sensors, building OS" },
  { id: "electrical", label: "Electrical", callout: "Distribution, lighting, emergency power" },
  { id: "facade", label: "Façade", callout: "High-performance envelope, media surfaces" },
  { id: "frame", label: "Structural frame", callout: "Long-span structure, open retail floorplates" },
  { id: "basement", label: "Basement", callout: "Parking, services, logistics" },
];
