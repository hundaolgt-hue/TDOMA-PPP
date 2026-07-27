"use client";

import { useState } from "react";
import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { massing, totalNetGla } from "@/data/program";
import { calloutsMassing, families, massingCaveat } from "@/data/massing";

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Where each callout pins onto the render, top → bottom.
const pins: Record<string, { top: string; left: string }> = {
  pavilion: { top: "13%", left: "56%" },
  tower: { top: "34%", left: "48%" },
  terraces: { top: "50%", left: "62%" },
  podium: { top: "70%", left: "44%" },
  plaza: { top: "86%", left: "52%" },
};

/**
 * S5a — Massing concept. Headline massing stats, the annotated building with
 * callouts that light up on hover, and the four programme families the
 * clusters roll up into.
 */
export default function Massing({ progress }: ChapterProps) {
  const [hot, setHot] = useState<string | null>(null);

  const stats = [
    { label: "Above grade", value: massing.storeys.value, prefix: "G+", suffix: "", dec: 0 },
    { label: "Basements", value: 3, prefix: "", suffix: "", dec: 0 },
    { label: "Net GLA", value: totalNetGla.value, prefix: "~", suffix: " m²", dec: 0 },
    { label: "Total height", value: massing.totalHeightM.value, prefix: "~", suffix: " m", dec: 1 },
  ];

  return (
    <div className="grid-bg flex h-full flex-col justify-center px-6 py-[6vh] md:px-10 2xl:px-16">
      <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1680px]">
        <p className="label text-[var(--orange-text)]">04 · Massing concept &amp; program configuration</p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <TextReveal progress={progress} start={0.02} end={0.12}>
            <h2 className="font-display text-[clamp(2rem,4vw,4rem)] font-bold leading-tight text-[var(--green-deep)]">
              A layered trading engine with a civic heart.
            </h2>
          </TextReveal>

          {/* Hero stat chips */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[44rem]">
            {stats.map((s, i) => (
              <div key={s.label} className="glass lift p-3.5 text-center" style={{ opacity: win(progress, 0.06 + i * 0.03, 0.2 + i * 0.03) }}>
                <p className="font-display text-2xl font-bold leading-none text-[var(--green-deep)] 2xl:text-3xl">
                  {s.prefix}
                  <Counter progress={progress} start={0.08} end={0.34} value={s.value} decimals={s.dec} suffix={s.suffix} />
                </p>
                <p className="label mt-1.5 text-[var(--green)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          {/* Annotated massing render */}
          <div className="holo overflow-hidden p-2" style={{ opacity: win(progress, 0.1, 0.24) }}>
            <div className="relative overflow-hidden rounded-[calc(var(--glass-radius)-8px)]" style={{ aspectRatio: "16 / 11" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BP}/gallery/render-06-golden-aerial.webp`}
                alt="Massing concept — podium, tower and rooftop pavilion in context"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,30,22,0.05),rgba(10,30,22,0.35))]" />

              <span className="label glass-dark absolute left-3 top-3 rounded-md px-2.5 py-1 text-white">Massing concept</span>

              {/* Callout pins — hover to light one up */}
              {calloutsMassing.map((c, i) => {
                const t = win(progress, 0.2 + i * 0.05, 0.34 + i * 0.05);
                const on = hot === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onPointerEnter={() => setHot(c.id)}
                    onPointerLeave={() => setHot(null)}
                    onFocus={() => setHot(c.id)}
                    onBlur={() => setHot(null)}
                    aria-label={`${c.label}: ${c.detail}`}
                    className="absolute z-10 h-4 w-4 rounded-full"
                    style={{
                      top: pins[c.id].top,
                      left: pins[c.id].left,
                      opacity: t,
                      background: on ? "var(--orange)" : "rgba(255,255,255,0.9)",
                      boxShadow: on
                        ? "0 0 0 6px rgba(240,138,36,0.3), 0 0 16px rgba(240,138,36,0.7)"
                        : "0 0 0 4px rgba(255,255,255,0.28)",
                      transition: "background 200ms var(--ease-glass), box-shadow 200ms var(--ease-glass), transform 200ms var(--ease-glass)",
                      transform: `translate(-50%,-50%) scale(${on ? 1.25 : 1})`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Callout legend — hovering a row lights its pin, and vice versa */}
          <ul className="flex flex-col gap-2.5">
            {calloutsMassing.map((c, i) => {
              const t = win(progress, 0.18 + i * 0.05, 0.32 + i * 0.05);
              const on = hot === c.id;
              return (
                <li
                  key={c.id}
                  onPointerEnter={() => setHot(c.id)}
                  onPointerLeave={() => setHot(null)}
                  className="glass cursor-default p-3.5 2xl:p-4"
                  style={{
                    opacity: t,
                    transform: `translateX(${lerp(14, 0, t)}px)`,
                    borderColor: on ? "rgba(240,138,36,0.65)" : undefined,
                    boxShadow: on ? "var(--shadow-lift)" : undefined,
                    transition: "border-color 200ms var(--ease-glass), box-shadow 200ms var(--ease-glass)",
                  }}
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: on ? "var(--orange)" : "var(--green)", transition: "background 200ms" }}
                    />
                    <p className="font-display text-base font-semibold text-[var(--green-deep)]">{c.label}</p>
                  </div>
                  <p className="mt-0.5 pl-4 text-sm leading-relaxed text-[var(--dim)]">{c.detail}</p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Programme families */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {families.map((f, i) => {
            const t = win(progress, 0.5 + i * 0.04, 0.64 + i * 0.04);
            return (
              <div key={f.id} className="holo lift p-4 2xl:p-5" style={{ opacity: t, transform: `translateY(${lerp(14, 0, t)}px)` }}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-display text-base font-bold text-[var(--green-deep)]">{f.label}</p>
                  <p className="font-display text-xl font-bold tabular-nums text-[var(--orange-text)]">~{f.sharePct}%</p>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-[var(--dim)]">{f.detail}</p>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--green)]/10">
                  <div className="h-full rounded-full" style={{ width: `${f.sharePct * t}%`, background: "linear-gradient(90deg,var(--green-deep),var(--green))" }} />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[var(--dim)]">{massingCaveat}</p>
      </div>
    </div>
  );
}
