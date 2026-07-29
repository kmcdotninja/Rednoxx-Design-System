# HIM demo — coverage against the Workflow Catalogue v1.0

**Living tracker.** Updated after every HIM work session. All work is **UI-only** — mock data in
`frontend/src/him/data.ts`, no backend, no persistence beyond the running page.

Statuses:

- **Built** — clickable end-to-end in the demo.
- **Partial** — visible in the UI (data, statuses, governance copy) but not a complete flow.

Verify any row by opening the listed screen at `/him` and following the "Where to check" note.

| ID | Workflow | Status | Where to check |
|---|---|---|---|
| W-HIM-001 | Standard new patient registration | **Built** | Patient index → search → Create new patient → 5-step wizard in the 2xl drawer → duplicate check → MRN issued |
| W-HIM-002 | Registration with NIN | **Built** | Wizard NIN field (optional rule); Add identifier on the record captures NIN with namespace; Verify moves it to verified; masked display |
| W-HIM-003 | Registration without NIN | **Built** | NIN Optional + structured "Reason NIN unavailable" select appears when NIN is empty |
| W-HIM-004 | Alternative ID registration | **Built** | Wizard alt-ID type + number capture (passport, licence, voter card…); Add identifier on the record |
| W-HIM-005 | Foreign patient registration | **Built** | Foreign scenario adds nationality + local-contact fields; passport as alternative ID |
| W-HIM-006 | Returning patient verification | **Built** | Patient record → Verify & route: two-identifier confirmation checkboxes gate the confirm |
| W-HIM-007 | Appointment-linked check-in | **Built** | Appointments & check-in → Check in → identity confirmed against banner → routed |
| W-HIM-008 | Walk-in registration & routing | **Built** | Walk-in scenario: after save, route-now selector issues the queue ticket in the same step |
| W-HIM-009 | Emergency temporary registration | **Built** | Emergency scenario switches the wizard to the rapid path: minimum identity, triage category, TEMP ID issued, reconciliation worklist |
| W-HIM-010 | Unknown / unconscious patient | **Built** | Unknown scenario: placeholder label auto-generates, estimated age, safe temp record + reconciliation |
| W-HIM-011 | Mass casualty rapid registration | **Built** | Mass-casualty scenario: batch count, sequential temp IDs/wristbands, triage per person, casualty event tag |
| W-HIM-012 | Neonate & mother-baby linkage | **Built** | Linked-records card on both records — Baby ↔ Mother (GGH-005027 ↔ GGH-002980), clickable both ways |
| W-HIM-013 | Minor with guardian | **Built** | Minor scenario requires "guardian authority evidence sighted" before save; linked to consent |
| W-HIM-014 | Deceased-on-arrival / deceased status | **Built** | Patient record → Record actions → Mark as deceased (high-risk confirm) |
| W-HIM-015 | Demographic correction | **Built** | Patient record → Record actions → Correct demographics: low-risk fields editable (old values preserved); identity fields locked to supervisor routing |
| W-HIM-016 | Identity document update | **Built** | Add identifier modal captures new evidence with namespace + issuer; starts unverified; never overwrites verified IDs |
| W-HIM-017 | Identifier verification | **Built** | Patient record → Identifiers → Verify on pending identifiers (e.g. Ada Okafor's NIN) |
| W-HIM-018 | Incomplete record completion | **Built** | Incomplete records worklist + document-exception flow (reason-gated, audited) |
| W-HIM-019 | Duplicate detected before save | **Built** | Wizard save → blocking side-by-side review → Use existing / Create new anyway (reason required) |
| W-HIM-020 | Duplicate review queue | **Built** | Duplicates & merge: buckets, search, score-sorted pagination, drawer review, 4 exact decisions |
| W-HIM-021 | Merge approved duplicates | **Built** | Review drawer → survivor selection, reason, verification checkbox, danger confirm |
| W-HIM-022 | Unmerge incorrect merge | **Built** | Duplicates → Decided → open a confirmed pair → Unmerge… (reason-gated; supervisor+admin approval copy; manual reconciliation) |
| W-HIM-023 | Patient search & retrieval | **Built** | Patient index: full register, search across identifiers, status buckets |
| W-HIM-024 | Restricted record & break-glass | **Built** | Hassan Danladi: denied state → break-glass justification → time-bound access banner; DPO review on Overview |
| W-HIM-025 | Document upload & indexing | **Built** | Documents → Upload document: patient confirmed against banner before attach |
| W-HIM-026 | Legacy scanned record indexing | **Built** | Documents → unbound legacy row → Bind to patient… (verify-two-identifiers hint; legacy MRN preserved) |
| W-HIM-027 | Document correction / created-in-error | **Built** | Documents → Created in error… (reason-gated; preserved, never deleted; incident review) |
| W-HIM-028 | Patient record release | **Built** | Releases: queue, detail drawer, approve/reject, fee status |
| W-HIM-029 | Guardian / third-party release | **Built** | Widow's request pends without authority evidence; approval flow works |
| W-HIM-030 | Internal clinical records request | **Built** | Releases → New release request (internal clinical): releases under policy, access logged |
| W-HIM-031 | HMO / claims document request | **Built** | New release request (payer type) queues for approval with payer-agreement authority |
| W-HIM-032 | Consent capture / withdrawal | **Built** | Consents tab: Capture consent (category, scope, source) and Withdraw (confirm modal) |
| W-HIM-033 | Referral registration | **Built** | Referral register + New referral form (patient, direction, facility, service, reason) |
| W-HIM-034 | Coverage capture | **Built** | Coverage tab + wizard step + Check eligibility with payer (result recorded, audited) |
| W-HIM-035 | Queue routing after registration | **Built** | Check-in modal → Route to (clinic/triage/billing/lab) with payer-prerequisite note + ticket |
| W-HIM-036 | Encounter creation / linkage | **Built** | Check-in creates the encounter (visit number issued in confirmation); Encounters tab per record |
| W-HIM-037 | Offline / degraded registration | **Built** | Operations → Add downtime entry (paper form + desk) lands as pending reconciliation |
| W-HIM-038 | Offline sync & reconciliation | **Built** | Reconcile action binds pending rows; Resolve… handles conflicts with keep/accept choice, no silent data loss |
| W-HIM-039 | Legacy migration & binding | **Built** | Migration staging + Sign off batch action (documents exceptions/duplicates, closes rollback window) |
| W-HIM-040 | Audit review & HIM reporting | **Built** | Audit log: filters, search, scoped-export affordance; per-patient audit tabs |
| W-HIM-041 | Data-subject access / rectification | **Built** | Releases → Data-subject requests → Log request (type, patient, statutory due date); queue tracks to closure |
| W-HIM-042 | Archive / inactivate / reactivate | **Built** | Inactive records archive (reason-gated), archived records reactivate; active records stay governance-blocked; status pill updates live |
| W-HIM-043 | Controlled REDNOXX support access | **Built** | Approve session flow (ticket + scope, 60-min time-bound, masked) + session table with expiry |
| W-HIM-044 | HIM configuration change | **Built** | Config change control + Request change form (Facility Admin only; governance approval before activation) |
| W-HIM-045 | FHIR / DHIN payload validation | **Built** | FHIR runs table + per-run detail (validator output, gap logged, remediation, no-conformance-claim rule) |

**Tally: 45 Built · 0 Partial · 0 Not built — full catalogue coverage at demo fidelity.**

## RBAC (cross-cutting, from the user-story catalogue §3)

"Role permissions must be implemented through the Core Platform RBAC model and configured per
facility, department and job function." The demo implements this as `frontend/src/him/rbac.tsx`:

- **5 personas** with the catalogue's exact titles: Front Desk Officer, HIM Officer, HIM
  Supervisor, DPO/Auditor, Facility Admin — each with facility, department, scoped menu and a
  role-appropriate default landing (role-based IA, not permission-hidden items).
- **Role switcher** on the sidebar account card (demo affordance).
- **Permission gates**: register/check-in (front desk+), duplicate decisions (HIM), merge &
  unmerge & release approval & deceased & break-glass & audit export (supervisor; DPO approves
  releases and reviews break-glass), config changes (Facility Admin). Officers confirming a
  duplicate create a merge request for supervisor action instead of merging.
- **No-access state** when a URL outside the role's menu is opened; denied attempts noted as logged.

## Facility administration (actor capability, not a catalogue workflow)

The catalogue defines the Facility Administrator as the actor who "configures facilities,
departments, MRN rules, forms, document types, queues and roles" (§4). The org structure itself
has no workflow ID — W-HIM-044 governs *changes* to configuration. The demo implements the org
spine at `/him/admin`:

- **Facilities → Departments → Wards → Directors**, four tabs over the same screen, each a
  searchable table with codes, type, status and roll-up counts (departments per facility, wards
  per department).
- **Full CRUD on every tab.** Create and edit share one drawer per entity (`him/AdminDrawers.tsx`) —
  multi-field config forms that keep the list visible behind them; edit pre-fills and uniqueness
  checks exclude the record being edited. Validation on submit; codes must be unique (network-wide
  for facilities, per-facility for departments and wards); ward bed count must be a whole number ≥ 1.
- **Row actions** (kebab menu): Edit, Activate/Deactivate (quick status toggle), and Delete. Delete
  is a confirm **modal** (a decision) and is **guarded** — a facility with departments/wards/directors,
  or a department with wards/directors, can't be hard-deleted; the modal explains why and offers
  **Deactivate instead** (the reversible path). Dates use the `DatePicker`, never a typed input.
- **Multi-select + bulk actions**: every table has a checkbox column (with a select-all header). A
  selection raises the floating **`SelectionBar`** (bottom-centre) with Activate, Deactivate, Delete
  and Clear. Bulk delete uses the same dependency guard — blocked rows are kept and reported, the
  rest are removed. The kebab menu is portalled, so it's never clipped by the table's scroll box.
- **Directors** are the facility's appointed offices (Medical Director, CMAC Chairman, Director of
  Administration / Clinical Services / Nursing / Pharmacy / Finance). **One active holder per
  office per facility** — attempting a second names the incumbent and tells you to deactivate that
  appointment first. Email and dd/mm/yyyy appointment date are format-validated; department is
  optional and only offered for the chosen facility.
