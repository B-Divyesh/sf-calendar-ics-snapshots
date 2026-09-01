# Handoff — repair 3

## Result: PASS

This repair addresses every release-blocking finding in independent verification
report 3 for candidate `4796d14dc1db7b31d42d022238d084141ece1569`. The repaired
source is `a858f12fc15b1d04ec4c256b9ef754ff64e94509` on `main`, tagged
`v0.1.3`. The final GitHub Actions release run is
[`33557738017`](https://github.com/B-Divyesh/sf-calendar-ics-snapshots/actions/runs/33557738017).

## What changed

- Reproduced the reported public missing-route defect first: `curl -i
  https://calendar-ics-snapshots.sociobot.in/definitely-missing-page` returned
  HTTP 200 and the landing document before this repair.
- Removed the SPA fallback that caused that response. Static Web Apps now uses
  `responseOverrides.404` to rewrite to the designed `404.html` while retaining
  HTTP 404. The local static server and browser regression test assert both the
  status and the styled recovery link.
- Registered the retained visitor-facing behavior in `.factory/claims.json`
  (20 claims) and added observable `@claim:` tests for the full recovery flow,
  demo isolation and request policy, encrypted local storage and CalDAV
  credentials, passphrase behavior, duplicate refresh, recurrence/time-zone
  preservation, ICS output, native CalDAV transport, scheduling, pricing,
  installer checksum guard, unsigned preview, packaging, response policy, and
  release downloads. Narrowed copy where a claim was not appropriate.
- Made all visible landing, footer, demo, and app controls at least 44 × 44 CSS
  pixels. The 390 px regression test measures every visible link/button and
  the demo reset/real-data controls. Mobile no longer pins the app footer over
  the desk selector.
- Completed the static route metadata: route-specific titles/descriptions,
  canonical links, Open Graph/Twitter image metadata, 1200 × 630 social image,
  180 × 180 Apple touch icon, and complete Privacy, Terms, Demo, and designed
  404 documents. The social crop and touch icon provenance are recorded in
  `.factory/design.md`.
- Added a real ESLint configuration and release-workflow contract coverage.
  The one-line installer checksum test executes in Linux (its supported POSIX
  environment) and checks the same guard text on macOS/Windows CI so the
  platform matrix remains portable.

## Verification evidence

Run from a clean dependency install on 2026-09-01 UTC:

```sh
npm ci
npm test                         # 9 passed
npm run lint                     # passed
npm run check                    # TypeScript + cargo check passed
cargo test --manifest-path src-tauri/Cargo.toml  # 3 passed
npm run build                    # dist/app and dist/site produced
npm run test:e2e                 # 18 passed
npm run test:e2e:static          # 3 passed
./scripts/verify-url.sh <site>/
./scripts/verify-url.sh <site>/demo/
```

Every exact command named in `.factory/claims.json` was also run after the
repair. The build output is within the static budget: landing JS 1.52 kB gzip,
landing CSS 2.51 kB gzip; app JS 9.27 kB gzip and CSS 3.20 kB gzip. Browser
tests cover desktop, 390 px mobile, keyboard/focus, reduced motion, dialogs,
zero serious/critical Axe findings, demo storage isolation, no outgoing
telemetry, and static routing.

Local Lighthouse mobile evidence: landing 100/100/100/100
(Performance/Accessibility/Best Practices/SEO), LCP 1.4 s, CLS 0; demo
100/100/100/100, LCP 1.2 s, CLS 0.

## Deployment and live checks

Built `dist/site` was uploaded directly to the allowed
`sf-calendar-ics-snapshots` Static Web App production environment on
2026-09-01 UTC (deployment ID `fcf89bca-4258-4bda-8d97-51d6de42f0e3`). No
shared service, DNS zone, database, or unrelated Sociobot resource was read or
changed.

Post-deploy checks at `https://calendar-ics-snapshots.sociobot.in` passed:

- root and `/demo/` passed `scripts/verify-url.sh` (title, language, main
  landmark, image alts);
- `/definitely-missing-page` returns `HTTP 404`, `text/html`, the designed
  page, and its home recovery link;
- response headers include CSP with `frame-ancestors 'none'`,
  `X-Content-Type-Options: nosniff`, and strict-origin referrer policy.

## Release / operator action

Release workflow `33557738017` completed successfully across Linux, Windows,
macOS ARM, and macOS Intel. The published
[`v0.1.3` release](https://github.com/B-Divyesh/sf-calendar-ics-snapshots/releases/tag/v0.1.3)
contains both macOS DMGs, Windows MSI/EXE, and Linux AppImage/DEB/RPM, plus
`SHA256SUMS` and `latest.json`. A consumer-side download of
`Calendar.Snapshotter_0.1.3_amd64.deb` passed `sha256sum --check` against the
published manifest. `latest.json` was validated for Linux, Windows, macOS ARM,
and macOS Intel targets.

Packages intentionally remain unsigned. To ship signed builds, an operator
must provide `APPLE_CERTIFICATE` for macOS notarization/signing and
`WINDOWS_CERT_PFX` for Windows Authenticode. The site and README disclose this
preview status and the supported first-launch instructions.

## How to run

```sh
npm ci
npm run dev             # desktop UI development
npm run build
npm run serve:site      # inspect dist/site, including real 404s
npm test && npm run test:e2e && npm run test:e2e:static
```

See `README.md` for user-facing use, installer commands, release workflow, and
privacy behavior. See `.factory/demo.md` for the isolated sample-data flow.
