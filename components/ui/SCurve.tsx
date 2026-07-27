"use client";

import { useMemo, useState } from "react";
import { clamp01 } from "@/lib/scroll/ease";
import { activities, TOTAL_WEEKS, weekToDate, programmeStats } from "@/data/programme";
import { boqItems } from "@/data/boq";

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Cost-loaded cash-flow S-curve, built the way the programme document defines
 * it: each BOQ section's cost is apportioned across that section's activities
 * in proportion to duration, then spread evenly over each activity's calendar
 * span. Weekly bars + cumulative curve; hover (or focus) scrubs a readout.
 *
 * Computed from the priced BOQ rather than transcribed, so it stays consistent
 * with the cost data elsewhere on the site.
 */
export default function SCurve({ reveal, height = 210 }: { reveal: number; height?: number }) {
  const r = clamp01(reveal);
  const [hoverWk, setHoverWk] = useState<number | null>(null);

  const { weekly, cumulative, peak, total } = useMemo(() => {
    // 1. Section cost totals from the priced BOQ.
    const secCost: Record<string, number> = {};
    for (const it of boqItems) {
      const s = it.code.split(".")[0];
      secCost[s] = (secCost[s] ?? 0) + it.quantity.value * it.rateEtb.value;
    }
    // 2. Section duration totals across that section's activities.
    const secDur: Record<string, number> = {};
    for (const a of activities) secDur[a.section] = (secDur[a.section] ?? 0) + a.durWk;

    // 3. Spread each activity's share evenly over its own span.
    const w = new Array(TOTAL_WEEKS).fill(0);
    for (const a of activities) {
      const cost = secCost[a.section];
      if (!cost || !secDur[a.section]) continue; // K/Z carry no BOQ section
      const share = (cost * a.durWk) / secDur[a.section];
      const perWk = share / a.durWk;
      for (let k = 0; k < a.durWk; k++) {
        const wk = a.startWk + k;
        if (wk < TOTAL_WEEKS) w[wk] += perWk;
      }
    }
    // 4. Scale to the programme's stated capital-works total (BOQ + design,
    //    specialist consultancy and contingency, which sit outside the BOQ).
    const boqSum = w.reduce((s, v) => s + v, 0);
    const k = programmeStats.capitalWorksEtb.value / boqSum;
    const weekly = w.map((v) => (v * k) / 1e6); // ETB millions
    let run = 0;
    const cumulative = weekly.map((v) => (run += v));
    return { weekly, cumulative, peak: Math.max(...weekly), total: run };
  }, []);

  const shown = Math.floor(r * TOTAL_WEEKS);
  const pct = (wk: number) => (wk / TOTAL_WEEKS) * 100;

  // Cumulative polyline in a 100×100 viewBox.
  const pts = cumulative
    .slice(0, Math.max(2, shown))
    .map((v, i) => `${(i / (TOTAL_WEEKS - 1)) * 100},${100 - (v / total) * 100}`)
    .join(" ");

  const hv = hoverWk !== null ? { wk: hoverWk, week: weekly[hoverWk], cum: cumulative[hoverWk] } : null;

  return (
    <div className="w-full">
      <div
        className="relative"
        style={{ height }}
        onPointerLeave={() => setHoverWk(null)}
        onPointerMove={(e) => {
          const b = e.currentTarget.getBoundingClientRect();
          const wk = Math.round(((e.clientX - b.left) / b.width) * (TOTAL_WEEKS - 1));
          setHoverWk(Math.max(0, Math.min(TOTAL_WEEKS - 1, wk)));
        }}
        role="img"
        aria-label={`Cost-loaded S-curve: capital works of ${(total / 1000).toFixed(2)} billion ETB drawn across ${TOTAL_WEEKS} weeks, peaking at ${peak.toFixed(0)} million ETB in a week.`}
      >
        {/* year gridlines */}
        {[0, 52, 104, 156].map((wk) => (
          <div key={wk} className="absolute inset-y-0 w-px bg-[var(--green-deep)]/20" style={{ left: `${pct(wk)}%` }} aria-hidden />
        ))}

        {/* weekly spend bars */}
        <div className="absolute inset-0 flex items-end gap-[1px]" aria-hidden>
          {weekly.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[1px]"
              style={{
                height: `${i < shown ? (v / peak) * 82 : 0}%`,
                background: hoverWk === i ? "var(--orange)" : "rgba(90,127,168,0.55)",
                transition: "background 120ms",
              }}
            />
          ))}
        </div>

        {/* cumulative curve + fill */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="sc-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--orange)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--orange)" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          {shown > 2 && <polygon points={`0,100 ${pts} ${(Math.max(2, shown) - 1) / (TOTAL_WEEKS - 1) * 100},100`} fill="url(#sc-fill)" />}
          <polyline points={pts} fill="none" stroke="#b08d4a" strokeWidth="0.8" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>

        {/* hover scrubber */}
        {hv && (
          <>
            <div className="pointer-events-none absolute inset-y-0 w-px bg-[var(--orange)]" style={{ left: `${pct(hv.wk)}%` }} />
            <div
              className="glass-dark pointer-events-none absolute z-10 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[0.7rem] text-white"
              style={{ left: `${pct(hv.wk)}%`, top: 0, transform: hv.wk > TOTAL_WEEKS * 0.62 ? "translateX(-104%)" : "translateX(4%)" }}
            >
              <span className="font-display font-bold">
                {MONTH[weekToDate(hv.wk).getUTCMonth()]} {weekToDate(hv.wk).getUTCFullYear()}
              </span>
              <span className="ml-2 text-white/70">wk {hv.wk}</span>
              <br />
              Cumulative <span className="font-semibold tabular-nums">{(hv.cum / 1000).toFixed(2)} bn</span>
              <span className="mx-1 text-white/50">·</span>
              week <span className="font-semibold tabular-nums">{hv.week.toFixed(1)} M</span>
            </div>
          </>
        )}
      </div>

      {/* axis */}
      <div className="relative mt-1 h-4" aria-hidden>
        {[0, 52, 104, 156].map((wk) => (
          <span
            key={wk}
            className="font-display absolute text-[0.66rem] font-semibold text-[var(--green-deep)]"
            style={{ left: `${pct(wk)}%`, transform: wk === 156 ? "translateX(-100%)" : undefined }}
          >
            {weekToDate(Math.min(wk, 155)).getUTCFullYear()}
          </span>
        ))}
      </div>
    </div>
  );
}
