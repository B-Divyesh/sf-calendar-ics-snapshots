# Handoff — Calendar Snapshotter polish round 1

## Result

PASS. All 16 findings in `.factory/review-1.md` are resolved and mapped in `.factory/polish-1.md`. The repaired static site is deployed at <https://calendar-ics-snapshots.sociobot.in/>. Product code deployed from repair commit `4394f5743778e1a4ca2bd28844172598e688a427`.

## What changed

- Put the audience, one-click sample action, outcome, and three facts in the first 390 × 844 viewport.
- Made `/?demo=1` and `/demo/` enter the isolated `demo:calendar-snapshotter` vault directly.
- Made **Reset demo** close database handles, delete only demo storage, and reseed the two original calendar copies.
- Removed the dead checkout and clearly paused new scheduling-license sales. Existing licenses can still be entered and verified.
- Added encrypted full-archive export/import with passphrase verification and connection-setting coverage.
- Standardized visitor language on **calendar copy**, replaced ambiguous labels, and identified external destinations.
- Added consistent route chrome, route titles, one task h1, focus/live announcements, legal links, and a real styled 404.
- Registered 30 public claims in `.factory/claims.json`, each with exactly one tagged observable test.
- Bundled the current v0.1.4 release metadata for a clean cold load. An explicit refresh can query GitHub without making first load depend on its rate limit.

## Clean-clone verification

Source clone: commit `4394f5743778e1a4ca2bd28844172598e688a427` in a new `/tmp/calendar-polish-clean.*` directory with `npm ci`.

- Every one of the 30 exact commands in `.factory/claims.json`: PASS. The native claim passed 3 Rust transport checks. A disposable duplicate Cargo target first exhausted the 20 GB worker disk; after deleting only old temporary build caches, the exact native command passed.
- `npm test`: PASS — 10 tests.
- `npm run lint`: PASS.
- `npm run check`: PASS — TypeScript and Rust.
- `npm run build`: PASS — `dist/app` and `dist/site` produced.
- `npm run test:e2e`: PASS — 24 tests.
- `npm run test:e2e:static`: PASS — 6 tests.
- Playwright Axe on live `/`, `/demo/`, `/privacy/`, and `/terms/`: 0 serious or critical findings on every route.
- `scripts/verify-url.sh` on live `/` and `/demo/`: PASS.

Build budgets: app JS 10.41 kB gzip; site JS 1.69 kB gzip; demo JS 10.12 kB gzip; site CSS 2.84 kB gzip; demo CSS 3.46 kB gzip.

Lighthouse mobile against the deployed root: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,456 ms, CLS 0, TBT 24 ms.

## Live verification after deployment

- Local and live root HTML SHA-256 both equal `8f7953716d8a77706a843e53a20300efb0ed890dbc8af464c2d7641db721412e`.
- `/`, `/demo/`, `/privacy/`, and `/terms/` return 200 with route-specific titles, one h1, shared Home / Demo / Privacy / Terms navigation, and footer legal links.
- `/definitely-missing-page` returns HTTP 404 with “This page is not in the archive.”
- Cold 390 × 844 root: sample action bottom 353 px; last fact bottom 463 px; no horizontal overflow, console errors, or external requests.
- Live demo reset: imported copy count 3 → reset count 2; real-vault sentinel remained `real-data`.
- Live archive import: wrong passphrase left all 3 current copies unchanged; the correct passphrase restored the exported 2-copy archive.
- Forward and Back navigation both focused the destination h1.
- Published Linux AppImage size: 77,765,112 bytes. Its downloaded SHA-256 and `SHA256SUMS` value both equal `90ee251be4804be0d73fcb57bf2ee47802934c36b393d756713d3e042fbf79f7`.
- Evidence images: `.factory/evidence-polish-1-live-mobile-home.png`, `.factory/evidence-polish-1-live-demo-reset.png`, and `.factory/evidence-polish-1-live-404.png`.

## Run locally

```sh
npm ci
npm test
npm run lint
npm run check
npm run build
npm run test:e2e
npm run test:e2e:static
```

Use `npm run dev` for the browser version of the desktop UI, `npm run tauri dev` for the native shell, and `npm run dev:site` for the landing site.

## Known gaps

None in the reviewed scope.

## Needs operator action

The v0.1.4 preview installers are intentionally unsigned. Production signing requires owner-provided `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` GitHub Actions secrets; no certificates were available or added during this work order.
