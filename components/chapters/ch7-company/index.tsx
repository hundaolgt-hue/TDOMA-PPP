"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { companyStats, deliveredProjects } from "@/data/company";
import { title, stats, projectCard } from "./timeline";

/**
 * Chapter 7 — Company profile. Deliberately restrained: gentle fades, no
 * spectacle. This chapter should feel like the room going quiet.
 */
export default function Company({ progress }: ChapterProps) {
  return (
    <div className="flex h-full items-center justify-center bg-[#0c0e12] text-neutral-100">
      <div className="flex w-full max-w-4xl flex-col gap-12 px-6">
        <TextReveal progress={progress} start={title.start} end={title.end}>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">Built by people who deliver.</h2>
        </TextReveal>

        <dl className="grid grid-cols-3 gap-6">
          <div>
            <dt className="text-xs uppercase tracking-widest text-neutral-500">Years active</dt>
            <dd className="font-display text-3xl md:text-4xl">
              <Counter progress={progress} start={stats.start} end={stats.end} value={companyStats.yearsActive.value} />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-neutral-500">Projects delivered</dt>
            <dd className="font-display text-3xl md:text-4xl">
              <Counter progress={progress} start={stats.start} end={stats.end} value={companyStats.projectsDelivered.value} />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-neutral-500">Delivered value</dt>
            <dd className="font-display text-3xl md:text-4xl">
              <Counter progress={progress} start={stats.start} end={stats.end} value={companyStats.totalDeliveredValueM.value} prefix="$" suffix="M" />
            </dd>
          </div>
        </dl>

        <ul className="grid gap-6 md:grid-cols-3">
          {deliveredProjects.map((project, i) => {
            const w = projectCard(i);
            const t = win(progress, w.start, w.end);
            return (
              <li
                key={project.name}
                className="rounded-sm border border-neutral-800 p-5"
                style={{ opacity: t, transform: `translateY(${lerp(12, 0, t)}px)` }}
              >
                <p className="text-sm font-medium">{project.name}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {project.year.value} · ${project.valueM.value}M
                </p>
                <p className="mt-3 text-xs leading-relaxed text-neutral-400">{project.description}</p>
              </li>
            );
          })}
        </ul>

        <p className="text-xs text-neutral-600">Profile entries are placeholders pending the company profile document.</p>
      </div>
    </div>
  );
}
