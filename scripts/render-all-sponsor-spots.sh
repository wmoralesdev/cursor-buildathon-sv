#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENTRY="src/remotion/sponsor-spot-index.ts"
OUT_DIR="out/sponsor-spots"

mkdir -p "$OUT_DIR"

COMPOSITION_IDS=()
while IFS= read -r id; do
  COMPOSITION_IDS+=("$id")
done < <(
  pnpm exec remotion compositions "$ENTRY" 2>/dev/null | awk '/^sponsor-spot-/ { print $1 }'
)

if [ "${#COMPOSITION_IDS[@]}" -eq 0 ]; then
  echo "No sponsor-spot compositions found in $ENTRY" >&2
  exit 1
fi

echo "Rendering ${#COMPOSITION_IDS[@]} sponsor spots to $OUT_DIR/"

for id in "${COMPOSITION_IDS[@]}"; do
  echo ""
  echo "==> $id"
  pnpm exec remotion render "$ENTRY" "$id" "$OUT_DIR/$id.mp4"
done

echo ""
echo "Done. Wrote ${#COMPOSITION_IDS[@]} files to $OUT_DIR/"
