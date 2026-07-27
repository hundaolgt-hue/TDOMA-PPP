"use client";

import { clamp01 } from "@/lib/scroll/ease";
import type { Zone } from "@/data/program";

/**
 * Net GLA donut. Segments sweep on with scroll `reveal`, and hovering either a
 * segment or its legend row lifts that slice out of the ring and dims the rest,
 * so the chart and legend read as one linked object.
 */
export default function GlaDonut({
  zones,
  total,
  reveal,
  active,
  onActive,
  size = 260,
}: {
  zones: Zone[];
  total: number;
  reveal: number;
  active: string | null;
  onActive: (id: string | null) => void;
  size?: number;
}) {
  const r = clamp01(reveal);
  const R = 42; // ring radius in viewBox units
  const C = 2 * Math.PI * R;

  let acc = 0;
  const segs = zones.map((z) => {
    const frac = z.areaSqm.value / total;
    const seg = { z, frac, offset: acc };
    acc += frac;
    return seg;
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        {segs.map(({ z, frac, offset }) => {
          const isActive = active === z.id;
          const dim = active !== null && !isActive;
          // Each slice is a dash of the ring circumference, swept in by reveal.
          const len = frac * C * r;
          return (
            <circle
              key={z.id}
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={z.color}
              strokeWidth={isActive ? 15 : 11}
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset * C * r}
              opacity={dim ? 0.28 : 1}
              onPointerEnter={() => onActive(z.id)}
              onPointerLeave={() => onActive(null)}
              style={{
                cursor: "pointer",
                transition: "stroke-width 220ms var(--ease-glass), opacity 220ms var(--ease-glass)",
                filter: isActive ? "drop-shadow(0 0 6px rgba(14,122,82,0.45))" : undefined,
              }}
            />
          );
        })}
      </svg>

      {/* Centre readout — total, or the hovered cluster */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        {(() => {
          const z = zones.find((x) => x.id === active);
          return z ? (
            <>
              <p className="font-display text-2xl font-bold leading-none text-[var(--green-deep)] tabular-nums">
                {z.areaSqm.value.toLocaleString()}
              </p>
              <p className="text-[0.7rem] text-[var(--dim)]">m² · {z.sharePct.value}%</p>
              <p className="mt-1 max-w-[7.5rem] text-[0.7rem] font-medium leading-tight text-[var(--ink)]">{z.label}</p>
            </>
          ) : (
            <>
              <p className="font-display text-2xl font-bold leading-none text-[var(--green-deep)] tabular-nums">
                {Math.round(total * r).toLocaleString()}
              </p>
              <p className="text-[0.7rem] text-[var(--dim)]">m² net GLA</p>
              <p className="mt-1 text-[0.7rem] font-medium text-[var(--green)]">100%</p>
            </>
          );
        })()}
      </div>
    </div>
  );
}
