# Adversarial first-read review 2 — Calendar Snapshotter

**Verdict: FAIL**

**Reviewed:** 2026-09-02 UTC

**Candidate:** `5faf5a613f1d40264a67d4974e631578ea501276`

**Live:** <https://calendar-ics-snapshots.sociobot.in/>

The review has four blocking and four major findings. A PASS requires zero findings and no untested claim.

## First screen before scrolling

| View | What it does | Who it is for | What to select first | Result |
| --- | --- | --- | --- | --- |
| Phone, 390 × 844 | Keeps local calendar copies so changes can be compared and earlier events restored. | People who rely on calendars that change. | **Try it with sample data**; **“Opens a safe sample project.”** explains the result. | PASS for comprehension. The same screen later offers the phone an incompatible Linux download; see F-2-2. |
| Desktop, 1440 × 900 | Keeps a recoverable local calendar history. | People who rely on changing calendars. | **Try it with sample data**. | PASS |

The phone viewport showed the complete headline, the 17-word audience sentence, the sample action, its outcome, and all three facts by 463 px. The desktop viewport showed the same material by 820 px. The exact first-screen copy was **“Keep a recoverable calendar history.”**, **“For people who rely on changing calendars, it keeps local calendar copies ready to compare and restore.”**, and **“Try it with sample data.”**

## Findings

### Blocking

#### F-1-6 (reopened) — Locking the demo removes its safety banner, reset, and shared route chrome

- **Location / quote:** live `/demo/`, select **“Lock vault.”** The URL and title remain the demo, but **“Demo — sample data, nothing is saved to your archive”**, **“Reset demo”**, **“Start for real”**, the Home / Demo / Privacy / Terms header, and the legal footer all disappear. The remaining screen asks for **“Vault passphrase”**, which the visitor was never given.
- **Why this fails first use:** the demo-sandbox contract requires a persistent banner and reset/exit controls. A normal exploratory action strands the visitor on a passphrase screen and makes the live demo route structurally inconsistent again. This is a half-fixed regression of the route-shell finding that polish round 1 marked closed.
- **Concrete fix:** hide **Lock vault** in demo mode, or render the demo banner and complete site shell in the locked state and provide a literal **Reload sample project** action. Add a live/static browser test that selects every demo action and confirms the demo banner, Reset, Start for real, route header, and footer remain available until the visitor explicitly exits demo mode.

#### F-1-12 (reopened) — The previously flagged “checksum” jargon remains unexplained

- **Location / quote:** landing first screen, **“v0.1.4 · checksum published”**; README Install, **“checksum-verifying installer”** and **“Each release also includes `SHA256SUMS`.”**
- **Why this fails first use:** review 1 explicitly included **“checksum published”** in F-1-12. The same unexplained term remains on the live first screen, and the README adds its filename without saying what the reader should do with it. Marking the earlier finding fixed was incomplete.
- **Concrete rewrite:** use **“v0.1.4 · download check available”** and **“use an installer that checks the download before installing.”** If `SHA256SUMS` must remain in developer documentation, introduce it as **“a SHA-256 file-check list (`SHA256SUMS`)”.**

#### F-2-1 — The tagged free-feature claim test does not exercise the promised features

- **Location / quote:** `.factory/claims.json`, `license-price`: **“Manual calendar copies, review, archive backup, and restore files remain available without a license.”** Its sole tagged test at `tests/product.spec.ts:153` only asserts that the landing page repeats the sentence and contains no checkout link.
- **Why this fails verification:** the claims contract requires the tagged test to assert the observable result, not the presence of copy. The test never creates an unlicensed vault, imports a calendar copy, reviews a change, exports/imports the encrypted archive, or exports a restore file. The full promise is therefore untested even though the command exits successfully.
- **Concrete fix:** replace the copy-only check with one fresh, unlicensed browser journey that performs every listed free operation and asserts no license request or gate appears. Keep the no-checkout assertion as a separate static check.

#### F-2-2 — Phones are offered an incompatible Linux x86_64 download

