# Independent verification 10 — FAIL

**Candidate:** `214be2493685fc4914bdbc376e73f1a4c0a7f9b7`

**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>

**Verified:** 2026-09-02 UTC from a clean checkout

## Decision

**FAIL — do not release this candidate.** The declared claim commands and routine quality gates all pass, and the static deployment byte-matches the candidate. Independent boundary testing nevertheless found two failures in the required timezone-aware recovery job. The published desktop packages also identify an older source commit rather than this candidate.

No product code was modified during verification.

## Mandatory first-read gate

**PASS.** A cold 1440 × 900 load plainly answers the three required questions in the first viewport:

- What it does: **“Keep a recoverable calendar history.”**
- Who it is for: **“For people who rely on changing calendars…”**
- What to do first: **“Try it with sample data,”** beside **“Opens a safe sample project.”**

The same viewport shows the sample-isolation, offline, and free/manual-recovery facts. One click opens `/demo/`, where two “Northstar studio week” calendar copies, one moved event, one cancelled event, and the persistent demo banner are already present.

## Mandatory claims gate

`.factory/claims.json` exists and contains 37 claims. Immediately after `npm ci`, every exact listed command was run separately against its declared sandbox; all exited 0. Every claim tag occurs exactly once in the test sources.

| Claim | Exact command | Result |
| --- | --- | --- |
| `calendar-recovery` | `npm run test:e2e -- --grep @claim:calendar-recovery` | PASS |
| `reject-truncated-ics` | `npm run test:e2e -- --grep @claim:reject-truncated-ics` | PASS |
| `sample-project` | `npm run test:e2e -- --grep @claim:sample-project` | PASS |
| `calendar-diff` | `npm run test:e2e -- --grep @claim:calendar-diff` | PASS |
| `ics-restore-export` | `npm run test:e2e -- --grep @claim:ics-restore-export` | PASS |
| `demo-private` | `npm run test:e2e -- --grep @claim:demo-private` | PASS |
| `no-event-telemetry` | `npm run test:e2e -- --grep @claim:no-event-telemetry` | PASS |
| `encrypted-local-vault` | `npm run test:e2e -- --grep @claim:encrypted-local-vault` | PASS |
| `encrypted-caldav-credentials` | `npm run test:e2e -- --grep @claim:encrypted-caldav-credentials` | PASS |
| `passphrase-no-recovery` | `npm run test:e2e -- --grep @claim:passphrase-no-recovery` | PASS |
| `unchanged-refresh` | `npm run test:e2e -- --grep @claim:unchanged-refresh` | PASS |
| `recurrence-timezones` | `npm test -- -t @claim:recurrence-timezones` | PASS, but insufficient; see blocker 2 |
| `calendar-connection` | `npm run test:e2e -- --grep @claim:calendar-connection` | PASS |
| `native-caldav-transport` | `npm run claim:native-caldav-transport` | PASS |
| `scheduled-caldav` | `npm run test:e2e -- --grep @claim:scheduled-caldav` | PASS |
| `license-price` | `npm run test:e2e -- --grep @claim:license-price` | PASS |
| `demo-reset` | `npm run test:e2e -- --grep @claim:demo-reset` | PASS |
| `demo-leave` | `npm run test:e2e -- --grep @claim:demo-leave` | PASS |
| `archive-roundtrip` | `npm run test:e2e -- --grep @claim:archive-roundtrip` | PASS |
| `archive-wrong-passphrase` | `npm run test:e2e -- --grep @claim:archive-wrong-passphrase` | PASS |
| `license-token-only` | `npm run test:e2e -- --grep @claim:license-token-only` | PASS |
| `free-accessibility-export` | `npm run test:e2e -- --grep @claim:free-accessibility-export` | PASS |
| `offline-local` | `npm run test:e2e -- --grep @claim:offline-local` | PASS |
| `no-account-import` | `npm run test:e2e -- --grep @claim:no-account-import` | PASS |
| `license-sales-paused` | `npm run test:e2e:static -- --grep @claim:license-sales-paused` | PASS |
| `mit-license` | `npm test -- -t @claim:mit-license` | PASS |
| `invalid-license-locks-scheduling` | `npm run test:e2e -- --grep @claim:invalid-license-locks-scheduling` | PASS |
| `checksum-install` | `npm test -- -t @claim:checksum-install` | PASS |
| `unsigned-preview` | `npm test -- -t @claim:unsigned-preview` | PASS |
| `release-packaging` | `npm test -- -t @claim:release-packaging` | PASS |
| `site-response-policy` | `npm test -- -t @claim:site-response-policy` | PASS |
| `release-trigger` | `npm test -- -t @claim:release-trigger` | PASS |
| `static-site-output` | `npm test -- -t @claim:static-site-output` | PASS |
| `release-downloads` | `npm run test:e2e -- --grep @claim:release-downloads` | PASS |
| `delete-local-vault` | `npm run test:e2e -- --grep @claim:delete-local-vault` | PASS |
| `runtime-requirements` | `npm test -- -t @claim:runtime-requirements` | PASS |
| `native-prerequisite-setup` | `npm test -- -t @claim:native-prerequisite-setup` | PASS |

