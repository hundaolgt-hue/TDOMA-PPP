export const CH2_HEIGHT_VH = 400;

export const title = { start: 0.02, end: 0.1 };

/** Total turntable rotation across the chapter, degrees. */
export const ROTATION_DEG = 270;

/** Zone i illuminates in an evenly-spaced window across the mid-chapter. */
export const zoneWindow = (i: number, count: number) => {
  const span = 0.7 / count; // zones occupy progress 0.15 → 0.85
  const start = 0.15 + i * span;
  return { start, end: start + span * 0.6 };
};
