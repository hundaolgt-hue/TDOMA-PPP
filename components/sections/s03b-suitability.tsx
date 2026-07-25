"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { suitabilityStats } from "@/data/suitability";

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Small analysis plates floated on top of the live heat-map.
const overlays = [
  {
    src: "/suitability/suitability-topsites.png",
    label: "Suitability surface · top sites",
    pos: "right-4 top-4 w-44 md:w-56 2xl:w-64",
  },
  {
    src: "/suitability/criteria-layers.png",
    label: "Criterion layers · 0–1",
    pos: "bottom-4 right-4 w-40 md:w-52 2xl:w-60",
  },
];

/**
 * S3b — Site suitability I: the live evidence base. Embeds the interactive
 * Folium/Leaflet heat-map (real OSM / satellite tiles + the weighted siting
 * surface + site markers) and floats the derived analysis maps on top as glass
 * HUD plates. A compact header and an animated stat strip frame it so the whole
 * chapter reads in a single screen.
 */
export default function Suitability({ progress }: ChapterProps) {
  return (
    <div className="grid-bg flex h-full flex-col justify-center px-6 py-[6vh] md:px-10 2xl:px-16">
      <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1680px]">
        <div className="flex items-center gap-3">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--orange)]" />
          <p className="label text-[var(--orange)]">03 · Site suitability · GIS multi-criteria screening</p>
        </div>
        <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <TextReveal progress={progress} start={0.02} end={0.12}>
            <h2 className="font-display text-[clamp(2rem,4vw,4rem)] font-bold leading-tight text-[var(--green-deep)]">
              Sited on evidence, not instinct.
            </h2>
          </TextReveal>
          <TextReveal progress={progress} start={0.06} end={0.18}>
            <p className="max-w-md text-base text-[var(--dim)] lg:text-right">
              A nine-criterion weighted overlay of the {suitabilityStats.studyAreaKm2.value} km² Merkato core on a {suitabilityStats.gridM.value} m grid — pan the live surface, switch to satellite, read the top sites.
            </p>
          </TextReveal>
        </div>

        {/* Live interactive heat-map with analysis plates overlaid on top */}
        <div
          className="holo relative mt-4 h-[54vh] min-h-[320px] w-full overflow-hidden rounded-2xl p-1.5"
          style={{ opacity: win(progress, 0.08, 0.22), transform: `translateY(${lerp(24, 0, win(progress, 0.08, 0.26))}px)` }}
        >
          <iframe
            src={`${BP}/suitability/heatmap-map.html`}
            title="Merkato siting heat-map — interactive"
            loading="lazy"
            className="h-full w-full rounded-xl border-0"
          />

          {/* Eyebrow chip — bottom-left, clear of the map's zoom controls */}
          <div className="pointer-events-none absolute bottom-4 left-4 z-20">
            <span className="label glass-dark rounded-md px-2.5 py-1 text-white">Live · trade-gravity heat surface · drag &amp; zoom</span>
          </div>

          {/* Floated analysis pictures */}
          {overlays.map((o, i) => (
            <figure
              key={o.src}
              className={`glass-strong absolute z-20 overflow-hidden rounded-xl p-1.5 ${o.pos}`}
              style={{ opacity: win(progress, 0.3 + i * 0.08, 0.46 + i * 0.08), transform: `translateY(${lerp(14, 0, win(progress, 0.3 + i * 0.08, 0.5 + i * 0.08))}px)`, boxShadow: "var(--glass-shadow)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BP}${o.src}`} alt={o.label} loading="lazy" className="w-full rounded-lg" />
              <figcaption className="px-1.5 py-1 text-[0.7rem] font-medium leading-tight text-[var(--green-deep)]">{o.label}</figcaption>
            </figure>
          ))}
        </div>

        {/* Stat strip */}
        <div className="mt-4 grid grid-cols-3 gap-3 md:grid-cols-6">
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
            <div key={label} className="holo hud p-3.5" style={{ opacity: win(progress, 0.5 + i * 0.03, 0.64 + i * 0.03) }}>
              <p className="label text-[var(--green)]">{label}</p>
              <p className="font-display mt-0.5 text-xl font-bold text-[var(--green-deep)] 2xl:text-2xl">
                <Counter progress={progress} start={0.5} end={0.78} value={val} decimals={dec} suffix={suf} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
