"use client";

import { useState } from "react";
import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import { sensitivity } from "@/data/financials";

const BN = 1e9;

/**
 * S11 — Sensitivity analysis. Scenario toggle morphs the IRR / margin / DSCR
 * readout and bars. Recomputed scenarios from the model's Sensitivity sheet;
 * the DSCR covenant (1.30×) is the binding constraint and is marked.
 */
export default function Sensitivity({ progress }: ChapterProps) {
  const [idx, setIdx] = useState(0);
  const active = sensitivity[idx];
  const maxIrr = Math.max(...sensitivity.map((s) => s.irrPct.value));
  const maxMargin = Math.max(...sensitivity.map((s) => s.marginEtb.value));
  const breach = active.minDscr.value < 1.3;

  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1500px]">
        <p className="font-tech-label text-xs text-[var(--orange-text)]">11 · Sensitivity</p>
        <TextReveal progress={progress} start={0.04} end={0.16}>
          <h2 className="font-display mt-3 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            What moves the outcome.
          </h2>
        </TextReveal>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1fr]">
          <div className="glass-strong p-6 2xl:p-8" style={{ opacity: win(progress, 0.12, 0.26) }}>
            <div role="group" aria-label="Scenario" className="flex flex-wrap gap-2">
              {sensitivity.map((s, i) => (
                <button key={s.label} type="button" onClick={() => setIdx(i)} aria-pressed={i === idx}
                  className="rounded-full px-4 py-2 text-xs font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green)]"
                  style={{ background: i === idx ? "var(--green-deep)" : "var(--glass)", color: i === idx ? "white" : "var(--dim)", border: "1px solid var(--glass-border)" }}>
                  {s.label}
                </button>
              ))}
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <dt className="text-sm uppercase tracking-wider text-[var(--dim)]">Project IRR</dt>
                <dd className="font-display text-3xl font-bold text-[var(--green-deep)] 2xl:text-4xl tabular-nums">{active.irrPct.value.toFixed(1)}%</dd>
              </div>
              <div>
                <dt className="text-sm uppercase tracking-wider text-[var(--dim)]">Dev. margin</dt>
                <dd className="font-display text-3xl font-bold text-[var(--green-deep)] 2xl:text-4xl tabular-nums">{(active.marginEtb.value / BN).toFixed(2)}<span className="text-lg">bn</span></dd>
              </div>
              <div>
                <dt className="text-sm uppercase tracking-wider text-[var(--dim)]">Min DSCR</dt>
                <dd className="font-display flex items-baseline gap-1.5 text-3xl font-bold tabular-nums 2xl:text-4xl" style={{ color: breach ? "var(--orange-text)" : "var(--green-deep)" }}>
                  {active.minDscr.value.toFixed(2)}×<span className="text-base" aria-hidden>{breach ? "⚠" : "✓"}</span>
                </dd>
              </div>
            </dl>
            <p className="mt-4 rounded-xl p-3 text-sm" style={{ background: breach ? "var(--orange-soft)" : "rgba(14,122,82,0.08)", color: breach ? "var(--orange-text)" : "var(--dim)" }}>{active.note}</p>
          </div>

          <div className="glass-strong p-6 2xl:p-8" style={{ opacity: win(progress, 0.16, 0.3) }}>
            <p className="font-tech-label text-sm text-[var(--green)]">All scenarios · Project IRR vs margin</p>
            <ul className="mt-4 flex flex-col gap-2">
              {sensitivity.map((s, i) => {
                const t = win(progress, 0.2 + i * 0.05, 0.36 + i * 0.05);
                const isBreach = s.minDscr.value < 1.3;
                return (
                  <li key={s.label}>
                    {/* Real button: keyboard-reachable, with hover + selected feedback */}
                    <button
                      type="button"
                      onClick={() => setIdx(i)}
                      aria-pressed={i === idx}
                      aria-label={`${s.label}: project IRR ${s.irrPct.value.toFixed(1)} percent, minimum DSCR ${s.minDscr.value.toFixed(2)} times${isBreach ? " — breaches the 1.30 times covenant" : ""}`}
                      className="w-full rounded-xl px-2.5 py-2 text-left transition-colors duration-200 hover:bg-[var(--green)]/[0.07]"
                      style={{ background: i === idx ? "rgba(14,122,82,0.09)" : undefined }}
                    >
                      <div className="flex justify-between text-xs">
                        <span style={{ color: i === idx ? "var(--green-deep)" : "var(--dim)", fontWeight: i === idx ? 600 : 400 }}>{s.label}</span>
                        <span className="tabular-nums text-[var(--dim)]">{s.irrPct.value.toFixed(1)}% · DSCR {s.minDscr.value.toFixed(2)}×{isBreach && <span className="ml-1 font-semibold text-[var(--orange-text)]">▼ breach</span>}</span>
                      </div>
                      <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-[var(--green)]/10">
                        <div className="h-full rounded-full" style={{ width: `${(s.irrPct.value / maxIrr) * 100 * t}%`, background: isBreach ? "var(--orange)" : "linear-gradient(90deg,var(--green-deep),var(--green))" }} />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-xs text-[var(--dim)]">Bars turn orange where the 1.30× DSCR covenant breaches — the binding constraint, not the IRR hurdle.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
