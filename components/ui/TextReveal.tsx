"use client";

import type { ReactNode } from "react";
import { win, lerp } from "@/lib/scroll/ease";
import { useReducedMotion } from "@/lib/scroll/useReducedMotion";

type Props = {
  progress: number;
  /** Sub-window of chapter progress in which the reveal plays. */
  start: number;
  end: number;
  children: ReactNode;
  className?: string;
  /** Per-line stagger is expressed by giving each line its own window. */
};

/**
 * Mask-reveal from below — the house text move. Line-level only; body copy
 * is never animated letter-by-letter. Reduced motion degrades to an
 * instant opacity fade.
 */
export default function TextReveal({ progress, start, end, children, className = "" }: Props) {
  const reduced = useReducedMotion();
  const t = win(progress, start, end);

  if (reduced) {
    return (
      <div className={className} style={{ opacity: t > 0 ? 1 : 0 }}>
        {children}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        style={{
          transform: `translateY(${lerp(110, 0, t)}%)`,
          opacity: t === 0 ? 0 : 1,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
