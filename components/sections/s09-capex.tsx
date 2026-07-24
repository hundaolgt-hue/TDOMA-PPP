"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { capexComposition, headline } from "@/data/financials";

const BN = 1e9;

/**
 * S9 — Capex explanation with an animated composition chart. Bars grow from
 * baseline in sequence; land (in-kind) marked distinctly. All from the Capex
 * sheet.
 */
export default function Capex({ progress }: ChapterProps) {
  const max = Math.max(...capexComposition.map((c) => c.valueEtb.value));
  const total = capexComposition.reduce((s, c) => s + c.valueEtb.value, 0);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1500px]">
        <p className="font-tech-label text-xs text-[var(--orange)]">08 · Capex</p>
        <TextReveal progress={progress} start={0.04} end={0.16}>
          <h2 className="font-display mt-3 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            Where the {(total / BN).toFixed(1)} bn goes.
          </h2>
        </TextReveal>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_300px] 2xl:grid-cols-[1fr_380px]">
          <div className="glass-strong p-6 2xl:p-8">
            <ul className="flex flex-col gap-3">
              {capexComposition.map((c, i) => {
                const t = win(progress, 0.14 + i * 0.05, 0.3 + i * 0.05);
                const wpct = (c.valueEtb.value / max) * 100 * t;
                return (
                  <li key={c.label}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-[var(--ink)]">{c.label}</span>
                      <span className="font-display font-semibold tabular-nums text-[var(--green-deep)]">{(c.valueEtb.value / BN).toFixed(2)} bn</span>
                    </div>
                    <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-[var(--green)]/10">
                      <div className="h-full rounded-full" style={{ width: `${wpct}%`, background: c.nonCash ? "repeating-linear-gradient(45deg,var(--orange),var(--orange) 6px,#f5a24d 6px,#f5a24d 12px)" : "linear-gradient(90deg,var(--green-deep),var(--green))" }} />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-xs text-[var(--dim)]"><span className="inline-block h-2 w-4 rounded-sm align-middle" style={{ background: "var(--orange)" }} /> Land is the City&apos;s in-kind (non-cash) contribution.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="glass-strong p-6 text-center">
              <p className="font-tech-label text-[11px] text-[var(--green)]">Total capex</p>
              <p className="font-display mt-1 text-4xl font-bold text-[var(--green-deep)] 2xl:text-5xl">
                <Counter progress={progress} start={0.2} end={0.5} value={headline.capexEtb.value / BN} decimals={2} suffix=" bn" />
              </p>
              <p className="text-sm text-[var(--dim)]">ETB · ${(headline.capexUsd.value / 1e6).toFixed(1)}M @160</p>
            </div>
            <div className="glass p-6 text-center">
              <p className="font-tech-label text-[11px] text-[var(--green)]">Cash requirement</p>
              <p className="font-display mt-1 text-3xl font-bold text-[var(--green-deep)]">
                <Counter progress={progress} start={0.24} end={0.54} value={headline.cashRequirementEtb.value / BN} decimals={2} suffix=" bn" />
              </p>
              <p className="text-sm text-[var(--dim)]">ex-land, 75% equity / 25% debt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
