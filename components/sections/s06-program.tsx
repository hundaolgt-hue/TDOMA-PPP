"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { seg, clamp01, win, lerp } from "@/lib/scroll/ease";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { programSequence } from "@/lib/sequence/manifest";
import { zones, totalNetGla } from "@/data/program";
import { programDetails } from "@/data/programDetails";

// Ground-to-top order, matching the film's upward reveal.
const order = ["retail", "arrival", "culture", "wholesale", "events", "civic", "trade", "office", "enterprise", "business", "hospitality", "hq", "rooftop"];
const ordered = order.map((id) => zones.find((z) => z.id === id)!).filter(Boolean);

/**
 * S6 — Programme separation film with live per-programme data. The film lights
 * each programme in colour ground-to-top; the right panel reads out the active
 * cluster's levels, rent, area and role as it appears, and the left rail
 * tracks all thirteen. Both driven by scroll progress.
 */
export default function Program({ progress }: ChapterProps) {
  const scrubT = clamp01(seg(progress, 0.0, 0.8));
  const stepT = clamp01(seg(progress, 0.08, 0.86));
  const active = Math.min(ordered.length - 1, Math.floor(stepT * ordered.length));
  const zone = ordered[active];
  const d = programDetails[zone.id];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <SequenceScrubber
        progress={scrubT}
        manifest={programSequence}
        label="Liiban Smart Mall programme separation — programmes lit ground to top."
        className="absolute inset-0 h-full w-full"
      />

      {/* Top title */}
      <div className="absolute inset-x-0 top-0 flex justify-center p-6 md:p-8">
        <div className="glass px-8 py-4 text-center">
          <p className="label text-[var(--orange)]">05 · Programme</p>
          <h2 className="font-display text-3xl font-bold text-[var(--green-deep)] md:text-4xl">Program, ground to sky.</h2>
          <p className="mt-1 text-base text-[var(--dim)]">
            {zones.length} clusters · {totalNetGla.value.toLocaleString()} m² net GLA
          </p>
        </div>
      </div>

      {/* LEFT — all clusters, active highlighted */}
      <div className="absolute left-0 top-1/2 hidden w-[20rem] -translate-y-1/2 p-6 xl:block">
        <div className="holo p-6">
          <span className="label text-[var(--green)]">Stack · ground → top</span>
          <ul className="mt-3 flex flex-col gap-1.5">
            {ordered.map((z, i) => (
              <li key={z.id} className="flex items-center gap-2.5 text-base transition-opacity" style={{ opacity: i <= active ? 1 : 0.4 }}>
                <span className="h-3 w-3 shrink-0 rounded-[3px]" style={{ background: z.color, boxShadow: i === active ? `0 0 12px ${z.color}` : "none" }} />
                <span className="flex-1" style={{ color: i === active ? "var(--green-deep)" : "var(--dim)", fontWeight: i === active ? 700 : 400 }}>{z.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT — active cluster detail card */}
      <div className="absolute right-0 top-1/2 hidden w-[26rem] -translate-y-1/2 p-6 lg:block 2xl:w-[30rem]">
        <div key={zone.id} className="holo hud p-7" style={{ opacity: win(progress, 0.08, 0.16), transform: `translateY(${lerp(10, 0, win(progress, 0.08, 0.16))}px)` }}>
          <div className="flex items-center gap-2.5">
            <span className="h-4 w-4 rounded-[4px]" style={{ background: zone.color, boxShadow: `0 0 14px ${zone.color}` }} />
            <span className="label text-[var(--green)]">{d.levels}</span>
          </div>
          <h3 className="font-display mt-2 text-3xl font-bold text-[var(--green-deep)]">{zone.label}</h3>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="glass p-4">
              <p className="text-sm text-[var(--dim)]">Net GLA</p>
              <p className="font-display text-xl font-semibold tabular-nums text-[var(--green-deep)]">{zone.areaSqm.value.toLocaleString()}</p>
              <p className="text-xs text-[var(--dim)]">m²</p>
            </div>
            <div className="glass p-4">
              <p className="text-sm text-[var(--dim)]">Share</p>
              <p className="font-display text-xl font-semibold tabular-nums text-[var(--green-deep)]">{zone.sharePct.value}%</p>
            </div>
            <div className="glass p-4">
              <p className="text-sm text-[var(--dim)]">Rent</p>
              <p className="font-display text-xl font-semibold tabular-nums text-[var(--green-deep)]">{d.rent}</p>
              <p className="text-xs text-[var(--dim)]">{/^\d/.test(d.rent) ? "ETB/m²/mo" : ""}</p>
            </div>
          </div>
          <p className="mt-4 text-base leading-relaxed text-[var(--ink)]">{d.blurb}</p>
        </div>
      </div>
    </div>
  );
}
