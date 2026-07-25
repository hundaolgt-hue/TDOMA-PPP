"use client";

import { useEffect, useRef } from "react";

/**
 * Persistent TDOMA badge — visible on every section, first page to last, in
 * minimal space (top-right glass chip). Gently fades in on load.
 *
 * Interim wordmark: this is swapped for the 3D WebGL TDOMA logo once the
 * model geometry (.glb, or .obj + textures) is supplied — that version will
 * animate differently per section.
 */
export default function ScrollLogo() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fade in shortly after mount, then stay for the whole page.
    const id = requestAnimationFrame(() => {
      el.style.opacity = "1";
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed right-4 top-4 z-50 md:right-6 md:top-6"
      style={{ opacity: 0, transition: "opacity 0.6s ease", willChange: "opacity" }}
    >
      <div className="glass-strong px-3.5 py-1.5">
        <span className="font-display text-lg font-bold tracking-[0.22em] text-[var(--green-deep)] md:text-xl">
          TDOMA<span className="text-[var(--orange-text)]">.</span>
        </span>
      </div>
    </div>
  );
}
