# Polish round 1 — adversarial review closure

**Review source:** `.factory/review-1.md` at `8f29520e08473772df42da6378de2509aefc9374`  
**Candidate repaired:** `79b289782a1922af7b6972c136e9640fbc8962b4`  
**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>  
**Result:** all 16 findings closed.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Reordered and compressed the 390 px hero. The audience, sample action, outcome, and all three facts now precede the illustration. | `landing composition remains usable at 390px` measures the last fact within 844 px; `.factory/evidence-polish-1-live-mobile-home.png`; live `/` at 390 × 844. |
| F-1-2 | The vault layer tracks and closes every open IndexedDB handle before deleting and reseeding only the demo database. | `@claim:demo-reset restores the seed and leaves real storage untouched`; `.factory/evidence-polish-1-live-demo-reset.png`; live `/demo/` returns to the two shipped copies after adding a third. |
| F-1-3 | Removed the unavailable checkout. The site now states that new scheduling-license sales are paused and keeps restore features free. | `@claim:license-sales-paused`; `@claim:license-price`; live `/` contains no `/checkout` link. |
| F-1-4 | Registered every retained public promise in `.factory/claims.json`; removed speculative macOS and Windows launch behavior. | `scripts/claims.test.ts` requires exactly one `@claim:<id>` test per entry; all claim-tagged tests pass. |
| F-1-5 | Standardized visitor copy on **calendar copy**; internal type names remain implementation details only. | `public wording uses one calendar-copy term, literal labels, and identified external links`; `.factory/copy-audit.md`. |
| F-1-6 | Applied the same Home / Demo / Privacy / Terms header and legal footer to landing, demo, privacy, terms, and 404 routes. | `public routes share navigation, legal links, one task heading, and route focus`; live `/demo/`, `/privacy/`, `/terms/`, and missing-route checks. |
| F-1-7 | Added route-intent state, focused the destination h1 after navigation and Back, and announced it through a polite live region. | `public routes share navigation, legal links, one task heading, and route focus` checks forward focus, Back focus, title, and scroll restoration. |
| F-1-8 | Changed the demo h1 to “Review changes in the sample calendar.” | `@claim:sample-project`; live `/demo/`. |
| F-1-9 | Replaced the ambiguous hosted-calendar heading with “Calendar copies stay in your local vault.” | `public wording uses one calendar-copy term, literal labels, and identified external links`; live `/`. |
| F-1-10 | Replaced newsroom labels with “Local calendar archive” and “Changes in this copy.” | `public wording uses one calendar-copy term, literal labels, and identified external links`; live `/demo/`. |
| F-1-11 | Renamed reveal-only actions to “Enter a license token” and “View the scheduling license.” | `public wording uses one calendar-copy term, literal labels, and identified external links`; live `/` and `/demo/`. |
| F-1-12 | Introduced file/server standards after plain terms and replaced storage, telemetry, and signing jargon in visitor copy. | `public wording uses one calendar-copy term, literal labels, and identified external links`; `.factory/copy-audit.md`; README copy audit. |
| F-1-13 | Replaced “Readable changes” with “Added, moved, and cancelled events.” | `public wording uses one calendar-copy term, literal labels, and identified external links`; live root summary strip. |
| F-1-14 | Split and shortened the deployment sentence. | README now says “Static deployment publishes `dist/site`.” followed by a 13-word sentence; `.factory/copy-audit.md`. |
| F-1-15 | Added full encrypted archive export/import, including calendar copies and optional connection settings. Import verifies the passphrase before replacing local state. | `@claim:archive-roundtrip`; `@claim:archive-wrong-passphrase`; live `/demo/` exposes both archive actions. |
| F-1-16 | External actions now name GitHub or Sociobot and include screen-reader context where needed. | `public wording uses one calendar-copy term, literal labels, and identified external links`; public-route link crawl. |

## Additional controller evidence fix

Cold landing loads now use the bundled metadata for the published v0.1.4 release, so a GitHub API rate limit cannot produce a console error. **Check for a newer release** performs the optional GitHub API refresh and falls back to the known-good published download. Evidence: `@claim:release-downloads`, `an unavailable release has a calm download state without a console error`, and the post-deploy cold-load console check.

## Evidence paths

- `.factory/evidence-polish-1-mobile-home.png` — local 390 × 844 landing capture.
- `.factory/evidence-polish-1-mobile-demo.png` — local populated demo capture.
- `.factory/evidence-polish-1-live-mobile-home.png` — cold live landing capture.
- `.factory/evidence-polish-1-live-demo-reset.png` — live demo after deterministic reset.
- `.factory/evidence-polish-1-live-404.png` — live styled 404 with consistent route chrome.

The exact clean-clone command results, performance numbers, deployed commit, and byte-identity checks are recorded in `.factory/handoff.md`.
