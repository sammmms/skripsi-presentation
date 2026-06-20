#!/usr/bin/env bash
# Render scripts/og-image.html -> public/og-image.png (1200×630) via headless Chrome.
# Usage: npm run og   (or: bash scripts/gen-og.sh)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/scripts/og-image.html"
OUT="$ROOT/public/og-image.png"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || CHROME="$(command -v google-chrome || command -v chromium || true)"
[ -n "$CHROME" ] || { echo "Chrome/Chromium not found"; exit 1; }

# Isolated profile dir so we never touch the user's real Chrome session.
PROFILE="$(mktemp -d)"
trap 'rm -rf "$PROFILE"' EXIT

"$CHROME" \
  --headless \
  --user-data-dir="$PROFILE" \
  --no-first-run --no-default-browser-check \
  --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=1200,630 \
  --screenshot="$OUT" \
  --default-background-color=FF0a0e1a \
  "file://$SRC" >/dev/null 2>&1

echo "Wrote $OUT"
