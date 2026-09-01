# Independent verification 4 — PASS

**Candidate:** `f404c100daae4e98898bc346e9dc968dcdc32555`  
**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>  
**Verified:** 2026-09-01 UTC from a clean dependency installation

## Decision

**PASS.** The live static site matches the tested candidate, the declared claims have passing observable checks, and the core calendar recovery journey works with the shipped demo data. One low-severity documentation command issue is recorded below.

## First-read check

**PASS.** A cold desktop visit states the job in plain words: “Keep a recoverable calendar history.” It identifies the audience as people whose plans change, and the first action is **Try it with sample data**, explained as opening a safe sample project. One click opens `/demo/`, where the persistent banner says “Demo — sample data, nothing is saved to your archive.”

## Mandatory claims gate

`.factory/claims.json` exists with 20 claims. Every exact declared command completed successfully after `npm ci`.

| Claim | Exact command | Result |
| --- | --- | --- |
| `calendar-recovery` | `npm run test:e2e -- --grep @claim:calendar-recovery` | PASS — changed copies and selected-event ICS export |
| `sample-project` | `npm run test:e2e -- --grep @claim:sample-project` | PASS — isolated sample and banner |
| `calendar-diff` | `npm run test:e2e -- --grep @claim:calendar-diff` | PASS — moved and cancelled entries |
| `ics-restore-export` | `npm run test:e2e -- --grep @claim:ics-restore-export` | PASS — standard ICS output with timezone data |
| `demo-private` | `npm run test:e2e -- --grep @claim:demo-private` | PASS — separate demo database |
| `no-event-telemetry` | `npm run test:e2e -- --grep @claim:no-event-telemetry` | PASS — demo requests stay same-origin |
| `encrypted-local-vault` | `npm run test:e2e -- --grep @claim:encrypted-local-vault` | PASS — known event text absent from stored envelope |
| `encrypted-caldav-credentials` | `npm run test:e2e -- --grep @claim:encrypted-caldav-credentials` | PASS — fixture connection values absent from stored envelope |
| `passphrase-no-recovery` | `npm run test:e2e -- --grep @claim:passphrase-no-recovery` | PASS — wrong passphrase leaves vault locked |
| `unchanged-refresh` | `npm run test:e2e -- --grep @claim:unchanged-refresh` | PASS — duplicate import retains one edition |
| `recurrence-timezones` | `npm test -- -t @claim:recurrence-timezones` | PASS — recurrence override and timezone fixture |
| `calendar-connection` | `npm run test:e2e -- --grep @claim:calendar-connection` | PASS — fixture direct calendar connection |
| `native-caldav-transport` | `cargo test --manifest-path src-tauri/Cargo.toml native_caldav_transport` | PASS — direct ICS GET, CalDAV REPORT, URL-scheme validation |
| `scheduled-caldav` | `npm run test:e2e -- --grep @claim:scheduled-caldav` | PASS — 15-minute fixture schedule records one copy |
| `license-price` | `npm run test:e2e -- --grep @claim:license-price` | PASS — US$29 one-time price and free manual workflow |
| `checksum-install` | `npm test -- -t @claim:checksum-install` | PASS — mismatch rejected before install |
| `unsigned-preview` | `npm test -- -t @claim:unsigned-preview` | PASS — no macOS or Windows signing configuration |
| `release-packaging` | `npm test -- -t @claim:release-packaging` | PASS — release matrix, checksums, and manifest contract |
| `site-response-policy` | `npm test -- -t @claim:site-response-policy` | PASS — headers and styled unknown-route response contract |
| `release-downloads` | `npm run test:e2e -- --grep @claim:release-downloads` | PASS — detected-platform release asset link |

Landing, demo, README, Privacy, and Terms statements were checked against the manifest. Visitor-facing calendar recovery, separation, encryption, connection, scheduling, price, release, and installer statements have matching claim coverage.

