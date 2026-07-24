// Per-cluster detail for the programme section — TDOMA_Merkato_Area_Allocation
// _Matrix.pdf (levels, uses) + Assumptions (rent rates). Keyed by zone id.

export type ProgramDetail = {
  levels: string;
  rent: string; // ETB/m²/mo, or "—" for non-let space
  blurb: string;
};

export const programDetails: Record<string, ProgramDetail> = {
  retail: { levels: "Ground · L1 · L2", rent: "6,250", blurb: "Prime retail at grade, then Terra retail floors — textiles & fabrics, electronics & household. The highest rent/m² in the building." },
  events: { levels: "L4 · L15", rent: "—", blurb: "Column-light double-height expo / convention hall that also hosts the AGM, plus banquet & event halls and premium sky dining." },
  office: { levels: "L6 – L8", rent: "4,600", blurb: "Divisible lettable commercial office suites — retail back-office and enterprise tenants — directly above the government one-stop." },
  wholesale: { levels: "L3", rent: "4,600", blurb: "A whole floor of wholesale showrooms & trade desks — the trading engine's core, connecting merchants to buyers." },
  trade: { levels: "L5 · L9 · L10", rent: "5,625", blurb: "Government one-stop (license/tax/customs), coffee & commodity trade centre, trade finance & forex, customs clearing & arbitration." },
  culture: { levels: "L1 · L2", rent: "4,480", blurb: "Gastronomy food hall, heritage museum and artisan & craft market — the building's cultural anchor." },
  hospitality: { levels: "L12 – L13", rent: "turnover", blurb: "~38-key hotel with sky restaurant and guest amenities, leased to an operator on an IFRS-16 variable (turnover) lease." },
  hq: { levels: "L14", rent: "owner", blurb: "TDOMA executive offices, boardroom and governance suite — owner-occupied corporate headquarters." },
  business: { levels: "L11", rent: "4,600", blurb: "Business centre and co-working, the Merkato Trade Forum hall, and the forum secretariat / ombudsman." },
  civic: { levels: "L5", rent: "—", blurb: "Mosque & Orthodox chapel, clinic & diagnostics, childcare, and a traders' lounge — the community & civic layer." },
  arrival: { levels: "Ground", rent: "—", blurb: "Arrival lobby & wayfinding plus a banking / ATM hall — the front door and circulation core." },
  rooftop: { levels: "Roof crown", rent: "4,000", blurb: "Cultural coffee pavilion & sky lounge — an open-air amenity crowning the tower." },
  enterprise: { levels: "L10", rent: "5,625", blurb: "SME incubator / accelerator and a digital-commerce academy with media studios — the enterprise & digital layer." },
};
