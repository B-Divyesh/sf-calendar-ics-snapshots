import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

type Claim = { id: string; claim: string; where: string; test: string; sandbox: string };

describe("claims contract", () => {
  it("gives every declared visitor claim one exact tagged regression check", async () => {
    const claims = JSON.parse(await readFile(".factory/claims.json", "utf8")) as Claim[];
    const testSources = await Promise.all([
      readFile("tests/product.spec.ts", "utf8"),
      readFile("src/core/ics.test.ts", "utf8"),
      readFile("scripts/release-manifest.test.ts", "utf8"),
      readFile("src-tauri/src/lib.rs", "utf8")
    ]);
    const source = testSources.join("\n");
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim.claim).not.toHaveLength(0);
      expect(claim.where).not.toHaveLength(0);
      expect(claim.sandbox).not.toHaveLength(0);
      expect(source).toContain(`@claim:${claim.id}`);
      if (claim.test.startsWith("cargo test")) expect(claim.test).toContain("native_caldav_transport");
      else expect(claim.test).toContain(`@claim:${claim.id}`);
    }
  });
});
