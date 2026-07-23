"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { ch2Sequence } from "@/lib/sequence/manifest";
import { zones, totalNetGla } from "@/data/program";
import { title, zoneWindow } from "./timeline";

/**
 * Chapter 2 — Programmatic rotation.
 * The real orbit render (revolve_video.mp4 → frame sequence) revolves the
 * finished tower with scroll. The 13 sourced programme clusters highlight in
 * sequence in the legend as the building turns — driven by the same progress
 * value. (Click-to-isolate needs live geometry; that's the WebGL upgrade
 * path. The footage keeps the rotation cinematic in the meantime.)
 */
export default function Turntable({ progress }: ChapterProps) {
  // Section is 400vh → unpins at progress ≈ 0.75. Orbit across 0.03–0.72.
  const orbitT = clamp01(seg(progress, 0.03, 0.72));

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0c10] text-neutral-100">
      <SequenceScrubber
        progress={orbitT}
        manifest={ch2Sequence}
        label="Liiban Smart Mall turntable — the finished tower revolves to show all elevations."
        className="absolute inset-0 h-full w-full"
      />

      {/* Left scrim + title */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/85 via-black/40 to-transparent p-6 pb-28 md:p-10">
        <TextReveal progress={progress} start={title.start} end={title.end}>
          <h2 className="font-display text-4xl leading-tight md:text-5xl" style={{ textShadow: "0 2px 18px rgba(0,0,0,0.85)" }}>
            Program, in the round.
          </h2>
        </TextReveal>
      </div>

      {/* Right legend rail — clusters highlight in sequence as the tower turns */}
      <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col justify-center bg-gradient-to-l from-black/80 via-black/45 to-transparent p-6 pl-16 md:p-10 md:pl-20">
        <ul className="flex flex-col gap-1.5" aria-label="Programme clusters and net GLA">
          {zones.map((zone, i) => {
            const w = zoneWindow(i, zones.length);
            const lit = win(orbitT, w.start, w.end);
            return (
              <li key={zone.id} className="flex items-center gap-3 text-sm" style={{ opacity: lerp(0.45, 1, lit) }}>
                <span
                  className="h-3 w-3 shrink-0 rounded-[2px] transition-all"
                  style={{ backgroundColor: zone.color, boxShadow: lit > 0.5 ? `0 0 12px ${zone.color}` : "none" }}
                  aria-hidden
                />
                <span className="flex-1" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>{zone.label}</span>
                <span className="text-xs tabular-nums text-neutral-300" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
                  {zone.areaSqm.value.toLocaleString()} m²
                </span>
                <span className="w-10 text-right text-[11px] tabular-nums text-neutral-400">{zone.sharePct.value}%</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs text-neutral-400" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
          Total net GLA {totalNetGla.value.toLocaleString()} m². Areas from the Area Allocation Matrix.
        </p>
      </div>
    </div>
  );
}
