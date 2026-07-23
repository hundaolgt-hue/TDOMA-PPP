"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01 } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { ch3Sequence } from "@/lib/sequence/manifest";
import { constructionPhases, totalConstructionEtb, constructionMonths } from "@/data/phases";
import { title } from "./timeline";

const M = 1e6;

/**
 * Chapter 3 — Construction phasing.
 * The real CGI construction sequence (TDOMA_Presentation.mp4, decoded to a
 * frame sequence) scrubs with scroll from bare frame to finished tower.
 * The sourced BOQ phase data overlays as a synchronized stage tracker on the
 * same progress value — footage and data can never desync.
 */
export default function ConstructionPhasing({ progress }: ChapterProps) {
  const n = constructionPhases.length;
  // Section is 360vh, so CSS-sticky unpins at progress ≈ 0.72. Complete the
  // build by 0.68 and hold the finished tower briefly before it scrolls away.
  const buildT = clamp01(seg(progress, 0.05, 0.68));
  const active = Math.min(n - 1, Math.floor(buildT * n));
  const activePhase = constructionPhases[active];

  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-neutral-100">
      <SequenceScrubber
        progress={buildT}
        manifest={ch3Sequence}
        label="Liiban Smart Mall construction sequence — from structural frame through MEP systems and façade to the finished tower."
        className="absolute inset-0 h-full w-full"
      />

      {/* Top scrim + title */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/85 via-black/45 to-transparent p-6 pb-28 md:p-10">
        <TextReveal progress={progress} start={title.start} end={title.end}>
          <h2 className="font-display text-4xl leading-tight md:text-5xl" style={{ textShadow: "0 2px 18px rgba(0,0,0,0.85)" }}>Built, floor by floor.</h2>
        </TextReveal>
        <p className="mt-2 text-sm text-neutral-200" style={{ opacity: win(progress, title.start, title.end), textShadow: "0 1px 12px rgba(0,0,0,0.9)" }}>
          {constructionMonths.value} months · {(totalConstructionEtb.value / 1e9).toFixed(2)} bn ETB construction works
        </p>
      </div>

      {/* Bottom scrim + synchronized stage tracker */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 pt-20 md:p-10 md:pt-24">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <p className="font-display text-xl md:text-2xl">
            {activePhase.label}
            <span className="ml-3 text-sm tabular-nums text-neutral-400">
              BOQ {activePhase.boqElements.join("+")} · {(activePhase.costEtb.value / M).toFixed(0)}M ETB
            </span>
          </p>
          <p className="hidden text-xs uppercase tracking-widest text-neutral-400 md:block">
            Stage {active + 1} / {n}
          </p>
        </div>

        <div className="relative h-1 w-full rounded bg-white/20">
          <div className="absolute inset-y-0 left-0 rounded bg-white" style={{ width: `${buildT * 100}%` }} />
          {constructionPhases.map((_, i) => (
            <div key={i} className="absolute top-[-3px] h-[7px] w-px bg-white/40" style={{ left: `${(i / n) * 100}%` }} />
          ))}
        </div>

        <ol className="mt-3 hidden grid-cols-6 gap-2 md:grid">
          {constructionPhases.map((phase, i) => (
            <li
              key={phase.id}
              className="text-[11px] uppercase tracking-wider transition-opacity"
              style={{ opacity: i <= active ? 1 : 0.4 }}
              aria-current={i === active ? "step" : undefined}
            >
              <span className="block text-neutral-100">{phase.label}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[11px] text-neutral-400">
          Footage: TDOMA presentation render, scroll-scrubbed. Stage costs sourced from the elemental BOQ.
        </p>
      </div>
    </div>
  );
}
