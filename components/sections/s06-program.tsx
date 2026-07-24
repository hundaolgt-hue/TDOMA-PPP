"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01 } from "@/lib/scroll/ease";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { programSequence } from "@/lib/sequence/manifest";
import { totalNetGla, zones } from "@/data/program";

/**
 * S6 — Programme separation film. The real programme video (Programs_video.mp4)
 * lights the building's programmes in coloured, labelled bands ground-to-top
 * as it scrubs. It carries its own labels, so the overlay stays minimal: a
 * title and a sourced GLA footnote — no competing legend.
 */
export default function Program({ progress }: ChapterProps) {
  const scrubT = clamp01(seg(progress, 0.0, 0.75));
  return (
    <div className="relative h-full w-full overflow-hidden">
      <SequenceScrubber
        progress={scrubT}
        manifest={programSequence}
        label="Liiban Smart Mall programme separation — retail, convention, offices, business, hospitality and HQ lit ground to top."
        className="absolute inset-0 h-full w-full"
      />

      <div className="absolute inset-x-0 top-0 flex justify-center p-6 md:p-8">
        <div className="glass px-7 py-3 text-center">
          <p className="font-tech-label text-[11px] text-[var(--orange)]">05 · Programme</p>
          <h2 className="font-display text-3xl font-bold text-[var(--green-deep)] md:text-4xl">Program, ground to sky.</h2>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center p-6 md:p-8" style={{ opacity: win(progress, 0.2, 0.4) }}>
        <div className="glass px-6 py-3 text-center">
          <p className="text-sm text-[var(--ink)]">
            <span className="font-display text-xl font-bold text-[var(--green-deep)]">{zones.length}</span> programme clusters ·
            total net GLA <span className="font-display text-xl font-bold text-[var(--green-deep)]">{totalNetGla.value.toLocaleString()}</span> m²
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--dim)]">Area Allocation Matrix</p>
        </div>
      </div>
    </div>
  );
}
