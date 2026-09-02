import { spawnSync } from "node:child_process";

if (process.platform !== "linux") {
  console.log("Native desktop prerequisites are provided by this platform's Tauri toolchain.");
  process.exit(0);
}

const requiredModuleGroups = [["glib-2.0"], ["gtk+-3.0"], ["webkit2gtk-4.1"], ["javascriptcoregtk-4.1"], ["ayatana-appindicator3-0.1", "appindicator3-0.1"], ["librsvg-2.0"]];
const missingModules = () => requiredModuleGroups
  .filter((alternatives) => !alternatives.some((module) => spawnSync("pkg-config", ["--exists", module], { stdio: "ignore" }).status === 0))
  .map((alternatives) => alternatives.join(" or "));
const missingBeforeSetup = missingModules();
if (!missingBeforeSetup.length) {
  console.log("Native Linux prerequisites are installed.");
  process.exit(0);
}

if (spawnSync("apt-get", ["--version"], { stdio: "ignore" }).status !== 0) {
  console.error(`Missing native libraries: ${missingBeforeSetup.join(", ")}. Install the Tauri 2 prerequisites for this Linux distribution.`);
  process.exit(1);
}

const elevated = typeof process.getuid === "function" && process.getuid() === 0 ? [] : ["sudo"];
if (elevated.length && spawnSync("sudo", ["-n", "true"], { stdio: "ignore" }).status !== 0) {
  console.error(`Missing native libraries: ${missingBeforeSetup.join(", ")}. Run npm run setup:native with sudo access first.`);
  process.exit(1);
}

const run = (args) => {
  const command = elevated[0] || "apt-get";
  const commandArgs = elevated.length ? ["apt-get", ...args] : args;
  const result = spawnSync(command, commandArgs, { stdio: "inherit", env: { ...process.env, DEBIAN_FRONTEND: "noninteractive" } });
  if (result.status !== 0) process.exit(result.status || 1);
};

console.log(`Installing native Linux prerequisites because these modules are missing: ${missingBeforeSetup.join(", ")}`);
run(["update"]);
run(["install", "-y", "--no-install-recommends", "build-essential", "curl", "file", "libappindicator3-dev", "libglib2.0-dev", "librsvg2-dev", "libssl-dev", "libwebkit2gtk-4.1-dev", "patchelf", "pkg-config", "rpm", "wget"]);

const stillMissing = missingModules();
if (stillMissing.length) {
  console.error(`Native setup finished, but these modules are still missing: ${stillMissing.join(", ")}`);
  process.exit(1);
}
console.log("Native Linux prerequisites are installed.");
