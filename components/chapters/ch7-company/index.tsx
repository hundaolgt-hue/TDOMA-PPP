"use client";

import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { sponsor, companyStats } from "@/data/company";
import { title, stats } from "./timeline";

/**
 * Chapter 7 — Sponsor & structure. Deliberately restrained: gentle fades,
 * no spectacle. Identity is sourced from the model's Cover sheet; a dedicated
 * company-profile document has not been supplied, so delivered-projects track
 * record is stated as pending rather than fabricated.
 */
export default function Company({ progress }: { progress: number }) {
  const structT = win(progress, 0.5, 0.7);

  return (
    <div className="flex h-full items-center justify-center bg-[#0c0e12] text-neutral-100">
      <div className="flex w-full max-w-4xl flex-col gap-12 px-6">
        <TextReveal progress={progress} start={title.start} end={title.end}>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">{sponsor.name}</h2>
        </TextReveal>
        <TextReveal progress={progress} start={title.start + 0.04} end={title.end + 0.04}>
          <p className="text-lg text-neutral-400">{sponsor.descriptor}</p>
        </TextReveal>

        <dl className="grid grid-cols-3 gap-6">
          <div>
            <dt className="text-xs uppercase tracking-widest text-neutral-500">Storeys</dt>
            <dd className="font-display text-3xl md:text-4xl">
              G+<Counter progress={progress} start={stats.start} end={stats.end} value={companyStats.storeys.value} />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-neutral-500">Net GLA</dt>
            <dd className="font-display text-3xl md:text-4xl">
              <Counter progress={progress} start={stats.start} end={stats.end} value={companyStats.netGlaSqm.value} suffix=" m²" />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-neutral-500">Gross dev. value</dt>
            <dd className="font-display text-3xl md:text-4xl">
              <Counter progress={progress} start={stats.start} end={stats.end} value={companyStats.gdvEtbBn.value} decimals={1} suffix=" bn ETB" />
            </dd>
          </div>
        </dl>

        <div className="grid gap-6 border-t border-neutral-800 pt-8 md:grid-cols-2" style={{ opacity: structT, transform: `translateY(${lerp(12, 0, structT)}px)` }}>
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500">Structure</p>
            <p className="mt-2 text-sm text-neutral-300">{sponsor.structure}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500">Reporting framework</p>
            <p className="mt-2 text-sm text-neutral-300">{sponsor.framework}</p>
          </div>
        </div>

        <p className="text-xs text-neutral-600">
          Delivered-projects track record pending the company profile document. Sponsor identity and structure sourced from the audited financial model.
        </p>
      </div>
    </div>
  );
}
