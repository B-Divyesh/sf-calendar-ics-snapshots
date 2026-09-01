# First-read product QA review 1 — Calendar Snapshotter

**Verdict: FAIL**  
**Reviewed:** 2026-09-01 UTC  
**Candidate:** `79b289782a1922af7b6972c136e9640fbc8962b4`  
**Live:** <https://calendar-ics-snapshots.sociobot.in/>

The review has 4 blocking, 8 major, and 4 minor findings. A PASS requires zero findings and no untested claims.

## First screen before scrolling

| View | What it does | Who it is for | What to select first | Result |
| --- | --- | --- | --- | --- |
| Desktop, 1440 × 900 | It keeps local calendar copies so changed or removed events can be restored. | People whose plans change. | **Try it with sample data**; the adjacent note says it opens a safe sample project. | PASS |
| Phone, 390 × 844 | The partial headline suggests that it keeps calendar history. | Cannot answer from the first screen. The audience sentence is below the fold. | Cannot identify the intended primary action. Only the small **Demo** navigation link is visible; **Try it with sample data** is below the fold. | **BLOCKING** |

Exact phone first-screen text was **“Calendar Snapshotter”**, **“Demo”**, **“Local calendar recovery”**, and the large headline **“Keep a recoverable calendar history.”** The illustration occupies about 430 px below the header. The audience sentence starts below 844 px and the sample action is farther down.

## Findings

### Blocking

#### F-1-1 — The phone first screen does not state the audience or show the primary action

- **Location / quote:** live `/` at 390 × 844. The visible content ends in the oversized **“Keep a recoverable calendar history.”** The required **“For people whose plans change…”** sentence and **“Try it with sample data”** action are below the first viewport.
- **Why this fails first use:** a phone visitor cannot answer who the product is for or what to select first without scrolling. This fails the mandatory first-screen shape.
- **Concrete fix:** place the hero copy before the illustration on small screens, reduce the mobile headline and image height, and keep the audience sentence, sample action, its outcome note, and three short facts within the first 844 px. Add a 390 × 844 check that confirms the bottom edge of the sample action and its explanation is within `window.innerHeight`.

#### F-1-2 — Reset demo leaves changed sample data in place

- **Location / quote:** live `/demo/`, **“Reset demo”**. After importing a third edition named **“Reset check”**, selecting Reset left three editions and the event visible. The page emitted **“Close the other Calendar Snapshotter window before resetting the demo.”**
- **Why this fails first use:** the required reset control does not restore the shipped two-edition sample. The README claim **“The demo banner can reset its own data”** is therefore false on the live product. A real-storage sentinel remained unchanged, so storage separation itself is confirmed.
- **Concrete fix:** close all open `IDBDatabase` handles before `indexedDB.deleteDatabase`, wait for deletion, and then reseed or reload. Add a claim entry and browser check that imports a third demo edition, resets, confirms exactly two original editions, confirms the changed event is gone, and confirms a real-database sentinel is untouched.

#### F-1-3 — The paid license action is a dead link

- **Location / quote:** landing license section, **“Buy the US$29 license”** → `https://api.sociobot.in/api/v1/products/calendar-ics-snapshots/checkout`.
- **Observed result:** a normal GET returns HTTP 404 with `{"error":"enabled factory product","status":404}`.
- **Why this fails first use:** the page offers a purchasable US$29 feature, but the purchase route does not open checkout. Broken purchase routing is blocking.
- **Concrete fix:** enable this product in the Sociobot billing catalog or point the action to its valid Sociobot checkout route. Add a no-spend check that confirms the action returns a 2xx/3xx checkout response for this slug.

#### F-1-4 — Visitor promises are missing from the claims contract

