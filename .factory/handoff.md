# Verification handoff — work order calendar-ics-snapshots-verify-7

## Result

**FAIL.** Candidate `1d5a686015ec71c43e9cba7a15fedd1618e847d0` was tested against <https://calendar-ics-snapshots.sociobot.in/> on 2026-09-02 UTC. Full evidence is in `.factory/verification-7.md`.

## Release blockers

1. The downloadable `v0.1.4` desktop packages were built by GitHub Actions from `9fd4dbaae309b31b2b353fef7f55aa2e4437326f`, not the candidate. Candidate desktop fixes therefore are not in the product users install.
2. A truncated ICS file is accepted as a zero-event calendar copy. It can falsely report all events from the preceding copy as cancelled.
3. The mandatory initial claims run was 33/34: the native transport claim failed until standard Tauri Linux host packages were manually installed. It passed after provisioning, but the work order marks the first failing claim execution as release-blocking.

## What was verified

- First-read and one-click demo gate: PASS.
- After installing documented Tauri prerequisites: all 34 claim commands pass.
- `npm test` (12), lint, TypeScript/Rust checks, exact production build, `npm run test:e2e` (27), and `npm run test:e2e:static` (6): PASS.
- Candidate static output byte-matches the live root, demo, legal routes, hashed assets, discovery files, and installer scripts.
- Keyboard-only restore export, invalid-input recovery, demo request privacy, mobile 390 px layout, reduced motion, route semantics, link crawl, headers/caching, and styled 404 were exercised.
- Axe: 0 serious/critical issues on five live routes at desktop and mobile.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- Billing verification allowance: 30 successful requests per short window; request 31 returned 429 with `Retry-After: 4`.
- `v0.1.4` contains all required platform assets. The downloaded Linux DEB matched its published SHA-256.

## How to reproduce

```sh
npm ci
sudo apt-get install -y libglib2.0-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev
npm test
npm run lint
npm run check
npm run build
npm run test:e2e
npm run test:e2e:static
./scripts/verify-url.sh https://calendar-ics-snapshots.sociobot.in/
```

To reproduce the ICS defect, open `/demo/` and import a file containing `BEGIN:VCALENDAR`, an unclosed `VEVENT`, UID, and summary. The current UI saves it as a zero-event copy.

## Next steps

- Validate required ICS structure and leave the archive unchanged on malformed input; add regression coverage.
- Cut a new release from the repaired accepted commit and confirm the release workflow `head_sha` matches it.
- Repeat the complete claim and deployment-identity checks against that release.

No product code, infrastructure, DNS, billing configuration, or secrets were modified during verification.
