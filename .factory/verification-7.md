# Independent verification 7 — FAIL

**Candidate:** `1d5a686015ec71c43e9cba7a15fedd1618e847d0`  
**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>  
**Verified:** 2026-09-02 UTC from the supplied clean checkout

## Decision

**FAIL.** The static site is the candidate and the browser demo works, but the downloadable desktop packages were built from older commit `9fd4dbaae309b31b2b353fef7f55aa2e4437326f`. The candidate has later desktop-app changes, including the demo-license isolation and local-archive deletion paths. A malformed/truncated ICS file is also accepted as an empty calendar copy, producing false cancellation results. In addition, the mandatory first clean-worker claims pass was 33/34 because the native claim could not compile until additional host packages were installed.

## First-read gate

**PASS.** A cold live load says **“Keep a recoverable calendar history.”** It identifies people who rely on changing calendars and places **“Try it with sample data”** beside **“Opens a safe sample project.”** The three first-screen facts state demo separation, offline use of the open sample, and free manual recovery/paused license sales. The action opens `/demo/` in one click.

## Claims gate

`.factory/claims.json` exists and contains 34 claims. Every listed command was invoked separately before the broader suite.

- Initial mandatory clean-worker result after `npm ci`: **33 PASS, 1 FAIL**. `cargo test --manifest-path src-tauri/Cargo.toml native_caldav_transport` exited 101 because `glib-2.0.pc` was unavailable. The work order defines any failing first claim execution as release-blocking.
- After installing the README/handoff-listed Tauri Linux prerequisites (`libglib2.0-dev`, `libwebkit2gtk-4.1-dev`, `libappindicator3-dev`, `librsvg2-dev`), the same native command passed all three tests: direct ICS GET, CalDAV REPORT, and unsupported-scheme rejection.
- Final post-prerequisite result: **34/34 commands pass**. Each claim identifier has one source test tag, including the Rust doc tag for `native-caldav-transport`.

## Clean build and repository gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 165 packages, 0 audit vulnerabilities |
| `npm test` | PASS — 12 tests in 3 files |
| `npm run lint` | PASS |
| `npm run check` | PASS — TypeScript and Rust |
| `npm run build` | PASS — produced `dist/app` and `dist/site` |
| `npm run test:e2e` | PASS — 27 tests |
| `npm run test:e2e:static` | PASS — 6 tests |
| `scripts/verify-url.sh` on `/`, `/demo/`, `/privacy/`, `/terms/` | PASS |

## End-to-end and input evidence

- Keyboard only: Tab reached the skip link and all header links, then **Try it with sample data**. Enter opened the demo; Space selected the cancelled Airport train; Enter on **Export 1 event** downloaded `calendar-restore-2026-09-02.ics`. The file contained `VCALENDAR`, `VTIMEZONE`, and the selected event.
- The complete landing-to-demo/export request log contained 12 requests, all to the product origin, with no console or page errors.
- Normal invalid input (`this is not calendar data`) was rejected with **“This file is not an iCalendar calendar.”** The archive stayed at two copies, and a subsequent valid ICS import succeeded.
- **Failure:** a truncated file containing `BEGIN:VCALENDAR`, an unclosed `VEVENT`, UID, and summary was accepted. The UI reported **“Calendar copy saved with 0 events.”** and added a third copy. Against a populated previous copy, this can falsely present every prior event as cancelled.
- Short passphrases were blocked by native form validation; mismatched passphrases showed **“The two passphrases do not match.”** Correcting the value created the encrypted archive successfully.

## Live deployment identity and installers

