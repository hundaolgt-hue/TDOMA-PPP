export type SequenceManifest = {
  count: number;
  /** 1-indexed frame URL. */
  path: (oneIndexed: number) => string;
};

// Construction sequence for chapter 3 — decoded from TDOMA_Presentation.mp4
// (assets-raw) to 203 frames @ 1280px. Bare frame → MEP systems → façade →
// finished tower.
export const ch3Sequence: SequenceManifest = {
  count: 203,
  path: (i) => `frames/ch3/frame_${String(i).padStart(4, "0")}.jpg`,
};
