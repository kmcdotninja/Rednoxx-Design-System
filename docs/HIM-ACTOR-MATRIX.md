# HIM demo — actor & acceptance-criteria matrix

Maps every workflow (W-HIM-001…045) to its actors **verbatim from the Workflow Catalogue v1.0**,
the demo RBAC role(s) that can perform it, and the SRS/catalogue acceptance criteria with
coverage. ✓ = demonstrable in the UI · △ = represented by copy/state only (demo simplification).

**Demo personas** (`frontend/src/him/rbac.tsx`, switchable from the sidebar account card or
`?him-role=`): `front-desk` Front Desk Officer · `him-officer` HIM Officer · `him-supervisor`
HIM Supervisor · `ae-registration` A&E Registration Officer · `triage-nurse` Triage Nurse ·
`clinician` Clinician · `ward-clerk` Ward Clerk · `billing` Billing Officer · `claims`
Claims / HMO Officer · `dpo` Data Protection Officer · `auditor` Auditor / Compliance Reviewer ·
`facility-admin` Facility Admin.

Actors in the catalogue with **no interactive persona** (represented as data/copy): Patient,
Guardian/Next of Kin, Queue/Appointment/Encounter/Scanner/Identity-Verification Services,
Security/Police Liaison, Incident Commander, Mortuary Officer, Maternity Nurse, Scanning Clerk,
Migration Team (actions proxied to Supervisor/Admin), IT Support, Legal/Compliance, Security
Admin, Product Owner/QA, Enterprise Architect, Payer Representative, REDNOXX Support User
(sessions approved by Facility Admin).

