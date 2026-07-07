# Module workflows — screen-level requirements

Eleven modules. Each lists primary users, concrete screen requirements, and
safety controls. FHIR mappings for every module live in
[fhir-mapping.md](fhir-mapping.md); safety pattern recipes in
[clinical-safety.md](clinical-safety.md).

Optimize the daily loop: **find patient → register → check in → vitals →
consult → order → review → bill → dispense → discharge.** Count clicks;
usability thresholds are in definition-of-done.md.

## 1. Patient registration & search
- **Users:** records officers.
- Search-first workspace: one search box accepting name / MRN / phone / NIN;
  results table (`.tnum` identifiers); **"Create new patient" appears only
  after a search has run.**
- Registration wizard (Stepper): Identity → Contact → Next of kin →
  Insurance/payment → Consent. Inline validation with format hints shown
  BEFORE the error occurs; NIN/phone format checks; optional photo capture;
  consent + privacy notice recorded with timestamp before finalising.
- Duplicate detection is a blocking review step (see clinical-safety.md §1).
- Generated patient ID/MRN shown prominently on success + printable slip.

## 2. Appointments & queue
- **Users:** records officers, nurses.
- Booking starts as a simple date/time/provider picker — the full calendar
  grid is progressive disclosure, not the first load. Booking modal ≤6
  fields; reschedule = drag or edit with reason. Walk-in fast path (book +
  check-in in one step).
- Queue board: waiting → triaged → in-consult → done. Status chips are
  colour + text; role-filtered views (records see registration queue, nurses
  see triage queue, clinicians see their room).

## 3. Triage & vitals
- **Users:** nurses.
- Keyboard-first vitals grid; tab order matches the physical recording order:
  temp → pulse → BP (sys/dia) → RR → SpO₂ → weight/height (BMI auto) → pain
  score. Numeric-keypad-friendly inputs; units rendered by the UI; range
  validation with abnormal flag = status pair + word; re-take affordance.
- Per-vital trend view (result-trend block) one click away.

## 4. Consultation documentation
- **Users:** doctors.
- Workspace: patient banner → summary rail (allergies, active meds, recent
  results) → structured note (presenting complaint, history, examination,
  diagnosis with ICD-10 typeahead, plan) → order/prescribe panel.
- Autosave with visible indicator; previous encounters via progressive
  disclosure; sign-off is a high-risk confirmation + audit event.
- Switching patients with an unsigned note prompts explicitly.

## 5. Orders & laboratory
- **Users:** doctors (order), lab scientists (process).
- Order basket: accumulate orders, single review+sign; each order shows
  ordering clinician, date/time, specimen, priority, status.
- Lab board: ordered → collected → received → resulted → verified. Barcode/ID
  entry selects the order; result entry validates against reference ranges;
  out-of-range values flagged before save; critical results trigger the
  acknowledgement flow.

## 6. Pharmacy & medication
- **Users:** doctors (prescribe), pharmacists (dispense).
- Prescription row: drug typeahead (national list) · dose · route ·
  frequency · duration · quantity (auto-computed) · instructions.
- Allergy + interaction warnings inline at prescribe time (danger pair);
  high-alert medications require the high-risk confirmation.
- Dispensing queue with status chips; printable labels; partial-dispense
  recorded with reason.

## 7. Billing & claims
- **Users:** cashiers, claims officers.
- Itemised charges (`.tnum`, ₦); payment capture: cash / POS / transfer /
  insurance; receipt (print + PDF) immediately available; payment history on
  the patient account.
- Claim submission with status chips; rejected claims carry the payer reason
  and a resubmit path.
- Duplicate-billing guard: same service + patient + day flags for review.

## 8. Health records / HIM
- **Users:** HIM officers, admins.
- Master patient index; merge workflow: side-by-side compare → field-level
  survivorship choices → high-risk confirm → reversible within retention
  window → fully audited.
- Document upload with metadata (type, date, author, confidentiality flag);
  restricted-record access workflows; retention rules surfaced.

## 9. Referrals
- Creation: reason, urgency, clinical summary auto-drafted from the
  encounter, attachments, receiving-facility directory search.
- Status tracking: sent → acknowledged → completed → closed, with timestamps
  and actors; closure requires outcome note.

## 10. Reporting & dashboards
- Role dashboards from KPI cards + chart blocks; every chart has an
  accessible table toggle; facility/program/period filters as chips.
- Export (CSV/PDF) controls clearly labelled with the data scope being
  exported, plus a provenance footer: facility, period, generated-by,
  timestamp. Indicators aligned to NDHI national reporting.

## 11. Administration
- User & role management (RBAC), facility/ward/clinic setup, service & price
  lists, terminology mapping tables, audit log viewer (Timeline block with
  filters + export).
- Bulk/admin actions affecting multiple records (permission changes,
  facility config, user deactivation) follow the high-risk confirmation
  pattern and are fully audited; menu changes are verified against every
  role's expected navigation before shipping.

## Cross-cutting screen requirements
- Patient banner on every clinical screen (components.md §3).
- Every list/detail screen defines loading (skeleton), empty, and error
  states, plus sync status where the screen mutates data.
- Role-based experiences are real information architecture: each role
  (doctor, nurse, lab, pharmacist, records, cashier, HIM/admin, manager)
  gets a menu, dashboard, and default landing screen scoped to its frequent
  tasks — not one generic menu with permission-hidden items. The design
  system itself never varies by role.
- Reporting filters always show their active state as a visible summary —
  never hidden in a collapsed panel with no indication filters are applied.
- Language: Nigerian facility vocabulary, standards-compatible; never
  "case"/"file"/"record" without defined meaning.
