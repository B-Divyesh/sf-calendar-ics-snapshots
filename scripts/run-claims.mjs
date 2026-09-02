import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const claims = JSON.parse(await readFile(new URL("../.factory/claims.json", import.meta.url), "utf8"));
const failures = [];

for (const [index, claim] of claims.entries()) {
  console.log(`\n[${index + 1}/${claims.length}] @claim:${claim.id}\n$ ${claim.test}`);
  const result = spawnSync(claim.test, { cwd: process.cwd(), env: process.env, shell: true, stdio: "inherit" });
  if (result.status !== 0) failures.push(claim.id);
}

if (failures.length) {
  console.error(`\nFailed claims: ${failures.join(", ")}`);
  process.exit(1);
}
console.log(`\nAll ${claims.length} claim commands passed.`);
