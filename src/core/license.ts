export const PRODUCT_SLUG = "calendar-ics-snapshots";
export const BILLING_BASE = "https://api.sociobot.in/api/v1";
const LICENSE_KEY = `sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;

type Verdict = { valid: boolean; checkedAt: number; reason?: string };

export function captureLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get("license");
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  url.searchParams.delete("license");
  history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

export function storedLicense(): string {
  return localStorage.getItem(LICENSE_KEY) || "";
}

export function saveLicense(token: string): void {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function cachedUnlock(): boolean {
  try {
    const verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) || "null") as Verdict | null;
    return Boolean(storedLicense() && verdict?.valid);
  } catch { return false; }
}

export async function verifyLicense(force = false): Promise<Verdict> {
  const token = storedLicense();
  if (!token) return { valid: false, checkedAt: Date.now(), reason: "missing" };
  const cached = (() => { try { return JSON.parse(localStorage.getItem(VERDICT_KEY) || "null") as Verdict | null; } catch { return null; } })();
  if (!force && cached && Date.now() - cached.checkedAt < 86_400_000) return cached;
  try {
    const response = await fetch(`${BILLING_BASE}/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`);
    const body = await response.json() as { valid: boolean; reason?: string };
    const verdict = { valid: body.valid, reason: body.reason, checkedAt: Date.now() };
    localStorage.setItem(VERDICT_KEY, JSON.stringify(verdict));
    return verdict;
  } catch {
    return cached || { valid: false, checkedAt: Date.now(), reason: "offline" };
  }
}

export const checkoutUrl = `${BILLING_BASE}/products/${PRODUCT_SLUG}/checkout`;
