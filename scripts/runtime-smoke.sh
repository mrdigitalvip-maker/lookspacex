#!/usr/bin/env bash
set -euo pipefail

npm run preview -- --host 127.0.0.1 --port 4173 > /tmp/lookspace-preview.log 2>&1 &
PREVIEW_PID=$!
trap 'kill "$PREVIEW_PID" 2>/dev/null || true' EXIT

for attempt in {1..20}; do
  if curl --fail --silent http://127.0.0.1:4173/ > /dev/null; then
    break
  fi
  sleep 0.5
done

CHROME_BIN="$(command -v google-chrome || command -v google-chrome-stable || command -v chromium || command -v chromium-browser || true)"
if [[ -z "$CHROME_BIN" ]]; then
  echo "Chrome/Chromium not available on runner"
  exit 1
fi

DOM="$($CHROME_BIN --headless=new --no-sandbox --disable-gpu --virtual-time-budget=6500 --dump-dom http://127.0.0.1:4173/ 2>/tmp/lookspace-chrome.log)"

if ! grep -q "PILOT ACCESS // HELIOS STARBASE" <<< "$DOM" || ! grep -q "Board ship" <<< "$DOM"; then
  echo "LookSpace runtime smoke test failed: entry screen was not rendered."
  echo "--- preview log ---"
  cat /tmp/lookspace-preview.log || true
  echo "--- chrome log ---"
  cat /tmp/lookspace-chrome.log || true
  echo "--- DOM ---"
  echo "$DOM"
  exit 1
fi

echo "LookSpace browser runtime smoke test passed."
