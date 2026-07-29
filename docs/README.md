# Docs

| Path | What it is |
|---|---|
| [`EHR-DESIGN-GUIDE.md`](EHR-DESIGN-GUIDE.md) | **The normative spec.** UI/UX & front-end implementation guide for the Rednoxx EHR — standards baseline, tokens, type scale, module-level screen requirements, FHIR mappings, clinical safety patterns, WCAG 2.2 AA gates, usability protocol, Definition of Done |
| [`CONSUMING.md`](CONSUMING.md) | How product repos consume the design system |
| [`EHR-README.md`](EHR-README.md) | The Rednoxx EHR product repo's README (ported from Rednoxx-Limited/ehr) |
| [`SETUP.md`](SETUP.md) | EHR product setup guide |
| [`architecture-and-design.md`](architecture-and-design.md) | Product architecture & design overview |
| [`architecture/`](architecture/) | The 9-part enterprise architecture series + FHIR templates (location hierarchy, MPI, user structure) |
| [`runbooks/`](runbooks/) | Deploy, update, rollback, backup-restore runbooks |
| `HIM-*` / `REDNOXX_HIM_*` | HIM module knowledge: actor matrix, demo coverage, ERD, detailed SRS, user-story catalogue, workflow catalogue |
| [`assets/`](assets/) | Repo-level doc assets: `preview.png` (README banner / OG source) and the raw `empty-states/` illustration exports |
| [`archive/`](archive/) | Historical material kept for provenance |

The machine-enforced digest of the guide lives at
[`.claude/skills/ehr-design/`](../.claude/skills/ehr-design/SKILL.md), and
[`.claude/skills/spec-to-screen/`](../.claude/skills/spec-to-screen/SKILL.md)
converts the numbered screen specs under its `references/` into working
screens. A PostToolUse hook (`.claude/hooks/ehr-design-reminder.sh`) reminds
any Claude Code session of the standard on first UI edit, and
`scripts/design-lint.sh` is the mechanical token gate. When the guide changes,
change the skill in the same commit.
