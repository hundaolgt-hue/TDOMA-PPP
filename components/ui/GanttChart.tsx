"use client";

import { clamp01 } from "@/lib/scroll/ease";
import { activities, sections, TOTAL_WEEKS, weekToDate, bandFor, type Activity } from "@/data/programme";

const sectionColor = Object.fromEntries(sections.map((s) => [s.id, s.color])) as Record<string, string>;

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Interactive CPM Gantt. Bars draw left-to-right on scroll `reveal`; the pale
 * extension past a bar is its available float. Hovering a row lifts it, dims
 * the rest, and reports the activity upward so the surrounding panel can show
 * its detail. Critical-path activities carry an outline, never colour alone.
 */
export default function GanttChart({
  reveal,
  active,
  onActive,
  rowH = 15,
}: {
  reveal: number;
  active: string | null;
  onActive: (a: Activity | null) => void;
  rowH?: number;
}) {
  const r = clamp01(reveal);
  const pct = (wk: number) => (wk / TOTAL_WEEKS) * 100;

  // Year gridlines at Jan 2028 / Jan 2029 / Jan 2030, plus quarter ticks.
  const yearWeeks = [0, 52, 104, 156];
  const quarterTicks = Array.from({ length: 13 }, (_, i) => i * 13);

  return (
    <div className="w-full">
      <div className="relative" style={{ height: activities.length * rowH + 4 }}>
        {/* gridlines */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {quarterTicks.map((wk) => (
            <div key={wk} className="absolute inset-y-0 w-px bg-[var(--green)]/10" style={{ left: `${pct(wk)}%` }} />
          ))}
          {yearWeeks.map((wk) => (
            <div key={wk} className="absolute inset-y-0 w-px bg-[var(--green-deep)]/30" style={{ left: `${pct(wk)}%` }} />
          ))}
        </div>

        {/* rows */}
        {activities.map((a, i) => {
          const t = clamp01((r * activities.length * 1.35 - i) / 1.35); // staggered draw, top-down
          const on = active === a.code;
          const dim = active !== null && !on;
          const band = bandFor(a.floatWk, a.critical);
          return (
            <div
              key={a.code}
              onPointerEnter={() => onActive(a)}
              onPointerLeave={() => onActive(null)}
              className="absolute inset-x-0 cursor-default"
              style={{ top: i * rowH, height: rowH, opacity: dim ? 0.34 : 1, transition: "opacity 180ms" }}
            >
              {/* float extension */}
              {a.floatWk > 0 && (
                <div
                  className="absolute rounded-[2px]"
                  style={{
                    left: `${pct(a.startWk + a.durWk)}%`,
                    width: `${pct(a.floatWk) * t}%`,
                    top: rowH * 0.28,
                    height: rowH * 0.44,
                    background: sectionColor[a.section],
                    opacity: 0.22,
                  }}
                />
              )}
              {/* duration bar */}
              <div
                className="absolute rounded-[2px]"
                style={{
                  left: `${pct(a.startWk)}%`,
                  width: `${Math.max(0.3, pct(a.durWk) * t)}%`,
                  top: rowH * 0.16,
                  height: rowH * 0.68,
                  background: sectionColor[a.section],
                  outline: a.critical ? "1.5px solid var(--orange)" : undefined,
                  outlineOffset: a.critical ? "0.5px" : undefined,
                  boxShadow: on ? "0 0 12px rgba(240,138,36,0.7)" : undefined,
                  transition: "box-shadow 200ms",
                }}
              />
              {/* code label, tucked just before the bar */}
              <span
                className="font-display absolute text-[0.6rem] font-bold leading-none tabular-nums"
                style={{
                  left: `calc(${pct(a.startWk)}% - 4px)`,
                  transform: "translateX(-100%)",
                  top: rowH * 0.2,
                  color: on ? "var(--orange-text)" : "var(--dim)",
                  opacity: t,
                }}
              >
                {a.code}
              </span>
              {/* hovered readout rides the bar */}
              {on && (
                <span
                  className="glass-dark pointer-events-none absolute z-20 whitespace-nowrap rounded-md px-2 py-0.5 text-[0.66rem] text-white"
                  style={{ left: `calc(${pct(a.startWk + a.durWk)}% + 8px)`, top: -2 }}
                >
                  {a.name} · {a.durWk} wks · {a.critical ? "critical" : `${a.floatWk} wks float`}
                </span>
              )}
              <span className="sr-only">
                {a.code} {a.name}, {a.durWk} weeks, {a.critical ? "on the critical path" : `${a.floatWk} weeks float — ${band.label}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* time axis */}
      <div className="relative mt-1 h-8" aria-hidden>
        {yearWeeks.slice(0, 3).map((wk) => (
          <span key={wk} className="font-display absolute text-[0.68rem] font-bold text-[var(--green-deep)]" style={{ left: `${pct(wk)}%` }}>
            {weekToDate(wk).getUTCFullYear()}
          </span>
        ))}
        {quarterTicks.map((wk) => {
          const d = weekToDate(wk);
          return (
            <span key={wk} className="absolute top-3.5 text-[0.6rem] text-[var(--dim)]" style={{ left: `${pct(wk)}%`, transform: "translateX(-50%)" }}>
              {MONTH[d.getUTCMonth()]}
            </span>
          );
        })}
      </div>
    </div>
  );
}
