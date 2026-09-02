# Handoff — polish round 3

## Result

**PASS.** Repair commit `cb1b2a2` is deployed to <https://calendar-ics-snapshots.sociobot.in/>. The final documentation commit records the same release candidate, its evidence, and the cumulative finding map in `.factory/polish-3.md`.

## What changed

- Isolated demo licensing completely from production storage. Demo mode now decides its storage namespace before any license code can run, disables scheduling, and never reads, captures, saves, or verifies a license token.
- Made **Leave demo** delete `demo:calendar-snapshotter` before navigation. A new entry always starts with the two shipped Northstar calendar copies.
- Strengthened the demo privacy claim with production-license sentinels, sensitive demo actions, reset, and request logging. Added the deterministic leave/re-entry claim.
- Completed claim coverage for recurring restore files, platform release manifest generation, release triggers, built static output, asset caching, `robots.txt`, and `sitemap.xml`.
- Rewrote the first-screen facts to cover demo isolation, offline availability, and free/paused pricing. Renamed the two unclear landing labels.
- Made the demo wordmark a 44 px mobile target and made its regression test wait for populated application content.
- Narrowed the command-line installer wording to the executed macOS/Linux installer; Windows users use the desktop download button.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run check
npm run build
npm run test:e2e
npm run test:e2e:static
./scripts/verify-url.sh http://127.0.0.1:4176/
```

The native `cargo check` and transport claim need the normal Tauri Linux prerequisites: `libglib2.0-dev`, `libwebkit2gtk-4.1-dev`, `libappindicator3-dev`, and `librsvg2-dev`.

## Exact evidence

- Fresh clone: `/tmp/calendar-ics-snapshots-clean.xqAKJA/repo` from `cb1b2a2`.
- Fresh-clone claims: all **34 of 34** commands from `.factory/claims.json` completed successfully, including `cargo test --manifest-path src-tauri/Cargo.toml native_caldav_transport`.
- Fresh-clone full suite: `npm test` (**12 tests**), `npm run lint`, `npm run check`, `npm run build`, `npm run test:e2e` (**27 tests**), and `npm run test:e2e:static` (**6 tests**) all passed.
- Built output: `dist/app` is 492 KB total; initial app JS is 10.67 KB gzip. Static site JS chunks are 10.39 KB gzip (demo) and 1.80 KB gzip (landing), within the 200 KB initial-JS budget.
- Local production-style smoke: `scripts/verify-url.sh` passed root, demo, Privacy, and Terms. Static browser tests passed the styled HTTP 404 and all sharing metadata.
- Live smoke: root, demo, Privacy, and Terms passed `scripts/verify-url.sh`; `/not-in-archive` returns styled HTTP 404; live CSP, `X-Content-Type-Options`, referrer policy, and permissions policy headers are present.
- Live accessibility: Playwright Axe reported **0 serious/critical** issues on root, demo, Privacy, Terms, and 404. The browser’s document-level 404 network console message is expected for the intentional HTTP 404; normal live routes had zero console errors.
- Live demo recheck: production-license sentinels remained unchanged after demo load and Reset; demo schedule settings contained no license entry; Leave demo removed a third imported sample copy before re-entry. Evidence: `.factory/evidence-polish-3-live-demo-reset.png` and `.factory/evidence-polish-3-live-demo-leave.png`.
- Live visual recheck: `.factory/evidence-polish-3-live-mobile-home.png`, `.factory/evidence-polish-3-live-mobile-demo.png`, `.factory/evidence-polish-3-live-demo-isolation.png`, and `.factory/evidence-polish-3-live-404.png`.
- Lighthouse against the deployed root (mobile defaults): Performance **100**, Accessibility **100**, LCP **1.1 s**, CLS **0.007**. The report is `/tmp/calendar-snapshotter-lighthouse.json`.

## Deployment

Built with `npm run build`, then deployed `dist/site` through:

```sh
swa deploy dist/site --app-name sf-calendar-ics-snapshots --resource-group sociobot --env production --no-use-keychain
```

The temporary `.env` credential file produced by the deployment CLI was removed and was never committed.

## Known gaps / operator action

None for this repair. Release installers remain intentionally unsigned previews; GitHub Actions builds and publishes native assets on tags as documented. No macOS notarization or Windows Authenticode certificate is configured.
