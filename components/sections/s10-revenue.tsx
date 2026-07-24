"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import { cashflowWaterfall, revenueMix } from "@/data/financials";

/**
 * S10 — Revenue. The 15-year cumulative cash-flow J-curve (animated staircase)
 * plus the year-1 rental mix. All from the model (Payback + Revenue sheets).
 */
export default function Revenue({ progress }: ChapterProps) {
  const cum: number[] = [];
  let run = 0;
  for (const s of cashflowWaterfall) { run += s.amount.value; cum.push(run); }
  const dMin = Math.min(0, ...cum);
  const dMax = Math.max(0, ...cum);
  const span = dMax - dMin || 1;
  const yFrac = (v: number) => (v - dMin) / span;
  const zeroTop = (1 - yFrac(0)) * 100;

  const mixTotal = revenueMix.reduce((s, r) => s + r.valueM.value, 0);
  const mixT = win(progress, 0.55, 0.72);
  const zoneColors = ["#0e7a52", "#12a06b", "#f08a24", "#3aa77d", "#6ec3a0", "#0a5439", "#f5a24d"];

  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1500px]">
        <p className="font-tech-label text-xs text-[var(--orange)]">09 · Revenue</p>
        <TextReveal progress={progress} start={0.04} end={0.16}>
          <h2 className="font-display mt-3 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            Fifteen years of cash flow.
          </h2>
        </TextReveal>

        <div className="mt-8 glass-strong p-6 2xl:p-8">
          <p className="font-tech-label text-[11px] text-[var(--green)]">Cumulative project cash flow · ETB bn · 3 build + 12 operating</p>
          <div className="relative mt-4 h-[30vh]" aria-hidden>
            <div className="absolute inset-x-0 border-t border-dashed border-[var(--green-deep)]/30" style={{ top: `${zeroTop}%` }} />
            <div className="flex h-full items-stretch justify-between gap-[3px]">
              {cashflowWaterfall.map((step, i) => {
                const t = win(progress, 0.14 + i * 0.026, 0.24 + i * 0.026);
                const prev = i === 0 ? 0 : cum[i - 1];
                const cur = prev + (cum[i] - prev) * t;
                const lo = Math.min(prev, cur);
                const hi = Math.max(prev, cur);
                const neg = step.amount.value < 0;
                return (
                  <div key={step.label} className="relative flex-1">
                    <div className="absolute inset-x-[1px] rounded-[2px]" style={{ top: `${(1 - yFrac(hi)) * 100}%`, height: `${Math.max(0.6, (yFrac(hi) - yFrac(lo)) * 100)}%`, background: neg ? "var(--orange)" : "linear-gradient(180deg,var(--green),var(--green-deep))", opacity: t === 0 ? 0 : 0.95 }} />
                    <span className="absolute bottom-[-1.4rem] left-0 right-0 text-center text-[9px] text-[var(--dim)]">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 glass-strong p-6 2xl:p-8">
          <p className="font-tech-label text-[11px] text-[var(--green)]">Year-1 rental income mix · net of VAT</p>
          <div className="mt-3 flex h-9 w-full overflow-hidden rounded-lg">
            {revenueMix.map((s, i) => (
              <div key={s.label} className="h-full" style={{ width: `${(s.valueM.value / mixTotal) * 100 * mixT}%`, background: zoneColors[i % zoneColors.length], opacity: 0.5 + 0.5 * mixT }} />
            ))}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs md:grid-cols-4">
            {revenueMix.map((s, i) => (
              <li key={s.label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: zoneColors[i % zoneColors.length] }} />
                <span className="flex-1 text-[var(--ink)]">{s.label}</span>
                <span className="tabular-nums text-[var(--dim)]">{((s.valueM.value / mixTotal) * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