- **Location / quote:** live `/` in both Pixel 5 and iPhone 13 contexts: **“Download for Linux on GitHub”** links to `Calendar.Snapshotter_0.1.4_amd64.AppImage`.
- **Why this fails first use:** this is a desktop app, but the first phone screen does not say that. `platform()` treats every non-Windows/non-Mac visitor as Linux, so Android and iOS visitors receive an x86_64 desktop binary. This disproves the listed `release-downloads` claim for the mobile context required by this review; its tagged test covers only the default desktop browser.
- **Concrete fix:** detect Android/iOS before desktop Linux. On phones, replace the binary action with **“View desktop downloads”** and the note **“Calendar Snapshotter runs on macOS, Windows, and desktop Linux.”** Extend `@claim:release-downloads` with Android and iPhone contexts and assert that neither receives an AppImage as a device-matched download.

### Major

#### F-2-3 — “Install with one command” is an unlisted product claim

- **Location / quote:** landing Install section, **“Install with one command.”**
- **Why this is unverified:** no `.factory/claims.json` entry states that either displayed command completes an installation. `checksum-install` declares only that the shell installer rejects a bad checksum, even though its Linux fixture happens to cover one successful path. The PowerShell command is not exercised.
- **Concrete fix:** add a `command-line-install` claim with fresh temporary-directory tests for both supported scripts, or rename the heading to the non-claim **“Command-line installers.”**

#### F-2-4 — The specific AES-256-GCM security claim is not registered or tested

- **Location / quote:** live demo after **Lock vault**, **“Stored data uses AES-256-GCM encryption.”**
- **Why this is unverified:** `encrypted-local-vault` proves that known plaintext is absent from one IndexedDB envelope. It does not register or assert the named algorithm or 256-bit key length. A specific cryptographic claim needs direct evidence.
- **Concrete fix:** either rewrite this as **“Stored data is encrypted before local storage.”**, which matches the existing claim, or add a claim and test that observes the Web Crypto algorithm and key length used to create and open the envelope.

#### F-2-5 — The Privacy deletion promise is unlisted

- **Location / quote:** live `/privacy/`, **“Removing the application’s local data removes its vault.”**
- **Why this is unverified:** no claim entry or clean-context test covers deletion of a real vault. A visitor can rely on this sentence when deciding how to remove sensitive data.
- **Concrete fix:** add a `delete-local-vault` claim that creates a real vault, performs the documented removal action, and confirms the IndexedDB record is gone; otherwise replace the sentence with precise operating-system/browser removal instructions that are tested.

#### F-2-6 — “Start for real” returns to marketing instead of naming or starting a result

- **Location / quote:** live `/demo/` banner, **“Start for real.”** Selecting it navigates to `/`.
- **Why this slows first use:** the label does not say that it exits the sample and returns to the download page. It neither opens a real archive nor starts an installation, so the result differs from the button text.
- **Concrete fix:** for this desktop product, use **“Download the desktop app”** and send the visitor to a clearly labeled platform-download section, or use **“Leave demo”** if the intended result is only returning home.

## Demo and sandbox verification

- The landing action opens `/demo/` in one click.
- The first demo screen is populated with two **Northstar studio week** calendar copies, a moved **Planning review**, and a cancelled **Airport train**.
- A fresh demo created only `demo:calendar-snapshotter`; it did not create `calendar-snapshotter`.
- The full landing-to-demo request log was same-origin and had no console errors.
- Reset was checked after importing a third copy: 3 copies became 2, **Reset live check** disappeared, and a `real-data` sentinel in `calendar-snapshotter` remained unchanged.
- Selecting **Lock vault** exposes the blocking persistent-banner failure in F-1-6.
- The open sample remained usable offline and exported the selected cancelled event in the declared browser claim test.

## Claims verification

