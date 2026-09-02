# Independent verification 8 — PASS

**Candidate:** `ef998fba21cded336bedb7b8fc215897117285fe`  
**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>  
**Verified:** 2026-09-02 UTC from a clean checkout

## Decision

**PASS.** The deployed static site byte-matches this candidate, and release `v0.1.6` identifies this exact source commit. The real recovery path, isolated demo, encrypted local archive, validation/recovery cases, accessibility, performance, privacy policy, release package, and rate limiting were independently exercised.

## Mandatory first checks

- `.factory/claims.json` exists with **35** declared claims. After `npm ci` (165 packages, 0 vulnerabilities), I ran `npm run test:claims` before the wider QA suite. It invoked every listed command independently, including all demo-entry-point Playwright claims, Vitest claims, static-site claim, and native CalDAV transport claim. The suite completed with no failed claim; its final Playwright result was `status: passed` with no failed tests. The native command provisions its documented prerequisites through `npm run setup:native`, then passed its direct-ICS GET, CalDAV REPORT, and unsupported-scheme cases.
- Cold live first read: **“Keep a recoverable calendar history.”** It says this is for people whose calendars change, says it keeps local copies ready to compare and restore, and places **“Try it with sample data”** beside **“Opens a safe sample project.”** The three visible facts explain demo separation, offline sample use, and free manual recovery. The one-click action opens `/demo/`. **First-read gate: PASS.**

## Repository and build gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 165 packages; 0 vulnerabilities |
| `npm test` | PASS — 15 tests, 3 files |
| `npm run lint` | PASS |
| `npm run check` | PASS — TypeScript plus Cargo |
| `npm run build` | PASS — `dist/app` and `dist/site` |
| `npm run test:e2e` | PASS — 28 browser tests |
| `npm run test:e2e:static` | PASS — 6 built-site tests |
| `scripts/verify-url.sh` on `/`, `/demo/`, `/privacy/`, `/terms/` | PASS |

The production build is small: landing JS 1.80 kB gzip plus 0.71 kB route code; demo JS 10.66 kB gzip; site CSS 2.84 kB gzip; demo CSS 3.49 kB gzip. The hero AVIF is 11.1 kB.

## Product, privacy, and accessibility evidence

- Live desktop and 390 x 844 mobile checks on root, demo, Privacy, Terms, and styled 404 found one `h1`, `lang=en`, a `main` landmark, image alt text, no horizontal overflow, and no serious/critical Axe findings. Normal routes had no console or page errors. The intentional 404 naturally logs its failed resource response while returning the designed page with HTTP 404.
- Keyboard-only use reached the skip link first (visible `rgb(158, 47, 40) solid 3px` focus outline), opened the demo, selected the cancelled event with Space, and exported `calendar-restore-2026-09-02.ics` with Enter. The persistent banner reads **“Demo — sample data, nothing is saved to your archive.”**, has Reset and Leave controls, and showed exactly two seed copies.
- The live sample flow made requests only to `https://calendar-ics-snapshots.sociobot.in`; no analytics, third-party calendar processing, remote fonts, or other third-party requests appeared. Claim coverage also verifies the `demo:calendar-snapshotter` IndexedDB namespace, encrypted vault/credentials, demo reset/leave isolation, malformed ICS rejection without archive mutation, recurrence/timezone restore data, archive round-trip, wrong-passphrase protection, deletion, offline sample export, and unlicensed free recovery/export.
- With `prefers-reduced-motion: reduce`, the largest computed transition/animation duration was 0.01 ms on `/` and `/demo/`.
- Live mobile Lighthouse: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**; FCP 1.2 s, LCP 1.2 s, TBT 0 ms, CLS 0.007. Lighthouse wrote its complete JSON report before its Chromium process reported a tab crash during shutdown; the report scores and the independent Playwright console/error checks above are valid.

## Deployment, package, and policy evidence

- SHA-256 values match between local `dist/site` and live deployment for root, demo, Privacy, Terms, landing CSS, landing JS, and demo JS. Root hash: `c24dab3d03fc5d96c00d8c136b4eb003ffcbfced343729cc1b98f4c28cd07d33`.
- GitHub release `v0.1.6` tag dereferences to `ef998fba21cded336bedb7b8fc215897117285fe`. Published `latest.json` declares the same `source_sha` and has macOS arm64/x64, Windows, and Linux platform entries. It includes DMG arm64/x64, EXE, MSI, AppImage, DEB, RPM, `SHA256SUMS`, and `latest.json`.
- Fresh download: `Calendar.Snapshotter_0.1.6_amd64.deb`, package `calendar-snapshotter`, version `0.1.6`, architecture `amd64`; SHA-256 `1c0a7eeb7b39241f04304acebb80379d8e9e8edbdd6868c55e39fa226539914e`, exactly matching `SHA256SUMS`.
- Live root and immutable JS asset send HSTS, CSP including `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive permissions policy, HTML max-age 30, and one-year immutable assets. `/404-no-such-page` returns the styled 404 with HTTP 404. No sign-in or PWA/service worker exists, so Entra and PWA update checks are not applicable.
- The product verification endpoint accepted 30 invalid-token requests from one client; requests 31–35 returned **429** with `Retry-After: 4`. Its CORS response origin was the product URL. A normal invalid response contains only `valid`, `reason`, and `expires_at`; claims verify calendar data is not sent with license verification.

## Defects by severity

None found that block release.

## Known limitation

The desktop installers are deliberately unsigned previews. This is stated on the landing page and in the README; macOS notarization and Windows Authenticode remain operator work requiring `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`.
