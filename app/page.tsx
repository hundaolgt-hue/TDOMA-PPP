"use client";

// Client component: sections receive scroll progress via render props, which
// cannot cross the RSC boundary. Metadata lives in layout.tsx.
import SmoothScroll from "@/lib/scroll/SmoothScroll";
import ChapterShell from "@/lib/scroll/ChapterShell";
import ScrollLogo from "@/components/ui/ScrollLogo";

import Hero from "@/components/sections/s01-hero";
import Company from "@/components/sections/s02-company";
import Values from "@/components/sections/s02b-values";
import Rationale from "@/components/sections/s03-rationale";
import Suitability from "@/components/sections/s03b-suitability";
import SuitabilityMethod from "@/components/sections/s03c-suitability-method";
import PPP from "@/components/sections/s04-ppp";
import Massing from "@/components/sections/s05-massing";
import ProgramStack from "@/components/sections/s05b-stack";
import MassingConfig from "@/components/sections/s05c-config";
import Program from "@/components/sections/s06-program";
import Phasing from "@/components/sections/s07-phasing";
import Programme from "@/components/sections/s07b-programme";
import Cashflow from "@/components/sections/s07c-cashflow";
import Assumptions from "@/components/sections/s08-assumptions";
import Capex from "@/components/sections/s09-capex";
import Revenue from "@/components/sections/s10-revenue";
import Sensitivity from "@/components/sections/s11-sensitivity";
import Profitability from "@/components/sections/s12-profitability";
import Gallery from "@/components/sections/s13-gallery";
import Interior from "@/components/sections/s13b-interior";
import Final from "@/components/sections/s14-final";

// [component, id, aria, heightVh, isVideo]
const sections = [
  [Hero, "s1", "Introduction film", 320, true],
  [Company, "s2", "Company profile", 250, false],
  [Values, "s2b", "Company values and track record", 100, false],
  [Rationale, "s3", "Project rationale", 250, false],
  [PPP, "s4", "PPP structure", 230, false],
  [Suitability, "s3b", "Site suitability — live heat map", 100, false],
  [SuitabilityMethod, "s3c", "Site suitability — the screen", 100, false],
  [Massing, "s5", "Massing concept", 100, false],
  [ProgramStack, "s5b", "Program stack and net GLA", 100, false],
  [MassingConfig, "s5c", "Massing metrics and configuration", 100, false],
  [Program, "s6", "Programme separation film", 320, true],
  [Phasing, "s7", "Construction phasing film", 340, true],
  [Programme, "s7b", "Construction programme CPM Gantt", 100, false],
  [Cashflow, "s7c", "Cash-flow S-curve, milestones and float", 100, false],
  [Assumptions, "s8", "Financial assumptions", 250, false],
  [Capex, "s9", "Capex", 250, false],
  [Revenue, "s10", "Revenue", 270, false],
  [Sensitivity, "s11", "Sensitivity analysis", 230, false],
  [Profitability, "s12", "Profitability", 250, false],
  [Gallery, "s13", "Gallery", 230, false],
  [Interior, "s13b", "Interior walk-through", 340, true],
  [Final, "s14", "Closing film", 300, true],
] as const;

export default function Page() {
  return (
    <SmoothScroll>
      <ScrollLogo />
      <main>
        {sections.map(([Comp, id, aria, h, isVideo]) => (
          <ChapterShell key={id} id={id} heightVh={h} ariaLabel={aria} surface={!isVideo} pin={isVideo}>
            {(p) => <Comp progress={p} />}
          </ChapterShell>
        ))}
      </main>
    </SmoothScroll>
  );
}