- **Locations / exact claims:** README: **“Accessibility and data export are never paywalled.”**; **“The demo banner can reset its own data…”**; **“License verification sends only the entered license token to Sociobot.”** Landing/README: **“On macOS, right-click the app and choose Open.”** and **“Windows may show a SmartScreen prompt.”**
- **Why this fails review:** none has a matching `.factory/claims.json` entry with an observable tagged check. The reset promise also fails in practice. The unsigned-package check proves the packages lack signing configuration; it does not confirm either operating-system launch instruction.
- **Concrete fix:** add one tagged, observable sandbox check per retained promise. Remove speculative operating-system behavior that cannot be confirmed, or narrow it to the tested statement **“Preview installers are unsigned.”** The reset promise needs the end-to-end check described in F-1-2.

### Major

#### F-1-5 — The same saved item has three names

- **Location / quote:** landing and README alternate among **“calendar copy”**, **“snapshot”**, and **“edition”**; examples include **“Import an ICS file. Optionally schedule CalDAV copies…”**, **“Manual snapshots…”**, and **“another edition.”**
- **Why this slows first use:** a new visitor must infer whether these are separate objects. The repository’s own terminology table says the one term is **calendar copy**.
- **Concrete fix:** use **calendar copy** for the saved version everywhere. Reserve **snapshot** for the product name only. For example, use **“Save a calendar copy”**, **“Manual calendar copies are free”**, and **“does not create another copy.”**

#### F-1-6 — Header and footer structure changes by route

- **Location / quote:** `/` navigation is **Demo / How it works / License / Source**; `/privacy/` is **Home / Demo / Terms**; `/terms/` is **Home / Demo / Privacy**; `/404.html` is **Demo / Privacy / Terms**. `/demo/` has neither the site header nor a footer with Privacy and Terms.
- **Why this matters:** visitors lose predictable navigation and legal links when moving into the product. This does not meet the required consistent route skeleton.
- **Concrete fix:** use one shared header and footer across `/`, `/demo/`, `/privacy/`, `/terms/`, and the 404 page. Keep at most four stable navigation choices and retain the demo banner inside that shell.

#### F-1-7 — Route changes do not move focus to the new heading

- **Location:** live navigation from the root footer to `/privacy/`, then browser Back.
- **Observed result:** scroll restored correctly on Back, but `document.activeElement` was `<body>` after both navigations. No route-change live announcement is present.
- **Why this matters:** keyboard and screen-reader users are not placed at or informed about the new page heading as required.
- **Concrete fix:** on navigation, focus the destination `<h1 tabindex="-1">` and announce its text through a polite live region. Add forward and Back checks for focus, title, and scroll restoration.

#### F-1-8 — The demo h1 is the product name, not the page job

- **Location / quote:** `/demo/` has one h1, **“Calendar Snapshotter.”**
- **Why this matters:** the h1 does not explain the task on the product screen and conflicts with the required route-heading pattern.
- **Concrete fix:** use a task heading such as **“Review changes in the sample calendar.”** Keep Calendar Snapshotter as the linked wordmark or eyebrow.

#### F-1-9 — “Your calendar is not a hosted service” is ambiguous and can be false

- **Location / quote:** landing Privacy and limits heading, **“Your calendar is not a hosted service.”**
- **Why this misleads:** a visitor may use a hosted Google, Apple, or Microsoft calendar. The intended claim concerns Snapshotter’s storage, not the visitor’s calendar.
- **Concrete rewrite:** **“Calendar copies stay in your local vault.”**

#### F-1-10 — Two interface labels use decorative newsroom language

- **Location / quote:** demo **“Local continuity desk”** and **“Change desk.”**
- **Why this slows first use:** neither label names the product area clearly when read out of context.
- **Concrete rewrites:** **“Local calendar archive”** and **“Changes in this copy.”**

#### F-1-11 — Two actions name an outcome they do not perform

- **Location / quote:** landing **“Paste a license token”** only reveals a form; demo **“Unlock scheduled snapshots”** only opens the license dialog.
- **Why this misleads:** selecting either control does not produce the stated result.
- **Concrete rewrites:** **“Enter a license token”** and **“View the scheduling license.”**

