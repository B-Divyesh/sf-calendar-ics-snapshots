import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";

describe("release workflow", () => {
  it("publishes checksums and a platform manifest", async () => {
    const workflow = await readFile(".github/workflows/release.yml", "utf8");
    expect(workflow).toContain("softprops/action-gh-release");
    expect(workflow).toContain("latest.json");
    expect(workflow).toContain("SHA256SUMS");
    expect(workflow).toContain("macos-latest");
    expect(workflow).toContain("windows-latest");
    expect(workflow).toContain("ubuntu-latest");
  });
});
