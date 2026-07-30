# Design tokens — complete reference

Tokens are CSS custom properties in the `@theme static` block of
`app/src/index.css` (Tailwind v4, CSS-first — there is no
`tailwind.config.js`). `static` matters: without it Tailwind emits only the
variables a utility happens to reference, and the design system's own Tokens
tables — which read the live stylesheet — under-report the scale. Components MUST
reference tokens through Tailwind utilities; raw hex in component code is a
defect.

Six families own a scale and are browsable at
`/design/foundations/<slug>` → Tokens: colour, type, spacing, shape, elevation
and icon sizing. Brand, layout, motion and focus are rules for applying those
scales — they carry no Tokens table. **If a value is missing from the scale, add it to the theme file
first (and document it here), then use it — never invent it inline.** Legacy
aliases (`forest`→`navy`, `lime`→`azure`, `teal`→`mint`, `orange`→`gold`)
exist so older primitives keep working — new code may use either name; values
are identical.

## 1. Ink ramp (`navy`, alias `forest`) — 10 steps

| Token | Hex | Contrast on white | Grade | Role |
|---|---|---|---|---|
| `navy-50` | `#f4f4f6` | 1.1:1 | — | faint fills |
| `navy-100` | `#e9e9ee` | 1.2:1 | — | skeleton bones, quiet fills |
| `navy-200` | `#d4d4dd` | 1.5:1 | — | strong hairlines, disabled icons |
| `navy-300` | `#70707f` | 4.9:1 | AA | muted text, placeholders, resting icons |
| `navy-400` | `#515160` | 7.8:1 | AAA | secondary text |
| `navy-500` | `#3e3e4c` | 10.5:1 | AAA | strong secondary text |
| `navy-600` | `#2a2a38` | 14.1:1 | AAA | dark-surface hover |
| `navy` | `#171723` | 17.7:1 | AAA | primary ink, solid buttons, dark panels |
| `navy-800` | `#12121c` | 18.6:1 | AAA | dark surface alt |
| `navy-900` | `#0a0a11` | 19.7:1 | AAA | deepest surface |

Text colour floor: readable text is never lighter than `navy-300`.

## 2. Accent ramp (`azure`, alias `lime`) — brand violet #5833FB

| Token | Hex | Contrast | Grade | Role |
|---|---|---|---|---|
| `azure-50` | `#f3f1ff` | 1.1:1 | — | focus ring, selected fills |
| `azure-100` | `#e9e4ff` | 1.2:1 | — | selection highlight (`::selection`) |
| `azure-200` | `#d4cbfe` | 1.5:1 | — | chart fills |
| `azure-300` | `#ab97fd` | 2.4:1 | — | decorative only — **never text** |
| `azure` | `#5833fb` | 6.4:1 | AA | primary actions, links, active nav, focus, data series |
| `azure-500` | `#4a28e0` | 7.9:1 | AAA | hover/pressed on primary |
| `azure-600` | `#3c1ec2` | 9.7:1 | AAA | accent text on tinted fills |

## 3. Status pairs — always fill + AA text + visible word

| Token | Hex | Contrast | Rule |
|---|---|---|---|
| `mint` | `#15803d` | 5.0:1 white / 4.6:1 on soft | success text & icons |
| `mint-soft` | `#dcfce7` | — | success fill |
| `gold` | `#e0a526` | 2.2:1 | **fills/bars only — never text** |
| `gold-600` | `#9a6b0f` | 4.7:1 white / 4.0:1 on soft | warning text |
| `gold-soft` | `#fbecc9` | — | warning fill |
| `rose-ink` | `#b91c1c` | 6.5:1 white / 5.3:1 on soft | danger text, destructive actions |
| `rose-soft` | `#fee2e2` | — | danger fill |

Clinical semantics: critical/abnormal-high → danger pair; borderline/pending
→ warning pair; normal/complete → success pair; informational → accent pair.

## 4. Neutral surfaces

| Token | Hex | Role |
|---|---|---|
| `white` | `#ffffff` | cards, inputs, popovers, sidebar |
| `canvas` | `#fcfcfc` | app background |
| `panel` | `#f4f4f5` | hovers, table headers, skeletons, wells |
| `hair` | `#e4e4e7` | the ONLY border colour |

## 5. Shadows (exact values — never invent new ones)

```css
--shadow-chip:       0 0 0 1px rgb(0 0 0 / 0.05), 0 1px 2px rgb(0 0 0 / 0.04);
--shadow-card:       0 1px 2px -1px rgb(0 0 0 / 0.03), 0 6px 16px -8px rgb(0 0 0 / 0.05);
--shadow-card-hover: 0 2px 6px -3px rgb(0 0 0 / 0.04), 0 12px 28px -10px rgb(0 0 0 / 0.07);
--shadow-soft:       0 1px 2px rgb(0 0 0 / 0.04), 0 4px 16px -4px rgb(0 0 0 / 0.07);
--shadow-pop:        0 0 0 1px rgb(0 0 0 / 0.04), 0 8px 28px -8px rgb(0 0 0 / 0.16);
```

