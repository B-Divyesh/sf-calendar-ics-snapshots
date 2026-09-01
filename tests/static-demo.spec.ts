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
  await expect(page.getByRole("heading", { name: "Keep a recoverable calendar history." })).toHaveCount(0);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  expect(errors).toEqual([]);
});
