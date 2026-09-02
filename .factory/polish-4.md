# Polish round 4 — cumulative adversarial review closure

**Review source:** `.factory/review-4.md` at `af2ebbcf77a8cda90704eb8e58af29ce1f38f0e6`  
**Candidate repaired:** `c9e1fe4a9873ce307adeb3de3dc27b40a26790b8`  
**Repair commits:** `27f232b`, `0ed03f0`, `347c94a`, `bdca3b9`  
**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>  
**Result:** every finding from reviews 1–4 is closed.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved the compact, copy-first phone layout. The audience, sample action, outcome, and all three facts remain above the 844 px edge. | `landing composition remains usable at 390px`; `.factory/evidence-polish-4-live-mobile-home.png`; live `/` measured the final fact at 445.42 px. |
| F-1-2 | Reset closes demo handles, deletes only `demo:calendar-snapshotter`, and reseeds two copies. Navigation waits make this deterministic. | `@claim:demo-reset`; `.factory/evidence-polish-4-live-check.json`; live `/demo/` returned 3 → 2 copies without changing the real sentinel. |
| F-1-3 | New sales remain explicitly paused and no checkout URL is rendered. Existing licenses can still be verified. | `@claim:license-sales-paused`; clean-clone claim run; live `/`. |
| F-1-4 | Every retained promise is registered with one exact tagged test; the two round-4 README promises are now included. | `claims contract`; `npm run test:claims` from `/tmp/calendar-polish4-final.7zO1Qk/repo`: 37/37 commands passed. |
| F-1-5 | Visitor copy consistently calls a saved version a **calendar copy**. | `public wording uses one calendar-copy term, literal labels, and identified external links`; `.factory/copy-audit.md`; live `/`. |
| F-1-6 | Landing, demo, Privacy, Terms, and 404 retain the shared Home/Demo header and legal footer. | `public routes share navigation, legal links, one task heading, and route focus`; live route checks in `.factory/evidence-polish-4-live-check.json`. |
| F-1-7 | Route navigation and Back focus the destination h1, announce it, and restore scroll. The demo h1 now has the designed proof-red focus ring too. | Static route test; live check records forward/back focus and 4,005 px scroll restoration; `.factory/evidence-polish-4-live-mobile-demo-top.png`. |
| F-1-8 | The demo task heading remains **“Review changes in the sample calendar.”** | `@claim:sample-project`; `.factory/evidence-polish-4-live-mobile-demo.png`; live `/demo/`. |
| F-1-9 | The privacy heading remains the precise **“Calendar copies stay in your local vault.”** | Wording regression test; live `/`. |
| F-1-10 | Product labels remain **“Local calendar archive”** and **“Changes in this copy.”** | Wording regression test; live `/demo/`. |
| F-1-11 | License actions describe their actual result: **“Enter a license token”** and **“View the scheduling license.”** | Wording regression test; browser license-flow tests. |
| F-1-12 | File and server standards follow plain names; public copy says **“download check”** and README explains the SHA-256 list. | Wording regression test; `@claim:checksum-install`; `.factory/copy-audit.md`; live `/`. |
| F-1-13 | The product summary remains **“Added, moved, and cancelled events.”** | Wording regression test; live `/`. |
| F-1-14 | README instructions use short, direct sentences; no audited landing sentence exceeds 22 words. | `.factory/copy-audit.md`; README review. |
| F-1-15 | Full encrypted archive export/import restores calendar copies and optional connections, and rejects a wrong passphrase without changing the open vault. | `@claim:archive-roundtrip`; `@claim:archive-wrong-passphrase`; clean-clone claim run. |
| F-1-16 | External actions name GitHub or Sociobot and provide screen-reader context. | Wording regression test; every crawled live destination returned 200 in `.factory/evidence-polish-4-live-check.json`. |
| F-1-6 (reopened) | Demo mode has no Lock vault action, so its banner, reset/leave controls, shared header, and legal footer persist. | `demo controls keep the sample safety shell available until the visitor leaves`; live `/demo/`. |
| F-1-12 (reopened) | The landing page uses **“download check available”** and README defines the checksum file in ordinary words. | `@claim:checksum-install`; live `/`. |
| F-2-1 | Unlicensed coverage performs import, change review, restore export, encrypted archive round trip, and verifies the scheduling gate. | `@claim:license-price`; clean-clone claim run. |
| F-2-2 | Android and iPhone visitors receive desktop-download guidance, never a Linux binary. | `@claim:release-downloads`; `.factory/evidence-polish-4-live-mobile-home.png`; live `/`. |
| F-2-3 | The landing heading accurately says **“Command-line installers.”** | Wording regression test; live `/`. |
| F-2-4 | Copy makes only the tested statement that stored data is encrypted before local storage. | `@claim:encrypted-local-vault`; clean-clone browser test. |
| F-2-5 | **Delete local archive** confirms the action and removes the IndexedDB vault record. | `@claim:delete-local-vault`; live `/privacy/`. |
| F-2-6 | **Leave demo** deletes the isolated database before returning home; re-entry starts with two shipped copies. Both navigations are explicitly awaited. | `@claim:demo-leave`; clean-clone full browser suite; `.factory/evidence-polish-4-live-check.json`. |
| F-3-1 | Demo chooses its namespace before license handling, ignores production tokens and verdicts, never writes them, and disables scheduling. | `@claim:demo-private`; live sentinels remained unchanged in `.factory/evidence-polish-4-live-check.json`. |
| F-3-2 | Leaving demo awaits database deletion before navigation and does not retain imported sample changes. | `@claim:demo-leave`; live re-entry restored exactly two copies. |
| F-3-3 | Claim tests inspect recurrence overrides and timezone output, run the macOS/Linux checksum installer, and generate release manifests from package fixtures. | `@claim:recurrence-timezones`; `@claim:checksum-install`; `@claim:release-packaging`. |
| F-3-4 | The first-screen facts state demo isolation, offline use, and free/paused pricing. | `landing composition remains usable at 390px`; `@claim:offline-local`; `.factory/evidence-polish-4-live-mobile-home.png`. |
| F-3-5 | The app wordmark and every visible demo action meet the 44 px mobile target. | `landing, footer, and demo actions meet the 44px mobile target`; `.factory/evidence-polish-4-live-mobile-demo-top.png`. |
| F-3-6 | Release trigger, static route output, and response policy each have registered, tagged assertions. | `@claim:release-trigger`; `@claim:static-site-output`; `@claim:site-response-policy`. |
| F-3-7 | Landing labels remain **“Why keep calendar copies”** and **“Standard restore format.”** | Wording regression test; live `/`. |
| F-4-1 | Legal email links are inline-flex, vertically centered, and at least 44 px high. The 390 px test measures every visible link and button on both legal routes. | `legal routes give every visible control a 44px mobile target`; `.factory/evidence-polish-4-live-mobile-privacy.png`; `.factory/evidence-polish-4-live-mobile-terms.png`; live measurements are 183.03 × 44 px. |
| F-4-2 | Added the `runtime-requirements` claim, `engines.node >=22`, and `rust-toolchain.toml` on stable. The test invokes Node, rustc, and rustup and cross-checks CI. | `@claim:runtime-requirements`; clean clone ran under Node 22 and stable Rust. |
| F-4-3 | Added the `native-prerequisite-setup` claim. Its isolated fixture starts with every native module absent, runs the real setup, asserts all required packages/modules, then proves the second run makes no package-manager call. | `@claim:native-prerequisite-setup`; 37/37 clean-clone claim commands; an independent real Ubuntu run also installed the missing packages and a second run was a no-op. |

