# Polish round 5 — Calendar Snapshotter

**Repair commit:** `c1ed0a3ccd1d77475dff087d65293747f7d05213`  
**Deployment:** <https://calendar-ics-snapshots.sociobot.in/>  
**Result:** PASS — every review finding is closed.

The earlier repairs were retained and re-run from a clean clone. This round changed the mobile shared header in both the static shell and the browser-rendered sample shell, replaced the 404 metaphor, added exact regressions, refreshed the catalog description, and rechecked the live deployment cold.

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the compact copy-first 390 px hero; the audience, sample action, outcome, and three facts fit before the viewport edge. | `landing composition remains usable at 390px`; `evidence-polish-5-live-mobile-home.png`; live `/`. |
| F-1-2 | Kept demo database-handle closure, delete, and reseed behavior. | `@claim:demo-reset`; live reset in `evidence-polish-5-live-check.md`. |
| F-1-3 | Kept sales paused and removed the unavailable checkout route. | `@claim:license-sales-paused`; live `/`. |
| F-1-4 | Retained the one-claim/one-tagged-test contract. | `.factory/claims.json`; clean-clone `npm run test:claims` passed 37/37. |
| F-1-5 | Retained **calendar copy** as the sole public name for a saved version. | public wording regression; `.factory/copy-audit.md`. |
| F-1-6 (including reopened) | The shared shell now keeps all four links visible at 390 px on landing, sample, legal, and 404 routes. The sample shell uses the same compact wrapped row. | `390px shared header keeps every legal route link visible and usable`; `evidence-polish-5-live-mobile-{home,demo,404}.png`; live URLs. |
| F-1-7 | Retained heading focus and polite route announcement on forward and Back navigation. | `public routes share navigation, legal links, one task heading, and route focus`. |
| F-1-8 | Retained the task-focused sample heading. | `@claim:sample-project`; live `/demo/`. |
| F-1-9 | Retained the precise local-vault privacy heading. | public wording regression; live `/`. |
| F-1-10 | Retained literal archive/change labels. | public wording regression; live `/demo/`. |
| F-1-11 | Retained action labels that state their actual result. | public wording regression; license browser flow. |
| F-1-12 (including reopened) | Retained plain explanations for formats, servers, storage, uploads, and unsigned previews. | public wording regression; `@claim:checksum-install`; `.factory/copy-audit.md`. |
| F-1-13 | Retained the concrete change summary. | public wording regression; live `/`. |
| F-1-14 | Retained short README/deployment sentences. | `.factory/copy-audit.md`; clean-clone documentation review. |
| F-1-15 | Retained encrypted full-archive export/import and wrong-passphrase protection. | `@claim:archive-roundtrip`; `@claim:archive-wrong-passphrase`. |
| F-1-16 | Retained named external destinations and screen-reader context. | public wording regression; live route checks. |
| F-2-1 | Kept the unlicensed end-to-end recovery, archive, and scheduling-gate assertion. | `@claim:license-price`. |
| F-2-2 | Kept phone-specific desktop-download guidance rather than a binary download. | `@claim:release-downloads`. |
| F-2-3 | Kept the accurate command-line installer wording. | public wording regression; live `/`. |
| F-2-4 | Kept only the testable encryption wording. | `@claim:encrypted-local-vault`. |
| F-2-5 | Kept confirmed local-vault deletion. | `@claim:delete-local-vault`. |
| F-2-6 | Kept **Leave demo**, which deletes sample state before it returns home. | `@claim:demo-leave`; live sample check. |
| F-3-1 | Kept demo namespace/production-license isolation. | `@claim:demo-private`; live `/?demo=1` check. |
| F-3-2 | Kept Leave/re-entry reseeding. | `@claim:demo-leave`; live reset/seed check. |
| F-3-3 | Kept complete recurrence, installer, and package-manifest assertions. | `@claim:recurrence-timezones`; `@claim:checksum-install`; `@claim:release-packaging`. |
| F-3-4 | Kept isolation, offline, and price facts on the first screen. | mobile hero regression; `@claim:offline-local`; live `/`. |
| F-3-5 | Kept all sample controls and wordmark at usable mobile target sizes. | mobile target regression; `evidence-polish-5-live-mobile-demo.png`. |
| F-3-6 | Kept tagged checks for release trigger, static output, and response policy. | `@claim:release-trigger`; `@claim:static-site-output`; `@claim:site-response-policy`. |
| F-3-7 | Kept explicit section labels. | public wording regression; live `/`. |
| F-4-1 | Kept legal contact links at least 44 px high on phones. | `legal page links and buttons meet the 44px phone touch target`. |
| F-4-2 | Kept documented runtime requirements in the claims contract. | `@claim:runtime-requirements`. |
| F-4-3 | Kept idempotent native prerequisite coverage. | `@claim:native-prerequisite-setup`. |
| F-5-1 | Replaced mobile link hiding with a wrapped, visible four-link navigation row in both site shells; each header link remains at least 44 px high and the Privacy link was activated by keyboard in the regression. | `390px shared header keeps every legal route link visible and usable`; `evidence-polish-5-live-mobile-{home,demo,404}.png`; live `/`, `/demo/`, `/privacy/`, `/terms/`, and missing route. |
| F-5-2 | Changed the 404 h1 from archive lore to the direct **“Page not found.”** and asserted the title, status, explanation, and return link. | `production static site serves the designed 404 with an HTTP 404 status`; `evidence-polish-5-live-mobile-404.png`; live `/definitely-missing-page`. |

## Verification

- Fresh clone `/tmp/calendar-polish-5.E8e7y6` at the repair commit: `npm ci`; `npm run test:claims` (all 37 commands); `npm test` (17 tests); `npm run lint`; `npm run check`; `npm run build`; `npm run test:e2e` (28 tests); and `npm run test:e2e:static` (8 tests) all passed.
- Production: `scripts/verify-url.sh` and `/opt/fleet/lib/verify-url.sh` passed on `/`, `/demo/`, `/privacy/`, and `/terms/`. Live 390 px Axe found zero serious/critical violations on those routes.
- The static deployment was uploaded to the existing product-scoped `sf-calendar-ics-snapshots` Static Web App. The custom domain was ready and HTTPS returned 200.
