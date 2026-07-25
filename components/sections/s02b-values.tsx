"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import { coreValues, milestones } from "@/data/company";

/**
 * S2b — Values & track record. The four Gadaa governance principles that guide
 * TDOMA's operations and strategic decisions (§2.3.3), followed by the
 * corporate-milestone timeline. Split from S2 so each screen reads whole.
 */
export default function Values({ progress }: ChapterProps) {
  return (
    <div className="flex h-full flex-col justify-center px-6 py-[6vh] md:px-10">
      <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1600px]">
        <div className="holo p-8 md:p-10 2xl:p-14">
          <p className="label text-[var(--orange-text)]">01 · The company · values &amp; track record</p>
          <TextReveal progress={progress} start={0.03} end={0.14}>
            <h2 className="font-display mt-2 text-[clamp(1.9rem,3.8vw,3.8rem)] font-bold leading-tight text-[var(--green-deep)]">
              Governed by Gadaa principles.
            </h2>
          </TextReveal>
          <TextReveal progress={progress} start={0.07} end={0.18}>
            <p className="mt-2 max-w-3xl text-base text-[var(--dim)] 2xl:text-lg">
              The operations and strategic decisions of TDOMA S.C. are guided by four foundational
              principles of Gadaa governance.
            </p>
          </TextReveal>

          {/* Core values — the Gadaa governance principles */}
          <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((v, i) => {
              const t = win(progress, 0.14 + i * 0.05, 0.3 + i * 0.05);
              return (
                <li key={v.term} className="glass p-5 2xl:p-6" style={{ opacity: t, transform: `translateY(${lerp(16, 0, t)}px)` }}>
                  <p className="font-display text-xl font-bold leading-tight text-[var(--green-deep)] 2xl:text-2xl">{v.term}</p>
                  <p className="label mt-0.5 text-[var(--orange-text)]">{v.gloss}</p>
                  <p className="mt-2.5 text-base leading-relaxed text-[var(--dim)]">{v.body}</p>
                </li>
              );
            })}
          </ul>

          {/* Track record */}
          <p className="label mt-7 text-[var(--green)]">Track record</p>
          <ol className="mt-3 grid gap-4 md:grid-cols-4">
            {milestones.map((m, i) => {
              const t = win(progress, 0.4 + i * 0.05, 0.56 + i * 0.05);
              return (
                <li key={m.date} className="glass p-5" style={{ opacity: t, transform: `translateY(${lerp(14, 0, t)}px)` }}>
                  <p className="label text-[var(--orange-text)]">{m.date}</p>
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
