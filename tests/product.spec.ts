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

test("@claim:calendar-recovery a deleted event can be found and exported in under two minutes", async ({ page }) => {
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
  await expect(page.getByText("For people who rely on changing calendars")).toBeVisible();
  const action = page.getByRole("link", { name: "Try it with sample data" });
  const outcome = page.getByText("Opens a safe sample project.");
  await expect(action).toBeVisible();
  await expect(outcome).toBeVisible();
  await expect(page.getByText("New scheduling licenses are not currently for sale.")).toBeVisible();
  const [actionBox, outcomeBox] = await Promise.all([action.boundingBox(), outcome.boundingBox()]);
  expect(actionBox && actionBox.y + actionBox.height).toBeLessThanOrEqual(844);
  expect(outcomeBox && outcomeBox.y + outcomeBox.height).toBeLessThanOrEqual(844);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("@claim:sample-project landing demo action opens the shipped isolated sample instead of the landing page", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/");
  await page.getByRole("link", { name: "Try it with sample data" }).click();
  await expect(page).toHaveURL(/\/demo\/$/);
  await expect(page.getByText("Demo — sample data, nothing is saved to your archive.")).toBeVisible();
  await expect(page.locator(".snapshot-item")).toHaveCount(2);
  await expect(page.getByText("Northstar studio week").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Review changes in the sample calendar." })).toBeVisible();
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
  const restore = await readFile((await download.path())!, "utf8");
  expect(restore).toContain("BEGIN:VCALENDAR");
  expect(restore).toContain("VERSION:2.0");
  expect(restore).toContain("BEGIN:VTIMEZONE");
  expect(restore).toContain("Airport train");
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

test("@claim:demo-reset restores the seed and leaves real storage untouched", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/demo/");
  await page.evaluate(async () => await new Promise<void>((resolve, reject) => {
    const open = indexedDB.open("calendar-snapshotter", 1);
    open.onupgradeneeded = () => open.result.createObjectStore("sentinels");
    open.onsuccess = () => {
      const db = open.result;
      const transaction = db.transaction("sentinels", "readwrite");
      transaction.objectStore("sentinels").put("real-data", "keep");
      transaction.oncomplete = () => { db.close(); resolve(); };
      transaction.onerror = () => reject(transaction.error);
    };
    open.onerror = () => reject(open.error);
  }));
  const added = wrap(event("reset-check", "20260918T100000", "Reset check"));
  await page.locator("#ics-file").setInputFiles({ name: "reset-check.ics", mimeType: "text/calendar", buffer: Buffer.from(added) });
  await expect(page.locator(".snapshot-item")).toHaveCount(3);
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.locator(".snapshot-item")).toHaveCount(2);
  await expect(page.getByText("Reset check")).toHaveCount(0);
  const sentinel = await page.evaluate(async () => await new Promise((resolve, reject) => {
    const open = indexedDB.open("calendar-snapshotter");
    open.onsuccess = () => {
      const db = open.result;
      const get = db.transaction("sentinels", "readonly").objectStore("sentinels").get("keep");
      get.onsuccess = () => { db.close(); resolve(get.result); };
      get.onerror = () => reject(get.error);
    };
    open.onerror = () => reject(open.error);
  }));
  expect(sentinel).toBe("real-data");
});

test("@claim:license-price keeps core recovery features free and exposes no dead checkout", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/");
  await expect(page.getByText("New scheduling licenses are not currently for sale.").first()).toBeVisible();
  await expect(page.getByText(/Manual calendar copies, change review, full archive backup, and restore files remain free/)).toBeVisible();
  await expect(page.locator('a[href*="/checkout"]')).toHaveCount(0);
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

test("@claim:passphrase-no-recovery rejects a different vault passphrase", async ({ page }) => {
  await page.goto("http://127.0.0.1:1420/");
  await page.getByLabel("Vault passphrase").fill("correct horse battery staple");
  await page.getByLabel("Repeat passphrase").fill("correct horse battery staple");
  await page.getByRole("button", { name: "Create archive" }).click();
  await page.getByRole("button", { name: "Lock vault" }).click();
  await page.getByLabel("Vault passphrase").fill("a different long passphrase");
  await page.getByRole("button", { name: "Unlock archive" }).click();
  await expect(page.locator("#status")).toContainText("did not unlock this vault");
  await expect(page.getByRole("heading", { name: "Unlock your archive" })).toBeVisible();
});

test("@claim:archive-roundtrip exports and restores all calendar copies and connection settings", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("sb_license:calendar-ics-snapshots", "sample-license");
    localStorage.setItem("sb_license:calendar-ics-snapshots:verdict", JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.goto("http://127.0.0.1:1420/");
  await page.getByLabel("Vault passphrase").fill("correct horse battery staple");
  await page.getByLabel("Repeat passphrase").fill("correct horse battery staple");
  await page.getByRole("button", { name: "Create archive" }).click();
  const first = wrap(event("archive-one", "20260910T100000", "Archive original"));
  await page.locator("#ics-file").setInputFiles({ name: "archive.ics", mimeType: "text/calendar", buffer: Buffer.from(first) });
  await page.getByRole("button", { name: "Calendar server schedule" }).click();
  await page.locator("#caldav-url").fill("https://calendar.example.test/archive");
  await page.locator("#caldav-user").fill("saved-user");
  await page.locator("#caldav-password").fill("saved-password");
  await page.getByRole("button", { name: "Save connection" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export encrypted archive" }).click();
  const archive = await downloadPromise;
  const archivePath = (await archive.path())!;
  const archiveText = await readFile(archivePath, "utf8");
  expect(archiveText).not.toContain("Archive original");
  expect(archiveText).not.toContain("saved-password");

  const second = wrap(event("archive-two", "20260911T100000", "Later local change"));
  await page.locator("#ics-file").setInputFiles({ name: "later.ics", mimeType: "text/calendar", buffer: Buffer.from(second) });
  await expect(page.locator(".snapshot-item")).toHaveCount(2);
  await page.locator("#archive-file").setInputFiles(archivePath);
  await page.getByLabel("Archive passphrase").fill("correct horse battery staple");
  await page.locator("#archive-import-form").getByRole("button", { name: "Import encrypted archive" }).click();
  await expect(page.locator(".snapshot-item")).toHaveCount(1);
  await expect(page.getByText("Archive original")).toBeVisible();
  await expect(page.getByText("Later local change")).toHaveCount(0);
  await page.getByRole("button", { name: "Calendar server schedule" }).click();
  await expect(page.locator("#caldav-url")).toHaveValue("https://calendar.example.test/archive");
  await expect(page.locator("#caldav-user")).toHaveValue("saved-user");
});

test("@claim:archive-wrong-passphrase rejects an archive without changing the open vault", async ({ page }) => {
  await page.goto("http://127.0.0.1:1420/");
  await page.getByLabel("Vault passphrase").fill("correct horse battery staple");
  await page.getByLabel("Repeat passphrase").fill("correct horse battery staple");
  await page.getByRole("button", { name: "Create archive" }).click();
  const original = wrap(event("safe", "20260910T100000", "Safe original"));
  await page.locator("#ics-file").setInputFiles({ name: "safe.ics", mimeType: "text/calendar", buffer: Buffer.from(original) });
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export encrypted archive" }).click();
  const archivePath = (await (await downloadPromise).path())!;
  const later = wrap(event("later", "20260911T100000", "Keep this current copy"));
  await page.locator("#ics-file").setInputFiles({ name: "later.ics", mimeType: "text/calendar", buffer: Buffer.from(later) });
  await page.locator("#archive-file").setInputFiles(archivePath);
  await page.getByLabel("Archive passphrase").fill("definitely wrong passphrase");
  await page.locator("#archive-import-form").getByRole("button", { name: "Import encrypted archive" }).click();
  await expect(page.locator("#archive-status")).toContainText("did not unlock this encrypted archive");
  await expect(page.locator(".snapshot-item")).toHaveCount(2);
  await expect(page.getByText("Keep this current copy")).toBeVisible();
});

test("@claim:license-token-only @claim:invalid-license-locks-scheduling sends only the token and keeps invalid licenses locked", async ({ page }) => {
  const requests: { url: string; method: string; postData: string | null }[] = [];
  await page.route("https://api.sociobot.in/api/v1/products/calendar-ics-snapshots/verify?*", async (route) => {
    const request = route.request();
    requests.push({ url: request.url(), method: request.method(), postData: request.postData() });
    await route.fulfill({ json: { valid: false, reason: "invalid" } });
  });
  await page.goto("http://127.0.0.1:1420/");
  await page.getByLabel("Vault passphrase").fill("correct horse battery staple");
  await page.getByLabel("Repeat passphrase").fill("correct horse battery staple");
  await page.getByRole("button", { name: "Create archive" }).click();
  await page.getByRole("button", { name: "View the scheduling license" }).click();
  await page.getByLabel("Enter an existing license token").fill("token-only-value");
  await page.getByRole("button", { name: "Verify license" }).click();
  await expect(page.locator("#license-status")).toContainText("not active");
  expect(requests).toHaveLength(1);
  expect(requests[0].method).toBe("GET");
  expect(new URL(requests[0].url).searchParams.get("license")).toBe("token-only-value");
  expect(requests[0].postData).toBeNull();
  expect(requests[0].url).not.toContain("calendar copy");
  await page.locator("[data-close-license]").click();
  await page.getByRole("button", { name: "Calendar server schedule" }).click();
  await expect(page.locator("#settings-dialog").getByRole("button", { name: "View the scheduling license" })).toBeVisible();
});

test("@claim:free-accessibility-export keeps keyboard export and accessibility available without a license", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/demo/");
  expect(await page.evaluate(() => localStorage.getItem("sb_license:calendar-ics-snapshots"))).toBeNull();
  await page.locator(".change-row.cancelled input").focus();
  await page.keyboard.press("Space");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export 1 event" }).focus();
  await page.keyboard.press("Enter");
  await downloadPromise;
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
});

test("@claim:unchanged-refresh keeps an unchanged import out of the archive", async ({ page }) => {
  await page.goto("http://127.0.0.1:1420/");
  await page.getByLabel("Vault passphrase").fill("correct horse battery staple");
  await page.getByLabel("Repeat passphrase").fill("correct horse battery staple");
  await page.getByRole("button", { name: "Create archive" }).click();
  const copy = wrap(event("unchanged", "20260910T100000", "Planning review"));
  await page.locator("#ics-file").setInputFiles({ name: "unchanged.ics", mimeType: "text/calendar", buffer: Buffer.from(copy) });
  await expect(page.locator(".snapshot-item")).toHaveCount(1);
  await page.locator("#ics-file").setInputFiles({ name: "unchanged.ics", mimeType: "text/calendar", buffer: Buffer.from(copy) });
  await expect(page.locator("#status")).toContainText("latest encrypted calendar copy is already current");
  await expect(page.locator(".snapshot-item")).toHaveCount(1);
});

test("@claim:calendar-connection @claim:scheduled-caldav @claim:encrypted-caldav-credentials saves protected calendar details and records a scheduled connection", async ({ page }) => {
  const connectionUrl = "https://calendar.example.test/team-calendar";
  const connectionUser = "archive-user";
  const connectionPassword = "app-password-kept-private";
  const remoteCalendar = wrap(event("remote", "20260912T100000", "Connected calendar copy"));
  let connectionRequests = 0;
  await page.clock.install({ time: new Date("2026-09-01T12:00:00Z") });
  await page.addInitScript(() => {
    localStorage.setItem("sb_license:calendar-ics-snapshots", "sample-license");
    localStorage.setItem("sb_license:calendar-ics-snapshots:verdict", JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.route(connectionUrl, async (route) => {
    connectionRequests += 1;
    await route.fulfill({
      contentType: "text/calendar",
      headers: { "Access-Control-Allow-Origin": "*" },
      body: remoteCalendar
    });
  });
  await page.goto("http://127.0.0.1:1420/");
  await page.getByLabel("Vault passphrase").fill("correct horse battery staple");
  await page.getByLabel("Repeat passphrase").fill("correct horse battery staple");
  await page.getByRole("button", { name: "Create archive" }).click();
  await page.getByRole("button", { name: "Calendar server schedule" }).click();
  await page.locator("#caldav-url").fill(connectionUrl);
  await page.locator("#caldav-user").fill(connectionUser);
  await page.locator("#caldav-password").fill(connectionPassword);
  await page.locator("#schedule").selectOption("15m");
  await page.getByRole("button", { name: "Save connection" }).click();

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
  const envelope = JSON.stringify(stored);
  expect(envelope).not.toContain(connectionUrl);
  expect(envelope).not.toContain(connectionUser);
  expect(envelope).not.toContain(connectionPassword);

  await page.clock.fastForward(60_000);
  await expect.poll(() => connectionRequests).toBe(1);
  await expect(page.locator(".snapshot-item")).toHaveCount(1);
  await expect(page.getByText("Connected calendar copy")).toBeVisible();
});

test("@claim:release-downloads resolves the platform download from GitHub API metadata", async ({ page }) => {
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

test("landing, footer, and demo actions meet the 44px mobile target", async ({ page }) => {
  const tooSmall = async () => page.locator("a, button").evaluateAll((elements) => elements
    .filter((element) => {
      const style = getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden";
    })
    .map((element) => {
      const box = element.getBoundingClientRect();
      return { label: (element.textContent || "").trim(), width: box.width, height: box.height };
    })
    .filter((target) => target.width > 0 && target.height > 0 && (target.width < 44 || target.height < 44)));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:4174/");
  expect(await tooSmall()).toEqual([]);
  await page.goto("http://127.0.0.1:4174/demo/");
  expect(await tooSmall()).toEqual([]);
  for (const control of ["#reset-demo", "#start-real"]) {
    const box = await page.locator(control).boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test("@claim:offline-local the sample archive remains usable after going offline", async ({ page }) => {
  await page.goto("http://127.0.0.1:4174/demo/");
  await page.context().setOffline(true);
  await page.locator(".change-row.cancelled input").check();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export 1 event" }).click();
  expect((await downloadPromise).suggestedFilename()).toContain("calendar-restore-");
});

test("@claim:no-account-import imports a calendar file in a fresh browser without account state", async ({ page }) => {
  await page.goto("http://127.0.0.1:1420/");
  expect(await page.context().cookies()).toEqual([]);
  await page.getByLabel("Vault passphrase").fill("correct horse battery staple");
  await page.getByLabel("Repeat passphrase").fill("correct horse battery staple");
  await page.getByRole("button", { name: "Create archive" }).click();
  const calendar = wrap(event("no-account", "20260910T100000", "Account-free import"));
  await page.locator("#ics-file").setInputFiles({ name: "local.ics", mimeType: "text/calendar", buffer: Buffer.from(calendar) });
  await expect(page.getByText("Account-free import")).toBeVisible();
});

test("an unavailable release has a calm download state without a console error", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.route("https://api.github.com/repos/B-Divyesh/sf-calendar-ics-snapshots/releases/latest", (route) => route.fulfill({ json: { tag_name: "v0.1.1", assets: [] } }));
  await page.goto("http://127.0.0.1:4174/");
  await expect(page.locator("#download-button")).toContainText("View releases on GitHub");
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
