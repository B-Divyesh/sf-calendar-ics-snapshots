# Adversarial first-read review 5 — Calendar Snapshotter

**Verdict: FAIL**  
**Reviewed:** 2026-09-02 UTC  
**Candidate:** `361e0cb9902c5ec7c6b2af468889d5ba2bec6e3c`  
**Live:** <https://calendar-ics-snapshots.sociobot.in/>

Two structure/copy findings remain. A PASS requires zero findings.

## Cold first read

| View | What it does | Who it is for | First action | Result |
| --- | --- | --- | --- | --- |
| 390 × 844, fresh browser | Keeps local calendar copies, compares changes, and lets a person restore an earlier event. | People who rely on calendars that change. | **Try it with sample data**; the adjacent text says **“Opens a safe sample project.”** | PASS |
| 1440 × 900, fresh browser | The same recovery job is clear. | The same audience is named. | **Try it with sample data**. | PASS |

Before scrolling, the phone displayed **“Keep a recoverable calendar history.”**, **“For people who rely on changing calendars, it keeps local calendar copies ready to compare and restore.”**, the sample action, its result, and the privacy/offline/price facts. The action's bottom edge was at 353 px and the final fact at 445 px, within the 844 px viewport. There were no console or page errors and no horizontal overflow at either width.

## Findings

### Major

#### F-5-1 — The mobile header hides Privacy and Terms

- **Location / evidence:** live `/`, `/demo/`, `/privacy/`, `/terms/`, and the 404 page at 390 px. The header visibly contains only **“Home”** and **“Demo”**. `site/site.css:19` applies `.site-header nav a:nth-child(n+3){display:none}`, which hides the required **“Privacy”** and **“Terms”** links.
- **Why this fails:** the required shared site header must retain its legal navigation on every route. The footer eventually provides these links, but a phone visitor must scroll through the entire page to reach them. That is not a consistent header with Privacy/Terms.
- **Concrete fix:** keep the four header links accessible at 390 px, for example by wrapping them into a visible compact menu that is keyboard-operable and names Privacy and Terms, or by allowing the four short links to wrap. Add a 390 px browser test for every route that asserts the header exposes Home, Demo, Privacy, and Terms.

### Minor

#### F-5-2 — The 404 headline uses an archive metaphor instead of naming the page state

- **Location / quote:** live unknown route `/not-a-route/`: **“This page is not in the archive.”** (`site/404.html:3`).
- **Why this fails:** it relies on the product's newspaper/archive motif rather than plainly naming the state. The plain-words requirement says headings must carry their information without metaphor.
- **Concrete fix:** change the h1 to **“Page not found.”** Keep the useful following explanation, **“The address may be incomplete or the page may have moved.”**

## Copy audit

Counts use visible word tokens. Labels, headings, actions, and dynamic landing states are included. No landing or README sentence exceeds 22 words. No banned marketing adjective, inconsistent saved-version term, or non-result button was found. The two flags above concern the mobile site shell and 404 heading.

### Landing page

| Copy | Words | Flag |
| --- | ---: | --- |
| Skip to main content | 4 | — |
| Calendar Snapshotter | 2 | — |
| Home / Demo / Privacy / Terms | 1 each | F-5-1 at 390 px |
| Local calendar recovery | 3 | — |
| Keep a recoverable calendar history. | 5 | — |
| For people who rely on changing calendars, it keeps local calendar copies ready to compare and restore. | 17 | — |
| Try it with sample data | 5 | — |
| Opens a safe sample project. | 5 | — |
| Sample data stays separate from your archive. | 7 | — |
| The open sample archive works offline. | 6 | — |
| Manual recovery is free; new scheduling licenses are paused. | 9 | — |
| Download for Linux / Windows / macOS on GitHub | 5 each | — |
| View desktop downloads on GitHub | 5 | — |
| Calendar Snapshotter runs on macOS, Windows, and desktop Linux. | 9 | — |
| Published download ready. | 3 | — |
| v0.1.6 · download check available | 4 | — |
| Check for a newer release | 5 | — |
| The latest check was unavailable. | 5 | — |
| The published v0.1.6 download is ready. | 6 | — |
| Layered calendar pages show one appointment moving beside an archival lock. | 11 | — |
| Local calendar copies make changed appointments easier to recover. | 9 | — |
| Local encrypted vault / Added, moved, and cancelled events / Calendar restore file (.ics) / No analytics | 3 / 5 / 4 / 2 | — |
| Why keep calendar copies | 4 | — |
| Find what changed in a schedule. | 6 | — |
| Meetings move. / Events disappear. | 2 / 2 | — |
| A provider may be unavailable when you need an earlier plan. | 11 | — |
| Calendar Snapshotter compares each local copy. | 6 | — |
| It marks added, moved, and cancelled events for review. | 9 | — |
| How it works / Save. Compare. Restore. | 3 / 3 | — |
| Save a calendar copy / Review changes / Restore selected events | 4 / 2 / 3 | — |
| Import a calendar file (.ics). | 5 | — |
| Existing license holders can schedule copies from a calendar server (CalDAV). | 11 | — |
| See added, moved, and cancelled events in a short list. | 10 | — |
| Export selected earlier events to a calendar restore file (.ics). | 10 | — |
| Privacy and limits | 3 | — |
| Calendar copies stay in your local vault. | 7 | — |
| Encrypted vault / No calendar uploads / Standard restore format / Important limit | 2 / 3 / 3 / 2 | — |
| Calendar copies and saved sign-in details are encrypted before local storage. | 11 | — |
| The app has no analytics or third-party calendar processing. | 9 | — |
| Restore files use the standard calendar format (.ics). | 8 | — |
| Scheduled copies run only while Calendar Snapshotter is open. | 9 | — |
| Paused / New license sales / Scheduling license | 1 / 3 / 2 | — |
| Scheduling sales are paused. | 4 | — |
| New licenses are not currently for sale. | 7 | — |
| Existing license holders can schedule calendar server copies while the app is open. | 12 | — |
| Manual calendar copies, change review, full archive backup, and restore files remain free. | 13 | — |
| Enter a license token | 4 | — |
| Sample project walkthrough | 3 | — |
| See the recovery steps before installing. | 6 | — |
| 1. Load the sample / 2. Select a change / 3. Export a restore file | 4 / 4 / 5 | — |
| The sample opens in a separate demo vault. | 8 | — |
| Choose the earlier event to recover. | 6 | — |
| Import the file into your calendar. | 6 | — |
| Install from the command line / Command-line installers. | 5 / 2 | — |
| macOS / Linux / Windows | 1 each | — |
| Download the Windows installer from the desktop downloads link above. | 10 | — |
| Unsigned preview: v0.1.6 installers are not code-signed. | 7 | — |
| Calendar Snapshotter · Local calendar copies and restore files | 9 | — |
| All releases on GitHub (external) | 5 | — |
| Editorial plate generated for this product; provenance is in the source repository. | 11 | — |
| Built by Param Factory · v0.1.6 | 6 | — |

