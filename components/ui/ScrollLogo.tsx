"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clamp01 } from "@/lib/scroll/ease";
import { LOGO_REVEAL_START_VH, LOGO_REVEAL_END_VH } from "@/lib/sections";

gsap.registerPlugin(ScrollTrigger);

/**
 * Persistent TDOMA badge. The intro film reveals the full logo on its final
 * frame; this compact glass chip then fades in top-left and rides the rest of
 * the page in minimal space, out of the content's way.
 *
 * Swap the wordmark span for the client logo (/public/logo.svg) when supplied.
 */
export default function ScrollLogo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      return;
    }
    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.body.scrollHeight,
      onUpdate: () => {
        const y = window.scrollY / window.innerHeight;
        el.style.opacity = String(clamp01((y - LOGO_REVEAL_START_VH) / (LOGO_REVEAL_END_VH - LOGO_REVEAL_START_VH)));
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed right-4 top-4 z-50 md:right-6 md:top-6" style={{ opacity: 0, willChange: "opacity" }}>
      <div className="glass-strong px-3.5 py-1.5">
        <span className="font-display text-lg font-bold tracking-[0.22em] text-[var(--green-deep)] md:text-xl">
          TDOMA<span className="text-[var(--orange)]">.</span>
        </span>
      </div>
    </div>
  );
}
