"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01, lerp } from "@/lib/scroll/ease";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { navSequence } from "@/lib/sequence/manifest";

/**
 * S14 — Final navigation film & close. An aerial fly-around of the finished
 * tower in its Merkato context (nav_video.mp4), resolving to the TDOMA
 * sign-off over a glass panel.
 */
// Descriptive beats for the exterior fly-around, timed to the scrub window and
// clearing before the sign-off panel resolves.
const exteriorBeats = [
  {
    at: 0.02,
    kicker: "Roofscape",
    title: "Sky gardens crown the tower.",
    body: "Planted terraces and a shaded roof pavilion give traders and office tenants amenity space fifteen floors above the market.",
  },
  {
    at: 0.22,
    kicker: "The tower",
    title: "G+15 on a 5,000 m² plot.",
    body: "A slender, louvred façade lifts lettable area far above the site footprint — formal space where the district has none.",
  },
  {
    at: 0.42,
    kicker: "Street & context",
    title: "Stitched into Merkato.",
    body: "The podium meets the street with active retail frontage, servicing held to the rear so goods and shoppers no longer compete.",
  },
];

export default function Final({ progress }: ChapterProps) {
  const scrubT = clamp01(seg(progress, 0.02, 0.72));
  const closeIn = win(progress, 0.58, 0.78);
  return (
    <div className="relative h-full w-full overflow-hidden">
      <SequenceScrubber
        progress={scrubT}
        manifest={navSequence}
        label="Liiban Smart Mall — closing navigation film."
        className="absolute inset-0 h-full w-full"
      />
      {/* Section marker */}
      <div className="absolute left-0 top-0 p-6 md:p-8" style={{ opacity: 1 - closeIn }}>
        <div className="glass-dark px-4 py-2">
          <p className="font-tech-label text-xs text-white/90">15 · The building in its city</p>
        </div>
      </div>

      {/* Descriptive captions across the exterior fly-around */}
      {exteriorBeats.map((b, i) => {
        const next = exteriorBeats[i + 1]?.at ?? 0.62;
        const appear = win(scrubT, b.at, b.at + 0.07);
        const leave = win(scrubT, next - 0.05, next);
        const o = appear * (1 - leave) * (1 - closeIn);
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

      <div className="pointer-events-none absolute inset-0" style={{ opacity: closeIn, background: "linear-gradient(180deg, rgba(246,251,247,0.2), rgba(227,243,232,0.72))" }} />

      <div className="absolute inset-0 flex items-center justify-center p-6" style={{ opacity: closeIn }}>
        <div className="glass-strong grain relative max-w-2xl overflow-hidden p-10 text-center 2xl:p-14">
          <p className="font-tech-label text-sm text-[var(--orange-text)]">Liiban Smart Mall</p>
          <p className="font-display mt-3 text-4xl font-bold leading-tight text-[var(--green-deep)] md:text-5xl">
            A vertical trading city for Merkato.
          </p>
          <p className="mt-4 text-sm text-[var(--dim)] md:text-base">
            TDOMA S.C. · 70/30 PPP with the City Government of Addis Ababa · full IFRS
          </p>
          <div className="mt-6 inline-block">
            <span className="font-display text-3xl font-bold tracking-[0.3em] text-[var(--green-deep)]">
              TDOMA<span className="text-[var(--orange-text)]">.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