#### F-1-12 — Important user copy introduces unexplained technical terms

- **Location / quote:** **“ICS restore export,” “Schedule CalDAV copies,” “No event telemetry,” “separate IndexedDB database,” “notarized,”** and **“Authenticode-signed.”** README opens with **“local-first”** and **“operational data.”**
- **Why this slows first use:** the terms are not explained where a non-technical calendar user first encounters them.
- **Concrete rewrite:** introduce the plain term first, then the standard in parentheses: **“calendar restore file (.ics)”**, **“scheduled copies from a calendar server (CalDAV)”**, **“no analytics or calendar uploads”**, and **“separate browser storage.”** Replace the README opening with **“Calendar Snapshotter is a desktop tool for people who rely on calendars and need a recoverable local history.”** Use **“unsigned installers”** before platform-specific signing terms.

### Minor

#### F-1-13 — “Readable changes” does not name what is shown

- **Location / quote:** landing product-summary strip, **“Readable changes.”**
- **Why this is weak:** it is an adjective without a concrete result and could describe many products.
- **Concrete rewrite:** **“Added, moved, and cancelled events.”**

#### F-1-14 — One README sentence exceeds 22 words

- **Location / quote:** README release paragraph, **“Static deployment publishes `dist/site`; it includes CSP and security headers, cache policy for hashed assets, `robots.txt`, `sitemap.xml`, and a styled 404 through `staticwebapp.config.json`.”** — 23 words.
- **Why this matters:** it combines deployment output, headers, caching, discovery files, and 404 behavior in one sentence.
- **Concrete rewrite:** **“Static deployment publishes `dist/site`. It includes security headers, asset caching, `robots.txt`, `sitemap.xml`, and a styled 404.”**

#### F-1-15 — The local history has no full archive backup and import

- **Location:** product capability review against the brief’s recoverable-history job.
- **Why this is missed leverage:** selected events can be exported, but a user cannot back up or move the full encrypted history. Loss of application data can therefore remove the very history the product preserves.
- **Concrete feature:** add **Export encrypted archive** and **Import encrypted archive**. Preserve calendar copies and optional connection settings, require the vault passphrase, never upload the file, and add round-trip and wrong-passphrase claim checks. A model-assisted feature is not justified for deterministic calendar comparison.

#### F-1-16 — External links are not identified as external

- **Location / quote:** root header **“Source”**, footer **“All releases”**, and **“Buy the US$29 license.”**
- **Why this matters:** each leaves the product origin without saying so.
- **Concrete rewrite:** **“Source on GitHub”**, **“All releases on GitHub”**, and **“Buy on Sociobot.”** Add visible or screen-reader text when a link opens a new tab.

## Copy audit

