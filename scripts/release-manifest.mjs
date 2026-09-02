import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const [directory, repository, version, sourceSha] = process.argv.slice(2);
if (!directory || !repository || !version || !/^[a-f0-9]{40}$/i.test(sourceSha || "")) {
  throw new Error("Usage: node release-manifest.mjs <directory> <owner/repo> <version> <40-character source SHA>");
}
const files = (await readdir(directory)).filter((name) => !["latest.json", "SHA256SUMS"].includes(name));
const hash = async (name) => createHash("sha256").update(await readFile(join(directory, name))).digest("hex");
const preferred = {
  macos_arm64: files.find((name) => /(aarch64|arm64).*\.dmg$/i.test(name)),
  macos_x64: files.find((name) => /(x64|x86_64).*\.dmg$/i.test(name)),
  windows: files.find((name) => /setup.*\.exe$/i.test(name)) || files.find((name) => /\.msi$/i.test(name)),
  linux: files.find((name) => /\.AppImage$/i.test(name))
};
for (const [platform, name] of Object.entries(preferred)) if (!name) throw new Error(`Missing ${platform} release asset in ${directory}`);
const platforms = Object.fromEntries(await Promise.all(Object.entries(preferred).map(async ([platform, name]) => [platform, {
  name: basename(name),
  url: `https://github.com/${repository}/releases/latest/download/${encodeURIComponent(basename(name)).replace(/%2F/g, "/")}`,
  sha256: await hash(name)
}])));
const sums = (await Promise.all(files.map(async (name) => `${await hash(name)}  ${name}`))).sort().join("\n") + "\n";
await writeFile(join(directory, "SHA256SUMS"), sums);
await writeFile(join(directory, "latest.json"), JSON.stringify({ version, source_sha: sourceSha, published_at: new Date().toISOString(), platforms }) + "\n");
