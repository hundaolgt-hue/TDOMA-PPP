"use client";

// Client component: sections receive scroll progress via render props, which
// cannot cross the RSC boundary. Metadata lives in layout.tsx.
import SmoothScroll from "@/lib/scroll/SmoothScroll";
import ChapterShell from "@/lib/scroll/ChapterShell";
import dynamic from "next/dynamic";

// Code-split the WebGL logo (three.js) into its own async chunk so it never
// weighs down the initial hero load.
const Logo3D = dynamic(() => import("@/components/ui/Logo3D"), { ssr: false });

import Hero from "@/components/sections/s01-hero";
import Company from "@/components/sections/s02-company";
import Rationale from "@/components/sections/s03-rationale";
import Suitability from "@/components/sections/s03b-suitability";
import SuitabilityMethod from "@/components/sections/s03c-suitability-method";
import PPP from "@/components/sections/s04-ppp";
import Massing from "@/components/sections/s05-massing";
import Program from "@/components/sections/s06-program";
import Phasing from "@/components/sections/s07-phasing";
import Assumptions from "@/components/sections/s08-assumptions";
import Capex from "@/components/sections/s09-capex";
import Revenue from "@/components/sections/s10-revenue";
import Sensitivity from "@/components/sections/s11-sensitivity";
import Profitability from "@/components/sections/s12-profitability";
import Gallery from "@/components/sections/s13-gallery";
import Final from "@/components/sections/s14-final";

// [component, id, aria, heightVh, isVideo]
const sections = [
  [Hero, "s1", "Introduction film", 320, true],
  [Company, "s2", "Company profile", 250, false],
  [Rationale, "s3", "Project rationale", 250, false],
  [PPP, "s4", "PPP structure", 230, false],
  [Suitability, "s3b", "Site suitability — live heat map", 100, false],
  [SuitabilityMethod, "s3c", "Site suitability — the screen", 100, false],
  [Massing, "s5", "Massing and metrics", 250, false],
  [Program, "s6", "Programme separation film", 320, true],
  [Phasing, "s7", "Construction phasing film", 340, true],
  [Assumptions, "s8", "Financial assumptions", 250, false],
  [Capex, "s9", "Capex", 250, false],
  [Revenue, "s10", "Revenue", 270, false],
  [Sensitivity, "s11", "Sensitivity analysis", 230, false],
  [Profitability, "s12", "Profitability", 250, false],
  [Gallery, "s13", "Gallery", 230, false],
  [Final, "s14", "Closing film", 300, true],
] as const;

export default function Page() {
  return (
    <SmoothScroll>
      <Logo3D />
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