Counts use visible word tokens. Headings, labels, actions, alternatives, and dynamic states are included because visitors encounter them as product copy. Code commands are counted by whitespace. A dash means no flag.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Calendar Snapshotter | 2 | — |
| Demo | 1 | — |
| How it works | 3 | — |
| License | 1 | — |
| Source | 1 | F-1-16 |
| Local calendar recovery | 3 | — |
| Keep a recoverable calendar history. | 5 | — |
| For people whose plans change, it keeps local copies ready to compare and restore. | 14 | F-1-5 |
| Try it with sample data | 5 | — |
| Opens a safe sample project. | 5 | — |
| View release downloads | 3 | — |
| Download for Linux / Windows / macOS | 3 each | — |
| Checking downloads… | 2 | — |
| v0.1.3 · checksum published | 3 | F-1-12 |
| Downloads are being published. | 4 | — |
| The release page will update soon. | 6 | — |
| Sample data stays separate from your archive. | 7 | — |
| Manual snapshots and restore exports are free. | 7 | F-1-5 |
| One-time scheduling license: US$29. | 4 | — |
| Layered paper calendar editions with one appointment moving between versions beside an archival lock. | 14 | F-1-5 |
| Local calendar copies make changed appointments easier to recover. | 9 | F-1-5 |
| Local encrypted vault | 3 | F-1-12 |
| Readable changes | 2 | F-1-13 |
| ICS restore export | 3 | F-1-12 |
| No analytics | 2 | — |
| 01 / Why keep copies | 4 | — |
| Find what changed in a schedule. | 6 | — |
| Meetings move. | 2 | — |
| Events disappear. | 2 | — |
| A provider may be unavailable when you need an earlier plan. | 11 | — |
| Calendar Snapshotter compares each local copy. | 6 | F-1-5 |
| It marks added, moved, and cancelled events for review. | 9 | — |
| How it works | 3 | — |
| Save. Compare. Restore. | 3 | — |
| Save a copy | 3 | — |
| Import an ICS file. | 4 | F-1-12 |
| Optionally schedule CalDAV copies while the app is open. | 9 | F-1-12 |
| Review changes | 2 | — |
| See added, moved, and cancelled events in a short list. | 10 | — |
| Restore selected events | 3 | — |
| Export selected earlier events to an ICS file for import into your calendar. | 13 | F-1-12 |
| Privacy and limits | 3 | — |
| Your calendar is not a hosted service. | 7 | F-1-9 |
| Encrypted vault | 2 | F-1-12 |
| Snapshots and saved credentials are encrypted before local storage. | 9 | F-1-5 |
| No event telemetry | 3 | F-1-12 |
| The app has no analytics or third-party calendar processing. | 9 | — |
| Open export | 2 | — |
| Restore files use the standard ICS format. | 7 | F-1-12 |
| Important limit | 2 | — |
| Scheduled copies run only while Calendar Snapshotter is open. | 9 | — |
| US$29 one time | 3 | — |
| One-time license | 2 | — |
| Schedule CalDAV copies. | 3 | F-1-12 |
| Free features include manual ICS copies, change review, and restore export. | 11 | F-1-12 |
| US$29 adds saved CalDAV details and scheduled copies while the app is open. | 13 | F-1-12 |
| Buy the US$29 license | 5 | F-1-3, F-1-16 |
| Paste a license token | 4 | F-1-11 |
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
| The sample archive shows two saved calendar editions. | 8 | F-1-5 |
| 1. Load the sample | 4 | — |
| The sample opens in a separate demo vault. | 8 | F-1-12 |
| The second sample edition lists a moved planning review and a cancelled airport train. | 13 | F-1-5 |
| 2. Select a change | 4 | — |
| Choose the earlier event to recover. | 6 | — |
| The app confirms an ICS file has been exported for the selected airport train event. | 15 | F-1-12 |
| 3. Export an ICS file | 5 | F-1-12 |
| Import the file into your calendar. | 6 | — |
| Install from the command line | 5 | F-1-12 |
| Install with one command. | 4 | — |
| macOS / Linux | 2 | — |
| `curl -fsSL …/install.sh \| sh` | 5 | F-1-12 |
| Windows PowerShell | 2 | F-1-12 |
| `irm …/install.ps1 \| iex` | 4 | F-1-12 |
| Unsigned preview | 2 | — |
| v0.1.3 installers are not yet notarized or Authenticode-signed. | 8 | F-1-4, F-1-12 |
| On macOS, right-click the app and choose Open. | 8 | F-1-4 |
| On Windows, review the SmartScreen prompt before running. | 8 | F-1-4, F-1-12 |
| Calendar Snapshotter · Local calendar copies and restore exports | 8 | F-1-5 |
| Privacy | 1 | — |
| Terms | 1 | — |
| All releases | 2 | F-1-16 |
| Editorial plate generated for this product; provenance is in the source repository. | 11 | — |
| Built by Param Factory · v0.1.3 | 5 | — |

No landing sentence exceeds 22 words. No banned marketing adjective appears.

### README

