# Adversarial first-read review 4 — Calendar Snapshotter

**Verdict: FAIL**

**Reviewed:** 2026-09-02 UTC  
**Candidate:** `c9e1fe4a9873ce307adeb3de3dc27b40a26790b8`  
**Live:** <https://calendar-ics-snapshots.sociobot.in/>

The review found no blocking defect, but it found three major defects. A PASS requires zero findings and no unlisted claim.

## First screen before scrolling

| View | What it does | Who it is for | What to select first | Result |
| --- | --- | --- | --- | --- |
| Phone, 390 × 844 | Keeps local calendar copies so changes can be compared and earlier events restored. | People who rely on calendars that change. | **Try it with sample data**; **“Opens a safe sample project.”** states the result. | PASS |
| Desktop, 1440 × 900 | Keeps a recoverable local calendar history. | People who rely on changing calendars. | **Try it with sample data**. | PASS |

The phone showed the complete headline, audience sentence, primary action, outcome, and privacy/offline/price facts by 445 px. The desktop showed the same information by 820 px. The exact first-read copy was **“Keep a recoverable calendar history.”**, **“For people who rely on changing calendars, it keeps local calendar copies ready to compare and restore.”**, and **“Try it with sample data.”**

## Findings

### Major

#### F-4-1 — Contact links miss the required 44 px phone touch target

- **Location / quote:** live `/privacy/`, **“privacy@sociobot.in”**, and live `/terms/`, **“support@sociobot.in”**, at 390 px.
- **Observed result:** each anchor measured 183 × 19 px. The rest of the checked links and buttons met 44 px. Axe reported no serious or critical issue, so the current automated scan does not catch this manual baseline failure.
- **Why this matters:** the attached accessibility contract requires every touch target to be at least 44 px. A phone visitor must aim at a one-line, 19 px-high target to contact the operator.
- **Concrete fix:** render legal-page email links as `inline-flex`, align their text centrally, and give them `min-height: 44px`. Add a 390 px test that waits for each legal route and measures every visible link and button, including inline contact links.

#### F-4-2 — The documented runtime requirements are an unlisted claim

- **Location / exact quote:** README, Develop: **“Requirements: Node.js 22+ and Rust stable.”**
- **Why this fails verification:** `.factory/claims.json` has no entry for the supported Node and Rust toolchains. A contributor can rely on this requirement, but no exact tagged test or checked toolchain declaration keeps it true.
- **Concrete fix:** add a `runtime-requirements` claim and tagged check that asserts the Node engine/toolchain declarations and runs the documented setup on Node 22 with stable Rust. Alternatively, remove the version promise and state only the versions used by CI.

#### F-4-3 — The native prerequisite installer behavior is an unlisted claim

- **Location / exact quote:** README, Develop: **“The setup command checks native prerequisites and installs the required Ubuntu or Debian packages when needed.”**
- **Why this fails verification:** `npm run setup:native` did perform that work in this clean Ubuntu container, but no `.factory/claims.json` entry names the behavior. The `native-caldav-transport` claim tests GET/REPORT transport after setup; it does not register or tag the package-detection and installation promise.
- **Concrete fix:** add a `native-prerequisite-setup` claim. Its tagged test should start in a clean supported Ubuntu/Debian container, assert missing modules, run the setup, assert every required module resolves, and confirm a second run is a no-op. Otherwise, replace the sentence with a manual package list and remove the automatic-install promise.

## Copy audit

