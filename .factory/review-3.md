# Adversarial first-read review 3 — Calendar Snapshotter

**Verdict: FAIL**

**Reviewed:** 2026-09-02 UTC

**Candidate:** `25951dab9167d422e79ffd860987662329c4a7af`

**Live:** <https://calendar-ics-snapshots.sociobot.in/>

The review has three blocking, three major, and one minor finding. A PASS requires zero findings and no untested claim.

## First screen before scrolling

| View | What it does | Who it is for | What to select first | Result |
| --- | --- | --- | --- | --- |
| Phone, 390 × 844 | Keeps local calendar copies so changes can be compared and earlier events restored. | People who rely on calendars that change. | **Try it with sample data**; **“Opens a safe sample project.”** states the result. | PASS for comprehension. The three-fact strip omits the required offline fact; see F-3-4. |
| Desktop, 1440 × 900 | Keeps a recoverable local calendar history. | People who rely on changing calendars. | **Try it with sample data**. | PASS for comprehension. |

The phone viewport contained the complete headline, 17-word audience sentence, primary sample action, outcome note, and three facts by 463 px. The desktop viewport contained the same material by 820 px. The exact first-read copy was **“Keep a recoverable calendar history.”**, **“For people who rely on changing calendars, it keeps local calendar copies ready to compare and restore.”**, and **“Try it with sample data.”**

## Findings

### Blocking

#### F-3-1 — Demo mode reads and writes the real license storage namespace

- **Location / quote:** live `/demo/`, **“View the scheduling license”** → **“Verify license.”** Entering `review3-demo-token` wrote `sb_license:calendar-ics-snapshots` and `sb_license:calendar-ics-snapshots:verdict` in ordinary `localStorage`. **Reset demo** left both values in place. A second fresh context seeded with a real-license sentinel opened `/demo/` as **“Scheduling license active”** and exposed the licensed calendar-server form.
- **Code evidence:** `src/main.ts` initializes `unlocked = cachedUnlock()` and calls `captureLicense()` before applying demo behavior. `src/core/license.ts` always uses the production `sb_license:calendar-ics-snapshots` keys. `restoreLicense()` writes those keys and can call the live Sociobot API while the demo banner is present.
- **Why this fails first use:** the demo-sandbox contract says real data is never read or written while the demo banner is shown. The current demo reads a real license, writes a demo-entered token into real state, keeps it after Reset, and exposes licensed behavior based on that real state. The declared `demo-private` test checks only IndexedDB database names, so it cannot detect this failure.
- **Concrete fix:** disable license entry and licensed scheduling in demo mode, or use demo-prefixed in-memory/localStorage keys and canned verification. Initialize license state only after determining the storage mode. Extend `@claim:demo-private` with production-license sentinels, every demo action, Reset, and a complete storage diff that proves no non-`demo:` key was read or changed.

#### F-3-2 — Leaving the demo does not discard modified sample data

- **Location / quote:** live `/demo/`, **“Leave demo.”** I imported a third calendar copy named **“Demo change persisted after leaving”**, selected Leave demo, then selected **“Try it with sample data”** again. The demo reopened with three copies and the imported event still present.
- **Why this fails first use:** the attached demo contract requires leaving demo mode to discard demo data unless the visitor explicitly keeps it. A returning visitor no longer gets the shipped two-copy sample, so the one-click path is not deterministic after normal use.
- **Concrete fix:** close demo database handles and delete `demo:calendar-snapshotter` before navigating away. Add a `demo-leave` claim and browser test that changes the sample, leaves, re-enters, and observes exactly the two shipped copies while a real-vault sentinel remains unchanged.

#### F-3-3 — Three retained claims do not have tests for their complete promise

