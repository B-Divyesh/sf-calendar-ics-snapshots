# Independent verification — FAIL

**Candidate:** `e0e9fafd32820b098e83d9d15fc3424bba240ec3` (`v0.1.0`)  
**Live URL:** https://calendar-ics-snapshots.sociobot.in/  
**Verified:** 2026-08-30 UTC from a clean checkout at that exact commit

## Result

**FAIL — do not release.** The mandatory claim-test contract is missing, the first screen has no one-click sample-data sandbox, and the deployed landing page logs a real browser console error on every cold load.

## Mandatory gate results

| Gate | Result | Evidence |
| --- | --- | --- |
| Claims before all other QA | **FAIL** | `.factory/claims.json` is absent. Therefore no declared claim test could be run from the demo entry point. This is release-blocking by the claims contract. |
| First-read / demo | **FAIL** | Cold live copy says “Your calendar has a history.” and offers “View downloads”; it never plainly identifies the target user, and there is no “Try it with sample data” action, `/demo` route, demo banner, sample project, or `.factory/demo.md`. |
| Local install | PASS | `npm ci` completed: 65 packages, 0 vulnerabilities reported by npm. |
| Unit/integration tests | PASS | `npm test`: 2 files, 5 tests passed. |
| Type/native check | ENVIRONMENT-BLOCKED | `npm run check` reached `cargo check` but the verifier image lacks `glib-2.0.pc`; `pkg-config` reported missing system package `glib-2.0 >= 2.70`. TypeScript produced no failure before that. This does not override the release failures above. |
| Production build | PASS | `npm run build` created `dist/app` and `dist/site`. App JS: 24,009 B raw / 8.45 KB gzip; landing JS: 3,474 B raw / 1.60 KB gzip; CSS is below 50 KB. |
| Repository E2E | PASS | `npm run test:e2e`: 3 Chromium tests passed, including the existing recovery journey and axe checks. |
| Deployment identity | PASS | SHA-256s for built vs live `index.html`, `main-w9TCFGTM.js`, `main-CxaYOZMD.css`, and `archive-editions-1200.avif` matched exactly. |

## End-to-end evidence

In a clean Chromium context, the app created an encrypted vault, rejected mismatched passphrases and a non-iCalendar file, recorded a two-event snapshot, ignored an unchanged repeat, detected a moved and deleted event, and exported the deleted event to `calendar-restore-2026-08-30.ics`. The exported file contained `VCALENDAR`, `VTIMEZONE`, and `Airport train`. The IndexedDB envelope did not contain the event title in plaintext. A wrong passphrase then returned “The passphrase did not unlock this vault.”

The published `v0.1.0` release contains macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`. The downloaded RPM `Calendar.Snapshotter-0.1.0-1.x86_64.rpm` hashed to `bb27caeb0682ac309ae6e3edd8ff901b2bb26c8d2e65884c37627389ffaa607b`, exactly matching `SHA256SUMS`.

## Live browser, privacy, accessibility, and headers

Live desktop and 390 px landing-page axe runs returned **zero serious/critical findings**. The 390 px landing page had no horizontal overflow. Reduced motion reduced the button transition to `0.01ms`. The skip link is present and focus styles use the designed proof-red 3 px outline in the app.

However, a cold live load made these outgoing requests: same-origin document/assets, `https://api.github.com/repos/B-Divyesh/sf-calendar-ics-snapshots/releases/latest`, and then `https://github.com/.../releases/download/v0.1.0/latest.json`. The final fetch is CORS-blocked. Chromium recorded:

```
Access to fetch at 'https://github.com/.../latest.json' ... has been blocked by CORS policy
Failed to load resource: net::ERR_FAILED
```

This leaves the landing CTA as **“View available downloads”** instead of a detected-platform asset. No analytics, tracking, remote fonts, or calendar content request was observed during the landing flow. The browser-facing privacy claim remains unverified because the required claims file and demo flow do not exist.

The live root response has HSTS, `Referrer-Policy`, and `X-Content-Type-Options`, but no Content-Security-Policy. HTML, JS, CSS, and image assets all use `Cache-Control: public, must-revalidate, max-age=30`, not long-lived immutable caching for hashed assets. `/robots.txt` and `/sitemap.xml` return 404. `/no-such-page` returns a 200 landing page rather than a designed 404. There is no `staticwebapp.config.json` in the candidate.

The product serves no candidate-owned server endpoint, so there is no in-scope API allowance/429 behavior to measure. The paid-license verification is an external Sociobot billing call; it was not exercised with a real token.

## Defects

### Release blockers

1. **Missing claims contract and tests.** `.factory/claims.json` is absent despite numerous user-facing claims (encryption, local-only data, diffing, restore, checksum verification). Add the required file and one observable demo-entry-point test for every claim.
2. **No one-click isolated demo.** The first screen has no “Try it with sample data” action. There is no `/demo`/`?demo=1` entry point, persistent demo banner, reset/start-for-real controls, separate demo storage namespace, shipped realistic sample, or `.factory/demo.md`. Desktop first run also lacks “Load sample project.”
3. **First-read copy fails the acceptance test.** “Your calendar has a history” is a metaphor, not the job, and does not say who this is for. The first screen does not provide the required plain-language next step.

### High

1. **Live console error and broken detected download.** The page fetches `browser_download_url` for `latest.json` from GitHub after using the GitHub API. GitHub does not grant CORS for that redirect, producing the error above and preventing the platform CTA from linking to an artifact.
2. **390 px app UI is horizontally overflowing and controls overlap.** In a populated browser app at 390 px, `document.documentElement.scrollWidth` was 763 px against `innerWidth` 390 px. The supposedly visually-hidden `#ics-file` has computed width 390 px and a right edge at 763 px because the generic input width rule wins. The “CalDAV schedule” link also overlaps the archive count in the captured mobile app screen.
3. **Required site delivery structure/security is missing.** No CSP/static deployment configuration, designed 404, `robots.txt`, or `sitemap.xml`; hashed assets are not immutably cached.
4. **Desktop demo/walkthrough requirement is unmet.** The landing has one editorial illustration, not the required captioned 3–5 frame walkthrough of a loadable sample project.

### Medium

1. **No reproducible verifier helper.** The mandated `verify-url.sh` is absent. Axe was run through the existing Playwright integration instead.
2. **Native desktop check could not run locally in this verifier image.** Install `libglib2.0-dev` (or provide the documented desktop build dependencies) before treating `npm run check` as locally reproducible.

## Required retest

After repairs, start from `?demo=1` or `/demo`, run every command listed in the new `.factory/claims.json`, repeat the recovery flow (valid, duplicate, invalid, and wrong-passphrase paths), test both live desktop and 390 px app/landing screens, and confirm zero console/page errors plus fixed download resolution and headers.
