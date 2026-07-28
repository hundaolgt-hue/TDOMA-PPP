import { src, SRC, type Sourced } from "./types";

// Financial Assumptions register — TDOMA_Liiban_Financial_Model_v2_AUDITED.xlsx
// › Assumptions sheet. Grouped for the assumptions section.

/** Animated-number format for the dashboard tiles. Omit `animate` entirely
 *  (leave undefined) for values, like ranges, that cannot be reduced to one
 *  counted number — those fall back to the static `display` string. */
export type NumFormat = { mult?: number; decimals?: number; prefix?: string; suffix: string; grouping?: boolean };

export type AssumptionItem = {
  label: string;
  display: string;
  value: Sourced<number>;
  /** Counter format; absent = render `display` as static bold text. */
  fmt?: NumFormat;
};

export type AssumptionGroup = { title: string; icon: string; items: AssumptionItem[] };

const A = (loc: string) => SRC.fin(`Assumptions › ${loc}`);
const pct = (decimals = 0): NumFormat => ({ mult: 100, decimals, suffix: "%" });

export const assumptionGroups: AssumptionGroup[] = [
  {
    title: "Financing",
    icon: "▲",
    items: [
      { label: "Loan interest rate", display: "20%", value: src(0.2, A("Loan interest rate")), fmt: pct() },
      { label: "Debt share of cash requirement", display: "25%", value: src(0.25, A("Debt share")), fmt: pct() },
      { label: "Loan tenor", display: "7 yrs", value: src(7, A("Loan tenor")), fmt: { suffix: " yrs" } },
      { label: "Grace period", display: "3 yrs", value: src(3, A("Grace period")), fmt: { suffix: " yrs" } },
      { label: "DSCR covenant", display: "1.30×", value: src(1.3, A("DSCR covenant")), fmt: { decimals: 2, suffix: "×" } },
      { label: "Arrangement fee", display: "1.5%", value: src(0.015, A("Arrangement fee %")), fmt: pct(1) },
    ],
  },
  {
    title: "Revenue rates (ETB/m²/mo)",
    icon: "◆",
    items: [
      { label: "Retail contract rent", display: "6,250", value: src(6250, A("Retail contract rent")), fmt: { suffix: "" } },
      { label: "Office rent", display: "4,600", value: src(4600, A("Office rent")), fmt: { suffix: "" } },
      { label: "Wholesale showrooms", display: "4,600", value: src(4600, A("Wholesale showrooms rent")), fmt: { suffix: "" } },
      { label: "Trade services", display: "5,625", value: src(5625, A("Trade services rent")), fmt: { suffix: "" } },
      { label: "Basement warehouse", display: "3,500 *", value: src(3500, A("Basement warehouse rent — NO SOURCED COMPARABLE")), fmt: { suffix: " *" } },
      { label: "Retail sale price (ETB/m²)", display: "540,000", value: src(540000, A("Retail sale price")), fmt: { suffix: "" } },
    ],
  },
  {
    title: "Operations & growth",
    icon: "●",
    items: [
      { label: "Occupancy Y1 → Y2 → stabilised", display: "75 → 85 → 95%", value: src(0.95, A("Occupancy ramp")) },
      { label: "Rent escalation p.a.", display: "25%", value: src(0.25, A("Rent escalation p.a.")), fmt: pct() },
      { label: "Opex escalation p.a.", display: "5%", value: src(0.05, A("Opex escalation p.a.")), fmt: pct() },
      { label: "Property opex (% of stabilised rent)", display: "25%", value: src(0.25, A("Property opex")), fmt: pct() },
      { label: "Management fee (% gross revenue)", display: "4%", value: src(0.04, A("Management fee")), fmt: pct() },
      { label: "Bad debt (% billed rent)", display: "2%", value: src(0.02, A("Bad debt")), fmt: pct() },
    ],
  },
  {
    title: "Tax & macro",
    icon: "■",
    items: [
      { label: "Corporate income tax", display: "30%", value: src(0.3, A("Corporate income tax")), fmt: pct() },
      { label: "VAT", display: "15%", value: src(0.15, A("VAT")), fmt: pct() },
      { label: "FX ETB/USD", display: "160", value: src(160, A("FX ETB/USD")), fmt: { suffix: "" } },
      { label: "Discount rate (DCF hurdle)", display: "20%", value: src(0.2, A("Discount rate")), fmt: pct() },
      { label: "Terminal / exit cap rate", display: "10.5%", value: src(0.105, A("Exit cap rate")), fmt: pct(1) },
      { label: "Equity IRR hurdle", display: "24%", value: src(0.24, A("Equity IRR hurdle (audit-added)")), fmt: pct() },
    ],
  },
];

// Headline strip — the assumptions with the most decision-relevance, always
// visible above the interactive group tabs.
export const assumptionsHeadline: AssumptionItem[] = [
  { label: "Loan interest", display: "20%", value: src(0.2, A("Loan interest rate")), fmt: pct() },
  { label: "DSCR covenant", display: "1.30×", value: src(1.3, A("DSCR covenant")), fmt: { decimals: 2, suffix: "×" } },
  { label: "Rent escalation", display: "25%", value: src(0.25, A("Rent escalation p.a.")), fmt: pct() },
  { label: "Corporate tax", display: "30%", value: src(0.3, A("Corporate income tax")), fmt: pct() },
  { label: "Discount rate", display: "20%", value: src(0.2, A("Discount rate")), fmt: pct() },
  { label: "FX ETB/USD", display: "160", value: src(160, A("FX ETB/USD")), fmt: { suffix: "" } },
];

export const assumptionsFootnote =
  "* Basement warehouse rent has no sourced comparable — flagged by the model as the single most valuable next input.";

// PPP structure — financial model Cover + Capex sheets.
export const ppp = {
  split: "70 / 30",
  tdomaSharePct: src(70, SRC.fin("Cover › 70/30 PPP structure")),
  citySharePct: src(30, SRC.fin("Cover › City's 30% as non-controlling interest")),
  landInKindEtb: src(1650000000, SRC.fin("Capex › Land (in-kind, NON-CASH)")),
  cityContribution: "Land, contributed in-kind — the City's non-cash PPP contribution",
  tdomaContribution: "Equity (75% of cash requirement) + delivery of the development",
  debtEtb: src(1330949861, SRC.fin("Capex › Debt (25% of cash)")),
  equityEtb: src(3992849583, SRC.fin("Capex › TDOMA equity (75% of cash)")),
  presentation: "Consolidated 100%; City's 30% held as non-controlling interest — full IFRS (Proclamation No. 847/2014, AABE)",
};
