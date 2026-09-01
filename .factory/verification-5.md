# Independent verification 5 — PASS

**Candidate:** `4394f5743778e1a4ca2bd28844172598e688a427`  
**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>  
**Verified:** 2026-09-01 UTC from a fresh detached clone

## Decision

**PASS.** The deployed site byte-matches the tested candidate assets, all declared claims pass, and the complete sample recovery flow works without setup.

## First-read test

**PASS.** On a cold visit the first screen says “Keep a recoverable calendar history.” It says this is for people whose calendars change, and the first action is **Try it with sample data**, with the outcome “Opens a safe sample project.” One click opens `/demo/` with two realistic calendar copies and the persistent message “Demo — sample data, nothing is saved to your archive.”

## Mandatory claims gate

`.factory/claims.json` exists and contains 30 claims. After `npm ci` in `/tmp/calendar-ics-snapshots-verify-5`, every declared test passed. Browser claim tests were run against the shipped demo entry point; static claim tests against the built static site; native transport was run after installing standard GLib/GTK/Linux WebKit development headers required by Tauri.

| Claims and exact command family | Result and observed outcome |
| --- | --- |
| `calendar-recovery`, `sample-project`, `calendar-diff`, `ics-restore-export`, `demo-private`, `no-event-telemetry`, `encrypted-local-vault`, `encrypted-caldav-credentials`, `passphrase-no-recovery`, `unchanged-refresh`, `calendar-connection`, `scheduled-caldav`, `license-price`, `demo-reset`, `archive-roundtrip`, `archive-wrong-passphrase`, `license-token-only`, `free-accessibility-export`, `offline-local`, `no-account-import`, `invalid-license-locks-scheduling`, `release-downloads` — `npm run test:e2e -- --grep @claim:` | PASS — 18 tagged Playwright tests. They cover sample separation, moved/cancelled diff, selected-event ICS restore, encrypted envelopes, wrong-passphrase recovery, direct calendar fixture, schedule fixture, offline export, keyboard export, and license request contents. |
| `license-sales-paused` — `npm run test:e2e:static -- --grep @claim:` | PASS — sales pause is explicit and no checkout is exposed. |
| `recurrence-timezones`, `mit-license`, `checksum-install`, `unsigned-preview`, `release-packaging`, `site-response-policy` — `npm test -- -t @claim` | PASS — 6 tagged Vitest checks. |
| `native-caldav-transport` — `cargo test --manifest-path src-tauri/Cargo.toml native_caldav_transport` | PASS — 3 tests: direct ICS uses GET, CalDAV collection uses REPORT, other URL schemes are rejected. |

No unlisted visitor-facing claims were found on the landing, demo, Privacy, Terms, or README routes.

## Local quality checks

| Check | Result |
| --- | --- |
| `npm test` | PASS — 10 tests |
| `npm run lint` | PASS |
| `npm run check` | PASS — TypeScript and Rust |
| `npm run build` | PASS — produced `dist/app` and `dist/site` |
| `npm run test:e2e` | PASS — 24 tests |
| `npm run test:e2e:static` | PASS — 6 tests |
| `scripts/verify-url.sh` on live `/` and `/demo/` | PASS — title, language, main landmark, image alternatives |

Built gzip sizes: landing JS 1.69 kB plus 0.71 kB route chunk; landing CSS 2.84 kB; demo JS 10.12 kB; demo CSS 3.46 kB. All are within the static budgets.

## Product, accessibility, and privacy QA

- Normal journey: the demo exposed two editions, a moved event and a cancelled Airport train; selecting the cancelled event exported a standard `.ics` restore file.
- Boundary/recovery coverage passed for duplicate imports, invalid/wrong vault or archive passphrases, an invalid license, unavailable release metadata, offline local export, and reset back to exactly the two shipped copies.
- At 390 × 844, root and demo had no horizontal overflow. Visible links/buttons met the 44 px automated target check.
- Keyboard verification: Tab first focuses the skip link with a designed 3 px `rgb(158, 47, 40)` focus ring; Enter moves focus to `main`; the sample action is keyboard-operable. Reduced-motion media rules reduce transitions/animation to 0.01 ms.
- Axe Playwright on fresh live `/` and `/demo/` found zero serious or critical violations. There were no console or page errors.
- Fresh live demo request log contained only same-origin document, JS, and CSS requests. Its persistent banner identifies the isolated demo; the app claim suite asserts only `demo:calendar-snapshotter` is created. The landing page’s optional release refresh is explicitly limited to `api.github.com`; it sends no calendar content.

## Live deployment and release evidence

- `dist/site` hashes exactly matched live `index-BQGzWtlc.js`, `route-DeiQe-k1.js`, `site-DCJH-YPg.css`, and `demo-7eHeBqok.js`.
- Live `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200; an unknown route returned the styled document with HTTP 404. `robots.txt`, `sitemap.xml`, `install.sh`, and `install.ps1` also returned 200.
- Browser response headers have header-delivered CSP including `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and permissions policy. HTML has `max-age=30`; hashed assets have `max-age=31536000, immutable`.
- Release `v0.1.4` has macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`. A fresh Linux DEB download SHA-256 was `0572693bb321ce082dafdf0f589653d934c218263dfba4f236d9385bbeff5084`, matching the published checksum; package metadata is `calendar-snapshotter 0.1.4 amd64`.
- Lighthouse (mobile) against the live root: Performance 96, Accessibility 100, Best Practices 100, SEO 100; LCP 1.7 s, CLS 0, TBT 200 ms.
- This static product has no server-side product endpoint. Therefore no product-owned request allowance/429 test applies. License verification is an external Sociobot service and was covered with a fixture in the claim test; no sign-in flow exists.

## Defects by severity

None found in the acceptance scope.

## Verification conclusion

**PASS** for candidate `4394f5743778e1a4ca2bd28844172598e688a427` at <https://calendar-ics-snapshots.sociobot.in/>.
