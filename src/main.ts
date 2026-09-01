import { invoke } from "@tauri-apps/api/core";
import "./styles.css";
import { buildRestoreCalendar, diffCalendars, mergeCalDavResponse, parseIcs, type CalendarChange } from "./core/ics";
import { Vault, configureVaultStorage, fingerprint, removeVaultStorage, type Snapshot } from "./core/vault";
import { cachedUnlock, captureLicense, checkoutUrl, saveLicense, storedLicense, verifyLicense } from "./core/license";
import { sampleVaultData } from "./core/sample";

const app = document.querySelector<HTMLDivElement>("#app")!;
const isTauri = "__TAURI_INTERNALS__" in window;
let vault: Vault | undefined;
let selectedSnapshotId = "";
let selectedChanges = new Set<string>();
let unlocked = cachedUnlock();
let scheduler: number | undefined;
const staticDemoRoute = /^\/demo(?:\/|$)/.test(location.pathname);
const demoMode = staticDemoRoute || new URLSearchParams(location.search).get("demo") === "1";
const DEMO_PASSPHRASE = "sample calendar vault";

if (staticDemoRoute) document.querySelector("#main")?.remove();
if (demoMode) configureVaultStorage("demo:calendar-snapshotter");

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]!));
const dateLabel = (iso: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

function announce(message: string, error = false): void {
  const region = document.querySelector<HTMLElement>("#status");
  if (region) {
    region.textContent = message;
    region.dataset.kind = error ? "error" : "ok";
  }
}

captureLicense();

async function start(): Promise<void> {
  if (demoMode) {
    if (staticDemoRoute) document.title = "Demo — Calendar Snapshotter";
    const exists = await Vault.exists();
    vault = exists ? await Vault.open(DEMO_PASSPHRASE) : await Vault.createWithData(DEMO_PASSPHRASE, await sampleVaultData());
    selectedSnapshotId = vault.data.snapshots.at(-1)?.id || "";
    renderApp();
    return;
  }
  renderLock(false);
  const exists = await Vault.exists();
  renderLock(exists);
  const verdict = await verifyLicense();
  unlocked = verdict.valid || (verdict.reason === "offline" && cachedUnlock());
}

function renderLock(exists: boolean): void {
  document.body.dataset.view = "lock";
  app.innerHTML = `
    <main id="main" class="lock-page">
      <header class="masthead compact">
        <p class="eyebrow">Local continuity desk · Edition 001</p>
        <h1>Calendar<br>Snapshotter</h1>
      </header>
      <section class="lock-panel" aria-labelledby="lock-heading">
        <p class="section-number">01 / Vault</p>
        <h2 id="lock-heading">${exists ? "Unlock your archive" : "Create your encrypted archive"}</h2>
        <p>${exists ? "Your calendar records are encrypted on this device." : "Choose a passphrase. It never leaves this device and cannot be recovered for you."}</p>
        <form id="lock-form">
          <label for="passphrase">Vault passphrase</label>
          <input id="passphrase" name="passphrase" type="password" minlength="10" autocomplete="${exists ? "current-password" : "new-password"}" required aria-describedby="pass-hint">
          ${exists ? "" : `<label for="confirm">Repeat passphrase</label><input id="confirm" name="confirm" type="password" minlength="10" autocomplete="new-password" required>`}
          <p class="field-note" id="pass-hint">At least 10 characters. Stored data uses AES-256-GCM encryption.</p>
          <button class="button primary" type="submit">${exists ? "Unlock archive" : "Create archive"}</button>
          ${exists ? "" : `<button class="button secondary" id="load-sample" type="button">Load sample project</button><p class="field-note">It opens a separate sample vault. Your archive is not read or changed.</p>`}
          <p id="status" class="status" role="status" aria-live="polite"></p>
        </form>
      </section>
      <footer class="lock-footer">No cloud account · No event telemetry · Open standard exports</footer>
    </main>`;
  document.querySelector<HTMLFormElement>("#lock-form")!.addEventListener("submit", async (event) => {
    event.preventDefault();
    const target = event.currentTarget as HTMLFormElement;
    const form = new FormData(target);
    const passphrase = String(form.get("passphrase") || "");
    if (!exists && passphrase !== String(form.get("confirm") || "")) return announce("The two passphrases do not match.", true);
    const button = target.querySelector<HTMLButtonElement>("button")!;
    button.disabled = true;
    button.textContent = exists ? "Unlocking…" : "Encrypting…";
    try {
      vault = exists ? await Vault.open(passphrase) : await Vault.create(passphrase);
      selectedSnapshotId = vault.data.snapshots.at(-1)?.id || "";
      renderApp();
      startScheduler();
    } catch (error) {
      announce(error instanceof Error ? error.message : "The archive could not be opened.", true);
      button.disabled = false;
      button.textContent = exists ? "Unlock archive" : "Create archive";
    }
  });
  document.querySelector("#load-sample")?.addEventListener("click", () => {
    const url = new URL(location.href);
    url.searchParams.set("demo", "1");
    location.assign(url.toString());
  });
}

function snapshotChanges(snapshot: Snapshot): CalendarChange[] {
  if (!vault) return [];
  const index = vault.data.snapshots.findIndex((item) => item.id === snapshot.id);
  return diffCalendars(index > 0 ? vault.data.snapshots[index - 1].ics : undefined, snapshot.ics);
}

function counts(changes: CalendarChange[]): string {
  const count = (kind: CalendarChange["kind"]) => changes.filter((change) => change.kind === kind).length;
  return `<span><b>${count("added")}</b> added</span><span><b>${count("moved")}</b> moved</span><span><b>${count("cancelled")}</b> cancelled</span>`;
}

function renderApp(): void {
  if (!vault) return;
  document.body.dataset.view = "app";
  const snapshots = vault.data.snapshots;
  const selected = snapshots.find((snapshot) => snapshot.id === selectedSnapshotId) || snapshots.at(-1);
  if (selected) selectedSnapshotId = selected.id;
  const changes = selected ? snapshotChanges(selected) : [];
  selectedChanges = new Set([...selectedChanges].filter((id) => changes.some((change) => change.id === id)));
  app.innerHTML = `
    ${demoMode ? `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved to your archive.</strong><span><button class="text-button" id="reset-demo">Reset demo</button><button class="text-button" id="start-real">Start for real</button></span></aside>` : ""}
    <header class="app-header">
      <div>
        <p class="eyebrow">Local continuity desk</p>
        <h1>Calendar Snapshotter</h1>
      </div>
      <div class="header-actions">
        <span class="connection-state" id="network-state"><span aria-hidden="true">●</span> ${navigator.onLine ? "On device" : "Offline"}</span>
        <button class="text-button" id="lock-vault">Lock vault</button>
      </div>
    </header>
    <main id="main" class="workspace">
      <aside class="archive-rail" aria-label="Snapshot archive">
        <div class="rail-heading"><span>Archive</span><b>${snapshots.length.toString().padStart(2, "0")}</b></div>
        <button class="button primary full" id="take-snapshot">Take snapshot</button>
        <input class="visually-hidden" id="ics-file" type="file" accept=".ics,text/calendar" aria-label="Choose ICS file">
        <ol class="snapshot-list">
          ${snapshots.length ? [...snapshots].reverse().map((snapshot, reverseIndex) => {
            const snapshotNumber = snapshots.length - reverseIndex;
            const active = snapshot.id === selected?.id;
            return `<li><button class="snapshot-item${active ? " active" : ""}" data-snapshot="${snapshot.id}" ${active ? 'aria-current="true"' : ""}>
              <span class="issue">№ ${snapshotNumber.toString().padStart(3, "0")}</span>
              <strong>${escapeHtml(snapshot.sourceName)}</strong>
              <time datetime="${snapshot.createdAt}">${dateLabel(snapshot.createdAt)}</time>
            </button></li>`;
          }).join("") : `<li class="empty-rail">No editions yet</li>`}
        </ol>
        <button class="text-button settings-link" id="connection-settings">CalDAV schedule</button>
      </aside>
      <section class="edition" aria-live="polite">
        ${selected ? renderEdition(selected, changes) : renderEmpty()}
      </section>
    </main>
    <footer class="app-footer">
      <p>Encrypted here. Never uploaded.</p>
      <p id="status" class="status" role="status" aria-live="polite"></p>
      <button class="text-button" id="license-button">${unlocked ? "Continuity license active" : "Unlock scheduled snapshots"}</button>
    </footer>
    <dialog id="settings-dialog" aria-labelledby="settings-title">${renderSettings()}</dialog>
    <dialog id="license-dialog" aria-labelledby="license-title">${renderLicense()}</dialog>`;
  bindAppEvents();
}

function renderEmpty(): string {
  return `<div class="empty-state">
    <p class="section-number">No. 000 / Start here</p>
    <h2>Make the current calendar recoverable.</h2>
    <p>Import an ICS export now. Each later copy becomes a new encrypted edition, with additions, moves, and cancellations called out.</p>
    <button class="button primary" data-action="choose-file">Choose an ICS file</button>
    <p class="field-note">Works with exports from Apple Calendar, Google Calendar, Outlook, and standards-compliant CalDAV servers.</p>
  </div>`;
}

function renderEdition(snapshot: Snapshot, changes: CalendarChange[]): string {
  const parsed = parseIcs(snapshot.ics);
  return `<article>
    <header class="edition-header">
      <div>
        <p class="section-number">Snapshot / ${escapeHtml(snapshot.source)}</p>
        <h2>${escapeHtml(snapshot.sourceName)}</h2>
        <time datetime="${snapshot.createdAt}">Recorded ${dateLabel(snapshot.createdAt)}</time>
      </div>
      <div class="edition-count"><b>${parsed.events.length}</b><span>events held</span></div>
    </header>
    <div class="change-strip" aria-label="Change summary">${counts(changes)}</div>
    <div class="edition-tools">
      <h3>Change desk</h3>
      <p>${changes.length ? "Select the earlier event forms you want to recover." : "No schedule changes from the preceding edition."}</p>
      <button class="button secondary" id="export-selected" ${selectedChanges.size ? "" : "disabled"}>Export ${selectedChanges.size || "selected"} event${selectedChanges.size === 1 ? "" : "s"}</button>
    </div>
    ${changes.length ? `<ul class="change-list">${changes.map((change) => `
      <li class="change-row ${change.kind}">
        <label>
          <input type="checkbox" data-change="${escapeHtml(change.id)}" ${selectedChanges.has(change.id) ? "checked" : ""}>
          <span class="proof-mark" aria-hidden="true"></span>
          <span class="change-kind">${change.kind}</span>
          <span class="change-copy"><strong>${escapeHtml(change.title)}</strong><small>${escapeHtml(change.detail)}</small></span>
        </label>
      </li>`).join("")}</ul>` : `<div class="no-changes"><span aria-hidden="true">✓</span><p><strong>This edition matches the last one.</strong><br>It is still a complete encrypted recovery point.</p></div>`}
  </article>`;
}

function renderSettings(): string {
  const connection = vault?.data.connection;
  return `<form method="dialog" id="connection-form">
    <div class="dialog-top"><p class="section-number">Automation desk</p><button class="icon-button" type="button" data-close-settings aria-label="Close settings">×</button></div>
    <h2 id="settings-title">Scheduled CalDAV snapshots</h2>
    ${unlocked ? `<p>Snapshot a calendar collection while this desktop app is running. Credentials are held inside your encrypted vault.</p>
      <label for="caldav-url">Calendar or ICS URL</label><input id="caldav-url" name="url" type="url" value="${escapeHtml(connection?.url || "")}" required>
      <label for="caldav-user">Username</label><input id="caldav-user" name="username" autocomplete="username" value="${escapeHtml(connection?.username || "")}">
      <label for="caldav-password">App password</label><input id="caldav-password" name="password" type="password" autocomplete="current-password" value="${escapeHtml(connection?.password || "")}">
      <label for="schedule">Frequency</label><select id="schedule" name="schedule">
        ${[["manual", "Only when I ask"], ["15m", "Every 15 minutes"], ["hourly", "Every hour"], ["daily", "Every day"]].map(([value, label]) => `<option value="${value}" ${connection?.schedule === value ? "selected" : ""}>${label}</option>`).join("")}
      </select>
      <p class="field-note">Runs while Calendar Snapshotter is open. Use a provider app password when available.</p>
      <div class="dialog-actions"><button class="button primary" type="submit">Save connection</button><button class="button secondary" type="button" id="run-connection">Snapshot now</button></div>`
      : `<div class="paywall-note"><span class="edition-count"><b>∞</b><span>editions</span></span><p>Automated CalDAV capture is included in the US$29 one-time continuity license. Manual ICS snapshots, diffs, and restores remain free.</p><button type="button" class="button primary" data-open-license>See the one-time license</button></div>`}
    <p id="dialog-status" class="status" role="status" aria-live="polite"></p>
  </form>`;
}

function renderLicense(): string {
  return `<div>
    <div class="dialog-top"><p class="section-number">Continuity license</p><button class="icon-button" data-close-license aria-label="Close license">×</button></div>
    <h2 id="license-title">Own the automation.<br>No subscription.</h2>
    <p><strong>US$29 one time</strong> unlocks scheduled CalDAV snapshots on this device. Manual encrypted snapshots, diffs, and all restore exports are free forever.</p>
    <a class="button primary" href="${checkoutUrl}" target="_blank" rel="noreferrer">Buy continuity license</a>
    <form id="restore-license"><label for="license-token">Have a license? Paste it here</label><input id="license-token" name="license" value="${escapeHtml(storedLicense())}" autocomplete="off" required><button class="button secondary" type="submit">Verify license</button></form>
    <p class="field-note">Sociobot/Dodo is the merchant of record. Refunds are handled there and revoke the license.</p>
    <p id="license-status" class="status" role="status" aria-live="polite">${unlocked ? "License active on this device." : ""}</p>
    <p class="legal-links"><a href="https://calendar-ics-snapshots.sociobot.in/privacy" target="_blank">Privacy</a> · <a href="https://calendar-ics-snapshots.sociobot.in/terms" target="_blank">Terms</a></p>
  </div>`;
}

function bindAppEvents(): void {
  document.querySelector("#take-snapshot")?.addEventListener("click", chooseFile);
  document.querySelector("[data-action=choose-file]")?.addEventListener("click", chooseFile);
  document.querySelector<HTMLInputElement>("#ics-file")?.addEventListener("change", importFile);
  document.querySelectorAll<HTMLButtonElement>("[data-snapshot]").forEach((button) => button.addEventListener("click", () => {
    selectedSnapshotId = button.dataset.snapshot || "";
    selectedChanges.clear();
    renderApp();
  }));
  document.querySelectorAll<HTMLInputElement>("[data-change]").forEach((checkbox) => checkbox.addEventListener("change", () => {
    if (checkbox.checked) selectedChanges.add(checkbox.dataset.change!); else selectedChanges.delete(checkbox.dataset.change!);
    const exportButton = document.querySelector<HTMLButtonElement>("#export-selected")!;
    exportButton.disabled = !selectedChanges.size;
    exportButton.textContent = `Export ${selectedChanges.size || "selected"} event${selectedChanges.size === 1 ? "" : "s"}`;
  }));
  document.querySelector("#export-selected")?.addEventListener("click", exportSelected);
  document.querySelector("#lock-vault")?.addEventListener("click", async () => { vault = undefined; window.clearInterval(scheduler); renderLock(true); });
  document.querySelector("#connection-settings")?.addEventListener("click", () => document.querySelector<HTMLDialogElement>("#settings-dialog")!.showModal());
  document.querySelector("[data-close-settings]")?.addEventListener("click", () => document.querySelector<HTMLDialogElement>("#settings-dialog")!.close());
  document.querySelector("#license-button")?.addEventListener("click", () => document.querySelector<HTMLDialogElement>("#license-dialog")!.showModal());
  document.querySelector("[data-open-license]")?.addEventListener("click", () => { document.querySelector<HTMLDialogElement>("#settings-dialog")!.close(); document.querySelector<HTMLDialogElement>("#license-dialog")!.showModal(); });
  document.querySelector("[data-close-license]")?.addEventListener("click", () => document.querySelector<HTMLDialogElement>("#license-dialog")!.close());
  document.querySelector<HTMLFormElement>("#connection-form")?.addEventListener("submit", saveConnection);
  document.querySelector("#run-connection")?.addEventListener("click", () => runConnection(true));
  document.querySelector<HTMLFormElement>("#restore-license")?.addEventListener("submit", restoreLicense);
  document.querySelector("#reset-demo")?.addEventListener("click", async () => {
    await removeVaultStorage();
    location.reload();
  });
  document.querySelector("#start-real")?.addEventListener("click", () => {
    if (staticDemoRoute) {
      location.assign("/");
      return;
    }
    const url = new URL(location.href);
    url.searchParams.delete("demo");
    location.assign(url.toString());
  });
}

function chooseFile(): void { document.querySelector<HTMLInputElement>("#ics-file")?.click(); }

async function importFile(event: Event): Promise<void> {
  const input = event.currentTarget as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !vault) return;
  try {
    const ics = await file.text();
    parseIcs(ics);
    await addSnapshot(ics, "file", file.name.replace(/\.ics$/i, "") || "Imported calendar");
  } catch (error) { announce(error instanceof Error ? error.message : "The file could not be read.", true); }
  input.value = "";
}

