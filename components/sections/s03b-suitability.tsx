"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import MapPlate from "@/components/ui/MapPlate";
import { criteria, suitabilityStats, parcels, suitabilityCaveat } from "@/data/suitability";

// Real study imagery extracted from the Merkato Feasibility Study — a 20 m-grid
// MCDA screen of the Merkato commercial core. Satellite parcels keyed by id.
const parcelImg: Record<string, string> = {
  S1: "/suitability/site-s1.jpg",
  S2: "/suitability/site-s2.jpg",
  S3: "/suitability/site-s3.jpg",
};

/**
 * S3b — Site suitability. High-end urban-planning presentation built on the
 * actual GIS deliverables: the weighted siting heat-map, the suitability
 * surface with the three top sites, the normalised criterion layers, the
 * trade-gravity KDE boundary, and Esri imagery of each candidate parcel — each
 * revealed under a sensor-style scan and paired with animated metrics. All
 * figures sourced from the study.
 */
export default function Suitability({ progress }: ChapterProps) {
  const maxW = Math.max(...criteria.map((c) => c.weight));
  const heatReveal = clamp01(seg(progress, 0.14, 0.32));
  const suitReveal = clamp01(seg(progress, 0.18, 0.36));
  const layersReveal = clamp01(seg(progress, 0.4, 0.56));
  const kdeReveal = clamp01(seg(progress, 0.44, 0.6));

  return (
    <div className="grid-bg flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1680px]">
        <div className="flex items-center gap-3">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--orange)]" />
          <p className="label text-[var(--orange)]">03 · Site suitability · GIS multi-criteria screening</p>
        </div>
        <TextReveal progress={progress} start={0.03} end={0.13}>
          <h2 className="font-display mt-2 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            Sited on evidence, not instinct.
          </h2>
        </TextReveal>
        <TextReveal progress={progress} start={0.06} end={0.18}>
          <p className="mt-2 max-w-3xl text-base text-[var(--dim)] 2xl:text-lg">
            A nine-criterion weighted-overlay screen of the {suitabilityStats.studyAreaKm2.value} km² Merkato commercial core, computed on a {suitabilityStats.gridM.value} m grid over {suitabilityStats.footprints.value.toLocaleString()} building footprints — resolving where a 5,000 m²+ complex can anchor with the least displacement.
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
              ["Nearest to core", suitabilityStats.nearestAnchorM.value, 0, " m"],
              ["Area excluded", suitabilityStats.excludedPct.value, 1, "%"],
            ] as const
          ).map(([label, val, dec, suf], i) => (
            <div key={label} className="holo hud p-4" style={{ opacity: win(progress, 0.08 + i * 0.02, 0.2 + i * 0.02) }}>
              <p className="label text-[var(--green)]">{label}</p>
              <p className="font-display mt-1 text-2xl font-bold text-[var(--green-deep)] 2xl:text-3xl">
                <Counter progress={progress} start={0.1} end={0.34} value={val} decimals={dec} suffix={suf} />
              </p>
            </div>
          ))}
        </div>

        {/* HERO — the two headline surfaces */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div style={{ opacity: win(progress, 0.12, 0.22), transform: `translateY(${lerp(20, 0, win(progress, 0.12, 0.24))}px)` }}>
            <MapPlate
              src="/suitability/siting-heatmap.png"
              alt="Merkato siting heat-map — weighted suitability surface with priority zones outlined in cyan and the market core marked"
              reveal={heatReveal}
              eyebrow="Siting heat-map · weighted surface"
              accent="var(--orange)"
              aspect="1.3 / 1"
              caption="Weighted suitability, low → high. Solid cyan outlines the top-15% priority zone A; dashed the p70–85 zone B; the star marks the market core. Dark voids are hard exclusions around tall or substantial fabric."
            />
          </div>
          <div style={{ opacity: win(progress, 0.16, 0.26), transform: `translateY(${lerp(20, 0, win(progress, 0.16, 0.28))}px)` }}>
            <MapPlate
              src="/suitability/suitability-topsites.png"
              alt="Merkato mixed-use wholesale complex suitability surface with the three top candidate sites S1, S2 and S3 outlined in red"
              reveal={suitReveal}
              eyebrow="Suitability surface · top sites"
              accent="#34d399"
              aspect="1.3 / 1"
              caption="The composite suitability surface with the three highest-scoring feasible parcels — S1, S2, S3 — carried forward to calibration."
            />
          </div>
        </div>

        {/* Criterion layers (real GIS panel) + animated weights */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <div style={{ opacity: win(progress, 0.38, 0.5) }}>
            <MapPlate
              src="/suitability/criteria-layers.png"
              alt="Nine normalised criterion layers (0–1): vacancy, market gravity, land use, height, freight, transit, power, slope and flood"
              reveal={layersReveal}
              eyebrow="Normalised criterion layers · 0–1"
              accent="var(--green)"
              aspect="1.05 / 1"
              contain
              caption="Every input normalised to a common 0–1 scale on the 20 m grid, then combined by the weights at right. Trade-gravity (market) dominates by design."
            />
          </div>

          {/* Criteria weights */}
          <div className="holo p-6 2xl:p-7">
            <p className="label text-[var(--green)]">Weighting · market-forward (client direction)</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {criteria.map((c, i) => {
                const t = win(progress, 0.42 + i * 0.02, 0.56 + i * 0.02);
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
            <p className="mt-4 border-t border-[var(--green)]/15 pt-3 text-sm leading-relaxed text-[var(--dim)]">
              Nine weights summing to 1.00. A market-forward calibration correlates {suitabilityStats.altCorrelation.value.toFixed(2)} with the equal-weight base — the ranking is robust to how the weights are set.
            </p>
          </div>
        </div>

        {/* Trade-gravity KDE boundary + study delineation */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <div style={{ opacity: win(progress, 0.44, 0.56) }}>
            <MapPlate
              src="/suitability/boundary-kde.png"
              alt="Merkato trade-gravity kernel-density hotspot defining the 1.71 km² study boundary"
              reveal={kdeReveal}
              eyebrow="Trade gravity · KDE hotspot"
              accent="#22d3ee"
              aspect="1.3 / 1"
              contain
              caption="Kernel-density of registered trade activity. The cyan contour delineates the 1.71 km² study boundary around the Merkato core."
            />
          </div>
          <div className="flex flex-col justify-center gap-4">
            <TextReveal progress={progress} start={0.46} end={0.58}>
              <h3 className="font-display text-2xl font-bold text-[var(--green-deep)] 2xl:text-3xl">The catchment defines the boundary.</h3>
            </TextReveal>
            <p className="text-base leading-relaxed text-[var(--dim)]" style={{ opacity: win(progress, 0.48, 0.6) }}>
              The study area is not a drawn rectangle — it is the trade-gravity hotspot itself, derived from the density of commercial activity. That is what makes the screen defensible: every criterion is evaluated only where wholesale demand actually concentrates.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  ["Footprints analysed", suitabilityStats.footprints.value, 0, ""],
                  ["Zone-B pockets", suitabilityStats.zoneBCount.value, 0, ""],
                  ["Zone-B area", suitabilityStats.zoneBHa.value, 1, " ha"],
                ] as const
              ).map(([l, v, d, s], i) => (
                <div key={l} className="holo hud p-4" style={{ opacity: win(progress, 0.5 + i * 0.03, 0.64 + i * 0.03) }}>
                  <p className="label text-[var(--green)]">{l}</p>
                  <p className="font-display mt-1 text-xl font-bold tabular-nums text-[var(--green-deep)] 2xl:text-2xl">
                    <Counter progress={progress} start={0.52} end={0.72} value={v} decimals={d} suffix={s} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Candidate parcels — real imagery + per-criterion scorecards */}
        <TextReveal progress={progress} start={0.6} end={0.7}>
          <h3 className="font-display mt-8 text-2xl font-bold text-[var(--green-deep)] 2xl:text-3xl">Three parcels carried to calibration.</h3>
        </TextReveal>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {parcels.map((p, pi) => {
            const t = win(progress, 0.62 + pi * 0.04, 0.76 + pi * 0.04);
            const imgReveal = clamp01(seg(progress, 0.62 + pi * 0.04, 0.78 + pi * 0.04));
            return (
              <div key={p.id} className="holo overflow-hidden p-0" style={{ opacity: t, transform: `translateY(${lerp(18, 0, t)}px)` }}>
                <MapPlate
                  src={parcelImg[p.id]}
                  alt={`Esri World Imagery of candidate parcel ${p.id} outlined in red`}
                  reveal={imgReveal}
                  eyebrow={`${p.id} · ${p.areaM2.toLocaleString()} m²`}
                  accent="var(--orange)"
                  aspect="4 / 3"
                  className="!rounded-none !p-0"
                />
                <div className="p-5">
                  <div className="flex items-baseline justify-between">
                    <p className="font-display text-2xl font-bold text-[var(--green-deep)]">
                      {p.id}<span className="ml-2 text-sm font-medium text-[var(--dim)]">{p.landuse}</span>
                    </p>
                    <p className="font-display text-2xl font-bold tabular-nums text-[var(--orange)]">{p.suitability.toFixed(2)}</p>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-[var(--dim)]">
                    <span>{p.areaHa.toFixed(2)} ha</span>
                    <span>{p.distanceM} m to core</span>
                    <span>{p.builtCover}</span>
                  </div>
                  <ul className="mt-3 grid grid-cols-3 gap-x-3 gap-y-1.5">
                    {p.scores.map((s, si) => {
                      const st = win(progress, 0.66 + pi * 0.04 + si * 0.008, 0.8 + pi * 0.04 + si * 0.008);
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
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[var(--dim)]">{suitabilityCaveat}</p>
      </div>
    </div>
  );
}
