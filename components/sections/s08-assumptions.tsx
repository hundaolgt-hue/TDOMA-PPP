"use client";

import { useState } from "react";
import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import Counter from "@/components/ui/Counter";
import { assumptionGroups, assumptionsHeadline, assumptionsFootnote, type AssumptionItem } from "@/data/assumptions";

/** One bold, dashboard-style number tile. Animates on scroll if `fmt` is set
 *  (a single countable value); otherwise renders the static range/text. */
function NumberTile({ item, progress, start, big }: { item: AssumptionItem; progress: number; start: number; big?: boolean }) {
  const t = win(progress, start, start + 0.16);
  const isPct = item.fmt?.suffix === "%";
  const barPct = isPct ? Math.min(100, item.value.value * 100) : null;
  return (
    <div className="holo lift hud flex flex-col p-4 2xl:p-5" style={{ opacity: win(progress, start, start + 0.14), transform: `translateY(${lerp(12, 0, win(progress, start, start + 0.14))}px)` }}>
      <p className="label text-[var(--green)]">{item.label}</p>
      <p className={`font-display mt-1 font-bold tabular-nums text-[var(--green-deep)] ${big ? "text-3xl 2xl:text-4xl" : "text-2xl 2xl:text-3xl"}`}>
        {item.fmt ? (
          <Counter progress={progress} start={start} end={start + 0.16} value={item.value.value * (item.fmt.mult ?? 1)} decimals={item.fmt.decimals ?? 0} prefix={item.fmt.prefix} suffix={item.fmt.suffix} grouping={item.fmt.grouping ?? true} />
        ) : (
          item.display
        )}
      </p>
      {barPct !== null && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--green)]/10">
          <div className="h-full rounded-full" style={{ width: `${barPct * t}%`, background: "linear-gradient(90deg,var(--green-deep),var(--green))" }} />
        </div>
      )}
    </div>
  );
}

/**
 * S8 — Financial basis, as an interactive dashboard. A headline stat strip of
 * the most decision-relevant assumptions stays visible while group tabs
 * switch which register of inputs fills the tile grid below; every figure is
 * a bold, scroll-animated number traced to the model's Assumptions sheet.
 */
export default function Assumptions({ progress }: ChapterProps) {
  const [active, setActive] = useState(0);
  const group = assumptionGroups[active];

  return (
    <div className="grid-bg flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1600px]">
        <div className="flex items-center gap-3">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-[var(--orange)]" />
          <p className="label text-[var(--orange-text)]">08 · Financial basis · live model</p>
        </div>
        <TextReveal progress={progress} start={0.02} end={0.13}>
          <h2 className="font-display mt-2 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            Every number, from an input.
          </h2>
        </TextReveal>

        {/* Headline strip — always visible */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {assumptionsHeadline.map((it, i) => (
            <NumberTile key={it.label} item={it} progress={progress} start={0.08 + i * 0.025} big />
          ))}
        </div>

        {/* Group tabs */}
        <div className="mt-6 flex flex-wrap gap-2" style={{ opacity: win(progress, 0.3, 0.42) }} role="tablist" aria-label="Assumption group">
          {assumptionGroups.map((g, i) => (
            <button
              key={g.title}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className="rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green)]"
              style={{
                background: active === i ? "var(--green-deep)" : "var(--glass)",
                color: active === i ? "white" : "var(--dim)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <span className="mr-1.5 opacity-70">{g.icon}</span>
              {g.title}
            </button>
          ))}
        </div>

        {/* Active group — bold number tiles */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {group.items.map((it, i) => (
            <NumberTile key={`${group.title}-${it.label}`} item={it} progress={progress} start={0.34 + i * 0.02} />
          ))}
        </div>

        <p className="mt-4 text-xs text-[var(--dim)]">{assumptionsFootnote}</p>
      </div>
    </div>
  );
}
