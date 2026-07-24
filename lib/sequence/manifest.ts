export type SequenceManifest = {
  count: number;
  /** 1-indexed frame URL. */
  path: (oneIndexed: number) => string;
};

// Root-absolute, base-path-aware so frames resolve at the site root (local dev,
// Vercel) and under a GitHub Pages project subpath alike.
const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";
const frame = (chapter: string, i: number) =>
  `${BP}/frames/${chapter}/frame_${String(i).padStart(4, "0")}.jpg`;

// Hero film — decoded from Hero_video.mp4 (1080p). Branded green/white intro
// resolving to the TDOMA logo.
export const heroSequence: SequenceManifest = {
  count: 91,
  path: (i) => frame("hero", i),
};

// Construction sequence for S7 — decoded from construction_phase.mp4 (1080p,
// green-themed) to 203 frames @ 1280px. Bare frame → MEP systems → finished
// tower.
export const ch3Sequence: SequenceManifest = {
  count: 203,
  path: (i) => frame("ch3", i),
};

// Exploded assembly for chapter 1 — decoded from explosion_video.mp4. Finished
// tower → separates into labeled architectural layers.
export const ch1Sequence: SequenceManifest = {
  count: 121,
  path: (i) => frame("ch1", i),
};

// Turntable orbit for chapter 2 — decoded from revolve_video.mp4. Camera
// revolves around the finished tower.
export const ch2Sequence: SequenceManifest = {
  count: 170,
  path: (i) => frame("ch2", i),
};

// Programme separation film — decoded from Programs_video.mp4 (1080p, green).
// Programmes light up in coloured, labelled bands ground-to-top.
export const programSequence: SequenceManifest = {
  count: 81,
  path: (i) => frame("program", i),
};