| Copy | Words | Flag |
| --- | ---: | --- |
| Calendar Snapshotter | 2 | — |
| Calendar Snapshotter is a local-first desktop utility for people whose calendar is operational data. | 14 | F-1-12 |
| It keeps encrypted calendar copies, shows what changed, and exports selected earlier events as an ICS restore file. | 18 | F-1-12 |
| Live site | 2 | — |
| What it does | 3 | — |
| Keeps snapshots and saved calendar connection details in an encrypted local vault. | 12 | F-1-5, F-1-12 |
| Imports ordinary `.ics` exports without an account. | 7 | F-1-12 |
| Records a calendar copy from a direct ICS or CalDAV connection. | 11 | F-1-12 |
| Ignores an unchanged refresh instead of creating another edition. | 9 | F-1-5 |
| Compares editions as added, moved, and cancelled events. | 8 | F-1-5 |
| Preserves recurring overrides and timezone data in restore files. | 9 | F-1-12 |
| Exports selected earlier event forms as a standard ICS restore file. | 11 | F-1-12 |
| Adds scheduled CalDAV copies while the desktop app is open with the optional license. | 14 | F-1-12 |
| Manual copies, change review, and restore exports are free. | 9 | — |
| A US$29 one-time Continuity license adds scheduling. | 8 | — |
| Accessibility and data export are never paywalled. | 7 | F-1-4 |
| Try the sample project | 4 | — |
| Use the desktop browser entry at `/?demo=1`, or choose Try it with sample data on the landing page. | 18 | F-1-12 |
| It opens the browser demo directly in the separate IndexedDB database `demo:calendar-snapshotter`. | 12 | F-1-12 |
| The second edition moves a planning review and removes an airport train. | 12 | F-1-5 |
| The demo banner can reset its own data or return to the landing page without copying anything. | 17 | F-1-2, F-1-4 |
| Install | 1 | — |
| Download the detected installer from the landing page, or use a checksum-verifying installer. | 13 | F-1-12 |
| Preview packages are unsigned. | 4 | — |
| On macOS, right-click the app and choose Open on first launch. | 11 | F-1-4 |
| Windows may show a SmartScreen prompt. | 6 | F-1-4, F-1-12 |
| GitHub Releases provides DMG, MSI/EXE, AppImage, DEB, and RPM assets plus `SHA256SUMS`. | 12 | F-1-12 |
| Develop | 1 | — |
| Requirements: Node.js 22+, Rust stable, and the Tauri 2 system prerequisites. | 11 | — |
| Test and build | 3 | — |
| Every visitor-facing promise is listed in `.factory/claims.json`. | 8 | F-1-4 |
| Run the exact declared commands from that file, or run all browser claim coverage with `npm run test:e2e -- --grep @claim`. | 21 | — |
| The release workflow runs for `v*` tags and can be dispatched manually. | 12 | — |
| It builds native packages on GitHub-hosted macOS, Windows, and Linux runners. | 11 | — |
| Static deployment publishes `dist/site`; it includes CSP and security headers, cache policy for hashed assets, `robots.txt`, `sitemap.xml`, and a styled 404 through `staticwebapp.config.json`. | 23 | F-1-14 |
| Privacy and security model | 4 | — |
| Calendar content and saved calendar connection details are serialized into one encrypted IndexedDB envelope. | 14 | F-1-12 |
| Calendar requests go directly from the desktop app to the URL the user supplies. | 14 | — |
| The product has no analytics, tracking scripts, remote fonts, or event-content APIs. | 12 | F-1-12 |
| License verification sends only the entered license token to Sociobot. | 10 | F-1-4 |
| The passphrase cannot be recovered. | 5 | — |
| Users should keep independent backups for critical records. | 8 | — |
| See Privacy and Terms. | 4 | — |
| Project map | 2 | — |
| `src/` — desktop UI, encrypted vault, ICS parser/diff/export | 7 | F-1-12 |
| `src-tauri/` — Tauri 2 shell and native CalDAV transport | 8 | F-1-12 |
| `site/` — product, purchase, download, privacy, and terms pages | 8 | — |
| `public/install.*` — checksum-verifying installers | 3 | F-1-12 |
| `.github/workflows/release.yml` — native release matrix and manifests | 7 | — |
| `.factory/design.md` — visual system and asset provenance | 7 | — |
| License | 1 | — |
| MIT © 2026 Sociobot (Param Factory). | 5 | — |

