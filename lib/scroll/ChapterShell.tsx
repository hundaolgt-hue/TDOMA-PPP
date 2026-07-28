"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export type ChapterProps = { progress: number };

type ShellProps = {
  id: string;
  /** Scroll runway in vh. Pinned feel: 200–400vh, never more. */
  heightVh: number;
  /** Pure render function of normalized progress 0→1. */
  children: (progress: number) => ReactNode;
  ariaLabel: string;
  /** Paint the shared fixed gradient so pinned DOM sections stay opaque and
   *  seamless during hand-off. Omit for full-bleed video sections. */
  surface?: boolean;
  /** Pin the visual and scrub in place (video/scrub sections). Set false for
   *  dense content that should flow naturally and stay fully readable —
   *  progress then tracks the section scrolling through the viewport. */
  pin?: boolean;
};

/**
 * Pins the chapter viewport (CSS sticky — no pin-spacer layout shift, survives
 * resize and mid-page refresh for free) while ScrollTrigger computes the
 * chapter's normalized progress from the section's scroll runway.
 *
 * Chapters receive progress only. They may not read window.scrollY, hold
 * animation state, or run their own timers — that keeps them scrubbable
 * backwards and renderable at any arbitrary position.
 */
export default function ChapterShell({ id, heightVh, children, ariaLabel, surface, pin = true }: ShellProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // reduced motion: render the final state, no scroll binding
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      // Pinned: progress across the section's runway. Non-pinned: progress
      // begins only once the section is meaningfully in view (its top has
      // risen to 55% of the viewport) and completes as it centres — so
      // reveals never fire while the section is still off-screen below.
      start: pin ? "top top" : "top 55%",
      end: pin ? "bottom bottom" : "center 35%",
      onUpdate: (self) => setProgress(self.progress),
      onRefresh: (self) => setProgress(self.progress),
    });
    return () => st.kill();
  }, [reduced, pin]);

  if (!pin) {
    // Natural-height content section — no clipping, fully readable.
    // content-visibility: auto skips layout/style/paint entirely while the
    // section is off-screen, which matters a lot here: each dashboard section
    // carries dozens of backdrop-filter (glass) panels, and with ~20 sections
    // always mounted on a single very tall page, the un-skipped compositing
    // cost of all of them at once is the main source of scroll jank. This is
    // CSS-only and doesn't affect ScrollTrigger, which only reads the outer
    // <section>'s own box — never the paint state of its children.
    // contain-intrinsic-size gives the browser a placeholder size so the
    // section doesn't collapse to 0 height (and desync ScrollTrigger's
    // trigger-position math) before it has been painted once.
    return (
      <section
        ref={sectionRef}
        id={id}
        aria-label={ariaLabel}
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 900px" } as React.CSSProperties}
        className={`relative flex min-h-screen flex-col justify-center py-[7vh] ${surface ? "section-bg" : ""}`}
      >
        {children(reduced ? 1 : progress)}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={ariaLabel}
      style={{ height: reduced ? "auto" : `${heightVh}vh` }}
      className="relative"
    >
      <div className={`sticky top-0 h-screen overflow-hidden ${surface ? "section-bg" : ""}`}>
        {children(reduced ? 1 : progress)}
      </div>
    </section>
  );
}
