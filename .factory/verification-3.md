# Independent verification 3 — FAIL

**Candidate:** `4796d14dc1db7b31d42d022238d084141ece1569`  
**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>  
**Verified:** 2026-09-01 UTC from a clean checkout

## Decision

**FAIL — do not release this candidate as complete.** The repaired sample project and v0.1.2 desktop packages work, but the acceptance contract is not complete. Several visitor-facing claims are absent from `.factory/claims.json`; the supplied claims contract makes any unlisted claim release-blocking. The live site also has undersized mobile targets and does not return its designed 404 for an unknown route.

No product code was changed during verification.

## First-read check

**PASS.** A cold 1440 × 900 visit answers all three required questions on the first screen:

- What it does: “Keep a recoverable calendar history.”
- Who it is for: “For people whose plans change…”
- What to do first: **Try it with sample data**, followed by “Opens a safe sample project.”

Activating that link once opened `/demo/` directly in the working product. The page showed the persistent “Demo — sample data, nothing is saved to your archive” banner, two Northstar editions, one moved event, and one cancelled event.

## Mandatory claims gate

`.factory/claims.json` exists. After `npm ci`, every exact command in it passed independently.

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-project` | `npm run test:e2e -- --grep @claim:sample-project` | PASS — demo banner and two editions |
| `calendar-diff` | `npm run test:e2e -- --grep @claim:calendar-diff` | PASS — moved and cancelled events |
| `ics-restore-export` | `npm run test:e2e -- --grep @claim:ics-restore-export` | PASS — downloaded ICS contains Airport train |
| `demo-private` | `npm run test:e2e -- --grep @claim:demo-private` | PASS — demo database is separate |
| `no-event-telemetry` | `npm run test:e2e -- --grep @claim:no-event-telemetry` | PASS — demo requests are same-origin |
| `encrypted-local-vault` | `npm run test:e2e -- --grep @claim:encrypted-local-vault` | PASS — known event text is absent from the stored envelope |
| `license-price` | `npm run test:e2e -- --grep @claim:license-price` | PASS — US$29 one-time price and free manual path |

The cross-check of landing copy, application copy, and README found unlisted claims. Examples include:

- README: direct ICS and CalDAV connections.
- README: unchanged refreshes do not create another edition.
- README: recurring masters, `RECURRENCE-ID`, TZIDs, and `VTIMEZONE` are preserved.
- README: paid scheduled CalDAV checks run while the desktop app is open.
- Landing page: saved credentials are encrypted before local storage.
- Landing page: restore files use the standard ICS format.
- Landing page: “One line, checksum verified.”
- Application: compatibility with Apple Calendar, Google Calendar, Outlook, and standards-compliant CalDAV servers.

Some of these behaviors have ordinary unit coverage or passed an independent check, but they have no matching claim entry and tagged sandbox check. The CalDAV connection and scheduling promise has neither an end-to-end claim check nor a Rust unit check; `cargo test` reported zero Rust tests.

## Clean repository checks

| Check | Result | Evidence |
| --- | --- | --- |
| Candidate identity | PASS | `HEAD` and `origin/main` are `4796d14dc1db7b31d42d022238d084141ece1569`. |
| Clean install | PASS | `npm ci` installed 65 packages; npm reported 0 vulnerabilities. |
| Unit/integration | PASS | `npm test`: 5 checks in 2 files passed. |
| Full browser suite | PASS | `npm run test:e2e`: 14 Chromium checks passed. |
| Production-static browser check | PASS | `npm run test:e2e:static`: 1 check passed. |
| Type and native compile | PASS | `npm run check` passed after installing the same Linux GUI prerequisites declared in the release workflow. |
| Native test target | PASS with coverage gap | `cargo test`: command passed, but contained 0 Rust tests. |
| Exact production build | PASS | `npm run build` created `dist/app` and `dist/site`. |
| Lint | Not available | No lint command is defined in `package.json`. |

Production bundle sizes:

- Desktop UI JavaScript: 26.81 kB raw / 9.29 kB gzip.
- Static demo JavaScript: 26.15 kB raw / 9.02 kB gzip.
- Landing JavaScript: 3.23 kB raw / 1.48 kB gzip.
- Desktop/demo CSS: 11.04 kB raw / 3.21 kB gzip.
- Landing CSS: 8.11 kB raw / 2.49 kB gzip.
- Largest hero fallback: 137,945 bytes; selected mobile AVIF: 11,093 bytes.
- No font files or service worker are shipped. This is a desktop app with a static site, not a PWA.

## Product workflow and recovery checks

The normal and recovery cases worked in fresh browser storage:

- A 9-character passphrase was rejected by form validation.
- Mismatched valid-length passphrases showed “The two passphrases do not match.”
- Non-calendar input showed “This file is not an iCalendar calendar.”
- Importing the same ICS twice kept one edition and explained that it was already current.
- A second calendar copy identified one moved recurring override and one removed event.
- America/New_York wall times stayed consistent in UTC, America/Los_Angeles, and Asia/Kolkata browser contexts.
- The selected removed event exported to a named ICS file with its event and `VTIMEZONE` data.
- Locking and reopening the vault preserved both editions.
- A saved sample CalDAV URL, username, and password were absent from the IndexedDB envelope; only `version`, `salt`, `iv`, and encrypted `data` fields were visible.
- A native dialog received focus, closed with Escape, and returned focus to its opener.
- Keyboard Space selected the event and Enter exported it.

## Live deployment and privacy

- `verify-url.sh` passed on live `/` and `/demo/` for title, language, main landmark, and image alternatives.
- All 23 deployed public files matched the production build byte for byte. Root SHA-256: `fd853c29b0906c7d2fb738f348a399d25b59a03d4d3e41a42ecce34518292fcc`; demo SHA-256: `e66fde4ce3381c2fd3601cfcedbff43441e9646bc5ebfa9065e876b3984a322b`.
- Fresh live visits to `/`, `/demo/`, `/privacy/`, and `/terms/` had no console errors, page errors, failed requests, or responses at 400 or above.
- The landing page requested same-origin files and the documented GitHub release metadata. The demo requested only same-origin files and created only `demo:calendar-snapshotter`.
- No analytics, advertising, remote-font, or calendar-content request occurred.
- Response headers include CSP with header-only `frame-ancestors 'none'`, HSTS, `nosniff`, strict-origin referrer policy, and a permissions policy.
- HTML uses `Cache-Control: public, must-revalidate, max-age=30`; hashed assets use `public, max-age=31536000, immutable`.
- The product has no candidate-owned server endpoint and requires no sign-in. The optional Sociobot purchase and license service was not contacted because it is outside the scoped product resource. No product-owned request allowance check applies.

## Accessibility, responsive layout, and performance

- Playwright axe on live `/`, `/demo/`, `/privacy/`, and `/terms/` at 390 px found 0 serious or critical findings.
- All four routes had one `<h1>`, one `<main>`, no horizontal overflow at 390 px, and no overflow at 320 px.
- The first Tab reached the skip link. Its visible outline was 3 px proof red, and Enter moved focus to `main`.
- Keyboard-only sample selection, export, dialog open, Escape close, and focus return worked.
- Reduced-motion emulation matched and reduced transitions/animations to `0.00001s`.
- Lighthouse mobile on `/`: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.2 s, CLS 0, TBT 20 ms, total transfer 39 KiB.
- Lighthouse mobile on `/demo/`: performance 100, accessibility 100, best practices 100, SEO 100; LCP 0.9 s, CLS 0, TBT 70 ms, total transfer 14 KiB.

Manual target-size measurement found visible controls below the required 44 px minimum. At 390 px, the landing footer links were 14 px high and the wordmark link was 27 px high. In the demo banner, **Reset demo** and **Start for real** were 36 px high. Automated accessibility scoring does not cover this product-specific 44 px requirement.

## Desktop release checks

- Release `v0.1.2` is published. Its tag resolves to product commit `bf048b60d7a657739cef9a0c50f62a92db5bf40b`; candidate `4796d14` differs from that tag only in `.factory/handoff.md`, so the product source is identical.
- Assets include macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`.
- The detected live Linux button linked to the v0.1.2 AppImage and showed “v0.1.2 · checksum published.”
- Independently downloaded `Calendar.Snapshotter_0.1.2_amd64.deb` was 2,433,350 bytes. SHA-256 `1e203bc62406019a2316c6fb82498cf7f855377258406afd56ee05caba3f92cd` matched `SHA256SUMS`; package metadata reports version 0.1.2 and amd64.
- `public/install.sh` passed shell syntax checking and completed in an isolated home directory. It installed the 77,629,944-byte verified AppImage. The AppImage runtime reported normally and the GUI process stayed running for the 15-second headless smoke window.
- Native packages are clearly described as unsigned.

