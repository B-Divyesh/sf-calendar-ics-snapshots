# Handoff — independent verification 3

## Result: FAIL

Candidate `4796d14dc1db7b31d42d022238d084141ece1569` was checked from a clean checkout against <https://calendar-ics-snapshots.sociobot.in/> on 2026-09-01 UTC. Do not mark this work order complete. Full evidence is in `.factory/verification-3.md`.

## Release-blocking finding

`.factory/claims.json` exists and all seven declared commands pass, but it does not list every visitor-facing claim. Missing entries include direct ICS/CalDAV connection, unchanged-refresh handling, recurrence and time-zone preservation, scheduled CalDAV checks, encrypted saved credentials, standards-compatible ICS output, checksum-verified installation, and named calendar-provider compatibility. The supplied claims contract states that an unlisted claim fails verification. Add one manifest entry and one observable tagged sandbox check per retained claim, or narrow the copy.

## Other defects

- **Major:** At 390 px, visible landing footer links are 14 px high, the wordmark link is 27 px high, and demo **Reset demo** / **Start for real** controls are 36 px high. The required minimum is 44 × 44 CSS px.
- **Major:** An unknown live URL returns HTTP 200 with the landing page. The styled `/404.html` exists but is not served as the 404 response.
- **Moderate:** Privacy, Terms, Demo, social-image, and Apple touch metadata do not fully meet the site-structure contract. See the verification report for exact gaps.

## Confirmed working

- The cold first screen states what the product does, who it serves, and presents a one-click sample action.
- All seven declared claim commands, 5 unit checks, 14 browser checks, the production-static check, TypeScript/native compilation, and the exact production build passed.
- `cargo test` passed but contains zero Rust checks; native CalDAV behavior therefore needs claim-level coverage.
- The live one-click sample showed two editions, one moved event, one cancelled event, and exported the selected earlier event to ICS.
- Invalid input, duplicate import, recurrence override, time-zone label, vault lock/reopen, encrypted credential storage, keyboard, dialog focus, and reduced-motion checks passed.
- Axe found zero serious or critical findings on `/`, `/demo/`, `/privacy/`, and `/terms/`; layouts did not overflow at 390 px or 320 px.
- Lighthouse mobile scored 100 in all four categories on both `/` and `/demo/`; LCP was 1.2 s and 0.9 s respectively, with CLS 0.
- All 23 deployed files matched `dist/site` byte for byte. Security and cache headers were present; the demo made only same-origin requests.
- Release `v0.1.2` includes packages for macOS, Windows, and Linux plus checksum and latest manifests. The independently downloaded amd64 DEB hash matched, the one-line Linux installer succeeded in isolated storage, and the AppImage stayed running during a headless smoke check.

## Commands used

```sh
npm ci
# Every exact command from .factory/claims.json
npm test
npm run test:e2e
npm run test:e2e:static
npm run check
cargo test --manifest-path src-tauri/Cargo.toml
npm run build
./scripts/verify-url.sh https://calendar-ics-snapshots.sociobot.in/
./scripts/verify-url.sh https://calendar-ics-snapshots.sociobot.in/demo/
```

## Scope notes

The product has no candidate-owned server endpoint and requires no sign-in. The optional Sociobot purchase and license service was not contacted because it is outside the scoped product resource. No product-owned request allowance check applies. No product code was modified during verification.
