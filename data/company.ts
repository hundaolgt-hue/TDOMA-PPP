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

// ---------------------------------------------------------------------------
// Vision, mission and core values — client-supplied corporate strategy §2.3.
// ---------------------------------------------------------------------------
const STRATEGY = "TDOMA_Corporate_Strategy §2.3 (client-supplied)";

export const vision = {
  horizon: 2035,
  body:
    "To establish TDOMA Share Company as the nation’s most trusted, premier indigenous investment holding company, setting the fiduciary standard through compliance and the principle of Dhugaa (Integrity). We envision driving sustainable economic sovereignty and technological modernization across high-growth sectors, pioneering resilient, high-yield assets across Ethiopia and the Horn of Africa by 2035.",
  source: `${STRATEGY} › 2.3.1 Vision`,
} as const;

export const mission = {
  body:
    "Our mission is to serve as a major economic catalyst by deploying the collective strength of Tokkummaa (Unity) and advanced technological solutions across high-growth sectors. We commit to maximizing shareholder value through rigorous asset diversification, driving superior operational efficiency, and actively facilitating compliant regional integration while upholding social and environmental stewardship.",
  source: `${STRATEGY} › 2.3.2 Mission`,
} as const;

export type CoreValue = {
  /** Oromo term — the Gadaa governance principle. */
  term: string;
  /** English rendering. */
  gloss: string;
  body: string;
};

// Guided by the foundational Gadaa governance principles.
export const coreValues: CoreValue[] = [
  {
    term: "Tokkummaa",
    gloss: "Unwavering Unity",
    body: "The commitment to pooling resources and collective decision-making to achieve scale and resilience.",
  },
  {
    term: "Dhugaa",
    gloss: "Absolute Integrity / Truth",
    body: "A strict adherence to transparency, IFRS standards, and regulatory compliance in all financial and operational dealings.",
  },
  {
    term: "Giddu-Galeessummaa",
    gloss: "Fairness / Centrality",
    // NOTE: the source text specifies "the 2,000 shareholders", which conflicts
    // with the prospectus figure of 91 registered holders shown in Capacity.
    // Written without the count pending client confirmation — see README/TODO.
    body: "Ensuring an equitable distribution of usage rights and benefits among shareholders, regardless of the scale of their individual investment.",
  },
  {
    term: "Safuu",
    gloss: "Ethical Environmentalism",
    // TODO_SOURCE: client text truncated mid-clause ("biophilic design and 4…").
    body: "A commitment to ecological stewardship, manifested in the project’s biophilic design.",
  },
];

export const coreValuesSource = `${STRATEGY} › 2.3.3 Core Values (Gadaa governance principles)`;

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
