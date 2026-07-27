"use client";

import { useState } from "react";
import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01 } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import GanttChart from "@/components/ui/GanttChart";
import { sections, programmeStats, programmeNotes, bandFor, type Activity } from "@/data/programme";

/**
 * S7b — The 3-year CPM programme as an interactive Gantt. Bars draw on scroll;
 * hovering any activity surfaces its detail panel and dims the rest. Critical
 * path is outlined, not merely coloured, and float is drawn as the pale
 * extension past each bar.
 */
export default function Programme({ progress }: ChapterProps) {
  const [hot, setHot] = useState<Activity | null>(null);
  const draw = clamp01(seg(progress, 0.12, 0.72));

  const stats = [
    { label: "Activities modelled", v: programmeStats.activities.value, suf: "" },
    { label: "Total programme", v: programmeStats.totalWeeks.value, suf: " wks" },
    { label: "On critical path", v: programmeStats.criticalActivities.value, suf: "" },
    { label: "Schedule contingency", v: programmeStats.contingencyWeeks.value, suf: " wks" },
  ];

  const band = hot ? bandFor(hot.floatWk, hot.critical) : null;

  return (
    <div className="grid-bg flex h-full flex-col justify-center px-6 py-[6vh] md:px-10 2xl:px-16">
      <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1720px]">
        <p className="label text-[var(--orange-text)]">07 · Construction programme · 3-year CPM</p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <TextReveal progress={progress} start={0.02} end={0.12}>
            <h2 className="font-display text-[clamp(1.9rem,3.6vw,3.6rem)] font-bold leading-tight text-[var(--green-deep)]">
              Three years, sequenced to the last week.
            </h2>
          </TextReveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[42rem]">
            {stats.map((s, i) => (
              <div key={s.label} className="glass lift p-3 text-center" style={{ opacity: win(progress, 0.04 + i * 0.03, 0.18 + i * 0.03) }}>
                <p className="font-display text-xl font-bold leading-none text-[var(--green-deep)] 2xl:text-2xl">
                  <Counter progress={progress} start={0.06} end={0.3} value={s.v} suffix={s.suf} />
                </p>
                <p className="label mt-1 text-[var(--green)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[2.1fr_1fr]">
          {/* Gantt */}
          <div className="holo p-5 2xl:p-6" style={{ opacity: win(progress, 0.08, 0.2) }}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="label text-[var(--green)]">Gantt · 37 activities</p>
              <div className="flex items-center gap-3 text-[0.68rem] text-[var(--dim)]">
                <span className="flex items-center gap-1"><span className="h-2.5 w-4 rounded-sm bg-[#5a7fa8]" />Duration</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-4 rounded-sm bg-[#5a7fa8]/25" />Float</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-4 rounded-sm border-[1.5px] border-[var(--orange)]" />Critical path</span>
              </div>
            </div>
            <div className="mt-3 pl-7">
              <GanttChart reveal={draw} active={hot?.code ?? null} onActive={setHot} />
            </div>
            {/* section legend */}
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-[var(--green)]/15 pt-2.5">
              {sections.map((s, i) => (
                <span key={s.id} className="flex items-center gap-1.5 text-[0.66rem] text-[var(--dim)]" style={{ opacity: win(progress, 0.5 + i * 0.015, 0.62 + i * 0.015) }}>
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
                  <span className="font-semibold text-[var(--ink)]">{s.id}</span> {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Detail panel — follows the hovered activity */}
          <div className="flex flex-col gap-4">
            <div className="holo hud min-h-[168px] p-5" style={{ opacity: win(progress, 0.12, 0.26) }}>
              {hot ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display rounded px-1.5 text-sm font-bold text-white" style={{ background: sections.find((s) => s.id === hot.section)?.color }}>
                      {hot.code}
                    </span>
                    <span className="label text-[var(--green)]">{hot.section} · {sections.find((s) => s.id === hot.section)?.label}</span>
                  </div>
                  <p className="font-display mt-2 text-xl font-bold leading-tight text-[var(--green-deep)]">{hot.name}</p>
                  <dl className="mt-3 grid grid-cols-3 gap-2">
                    <div><dt className="label text-[var(--green)]">Duration</dt><dd className="font-display text-lg font-bold tabular-nums text-[var(--green-deep)]">{hot.durWk} wks</dd></div>
                    <div><dt className="label text-[var(--green)]">Start</dt><dd className="font-display text-lg font-bold tabular-nums text-[var(--green-deep)]">wk {hot.startWk}</dd></div>
                    <div><dt className="label text-[var(--green)]">Float</dt><dd className="font-display text-lg font-bold tabular-nums" style={{ color: band?.color }}>{hot.critical ? "0" : hot.floatWk} wks</dd></div>
                  </dl>
                  <p className="mt-2.5 flex items-center gap-1.5 text-sm text-[var(--dim)]">
                    <span className="h-2 w-2 rounded-full" style={{ background: band?.color }} />
                    <span className="font-semibold" style={{ color: band?.color }}>{band?.label}</span> — {band?.read}
                  </p>
                </>
              ) : (
                <>
                  <p className="label text-[var(--green)]">Activity detail</p>
                  <p className="mt-2 text-base leading-relaxed text-[var(--dim)]">
                    Hover any bar to read its section, duration, earliest start and float.
                  </p>
                  <p className="mt-3 border-t border-[var(--green)]/15 pt-2.5 text-sm leading-relaxed text-[var(--dim)]">
                    {programmeNotes.drivers}
                  </p>
                </>
              )}
            </div>

            <div className="holo p-5" style={{ opacity: win(progress, 0.4, 0.56) }}>
              <p className="label text-[var(--green)]">Honest disclosure</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--dim)]">{programmeNotes.disclosure}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--green)]/12">
                  <div className="flex h-full">
                    <div style={{ width: `${(programmeStats.technicalWeeks.value / programmeStats.totalWeeks.value) * 100}%`, background: "linear-gradient(90deg,var(--green-deep),var(--green))" }} />
                    <div style={{ width: `${(programmeStats.contingencyWeeks.value / programmeStats.totalWeeks.value) * 100}%`, background: "var(--orange)" }} />
                  </div>
                </div>
              </div>
              <div className="mt-1.5 flex justify-between text-[0.68rem] text-[var(--dim)]">
                <span>{programmeStats.technicalWeeks.value} wks technical</span>
                <span className="font-semibold text-[var(--orange-text)]">+{programmeStats.contingencyWeeks.value} wks contingency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
