"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import { buildingLayers } from "@/data/program";
import { title, layerWindows, SPREAD_VH } from "./timeline";

/**
 * Chapter 1 — Exploded assembly (greybox).
 * Placeholder slabs stand in for the rendered sequence (pipeline A in
 * ARCHITECTURE.md). The slab separation + callout choreography here defines
 * the scrub timing the final frames must match.
 */
export default function ExplodedAssembly({ progress }: ChapterProps) {
  const center = Math.floor(buildingLayers.length / 2);

  return (
    <div className="flex h-full items-center justify-center bg-[#0c0e12] text-neutral-100">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-[1fr_320px]">
        <div className="relative flex h-[70vh] flex-col items-center justify-center">
          {buildingLayers.map((layer, i) => {
            const t = win(progress, layerWindows[i].separate.start, layerWindows[i].separate.end);
            const offset = (i - center) * -SPREAD_VH * t;
            return (
              <div
                key={layer.id}
                className="absolute h-[9vh] w-[min(56vw,520px)] rounded-sm border border-neutral-500/60 bg-neutral-800/80"
                style={{
                  transform: `translateY(${offset}vh) translateY(${(i - center) * 2.4}vh)`,
                  willChange: "transform",
                  zIndex: buildingLayers.length - i,
                }}
                aria-hidden
              >
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-widest text-neutral-400"
                  style={{ opacity: win(progress, layerWindows[i].callout.start, layerWindows[i].callout.end) }}
                >
                  {layer.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col justify-center gap-6">
          <TextReveal progress={progress} start={title.start} end={title.end}>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              One building,
              <br />
              five systems.
            </h2>
          </TextReveal>
          <ol className="flex flex-col gap-3">
            {buildingLayers.map((layer, i) => {
              const t = win(progress, layerWindows[i].callout.start, layerWindows[i].callout.end);
              return (
                <li
                  key={layer.id}
                  className="border-l border-neutral-600 pl-4"
                  style={{ opacity: lerp(0.15, 1, t), transform: `translateY(${lerp(8, 0, t)}px)` }}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-medium">{layer.label}</p>
                    <p className="text-xs tabular-nums text-neutral-500">{(layer.costEtb.value / 1e6).toFixed(0)}M ETB</p>
                  </div>
                  <p className="text-xs text-neutral-400">{layer.callout}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
