"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01 } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import SeriesChart from "@/components/ui/SeriesChart";
import { revenueMix } from "@/data/financials";
import { years, revenueM, ebitdaM, patM, closingCashM, rentalM } from "@/data/series";

const zoneColors = ["#0e7a52", "#12a06b", "#f08a24", "#3aa77d", "#6ec3a0", "#0a5439", "#f5a24d"];

/**
 * S10 — Revenue & earnings dashboard (sci-fi HUD). Animated 12-year series for
 * revenue vs EBITDA, PAT, and closing cash, plus the year-1 rental mix. All
 * from the model's PL / CashFlow / Revenue sheets.
 */
export default function Revenue({ progress }: ChapterProps) {
  const revealA = clamp01(seg(progress, 0.12, 0.42));
  const revealB = clamp01(seg(progress, 0.28, 0.6));
  const revealC = clamp01(seg(progress, 0.4, 0.72));
  const mixTotal = revenueMix.reduce((s, r) => s + r.valueM.value, 0);
  const mixT = win(progress, 0.55, 0.78);

  return (
    <div className="grid-bg flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1600px]">
        <div className="flex items-center gap-3">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--orange)]" />
          <p className="label text-[var(--orange)]">10 · Revenue & earnings · live model</p>
        </div>
        <TextReveal progress={progress} start={0.04} end={0.16}>
          <h2 className="font-display mt-2 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            Twelve years, compounding.
          </h2>
        </TextReveal>

        {/* KPI strip */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Y1 revenue", revenueM[0] / 1000, " bn", "ETB, incl. retail sale"],
            ["Y12 revenue", revenueM[11] / 1000, " bn", "25% p.a. escalation"],
            ["Y3 EBITDA", ebitdaM[2] / 1000, " bn", "stabilised"],
            ["Y12 cash", closingCashM[11] / 1000, " bn", "closing balance"],
          ].map(([label, val, suf, sub], i) => (
            <div key={label as string} className="holo hud p-5" style={{ opacity: win(progress, 0.1 + i * 0.04, 0.24 + i * 0.04) }}>
              <p className="label text-[var(--green)]">{label}</p>
              <p className="font-display mt-1 text-3xl font-bold text-[var(--green-deep)] 2xl:text-4xl">
                <Counter progress={progress} start={0.12} end={0.4} value={val as number} decimals={2} suffix={suf as string} />
              </p>
              <p className="text-sm text-[var(--dim)]">{sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          {/* Revenue vs EBITDA */}
          <div className="holo p-6">
            <div className="flex items-center justify-between">
              <p className="label text-[var(--green)]">Revenue vs EBITDA · ETB M</p>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm" style={{ background: "rgba(240,138,36,0.5)" }} />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-[var(--green-deep)]" />EBITDA</span>
              </div>
            </div>
            <div className="mt-3">
              <SeriesChart data={ebitdaM} bars={revenueM} labels={years} reveal={revealA} height={168} />
            </div>
          </div>

          {/* PAT growth */}
          <div className="holo p-6">
            <p className="label text-[var(--green)]">Profit after tax · ETB M</p>
            <div className="mt-3">
              <SeriesChart data={patM} labels={years} reveal={revealB} height={168} stroke="var(--orange)" fillFrom="rgba(240,138,36,0.28)" />
            </div>
            <p className="mt-2 text-sm text-[var(--dim)]">
              Y1 dip reflects one-off cost of sales on the retail units; PAT compounds to{" "}
              <span className="font-semibold text-[var(--green-deep)]">{(patM[11] / 1000).toFixed(2)} bn</span> by Y12.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.5fr]">
          {/* Rental mix */}
          <div className="holo p-6">
            <p className="label text-[var(--green)]">Year-1 rental mix · net of VAT</p>
            <div className="mt-3 flex h-10 w-full overflow-hidden rounded-lg">
              {revenueMix.map((s, i) => (
                <div key={s.label} className="h-full" style={{ width: `${(s.valueM.value / mixTotal) * 100 * mixT}%`, background: zoneColors[i % zoneColors.length], opacity: 0.55 + 0.45 * mixT }} />
              ))}
            </div>
            <ul className="mt-3 flex flex-col gap-1.5 text-base">
              {revenueMix.map((s, i) => (
                <li key={s.label} className="flex items-center gap-2.5">
                  <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: zoneColors[i % zoneColors.length] }} />
                  <span className="flex-1 text-[var(--ink)]">{s.label}</span>
                  <span className="tabular-nums text-[var(--dim)]">{s.valueM.value.toFixed(0)}M</span>
                  <span className="w-12 text-right tabular-nums text-[var(--green)]">{((s.valueM.value / mixTotal) * 100).toFixed(0)}%</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Closing cash build-up */}
          <div className="holo p-6">
            <p className="label text-[var(--green)]">Closing cash balance · ETB M · IAS 7</p>
            <div className="mt-3">
              <SeriesChart data={closingCashM} bars={rentalM} labels={years} reveal={revealC} height={168} barColor="rgba(14,122,82,0.14)" />
            </div>
            <p className="mt-2 text-sm text-[var(--dim)]">
              Cash builds to <span className="font-semibold text-[var(--green-deep)]">{(closingCashM[11] / 1000).toFixed(1)} bn ETB</span> by Y12 after debt service and 50% dividend payout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
