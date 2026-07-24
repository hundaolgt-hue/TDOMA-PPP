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
export default function ChapterShell({ id, heightVh, children, ariaLabel, surface }: ShellProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return; // reduced motion: render the curated final frame, no scroll binding
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setProgress(self.progress),
      // also fires on refresh/anchor-jump, so mid-page reload restores state
      onRefresh: (self) => setProgress(self.progress),
    });
    return () => st.kill();
  }, [reduced]);

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
