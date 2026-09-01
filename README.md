# Calendar Snapshotter

Calendar Snapshotter is a local-first desktop utility for people whose calendar is operational data. It keeps encrypted calendar copies, shows what changed, and exports selected earlier events as an ICS restore file.

Live site: <https://calendar-ics-snapshots.sociobot.in>

## What it does

- Keeps snapshots and saved calendar connection details in an encrypted local vault.
- Imports ordinary `.ics` exports without an account.
- Records a calendar copy from a direct ICS or CalDAV connection.
- Ignores an unchanged refresh instead of creating another edition.
- Compares editions as added, moved, and cancelled events.
- Preserves recurring overrides and timezone data in restore files.
- Exports selected earlier event forms as a standard ICS restore file.
- Adds scheduled CalDAV copies while the desktop app is open with the optional license.

Manual copies, change review, and restore exports are free. A US$29 one-time Continuity license adds scheduling. Accessibility and data export are never paywalled.

## Try the sample project

Use the desktop browser entry at `/?demo=1`, or choose **Try it with sample data** on the [landing page](https://calendar-ics-snapshots.sociobot.in). It opens [the browser demo](https://calendar-ics-snapshots.sociobot.in/demo/) directly in the separate IndexedDB database `demo:calendar-snapshotter`. The second edition moves a planning review and removes an airport train. The demo banner can reset its own data or return to the landing page without copying anything.

## Install

Download the detected installer from the [landing page](https://calendar-ics-snapshots.sociobot.in), or use a checksum-verifying installer:

```sh
curl -fsSL https://calendar-ics-snapshots.sociobot.in/install.sh | sh
```

```powershell
irm https://calendar-ics-snapshots.sociobot.in/install.ps1 | iex
```

Preview packages are unsigned. On macOS, right-click the app and choose **Open** on first launch. Windows may show a SmartScreen prompt. GitHub Releases provides DMG, MSI/EXE, AppImage, DEB, and RPM assets plus `SHA256SUMS`.

## Develop

Requirements: Node.js 22+, Rust stable, and the [Tauri 2 system prerequisites](https://v2.tauri.app/start/prerequisites/).

```sh
npm ci
npm run dev          # desktop UI in a browser
npm run dev:site     # landing site
npm run tauri dev    # native desktop shell
```

## Test and build

```sh
npm test             # parser, diff, restore, release-contract tests
npm run test:e2e     # Chromium recovery journey + axe accessibility checks
npm run check        # TypeScript and Rust checks
npm run build        # dist/app and dist/site
npm run build:site   # exact static deploy output: dist/site
./scripts/verify-url.sh http://127.0.0.1:4174/ # semantic smoke check with dev:site running
```

Every visitor-facing promise is listed in `.factory/claims.json`. Run the exact declared commands from that file, or run all browser claim coverage with `npm run test:e2e -- --grep @claim`.

The release workflow runs for `v*` tags and can be dispatched manually. It builds native packages on GitHub-hosted macOS, Windows, and Linux runners. Static deployment publishes `dist/site`; it includes CSP and security headers, cache policy for hashed assets, `robots.txt`, `sitemap.xml`, and a styled 404 through `staticwebapp.config.json`.

## Privacy and security model

Calendar content and saved calendar connection details are serialized into one encrypted IndexedDB envelope. Calendar requests go directly from the desktop app to the URL the user supplies. The product has no analytics, tracking scripts, remote fonts, or event-content APIs. License verification sends only the entered license token to Sociobot.

The passphrase cannot be recovered. Users should keep independent backups for critical records. See [Privacy](https://calendar-ics-snapshots.sociobot.in/privacy/) and [Terms](https://calendar-ics-snapshots.sociobot.in/terms/).

## Project map

- `src/` — desktop UI, encrypted vault, ICS parser/diff/export
- `src-tauri/` — Tauri 2 shell and native CalDAV transport
- `site/` — product, purchase, download, privacy, and terms pages
- `public/install.*` — checksum-verifying installers
- `.github/workflows/release.yml` — native release matrix and manifests
- `.factory/design.md` — visual system and asset provenance

## License

MIT © 2026 Sociobot (Param Factory).