- **Location / exact gaps:**
  - `.factory/claims.json`, `recurrence-timezones`: **“Preserves recurring overrides and timezone data in calendar copies and restore files.”** Its tagged test only checks that two parsed instances exist and that one key contains the recurrence ID. It does not create or inspect a restore file. The adjacent untagged restore test does not use a recurring override.
  - README Install: **“use an installer that checks the download before installing”** presents both shell and PowerShell commands. `@claim:checksum-install` executes only `public/install.sh` on Linux; `public/install.ps1` has no fixture test.
  - `.factory/claims.json`, `release-packaging`: **“Release builds publish native packages, SHA256SUMS, and a platform manifest.”** Its tagged test only searches workflow source for runner and filename strings. It never runs the manifest builder or inspects a release output. The live v0.1.4 release currently has the listed artifacts, but the declared test would pass if publication failed.
- **Why this fails verification:** the claims contract requires one tagged test to assert the observable outcome of every retained promise. All three commands exit zero, but material parts of the promises remain untested. This is the same test-quality failure class as round-two F-2-1.
- **Concrete fix:** make `recurrence-timezones` export a recurring override and assert both `RECURRENCE-ID` and `VTIMEZONE`; add an isolated PowerShell download/hash fixture or qualify the README to the tested shell installer; and test generated release artifacts or remove the publication claim. Keep each full assertion under its exact `@claim:` tag.

### Major

#### F-3-4 — The first-screen fact strip omits offline behavior and repeats pricing

- **Location / quote:** live `/` at both widths: **“Sample data stays separate from your archive.”**, **“Manual calendar copies and restore files are free.”**, and **“New scheduling licenses are not currently for sale.”**
- **Why this slows first use:** the mandatory first-screen shape calls for privacy, offline, and price facts. The current strip gives one privacy fact and two price/license facts even though `offline-local` is a declared capability.
- **Concrete rewrite:** keep **“Sample data stays separate from your archive.”**, replace the second line with **“The open sample archive works offline.”**, and combine price status into **“Manual recovery is free; new scheduling licenses are paused.”** Keep the offline line only with the existing claim test.

#### F-3-5 — A mobile demo link has a 25 px touch target, and its regression test races the app render

- **Location / quote:** live `/demo/` at 390 × 844, linked app wordmark **“Calendar Snapshotter.”** Its measured box was 263 × 25 px. `src/styles.css` gives `.app-wordmark` `line-height: .9` without a 44 px minimum.
- **Why this matters:** the attached accessibility baseline requires 44 px touch targets. The existing **“landing, footer, and demo actions meet the 44px mobile target”** test calls its measurement immediately after navigation and does not wait for `.snapshot-item` or the app wordmark, so it can pass against the loading shell before the undersized link is rendered.
- **Concrete fix:** make `.app-wordmark` an inline-flex target with `min-height: 44px` and sufficient vertical padding. Update the test to wait for the populated demo and assert this link explicitly before scanning all visible controls.

#### F-3-6 — README contains claim-like details not represented by the claims contract

- **Location / quote:** README says **“The release workflow runs for `v*` tags and can be dispatched manually.”**, **“Static deployment publishes `dist/site`.”**, and **“It includes security headers, asset caching, `robots.txt`, `sitemap.xml`, and a styled 404.”** The `site-response-policy` entry covers only security headers and the 404. README also says **“Calendar content and saved connection details are stored in one encrypted browser database record.”** The encryption entries do not claim or test the single-record detail.
- **Why this fails review:** these are statements a reader can rely on, but the complete statements do not have matching `.factory/claims.json` entries. Manual source and live checks found the current behavior; that does not give future builds the required tagged regression coverage.
- **Concrete fix:** remove implementation details that do not help users, or add exact claims and tagged tests. A plainer replacement for the storage sentence is **“Calendar content and saved connection details are encrypted before local storage.”** Split deployment claims so caching, `robots.txt`, and `sitemap.xml` are either tested or omitted.

### Minor

#### F-3-7 — Two landing labels do not name their sections plainly

- **Location / quote:** landing **“01 / Why keep copies”** and the privacy-list heading **“Open restore file.”**
- **Why this slows scanning:** `01 /` is decorative issue numbering, while “Open restore file” reads like an action even though its text explains the file format. Neither is the clearest standalone heading.
- **Concrete rewrite:** use **“Why keep calendar copies”** and **“Standard restore format.”**