Counts use word tokens; punctuation-only marks are excluded. The landing audit includes headings, actions, image alternatives, and conditional states because visitors can encounter them. Repeated navigation labels are grouped. No item exceeds 22 words, uses a banned marketing adjective, changes the established product terms, or uses a non-result action. The two README claim flags are F-4-2 and F-4-3.

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
| The open sample archive works offline. | 6 | — |
| Manual recovery is free; new scheduling licenses are paused. | 9 | — |
| View releases on GitHub (external) | 5 | — |
| Download for Linux / Windows / macOS on GitHub | 5 each | — |
| View desktop downloads on GitHub | 5 | — |
| Calendar Snapshotter runs on macOS, Windows, and desktop Linux. | 9 | — |
| Published download ready. | 3 | — |
| v0.1.6 · download check available | 4 | — |
| Check for a newer release | 5 | — |
| The latest check was unavailable. | 5 | — |
| The published v0.1.6 download is ready. | 6 | — |
| Layered calendar pages show one appointment moving beside an archival lock | 11 | — |
| Local calendar copies make changed appointments easier to recover. | 9 | — |
| Local encrypted vault | 3 | — |
| Added, moved, and cancelled events | 5 | — |
| Calendar restore file (.ics) | 4 | — |
| No analytics | 2 | — |
| Why keep calendar copies | 4 | — |
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
| Standard restore format | 3 | — |
| Restore files use the standard calendar format (.ics). | 8 | — |
| Important limit | 2 | — |
| Scheduled copies run only while Calendar Snapshotter is open. | 9 | — |
| Paused | 1 | — |
| new license sales | 3 | — |
| Scheduling license | 2 | — |
| Scheduling sales are paused. | 4 | — |
| New licenses are not currently for sale. | 7 | — |
| Existing license holders can schedule calendar server copies while the app is open. | 12 | — |
| Manual calendar copies, change review, full archive backup, and restore files remain free. | 13 | — |
| Enter a license token | 4 | — |
| License token | 2 | — |
| Verify license | 2 | — |
| Checking license… | 2 | — |
| License verified. | 2 | — |
| Paste this token into the desktop app to unlock scheduling. | 9 | — |
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
| macOS / Linux | 2 | — |
| Windows | 1 | — |
| Download the Windows installer from the desktop downloads link above. | 10 | — |
| Unsigned preview: v0.1.6 installers are not code-signed. | 7 | — |
| Calendar Snapshotter · Local calendar copies and restore files | 8 | — |
| All releases on GitHub (external) | 5 | — |
| Editorial plate generated for this product; provenance is in the source repository. | 12 | — |
| Built by Param Factory · v0.1.6 | 5 | — |

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Calendar Snapshotter | 2 | — |
| Calendar Snapshotter is a desktop tool for people who rely on calendars and need a recoverable local history. | 18 | — |
| It encrypts calendar copies, shows changes, and creates calendar restore files. | 11 | — |
| Live site | 2 | — |
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
| Manual copies, change review, archive backup, and restore files are available without a license. | 14 | — |
| New scheduling licenses are not currently for sale. | 8 | — |
| Keyboard access, screen-reader structure, archive backup, and restore files do not require a license. | 14 | — |
| Try the sample project | 4 | — |
| Use the desktop browser entry at `/?demo=1`. | 8 | — |
| You can also choose Try it with sample data on the landing page. | 13 | — |
| The browser demo uses separate browser storage named `demo:calendar-snapshotter`. | 9 | — |
| The second calendar copy moves a planning review and removes an airport train. | 13 | — |
| Reset demo restores the two shipped calendar copies without changing a real vault. | 13 | — |
| Leave demo returns to the download page without copying sample data. | 11 | — |
| Install | 1 | — |
| Download the detected desktop installer from the landing page. | 9 | — |
| macOS and Linux also have a command-line installer that checks the download before installing. | 14 | — |
| `curl -fsSL …/install.sh \| sh` | 4 | — |
| Preview packages are unsigned. | 4 | — |
| GitHub Releases provides DMG, MSI/EXE, AppImage, DEB, and RPM assets. | 10 | — |
| Each release includes a SHA-256 file-check list (`SHA256SUMS`) and a source commit in `latest.json`. | 14 | — |
| Develop | 1 | — |
| Requirements: Node.js 22+ and Rust stable. | 6 | F-4-2 |
| The setup command checks native prerequisites and installs the required Ubuntu or Debian packages when needed. | 16 | F-4-3 |
| `npm run setup:native` — run before the first claim, test, or native build | 12 | — |
| `npm ci` | 2 | — |
| `npm run dev` — desktop UI in a browser | 8 | — |
| `npm run dev:site` — landing site | 5 | — |
| `npm run tauri dev` — native desktop shell | 7 | — |
| Test and build | 3 | — |
| `npm test` — parser, diff, restore, release-contract tests | 7 | — |
| `npm run test:claims` — every declared claim command, including native setup | 10 | — |
| `npm run claim:native-caldav-transport` — provisions native libraries, then tests the desktop transport | 11 | — |
| `npm run test:e2e` — Chromium recovery journey and Axe accessibility checks | 10 | — |
| `npm run check` — TypeScript and Rust checks | 7 | — |
| `npm run build` — `dist/app` and `dist/site` | 6 | — |
| `npm run build:site` — exact static deploy output: `dist/site` | 8 | — |
| `./scripts/verify-url.sh …` — semantic smoke check with `dev:site` running | 8 | — |
| Run the claim checks declared in `.factory/claims.json`. | 7 | — |
| You can run all browser claim coverage with `npm run test:e2e -- --grep @claim`. | 13 | — |
| The release workflow runs for `v*` tags and supports manual dispatch. | 11 | — |
| It builds native packages on GitHub-hosted macOS, Windows, and Linux runners. | 11 | — |
| Static deployment publishes the built site in `dist/site`. | 8 | — |
| It includes security headers, asset caching, discovery files, and a styled 404. | 12 | — |
| Privacy and security model | 4 | — |
| Calendar content and saved connection details are encrypted before local storage. | 11 | — |
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
| `public/install.*` — installers that check downloads before installing | 7 | — |
| `.github/workflows/release.yml` — native release matrix and manifests | 6 | — |
| `.factory/design.md` — visual system and asset provenance | 6 | — |
| License | 1 | — |
| MIT © 2026 Sociobot (Param Factory). | 5 | — |

