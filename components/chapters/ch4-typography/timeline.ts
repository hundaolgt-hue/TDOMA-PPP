export const CH4_HEIGHT_VH = 300;

// Three statements, each with per-line stagger (50ms-equivalent expressed as
// progress offsets), then a stat row of counters.
export const statementA = [
  { start: 0.05, end: 0.16 },
  { start: 0.08, end: 0.19 },
] as const;

export const statementB = [
  { start: 0.3, end: 0.41 },
  { start: 0.33, end: 0.44 },
] as const;

export const statRow = { start: 0.58, end: 0.78 };
export const statementC = { start: 0.82, end: 0.94 };
