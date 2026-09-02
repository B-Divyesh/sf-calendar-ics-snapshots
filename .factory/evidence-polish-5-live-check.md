# Round 5 live check

**Deployed repair:** `c1ed0a3ccd1d77475dff087d65293747f7d05213`  
**Live origin:** <https://calendar-ics-snapshots.sociobot.in/>

## Cold route checks

`/opt/fleet/lib/verify-url.sh` opened each route in a fresh Chromium page and wrote the HTML, desktop/mobile screenshots, and JSON report beside this file.

| Route | Result | Load | Console errors | Evidence |
| --- | --- | ---: | --- | --- |
| `/` | title/lang/one h1/main/alt checks passed | 913 ms | none | `evidence-polish-5-live-root/verify.json` |
| `/demo/` | title/lang/one h1/main/alt checks passed | 684 ms | none | `evidence-polish-5-live-demo/verify.json` |
| `/privacy/` | title/lang/one h1/main/alt checks passed | 868 ms | none | `evidence-polish-5-live-privacy/verify.json` |
| `/terms/` | title/lang/one h1/main/alt checks passed | 723 ms | none | `evidence-polish-5-live-terms/verify.json` |

`scripts/verify-url.sh` also passed on those four URLs. Live Axe at 390 × 844 reported zero serious or critical violations on all four routes.

## Direct mobile regression check

A fresh 390 × 844 browser context opened the live root first. The sample action and final first-screen fact were inside the 844 px viewport. It then opened `/?demo=1`, observed the isolated two-copy sample and persistent banner, imported a valid third calendar copy, reset it to the two-copy seed, and confirmed that a sentinel in the real vault database was unchanged. The same cold context confirmed every shared header exposed **Home, Demo, Privacy, Terms** on `/`, `/demo/`, and an unknown route. The unknown route returned HTTP 404 and its only h1 was **“Page not found.”**

Screenshots: `evidence-polish-5-live-mobile-home.png`, `evidence-polish-5-live-mobile-demo.png`, and `evidence-polish-5-live-mobile-404.png`.