Terminology is consistent: **calendar copy** (saved version), **sample project** (try-out), **calendar restore file (.ics)** (output), **calendar server connection** (remote setup), and **vault** (encrypted local storage).

### README

| Sentence | Words | Flag |
| --- | ---: | --- |
| Calendar Snapshotter is a desktop tool for people who rely on calendars and need a recoverable local history. | 18 | — |
| It encrypts calendar copies, shows changes, and creates calendar restore files. | 11 | — |
| Keeps calendar copies and saved calendar connection details in an encrypted local vault. | 12 | — |
| Imports ordinary `.ics` exports without an account. | 7 | — |
| Records a calendar copy from a direct file or calendar server connection (CalDAV). | 13 | — |
| Ignores an unchanged refresh instead of creating another calendar copy. | 10 | — |
| Compares calendar copies as added, moved, and cancelled events. | 9 | — |
| Preserves recurring overrides and timezone data in restore files. | 9 | — |
| Exports selected earlier events as a standard calendar restore file (.ics). | 10 | — |
| Exports and imports the full encrypted archive for local backup or transfer. | 12 | — |
| Supports scheduled calendar server copies for existing license holders while the app is open. | 14 | — |
| Manual copies, change review, archive backup, and restore files are available without a license. | 14 | — |
| New scheduling licenses are not currently for sale. | 8 | — |
| Keyboard access, screen-reader structure, archive backup, and restore files do not require a license. | 14 | — |
| Use the desktop browser entry at `/?demo=1`. | 7 | — |
| You can also choose Try it with sample data on the landing page. | 12 | — |
| The browser demo uses separate browser storage named `demo:calendar-snapshotter`. | 9 | — |
| The second calendar copy moves a planning review and removes an airport train. | 13 | — |
| Reset demo restores the two shipped calendar copies without changing a real vault. | 13 | — |
| Leave demo returns to the download page without copying sample data. | 11 | — |
| Download the detected desktop installer from the landing page. | 9 | — |
| macOS and Linux also have a command-line installer that checks the download before installing. | 14 | — |
| Preview packages are unsigned. | 4 | — |
| GitHub Releases provides DMG, MSI/EXE, AppImage, DEB, and RPM assets. | 11 | — |
| Each release includes a SHA-256 file-check list (`SHA256SUMS`) and a source commit in `latest.json`. | 14 | — |
| Requirements: Node.js 22+ and Rust stable. | 7 | — |
| The setup command checks native prerequisites and installs the required Ubuntu or Debian packages when needed. | 16 | — |
| Run the claim checks declared in `.factory/claims.json`. | 6 | — |
| You can run all browser claim coverage with `npm run test:e2e -- --grep @claim`. | 14 | — |
| The release workflow runs for `v*` tags and supports manual dispatch. | 11 | — |
| It builds native packages on GitHub-hosted macOS, Windows, and Linux runners. | 11 | — |
| Static deployment publishes the built site in `dist/site`. | 9 | — |
| It includes security headers, asset caching, discovery files, and a styled 404. | 12 | — |
| Calendar content and saved connection details are encrypted before local storage. | 11 | — |
| Calendar requests go from the desktop app to the URL the user supplies. | 13 | — |
| Use Delete local archive in the app to remove this vault. | 11 | — |
| The product has no analytics, tracking scripts, remote fonts, or calendar-content services. | 12 | — |
| License verification sends only the entered license token to Sociobot. | 10 | — |
| The passphrase cannot be recovered. | 5 | — |
| Users should keep independent backups for critical records. | 8 | — |
| See Privacy and Terms. | 4 | — |

