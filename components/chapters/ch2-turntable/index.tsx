"use client";

import { useState } from "react";
import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import { zones } from "@/data/program";
import { title, ROTATION_DEG, zoneWindow } from "./timeline";

/**
 * Chapter 2 — Programmatic rotation (greybox).
 * CSS-3D placeholder stands in for the live WebGL build (pipeline B) so the
 * turntable speed and zone-illumination order can be tuned now. Legend
 * isolation is click-state, deliberately independent of scroll.
 */
export default function Turntable({ progress }: ChapterProps) {
  const [isolated, setIsolated] = useState<string | null>(null);
  const rotation = lerp(-30, ROTATION_DEG, progress);

  return (
    <div className="flex h-full items-center justify-center bg-[#0a0c10] text-neutral-100">
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1fr_300px]">
        <div className="flex h-[70vh] items-center justify-center" style={{ perspective: "1200px" }}>
          <div
            className="relative h-[38vh] w-[min(48vw,420px)]"
            style={{ transform: `rotateX(55deg) rotateZ(${rotation}deg)`, transformStyle: "preserve-3d", willChange: "transform" }}
            aria-hidden
          >
            {zones.map((zone, i) => {
              const w = zoneWindow(i, zones.length);
              const lit = win(progress, w.start, w.end);
              const dimmed = isolated !== null && isolated !== zone.id;
              return (
                <div
                  key={zone.id}
                  className="absolute inset-x-0 rounded-sm border transition-opacity duration-300"
                  style={{
                    height: "14%",
                    top: `${i * 16}%`,
                    borderColor: zone.color,
                    backgroundColor: zone.color,
                    opacity: dimmed ? 0.08 : lerp(0.12, 0.85, lit),
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <TextReveal progress={progress} start={title.start} end={title.end}>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">Program, in the round.</h2>
          </TextReveal>
          <ul className="flex flex-col gap-2" aria-label="Zone legend — click to isolate">
            {zones.map((zone, i) => {
              const w = zoneWindow(i, zones.length);
              const lit = win(progress, w.start, w.end);
              const active = isolated === zone.id;
              return (
                <li key={zone.id}>
                  <button
                    type="button"
                    onClick={() => setIsolated(active ? null : zone.id)}
                    aria-pressed={active}
                    className="flex w-full items-center gap-3 rounded-sm border border-transparent px-2 py-1.5 text-left text-sm hover:border-neutral-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300"
                    style={{ opacity: lerp(0.3, 1, lit) }}
                  >
                    <span className="h-3 w-3 rounded-[2px]" style={{ backgroundColor: zone.color }} aria-hidden />
                    <span className="flex-1">{zone.label}</span>
                    <span className="text-xs tabular-nums text-neutral-400">
                      {zone.areaSqm.value.toLocaleString()} m²
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="text-xs text-neutral-500">Click a zone to isolate it. Areas are placeholders pending source documents.</p>
        </div>
      </div>
    </div>
  );
}
