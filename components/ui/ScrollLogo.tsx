"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clamp01 } from "@/lib/scroll/ease";
import {
  LOGO_REVEAL_START_VH,
  LOGO_REVEAL_END_VH,
  LOGO_DOCK_START_VH,
  LOGO_DOCK_END_VH,
} from "@/lib/sections";

gsap.registerPlugin(ScrollTrigger);

/**
 * The TDOMA logo that follows the whole page. Hidden during the hero scrub,
 * it fades in centered over the hero's final frames, then docks to the
 * top-left as a compact glass badge and stays to the end of the page —
 * minimal footprint, riding the negative space.
 *
 * Placeholder wordmark: swap the inner span for the client logo
 * (/public/logo.svg) when supplied — reveal/dock behaviour is unchanged.
 */
export default function ScrollLogo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Static: docked badge from the start.
      el.style.setProperty("--reveal", "1");
      el.style.setProperty("--dock", "1");
      return;
    }
    // The intro film already reveals the logo on its final frame; this badge
    // simply fades in already-docked (top-left) as the hero hands off, then
    // rides the rest of the page in minimal space.
    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.body.scrollHeight,
      onUpdate: () => {
        const y = window.scrollY / window.innerHeight;
        const reveal = clamp01((y - LOGO_REVEAL_START_VH) / (LOGO_REVEAL_END_VH - LOGO_REVEAL_START_VH));
        el.style.setProperty("--reveal", String(reveal));
        el.style.setProperty("--dock", "1");
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center"
      style={
        {
          "--reveal": 0,
          "--dock": 0,
          opacity: "var(--reveal)",
          transform:
            "translate(calc(var(--dock) * (-50vw + 110px)), calc(var(--dock) * (-50vh + 46px))) scale(calc(1 - var(--dock) * 0.7))",
          transformOrigin: "center",
          willChange: "transform, opacity",
        } as React.CSSProperties
      }
    >
      <div className="glass-strong px-10 py-5">
        <span className="font-display text-5xl font-bold tracking-[0.3em] text-[var(--green-deep)] md:text-6xl">
          TDOMA<span className="text-[var(--orange)]">.</span>
        </span>
      </div>
    </div>
  );
}