Every row above was also checked against the final live deployment. Route screenshots are `.factory/evidence-polish-4-live-mobile-home.png`, `-demo-top.png`, `-demo.png`, `-privacy.png`, `-terms.png`, and `-missing.png`; the matching live URLs and measured outcomes are in `.factory/evidence-polish-4-live-check.json`.

## Final verification

- Fresh remote clone: `/tmp/calendar-polish4-final.7zO1Qk/repo` at `bdca3b9`.
- `npm run test:claims`: all 37 independently invoked claim commands passed.
- `npm test`: 17/17; `npm run lint`: pass; `npm run check`: TypeScript and Rust pass; `npm run build`: pass.
- `npm run test:e2e`: 28/28; `npm run test:e2e:static`: 7/7.
- Live root, demo, Privacy, Terms, and 404 returned the expected status, title, one h1, and one main with no console/page errors.
- Live `?demo=1` opened the isolated two-copy sample. Reset, Leave/re-entry, offline restore export, real-storage sentinels, and same-origin request logging passed.
- Playwright Axe found no serious or critical issue. Every legal-route control measured at least 44 × 44 CSS px at 390 px.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,057 ms; TBT 23 ms; CLS 0.0065.
- The broadsheet/archive identity, generated editorial plate, typography, palette, and motion policy remain unchanged.

No finding of any severity remains open.