## Demo and sandbox verification

- The landing action reaches `/demo/` in one click.
- The first demo screen is already populated with two **Northstar studio week** calendar copies. It shows one moved **Planning review** and one cancelled **Airport train**.
- The persistent demo banner, Reset demo, and Leave demo controls are visible. Lock vault is absent in demo mode.
- Selecting the cancelled event exported `calendar-restore-2026-09-02.ics` with `VCALENDAR`, `VERSION:2.0`, `VTIMEZONE`, and the Airport train event.
- A clean initial landing-to-demo flow made same-origin requests only and produced no console errors.
- Reset after importing a third copy restored two copies, removed the imported event, preserved a real IndexedDB sentinel, and retained the site header/footer.
- Demo license actions fail storage isolation as F-3-1 records. Leaving and re-entering preserves changed demo data as F-3-2 records.
- The sample export remained usable offline in the declared claim test.

## Claims verification

Every command in `.factory/claims.json` was run separately from fresh clone `/tmp/calendar-review3-clean.jNiQJY/repo` at candidate `25951da`. The native transport command first reported missing `glib-2.0` development headers. After installing the standard Tauri Linux GLib/GTK/WebKit development prerequisites in the disposable container, the exact command passed all three tests. Final command result: 31 of 31 pass. F-3-3 records test-coverage failures despite zero exit codes.

| Claim | Command result | Observable evidence |
| --- | --- | --- |
| `calendar-recovery` | PASS | Two changed copies produced a selectable cancelled event and restore download. |
| `sample-project` | PASS | One click opened `/demo/` with banner and two sample copies. |
| `calendar-diff` | PASS | Sample showed one moved and one cancelled event. |
| `ics-restore-export` | PASS | Download contained calendar, version, timezone, and event data. |
| `demo-private` | PASS command / live sandbox failure | Test checks only demo IndexedDB; F-3-1 proves shared license storage. |
| `no-event-telemetry` | PASS | Declared initial request log was same-origin. Demo license verification is an intentional external request and contributes to F-3-1. |
| `encrypted-local-vault` | PASS | Known event text was absent from the stored envelope. |
| `encrypted-caldav-credentials` | PASS | URL, username, and password were absent from the stored envelope. |
| `passphrase-no-recovery` | PASS | A different passphrase kept the vault locked. |
| `unchanged-refresh` | PASS | Reimporting identical content kept one copy. |
| `recurrence-timezones` | PASS command / incomplete | Parser assertion passed; restore-file half is untested (F-3-3). |
| `calendar-connection` | PASS | Mocked connection saved a calendar copy. |
| `native-caldav-transport` | PASS after prerequisites | Three Rust tests confirmed GET, REPORT, and scheme rejection. |
| `scheduled-caldav` | PASS | Fixture license and clock tick produced one scheduled copy. |
| `license-price` | PASS | Unlicensed import, review, restore, archive round trip, and gate check ran. |
| `demo-reset` | PASS | Two-copy seed returned and real IndexedDB sentinel remained. |
| `archive-roundtrip` | PASS | Calendar copies and saved connection returned after import. |
| `archive-wrong-passphrase` | PASS | Wrong passphrase left the open vault unchanged. |
| `license-token-only` | PASS | Mocked request contained the token and no calendar content. |
| `free-accessibility-export` | PASS | Keyboard export worked without a license; declared Axe scan passed. |
| `offline-local` | PASS | Selected sample event exported after the context went offline. |
| `no-account-import` | PASS | Fresh no-cookie context imported a calendar file. |
| `license-sales-paused` | PASS | Pause appeared and no checkout link existed. |
| `mit-license` | PASS | MIT grant and copyright notice were present. |
| `invalid-license-locks-scheduling` | PASS | Invalid verification kept scheduling unavailable. |
| `checksum-install` | PASS command / partial | Shell fixture passed; PowerShell path is untested (F-3-3). |
| `unsigned-preview` | PASS | No macOS or Windows signing configuration was found. |
| `release-packaging` | PASS command / inadequate | Workflow strings matched; no publication outcome was exercised (F-3-3). |
| `site-response-policy` | PASS | Static configuration check passed; live headers and 404 were also confirmed. |
| `release-downloads` | PASS | Desktop fixture resolved an asset; Android and iPhone received desktop-download guidance. |
| `delete-local-vault` | PASS | Confirmed deletion removed the IndexedDB vault record. |

