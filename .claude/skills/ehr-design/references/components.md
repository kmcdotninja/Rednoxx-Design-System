# Components, blocks & forms — complete reference

## 1. Ground rules

- The 36 primitives in `app/src/components/ui/` are the only base layer.
  **Never rebuild or fork one per screen** — extend via props or compose in
  blocks. Missing capability → extend the primitive itself, with docs.
- Every component: typed props interface, `cn()` for class merging, variants
  as Tailwind class maps, real native elements underneath (`<button>`,
  `<label>`, `<input>`), icon-only buttons carry `aria-label`.
- Barrel: `components/ui/index.ts`. Charts are NOT re-exported through the
  barrel (they'd drag recharts into every bundle) — import directly from
  their file.
- File conventions: one component per PascalCase file; healthcare
  compositions live in `components/blocks/`; hooks/helpers in `lib/`.

## 2. Primitive inventory & non-negotiables

### Forms
| Component | Rules |
|---|---|
| `Button` (+`ButtonGroup`) | variants primary/secondary/ghost/danger; sizes sm/md/lg (md/lg ≥40px); `leftIcon/rightIcon`; disabled stays in a11y tree |
| `Input` | always inside `Field`; `invalid` prop paints danger border+ring and sets `aria-invalid` |
| `PasswordInput` | the ONLY way to take passwords — show/hide eye is a real button with `aria-label` + `aria-pressed`, keyboard reachable; inherits `invalid`/`disabled` |
| `Textarea` | `resize-none`, rows prop |
| `Select` | native `<select>` styled to field baseline, chevron overlay |
| `Combobox` | filterable list, arrow-key nav, `aria-expanded` |
| `DatePicker` / `TimePicker` | typed fallback allowed; age auto-computed next to DOB fields |
| `SearchInput` | leading search icon, used in toolbars/filter bars |
| `Checkbox`, `RadioGroup` | real radiogroup semantics, arrow keys, `aria-checked` |
| `Slider`, `Switch`/`Toggle` | `role="switch"` + `aria-checked`; toggles are `rounded-full` |
| `ColorPicker` | swatch set `SWATCHES` |
| `CodeInput` | OTP digits; paste distributes; `autocomplete="one-time-code"` |

### Data display
| Component | Rules |
|---|---|
| `Avatar` (+`AvatarGroup`) | `rounded-full`; initials fallback |
| `Badge`/`Tag`/`StatusPill` | StatusPill = soft fill + AA text + visible word — never colour alone |
| `Card` (+`CardHeader`) | hairline border, level-0 by default; `pad={false}` for custom padding; `dark` variant on navy |
| `DataTable` | `.tnum` numerics right-aligned; header row `panel` fill + Overline style; row hover `panel`; sortable headers are buttons |
| `ProgressBar`/`ProgressCircle` | value labelled in text |
| `KeyValue` | label/value pairs in detail panels |
| `StatCard` | KPI number `.tnum`; delta in words + arrow |
| `Rating`, `Divider`, `Kbd` | — |

### Feedback
| Component | Rules |
|---|---|
| `Alert` | `tone` info/success/warning/danger; title + body; danger errors `role="alert"` |
| `Toast` (`useToast` over sonner) | confirms every mutation; `aria-live="polite"` |
| `Modal` | focus trap, Escape closes top layer only (`layerStack`), focus returns to trigger |
| `Drawer` | `animate-drawer-in/out`; same layer rules |
| `Tooltip`/`InfoTip` | never the only carrier of required info |
| `Skeleton`/`SkeletonText`/`InlineLoader` | skeletons match final layout |
| `EmptyState` | illustration + one-line explanation + primary action |

### Navigation & overlays
| Component | Rules |
|---|---|
| `Tabs`/`VerticalTabs`, `Segmented` | active = fill + weight, not colour alone |
| `Accordion`, `Stepper` (horizontal/vertical/dots), `Pagination`, `Breadcrumb` | steppers announce current step |
| `Sidebar`, `Navbar` | 240px shell; active nav `panel` fill |
| `Dropdown`, `Popover`, `CommandMenu` | portal to body; `layerStack`; ⌘K binding via `useCommandMenu` |

## 3. Healthcare blocks (`components/blocks/` + `/blocks/*` docs)

Compose screens from blocks when one exists — never from raw primitives.

### Patient banner — MANDATORY on every clinical screen
Content in order: **full name · age (DOB on expand) · sex · MRN (mono,
`.tnum`) · allergy & risk flags (danger pills with text) · encounter status ·
insurance/payment status where relevant · facility/ward/clinic.** Sticky;
never scrolls away; every page action reads as inside its scope. This is the
primary wrong-patient control.

### Other blocks
| Block | Spec |
|---|---|
| Vitals row/table | units rendered by UI; abnormal = status pair + word ("38.9 °C · High"); trend affordance; keyboard-first entry |
| Order basket | orders accumulate → single review + sign step; shows ordering clinician, date/time, specimen, status |
| Medication row | dose · route · frequency · duration · status; allergy/interaction warnings inline (danger pair); dispense chip |
| Result trend | sparkline + table toggle; reference range shaded; critical flagged + acknowledged |
| Claim status chip | submitted→accent, pending→warning, paid→success, rejected→danger |
| KPI card / dashboard lists | `.tnum`; delta vs prior period in words + arrow |
| Filter bar / page header | one pattern product-wide; filters are chips with clear-all |
| Timeline | encounter/audit history: actor, role, action, timestamp |
| Empty/loading/error states | every list and detail defines all three |
| Auth set | login, registration, OTP, MFA setup, password (strength meter + requirements checklist + PasswordInput), workspace select |

## 4. Forms engine rules

1. **Structure:** long forms split into sections (Section type style);
   a Stepper for true multi-stage flows (e.g. registration wizard).
2. **Field anatomy:** `Field` renders label (required `*` / "Optional" tag) +
   control + hint OR error. Error replaces hint, announces `role="alert"`,
   pairs with `invalid` on the control.
3. **Validation timing:** format on blur, completeness on submit, never on
   first keystroke. Error copy = what's wrong + how to fix ("Must be exactly
   11 digits — this has 9"), placed at the field.
4. **Error summary:** forms taller than one viewport MUST show a top summary
   on failed submit — `role="alert"`, heading, one anchor per error that
   moves focus to the field.
5. **Defaults & reuse:** prefill facility, clinician, date — never ask twice.
6. **Autosave:** clinical documentation autosaves (interval + blur) with a
   visible "Saved · 09:41" indicator and unsaved-changes warning on nav.
7. **Units & identifiers:** units rendered by the UI, never typed; MRN/NIN/
   phone format-validated, displayed mono `.tnum`.
8. **Dates:** DatePicker + typed fallback; future/impossible-date rules per
   field; age computed and shown beside DOB.
9. **Every persisted field declares:** data owner, validation rule,
   terminology source, FHIR path (see fhir-mapping.md), privacy class.
