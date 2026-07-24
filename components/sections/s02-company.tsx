"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { sponsor, companyStats, milestones } from "@/data/company";

/**
 * S2 — Company profile: identity, vision, capacity and track record. All
 * facts from the TDOMA prospectus (registration of existing shares).
 */
export default function Company({ progress }: ChapterProps) {
  return (
    <div className="flex h-full items-center justify-center py-8">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1600px]">
        <div className="holo p-8 md:p-12 2xl:p-16">
          <p className="label text-[var(--orange)]">01 · The company</p>
          <TextReveal progress={progress} start={0.04} end={0.16}>
            <h2 className="font-display mt-3 text-[clamp(2.4rem,5vw,5rem)] font-bold leading-tight text-[var(--green-deep)]">
              {sponsor.name}
            </h2>
          </TextReveal>
          <TextReveal progress={progress} start={0.09} end={0.2}>
            <p className="mt-2 max-w-4xl text-lg text-[var(--dim)]">{sponsor.meaning}</p>
          </TextReveal>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            {/* Vision + mission */}
            <div className="flex flex-col gap-5">
              <div className="glass p-6 2xl:p-7">
                <p className="label text-[var(--green)]">Vision</p>
                <p className="mt-3 text-lg leading-relaxed text-[var(--ink)]">
                  To consolidate Africa&apos;s largest open-air market into a single, modern, digitally-run
                  trading platform — formalising Merkato&apos;s commerce into transparent, bankable,
                  investment-grade space that the merchants themselves co-own.
                </p>
              </div>
              <div className="glass p-6 2xl:p-7">
                <p className="label text-[var(--green)]">Mission &amp; approach</p>
                <p className="mt-3 text-lg leading-relaxed text-[var(--ink)]">
                  Deliver the Liiban Smart Mall as a 70/30 public-private partnership with the City
                  Government of Addis Ababa — evidence-based, IFRS-reported, and structured to be
                  bankable for lenders, transaction advisors and the Ethiopian Capital Market Authority.
                </p>
              </div>
            </div>

            {/* Capacity */}
            <div className="holo hud p-6 2xl:p-7">
              <p className="label text-[var(--green)]">Capacity</p>
              <dl className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <dt className="text-sm uppercase tracking-wider text-[var(--dim)]">Founded</dt>
                  <dd className="font-display text-4xl font-bold text-[var(--green-deep)]">
                    <Counter progress={progress} start={0.2} end={0.4} value={companyStats.foundedYear.value} grouping={false} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm uppercase tracking-wider text-[var(--dim)]">Shareholders</dt>
                  <dd className="font-display text-4xl font-bold text-[var(--green-deep)]">
                    <Counter progress={progress} start={0.2} end={0.4} value={companyStats.shareholders.value} />
                  </dd>
                </div>
                <div>
                  <dt className="text-sm uppercase tracking-wider text-[var(--dim)]">Capital</dt>
                  <dd className="font-display text-4xl font-bold text-[var(--green-deep)]">
                    <Counter progress={progress} start={0.2} end={0.4} value={companyStats.paidUpCapitalEtbM.value} decimals={1} suffix="M" />
                  </dd>
                </div>
              </dl>
              <dl className="mt-5 flex flex-col gap-3 border-t border-[var(--green)]/15 pt-4 text-base">
                <div className="flex justify-between gap-4"><dt className="text-[var(--dim)]">Legal form</dt><dd className="text-right font-medium text-[var(--ink)]">Share company · Arts. 304–509</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--dim)]">Structure</dt><dd className="text-right font-medium text-[var(--ink)]">70/30 PPP · Addis Ababa</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--dim)]">Head office</dt><dd className="text-right font-medium text-[var(--ink)]">Addis Ketema, Woreda 8</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[var(--dim)]">Reporting</dt><dd className="text-right font-medium text-[var(--ink)]">Full IFRS · Procl. 847/2014</dd></div>
              </dl>
            </div>
          </div>

          {/* Milestones */}
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {milestones.map((m, i) => {
              const t = win(progress, 0.4 + i * 0.07, 0.54 + i * 0.07);
              return (
                <li key={m.date} className="glass p-5" style={{ opacity: t, transform: `translateY(${lerp(14, 0, t)}px)` }}>
                  <p className="label text-[var(--orange)]">{m.date}</p>
                  <p className="font-display mt-1 text-xl font-semibold text-[var(--green-deep)]">{m.title}</p>
                  <p className="mt-2 text-base leading-relaxed text-[var(--dim)]">{m.detail}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
