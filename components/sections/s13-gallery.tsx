"use client";

import { useEffect, useRef, useState } from "react";
import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Real CGI renders of the Liiban Smart Mall. The carousel adapts to any count.
const shots = [
  { src: "/gallery/render-01-street.webp", cap: "Street approach", sub: "Podium retail frontage · golden hour" },
  { src: "/gallery/render-02-dusk.webp", cap: "Blue hour", sub: "Illuminated crown & lobby signage" },
  { src: "/gallery/render-03-aerial.webp", cap: "Aerial context", sub: "Tower, terraces & parking court" },
  { src: "/gallery/render-04-plan.webp", cap: "Roofscape", sub: "Sky gardens & sculpted parapet" },
];

/**
 * S13 — Revolving holographic gallery. A 3D coverflow ring of the project
 * renders: moving the pointer across the stage revolves the ring; hovering a
 * panel enlarges it and turns it to face the viewer. Transforms are applied
 * imperatively inside a rAF lerp so the revolve stays smooth without
 * re-rendering React every frame. Falls back to click-to-focus on touch.
 */
export default function Gallery({ progress }: ChapterProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const target = useRef(0); // desired active position (float, in card units)
  const current = useRef(0); // eased active position
  const hovered = useRef<number | null>(null);
  const idle = useRef(true);
  const [active, setActive] = useState(0); // for caption / a11y only
  const n = shots.length;

  useEffect(() => {
    let raf = 0;
    let t0 = performance.now();
    const R = 460; // ring radius (px)
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - t0) / 1000);
      t0 = now;
      // Gentle idle auto-revolve so the ring feels alive until the user drives it.
      if (idle.current) target.current += dt * 0.12;
      // Ease current → target (frame-rate independent).
      const k = 1 - Math.pow(0.0015, dt);
      current.current += (target.current - current.current) * k;

      const cx = current.current;
      const near = Math.round(cx);
      const mod = ((near % n) + n) % n;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        // Signed shortest offset of this card from the active position.
        let pos = i - cx;
        pos = ((pos % n) + n) % n;
        if (pos > n / 2) pos -= n;
        const isHover = hovered.current === i;
        const ax = Math.abs(pos);
        const rotY = pos * -32; // face inward toward centre
        const tx = pos * 300;
        const tz = -ax * R * 0.42 + (isHover ? 180 : 0);
        const scale = Math.max(0.6, 1 - ax * 0.14) * (isHover ? 1.28 : 1);
        const opacity = ax > n / 2 - 0.05 ? 0 : Math.max(0.25, 1 - ax * 0.28);
        el.style.transform = `translate(-50%,-50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${isHover ? 0 : rotY}deg) scale(${scale})`;
        el.style.opacity = `${opacity}`;
        el.style.zIndex = `${100 - Math.round(ax * 10)}`;
        el.style.filter = isHover
          ? "brightness(1.08) saturate(1.12)"
          : `brightness(${(0.72 + 0.28 * (1 - ax / (n / 2))).toFixed(3)})`;
        el.style.pointerEvents = ax < 1.2 ? "auto" : "none";
      });
      if (mod !== active) setActive(mod);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  // Pointer across the stage revolves the ring.
  const onMove = (e: React.PointerEvent) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const ratio = (e.clientX - r.left) / r.width; // 0→1
    idle.current = false;
    if (hovered.current === null) target.current = ratio * (n - 1);
  };
  const onLeave = () => {
    hovered.current = null;
    idle.current = true;
    target.current = Math.round(current.current); // settle to nearest face
  };

  return (
    <div className="flex h-full flex-col justify-center overflow-hidden px-6 py-[6vh] md:px-10">
      <div className="mx-auto w-full max-w-6xl 2xl:max-w-[1680px]">
        <p className="font-tech-label text-xs text-[var(--orange)]">13 · Gallery</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <TextReveal progress={progress} start={0.04} end={0.16}>
            <h2 className="font-display mt-2 text-[clamp(2rem,4vw,4rem)] font-bold leading-tight text-[var(--green-deep)]">
              The building, in full.
            </h2>
          </TextReveal>
          <p className="text-sm text-[var(--dim)]">Move to revolve · hover to enlarge</p>
        </div>
      </div>

      {/* 3D stage */}
      <div
        ref={stageRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative mx-auto mt-6 h-[52vh] min-h-[340px] w-full max-w-[1500px] [perspective:1600px]"
        style={{ opacity: win(progress, 0.1, 0.3) }}
        role="group"
        aria-label="Revolving render gallery"
      >
        {/* holographic floor glow */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[8%] mx-auto h-24 w-[70%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(14,122,82,0.28),transparent_70%)] blur-2xl" />

        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {shots.map((s, i) => (
            <div
              key={s.src}
              ref={(el) => { cardRefs.current[i] = el; }}
              onPointerEnter={() => { hovered.current = i; idle.current = false; target.current = i; }}
              onPointerLeave={() => { hovered.current = null; }}
              onClick={() => { hovered.current = null; idle.current = false; target.current = i; }}
              className="absolute left-1/2 top-1/2 w-[clamp(300px,40vw,640px)] cursor-pointer [transform-style:preserve-3d] will-change-transform"
              style={{ transition: "filter 200ms ease" }}
            >
              <figure className="holo group relative overflow-hidden rounded-2xl p-1.5">
                <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "16 / 9" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${BP}${s.src}`} alt={s.cap} loading="lazy" className="h-full w-full object-cover" draggable={false} />
                  {/* holographic sheen */}
                  <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen"
                    style={{ background: "linear-gradient(115deg, transparent 30%, rgba(120,220,170,0.18) 45%, rgba(240,138,36,0.12) 55%, transparent 70%)" }} />
                  {/* scan grid */}
                  <div className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-screen"
                    style={{ backgroundImage: "linear-gradient(rgba(120,220,170,0.6) 1px, transparent 1px)", backgroundSize: "100% 5px" }} />
                  {/* neon frame */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-[var(--green)]/40" />
                </div>
                <figcaption className="glass-dark absolute bottom-3 left-3 rounded-lg px-3 py-1.5">
                  <p className="font-display text-sm font-semibold text-white">{s.cap}</p>
                  <p className="text-[0.7rem] text-white/70">{s.sub}</p>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      {/* dots */}
      <div className="mx-auto mt-5 flex items-center gap-2">
        {shots.map((s, i) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Show ${s.cap}`}
            aria-pressed={i === active}
            onClick={() => { hovered.current = null; idle.current = false; target.current = i; }}
            className="h-2.5 rounded-full transition-all"
            style={{ width: i === active ? 28 : 10, background: i === active ? "var(--orange)" : "var(--green)", opacity: i === active ? 1 : 0.35 }}
          />
        ))}
      </div>
    </div>
  );
}
