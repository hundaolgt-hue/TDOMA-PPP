export const CH6_HEIGHT_VH = 250;

export const title = { start: 0.02, end: 0.12 };
/** Rows cascade in across 0.12 → 0.5. */
export const rowWindow = (i: number, count: number) => {
  const span = 0.38 / count;
  const start = 0.12 + i * span;
  return { start, end: start + span * 2 > 1 ? 1 : start + span * 2 };
};
