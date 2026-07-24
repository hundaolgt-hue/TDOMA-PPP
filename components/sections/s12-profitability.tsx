"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp, clamp01, seg } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import SeriesChart from "@/components/ui/SeriesChart";
import { headline } from "@/data/financials";
import { dscrByYear, loanSchedule, plO3, ebitM } from "@/data/series";

const BN = 1e9;

function Gauge({ progress, value, max, label, display, band, start, warn }: { progress: number; value: number; max: number; label: string; display: string; band: string; start: number; warn?: boolean }) {
  const t = win(progress, start, start + 0.28);
  const frac = clamp01(value / max) * t;
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div className="holo hud flex flex-col items-center p-6">
      <div className="relative h-[132px] w-[132px]">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(14,122,82,0.12)" strokeWidth="12" />
          <circle cx="70" cy="70" r={R} fill="none" stroke={warn ? "var(--orange)" : "url(#gg)"} strokeWidth="12" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} style={{ filter: "drop-shadow(0 0 6px rgba(14,122,82,0.4))" }} />
          <defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="var(--green-deep)" /><stop offset="100%" stopColor="var(--orange)" /></linearGradient></defs>
        </svg>
        <span className="font-display absolute inset-0 flex items-center justify-center text-3xl font-bold text-[var(--green-deep)]">{display}</span>
      </div>
      <p className="label mt-4 text-[var(--green)]">{label}</p>
      <p className="mt-1 text-sm text-[var(--dim)]">{band}</p>
    </div>
  );
}

export default function Profitability({ progress }: ChapterProps) {
  // P&L bridge (stabilised O3) — precompute each bar's top%/height% so render
  // stays a pure map. Full bars for totals/subtotals; floating steps for costs.
  const plMax = 1610 * 1.1;
  const plBars = (() => {
    let cursor = 0;
    return plO3.map((p) => {
      const isFull = p.kind === "total" || p.kind === "subtotal";
      if (isFull) {
        cursor = p.valueM;
        return { ...p, top: 100 - (p.valueM / plMax) * 100, h: (p.valueM / plMax) * 100 };
      }
      const from = cursor;
      cursor += p.valueM;
      const hi = Math.max(from, cursor);
      const lo = Math.min(from, cursor);
      return { ...p, top: 100 - (hi / plMax) * 100, h: ((hi - lo) / plMax) * 100 };
    });
  })();
  const dscrReveal = clamp01(seg(progress, 0.5, 0.8));

  return (
    <div className="grid-bg flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1600px]">
        <div className="flex items-center gap-3">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--orange)]" />
          <p className="label text-[var(--orange)]">11 · Returns · audited IFRS · 13/13 checks pass</p>
        </div>
        <TextReveal progress={progress} start={0.03} end={0.14}>
          <h2 className="font-display mt-2 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            It clears every hurdle.
          </h2>
        </TextReveal>

        {/* Gauges */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Gauge progress={progress} value={headline.projectIrrPct.value} max={40} start={0.12} label="Project IRR" display={`${headline.projectIrrPct.value}%`} band="Hurdle 20% ✓" />
          <Gauge progress={progress} value={headline.equityIrrPct.value} max={40} start={0.18} label="Equity IRR" display={`${headline.equityIrrPct.value}%`} band="Hurdle 24% ✓" />
          <Gauge progress={progress} value={headline.minDscr.value} max={3} start={0.24} label="Min DSCR" display={`${headline.minDscr.value}×`} band="Covenant 1.30× ✓" />
          <Gauge progress={progress} value={7.07} max={12} start={0.3} label="Payback" display={`${headline.paybackYears.value}`} band="Years · project" />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {/* P&L waterfall (stabilised year) */}
          <div className="holo p-6">
            <p className="label text-[var(--green)]">P&amp;L bridge · stabilised year (O3) · ETB M</p>
            <div className="relative mt-4 h-[20vh] min-h-[170px] pb-7" aria-hidden>
              <div className="flex h-full items-stretch justify-between gap-2">
                {plBars.map((p, i) => {
                  const t = win(progress, 0.16 + i * 0.05, 0.3 + i * 0.05);
                  const color = p.kind === "total" ? "var(--green-deep)" : p.kind === "subtotal" ? "var(--green)" : "var(--orange)";
                  return (
                    <div key={p.label} className="relative flex-1">
                      <div className="absolute inset-x-0.5 rounded-[3px]" style={{ top: `${p.top}%`, height: `${Math.max(1, p.h * t)}%`, background: color, opacity: 0.9 }} />
                      <span className="absolute inset-x-0 bottom-[-1.6rem] text-center text-[0.68rem] leading-tight text-[var(--dim)]">{p.short}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--dim)]">Revenue → EBITDA → PAT, showing every deduction. Stabilised operating year.</p>
          </div>

          {/* DSCR timeline + loan */}
          <div className="holo p-6">
            <p className="label text-[var(--green)]">DSCR through the debt window · covenant 1.30×</p>
            <div className="relative mt-4 h-[20vh] min-h-[170px]">
              {/* covenant line spanning the chart */}
              <div className="absolute inset-x-0 z-10 border-t-2 border-dashed border-[var(--orange)]/70" style={{ bottom: `${(1.3 / 5) * 100}%` }}>
                <span className="absolute right-0 top-[-1.3rem] text-xs font-semibold text-[var(--orange)]">1.30× covenant</span>
              </div>
              <div className="flex h-full items-end justify-around gap-4">
                {dscrByYear.map((d, i) => {
                  const t = win(progress, 0.2 + i * 0.06, 0.36 + i * 0.06);
                  const h = (d / 5) * 100 * t;
                  return (
                    <div key={i} className="flex h-full flex-1 flex-col items-center justify-end">
                      <span className="font-display mb-1 text-lg font-bold tabular-nums text-[var(--green-deep)]">{d.toFixed(2)}×</span>
                      <div className="w-full rounded-t-md" style={{ height: `${h}%`, background: d < 1.3 ? "var(--orange)" : "linear-gradient(180deg,var(--green),var(--green-deep))" }} />
                      <span className="mt-1 text-sm text-[var(--dim)]">O{i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[["Loan drawn", loanSchedule.drawnM], ["Annuity", loanSchedule.annuityM], ["Repaid by", 0]].map(([l, v], i) => (
                <div key={l as string} className="glass p-3 text-center">
                  <p className="text-sm text-[var(--dim)]">{l}</p>
                  <p className="font-display text-lg font-semibold tabular-nums text-[var(--green-deep)]">{i === 2 ? "Year 4" : `${((v as number) / 1000).toFixed(2)} bn`}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EBIT trajectory + GDV strip */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="holo p-6">
            <p className="label text-[var(--green)]">EBIT trajectory · ETB M · O1–O12</p>
            <div className="mt-3"><SeriesChart data={ebitM} reveal={dscrReveal} height={140} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Total GDV", headline.totalGdvEtb.value / BN, " bn"],
              ["Total capex", headline.capexEtb.value / BN, " bn"],
              ["Dev. margin", headline.developmentMarginEtb.value / BN, " bn"],
              ["Profit on cost", headline.profitOnCostPct.value, "%"],
            ].map(([l, v, s], i) => (
              <div key={l as string} className="holo p-5" style={{ opacity: win(progress, 0.5 + i * 0.04, 0.66 + i * 0.04) }}>
                <p className="label text-[var(--green)]">{l}</p>
                <p className="font-display mt-1 text-2xl font-bold text-[var(--green-deep)] 2xl:text-3xl">
                  <Counter progress={progress} start={0.52} end={0.74} value={v as number} decimals={2} suffix={s as string} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
