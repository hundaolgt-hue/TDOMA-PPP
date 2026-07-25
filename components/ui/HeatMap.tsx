"use client";

import { useEffect, useRef } from "react";
import { clamp01 } from "@/lib/scroll/ease";

/**
 * Schematic siting heat-map. A procedurally-drawn stand-in for the study's
 * siting_heatmap.png: a bright hotspot core with priority-zone ribbons and dark
 * exclusion voids over the 1.71 km² study area, revealed by an analysis sweep.
 * Deterministic layout. Replace with the real GIS render when supplied.
 */
type Hot = { x: number; y: number; r: number; heat: number };
const CORE = { x: 0.42, y: 0.52 };
// Seeded scatter of priority-zone hotspots (fractions of canvas).
const ZONES: Hot[] = [
  { x: 0.42, y: 0.52, r: 0.34, heat: 1 }, // core anchor
  { x: 0.5, y: 0.42, r: 0.16, heat: 0.85 },
  { x: 0.34, y: 0.62, r: 0.15, heat: 0.8 },
  { x: 0.55, y: 0.6, r: 0.13, heat: 0.7 },
  { x: 0.3, y: 0.44, r: 0.12, heat: 0.66 },
  { x: 0.62, y: 0.48, r: 0.11, heat: 0.6 },
  { x: 0.47, y: 0.68, r: 0.1, heat: 0.55 },
  { x: 0.68, y: 0.62, r: 0.09, heat: 0.48 },
];
const VOIDS = [
  { x: 0.48, y: 0.5, r: 0.05 },
  { x: 0.38, y: 0.55, r: 0.045 },
  { x: 0.56, y: 0.46, r: 0.04 },
  { x: 0.44, y: 0.6, r: 0.05 },
  { x: 0.6, y: 0.55, r: 0.038 },
];
// Illustrative parcels (schematic positions near the core).
const MARKS = [
  { id: "S1", x: 0.46, y: 0.5 },
  { id: "S2", x: 0.55, y: 0.4 },
  { id: "S3", x: 0.63, y: 0.36 },
];

export default function HeatMap({ reveal }: { reveal: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rv = clamp01(reveal);

      // base field
      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0, "#0a1f16");
      base.addColorStop(1, "#0d2a1d");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // faint 20 m grid
      ctx.strokeStyle = "rgba(120,200,160,0.06)";
      ctx.lineWidth = 1;
      const step = 26;
      for (let x = 0; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      // heat (additive radial gradients)
      ctx.globalCompositeOperation = "lighter";
      for (const z of ZONES) {
        const cx = z.x * w, cy = z.y * h, cr = z.r * Math.min(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
        const a = z.heat;
        g.addColorStop(0, `rgba(255,235,150,${0.9 * a})`);
        g.addColorStop(0.3, `rgba(240,138,36,${0.55 * a})`);
        g.addColorStop(0.6, `rgba(60,180,110,${0.45 * a})`);
        g.addColorStop(1, "rgba(14,122,82,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // exclusion voids (dark)
      for (const v of VOIDS) {
        const cx = v.x * w, cy = v.y * h, cr = v.r * Math.min(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
        g.addColorStop(0, "rgba(5,15,10,0.92)");
        g.addColorStop(1, "rgba(5,15,10,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill();
      }

      // analysis-sweep reveal: dim everything past the sweep line
      const sweepX = rv * w;
      ctx.fillStyle = "rgba(9,20,15,0.93)";
      ctx.fillRect(sweepX, 0, w - sweepX, h);
      if (rv > 0.001 && rv < 0.999) {
        ctx.fillStyle = "rgba(240,138,36,0.9)";
        ctx.fillRect(sweepX - 1.5, 0, 3, h);
        ctx.shadowColor = "rgba(240,138,36,0.8)";
        ctx.shadowBlur = 18;
        ctx.fillRect(sweepX - 1, 0, 2, h);
        ctx.shadowBlur = 0;
      }

      // core anchor marker
      if (rv > CORE.x) {
        const ax = CORE.x * w, ay = CORE.y * h;
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ax, ay, 9, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(ax, ay, 3, 0, Math.PI * 2); ctx.fill();
        ctx.font = "600 12px Rajdhani, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillText("Core anchor", ax + 13, ay + 4);
      }

      // parcel markers
      for (const m of MARKS) {
        if (rv < m.x) continue;
        const mx = m.x * w, my = m.y * h;
        ctx.fillStyle = "#f08a24";
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(mx, my, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.font = "700 12px Rajdhani, sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText(m.id, mx + 8, my - 6);
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [reveal]);

  return <canvas ref={ref} className="h-full w-full rounded-2xl" role="img" aria-label="Schematic siting heat map of the Merkato study area with priority-zone hotspots and exclusion voids" />;
}
