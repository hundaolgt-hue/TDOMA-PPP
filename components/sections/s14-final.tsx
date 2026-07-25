"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01 } from "@/lib/scroll/ease";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { navSequence } from "@/lib/sequence/manifest";

/**
 * S14 — Final navigation film & close. An aerial fly-around of the finished
 * tower in its Merkato context (nav_video.mp4), resolving to the TDOMA
 * sign-off over a glass panel.
 */
export default function Final({ progress }: ChapterProps) {
  const scrubT = clamp01(seg(progress, 0.02, 0.72));
  const closeIn = win(progress, 0.58, 0.78);
  return (
    <div className="relative h-full w-full overflow-hidden">
      <SequenceScrubber
        progress={scrubT}
        manifest={navSequence}
        label="Liiban Smart Mall — closing navigation film."
        className="absolute inset-0 h-full w-full"
      />
      <div className="pointer-events-none absolute inset-0" style={{ opacity: closeIn, background: "linear-gradient(180deg, rgba(246,251,247,0.2), rgba(227,243,232,0.72))" }} />

      <div className="absolute inset-0 flex items-center justify-center p-6" style={{ opacity: closeIn }}>
        <div className="glass-strong grain relative max-w-2xl overflow-hidden p-10 text-center 2xl:p-14">
          <p className="font-tech-label text-sm text-[var(--orange-text)]">Liiban Smart Mall</p>
          <p className="font-display mt-3 text-4xl font-bold leading-tight text-[var(--green-deep)] md:text-5xl">
            A vertical trading city for Merkato.
          </p>
          <p className="mt-4 text-sm text-[var(--dim)] md:text-base">
            TDOMA S.C. · 70/30 PPP with the City Government of Addis Ababa · full IFRS
          </p>
          <div className="mt-6 inline-block">
            <span className="font-display text-3xl font-bold tracking-[0.3em] text-[var(--green-deep)]">
              TDOMA<span className="text-[var(--orange-text)]">.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
