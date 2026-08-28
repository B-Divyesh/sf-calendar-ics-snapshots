import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