## Copy audit

Counts use visible word tokens separated by whitespace. Headings, actions, labels, alternative states, and meaningful image text are included because visitors encounter them. Repeated navigation labels are grouped. No sentence exceeds 22 words and no banned marketing word appears.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Calendar Snapshotter | 2 | — |
| Home / Demo / Privacy / Terms | 1 each | — |
| Local calendar recovery | 3 | — |
| Keep a recoverable calendar history. | 5 | — |
| For people who rely on changing calendars, it keeps local calendar copies ready to compare and restore. | 17 | — |
| Try it with sample data | 5 | — |
| Opens a safe sample project. | 5 | — |
| Sample data stays separate from your archive. | 7 | F-3-4 (fact set) |
| Manual calendar copies and restore files are free. | 8 | F-3-4 (fact set) |
| New scheduling licenses are not currently for sale. | 8 | F-3-4 (fact set) |
| Download for Linux / Windows / macOS on GitHub | 5 each | — |
| View desktop downloads on GitHub | 5 | — |
| Calendar Snapshotter runs on macOS, Windows, and desktop Linux. | 9 | — |
| Published download ready. | 3 | — |
| v0.1.4 · download check available | 5 | — |
| Check for a newer release | 5 | — |
| The latest check was unavailable. | 5 | — |
| The published v0.1.4 download is ready. | 6 | — |
| Layered calendar pages show one appointment moving beside an archival lock. | 11 | — |
| Local calendar copies make changed appointments easier to recover. | 9 | — |
| Local encrypted vault | 3 | — |
| Added, moved, and cancelled events | 5 | — |
| Calendar restore file (.ics) | 4 | — |
| No analytics | 2 | — |
| 01 / Why keep copies | 5 | F-3-7 |
| Find what changed in a schedule. | 6 | — |
| Meetings move. | 2 | — |
| Events disappear. | 2 | — |
| A provider may be unavailable when you need an earlier plan. | 11 | — |
| Calendar Snapshotter compares each local copy. | 6 | — |
| It marks added, moved, and cancelled events for review. | 9 | — |
| How it works | 3 | — |
| Save. Compare. Restore. | 3 | — |
| Save a calendar copy | 4 | — |
| Import a calendar file (.ics). | 5 | — |
| Existing license holders can schedule copies from a calendar server (CalDAV). | 11 | — |
| Review changes | 2 | — |
| See added, moved, and cancelled events in a short list. | 10 | — |
| Restore selected events | 3 | — |
| Export selected earlier events to a calendar restore file (.ics). | 10 | — |
| Privacy and limits | 3 | — |
| Calendar copies stay in your local vault. | 7 | — |
| Encrypted vault | 2 | — |
| Calendar copies and saved sign-in details are encrypted before local storage. | 11 | — |
| No calendar uploads | 3 | — |
| The app has no analytics or third-party calendar processing. | 9 | — |
| Open restore file | 3 | F-3-7 |
| Restore files use the standard calendar format (.ics). | 8 | — |
| Important limit | 2 | — |
| Scheduled copies run only while Calendar Snapshotter is open. | 9 | — |
| Paused / new license sales | 4 | — |
| Scheduling license | 2 | — |
| Scheduling sales are paused. | 4 | — |
| New licenses are not currently for sale. | 7 | — |
| Existing license holders can schedule calendar server copies while the app is open. | 13 | — |
| Manual calendar copies, change review, full archive backup, and restore files remain free. | 13 | — |
| Enter a license token | 4 | — |
| License token | 2 | — |
| Verify license | 2 | — |
| Checking license… | 2 | — |
| License verified. | 2 | — |
| Paste this token into the desktop app to unlock scheduling. | 10 | — |
| That license is not active for Calendar Snapshotter. | 8 | — |
| The license service could not be reached. | 7 | — |
| Try again when online. | 4 | — |
| Sample project walkthrough | 3 | — |
| See the recovery steps before installing. | 6 | — |
| The sample archive shows two saved calendar copies. | 8 | — |
| 1. Load the sample | 4 | — |
| The sample opens in a separate demo vault. | 8 | — |
| The second calendar copy lists a moved planning review and a cancelled airport train. | 14 | — |
| 2. Select a change | 4 | — |
| Choose the earlier event to recover. | 6 | — |
| The app confirms a restore file was exported for the selected airport train event. | 14 | — |
| 3. Export a restore file | 5 | — |
| Import the file into your calendar. | 6 | — |
| Install from the command line | 5 | — |
| Command-line installers. | 2 | — |
| macOS / Linux | 3 | — |
| Windows PowerShell | 2 | — |
| Unsigned preview: v0.1.4 installers are not code-signed. | 7 | — |
| Calendar Snapshotter · Local calendar copies and restore files | 9 | — |
| All releases on GitHub (external) | 5 | — |
| Editorial plate generated for this product; provenance is in the source repository. | 12 | — |
| Built by Param Factory · v0.1.4 | 6 | — |

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Calendar Snapshotter | 2 | — |
| Calendar Snapshotter is a desktop tool for people who rely on calendars and need a recoverable local history. | 18 | — |
| It encrypts calendar copies, shows changes, and creates calendar restore files. | 11 | — |
| Live site: calendar-ics-snapshots.sociobot.in | 3 | — |
| What it does | 3 | — |
| Keeps calendar copies and saved calendar connection details in an encrypted local vault. | 13 | — |
| Imports ordinary `.ics` exports without an account. | 7 | — |
| Records a calendar copy from a direct file or calendar server connection (CalDAV). | 13 | — |
| Ignores an unchanged refresh instead of creating another calendar copy. | 10 | — |
| Compares calendar copies as added, moved, and cancelled events. | 9 | — |
| Preserves recurring overrides and timezone data in restore files. | 9 | F-3-3 |
| Exports selected earlier events as a standard calendar restore file (.ics). | 11 | — |
| Exports and imports the full encrypted archive for local backup or transfer. | 12 | — |
| Supports scheduled calendar server copies for existing license holders while the app is open. | 14 | — |
| Manual copies, change review, archive backup, and restore files are available without a license. | 14 | — |
| New scheduling licenses are not currently for sale. | 8 | — |
| Keyboard access, screen-reader structure, archive backup, and restore files do not require a license. | 14 | — |
| Try the sample project | 4 | — |
| Use the desktop browser entry at `/?demo=1`. | 7 | — |
| You can also choose Try it with sample data on the landing page. | 13 | — |
| The browser demo uses separate browser storage named `demo:calendar-snapshotter`. | 9 | F-3-1 |
| The second calendar copy moves a planning review and removes an airport train. | 13 | — |
| Reset demo restores the two shipped calendar copies without changing a real vault. | 13 | F-3-1 (license state excluded) |
| Leave demo returns to the download page without copying sample data. | 11 | F-3-2 (data is retained) |
| Install | 1 | — |
| Download the detected desktop installer from the landing page, or use an installer that checks the download before installing. | 19 | F-3-3 |
| `curl -fsSL https://calendar-ics-snapshots.sociobot.in/install.sh \| sh` | 5 | — |
| `irm https://calendar-ics-snapshots.sociobot.in/install.ps1 \| iex` | 4 | F-3-3 |
| Preview packages are unsigned. | 4 | — |
| GitHub Releases provides DMG, MSI/EXE, AppImage, DEB, and RPM assets. | 10 | F-3-3 |
| Each release includes a SHA-256 file-check list (`SHA256SUMS`). | 8 | F-3-3 |
| Develop | 1 | — |
| Requirements: Node.js 22+, Rust stable, and the Tauri 2 system prerequisites. | 11 | — |
| `npm ci` | 2 | — |
| `npm run dev` — desktop UI in a browser | 8 | — |
| `npm run dev:site` — landing site | 6 | — |
| `npm run tauri dev` — native desktop shell | 7 | — |
| Test and build | 3 | — |
| `npm test` — parser, diff, restore, release-contract tests | 7 | — |
| `npm run test:e2e` — Chromium recovery journey + axe accessibility checks | 10 | — |
| `npm run check` — TypeScript and Rust checks | 7 | — |
| `npm run build` — `dist/app` and `dist/site` | 6 | — |
| `npm run build:site` — exact static deploy output: `dist/site` | 9 | — |
| `./scripts/verify-url.sh http://127.0.0.1:4174/` — semantic smoke check with `dev:site` running | 11 | — |
| Run the claim checks declared in `.factory/claims.json`. | 7 | — |
| You can run all browser claim coverage with `npm run test:e2e -- --grep @claim`. | 14 | — |
| The release workflow runs for `v*` tags and can be dispatched manually. | 12 | F-3-6 |
| It builds native packages on GitHub-hosted macOS, Windows, and Linux runners. | 11 | F-3-3 |
| Static deployment publishes `dist/site`. | 4 | F-3-6 |
| It includes security headers, asset caching, `robots.txt`, `sitemap.xml`, and a styled 404. | 12 | F-3-6 |
| Privacy and security model | 4 | — |
| Calendar content and saved connection details are stored in one encrypted browser database record. | 14 | F-3-6 |
| Calendar requests go from the desktop app to the URL the user supplies. | 13 | — |
| Use Delete local archive in the app to remove this vault. | 11 | — |
| The product has no analytics, tracking scripts, remote fonts, or calendar-content services. | 12 | — |
| License verification sends only the entered license token to Sociobot. | 10 | — |
| The passphrase cannot be recovered. | 5 | — |
| Users should keep independent backups for critical records. | 8 | — |
| See Privacy and Terms. | 4 | — |
| Project map | 2 | — |
| `src/` — desktop UI, encrypted vault, calendar parser, comparison, and export | 10 | — |
| `src-tauri/` — Tauri 2 shell and native calendar server transport | 9 | — |
| `site/` — product, download, privacy, and terms pages | 7 | — |
| `public/install.*` — installers that check downloads before installing | 6 | F-3-3 |
| `.github/workflows/release.yml` — native release matrix and manifests | 6 | — |
| `.factory/design.md` — visual system and asset provenance | 6 | — |
| License | 1 | — |
| MIT © 2026 Sociobot (Param Factory). | 5 | — |

