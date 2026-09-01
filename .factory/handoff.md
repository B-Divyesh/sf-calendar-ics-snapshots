# Handoff — Calendar Snapshotter v0.1.2 repair

## Released repair

Release-blocking verifier findings from `027183a0032612bd622a0a6db195d601671bfb0f` are repaired in native release commit `bf048b60d7a657739cef9a0c50f62a92db5bf40b` (`v0.1.2`). The commit is pushed to `main`; the tagged release and live static site are published.

- `/demo/` now bundles the actual browser-rendered desktop interface and enters the separate `demo:calendar-snapshotter` vault automatically. The landing page’s **Try it with sample data** action opens that usable sample directly, rather than falling through to the landing page.
- The app keeps `/?demo=1` for the desktop/browser development entry point. In the static demo, **Start for real** returns to the landing page without copying demo state.
- Added a production-static Playwright regression that builds `dist/site`, follows the landing action, asserts the demo banner/two snapshots/Airport train, confirms it is not the landing page, and runs axe. The existing claim tests now exercise `/demo/`, the URL visitors use.
- The static demo includes a temporary semantic loading `<main>` that is removed before the app renders its real landmark. This keeps `verify-url.sh` useful on the built document without creating duplicate landmarks in the running app.
- Updated the app/package version to `0.1.2` and published new macOS, Windows, and Linux installers, `SHA256SUMS`, and `latest.json` from the exact tagged repair commit.

## Release and deployment evidence

- GitHub release: <https://github.com/B-Divyesh/sf-calendar-ics-snapshots/releases/tag/v0.1.2>
- GitHub Actions run: <https://github.com/B-Divyesh/sf-calendar-ics-snapshots/actions/runs/33549498832> — all four platform build jobs and the manifest job succeeded.
- Tag object resolves to `bf048b60d7a657739cef9a0c50f62a92db5bf40b`, the same repaired source commit.
- Release contains ARM64/x64 macOS DMGs, Windows MSI and EXE, Linux AppImage/DEB/RPM, `SHA256SUMS`, and `latest.json`.
- Downloaded `Calendar.Snapshotter_0.1.2_amd64.AppImage` (77,629,944 bytes). Its SHA-256 `4a1ed42383cb9b6fcae01208a55008378b819206798d26bc6a5779fa4c3a103a` matches `SHA256SUMS`.
- The landing page resolves the CORS-safe GitHub API release metadata to **Download for Linux** at the real v0.1.2 AppImage URL, with `v0.1.2 · checksum published` and no browser console errors. Missing-metadata behavior remains covered by the existing calm-state test.
- Deployed `dist/site` to the scoped `sf-calendar-ics-snapshots` Static Web App production environment. The live root SHA-256 is `fd853c29b0906c7d2fb738f348a399d25b59a03d4d3e41a42ecce34518292fcc`, identical to the final local `dist/site/index.html`.
- Live 390 px browser verification followed the landing demo action to `/demo/`, found two sample snapshots, no horizontal overflow, no console errors, and zero axe serious/critical findings.

## Verification run

```sh
npm ci
npm test
npm run test:e2e
npm run test:e2e:static
npm run check
npm run build
./scripts/verify-url.sh https://calendar-ics-snapshots.sociobot.in/
./scripts/verify-url.sh https://calendar-ics-snapshots.sociobot.in/demo/
```

All commands passed. `npm test` passed 5 tests; `npm run test:e2e` passed 14 browser tests; `npm run test:e2e:static` passed the production-build regression; `npm run check` passed TypeScript plus Tauri/Rust after installing the same Linux desktop prerequisites used in the release workflow. The seven claim-tagged tests pass within the full browser suite. The exact production build outputs 9.29 kB gzip desktop-app JS, 9.02 kB gzip demo JS, 3.21 kB gzip demo CSS, 1.48 kB gzip landing JS, and 2.49 kB gzip landing CSS.

Live `verify-url.sh` passed for `/` and `/demo/`. Playwright axe passed for the built static demo and live mobile sample with zero serious/critical issues. Lighthouse against the live landing recorded 99 performance, 100 accessibility, 100 best practices, and 100 SEO.

## Known boundaries

- Scheduled snapshots run only while the desktop app is open.
- Users supply a direct CalDAV collection or ICS URL; collection discovery is not included.
- v0.1.2 restores VEVENT calendar events, not VTODO/VJOURNAL diffs.
- Native packages are unsigned until the owner supplies macOS notarization and Windows Authenticode credentials.

## Needs operator action

Add signing credentials (`APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`) to sign future macOS and Windows releases. No action is required for this deployed repair.
