import { todo, type Sourced } from "./types";

// GREYBOX PLACEHOLDERS — obviously-round numbers, all tagged TODO_SOURCE.
// Replace with parsed figures from /docs-source (financial model) in Phase 2.

export type WaterfallStep = {
  label: string;
  /** Millions, negative = outflow. */
  amount: Sourced<number>;
};

export type RevenueSlice = {
  label: string;
  sharePct: Sourced<number>;
};

export const headline = {
  capexM: todo(100),
  irrPct: todo(15),
  npvM: todo(40),
  paybackYears: todo(7),
} satisfies Record<string, Sourced<number>>;

export const cashflowWaterfall: WaterfallStep[] = [
  { label: "CAPEX", amount: todo(-100) },
  { label: "Rental income", amount: todo(90) },
  { label: "Anchor leases", amount: todo(35) },
  { label: "Parking & services", amount: todo(20) },
  { label: "OPEX", amount: todo(-45) },
  { label: "Net position", amount: todo(0) }, // computed total slot
];

export const revenueMix: RevenueSlice[] = [
  { label: "Retail units", sharePct: todo(45) },
  { label: "Anchor tenants", sharePct: todo(20) },
  { label: "F&B", sharePct: todo(15) },
  { label: "Entertainment", sharePct: todo(12) },
  { label: "Parking & other", sharePct: todo(8) },
];

export type SensitivityCase = {
  label: string;
  irrPct: Sourced<number>;
  npvM: Sourced<number>;
};

export const sensitivity: SensitivityCase[] = [
  { label: "Base case", irrPct: todo(15), npvM: todo(40) },
  { label: "Occupancy −10%", irrPct: todo(11), npvM: todo(22) },
  { label: "Rents +10%", irrPct: todo(18), npvM: todo(55) },
];
