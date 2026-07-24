"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";

// Stills extracted from the render films. Replace with hi-res gallery plates
// when supplied; the layout adapts to any 16:9 image.
const shots = [
  { src: "/gallery/g1-tower-complete.jpg", cap: "Completed tower", span: "md:col-span-2 md:row-span-2" },
  { src: "/gallery/g4-front-elevation.jpg", cap: "Front elevation", span: "" },
  { src: "/gallery/g6-terraces.jpg", cap: "Sky terraces", span: "" },
  { src: "/gallery/g2-mep-systems.jpg", cap: "MEP systems", span: "" },
  { src: "/gallery/g5-aerial.jpg", cap: "Aerial context", span: "" },
  { src: "/gallery/g3-facade.jpg", cap: "Façade detail", span: "md:col-span-2" },
  { src: "/gallery/g8-exploded-diagram.jpg", cap: "Assembly diagram", span: "" },
  { src: "/gallery/g7-assembly.jpg", cap: "Exploded view", span: "" },
];

export default function Gallery({ progress }: ChapterProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1600px]">
        <p className="font-tech-label text-xs text-[var(--orange)]">12 · Gallery</p>
        <TextReveal progress={progress} start={0.04} end={0.16}>
          <h2 className="font-display mt-3 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            The building, in full.
          </h2>
        </TextReveal>

        <div className="mt-8 grid auto-rows-[22vh] grid-cols-2 gap-3 md:grid-cols-4">
          {shots.map((s, i) => {
            const t = win(progress, 0.1 + i * 0.05, 0.26 + i * 0.05);
            return (
              <figure key={s.src} className={`group relative overflow-hidden rounded-2xl border border-[var(--glass-border)] ${s.span}`}
                style={{ opacity: t, transform: `scale(${lerp(0.94, 1, t)}) translateY(${lerp(18, 0, t)}px)`, boxShadow: "var(--glass-shadow)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.cap} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <figcaption className="glass-dark absolute bottom-2 left-2 px-3 py-1 text-sm font-medium text-white">{s.cap}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
