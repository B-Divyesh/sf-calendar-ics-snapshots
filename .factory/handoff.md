# Handoff — polish round 2

## Result

**PASS.** Commit `f4aaef12c4e1938bedf50a6bea630f2c9cb50103` closes every finding in `.factory/review-1.md` and `.factory/review-2.md`. It is pushed to `main` and deployed to <https://calendar-ics-snapshots.sociobot.in/>.

## What changed

- Kept the demo shell safe through every normal demo action by removing **Lock vault** from demo mode. The header, persistent sample banner, Reset demo, Leave demo, and legal footer remain available until an explicit exit.
- Replaced the ambiguous demo exit label with **Leave demo**.
- Replaced unexplained checksum wording with plain download-check wording and documented the SHA-256 file-check list in README.
- Reworked the free-feature claim test into a complete unlicensed import → review → restore export → encrypted archive export/import journey.
- Prevented Android and iPhone visitors from receiving a Linux desktop binary. They see **View desktop downloads on GitHub** and a supported-platform explanation.
- Removed the unsupported “Install with one command” promise, narrowed the encryption sentence to the registered privacy claim, and added a confirmed **Delete local archive** action with a claim test.
- Updated the catalog description, copy audit, demo documentation, claims contract, and finding-by-finding mapping in `.factory/polish-2.md`.

## Verification

Fresh clone: `/tmp/calendar-polish2-clean.hYwYo5/repo` at `f4aaef1`.

- `npm ci` — pass, 0 reported dependency vulnerabilities.
- Every one of the 31 exact commands declared in `.factory/claims.json` — pass from that fresh clone. This includes all 24 browser claim commands, 6 Vitest claim commands, and the native CalDAV command.
- `npm test` — pass, 10 tests.
- `npm run lint` — pass.
- `npm run check` — pass after installing the documented Linux Tauri prerequisites (`libwebkit2gtk-4.1-dev`, GTK and related development libraries).
- `npm run build` — pass; produced `dist/app` and `dist/site`. Static bundles remain within budget (site JS 1.80 kB gzip plus 0.71 kB route chunk; demo JS 10.22 kB gzip; CSS 3.46 kB gzip).
- `npm run test:e2e` — pass, 26 tests.
- `npm run test:e2e:static` — pass, 6 tests.
- `cargo test --manifest-path src-tauri/Cargo.toml native_caldav_transport` — pass, 3 tests.
- `scripts/verify-url.sh https://calendar-ics-snapshots.sociobot.in/` and `/demo/` — pass for title, language, main landmark, and image alternatives.
- Live Playwright + Axe check — zero serious/critical findings on the mobile landing and demo; no console errors. The demo made only same-origin requests. Evidence screenshots: `.factory/evidence-polish-2-live-mobile-home.png` and `.factory/evidence-polish-2-live-demo.png`.
- Live response checks: `/` returned 200, and `/definitely-missing-page` returned the designed 404 with HTTP 404.

## Deployment

Built `dist/site` was deployed to the scoped production Static Web App `sf-calendar-ics-snapshots` in resource group `sociobot` with the Static Web Apps deployment CLI. The deployment reported: `https://lively-forest-0b1012c10.7.azurestaticapps.net`.

## Known gaps / operator action

None for this repair. Native installers remain intentionally unsigned as documented; the existing GitHub release workflow builds them on the supported platform runners.