Terminology is consistent: **calendar copy** is a saved version; **sample project** is the try-out; **calendar restore file (.ics)** is recovery output; **calendar server connection** is the remote source; **vault** is encrypted local storage; and **scheduled calendar server copy** is licensed scheduling.

## Demo and sandbox verification

- The landing action entered `/demo/` in one click.
- The first demo screen already contained two **Northstar studio week** calendar copies, one moved **Planning review**, and one cancelled **Airport train**.
- The persistent banner said **“Demo — sample data, nothing is saved to your archive.”** Reset demo and Leave demo were visible.
- The cancelled event exported `calendar-restore-2026-09-02.ics` with `VCALENDAR`, `VERSION:2.0`, `VTIMEZONE`, and the event text.
- The open page remained usable offline and exported the restore file while the context was offline.
- Importing a third demo copy and selecting Reset changed three copies back to two and removed the imported event.
- A real IndexedDB sentinel remained `real-data`. Existing production license/local-storage sentinels remained unchanged, did not enable demo scheduling, and no licensed demo control appeared.
- Importing a third copy, selecting Leave demo, and re-entering restored exactly two shipped copies. The changed sample was absent and real sentinels remained unchanged.
- The full live landing/demo/reset/leave flow made same-origin requests only. It produced no console or page errors.

## Claims verification

Every command in `.factory/claims.json` ran independently through `npm run test:claims` from clean clone `/tmp/calendar-review4-clean.taoujh/repo` at candidate `c9e1fe4`. The native command found missing Tauri libraries, installed the documented Ubuntu prerequisites, then passed all three transport tests. Final command result: **35 of 35 passed**. F-4-2 and F-4-3 are unlisted claims, not failures of a listed command.

