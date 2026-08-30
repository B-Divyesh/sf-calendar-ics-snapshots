# Handoff — Calendar Snapshotter v0.1.0 repair

## Repair completed

This repair addresses every failure in verification `e092ca26414b4716cb48bdffb508195215d25747`:

- Added `.factory/claims.json` with seven observable claim commands and browser coverage for every claim.
- Added a one-click sample project at desktop `/?demo=1`, the site `/demo/`, a persistent demo banner, reset/start-for-real controls, and `.factory/demo.md`. Demo state uses only `demo:calendar-snapshotter`; real vault state uses `calendar-snapshotter`.
- Rewrote the landing first screen in plain language: it states the calendar recovery job, who it is for, the sample action, and three concise facts. `.factory/copy-audit.md` records the review.
- Repaired release resolution to use only the CORS-enabled `api.github.com` release response. It caches metadata for one hour and selects the platform asset directly; it never browser-fetches `latest.json` or a GitHub download redirect. Missing assets render “Downloads are being published” without throwing.
- Fixed the 390 px app regression: the file input remains 1×1 px when hidden, and the CalDAV action is in normal mobile flow instead of overlapping the archive heading.
- Added the static host structure: CSP and security headers, immutable hashed asset caching, navigation fallback, designed 404, robots, sitemap, canonical/OG metadata, and a `verify-url.sh` smoke helper.
- Added three hand-authored SVG walkthrough frames to the existing original editorial visual system. They show the shipped sample archive, change selection, and ICS export.

## How to run and verify

```sh
npm ci
npm test
npm run check
npm run build
npm run test:e2e
npm run test:e2e -- --grep @claim
npm run dev:site -- --host 127.0.0.1 --port 4174
./scripts/verify-url.sh http://127.0.0.1:4174/
./scripts/verify-url.sh http://127.0.0.1:4174/demo/
```

Static deployment output remains `dist/site` (`npm run build:site` is the exact deploy build). Native packages remain GitHub Actions-only, preserving the original Tauri desktop-app release class.

## Evidence — 2026-08-30 UTC

| Check | Result |
| --- | --- |
| `npm test` | PASS — 5 tests |
| `npm run check` | PASS — TypeScript and Rust/Tauri check (after installing standard Linux Tauri development packages) |
| `npm run build` | PASS — `dist/app` and `dist/site` |
| `npm run test:e2e` | PASS — 14 Chromium tests |
| Each exact command in `.factory/claims.json` | PASS — one test per command; 7 declared claims / 6 tagged tests because the private-demo network test proves both isolated storage and no telemetry |
| Accessibility | PASS — axe has 0 serious/critical findings on landing and populated app; keyboard skip-link journey tested |
| 390 px | PASS — landing and populated sample app have no horizontal overflow; archive controls do not overlap |
| Offline | PASS — after load, sample vault exports a selected event while browser network is offline |
| Release metadata | PASS — mocked CORS-enabled GitHub API selects a Linux AppImage; `latest.json` is never requested; missing asset state is calm with no console error |
| Privacy | PASS — demo request log contains same-origin requests only; known event text is absent from the real IndexedDB envelope |
| URL smoke | PASS — `/` and `/demo/` have title, `lang`, main landmark, and image alt coverage |
| Lighthouse on built static output | 100 performance / 100 accessibility / 100 best practices / 100 SEO; FCP 0.9 s, LCP 1.4 s, CLS 0 |

The Lighthouse CLI emitted a post-audit Chromium target-crash warning while capturing its final screenshot, but wrote the complete report and category results above. The independent Playwright console and axe checks are clean.

## Known boundaries

- Scheduled snapshots run only while the desktop app is open.
- CalDAV collection discovery is not included; users supply a direct collection or ICS URL.
- v0.1 shows recovery for VEVENT calendar events; it does not present VTODO/VJOURNAL diffs.
- Native packages are unsigned until the owner supplies signing credentials.

## Needs operator action

1. Register the US$29 product in Sociobot billing with return URL `https://calendar-ics-snapshots.sociobot.in/?license={token}`.
2. Add `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD` to add signing in the release workflow.
3. After the repair deployment, create a fresh release tag when native package assets need the repaired product version.
