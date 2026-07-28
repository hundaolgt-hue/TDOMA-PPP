"use client";

import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/** Programmatic scroll that respects the smoothing pipeline (chapter nav). */
export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { duration: 1.1 });
  } else {
    el.scrollIntoView();
  }
}

/**
 * Single timeline authority: ScrollTrigger owns all scroll-linked state,
 * Lenis provides smoothing, driven by the GSAP ticker so there is exactly
 * one rAF loop. No other scroll library, no IntersectionObserver animation.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // lerp/wheelMultiplier tuned per award-web-experience skill; smoothing
    // stays off on touch — native momentum beats any emulation.
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.9,
      smoothWheel: !reduced,
      syncTouch: false,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // content-visibility: auto (ChapterShell) lets off-screen chapters skip
    // layout entirely, which is what fixed the scroll jank — but it also
    // means chapters below the fold sit at their contain-intrinsic-size
    // placeholder height until first painted. As each one resolves to its
    // real height while the user scrolls, every later chapter's document
    // position shifts, and ScrollTrigger's cached start/end pixel values
    // (computed once at refresh) go stale — so reveals drift out of sync
    // with the chapter's true on-screen position ("late" animations).
    // contentvisibilityautostatechange fires on exactly those transitions,
    // bubbles, and is spec-guaranteed — refresh (debounced, since many
    // chapters can flip in one scroll frame) keeps trigger math honest.
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const onVisibilityStateChange = () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    document.addEventListener("contentvisibilityautostatechange", onVisibilityStateChange, true);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
      document.removeEventListener("contentvisibilityautostatechange", onVisibilityStateChange, true);
      if (refreshTimer) clearTimeout(refreshTimer);
    };
  }, []);

  return <>{children}</>;
}
