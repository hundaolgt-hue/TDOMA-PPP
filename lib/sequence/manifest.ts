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

// Exploded assembly for chapter 1 — decoded from explosion_video.mp4. Finished
// tower → separates into labeled architectural layers.
export const ch1Sequence: SequenceManifest = {
  count: 121,
  path: (i) => `frames/ch1/frame_${String(i).padStart(4, "0")}.jpg`,
};

// Turntable orbit for chapter 2 — decoded from revolve_video.mp4. Camera
// revolves around the finished tower.
export const ch2Sequence: SequenceManifest = {
  count: 170,
  path: (i) => `frames/ch2/frame_${String(i).padStart(4, "0")}.jpg`,
};
