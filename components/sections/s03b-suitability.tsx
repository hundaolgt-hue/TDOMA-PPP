"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import HeatMap from "@/components/ui/HeatMap";
import { criteria, suitabilityStats, parcels, suitabilityCaveat } from "@/data/suitability";

/**
 * S3b — Site suitability. High-end urban-planning presentation of the MCDA
 * site-screening study: animated criteria weights, a schematic siting heat-map
 * with an analysis sweep, priority-zone metrics, and the three illustrative
 * parcels with per-criterion scorecards. All figures sourced from the study.
 */
export default function Suitability({ progress }: ChapterProps) {
  const heatReveal = clamp01(seg(progress, 0.18, 0.6));
  const maxW = Math.max(...criteria.map((c) => c.weight));

  return (
    <div className="grid-bg flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1600px]">
        <div className="flex items-center gap-3">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--orange)]" />
          <p className="label text-[var(--orange)]">03 · Site suitability · MCDA screening</p>
        </div>
        <TextReveal progress={progress} start={0.04} end={0.15}>
          <h2 className="font-display mt-2 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            Sited on evidence, not instinct.
          </h2>
        </TextReveal>
        <TextReveal progress={progress} start={0.08} end={0.2}>
          <p className="mt-2 max-w-3xl text-base text-[var(--dim)] 2xl:text-lg">
            A nine-criterion weighted-overlay screen of the 1.71 km² Merkato commercial core on a 20 m grid — resolving where a 5,000 m²+ complex can anchor with least displacement.
          </p>
        </TextReveal>

        {/* Stat strip */}
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {(
            [
              ["Study area", suitabilityStats.studyAreaKm2.value, 2, " km²"],
              ["Criteria", suitabilityStats.criteriaCount.value, 0, ""],
              ["Priority-A zones", suitabilityStats.zoneACount.value, 0, ""],
              ["Zone-A area", suitabilityStats.zoneAHa.value, 1, " ha"],
              ["Nearest to anchor", suitabilityStats.nearestAnchorM.value, 0, " m"],
              ["Area excluded", suitabilityStats.excludedPct.value, 1, "%"],
            ] as const
          ).map(([label, val, dec, suf], i) => (
            <div key={label} className="holo hud p-4" style={{ opacity: win(progress, 0.1 + i * 0.03, 0.24 + i * 0.03) }}>
              <p className="label text-[var(--green)]">{label}</p>
              <p className="font-display mt-1 text-2xl font-bold text-[var(--green-deep)] 2xl:text-3xl">
                <Counter progress={progress} start={0.12} end={0.42} value={val} decimals={dec} suffix={suf} />
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Heat map */}
          <div className="holo p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="label text-[var(--green)]">Siting heat-map · weighted suitability surface</p>
              <span className="text-sm text-[var(--dim)]">schematic</span>
            </div>
            <div className="h-[38vh] min-h-[280px] w-full overflow-hidden rounded-2xl">
              <HeatMap reveal={heatReveal} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[var(--dim)]">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{ background: "linear-gradient(90deg,#3cb46e,#ffeb96)" }} />Hotspot ribbons (low-rise, hotspot-adjacent)</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-[#0a140d]" />Exclusion voids (tall / substantial fabric)</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[var(--orange)]" />Illustrative parcels</span>
            </div>
          </div>

          {/* Criteria weights */}
          <div className="holo p-6">
            <p className="label text-[var(--green)]">Weighting · market-forward (client direction)</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {criteria.map((c, i) => {
                const t = win(progress, 0.2 + i * 0.03, 0.34 + i * 0.03);
                return (
                  <li key={c.label}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className={c.dominant ? "font-semibold text-[var(--green-deep)]" : "text-[var(--ink)]"}>{c.label}{c.dominant ? " · dominant" : ""}</span>
                      <span className="font-display font-semibold tabular-nums text-[var(--green-deep)]">{c.weight.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-[var(--green)]/10">
                      <div className="h-full rounded-full" style={{ width: `${(c.weight / maxW) * 100 * t}%`, background: c.dominant ? "linear-gradient(90deg,var(--orange),#f5a24d)" : "linear-gradient(90deg,var(--green-deep),var(--green))" }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Illustrative parcels with scorecards */}
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {parcels.map((p, pi) => {
            const t = win(progress, 0.42 + pi * 0.05, 0.58 + pi * 0.05);
            return (
              <div key={p.id} className="holo p-5" style={{ opacity: t, transform: `translateY(${lerp(16, 0, t)}px)` }}>
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-2xl font-bold text-[var(--green-deep)]">
                    {p.id}<span className="ml-2 text-base font-medium text-[var(--dim)]">{p.landuse}</span>
                  </p>
                  <p className="font-display text-2xl font-bold text-[var(--orange)] tabular-nums">{p.suitability.toFixed(2)}</p>
                </div>
                <div className="mt-1 flex gap-4 text-sm text-[var(--dim)]">
                  <span>{p.areaM2.toLocaleString()} m²</span>
                  <span>{p.distanceM} m to anchor</span>
                  <span>{p.heightZone}</span>
                </div>
                <ul className="mt-3 grid grid-cols-3 gap-x-3 gap-y-1.5">
                  {p.scores.map((s, si) => {
                    const st = win(progress, 0.46 + pi * 0.05 + si * 0.01, 0.6 + pi * 0.05 + si * 0.01);
                    return (
                      <li key={s.key} className="text-sm">
                        <div className="flex justify-between"><span className="text-[var(--dim)]">{s.key}</span><span className="tabular-nums text-[var(--green-deep)]">{s.value.toFixed(2)}</span></div>
                        <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--green)]/10">
                          <div className="h-full rounded-full" style={{ width: `${s.value * 100 * st}%`, background: s.value >= 0.7 ? "var(--green)" : s.value >= 0.4 ? "#8bbf6a" : "var(--orange)" }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-sm leading-relaxed text-[var(--dim)]">{p.note}</p>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-[var(--dim)]">{suitabilityCaveat}</p>
      </div>
    </div>
  );
}