Terminology is otherwise consistent: **calendar copy** for a saved version, **sample project** for the try-out, **calendar restore file (.ics)** for recovery output, **calendar server connection** for the remote source, **vault** for encrypted local storage, and **scheduled calendar server copy** for licensed scheduling.

## Earlier finding verification

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 phone first screen | FIXED — headline, audience, sample action, outcome, and three facts end at 463 px. |
| F-1-2 Reset demo | FIXED for the original IndexedDB defect — 3 → 2 copies; imported event removed; real vault sentinel preserved. New non-demo license writes are F-3-1. |
| F-1-3 dead checkout | FIXED — no checkout link; sales pause is explicit. |
| F-1-4 missing claims | FIXED for the exact round-one sentences. New coverage gaps are F-3-3 and F-3-6. |
| F-1-5 three names for a saved item | FIXED — visitor copy uses **calendar copy**. |
| F-1-6 inconsistent route shell | FIXED — Lock vault is absent in demo; banner, header, and legal footer remain through Reset. |
| F-1-7 route focus | FIXED — live forward and Back navigation focus the h1 and restore 4,029 px scroll position. |
| F-1-8 demo h1 | FIXED — **“Review changes in the sample calendar.”** |
| F-1-9 ambiguous hosted-service heading | FIXED — **“Calendar copies stay in your local vault.”** |
| F-1-10 newsroom labels | FIXED — **“Local calendar archive”** and **“Changes in this copy.”** |
| F-1-11 inaccurate actions | FIXED — license actions now state the visible result. |
| F-1-12 unexplained jargon | FIXED for the cited copy — download checks and SHA-256 list are explained. |
| F-1-13 “Readable changes” | FIXED — **“Added, moved, and cancelled events.”** |
| F-1-14 23-word README sentence | FIXED — longest current sentence is 19 words. |
| F-1-15 no archive backup/import | FIXED — round-trip and wrong-passphrase checks pass. |
| F-1-16 unidentified external links | FIXED — GitHub destinations are named and return 200. |
| F-2-1 free-feature test was copy-only | FIXED — the tagged test now performs import, review, restore, encrypted archive round trip, and gate check. |
| F-2-2 phone got Linux binary | FIXED — live Android and iPhone contexts receive **“View desktop downloads on GitHub”** and no binary URL. |
| F-2-3 unlisted one-command install claim | FIXED — heading is **“Command-line installers.”** The remaining per-platform test gap is new F-3-3. |
| F-2-4 unlisted AES-specific claim | FIXED — visitor copy says stored data is encrypted before local storage. |
| F-2-5 unlisted deletion promise | FIXED — **Delete local archive** and its tagged browser test are present. |
| F-2-6 inaccurate “Start for real” | FIXED for wording — the action is now **“Leave demo.”** Its retained-data behavior is new F-3-2. |

