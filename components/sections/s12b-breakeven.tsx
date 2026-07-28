"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, clamp01 } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { headline, cashflowWaterfall } from "@/data/financials";

const BN = 1e9;

/**
 * S12b — Break-even analysis. The project cash-flow J-curve (excl. terminal
 * value) accumulated year on year, showing the trough of maximum exposure
 * and the year the cumulative line crosses zero — the same crossing the
 * model reports as simple payback (7.07 yrs, project basis).
 */
export default function Breakeven({ progress }: ChapterProps) {
  const years = cashflowWaterfall.map((w) => w.amount.value);
  let running = 0;
  const cum = years.map((v) => (running += v));
  const troughM = Math.min(...cum);
  const troughIdx = cum.indexOf(troughM);
  const payback = headline.paybackYears.value;
  const n = cum.length;

  const W = 1000;
  const H = 240;
  const pad = { l: 8, r: 8, t: 16, b: 24 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const yMax = Math.max(...cum) * 1.08;
  const yMin = troughM * 1.08;
  const range = yMax - yMin;
  const x = (i: number) => pad.l + (i / (n - 1)) * iw;
  const y = (v: number) => pad.t + ih * (1 - (v - yMin) / range);
  const y0 = y(0);
  const xBreak = pad.l + ((payback - 1) / (n - 1)) * iw;

  const reveal = clamp01(win(progress, 0.1, 0.6));
  const shown = 1 + (n - 1) * reveal;

  return (
    <div className="grid-bg flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1600px]">
        <div className="flex items-center gap-3">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--orange)]" />
          <p className="label text-[var(--orange-text)]">12 · Break-even · cumulative cash flow</p>
        </div>
        <TextReveal progress={progress} start={0.02} end={0.13}>
          <h2 className="font-display mt-2 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            Break-even in year {Math.ceil(payback)}.
          </h2>
        </TextReveal>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          {/* Cumulative cash-flow chart */}
          <div className="holo p-6 2xl:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="label text-[var(--green)]">Cumulative project cash flow · ETB M · excl. terminal value</p>
              <div className="flex items-center gap-3 text-[0.7rem] text-[var(--dim)]">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: "var(--orange)" }} />Net exposure</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-[var(--green-deep)]" />Net recovered</span>
              </div>
            </div>
            <div className="mt-4" role="img" aria-label={`Cumulative project cash flow crosses zero at year ${payback.toFixed(2)}, after a maximum exposure of ${Math.abs(troughM).toLocaleString()} million ETB in year ${troughIdx + 1}.`}>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: H }}>
                {/* grid */}
                {[0.25, 0.5, 0.75].map((g) => (
                  <line key={g} x1={pad.l} x2={W - pad.r} y1={pad.t + ih * g} y2={pad.t + ih * g} stroke="rgba(14,122,82,0.10)" strokeWidth="1" />
                ))}
                {/* zero baseline */}
                <line x1={pad.l} x2={W - pad.r} y1={y0} y2={y0} stroke="var(--dim)" strokeWidth="1.5" strokeDasharray="3 4" opacity={0.55} />

                {/* break-even marker */}
                {reveal > 0.85 && (
                  <g style={{ opacity: win(progress, 0.55, 0.68) }}>
                    <line x1={xBreak} x2={xBreak} y1={pad.t} y2={pad.t + ih} stroke="var(--green-deep)" strokeWidth="1.5" strokeDasharray="4 3" />
                    <circle cx={xBreak} cy={y0} r="5.5" fill="var(--green-deep)" />
                    <text x={xBreak} y={pad.t - 3} fontSize="17" textAnchor="middle" fill="var(--green-deep)" fontFamily="Rajdhani" fontWeight={700}>
                      {payback.toFixed(2)} yrs
                    </text>
                  </g>
                )}

                {/* cumulative bars */}
                {cum.map((v, i) => {
                  const bt = clamp01(shown - i);
                  if (bt <= 0) return null;
                  const top = Math.min(y0, y(v));
                  const h = Math.abs(y(v) - y0) * bt;
                  const barTop = v >= 0 ? y0 - h : y0;
                  return (
                    <rect
                      key={i}
                      x={x(i) - iw / n / 2.6}
                      y={barTop}
                      width={iw / n / 1.3}
                      height={Math.max(0, h)}
                      fill={v >= 0 ? "var(--green-deep)" : "var(--orange)"}
                      opacity={0.85}
                      rx="2"
                    />
                  );
                })}

                {/* year labels */}
                {cashflowWaterfall.map((w, i) =>
                  i % 2 === 0 ? (
                    <text key={w.label} x={x(i)} y={H - 6} fontSize="15" textAnchor="middle" fill="var(--dim)" fontFamily="Rajdhani">
                      {w.label}
                    </text>
                  ) : null,
                )}
              </svg>
            </div>
            <p className="mt-2 text-sm text-[var(--dim)]">
              Peak exposure of {(Math.abs(troughM) / 1000).toFixed(2)} bn ETB in {cashflowWaterfall[troughIdx].label}, fully recovered by {cashflowWaterfall[Math.ceil(payback) - 1].label}.
            </p>
          </div>

          {/* Headline break-even metrics */}
          <div className="flex flex-col gap-4">
            <div className="holo hud p-6 text-center" style={{ opacity: win(progress, 0.14, 0.3) }}>
              <p className="label text-[var(--green)]">Simple payback</p>
              <p className="font-display mt-1 text-5xl font-bold text-[var(--green-deep)] 2xl:text-6xl">
                <Counter progress={progress} start={0.16} end={0.4} value={payback} decimals={2} suffix=" yrs" />
              </p>
              <p className="text-base text-[var(--dim)]">Project basis · cumulative cash flow crosses zero</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4" style={{ opacity: win(progress, 0.24, 0.4) }}>
                <p className="text-sm text-[var(--dim)]">Peak exposure</p>
                <p className="font-display text-xl font-semibold tabular-nums text-[var(--green-deep)]">
                  <Counter progress={progress} start={0.26} end={0.48} value={Math.abs(troughM) / 1000} decimals={2} suffix=" bn" />
                </p>
              </div>
              <div className="glass p-4" style={{ opacity: win(progress, 0.28, 0.44) }}>
                <p className="text-sm text-[var(--dim)]">Equity MoIC</p>
                <p className="font-display text-xl font-semibold tabular-nums text-[var(--green-deep)]">
                  <Counter progress={progress} start={0.3} end={0.52} value={headline.equityMoic.value} decimals={2} suffix="×" />
                </p>
              </div>
            </div>
            <div className="holo p-6" style={{ opacity: win(progress, 0.34, 0.5) }}>
              <p className="label text-[var(--green)]">Project NPV @ 20%</p>
              <p className="font-display mt-1 text-3xl font-bold tabular-nums text-[var(--green-deep)]">
                <Counter progress={progress} start={0.36} end={0.58} value={headline.projectNpvEtb.value / BN} decimals={2} suffix=" bn ETB" />
              </p>
              <p className="mt-2 text-sm text-[var(--dim)]">Positive at the model&apos;s 20% discount hurdle — value is created, not just recovered, well before the cash line turns positive.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