Elevation model: level 0 = hairline border, no shadow (the default). `chip` →
small controls; `card` → resting cards; `card-hover` → lifted; `soft` → quiet
chrome; `pop` → popovers/modals. Pure black, low alpha; shadows never tint.

## 6. Shape — one token

There is ONE structural radius: `--radius`, **0px**. Buttons, inputs, cards,
tiles, popovers, modals, drawers: square. `rounded-full` is the only exception —
pills, dots, toggles, avatars — so status/identity read from silhouette.

`--radius-sm` … `--radius-5xl` are **aliases** of `--radius` (`var(--radius)`),
not eight separate decisions: components wore the t-shirt sizes before the
square-corner reskin, and aliasing flipped ~870 usages across 157 files at once.
Consequences:

- Never hard-code a radius, and never pick a size for meaning — `rounded-2xl`
  and `rounded-4xl` are the same shape. New code MAY use any of them; prefer
  `rounded-none` when writing fresh markup, since it states the intent.
- Going rounded later is a one-line change to `--radius`; do not "fix" a corner
  on one component.

## 7. Type scale — closed set of 10 styles

Geist everywhere; Geist Mono for code/tokens/MRNs/identifiers. Global font
features: `cv11`, `ss01`. Updating numbers (vitals, money, timers, tables)
wear `.tnum`.

Each role is ONE token carrying size, line-height, weight and tracking, so one
utility is the whole style — `text-secondary`, not
`text-[13px] leading-relaxed`. Use the utility in new code.

| Style | Utility | Token | Size | Line | Weight | Tracking | Use |
|---|---|---|---|---|---|---|---|
| Display | `text-display` | `--text-display` | 32 | 1.15 | 500 | −0.02em | hero — one per flow |
| Page title | `text-page-title` | `--text-page-title` | 26 | 1.2 | 500 | −0.02em | the h1 — one per page |
| Title | `text-title` | `--text-title` | 19 | 1.35 | 500 | −0.01em | card/dialog/auth headings |
| Section | `text-section` | `--text-section` | 17 | 1.4 | 500 | −0.01em | grouped content |
| Heading | `text-heading` | `--text-heading` | 15 | 1.45 | 500 | −0.01em | list titles, panel headers |
| Body | `text-body` | `--text-body` | 14 | 1.6 | 400 | 0 | default reading |
| Secondary | `text-secondary` | `--text-secondary` | 13 | 1.55 | 400 | 0 | dense-UI workhorse |
| Caption | `text-caption` | `--text-caption` | 12 | 1.5 | 400 | 0 | supporting labels |
| Overline | `text-overline uppercase` | `--text-overline` | 11 | 1.4 | 500 | +0.08em | eyebrows, table headers |
| Micro | `text-micro` | `--text-micro` | 10 | 1.3 | 500 | +0.02em | chips, ticks — never prose |

Overline is the one role needing a second class: `uppercase` is a
text-transform, which a font-size token cannot carry. Sizes are declared in rem
(13px = 0.8125rem) so the scale still answers the browser's font-size setting.
Any part of a role may still be overridden per instance — `font-medium`,
`leading-tight` and `tracking-normal` all win over the token, because Tailwind
compiles the modifiers behind `--tw-font-weight` / `--tw-leading` /
`--tw-tracking`.

Rules: negative tracking only ≥15px; uppercase+wide tracking only ≤12px;
headings `text-wrap: balance`, paragraphs `text-wrap: pretty` (global). Body
colour `navy`; secondary `navy-400`; muted `navy-300`.

**Migration status:** ~1,340 arbitrary type values (`text-[13px]` &c.) predate
these tokens and still compile to identical CSS, so they are not defects to fix
on sight — but do not add more. New and rewritten code uses the utilities.

## 8. Spacing — 4px grid

`--spacing: 0.25rem` is the base every numeric step derives from, so `p-3` is
`calc(4px × 3)`. Change the base and the whole product re-spaces.

| Step | px | Use |
|---|---|---|
| 1 | 4 | icon–text gaps, chip padding |
| 1.5 | 6 | tight inline gaps |
| 2 | 8 | chip gaps, small controls |
| 2.5 | 10 | dense list row padding |
| 3 | 12 | card-grid gaps, toolbars |
| 4 | 16 | control padding, form gaps |
| 5 | 20 | card padding (compact) |
| 6 | 24 | card padding (default) |
| 8 | 32 | between content groups |
| 10 | 40 | desktop page padding |
| 12 | 48 | between page sections |

If a layout needs 14px, the layout is wrong.

The measures that recur on every page are named, so they are stated rather than
remembered. Existing screens still spell them as raw steps (`px-5`, `gap-4`) and
compile identically — prefer the named form in new code:

