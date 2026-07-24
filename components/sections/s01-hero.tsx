"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01 } from "@/lib/scroll/ease";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { ch2Sequence } from "@/lib/sequence/manifest";

/**
 * S1 — Hero. Scroll-scrubbed intro film of the building; the TDOMA logo
 * (ScrollLogo, fixed layer) reveals over the final frames and docks.
 * PLACEHOLDER FOOTAGE: orbit render stands in until the 1080p intro video
 * arrives — swap the manifest, nothing else changes.
 */
export default function Hero({ progress }: ChapterProps) {
  const scrubT = clamp01(seg(progress, 0.02, 0.82));
  const titleFade = 1 - win(progress, 0.5, 0.66); // titles hand off to the logo reveal
  const veil = win(progress, 0.72, 0.95); // soft light veil under the logo reveal

  return (
    <div className="relative h-full w-full overflow-hidden">
      <SequenceScrubber
        progress={scrubT}
        manifest={ch2Sequence}
        label="Liiban Smart Mall — introduction film of the tower."
        className="absolute inset-0 h-full w-full"
      />

      {/* Opening titles */}
      <div
        className="absolute inset-x-0 top-0 flex flex-col items-center gap-4 pt-[9vh] text-center"
        style={{ opacity: titleFade }}
      >
        <div className="glass px-7 py-2">
          <p className="font-tech-label text-[11px] text-[var(--green-deep)] md:text-xs">
            TDOMA S.C. · Development proposal · Merkato, Addis Ababa
          </p>
        </div>
        <h1
          className="font-display text-[clamp(3rem,7vw,7.5rem)] font-bold leading-none text-white"
          style={{ textShadow: "0 4px 30px rgba(0,0,0,0.55)" }}
        >
          Liiban Smart Mall
        </h1>
        <p
          className="max-w-xl px-6 text-sm text-white/90 md:text-base"
          style={{ textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}
        >
          A G+15 vertical trading city. Scroll to walk through it.
        </p>
      </div>

      {/* Light veil rising under the logo reveal for a seamless hand-off */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: veil,
          background: "linear-gradient(180deg, rgba(246,251,247,0.55), rgba(227,243,232,0.85))",
        }}
      />

      {/* Scroll cue */}
      <div
        className="absolute inset-x-0 bottom-8 flex justify-center"
        style={{ opacity: 1 - win(progress, 0.04, 0.12) }}
      >
        <div className="glass px-5 py-2">
          <span className="font-tech-label text-[10px] text-[var(--green-deep)]">Scroll ↓</span>
        </div>
      </div>
    </div>
  );
}
