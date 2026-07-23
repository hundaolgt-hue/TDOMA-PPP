"use client";

import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { sponsor, companyStats, milestones } from "@/data/company";
import { title, stats } from "./timeline";

/**
 * Chapter 7 — Sponsor & structure. Deliberately restrained: gentle fades, no
 * spectacle. All facts sourced from the TDOMA prospectus. TDOMA is a
 * development-stage company, so the "track record" is a corporate-milestone
 * timeline rather than a list of delivered buildings.
 */
export default function Company({ progress }: { progress: number }) {
  return (
    <div className="flex h-full items-center justify-center bg-[#0c0e12] text-neutral-100">
      <div className="flex w-full max-w-4xl flex-col gap-10 px-6">
        <div>
          <TextReveal progress={progress} start={title.start} end={title.end}>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">{sponsor.name}</h2>
          </TextReveal>
          <TextReveal progress={progress} start={title.start + 0.04} end={title.end + 0.04}>
            <p className="mt-2 max-w-2xl text-sm text-neutral-400">{sponsor.meaning}</p>
          </TextReveal>
        </div>

        <dl className="grid grid-cols-3 gap-6">
          <div>
            <dt className="text-xs uppercase tracking-widest text-neutral-500">Founded</dt>
            <dd className="font-display text-3xl md:text-4xl">
              <Counter progress={progress} start={stats.start} end={stats.end} value={companyStats.foundedYear.value} grouping={false} />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-neutral-500">Shareholders</dt>
            <dd className="font-display text-3xl md:text-4xl">
              <Counter progress={progress} start={stats.start} end={stats.end} value={companyStats.shareholders.value} />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-neutral-500">Paid-up capital</dt>
            <dd className="font-display text-3xl md:text-4xl">
              <Counter progress={progress} start={stats.start} end={stats.end} value={companyStats.paidUpCapitalEtbM.value} decimals={1} prefix="ETB " suffix="M" />
            </dd>
          </div>
        </dl>

        {/* Milestone timeline — scroll-linked cascade */}
        <ol className="grid gap-5 border-t border-neutral-800 pt-8 md:grid-cols-4">
          {milestones.map((m, i) => {
            const start = 0.4 + i * 0.1;
            const t = win(progress, start, start + 0.14);
            return (
              <li key={m.date} style={{ opacity: t, transform: `translateY(${lerp(12, 0, t)}px)` }}>
                <p className="text-xs uppercase tracking-widest text-neutral-500">{m.date}</p>
                <p className="mt-1 text-sm font-medium">{m.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-neutral-400">{m.detail}</p>
              </li>
            );
          })}
        </ol>

        <div className="grid gap-4 text-xs text-neutral-500 md:grid-cols-2">
          <p><span className="uppercase tracking-widest text-neutral-600">Legal form</span><br />{sponsor.legalForm}</p>
          <p><span className="uppercase tracking-widest text-neutral-600">Head office</span><br />{sponsor.headOffice}</p>
        </div>

        <p className="text-xs text-neutral-600">
          Corporate facts sourced from the TDOMA prospectus (registration of existing shares). Development-stage company; legal land ownership for the project is not yet secured.
        </p>
      </div>
    </div>
  );
}