The landing page, application copy, README, and claim list were cross-checked. The visitor-facing claims have corresponding entries. The issue is not an absent claim: the timezone claim's test does not exercise the actual UI export path and therefore passes while the promised outcome fails.

## Clean repository gates

| Check | Result | Evidence |
| --- | --- | --- |
| Candidate identity | PASS | `HEAD` and `origin/main` were `214be2493685fc4914bdbc376e73f1a4c0a7f9b7` before documentation changes. |
| Install | PASS | `npm ci`; 165 packages; 0 vulnerabilities. |
| Unit/integration | PASS | `npm test`; 4 files and 17 tests passed. |
| Lint | PASS | `npm run lint`. |
| Type/native compile | PASS | `npm run check`; TypeScript and `cargo check` completed using Rust 1.98.0. |
| Production build | PASS | `npm run build`; both `dist/app` and `dist/site` produced. |
| Browser suite | PASS | `npm run test:e2e`; 28/28 passed. |
| Production-static suite | PASS | `npm run test:e2e:static`; 8/8 passed. |

Built bundle sizes are within contract: app JS 34.21 kB raw / 10.94 kB gzip; demo JS 33.53 kB / 10.66 kB gzip; site JS 4.12 kB / 1.81 kB gzip; app/demo CSS 12.94 kB / 3.54 kB gzip; site CSS 9.81 kB / 2.88 kB gzip. No font payload is shipped. The selected mobile hero AVIF is 11,093 bytes.

## End-to-end and boundary evidence

Normal recovery works in both the candidate browser build and live demo: two calendar copies show one moved and one cancelled event; keyboard Space selects the cancelled “Airport train”; Enter downloads `calendar-restore-2026-09-02.ics`; the file contains `VCALENDAR`, `VERSION:2.0`, `VTIMEZONE`, and the selected event. The same open demo remained usable after the browser context went offline and exported a valid restore file.

The full test suite also exercised a short passphrase, mismatched passphrases, a wrong vault/archive passphrase, non-calendar input, truncated/malformed ICS without archive mutation, duplicate imports, archive round-trip, invalid license, connection errors, demo reset/leave isolation, and local-vault deletion.

Independent timezone boundary cases fail:

1. Two valid calendar copies containing the same UID and `10:00` local text but changing `TZID` from `America/New_York` to `Europe/London` produce two editions but **0 moved** changes. The UI says **“This calendar copy matches the last one.”** These instants are five hours apart on the test date. The parser keeps only the property value in `start`/`end`, then diffing compares those values and ignores the `TZID` parameters (`src/core/ics.ts:119-129,160`).
2. Through the actual browser workflow, a first copy containing a deleted event and `VTIMEZONE:America/New_York`, followed by an empty second copy, correctly shows the deletion. Its exported restore file contains `DTSTART;TZID=America/New_York` but contains no `BEGIN:VTIMEZONE`. The UI passes the newer snapshot to `buildRestoreCalendar` (`src/main.ts:422-429`), which copies timezone blocks only from that newer snapshot (`src/core/ics.ts:172-183`).

The tagged recurrence/timezone test avoids the real failure because it calls `buildRestoreCalendar(before, diffCalendars(before, after))` (`src/core/ics.test.ts:26-35`); the UI calls it with the selected newer copy.

## Live deployment, privacy, accessibility, and performance

