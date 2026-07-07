# Design tokens — complete reference

Tokens are CSS custom properties in the `@theme` block of `app/src/index.css`
(Tailwind v4, CSS-first — there is no `tailwind.config.js`). Components MUST
reference tokens through Tailwind utilities; raw hex in component code is a
defect. **If a value is missing from the scale, add it to the theme file
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

## 6. Shape

All structural radius tokens (`--radius-sm` … `--radius-5xl`) are **0px**
(Carbon-style). Buttons, inputs, cards, popovers, modals, drawers: square.
`rounded-full` is the only exception — pills, dots, toggles, avatars — so
status/identity read from silhouette. Restyle globally by changing tokens;
never hard-code a radius.

## 7. Type scale — closed set of 10 styles

Geist everywhere; Geist Mono for code/tokens/MRNs/identifiers. Global font
features: `cv11`, `ss01`. Updating numbers (vitals, money, timers, tables)
wear `.tnum`.

| Style | Size | Line | Weight | Tracking | Tailwind classes | Use |
|---|---|---|---|---|---|---|
| Display | 32 | 1.15 | 500 | −0.02em | `text-[32px] font-medium leading-[1.15] tracking-[-0.02em]` | hero — one per flow |
| Page title | 26 | 1.2 | 500 | −0.02em | `text-[26px] font-medium leading-[1.2] tracking-[-0.02em]` | the h1 — one per page |
| Title | 19 | 1.35 | 500 | −0.01em | `text-[19px] font-medium leading-[1.35] tracking-[-0.01em]` | card/dialog/auth headings |
| Section | 17 | 1.4 | 500 | −0.01em | `text-[17px] font-medium leading-[1.4] tracking-[-0.01em]` | grouped content |
| Heading | 15 | 1.45 | 500 | −0.01em | `text-[15px] font-medium leading-[1.45] tracking-[-0.01em]` | list titles, panel headers |
| Body | 14 | 1.6 | 400 | 0 | `text-sm leading-relaxed` | default reading |
| Secondary | 13 | 1.55 | 400 | 0 | `text-[13px] leading-relaxed` | dense-UI workhorse |
| Caption | 12 | 1.5 | 400 | 0 | `text-[12px]` | supporting labels |
| Overline | 11 | 1.4 | 500 | +0.08em | `text-[11px] font-medium uppercase tracking-[0.08em]` | eyebrows, table headers |
| Micro | 10 | 1.3 | 500 | +0.02em | `text-[10px] font-medium` | chips, ticks — never prose |

Rules: negative tracking only ≥15px; uppercase+wide tracking only ≤12px;
headings `text-wrap: balance`, paragraphs `text-wrap: pretty` (global). Body
colour `navy`; secondary `navy-400`; muted `navy-300`.

## 8. Spacing — 4px grid

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

## 9. Layout measurements

| Measure | Value |
|---|---|
| Sidebar | 240px (`w-60`), fixed; overlay menu below `lg` |
| Content max-width | 896px (`max-w-4xl`) reading; data tables may go full-width |
| Page padding | `px-5` mobile → `sm:px-8` |
| Section rhythm | `space-y-12` (48px) |

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

| Name | Duration | Easing | Use |
|---|---|---|---|
| `animate-rise` | 400ms | `cubic-bezier(0.22,1,0.36,1)` | page/card entrances — `backwards` fill (never `both`: it traps popovers in stacking contexts) |
| `animate-pop` | 160ms | `cubic-bezier(0.22,1,0.36,1)` | dialogs, menus, ⌘K |
| `animate-drawer-in` | 360ms | `cubic-bezier(0.32,0.72,0,1)` | drawers in |
| `animate-drawer-out` | 260ms | `cubic-bezier(0.36,0,0.66,-0.06)` | drawers out — exits faster than entrances |
| `animate-fade-in/out` | 320/260ms | ease | backdrops |
| hover/press | 150–200ms | ease | colors/transform |

Every animation is disabled under `prefers-reduced-motion: reduce` — new
keyframes MUST be added to the global reduced-motion block in `index.css`.

## 11. Iconography

Lucide only, 2px stroke. Sizes: 13px inline meta/dense rows · 14px meta rows,
small buttons · 15px navigation, standard buttons · 17px page-level actions ·
18px feature tiles, empty states. Icons never carry meaning alone — visible
label or `aria-label` on the control, `aria-hidden` on the icon.

## 12. Do not

- Do not introduce a second violet/green/red/amber for a "one-off" status —
  extend the theme with a named token and document it here.
- Do not use pure `#000`, or white-on-black outside the navy scale.
- Do not lighten status colours "aesthetically" — the pairs are calibrated
  for AA; soft tones are fills only, never text.
- Do not put any animation longer than ~200ms in front of a blocking clinical
  task (an error message never waits behind a slide-in).
- Do not add new arbitrary values (`text-[Npx]`, `bg-[#hex]`) outside the
  documented scales in this file.
