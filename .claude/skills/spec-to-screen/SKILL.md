---
name: spec-to-screen
description: Converts a Rednoxx screen specification (the CPA-S** / stream spec markdown files bundled under this skill's `references/`, e.g. `references/platform-iam/`) into a working React + TypeScript screen. Use whenever the task is to "convert", "implement", "build the UI for", or "scaffold" a numbered screen spec against mocked APIs. Pairs with the ehr-design skill (which owns tokens, components and clinical-safety) — this skill owns the spec→file mapping, the mocked-data/feature layout, RBAC/state/audit wiring, and the conversion checklist. Trigger on mentions of screen IDs (CPA-S01, WF-CPA-*), "UI conversion", spec folders, or "implement the screens".
---

# Converting a screen spec into a Rednoxx screen

A screen spec (e.g. [references/platform-iam/CPA-S01-login-mfa.md](references/platform-iam/CPA-S01-login-mfa.md))
is a **contract**, not a design. It says *what* the screen must do; the *how*
is fixed by the `ehr-design` skill. Your job is a faithful, accessible,
mocked-API implementation — never invent behaviour the spec doesn't state,
never skip a state the spec lists.

**Read [ehr-design](../ehr-design/SKILL.md) first** — it is authoritative for
every colour, type style, component, block, safety pattern and DoD gate. This
skill only covers the conversion mechanics.

The specs this skill converts live in `references/`, one folder per stream:

| Reference | Contains |
|---|---|
| [references/platform-iam/](references/platform-iam/README.md) | Stream A — Platform Identity & Access: the 15 CPA-S** admin/auth/RBAC/audit screen specs (`/admin` route prefix) |

> **Scope is UI-only.** Build against mocked/stubbed APIs and fixtures.
> Backend, real auth and server-side security are out of scope. The
> `API needs` / `Audit` / `FHIR` / `business rules` sections are contracts the
> UI honours (shapes, gating, confirmations), not things you implement on a
> server.

## 1. Read the spec in this order

| Spec section | Drives |
|---|---|
| **Route** | the TanStack route path(s) you register |
| **Primary roles** + **Actions & RBAC** | which controls render / are gated / need re-auth |
| **Layout** | the page skeleton (shell vs full-page, regions, columns) |
| **Components & fields** | which `components/ui` + `components/blocks` you compose, field validation |
| **States** | the explicit loading / empty / error / no-results / permission / conflict states you MUST render |
| **Validations & business rules** | inline validation, SoD/duplicate/lifecycle blocks, confirmation gating |
| **API needs** | the mocked async functions + their request/response shapes |
| **Audit events** | the toast/confirmation surface after each mutation |
| **Acceptance criteria** | your definition-of-done for the screen |

If a rule is ambiguous, default to the **stricter** ehr-design pattern (more
confirmation, more context, more accessibility).

## 2. Feature layout

One feature folder per stream, mirroring the spec folder name:

```
app/src/features/<stream>/         e.g. platform-iam/
  types.ts        // domain types shared by the stream
  data.ts         // in-memory fixtures (realistic Nigerian facility data)
  api.ts          // mocked async fns matching each spec's "API needs" shapes
  <Shell>.tsx     // grouped nav + top bar for the module's /route prefix
  screens/
    <ScreenName>.tsx   // one file per spec screen, named for the screen
  index.ts        // route factory consumed by app/router.ts (keep the tree lean)
```

Rules:

- **Mock, don't fetch.** `api.ts` exports `async` functions that resolve
  fixtures after a small delay and can be told to fail — so loading and error
  states are demonstrable. Match the response *shape* in the spec's API needs.
- **Fixtures are realistic**: Nigerian names, facility names, `.tnum`
  identifiers, plausible timestamps — never `foo`/`bar`.
- **Route wiring** is lazy (`lazyRouteComponent`) and added to the tree in
  `app/router.ts`; full-page auth screens sit at the root, admin/module
  screens sit under their shell layout route.

## 3. Mapping spec → UI (defaults)

- **Route prefix screen (list/dashboard):** module shell (left nav grouped as
  the spec's nav groups + top bar with scope selector, search, user menu) →
  page header → `FilterBar` + `Tabs` for status buckets → `DataTable` with the
  spec's columns → row → detail route. Wire loading (`Skeleton`), empty
  (`EmptyState`), no-results and error+retry.
- **Full-page auth (login / activate / reset):** centered card on brand panel,
  outside the shell. `PasswordInput` for every password; `CodeInput` for OTP;
  strength meter + requirements checklist on password-set steps; neutral,
  non-enumerating error copy.
- **Wizard (create/invite, activation):** `Stepper`; validate the current step
  before advancing; backward nav never loses data; duplicate/SoD checks are
  **blocking review steps**, not toasts.
- **Detail/profile:** header with status chip + quick actions → `Tabs` for
  sub-sections; cross-links to related screens are real routes.
- **High-risk action (lock, revoke, rotate credential, break-glass, export):**
  the confirmation modal — explicit verb, subject context, mandatory reason
  where the spec says so, re-auth affordance, `danger` button — then a success
  toast standing in for the audit event. Never optimistic.

## 4. Non-negotiables carried from the spec

- **RBAC:** model the caller's permissions as a prop/context flag; controls the
  caller lacks are hidden or rendered read-only exactly as the spec's
  Actions/States table says (e.g. "Read-only (insufficient permission)").
- **Scope:** scoped lists only show in-scope fixtures; the scope selector
  re-filters. Never show data outside scope.
- **Every listed State is rendered** and reachable in the mock (add a way to
  trigger empty/error/conflict, e.g. a fixture flag or query param).
- **Audit = feedback:** every mutation the spec audits ends in a `useToast`
  confirmation (or a persisted status change) so the action is visibly
  recorded.
- **Lifecycle & SoD:** status chips mirror the spec's state machine
  (draft→…→active); author≠approver and duplicate/SoD conflicts *block* with an
  explanation, never a silent pass.

## 5. Conversion checklist (per screen — the DoD)

1. Route(s) registered and reachable; title set.
2. Every **Components & fields** row present, each input inside `Field`,
   validation copy = what's wrong + how to fix.
3. Every **State** rendered (loading skeleton, empty+action, error+retry,
   no-results, plus the screen-specific conflict/permission/lifecycle states).
4. Every **Action** RBAC-gated; high-risk actions use the confirmation +
   re-auth pattern; danger buttons never appear without it.
5. Every audited mutation confirms via toast / visible status change.
6. Tokens only, closed type scale, 4px grid, square corners, WCAG 2.2 AA
   (keyboard, focus ring, ARIA, `aria-live` for async) — per ehr-design.
7. All **Acceptance criteria** demonstrably pass against the mock.
8. `tsc` and lint clean; no raw hex, no forked primitives.

Then run the ehr-design DoD gates
([definition-of-done.md](../ehr-design/references/definition-of-done.md)).
