"use client";

// Client component: chapters receive progress via render props, which cannot
// cross the RSC serialization boundary. Metadata lives in layout.tsx.
import SmoothScroll from "@/lib/scroll/SmoothScroll";
import ChapterShell from "@/lib/scroll/ChapterShell";
import ChapterNav from "@/components/ui/ChapterNav";

import ExplodedAssembly from "@/components/chapters/ch1-exploded";
import { CH1_HEIGHT_VH } from "@/components/chapters/ch1-exploded/timeline";
import Turntable from "@/components/chapters/ch2-turntable";
import { CH2_HEIGHT_VH } from "@/components/chapters/ch2-turntable/timeline";
import ConstructionPhasing from "@/components/chapters/ch3-phasing";
import { CH3_HEIGHT_VH } from "@/components/chapters/ch3-phasing/timeline";
import Typography from "@/components/chapters/ch4-typography";
import { CH4_HEIGHT_VH } from "@/components/chapters/ch4-typography/timeline";
import Financials from "@/components/chapters/ch5-financials";
import { CH5_HEIGHT_VH } from "@/components/chapters/ch5-financials/timeline";
import Boq from "@/components/chapters/ch6-boq";
import { CH6_HEIGHT_VH } from "@/components/chapters/ch6-boq/timeline";
import Company from "@/components/chapters/ch7-company";
import { CH7_HEIGHT_VH } from "@/components/chapters/ch7-company/timeline";

const chapters = [
  { id: "ch-1", label: "Assembly" },
  { id: "ch-2", label: "Program" },
  { id: "ch-3", label: "Phasing" },
  { id: "ch-4", label: "Vision" },
  { id: "ch-5", label: "Financials" },
  { id: "ch-6", label: "BOQ" },
  { id: "ch-7", label: "Company" },
];

export default function Page() {
  return (
    <SmoothScroll>
      <ChapterNav chapters={chapters} />
      <main>
        <header className="flex h-screen flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">TDOMA S.C. · Development proposal</p>
          <h1 className="font-display text-6xl leading-none md:text-8xl">Liiban Smart Mall</h1>
          <p className="max-w-lg text-sm text-neutral-400">
            A G+15 mixed-use trade complex for the heart of Merkato, Addis Ababa. Scroll to walk through it.
          </p>
        </header>

        <ChapterShell id="ch-1" heightVh={CH1_HEIGHT_VH} ariaLabel="Chapter 1 — Exploded assembly">
          {(p) => <ExplodedAssembly progress={p} />}
        </ChapterShell>
        <ChapterShell id="ch-2" heightVh={CH2_HEIGHT_VH} ariaLabel="Chapter 2 — Program zoning">
          {(p) => <Turntable progress={p} />}
        </ChapterShell>
        <ChapterShell id="ch-3" heightVh={CH3_HEIGHT_VH} ariaLabel="Chapter 3 — Construction phasing">
          {(p) => <ConstructionPhasing progress={p} />}
        </ChapterShell>
        <ChapterShell id="ch-4" heightVh={CH4_HEIGHT_VH} ariaLabel="Chapter 4 — Vision">
          {(p) => <Typography progress={p} />}
        </ChapterShell>
        <ChapterShell id="ch-5" heightVh={CH5_HEIGHT_VH} ariaLabel="Chapter 5 — Financial dashboard">
          {(p) => <Financials progress={p} />}
        </ChapterShell>
        <ChapterShell id="ch-6" heightVh={CH6_HEIGHT_VH} ariaLabel="Chapter 6 — Bill of quantities">
          {(p) => <Boq progress={p} />}
        </ChapterShell>
        <ChapterShell id="ch-7" heightVh={CH7_HEIGHT_VH} ariaLabel="Chapter 7 — Company profile">
          {(p) => <Company progress={p} />}
        </ChapterShell>

        <footer className="flex h-[40vh] flex-col items-center justify-center gap-2 px-6 text-center text-xs text-neutral-600">
          <p>Greybox build — placeholder geometry, real timing. Figures sourced from the audited financial model, BOQ and area matrix.</p>
          <p>ETB · IFRS · concept-stage estimates; re-measure before tender. Warehouse rent and company track record remain unsourced.</p>
        </footer>
      </main>
    </SmoothScroll>
  );
}
