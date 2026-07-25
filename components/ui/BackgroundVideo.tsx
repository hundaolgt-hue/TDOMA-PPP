"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/scroll/useReducedMotion";

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * BackgroundVideo — a muted, looping video layer for a section backdrop, with a
 * scrim so foreground text keeps its contrast.
 *
 * Follows the two rules the UX database flags for background video: it must not
 * simply autoplay forever (playback is paused whenever the section is off
 * screen, via IntersectionObserver, so it costs nothing while you read the rest
 * of the page), and it must respect prefers-reduced-motion (then only the
 * poster still is shown, never moving footage).
 */
export default function BackgroundVideo({
  src,
  /** Optional VP9/WebM source, offered first — smaller, and covers builds
   *  shipped without the patent-encumbered H.264 decoder. */
  srcWebm,
  poster,
  /** 0→1 opacity of the footage under the scrim. */
  opacity = 0.5,
  /** Tint strength of the mint scrim that protects text contrast. */
  scrim = 0.72,
  label,
}: {
  src: string;
  srcWebm?: string;
  poster: string;
  opacity?: number;
  scrim?: number;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  // Play only while the section is actually on screen.
  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { rootMargin: "10% 0px", threshold: 0.01 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {reduced ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${BP}${poster}`} alt="" className="h-full w-full object-cover" style={{ opacity }} />
      ) : (
        <video
          ref={ref}
          className="h-full w-full object-cover"
          style={{ opacity }}
          poster={`${BP}${poster}`}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={label}
        >
          {srcWebm && <source src={`${BP}${srcWebm}`} type="video/webm" />}
          <source src={`${BP}${src}`} type="video/mp4" />
        </video>
      )}
      {/* Mint scrim — keeps the section's light-glass identity and text contrast */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(165deg,
            rgba(246,251,247,${scrim}) 0%,
            rgba(227,243,232,${Math.min(1, scrim + 0.06)}) 45%,
            rgba(207,233,217,${Math.min(1, scrim + 0.1)}) 100%)`,
        }}
      />
      {/* Soft vignette so the centre content sits on the calmest area */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 80% at 50% 45%, rgba(255,255,255,0.55), transparent 70%)" }}
      />
    </div>
  );
}