- The live root, demo, Privacy, Terms, hashed JS/CSS, `robots.txt`, `sitemap.xml`, and both installer scripts byte-match the locally built candidate. Representative root hash: `94de49570c6497af3c4cbeddff289413d1afb882c716f054859fc9a2434fd866`.
- GitHub release `v0.1.4` has DMG (arm64/x64), EXE, MSI, AppImage, DEB, RPM, `SHA256SUMS`, and `latest.json`.
- A freshly downloaded `Calendar.Snapshotter_0.1.4_amd64.deb` was 2,568,718 bytes and matched the published SHA-256 `0572693bb321ce082dafdf0f589653d934c218263dfba4f236d9385bbeff5084`.
- **Failure:** tag `v0.1.4` resolves to `9fd4dbaae309b31b2b353fef7f55aa2e4437326f`. GitHub Actions run `33566674914`, which created the current assets, also reports that exact `head_sha`. Candidate `1d5a686` contains later changes to `src/main.ts`, `src/styles.css`, `site/main.ts`, and other shipped files. The release was not rebuilt after those changes.

## Accessibility, responsive behavior, and performance

- Fresh Playwright Axe scans found **0 serious/critical** issues on root, demo, Privacy, Terms, and the styled 404 at desktop and 390 × 844.
- Every route has `lang="en"`, a descriptive title, exactly one `<h1>`, one `<main>`, and no image without `alt`. Normal routes have no console errors, page errors, failed requests, or horizontal overflow. The browser logs the expected failed-resource message only when directly loading the intentional HTTP 404.
- Focus is visibly rendered as a 3 px proof-red outline with 3 px offset. Demo event labels provide 354 × 77 px and 354 × 90 px targets around the 18 px checkboxes. The mobile first action, outcome, and three facts all appear within 844 px.
- With `prefers-reduced-motion: reduce`, maximum transition and animation duration is 0.01 ms on root and demo.
- Lighthouse mobile: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **1.3 s**, LCP **1.4 s**, TBT **120 ms**, CLS **0.007**.
- Gzipped candidate assets: landing JS 1.80 kB plus 0.71 kB route chunk; demo JS 10.34 kB; site CSS 2.86 kB; demo CSS 3.51 kB. The mobile hero AVIF is 11.1 kB. All budgets pass.

## Privacy, headers, and request allowance

- Demo traffic remained same-origin and created the separate `demo:calendar-snapshotter` database. No analytics, advertising, remote fonts, or calendar-content service was contacted.
- Explicit **Check for a newer release** made the documented request to `api.github.com` and returned to the published Linux asset without an error.
- Live invalid-license verification sent one GET containing only the token, received an invalid result, left scheduling locked, and produced no console error.
- The Sociobot product verification endpoint allowed **30 requests per short window**. Requests 31–33 returned **429** with `Retry-After: 4`.
- Root sends HSTS, CSP with `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a restrictive permissions policy. HTML caches for 30 seconds; hashed assets use one-year immutable caching. Unknown routes return the styled page with HTTP 404.
- No sign-in flow exists, so Entra authority validation is not applicable. This is not a PWA and has no product-owned backend, so service-worker and backend persistence/concurrency checks are not applicable.

## Defects by severity

### Critical

1. **The downloadable desktop application does not match the candidate.** The live page distributes release assets built from `9fd4dba`, while the accepted candidate is `1d5a686`. Later desktop changes include demo isolation, demo cleanup, and archive deletion. This violates deployment identity and means candidate claims are not proven for the artifact users install.

### High

2. **Malformed ICS is accepted as an empty snapshot.** A truncated calendar with no closing `VEVENT` or `VCALENDAR` is saved with zero events. It can make every event in the previous copy appear cancelled, undermining the recovery decision the product is meant to support.

3. **The mandatory first claims run was not clean.** The exact native claim command failed in the stock worker until external Tauri/GLib packages were installed. The command passes afterward, but the work order explicitly treats any initial claim failure as release-blocking.

## Required next steps

1. Reject malformed/incomplete ICS before saving and add a claim/regression test proving the archive is unchanged after rejection.
2. Tag a new version from the repaired commit, let the release workflow rebuild every platform package, and verify the workflow `head_sha` equals the accepted candidate.
3. Run every claims command from the fully provisioned clean-worker baseline before any release decision, then repeat checksum, desktop sample-isolation, and live identity checks.
