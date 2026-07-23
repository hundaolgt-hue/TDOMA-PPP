"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp, seg, clamp01 } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import { constructionPhases } from "@/data/phases";
import { title, phaseWindow } from "./timeline";

/**
 * Chapter 3 — Construction phasing (greybox).
 * Blocks assemble bottom-up per phase; the timeline scrubber underneath is
 * driven by the same progress value, so the two can never desync.
 */
export default function ConstructionPhasing({ progress }: ChapterProps) {
  const n = constructionPhases.length;
  const buildT = clamp01(seg(progress, 0.12, 0.9));
  const activeIndex = Math.min(n - 1, Math.floor(buildT * n));

  return (
    <div className="flex h-full items-center justify-center bg-[#0c0e12] text-neutral-100">
      <div className="flex w-full max-w-5xl flex-col gap-10 px-6">
        <TextReveal progress={progress} start={title.start} end={title.end}>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">Built in six moves.</h2>
        </TextReveal>

        <div className="flex h-[46vh] items-end justify-center gap-1" aria-hidden>
          {/* excavation renders as a pit; later phases stack upward */}
          {constructionPhases.map((phase, i) => {
            const w = phaseWindow(i, n);
            const t = win(progress, w.start, w.end);
            const isPit = phase.id === "excavation";
            return (
              <div key={phase.id} className="flex h-full w-24 flex-col justify-end md:w-32">
                <div
                  className="rounded-t-sm border border-neutral-500/50 bg-neutral-700/80"
                  style={{
                    height: `${lerp(0, isPit ? 12 : 14 + i * 10, t)}%`,
                    opacity: t === 0 ? 0 : 1,
                    transformOrigin: "bottom",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Synchronized scrubber */}
        <div>
          <div className="relative h-1 w-full rounded bg-neutral-800">
            <div className="absolute inset-y-0 left-0 rounded bg-neutral-200" style={{ width: `${buildT * 100}%` }} />
          </div>
          <ol className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-6">
            {constructionPhases.map((phase, i) => (
              <li
                key={phase.id}
                className="text-xs uppercase tracking-wider"
                style={{ opacity: i <= activeIndex ? 1 : 0.35 }}
                aria-current={i === activeIndex ? "step" : undefined}
              >
                <span className="block text-neutral-200">{phase.label}</span>
                <span className="text-neutral-500">{phase.months.value} mo</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
