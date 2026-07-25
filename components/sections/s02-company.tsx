"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { sponsor, companyStats, vision, mission } from "@/data/company";

/**
 * S2 — Company profile: identity, vision, capacity and track record. All
 * facts from the TDOMA prospectus (registration of existing shares).
 */
export default function Company({ progress }: ChapterProps) {
  return (
    <div className="flex h-full items-center justify-center py-8">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1600px]">
        <div className="holo p-8 md:p-12 2xl:p-16">
          <p className="label text-[var(--orange-text)]">01 · The company</p>
          <TextReveal progress={progress} start={0.04} end={0.16}>
            <h2 className="font-display mt-3 text-[clamp(2.4rem,5vw,5rem)] font-bold leading-tight text-[var(--green-deep)]">
              {sponsor.name}
            </h2>
          </TextReveal>
          <TextReveal progress={progress} start={0.09} end={0.2}>
            <p className="mt-2 max-w-4xl text-lg text-[var(--dim)]">{sponsor.meaning}</p>
          </TextReveal>

          {/* Wide three-column row: vision · mission · capacity */}
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <div className="glass p-6 2xl:p-7" style={{ opacity: win(progress, 0.12, 0.26) }}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="label text-[var(--green)]">Vision</p>
                <span className="font-display text-sm font-semibold text-[var(--orange-text)]">by {vision.horizon}</span>
              </div>
              <p className="mt-3 text-base leading-relaxed text-[var(--ink)] 2xl:text-lg">{vision.body}</p>
            </div>
            <div className="glass p-6 2xl:p-7" style={{ opacity: win(progress, 0.16, 0.3) }}>
              <p className="label text-[var(--green)]">Mission</p>
              <p className="mt-3 text-base leading-relaxed text-[var(--ink)] 2xl:text-lg">{mission.body}</p>
            </div>
            <div className="holo hud p-6 2xl:p-7">
              <p className="label text-[var(--green)]">Capacity</p>
              <dl className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <dt className="text-sm uppercase tracking-wider text-[var(--dim)]">Founded</dt>
                  <dd className="font-display text-3xl font-bold text-[var(--green-deep)]">
                    <Counter progress={progress} start={0.2} end={0.4} value={companyStats.foundedYear.value} grouping={false} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm uppercase tracking-wider text-[var(--dim)]">Holders</dt>
                  <dd className="font-display text-3xl font-bold text-[var(--green-deep)]">
                    <Counter progress={progress} start={0.2} end={0.4} value={companyStats.shareholders.value} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm uppercase tracking-wider text-[var(--dim)]">Capital</dt>
                  <dd className="font-display text-3xl font-bold text-[var(--green-deep)]">
                    <Counter progress={progress} start={0.2} end={0.4} value={companyStats.paidUpCapitalEtbM.value} decimals={1} suffix="M" />
                  </dd>
                </div>
              </dl>
              <dl className="mt-4 flex flex-col gap-2 border-t border-[var(--green)]/15 pt-3 text-sm">
                <div className="flex justify-between gap-3"><dt className="text-[var(--dim)]">Legal form</dt><dd className="text-right font-medium text-[var(--ink)]">Arts. 304–509</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-[var(--dim)]">Structure</dt><dd className="text-right font-medium text-[var(--ink)]">70/30 PPP</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-[var(--dim)]">Reporting</dt><dd className="text-right font-medium text-[var(--ink)]">Full IFRS</dd></div>
              </dl>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
