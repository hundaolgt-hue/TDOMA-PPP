import { src, SRC, todo, type Sourced } from "./types";

// All figures from TDOMA_Liiban_Financial_Model_v2_AUDITED.xlsx (v2.0,
// 20 July 2026, IFRS). ETB; USD memo @ 160. Headline metrics are the live
// Dashboard/Returns values; the model reports 13/13 integrity checks passing.

export type WaterfallStep = {
  label: string;
  /** ETB millions; negative = net outflow year. */
  amount: Sourced<number>;
};

export type RevenueSlice = {
  label: string;
  /** O1 rental income, ETB millions, net of VAT. */
  valueM: Sourced<number>;
};

// Headline metrics — Dashboard + Returns sheets.
export const headline = {
  capexEtb: src(6853799444, SRC.fin("Dashboard › Total capex (incl. land in-kind)")),
  capexUsd: src(42836247, SRC.fin("Dashboard › Capex USD @160")),
  cashRequirementEtb: src(5323799444, SRC.fin("Dashboard › Cash requirement")),
  tdomaEquityEtb: src(3992849583, SRC.fin("Dashboard › TDOMA equity")),
  debtEtb: src(1330949861, SRC.fin("Dashboard › Debt")),
  projectIrrPct: src(28.3, SRC.fin("Dashboard › Project IRR (0.2831)")),
  equityIrrPct: src(24.2, SRC.fin("Dashboard › Equity IRR (0.2419)")),
  projectNpvEtb: src(2860779266, SRC.fin("Dashboard › Project NPV @20%")),
  equityNpvEtb: src(1119542382, SRC.fin("Dashboard › Equity NPV @20%")),
  yieldOnCostPct: src(17.5, SRC.fin("Dashboard › Yield on cost (0.1755)")),
  minDscr: src(1.42, SRC.fin("Dashboard › Minimum DSCR (1.4173)")),
  paybackYears: src(7.07, SRC.fin("Payback › Simple payback, project basis")),
  equityMoic: src(8.05, SRC.fin("Returns › Equity MoIC")),
  totalGdvEtb: src(16004076090, SRC.fin("Dashboard › Total GDV")),
  developmentMarginEtb: src(9150276645, SRC.fin("Dashboard › Development margin")),
  profitOnCostPct: src(133.5, SRC.fin("Dashboard › Profit on cost (1.3351)")),
} satisfies Record<string, Sourced<number>>;

// Project cash-flow J-curve, ETB millions, excl. terminal value — Payback
// sheet, "Project cash flow (excl. terminal value)". Three construction years
// (outflow) then twelve operating years; cumulative crosses zero at year 8
// (payback 7.07 yrs).
export const cashflowWaterfall: WaterfallStep[] = [
  { label: "Y1", amount: src(-1349, SRC.fin("Payback › C1")) },
  { label: "Y2", amount: src(-2506, SRC.fin("Payback › C2")) },
  { label: "Y3", amount: src(-1469, SRC.fin("Payback › C3")) },
  { label: "Y4", amount: src(2380, SRC.fin("Payback › O1")) },
  { label: "Y5", amount: src(729, SRC.fin("Payback › O2")) },
  { label: "Y6", amount: src(954, SRC.fin("Payback › O3")) },
  { label: "Y7", amount: src(1160, SRC.fin("Payback › O4")) },
  { label: "Y8", amount: src(1420, SRC.fin("Payback › O5")) },
  { label: "Y9", amount: src(1778, SRC.fin("Payback › O6")) },
  { label: "Y10", amount: src(2228, SRC.fin("Payback › O7")) },
  { label: "Y11", amount: src(2791, SRC.fin("Payback › O8")) },
  { label: "Y12", amount: src(3497, SRC.fin("Payback › O9")) },
  { label: "Y13", amount: src(4380, SRC.fin("Payback › O10")) },
  { label: "Y14", amount: src(5486, SRC.fin("Payback › O11")) },
  { label: "Y15", amount: src(6869, SRC.fin("Payback › O12")) },
];

