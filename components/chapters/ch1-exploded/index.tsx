"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01 } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { ch1Sequence } from "@/lib/sequence/manifest";
import { buildingLayers } from "@/data/program";
import { title } from "./timeline";

const M = 1e6;
const systemsTotal = buildingLayers.reduce((s, l) => s + l.costEtb.value, 0);

/**
 * Chapter 1 — Exploded assembly.
 * The real explosion render (explosion_video.mp4 → frame sequence) scrubs the
 * finished tower apart into its labeled architectural layers. The sourced BOQ
 * system costs ride the building as it separates, then fade out so the
 * render's own architectural callouts stand alone on the fully-exploded frame.
 */
export default function ExplodedAssembly({ progress }: ChapterProps) {
  // Section is 340vh → unpins at progress ≈ 0.71; finish exploding by 0.66.
  const explodeT = clamp01(seg(progress, 0.05, 0.66));
  // Cost strip rides the mid-explosion, then hands off to the render's labels.
  const overlayOp = win(progress, 0.12, 0.28) * (1 - win(progress, 0.52, 0.64));

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0c0e12] text-neutral-100">
      <SequenceScrubber
        progress={explodeT}
        manifest={ch1Sequence}
        label="Liiban Smart Mall exploded assembly — the finished tower separates into rooftop, façade, structural frame, MEP systems and substructure."
        className="absolute inset-0 h-full w-full"
      />

      {/* Top scrim + title. Explosion render has a near-white sky, so the
          scrim must be strong enough for white type to hold contrast. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/85 via-black/45 to-transparent p-6 pb-28 md:p-10">
        <TextReveal progress={progress} start={title.start} end={title.end}>
          <h2 className="font-display text-4xl leading-tight md:text-5xl" style={{ textShadow: "0 2px 18px rgba(0,0,0,0.85)" }}>
            One building,
            <br />
            five systems.
          </h2>
        </TextReveal>
        <p className="mt-2 text-sm text-neutral-200" style={{ opacity: win(progress, title.start, title.end), textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}>
          {(systemsTotal / 1e9).toFixed(2)} bn ETB of systems, sourced from the elemental BOQ.
        </p>
      </div>

      {/* Sourced system-cost strip — rides the explosion, then fades for the render's labels */}
      <div
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 pt-20 md:p-10"
        style={{ opacity: overlayOp }}
      >
        <ol className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-5">
          {buildingLayers.map((layer) => (
            <li key={layer.id} className="border-l border-white/30 pl-3">
              <p className="text-xs font-medium leading-tight">{layer.label}</p>
              <p className="text-[11px] tabular-nums text-neutral-300">{(layer.costEtb.value / M).toFixed(0)}M ETB</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