Commands ran individually from fresh clone `/tmp/calendar-review2-clean.wC07f2` at candidate `5faf5a6`. The first native command invocation found the container lacked the documented Tauri Linux libraries. After installing those prerequisites, the exact command passed all three native transport tests. Final result: 30 of 30 declared commands passed; F-2-1 records a test-quality gap rather than a non-zero command.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `calendar-recovery` | PASS | Imported two changed files, found the removed event, downloaded restore ICS. |
| `sample-project` | PASS | `/demo/` opened with banner and two copies. |
| `calendar-diff` | PASS | One moved and one cancelled sample event. |
| `ics-restore-export` | PASS | Download contained VCALENDAR, VERSION, VTIMEZONE, and Airport train. |
| `demo-private` | PASS | Only `demo:calendar-snapshotter` existed in the fresh context. |
| `no-event-telemetry` | PASS | All recorded demo requests were same-origin. |
| `encrypted-local-vault` | PASS | Known event title absent from stored envelope. |
| `encrypted-caldav-credentials` | PASS | URL, username, and password absent from stored envelope. |
| `passphrase-no-recovery` | PASS | Wrong passphrase left the vault locked. |
| `unchanged-refresh` | PASS | Duplicate import kept one copy. |
| `recurrence-timezones` | PASS | Recurrence override and VTIMEZONE fixture passed. |
| `calendar-connection` | PASS | Mocked connection recorded a calendar copy. |
| `native-caldav-transport` | PASS | 3 Rust tests passed after installing Linux prerequisites. |
| `scheduled-caldav` | PASS | Licensed fixture recorded one scheduled copy. |
| `license-price` | PASS command / INADEQUATE coverage | It checked copy and checkout absence only; see F-2-1. |
| `demo-reset` | PASS | Seed restored and real sentinel remained. |
| `archive-roundtrip` | PASS | Copies and connection settings returned. |
| `archive-wrong-passphrase` | PASS | Wrong passphrase left the open vault unchanged. |
| `license-token-only` | PASS | Mock request contained only the token. |
| `free-accessibility-export` | PASS | Keyboard export worked without a license; Axe passed. |
| `offline-local` | PASS | Cancelled event exported after the context went offline. |
| `no-account-import` | PASS | Fresh no-cookie context imported a file. |
| `license-sales-paused` | PASS | Pause shown and no checkout link present. |
| `mit-license` | PASS | MIT grant and copyright found. |
| `invalid-license-locks-scheduling` | PASS | Invalid fixture did not enable scheduling. |
| `checksum-install` | PASS | Valid fixture installed; bad checksum was rejected. |
| `unsigned-preview` | PASS | No macOS or Windows signing configuration. |
| `release-packaging` | PASS | Release workflow contains all platform jobs and manifests. |
| `site-response-policy` | PASS | Static header and 404 configuration assertions passed. |
| `release-downloads` | PASS command / FAIL on phones | Desktop fixture passed; live Pixel/iPhone mismatch is F-2-2. |

### Unlisted claim cross-check

The functional, privacy, offline, encryption, scheduling, release, and license statements on the landing page and README otherwise map to existing claim entries. Three unmatched promises remain: **“Install with one command”** (F-2-3), **“Stored data uses AES-256-GCM encryption”** (F-2-4), and the Privacy deletion sentence (F-2-5).

## Copy audit

