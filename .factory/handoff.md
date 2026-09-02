# Calendar Snapshotter — polish round 5 handoff

## Result

**PASS.** The release-candidate repair is committed, pushed, deployed, and cold-checked.

- Repair commit: `c1ed0a3ccd1d77475dff087d65293747f7d05213` (`fix: expose legal links on mobile`)
- Branch: `main`
- Live site: <https://calendar-ics-snapshots.sociobot.in/>
- Deployment: existing product-scoped Azure Static Web App `sf-calendar-ics-snapshots`; deployment ID `e66f4702-aa87-4131-9f00-d7f825d780ab`

## What changed

- The shared mobile header now exposes Home, Demo, Privacy, and Terms on every route. At 390 px it deliberately wraps into a full-width navigation row, preserving 44 px targets and the broadsheet identity. This was applied to both the static site shell and the dynamically rendered demo shell.
- The 404 h1 is now the direct **“Page not found.”** while retaining the useful explanation and home action.
- Added browser regressions for every shared 390 px route, keyboard activation of Privacy from the header, and the direct 404 title/h1/explanation/status.
- Updated the catalog description to the verb-first, 9-word sentence: “Restore changed or deleted calendar events from local copies.”

## How verified

From fresh clone `/tmp/calendar-polish-5.E8e7y6` at the repair commit:

```text
npm ci
npm run test:claims      # 37/37 declared claim commands passed
npm test                 # 17 tests passed
npm run lint             # passed
npm run check            # TypeScript and Rust/Tauri checks passed
npm run build            # dist/app and dist/site produced
npm run test:e2e         # 28 browser tests passed
npm run test:e2e:static  # 8 production-static browser tests passed
```

The full claim run includes offline sample export, demo storage isolation/reset/leave, no-third-party request checks, encryption checks, archive round-trip, direct ICS/CalDAV transport, licensing, installer integrity, and static delivery policy.

After deployment, `scripts/verify-url.sh` and `/opt/fleet/lib/verify-url.sh` passed for `/`, `/demo/`, `/privacy/`, and `/terms/`. Live 390 px Axe reported zero serious/critical violations on all four. Cold live testing also verified `/?demo=1`, the persistent demo banner, isolated reset with a real-vault sentinel, visible legal navigation, the HTTP 404 route, and the direct 404 h1. See `.factory/evidence-polish-5-live-check.md` and its screenshots/JSON reports.

## Known gaps and next steps

No release-candidate findings remain.

Preview desktop packages remain unsigned, as disclosed in product copy. If signed distribution is needed later, the release workflow will need the operator-provided `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` secrets plus the corresponding signing configuration. No analytics, tracking, or third-party calendar processing was added.
