"use client";

import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, seg, clamp01 } from "@/lib/scroll/ease";
import SequenceScrubber from "@/lib/sequence/SequenceScrubber";
import { heroSequence } from "@/lib/sequence/manifest";

/**
 * S1 — Hero. The scroll-scrubbed intro film (Intro_vid.mp4) carries its own
 * "Liiban smart mall" titling and resolves to the TDOMA logo on its final
 * frame — which the ScrollLogo layer then picks up and docks. A soft mint veil
 * rises at the end for a seamless hand-off into the company section.
 */
export default function Hero({ progress }: ChapterProps) {
  const scrubT = clamp01(seg(progress, 0.0, 0.9));
  const veil = win(progress, 0.8, 0.98);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <SequenceScrubber
        progress={scrubT}
        manifest={heroSequence}
        label="Liiban Smart Mall — introduction film resolving to the TDOMA logo."
        className="absolute inset-0 h-full w-full"
      />

      {/* Mint veil rising into the company section for a seamless transition */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: veil,
          background: "linear-gradient(180deg, rgba(246,251,247,0.0) 30%, rgba(227,243,232,0.9) 100%)",
        }}
      />

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-8 flex justify-center" style={{ opacity: 1 - win(progress, 0.03, 0.1) }}>
        <div className="glass px-5 py-2">
          <span className="font-tech-label text-xs text-[var(--green-deep)]">Scroll ↓</span>
        </div>
      </div>
    </div>
  );
}
