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
    at: 0.0,
    kicker: "Trading hall",
    title: "A market that finally has a roof.",
    body: "Merkato’s trade brought indoors: daylit aisles and formal stall bays, so merchants keep their shopfront and footfall on serviced floorplate.",
  },
  {
    at: 0.15,
    kicker: "Grand atrium",
    title: "Where the shareholders meet.",
    body: "The full-height atrium doubles as assembly space — the room in which a company owned by its own merchants can convene at scale.",
  },
  {
    at: 0.4,
    kicker: "Structured parking",
    title: "Vehicles off the street.",
    body: "Automated stacker bays with live availability take parking and loading off the district’s roads — congestion answered inside the plot.",
  },
  {
    at: 0.56,
    kicker: "Bonded warehouse",
    title: "Storage consolidated under one roof.",
    body: "Racked, barcoded pallet positions with dedicated goods circulation replace the dispersed storage that fragments Merkato’s logistics today.",
  },
  {
    at: 0.72,
    kicker: "Retail arcade",
    title: "One managed address.",
    body: "Reception, wayfinding, customer service and vertical cores anchor the arrival sequence for shoppers and tenants alike.",
  },
  {
    at: 0.88,
    kicker: "Dining atrium",
    title: "Reasons to stay all day.",
    body: "Food and beverage under the skylight extend dwell time, turning a wholesale destination into a place the city spends its day.",
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
