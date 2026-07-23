"use client";

import { scrollToId } from "@/lib/scroll/SmoothScroll";

export type ChapterMeta = { id: string; label: string };

/**
 * Keyboard-operable chapter nav — the escape hatch from every pinned
 * section. Fixed left rail on desktop, hidden on small screens (mobile gets
 * native scroll with no pins to be trapped in).
 */
export default function ChapterNav({ chapters }: { chapters: ChapterMeta[] }) {
  return (
    <nav aria-label="Chapters" className="fixed left-4 top-1/2 z-50 hidden -translate-y-1/2 md:block">
      <ol className="flex flex-col gap-3">
        {chapters.map((chapter, i) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(chapter.id);
              }}
              className="group flex items-center gap-2 text-neutral-500 hover:text-neutral-200 focus-visible:text-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300"
            >
              <span className="h-px w-4 bg-current transition-all group-hover:w-6" aria-hidden />
              <span className="text-[10px] uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {String(i + 1).padStart(2, "0")} {chapter.label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
