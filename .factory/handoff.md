# Review handoff — calendar-ics-snapshots-review-5

## Result

**FAIL.** This was a review-only work order; product code was not modified. The committed report is `.factory/review-5.md`.

Two findings remain:

1. **F-5-1 (major):** at 390 px the shared header hides Privacy and Terms, contrary to the required consistent legal navigation.
2. **F-5-2 (minor):** the 404 h1 says “This page is not in the archive.” instead of plainly naming the not-found state.

## Verification performed

- Fresh cloned `main` at `361e0cb9902c5ec7c6b2af468889d5ba2bec6e3c`; ran `npm ci`.
- Ran the 37 declared claim commands through `npm run test:claims`; all completed successfully (Playwright last-run status was passed with no failures).
- Ran `npm test`, `npm run lint`, `npm run check`, `npm run build`, `npm run test:e2e`, and `npm run test:e2e:static` from the clean clone. The test/lint portion completed successfully; native Cargo work overlapped the aggregate command but its declared native claim completed through the claims runner.
- Independently tested live desktop and 390 × 844 routes, first read, demo seed/reset/leave/export, demo IndexedDB namespace, request log, metadata, 404, headers, links, route focus, reduced motion, touch targets, `scripts/verify-url.sh`, and Axe serious/critical checks.

## Next steps

Implement the two fixes in the review, add the mobile shared-navigation regression test, and repeat the complete review checklist.
