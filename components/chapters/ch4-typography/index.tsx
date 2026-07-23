"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { zones } from "@/data/program";
import { constructionPhases } from "@/data/phases";
import { statementA, statementB, statRow, statementC } from "./timeline";

/**
 * Chapter 4 — Typographic choreography.
 * Line-level mask reveals and counters, all on chapter progress — never on
 * independent timers. Readable in a static screenshot at any position.
 */
export default function Typography({ progress }: ChapterProps) {
  const totalArea = zones.reduce((sum, z) => sum + z.areaSqm.value, 0);
  const totalMonths = constructionPhases.reduce((sum, p) => sum + p.months.value, 0);
  const statT = win(progress, statRow.start, statRow.end);

  return (
    <div className="flex h-full items-center justify-center bg-[#0a0c10] text-neutral-100">
      <div className="flex w-full max-w-4xl flex-col gap-14 px-6">
        <div>
          <TextReveal progress={progress} start={statementA[0].start} end={statementA[0].end}>
            <p className="font-display text-5xl leading-tight md:text-7xl">Not a mall</p>
          </TextReveal>
          <TextReveal progress={progress} start={statementA[1].start} end={statementA[1].end}>
            <p className="font-display text-5xl leading-tight text-neutral-400 md:text-7xl">with sensors bolted on.</p>
          </TextReveal>
        </div>

        <div>
          <TextReveal progress={progress} start={statementB[0].start} end={statementB[0].end}>
            <p className="font-display text-5xl leading-tight md:text-7xl">A building that runs</p>
          </TextReveal>
          <TextReveal progress={progress} start={statementB[1].start} end={statementB[1].end}>
            <p className="font-display text-5xl leading-tight text-neutral-400 md:text-7xl">on its own nervous system.</p>
          </TextReveal>
        </div>

        <dl className="grid grid-cols-3 gap-6 border-t border-neutral-800 pt-8" style={{ opacity: statT > 0 ? 1 : 0 }}>
          <div>
            <dt className="text-xs uppercase tracking-widest text-neutral-500">Gross area</dt>
            <dd className="font-display text-3xl md:text-4xl">
              <Counter progress={progress} start={statRow.start} end={statRow.end} value={totalArea} suffix=" m²" />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-neutral-500">Programme zones</dt>
            <dd className="font-display text-3xl md:text-4xl">
              <Counter progress={progress} start={statRow.start} end={statRow.end} value={zones.length} />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-neutral-500">Build duration</dt>
            <dd className="font-display text-3xl md:text-4xl">
              <Counter progress={progress} start={statRow.start} end={statRow.end} value={totalMonths} suffix=" mo" />
            </dd>
          </div>
        </dl>

        <TextReveal progress={progress} start={statementC.start} end={statementC.end}>
          <p className="text-lg text-neutral-300">Figures are placeholders until source documents are supplied.</p>
        </TextReveal>
      </div>
    </div>
  );
}
