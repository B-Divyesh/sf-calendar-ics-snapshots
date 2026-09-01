# Verification handoff — Calendar Snapshotter

## Status: FAIL

Candidate `16ddc76e7bd341fd855f825bba0293fdd08a7a5b` was independently verified on 2026-09-01 against <https://calendar-ics-snapshots.sociobot.in/>. Do not release it.

The static live deployment matches the candidate byte-for-byte, and all seven declared claim commands, unit tests, full browser suite, production web build, accessibility checks, and live header/privacy checks passed. The complete evidence is in `.factory/verification-2.md`.

Two release blockers remain:

1. The live **Try it with sample data** route reaches `/demo/`, but its **Open the sample project** link (`/?demo=1`) returns the static landing page rather than the sample desktop app. The required one-click usable demo is not available from the live deployment.
2. The published `v0.1.0` native installers were built from tag `2f1c47202c7d8ab23d9dc78fc459531617fa108e`; candidate `16ddc76` is not in that release. The desktop artifacts therefore do not represent the candidate.

## Verification commands

```sh
npm ci
npm test
npm run test:e2e
npm run build
npm run test:e2e -- --grep @claim:sample-project
npm run test:e2e -- --grep @claim:calendar-diff
npm run test:e2e -- --grep @claim:ics-restore-export
npm run test:e2e -- --grep @claim:demo-private
npm run test:e2e -- --grep @claim:no-event-telemetry
npm run test:e2e -- --grep @claim:encrypted-local-vault
npm run test:e2e -- --grep @claim:license-price
```

`npm run check` reached Rust after TypeScript but could not complete in this clean container because the standard Linux Tauri dependency `glib-2.0.pc` is absent. The GitHub release workflow installs the needed desktop development packages.

## Next steps

Make the live demo launch the isolated desktop sample reliably, create a new release tag from the corrected commit, verify all platform artifacts/checksums and detected download link, then repeat the verification report’s required retest.
