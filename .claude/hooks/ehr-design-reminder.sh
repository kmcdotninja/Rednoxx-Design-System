#!/usr/bin/env bash
# PostToolUse (Write|Edit) hook for the Rednoxx EHR repo.
#
# When a frontend UI file is written or edited, inject a one-time-per-session
# reminder to follow the `ehr-design` skill — the authoritative design-system
# standard. This keeps the design system in front of the model every time UI
# work starts, so components are composed from the system rather than forked.
#
# Fires at most once per session (keyed by session_id) to avoid noise; the
# reminder is a nudge, not a gate. The blocking gate is scripts/design-lint.sh.
set -euo pipefail

input="$(cat)"
file="$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_response.filePath // empty' 2>/dev/null || true)"

# Only frontend UI files — the visual surface the design system governs.
case "$file" in
  *app/src/*.tsx | *app/src/*.jsx | *app/src/*.css | *frontend/src/*.tsx | *frontend/src/*.jsx | *frontend/src/*.css) ;;
  *) exit 0 ;;
esac

sid="$(printf '%s' "$input" | jq -r '.session_id // "nosession"' 2>/dev/null || echo nosession)"
flag="${TMPDIR:-/tmp}/ehr-design-reminder-${sid}.flag"
[ -f "$flag" ] && exit 0
: > "$flag"

read -r -d '' ctx <<'TXT' || true
You are editing Rednoxx frontend UI — the ehr-design skill is the authoritative standard here. Apply it before finishing:
- Compose, never fork — reuse app/src/components/ui and components/blocks; extend primitives via props instead of building one-offs.
- Tokens only — no raw hex; use @theme vars in app/src/index.css / Tailwind token classes.
- Closed 10-style type scale; 4px grid; touch targets >=40px; square corners (rounded-full only for pills/dots/toggles/avatars).
- Every input sits in Field; status is never colour-alone (soft fill + AA text + word); focus recipes are never suppressed; WCAG 2.2 AA.
- Clinical safety: search-before-create; confirmation modal for high-risk actions; no optimistic UI for orders/meds/billing/sign-off.
Read the matching file under .claude/skills/ehr-design/references/ before building, and run scripts/design-lint.sh + the DoD checks before merge.
TXT

jq -n --arg c "$ctx" '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: $c}}'
