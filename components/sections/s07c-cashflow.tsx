"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import SCurve from "@/components/ui/SCurve";
import { milestones, activities, programmeStats, programmeNotes, floatBands, bandFor } from "@/data/programme";

const BN = 1e9;

/**
 * S7c — Cost-loaded cash-flow, milestone schedule and float analysis. The
 * S-curve scrubs on hover; milestones and float bands reveal on scroll.
 */
export default function Cashflow({ progress }: ChapterProps) {
  const curve = clamp01(seg(progress, 0.1, 0.6));

  // Float distribution across the 37 activities, by band.
  const dist = floatBands.map((b) => ({
    ...b,
    n: activities.filter((a) => bandFor(a.floatWk, a.critical).id === b.id).length,
  }));

  return (
    <div className="grid-bg flex h-full flex-col justify-center px-6 py-[6vh] md:px-10 2xl:px-16">
      <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1720px]">
        <p className="label text-[var(--orange-text)]">07 · Programme · cash-flow, milestones &amp; float</p>
        <TextReveal progress={progress} start={0.02} end={0.12}>
          <h2 className="font-display mt-2 text-[clamp(1.9rem,3.6vw,3.6rem)] font-bold leading-tight text-[var(--green-deep)]">
            The drawdown a lender expects to see.
          </h2>
        </TextReveal>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          {/* S-curve */}
          <div className="holo p-5 2xl:p-6" style={{ opacity: win(progress, 0.06, 0.2) }}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="label text-[var(--green)]">Cost-loaded cash-flow · BOQ-loaded S-curve</p>
              <div className="flex items-center gap-3 text-[0.68rem] text-[var(--dim)]">
                <span className="flex items-center gap-1"><span className="h-0.5 w-4 rounded-full bg-[#b08d4a]" />Cumulative</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-3 rounded-sm bg-[rgba(90,127,168,0.55)]" />Weekly spend</span>
              </div>
            </div>
            <div className="mt-3">
              <SCurve reveal={curve} height={200} />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-3 border-t border-[var(--green)]/15 pt-3">
              <div>
                <p className="label text-[var(--green)]">Capital works</p>
                <p className="font-display text-lg font-bold tabular-nums text-[var(--green-deep)]">
                  <Counter progress={progress} start={0.16} end={0.42} value={programmeStats.capitalWorksEtb.value / BN} decimals={2} suffix=" bn" />
                </p>
              </div>
              <div>
                <p className="label text-[var(--green)]">Drawn over</p>
                <p className="font-display text-lg font-bold tabular-nums text-[var(--green-deep)]">{programmeStats.totalWeeks.value} wks</p>
              </div>
              <div>
                <p className="label text-[var(--green)]">Shape</p>
                <p className="text-sm leading-tight text-[var(--dim)]">Slow ramp → steep frame → tapering fit-out</p>
              </div>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--dim)]">{programmeNotes.scurve}</p>
          </div>

          {/* Milestones */}
          <div className="holo flex flex-col p-5 2xl:p-6" style={{ opacity: win(progress, 0.1, 0.24) }}>
            <p className="label text-[var(--green)]">Milestone schedule</p>
            <ul className="mt-2.5 flex flex-col gap-[1px]">
              {milestones.map((m, i) => {
                const t = win(progress, 0.16 + i * 0.022, 0.3 + i * 0.022);
                const last = i === milestones.length - 1;
                return (
                  <li
                    key={m.id}
                    className="flex items-center gap-2 rounded-md px-1.5 py-[2px] text-[0.74rem] transition-colors hover:bg-[var(--green)]/[0.07]"
                    style={{ opacity: t, transform: `translateX(${lerp(10, 0, t)}px)` }}
                  >
                    <span
                      className="font-display w-8 shrink-0 rounded px-1 text-center text-[0.66rem] font-bold text-white"
                      style={{ background: last ? "var(--orange)" : "var(--green)" }}
                    >
                      {m.id}
                    </span>
                    <span className="flex-1 truncate text-[var(--ink)]" title={m.label}>{m.label}</span>
                    <span className="shrink-0 tabular-nums text-[var(--dim)]">{m.date}</span>
                    <span className="w-[3.6rem] shrink-0 text-right font-semibold tabular-nums text-[var(--green-deep)]">mo {m.month}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Float analysis */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.3fr]">
          <div className="holo p-5" style={{ opacity: win(progress, 0.5, 0.64) }}>
            <p className="label text-[var(--green)]">Schedule risk · float distribution</p>
            <ul className="mt-3 flex flex-col gap-2.5">
              {dist.map((b, i) => {
                const t = win(progress, 0.54 + i * 0.04, 0.68 + i * 0.04);
                return (
                  <li key={b.id}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: b.color }} />
                        <span className="font-medium text-[var(--ink)]">{b.label}</span>
                        <span className="text-[var(--dim)]">· {b.range}</span>
                      </span>
                      <span className="font-display font-bold tabular-nums text-[var(--green-deep)]">{b.n}</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--green)]/10">
                      <div className="h-full rounded-full" style={{ width: `${(b.n / activities.length) * 100 * t}%`, background: b.color }} />
                    </div>
                    <p className="mt-0.5 text-[0.7rem] text-[var(--dim)]">{b.read}</p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 border-t border-[var(--green)]/15 pt-2.5 text-[0.7rem] leading-relaxed text-[var(--dim)]">
              {dist[0].n} zero-float items = {programmeStats.criticalActivities.value} activities on the critical path plus the{" "}
              {programmeStats.contingencyWeeks.value}-week contingency buffer carried as the final item.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="holo p-5" style={{ opacity: win(progress, 0.56, 0.7) }}>
              <p className="label text-[var(--green)]">Method</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--dim)]">{programmeNotes.method}</p>
            </div>
            <div className="holo p-5" style={{ opacity: win(progress, 0.6, 0.74) }}>
              <p className="label text-[var(--orange-text)]">Assumptions &amp; limitations</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--dim)]">{programmeNotes.limits}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
