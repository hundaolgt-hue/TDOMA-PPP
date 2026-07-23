"use client";

import { useState } from "react";
import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { headline, cashflowWaterfall, revenueMix, sensitivity } from "@/data/financials";
import { title, headlineRow, waterfallBar, revenueMixRow } from "./timeline";

const BN = 1e9;

/**
 * Chapter 5 — Financial dashboard (pure DOM/SVG).
 * Every figure comes from data/financials.ts (audited IFRS model). The
 * cash-flow waterfall walks cumulative project cash flow as a climbing
 * staircase that crosses zero at payback; the sensitivity toggle morphs
 * between real recomputed scenarios (click-state, independent of scroll).
 */
export default function Financials({ progress }: ChapterProps) {
  const [caseIndex, setCaseIndex] = useState(0);
  const activeCase = sensitivity[caseIndex];

  // Cumulative cash-flow staircase (the J-curve).
  const cum: number[] = [];
  let running = 0;
  for (const step of cashflowWaterfall) {
    running += step.amount.value;
    cum.push(running);
  }
  const domainMin = Math.min(0, ...cum);
  const domainMax = Math.max(0, ...cum);
  const span = domainMax - domainMin || 1;
  const yFrac = (v: number) => (v - domainMin) / span; // 0 = bottom
  const zeroTopPct = (1 - yFrac(0)) * 100;

  const mixTotal = revenueMix.reduce((s, r) => s + r.valueM.value, 0);
  const mixT = win(progress, revenueMixRow.start, revenueMixRow.end);

  return (
    <div className="flex h-full items-center justify-center bg-[#0c0e12] text-neutral-100">
      <div className="flex w-full max-w-6xl flex-col gap-7 px-6">
        <div className="flex items-baseline justify-between gap-4">
          <TextReveal progress={progress} start={title.start} end={title.end}>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">The numbers, moving.</h2>
          </TextReveal>
          <span className="hidden text-[10px] uppercase tracking-widest text-neutral-600 md:block">
            ETB · IFRS · audited v2.0
          </span>
        </div>

        {/* Headline metrics (base case) */}
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {(
            [
              ["Project IRR", headline.projectIrrPct.value, "", "%", 1],
              ["Equity IRR", headline.equityIrrPct.value, "", "%", 1],
              ["Min DSCR", headline.minDscr.value, "", "×", 2],
              ["Payback", headline.paybackYears.value, "", " yrs", 1],
            ] as const
          ).map(([label, value, prefix, suffix, decimals]) => (
            <div key={label} className="border-l border-neutral-700 pl-4">
              <dt className="text-xs uppercase tracking-widest text-neutral-500">{label}</dt>
              <dd className="font-display text-3xl md:text-4xl">
                <Counter progress={progress} start={headlineRow.start} end={headlineRow.end} value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
              </dd>
            </div>
          ))}
        </dl>

        <dl className="grid grid-cols-3 gap-6 border-t border-neutral-800 pt-4 text-neutral-300">
          {(
            [
              ["Total capex", headline.capexEtb.value / BN],
              ["Total GDV", headline.totalGdvEtb.value / BN],
              ["Development margin", headline.developmentMarginEtb.value / BN],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <dt className="text-[11px] uppercase tracking-widest text-neutral-600">{label}</dt>
              <dd className="font-display text-xl md:text-2xl">
                <Counter progress={progress} start={headlineRow.start} end={headlineRow.end} value={value} decimals={2} suffix=" bn" />
              </dd>
            </div>
          ))}
        </dl>

        {/* Cash-flow waterfall — cumulative J-curve */}
        <div>
          <h3 className="mb-3 text-xs uppercase tracking-widest text-neutral-500">
            Cumulative project cash flow (ETB bn, 3 build years + 12 operating)
          </h3>
          <div className="relative h-[24vh]" aria-hidden>
            <div className="absolute inset-x-0 border-t border-dashed border-neutral-700" style={{ top: `${zeroTopPct}%` }} />
            <div className="flex h-full items-stretch justify-between gap-[3px]">
              {cashflowWaterfall.map((step, i) => {
                const w = waterfallBar(i, cashflowWaterfall.length);
                const t = win(progress, w.start, w.end);
                const prev = i === 0 ? 0 : cum[i - 1];
                const target = cum[i];
                const curAnim = prev + (target - prev) * t;
                const lo = Math.min(prev, curAnim);
                const hi = Math.max(prev, curAnim);
                const negative = step.amount.value < 0;
                return (
                  <div key={step.label} className="relative flex-1">
                    <div
                      className={`absolute inset-x-[1px] rounded-[1px] ${negative ? "bg-[#d66a5a]" : "bg-[#5ad68f]"}`}
                      style={{ top: `${(1 - yFrac(hi)) * 100}%`, height: `${Math.max(0.6, (yFrac(hi) - yFrac(lo)) * 100)}%`, opacity: t === 0 ? 0 : 0.9 }}
                    />
                    <span className="absolute bottom-[-1.5rem] left-0 right-0 text-center text-[9px] text-neutral-600">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <table className="sr-only">
            <caption>Cumulative project cash flow by year, ETB billions</caption>
            <thead><tr><th scope="col">Year</th><th scope="col">Annual (ETB bn)</th><th scope="col">Cumulative (ETB bn)</th></tr></thead>
            <tbody>
              {cashflowWaterfall.map((s, i) => (
                <tr key={s.label}><th scope="row">{s.label}</th><td>{(s.amount.value / 1000).toFixed(2)}</td><td>{(cum[i] / 1000).toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Sensitivity toggle */}
          <div>
            <h3 className="mb-3 text-xs uppercase tracking-widest text-neutral-500">Sensitivity (recomputed)</h3>
            <div role="group" aria-label="Scenario" className="flex flex-wrap gap-2">
              {sensitivity.map((c, i) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setCaseIndex(i)}
                  aria-pressed={i === caseIndex}
                  className={`rounded-sm border px-3 py-1.5 text-xs tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300 ${i === caseIndex ? "border-neutral-200 text-neutral-100" : "border-neutral-700 text-neutral-500 hover:border-neutral-500"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-4">
              <div><dt className="text-[11px] uppercase tracking-widest text-neutral-600">IRR</dt><dd className="font-display text-2xl tabular-nums">{activeCase.irrPct.value.toFixed(1)}%</dd></div>
              <div><dt className="text-[11px] uppercase tracking-widest text-neutral-600">Margin</dt><dd className="font-display text-2xl tabular-nums">{(activeCase.marginEtb.value / BN).toFixed(2)} bn</dd></div>
              <div><dt className="text-[11px] uppercase tracking-widest text-neutral-600">Min DSCR</dt><dd className={`font-display text-2xl tabular-nums ${activeCase.minDscr.value < 1.3 ? "text-[#d66a5a]" : ""}`}>{activeCase.minDscr.value.toFixed(2)}×</dd></div>
            </dl>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">{activeCase.note}</p>
          </div>

          {/* Revenue mix (O1 rental, net of VAT) */}
          <div>
            <h3 className="mb-3 text-xs uppercase tracking-widest text-neutral-500">Rental income mix — year 1 (net of VAT)</h3>
            <div className="flex h-8 w-full overflow-hidden rounded-sm" aria-hidden>
              {revenueMix.map((slice) => (
                <div key={slice.label} className="h-full border-r border-[#0c0e12] bg-neutral-500 last:border-r-0" style={{ width: `${(slice.valueM.value / mixTotal) * 100 * mixT}%`, opacity: 0.4 + 0.6 * mixT }} />
              ))}
            </div>
            <ul className="mt-2 flex flex-col gap-1 text-xs text-neutral-400">
              {revenueMix.map((slice) => (
                <li key={slice.label} className="flex justify-between">
                  <span>{slice.label}</span>
                  <span className="tabular-nums text-neutral-500">{((slice.valueM.value / mixTotal) * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