- All 25 deployable files under rebuilt `dist/site` (excluding the deployment configuration file itself) byte-match their live URLs. Root SHA-256 is `4d797158fbea88ea3c85e9c5e7d94dc40d94388c2a9fd456c12ef27080cd8faa`; demo SHA-256 is `9a08a0b5069d22bccdd3f463d6fd3dd9073f69c370ad3ad029f09e1667cab175`.
- Fresh desktop and 390 × 844 checks of `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200, used the correct route title and `lang="en"`, contained one h1 and one main landmark, had no horizontal overflow, and emitted no console, page, or failed-request errors. The designed unknown route returned HTTP 404.
- Axe found zero serious or critical findings on every public route at both viewports. `scripts/verify-url.sh` passed every public route. The first Tab exposes a 3 px proof-red skip-link outline; Enter moves focus to `main`; route navigation focuses the destination h1 with the same visible outline. At a 640 px layout with root text set to 200%, all public routes retained their h1/main and had no horizontal overflow. Demo change labels provide 354 × 77/90 px activation areas around the 18 px checkboxes.
- Reduced motion changes transitions to `0.00001s`. No flashing or looping motion was observed.
- A fresh live demo flow requested only `https://calendar-ics-snapshots.sociobot.in`. It created only `demo:calendar-snapshotter`; it made no analytics, remote-font, calendar-upload, license, or third-party request. The optional **Check for a newer release** action contacted only `api.github.com` and completed without a console error. A live invalid-license UI check sent one GET containing only the entered token and returned the expected inactive result.
- Root/demo responses include CSP with `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a restrictive permissions policy. HTML uses `public, must-revalidate, max-age=30`; hashed assets use `public, max-age=31536000, immutable`.
- Mobile Lighthouse on the live root scored 100 performance, 100 accessibility, 100 best practices, and 100 SEO. FCP was 1.0 s, LCP 1.1 s, CLS 0.005, and total blocking time 30 ms. Initial transfer was 37,402 bytes with no third-party or font bytes.
- This is a desktop app plus static site, not a PWA; no service worker is declared. No sign-in is required, so the Entra requirement does not apply.
- The Sociobot product-verification endpoint allowed 30 rapid invalid-token requests from one client. Requests 31–35 returned 429 with `Retry-After` values of 2–3 seconds. An ordinary invalid response is `{"expires_at":null,"reason":"invalid","valid":false}`, `Cache-Control: no-store`, and the product origin is allowed by CORS.

## Installer and release evidence

Release `v0.1.6` provides two macOS DMGs, Windows MSI and EXE, Linux AppImage, DEB and RPM packages, `SHA256SUMS`, and `latest.json`. The public release workflow completed successfully. The Linux DEB downloaded as 2,569,484 bytes and SHA-256 `1c0a7eeb7b39241f04304acebb80379d8e9e8edbdd6868c55e39fa226539914e`, matching `SHA256SUMS`; metadata reports package `calendar-snapshotter`, version `0.1.6`, amd64. The checked installer script downloaded and installed the 75 MB AppImage into an isolated temporary directory after verifying its checksum. The extracted DEB binary remained running for a 12-second Xvfb smoke launch without an application error.

However, release `latest.json` records `source_sha` `ef998fba21cded336bedb7b8fc215897117285fe`, the peeled `v0.1.6` tag points to that commit, and the successful release workflow used that same SHA. Candidate `214be249…` is 11 commits newer. Its post-tag changes include `src/styles.css`, including the visible h1 focus treatment and mobile demo-shell navigation behavior. The native packages therefore do not represent the candidate under review.

## Defects by severity

### Release blockers

1. **Timezone-only event moves are reported as unchanged.** Change comparison discards the `TZID` parameter and compares only identical wall-clock strings. This violates the brief’s timezone-correctness constraint and can hide a several-hour schedule move from the recovery view.
2. **Deleted zoned events can export without their timezone definition.** The actual UI-produced restore file can reference `TZID=America/New_York` while omitting its earlier `VTIMEZONE`. This contradicts the declared timezone-preservation claim and makes restore behavior dependent on the importing calendar’s private timezone knowledge.
3. **Published desktop artifacts are not built from candidate `214be249…`.** Their manifest and tag identify `ef998fba…`, before later shipped-source changes. A desktop-app candidate cannot be accepted without checksummed packages built from that candidate.

### High

1. **Saved credentials may be sent over cleartext HTTP.** The native transport explicitly accepts both `https` and `http`, then attaches HTTP Basic credentials (`src-tauri/src/lib.rs:10-31`). A non-TLS calendar URL can expose the username, password, and calendar response on the network. Require HTTPS except, if genuinely needed for development, an explicit loopback-only exception.

### Contract deviation

1. The persistent sample banner offers **Leave demo**, not the demo contract’s required **Start for real** action. It does safely discard demo data and return to the download page, so this is not the reason for the FAIL.

## Required retest

Make timezone parameters part of event identity/comparison, export the `VTIMEZONE` blocks required by selected earlier events, add claim coverage through the real UI export path for both cases, require secure calendar-server transport, and publish a new checksummed release from the repaired candidate. Then rerun all 37 claim commands first, followed by the complete local and live matrix above.
