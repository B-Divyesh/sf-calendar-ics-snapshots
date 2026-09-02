# Polish round 2 — adversarial review closure

**Review source:** `.factory/review-2.md` at `3343a9509d235e142ba2f598248009603e95c1fe`  
**Repair candidate:** recorded after the repair commit  
**Live URL:** <https://calendar-ics-snapshots.sociobot.in/>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Preserved the compact copy-first mobile hero from round 1. | `landing composition remains usable at 390px`; mobile landing screenshot recorded during live recheck. |
| F-1-2 | Preserved the close-before-delete demo reset path. | `@claim:demo-reset`; live `/demo/` reset returns to two calendar copies. |
| F-1-3 | Preserved the explicit sales pause and removed checkout links. | `@claim:license-sales-paused`; live `/` has no checkout action. |
| F-1-4 | Extended the claims contract for deletion and strengthened free-feature and mobile-download proof. | `npm test` claims-contract check; every entry has one tagged test. |
| F-1-5 | Preserved **calendar copy** as the visitor term. | wording regression check and `.factory/copy-audit.md`. |
| F-1-6 | Hid Lock vault in demo mode, so the persistent demo banner, shared header, and legal footer remain present. | `demo controls keep the sample safety shell available until the visitor leaves`; live `/demo/`. |
| F-1-7 | Preserved focus and route announcements on site navigation and Back. | `public routes share navigation, legal links, one task heading, and route focus`. |
| F-1-8 | Preserved the demo task heading. | `@claim:sample-project`; live `/demo/` h1 is “Review changes in the sample calendar.” |
| F-1-9 | Preserved the precise local-vault privacy copy. | site wording regression check. |
| F-1-10 | Preserved literal archive and changes labels. | site wording regression check. |
| F-1-11 | Preserved literal license-entry actions. | site wording regression check. |
| F-1-12 | Replaced the landing checksum jargon with “download check available”; README now explains the installer check and the SHA-256 file-check list. | `@claim:checksum-install`; live `/` copy check. |
| F-1-13 | Preserved “Added, moved, and cancelled events.” | site wording regression check. |
| F-1-14 | Preserved the split README deployment sentences. | `.factory/copy-audit.md`. |
| F-1-15 | Preserved encrypted archive export/import. | `@claim:archive-roundtrip` and strengthened `@claim:license-price`. |
| F-1-16 | Preserved external-link labels. | site wording regression check. |
| F-2-1 | Replaced copy-only `license-price` coverage with an unlicensed import, review, restore export, encrypted archive export/import, and scheduling-gate check. | `@claim:license-price`. |
| F-2-2 | Detects Android/iPhone before Linux and shows “View desktop downloads on GitHub,” never a device-matched binary. | `@claim:release-downloads` uses Android and iPhone contexts; live mobile `/`. |
| F-2-3 | Renamed the unsupported installation promise to “Command-line installers.” | static wording check; live `/`. |
| F-2-4 | Replaced the unregistered AES-specific sentence with “Stored data is encrypted before local storage.” | `@claim:encrypted-local-vault`; app lock-screen check. |
| F-2-5 | Added a confirmed **Delete local archive** action and its claim. | `@claim:delete-local-vault`; Privacy page and app test. |
| F-2-6 | Renamed “Start for real” to **Leave demo** and documented that it returns to downloads without copying sample data. | demo-shell regression test; live `/demo/`. |

## Test evidence

- `npm test` — 10 passing tests.
- `npm run lint`, `npm run check`, and `npm run build` — pass; static output is `dist/site`.
- `npm run test:e2e` — 26 passing app/browser tests.
- `npm run test:e2e:static` — 6 passing production-static tests.
- `cargo test --manifest-path src-tauri/Cargo.toml native_caldav_transport` — 3 passing native tests.
- The post-deploy recheck uses the live root, demo, legal routes, 404, mobile download branch, `scripts/verify-url.sh`, and Axe.