| ID | Primary actor (verbatim) | Supporting (verbatim) | Demo role & gate | Acceptance criteria — coverage |
|---|---|---|---|---|
| 001 | Front Desk / Registration Officer | Patient, HIM Officer, Billing Officer, Queue Service | front-desk, him-officer (`register`) | search-before-create ✓ · mandatory fields ✓ · unique MRN issued ✓ · duplicate result stored ✓ (audit copy) · routable ✓ (walk-in route step) |
| 002 | Front Desk / Registration Officer | Patient, HIM Officer, Identity Verification Service | front-desk, him-officer (`register`); verify: him-officer | NIN in namespace ✓ · masked ✓ · auditable ✓ · NIN-based duplicate check △ (demo checks name-cluster) |
| 003 | Front Desk / Registration Officer | Patient, HIM Officer | front-desk, him-officer | registers without NIN ✓ · never blocks care ✓ · reason recorded ✓ · completeness reportable ✓ (worklist) |
| 004 | Front Desk / Registration Officer | Patient, HIM Officer | front-desk, him-officer | alt-ID in explicit namespace ✓ · searchable by ID ✓ (index searches identifiers) · auditable ✓ · phone ≠ identity ✓ (copy) |
| 005 | Front Desk / Registration Officer | Patient, Billing Officer, Claims Officer | front-desk, him-officer | no-NIN ✓ · identity docs + payer separate ✓ · searchable by passport ✓ · local contact ✓ |
| 006 | Front Desk / Registration Officer | Patient, HIM Officer, Queue Service, Billing Officer | front-desk, ae-registration, him-officer (`checkIn`) | verified, no duplicate ✓ (two-identifier modal) · route audited ✓ (toast copy) · status warnings ✓ (pills + banners) |
| 007 | Front Desk / Registration Officer | Patient, Appointment Service, Queue Service, Clinic Nurse | front-desk, ae-registration, him-officer (`checkIn`) | status → checked-in ✓ · correct queue ✓ (route select) · linked to verified patient ✓ (banner confirm) |
| 008 | Front Desk / Registration Officer | Patient, Queue Service, Billing Officer, Clinic Nurse | front-desk, him-officer (`register`) | linked + routed ✓ (route-now on save) · billing handoff ✓ (billing-first option) · category captured ✓ |
| 009 | A&E Registration Officer | Triage Nurse, Clinician, Guardian/Next of Kin, HIM Officer | ae-registration, front-desk (`register`, rapid path) | temp record + emergency ID ✓ · triage without demographics ✓ · reconciliation queue ✓ |
| 010 | A&E Registration Officer | Triage Nurse, Clinician, Security/Police Liaison, HIM Officer | ae-registration (`register`, unknown scenario) | temp ID care ✓ · unresolved-identity flag ✓ · history preserved on identification △ (copy) |
| 011 | A&E Registration Officer | Triage Nurse, Incident Commander, HIM Supervisor, Clinician | ae-registration (`register`, mass-casualty) | batch temp IDs, no collision ✓ · independently reconcilable ✓ · printable labels △ (copy) · incident report △ (copy) |
| 012 | HIM Officer | Maternity Nurse, Mother/Guardian, Clinician | him-officer | baby↔mother link ✓ (clickable both ways) · multiple births △ · legal rename without history loss △ (copy) |
| 013 | Front Desk / Registration Officer | Guardian, Patient, HIM Officer, Data Protection Officer | front-desk, him-officer (`register`, minor scenario) | guardian relationship ✓ · evidence gates save ✓ · NOK ≠ consent authority ✓ · guardian changes audited △ (copy) |
| 014 | HIM Officer | A&E Clinician, Mortuary Officer, Guardian/NOK, HIM Supervisor | him-officer, clinician, him-supervisor (`markDeceased`) | banner visible ✓ (live status) · routine care blocked ✓ (banner + verify hidden) · audited ✓ |
| 015 | HIM Officer | Patient, Front Desk Officer, HIM Supervisor | him-officer, him-supervisor (`recordActions`) | old+new traceable ✓ (copy + override) · high-risk → approval ✓ (identity fields locked) · dup check on identity change △ (copy) |
| 016 | HIM Officer | Patient, HIM Supervisor | him-officer, him-supervisor (`recordActions`) | stored + searchable ✓ · conflicts blocked △ (copy) · no silent overwrite of verified ✓ (copy + unverified default) |
| 017 | HIM Officer | Patient, Identity Verification Service, HIM Supervisor | him-officer, him-supervisor (`recordActions`) | status stored + visible ✓ (pills) · source/date recorded ✓ (toast copy) · audit evidence ✓ (audit event) |
| 018 | HIM Officer | Front Desk Officer, Patient, HIM Supervisor | him-officer, him-supervisor (`documentException`) | completeness recalculated ✓ (rings) · gaps in reports ✓ (overview card) · stays on worklist ✓ · exception audited ✓ |
| 019 | Front Desk / Registration Officer | HIM Officer, HIM Supervisor | front-desk, him-officer (`register`) | warning before save ✓ (blocking review) · override needs reason+permission ✓ · routed to worklist ✓ (audit event) |
| 020 | HIM Officer | HIM Supervisor, Front Desk Officer, Clinician | him-officer, him-supervisor (`decideDuplicates`) | 4 exact decision statuses ✓ · confirmed → merge request ✓ (officer queues, supervisor merges) · rejected clears warning ✓ |
| 021 | HIM Supervisor | HIM Officer, Billing Officer, Clinician, Claims Officer | him-supervisor only (`merge`) | merged redirects to survivor ✓ (merged pill + banner) · nothing deleted ✓ (copy) · merge audit ✓ (event) |
| 022 | HIM Supervisor | HIM Officer, Auditor, Clinical/Billing Reps | him-supervisor only (`unmerge`) | full audit ✓ (copy) · ambiguous → manual tasks ✓ (copy) · approval required ✓ (supervisor+admin copy) |
| 023 | Authorised User | HIM Officer, Clinician, Front Desk Officer, Auditor | all personas with `patients` nav (incl. dpo, auditor) | relevant matches ✓ · masked by role △ (static mask) · status warnings ✓ · view audited △ (copy) |
| 024 | Clinician or HIM Supervisor | Data Protection Officer, Auditor, Security Admin | clinician, him-supervisor (`breakGlass`); review: dpo | unauthorised denied ✓ (no-access state) · justification + audit ✓ · review list ✓ (DPO overview + audit filter) |
| 025 | HIM Officer | Patient, Clinician, Scanner Service | him-officer, him-supervisor (`uploadDocuments`) | correct patient ✓ (banner confirm) · metadata ✓ · audited ✓ (copy) · file validation ✓ (FileUpload size/type) |
| 026 | HIM Officer | Scanning Clerk, HIM Supervisor, Migration Team | him-officer, him-supervisor (`uploadDocuments`) | bound or held in queue ✓ · legacy MRN searchable ✓ (identifier) · batch evidence ✓ (migration staging) |
| 027 | HIM Officer | HIM Supervisor, Clinician, Auditor | him-officer, him-supervisor (`uploadDocuments`) | original auditable ✓ · created-in-error/superseded, no delete ✓ · wrong-patient remediation ✓ (incident copy) |
| 028 | HIM Officer | Patient, HIM Supervisor, DPO, Billing Officer | request: `requestRelease`; approve: him-supervisor, dpo | requester/scope/approver recorded ✓ · authorised content only ✓ (min-necessary copy) · fee handoff ✓ (fee pill) |
| 029 | HIM Officer | Guardian/NOK, HIM Supervisor, DPO, Legal/Compliance | approve: him-supervisor, dpo (`approveRelease`) | no release without authority ✓ (pended state) · rejections logged ✓ (audit event) · scoped package ✓ (copy) |
| 030 | Clinician | HIM Officer, HIM Supervisor, Ward Clerk | clinician, him-officer (`requestRelease`, internal type) | linked to patient+requester ✓ · limited to required records ✓ (scope) · trackable ✓ (released status + access-log copy) |
| 031 | Claims / HMO Officer | HIM Officer, Billing Officer, HIM Supervisor, Payer Rep | claims (`requestRelease`, payer type) | package linked to patient/encounter/payer ✓ · approved + audited ✓ · status trackable ✓ (queue) |
| 032 | HIM Officer | Patient, Guardian, Clinician, DPO | him-officer, him-supervisor (`recordActions`) | linked to patient+scope ✓ · treatment vs disclosure ✓ · withdrawal changes future behaviour ✓ (copy) · audited ✓ |
| 033 | Front Desk / Registration Officer | Patient, Referring Facility, Clinician, HIM Officer | front-desk, ae-registration, him-officer (`checkIn`) | context preserved ✓ (register) · routed ✓ (status) · referral document indexed △ (copy) |
| 034 | Front Desk / Registration Officer | Patient, Billing Officer, Claims Officer, Payer/HMO | capture: `register`; check: `recordActions`; view: billing, claims | payer separate from identity ✓ · billing retrievable ✓ (coverage tab, billing/claims roles) · eligibility trackable ✓ (check action) |
| 035 | Front Desk / Registration Officer | Queue Service, Clinic Nurse, Billing Officer | front-desk, ae-registration, him-officer (`checkIn`) | correct queue + priority ✓ (route select, payer gate) · links patient+visit ✓ (ticket + visit no.) · rerouting audited △ (copy) |
| 036 | Front Desk / Registration Officer | Clinician, Billing Officer, Queue Service, Encounter Service | via check-in (`checkIn`) | encounter linked ✓ (visit number) · same context downstream ✓ (encounters tab) · duplicate-encounter control △ (copy) |
| 037 | Front Desk / Registration Officer | HIM Supervisor, IT Support, A&E Registration Officer | capture surfaced under Operations (supervisor/admin) △ | controlled temp identity ✓ · all records reconcile ✓ (statuses) · no silent MRN creation ✓ (copy) |
| 038 | HIM Officer | IT Support, HIM Supervisor, Front Desk Officer | him-supervisor, facility-admin (ops actions) | every record has status ✓ · high-risk fields never auto-resolve ✓ (manual choice) · batch closure △ (copy) |
| 039 | Migration Team | HIM Officer, HIM Supervisor, Data Quality Lead, IT Support | proxied: him-supervisor, facility-admin (sign-off) | traceable to source ✓ (batch table) · legacy MRNs searchable ✓ · exceptions documented ✓ · rollback △ (copy) |
| 040 | Auditor / Compliance Reviewer | HIM Supervisor, DPO, Facility Administrator | auditor, dpo, him-supervisor, facility-admin | shows reg/update/merge/release/restricted events ✓ (filters) · exports controlled+logged ✓ (copy) · auditor read-only ✓ (no mutating perms) |
| 041 | Data Protection Officer | HIM Officer, Patient, HIM Supervisor, Legal/Compliance | dpo, him-officer, him-supervisor (`logDsar`) | tracked receipt→closure ✓ (due dates, overdue) · outcome auditable △ (copy) · rectification updates record ✓ (correction flow) |
| 042 | HIM Supervisor | HIM Officer, Auditor, Clinician, DPO | him-officer, him-supervisor (`recordActions`) | safe visible status change ✓ (live pill) · history intact ✓ (copy) · audited ✓ · reactivation approval △ (reason-gated) |
| 043 | REDNOXX Support User | Facility Administrator, Security Admin, DPO, Auditor | approve: facility-admin (`manageConfig`) | no default access ✓ (copy) · time-limited + auditable ✓ (window, expiry) · automatic removal △ (auto-expire copy) |
| 044 | Facility Administrator | HIM Supervisor, Product Owner, QA, Security Admin | facility-admin only (`manageConfig`) | approved/tested/auditable ✓ (statuses + notes) · safety-critical not bypassed ✓ (rejected example) · users informed △ (copy) |
| 045 | Integration/FHIR Service | Enterprise Architect, HIM Officer, QA, DPO, Security Admin | view: him-supervisor, dpo, auditor, facility-admin | validates or documented warnings ✓ (results + detail) · authenticated exchange △ (copy) · conformance not overstated ✓ (fail + gap note) |

