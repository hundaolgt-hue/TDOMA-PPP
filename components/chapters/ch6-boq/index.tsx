"use client";

import { useMemo, useState } from "react";
import type { ChapterProps } from "@/lib/scroll/ChapterShell";
import { win, lerp } from "@/lib/scroll/ease";
import TextReveal from "@/components/ui/TextReveal";
import { boqItems, type BoqItem } from "@/data/boq";
import { constructionPhases } from "@/data/phases";
import { title, rowWindow } from "./timeline";

type SortKey = "code" | "quantity" | "amount";

const amount = (item: BoqItem): number => item.quantity.value * item.rateUsd.value;

/**
 * Chapter 6 — BOQ. Sortable, phase-filterable quantities table cross-linked
 * to the construction phases of chapter 3 via shared phase ids. Sorting and
 * filtering are click-state; only the row cascade is scroll-linked.
 */
export default function Boq({ progress }: ChapterProps) {
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [descending, setDescending] = useState(false);
  const [phaseFilter, setPhaseFilter] = useState<string | null>(null);
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);

  const rows = useMemo(() => {
    const filtered = phaseFilter ? boqItems.filter((i) => i.phaseId === phaseFilter) : [...boqItems];
    filtered.sort((a, b) => {
      const cmp =
        sortKey === "code"
          ? a.code.localeCompare(b.code)
          : sortKey === "quantity"
            ? a.quantity.value - b.quantity.value
            : amount(a) - amount(b);
      return descending ? -cmp : cmp;
    });
    return filtered;
  }, [sortKey, descending, phaseFilter]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setDescending((d) => !d);
    else {
      setSortKey(key);
      setDescending(false);
    }
  };

  const phaseLabel = (id: string) => constructionPhases.find((p) => p.id === id)?.label ?? id;

  return (
    <div className="flex h-full items-center justify-center bg-[#0a0c10] text-neutral-100">
      <div className="flex w-full max-w-5xl flex-col gap-6 px-6">
        <TextReveal progress={progress} start={title.start} end={title.end}>
          <h2 className="font-display text-4xl leading-tight md:text-5xl">Every quantity, accounted for.</h2>
        </TextReveal>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by construction phase">
          <button
            type="button"
            onClick={() => setPhaseFilter(null)}
            aria-pressed={phaseFilter === null}
            className={`rounded-sm border px-3 py-1 text-xs uppercase tracking-wider focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300 ${phaseFilter === null ? "border-neutral-200" : "border-neutral-700 text-neutral-500"}`}
          >
            All phases
          </button>
          {constructionPhases.map((phase) => (
            <button
              key={phase.id}
              type="button"
              onClick={() => setPhaseFilter(phaseFilter === phase.id ? null : phase.id)}
              onMouseEnter={() => setHoveredPhase(phase.id)}
              onMouseLeave={() => setHoveredPhase(null)}
              aria-pressed={phaseFilter === phase.id}
              className={`rounded-sm border px-3 py-1 text-xs uppercase tracking-wider focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300 ${phaseFilter === phase.id ? "border-neutral-200" : "border-neutral-700 text-neutral-500 hover:border-neutral-500"}`}
            >
              {phase.label}
            </button>
          ))}
        </div>

        <div className="max-h-[52vh] overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <caption className="sr-only">Bill of quantities — placeholder figures pending source documents</caption>
            <thead className="sticky top-0 bg-[#0a0c10] text-left text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th scope="col" className="py-2 pr-4">
                  <button type="button" onClick={() => toggleSort("code")} className="hover:text-neutral-200">
                    Code {sortKey === "code" ? (descending ? "↓" : "↑") : ""}
                  </button>
                </th>
                <th scope="col" className="py-2 pr-4">Description</th>
                <th scope="col" className="py-2 pr-4">Phase</th>
                <th scope="col" className="py-2 pr-4 text-right">
                  <button type="button" onClick={() => toggleSort("quantity")} className="hover:text-neutral-200">
                    Qty {sortKey === "quantity" ? (descending ? "↓" : "↑") : ""}
                  </button>
                </th>
                <th scope="col" className="py-2 pr-4">Unit</th>
                <th scope="col" className="py-2 text-right">
                  <button type="button" onClick={() => toggleSort("amount")} className="hover:text-neutral-200">
                    Amount $ {sortKey === "amount" ? (descending ? "↓" : "↑") : ""}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, i) => {
                const w = rowWindow(i, rows.length);
                const t = win(progress, w.start, w.end);
                const dimmed = hoveredPhase !== null && item.phaseId !== hoveredPhase;
                return (
                  <tr
                    key={item.code}
                    className="border-t border-neutral-800/80 transition-opacity duration-200"
                    style={{ opacity: dimmed ? 0.25 : lerp(0, 1, t), transform: `translateY(${lerp(6, 0, t)}px)` }}
                  >
                    <td className="py-2 pr-4 font-mono text-xs">{item.code}</td>
                    <td className="py-2 pr-4">{item.description}</td>
                    <td className="py-2 pr-4 text-neutral-400">{phaseLabel(item.phaseId)}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">{item.quantity.value.toLocaleString()}</td>
                    <td className="py-2 pr-4 text-neutral-400">{item.unit}</td>
                    <td className="py-2 text-right tabular-nums">{amount(item).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