- **Ward → department is dependent on facility**: changing facility clears the department choice
  rather than leaving a mismatched pair, and the select disables with a "create one first" hint
  when a facility has no departments.
- **RBAC**: Facility Admin (`manageConfig`) can create — it is now their landing page. HIM
  Supervisor sees the same screens **read-only** with an explanatory banner. Every other persona
  gets the standard no-access state.

Seed data lives in `frontend/src/him/data.ts` (4 facilities, 8 departments, 6 wards, 7 directors).
Created rows are held in page state only — UI-only, like the rest of the module.

## Remaining

Every workflow in the catalogue is now **Built at demo fidelity** (UI + mock data, no backend).
What "done" would still mean for a production build — not demo scope:
real persistence and APIs, NIMC/payer integrations, printable outputs, notification delivery,
per-facility configuration storage, and automated tests beyond the current suite.

## Session log

- 07 Jul 2026 — Module scaffolded from the 4 docs: 12 Built / 23 Partial / 10 Not built.
- 07 Jul 2026 (later) — Enrichment + finish pass: appointments & check-in, queue routing, referral
  register, Operations & sync (downtime, migration, config, support, FHIR), unmerge, demographic
  correction, identifier verify, consent withdrawal, DSAR intake, mass-casualty/unknown paths.
  Now **19 Built / 26 Partial / 0 Not built**.
