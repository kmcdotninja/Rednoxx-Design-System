---
name: ehr-design
description: Rednoxx EHR/EMR design-system and clinical-safety rules. Use when building or modifying ANY user interface in this repo or the Rednoxx EHR product — screens, components, blocks, forms, dashboards — or when reviewing UI code. Enforces tokens, type scale, WCAG 2.2 AA, FHIR field mapping, and clinical safety patterns.
---

# Building Rednoxx EHR UI

The full normative spec is [docs/EHR-DESIGN-GUIDE.md](../../../docs/EHR-DESIGN-GUIDE.md).
Read the section you need before building; this file is the operational digest.

## Before building a screen

1. Read the module's requirements in guide **§14** (screens, safety controls,
   FHIR mappings) and the forms rules in **§12** if the screen has inputs.
2. Check the showcase (`app/src/components/ui`, `app/src/components/blocks`)
   for an existing primitive or block — **never rebuild or fork one**. Compose.
3. Clinical screen? It MUST start from the patient banner block (§11.1).

## Hard rules (violations are defects)

- **Tokens only.** No raw hex in components — Tailwind utilities backed by the
  `@theme` block in `app/src/index.css`. Ink = `navy`/`forest` family, accent =
  `azure`, status pairs = `mint(-soft)`, `gold(-soft)/gold-600`,
  `rose-ink/rose-soft`. `gold` is never text; `azure-300` and lighter are
  never text.
- **Type scale is closed** — the 10 styles in §5 only. Negative tracking ≥15px;
  uppercase overlines ≤12px. Updating numbers wear `.tnum`.
- **4px grid** for all spacing. Touch targets ≥40px (`h-10`).
- **Square corners** everywhere; `rounded-full` only for pills/dots/toggles/avatars.
- **Every input sits in `Field`** (label, hint, error). Passwords use
  `PasswordInput`. `invalid` + `Field error` for validation; errors say what's
  wrong and how to fix it. Long forms get a top error summary with anchors.
- **Status never colour-alone** — soft fill + AA text + word (StatusPill).
- **Focus recipe:** inputs `focus:border-azure focus:ring-4 focus:ring-azure-50`;
  buttons `focus-visible:ring-2 focus-visible:ring-azure/50`. Never suppressed.
- **Motion:** `animate-rise` for entrances, `animate-pop` for overlays; exits
  faster than entrances; everything off under `prefers-reduced-motion`.
- **Icons:** lucide only, sized 13–18px per §8, `aria-label` or visible text.

## Clinical safety (guide §13 — non-negotiable)

- Search before create; duplicate-patient warning is a blocking review.
- High-risk actions (merge, void, delete, sign-off, high-alert meds) get a
  Modal restating patient context + explicit affirmative verb — never a
  default-focused OK.
- Interruptive alerts only for severity ≥ high; everything else inline.
- Critical results require acknowledgement; audit events for create/update/
  merge/void/sign/dispense/bill/export.
- Optimistic UI never for orders, prescriptions, billing, or sign-off.
- Autosave clinical text with a visible saved/sync indicator.

## Data

Every persisted field maps to FHIR R4 per Nigeria Core IG — mappings per
module in guide §14 (Patient, Encounter, Observation, ServiceRequest,
MedicationRequest, Claim, …). Units rendered by the UI, never typed.

## Before merging

Run the Definition of Done (guide §19) and the WCAG 2.2 AA gates (§16):
axe-clean, manual keyboard pass, focus never obscured, 320px/400% zoom holds,
all loading/empty/error/sync states present. Verify the flow in a real
browser (see the `verify` skill) — build passing is not verification.
