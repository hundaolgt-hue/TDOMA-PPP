"use client";

import { useState } from "react";
import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { massing, totalNetGla } from "@/data/program";
import { massingSheet, footprints, sectionMarks, basementUses, surfaceWorks, efficiencies } from "@/data/massing";

/**
 * S5c — Key massing metrics, footprint stacking, the section, and what sits
 * below grade and on the surface. Cards lift on hover; the footprint plates
 * reveal their plan dimension.
 */
export default function MassingConfig({ progress }: ChapterProps) {
  const [hotFp, setHotFp] = useState<string | null>(null);
  const surfaceTotal = surfaceWorks.reduce((s, w) => s + w.areaSqm, 0);

  const metrics = [
    { label: "Plot area", v: massing.plotAreaSqm.value, suf: " m²", d: 0 },
    { label: "Site coverage", v: massingSheet.siteCoveragePct.value, suf: "% of plot", d: 0 },
    { label: "Plot ratio (FAR)", v: massing.farRatio.value, suf: "× gross/plot", d: 1 },
    { label: "Total height", v: massing.totalHeightM.value, suf: " m", d: 1 },
    { label: "Podium gross", v: massingSheet.podiumGrossSqm.value, suf: " m²", d: 0 },
    { label: "Tower gross", v: massingSheet.towerGrossSqm.value, suf: " m²", d: 0 },
    { label: "Above-grade gross", v: massing.aboveGradeGrossSqm.value, suf: " m²", d: 0 },
    { label: "Total net GLA", v: totalNetGla.value, suf: " m²", d: 0 },
  ];

  // Section bands drawn to scale against the 72.8 m total height.
  const H = 72.8;
  const secBands = [
    { id: "roof", label: "Roof pavilion", from: 67.8, to: 72.8, color: "#d6a15a" },
    { id: "tower", label: "Tower L5–L15", from: 26.0, to: 67.8, color: "#9a8fd6" },
    { id: "podium", label: "Podium G–L4", from: 0, to: 26.0, color: "#6fb87f" },
  ];

  return (
    <div className="grid-bg flex h-full flex-col justify-center px-6 py-[6vh] md:px-10 2xl:px-16">
      <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1720px]">
        <p className="label text-[var(--orange-text)]">04 · Massing · metrics &amp; configuration</p>
        <TextReveal progress={progress} start={0.02} end={0.12}>
          <h2 className="font-display mt-2 text-[clamp(1.9rem,3.6vw,3.6rem)] font-bold leading-tight text-[var(--green-deep)]">
            5,000 m² of plot, working 5.8× over.
          </h2>
        </TextReveal>

        {/* Key massing metrics */}
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 2xl:gap-4">
          {metrics.map((m, i) => (
            <div key={m.label} className="holo lift hud p-4" style={{ opacity: win(progress, 0.06 + i * 0.025, 0.2 + i * 0.025) }}>
              <p className="label text-[var(--green)]">{m.label}</p>
              <p className="font-display mt-1 text-xl font-bold text-[var(--green-deep)] 2xl:text-2xl">
                <Counter progress={progress} start={0.1} end={0.36} value={m.v} decimals={m.d} suffix={m.suf} />
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {/* ---- Footprint & stacking ---- */}
          <div className="holo p-5">
            <p className="label text-[var(--green)]">Footprint &amp; stacking</p>
            <div className="mt-4 flex items-end justify-around gap-2">
              {footprints.map((f, i) => {
                const t = win(progress, 0.22 + i * 0.06, 0.38 + i * 0.06);
                const on = hotFp === f.id;
                return (
                  <div
                    key={f.id}
                    onPointerEnter={() => setHotFp(f.id)}
                    onPointerLeave={() => setHotFp(null)}
                    className="flex cursor-default flex-col items-center gap-2"
                    style={{ opacity: t }}
                  >
                    <div
                      className="rounded-lg border-2 border-dashed"
                      style={{
                        width: `${f.w * 0.9}px`,
                        height: `${f.h * 0.9}px`,
                        borderColor: on ? "var(--orange)" : "rgba(14,122,82,0.45)",
                        background: on ? "rgba(240,138,36,0.12)" : "rgba(14,122,82,0.07)",
                        transform: `scale(${lerp(0.8, on ? 1.06 : 1, t)})`,
                        transition: "border-color 200ms, background 200ms, transform 220ms var(--ease-glass)",
                      }}
                    />
                    <div className="text-center">
                      <p className="text-[0.72rem] font-medium leading-tight text-[var(--ink)]">{f.label}</p>
                      {f.sub && <p className="text-[0.68rem] text-[var(--dim)]">{f.sub}</p>}
                      <p className="font-display text-sm font-bold tabular-nums text-[var(--green-deep)]">{f.areaSqm.toLocaleString()} m²</p>
                      <p className="text-[0.68rem] transition-opacity" style={{ opacity: on ? 1 : 0.45, color: on ? "var(--orange-text)" : "var(--dim)" }}>
                        {f.dims}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 border-t border-[var(--green)]/15 pt-2.5 text-sm leading-relaxed text-[var(--dim)]">
              The podium covers {massingSheet.siteCoveragePct.value}% of the plot; the tower sets back to a{" "}
              {massingSheet.towerFootprintSqm.value.toLocaleString()} m² floorplate above L5.
            </p>
          </div>

          {/* ---- Section diagram ---- */}
          <div className="holo p-5">
            <p className="label text-[var(--green)]">Section · concept</p>
            <div className="relative mt-4 h-[210px]" aria-hidden>
              {/* grade line */}
              <div className="absolute inset-x-0 bg-[var(--green-deep)]/35" style={{ bottom: "26%", height: 1.5 }} />
              {/* above-grade bands, drawn to scale */}
              {secBands.map((b, i) => {
                const t = win(progress, 0.26 + i * 0.05, 0.42 + i * 0.05);
                const h = ((b.to - b.from) / H) * 74; // 74% of the box is above grade
                const bottom = 26 + (b.from / H) * 74;
                return (
                  <div
                    key={b.id}
                    className="absolute rounded-[3px]"
                    style={{
                      left: b.id === "podium" ? "12%" : "30%",
                      right: b.id === "podium" ? "12%" : "30%",
                      bottom: `${bottom}%`,
                      height: `${h * t}%`,
                      background: b.color,
                      opacity: 0.9,
                    }}
                  />
                );
              })}
              {/* basements */}
              <div
                className="absolute rounded-[3px]"
                style={{ left: "12%", right: "12%", bottom: 0, height: `${26 * win(progress, 0.24, 0.4)}%`, background: "#8f9bb0", opacity: 0.85 }}
              />
              {/* height markers */}
              {sectionMarks.map((s, i) => {
                const t = win(progress, 0.34 + i * 0.04, 0.5 + i * 0.04);
                const bottom = s.m >= 0 ? 26 + (s.m / H) * 74 : 26 + (s.m / 13.5) * 26;
                return (
                  <div key={s.id} className="absolute left-0 right-0 flex items-center gap-1" style={{ bottom: `${bottom}%`, opacity: t }}>
                    <span className="font-display text-[0.68rem] font-semibold tabular-nums text-[var(--green-deep)]">
                      {s.m > 0 ? `${s.m} m` : `${s.m} m`}
                    </span>
                    <span className="h-px flex-1 bg-[var(--green)]/25" />
                  </div>
                );
              })}
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
              {efficiencies.map((e, i) => (
                <li key={e.label} className="flex justify-between text-[0.72rem]" style={{ opacity: win(progress, 0.5 + i * 0.02, 0.64 + i * 0.02) }}>
                  <span className="text-[var(--dim)]">{e.label}</span>
                  <span className="font-semibold tabular-nums text-[var(--green-deep)]">{e.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Basement & site configuration ---- */}
          <div className="holo flex flex-col p-5">
            <p className="label text-[var(--green)]">Basement &amp; site configuration</p>

            <ul className="mt-3 flex flex-col gap-2">
              {basementUses.map((b, i) => (
                <li key={b.id} className="glass lift flex items-baseline gap-2.5 p-2.5" style={{ opacity: win(progress, 0.26 + i * 0.05, 0.4 + i * 0.05) }}>
                  <span className="font-display shrink-0 rounded bg-[#8f9bb0] px-1.5 text-[0.7rem] font-bold text-white">
                    {b.id.toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.8rem] font-medium leading-tight text-[var(--ink)]">{b.label}</p>
                    <p className="text-[0.7rem] text-[var(--dim)]">{b.detail}</p>
                  </div>
                  <span className="font-display ml-auto shrink-0 text-sm font-bold tabular-nums text-[var(--green-deep)]">
                    {massingSheet.basementLevelSqm.value.toLocaleString()} m²
                  </span>
                </li>
              ))}
            </ul>

            <p className="label mt-4 text-[var(--green)]">Surface site works · {surfaceTotal.toLocaleString()} m²</p>
            <ul className="mt-2 flex flex-col gap-[3px]">
              {surfaceWorks.map((w, i) => {
                const t = win(progress, 0.42 + i * 0.025, 0.56 + i * 0.025);
                return (
                  <li key={w.id} className="text-[0.75rem]" style={{ opacity: t }}>
                    <div className="flex justify-between gap-2">
                      <span className="truncate text-[var(--ink)]">{w.label}</span>
                      <span className="shrink-0 font-semibold tabular-nums text-[var(--green-deep)]">{w.areaSqm} m²</span>
                    </div>
                    <div className="mt-[3px] h-1 w-full overflow-hidden rounded-full bg-[var(--green)]/10">
                      <div className="h-full rounded-full" style={{ width: `${(w.areaSqm / surfaceTotal) * 100 * t}%`, background: "linear-gradient(90deg,var(--green-deep),var(--green))" }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
