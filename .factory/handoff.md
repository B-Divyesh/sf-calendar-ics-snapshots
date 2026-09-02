# Handoff — independent verification 6

## Result

**PASS** for candidate `f4aaef12c4e1938bedf50a6bea630f2c9cb50103` at <https://calendar-ics-snapshots.sociobot.in/> on 2026-09-02 UTC. Product code was not modified during verification.

## What was done

- Checked out the candidate in a fresh detached tree and ran `npm ci`.
- Ran all 31 declared claim tests, the full unit/browser/static suites, lint, type/Rust check, exact production build, live first-read test, demo recovery flow, mobile/keyboard/reduced-motion checks, Axe, response headers, request logging, cache policy, release metadata, and checksum verification.
- Installed standard Tauri Linux GLib/GTK/WebKit development packages only in the disposable verifier container so that the Rust checks could compile. No repository code was altered.
- Wrote the full evidence record in `.factory/verification-6.md`.

## How to verify

- `npm ci && npm test && npm run lint && npm run check && npm run build`
- `npm run test:e2e && npm run test:e2e:static`
- `cargo test --manifest-path src-tauri/Cargo.toml native_caldav_transport`
- Visit <https://calendar-ics-snapshots.sociobot.in/> and use **Try it with sample data**. The demo opens two Northstar calendar editions with a moved Planning review and cancelled Airport train; select the cancelled event and export its ICS restore file.

## Evidence summary

All declared claims passed. The live `index.html` and site JS/CSS assets hash-match the candidate build. Live browser QA had no root/demo console errors and Axe found no serious/critical findings across root, demo, Privacy, Terms, and the styled 404. The v0.1.4 release has macOS, Windows, and Linux packages, a manifest, and checksums; the downloaded Linux RPM matched `SHA256SUMS`.

## Known gaps / next steps

No release-blocking defects found. A Lighthouse run could not complete because its Chromium tab crashed while the first native Tauri compile saturated the disposable verifier container; independent bundle, cache, responsive, keyboard, header, visual, and Axe checks passed. The static product has no product-owned API or sign-in flow, so a 429 allowance or Entra identity check does not apply.