| Claim | Result | Observable evidence |
| --- | --- | --- |
| `calendar-recovery` | PASS | Two changed copies exposed and exported the deleted event. |
| `reject-truncated-ics` | PASS | Incomplete input was rejected without changing the two-copy archive. |
| `sample-project` | PASS | `/demo/` opened with banner and two sample copies. |
| `calendar-diff` | PASS | Sample showed one moved and one cancelled event. |
| `ics-restore-export` | PASS | Restore contained calendar, version, timezone, and event data. |
| `demo-private` | PASS | Demo ignored production-license sentinels and kept real storage unchanged. |
| `no-event-telemetry` | PASS | Demo requests were same-origin. |
| `encrypted-local-vault` | PASS | Known event text was absent from the stored envelope. |
| `encrypted-caldav-credentials` | PASS | URL, user, and password were absent from the stored envelope. |
| `passphrase-no-recovery` | PASS | A different passphrase kept the vault locked. |
| `unchanged-refresh` | PASS | Duplicate input retained one calendar copy. |
| `recurrence-timezones` | PASS | Recurrence override and timezone survived the restore output. |
| `calendar-connection` | PASS | Mocked direct connection recorded a calendar copy. |
| `native-caldav-transport` | PASS | GET, REPORT, and unsupported-scheme cases passed. |
| `scheduled-caldav` | PASS | Licensed fixture recorded one scheduled copy. |
| `license-price` | PASS | Unlicensed import, review, restore, archive round trip, and scheduling gate passed. |
| `demo-reset` | PASS | Reset restored the seed and preserved the real sentinel. |
| `demo-leave` | PASS | Leave/re-entry discarded the changed sample and preserved real storage. |
| `archive-roundtrip` | PASS | Calendar copies and connection settings returned after import. |
| `archive-wrong-passphrase` | PASS | Wrong passphrase left the open vault unchanged. |
| `license-token-only` | PASS | Verification request contained only the token. |
| `free-accessibility-export` | PASS | Keyboard export worked unlicensed; the declared Axe scan passed. |
| `offline-local` | PASS | Open sample exported while the browser context was offline. |
| `no-account-import` | PASS | Fresh no-account context imported a calendar file. |
| `license-sales-paused` | PASS | Sales pause appeared and no checkout action existed. |
| `mit-license` | PASS | MIT grant and copyright notice were present. |
| `invalid-license-locks-scheduling` | PASS | Invalid verification kept scheduling unavailable. |
| `checksum-install` | PASS | Good fixture installed; wrong checksum installed nothing. |
| `unsigned-preview` | PASS | No macOS or Windows signing configuration existed. |
| `release-packaging` | PASS | Fixture packages produced checksums, source identity, and platform manifest. |
| `site-response-policy` | PASS | Headers, cache rule, discovery files, and 404 policy were present. |
| `release-trigger` | PASS | `v*` tags and manual dispatch were configured. |
| `static-site-output` | PASS | Every route was emitted under `dist/site`. |
| `release-downloads` | PASS | Desktop resolution and Android/iPhone guidance passed. |
| `delete-local-vault` | PASS | Confirmed deletion removed the IndexedDB vault record. |

