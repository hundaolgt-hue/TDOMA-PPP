"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01 } from "@/lib/scroll/ease";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { ch2Sequence } from "@/lib/sequence/manifest";

/**
 * S14 — Final film & close. A last orbit of the finished tower, resolving to
 * the TDOMA sign-off over a glass panel.
 * PLACEHOLDER FOOTAGE: orbit render until the 1080p closing video arrives.
 */
export default function Final({ progress }: ChapterProps) {
  const scrubT = clamp01(seg(progress, 0.02, 0.72));
  const closeIn = win(progress, 0.58, 0.78);
  return (
    <div className="relative h-full w-full overflow-hidden">
      <SequenceScrubber
        progress={scrubT}
        manifest={ch2Sequence}
        label="Liiban Smart Mall — closing film."
        className="absolute inset-0 h-full w-full"
      />
      <div className="pointer-events-none absolute inset-0" style={{ opacity: closeIn, background: "linear-gradient(180deg, rgba(246,251,247,0.2), rgba(227,243,232,0.72))" }} />

      <div className="absolute inset-0 flex items-center justify-center p-6" style={{ opacity: closeIn }}>
        <div className="glass-strong max-w-2xl p-10 text-center 2xl:p-14">
          <p className="font-tech-label text-[11px] text-[var(--orange)]">Liiban Smart Mall</p>
          <p className="font-display mt-3 text-4xl font-bold leading-tight text-[var(--green-deep)] md:text-5xl">
            A vertical trading city for Merkato.
          </p>
          <p className="mt-4 text-sm text-[var(--dim)] md:text-base">
            TDOMA S.C. · 70/30 PPP with the City Government of Addis Ababa · full IFRS
          </p>
          <div className="mt-6 inline-block">
            <span className="font-display text-3xl font-bold tracking-[0.3em] text-[var(--green-deep)]">
              TDOMA<span className="text-[var(--orange)]">.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
