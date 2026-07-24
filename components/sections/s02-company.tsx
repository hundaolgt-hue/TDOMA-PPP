"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { sponsor, companyStats, milestones } from "@/data/company";

/**
 * S2 — Company profile: vision and capacity. Presented as the logo docks.
 * All facts from the TDOMA prospectus (registration of existing shares).
 */
export default function Company({ progress }: ChapterProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1500px]">
        <div className="glass-strong p-8 md:p-12 2xl:p-16">
          <p className="font-tech-label text-xs text-[var(--orange)]">01 · The company</p>
          <TextReveal progress={progress} start={0.05} end={0.18}>
            <h2 className="font-display mt-3 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
              {sponsor.name}
            </h2>
          </TextReveal>
          <TextReveal progress={progress} start={0.1} end={0.22}>
            <p className="mt-2 max-w-3xl text-sm text-[var(--dim)] md:text-base">{sponsor.meaning}</p>
          </TextReveal>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="glass p-6">
              <p className="font-tech-label text-[11px] text-[var(--green)]">Vision</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink)] md:text-base">
                Founded by Merkato merchants to formalise trading activities within Merkato —
                consolidating Africa&apos;s largest open-air market into a modern, transparent,
                digitally-run trading platform its own traders co-own.
              </p>
            </div>
            <div className="glass p-6">
              <p className="font-tech-label text-[11px] text-[var(--green)]">Capacity</p>
              <dl className="mt-3 grid grid-cols-3 gap-4">
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-[var(--dim)]">Founded</dt>
                  <dd className="font-display text-3xl font-semibold text-[var(--green-deep)] 2xl:text-4xl">
                    <Counter progress={progress} start={0.2} end={0.4} value={companyStats.foundedYear.value} grouping={false} />
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-[var(--dim)]">Shareholders</dt>
                  <dd className="font-display text-3xl font-semibold text-[var(--green-deep)] 2xl:text-4xl">
                    <Counter progress={progress} start={0.2} end={0.4} value={companyStats.shareholders.value} />
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-[var(--dim)]">Paid-up capital</dt>
                  <dd className="font-display text-3xl font-semibold text-[var(--green-deep)] 2xl:text-4xl">
                    <Counter progress={progress} start={0.2} end={0.4} value={companyStats.paidUpCapitalEtbM.value} decimals={1} suffix="M" />
                    <span className="ml-1 text-sm font-medium text-[var(--dim)]">ETB</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {milestones.map((m, i) => {
              const t = win(progress, 0.34 + i * 0.08, 0.46 + i * 0.08);
              return (
                <li key={m.date} className="glass p-5" style={{ opacity: t, transform: `translateY(${lerp(14, 0, t)}px)` }}>
                  <p className="font-tech-label text-[10px] text-[var(--orange)]">{m.date}</p>
                  <p className="font-display mt-1 text-lg font-semibold text-[var(--green-deep)]">{m.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-[var(--dim)]">{m.detail}</p>
                </li>
              );
            })}
          </ol>

          <p className="mt-6 text-xs text-[var(--dim)]">
            Sourced from the TDOMA prospectus. Development-stage company; legal land ownership for the project not yet secured.
          </p>
        </div>
      </div>
    </div>
  );
}
