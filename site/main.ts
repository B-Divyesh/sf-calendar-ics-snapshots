import "./site.css";

const REPO = "B-Divyesh/sf-calendar-ics-snapshots";
const RELEASE_API = `https://api.github.com/repos/${REPO}/releases/latest`;
const LICENSE_KEY = "sb_license:calendar-ics-snapshots";
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
type Platform = "macos_arm64" | "macos_x64" | "windows" | "linux";
type ReleaseManifest = { version: string; platforms: Record<Platform, { url: string; name: string; sha256: string }> };

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
  if (["127.0.0.1", "localhost"].includes(location.hostname)) {
    button.textContent = `Download for ${label}`;
    note.textContent = "Release manifest loads on the published site";
    return;
  }
  try {
    const releaseResponse = await fetch(RELEASE_API, { cache: "no-cache" });
    if (!releaseResponse.ok) throw new Error("No published release");
    const release = await releaseResponse.json() as { assets?: { name: string; browser_download_url: string }[] };
    const manifestAsset = release.assets?.find((asset) => asset.name === "latest.json");
    if (!manifestAsset) throw new Error("No release manifest");
    const response = await fetch(manifestAsset.browser_download_url, { cache: "no-cache" });
    if (!response.ok) throw new Error("Release manifest unavailable");
    const manifest = await response.json() as ReleaseManifest;
    const asset = manifest.platforms[selected];
    if (!asset?.url) throw new Error("Platform asset missing");
    button.href = asset.url;
    button.textContent = `Download for ${label}`;
    note.textContent = `${manifest.version} · checksum published`;
  } catch {
    button.textContent = "View available downloads";
    note.textContent = "Release assets are listed on GitHub";
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

const returnedToken = captureReturnedLicense();
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
if (document.querySelector("#download-button")) void resolveDownload();
