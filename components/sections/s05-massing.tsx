"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp, seg, clamp01 } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { massing, totalNetGla } from "@/data/program";

/**
 * S5 — Massing concept & building metrics. A schematic stack (3 basements →
 * podium → tower → roof crown) assembles from scroll, beside sourced massing
 * figures. All values from the Area Allocation Matrix (page 5 massing +
 * cluster total).
 */
const stack = [
  { id: "roof", label: "Roof crown", hPct: 6, color: "var(--orange)" },
  { id: "tower", label: "Tower · L5–L15", hPct: 44, color: "var(--green)" },
  { id: "podium", label: "Podium · G–L4", hPct: 26, color: "var(--green-deep)" },
  { id: "basement", label: "3 basement levels", hPct: 24, color: "#7d8a99" },
];

const metrics = [
  { label: "Plot area", value: massing.plotAreaSqm.value, suffix: " m²" },
  { label: "Above-grade gross", value: massing.aboveGradeGrossSqm.value, suffix: " m²" },
  { label: "Basement gross", value: massing.basementGrossSqm.value, suffix: " m²" },
  { label: "Total net GLA", value: totalNetGla.value, suffix: " m²" },
  { label: "Total height", value: massing.totalHeightM.value, suffix: " m", decimals: 1 },
  { label: "Plot ratio (FAR)", value: massing.farRatio.value, suffix: "×", decimals: 1 },
];

export default function Massing({ progress }: ChapterProps) {
  const assemble = clamp01(seg(progress, 0.12, 0.7));
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1500px]">
        <p className="font-tech-label text-xs text-[var(--orange)]">04 · Massing</p>
        <TextReveal progress={progress} start={0.04} end={0.16}>
          <h2 className="font-display mt-3 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            G+15 over three basements.
          </h2>
        </TextReveal>

        <div className="mt-8 grid items-center gap-8 md:grid-cols-[340px_1fr] 2xl:grid-cols-[440px_1fr]">
          {/* Schematic stack */}
          <div className="glass-strong flex h-[52vh] flex-col-reverse gap-1.5 p-6" aria-hidden>
            {stack.map((s, i) => {
              const t = win(progress, 0.14 + i * 0.12, 0.32 + i * 0.12);
              return (
                <div key={s.id} className="flex items-center gap-3" style={{ height: `${s.hPct}%` }}>
                  <div className="h-full flex-1 rounded-md" style={{ background: s.color, opacity: lerp(0.15, 0.9, t), transform: `scaleY(${lerp(0.2, 1, t)})`, transformOrigin: "bottom" }} />
                  <span className="w-28 shrink-0 text-sm font-medium text-[var(--dim)]" style={{ opacity: t }}>{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Metrics */}
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {metrics.map((m, i) => {
              const t = win(progress, 0.2 + i * 0.05, 0.36 + i * 0.05);
              return (
                <div key={m.label} className="glass p-5" style={{ opacity: t, transform: `translateY(${lerp(14, 0, t)}px)` }}>
                  <dt className="text-sm uppercase tracking-wider text-[var(--dim)]">{m.label}</dt>
                  <dd className="font-display mt-1 text-2xl font-semibold text-[var(--green-deep)] 2xl:text-3xl">
                    <Counter progress={progress} start={0.24} end={0.5} value={m.value} decimals={m.decimals ?? 0} suffix={m.suffix} />
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
        {/* assemble drives the stack via per-layer windows; kept referenced for scrub-stability */}
        <span className="sr-only">{Math.round(assemble * 100)}</span>
      </div>
    </div>
  );
}