Counts use whitespace-separated visible words. Navigation items are grouped where each has the stated count. Alternative release and license states are included because the landing page can show them. No sentence exceeds 22 words and no banned marketing adjective appears.

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
| Sample data stays separate from your archive. | 7 | — |
| Manual calendar copies and restore files are free. | 8 | — |
| New scheduling licenses are not currently for sale. | 8 | — |
| View releases on GitHub (external) | 5 | — |
| Download for Linux / Windows / macOS on GitHub | 5 each | F-2-2 on phones |
| Published download ready. | 3 | — |
| v0.1.4 · checksum published | 4 | F-1-12 |
| Check for a newer release | 5 | — |
| The latest check was unavailable. | 5 | — |
| The published v0.1.4 download is ready. | 6 | — |
| Layered calendar pages show one appointment moving beside an archival lock | 11 | — |
| Local calendar copies make changed appointments easier to recover. | 9 | — |
| Local encrypted vault | 3 | — |
| Added, moved, and cancelled events | 5 | — |
| Calendar restore file (.ics) | 4 | — |
| No analytics | 2 | — |
| 01 / Why keep copies | 5 | — |
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
| Open restore file | 3 | — |
| Restore files use the standard calendar format (.ics). | 8 | — |
| Important limit | 2 | — |
| Scheduled copies run only while Calendar Snapshotter is open. | 9 | — |
| Paused / new license sales | 4 | — |
| Scheduling license | 2 | — |
| Scheduling sales are paused. | 4 | — |
| New licenses are not currently for sale. | 7 | — |
| Existing license holders can schedule calendar server copies while the app is open. | 12 | — |
| Manual calendar copies, change review, full archive backup, and restore files remain free. | 13 | F-2-1 |
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
| Install from the command line | 5 | F-1-12 (“command line”) |
| Install with one command. | 4 | F-2-3 |
| macOS / Linux | 2 | — |
| Windows PowerShell | 2 | — |
| Unsigned preview: v0.1.4 installers are not code-signed. | 7 | — |
| Calendar Snapshotter · Local calendar copies and restore files | 9 | — |
| All releases on GitHub (external) | 5 | — |
| Editorial plate generated for this product; provenance is in the source repository. | 11 | — |
| Built by Param Factory · v0.1.4 | 6 | — |

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Calendar Snapshotter | 2 | — |
| Calendar Snapshotter is a desktop tool for people who rely on calendars and need a recoverable local history. | 18 | — |
| It encrypts calendar copies, shows changes, and creates calendar restore files. | 11 | — |
| Live site: calendar-ics-snapshots.sociobot.in | 4 | — |
| What it does | 3 | — |
| Keeps calendar copies and saved calendar connection details in an encrypted local vault. | 13 | — |
| Imports ordinary `.ics` exports without an account. | 7 | — |
| Records a calendar copy from a direct file or calendar server connection (CalDAV). | 13 | — |
| Ignores an unchanged refresh instead of creating another calendar copy. | 10 | — |
| Compares calendar copies as added, moved, and cancelled events. | 9 | — |
| Preserves recurring overrides and timezone data in restore files. | 9 | — |
| Exports selected earlier events as a standard calendar restore file (.ics). | 11 | — |
| Exports and imports the full encrypted archive for local backup or transfer. | 12 | — |
| Supports scheduled calendar server copies for existing license holders while the app is open. | 14 | — |
| Manual copies, change review, archive backup, and restore files are available without a license. | 14 | F-2-1 |
| New scheduling licenses are not currently for sale. | 8 | — |
| Keyboard access, screen-reader structure, archive backup, and restore files do not require a license. | 14 | — |
| Try the sample project | 4 | — |
| Use the desktop browser entry at `/?demo=1`. | 8 | — |
| You can also choose Try it with sample data on the landing page. | 13 | — |
| The browser demo uses separate browser storage named `demo:calendar-snapshotter`. | 10 | — |
| The second calendar copy moves a planning review and removes an airport train. | 13 | — |
| Reset demo restores the two shipped calendar copies without changing a real vault. | 13 | — |
| Install | 1 | — |
| Download the detected installer from the landing page, or use a checksum-verifying installer. | 13 | F-1-12 |
| `curl -fsSL https://calendar-ics-snapshots.sociobot.in/install.sh \| sh` | 5 | F-1-12 |
| `irm https://calendar-ics-snapshots.sociobot.in/install.ps1 \| iex` | 4 | — |
| Preview packages are unsigned. | 4 | — |
| GitHub Releases provides DMG, MSI/EXE, AppImage, DEB, and RPM assets. | 10 | — |
| Each release also includes `SHA256SUMS`. | 5 | F-1-12 |
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
| The release workflow runs for `v*` tags and can be dispatched manually. | 12 | — |
| It builds native packages on GitHub-hosted macOS, Windows, and Linux runners. | 11 | — |
| Static deployment publishes `dist/site`. | 4 | — |
| It includes security headers, asset caching, `robots.txt`, `sitemap.xml`, and a styled 404. | 12 | — |
| Privacy and security model | 4 | — |
| Calendar content and saved connection details are stored in one encrypted browser database record. | 14 | — |
| Calendar requests go from the desktop app to the URL the user supplies. | 13 | — |
| The product has no analytics, tracking scripts, remote fonts, or calendar-content services. | 12 | — |
| License verification sends only the entered license token to Sociobot. | 10 | — |
| The passphrase cannot be recovered. | 5 | — |
| Users should keep independent backups for critical records. | 8 | — |
| See Privacy and Terms. | 4 | — |
| Project map | 2 | — |
| `src/` — desktop UI, encrypted vault, calendar parser, comparison, and export | 10 | — |
| `src-tauri/` — Tauri 2 shell and native calendar server transport | 9 | — |
| `site/` — product, download, privacy, and terms pages | 7 | — |
| `public/install.*` — checksum-verifying installers | 3 | F-1-12 |
| `.github/workflows/release.yml` — native release matrix and manifests | 6 | — |
| `.factory/design.md` — visual system and asset provenance | 6 | — |
| License | 1 | — |
| MIT © 2026 Sociobot (Param Factory). | 5 | — |

