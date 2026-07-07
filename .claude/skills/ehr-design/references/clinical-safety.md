# Clinical safety patterns — recipes

UI/UX is a patient-safety control (NIST GCR 15-996). These patterns are
non-negotiable; skipping one is a defect, not a style choice.

## 1. Search before create / duplicate prevention

- Registration MUST run patient search first; "Create new" appears only
  after a search has executed and is never the first/default button on a
  search screen.
- Duplicate candidates (fuzzy match on name + DOB + sex + phone/NIN) surface
  as a **blocking review step**: side-by-side comparison of candidate vs new
  entry, with explicit "Use existing" / "Create new anyway (reason)" actions.
  Proceeding despite the flag REQUIRES a reason; the action and reason are
  audited — never silently allowed.

## 2. High-risk confirmation modal

Required for: merge, delete, void/cancel, overwrite, discharge against
advice, sign-off, high-alert medication actions. Anatomy:

1. The triggering control uses the `danger` button variant — never the same
   visual weight as a routine save.
2. Restates the patient banner inside the modal (name, MRN, age/sex) —
   patient identity sits adjacent to the confirm button, and for bulk
   actions the record type and count are stated.
3. States the consequence in plain language, including irreversibility, with
   "this action will be recorded in the audit log" language where
   irreversible.
4. Confirm button is labelled with the explicit verb ("Merge records",
   "Void order") — never "OK"/"Yes". The safe action holds initial focus;
   Enter/Escape NEVER map to the destructive option.
5. For merge / void / export: an additional reason field or verification
   checkbox ("I have verified these are the same patient") is required, and
   the confirm button stays disabled until it is provided — never
   pre-enabled, never pre-focused.
6. Destructive styling (`rose-ink`) on the confirm; Escape/Cancel always
   available; the event is audited with actor + timestamp.

## 3. Wrong-patient controls

- Patient banner on every clinical screen, sticky (components.md §3).
- Switching patients with an open order basket or unsigned note prompts
  explicitly ("You have 2 unsent orders for Amina Bello — discard or
  return?").
- Order/prescription review screens repeat patient name + MRN at the point
  of signature.

## 4. Alert discipline (fatigue control)

- Interruptive (modal) alerts ONLY for severity ≥ high: allergy match,
  drug–drug interaction above threshold, critical result, duplicate order.
- Everything else is inline and non-blocking (Alert component, warning pair).
- Track override rates; an alert overridden >90% of the time is redesigned
  or demoted. Overrides record actor + reason.

## 5. Critical results

Critical lab/vital values: flagged with the danger pair + word, routed to
the ordering clinician, and require explicit acknowledgement; the ack
(actor, role, timestamp) is stored and shown in the Timeline.

## 6. Audit events

Emit for: create, update, **view of restricted records**, merge, void/
cancel, approve/sign, dispense, bill, export, and all admin actions (user
management, facility config, permission changes). Payload: actor, role,
patient, action, timestamp, before/after where feasible. Audit events are
not user-editable and are queryable by HIM/admin roles. Rendered by the
Timeline block; exportable in the audit viewer.

## 7. Data-integrity guards in UI

- Optimistic UI is FORBIDDEN for orders, prescriptions, billing, sign-off —
  those wait for server confirmation with a saving state. Optimistic updates
  are allowed only for safe, reversible actions (e.g. queue status chip).
- Autosave clinical text (interval + on blur); visible sync state on every
  mutating screen: `Saved · 09:41 / Saving… / Offline — will retry / Failed —
  Retry`. Failed writes queue with visible retry — never silently dropped.
- Offline / failed-sync is a persistent page-level Banner with a next step
  ("Working offline — 2 items will sync when connection returns"), never a
  dismiss-and-forget toast.
- Units rendered by the UI, never typed; range validation before save;
  impossible dates (future DOB, discharge before admission) blocked at field
  level with plain-language errors.
