"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { seg, clamp01 } from "@/lib/scroll/ease";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { ch3Sequence } from "@/lib/sequence/manifest";
import { constructionPhases, totalConstructionEtb, constructionMonths, preliminaries } from "@/data/phases";
import { phaseDetails } from "@/data/phaseDetails";

const M = 1e6;

/**
 * S7 — Construction phasing film with live per-stage data in the left and
 * right margins. The construction render scrubs centre-frame; the panels read
 * out the active stage's activities (left) and sourced BOQ quantities (right),
 * all driven by the same scroll progress.
 */
export default function Phasing({ progress }: ChapterProps) {
  const buildT = clamp01(seg(progress, 0.05, 0.7));
  const n = constructionPhases.length;
  const active = Math.min(n - 1, Math.floor(buildT * n));
  const phase = constructionPhases[active];
  const detail = phaseDetails[phase.id];
  const cumCost = constructionPhases.slice(0, active + 1).reduce((s, p) => s + p.costEtb.value, 0);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <SequenceScrubber
        progress={buildT}
        manifest={ch3Sequence}
        label="Liiban Smart Mall construction sequence — bare frame to finished tower."
        className="absolute inset-0 h-full w-full"
      />

      {/* Top title */}
      <div className="absolute inset-x-0 top-0 flex justify-center p-6 md:p-8">
        <div className="glass px-8 py-4 text-center">
          <p className="label text-[var(--orange-text)]">07 · Delivery</p>
          <h2 className="font-display text-3xl font-bold text-[var(--green-deep)] md:text-4xl">Built in six stages.</h2>
          <p className="mt-1 text-base text-[var(--dim)]">
            {constructionMonths.value} months · {(totalConstructionEtb.value / 1e9).toFixed(2)} bn ETB works
          </p>
        </div>
      </div>

      {/* LEFT — active stage + activities */}
      <div className="absolute left-0 top-1/2 hidden w-[26rem] -translate-y-1/2 p-6 lg:block 2xl:w-[30rem]">
        <div className="holo hud p-7">
          <div className="flex items-center gap-2">
            <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--orange)]" />
            <span className="label text-[var(--orange-text)]">Stage {active + 1} / {n}</span>
          </div>
          <h3 className="font-display mt-2 text-3xl font-bold text-[var(--green-deep)]">{phase.label}</h3>
          <p className="mt-1 font-display text-lg text-[var(--green)]">
            BOQ {phase.boqElements.join(" + ")} · {(phase.costEtb.value / M).toFixed(0)}M ETB · {detail.pctOfWorks}% of works
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {detail.activities.map((a) => (
              <li key={a} className="flex gap-2.5 text-base text-[var(--ink)]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--green)]" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT — sourced BOQ quantities */}
      <div className="absolute right-0 top-1/2 hidden w-[24rem] -translate-y-1/2 p-6 lg:block 2xl:w-[28rem]">
        <div className="holo hud p-7">
          <span className="label text-[var(--green)]">Key quantities</span>
          <dl className="mt-3 grid grid-cols-2 gap-4">
            {detail.quantities.map((q) => (
              <div key={q.label} className="glass p-4">
                <dt className="text-sm text-[var(--dim)]">{q.label}</dt>
                <dd className="font-display mt-0.5 text-xl font-semibold tabular-nums text-[var(--green-deep)]">{q.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 border-t border-[var(--green)]/15 pt-3 text-sm text-[var(--dim)]">
            Sourced from the elemental BOQ — re-measure from detailed drawings before tender.
          </p>
        </div>
      </div>

      {/* Bottom — stage progress + cumulative cost */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <div className="holo p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-display text-xl font-semibold text-[var(--green-deep)] lg:hidden">
              {phase.label} <span className="text-base font-medium text-[var(--dim)]">· {(phase.costEtb.value / M).toFixed(0)}M ETB</span>
            </p>
            <p className="label text-[var(--green)]">Preliminaries (BOQ A) {(preliminaries.value / M).toFixed(0)}M — span the whole programme</p>
            <p className="font-display text-xl font-bold text-[var(--orange-text)]">
              Cumulative <span className="tabular-nums">{(cumCost / 1e9).toFixed(2)}</span> bn ETB
            </p>
          </div>
          <div className="relative mt-4 h-2 w-full rounded-full bg-[var(--green)]/15">
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${buildT * 100}%`, background: "linear-gradient(90deg,var(--green-deep),var(--orange))" }} />
            {constructionPhases.map((_, i) => (
              <div key={i} className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-[var(--green-deep)]/30" style={{ left: `${(i / n) * 100}%` }} />
            ))}
          </div>
          <ol className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            {constructionPhases.map((p, i) => (
              <li key={p.id} className="font-tech-label text-sm" style={{ opacity: i <= active ? 1 : 0.4, color: i === active ? "var(--orange)" : "var(--green-deep)" }}>
                {p.label}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
