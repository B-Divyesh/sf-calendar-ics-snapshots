# Polish round 3 — cumulative adversarial review closure

**Base reviewed:** `25951dab9167d422e79ffd860987662329c4a7af`  
**Repair commit:** `cb1b2a2`  
**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>  
**Result:** all findings from reviews 1, 2, and 3 are closed.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the copy-first compact mobile hero. It shows the audience, sample action, outcome, and three privacy/offline/price facts before the 844 px edge. | `landing composition remains usable at 390px`; `.factory/evidence-polish-3-live-mobile-home.png`; live `/`. |
| F-1-2 | Reset closes open demo handles, deletes only `demo:calendar-snapshotter`, and reloads the two-copy seed. | `@claim:demo-reset`; `.factory/evidence-polish-3-live-demo-reset.png`; live `/demo/`. |
| F-1-3 | Kept sales paused and removed all checkout actions while retaining existing-license verification in the real app. | `@claim:license-sales-paused`; live `/` has no checkout link. |
| F-1-4 | Registered all retained visitor promises with one exact tagged assertion per claim. | `claims contract`; every command in `.factory/claims.json` from a clean clone. |
| F-1-5 | Kept **calendar copy** as the sole visitor term for a saved version. | `public wording uses one calendar-copy term, literal labels, and identified external links`; live `/`. |
| F-1-6 | Kept shared Home/Demo/Privacy/Terms chrome and legal footer on landing, demo, legal, and 404 routes. | `public routes share navigation, legal links, one task heading, and route focus`; live `/demo/`, `/privacy/`, `/terms/`, and missing route. |
| F-1-7 | Kept route-heading focus and polite announcements on forward and Back navigation. | `public routes share navigation, legal links, one task heading, and route focus`; live `/privacy/` and Back. |
| F-1-8 | Kept the demo task heading: “Review changes in the sample calendar.” | `@claim:sample-project`; live `/demo/`. |
| F-1-9 | Kept the precise local-vault wording. | wording regression test; live `/`. |
| F-1-10 | Kept literal archive and change labels. | wording regression test; live `/demo/`. |
| F-1-11 | Kept reveal-only license controls named as views/entry, not false outcomes. | wording regression test; real app license dialog. |
| F-1-12 | Kept plain explanations for calendar files, calendar servers, uploads, storage, and unsigned preview packages. | wording regression test and `.factory/copy-audit.md`; live routes. |
| F-1-13 | Kept “Added, moved, and cancelled events.” in the product summary. | wording regression test; live `/`. |
| F-1-14 | Kept the deployment documentation split into short, direct sentences. | `.factory/copy-audit.md`; README review. |
| F-1-15 | Kept encrypted full-archive export/import with passphrase validation and saved connections. | `@claim:archive-roundtrip`; `@claim:archive-wrong-passphrase`. |
| F-1-16 | Kept external destination names and screen-reader context. | wording regression test; live link check. |
| F-1-6 (reopened) | Demo remains in the shared route shell; locking is absent in demo mode. | `demo controls keep the sample safety shell available until the visitor leaves`; live `/demo/`. |
| F-1-12 (reopened) | Kept “download check” in public copy and a plain README explanation of checksum checking. | `@claim:checksum-install`; live `/`. |
| F-2-1 | Kept the unlicensed recovery test as an end-to-end import, review, restore, archive, and scheduling-gate flow. | `@claim:license-price`. |
| F-2-2 | Kept phone detection ahead of Linux detection and sends phones to desktop downloads rather than a binary. | `@claim:release-downloads`; live mobile `/`. |
| F-2-3 | Kept the limited, accurate “Command-line installers” label. | wording regression test; live `/`. |
| F-2-4 | Kept the testable plain encryption statement rather than an unsupported algorithm detail. | `@claim:encrypted-local-vault`. |
| F-2-5 | Kept confirmed deletion of the local vault and its browser-storage assertion. | `@claim:delete-local-vault`; live Privacy page. |
| F-2-6 | **Leave demo** now discards its database before navigation, so it names and performs its result. | `@claim:demo-leave`; `.factory/evidence-polish-3-live-demo-leave.png`; live `/demo/`. |
| F-3-1 | Demo mode now determines its namespace before any license code runs, never captures/reads/saves/verifies a production token, and disables scheduling. | `@claim:demo-private`; `.factory/evidence-polish-3-live-demo-isolation.png`; live `/demo/`. |
| F-3-2 | **Leave demo** awaits deletion of the demo database before returning to the landing page. Re-entry reseeds exactly two copies. | `@claim:demo-leave`; `.factory/evidence-polish-3-live-demo-leave.png`; live `/demo/`. |
| F-3-3 | The recurrence claim exports and inspects an override plus `VTIMEZONE`; the public command is now accurately limited to macOS/Linux; release packaging runs the manifest generator against native-package fixtures. | `@claim:recurrence-timezones`; `@claim:checksum-install`; `@claim:release-packaging`. |
| F-3-4 | The three first-screen facts are now isolation, offline availability, and free/paused pricing. | `landing composition remains usable at 390px`; `@claim:offline-local`; live `/`. |
| F-3-5 | The demo app wordmark is an inline-flex 44 px target. The target test waits for populated demo data and measures it explicitly. | `landing, footer, and demo actions meet the 44px mobile target`; `.factory/evidence-polish-3-live-mobile-demo.png`; live `/demo/`. |
| F-3-6 | Removed the unnecessary single-record claim and added release-trigger, built-site-output, and full static-policy claims with tagged tests. | `@claim:release-trigger`; `@claim:static-site-output`; `@claim:site-response-policy`; README review. |
| F-3-7 | Renamed the two unclear labels to “Why keep calendar copies” and “Standard restore format.” | wording regression test; live `/`. |

## Live recheck

- Cold root, demo, Privacy, Terms, and unknown-route checks passed after deployment.
- The cold `?demo=1` path redirected to `/demo/` and showed the populated isolated sample, persistent banner, Reset demo, and Leave demo controls.
- The 390 × 844 root and demo screens have no horizontal overflow. All visible controls, including the app wordmark, meet the 44 px target.
- `scripts/verify-url.sh` passed for root, demo, Privacy, and Terms. Playwright Axe scans have no serious or critical violations.
