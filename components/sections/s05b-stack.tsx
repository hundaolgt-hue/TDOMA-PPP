"use client";

import { useState } from "react";
import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import GlaDonut from "@/components/ui/GlaDonut";
import { zones, totalNetGla } from "@/data/program";
import { stackLevels, bands } from "@/data/massing";

// Shared row pitch: the slab silhouette and the level table are laid out on
// the same rhythm so each slab sits on its own table row.
const ROW_H = 26;

const bandColor = Object.fromEntries(bands.map((b) => [b.id, b.color])) as Record<string, string>;

/**
 * S5b — Program stack diagram + net GLA by cluster. The stack assembles
 * bottom-up on scroll; hovering a level widens its slab and surfaces its use,
 * and the donut and its legend are cross-linked so hovering either highlights
 * the matching cluster.
 */
export default function ProgramStack({ progress }: ChapterProps) {
  const [hotLevel, setHotLevel] = useState<string | null>(null);
  const [hotZone, setHotZone] = useState<string | null>(null);
  const donutReveal = clamp01(seg(progress, 0.2, 0.6));

  // Slab width scales with the level's footprint so the silhouette reads as
  // podium (wide) → tower (narrow) → roof (smallest).
  const widthFor = (a: number) => 34 + (a / 3000) * 62;

  return (
    <div className="grid-bg flex h-full flex-col justify-center px-6 py-[6vh] md:px-10 2xl:px-16">
      <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1720px]">
        <p className="label text-[var(--orange-text)]">04 · Massing · program stack</p>
        <TextReveal progress={progress} start={0.02} end={0.12}>
          <h2 className="font-display mt-2 text-[clamp(1.9rem,3.6vw,3.6rem)] font-bold leading-tight text-[var(--green-deep)]">
            Twenty-one levels, one trading machine.
          </h2>
        </TextReveal>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.55fr_1fr]">
          {/* ---- Program stack: slab silhouette + level table, cross-linked ---- */}
          <div className="holo p-5 2xl:p-6">
            <div className="flex items-baseline justify-between">
              <p className="label text-[var(--green)]">Program stack diagram</p>
              <p className="text-sm text-[var(--dim)]">Gross GFA · net GLA per level</p>
            </div>

            <div className="mt-3 grid gap-4 sm:grid-cols-[140px_1fr]">
              {/* Slab silhouette — one row per level, on the same pitch as the
                  table beside it so the two read as a single object */}
              <div className="flex flex-col gap-[2px]" aria-hidden>
                {stackLevels.map((l, i) => {
                  const t = win(progress, 0.08 + (stackLevels.length - 1 - i) * 0.018, 0.2 + (stackLevels.length - 1 - i) * 0.018);
                  const on = hotLevel === l.id;
                  return (
                    <div
                      key={l.id}
                      onPointerEnter={() => setHotLevel(l.id)}
                      onPointerLeave={() => setHotLevel(null)}
                      className="flex items-center justify-center"
                      style={{ height: ROW_H }}
                    >
                      <div
                        className="rounded-[3px]"
                        style={{
                          width: `${widthFor(l.areaSqm) * (on ? 1.08 : 1)}%`,
                          height: l.band === "podium" || l.band === "basement" ? 14 : 10,
                          background: bandColor[l.band],
                          opacity: t * (hotLevel && !on ? 0.42 : 1),
                          transform: `scaleX(${lerp(0.4, 1, t)})`,
                          boxShadow: on ? "0 0 14px rgba(240,138,36,0.65)" : undefined,
                          outline: on ? "1.5px solid var(--orange)" : undefined,
                          transition: "width 220ms var(--ease-glass), opacity 220ms, box-shadow 220ms",
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Level table */}
              <ul className="flex flex-col gap-[2px] text-sm">
                {stackLevels.map((l, i) => {
                  const t = win(progress, 0.08 + (stackLevels.length - 1 - i) * 0.018, 0.22 + (stackLevels.length - 1 - i) * 0.018);
                  const on = hotLevel === l.id;
                  return (
                    <li
                      key={l.id}
                      onPointerEnter={() => setHotLevel(l.id)}
                      onPointerLeave={() => setHotLevel(null)}
                      className="flex items-center gap-2.5 rounded-lg px-2"
                      style={{
                        height: ROW_H,
                        opacity: t * (hotLevel && !on ? 0.5 : 1),
                        background: on ? "rgba(240,138,36,0.12)" : undefined,
                        transition: "background 200ms var(--ease-glass), opacity 200ms",
                      }}
                    >
                      <span
                        className="font-display w-11 shrink-0 rounded px-1 text-center text-[0.72rem] font-bold text-white"
                        style={{ background: bandColor[l.band] }}
                      >
                        {l.level}
                      </span>
                      <span className="flex-1 truncate text-[var(--ink)]" title={l.use}>{l.use}</span>
                      <span className="font-display shrink-0 font-semibold tabular-nums text-[var(--green-deep)]">
                        {l.areaSqm.toLocaleString()} m²
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Band totals */}
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--green)]/15 pt-3 sm:grid-cols-5">
              {bands.map((b, i) => (
                <div key={b.id} className="text-center" style={{ opacity: win(progress, 0.42 + i * 0.03, 0.56 + i * 0.03) }}>
                  <span className="mx-auto mb-1 block h-1.5 w-8 rounded-full" style={{ background: b.color }} />
                  <p className="text-[0.72rem] font-medium text-[var(--ink)]">{b.label}</p>
                  <p className="font-display text-sm font-bold tabular-nums text-[var(--green-deep)]">{b.grossSqm.toLocaleString()} m²</p>
                  {b.note && <p className="text-[0.68rem] text-[var(--dim)]">{b.note}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* ---- Net GLA by cluster ---- */}
          <div className="holo flex flex-col p-5 2xl:p-6">
            <p className="label text-[var(--green)]">Net GLA by program cluster</p>

            <div className="mt-2 flex justify-center">
              <GlaDonut
                zones={zones}
                total={totalNetGla.value}
                reveal={donutReveal}
                active={hotZone}
                onActive={setHotZone}
                size={210}
              />
            </div>

            <ul className="mt-3 flex flex-col gap-[1px]">
              {zones.map((z, i) => {
                const t = win(progress, 0.3 + i * 0.02, 0.44 + i * 0.02);
                const on = hotZone === z.id;
                return (
                  <li
                    key={z.id}
                    onPointerEnter={() => setHotZone(z.id)}
                    onPointerLeave={() => setHotZone(null)}
                    className="flex items-center gap-2 rounded-md px-1.5 py-[2px] text-[0.78rem]"
                    style={{
                      opacity: t * (hotZone && !on ? 0.45 : 1),
                      background: on ? "rgba(14,122,82,0.09)" : undefined,
                      transition: "background 180ms, opacity 180ms",
                    }}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: z.color }} />
                    <span className="flex-1 truncate text-[var(--ink)]">{z.label}</span>
                    <span className="tabular-nums text-[var(--dim)]">{z.areaSqm.value.toLocaleString()} m²</span>
                    <span className="w-11 text-right font-semibold tabular-nums text-[var(--green-deep)]">{z.sharePct.value}%</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto flex items-baseline justify-between border-t border-[var(--green)]/15 pt-2.5">
              <p className="label text-[var(--green)]">Total net GLA</p>
              <p className="font-display text-lg font-bold tabular-nums text-[var(--green-deep)]">
                {totalNetGla.value.toLocaleString()} m² · 100%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
