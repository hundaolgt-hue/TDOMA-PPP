import { src, SRC, type Sourced } from "./types";

// Sponsor identity + corporate facts — TDOMA Prospectus (Registration of
// Existing Shares) and the audited financial model. TDOMA is a
// development-stage company whose principal planned activity IS this project,
// so its "track record" is a corporate-milestone timeline, not a list of
// delivered buildings.

const PROSPECTUS = "TDOMA_Prospectus_Corporate_Details.md";
const prospectus = (loc: string) => `${PROSPECTUS} › ${loc}`;

export const sponsor = {
  name: "TDOMA Share Company",
  meaning: "Tokkummaa Daldaltoota Oromoo Markaatoo — “Unified Oromo Merchants in Merkato”",
  legalForm: "Share company under Ethiopian Commercial Code Arts. 304–509",
  headOffice: "Mexico Senga Tera Building, Addis Ketema Sub-City, Woreda 8, Addis Ababa",
  website: "www.tdoma.com",
  email: "info@tdoma.com",
  structure: "70/30 PPP with the City Government of Addis Ababa (financial model basis)",
  framework: "Full IFRS (Financial Reporting Proclamation No. 847/2014, AABE)",
  source: prospectus("Corporate details"),
} as const;

export const companyStats = {
  foundedYear: src(2019, prospectus("Registered 30 Dec 2019 G.C.")),
  shareholders: src(91, prospectus("expanded to 91 shareholders")),
  paidUpCapitalEtbM: src(21.7, prospectus("paid-up capital ETB 21.7 million")),
} satisfies Record<string, Sourced<number>>;

export type Milestone = {
  date: string;
  title: string;
  detail: string;
  source: string;
};

export const milestones: Milestone[] = [
  {
    date: "Dec 2019",
    title: "Incorporated",
    detail: "Ten founding shareholders formalise Merkato trading activities; initial subscribed capital ETB 10M (par ETB 1,000/share).",
    source: prospectus("established 30 Dec 2019, ETB 10M initial capital"),
  },
  {
    date: "Nov 2024",
    title: "Strategic reset",
    detail: "First board meeting in five years adopts new directives and MoA revisions, laying the groundwork for the development.",
    source: prospectus("first board meeting in five years, 26 Nov 2024"),
  },
  {
    date: "Jan 2026",
    title: "Feasibility completed",
    detail: "Feasibility study and strategic document prepared, outlining the project's core activities and development direction.",
    source: prospectus("feasibility study + strategic document, Jan 2026"),
  },
  {
    date: "Now",
    title: "91 shareholders",
    detail: "Paid-up capital increased to ETB 21.7M; registering existing shares. Legal land ownership not yet secured.",
    source: prospectus("91 shareholders; land not yet secured"),
  },
];
