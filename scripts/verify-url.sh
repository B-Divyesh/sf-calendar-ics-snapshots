#!/usr/bin/env bash
set -euo pipefail

url=${1:?"Usage: scripts/verify-url.sh <url>"}
html=$(curl --fail --silent --show-error "$url")

printf '%s' "$html" | rg -q '<html[^>]+lang='
printf '%s' "$html" | rg -q '<title>[^<]+</title>'
printf '%s' "$html" | rg -q '<main[^>]+id=.*main'

if printf '%s' "$html" | rg -q '<img(?![^>]*\balt=)' --pcre2; then
  echo "An image is missing alt text: $url" >&2
  exit 1
fi

echo "verified title, lang, main landmark, and image alt attributes: $url"