## Local quality checks

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 0 dependency vulnerabilities reported |
| `npm test` | PASS — 9 checks in 3 files |
| `npm run lint` | PASS |
| `npm run check` | PASS after installing standard Linux Tauri GUI development prerequisites in this disposable container |
| `cargo test --manifest-path src-tauri/Cargo.toml` | PASS — 3 native transport checks; no failures |
| `npm run build` | PASS — created `dist/app` and `dist/site` |
| `npm run test:e2e` | PASS — 18 Chromium checks |
| `npm run test:e2e:static` | PASS — 3 built-static Chromium checks |
| `scripts/verify-url.sh http://127.0.0.1:4174/` | PASS — title, language, main landmark, and image alternatives |

Production sizes are within the static budgets: landing JavaScript is 1.52 kB gzip and CSS 2.51 kB gzip; desktop/demo JavaScript is 9.27/9.01 kB gzip and CSS 3.20 kB gzip.

## Product and accessibility checks

- Confirmed the normal recovery journey: create a vault, import two changed ICS copies, review moved and cancelled events, select the cancelled event, and download a restore ICS file.
- Confirmed invalid and recovery behavior through the app checks: mismatched passphrases, incorrect vault passphrase, non-calendar input, unchanged import, unavailable release metadata, and unavailable network state retain a clear next step.
- Confirmed the desktop site and populated demo have no horizontal overflow at 390 px. Visible buttons and links meet the 44 px target in automated mobile measurement.
- Confirmed keyboard order begins at the skip link; Enter moves to `main`; the sample action is keyboard reachable. The observed focus style is a visible 3 px `rgb(158, 47, 40)` outline.
- Confirmed reduced-motion emulation returns no hero animation. Axe Playwright found zero serious or critical findings on the landing route; full app and static suites repeat Axe checks on product routes.
- Confirmed no browser console errors or page errors on the locally built landing page, mobile page, live landing page, or fresh live demo.

## Live deployment, privacy, and response checks

- Root HTML SHA-256 is `cf87a0f8f2b4411d395dee3c4df235371d1366d026dcb0f669faa683e478ce74`, identical to `dist/site/index.html` from the candidate. The deployed landing JavaScript also exactly matches local `index-Bs8G1LkJ.js`.
- Live `/`, `/demo/`, `/privacy/`, and `/terms/` return 200. An unknown route returns 404 and the designed 404 document.
- Fresh live `/demo/` makes only same-origin requests and creates only `demo:calendar-snapshotter` in IndexedDB. It makes no analytics, advertising, remote-font, or calendar-content request. The landing page separately makes the documented `api.github.com` release-metadata request.
- Live response headers include CSP with header-delivered `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a permissions policy. HTML has a 30-second cache policy; hashed JavaScript has `max-age=31536000, immutable`.
- The optional license verification endpoint returned the documented invalid-token response. In 80 same-client checks, the first 30 responses were 200 and following responses were 429 with `Retry-After` (observed values 0–4 seconds). The observed allowance is 30 requests per short window.

## Desktop release checks

Release `v0.1.3` is published with macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`. The live Linux action resolved to the v0.1.3 AppImage. A fresh `Calendar.Snapshotter_0.1.3_amd64.deb` download passed `sha256sum --check` against the published manifest. `latest.json` is valid JSON and lists Linux, Windows, macOS arm64, and macOS x64 artifacts. Packages are intentionally unsigned and the site and README state that fact.

## Defects by severity

### Low

1. `npm run serve:site` without a positional port fails because `scripts/serve-static.mjs` receives no port and Node reports `ERR_SOCKET_BAD_PORT`. The README presents this command without an argument. `npm run serve:site -- 4174` works. This does not affect the production build, deployed site, or desktop application, but the documented local static-preview command should be made directly runnable.

## Verification conclusion

The candidate passes the release acceptance checks. The low-severity local preview documentation issue is the only recorded follow-up.