| Token | Utility | px | Use |
|---|---|---|---|
| `--spacing-page` | `px-page` | 20 | page inset, mobile |
| `--spacing-page-lg` | `sm:px-page-lg` | 32 | page inset, tablet up |
| `--spacing-section` | `space-y-section` | 48 | rhythm between page sections |
| `--spacing-card` | `p-card` | 24 | card padding, default |
| `--spacing-card-sm` | `p-card-sm` | 20 | card padding, compact |
| `--spacing-gutter` | `gap-gutter` | 16 | standard grid and form gap |
| `--spacing-gutter-dense` | `gap-gutter-dense` | 12 | dense index grids, toolbars |

## 9. Layout measurements

| Measure | Token | Value |
|---|---|---|
| Sidebar | `--spacing-sidebar` | 240px (`w-sidebar`), fixed; overlay menu below `lg` |
| Content max-width | `--container-measure` | 896px (`max-w-measure`) reading; data tables may go full-width |
| Control height | `--spacing-control` | 40px (`h-control`) — also the hit-target floor |
| Clinical touch target | `--spacing-touch` | 44px (`h-touch`) on tablet-facing screens |
| Page padding | `--spacing-page` / `-lg` | `px-page` → `sm:px-page-lg` |
| Section rhythm | `--spacing-section` | `space-y-section` (48px) |

## 9a. Touch targets

- **24×24 CSS px** is the absolute floor (WCAG 2.2 SC 2.5.8) for any
  interactive target that isn't inline text.
- **40px (`h-10`)** is the standard control height; `size="sm"` only inside
  rows that are themselves clickable.
- **44×44px** on tablet-facing clinical screens (triage, bedside, pharmacy
  counter) — facility devices are used standing up, often gloved.
- Small icon buttons in dense rows reach the minimum with invisible padding —
  pad the hit area, don't inflate the glyph.

## 9b. Density modes

Clinical tables (vitals, medication rows, order baskets, results) support a
`data-density` attribute on the table wrapper:

- `comfortable` (default): row height ≥44px, `py-3`.
- `compact` (opt-in for power users scanning long lists): row height ≥36px,
  `py-2` — but no interactive control inside the row may drop below the
  24×24px floor.

## 10. Motion tokens

Durations and curves are tokens (`--duration-*`, `--ease-*`); the `.animate-*`
classes read them, so a curve is retuned in one place. `--ease-*` also gives
`ease-rise`-style utilities for CSS transitions.

| Name | Duration token | Ease token | Use |
|---|---|---|---|
| `animate-rise` | `--duration-rise` 400ms | `--ease-rise` | page/card entrances — `backwards` fill (never `both`: it traps popovers in stacking contexts) |
| `animate-pop` | `--duration-pop` 160ms | `--ease-pop` | dialogs, menus, ⌘K |
| `animate-drawer-in` | `--duration-drawer-in` 360ms | `--ease-drawer-in` | drawers in |
| `animate-drawer-out` | `--duration-drawer-out` 260ms | `--ease-drawer-out` | drawers out — exits faster than entrances |
| `animate-fade-in/out` | `--duration-fade-in` 320ms / `--duration-fade-out` 260ms | ease | backdrops |
| `gx-icon-pop` | `--duration-icon-pop` 450ms | `--ease-icon-pop` | nav-icon tap feedback — the only overshoot |
| hover/press | `--duration-hover` 150ms | ease | colors/transform |

Every animation is disabled under `prefers-reduced-motion: reduce` — new
keyframes MUST be added to the global reduced-motion block in `index.css`.

## 11. Iconography

Lucide only, 2px stroke, sized to the text beside it. Icons never carry meaning
alone — visible label or `aria-label` on the control, `aria-hidden` on the icon.

| Token | Utility | px | Use |
|---|---|---|---|
| `--spacing-icon-xs` | `size-icon-xs` | 13 | inline meta, dense rows |
| `--spacing-icon-sm` | `size-icon-sm` | 14 | meta rows, small buttons |
| `--spacing-icon-md` | `size-icon-md` | 15 | navigation, standard buttons |
| `--spacing-icon-lg` | `size-icon-lg` | 17 | page-level actions |
| `--spacing-icon-xl` | `size-icon-xl` | 18 | feature tiles, empty states |

Lucide's `size` prop takes the px number (`size={15}`) — that stays the norm in
component code; `size-icon-*` is for icons styled from CSS.

## 12. Do not

- Do not introduce a second violet/green/red/amber for a "one-off" status —
  extend the theme with a named token and document it here.
- Do not use pure `#000`, or white-on-black outside the navy scale.
- Do not lighten status colours "aesthetically" — the pairs are calibrated
  for AA; soft tones are fills only, never text.
- Do not put any animation longer than ~200ms in front of a blocking clinical
  task (an error message never waits behind a slide-in).
- Do not add new arbitrary values (`text-[Npx]`, `bg-[#hex]`) outside the
  documented scales in this file — the type roles, spacing steps, named
  measures and icon sizes all have utilities now.
- Do not reach for a Tailwind default ramp (`text-gray-700`, `bg-blue-50`,
  `border-red-200`). They compile, but they are not this palette: gray is
  `navy`/`forest`, blue is `azure`, red is the `rose` pair.
