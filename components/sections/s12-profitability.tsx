"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp, clamp01 } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { headline } from "@/data/financials";

const BN = 1e9;

/**
 * S12 — Profitability. The headline returns as radial gauges (IRR vs hurdle,
 * DSCR vs covenant) plus supporting metrics. All from the Returns/Dashboard.
 */
function Gauge({ progress, value, max, label, display, band, start }: { progress: number; value: number; max: number; label: string; display: string; band: string; start: number }) {
  const t = win(progress, start, start + 0.3);
  const frac = clamp01(value / max) * t;
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div className="glass-strong flex flex-col items-center p-6 2xl:p-8">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(14,122,82,0.12)" strokeWidth="12" />
        <circle cx="70" cy="70" r={R} fill="none" stroke="url(#g-grad)" strokeWidth="12" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} />
        <defs>
          <linearGradient id="g-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--green-deep)" />
            <stop offset="100%" stopColor="var(--orange)" />
          </linearGradient>
        </defs>
      </svg>
      <p className="font-display -mt-[92px] mb-[52px] text-3xl font-bold text-[var(--green-deep)] 2xl:text-4xl">{display}</p>
      <p className="font-tech-label text-[11px] text-[var(--green)]">{label}</p>
      <p className="mt-1 text-xs text-[var(--dim)]">{band}</p>
    </div>
  );
}

export default function Profitability({ progress }: ChapterProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1500px]">
        <p className="font-tech-label text-xs text-[var(--orange)]">11 · Returns</p>
        <TextReveal progress={progress} start={0.04} end={0.16}>
          <h2 className="font-display mt-3 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            It clears every hurdle.
          </h2>
        </TextReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Gauge progress={progress} value={headline.projectIrrPct.value} max={40} start={0.14} label="Project IRR" display={`${headline.projectIrrPct.value}%`} band="Hurdle 20%" />
          <Gauge progress={progress} value={headline.equityIrrPct.value} max={40} start={0.2} label="Equity IRR" display={`${headline.equityIrrPct.value}%`} band="Hurdle 24%" />
          <Gauge progress={progress} value={headline.minDscr.value} max={3} start={0.26} label="Min DSCR" display={`${headline.minDscr.value}×`} band="Covenant 1.30×" />
          <Gauge progress={progress} value={7.07} max={12} start={0.32} label="Payback" display={`${headline.paybackYears.value}`} band="Years (project)" />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {[
            ["Project NPV @20%", headline.projectNpvEtb.value / BN, " bn"],
            ["Total GDV", headline.totalGdvEtb.value / BN, " bn"],
            ["Development margin", headline.developmentMarginEtb.value / BN, " bn"],
            ["Profit on cost", headline.profitOnCostPct.value, "%"],
          ].map(([label, val, suf], i) => {
            const t = win(progress, 0.4 + i * 0.04, 0.56 + i * 0.04);
            return (
              <div key={label as string} className="glass p-5" style={{ opacity: t, transform: `translateY(${lerp(12, 0, t)}px)` }}>
                <p className="text-[11px] uppercase tracking-wider text-[var(--dim)]">{label}</p>
                <p className="font-display mt-1 text-2xl font-semibold text-[var(--green-deep)] 2xl:text-3xl">
                  <Counter progress={progress} start={0.42} end={0.66} value={val as number} decimals={2} suffix={suf as string} />
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-5 text-xs text-[var(--dim)]">Audited IFRS model, 13/13 integrity checks pass · Returns &amp; Dashboard sheets.</p>
      </div>
    </div>
  );
}
