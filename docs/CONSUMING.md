# Building UI on the Rednoxx design system

A guide for developers implementing screens in this product. Read this before
you write your first component.

> The normative spec is [EHR-DESIGN-GUIDE.md](./EHR-DESIGN-GUIDE.md) and the
> `ehr-design` skill. This page is how you work day to day.

---

## The one rule

**Reuse, never fork.**

The design system is the product's UI vocabulary. Your screen should be
assembled from it, not re-drawn beside it. Two implementations of the same
thing is the defect — it's how this codebase ended up with two patient banners
and two sidebars that slowly drifted apart.

If you're writing markup that *looks like* something that already exists, stop
and go find it.

## The three layers

- **Primitives** (`frontend/src/components/ui/`) — buttons, fields, tables,
  modals, badges. The base vocabulary.
- **Blocks** (`frontend/src/components/blocks/`) — compositions like the patient
  banner, the top bar, the sidebar, the filter bar.
- **Screens** (`frontend/src/{demo,him}/pages/`) — assembled from blocks and
  primitives **only**.

Everything a screen renders should trace back to layer 1 or 2. A raw `<table>`,
`<input>`, `<aside>`, or a hand-styled pill inside a page is a bug.

## How to work

**1. Look before you build.** Open the live showcase at **`/design`** — every
component and block is there with working examples. Search
`components/ui` and `components/blocks`. Assume it exists; it usually does.

**2. It exists → import it and compose.** Import from the barrels
(`@/components/ui`, `@/components/blocks`). Done.

**3. It *almost* exists → add a prop to it.** Never copy a primitive into your
page to tweak it. Extend the original so every screen benefits and nothing
drifts. Keep the prop optional so existing callers render identically.

**4. It doesn't exist and more than one screen could want it → make it a block
first.** Create it in `components/blocks/`, export it from the barrel, *then*
consume it. Don't inline it in your page "for now" — that's how forks start.

**5. Keep shared things generic.** A shared block must never import a module's
data types. Pass data in through props. If a block needs to know about HIM's or
Care's data shapes, its API is wrong — that's precisely what forced the patient
banner to be duplicated.

**6. Both shells use the same block.** If only one module uses it, it isn't
shared yet.

## Non-negotiable standards

These are patient-safety and accessibility controls, not styling preferences.

- **Tokens only.** No raw hex. Use the theme classes defined in
  `frontend/src/index.css`. CI rejects raw colours in changed UI.
- **Every input sits in a `Field`.** It owns the label, hint, error text and the
  accessibility wiring. Never hand-roll a label.
- **Validation timing:** format on blur, completeness on submit — never on the
  first keystroke. Error copy says what's wrong *and* how to fix it.
- **Status is never colour alone.** Soft fill + readable word + accessible
  contrast. Map your domain statuses onto the existing badge rather than
  inventing pills.
- **Never remove focus rings.** Keyboard users need them; "cleaning up" the
  outline is a defect.
- **Destructive/high-risk actions** (merge, delete, sign-off, prescribe) always
  pair with a confirmation step that names the patient and uses an explicit
  verb. No optimistic UI for orders, meds, billing or sign-off.
- **Every patient screen opens with the patient banner** — it's the primary
  wrong-patient control.
- **Drawer = forms, Modal = decisions.** Creating or editing a record — every
  "New …" / "Create …" action, anything with multiple fields — opens a
  **drawer**, so the list behind stays visible. A **modal** is only for a
  decision the user must make before continuing: destructive confirms, identity
  verification, reason-gated governance actions. Litmus test: *am I filling
  something in, or answering a question?*
- **Every data view implements four states:** loading (a shape-matched skeleton,
  not a spinner), empty (with a next action), error (what failed + retry), and
  populated. Happy-path-only is incomplete.
- **Motion** respects `prefers-reduced-motion`, and exits are faster than
  entrances.

## Don't / Do

| Don't | Do |
|---|---|
| Put a create/edit form in a dialog | Open a drawer — dialogs are for decisions |
| Copy shared chrome into each module | Put it in one block both shells import |
| Hand-roll a sidebar, top bar or page header | Use the existing blocks |
| Inline a styled `<button>` for shared chrome | Add it to the block that owns that chrome |
| Import module data types inside a shared block | Take data via props |
| Re-implement a status pill with utility classes | Map your statuses onto the badge primitive |
| Hardcode a colour | Use a token |
| Strip a focus ring | Leave it alone |

## Before you open a PR

```bash
cd frontend
npm run type-check && npm run lint && npm run design-lint && npm test
```

Then check by hand: keyboard-only pass (everything reachable, focus visible),
the four states render, and nothing you built duplicates something that already
existed.

## Prompt to hand a developer (or paste into Claude / Cursor)

> You're implementing UI for the Rednoxx EHR (React 19 + TypeScript + Tailwind v4).
>
> 1. **Reuse, never fork.** Before writing any UI, look in `frontend/src/components/ui` (primitives) and `frontend/src/components/blocks` (compositions), and browse the `/design` showcase. Build screens from blocks; build blocks from primitives.
> 2. If something almost fits, **add a prop to the existing component** — never copy it into a page.
> 3. If a composition doesn't exist and more than one screen could use it, **create it in `components/blocks`, export it, then consume it.** Don't inline it.
> 4. **Shared blocks stay generic** — never import module data types into them; pass data via props.
> 5. **Tokens only** — no raw hex.
> 6. Every input sits in `Field`; every patient screen opens with the patient banner; status is never colour alone; destructive actions require confirmation; never remove focus rings.
> 6b. **Drawer = forms, Modal = decisions.** Every create/edit form opens in a drawer; dialogs are only for decisions the user must make before continuing.
> 7. Implement all four states for any data view: loading, empty, error, populated.
> 8. Follow `docs/design-system/EHR-DESIGN-GUIDE.md` and the `ehr-design` skill.
> 9. Verify with `npm run type-check && npm run lint && npm run design-lint`.
