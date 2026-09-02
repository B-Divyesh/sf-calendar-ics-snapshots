# Handoff — adversarial first-read review 3

## Result

**FAIL** for candidate `25951dab9167d422e79ffd860987662329c4a7af` at <https://calendar-ics-snapshots.sociobot.in/> on 2026-09-02 UTC. Product code was not modified. The full report is `.factory/review-3.md`.

## What was done

- Reviewed the live first screen cold at 390 × 844 and 1440 × 900.
- Audited every landing and README sentence, all public routes, metadata, links, focus behavior, the 404, responsive layout, reduced motion, and the distinct visual identity.
- Exercised the populated demo, restore download, Reset, offline use, storage namespaces, request log, Leave/re-enter behavior, and production-license sentinels.
- Read every earlier review, polish report, and handoff; rechecked each earlier finding in live behavior and source.
- Cloned commit `25951da` to `/tmp/calendar-review3-clean.jNiQJY/repo`, ran all 31 claim commands separately, then ran the full unit, lint, TypeScript/Rust, build, browser, and static suites.
- Installed standard Tauri Linux GLib/GTK/WebKit development packages only in the disposable verifier container so the native Rust claim and check could compile.

## How to verify

- Read `.factory/review-3.md` for findings F-3-1 through F-3-7 and the complete evidence tables.
- Reproduce the primary blocker by opening `/demo/`, entering a license token, selecting Reset demo, and inspecting `localStorage` keys beginning `sb_license:`.
- Reproduce retained demo data by importing a third copy, selecting Leave demo, and re-entering through **Try it with sample data**.
- Run `npm ci && npm test && npm run lint && npm run check && npm run build && npm run test:e2e && npm run test:e2e:static` after installing the Tauri Linux prerequisites.

## Verification summary

All declared commands pass after the documented native build prerequisites are present. The full quality suites pass and `npm run build` produces `dist/app` and `dist/site`. Live initial demo requests are same-origin, Reset restores the two-copy seed without changing a real IndexedDB sentinel, route metadata and links pass, and live Axe scans have no serious/critical findings.

## Known gaps / next steps

The demo shares production license storage and retains modified demo data after exit. Three claim tests do not cover their full wording. The first-screen facts omit offline behavior, the mobile app wordmark is only 25 px high, several README claim details are unlisted, and two landing labels need plain rewrites. These are documented with concrete fixes in `.factory/review-3.md`.
