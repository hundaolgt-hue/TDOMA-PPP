import { SRC } from "./types";

// Operating-year time series (O1–O12), ETB — TDOMA_Liiban_Financial_Model_v2
// _AUDITED.xlsx (PL, CashFlow, Financing sheets). Values in ETB millions for
// compact charting.
export const years = ["O1", "O2", "O3", "O4", "O5", "O6", "O7", "O8", "O9", "O10", "O11", "O12"];

const M = 1e6;
const toM = (arr: number[]) => arr.map((v) => Math.round(v / M));

export const revenueM = toM([2337167478, 1189661890, 1610356393, 2003401064, 2494038792, 3106621074, 3871584008, 4826969212, 6020324961, 7511082588, 9373526970, 11700509608]);
export const ebitdaM = toM([987236458, 851805853, 1202819192, 1530133129, 1940440208, 2454535340, 3098413684, 3904570727, 4913627381, 6176361354, 7756246355, 9732626100]);
export const ebitM = toM([885701576, 750270971, 1101284310, 1428598247, 1838905326, 2353000458, 2996878802, 3823523367, 4832580022, 6095313995, 7675198996, 9651578741]);
export const patM = toM([40173444, 373568506, 660932012, 940036770, 1287233728, 1647100321, 2097815161, 2676466357, 3382806015, 4266719796, 5372639297, 6756105119]);
export const rentalM = toM([597388696, 846300652, 1182331793, 1477914742, 1847393427, 2309241784, 2886552230, 3608190288, 4510237860, 5637797325, 7047246656, 8809058320]);
export const closingCashM = toM([1866355642, 1894116791, 2003539024, 2179094718, 2955082351, 3909715746, 5088676534, 6541797633, 8347429344, 10594490572, 13394089651, 16885084122]);
export const cfadsM = toM([2380487094, 728676854, 954019690, 1159705531, 1419604497, 1778183555, 2227868369, 2791354278, 3497034719, 4380421126, 5485918728, 6869047030]);

// Debt service window (O1–O4; loan repaid by O4) — Financing sheet.
export const dscrByYear = [4.63, 1.42, 1.86, 2.26];
export const loanSchedule = {
  drawnM: 1331,
  annuityM: 514,
  openingM: [1331, 1083, 785, 428],
  interestM: [266, 217, 157, 86],
  principalM: [248, 298, 357, 428],
};

// P&L waterfall at stabilised year O3 (ETB millions) — PL sheet.
export const plO3 = [
  { label: "Revenue", short: "Rev", valueM: 1610, kind: "total" as const },
  { label: "Cost of sales", short: "CoS", valueM: 0, kind: "cost" as const },
  { label: "Opex", short: "Opex", valueM: -408, kind: "cost" as const },
  { label: "EBITDA", short: "EBITDA", valueM: 1203, kind: "subtotal" as const },
  { label: "Depreciation", short: "Dep.", valueM: -102, kind: "cost" as const },
  { label: "Finance cost", short: "Fin.", valueM: -157, kind: "cost" as const },
  { label: "Tax", short: "Tax", valueM: -283, kind: "cost" as const },
  { label: "PAT", short: "PAT", valueM: 661, kind: "total" as const },
];

export const seriesSource = SRC.fin("PL / CashFlow / Financing sheets");
