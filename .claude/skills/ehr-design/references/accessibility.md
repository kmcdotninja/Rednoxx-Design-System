# Accessibility — WCAG 2.2 AA gates & interaction states

Target: **WCAG 2.2 AA** on every module. These are release gates, tested with
axe-core (automated) plus a manual keyboard pass per screen.

## Focus & interaction spec

- **Inputs/selects/textareas:** `focus:border-azure focus:ring-4 focus:ring-azure-50`
- **Buttons/links:** `focus-visible:ring-2 focus-visible:ring-azure/50` (offset where needed)
- Focus is never suppressed, never `outline: none` without a replacement.
- Modals trap focus (use `Modal` — don't rebuild), Escape closes the top
  layer only (`layerStack`), and focus returns to the trigger on close.
- Disabled: `disabled:bg-panel disabled:text-forest-300` — value readable at
  AA; disabled buttons stay in the accessibility tree.
- Hover changes fill/border (`hover:bg-panel`, `hover:border-navy-200`),
  never text colour alone.

## Release gates

| # | Criterion (WCAG ref) | Test |
|---|---|---|
| A1 | All interactive elements keyboard-reachable/operable; focus order = visual order (2.1.1, 2.4.3) | manual Tab pass |
| A2 | Focus visible and never obscured by sticky headers/sidebars/modals (2.4.7, 2.4.11) | manual |
| A3 | Every input labelled via `Field`; errors specific, adjacent, summarised with anchors on long forms (3.3.1–3.3.3) | axe + manual |
| A4 | Text & essential icons ≥4.5:1 (3:1 large); status never colour-alone (1.4.1, 1.4.3) | token table + axe |
| A5 | Targets ≥24px minimum, ≥40px standard (2.5.8) | design review |
| A6 | No keyboard trap except modal trap with Escape (2.1.2) | manual |
| A7 | No drag-only interactions (2.5.7); no loss at 320px width / 400% zoom (1.4.4, 1.4.10) | manual |
| A8 | Accessible authentication (3.3.8): paste allowed, `autocomplete="one-time-code"` on OTP, show-password toggle present | manual |
| A9 | Skip link to main content in every shell (2.4.1) | manual |
| A10 | Toasts `aria-live="polite"`; blocking errors `role="alert"` (4.1.3) | code review |
| A11 | All animation disabled under `prefers-reduced-motion` (2.3.3) | automated |
| A12 | Tables have header associations; every chart has a text/table equivalent (1.1.1, 1.3.1) | manual |

## Manual keyboard pass script (per screen)

1. Tab from the top: every control reached in visual order, ring visible.
2. Operate each control with keyboard only (Enter/Space/arrows per role).
3. Open every overlay: focus moves in, Escape closes, focus returns.
4. Trigger a validation error: `role="alert"` announced, focus moved to the
   summary/first error on long forms.
5. Zoom 400% at 1280px: nothing lost, no horizontal page scroll (wide tables
   scroll inside their own container).
6. Toggle `prefers-reduced-motion`: no animation plays.

## Content & ARIA rules

- One `h1` per page (Page-title style); heading levels never skip.
- `aria-label` on icon-only buttons; `aria-hidden` on decorative icons.
- Placeholders are examples, never labels.
- Status/queue chips: colour + text word, always.
- Language plain and clinical-vocabulary-accurate; error copy states what is
  wrong and how to fix it.
