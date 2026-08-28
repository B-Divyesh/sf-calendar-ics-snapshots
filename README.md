# Calendar Snapshotter

Calendar Snapshotter is a local-first desktop utility for people whose calendar is operational data. It records encrypted editions of ICS or CalDAV calendars, summarizes what was added, moved, or cancelled, and exports selected earlier events as a standards-compatible restore file.

Live site: <https://calendar-ics-snapshots.sociobot.in>

## What v0.1 does

- Creates an AES-256-GCM encrypted local vault from a user passphrase (PBKDF2-SHA-256, 310,000 iterations).
- Imports ordinary `.ics` exports without an account.
- Connects to direct ICS feeds or CalDAV calendar collection URLs through the Tauri Rust bridge.
- Records distinct versions, ignoring unchanged refreshes.
- Compares editions as added, moved, and cancelled events.
- Preserves recurring masters, `RECURRENCE-ID` overrides, TZIDs, and `VTIMEZONE` components.
- Exports only selected earlier event forms to an ICS restore file.
- Runs paid scheduled CalDAV checks while the desktop app is open.

The free app includes unlimited manual snapshots, diffs, and restore exports. A US$29 one-time Continuity license unlocks CalDAV scheduling through the Sociobot billing API. Accessibility, data export, and recovery are never paywalled.

## Install

Download the detected installer from the [landing page](https://calendar-ics-snapshots.sociobot.in), or use a checksum-verifying installer:

```sh
curl -fsSL https://calendar-ics-snapshots.sociobot.in/install.sh | sh
```

```powershell
irm https://calendar-ics-snapshots.sociobot.in/install.ps1 | iex
```

The v0.1 builds are unsigned. On macOS, right-click the app and choose **Open** on first launch. Windows may show a SmartScreen prompt. GitHub Releases also provides DMG, MSI/EXE, AppImage, DEB, and RPM assets plus `SHA256SUMS`.

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
```

The release workflow runs for `v*` tags and can be dispatched manually. It builds native packages on GitHub-hosted macOS, Windows, and Linux runners.

## Privacy and security model

Calendar content and CalDAV credentials are serialized into one encrypted IndexedDB envelope. The derived key lives only in memory while the vault is open. Calendar requests go directly from the desktop app to the URL the user supplies. The product has no analytics, tracking scripts, remote fonts, or event-content APIs. License verification sends only the entered license token to Sociobot.

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
