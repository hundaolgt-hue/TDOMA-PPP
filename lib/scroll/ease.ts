// Pure easing functions. Chapters must be pure functions of progress, so
// easing lives here as math, not as GSAP tweens with internal clocks.

export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Normalize master progress into a sub-window. Returns 0 before, 1 after. */
export const seg = (p: number, start: number, end: number): number =>
  clamp01((p - start) / (end - start));

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** power3.out equivalent — the house easing for reveals. */
export const easeOutPower3 = easeOutCubic;

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Eased sub-window in one call: the workhorse of every chapter timeline. */
export const win = (
  p: number,
  start: number,
  end: number,
  ease: (t: number) => number = easeOutCubic,
): number => ease(seg(p, start, end));

/** Linear interpolation over an eased window. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