The fenced shell and PowerShell commands are executable examples, not prose sentences. No banned marketing adjective appears.

## Claim checks

All 20 exact commands in `.factory/claims.json` passed from a fresh clone of the reviewed commit. The native command first confirmed that the base container lacked the documented Tauri Linux packages; after installing the same packages named in `.github/workflows/release.yml`, the exact command passed three checks.

| Claim id | Exact command | Result |
| --- | --- | --- |
| `calendar-recovery` | `npm run test:e2e -- --grep @claim:calendar-recovery` | PASS |
| `sample-project` | `npm run test:e2e -- --grep @claim:sample-project` | PASS |
| `calendar-diff` | `npm run test:e2e -- --grep @claim:calendar-diff` | PASS |
| `ics-restore-export` | `npm run test:e2e -- --grep @claim:ics-restore-export` | PASS |
| `demo-private` | `npm run test:e2e -- --grep @claim:demo-private` | PASS |
| `no-event-telemetry` | `npm run test:e2e -- --grep @claim:no-event-telemetry` | PASS |
| `encrypted-local-vault` | `npm run test:e2e -- --grep @claim:encrypted-local-vault` | PASS |
| `encrypted-caldav-credentials` | `npm run test:e2e -- --grep @claim:encrypted-caldav-credentials` | PASS |
| `passphrase-no-recovery` | `npm run test:e2e -- --grep @claim:passphrase-no-recovery` | PASS |
| `unchanged-refresh` | `npm run test:e2e -- --grep @claim:unchanged-refresh` | PASS |
| `recurrence-timezones` | `npm test -- -t @claim:recurrence-timezones` | PASS |
| `calendar-connection` | `npm run test:e2e -- --grep @claim:calendar-connection` | PASS |
| `native-caldav-transport` | `cargo test --manifest-path src-tauri/Cargo.toml native_caldav_transport` | PASS — 3 checks |
| `scheduled-caldav` | `npm run test:e2e -- --grep @claim:scheduled-caldav` | PASS |
| `license-price` | `npm run test:e2e -- --grep @claim:license-price` | PASS |
| `checksum-install` | `npm test -- -t @claim:checksum-install` | PASS |
| `unsigned-preview` | `npm test -- -t @claim:unsigned-preview` | PASS |
| `release-packaging` | `npm test -- -t @claim:release-packaging` | PASS |
| `site-response-policy` | `npm test -- -t @claim:site-response-policy` | PASS |
| `release-downloads` | `npm run test:e2e -- --grep @claim:release-downloads` | PASS |

The declared checks pass, but F-1-4 records unlisted promises. The claims gate is therefore incomplete.

## Demo, privacy, and offline behavior

- One selection from the desktop first screen opens `/demo/` directly in the working product.
- The first demo screen shows two realistic **Northstar studio week** copies, a moved Planning review, and a cancelled Airport train.
- The persistent banner says **“Demo — sample data, nothing is saved to your archive.”**
- A fresh demo created only `demo:calendar-snapshotter`. All demo requests were same-origin.
- A separately created `calendar-snapshotter` sentinel remained intact during demo use and the failed reset.
- Selecting and exporting the cancelled event still worked after the browser context went offline in the repository check.
- Reset fails as recorded in F-1-2.

## History confirmation

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. The current handoff and all four verification reports were read and their earlier defects were checked again.