## Earlier finding verification

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 phone first screen | FIXED — audience, primary action, outcome, and all three facts end at 445 px. |
| F-1-2 Reset demo | FIXED — live 3 → 2 copies; changed event removed; real sentinel preserved. |
| F-1-3 dead checkout | FIXED — no checkout URL exists; the sales pause is explicit. |
| F-1-4 missing claims | FIXED for the cited promises — exact tagged checks passed. New README gaps are F-4-2 and F-4-3. |
| F-1-5 three saved-item names | FIXED — landing and README consistently use **calendar copy**. |
| F-1-6 inconsistent route shell | FIXED — shared header/footer and persistent demo controls remain; Lock vault is absent in demo. |
| F-1-7 route focus | FIXED — forward and Back focused the destination h1; Back restored the prior scroll position. |
| F-1-8 demo h1 | FIXED — **“Review changes in the sample calendar.”** |
| F-1-9 ambiguous hosted-service heading | FIXED — **“Calendar copies stay in your local vault.”** |
| F-1-10 newsroom labels | FIXED — code and live UI use **“Local calendar archive”** and **“Changes in this copy.”** |
| F-1-11 inaccurate actions | FIXED — **“Enter a license token”** and **“View the scheduling license.”** |
| F-1-12 unexplained jargon | FIXED — file/server standards follow plain names; download checking is explained. |
| F-1-13 “Readable changes” | FIXED — **“Added, moved, and cancelled events.”** |
| F-1-14 23-word README sentence | FIXED — no current sentence exceeds 22 words. |
| F-1-15 no full archive transfer | FIXED — encrypted archive round trip and wrong-passphrase checks passed. |
| F-1-16 unidentified external links | FIXED — GitHub is named; crawled destinations returned 200. |
| F-1-6 reopened demo lock regression | FIXED — demo has no Lock vault action and retains its shell through Reset. |
| F-1-12 reopened checksum wording | FIXED — public copy says **“download check”** and README explains the SHA-256 file-check list. |
| F-2-1 free-feature claim coverage | FIXED — the tagged test performs every promised unlicensed operation. |
| F-2-2 phone Linux download | FIXED — Android/iPhone receive desktop-download guidance and no binary match. |
| F-2-3 unlisted one-command claim | FIXED — the landing heading is **“Command-line installers.”** |
| F-2-4 unlisted AES detail | FIXED — retained copy makes only the tested encryption statement. |
| F-2-5 unlisted deletion promise | FIXED — Delete local archive has a tagged storage-deletion test. |
| F-2-6 inaccurate “Start for real” | FIXED — **Leave demo** names and performs the exit/discard result. |
| F-3-1 demo license leakage | FIXED — live license sentinels were ignored and unchanged; scheduling stayed disabled. |
| F-3-2 demo data retained on leave | FIXED — live re-entry returned to the two-copy seed. |
| F-3-3 incomplete claim tests | FIXED — recurrence restore, shell installer, and release-manifest outcomes are asserted. |
| F-3-4 first-screen fact set | FIXED — privacy, offline, and price facts are all present. |
| F-3-5 25 px demo wordmark | FIXED — the populated-demo test measures it at least 44 px. |
| F-3-6 unlisted release/static details | FIXED — release trigger, static output, and response-policy entries exist and passed. |
| F-3-7 unclear landing labels | FIXED — **“Why keep calendar copies”** and **“Standard restore format.”** |

## Structure, accessibility, links, and visual identity

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200. A missing route returned a designed archive-style page with HTTP 404 and a working home action.
- Every route had `lang="en"`, one `main`, one h1, a route-specific title, a description, canonical, Open Graph/Twitter metadata, SVG favicon, and Apple touch icon.
- Titles were **“Calendar Snapshotter — recover calendar changes”**, **“Demo — Calendar Snapshotter”**, **“Privacy — Calendar Snapshotter”**, **“Terms — Calendar Snapshotter”**, and **“Page not found — Calendar Snapshotter.”**
- The shared header was Home / Demo / Privacy / Terms. Every footer included Home, Demo, Privacy, Terms, Param Factory, and v0.1.6.
- Deep links loaded directly. Same-origin navigation and Back focused the route h1 and restored scroll.
- Every discovered internal route, GitHub destination, release download, discovery file, image, and installer returned 200. The two `mailto:` links are explicit contact actions.
- Playwright Axe found no serious or critical issue on the five checked routes at 390 px. There was no horizontal overflow or console error. Manual touch-target inspection found F-4-1.
- Live headers included CSP with header-only `frame-ancestors`, `X-Content-Type-Options`, Referrer-Policy, Permissions-Policy, and HSTS.
- Root JavaScript was 1.80 kB gzip; demo JavaScript was 10.66 kB gzip. `npm test` passed 15 tests; lint, TypeScript/Rust checks, and `npm run build` passed. The build produced `dist/app` and `dist/site`.
- The monochrome broadsheet/archive composition, generated calendar plate, proof marks, oversized dates, and serif/monospace pairing match `.factory/design.md` and do not resemble a generic SaaS template.

## Missed leverage

No missing high-value feature was found. Calendar comparison is deterministic, and sending event content to a model would conflict with the brief’s privacy constraint. Calendar-file import, direct calendar-server capture, scheduled copies for existing license holders, selected-event export, and full encrypted archive transfer are present. New scheduling sales remain paused, but the limitation is stated on the first screen and in the license section.

## What would make this perfect

Increase the two legal-page email targets to 44 px and cover all legal-route controls in the mobile target test. Register and test the Node/Rust requirement and native prerequisite setup claims, or remove those promises. Then rerun every declared claim from a clean clone plus the live touch-target, route, link, request-log, Reset, Leave/re-entry, offline export, and Axe checks. Nothing else remained in this review.