async function addSnapshot(ics: string, source: Snapshot["source"], sourceName: string): Promise<boolean> {
  if (!vault) return false;
  const digest = await fingerprint(ics);
  if (vault.data.snapshots.at(-1)?.fingerprint === digest) {
    announce("No calendar changes. The latest encrypted edition is already current.");
    return false;
  }
  const snapshot: Snapshot = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), source, sourceName, ics, fingerprint: digest };
  vault.data.snapshots.push(snapshot);
  await vault.save();
  selectedSnapshotId = snapshot.id;
  selectedChanges.clear();
  renderApp();
  announce(`Snapshot recorded with ${parseIcs(ics).events.length} events.`);
  return true;
}

function exportSelected(): void {
  if (!vault) return;
  const snapshot = vault.data.snapshots.find((item) => item.id === selectedSnapshotId);
  if (!snapshot) return;
  const chosen = snapshotChanges(snapshot).filter((change) => selectedChanges.has(change.id));
  try {
    const output = buildRestoreCalendar(snapshot.ics, chosen);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([output], { type: "text/calendar;charset=utf-8" }));
    link.download = `calendar-restore-${new Date().toISOString().slice(0, 10)}.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
    announce(`Exported ${chosen.length} event${chosen.length === 1 ? "" : "s"} to a standards-compatible ICS file.`);
  } catch (error) { announce(error instanceof Error ? error.message : "The restore file could not be created.", true); }
}

async function saveConnection(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  if (!vault || !unlocked) return;
  const data = new FormData(event.currentTarget as HTMLFormElement);
  vault.data.connection = {
    url: String(data.get("url") || "").trim(),
    username: String(data.get("username") || ""),
    password: String(data.get("password") || ""),
    schedule: String(data.get("schedule") || "manual") as "manual"
  };
  await vault.save();
  startScheduler();
  document.querySelector<HTMLDialogElement>("#settings-dialog")?.close();
  announce("Encrypted CalDAV connection saved.");
}

async function fetchCalendar(): Promise<string> {
  if (!vault?.data.connection) throw new Error("Save a CalDAV connection first.");
  const { url, username, password } = vault.data.connection;
  if (isTauri) return mergeCalDavResponse(await invoke<string>("fetch_calendar", { url, username, password }));
  const response = await fetch(url, { headers: username ? { Authorization: `Basic ${btoa(`${username}:${password}`)}` } : {} });
  if (!response.ok) throw new Error(`Calendar server returned ${response.status}.`);
  return mergeCalDavResponse(await response.text());
}

async function runConnection(manual = false): Promise<void> {
  if (!vault?.data.connection || !unlocked) return;
  const status = document.querySelector<HTMLElement>("#dialog-status");
  if (status) status.textContent = "Contacting calendar…";
  try {
    const ics = await fetchCalendar();
    const name = parseIcs(ics).name;
    vault.data.connection.lastRun = new Date().toISOString();
    await addSnapshot(ics, "caldav", name === "Imported calendar" ? "CalDAV calendar" : name);
    await vault.save();
    if (manual) document.querySelector<HTMLDialogElement>("#settings-dialog")?.close();
  } catch (error) {
    const message = error instanceof Error ? error.message : "The calendar could not be reached.";
    if (status) { status.textContent = `${message} Check the URL, app password, and network.`; status.dataset.kind = "error"; }
    else announce(`${message} Check the connection settings.`, true);
  }
}

function startScheduler(): void {
  window.clearInterval(scheduler);
  scheduler = window.setInterval(() => {
    const connection = vault?.data.connection;
    if (!connection || connection.schedule === "manual" || !navigator.onLine || !unlocked) return;
    const interval = connection.schedule === "15m" ? 900_000 : connection.schedule === "hourly" ? 3_600_000 : 86_400_000;
    if (!connection.lastRun || Date.now() - Date.parse(connection.lastRun) >= interval) void runConnection();
  }, 60_000);
}

async function restoreLicense(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const data = new FormData(event.currentTarget as HTMLFormElement);
  saveLicense(String(data.get("license") || ""));
  const status = document.querySelector<HTMLElement>("#license-status")!;
  status.textContent = "Checking license…";
  const verdict = await verifyLicense(true);
  unlocked = verdict.valid;
  status.textContent = verdict.valid ? "License active. Scheduled snapshots are unlocked." : verdict.reason === "offline" ? "Could not reach the license service. Try again when online." : "That license is not active for Calendar Snapshotter.";
  status.dataset.kind = verdict.valid ? "ok" : "error";
  if (verdict.valid) startScheduler();
}

window.addEventListener("online", () => { const item = document.querySelector("#network-state"); if (item) item.innerHTML = '<span aria-hidden="true">●</span> On device'; });
window.addEventListener("offline", () => { const item = document.querySelector("#network-state"); if (item) item.innerHTML = '<span aria-hidden="true">○</span> Offline — local archive available'; });
void start();
