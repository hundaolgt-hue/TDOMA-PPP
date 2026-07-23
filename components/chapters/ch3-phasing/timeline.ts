export const CH3_HEIGHT_VH = 360;

export const title = { start: 0.02, end: 0.1 };

/** Build sequence occupies progress 0.12 → 0.9, one window per phase. */
export const phaseWindow = (i: number, count: number) => {
  const span = 0.78 / count;
  const start = 0.12 + i * span;
  return { start, end: start + span };
};
