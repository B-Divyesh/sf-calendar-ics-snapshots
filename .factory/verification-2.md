# Independent verification 2 — FAIL

**Candidate:** `16ddc76e7bd341fd855f825bba0293fdd08a7a5b`  
**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>  
**Verified:** 2026-09-01 UTC from a clean checkout

## Decision

**FAIL — do not release this desktop-app candidate.** The live static site is the candidate build, but its sample-project action cannot launch or display the promised sample product. In addition, every published native installer is built from the older `v0.1.0` tag (`2f1c47202c7d8ab23d9dc78fc459531617fa108e`), not from the candidate. These are release-blocking gaps for the required one-click demo and desktop artifact delivery.

## First read

Cold load plainly says that Calendar Snapshotter keeps local calendar copies ready to compare and restore, for people whose plans change, and directs the visitor to **Try it with sample data**. The primary action opens `/demo/`, which correctly explains the Northstar sample and its separate `demo:calendar-snapshotter` vault.

However, the demo page’s **Open the sample project** link is `/?demo=1`. On the live static host that URL returns the landing page (`Calendar Snapshotter — recover calendar changes`, h1 `Keep a recoverable calendar history.`), not the desktop sample vault. The first screen after the primary action is therefore an explanation rather than the product in use, and a visitor cannot try the sample from the deployment in one click.

## Mandatory claims gate

`.factory/claims.json` exists and all exact declared commands passed after `npm ci`.

| Claim id | Exact command | Result |
| --- | --- | --- |
| `sample-project` | `npm run test:e2e -- --grep @claim:sample-project` | PASS — sample banner and two editions |
| `calendar-diff` | `npm run test:e2e -- --grep @claim:calendar-diff` | PASS — moved and cancelled events |
| `ics-restore-export` | `npm run test:e2e -- --grep @claim:ics-restore-export` | PASS — downloaded ICS includes Airport train |
| `demo-private` | `npm run test:e2e -- --grep @claim:demo-private` | PASS — shared demo/privacy assertion |
| `no-event-telemetry` | `npm run test:e2e -- --grep @claim:no-event-telemetry` | PASS — shared demo/privacy assertion |
| `encrypted-local-vault` | `npm run test:e2e -- --grep @claim:encrypted-local-vault` | PASS — imported known title absent from IndexedDB envelope |
| `license-price` | `npm run test:e2e -- --grep @claim:license-price` | PASS — US$29 one-time price and free restore path |

The local browser entry point does correctly implement `/?demo=1`: it displayed the persistent demo banner, two sample snapshots, and two changes. The desktop first-run screen also offers **Load sample project**. The failure is the deployed landing-to-desktop handoff, not the local sample fixture.

## Repository checks

| Check | Result | Evidence |
| --- | --- | --- |
| Clean install | PASS | `npm ci`: 65 packages installed; npm reported 0 vulnerabilities. |
| Unit/integration | PASS | `npm test`: 5 tests in 2 files passed. |
| Browser suite | PASS | `npm run test:e2e`: 14 Chromium tests passed. |
| Production web build | PASS | `npm run build` created `dist/app` and `dist/site`. App JS is 26.63 kB raw / 9.21 kB gzip; site JS is 3.94 kB raw / 1.80 kB gzip; site CSS is 8.11 kB raw / 2.49 kB gzip. |
| Type/native check | ENVIRONMENT-BLOCKED | TypeScript completed, then `cargo check` stopped because this clean verifier image lacks `glib-2.0.pc` (`glib-2.0 >= 2.70`). The release workflow installs the documented Linux desktop dependencies. |
| Semantic helper | PASS | `./scripts/verify-url.sh` passed for local `/` and `/demo/`. |

The representative recovery journey passed in the browser suite: create encrypted archive, import calendar copies, identify moved and deleted events, choose the deleted event, and export an ICS restore file. Independent UI checks also confirmed the recovery errors `The two passphrases do not match.` and `This file is not an iCalendar calendar.` The source demo worked after the first-run **Load sample project** action. With reduced motion, the measured button transition was `0.00001s`.

## Live deployment, privacy, accessibility, and delivery

* Deployment identity: live `index.html` SHA-256 was `bb4ff1bf12fb9c4e5ce13319e3d2fa1da3e5247c1b5c09425bc8d7d66b22edb7`, identical to `dist/site/index.html`; live `assets/main-azXpSVMc.js` SHA-256 was `252f188828c1380862092718ea6d9984c23702c58306fb67473950c8dd933111`, identical to the candidate output.
* Cold desktop load had status 200, no console errors, no page errors, and only same-origin assets plus the documented GitHub release-metadata request. The landing flow sent no calendar content, analytics, advertising, or remote-font request. The local demo claim test recorded same-origin requests only and an independent demo IndexedDB namespace.
* Axe on live `/`, `/demo/`, `/privacy/`, and `/terms/` at 390 px found zero serious or critical findings. No tested live mobile route overflowed horizontally. The repository keyboard test passed the skip link, main focus, and demo-link activation journey.
* Live root has CSP (including `frame-ancestors 'none'`), HSTS, `nosniff`, strict-origin referrer policy, and a permissions policy. Hashed JS has `Cache-Control: public, max-age=31536000, immutable`; the HTML is revalidated at 30 seconds.
* The `v0.1.0` GitHub release has macOS arm64/x64 DMGs, Windows MSI/EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`. Downloaded `Calendar.Snapshotter_0.1.0_amd64.deb` was 2,429,512 bytes and its SHA-256 `4344ca6994a4bbdafc52d0a252ec693f1aa7dd1bc435aeae9a8b8d136994d176` matches `SHA256SUMS`.

No candidate-owned server endpoint is present. The external billing verification endpoint was not contacted: no license was supplied, and it is outside the permitted resource scope for this verification. Consequently no product-owned allowance or 429 behavior applies here.

## Defects

### Release blockers

1. **The live sample action does not run the sample product.** `/demo/` links to `/?demo=1`, but the static deployment treats that as the landing page. The primary action therefore does not produce a usable one-click sample project or the required product-in-use first screen. Deliver a browser-usable sandbox or an install/launch handoff that reliably opens the desktop app directly in sample mode, then verify it on the live URL.
2. **Published desktop artifacts do not contain the candidate.** `v0.1.0` resolves to `2f1c472`, while candidate `16ddc76` is not an ancestor of that tag. Create and publish a release tag from the repaired candidate, then verify its macOS, Windows, and Linux checksummed artifacts and the landing download target.

### Environment note

* The verifier container does not provide the Tauri Linux development packages, so a local Rust check could not complete. This is not treated as a source failure because the repository’s release workflow installs those prerequisites; it remains a local reproducibility limitation.

## Required retest

Publish a native release built from the repaired commit and make the live primary demo path enter its isolated sample data directly. Then repeat all commands in `.factory/claims.json`, the full e2e suite, native check in a Tauri-capable Linux environment, live first-read/demo activation, artifact checksum verification, and desktop/mobile accessibility checks.
