// All chapter 1 timing lives here. Windows are fractions of chapter progress.

export const CH1_HEIGHT_VH = 340;

export const title = { start: 0.02, end: 0.1 };

/** Each layer separates in its own window; callout follows the separation. */
export const layerWindows = [
  { separate: { start: 0.12, end: 0.3 }, callout: { start: 0.22, end: 0.3 } }, // smart
  { separate: { start: 0.28, end: 0.46 }, callout: { start: 0.38, end: 0.46 } }, // electrical
  { separate: { start: 0.44, end: 0.62 }, callout: { start: 0.54, end: 0.62 } }, // façade
  { separate: { start: 0.6, end: 0.78 }, callout: { start: 0.7, end: 0.78 } }, // frame
  { separate: { start: 0.76, end: 0.92 }, callout: { start: 0.84, end: 0.92 } }, // basement
] as const;

/** Vertical spread per layer index at full separation, in vh. */
export const SPREAD_VH = 13;
