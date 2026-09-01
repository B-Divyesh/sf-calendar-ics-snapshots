import "./site.css";

const queryDemo = new URLSearchParams(location.search).get("demo") === "1";
if (queryDemo) location.replace("/demo/");

const REPO = "B-Divyesh/sf-calendar-ics-snapshots";
const RELEASE_API = `https://api.github.com/repos/${REPO}/releases/latest`;
const LICENSE_KEY = "sb_license:calendar-ics-snapshots";
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
type Platform = "macos_arm64" | "macos_x64" | "windows" | "linux";
type Release = { tag_name: string; assets?: { name: string; browser_download_url: string }[] };

function platform(): Platform {
  const hint = (navigator as Navigator & { userAgentData?: { platform: string } }).userAgentData?.platform || navigator.platform || navigator.userAgent;
  if (/mac/i.test(hint)) return /arm|aarch64/i.test(navigator.userAgent) ? "macos_arm64" : "macos_x64";
  if (/win/i.test(hint)) return "windows";
  return "linux";
}

async function resolveDownload(): Promise<void> {
  const button = document.querySelector<HTMLAnchorElement>("#download-button")!;
  const note = document.querySelector<HTMLElement>("#platform-note")!;
  const selected = platform();
  const label = selected.startsWith("macos") ? "macOS" : selected === "windows" ? "Windows" : "Linux";
  try {
    const cacheKey = "calendar-snapshotter:release:v1";
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null") as { savedAt: number; release: Release } | null;
    const releaseResponse = cached && Date.now() - cached.savedAt < 3_600_000 ? undefined : await fetch(RELEASE_API, { cache: "no-cache" });
    if (releaseResponse && !releaseResponse.ok) throw new Error("No published release");
    const release = cached && !releaseResponse ? cached.release : await releaseResponse!.json() as Release;
    if (releaseResponse) localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), release }));
    const patterns: Record<Platform, RegExp> = {
      macos_arm64: /(aarch64|arm64).*\.dmg$/i,
      macos_x64: /(x64|x86_64).*\.dmg$/i,
      windows: /(setup.*\.exe|\.msi)$/i,
      linux: /\.AppImage$/i
    };
    const asset = release.assets?.find((item) => patterns[selected].test(item.name));
    if (!asset?.browser_download_url) throw new Error("Platform asset missing");
    button.href = asset.browser_download_url;
    button.textContent = `Download for ${label} on GitHub`;
    note.textContent = `${release.tag_name} · checksum published`;
  } catch {
    button.textContent = "View releases on GitHub";
    note.textContent = "Downloads are being published. The release page will update soon.";
  }
}

function captureReturnedLicense(): string {
  const url = new URL(location.href);
  const token = url.searchParams.get("license");
  if (token) {
    localStorage.setItem(LICENSE_KEY, token);
    localStorage.removeItem(VERDICT_KEY);
    url.searchParams.delete("license");
    history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }
  return token || localStorage.getItem(LICENSE_KEY) || "";
}

async function verifyLicense(token: string): Promise<boolean> {
  const cached = (() => { try { return JSON.parse(localStorage.getItem(VERDICT_KEY) || "null") as { valid: boolean; checkedAt: number } | null; } catch { return null; } })();
  if (cached && Date.now() - cached.checkedAt < 86_400_000) return cached.valid;
  const response = await fetch(`https://api.sociobot.in/api/v1/products/calendar-ics-snapshots/verify?license=${encodeURIComponent(token)}`);
  const verdict = await response.json() as { valid: boolean };
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: verdict.valid, checkedAt: Date.now() }));
  return verdict.valid;
}

const returnedToken = queryDemo ? "" : captureReturnedLicense();
const form = document.querySelector<HTMLFormElement>("#license-form");
const field = document.querySelector<HTMLInputElement>("#license-token");
if (form && field) {
  if (returnedToken) { form.hidden = false; field.value = returnedToken; }
  document.querySelector("#have-license")?.addEventListener("click", () => { form.hidden = !form.hidden; if (!form.hidden) field.focus(); });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.querySelector<HTMLElement>("#license-status")!;
    const token = field.value.trim();
    localStorage.setItem(LICENSE_KEY, token);
    localStorage.removeItem(VERDICT_KEY);
    status.textContent = "Checking license…";
    try {
      const valid = await verifyLicense(token);
      status.textContent = valid ? "License verified. Paste this token into the desktop app to unlock scheduling." : "That license is not active for Calendar Snapshotter.";
    } catch { status.textContent = "The license service could not be reached. Try again when online."; }
  });
}
if (!queryDemo && document.querySelector("#download-button")) void resolveDownload();

document.querySelector("#reset-demo")?.addEventListener("click", async () => {
  const status = document.querySelector<HTMLElement>("#demo-status");
  try {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase("demo:calendar-snapshotter");
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    if (status) status.textContent = "The sample vault was reset.";
  } catch {
    if (status) status.textContent = "Close the desktop app, then reset the sample again.";
  }
});
