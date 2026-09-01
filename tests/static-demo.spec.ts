import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("production static landing opens the isolated desktop sample instead of falling back to landing", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

  await page.goto("http://127.0.0.1:4175/");
  await page.getByRole("link", { name: "Try it with sample data" }).click();

  await expect(page).toHaveURL("http://127.0.0.1:4175/demo/");
  await expect(page.getByText("Demo — sample data, nothing is saved to your archive.")).toBeVisible();
  await expect(page.locator(".snapshot-item")).toHaveCount(2);
  await expect(page.getByText("Airport train")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1, name: "Review changes in the sample calendar." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Keep a recoverable calendar history." })).toHaveCount(0);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  expect(errors).toEqual([]);
});

test("production static site serves the designed 404 with an HTTP 404 status", async ({ page }) => {
  const response = await page.goto("http://127.0.0.1:4175/definitely-missing-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "This page is not in the archive." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Go to the home page" })).toBeVisible();
});

test("every public static route ships complete sharing and touch metadata", async ({ page, request }) => {
  const routes = ["/", "/demo/", "/privacy/", "/terms/"];
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:4175${route}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /calendar-ics-snapshots\.sociobot\.in/);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/apple-touch-icon.png");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Calendar Snapshotter/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /calendar-snapshotter-social\.jpg/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", /calendar-snapshotter-social\.jpg/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  }
  const social = await request.get("http://127.0.0.1:4175/assets/calendar-snapshotter-social.jpg");
  expect(social.ok()).toBe(true);
});

test("public routes share navigation, legal links, one task heading, and route focus", async ({ page }) => {
  for (const route of ["/", "/demo/", "/privacy/", "/terms/"]) {
    await page.goto(`http://127.0.0.1:4175${route}`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("header nav").first().getByRole("link")).toHaveText(["Home", "Demo", "Privacy", "Terms"]);
    await expect(page.locator("footer").getByRole("link", { name: "Privacy" })).toBeVisible();
    await expect(page.locator("footer").getByRole("link", { name: "Terms" })).toBeVisible();
  }

  await page.goto("http://127.0.0.1:4175/");
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  const previousScroll = await page.evaluate(() => scrollY);
  await page.locator("header").getByRole("link", { name: "Privacy" }).click();
  await expect(page).toHaveTitle("Privacy — Calendar Snapshotter");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveTitle("Calendar Snapshotter — recover calendar changes");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  expect(await page.evaluate(() => scrollY)).toBeGreaterThanOrEqual(previousScroll - 2);

  await page.goto("http://127.0.0.1:4175/demo/");
  await page.locator("footer").getByRole("link", { name: "Terms" }).click();
  await expect(page).toHaveTitle("Terms — Calendar Snapshotter");
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
});

test("@claim:license-sales-paused sales pause is explicit and no public route exposes the dead checkout", async ({ page }) => {
  await page.goto("http://127.0.0.1:4175/");
  await expect(page.getByRole("heading", { name: "Scheduling sales are paused." })).toBeVisible();
  await expect(page.locator('a[href*="/checkout"]')).toHaveCount(0);
});
