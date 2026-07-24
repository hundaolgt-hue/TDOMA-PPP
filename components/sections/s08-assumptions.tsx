"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import { assumptionGroups, assumptionsFootnote } from "@/data/assumptions";

/**
 * S8 — Financial assumptions register. Four glass groups; every input from the
 * model's Assumptions sheet.
 */
export default function Assumptions({ progress }: ChapterProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1500px]">
        <p className="font-tech-label text-xs text-[var(--orange)]">07 · Basis</p>
        <TextReveal progress={progress} start={0.04} end={0.16}>
          <h2 className="font-display mt-3 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            Every number, from an input.
          </h2>
        </TextReveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {assumptionGroups.map((group, gi) => {
            const t = win(progress, 0.12 + gi * 0.08, 0.26 + gi * 0.08);
            return (
              <div key={group.title} className="glass-strong p-6 2xl:p-8" style={{ opacity: t, transform: `translateY(${lerp(16, 0, t)}px)` }}>
                <p className="font-tech-label text-sm text-[var(--green)]">{group.title}</p>
                <dl className="mt-3 divide-y divide-[var(--green)]/10">
                  {group.items.map((it) => (
                    <div key={it.label} className="flex items-baseline justify-between gap-4 py-2">
                      <dt className="text-sm text-[var(--ink)]">{it.label}</dt>
                      <dd className="font-display shrink-0 text-lg font-semibold tabular-nums text-[var(--green-deep)]">{it.display}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
        <p className="mt-5 text-xs text-[var(--dim)]">{assumptionsFootnote}</p>
      </div>
    </div>
  );
}
