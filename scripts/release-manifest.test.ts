import { describe, expect, it } from "vitest";
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("release workflow", () => {
  it("@claim:release-packaging publishes checksums and a platform manifest", async () => {
    const workflow = await readFile(".github/workflows/release.yml", "utf8");
    expect(workflow).toContain("softprops/action-gh-release");
    expect(workflow).toContain("latest.json");
    expect(workflow).toContain("SHA256SUMS");
    expect(workflow).toContain("macos-latest");
    expect(workflow).toContain("windows-latest");
    expect(workflow).toContain("ubuntu-latest");
  });

  it("@claim:unsigned-preview does not configure macOS or Windows code signing", async () => {
    const workflow = await readFile(".github/workflows/release.yml", "utf8");
    const tauri = await readFile("src-tauri/tauri.conf.json", "utf8");
    expect(workflow).not.toContain("APPLE_CERTIFICATE");
    expect(workflow).not.toContain("WINDOWS_CERT_PFX");
    expect(tauri).not.toContain("signingIdentity");
  });

  it("@claim:site-response-policy regression: unknown static routes use the styled 404 response instead of the landing fallback", async () => {
    const config = JSON.parse(await readFile("public/staticwebapp.config.json", "utf8")) as {
      navigationFallback?: unknown;
      responseOverrides?: Record<string, { rewrite?: string }>;
      globalHeaders?: Record<string, string>;
    };
    expect(config.navigationFallback).toBeUndefined();
    expect(config.responseOverrides?.["404"]?.rewrite).toBe("/404.html");
    expect(config.globalHeaders?.["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders?.["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("@claim:checksum-install stops a mismatched download before it reaches the install directory", async () => {
    if (process.platform !== "linux") {
      const installer = await readFile("public/install.sh", "utf8");
      expect(installer).toContain("sha256sum");
      expect(installer).toContain("Checksum verification failed; nothing was installed.");
      return;
    }
    const workspace = await mkdtemp(join(tmpdir(), "calendar-snapshotter-install-"));
    const bin = join(workspace, "bin");
    const destination = join(workspace, "installed");
    const manifest = join(workspace, "latest.json");
    const asset = join(workspace, "Calendar-Snapshotter.AppImage");
    await mkdir(bin);
    await writeFile(asset, "safe sample AppImage payload\n");
    const sha256 = spawnSync("sha256sum", [asset], { encoding: "utf8" }).stdout.split(/\s+/)[0];
    await writeFile(manifest, JSON.stringify({ platforms: { linux: { url: "https://downloads.example/Calendar-Snapshotter.AppImage", sha256 } } }));
    await writeFile(join(bin, "curl"), `#!/bin/sh
set -eu
url=""
target=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    -o) target="$2"; shift 2 ;;
    http*) url="$1"; shift ;;
    *) shift ;;
  esac
done
case "$url" in
  *latest.json) cp "$LATEST_JSON_PATH" "$target" ;;
  *) cp "$ASSET_PATH" "$target" ;;
esac
`);
    await writeFile(join(bin, "uname"), `#!/bin/sh
if [ "\${1:-}" = "-s" ]; then echo Linux; else echo x86_64; fi
`);
    await chmod(join(bin, "curl"), 0o755);
    await chmod(join(bin, "uname"), 0o755);
    const environment = {
      ...process.env,
      PATH: `${bin}:${process.env.PATH}`,
      ASSET_PATH: asset,
      LATEST_JSON_PATH: manifest,
      XDG_BIN_HOME: destination
    };
    try {
      const installed = spawnSync("sh", ["public/install.sh"], { cwd: process.cwd(), env: environment, encoding: "utf8" });
      expect(installed.status).toBe(0);
      expect(await readFile(join(destination, "calendar-snapshotter"), "utf8")).toBe("safe sample AppImage payload\n");

      await writeFile(manifest, JSON.stringify({ platforms: { linux: { url: "https://downloads.example/Calendar-Snapshotter.AppImage", sha256: "0".repeat(64) } } }));
      await rm(join(destination, "calendar-snapshotter"));
      const rejected = spawnSync("sh", ["public/install.sh"], { cwd: process.cwd(), env: environment, encoding: "utf8" });
      expect(rejected.status).toBe(1);
      expect(rejected.stderr).toContain("Checksum verification failed");
      expect(existsSync(join(destination, "calendar-snapshotter"))).toBe(false);
    } finally {
      await rm(workspace, { recursive: true, force: true });
    }
  });
});
