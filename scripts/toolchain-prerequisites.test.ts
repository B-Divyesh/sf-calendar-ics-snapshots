import { spawnSync } from "node:child_process";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("development prerequisites", () => {
  it("@claim:runtime-requirements pins and runs the documented Node and Rust toolchains", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as { engines?: { node?: string } };
    const toolchain = await readFile("rust-toolchain.toml", "utf8");
    const workflow = await readFile(".github/workflows/release.yml", "utf8");
    const nodeMajor = Number(process.versions.node.split(".")[0]);
    const rustc = spawnSync("rustc", ["--version"], { encoding: "utf8" });
    const activeToolchain = spawnSync("rustup", ["show", "active-toolchain"], { encoding: "utf8" });

    expect(packageJson.engines?.node).toBe(">=22");
    expect(nodeMajor).toBeGreaterThanOrEqual(22);
    expect(toolchain).toMatch(/channel\s*=\s*"stable"/);
    expect(rustc.status, rustc.stderr).toBe(0);
    expect(rustc.stdout).toMatch(/^rustc \d+\.\d+\.\d+ /);
    expect(activeToolchain.status, activeToolchain.stderr).toBe(0);
    expect(activeToolchain.stdout).toMatch(/^stable-/);
    expect(workflow).toMatch(/node-version:\s*22/);
    expect(workflow).toContain("dtolnay/rust-toolchain@stable");
  });

  it("@claim:native-prerequisite-setup installs missing Ubuntu or Debian libraries once", async () => {
    if (process.platform !== "linux") return;

    const fixture = await mkdtemp(join(tmpdir(), "calendar-native-setup-"));
    const bin = join(fixture, "bin");
    const marker = join(fixture, "installed");
    const log = join(fixture, "apt.log");
    const requiredModules = [
      "glib-2.0",
      "gtk+-3.0",
      "webkit2gtk-4.1",
      "javascriptcoregtk-4.1",
      "ayatana-appindicator3-0.1",
      "librsvg-2.0"
    ];

    try {
      await import("node:fs/promises").then(({ mkdir }) => mkdir(bin));
      await writeFile(join(bin, "pkg-config"), `#!/bin/sh
if [ "\${1:-}" = "--exists" ] && [ -f "$FIXTURE_MARKER" ]; then exit 0; fi
exit 1
`);
      await writeFile(join(bin, "apt-get"), `#!/bin/sh
if [ "\${1:-}" = "--version" ]; then echo "apt fixture"; exit 0; fi
printf '%s\\n' "$*" >> "$FIXTURE_APT_LOG"
if [ "\${1:-}" = "install" ]; then : > "$FIXTURE_MARKER"; fi
`);
      await writeFile(join(bin, "sudo"), `#!/bin/sh
if [ "\${1:-}" = "-n" ]; then exit 0; fi
exec "$@"
`);
      await Promise.all(["pkg-config", "apt-get", "sudo"].map((name) => chmod(join(bin, name), 0o755)));

      const environment = {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        FIXTURE_MARKER: marker,
        FIXTURE_APT_LOG: log
      };
      for (const module of requiredModules) {
        expect(spawnSync("pkg-config", ["--exists", module], { env: environment }).status).not.toBe(0);
      }

      const first = spawnSync(process.execPath, ["scripts/setup-native-prerequisites.mjs"], { cwd: process.cwd(), env: environment, encoding: "utf8" });
      expect(first.status, first.stderr).toBe(0);
      expect(first.stdout).toContain("Installing native Linux prerequisites because these modules are missing:");
      expect(first.stdout).toContain("Native Linux prerequisites are installed.");
      for (const module of requiredModules) {
        expect(spawnSync("pkg-config", ["--exists", module], { env: environment }).status).toBe(0);
      }

      const firstLog = await readFile(log, "utf8");
      expect(firstLog).toContain("update");
      expect(firstLog).toContain("install -y --no-install-recommends");
      for (const packageName of ["libappindicator3-dev", "libglib2.0-dev", "librsvg2-dev", "libwebkit2gtk-4.1-dev", "pkg-config"]) {
        expect(firstLog).toContain(packageName);
      }

      const second = spawnSync(process.execPath, ["scripts/setup-native-prerequisites.mjs"], { cwd: process.cwd(), env: environment, encoding: "utf8" });
      expect(second.status, second.stderr).toBe(0);
      expect(second.stdout.trim()).toBe("Native Linux prerequisites are installed.");
      expect(await readFile(log, "utf8")).toBe(firstLog);
    } finally {
      await rm(fixture, { recursive: true, force: true });
    }
  });
});