## Defects by severity

### Release-blocking

1. **The claims manifest is incomplete.** The unlisted claims above violate the supplied rule that every visitor-facing claim must have one `.factory/claims.json` entry and one tagged sandbox check. Add observable checks for each promise or remove/narrow the copy. CalDAV connection and scheduling need a representative native check, not only implementation code.

### Major

2. **Several visible mobile targets are below 44 px.** The 390 px landing footer links measured 14 px high, the wordmark link 27 px, and the demo reset/start controls 36 px. Increase their interactive boxes to at least 44 × 44 CSS px while preserving spacing.
3. **Unknown routes do not produce the designed 404.** `GET /definitely-missing-page` returned HTTP 200 and the landing page. `/404.html` exists, but the navigation fallback handles the request first. Configure the deployed route behavior so an unknown URL returns the styled 404 response with an actual 404 status.

### Moderate

4. **Route metadata is incomplete.** Privacy and Terms omit descriptions, canonicals, Open Graph, Twitter, and favicon links; Demo omits Open Graph and Twitter metadata; no 180 px Apple touch icon is linked. The social image is 1200 × 820 rather than the required 1200 × 630.

## Required recheck

Complete the claims manifest and tagged sandbox coverage, enlarge the measured mobile targets, and correct unknown-route handling. Then repeat every claim command, the full browser and native checks, the live one-click sample flow, the scoped release checksum, mobile accessibility checks, response checks, and candidate-to-live file comparison.