## Demo, sandbox, claims, and privacy

- The first landing action opens `/demo/` in one click. Its first rendered screen already contained the two realistic **Northstar studio week** calendar copies, including moved **Planning review** and cancelled **Airport train**.
- The persistent banner read **“Demo — sample data, nothing is saved to your archive.”** Reset restored exactly two copies. Leave returned to `/` and re-entry reseeded the sample.
- A fresh demo context created only `demo:calendar-snapshotter`; a complete landing/demo/reset/leave request log contained only `https://calendar-ics-snapshots.sociobot.in` requests. The sample export succeeded while offline in its declared test. No demo action contacted a real archive namespace.
- `.factory/claims.json` has 37 distinct entries. I ran `npm run test:claims` from the fresh clone before other checks; every listed exact tagged command completed successfully, including browser sandbox, unit, static-delivery, installer, release-manifest, native-transport, and prerequisite tests. The final Playwright last-run record reports `status: passed` and no failed tests.
- Every user-reliant landing/README claim cross-checks to a listed claim: recovery, malformed-import rejection, sample separation/reset/leave, diffs, standard `.ics` restore, offline use, encrypted storage, no analytics/calendar processing, archive recovery, license boundaries, transport/scheduling, deletion, installer integrity, unsigned preview, releases, and static delivery. No unlisted claim was found.

## Earlier finding confirmation

| Earlier finding | Live/code confirmation |
| --- | --- |
| F-1-1 | PASS — phone first screen contains audience, action, outcome, and facts. |
| F-1-2; F-3-2 | PASS — Reset and Leave/re-entry restore the two-copy seed. |
| F-1-3 | PASS — sales are plainly paused; no checkout action is offered. |
| F-1-4; F-2-1; F-3-3; F-3-6; F-4-2; F-4-3 | PASS — 37 claimed behaviors have exact tagged coverage; the fresh claim runner passed. |
| F-1-5 | PASS — saved versions are consistently calendar copies. |
| F-1-6 | PARTIAL — desktop and footer shell are consistent, but the mobile header hides Privacy and Terms; reopened as F-5-1. |
| F-1-7 | PASS — forward and Back route changes focus the h1 and use the live announcer. |
| F-1-8 | PASS — demo h1 is “Review changes in the sample calendar.” |
| F-1-9; F-1-10; F-1-11; F-1-12; F-1-13; F-1-14 | PASS — current wording is plain, result-naming, and within the word cap. |
| F-1-15 | PASS — full encrypted archive export/import and wrong-passphrase coverage exist. |
| F-1-16 | PASS — external links name GitHub and announce external destination. |
| F-2-2 | PASS — Android/iPhone receive “View desktop downloads on GitHub,” never a Linux binary. |
| F-2-3; F-2-4; F-2-5; F-2-6 | PASS — command installer, encryption wording, deletion, and Leave demo behavior are covered/plain. |
| F-3-1 | PASS — demo storage is separate and demo license controls do not write production license keys. |
| F-3-4 | PASS — first facts cover separation, offline use, and price. |
| F-3-5 | PASS — demo wordmark and tested controls meet the 44 px target. |
| F-3-7 | PASS — “Why keep calendar copies” and “Standard restore format” are explicit headings. |
| F-4-1 | PASS — legal email links measured 183 × 44 px at 390 px. |

## Structure, links, accessibility, and identity

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200 with route-specific titles, descriptions, canonicals, OG/Twitter metadata, favicon/apple icon, one h1, and one main landmark. Unknown routes returned the styled HTTP 404. `robots.txt` and `sitemap.xml` list the public routes.
- All crawled same-origin routes, release links, and the GitHub source/release destinations resolved. The page uses the designed newsprint/broadsheet identity from `.factory/design.md`; it is not a generic SaaS layout.
- `scripts/verify-url.sh` passed on all four normal routes. At 390 px Axe found zero serious/critical violations on those routes; visible normal controls met 44 px. Keyboard focus is visible; reduced-motion transition/animation duration was 0.00001 s.
- Live responses sent CSP (including `frame-ancestors 'none'` as a response header), HSTS, `nosniff`, strict referrer policy, and appropriate same-origin/API connect sources. The first demo flow made no third-party requests.

## Missed leverage

No additional AI step is implied: change detection and restore are deterministic calendar operations, and adding an AI feature would not improve the core recovery task. Import/export, direct ICS/CalDAV capture, scheduled copies, full archive backup, and restore are present.

## What would make this perfect

Expose Privacy and Terms from the phone header, replace the 404 archive metaphor with “Page not found.”, then re-run the 390 px route/header test and the complete claims suite. With those two changes, no remaining review issue is evident.