## Where the duties are stated (provenance)

- **Duties per actor**: User Story Catalogue §3 actor table (lines 40–60) — quoted verbatim into
  the persona design. Examples: Front Desk "Registers patients, verifies returning patients,
  checks in appointments and routes patients to queues"; HIM Supervisor "Approves high-risk
  updates, merge/unmerge, record-release decisions and HIM quality actions"; Auditor "Reviews
  access logs, restricted record events, release logs, merge history and compliance evidence."
- **Actors per workflow**: each W-HIM entry's primary/supporting actor lines in the Workflow
  Catalogue (extracted verbatim into this matrix), cross-checked against the catalogue's master
  matrix (user-story doc, lines 77+).
- **Interpretation (not doc-stated, design decisions)**: persona display names, default landing
  pages, exact menu composition, and the translation of "supporting actor" into read vs write
  permissions — chosen to satisfy the design skill's role-based-IA rule.
- **Refinements from re-verification**: Triage Nurse gained verify/route (duty: "validates
  minimal identity, prioritises"); Clinician gained a "Request correction" affordance (duty:
  "may initiate internal records or correction requests").

## Gaps this audit found and fixed in the demo

1. **Missing personas** — added A&E Registration Officer, Triage Nurse, Clinician, Ward Clerk,
   Billing Officer, Claims/HMO Officer, and split DPO from Auditor (12 personas total).
2. **W-HIM-014** — deceased status is primarily an HIM Officer action (with clinician evidence);
   `markDeceased` extended to him-officer.
3. **W-HIM-030** — internal clinical requests belong to the Clinician; clinician gained
   `requestRelease` and the Releases area.
4. **W-HIM-023** — Auditor and DPO are supporting actors on search; both gained the Patient index
   (read-only — every mutating action stays permission-gated).
5. **New `requestRelease` permission** — separates raising a release request (officer, clinician,
   claims, DPO) from approving one (supervisor, DPO).

## Known demo simplifications (all flagged △ above)

Duplicate detection keys on the seeded name-cluster rather than a scoring engine; masking is
static; "printable" outputs, batch-closure reports, referral-document indexing, legal rename and
multi-birth views are copy-level; downtime capture lives under Operations rather than a
degraded-mode front-desk screen.
