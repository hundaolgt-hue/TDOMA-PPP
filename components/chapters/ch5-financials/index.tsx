"use client";

import { useState } from "react";
import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { headline, cashflowWaterfall, revenueMix, sensitivity } from "@/data/financials";
import { title, headlineRow, waterfallBar, revenueMixRow } from "./timeline";

/**
 * Chapter 5 — Financial dashboard (pure DOM/SVG pipeline).
 * Every figure comes from data/financials.ts — nothing hardcoded here.
 * Waterfall bars grow from their own baseline in sequence, showing the cash
 * position changing rather than a chart merely appearing. Sensitivity is a
 * click-state morph between data cases, independent of scroll.
 */
export default function Financials({ progress }: ChapterProps) {
  const [caseIndex, setCaseIndex] = useState(0);
  const activeCase = sensitivity[caseIndex];

  // Waterfall running totals; the final "Net position" slot is computed.
  const steps = cashflowWaterfall.slice(0, -1);
  const totals: { from: number; to: number }[] = [];
  let running = 0;
  for (const step of steps) {
    totals.push({ from: running, to: running + step.amount.value });
    running += step.amount.value;
  }
  const maxAbs = Math.max(...totals.flatMap((t) => [Math.abs(t.from), Math.abs(t.to)]), 1);
  const scale = 42 / maxAbs; // percent of chart height per million, half-chart above/below zero

  const mixT = win(progress, revenueMixRow.start, revenueMixRow.end);

  return (
    <div className="flex h-full items-center justify-center bg-[#0c0e12] text-neutral-100">
      <div className="flex w-full max-w-6xl flex-col gap-8 px-6">
        <TextReveal progress={progress} start={title.start} end={title.end}>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">The numbers, moving.</h2>
        </TextReveal>

        {/* Headline metrics */}
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {(
            [
              ["CAPEX", headline.capexM.value, "$", "M", 0],
              ["IRR", activeCase.irrPct.value, "", "%", 1],
              ["NPV", activeCase.npvM.value, "$", "M", 0],
              ["Payback", headline.paybackYears.value, "", " yrs", 0],
            ] as const
          ).map(([label, value, prefix, suffix, decimals]) => (
            <div key={label} className="border-l border-neutral-700 pl-4">
              <dt className="text-xs uppercase tracking-widest text-neutral-500">{label}</dt>
              <dd className="font-display text-3xl md:text-4xl">
                <Counter
                  progress={progress}
                  start={headlineRow.start}
                  end={headlineRow.end}
                  value={value}
                  prefix={prefix}
                  suffix={suffix}
                  decimals={decimals}
                />
              </dd>
            </div>
          ))}
        </dl>

        {/* Sensitivity toggle */}
        <div role="group" aria-label="Sensitivity case" className="flex gap-2">
          {sensitivity.map((c, i) => (
            <button
              key={c.label}
              type="button"
              onClick={() => setCaseIndex(i)}
              aria-pressed={i === caseIndex}
              className={`rounded-sm border px-3 py-1.5 text-xs uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300 ${
                i === caseIndex ? "border-neutral-200 text-neutral-100" : "border-neutral-700 text-neutral-500 hover:border-neutral-500"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Cash-flow waterfall */}
        <div>
          <h3 className="mb-3 text-xs uppercase tracking-widest text-neutral-500">Cash-flow waterfall ($M)</h3>
          <div className="relative h-[26vh]" aria-hidden>
            <div className="absolute inset-x-0 top-1/2 border-t border-neutral-700" />
            <div className="flex h-full items-stretch justify-between gap-2">
              {steps.map((step, i) => {
                const w = waterfallBar(i, steps.length);
                const t = win(progress, w.start, w.end);
                const { from, to } = totals[i];
                const lo = Math.min(from, from + (to - from) * t);
                const hi = Math.max(from, from + (to - from) * t);
                const negative = step.amount.value < 0;
                return (
                  <div key={step.label} className="relative flex-1">
                    <div
                      className={`absolute inset-x-1 rounded-[2px] ${negative ? "bg-[#d66a5a]" : "bg-[#5ad68f]"}`}
                      style={{
                        top: `${50 - hi * scale}%`,
                        height: `${Math.max(0.5, (hi - lo) * scale)}%`,
                        opacity: t === 0 ? 0 : 0.9,
                      }}
                    />
                    <span className="absolute bottom-[-1.6rem] left-0 right-0 truncate text-center text-[10px] uppercase tracking-wider text-neutral-500">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Accessible equivalent */}
          <table className="sr-only">
            <caption>Cash-flow waterfall in millions of dollars</caption>
            <thead>
              <tr><th scope="col">Step</th><th scope="col">Amount ($M)</th></tr>
            </thead>
            <tbody>
              {steps.map((s) => (
                <tr key={s.label}><th scope="row">{s.label}</th><td>{s.amount.value}</td></tr>
              ))}
              <tr><th scope="row">Net position</th><td>{running}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Revenue mix */}
        <div className="mt-6">
          <h3 className="mb-3 text-xs uppercase tracking-widest text-neutral-500">Revenue mix</h3>
          <div className="flex h-8 w-full overflow-hidden rounded-sm" aria-hidden>
            {revenueMix.map((slice) => (
              <div
                key={slice.label}
                className="h-full border-r border-[#0c0e12] bg-neutral-500 last:border-r-0"
                style={{ width: `${slice.sharePct.value * mixT}%`, opacity: 0.4 + 0.6 * mixT }}
              />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-400">
            {revenueMix.map((slice) => (
              <li key={slice.label}>
                {slice.label} — <span className="tabular-nums">{slice.sharePct.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
