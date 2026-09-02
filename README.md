# Calendar Snapshotter

Calendar Snapshotter is a desktop tool for people who rely on calendars and need a recoverable local history. It encrypts calendar copies, shows changes, and creates calendar restore files.

Live site: <https://calendar-ics-snapshots.sociobot.in>

## What it does

- Keeps calendar copies and saved calendar connection details in an encrypted local vault.
- Imports ordinary `.ics` exports without an account.
- Records a calendar copy from a direct file or calendar server connection (CalDAV).
- Ignores an unchanged refresh instead of creating another calendar copy.
- Compares calendar copies as added, moved, and cancelled events.
- Preserves recurring overrides and timezone data in restore files.
- Exports selected earlier events as a standard calendar restore file (.ics).
- Exports and imports the full encrypted archive for local backup or transfer.
- Supports scheduled calendar server copies for existing license holders while the app is open.

Manual copies, change review, archive backup, and restore files are available without a license. New scheduling licenses are not currently for sale.
Keyboard access, screen-reader structure, archive backup, and restore files do not require a license.

## Try the sample project

Use the desktop browser entry at `/?demo=1`. You can also choose **Try it with sample data** on the [landing page](https://calendar-ics-snapshots.sociobot.in).

The [browser demo](https://calendar-ics-snapshots.sociobot.in/demo/) uses separate browser storage named `demo:calendar-snapshotter`. The second calendar copy moves a planning review and removes an airport train. **Reset demo** restores the two shipped calendar copies without changing a real vault. **Leave demo** returns to the download page without copying sample data.

## Install

Download the detected desktop installer from the [landing page](https://calendar-ics-snapshots.sociobot.in). macOS and Linux also have a command-line installer that checks the download before installing:

```sh
curl -fsSL https://calendar-ics-snapshots.sociobot.in/install.sh | sh
```

Preview packages are unsigned. GitHub Releases provides DMG, MSI/EXE, AppImage, DEB, and RPM assets. Each release includes a SHA-256 file-check list (`SHA256SUMS`) and a source commit in `latest.json`.

## Develop

Requirements: Node.js 22+ and Rust stable. The setup command checks native prerequisites and installs the required Ubuntu or Debian packages when needed.

```sh
npm run setup:native # run before the first claim, test, or native build
npm ci
npm run dev          # desktop UI in a browser
npm run dev:site     # landing site
npm run tauri dev    # native desktop shell
```

## Test and build

```sh
npm test             # parser, diff, restore, release-contract tests
npm run test:claims  # every declared claim command, including native setup
npm run claim:native-caldav-transport # provisions native libraries, then tests the desktop transport
npm run test:e2e     # Chromium recovery journey + axe accessibility checks
npm run check        # TypeScript and Rust checks
npm run build        # dist/app and dist/site
npm run build:site   # exact static deploy output: dist/site
./scripts/verify-url.sh http://127.0.0.1:4174/ # semantic smoke check with dev:site running
```

Run the claim checks declared in `.factory/claims.json`. You can run all browser claim coverage with `npm run test:e2e -- --grep @claim`.

The release workflow runs for `v*` tags and supports manual dispatch. It builds native packages on GitHub-hosted macOS, Windows, and Linux runners.

Static deployment publishes the built site in `dist/site`. It includes security headers, asset caching, discovery files, and a styled 404.

## Privacy and security model

Calendar content and saved connection details are encrypted before local storage. Calendar requests go from the desktop app to the URL the user supplies. Use **Delete local archive** in the app to remove this vault.

The product has no analytics, tracking scripts, remote fonts, or calendar-content services. License verification sends only the entered license token to Sociobot.

The passphrase cannot be recovered. Users should keep independent backups for critical records. See [Privacy](https://calendar-ics-snapshots.sociobot.in/privacy/) and [Terms](https://calendar-ics-snapshots.sociobot.in/terms/).

## Project map

- `src/` — desktop UI, encrypted vault, calendar parser, comparison, and export
- `src-tauri/` — Tauri 2 shell and native calendar server transport
- `site/` — product, download, privacy, and terms pages
- `public/install.*` — installers that check downloads before installing
- `.github/workflows/release.yml` — native release matrix and manifests
- `.factory/design.md` — visual system and asset provenance

## License

MIT © 2026 Sociobot (Param Factory).
