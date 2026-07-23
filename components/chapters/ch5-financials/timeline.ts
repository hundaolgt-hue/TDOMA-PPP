export const CH5_HEIGHT_VH = 350;

export const title = { start: 0.02, end: 0.1 };
export const headlineRow = { start: 0.1, end: 0.28 };

/** Waterfall bars grow from baseline in sequence across 0.3 → 0.7. */
export const waterfallBar = (i: number, count: number) => {
  const span = 0.4 / count;
  const start = 0.3 + i * span;
  return { start, end: start + span };
};

export const revenueMixRow = { start: 0.72, end: 0.88 };
