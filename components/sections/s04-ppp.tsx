"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { ppp } from "@/data/assumptions";

const BN = 1e9;

/**
 * S4 — The PPP concept. A two-party diagram (TDOMA 70 / City 30) meeting on
 * the development, with the in-kind land and cash funding split. Sourced from
 * the model's Cover + Capex sheets.
 */
export default function PPP({ progress }: ChapterProps) {
  const meetT = win(progress, 0.34, 0.5);
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1500px]">
        <p className="font-tech-label text-xs text-[var(--orange)]">03 · Structure</p>
        <TextReveal progress={progress} start={0.04} end={0.16}>
          <h2 className="font-display mt-3 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            A 70 / 30 public-private partnership.
          </h2>
        </TextReveal>

        <div className="mt-10 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
          {/* TDOMA */}
          <div className="glass-strong p-7" style={{ opacity: win(progress, 0.14, 0.28), transform: `translateX(${lerp(-24, 0, win(progress, 0.14, 0.28))}px)` }}>
            <div className="flex items-baseline justify-between">
              <p className="font-display text-2xl font-bold text-[var(--green-deep)]">TDOMA S.C.</p>
              <p className="font-display text-4xl font-bold text-[var(--green)]">
                <Counter progress={progress} start={0.16} end={0.34} value={ppp.tdomaSharePct.value} suffix="%" />
              </p>
            </div>
            <p className="mt-3 text-sm text-[var(--dim)]">{ppp.tdomaContribution}</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="glass p-4">
                <p className="text-[10px] uppercase tracking-wider text-[var(--dim)]">Equity</p>
                <p className="font-display text-xl font-semibold text-[var(--green-deep)]">
                  <Counter progress={progress} start={0.2} end={0.4} value={ppp.equityEtb.value / BN} decimals={2} suffix=" bn" />
                </p>
              </div>
              <div className="glass p-4">
                <p className="text-[10px] uppercase tracking-wider text-[var(--dim)]">Debt (25% of cash)</p>
                <p className="font-display text-xl font-semibold text-[var(--green-deep)]">
                  <Counter progress={progress} start={0.2} end={0.4} value={ppp.debtEtb.value / BN} decimals={2} suffix=" bn" />
                </p>
              </div>
            </div>
          </div>

          {/* Meeting node */}
          <div className="flex items-center justify-center px-2" aria-hidden>
            <div className="font-display flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ background: "var(--orange)", transform: `scale(${lerp(0.6, 1, meetT)})`, opacity: meetT, boxShadow: "0 8px 30px rgba(240,138,36,0.5)" }}>
              PPP
            </div>
          </div>

          {/* City */}
          <div className="glass-strong p-7" style={{ opacity: win(progress, 0.14, 0.28), transform: `translateX(${lerp(24, 0, win(progress, 0.14, 0.28))}px)` }}>
            <div className="flex items-baseline justify-between">
              <p className="font-display text-2xl font-bold text-[var(--green-deep)]">City of Addis Ababa</p>
              <p className="font-display text-4xl font-bold text-[var(--green)]">
                <Counter progress={progress} start={0.16} end={0.34} value={ppp.citySharePct.value} suffix="%" />
              </p>
            </div>
            <p className="mt-3 text-sm text-[var(--dim)]">{ppp.cityContribution}</p>
            <div className="mt-4 glass p-4">
              <p className="text-[10px] uppercase tracking-wider text-[var(--dim)]">Land, in-kind (non-cash)</p>
              <p className="font-display text-xl font-semibold text-[var(--green-deep)]">
                <Counter progress={progress} start={0.2} end={0.4} value={ppp.landInKindEtb.value / BN} decimals={2} suffix=" bn ETB" />
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 glass mx-auto max-w-3xl p-5 text-center text-sm text-[var(--ink)]" style={{ opacity: win(progress, 0.52, 0.66) }}>
          {ppp.presentation}
        </p>
      </div>
    </div>
  );
}
