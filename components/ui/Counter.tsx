"use client";

import { win } from "@/lib/scroll/ease";

type Props = {
  progress: number;
  start: number;
  end: number;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Thousands separators — off for years and other bare identifiers. */
  grouping?: boolean;
};

/**
 * Scroll-linked number counter. Eases out and lands on the exact value —
 * easeOutCubic cannot overshoot, which matters for financial figures.
 */
export default function Counter({
  progress,
  start,
  end,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  grouping = true,
}: Props) {
  const t = win(progress, start, end);
  const current = value * t;
  const text =
    prefix +
    current.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: grouping,
    }) +
    suffix;

  return (
    <span className={`tabular-nums ${className}`} aria-label={`${prefix}${value}${suffix}`}>
      {text}
    </span>
  );
}