- 07 Jul 2026 (finish pass 2) — RBAC system (5 personas, scoped menus, permission gates,
  no-access state, role switcher); rapid registration paths (emergency/unknown/mass-casualty);
  identifier capture + alt-ID; legacy binding; created-in-error; referral form; eligibility check;
  encounter at check-in; config request form; FHIR run detail; mother-baby linkage. UI fixes:
  banner avatar top-aligned (block + HIM), sidebar role card contained, Dropdown gains `block`.
  Now **33 Built / 12 Partial / 0 Not built**.
- 07 Jul 2026 (finish pass 3) — closed the final 12 Partials: two-identifier verify & route,
  standalone consent capture, archive/reactivate with live status, NIN-unavailable reason,
  foreign/walk-in/minor scenario forms, internal + payer release request form, downtime entry,
  conflict resolve/reconcile, migration batch sign-off, support-session approval. Role switcher
  made visible (chevron + "Switch role") and previewable via ?him-role=. **45 Built / 0 Partial.**
- 07 Jul 2026 (RBAC audit) — Actor audit against the catalogue: RBAC expanded to 12 personas
  (added A&E Registration, Triage Nurse, Clinician, Ward Clerk, Billing, Claims/HMO; DPO split
  from Auditor). Role-scoped overviews per persona. New `requestRelease` permission. Corrections:
  markDeceased → him-officer (W-014), internal requests → clinician (W-030), patients nav →
  dpo/auditor (W-023). Full actor × acceptance-criteria matrix: docs/HIM-ACTOR-MATRIX.md.