// Rental income mix at O1 (net of VAT), ETB millions — Revenue sheet,
// "RENTAL INCOME" block, O1 column. Total rental subtotal 597.4M.
export const revenueMix: RevenueSlice[] = [
  { label: "Commercial office (L6–L8)", valueM: src(189.5, SRC.fin("Revenue › Commercial office O1")) },
  { label: "Basement warehouse (B2/B3)", valueM: src(164.3, SRC.fin("Revenue › Basement warehouse O1")) },
  { label: "Wholesale showrooms", valueM: src(79.9, SRC.fin("Revenue › Wholesale showrooms O1")) },
  { label: "Trade services", valueM: src(68.0, SRC.fin("Revenue › Trade services O1")) },
  { label: "Retail (retained 25%)", valueM: src(50.9, SRC.fin("Revenue › Retail retained O1")) },
  { label: "Food hall / F&B", valueM: src(32.3, SRC.fin("Revenue › Food hall O1")) },
  { label: "Rooftop F&B / pavilion", valueM: src(12.5, SRC.fin("Revenue › Rooftop F&B O1")) },
];

export type SensitivityCase = {
  label: string;
  irrPct: Sourced<number>;
  marginEtb: Sourced<number>;
  minDscr: Sourced<number>;
  note: string;
};

// Scenarios — Sensitivity sheet (recomputed against the corrected model).
// The DSCR covenant (1.30x), not the 20% IRR hurdle, is the binding
// constraint: it breaches between +5% and +10% cost overrun.
export const sensitivity: SensitivityCase[] = [
  { label: "Base case", irrPct: src(28.3, SRC.fin("Sensitivity › Base")), marginEtb: src(9150276645, SRC.fin("Sensitivity › Base margin")), minDscr: src(1.42, SRC.fin("Sensitivity › Base DSCR")), note: "13/13 integrity checks pass; clears both hurdles and the 1.30x covenant." },
  { label: "Cost overrun +10%", irrPct: src(26.9, SRC.fin("Sensitivity › B overrun 0.10")), marginEtb: src(8648656820, SRC.fin("Sensitivity › B overrun 0.10 margin")), minDscr: src(1.32, SRC.fin("Sensitivity › B overrun 0.10 DSCR")), note: "IRR still clears; DSCR nears the covenant — the binding constraint." },
  { label: "Occupancy 0.80×", irrPct: src(26.2, SRC.fin("Sensitivity › D1 occ 0.80")), marginEtb: src(7146805338, SRC.fin("Sensitivity › D1 occ 0.80 margin")), minDscr: src(1.26, SRC.fin("Sensitivity › D1 occ 0.80 DSCR")), note: "DSCR breaches 1.30x — covenant fails below ~0.85× occupancy." },
  { label: "Rent escalation 15%", irrPct: src(22.5, SRC.fin("Sensitivity › D4 esc 0.15")), marginEtb: src(5765176013, SRC.fin("Sensitivity › D4 esc 0.15 margin")), minDscr: src(1.42, SRC.fin("Sensitivity › D4 esc 0.15")), note: "Largest lever in the tornado; 25% p.a. base is an aggressive assumption." },
];

// Capex composition — Capex sheet. ETB. Land is the City's non-cash PPP
// contribution; the rest is the cash building sub-total.
export type CapexLine = { label: string; valueEtb: Sourced<number>; nonCash?: boolean };
export const capexComposition: CapexLine[] = [
  { label: "Construction works (BOQ A–J)", valueEtb: src(4064100000, SRC.fin("Capex › Construction works")) },
  { label: "Contingency @12%", valueEtb: src(499467780, SRC.fin("Capex › Contingency")) },
  { label: "IDC (capitalised, IAS 23)", valueEtb: src(360537467, SRC.fin("Capex › IDC")) },
  { label: "FF&E — TDOMA scope", valueEtb: src(163020000, SRC.fin("Capex › FF&E")) },
  { label: "In-house design @2%", valueEtb: src(81282000, SRC.fin("Capex › In-house design")) },
  { label: "Arrangement fee @1.5%", valueEtb: src(18542697, SRC.fin("Capex › Arrangement fee")) },
  { label: "Specialist consultancy", valueEtb: src(16849500, SRC.fin("Capex › Specialist consultancy")) },
  { label: "Land (in-kind, non-cash)", valueEtb: src(1650000000, SRC.fin("Capex › Land in-kind")), nonCash: true },
];

// Warehouse rent has no sourced comparable — the model itself flags it as the
// single most valuable next input. Kept as an explicit gap.
export const warehouseRentComparable = todo(3500);
