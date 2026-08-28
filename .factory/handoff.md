# Handoff — Calendar Snapshotter v0.1.0

## What was built

- Tauri 2 desktop application with a small vanilla TypeScript interface.
- AES-256-GCM local vault with PBKDF2-SHA-256 key derivation (310,000 iterations); calendar data and CalDAV credentials persist only inside the encrypted IndexedDB envelope.
- ICS ingestion, recurrence override identity, timezone preservation, SHA-256 change detection, readable added/moved/cancelled diffs, and selective standards-compatible restore export.
- Direct ICS GET and CalDAV `calendar-query` REPORT through a Rust bridge with authentication, redirect limit, timeout, and a 20 MB response guard.
- In-app 15-minute/hourly/daily scheduler while the app is running, gated by the US$29 one-time Sociobot license. Manual snapshots, diffs, and restore export stay free.
- Empty, offline, invalid-file, wrong-passphrase, unchanged-snapshot, connection-error, and inactive-license states.
- Responsive keyboard-accessible app and 390 px landing treatment, legal pages, OS-detected downloads, and checksum-verifying installers.
- Tag-triggered GitHub Actions release matrix for Apple Silicon/Intel macOS, Windows x64, and Linux x64. It publishes DMG, MSI/EXE, AppImage, DEB, RPM, `SHA256SUMS`, and `latest.json` via `softprops/action-gh-release`.
- Original generated editorial hero plate and hand-authored app mark; provenance is in `.factory/design.md` and `assets/src/archive-editions-v2.json`.

## Verification performed

All commands were run from `/work/repo` on 2026-08-28:

```sh
npm audit --omit=dev        # 0 vulnerabilities
npm test                    # 2 files, 5 tests passed
npx tsc --noEmit            # passed
cargo check --manifest-path src-tauri/Cargo.toml  # passed
npm run build               # dist/app and dist/site created
npm run test:e2e            # 3 Chromium tests passed
```

The end-to-end suite creates a real vault, imports before/after ICS files, finds moved and deleted events, selects the deleted event, and downloads a restore file. It also runs axe on the landing and populated app states: **0 serious/critical violations**. The 390 px viewport has no horizontal overflow and the landing page produces no console errors.

Production-build Lighthouse mobile run (`lighthouse@12.8.2`, headless Chromium):

| Category / metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 92 |
| FCP | 0.9 s |
| LCP | 1.2 s |
| CLS | 0 |
| Total blocking time | 0 ms |

Payloads: landing JS 3.47 KB raw / 1.60 KB gzip; CSS 6.91 KB raw / 2.26 KB gzip; desktop UI JS 24.01 KB raw / 8.45 KB gzip; CSS 10.43 KB raw / 3.12 KB gzip. Hero variants are 12–136 KB; preferred mobile AVIF is 12 KB. No runtime CDN requests or font downloads.

## Known boundaries

- Scheduled snapshots run while Calendar Snapshotter is open; v0.1 does not install a background daemon or wake a sleeping computer.
- CalDAV servers vary in discovery/auth behavior. v0.1 accepts a direct collection URL or direct ICS URL; automatic principal/home-set discovery is not included.
- Parsing focuses on VEVENT recovery. Raw event/timezone components are preserved, but VTODO/VJOURNAL diffs are not shown.
- Static deployment is `npm run build:site` → `dist/site`. Native packages are intentionally produced only by GitHub Actions.

## Needs operator action

1. Register `calendar-ics-snapshots` in the Sociobot billing system at US$29 with return URL `https://calendar-ics-snapshots.sociobot.in/?license={token}`. No product ID is hard-coded.
2. Complete signing when certificates are available. Future secret names: `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`, `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, `WINDOWS_CERT_PFX`, and `WINDOWS_CERT_PASSWORD`. Add certificate import/signing steps to the workflow; packages are clearly marked unsigned until then.
3. Verify the first GitHub-hosted release assets. Homebrew/Scoop/winget are CLI channels and not part of this desktop-app release; DMG/MSI/EXE/AppImage/DEB/RPM are supplied.
