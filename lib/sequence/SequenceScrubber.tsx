"use client";

import { useEffect, useRef, useState } from "react";
import type { SequenceManifest } from "./manifest";

const HOLD = 12; // keep ±12 frames decoded around the current position
const EVICT = 26; // drop anything beyond ±26 to bound memory

type Props = {
  progress: number;
  manifest: SequenceManifest;
  className?: string;
  /** Alt text / accessible description of the sequence. */
  label: string;
};

/**
 * Image-sequence scrubber. Draws a windowed, off-main-thread-decoded frame
 * sequence to a single DPR-capped canvas, mapped from scroll progress. Per
 * the award-web-experience skill: window ±HOLD, evict ±EVICT, decode via
 * createImageBitmap, skip redundant draws, poster frame so the canvas is
 * never blank.
 *
 * Coarse-pointer / small screens get a single static <img> (the finished
 * building) instead of the canvas — keeps mobile light and memory bounded.
 */
export default function SequenceScrubber({ progress, manifest, className = "", label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cache = useRef<Map<number, ImageBitmap>>(new Map());
  const inflight = useRef<Set<number>>(new Set());
  const lastReq = useRef<number>(-1);
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const raf = useRef<number | null>(null);
  const [staticMode, setStaticMode] = useState<boolean | null>(null);

  const frameOf = (p: number) =>
    Math.min(manifest.count - 1, Math.max(0, Math.round(p * (manifest.count - 1))));

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    setStaticMode(coarse);
  }, []);

  // Canvas draw (cover-fit). Falls back to nearest decoded frame if the exact
  // frame has not arrived, then redraws when it does.
  useEffect(() => {
    if (staticMode !== false) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      size.current = { w, h, dpr };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      lastReq.current = -1; // force a redraw at the new size
      scheduleDraw();
    };

    const draw = () => {
      raf.current = null;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const idx = frameOf(progressRef.current);
      let img = cache.current.get(idx);
      if (!img) {
        let best = -1;
        let bestDist = Infinity;
        for (const k of cache.current.keys()) {
          const d = Math.abs(k - idx);
          if (d < bestDist) {
            bestDist = d;
            best = k;
          }
        }
        if (best < 0) return; // nothing decoded yet
        img = cache.current.get(best)!;
      }
      const cw = canvas.width;
      const ch = canvas.height;
      const ir = img.width / img.height;
      const cr = cw / ch;
      let dw: number;
      let dh: number;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
      } else {
        dw = cw;
        dh = cw / ir;
      }
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const scheduleDraw = () => {
      if (raf.current == null) raf.current = requestAnimationFrame(draw);
    };
    scheduleDrawRef.current = scheduleDraw;

    const load = (i: number) => {
      if (cache.current.has(i) || inflight.current.has(i)) return;
      inflight.current.add(i);
      fetch(manifest.path(i + 1))
        .then((r) => r.blob())
        .then((b) => createImageBitmap(b))
        .then((bmp) => {
          inflight.current.delete(i);
          if (cache.current.has(i)) bmp.close();
          else cache.current.set(i, bmp);
          // Always redraw the current frame when any windowed frame arrives —
          // rAF-debounced and cheap, and guarantees the poster paints on load
          // without waiting for a scroll event.
          scheduleDraw();
        })
        .catch(() => inflight.current.delete(i));
    };
    loadRef.current = load;

    const ensureWindow = (center: number) => {
      for (let i = Math.max(0, center - HOLD); i <= Math.min(manifest.count - 1, center + HOLD); i++) load(i);
      for (const k of cache.current.keys()) {
        if (Math.abs(k - center) > EVICT) {
          cache.current.get(k)?.close();
          cache.current.delete(k);
        }
      }
    };
    ensureWindowRef.current = ensureWindow;

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    // Poster: first and last frames, so the canvas is never blank and the
    // reduced-motion end-state (progress = 1) shows the finished building.
    load(0);
    load(manifest.count - 1);

    return () => {
      ro.disconnect();
      if (raf.current != null) cancelAnimationFrame(raf.current);
      cache.current.forEach((b) => b.close());
      cache.current.clear();
      inflight.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticMode, manifest]);

  // Latest progress without re-running the setup effect.
  const progressRef = useRef(progress);
  const scheduleDrawRef = useRef<() => void>(() => {});
  const ensureWindowRef = useRef<(c: number) => void>(() => {});
  const loadRef = useRef<(i: number) => void>(() => {});
  useEffect(() => {
    progressRef.current = progress;
    if (staticMode !== false) return;
    const req = frameOf(progress);
    ensureWindowRef.current(req);
    if (req !== lastReq.current) {
      lastReq.current = req;
      scheduleDrawRef.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, staticMode]);

  if (staticMode === null) return <div className={className} aria-hidden />;

  if (staticMode) {
    // Static end-frame for coarse pointers / small screens.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={manifest.path(manifest.count)}
        alt={label}
        className={`h-full w-full object-cover ${className}`}
        loading="lazy"
      />
    );
  }

  return <canvas ref={canvasRef} className={className} role="img" aria-label={label} />;
}
