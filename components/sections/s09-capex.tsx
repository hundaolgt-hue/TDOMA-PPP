"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { capexComposition, headline } from "@/data/financials";

const BN = 1e9;
const M = 1e6;

/**
 * S9 — Capex dashboard (sci-fi HUD). Animated composition bars, the funding
 * split, and the cash/land breakdown. All from the model's Capex sheet.
 */
export default function Capex({ progress }: ChapterProps) {
  // TDOMA's own cash cost — the City's in-kind land contribution is excluded
  // (it is neither spent nor financed by TDOMA).
  const cashComposition = capexComposition.filter((c) => !c.nonCash);
  const max = Math.max(...cashComposition.map((c) => c.valueEtb.value));
  const total = cashComposition.reduce((s, c) => s + c.valueEtb.value, 0);
  const cash = headline.cashRequirementEtb.value;
  const equity = headline.tdomaEquityEtb.value;
  const debt = headline.debtEtb.value;
  const fx = 160;

  return (
    <div className="grid-bg flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1600px]">
        <div className="flex items-center gap-3">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--orange)]" />
          <p className="label text-[var(--orange-text)]">09 · Capital · IAS 16 / IAS 23</p>
        </div>
        <TextReveal progress={progress} start={0.04} end={0.16}>
          <h2 className="font-display mt-2 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            Where TDOMA&apos;s {(total / BN).toFixed(1)} billion goes.
          </h2>
        </TextReveal>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          {/* Composition bars */}
          <div className="holo p-6 2xl:p-8">
            <p className="label text-[var(--green)]">Development cost composition · ETB · TDOMA cash cost</p>
            <ul className="mt-4 flex flex-col gap-3.5" role="img" aria-label={`Development cost composition totalling ${(total / BN).toFixed(2)} billion ETB, TDOMA's cash cost.`}>
              {cashComposition.map((c, i) => {
                const t = win(progress, 0.12 + i * 0.04, 0.28 + i * 0.04);
                const wpct = (c.valueEtb.value / max) * 100 * t;
                return (
                  <li key={c.label}>
                    <div className="flex items-baseline justify-between text-base">
                      <span className="text-[var(--ink)]">{c.label}</span>
                      <span className="font-display font-semibold tabular-nums text-[var(--green-deep)]">
                        {c.valueEtb.value >= BN ? `${(c.valueEtb.value / BN).toFixed(2)} bn` : `${(c.valueEtb.value / M).toFixed(0)} M`}
                      </span>
                    </div>
                    <div className="mt-1.5 h-3.5 w-full overflow-hidden rounded-full bg-[var(--green)]/10">
                      <div className="h-full rounded-full" style={{ width: `${wpct}%`, background: "linear-gradient(90deg,var(--green-deep),var(--green))", boxShadow: "0 0 12px rgba(14,122,82,0.25)" }} />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm text-[var(--dim)]">Excludes the City&apos;s land, contributed in-kind as its non-cash PPP share.</p>
          </div>

          {/* Funding + totals */}
          <div className="flex flex-col gap-5">
            <div className="holo hud p-6 text-center">
              <p className="label text-[var(--green)]">Total capex · TDOMA&apos;s cost</p>
              <p className="font-display mt-1 text-5xl font-bold text-[var(--green-deep)] 2xl:text-6xl">
                <Counter progress={progress} start={0.16} end={0.46} value={total / BN} decimals={2} suffix=" bn" />
              </p>
              <p className="text-base text-[var(--dim)]">ETB · USD ${(total / fx / M).toFixed(1)}M @160</p>
            </div>

            <div className="holo p-6">
              <p className="label text-[var(--green)]">Funding · cash requirement {(cash / BN).toFixed(2)} bn</p>
              {/* stacked funding bar — labelled so the split reads without colour */}
              {(() => {
                const eqPct = Math.round((equity / (equity + debt)) * 100);
                const dbPct = 100 - eqPct;
                const gw = win(progress, 0.3, 0.5);
                return (
                  <div className="mt-3 flex h-9 w-full overflow-hidden rounded-lg" role="img" aria-label={`Funding split: TDOMA equity ${eqPct} percent, debt ${dbPct} percent`}>
                    <div className="flex h-full items-center justify-center overflow-hidden whitespace-nowrap text-xs font-semibold text-white" style={{ width: `${eqPct * gw}%`, background: "linear-gradient(90deg,var(--green-deep),var(--green))" }}>{gw > 0.75 ? `Equity ${eqPct}%` : ""}</div>
                    <div className="flex h-full items-center justify-center overflow-hidden whitespace-nowrap text-xs font-semibold text-white" style={{ width: `${dbPct * gw}%`, background: "var(--orange)" }}>{gw > 0.75 ? `Debt ${dbPct}%` : ""}</div>
                  </div>
                );
              })()}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="glass p-4">
                  <p className="text-sm text-[var(--dim)]">TDOMA equity · 75%</p>
                  <p className="font-display text-xl font-semibold tabular-nums text-[var(--green-deep)]">
                    <Counter progress={progress} start={0.32} end={0.56} value={equity / BN} decimals={2} suffix=" bn" />
                  </p>
                </div>
                <div className="glass p-4">
                  <p className="text-sm text-[var(--dim)]">Debt · 25%</p>
                  <p className="font-display text-xl font-semibold tabular-nums text-[var(--green-deep)]">
                    <Counter progress={progress} start={0.32} end={0.56} value={debt / BN} decimals={2} suffix=" bn" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Memo strip */}
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ["Capex / gross m²", "181,317", "ETB"],
            ["Effective / TDOMA m²", "259,025", "70% share"],
            ["Input VAT recoverable", "629 M", "refunded Y1"],
            ["Pre-opening & marketing", "120 M", "ETB"],
          ].map(([l, v, s], i) => (
            <div key={l as string} className="holo p-5" style={{ opacity: win(progress, 0.42 + i * 0.03, 0.54 + i * 0.03) }}>
              <p className="label text-[var(--green)]">{l}</p>
              <p className="font-display mt-1 text-2xl font-bold tabular-nums text-[var(--green-deep)]">{v}</p>
              <p className="text-sm text-[var(--dim)]">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
