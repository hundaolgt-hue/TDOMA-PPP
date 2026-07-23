import { src, todo, SRC, type Sourced } from "./types";

// Sponsor identity is sourced from the financial model's Cover sheet. A
// dedicated company-profile document has NOT been supplied — track record,
// team and delivered projects remain TODO_SOURCE until one is provided.

export const sponsor = {
  name: "TDOMA S.C.",
  project: "Liiban Smart Mall",
  descriptor: "G+15 mixed-use trade complex · Merkato, Addis Ababa",
  structure: "70/30 PPP with the City Government of Addis Ababa",
  framework: "Full IFRS (Financial Reporting Proclamation No. 847/2014, AABE)",
  source: SRC.fin("Cover"),
} as const;

// Sourced project facts stand in as the "track record" figures until a
// company profile arrives — these describe THIS development, from the model.
export const companyStats = {
  storeys: src(15, SRC.area("p1 header: G+15")),
  netGlaSqm: src(21004, SRC.area("p3/p4 TOTAL NET GLA")),
  gdvEtbBn: src(16.0, SRC.fin("Dashboard › Total GDV")),
} satisfies Record<string, Sourced<number>>;

export type DeliveredProject = {
  name: string;
  year: Sourced<number>;
  valueM: Sourced<number>;
  description: string;
};

// No company-profile document supplied — these remain unsourced placeholders.
export const deliveredProjects: DeliveredProject[] = [
  { name: "Track record pending", year: todo(2024), valueM: todo(0), description: "Awaiting the company profile document to populate delivered projects." },
];
