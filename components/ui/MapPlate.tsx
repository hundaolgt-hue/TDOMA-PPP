"use client";

import { clamp01 } from "@/lib/scroll/ease";

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * MapPlate — a framed GIS/imagery plate for the suitability section. Presents a
 * real study map behind a "sensor analysis" reveal: a top-to-bottom clip wipe,
 * a travelling scan line, a desaturate→full-colour resolve, HUD corner
 * brackets and a faint coordinate grid. Driven by a pure `reveal` (0→1) so it
 * stays a function of scroll progress like every other chapter element.
 */
export default function MapPlate({
  src,
  alt,
  reveal,
  eyebrow,
  caption,
  aspect = "4 / 3",
  contain = false,
  accent = "var(--green)",
  className = "",
}: {
  src: string;
  alt: string;
  reveal: number;
  eyebrow?: string;
  caption?: string;
  aspect?: string;
  contain?: boolean;
  accent?: string;
  className?: string;
}) {
  const r = clamp01(reveal);
  // Wipe reveals the image top→bottom; scan line rides the leading edge.
  const wipe = `inset(0 0 ${(1 - r) * 100}% 0)`;
  const scanTop = `${Math.min(100, r * 100)}%`;
  const scanning = r > 0.01 && r < 0.99;

  return (
    <figure className={`holo group relative overflow-hidden rounded-2xl p-2 ${className}`}>
      {eyebrow && (
        <figcaption className="pointer-events-none absolute left-4 top-4 z-20">
          <span className="label glass-dark rounded-md px-2.5 py-1 text-white">{eyebrow}</span>
        </figcaption>
      )}

      <div className="relative w-full overflow-hidden rounded-xl bg-[#0a140d]" style={{ aspectRatio: aspect }}>
        {/* The real study map, revealed under a clip wipe + colour resolve */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${BP}${src}`}
          alt={alt}
          loading="lazy"
          className={`absolute inset-0 h-full w-full ${contain ? "object-contain" : "object-cover"}`}
          style={{
            clipPath: wipe,
            WebkitClipPath: wipe,
            filter: `saturate(${0.25 + r * 0.75}) contrast(${1.05 - r * 0.05}) brightness(${0.9 + r * 0.1})`,
            transition: "filter 120ms linear",
          }}
        />

        {/* Coordinate grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-screen"
          style={{
            backgroundImage:
              "linear-gradient(rgba(120,220,170,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(120,220,170,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />

        {/* Travelling scan line */}
        {scanning && (
          <div
            className="pointer-events-none absolute inset-x-0 z-10 h-[2px]"
            style={{
              top: scanTop,
              background: accent,
              boxShadow: `0 0 14px 2px ${accent}, 0 0 40px 6px ${accent}`,
              opacity: 0.9,
            }}
            aria-hidden
          />
        )}

        {/* HUD corner brackets */}
        {(["tl", "tr", "bl", "br"] as const).map((c) => (
          <span
            key={c}
            aria-hidden
            className="pointer-events-none absolute z-10 h-6 w-6"
            style={{
              top: c[0] === "t" ? 10 : undefined,
              bottom: c[0] === "b" ? 10 : undefined,
              left: c[1] === "l" ? 10 : undefined,
              right: c[1] === "r" ? 10 : undefined,
              borderTop: c[0] === "t" ? `2px solid ${accent}` : undefined,
              borderBottom: c[0] === "b" ? `2px solid ${accent}` : undefined,
              borderLeft: c[1] === "l" ? `2px solid ${accent}` : undefined,
              borderRight: c[1] === "r" ? `2px solid ${accent}` : undefined,
              opacity: 0.5 + r * 0.4,
            }}
          />
        ))}
      </div>

      {caption && <figcaption className="mt-2 px-1 text-sm leading-relaxed text-[var(--dim)]">{caption}</figcaption>}
    </figure>
  );
}
