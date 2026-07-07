---
name: ehr-design
description: Authoritative UI/UX and front-end standard for the Rednoxx EMR/EHR/HIM platform (React 19 + TypeScript + Tailwind v4). Use whenever code is written, reviewed, or refactored for ANY Rednoxx UI — screens, components, blocks, forms, dashboards — across registration, appointments/queue, triage/vitals, consultation, orders/lab, pharmacy, billing/claims, records, referrals, reporting, admin. Trigger on mentions of Rednoxx, EMR/EHR/HIM UI, clinical forms, patient banners, design tokens, WCAG/accessibility for health screens, or clinical safety controls — even without the words "design system". Enforces tokens, type scale, WCAG 2.2 AA, FHIR mapping, and clinical-safety patterns.
---

# Building Rednoxx EHR UI

UI/UX here is a patient-safety control, not styling. **Golden rule:** if a
screen or component isn't covered by an explicit rule, default to the
strictest applicable pattern — more confirmation, more context, more
accessibility — never the fastest to build.

This file is the router; the detail lives in `references/` — read the file
that matches the work before building:

| Read | When you are… |
|---|---|
| [references/design-tokens.md](references/design-tokens.md) | choosing any colour, type style, spacing, shadow, radius, motion, or icon size |
| [references/components.md](references/components.md) | building/altering components, blocks, or forms |
| [references/workflows.md](references/workflows.md) | building a module screen (registration, triage, orders, billing, …) |
| [references/fhir-mapping.md](references/fhir-mapping.md) | wiring fields to data / API contracts |
| [references/clinical-safety.md](references/clinical-safety.md) | anything touching orders, meds, merge, sign-off, deletion, alerts |
| [references/accessibility.md](references/accessibility.md) | focus/keyboard/ARIA work, and before calling any screen done |
| [references/definition-of-done.md](references/definition-of-done.md) | finishing a feature — checklists, test thresholds, budgets |

The narrative version for humans is [docs/EHR-DESIGN-GUIDE.md](../../../docs/EHR-DESIGN-GUIDE.md).

## Workflow

1. **Before a screen:** read the module's section in workflows.md (+
   fhir-mapping.md if it persists data). Clinical screens start from the
   patient banner block.
2. **Compose, never fork.** Check `app/src/components/ui` and
   `components/blocks` first; extend primitives via props, build screens from
   blocks.
3. **Before merge:** run the DoD checklists and the WCAG gates; verify the
   flow in a running browser (`verify` skill) — a passing build is not
   verification.

## Hard rules (violations are defects)

- **Tokens only** — no raw hex in components; `@theme` in `app/src/index.css`
  is the source. `gold` is never text; `azure-300`-and-lighter never text.
- **Type scale is closed** — 10 styles only; updating numbers wear `.tnum`.
- **4px grid**; touch targets ≥40px; square corners (`rounded-full` only for
  pills/dots/toggles/avatars).
- **Every input sits in `Field`**; passwords use `PasswordInput`; long forms
  get a top error summary with anchor links.
- **Status is never colour-alone** — soft fill + AA text + word.
- **Focus recipe:** inputs `focus:border-azure focus:ring-4
  focus:ring-azure-50`; buttons `focus-visible:ring-2
  focus-visible:ring-azure/50`. Never suppressed.
- **Safety:** search-before-create; high-risk actions get the confirmation
  modal (explicit verb, patient context, audited); no optimistic UI for
  orders/prescriptions/billing/sign-off; interruptive alerts only for
  severity ≥ high.
- **Motion** off under `prefers-reduced-motion`; exits faster than entrances.
