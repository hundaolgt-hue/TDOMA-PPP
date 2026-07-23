/**
 * Data traceability gate. Scans /data for figures. `src(...)` values trace to
 * a document in /docs-source; `todo(...)` values are unsourced (TODO_SOURCE).
 * Default: report counts. --strict: exit 1 if any TODO_SOURCE remain — wire
 * this into the build for a release cut.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const strict = process.argv.includes("--strict");
const dataDir = join(process.cwd(), "data");

let todoTotal = 0;
let srcTotal = 0;
for (const file of readdirSync(dataDir).filter((f) => f.endsWith(".ts") && f !== "types.ts")) {
  const text = readFileSync(join(dataDir, file), "utf8");
  const todoCount = (text.match(/\btodo\(/g) ?? []).length;
  const srcCount = (text.match(/\bsrc\(/g) ?? []).length;
  todoTotal += todoCount;
  srcTotal += srcCount;
  console.log(`${file}: ${srcCount} sourced, ${todoCount} TODO_SOURCE`);
}

console.log(`\nSourced figures: ${srcTotal}`);
console.log(`Unsourced (TODO_SOURCE): ${todoTotal}`);
if (strict && todoTotal > 0) {
  console.error(`STRICT MODE: ${todoTotal} figure(s) still unsourced — see markers above.`);
  process.exit(1);
}
