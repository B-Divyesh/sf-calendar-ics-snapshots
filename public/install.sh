#!/bin/sh
set -eu

BASE="https://github.com/B-Divyesh/sf-calendar-ics-snapshots/releases/latest/download"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT INT TERM

fetch() {
  if command -v curl >/dev/null 2>&1; then curl -fsSL "$1" -o "$2"
  elif command -v wget >/dev/null 2>&1; then wget -q "$1" -O "$2"
  else echo "Calendar Snapshotter needs curl or wget." >&2; exit 1
  fi
}

fetch "$BASE/latest.json" "$WORK_DIR/latest.json"
OS="$(uname -s)"
case "$OS" in
  Darwin)
    if [ "$(uname -m)" = "arm64" ]; then PLATFORM="macos_arm64"; else PLATFORM="macos_x64"; fi
    ;;
  Linux) PLATFORM="linux" ;;
  *) echo "Unsupported system: $OS" >&2; exit 1 ;;
esac

LINE="$(tr -d '\n' < "$WORK_DIR/latest.json" | sed -n "s/.*\"$PLATFORM\":{\([^}]*\)}.*/\1/p")"
URL="$(printf '%s' "$LINE" | sed -n 's/.*"url":"\([^"]*\)".*/\1/p')"
SHA="$(printf '%s' "$LINE" | sed -n 's/.*"sha256":"\([^"]*\)".*/\1/p')"
NAME="${URL##*/}"
test -n "$URL" && test -n "$SHA" || { echo "Release manifest is missing $PLATFORM." >&2; exit 1; }
fetch "$URL" "$WORK_DIR/$NAME"

if command -v sha256sum >/dev/null 2>&1; then ACTUAL="$(sha256sum "$WORK_DIR/$NAME" | awk '{print $1}')"
else ACTUAL="$(shasum -a 256 "$WORK_DIR/$NAME" | awk '{print $1}')"
fi
test "$ACTUAL" = "$SHA" || { echo "Checksum verification failed; nothing was installed." >&2; exit 1; }

if [ "$PLATFORM" = "linux" ]; then
  DEST_DIR="${XDG_BIN_HOME:-$HOME/.local/bin}"
  mkdir -p "$DEST_DIR"
  cp "$WORK_DIR/$NAME" "$DEST_DIR/calendar-snapshotter"
  chmod 755 "$DEST_DIR/calendar-snapshotter"
  echo "Installed verified AppImage to $DEST_DIR/calendar-snapshotter"
  echo "Add $DEST_DIR to PATH if it is not already present."
else
  APP_DIR="$HOME/Applications"
  mkdir -p "$APP_DIR"
  MOUNT="$(hdiutil attach "$WORK_DIR/$NAME" -nobrowse | tail -1 | awk '{$1=$2=""; sub(/^  */,""); print}')"
  APP_PATH="$(find "$MOUNT" -maxdepth 1 -name '*.app' -print -quit)"
  test -n "$APP_PATH" || { hdiutil detach "$MOUNT" >/dev/null; echo "No app found in disk image." >&2; exit 1; }
  rm -rf "$APP_DIR/Calendar Snapshotter.app"
  cp -R "$APP_PATH" "$APP_DIR/"
  hdiutil detach "$MOUNT" >/dev/null
  echo "Installed verified app to $APP_DIR/Calendar Snapshotter.app"
  echo "This preview is unsigned: right-click the app and choose Open on first launch."
fi
