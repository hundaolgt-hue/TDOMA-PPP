"use client";

import { clamp01 } from "@/lib/scroll/ease";

type Props = {
  data: number[];
  labels?: string[];
  /** 0→1 reveal — path draws + fill rises with this. */
  reveal: number;
  height?: number;
  stroke?: string;
  fillFrom?: string;
  /** Optional bars behind the line (e.g. revenue vs EBITDA). */
  bars?: number[];
  barColor?: string;
  unit?: string;
};

/**
 * Animated area/line chart on a faint HUD grid — the workhorse of the sci-fi
 * financial dashboards. Pure function of `reveal`, so it scrubs cleanly.
 */
export default function SeriesChart({
  data,
  labels,
  reveal,
  height = 200,
  stroke = "var(--green-deep)",
  fillFrom = "rgba(14,122,82,0.35)",
  bars,
  barColor = "rgba(240,138,36,0.35)",
  unit,
}: Props) {
  const W = 1000;
  const H = height;
  const pad = { l: 8, r: 8, t: 14, b: 22 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = Math.max(...data, ...(bars ?? [1])) * 1.08;
  const x = (i: number) => pad.l + (i / (data.length - 1)) * iw;
  const y = (v: number) => pad.t + ih - (v / max) * ih;

  const r = clamp01(reveal);
  const shown = 1 + (data.length - 1) * r; // how many points revealed
  const pts = data.map((v, i) => [x(i), y(v)] as const);
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${x(data.length - 1).toFixed(1)},${(pad.t + ih).toFixed(1)} L${x(0).toFixed(1)},${(pad.t + ih).toFixed(1)} Z`;
  const totalLen = 2600;
  const endIdx = Math.min(data.length - 1, Math.floor(shown - 1e-6));
  const end = pts[endIdx];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id="sc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillFrom} />
          <stop offset="100%" stopColor="rgba(14,122,82,0)" />
        </linearGradient>
      </defs>
      {/* grid */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={pad.l} x2={W - pad.r} y1={pad.t + ih * g} y2={pad.t + ih * g} stroke="rgba(14,122,82,0.10)" strokeWidth="1" />
      ))}
      {/* bars behind */}
      {bars &&
        bars.map((v, i) => {
          const br = clamp01((shown - i) / 1);
          const bh = (v / max) * ih * br;
          return <rect key={i} x={x(i) - iw / data.length / 2.6} y={pad.t + ih - bh} width={iw / data.length / 1.3} height={bh} fill={barColor} rx="2" />;
        })}
      {/* area */}
      <path d={areaPath} fill="url(#sc-fill)" opacity={r} />
      {/* line (draw-on) */}
      <path d={linePath} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={totalLen} strokeDashoffset={totalLen * (1 - r)} style={{ filter: "drop-shadow(0 0 6px rgba(14,122,82,0.4))" }} />
      {/* glowing endpoint */}
      {r > 0.02 && end && (
        <>
          <circle cx={end[0]} cy={end[1]} r="6" fill="var(--orange)" opacity="0.35" />
          <circle cx={end[0]} cy={end[1]} r="3.2" fill="var(--orange)" />
        </>
      )}
      {/* x labels */}
      {labels &&
        labels.map((l, i) =>
          i % 2 === 0 ? (
            <text key={i} x={x(i)} y={H - 6} fontSize="16" textAnchor="middle" fill="var(--dim)" fontFamily="Rajdhani">
              {l}
            </text>
          ) : null,
        )}
      {unit && (
        <text x={pad.l} y={pad.t + 2} fontSize="15" fill="var(--dim)" fontFamily="Rajdhani">
          {unit}
        </text>
      )}
    </svg>
  );
}
