"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01, lerp } from "@/lib/scroll/ease";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { ch1Sequence } from "@/lib/sequence/manifest";
import { zones, totalNetGla } from "@/data/program";

const zoneWindow = (i: number, count: number) => {
  const span = 0.72 / count;
  const start = 0.12 + i * span;
  return { start, end: start + span * 1.5 };
};

/**
 * S6 — Programmatic separation film. As the building resolves, its programme
 * clusters light up in colour in sequence, ground-to-top, in the glass legend.
 * PLACEHOLDER FOOTAGE: the separation render stands in until the 1080p
 * programme video (colour-coded per zone) arrives.
 */
export default function Program({ progress }: ChapterProps) {
  const scrubT = clamp01(seg(progress, 0.05, 0.72));
  return (
    <div className="relative h-full w-full overflow-hidden">
      <SequenceScrubber
        progress={scrubT}
        manifest={ch1Sequence}
        label="Liiban Smart Mall programme separation — clusters highlighted from ground to top."
        className="absolute inset-0 h-full w-full"
      />
      {/* light wash so glass legend reads over bright frames */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(246,251,247,0.10) 40%, rgba(246,251,247,0.62) 100%)" }} />

      <div className="absolute inset-x-0 top-0 flex justify-center p-6 md:p-8">
        <div className="glass px-7 py-3 text-center">
          <p className="font-tech-label text-[11px] text-[var(--orange)]">05 · Programme</p>
          <h2 className="font-display text-3xl font-bold text-[var(--green-deep)] md:text-4xl">Program, ground to sky.</h2>
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 flex w-full max-w-md items-center p-6 md:p-10">
        <div className="glass-strong w-full p-6 2xl:p-8">
          <ul className="flex flex-col gap-1.5">
            {zones.map((zone, i) => {
              const w = zoneWindow(i, zones.length);
              const lit = win(scrubT, w.start, w.end);
              return (
                <li key={zone.id} className="flex items-center gap-3 text-sm" style={{ opacity: lerp(0.4, 1, lit) }}>
                  <span className="h-3.5 w-3.5 shrink-0 rounded-[3px]" style={{ background: zone.color, boxShadow: lit > 0.5 ? `0 0 12px ${zone.color}` : "none" }} />
                  <span className="flex-1 font-medium text-[var(--ink)]">{zone.label}</span>
                  <span className="tabular-nums text-xs text-[var(--dim)]">{zone.areaSqm.value.toLocaleString()} m²</span>
                  <span className="w-10 text-right text-[11px] tabular-nums text-[var(--green)]">{zone.sharePct.value}%</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 border-t border-[var(--glass-border)] pt-3 text-xs text-[var(--dim)]">
            Total net GLA <span className="font-semibold text-[var(--green-deep)]">{totalNetGla.value.toLocaleString()} m²</span> · Area Allocation Matrix
          </p>
        </div>
      </div>
    </div>
  );
}
