# Docs

| Path | What it is |
|---|---|
| [`EHR-DESIGN-GUIDE.md`](EHR-DESIGN-GUIDE.md) | **The normative spec.** UI/UX & front-end implementation guide for the Rednoxx EHR — standards baseline, tokens, type scale, module-level screen requirements, FHIR mappings, clinical safety patterns, WCAG 2.2 AA gates, usability protocol, Definition of Done |
| [`assets/`](assets/) | Repo-level doc assets: `preview.png` (README banner / OG source) and the raw `empty-states/` illustration exports (adapted copies ship from `app/public/empty/`) |
| [`archive/`](archive/) | Historical material kept for provenance: `rednoxx-ehr-design.skill` (imported skill archive, reconciled into `.claude/skills/ehr-design/` — see that folder for the living version) |

The machine-enforced digest of the guide lives at
[`.claude/skills/ehr-design/`](../.claude/skills/ehr-design/SKILL.md) — SKILL.md
routes into seven `references/` files (tokens, components, workflows,
fhir-mapping, clinical-safety, accessibility, definition-of-done). When the
guide changes, change the skill in the same commit.
