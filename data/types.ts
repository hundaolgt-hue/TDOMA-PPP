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
