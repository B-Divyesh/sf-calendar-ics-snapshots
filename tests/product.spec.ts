import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

const wrap = (events: string) => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nX-WR-CALNAME:Work week\r\nBEGIN:VTIMEZONE\r\nTZID:Europe/Paris\r\nEND:VTIMEZONE\r\n${events}END:VCALENDAR\r\n`;
const event = (uid: string, time: string, name: string) => `BEGIN:VEVENT\r\nUID:${uid}\r\nDTSTART;TZID=Europe/Paris:${time}\r\nDTEND;TZID=Europe/Paris:${time.slice(0,9)}110000\r\nSUMMARY:${name}\r\nEND:VEVENT\r\n`;

test("landing page meets the semantic and serious accessibility baseline", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("http://127.0.0.1:4174/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.locator(".hero-plate img")).toHaveJSProperty("complete", true);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  expect(errors).toEqual([]);
});

test("a deleted event can be found and exported in under two minutes", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") runtimeErrors.push(message.text()); });
  page.on("requestfailed", (request) => runtimeErrors.push(`${request.url()}: ${request.failure()?.errorText}`));
  await page.goto("http://127.0.0.1:1420/");
  await page.waitForTimeout(300);
  expect(runtimeErrors).toEqual([]);
  await expect(page.locator("#app")).not.toBeEmpty();
  await page.getByLabel("Vault passphrase").fill("correct horse battery staple");
  await page.getByLabel("Repeat passphrase").fill("correct horse battery staple");
  await page.getByRole("button", { name: "Create archive" }).click();
  await expect(page.getByRole("heading", { name: "Make the current calendar recoverable." })).toBeVisible();

  const before = wrap(event("planning", "20260828T100000", "Planning review") + event("flight", "20260829T090000", "Airport train"));
  const after = wrap(event("planning", "20260828T120000", "Planning review"));
  await page.locator("#ics-file").setInputFiles({ name: "work.ics", mimeType: "text/calendar", buffer: Buffer.from(before) });
  await expect(page.locator(".edition-header .edition-count")).toContainText("2events held");
  await page.locator("#ics-file").setInputFiles({ name: "work.ics", mimeType: "text/calendar", buffer: Buffer.from(after) });
  await expect(page.getByText("Airport train")).toBeVisible();
  await expect(page.getByText("Planning review")).toBeVisible();
  await expect(page.locator(".change-kind", { hasText: "cancelled" })).toHaveCount(1);
  await expect(page.locator(".change-kind", { hasText: "moved" })).toHaveCount(1);

  await page.locator(".change-row.cancelled input").check();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export 1 event" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^calendar-restore-.*\.ics$/);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
});

test("landing composition remains usable at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:4174/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#download-button")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("@claim:sample-project landing demo action opens the shipped isolated sample instead of the landing page", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/");
  await page.getByRole("link", { name: "Try it with sample data" }).click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText("Demo — sample data, nothing is saved to your archive.")).toBeVisible();
  await expect(page.locator(".snapshot-item")).toHaveCount(2);
  await expect(page.getByText("Northstar studio week").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Calendar Snapshotter" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Keep a recoverable calendar history." })).toHaveCount(0);
});

test("@claim:calendar-diff shows moved and cancelled events in the sample", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/demo/");
  await expect(page.getByText("Airport train")).toBeVisible();
  await expect(page.locator(".change-kind", { hasText: "cancelled" })).toHaveCount(1);
  await expect(page.locator(".change-kind", { hasText: "moved" })).toHaveCount(1);
});

test("@claim:ics-restore-export exports the selected sample event as ICS", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/demo/");
  await page.locator(".change-row.cancelled input").check();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export 1 event" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^calendar-restore-.*\.ics$/);
  expect(await readFile((await download.path())!, "utf8")).toContain("Airport train");
});

test("@claim:demo-private @claim:no-event-telemetry uses only the demo database and no external requests", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.goto("http://127.0.0.1:4174/demo/");
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(databases).toContain("demo:calendar-snapshotter");
  expect(databases).not.toContain("calendar-snapshotter");
  expect(requests.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
});

test("@claim:license-price states the one-time US$29 license and free manual restore path", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/");
  await expect(page.getByText("One-time scheduling license: US$29.")).toBeVisible();
  await expect(page.getByText(/Free features include manual ICS copies, change review, and restore export/)).toBeVisible();
});

test("@claim:encrypted-local-vault stores imported event text outside the IndexedDB envelope", async ({ page }) => {
  await page.goto("http://127.0.0.1:1420/");
  await page.getByLabel("Vault passphrase").fill("correct horse battery staple");
  await page.getByLabel("Repeat passphrase").fill("correct horse battery staple");
  await page.getByRole("button", { name: "Create archive" }).click();
  const privateEvent = wrap(event("private", "20260910T100000", "Unencrypted title must not appear"));
  await page.locator("#ics-file").setInputFiles({ name: "private.ics", mimeType: "text/calendar", buffer: Buffer.from(privateEvent) });
  const stored = await page.evaluate(async () => await new Promise<unknown>((resolve, reject) => {
    const open = indexedDB.open("calendar-snapshotter");
    open.onsuccess = () => {
      const transaction = open.result.transaction("vault", "readonly");
      const get = transaction.objectStore("vault").get("primary");
      get.onsuccess = () => resolve(get.result);
      get.onerror = () => reject(get.error);
    };
    open.onerror = () => reject(open.error);
  }));
  expect(JSON.stringify(stored)).not.toContain("Unencrypted title must not appear");
});

test("release download resolution uses only the GitHub API metadata", async ({ page }) => {
  const consoleErrors: string[] = [];
  const requests: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("request", (request) => requests.push(request.url()));
  await page.route("https://api.github.com/repos/B-Divyesh/sf-calendar-ics-snapshots/releases/latest", async (route) => route.fulfill({ json: {
    tag_name: "v0.1.1",
    assets: [{ name: "Calendar-Snapshotter_0.1.1_amd64.AppImage", browser_download_url: "https://github.com/B-Divyesh/sf-calendar-ics-snapshots/releases/download/v0.1.1/Calendar-Snapshotter_0.1.1_amd64.AppImage" }]
  } }));
  await page.goto("http://127.0.0.1:4174/");
  await expect(page.locator("#download-button")).toHaveAttribute("href", /Calendar-Snapshotter_0\.1\.1_amd64\.AppImage$/);
  expect(requests.some((url) => /latest\.json/.test(url))).toBe(false);
  expect(consoleErrors).toEqual([]);
});

test("the populated app stays within 390px and keeps archive controls separate", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:4174/demo/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const heading = await page.locator(".rail-heading").boundingBox();
  const settings = await page.locator("#connection-settings").boundingBox();
  expect(heading && settings && settings.y >= heading.y + heading.height).toBe(true);
});

test("the sample archive remains usable after going offline", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/demo/");
  await page.context().setOffline(true);
  await page.locator(".change-row.cancelled input").check();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export 1 event" }).click();
  expect((await downloadPromise).suggestedFilename()).toContain("calendar-restore-");
});

test("an unavailable release has a calm download state without a console error", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.route("https://api.github.com/repos/B-Divyesh/sf-calendar-ics-snapshots/releases/latest", (route) => route.fulfill({ json: { tag_name: "v0.1.1", assets: [] } }));
  await page.goto("http://127.0.0.1:4174/");
  await expect(page.locator("#download-button")).toHaveText("View release downloads");
  await expect(page.locator("#platform-note")).toContainText("Downloads are being published");
  expect(errors).toEqual([]);
});

test("keyboard users can reach the landing demo action through the skip-link order", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/");
  await page.keyboard.press("Tab");
  await expect(page.getByText("Skip to main content")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("link", { name: "Try it with sample data" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/demo\//);
});
