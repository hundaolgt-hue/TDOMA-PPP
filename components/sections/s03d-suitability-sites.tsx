"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import MapPlate from "@/components/ui/MapPlate";
import { parcels, suitabilityCaveat } from "@/data/suitability";

const parcelImg: Record<string, string> = {
  S1: "/suitability/site-s1.jpg",
  S2: "/suitability/site-s2.jpg",
  S3: "/suitability/site-s3.jpg",
};

/**
 * S3d — Site suitability III: the three highest-scoring feasible parcels
 * carried to calibration, each shown on real Esri imagery with its
 * per-criterion scorecard. All figures sourced from the study.
 */
export default function SuitabilitySites({ progress }: ChapterProps) {
  return (
    <div className="grid-bg flex h-full flex-col justify-center px-6 py-[6vh] md:px-10 2xl:px-16">
      <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1680px]">
        <div className="flex items-center gap-3">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--orange)]" />
          <p className="label text-[var(--orange)]">03 · Site suitability · candidate sites</p>
        </div>
        <TextReveal progress={progress} start={0.02} end={0.12}>
          <h2 className="font-display mt-2 text-[clamp(1.9rem,3.6vw,3.6rem)] font-bold leading-tight text-[var(--green-deep)]">
            Three parcels carried to calibration.
          </h2>
        </TextReveal>
        <TextReveal progress={progress} start={0.06} end={0.18}>
          <p className="mt-2 max-w-3xl text-base text-[var(--dim)]">
            The highest-scoring feasible sites on Esri World Imagery — each low-rise and hotspot-adjacent, scored across all nine criteria.
          </p>
        </TextReveal>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {parcels.map((p, pi) => {
            const t = win(progress, 0.14 + pi * 0.06, 0.32 + pi * 0.06);
            const imgReveal = clamp01(seg(progress, 0.14 + pi * 0.06, 0.36 + pi * 0.06));
            return (
              <div key={p.id} className="holo overflow-hidden p-0" style={{ opacity: t, transform: `translateY(${lerp(20, 0, t)}px)` }}>
                <MapPlate
                  src={parcelImg[p.id]}
                  alt={`Esri World Imagery of candidate parcel ${p.id} outlined in red`}
                  reveal={imgReveal}
                  eyebrow={`${p.id} · ${p.areaM2.toLocaleString()} m²`}
                  accent="var(--orange)"
                  aspect="4 / 3"
                  className="!rounded-none !p-0"
                />
                <div className="p-4 2xl:p-5">
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
                      const st = win(progress, 0.24 + pi * 0.05 + si * 0.008, 0.4 + pi * 0.05 + si * 0.008);
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
