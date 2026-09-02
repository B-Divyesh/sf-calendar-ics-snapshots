# Handoff — adversarial first-read review 2

## Result

**FAIL.** `.factory/review-2.md` records four blocking and four major findings against candidate `5faf5a613f1d40264a67d4974e631578ea501276` and the live site checked on 2026-09-02 UTC. Product code was not modified.

## What was reviewed

- Cold 390 × 844 and 1440 × 900 landing views.
- One-click sample entry, populated demo, isolated IndexedDB storage, live reset, real-storage sentinel, offline export, and request log.
- Every prior review/polish finding in `.factory/review-1.md` and `.factory/polish-1.md`, in both live behavior and source.
- Every sentence, heading, label, and action on the landing page and README.
- All claims, public routes, metadata, 404 behavior, links, header/footer consistency, focus/Back behavior, accessibility, security headers, and asset budgets.
- Brief-implied import/export/sync and AI leverage.

## Verification

Fresh clone: `/tmp/calendar-review2-clean.wC07f2`.

- All 30 exact commands in `.factory/claims.json`: final PASS. The native claim required installation of the README’s Tauri Linux prerequisites, then passed 3 Rust tests.
- `npm test`: PASS, 10 tests.
- `npm run build`: PASS; `dist/app` and `dist/site` produced.
- `npm run lint`: PASS.
- `npm run check`: PASS.
- `npm run test:e2e`: PASS, 24 tests.
- `npm run test:e2e:static`: PASS, 6 tests.
- `scripts/verify-url.sh` against live root and demo: PASS.
- Live Axe: zero serious/critical findings on root, demo, Privacy, Terms, and 404.
- Crawled internal and GitHub links: all returned 200 after redirects.

## Findings to address

1. Reopened F-1-6: Lock vault removes the demo banner, reset/exit controls, header, and footer.
2. Reopened F-1-12: unexplained checksum wording remains.
3. F-2-1: `license-price` passes by checking copy, not the promised free operations.
4. F-2-2: Android and iPhone visitors receive a Linux x86_64 AppImage action.
5. F-2-3 through F-2-5: three public claims lack matching claim entries/tests.
6. F-2-6: Start for real returns home without naming that result.

See `.factory/review-2.md` for exact quotes, evidence, copy counts, and required fixes.
