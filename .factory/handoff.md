# Review handoff — calendar-ics-snapshots-review-4

## Result

**FAIL:** `.factory/review-4.md` records three major findings and no blocking finding.

- Privacy and Terms email links measure 19 px high at 390 px, below the required 44 px touch target.
- The README’s Node.js/Rust requirement is not represented in `.factory/claims.json`.
- The README’s automatic Ubuntu/Debian prerequisite-install behavior is not represented in `.factory/claims.json`.

No product code was modified.

## Verification

- Cold live first-read checks passed at 390 × 844 and 1440 × 900.
- `npm run test:claims` from clean clone `/tmp/calendar-review4-clean.taoujh/repo` passed all 35 declared commands. The native setup installed missing Tauri libraries and its three Rust transport tests passed.
- The live one-click demo opened with two realistic copies, moved/cancelled changes, the persistent banner, Reset, and Leave.
- Live Reset changed 3 → 2 copies. Leave/re-entry also returned to 2. Real IndexedDB and local-storage sentinels remained unchanged.
- Live offline export worked. The complete demo flow made only same-origin requests and logged no console/page errors.
- Root, demo, Privacy, Terms, and HTTP 404 passed metadata/structure checks. Forward and Back focused h1 and restored scroll.
- Playwright Axe found no serious/critical issue. Manual target measurement found the two 19 px email links.
- All crawled internal routes, GitHub links, the v0.1.6 AppImage, discovery files, art, icons, and installers returned 200.
- `./scripts/verify-url.sh` passed for root, demo, Privacy, and Terms.
- `npm test` passed 15 tests. `npm run lint`, `npm run check`, and `npm run build` passed; `dist/app` and `dist/site` were produced.

## Next steps

Apply the exact fixes in F-4-1 through F-4-3, then repeat the full review rather than checking only the changes. No infrastructure, DNS, billing, deployment, secrets, or other product resources were accessed or changed.
