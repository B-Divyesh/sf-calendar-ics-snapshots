# Handoff — first-read product QA review 1

## Result: FAIL

Reviewed commit `79b289782a1922af7b6972c136e9640fbc8962b4` against the live product on 2026-09-01 UTC. No product code or infrastructure was changed. The complete report is `.factory/review-1.md`.

## Blocking findings

1. At 390 × 844, the audience sentence and **Try it with sample data** action are below the first viewport.
2. **Reset demo** fails after sample data changes and leaves the added edition in place.
3. **Buy the US$29 license** returns HTTP 404.
4. Several README and installer promises have no claims entry or tagged observable check.

The report also records inconsistent route chrome and focus, a product-name demo h1, inconsistent terminology, unclear or technical copy, one 23-word README sentence, unidentified external links, and the absence of full encrypted archive export/import.

## Verification

All 20 exact commands in `.factory/claims.json` passed from a fresh clone after installing the Linux Tauri prerequisites named by the release workflow. Additional results:

```text
npm test                 PASS (9)
npm run lint             PASS
npm run check            PASS
npm run build            PASS (dist/app and dist/site)
npm run test:e2e         PASS (18)
npm run test:e2e:static  PASS (3)
```

Live Playwright checks covered 390 px and desktop first screens, demo entry, reset, separate real/demo IndexedDB sentinels, request logs, metadata, links, 404 behavior, navigation focus, console output, Axe, and touch targets. The live root and demo HTML match the fresh production build byte-for-byte.

## Next step

Repair F-1-1 through F-1-16 in `.factory/review-1.md`, add the missing claim checks, and rerun the full checklist from a clean clone and fresh browser contexts.
