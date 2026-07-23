/**
 * Data traceability gate. Scans /data for TODO_SOURCE-tagged figures.
 * Default: report counts (greybox mode). --strict: exit 1 if any remain —
 * wire this into the build once /docs-source is populated.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const strict = process.argv.includes("--strict");
const dataDir = join(process.cwd(), "data");

let total = 0;
for (const file of readdirSync(dataDir).filter((f) => f.endsWith(".ts") && f !== "types.ts")) {
  const text = readFileSync(join(dataDir, file), "utf8");
  const count = (text.match(/\btodo\(/g) ?? []).length;
  total += count;
  console.log(`${file}: ${count} TODO_SOURCE figure(s)`);
}

console.log(`\nTotal unsourced figures: ${total}`);
if (strict && total > 0) {
  console.error("STRICT MODE: build fails until every figure traces to /docs-source.");
  process.exit(1);
}
