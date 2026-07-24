"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";

/**
 * S3 — Project rationale. Key problems of the Merkato region as a diagram:
 * problem cards converge on the project response. The formalisation driver is
 * prospectus-sourced; the other pressure points await the feasibility-study
 * citation and are labelled as such.
 */
const problems = [
  { k: "P1", title: "Informal trade", text: "Trading activity across Merkato remains largely informal — the founding driver of TDOMA.", src: "Prospectus — company objective" },
  { k: "P2", title: "Fragmented storage & logistics", text: "Goods handling is dispersed, with no consolidated bonded or dry storage close to the trading floor.", src: "Feasibility study — pending citation" },
  { k: "P3", title: "Congestion", text: "Street-level congestion constrains movement of goods, customers and vehicles through the district.", src: "Feasibility study — pending citation" },
  { k: "P4", title: "Scarce formal space", text: "Modern, lettable retail, wholesale and office space in the district falls far short of trader demand.", src: "Feasibility study — pending citation" },
];

export default function Rationale({ progress }: ChapterProps) {
  const arrowT = win(progress, 0.42, 0.56);
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 2xl:max-w-[1500px]">
        <p className="font-tech-label text-xs text-[var(--orange)]">02 · Why this project</p>
        <TextReveal progress={progress} start={0.04} end={0.16}>
          <h2 className="font-display mt-3 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-tight text-[var(--green-deep)]">
            Merkato works despite itself.
          </h2>
        </TextReveal>

        {/* Diagram: four problems converge on one response */}
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {problems.map((p, i) => {
            const t = win(progress, 0.14 + i * 0.07, 0.26 + i * 0.07);
            return (
              <div key={p.k} className="glass p-5" style={{ opacity: t, transform: `translateY(${lerp(16, 0, t)}px)` }}>
                <p className="font-tech-label text-xs text-[var(--orange)]">{p.k}</p>
                <p className="font-display mt-1 text-xl font-semibold text-[var(--green-deep)]">{p.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-[var(--dim)]">{p.text}</p>
                <p className="mt-3 text-xs uppercase tracking-wider text-[var(--dim)]/80">{p.src}</p>
              </div>
            );
          })}
        </div>

        {/* Converging connector */}
        <div className="my-4 flex justify-center" aria-hidden>
          <svg width="120" height="52" viewBox="0 0 120 52" className="overflow-visible">
            <path d="M10 4 L60 44 M50 4 L60 44 M70 4 L60 44 M110 4 L60 44" fill="none" stroke="var(--green)" strokeWidth="1.6"
              strokeDasharray="70" strokeDashoffset={70 - 70 * arrowT} opacity="0.7" />
            <circle cx="60" cy="47" r={4 * arrowT} fill="var(--orange)" />
          </svg>
        </div>

        <div className="glass-strong mx-auto max-w-3xl p-7 text-center" style={{ opacity: win(progress, 0.5, 0.64), transform: `scale(${lerp(0.96, 1, win(progress, 0.5, 0.64))})` }}>
          <p className="font-tech-label text-sm text-[var(--green)]">The response</p>
          <p className="font-display mt-2 text-2xl font-semibold leading-snug text-[var(--green-deep)] md:text-3xl">
            One vertical trading city: formal space, consolidated logistics, and digital rails — on 5,000 m² in the heart of the district.
          </p>
        </div>
      </div>
    </div>
  );
}
