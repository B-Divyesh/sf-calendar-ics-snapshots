# Independent verification 6 — PASS

**Candidate:** `f4aaef12c4e1938bedf50a6bea630f2c9cb50103`  
**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>  
**Verified:** 2026-09-02 UTC from a fresh detached checkout

## Decision

**PASS.** The live static site byte-matches the tested candidate, every declared claim test passed, and the shipped sample demonstrates the recovery job end to end.

## First-read gate

**PASS.** A cold landing screen says “Keep a recoverable calendar history.” Its supporting sentence names people who rely on changing calendars. The primary one-click action is **Try it with sample data**, immediately explained as opening a safe sample project. The three supporting facts say the sample stays separate, manual copies/restores are free, and new scheduling licenses are not for sale.

## Claims gate

`.factory/claims.json` exists and lists 31 claims. After `npm ci`, every listed test was run from the fresh candidate checkout and passed.

| Command family | Result |
| --- | --- |
| 23 separately invoked `npm run test:e2e -- --grep @claim:<id>` commands | PASS — every browser claim: recovery, sample/demo isolation, differences, ICS restore, local encryption, passphrase and archive recovery, calendar connection/schedule, license boundaries, keyboard export, offline, release download, and local deletion. |
| `npm test -- -t @claim:recurrence-timezones`, `mit-license`, `checksum-install`, `unsigned-preview`, `release-packaging`, and `site-response-policy` | PASS — six exact Vitest claim commands. |
| `cargo test --manifest-path src-tauri/Cargo.toml native_caldav_transport` | PASS — three Rust tests: direct ICS GET, CalDAV REPORT, and unsupported-scheme rejection. |
| `npm run test:e2e:static -- --grep @claim:license-sales-paused` | PASS — sale pause is explicit and checkout is absent. |

The native check needed standard Tauri Linux development packages (GLib/GTK/WebKit) installed into this disposable verifier container. With those prerequisites, it compiled and passed; no code changes were made.

## Local quality checks

| Check | Result |
| --- | --- |
| `npm test` | PASS — 10 tests |
| `npm run lint` | PASS |
| `npm run check` | PASS — TypeScript and Rust after normal Tauri Linux prerequisites |
| `npm run build` | PASS — produced `dist/app` and `dist/site` |
| `npm run test:e2e` | PASS — 26 tests |
| `npm run test:e2e:static` | PASS — 6 tests |
| `scripts/verify-url.sh https://calendar-ics-snapshots.sociobot.in/` | PASS |

Production output gzip sizes are landing JS 1.80 kB plus 0.71 kB route chunk and CSS 2.84 kB; demo JS 10.22 kB and CSS 3.46 kB. All are within the specified budgets.

## Product, accessibility, and privacy QA

- The live demo opened at `/demo/` in one click and had its persistent isolated-sample banner. Two believable calendar editions show a moved Planning review and cancelled Airport train; the latter is selectable for ICS restore export.
- Tests exercised recovery and error paths: unchanged import, bad vault/archive passphrase, invalid license, invalid calendar scheme, reset, encrypted archive roundtrip, delete-local-vault, fixture scheduling, release metadata fallback, and offline export.
- At desktop and 390 × 844, live root/demo were usable with no horizontal overflow. Keyboard-only selection/export is covered by the claim test; direct inspection confirmed the skip link and designed focus treatment. Reduced motion was enabled for the mobile axe run.
- Axe found zero serious/critical findings on live root, demo, Privacy, Terms, and 404. Root, demo, Privacy, and Terms had no console/page errors. The expected network failure log for directly loading the HTTP-404 route is not a root/app console error.
- Cold landing request logging showed only same-origin product requests. The claims test validates the demo database is `demo:calendar-snapshotter`, separate from the real vault. The landing’s optional GitHub release lookup is explicitly permitted by CSP; calendar data is not sent to it or any other third party.

## Deployment, headers, and release

- Local candidate output hash-matched live `index.html`, `index-BuJrgw2w.js`, `route-DeiQe-k1.js`, and `site-DCJH-YPg.css` exactly.
- Root response headers: CSP includes `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin `Referrer-Policy`, and a restrictive `Permissions-Policy`. Live HTML has `Cache-Control: public, must-revalidate, max-age=30`; hashed assets have `max-age=31536000, immutable`.
- The styled unknown route returns HTTP 404. `scripts/verify-url.sh` passes the live root’s title, language, main landmark, and image alternatives.
- GitHub release `v0.1.4` includes the required macOS, Windows, and Linux artifacts plus `latest.json` and `SHA256SUMS`. A freshly downloaded Linux RPM checksum matched the published sum: `7eb5d35981b36088b675e9f338c65108adc0f67545998ccc8739d20a3b7c5a87`.

## Defects by severity

None found in the acceptance scope.

## Notes

A Lighthouse command was attempted with the installed Playwright Chromium but the tab crashed while the first native Tauri compilation saturated the disposable verifier container. The independent bundle, cache, responsive, Axe, keyboard, header, and visual checks pass. This product has no product-owned server-side endpoint or sign-in flow; a 429 allowance test and Entra identity check are therefore not applicable.
