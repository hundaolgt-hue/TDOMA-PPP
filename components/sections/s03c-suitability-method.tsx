"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01 } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import MapPlate from "@/components/ui/MapPlate";
import { criteria, suitabilityStats } from "@/data/suitability";

/**
 * S3c — Site suitability II: the screen itself. Three linked analytics read
 * across one screen — the trade-gravity KDE boundary (where), the nine
 * normalised criterion layers (what), and the animated weights (how). All
 * sourced from the study.
 */
export default function SuitabilityMethod({ progress }: ChapterProps) {
  const maxW = Math.max(...criteria.map((c) => c.weight));
  const kdeReveal = clamp01(seg(progress, 0.16, 0.36));
  const layersReveal = clamp01(seg(progress, 0.24, 0.46));

  return (
    <div className="grid-bg flex h-full flex-col justify-center px-6 py-[6vh] md:px-10 2xl:px-16">
      <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1720px]">
        <div className="flex items-center gap-3">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--orange)]" />
          <p className="label text-[var(--orange)]">03 · Site suitability · the screen</p>
        </div>
        <TextReveal progress={progress} start={0.02} end={0.12}>
          <h2 className="font-display mt-2 text-[clamp(1.9rem,3.6vw,3.6rem)] font-bold leading-tight text-[var(--green-deep)]">
            Nine layers resolve to one surface.
          </h2>
        </TextReveal>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.4fr_1fr]">
          {/* WHERE — trade-gravity boundary */}
          <div className="flex flex-col gap-3" style={{ opacity: win(progress, 0.12, 0.24) }}>
            <MapPlate
              src="/suitability/boundary-kde.png"
              alt="Merkato trade-gravity kernel-density hotspot defining the 1.71 km² study boundary"
              reveal={kdeReveal}
              eyebrow="Where · trade-gravity KDE"
              accent="#22d3ee"
              aspect="1.2 / 1"
              contain
            />
            <p className="text-sm leading-relaxed text-[var(--dim)]">
              The study area is the trade-gravity hotspot itself — a kernel density of {suitabilityStats.footprints.value.toLocaleString()} registered footprints — not a drawn rectangle. Every criterion is scored only where wholesale demand concentrates.
            </p>
          </div>

          {/* WHAT — normalised criterion layers */}
          <div style={{ opacity: win(progress, 0.2, 0.34) }}>
            <MapPlate
              src="/suitability/criteria-layers.png"
              alt="Nine normalised criterion layers (0–1): vacancy, market gravity, land use, height, freight, transit, power, slope and flood"
              reveal={layersReveal}
              eyebrow="What · normalised layers 0–1"
              accent="var(--green)"
              aspect="1.05 / 1"
              contain
              caption="Every input normalised to a common 0–1 scale on the 20 m grid, then combined by the weights at right. Trade-gravity dominates by design."
            />
          </div>

          {/* HOW — weights */}
          <div className="holo flex flex-col p-5 2xl:p-6" style={{ opacity: win(progress, 0.28, 0.42) }}>
            <p className="label text-[var(--green)]">How · market-forward weights</p>
            <ul className="mt-3 flex flex-col gap-2">
              {criteria.map((c, i) => {
                const t = win(progress, 0.34 + i * 0.02, 0.48 + i * 0.02);
                return (
                  <li key={c.label}>
                    <div className="flex items-baseline justify-between text-[0.82rem]">
                      <span className={c.dominant ? "font-semibold text-[var(--green-deep)]" : "text-[var(--ink)]"}>{c.label}{c.dominant ? " · dominant" : ""}</span>
                      <span className="font-display font-semibold tabular-nums text-[var(--green-deep)]">{c.weight.toFixed(2)}</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--green)]/10">
                      <div className="h-full rounded-full" style={{ width: `${(c.weight / maxW) * 100 * t}%`, background: c.dominant ? "linear-gradient(90deg,var(--orange),#f5a24d)" : "linear-gradient(90deg,var(--green-deep),var(--green))" }} />
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
              <div className="glass p-3 text-center">
                <p className="label text-[var(--green)]">Weight-set correlation</p>
                <p className="font-display text-2xl font-bold text-[var(--green-deep)]">
                  <Counter progress={progress} start={0.5} end={0.74} value={suitabilityStats.altCorrelation.value} decimals={2} />
                </p>
                <p className="text-sm text-[var(--dim)]">vs. equal-weight base</p>
              </div>
              <div className="glass p-3 text-center">
                <p className="label text-[var(--green)]">Analysis grid</p>
                <p className="font-display text-2xl font-bold text-[var(--green-deep)]">
                  <Counter progress={progress} start={0.5} end={0.74} value={suitabilityStats.gridM.value} decimals={0} suffix=" m" />
                </p>
                <p className="text-sm text-[var(--dim)]">cell resolution</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
