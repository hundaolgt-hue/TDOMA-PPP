"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp, seg, clamp01 } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import { constructionPhases, totalConstructionEtb, constructionMonths, constructionScurve } from "@/data/phases";
import { title, phaseWindow } from "./timeline";

const M = 1e6;

/**
 * Chapter 3 — Construction phasing (greybox).
 * Blocks assemble bottom-up per stage; each stage's height encodes its
 * sourced BOQ cost, and the scrubber tracks the real 3-year S-curve draw.
 */
export default function ConstructionPhasing({ progress }: ChapterProps) {
  const n = constructionPhases.length;
  const maxCost = Math.max(...constructionPhases.map((p) => p.costEtb.value));
  const buildT = clamp01(seg(progress, 0.12, 0.9));
  const activeIndex = Math.min(n - 1, Math.floor(buildT * n));

  return (
    <div className="flex h-full items-center justify-center bg-[#0c0e12] text-neutral-100">
      <div className="flex w-full max-w-5xl flex-col gap-8 px-6">
        <div className="flex items-baseline justify-between gap-4">
          <TextReveal progress={progress} start={title.start} end={title.end}>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">Built in six stages.</h2>
          </TextReveal>
          <span className="hidden text-[11px] uppercase tracking-widest text-neutral-600 md:block">
            {constructionMonths.value} months · {(totalConstructionEtb.value / 1e9).toFixed(2)} bn ETB works
          </span>
        </div>

        <div className="flex h-[42vh] items-end justify-center gap-2" aria-hidden>
          {constructionPhases.map((phase, i) => {
            const w = phaseWindow(i, n);
            const t = win(progress, w.start, w.end);
            const full = 25 + (phase.costEtb.value / maxCost) * 70;
            return (
              <div key={phase.id} className="flex h-full w-24 flex-col justify-end md:w-36">
                <span className="mb-1 text-center text-[10px] tabular-nums text-neutral-500" style={{ opacity: t }}>
                  {(phase.costEtb.value / M).toFixed(0)}M
                </span>
                <div
                  className="rounded-t-sm border border-neutral-500/50 bg-neutral-700/80"
                  style={{ height: `${lerp(0, full, t)}%`, opacity: t === 0 ? 0 : 1, transformOrigin: "bottom" }}
                />
              </div>
            );
          })}
        </div>

        {/* Synchronized scrubber with real S-curve year markers */}
        <div>
          <div className="relative h-1 w-full rounded bg-neutral-800">
            <div className="absolute inset-y-0 left-0 rounded bg-neutral-200" style={{ width: `${buildT * 100}%` }} />
            {constructionScurve.reduce<{ acc: number; nodes: React.ReactNode[] }>(
              (state, yr, idx) => {
                state.acc += yr.drawPct.value;
                if (idx < constructionScurve.length - 1) {
                  state.nodes.push(
                    <div key={yr.year} className="absolute top-[-3px] h-[7px] w-px bg-neutral-600" style={{ left: `${state.acc}%` }} />,
                  );
                }
                return state;
              },
              { acc: 0, nodes: [] },
            ).nodes}
          </div>
          <ol className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-6">
            {constructionPhases.map((phase, i) => (
              <li key={phase.id} className="text-xs uppercase tracking-wider" style={{ opacity: i <= activeIndex ? 1 : 0.35 }} aria-current={i === activeIndex ? "step" : undefined}>
                <span className="block text-neutral-200">{phase.label}</span>
                <span className="text-neutral-500">BOQ {phase.boqElements.join("+")}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-neutral-600">
            Bar height ∝ sourced BOQ element cost. Preliminaries (BOQ A, {(377096310 / M).toFixed(0)}M) span the whole programme. Timeline follows the model&apos;s 3-year S-curve draw ({constructionScurve.map((y) => `${y.drawPct.value}%`).join(" · ")}).
          </p>
        </div>
      </div>
    </div>
  );
}
