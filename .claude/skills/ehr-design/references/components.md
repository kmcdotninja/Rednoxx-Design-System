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
- **Every data-bound view implements four states explicitly** — loading
  (shape-matched skeleton, not a spinner, for anything >~300ms), empty
  (message + next action), error (what failed + retry, never a bare
  "Something went wrong"), and populated. Happy-path-only is incomplete.
- Interactive components expose all states: default, hover, focus-visible,
  active/pressed, disabled — plus loading/error where meaningful.

## 2. Primitive inventory & non-negotiables

### Forms
| Component | Rules |
|---|---|
| `Button` (+`ButtonGroup`) | variants primary/secondary/ghost/danger; sizes sm/md/lg (md/lg ≥40px); `leftIcon/rightIcon`; disabled stays in a11y tree. Loading state disables + shows inline spinner + swaps the label ("Saving…") via `aria-live="polite"` — never spinner-only. `danger` is reserved for destructive/high-risk actions and is ALWAYS paired with the confirmation pattern (clinical-safety.md §2). Focus ring draws outside the border so `overflow:hidden` ancestors never clip it |
| `Input` | always inside `Field`; `invalid` paints danger border+ring, sets `aria-invalid`, and the error message is linked via `aria-describedby`. Optional success state for verified identifiers (e.g. NIN checked). Placeholders are examples, never labels |
| `PasswordInput` | the ONLY way to take passwords — show/hide eye is a real button with `aria-label` + `aria-pressed`, keyboard reachable; inherits `invalid`/`disabled` |
| `Textarea` | `resize-none`, rows prop |
| `Select` | native `<select>` styled to field baseline, chevron overlay |
| `Combobox` | filterable list, arrow-key nav (Up/Down, Enter selects, Escape closes), `aria-expanded`; announces result count via `aria-live="polite"`; explicit "no matches" state suggesting a broader search or a coded/free-text fallback where clinically appropriate |
| `DatePicker` / `TimePicker` | typed input (`dd/mm/yyyy`, Nigerian convention) always accepted — never calendar-only; validates clinical ranges (no future DOB, no future "seen on") with inline errors, not silent blocks; age auto-computed next to DOB |
| `SearchInput` | leading search icon, used in toolbars/filter bars |
| `Checkbox`, `RadioGroup` | real radiogroup semantics, arrow keys, `aria-checked`; checkbox supports `indeterminate` for select-all; groups wrap in `<fieldset>` + `<legend>` |
| `Slider`, `Switch`/`Toggle` | `role="switch"` + `aria-checked`; toggles are `rounded-full` |
| `ColorPicker` | swatch set `SWATCHES` |
| `CodeInput` | OTP digits; paste distributes; `autocomplete="one-time-code"` |

### Data display
| Component | Rules |
|---|---|
| `Avatar` (+`AvatarGroup`) | `rounded-full`; initials fallback |
| `Badge`/`Tag`/`StatusPill` | StatusPill = soft fill + AA text + visible word — never colour alone |
| `Card` (+`CardHeader`) | hairline border, level-0 by default; `pad={false}` for custom padding; `dark` variant on navy |
| `DataTable` | `.tnum` numerics right-aligned; header row `panel` fill + Overline style; row hover `panel`; sortable headers are buttons exposing `aria-sort`; `<th scope="col">` / `<th scope="row">` semantics; supports `data-density` (design-tokens.md §9b); sticky headers must never obscure the focus ring of the row beneath (test by tabbing to it); empty state is an explicit message, never a blank table |
| `ProgressBar`/`ProgressCircle` | value labelled in text |
| `KeyValue` | label/value pairs in detail panels |
| `StatCard` | KPI number `.tnum`; delta in words + arrow |
| `Rating`, `Divider`, `Kbd` | — |

### Feedback
| Component | Rules |
|---|---|
| `Alert` | `tone` info/success/warning/danger; title + body; danger errors `role="alert"`. Inline alerts persist until resolved and sit next to the affected content |
| `Toast` (`useToast` over sonner) | transient, non-blocking, auto-dismisses; confirms every mutation; `aria-live="polite"`. NEVER used for errors that require action |
| Banner (page-level Alert usage) | persistent, for system-wide states — offline, sync failed, read-only, maintenance — always with a next step ("Retry now" / "2 items will sync when connection returns"); `aria-live="assertive"` only when data loss is at risk |
| `Modal` | focus trap; `role="dialog"` + `aria-modal` + `aria-labelledby`; background inert; Escape closes top layer only (`layerStack`) and in destructive confirms Escape maps to the SAFE option; focus returns to trigger on close |
| `Drawer` | `animate-drawer-in/out`; same layer rules |
| `Tooltip`/`InfoTip` | never the only carrier of required info |
| `Skeleton`/`SkeletonText`/`InlineLoader` | skeletons match final layout |
| `EmptyState` | illustration + one-line explanation + primary action |