- 07 Jul 2026 (SelectMenu) — New design-system primitive `SelectMenu`: custom-rendered option
  panel (listbox semantics, hints, disabled rows, sm size, top/bottom side, uncontrolled mode),
  documented at /design/components/select-menu with 3 unit tests. All 32 native <select> usages
  across the HIM module and product demo replaced. Role duties re-verified verbatim against the
  user-story catalogue §3; Triage Nurse gained verify/route, Clinician gained "Request correction".
- 07 Jul 2026 (overlay fixes) — SelectMenu panel now portals to <body> (fixed positioning,
  auto-flip, scroll-tracking) so it never clips inside Modal/Drawer scroll containers; Escape
  closes the menu only (regression test inside a Modal). Applied the documented overlay rule
  (Modal = blocking decision/high-risk confirm; Drawer = detail/multi-field edit): nine
  creation/edit forms and the FHIR detail moved from Modal to Drawer across Releases,
  Appointments, PatientRecord and Operations.
- 07 Jul 2026 (dialog footers) — Modal and Drawer footers now lay out children right-aligned
  with an 8px gap by default (fix at the primitive, existing wrapped footers unaffected);
  Dialog/Drawer docs updated.
- 08 Jul 2026 — Registration slip: real print preview (Rednoxx letterhead, barcode stand-in,
  print-CSS isolation so only the slip prints). Document previews: click any document row
  (Documents page + patient record) for a letterhead preview drawer, printable. Toast icons
  top-aligned with the title. All HIM form inputs stacked single-column (only date/time pairs
  may sit inline). New ErrorPage block (404/403/500/offline/maintenance) documented at
  /design/blocks/error-pages and wired in: root 404, in-shell 404s for /him/* and /demo/*
  (replacing silent redirects), and the RBAC no-access state upgraded to the 403 page.
- 19 Jul 2026 (workspace + account chrome) — Three new design-system blocks, barrelled and
  showcased: `ModuleSwitcher` (dialog-based switch between top-level workspaces — Care `/demo`
  and HIM `/him`, single source in `src/app/modules.ts`), `UserMenu` (avatar → Profile / Log out,
  distinct from the role switcher), and `ProfileSettings` (reusable self-service profile editor,
  mock data). Wired into the HIM shell: ModuleSwitcher under the sidebar brand (expanded +
  collapsed), the top-bar avatar is now a UserMenu (Profile → new `/him/settings` "My profile"
  page built from the active persona; Log out → workspace hall), and the same into the Care demo.
  Design-system fixes in the same pass: SelectMenu parse-error build break; Field required-asterisk
  colour (gold→rose, AA); Button md height 36→40px; Drawer focus trap + labelling; off-scale type
  sizes; Stepper/Accordion ARIA. UI-only, no backend.
- 21 Jul 2026 (overlay clamping) — Fixed all `Dropdown`-based menus getting clipped/hidden
  (role switcher, facility switcher, user menu). The portalled menu now measures itself and
  clamps to the viewport on both axes, flips to the side with more room, and — when taller than
  the space available (e.g. the 12-persona role menu opening upward from the sidebar foot) — caps
  its height and scrolls internally instead of spilling off-screen. Internal scroll no longer
  self-closes the menu; keyboard focus scrolls into view. One fix at the primitive covers every
  switcher.
- 21 Jul 2026 (registration slip + reprint) — Slip barcode replaced with a real scannable QR of
  the MRN (qrcode.react, SVG, token-coloured via currentColor). Print isolation fixed: a dialog
  panel keeps a persistent transform (animate-* fill-mode both), which made it the containing
  block for the fixed `.print-area` and clipped the slip after the MRN; print now cancels those
  transforms and re-anchors the slip to the viewport, and `print-color-adjust: exact` keeps the
  QR and soft-fill Tags in the output. Patient index (W-HIM-023) gains a per-row **Slip** action
  to view a record's MRN and reprint it without opening the record.
- 22 Jul 2026 (layout width + table wrapping) — Page body now spans the full content column with
  the navbar's own padding (`px-4 sm:px-6`), dropping the centered `max-w-[1180px]`/`lg:px-8` so
  the left edge lines up with the breadcrumb and the right edge with the account menu (HIM + Care
  shells). DataTable cells (th/td) are `whitespace-nowrap` so values no longer wrap to two lines —
  the wider column and the table's `overflow-x-auto` absorb long rows; a column that must wrap can
  style its own cell content. Covers every table (all go through DataTable).
- 22 Jul 2026 (staff CRUD + meter alignment) — Care demo Staff page is now a searchable table with
  full CRUD: one drawer creates and edits, a kebab per row does Edit / Activate-Deactivate / Remove,
  delete is a guarded confirm modal, and a floating SelectionBar does bulk activate/deactivate/remove
  (rows live in page state, UI-only). New design-system `ProgressMeter` (ring + fixed-width,
  right-aligned tabular %) so completeness meters line up perfectly regardless of value — replaces the
  hand-composed ring+label in the HIM Patient index and Incomplete-records tables; reusable anywhere.
- 20 Jul 2026 (facility administration) — New `/him/admin` screen: Facilities / Departments /
  Wards tabs over searchable tables, with **create-in-a-drawer** for all three
  (`him/AdminDrawers.tsx`: `CreateFacilityDrawer`, `CreateDepartmentDrawer`, `CreateWardDrawer`).
  Submit-time validation, uniqueness rules on codes, and a facility→department dependent select on
  the ward form. Org data model added to `him/data.ts` (`HimFacility`, `HimDepartment`, `HimWard`
  + seeds). RBAC: `admin` added to Facility Admin (now their landing) and HIM Supervisor
  (read-only, with banner). Realises the Facility Administrator actor capability; no new catalogue
  workflow. Tally unchanged at **45 Built / 0 Partial**. UI-only, no backend.
- 20 Jul 2026 (directors) — Fourth tab on `/him/admin`: **Directors**, the facility's appointed
  offices, with `CreateDirectorDrawer`. Enforces **one active holder per office per facility**
  (a second attempt names the sitting incumbent), plus email and dd/mm/yyyy date validation and a
  facility-scoped optional department. `HimDirector` + `DIRECTOR_ROLES` + 7 seed directors added to
  `him/data.ts`. Tally unchanged at **45 Built / 0 Partial**. UI-only, no backend.
- 21 Jul 2026 (facility-admin CRUD) — `/him/admin` gains full CRUD on all four tabs. Create + edit
  now share one drawer per entity (`FacilityDrawer`/`DepartmentDrawer`/`WardDrawer`/`DirectorDrawer`,
  seeded on open, uniqueness excludes self). New per-row kebab menu: Edit, Activate/Deactivate,
  Delete. Delete is a guarded confirm modal — blocked while dependents exist (facility→dept/ward/
  director, dept→ward/director), offering "Deactivate instead". Shared Drawer/Modal focus-trap bug
  fixed (inputs no longer lose focus per keystroke); date fields moved to the calendar `DatePicker`.
  Integration tests cover edit-prefill, the delete guard, and ward delete. UI-only, no backend.
- 21 Jul 2026 (bulk actions + table polish) — `/him/admin` tables gain multi-select: a checkbox
  column (select-all) drives a new floating `SelectionBar` block (Activate / Deactivate / Delete /
  Clear); bulk delete reuses the dependency guard (blocked rows kept + reported). Design-system
  work: `DataTable` gains `selectable`/`selectedKeys`/`onSelectionChange` and roomier edge padding;
  `Checkbox` gains a label-less mode (`ariaLabel`); `Dropdown` menus now portal to the body with
  fixed positioning + viewport flip, so row-action menus are never clipped by a table's scroll box.
  Integration test covers select-all → bulk delete. UI-only, no backend.
