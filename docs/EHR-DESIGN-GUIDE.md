# Rednoxx EHR — UI/UX & Front-End Implementation Guide

**Version 1.1 · 7 July 2026 · Normative**

This is the single source of truth for building the Rednoxx HIM/EMR/EHR platform's
user interface. It merges the strategy guide
(`REDNOXX_EMR_EHR_UI_UX_Front_End_Design_Guides.docx`, v1.0) with the concrete,
measured values of the Rednoxx design system in this repository, so that a
designer, a front-end engineer, **or an AI coding agent (Claude Code)** can build
screens from it without guessing.

Language is normative: **MUST** = hard requirement, release-blocking.
**SHOULD** = default; deviation needs a written reason. **MAY** = optional.

The live, browsable version of the token/component layer is the showcase app in
[`app/`](../app/) (deployed at https://rednoxx-design-system.vercel.app). Where
this document and the code disagree, the code's `@theme` block in
[`app/src/index.css`](../app/src/index.css) wins for token *values*; this
document wins for *rules*.

---

## Table of contents

1. [Product context & design principles](#1-product-context--design-principles)
2. [Standards baseline](#2-standards-baseline)
3. [Stack & front-end architecture](#3-stack--front-end-architecture)
4. [Design tokens](#4-design-tokens)
5. [Type scale](#5-type-scale)
6. [Spacing & layout](#6-spacing--layout)
7. [Shape, elevation & motion](#7-shape-elevation--motion)
8. [Iconography](#8-iconography)
9. [Interaction states & focus](#9-interaction-states--focus)
10. [Component standards](#10-component-standards)
11. [Healthcare blocks](#11-healthcare-blocks)
12. [Forms engine rules](#12-forms-engine-rules)
13. [Clinical safety patterns](#13-clinical-safety-patterns)
14. [Module-level screen requirements](#14-module-level-screen-requirements)
15. [Connectivity, performance & states](#15-connectivity-performance--states)
16. [Accessibility acceptance criteria (WCAG 2.2 AA)](#16-accessibility-acceptance-criteria-wcag-22-aa)
17. [Usability testing protocol](#17-usability-testing-protocol)
18. [Implementation roadmap](#18-implementation-roadmap)
19. [Definition of Done](#19-definition-of-done)
20. [References](#20-references)

---

## 1. Product context & design principles

Rednoxx is a Nigerian healthcare platform spanning enrolments, payments,
insurance, clinical consultation, prescriptions, lab and surgical orders, and
reporting. Users include doctors, nurses, records officers, lab scientists,
pharmacists, cashiers, administrators and facility managers — with widely
varying digital skill, on shared machines, tablets, and unreliable networks.

UI/UX is treated as a **patient-safety concern**, not styling. Ten principles
govern every screen (each is expanded into concrete rules later in this guide):

1. **Preserve patient context everywhere.** Every clinical screen MUST show a
   persistent patient banner (§11.1). Wrong-patient risk is a design defect.
2. **Make common tasks fast.** Optimize for the tasks done dozens of times a
   day: find patient → register → check in → vitals → consult → order → review
   → bill → dispense → discharge. Measure clicks; §17 sets thresholds.
3. **Design forms around real workflows** — sectioned, defaulted, validated
   inline, never re-asking for known data (§12).
4. **Prevent duplicate patients and wrong-patient actions** — search-before-
   create, duplicate warnings, high-risk confirmation (§13).
5. **Use progressive disclosure.** Essentials first; history, trends, audit
   detail behind an explicit expand.
6. **Use clear clinical and administrative language.** Labels match Nigerian
   facility vocabulary while staying standards-compatible. Never "case",
   "file", or "record" without a defined meaning.
7. **Build for poor connectivity and busy facilities** — autosave, visible
   sync state, graceful failure (§15).
8. **Accessibility is non-negotiable** — WCAG 2.2 AA is a release gate (§16).
9. **Support role-based experiences** — menus, defaults, dashboards and
   shortcuts differ by role; the design system does not.
10. **Design data for interoperability from the start.** Every persisted field
    has an owner, validation rule, terminology source, FHIR mapping, and
    privacy classification (§14 gives the mappings).

## 2. Standards baseline

| Standard | Role in Rednoxx | Priority |
|---|---|---|
| NIST GCR 15-996 (Wiklund et al., 2015) | Clinical UI safety & usability engineering; source of screen-review gates | Very high |
| HIMSS Nine Usability Principles (2015) | Sprint-level design-review checklist | Very high |
| AHRQ/HIMSS EMR usability testing (2009) | Test protocol & acceptance thresholds (§17) | High |
| NHS Digital Service Manual & Design System | Model for form/error/content patterns | High |
| **WCAG 2.2 AA** (W3C, 2023) | Accessibility gate — every module (§16) | Very high |
| ISO 9241-210:2019 | Human-centred design governance & traceability | High |
| OpenMRS 3 / O3 (Carbon-based) | EMR design-system benchmark; Rednoxx shares the square-corner Carbon geometry | Medium-high |
| **HL7 FHIR R4** | Every persisted field maps to a FHIR resource (§14) | Very high |
| Nigeria Core FHIR IG (NDHI, continuous build) | Nigerian profiles, identifiers, value sets, privacy | Very high |
| NDHI National Enterprise Architecture | Facility integration, registries, HIE readiness, reporting | Very high |

Links in §20. HIMSS's nine principles — simplicity, naturalness, consistency,
forgiveness/feedback, effective language, efficiency, information presentation,
context preservation, minimized cognitive load — are the rubric for every
design review and sprint demo.

## 3. Stack & front-end architecture

The EHR front end MUST use the same stack and conventions as the design-system
repo, so components transfer without translation:

| Layer | Choice | Notes |
|---|---|---|
| Framework | **React 19** + **TypeScript 6** (strict) | `tsc -b` runs in every build |
| Build | **Vite 8** (Rolldown) + `@vitejs/plugin-react` | |
| Styling | **Tailwind CSS v4**, CSS-first | **No `tailwind.config.js`** — all tokens live in the `@theme` block of `index.css` |
| Routing | `react-router-dom` 7 | Route-level `lazy()` for heavy areas; charts stay out of the shell bundle |
| Icons | `lucide-react` only | §8 |
| Charts | `recharts`, lazy-loaded | Never re-export chart components through the ui barrel |
| Toasts | `sonner` (wrapped by the system's `useToast`) | |
| Fonts | Geist + Geist Mono | `font-feature-settings: 'cv11','ss01'`; `.tnum` for data |
| Lint | `oxlint` | |
| Hosting | Vercel (SPA rewrite to `/index.html`) | |

**File conventions** (mirror [`app/src/`](../app/src/)):

```
src/
  components/ui/      generic primitives — one file per component, PascalCase,
                      re-exported from components/ui/index.ts (the barrel)
  components/blocks/  healthcare compositions (PatientBanner, VitalsRow, …)
  lib/                cn(), hooks, pure helpers
```

- Class merging uses the repo's `cn()` helper; component variants are
  Tailwind-class maps, not CSS files.
- Every input renders inside the `Field` wrapper (§12); password entry uses
  `PasswordInput` (never a bare `<input type="password">`).
- UI state and clinical data state are separated: server data lives behind a
  fetching layer with explicit `loading / saving / synced / failed` states —
  components receive state, they never fetch.
- **Quality gates:** unit tests for validation logic and critical state
  transitions, axe-core automated a11y checks, keyboard pass by hand,
  task-based usability tests (§17), and a browser-driven verification of each
  flow before merge.

## 4. Design tokens

Tokens are CSS custom properties in the `@theme` block of
[`app/src/index.css`](../app/src/index.css). Components MUST reference tokens
(via Tailwind utilities) — never raw hex values in component code.

### 4.1 Ink (primary neutral — token family `navy`, legacy alias `forest`)

| Token | Hex | Contrast on white | Grade | Role |
|---|---|---|---|---|
| `navy-50` | `#f4f4f6` | 1.1:1 | — | faint fills |
| `navy-100` | `#e9e9ee` | 1.2:1 | — | skeleton bones, quiet fills |
| `navy-200` | `#d4d4dd` | 1.5:1 | — | strong hairlines, disabled icons |
| `navy-300` | `#70707f` | **4.9:1** | AA | muted text, placeholders, resting icons |
| `navy-400` | `#515160` | **7.8:1** | AAA | secondary text |
| `navy-500` | `#3e3e4c` | **10.5:1** | AAA | strong secondary text |
| `navy-600` | `#2a2a38` | 14.1:1 | AAA | dark-surface hover |
| `navy` | `#171723` | **17.7:1** | AAA | primary ink, solid buttons, dark panels |
| `navy-800` | `#12121c` | 18.6:1 | AAA | dark surface alt |
| `navy-900` | `#0a0a11` | 19.7:1 | AAA | deepest surface |

### 4.2 Accent (brand violet — token family `azure`, legacy alias `lime`)

| Token | Hex | Contrast on white | Grade | Role |
|---|---|---|---|---|
| `azure-50` | `#f3f1ff` | 1.1:1 | — | focus ring, selected fills |
| `azure-100` | `#e9e4ff` | 1.2:1 | — | selection highlight |
| `azure-200` | `#d4cbfe` | 1.5:1 | — | chart fills |
| `azure-300` | `#ab97fd` | 2.4:1 | — | decorative only — never text |
| `azure` | `#5833fb` | **6.4:1** | AA | primary actions, links, active nav, focus, data series |
| `azure-500` | `#4a28e0` | 7.9:1 | AAA | pressed/hover on primary |
| `azure-600` | `#3c1ec2` | 9.7:1 | AAA | accent text on tinted fills |

### 4.3 Status (each colour MUST ship with a text label — never colour alone)

| Token | Hex | Contrast | Pairing rule |
|---|---|---|---|
| `mint` | `#15803d` | 5.0:1 on white; 4.6:1 on `mint-soft` | success text/icons on `mint-soft` fills |
| `mint-soft` | `#dcfce7` | — | success fill |
| `gold` | `#e0a526` | 2.2:1 | **fills and bars only — never text** |
| `gold-600` | `#9a6b0f` | 4.7:1 on white; 4.0:1 on `gold-soft` | warning text |
| `gold-soft` | `#fbecc9` | — | warning fill |
| `rose-ink` | `#b91c1c` | 6.5:1 on white; 5.3:1 on `rose-soft` | danger/error text, destructive actions |
| `rose-soft` | `#fee2e2` | — | danger fill |

Clinical semantics: abnormal-high/critical values use the danger pair;
borderline/pending uses the warning pair; normal/complete uses the success
pair; informational states use the accent pair. A status chip is always
`soft fill + AA text + label` (see `StatusPill`).

### 4.4 Neutral surfaces

| Token | Hex | Role |
|---|---|---|
| `white` | `#ffffff` | cards, inputs, popovers, sidebar |
| `canvas` | `#fcfcfc` | app background |
| `panel` | `#f4f4f5` | hovers, table headers, skeletons, wells |
| `hair` | `#e4e4e7` | the only border colour — cards, inputs, dividers |

### 4.5 Shadows (exact values)

```css
--shadow-chip:       0 0 0 1px rgb(0 0 0 / 0.05), 0 1px 2px rgb(0 0 0 / 0.04);
--shadow-card:       0 1px 2px -1px rgb(0 0 0 / 0.03), 0 6px 16px -8px rgb(0 0 0 / 0.05);
--shadow-card-hover: 0 2px 6px -3px rgb(0 0 0 / 0.04), 0 12px 28px -10px rgb(0 0 0 / 0.07);
--shadow-soft:       0 1px 2px rgb(0 0 0 / 0.04), 0 4px 16px -4px rgb(0 0 0 / 0.07);
--shadow-pop:        0 0 0 1px rgb(0 0 0 / 0.04), 0 8px 28px -8px rgb(0 0 0 / 0.16);
```

Level 0 (hairline border, no shadow) is the default; `card` for resting cards,
`card-hover` on lift, `soft` for quiet chrome, `pop` for overlays. Shadows are
pure black at low alpha — they MUST NOT tint.

## 5. Type scale

Geist for everything; Geist Mono for code, tokens, MRNs and identifiers.
Numbers that update in place (vitals, money, timers, tables) MUST wear `.tnum`.
Ten styles cover the entire product — do not invent an eleventh:

| Style | Size | Line | Weight | Tracking | Tailwind classes | Use |
|---|---|---|---|---|---|---|
| Display | 32px | 1.15 | 500 | −0.02em | `text-[32px] font-medium leading-[1.15] tracking-[-0.02em]` | hero statements — one per flow |
| Page title | 26px | 1.2 | 500 | −0.02em | `text-[26px] font-medium leading-[1.2] tracking-[-0.02em]` | the `h1` — exactly one per page |
| Title | 19px | 1.35 | 500 | −0.01em | `text-[19px] font-medium leading-[1.35] tracking-[-0.01em]` | card, dialog, auth headings |
| Section | 17px | 1.4 | 500 | −0.01em | `text-[17px] font-medium leading-[1.4] tracking-[-0.01em]` | grouped content inside a page |
| Heading | 15px | 1.45 | 500 | −0.01em | `text-[15px] font-medium leading-[1.45] tracking-[-0.01em]` | list titles, panel headers, lede |
| Body | 14px | 1.6 | 400 | 0 | `text-sm leading-relaxed` | default reading size |
| Secondary | 13px | 1.55 | 400 | 0 | `text-[13px] leading-relaxed` | the dense-UI workhorse |
| Caption | 12px | 1.5 | 400 | 0 | `text-[12px]` | supporting labels, annotations |
| Overline | 11px | 1.4 | 500 | +0.08em | `text-[11px] font-medium uppercase tracking-[0.08em]` | eyebrows, group labels, table headers |
| Micro | 10px | 1.3 | 500 | +0.02em | `text-[10px] font-medium` | chips, axis ticks — never prose |

Rules: negative tracking only at ≥15px; uppercase+wide tracking only at ≤12px.
Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty` (set
globally). Body text colour is `navy`/`forest`; secondary `navy-400`; muted
`navy-300` — never lighter for readable text.

## 6. Spacing & layout

**4px base grid.** Every gap, inset and offset is a multiple of 4px. If a
layout needs 14px, the layout is wrong.

| Step | px | Use |
|---|---|---|
| 1 | 4 | icon–text gaps, chip padding |
| 1.5 | 6 | tight inline gaps |
| 2 | 8 | gaps between chips, small controls |
| 2.5 | 10 | dense list row padding |
| 3 | 12 | card-grid gaps, toolbar padding |
| 4 | 16 | control padding, form gaps |
| 5 | 20 | card padding (compact) |
| 6 | 24 | card padding (default), section gaps |
| 8 | 32 | between content groups |
| 10 | 40 | desktop page padding |
| 12 | 48 | between page sections |

**Shell measurements:**

| Measure | Value | Rule |
|---|---|---|
| Sidebar | 240px (`w-60`) | fixed, both docs and product |
| Content max-width | 896px (`max-w-4xl`) for reading; data tables MAY go full-width | |
| Page padding | `px-5` mobile → `sm:px-8` | |
| Section rhythm | `space-y-12` (48px) | |
| Touch target | **≥ 40px** (`h-10`) | `size="sm"` only inside rows that are themselves clickable |
| Breakpoints | Tailwind defaults; sidebar collapses below `lg` into an overlay menu | |

## 7. Shape, elevation & motion

**Shape — Carbon-style square corners.** Every structural radius token
(`--radius-sm` … `--radius-5xl`) resolves to **0px**. Buttons, inputs, cards,
popovers, modals, drawers are square. The only rounded exception is
`rounded-full` — pills, dots, toggles, avatars — so status and identity are
tellable from silhouette alone. To restyle globally, change the tokens; never
hard-code a radius in a component.

**Elevation:** §4.5. Default is level 0 (hairline border). Surfaces rise only
while they demand attention and settle back.

**Motion tokens:**

| Name | Duration | Easing | Use |
|---|---|---|---|
| `animate-rise` | 400ms | `cubic-bezier(0.22, 1, 0.36, 1)` | page & card entrances (`backwards` fill — never `both`, it traps popovers in stale stacking contexts) |
| `animate-pop` | 160ms | `cubic-bezier(0.22, 1, 0.36, 1)` | overlays: dialogs, menus, ⌘K |
| `animate-drawer-in` | 360ms | `cubic-bezier(0.32, 0.72, 0, 1)` | drawers entering |
| `animate-drawer-out` | 260ms | `cubic-bezier(0.36, 0, 0.66, -0.06)` | drawers leaving — **exits are faster than entrances** |
| `animate-fade-in/out` | 320/260ms | ease | backdrops |
| hover/press transitions | 150–200ms | ease | colors, transform |

Every animation MUST be disabled under `prefers-reduced-motion: reduce` (the
global block in `index.css` already does this — new keyframes must be added to
it). Motion explains hierarchy; it never decorates.

## 8. Iconography

Lucide only, stroke-based, default 2px weight. Sizes are fixed to context:

| Size | Context |
|---|---|
| 13px | inline meta, dense rows |
| 14px | meta rows, small buttons |
| 15px | navigation, standard buttons |
| 17px | page-level actions |
| 18px | feature tiles, empty states |

Icons NEVER carry meaning alone: pair with a visible label, or `aria-label` on
the interactive element with `aria-hidden` on the icon itself.

## 9. Interaction states & focus

**One focus treatment everywhere.** Inputs/selects/textareas:
`focus:border-azure focus:ring-4 focus:ring-azure-50`. Buttons and links:
`focus-visible:ring-2 focus-visible:ring-azure/50` (offset where needed).
Rules:

- Focus is always visible; it MUST NOT be hidden behind sticky headers,
  modals or sidebars (WCAG 2.4.11 Focus Not Obscured).
- Focus order follows visual order. Modals trap focus and return it to the
  trigger on close (`Modal` does this — use it, don't rebuild).
- Overlay stack uses the `layerStack` helper so Escape always closes the top
  layer only.
- Disabled controls: `disabled:bg-panel disabled:text-forest-300` — value
  remains readable at AA; disabled buttons stay in the accessibility tree.
- Hover states change border/fill (`hover:bg-panel`, `hover:border-navy-200`),
  never only colour of text.
- Destructive actions use `rose-ink` styling AND a confirmation (§13).

## 10. Component standards

The 36 documented primitives in [`app/src/components/ui/`](../app/src/components/ui/)
are the only allowed base layer. Do not fork them per screen; extend them
through props or compose them in blocks. Inventory and hard rules:

| Group | Components | Non-negotiables |
|---|---|---|
| Forms | Button (+Group), Input, **PasswordInput**, Textarea, Select, Combobox, DatePicker/TimePicker, SearchInput, Checkbox, Radio, Slider, Switch/Toggle, ColorPicker, CodeInput (digits) | Everything wraps in `Field` (label/hint/error); `invalid` prop + `Field error` for validation; placeholders are examples, never labels; PasswordInput's eye is a labelled `aria-pressed` button |
| Data display | Avatar (+Group), Badge/Tag/StatusPill, Card, DataTable, ProgressBar/Circle, Rating, Divider, Kbd, KeyValue, StatCard | Tables: `.tnum` numerics, right-aligned; StatusPill = soft fill + AA text + label |
| Feedback | Alert, Toast (sonner), Modal, Drawer, Tooltip, Skeleton/InlineLoader, EmptyState | Alerts have `tone` + title + body; errors are `role="alert"`; Modal traps focus; Toast confirms every mutation |
| Navigation | Tabs (+vertical), Segmented, Accordion, Stepper (3 variants), Pagination, Breadcrumb, Sidebar, Navbar | Active state is fill + weight, not colour alone |
| Overlays | Dropdown, Popover, CommandMenu (⌘K) | Portal to body; `layerStack`; arrow-key navigation |

Component code style: typed props interfaces, `cn()` for class merging,
variants as class maps, native elements underneath (real `<button>`, real
`<label>`), and every icon-only button carries `aria-label`.

## 11. Healthcare blocks

Domain compositions in [`app/src/components/blocks/`](../app/src/components/blocks/)
and documented under `/blocks/*` in the showcase. The EHR builds screens from
these — never from raw primitives when a block exists.

### 11.1 Patient banner (MANDATORY on every clinical screen)

Content, in order: **full name · age (and DOB on hover/expand) · sex · MRN /
patient ID (mono, `.tnum`) · allergy & risk flags (danger pills, always with
text) · encounter status · insurance/payment status where relevant · facility
/ ward / clinic context.** It is sticky, never scrolls away, and every action
taken on the page is visually inside its scope. This is the primary
wrong-patient control (HIMSS context preservation).

### 11.2 Other required blocks

| Block | Spec highlights |
|---|---|
| Vitals row/table | units always shown; abnormal values highlighted with the status pair + label (`38.9 °C · High`); trend affordance; keyboard-first entry |
| Order basket | pending orders accumulate before a single review+sign step; shows ordering clinician, date/time, specimen, status |
| Medication row | dose · route · frequency · duration · status; allergy/interaction warnings inline (danger pair); dispensing status chip |
| Result trend | sparkline + table toggle; reference range shaded; critical results flagged and acknowledged (§13) |
| Claim status chip | StatusPill mapping: submitted→accent, pending→warning, paid→success, rejected→danger |
| KPI card / dashboard lists | `.tnum`, delta vs previous period in words + arrow, never colour-alone |
| Filter bar / page header | one pattern product-wide; filters are chips with clear-all |
| Timeline | encounter/audit history with actor, timestamp, action |
| Empty / loading / error states | every list and detail screen defines all three; skeletons match final layout |
| Auth blocks | login, registration, OTP verification, MFA setup, password (strength meter + requirements checklist + show/hide toggles), workspace/org selection |

## 12. Forms engine rules

1. **Structure.** Long forms split into logical sections with Section-style
   headings; a stepper for true multi-stage flows (registration wizard).
2. **Field anatomy.** `Field` renders label (required asterisk / "Optional"
   tag), the control, and hint OR error — error replaces hint and announces
   `role="alert"`. Every control gets `invalid` styling when errored.
3. **Validation timing.** Validate on blur for format, on submit for
   completeness; never on first keystroke. Error copy says *what is wrong and
   how to fix it* ("Must be exactly 11 digits — this has 9"), placed at the
   field.
4. **Error summary.** Forms longer than one viewport MUST render an error
   summary at the top on failed submit: `role="alert"`, heading, one anchor
   link per error that moves focus to the field.
5. **Defaults & reuse.** Prefill everything the system already knows (facility,
   clinician, date). Never ask twice.
6. **Autosave.** Clinical documentation autosaves; a visible saved-state
   indicator ("Saved · 09:41") and an unsaved-changes warning on navigation.
7. **Units & identifiers.** Units are rendered by the UI, never typed by the
   user; identifiers (MRN, NIN, phone) have format validation and `.tnum`
   mono display.
8. **Dates.** DatePicker with typed fallback; age auto-computed from DOB and
   displayed alongside; future-date and impossible-date rules per field.
9. **Every persisted field** declares: data owner, validation rule,
   terminology source (ICD-10/LOINC/RxNorm/NHIA codes as applicable), FHIR
   path (§14), and privacy class.

## 13. Clinical safety patterns

- **Search before create.** Registration MUST run patient search first;
  potential duplicates (name + DOB + sex + phone/NIN fuzzy match) surface as a
  blocking review step with side-by-side comparison.
- **High-risk confirmation.** Merge, delete, void, overwrite, discharge
  against advice, and high-alert medication actions require a Modal that (a)
  restates the patient banner, (b) states the irreversible consequence in
  plain language, (c) requires an explicit affirmative ("Merge records") —
  never a default-focused OK.
- **Wrong-patient controls.** Patient banner everywhere (§11.1); switching
  patients closes open order baskets and unsent notes with an explicit prompt.
- **Alert discipline.** Interruptive alerts are reserved for severity ≥ high
  (allergy match, critical result, duplicate order). Everything else is
  inline, non-blocking. Track override rates — an alert overridden >90% of
  the time gets redesigned or demoted (alert-fatigue control, NIST).
- **Critical results** require explicit acknowledgement with actor + timestamp
  recorded.
- **Audit events** MUST be emitted for: create, update, view of restricted
  records, merge, void/cancel, approve/sign, dispense, bill, export, and all
  admin actions — with actor, role, patient, timestamp, and before/after where
  feasible. The Timeline block renders them.

## 14. Module-level screen requirements

Every module lists: primary users → screen requirements → safety controls →
FHIR R4 mapping (align profiles to **Nigeria Core IG**).

### 14.1 Patient registration & search
- Users: records officers.
- Search-first workspace: single search box (name / MRN / phone / NIN),
  `.tnum` results table, "create new" only after search.
- Registration wizard: Identity → Contact → Next of kin → Insurance/payment →
  Consent. Inline validation; NIN/phone format checks; camera/file photo
  capture optional; consent & privacy notice recorded.
- Safety: duplicate detection (§13); identifier uniqueness enforced server-side
  and surfaced inline.
- FHIR: `Patient` (identifier slices per Nigeria Core: MRN, NIN, phone),
  `RelatedPerson`, `Coverage`, `Consent`.

### 14.2 Appointments & queue
- Users: records officers, nurses.
- Day/clinic calendar; booking modal ≤ 6 fields; queue board with status chips
  (waiting → triaged → in-consult → done) — colour + text, never colour alone;
  role-filtered views; walk-in fast path.
- FHIR: `Appointment`, `Slot`, `Schedule`, `Encounter` (on check-in).

### 14.3 Triage & vitals
- Users: nurses.
- Keyboard-first vitals grid: BP, pulse, temp, RR, SpO₂, weight, height, BMI
  (auto), pain score. Units rendered, ranges validated, abnormal values
  flagged with status pair + word.
- Trend view per vital (result-trend block).
- FHIR: `Observation` (LOINC-coded, one per vital, `Encounter` linked).

### 14.4 Consultation documentation
- Users: doctors.
- Workspace layout: patient banner → summary rail (allergies, actives,
  recent results) → structured note (complaint, history, exam, diagnosis
  search with ICD-10 typeahead, plan) → order/prescribe panel.
- Autosave + "Saved" indicator; previous encounters one click away
  (progressive disclosure); sign-off = high-risk confirm (§13) + audit.
- FHIR: `Encounter`, `Condition` (ICD-10), `ClinicalImpression`,
  `DocumentReference` for attachments.

### 14.5 Orders & laboratory
- Users: doctors (order), lab scientists (process).
- Order basket (§11.2); specimen tracking board (ordered → collected →
  received → resulted → verified); result entry validates against reference
  ranges; critical results trigger acknowledged alerts.
- FHIR: `ServiceRequest`, `Specimen`, `DiagnosticReport`, `Observation`.

### 14.6 Pharmacy & medication
- Users: doctors (prescribe), pharmacists (dispense).
- Prescription rows: drug (RxNorm/NHIA list typeahead) · dose · route ·
  frequency · duration · quantity (auto) · instructions. Allergy and
  interaction warnings inline at prescribe time; high-alert meds get §13
  confirmation. Dispensing queue with status; printable labels.
- FHIR: `MedicationRequest`, `MedicationDispense`, `AllergyIntolerance`.

### 14.7 Billing & claims
- Users: cashiers, claims officers.
- Transparent itemised charges (`.tnum`, ₦); payment capture (cash/POS/
  transfer/insurance) with receipt (print + PDF); claim submission with claim
  status chips; duplicate-billing guard (same service+patient+day flagged).
- FHIR: `Charge­Item`, `Invoice`, `Claim`, `ClaimResponse`, `PaymentNotice`.

### 14.8 Health records / HIM
- Users: HIM officers, admins.
- Master patient index: merge workflow (side-by-side compare, field-level
  survivorship, §13 confirm, reversible within retention window, fully
  audited); document upload with metadata + confidentiality flags; retention
  and access workflows.
- FHIR: `Patient` (link/merge semantics), `DocumentReference`, `AuditEvent`.

### 14.9 Referrals
- Referral creation (reason, urgency, clinical summary auto-drafted from the
  encounter, attachments), status tracking (sent → acknowledged → completed →
  closed), receiving-facility directory.
- FHIR: `ServiceRequest`, `Task`, `Communication`.

### 14.10 Reporting & dashboards
- Role dashboards assembled from KPI cards + chart blocks; accessible tables
  behind every chart (toggle); export (CSV/PDF) with provenance footer
  (facility, period, generated-by, timestamp); indicator set aligned to NDHI
  national reporting.
- FHIR: `MeasureReport` where applicable.

### 14.11 Administration
- User & role management (RBAC), facility/ward/clinic setup, service & price
  lists, terminology mapping tables, audit log viewer (Timeline block +
  filters + export).

## 15. Connectivity, performance & states

- **Autosave** clinical text every few seconds and on blur; queue failed
  writes with visible retry ("Retrying… · 2 queued"); never silently drop.
- **Optimistic UI** only for safe, reversible actions (marking a queue status);
  NEVER for orders, prescriptions, billing, or sign-off.
- **Sync status** is a first-class UI element on every mutating screen:
  `Saved / Saving… / Offline — will retry / Failed — Retry`.
- **Skeletons** (not spinners) for structured content; spinners only for
  sub-second inline waits; every skeleton matches the final layout.
- **Budgets:** shell JS ≤ 200KB gzip; charts and heavy modules lazy-loaded
  per route; interactive < 3s on a mid-range Android tablet over 3G;
  60fps scrolling on 1,000-row virtualised tables.

## 16. Accessibility acceptance criteria (WCAG 2.2 AA)

Release gates — automated (axe-core) plus a manual keyboard pass per screen:

| # | Criterion | Test |
|---|---|---|
| A1 | Every interactive element keyboard-reachable and operable; order follows visual order | manual Tab pass |
| A2 | Focus visible everywhere, never obscured by sticky UI (2.4.11) | manual |
| A3 | Every input labelled via `Field`; errors specific, adjacent, and summarised with anchors on long forms (3.3.1/3.3.3) | axe + manual |
| A4 | Text & essential icons meet 4.5:1 (3:1 for large text); status never colour-alone (1.4.3/1.4.1) | token table §4 + axe |
| A5 | Touch targets ≥ 24px minimum, ≥ 40px standard (2.5.8) | design review |
| A6 | No keyboard trap except intentional modal focus trap with Escape (2.1.2) | manual |
| A7 | Dragging is never the only way (2.5.7); no content lost at 320px width / 400% zoom (1.4.10) | manual |
| A8 | Auth does not rely on memorising/transcribing (3.3.8) — paste allowed, OTP autocomplete, show-password toggle present | manual |
| A9 | Skip link to main content on every shell (2.4.1) | manual |
| A10 | Live regions: toasts `aria-live=polite`, critical alerts `role=alert` | code review |
| A11 | `prefers-reduced-motion` disables all animation | automated |
| A12 | Data tables have header associations; charts have text/table equivalents | manual |

## 17. Usability testing protocol

Task-based, role-based, on realistic Nigerian facility scenarios, before each
phase's release (AHRQ 2009; NIST 2015). Benchmark tasks:

| # | Scenario | User | Pass threshold |
|---|---|---|---|
| T1 | Find existing patient, avoid duplicate creation | records officer | correct patient < 30s; 0 duplicates; warning understood |
| T2 | Register a new patient | records officer | complete < 4 min; validation self-recovered |
| T3 | Check in + record vitals | nurse | encounter created; correct units; abnormal flag noticed |
| T4 | Document consultation + lab order | doctor | note saved; complete order; context never lost |
| T5 | Receive specimen + enter result | lab scientist | correct order matched; critical result flagged |
| T6 | Prescribe + dispense | doctor + pharmacist | allergy visible pre-sign; status updated |
| T7 | Generate bill + receipt | cashier | accurate charges; receipt produced |
| T8 | Merge duplicate records | HIM officer | risk understood; traceable; zero data loss |

Metrics recorded: task success rate (target ≥ 90%), critical errors (target
0), non-critical error rate, time on task, clicks/steps, help requests,
confidence rating, SUS score (target ≥ 75), accessibility issues found, and
qualitative observations. Failures below threshold block release and feed the
remediation backlog.

## 18. Implementation roadmap

| Phase | Scope | Exit criteria |
|---|---|---|
| 1 Discovery | personas, workflow catalogue, task-risk register, data dictionary, module inventory | signed workflow maps |
| 2 Design foundation | this guide + tokens + component inventory + IA + page templates (✅ largely done — the showcase) | showcase approved |
| 3 HIM/registration pilot | search, registration, appointments, queue | T1/T2 thresholds met |
| 4 Clinical workflows | triage, consultation, orders, lab, pharmacy, results, discharge | T3–T6 met; safety controls audited |
| 5 Revenue & admin | billing, claims, reports, user management, facility setup, audit | T7/T8 met |
| 6 Validation & rollout | usability + accessibility + performance + security + interoperability checks | §16 gates green; pilot report |

## 19. Definition of Done

**Screen review (every screen, every sprint):**

- [ ] Current patient clearly visible on all clinical screens
- [ ] Main workflow completes without unnecessary navigation
- [ ] Fields labelled and mapped to data dictionary / FHIR profile
- [ ] Errors inline + summarised on long forms
- [ ] Keyboard-only operable; focus visible throughout
- [ ] Contrast and target sizes meet §16
- [ ] High-risk actions confirmed and audited
- [ ] Wrong-patient / duplicate / wrong-med / wrong-order / wrong-bill errors designed against
- [ ] Loading, saving, failed-sync, empty states all present
- [ ] Tested (or scheduled) with representative facility users

**Front-end component DoD:**

- [ ] Uses approved tokens and primitives — no raw hex, no forked components
- [ ] Responsive desktop / tablet / facility screen sizes
- [ ] Unit tests for validation + critical state transitions
- [ ] axe passes; manual keyboard test done
- [ ] Clinical safety controls implemented where applicable
- [ ] All copy (labels, errors, empty states, help) reviewed
- [ ] API contract maps to data dictionary + FHIR mapping
- [ ] Audit events emitted per §13
- [ ] Verified end-to-end in a running browser before merge

## 20. References

- AHRQ (2009). *Defining and testing EMR usability.* https://digital.ahrq.gov/health-it-tools-and-resources/health-it-bibliography/usability/defining-and-testing-emr-usability
- HIMSS (2015). *Nine essential principles of software usability for EMRs.* https://newengland.himss.org/resources/nine-essential-principles-software-usability-emrs
- HL7 FHIR Foundation. https://www.fhir.org/
- ISO 9241-210:2019. https://www.iso.org/standard/77520.html
- NIST GCR 15-996 (Wiklund et al., 2015). *Technical basis for user interface design of health IT.* https://www.nist.gov/publications/technical-basis-user-interface-design-health-it
- NHS England. *Digital service manual & design system.* https://service-manual.nhs.uk/design-system
- NDHI. *Relevant documents.* https://www.digitalhealth.gov.ng/relevant-documents
- NDHI (2026). *Nigeria Core FHIR IG (continuous build).* https://build.fhir.org/ig/digitalhealth-gov-ng/Nigeria-Core/branches/main/
- OpenMRS. *The O3 design system and UI tools.* https://openmrs.org/courses/intro-to-openmrs-3-2/lessons/the-o3-design-system-and-ui-tools-2/
- W3C (2023). *WCAG 2.2.* https://www.w3.org/TR/WCAG22/
