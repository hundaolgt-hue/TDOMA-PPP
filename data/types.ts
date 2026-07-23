/**
 * Every figure rendered on screen must trace to a document in /docs-source.
 * Until real documents are dropped in, values are greybox placeholders tagged
 * TODO_SOURCE — `npm run validate:data:strict` fails the build while any remain.
 */
export const TODO_SOURCE = "TODO_SOURCE" as const;

export type Sourced<T> = {
  value: T;
  /** Filename + locator inside /docs-source, or TODO_SOURCE. */
  source: string;
};

export const todo = <T,>(value: T): Sourced<T> => ({ value, source: TODO_SOURCE });

/** A figure traced to a real document in /docs-source. */
export const src = <T,>(value: T, source: string): Sourced<T> => ({ value, source });

// Canonical source locators (filename + sheet/page inside /docs-source).
export const SRC = {
  fin: (loc: string) => `TDOMA_Liiban_Financial_Model_v2_AUDITED.xlsx › ${loc}`,
  boq: (loc: string) => `TDOMA_Merkato_BOQ.xlsx › ${loc}`,
  area: (loc: string) => `TDOMA_Merkato_Area_Allocation_Matrix.pdf › ${loc}`,
} as const;

