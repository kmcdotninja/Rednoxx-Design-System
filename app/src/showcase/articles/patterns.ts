import type { Article } from './types'

const SAFETY_SOURCE = '.claude/skills/ehr-design/references/clinical-safety.md'
const FHIR_SOURCE = '.claude/skills/ehr-design/references/fhir-mapping.md'

/**
 * Clinical patterns — the section that makes this an EHR design system rather
 * than a generic component library. Ported from the normative guide; the
 * markdown stays the source of truth and each page names the file it came from.
 */
export const PATTERN_ARTICLES: Article[] = [
  {
    slug: 'overview',
    title: 'Overview',
    summary:
      'UI/UX here is a patient-safety control, not styling. These patterns are non-negotiable — skipping one is a defect, not a style choice.',
    blocks: [
      {
        kind: 'p',
        text: 'Components and blocks tell you what to build with. Patterns tell you what the interface must do when a mistake would reach a patient. They cut across every module, so they live above the library rather than inside any one component.',
      },
      {
        kind: 'callout',
        tone: 'danger',
        title: 'The golden rule',
        text: 'If a screen or component is not covered by an explicit rule, default to the strictest applicable pattern — more confirmation, more context, more accessibility — never the fastest to build.',
      },
      { kind: 'h', text: 'How the groups divide' },
      {
        kind: 'table',
        head: ['Group', 'Answers'],
        rows: [
          ['Clinical safety', 'What stops a wrong-patient, wrong-dose or wrong-order event?'],
          ['Workflow', 'How does a multi-step clinical task hold together across screens?'],
          ['Data & interoperability', 'How do fields map to FHIR, codes and time?'],
          ['Access & audit', 'Who may see this, and what record does the system keep?'],
        ],
      },
      { kind: 'h', text: 'Standards these patterns encode' },
      {
        kind: 'list',
        items: [
          'NIST GCR 15-996 — UI/UX as a patient-safety control.',
          'WCAG 2.2 AA — the accessibility floor for every clinical screen.',
          'AHRQ 2009 / NIST 2015 — the usability testing protocol behind the review checklist.',
        ],
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'patient-identification',
    title: 'Patient identification',
    summary:
      'Wrong-patient controls — the banner, the switch prompt, and identity at the point of signature.',
    blocks: [
      { kind: 'h', text: 'The rules' },
      {
        kind: 'list',
        items: [
          'A patient banner sits on every clinical screen, and it is sticky — identity must never scroll out of view.',
          'Switching patients with an open order basket or an unsigned note prompts explicitly: “You have 2 unsent orders for Amina Bello — discard or return?”',
          'Order and prescription review screens repeat patient name + MRN at the point of signature, adjacent to the confirm control.',
        ],
      },
      {
        kind: 'callout',
        tone: 'danger',
        title: 'Identity sits next to the commit',
        text: 'The failure mode is a clinician confirming the right action against the wrong record. Patient identity must be readable without moving your eyes away from the button you are about to press.',
      },
      { kind: 'h', text: 'Build it from' },
      {
        kind: 'list',
        items: [
          'Patient banner block — the canonical identity strip (name, MRN, age/sex, alerts).',
          'Confirmation modal from Overlay patterns — restates the banner inside the dialog.',
        ],
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'alerts',
    title: 'Allergies & alerts',
    summary: 'Alert discipline — interruptive only for severity ≥ high, everything else inline.',
    blocks: [
      { kind: 'h', text: 'When an alert may interrupt' },
      {
        kind: 'p',
        text: 'Modal alerts are reserved for severity ≥ high. Everything else is inline and non-blocking, using the Alert component in its warning pair.',
      },
      {
        kind: 'table',
        head: ['Severity', 'Presentation', 'Examples'],
        rows: [
          ['High — interruptive', 'Modal, blocks the action', 'Allergy match, drug–drug interaction above threshold, critical result, duplicate order'],
          ['Medium — inline', 'Alert component in flow, non-blocking', 'Renal dosing note, missing baseline observation'],
          ['Low — passive', 'Badge or hint text', 'Formulary preference, non-urgent care gap'],
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Fatigue is a safety failure',
        text: 'Track override rates. An alert overridden more than 90% of the time is redesigned or demoted — a warning nobody reads is worse than no warning, because it trains dismissal.',
      },
      { kind: 'h', text: 'Overrides' },
      {
        kind: 'list',
        items: [
          'Every override records actor and reason.',
          'Status is never colour-alone — soft fill, AA text, and the word.',
        ],
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'numeric-entry',
    title: 'Dose, units & numeric entry',
    summary: 'Units are rendered by the UI, never typed. Ranges validate before save.',
    blocks: [
      {
        kind: 'dodont',
        do: [
          'Render the unit as UI chrome beside the field.',
          'Validate against a clinical range before save.',
          'Use tabular figures (.tnum) for any updating number.',
          'Block impossible values at field level with plain-language errors.',
        ],
        dont: [
          'Let the clinician type “mg” into a free-text field.',
          'Accept a future date of birth, or a discharge before admission.',
          'Defer range checking to the server round-trip.',
          'Use a leading decimal point — “.5 mg” reads as “5 mg”.',
        ],
      },
      { kind: 'h', text: 'Numeral conventions' },
      {
        kind: 'list',
        items: [
          'Always a leading zero: 0.5 mg, never .5 mg.',
          'Never a trailing zero: 5 mg, never 5.0 mg — a missed decimal point is a tenfold error.',
          'A space between value and unit: 5 mg, not 5mg.',
        ],
      },
      {
        kind: 'callout',
        tone: 'danger',
        title: 'Tenfold errors are a decimal point',
        text: 'The leading- and trailing-zero rules are the two highest-yield typographic controls in medication safety. They are enforced in copy as well as in fields — see Content → Punctuation & numerals.',
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'order-signing',
    title: 'Order entry & signing',
    summary:
      'Orders, prescriptions, billing and sign-off never use optimistic UI — they wait for the server.',
    blocks: [
      { kind: 'h', text: 'No optimistic UI' },
      {
        kind: 'p',
        text: 'Optimistic updates are forbidden for orders, prescriptions, billing and sign-off. Those actions show a saving state and wait for server confirmation. Optimistic updates are allowed only for safe, reversible things — a queue status chip, for example.',
      },
      { kind: 'h', text: 'Sync state is always visible' },
      {
        kind: 'code',
        label: 'The four states every mutating screen shows',
        code: `Saved · 09:41
Saving…
Offline — will retry
Failed — Retry`,
      },
      {
        kind: 'list',
        items: [
          'Autosave clinical text on an interval and on blur.',
          'Failed writes queue with a visible retry — never silently dropped.',
          'Offline or failed sync is a persistent page-level Banner with a next step (“Working offline — 2 items will sync when connection returns”), never a dismiss-and-forget toast.',
        ],
      },
      { kind: 'h', text: 'At the point of signature' },
      {
        kind: 'list',
        items: [
          'Patient name + MRN are repeated on the review screen.',
          'The signing action is audited with actor, role and timestamp.',
        ],
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'result-flagging',
    title: 'Result flagging',
    summary: 'Critical values are flagged, routed, and explicitly acknowledged.',
    blocks: [
      {
        kind: 'steps',
        items: [
          'Flag the value with the danger pair plus the word — never colour alone.',
          'Route it to the ordering clinician.',
          'Require explicit acknowledgement; the value cannot pass silently.',
          'Store the ack (actor, role, timestamp) and surface it in the Timeline.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Abnormal is not critical',
        text: 'Abnormal values are flagged inline. Critical values additionally route and require acknowledgement. Keep the two visually distinct so the escalation still means something.',
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'override',
    title: 'Override & reason-for-action',
    summary:
      'Proceeding past a safety flag always costs a reason, and the reason is audited.',
    blocks: [
      {
        kind: 'p',
        text: 'Where the system has flagged a risk and the clinician is permitted to continue anyway, the override is an explicit, recorded act — never a silent dismissal.',
      },
      {
        kind: 'list',
        items: [
          'A reason is required, not optional; the confirm control stays disabled until it is provided.',
          'The action and its reason are audited with actor and timestamp.',
          'The override never becomes the default or pre-focused path.',
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Duplicate creation is an override',
        text: '“Create new anyway” after a duplicate match is the same pattern: blocking review, explicit choice, mandatory reason, audit entry.',
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'destructive-actions',
    title: 'Destructive actions',
    summary:
      'The high-risk confirmation modal — required for merge, delete, void, overwrite, DAMA, sign-off and high-alert medication actions.',
    blocks: [
      { kind: 'h', text: 'Anatomy' },
      {
        kind: 'steps',
        items: [
          'The triggering control uses the danger variant — never the same visual weight as a routine save.',
          'The modal restates the patient banner (name, MRN, age/sex); for bulk actions it states the record type and count.',
          'It states the consequence in plain language, including irreversibility, with “this action will be recorded in the audit log” where irreversible.',
          'The confirm button carries the explicit verb — “Merge records”, “Void order” — never “OK” or “Yes”.',
          'For merge, void or export: a reason field or verification checkbox (“I have verified these are the same patient”) is required, and confirm stays disabled until it is provided.',
          'Destructive styling on confirm; Escape and Cancel always available; the event is audited with actor and timestamp.',
        ],
      },
      {
        kind: 'callout',
        tone: 'danger',
        title: 'Focus and keys',
        text: 'The safe action holds initial focus. Enter and Escape must never map to the destructive option, and confirm is never pre-enabled or pre-focused.',
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'search-before-create',
    title: 'Search before create',
    summary: 'Registration runs a patient search first. “Create new” is never the default button.',
    blocks: [
      {
        kind: 'list',
        items: [
          'Registration MUST run patient search first.',
          '“Create new” appears only after a search has executed, and is never the first or default button on a search screen.',
        ],
      },
      { kind: 'h', text: 'Duplicate candidates' },
      {
        kind: 'p',
        text: 'Fuzzy matches on name + DOB + sex + phone/NIN surface as a blocking review step: a side-by-side comparison of candidate against new entry, with explicit “Use existing” and “Create new anyway (reason)” actions.',
      },
      {
        kind: 'callout',
        tone: 'danger',
        title: 'Never silently allowed',
        text: 'Proceeding despite a duplicate flag requires a reason. The action and the reason are both audited.',
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'worklist',
    title: 'Queue & worklist',
    summary: 'Shared work surfaces — ordering, claiming, and staleness.',
    blocks: [
      {
        kind: 'list',
        items: [
          'Order is clinically meaningful (triage acuity, wait time) and never reordered by usage — predictable placement is an accessibility requirement (WCAG consistent navigation).',
          'Claiming an item shows who holds it; a stale claim is visible rather than silently released.',
          'Queue status chips are the one place optimistic UI is allowed — they are safe and reversible.',
        ],
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'merge',
    title: 'Duplicate & merge',
    summary: 'Side-by-side comparison, mandatory verification, full audit, and a route back.',
    blocks: [
      {
        kind: 'steps',
        items: [
          'Present the two records side by side, field for field, with differences marked.',
          'Require the verification checkbox — “I have verified these are the same patient”.',
          'Confirm with the explicit verb “Merge records”.',
          'Audit the merge with actor, role, both record identifiers and timestamp.',
          'Keep unmerge reachable — a merge is reversible in the record, not in the user’s memory.',
        ],
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'fhir',
    title: 'FHIR resource mapping',
    summary: 'Every clinical field names the FHIR resource and element it persists to.',
    blocks: [
      {
        kind: 'p',
        text: 'Field-level mapping is part of the screen spec, not an afterthought — it is what keeps the UI and the data contract from drifting. Read the mapping reference before wiring any field that persists.',
      },
      {
        kind: 'table',
        head: ['Screen area', 'FHIR resource'],
        rows: [
          ['Patient banner, registration, demographics', 'Patient'],
          ['Encounter header, visit context', 'Encounter'],
          ['Vitals, observations, results', 'Observation'],
          ['Allergies', 'AllergyIntolerance'],
          ['Diagnoses, problem list', 'Condition'],
          ['Lab and imaging orders', 'ServiceRequest'],
          ['Prescriptions', 'MedicationRequest'],
          ['Coverage, claims', 'Coverage, Claim'],
          ['Consent, release of information', 'Consent'],
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Mapping lives with the field',
        text: 'When a form field changes, the mapping changes in the same commit. The reference file is the contract.',
      },
    ],
    source: FHIR_SOURCE,
  },
  {
    slug: 'coded-values',
    title: 'Coded values',
    summary: 'SNOMED, LOINC and ICD — how coded fields behave in the UI.',
    blocks: [
      {
        kind: 'list',
        items: [
          'Coded fields use Combobox with server-side search — never a free-text input that is coded later.',
          'The display term and the code are both visible; the code is what persists.',
          'An uncoded entry is an explicit state, not an empty one — it is flagged for coding rather than silently saved.',
        ],
      },
    ],
    source: FHIR_SOURCE,
  },
  {
    slug: 'dates',
    title: 'Dates, times & timezones',
    summary: 'Clinical time is unambiguous, tabular, and facility-local.',
    blocks: [
      {
        kind: 'list',
        items: [
          'Times display in facility-local time with the zone stated wherever a record crosses facilities.',
          'Date fields block impossible values at field level — a future date of birth, a discharge before an admission.',
          'All timestamps use tabular figures so columns align and changes are legible.',
        ],
      },
    ],
    source: FHIR_SOURCE,
  },
  {
    slug: 'rbac',
    title: 'RBAC & permission states',
    summary: 'Absent permission is a designed state, not a broken screen.',
    blocks: [
      {
        kind: 'dodont',
        do: [
          'Hide actions the role can never perform.',
          'Disable, with an explanation, actions the role could perform in another context.',
          'Give “no access” its own designed page with a route onward.',
        ],
        dont: [
          'Render a dead control that errors on click.',
          'Show a raw 403 inside the product frame.',
          'Rely on hiding alone — the server still enforces.',
        ],
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'break-glass',
    title: 'Break-glass access',
    summary: 'Emergency access is granted, loudly recorded, and reviewed.',
    blocks: [
      {
        kind: 'steps',
        items: [
          'State plainly what is being accessed and that the access is recorded.',
          'Require a reason before entry — never a bare confirm.',
          'Grant access for the encounter, not indefinitely.',
          'Emit an audit event for the view of a restricted record, and route it to the break-glass review queue.',
        ],
      },
      {
        kind: 'callout',
        tone: 'danger',
        title: 'Viewing is an auditable action',
        text: 'For restricted records, reading is an audited event in its own right — not just creating or editing.',
      },
    ],
    source: SAFETY_SOURCE,
  },
  {
    slug: 'audit-trail',
    title: 'Audit trail display',
    summary: 'What the system records, and how the Timeline block renders it.',
    blocks: [
      { kind: 'h', text: 'Events that must be emitted' },
      {
        kind: 'p',
        text: 'Create, update, view of restricted records, merge, void or cancel, approve or sign, dispense, bill, export — and all admin actions including user management, facility config and permission changes.',
      },
      { kind: 'h', text: 'Payload' },
      {
        kind: 'list',
        items: [
          'Actor, role, patient, action, timestamp — and before/after values where feasible.',
          'Audit events are not user-editable.',
          'They are queryable by HIM and admin roles, rendered by the Timeline block, and exportable from the audit viewer.',
        ],
      },
    ],
    source: SAFETY_SOURCE,
  },
]