| Earlier issue | Live and code confirmation |
| --- | --- |
| Missing claims contract and sample project | Fixed: 20 declared entries exist and `/demo/` opens the used sample in one selection. |
| Metaphorical first-read desktop copy | Fixed on desktop. Regressed at the required phone first-screen size as F-1-1. |
| Broken release download resolution | Fixed: live Linux resolved to the v0.1.3 AppImage without a console error. |
| Mobile overflow and undersized controls | Fixed: root and demo had no horizontal overflow and visible actions measured at least 44 × 44 px. |
| Missing security/static structure | Fixed: CSP and response headers are present; robots, sitemap, metadata, cache policy, and designed 404 respond correctly. |
| Landing demo opened an explanation instead of the product | Fixed: `/demo/` is the populated product. |
| Published packages lagged the candidate | Fixed by the v0.1.3 release checks declared in the repository. |
| Incomplete claim coverage reported in verification 3 | The listed claims were added and pass, but new omissions are recorded in F-1-4. |
| Verification 4 handoff says `npm run serve:site` lacks a default port | Not reproducible: the script defaults to port 4175 and started successfully without a positional port. The old handoff statement is stale. |

The reset failure was not recorded in the prior reports because the existing demo checks confirm the button size and storage name but never select Reset after changing the sample.

## Structure, routing, accessibility, and delivery checks

| Check | Result |
| --- | --- |
| Route titles | PASS: `Calendar Snapshotter — recover calendar changes`, `Demo — Calendar Snapshotter`, `Privacy — Calendar Snapshotter`, `Terms — Calendar Snapshotter`, and `Page not found — Calendar Snapshotter`. |
| One h1 and main landmark | PASS for count; demo heading content fails F-1-8. |
| Description, canonical, OG/Twitter image, favicon, Apple touch icon | PASS on `/`, `/demo/`, `/privacy/`, and `/terms/`. |
| Social image | PASS: declared 1200 × 630 product art. |
| 404 | PASS: unknown route returned HTTP 404 and the designed archive-style page with a home action. |
| Deep links and Back | PASS for loading and scroll restoration; focus fails F-1-7. |
| Link crawl | Internal routes/assets, GitHub source/releases, README links, robots, and sitemap returned 200. Checkout fails F-1-3. Hash links point to existing sections. |
| Header/footer consistency | FAIL: F-1-6. |
| Visual identity | PASS: the monochrome broadsheet, proof-red marks, editorial plate, rules, and type hierarchy are product-specific and match `.factory/design.md`. It does not resemble a generic centered-card template. |
| Axe | PASS: Playwright Axe reported zero serious or critical findings on live root and demo at phone and desktop sizes; the built-static suite repeats checks on all public routes. |
| Semantic helper | PASS on live root and demo for title, language, main landmark, and image alternatives. |
| Keyboard/focus | Skip link and visible focus pass; route-change focus fails F-1-7. |
| Reduced motion | PASS in the full browser suite. |
| Touch targets and overflow | PASS at 390 px in the full browser suite and independent live measurements. |
| Browser console | Clean on initial route loads. Reset produces the F-1-2 page error. |
| Build size | PASS: landing JS 1.52 kB gzip; demo JS 9.01 kB gzip. |
| Live/candidate identity | PASS: live and fresh-build root HTML hashes match; live and fresh-build demo HTML hashes match. |

## Additional quality checks

From the fresh clone:

- `npm test`: PASS — 9 checks.
- `npm run lint`: PASS.
- `npm run check`: PASS after documented Linux Tauri prerequisites were installed.
- `npm run build`: PASS — `dist/app` and `dist/site` produced.
- `npm run test:e2e`: PASS — 18 checks.
- `npm run test:e2e:static`: PASS — 3 checks.

## What would make this perfect

Resolve every F-1 finding: make the phone first screen complete, make demo reset deterministic, restore the checkout route, list and check every retained promise, standardize product terms, use plain headings and action labels, apply one route shell with heading focus, and add encrypted full-archive export/import. Then repeat this entire review from a fresh browser context and fresh clone. Until that run has zero findings, the product is not ready for PASS.
