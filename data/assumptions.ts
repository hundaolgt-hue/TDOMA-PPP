import { src, SRC, type Sourced } from "./types";

// Financial Assumptions register — TDOMA_Liiban_Financial_Model_v2_AUDITED.xlsx
// › Assumptions sheet. Grouped for the assumptions section.

export type AssumptionItem = {
  label: string;
  display: string;
  value: Sourced<number>;
};

export type AssumptionGroup = { title: string; items: AssumptionItem[] };

const A = (loc: string) => SRC.fin(`Assumptions › ${loc}`);

export const assumptionGroups: AssumptionGroup[] = [
  {
    title: "Financing",
    items: [
      { label: "Loan interest rate", display: "20%", value: src(0.2, A("Loan interest rate")) },
      { label: "Debt share of cash requirement", display: "25%", value: src(0.25, A("Debt share")) },
      { label: "Loan tenor", display: "7 yrs", value: src(7, A("Loan tenor")) },
      { label: "Grace period", display: "3 yrs", value: src(3, A("Grace period")) },
      { label: "DSCR covenant", display: "1.30×", value: src(1.3, A("DSCR covenant")) },
      { label: "Arrangement fee", display: "1.5%", value: src(0.015, A("Arrangement fee %")) },
    ],
  },
  {
    title: "Revenue rates (ETB/m²/mo)",
    items: [
      { label: "Retail contract rent", display: "6,250", value: src(6250, A("Retail contract rent")) },
      { label: "Office rent", display: "4,600", value: src(4600, A("Office rent")) },
      { label: "Wholesale showrooms", display: "4,600", value: src(4600, A("Wholesale showrooms rent")) },
      { label: "Trade services", display: "5,625", value: src(5625, A("Trade services rent")) },
      { label: "Basement warehouse", display: "3,500 *", value: src(3500, A("Basement warehouse rent — NO SOURCED COMPARABLE")) },
      { label: "Retail sale price (ETB/m²)", display: "540,000", value: src(540000, A("Retail sale price")) },
    ],
  },
  {
    title: "Operations & growth",
    items: [
      { label: "Occupancy Y1 → Y2 → stabilised", display: "75 → 85 → 95%", value: src(0.95, A("Occupancy ramp")) },
      { label: "Rent escalation p.a.", display: "25%", value: src(0.25, A("Rent escalation p.a.")) },
      { label: "Opex escalation p.a.", display: "5%", value: src(0.05, A("Opex escalation p.a.")) },
      { label: "Property opex (% of stabilised rent)", display: "25%", value: src(0.25, A("Property opex")) },
      { label: "Management fee (% gross revenue)", display: "4%", value: src(0.04, A("Management fee")) },
      { label: "Bad debt (% billed rent)", display: "2%", value: src(0.02, A("Bad debt")) },
    ],
  },
  {
    title: "Tax & macro",
    items: [
      { label: "Corporate income tax", display: "30%", value: src(0.3, A("Corporate income tax")) },
      { label: "VAT", display: "15%", value: src(0.15, A("VAT")) },
      { label: "FX ETB/USD", display: "160", value: src(160, A("FX ETB/USD")) },
      { label: "Discount rate (DCF hurdle)", display: "20%", value: src(0.2, A("Discount rate")) },
      { label: "Terminal / exit cap rate", display: "10.5%", value: src(0.105, A("Exit cap rate")) },
      { label: "Equity IRR hurdle", display: "24%", value: src(0.24, A("Equity IRR hurdle (audit-added)")) },
    ],
  },
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
