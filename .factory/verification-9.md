# Independent verification 9 — PASS

**Candidate:** `f95e3c32d52154ae41182da971f5c5d3abdd6960`  
**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>  
**Verified:** 2026-09-02 UTC, clean checkout

## Result

**PASS — ready to release.** No release-blocking defects were found.

## Mandatory gates

- `.factory/claims.json` exists with 37 uniquely tagged claims. I ran `npm run test:claims` first from the clean checkout. Its claim commands completed without a recorded failed Playwright result (`test-results/.last-run.json`: `passed`, no failed tests). This includes the demo-entry claims for recovery, invalid/truncated imports, sample isolation/reset/leave, privacy request logging, encrypted storage, passphrase failure, recurrence/time-zone preservation, CalDAV transport and scheduling, archive recovery, licensing boundaries, offline use, installers, release packaging, and static delivery policy.
- Cold first read of the live landing page passes. It says it keeps local calendar copies for people whose schedules change, and the visible first action is **“Try it with sample data”**, followed by **“Opens a safe sample project.”**
- The one-click `/demo/` entry opens two realistic editions and a persistent banner: “Demo — sample data, nothing is saved to your archive,” with **Reset demo** and **Leave demo**.

## Local quality gates

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 165 packages, 0 npm vulnerabilities |
| `npm run test:claims` | PASS — 37 declared claim commands (see above) |
| `npm test` | PASS — 4 files, 17 tests |
| `npm run lint` | PASS |
| `npm run check` | PASS — TypeScript and `cargo check` |
| `npm run build` | PASS — `dist/app` and `dist/site` |
| `npm run test:e2e` | PASS — 28 Playwright tests |
| `npm run test:e2e:static` | PASS — 7 Playwright tests |

Production build budgets: landing JS 4.12 kB raw / 1.80 kB gzip; demo JS 33.53 kB / 10.66 kB gzip; site CSS 9.76 kB / 2.86 kB gzip; demo CSS 12.72 kB / 3.51 kB gzip. All are within the applicable budgets.

## Live QA

- Rebuilt `dist/site/index.html` SHA-256 is `593145553db672e78bb8a4a718a4b73c116d6b48cce262ff3047d9aa0bbfff69`, exactly matching the cold live root. The live version is `v0.1.6`.
- Desktop and 390 px checks of `/`, `/demo/`, `/privacy/`, and `/terms/` had correct route titles, `lang="en"`, one h1, one main landmark, no horizontal overflow, and no page/console errors. `/not-a-route/` returns the designed HTTP 404 (the browser’s expected network message for the 404 navigation is not an application error).
- Keyboard: the first Tab focuses the skip link with a 3 px designed outline; Enter moves focus to `#main`. All primary mobile controls measured at least 44 px in the shipped tests. Reduced-motion context reports the reduced transition duration (`0.00001s`).
- Axe at 390 px found zero serious or critical issues on `/`, `/demo/`, `/privacy/`, and `/terms/`. `scripts/verify-url.sh https://calendar-ics-snapshots.sociobot.in/` passed title, lang, main, and image-alt checks.
- A fresh Playwright request log through the landing and demo flows contained only the product origin. No analytics, third-party calendar processing, remote font, console, or page error was observed. Root and hashed assets send CSP, HSTS, `X-Content-Type-Options`, strict referrer policy, and immutable one-year caching for assets.
- The live release is `v0.1.6` with macOS, Windows, and Linux assets, `SHA256SUMS`, and `latest.json`. Downloaded `Calendar.Snapshotter_0.1.6_amd64.deb` hashes to `1c0a7eeb7b39241f04304acebb80379d8e9e8edbdd6868c55e39fa226539914e`, matching `SHA256SUMS`; package metadata says `calendar-snapshotter 0.1.6 amd64`.

## Defects by severity

None found.

## Notes

The product has no candidate-owned server API; no in-scope request allowance or 429 behaviour applies. New scheduling-license sales are intentionally paused, so no purchase flow was exercised. Preview native installers are intentionally unsigned, as disclosed on the landing page and README.
