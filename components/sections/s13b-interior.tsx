"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01, lerp } from "@/lib/scroll/ease";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { interiorSequence } from "@/lib/sequence/manifest";

/**
 * S13b — Interior walk-through. The scroll drives a tour of the trading hall;
 * descriptive glass captions hand off one to the next as the camera moves, so
 * the viewer reads what they are looking at at each beat.
 */
const beats = [
  {
    at: 0.02,
    kicker: "Ground concourse",
    title: "A market that finally has a roof.",
    body: "Merkato’s trade brought indoors: wide, daylit aisles, formal stalls and clear circulation — the same commerce, on serviced floorplate.",
  },
  {
    at: 0.3,
    kicker: "Trading floor",
    title: "Every trader keeps their shopfront.",
    body: "Modular stall bays let existing merchants relocate without losing display frontage or footfall, each with power, storage and a lockable unit.",
  },
  {
    at: 0.56,
    kicker: "Atrium",
    title: "Daylight all the way down.",
    body: "A full-height atrium carries daylight to the lower trading levels, cutting lighting load and making wayfinding legible from any floor.",
  },
  {
    at: 0.8,
    kicker: "Branded concourse",
    title: "One address for the district.",
    body: "The TDOMA concourse anchors the arrival sequence — reception, vertical cores and tenant services under a single managed identity.",
  },
];

export default function Interior({ progress }: ChapterProps) {
  const scrubT = clamp01(seg(progress, 0.02, 0.94));

  return (
    <div className="relative h-full w-full overflow-hidden">
      <SequenceScrubber
        progress={scrubT}
        manifest={interiorSequence}
        label="Liiban Smart Mall — interior walk-through of the trading hall."
        className="absolute inset-0 h-full w-full"
      />

      {/* Section marker */}
      <div className="absolute left-0 top-0 p-6 md:p-8">
        <div className="glass-dark px-4 py-2">
          <p className="font-tech-label text-xs text-white/90">14 · Inside the building</p>
        </div>
      </div>

      {/* Descriptive captions — each fades in on its beat and out on the next */}
      {beats.map((b, i) => {
        const next = beats[i + 1]?.at ?? 1.05;
        const appear = win(scrubT, b.at, b.at + 0.07);
        const leave = win(scrubT, next - 0.05, next);
        const o = appear * (1 - leave);
        return (
          <div
            key={b.kicker}
            className="pointer-events-none absolute bottom-0 left-0 w-full p-6 md:bottom-10 md:left-10 md:w-[min(34rem,45vw)] md:p-0"
            style={{ opacity: o, transform: `translateY(${lerp(18, 0, appear)}px)` }}
          >
            <div className="glass-dark p-6 2xl:p-7">
              <p className="font-tech-label text-xs text-[#ffd9a8]">{b.kicker}</p>
              <p className="font-display mt-2 text-2xl font-bold leading-tight text-white md:text-3xl">{b.title}</p>
              <p className="mt-2 text-base leading-relaxed text-white/85">{b.body}</p>
            </div>
          </div>
        );
      })}

      {/* Scrub hint, fades once the tour is under way */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center md:bottom-8" style={{ opacity: 1 - win(scrubT, 0.04, 0.14) }}>
        <div className="glass-dark px-5 py-2">
          <span className="font-tech-label text-xs text-white/90">Scroll to walk through ↓</span>
        </div>
      </div>
    </div>
  );
}