## Structure, accessibility, links, and deployment

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. An unknown route returns the designed archive-themed page with HTTP 404 and a working home action.
- Every checked route has `lang="en"`, one main landmark, one h1, a route-specific title, description, canonical, Open Graph image, Twitter card, SVG favicon, and Apple touch icon.
- Root title is **“Calendar Snapshotter — recover calendar changes”** (51 characters). Demo, Privacy, Terms, and 404 titles follow the route pattern.
- Header navigation is Home / Demo / Privacy / Terms. Every route footer includes Privacy, Terms, Param Factory, and v0.1.4.
- Deep links load directly. Live forward and Back navigation focus the route h1; Back restored the root scroll position.
- Every discovered internal route, GitHub destination, release download, installer, metadata file, and image returned 200 after redirects. `mailto:` links were treated as explicit contact actions.
- Live Axe scans at 390 px found no serious or critical violations on root, demo, Privacy, Terms, or 404. Root, demo, and legal routes logged no console errors. The browser emitted only its expected failed-resource message for the deliberate HTTP 404.
- The mobile app-wordmark target misses 44 px; see F-3-5. Labels make each 18 px event checkbox part of a much larger change-row target.
- Reduced-motion contexts showed no overflow. The response sends CSP `frame-ancestors` as a header, `X-Content-Type-Options: nosniff`, a referrer policy, and a permissions policy.
- `robots.txt`, `sitemap.xml`, the social image, favicon, touch icon, and installer files return 200. Root JavaScript is 1.80 KB gzip; demo JavaScript is 10.22 KB gzip.
- The monochrome broadsheet/archive identity matches `.factory/design.md` and is visually distinct from a generic SaaS template.
- Live root HTML and root/demo JavaScript hashes match the clean candidate build.

## Missed leverage

No AI feature is justified. Calendar comparison, encryption, recurrence handling, and restore generation are deterministic, and sending event content to a model would conflict with the brief. The implied high-value import, calendar-server connection, scheduling, full encrypted archive transfer, and restore export features are already present.

## What would make this perfect

Isolate every demo-side storage read and write, discard the demo on exit, and expand the demo tests to cover all controls and namespaces. Complete the recurrence/restore, PowerShell installer, and release-publication claim tests. Put privacy, offline, and price facts in the first screen. Repair the mobile app-wordmark target and wait for the rendered demo in its test. Register or remove the remaining README claims, then replace the two unclear landing labels. Rerun every declared command plus the live storage-diff, leave/re-enter, mobile touch-target, route, link, request-log, and Axe checks.