Terminology is otherwise consistent: **calendar copy** for a saved version, **sample project** for the try-out, **calendar restore file (.ics)** for recovery output, **calendar server connection** for the remote source, **vault** for encrypted local storage, and **scheduled calendar server copy** for licensed scheduling.

## Earlier finding verification

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 phone first screen | FIXED — audience, sample action, outcome, and facts end at 463 px on 390 × 844. |
| F-1-2 Reset demo | FIXED — 3 → 2 copies; imported event removed; real sentinel preserved. |
| F-1-3 dead checkout | FIXED — no checkout link; sales pause is explicit. |
| F-1-4 missing claims | FIXED for the promises cited in round 1; new gaps are F-2-3 through F-2-5. |
| F-1-5 three names for a saved item | FIXED — visitor copy uses calendar copy. |
| F-1-6 inconsistent route shell | **REOPENED** — initial route shell matches, but Lock vault removes it and the required demo banner. |
| F-1-7 route focus | FIXED — forward and Back focus the destination h1; footer navigation restored the 4,139 px scroll position. |
| F-1-8 demo h1 | FIXED — “Review changes in the sample calendar.” |
| F-1-9 ambiguous hosted-service heading | FIXED — “Calendar copies stay in your local vault.” |
| F-1-10 newsroom labels | FIXED — “Local calendar archive” and “Changes in this copy.” |
| F-1-11 inaccurate actions | FIXED — “Enter a license token” and “View the scheduling license.” |
| F-1-12 unexplained jargon | **REOPENED** — the specifically cited “checksum” wording remains. |
| F-1-13 “Readable changes” | FIXED — “Added, moved, and cancelled events.” |
| F-1-14 23-word README sentence | FIXED — split into 4- and 12-word sentences. |
| F-1-15 no archive backup/import | FIXED — round-trip and wrong-passphrase checks pass. |
| F-1-16 unidentified external links | FIXED — GitHub/Sociobot destinations are named; crawled links returned 200. |

## Structure, accessibility, and link checks

- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. A missing route returns the designed archive-themed page with HTTP 404.
- Each checked route has `lang="en"`, one main landmark, one h1, a route-appropriate title, description, canonical, Open Graph image, Twitter card, SVG favicon, and Apple touch icon.
- Root title is **“Calendar Snapshotter — recover calendar changes”** (51 characters). Demo, Privacy, Terms, and 404 use route-specific titles.
- Header links are Home / Demo / Privacy / Terms on every route before the demo-lock regression. Footers include Privacy, Terms, Param Factory, and v0.1.4.
- Forward navigation and browser Back focus the h1. Back from Privacy after using the visible footer restored the root scroll position.
- Every discovered internal HTTP link and GitHub link returned 200 after redirects. `mailto:` links were treated as explicit contact links.
- Live Axe scans found zero serious or critical issues on root, demo, Privacy, Terms, and 404 at 390 px. Root and demo had no console errors. The 404 navigation produced only the expected browser 404 resource message.
- The response carries CSP with `frame-ancestors` as a header, `X-Content-Type-Options: nosniff`, and a referrer policy. `robots.txt`, `sitemap.xml`, the social image, favicon, and touch icon return 200.
- Root JavaScript is about 2.4 KB gzip combined; demo JavaScript is about 10.1 KB gzip. There are no third-party fonts or scripts.
- The monochrome broadsheet/archive visual system is product-specific and matches `.factory/design.md`; it is not a generic gradient/card SaaS layout.

## Missed leverage

No additional AI feature is justified. Calendar comparison, recurrence handling, encryption, and restore generation are deterministic, and sending event content to a model would conflict with the brief. The brief’s useful import, calendar-server connection, scheduling, full archive transfer, and restore export paths are present. No separate missed-leverage finding was added.

## What would make this perfect

Nothing beyond closing every finding above: keep the demo shell and safety controls present through all demo states; remove the remaining checksum jargon; make the free-feature claim test perform every promised action; stop offering desktop Linux binaries to phones; register or remove the three untested claims; and make the demo exit action state its actual result. Then rerun every declared claim command plus the live mobile, demo-lock, request-log, link, route-focus, and Axe checks from a fresh context.