### Navigation & overlays
| Component | Rules |
|---|---|
| `Tabs`/`VerticalTabs`, `Segmented` | active = fill + weight, not colour alone; `role="tablist"`/`tab`/`tabpanel`, arrow-key navigation, only the active panel in tab order |
| `Accordion` | progressive disclosure (history, past visits, trends); native `<details>/<summary>` preferred where semantics allow |
| `Stepper` (horizontal/vertical/dots) | shows position ("Step 2 of 4"); backward navigation never loses entered data; validates only the current step before advancing |
| `Pagination`, `Breadcrumb` | pagination always shows position ("21–40 of 273") — arrow-only pagination is an understandability failure |
| `Sidebar`, `Navbar` | 240px shell; active nav `panel` fill |
| `Dropdown`, `Popover`, `CommandMenu` | portal to body; `layerStack`; ⌘K binding via `useCommandMenu` |

## 3. Healthcare blocks (`components/blocks/` + `/blocks/*` docs)

Compose screens from blocks when one exists — never from raw primitives.

### Patient banner — MANDATORY on every clinical screen
Content in visual-priority order: **full name (largest, Heading style or
above) · age AND DOB together ("34y · 12 Mar 1992") · sex · MRN (mono,
`.tnum`) · allergy & risk flags (danger pills with text — never hidden behind
a click) · encounter status · insurance/payment status where relevant ·
facility/ward/clinic.** Rules:

- Sticky — never scrolls out of view during the clinical task.
- Present before other content loads: render its skeleton rather than
  omitting it while patient data loads; never blank.
- Click/tap expands to a fuller patient summary (progressive disclosure);
  the collapsed content above is always visible without interaction.
- This is the primary wrong-patient control; every page action reads as
  inside its scope.

### Allergy / risk flag
Danger pill with icon + text ("Allergy: Penicillin" — never icon-only). With
multiple allergies: show count + the most severe on the collapsed banner,
full list on expand. Never suppressed to save space.

### Duplicate-patient warning (search/registration)
Triggered above a similarity threshold (name + DOB + sex, or matching
NIN/identifier). Side-by-side comparison of candidate match vs entered data,
with explicit "Use existing patient" / "Create new anyway" — the latter
requires a reason and is audited (clinical-safety.md §1).

### Encounter card
One encounter in a history list: date/time, type (OPD, admission, referral),
attending clinician, status chip, link into the full encounter. Collapsed by
default in long histories.

### Other blocks
| Block | Spec |
|---|---|
| Vitals row/table | columns: parameter, value, unit, reference range, timestamp, recorded-by; units rendered by UI, never ambiguous ("°C", not a bare number); abnormal = warning wash, critical = danger wash, both + word ("38.9 °C · High"); trend toggle; keyboard-first entry |
| Order basket | orders accumulate → ONE explicit "Submit orders" review step (never auto-submit per item — NIST wrong-order control); each row: ordering clinician, date/time, specimen, priority, status; rows removable pre-submit; running count visible |
| Medication row | drug · dose · route · frequency · duration · start date · prescriber shown together as one unit — never split across screens; allergy/interaction warnings inline ON THE ROW (danger pair), not only elsewhere; dispense chip pending/dispensed/partial |
| Ward/bed card | bed/ward id, patient or "Vacant"/"Cleaning" status (colour + text + icon), admitting clinician, length of stay |
| Result trend | sparkline + table toggle; reference range shaded; critical flagged + acknowledged |
| Claim status chip | draft→neutral, submitted→accent, pending review→warning, approved/paid→success, rejected→danger with the payer reason visible on expand — distinct colour+icon+label per state, mirroring `Claim.status` |
| KPI card / dashboard lists | `.tnum`; delta vs prior period in words + arrow |
| Filter bar / page header | one pattern product-wide; filters are chips with clear-all |
| Timeline | encounter/audit history: actor, role, action, timestamp |
| Empty/loading/error states | every list and detail defines all three |
| Auth set | login, registration, OTP, MFA setup, password (strength meter + requirements checklist + PasswordInput), workspace select |

## 4. Forms engine rules

1. **Structure:** long forms split into sections (Section type style);
   a Stepper for true multi-stage flows (e.g. registration wizard).
2. **Field anatomy:** `Field` renders label + control + hint OR error. Error
   replaces hint, announces `role="alert"`, pairs with `invalid` +
   `aria-describedby` on the control. Helper text (format hints, units) is
   shown BEFORE the user errs, not only after.
3. **Required convention:** fields default to required; exceptions carry the
   quiet "Optional" tag. Where the required `*` appears on mixed forms, the
   form carries a one-line legend ("* required") — an unexplained asterisk is
   ambiguous for low-literacy and screen-reader users.
4. **Validation timing:** format on blur, completeness on submit, never on
   first keystroke. Error copy = what's wrong + how to fix ("Must be exactly
   11 digits — this has 9"), placed at the field.
5. **Error summary:** forms taller than one viewport MUST show a top summary
   on failed submit — `role="alert"`, heading, one anchor per error that
   moves focus to the field.
6. **Defaults & reuse:** prefill facility, clinician, date — never ask twice.
7. **Autosave:** clinical documentation autosaves (interval + blur) with a
   visible "Saved · 09:41" indicator and unsaved-changes warning on nav.
8. **Units & identifiers:** units rendered by the UI, never typed; MRN/NIN/
   phone format-validated, displayed mono `.tnum`.
9. **Dates:** DatePicker + typed fallback; future/impossible-date rules per
   field; age computed and shown beside DOB.
10. **Every persisted field declares:** data owner, validation rule,
   terminology source, FHIR path (see fhir-mapping.md), privacy class.
