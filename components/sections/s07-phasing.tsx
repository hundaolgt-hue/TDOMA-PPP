"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01, lerp } from "@/lib/scroll/ease";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { ch3Sequence } from "@/lib/sequence/manifest";
import { constructionPhases, totalConstructionEtb, constructionMonths } from "@/data/phases";

const M = 1e6;

/**
 * S7 — Construction phasing film with per-stage cost, animated alongside the
 * build. Real construction render scrubbed by scroll; sourced BOQ stage costs
 * track the same progress.
 */
export default function Phasing({ progress }: ChapterProps) {
  const buildT = clamp01(seg(progress, 0.05, 0.7));
  const n = constructionPhases.length;
  const active = Math.min(n - 1, Math.floor(buildT * n));
  const activePhase = constructionPhases[active];
  const cumCost = constructionPhases.slice(0, active + 1).reduce((s, p) => s + p.costEtb.value, 0);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <SequenceScrubber
        progress={buildT}
        manifest={ch3Sequence}
        label="Liiban Smart Mall construction sequence — bare frame to finished tower."
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-x-0 top-0 flex justify-center p-6 md:p-8">
        <div className="glass px-7 py-3 text-center">
          <p className="font-tech-label text-[11px] text-[var(--orange)]">06 · Delivery</p>
          <h2 className="font-display text-3xl font-bold text-[var(--green-deep)] md:text-4xl">Built in six stages.</h2>
          <p className="mt-1 text-xs text-[var(--dim)]">{constructionMonths.value} months · {(totalConstructionEtb.value / 1e9).toFixed(2)} bn ETB works</p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
        <div className="glass-strong p-6 2xl:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-display text-2xl font-bold text-[var(--green-deep)]">
              {activePhase.label}
              <span className="ml-3 text-sm font-medium tabular-nums text-[var(--dim)]">BOQ {activePhase.boqElements.join("+")} · {(activePhase.costEtb.value / M).toFixed(0)}M ETB</span>
            </p>
            <p className="font-display text-lg font-semibold text-[var(--green)]">
              Cumulative <span className="tabular-nums">{(cumCost / 1e9).toFixed(2)}</span> bn ETB
            </p>
          </div>
          <div className="relative mt-4 h-1.5 w-full rounded-full bg-[var(--green)]/15">
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${buildT * 100}%`, background: "linear-gradient(90deg,var(--green),var(--orange))" }} />
            {constructionPhases.map((_, i) => (
              <div key={i} className="absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-[var(--green-deep)]/30" style={{ left: `${(i / n) * 100}%` }} />
            ))}
          </div>
          <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            {constructionPhases.map((phase, i) => (
              <li key={phase.id} className="text-[11px] font-medium uppercase tracking-wider" style={{ opacity: i <= active ? 1 : 0.4, color: i === active ? "var(--orange)" : "var(--green-deep)" }}>
                {phase.label}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <span className="sr-only">{Math.round(lerp(0, 100, buildT))}</span>
    </div>
  );
}
