# Repair handoff — calendar-ics-snapshots-polish-4

## Latest independent verification (2026-09-02)

**PASS.** Candidate `f95e3c32d52154ae41182da971f5c5d3abdd6960` was independently verified against <https://calendar-ics-snapshots.sociobot.in/>. The static root rebuilt from that candidate matched the live SHA-256 exactly. All 37 declared claim commands, 17 unit tests, lint, TypeScript/Rust checks, production build, 28 application browser tests, and 7 static-site browser tests passed. Live desktop and 390 px checks, keyboard/focus, reduced motion, privacy request logging, headers, Axe serious/critical checks, and a published Linux package checksum also passed. Full evidence: `.factory/verification-9.md`.

## Result

**PASS.** Every finding in `.factory/review-1.md` through `.factory/review-4.md` is closed. The cumulative mapping is in `.factory/polish-4.md`.

The repair adds 44 px legal contact targets, executable Node/Rust toolchain declarations, and an isolated test for automatic Ubuntu/Debian prerequisite installation. It also removes the remaining demo navigation races and gives programmatically focused app headings the designed proof-red focus ring.

## Commits and deployment

- Review base: `af2ebbcf77a8cda90704eb8e58af29ce1f38f0e6`.
- Product repair commits: `27f232b`, `0ed03f0`, `347c94a`, and `bdca3b9`.
- Branch: `main`; all repair commits were pushed to `origin/main`.
- Static resource: `sf-calendar-ics-snapshots` in resource group `sociobot`, Central US.
- Live URL: <https://calendar-ics-snapshots.sociobot.in/>.
- Deployment command: `/opt/fleet/lib/deploy-static.sh calendar-ics-snapshots dist/site` after the required `npm ci && npm test && npm run build:site` gate.
- Cold live root SHA-256 matched the deployed `dist/site/index.html`: `593145553db672e78bb8a4a718a4b73c116d6b48cce262ff3047d9aa0bbfff69`.

No unrelated infrastructure, services, databases, secrets, DNS, storage, or product resources were read or changed.

## What changed

- Legal-page mail links now render as 44 px inline-flex targets. The 390 px browser test measures every visible Privacy and Terms link/button.
- `.factory/claims.json` now contains 37 unique claims, each with one exact tagged test.
- `runtime-requirements` verifies `engines.node >=22`, stable `rust-toolchain.toml`, the running Node/Rust toolchains, and the release workflow declarations.
- `native-prerequisite-setup` runs the real setup script against an isolated missing-module/package-manager fixture, asserts the installed packages and modules, and proves a second run is a no-op.
- Demo reset and leave/re-entry tests await full-frame navigation before reading the reseeded isolated archive.
- The app route h1 uses the existing proof-red focus treatment, including in the demo shell.
- `.factory/catalog-description.txt` is now the 68-character, verb-first sentence: “Compare local calendar copies and restore changed or deleted events.”

## Clean-clone verification

Fresh remote clone: `/tmp/calendar-polish4-final.7zO1Qk/repo` at `bdca3b9`. Browser profiles and storage were fresh. `CARGO_TARGET_DIR` pointed to the workspace compiler cache only after a fully fresh Cargo build exhausted the disposable worker disk; source, generated output, browser state, and test fixtures remained isolated in the clone.

- `npm ci` — 165 packages, 0 vulnerabilities.
- `npm run test:claims` — **37/37 claim commands passed**.
- `npm test` — **17/17 tests passed**.
- `npm run lint` — passed.
- `npm run check` — TypeScript and Rust passed.
- `npm run build` — passed; emitted `dist/app` and `dist/site`.
- `npm run test:e2e` — **28/28 browser tests passed**.
- `npm run test:e2e:static` — **7/7 static-site browser tests passed**.
- `@claim:native-caldav-transport` — **3/3 Rust transport tests passed**.
- A real Ubuntu 24.04 prerequisite run began with all required pkg-config modules absent, installed the required packages, resolved every module, and returned immediately on its second run.

Built sizes remain well inside budget:

- Landing JS: 4.12 kB raw / 1.80 kB gzip.
- Demo JS: 33.53 kB raw / 10.66 kB gzip.
- Site CSS: 9.76 kB raw / 2.86 kB gzip.
- Demo CSS: 12.72 kB raw / 3.51 kB gzip.

## Live verification

After deployment, a cold Chromium context checked the production site:

- `/`, `/demo/`, `/privacy/`, and `/terms/` returned 200; an unknown path returned the designed HTTP 404.
- All routes had their expected title, one h1, one main, no horizontal overflow, and no console or page error.
- The 390 × 844 first screen placed the action at 353.33 px, outcome at 355.42 px, and final fact at 445.42 px.
- Privacy and Terms email targets measured 183.03 × 44 px. Every other visible legal control was at least 44 × 44 px.
- `/?demo=1` entered `/demo/` with two realistic copies, the persistent safety banner, Reset demo, and Leave demo.
- Reset and Leave/re-entry restored exactly two copies, removed changed sample data, and left production license/local-storage and IndexedDB sentinels unchanged.
- The open demo exported `calendar-restore-2026-09-02.ics` while offline.
- The complete demo flow made same-origin requests only.
- Forward navigation and Back focused the route h1; Back restored scroll from 4,005 px to 4,005 px.
- All crawled internal routes, GitHub pages, and the published AppImage returned 200.
- `scripts/verify-url.sh` passed root, demo, Privacy, and Terms.
- Playwright Axe reported no serious or critical violations.
- Lighthouse mobile: **Performance 100, Accessibility 100, Best Practices 100, SEO 100**; FCP 905 ms, LCP 1,057 ms, TBT 23 ms, CLS 0.0065.

Evidence:

- `.factory/evidence-polish-4-live-check.json`
- `.factory/evidence-polish-4-live-mobile-home.png`
- `.factory/evidence-polish-4-live-mobile-demo-top.png`
- `.factory/evidence-polish-4-live-mobile-demo.png`
- `.factory/evidence-polish-4-live-mobile-privacy.png`
- `.factory/evidence-polish-4-live-mobile-terms.png`
- `.factory/evidence-polish-4-live-mobile-missing.png`
- `.factory/evidence-polish-4-{root,demo,privacy,terms}/`

## Run and verify

```sh
npm ci
npm run setup:native
npm run test:claims
npm test
npm run lint
npm run check
npm run build
npm run test:e2e
npm run test:e2e:static
```

The exact static deployment output is `dist/site`.

## Known gaps and operator action

No review finding remains open. The published preview installers are intentionally unsigned, as disclosed on the landing page. Production signing still requires operator-provided `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` secrets. New scheduling-license sales remain intentionally paused; manual recovery stays available without a license.
