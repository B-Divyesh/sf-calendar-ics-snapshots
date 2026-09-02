# Calendar Snapshotter — independent verification 10 handoff

## Result

**FAIL — do not release candidate `214be2493685fc4914bdbc376e73f1a4c0a7f9b7`.**

The static site at <https://calendar-ics-snapshots.sociobot.in/> byte-matches the candidate and the routine gates are clean, but independent timezone recovery cases fail. Published desktop packages were also built from older commit `ef998fba21cded336bedb7b8fc215897117285fe`, not this candidate.

Full evidence and all 37 claim results are in `.factory/verification-10.md`.

## What was verified

- Ran every command in `.factory/claims.json` first: 37/37 exited 0.
- Ran `npm test` (17/17), `npm run lint`, `npm run check`, `npm run build`, `npm run test:e2e` (28/28), and `npm run test:e2e:static` (8/8).
- Exercised the recovery journey, malformed input, passphrase failures, duplicate input, archive backup/restore, offline demo export, demo isolation/reset/leave, keyboard operation, 200% text, reduced motion, 390 px layout, and all public routes.
- Checked live requests, response/security/cache headers, all live deployable-file hashes, route status, links, console/page failures, and axe serious/critical results.
- Ran live mobile Lighthouse: 100 performance, accessibility, best practices, and SEO; LCP 1.1 s, CLS 0.005, total blocking time 30 ms.
- Observed the license verification allowance: 30 responses at 200, then 429 with `Retry-After` on requests 31–35.
- Verified the published Debian checksum and metadata, ran the real command-line installer in a temporary directory, and smoke-launched the extracted Linux desktop binary under Xvfb.

## Release-blocking defects

1. A change from `DTSTART;TZID=America/New_York:20260910T100000` to `DTSTART;TZID=Europe/London:20260910T100000` is shown as **0 moved** and “matches the last one,” despite representing a five-hour instant change.
2. Restoring a deleted zoned event from a newer empty calendar copy exports an event with `TZID=America/New_York` but no `VTIMEZONE`. The claim test passes because it supplies the older copy to the restore builder, unlike the UI.
3. Release `v0.1.6` and `latest.json` identify source `ef998fba…`; candidate `214be249…` includes later desktop stylesheet/accessibility changes and has no matching native release.

## Additional high-severity defect

The native calendar transport accepts arbitrary `http://` URLs and sends HTTP Basic credentials to them. Require HTTPS, with at most an explicit loopback-only development exception.

## Next steps

Repair timezone-aware comparison and restore generation, add UI-path regressions for both cases, restrict credentialed transport to HTTPS, tag the repaired candidate, publish all native packages and manifests from that exact commit, and repeat verification from a clean checkout.

No product code, deployment, DNS, infrastructure, or product data was changed during this verification.
