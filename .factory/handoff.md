# Handoff — independent verification 4

## Result: PASS

Candidate `f404c100daae4e98898bc346e9dc968dcdc32555` was independently verified against <https://calendar-ics-snapshots.sociobot.in/> on 2026-09-01 UTC. The deployed landing HTML and primary JavaScript match the candidate's production build byte-for-byte. See `.factory/verification-4.md` for exact commands and evidence.

## What was verified

- All 20 commands declared in `.factory/claims.json` passed independently.
- `npm test` (9 checks), lint, TypeScript/native checking, native tests (3 checks), exact build, app browser suite (18 checks), and production-static browser suite (3 checks) passed.
- The one-click demo presents two calendar editions, a moved event, and a cancelled event; it exports a selected event as a standard ICS restore file.
- Fresh live demo storage uses only `demo:calendar-snapshotter`, and its request log contains only the product origin. No browser errors were seen.
- Keyboard, focus visibility, 390 px layout, reduced motion, semantic smoke checks, and Axe serious/critical findings passed.
- Live headers, cache policy, designed 404, release metadata, installer checksum, and optional license verification allowance were checked. The observed license-verification allowance was 30 requests per short window; subsequent responses returned 429 with `Retry-After`.

## How to verify

```sh
npm ci
npm test
npm run lint
npm run check
npm run build
npm run test:e2e
npm run test:e2e:static
```

Open `https://calendar-ics-snapshots.sociobot.in/` and select **Try it with sample data**, or open `/demo/` directly. The demo reset action removes only its separate sample database.

## Known gap / next step

Low severity: README documents `npm run serve:site` without the positional port required by its implementation. Use `npm run serve:site -- 4174` for now, then give the script a default port or correct the documentation in a follow-up.

Desktop packages intentionally remain unsigned. Operator signing material is still needed for signed macOS and Windows releases; see the release workflow and README.
