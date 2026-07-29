#!/usr/bin/env bash
# Rednoxx design-system gate.
#
# Enforces the deterministic hard rules of the `ehr-design` skill on UI code
# that THIS branch/PR adds or changes — never pre-existing lines. Today it
# checks the flagship rule ("Tokens only — no raw hex in components"); add more
# rules in the RULES section below as they become mechanically checkable.
#
# Scope: only lines ADDED in the diff against the base ref, in
#        app/src/**/*.{tsx,jsx,css}. Legacy code never fails the build.
#
# Escape hatch: a genuine exception (third-party brand mark, <canvas> 2D
#        context, chart-library colour prop) is allowed — append the comment
#        `design-lint-ignore` to that line.
#
# Usage:
#   scripts/design-lint.sh [BASE_REF]      # BASE_REF defaults to origin/main
#   DESIGN_LINT_BASE=origin/develop scripts/design-lint.sh
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

RAW_BASE="${1:-${DESIGN_LINT_BASE:-origin/main}}"

# Resolve a concrete base commit to diff the working tree against.
if git rev-parse --verify --quiet "$RAW_BASE" >/dev/null; then
  BASE="$(git merge-base "$RAW_BASE" HEAD 2>/dev/null || echo "$RAW_BASE")"
else
  # No such ref (e.g. local checkout with no remote fetched) — fall back to
  # the previous commit so we still lint this branch's newest work.
  BASE="$(git rev-parse --verify --quiet HEAD~1 || true)"
fi

if [ -z "${BASE:-}" ]; then
  echo "design-lint: no base ref to diff against — skipping."
  exit 0
fi

# Build the set of ADDED lines to lint. Two sources, same diff format:
#   1. Tracked changes vs. BASE.
#   2. Each untracked UI file rendered as an all-added diff, so brand-new
#      (uncommitted) files are linted too — otherwise `make design-lint` /
#      `npm run design-lint` give a false pass on a just-written component.
#      No-op in CI, which checks a committed branch with no untracked files.
combined_diff="$(git diff --no-color --unified=0 "$BASE" -- 'app/src')"

while IFS= read -r file; do
  [ -n "$file" ] || continue
  combined_diff+=$'\n'"$(git diff --no-color --unified=0 --no-index /dev/null "$file" 2>/dev/null || true)"
done < <(git ls-files --others --exclude-standard -- 'app/src' 2>/dev/null | grep -Ei '\.(tsx|jsx|css)$' || true)

# Emit a violation line for every ADDED line that breaks a rule. --unified=0 so
# only changed lines appear; we track the new-file line number from each hunk
# header.
violations="$(
  printf '%s\n' "$combined_diff" \
  | awk '
      /^\+\+\+ /  { f = $2; sub(/^b\//, "", f); next }
      /^@@ /      { if (match($0, /\+[0-9]+/)) ln = substr($0, RSTART + 1, RLENGTH - 1) + 0; next }
      /^-/        { next }                     # removed line: new-file counter unchanged
      /^\+/ {
        line = substr($0, 2)
        if (f ~ /\.(tsx|jsx|css)$/ && line !~ /design-lint-ignore/) {
          # ── RULE: tokens only — no raw hex colour literals ──
          if (line ~ /#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})([^0-9a-fA-F]|$)/) {
            printf "  %s:%d  raw hex colour — use a design token\n      %s\n", f, ln, line
          }
        }
        ln++
        next
      }
  '
)"

if [ -n "$violations" ]; then
  echo "✗ Rednoxx design-system check failed — raw colours in new/changed UI:"
  echo
  echo "$violations"
  echo
  echo "Fix: replace the hex with a design token — a Tailwind token class, or an"
  echo "     @theme variable in app/src/index.css. See the ehr-design skill:"
  echo "     .claude/skills/ehr-design/references/design-tokens.md"
  echo
  echo "Genuine exception (3rd-party brand mark, <canvas> 2D context, chart-lib"
  echo "     colour prop)? Append  // design-lint-ignore  to the offending line."
  exit 1
fi

echo "✓ Rednoxx design-system check passed (no raw colours in changed UI)."
