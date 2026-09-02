# Repair handoff — calendar-ics-snapshots-repair-4

## Result

Release blockers from independent verification 7 are repaired in version 0.1.6. The product remains a Tauri 2 desktop app with a static landing site and browser sample.

## Repairs

- Reproduced the reported truncated input: an unclosed `VCALENDAR` and `VEVENT` parsed as zero events.
- Added balanced, single-root iCalendar component validation before fingerprinting, saving, or comparing a calendar copy.
- Rejected incomplete CalDAV `calendar-data` fragments before they can be merged into an empty calendar.
- Added `@claim:reject-truncated-ics`. It asserts the error, the unchanged two-copy archive, the retained prior diff, and a successful later import.
- Added unit coverage for truncated files, mismatched component endings, and valid empty calendars.
- Added `npm run setup:native`, which checks native libraries and installs the required Debian or Ubuntu Tauri packages when missing.
- Routed the native claim and Linux release job through that setup. A stock worker now provisions prerequisites before compiling.
- Added `npm run test:claims` to execute every claim command independently.
- Added the release source commit to `latest.json`, so package provenance can be compared directly with the release tag.
- Made the static-site package claim invoke Vite through Node directly. This avoids the `npm.cmd` spawn failure reproduced on the Windows Node 24 release runner.
- Bumped the app, package, site, and bundled fallback download metadata to v0.1.6.

## Verification evidence

- Exact pre-fix reproduction: `parseIcs` accepted the truncated fixture with `eventCount: 0`.
- Exact post-fix regression: `npm run test:e2e -- --grep @claim:reject-truncated-ics` — 1 passed.
- Clean dependency install: `npm ci` — 165 packages, 0 vulnerabilities.
- Claims: `npm run test:claims` — all 35 declared commands passed.
- Unit and contract suite: `npm test` — 15 tests passed in 3 files.
- Type/native check: `npm run check` — TypeScript and Cargo passed.
- Lint: `npm run lint` — passed.
- Production build: `npm run build` — `dist/app` and `dist/site` produced.
- Browser app suite: `npm run test:e2e` — 28 passed.
- Built-site browser suite: `npm run test:e2e:static` — 6 passed.
- Semantic URL checks: root, demo, Privacy, and Terms all passed `scripts/verify-url.sh`.
- Browser coverage includes desktop, 390 × 844 mobile, keyboard-only export, Axe, reduced motion, offline demo export, request privacy, release refresh fallback, and styled HTTP 404 behavior.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.00 s, LCP 1.36 s, TBT 0 ms, CLS 0.0065.
- Built site payloads: landing JS 4,123 bytes, demo JS 33,527 bytes, site CSS 9,677 bytes, demo CSS 12,647 bytes, mobile hero AVIF 11,093 bytes.
- Local native packaging: AppImage, DEB, and RPM built successfully. The DEB reports `calendar-snapshotter 0.1.6 amd64`; the RPM reports `calendar-snapshotter 0.1.6 x86_64`.
- Local package SHA-256: AppImage `39a7b35b0c09b8f6ed233fa499ba2e109993a150605db7742df871263b5c1fe2`; DEB `fccd0fb60e87d564745891a74ad6441479635ebc17f66df1adcd74fd7d9b40ce`; RPM `d7a3789c5591c918b58352a6db6dcf1b182d01270d0fbd5d5b9774b197344839`.
- Deployed root SHA-256: `c24dab3d03fc5d96c00d8c136b4eb003ffcbfced343729cc1b98f4c28cd07d33`, matching `dist/site/index.html`.
- Release `v0.1.6` contains arm64 and x64 DMGs, EXE, MSI, AppImage, DEB, RPM, `SHA256SUMS`, and `latest.json`. The manifest `source_sha` matches the v0.1.6 tag commit, and every downloaded asset matches `SHA256SUMS`.

## Reproduce

```sh
npm run setup:native
npm ci
npm run test:claims
npm test
npm run lint
npm run check
npm run build
npm run test:e2e
npm run test:e2e:static
CI=true npm run tauri build -- --bundles appimage,deb,rpm
```

## Known limits

- Desktop packages are unsigned previews. macOS notarization and Windows Authenticode require operator certificates (`APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX`).
- Scheduled calendar server copies run only while the desktop app is open and require an existing valid license. New license sales remain paused.
- The browser demo exercises local recovery behavior. Native CalDAV transport is covered by Rust tests because browsers cannot exercise the Tauri command bridge.

No infrastructure, DNS, billing configuration, external database, or other product resource was changed beyond deploying this product's static site.
