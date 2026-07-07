# Definition of Done, testing protocol & budgets

Run these before marking any component, screen, or PR complete. **A skipped
item must be explicitly justified as low-risk/not-applicable — never skipped
silently.**

## 1. Screen-review checklist (every screen, every sprint)

- [ ] Current patient clearly visible on all clinical screens (banner)
- [ ] Main workflow completes without unnecessary navigation — clicks counted
- [ ] Fields labelled and mapped to data dictionary / FHIR profile
- [ ] Errors inline + summarised (with anchors) on long forms
- [ ] Keyboard-only operable; focus visible throughout
- [ ] Contrast and target sizes meet accessibility.md gates
- [ ] High-risk actions confirmed per clinical-safety.md and audited
- [ ] Wrong-patient / duplicate / wrong-med / wrong-order / wrong-bill errors designed against
- [ ] Loading (skeleton), empty, error, and sync states all present
- [ ] Tested (or scheduled) with representative facility users

## 2. Front-end component/feature DoD

- [ ] Uses approved tokens and primitives — no raw hex, no forked components
- [ ] TypeScript types explicit for all props touching clinical/patient data — no `any`
- [ ] Responsive: desktop, tablet, common facility screen sizes; 320px holds
- [ ] Unit tests cover validation logic and critical UI state transitions
- [ ] axe-core passes; manual keyboard pass completed
- [ ] Clinical safety controls implemented where applicable
- [ ] All copy reviewed: labels, errors, empty states, help text
- [ ] API contract maps to data dictionary + FHIR mapping
- [ ] Audit events emitted per clinical-safety.md §6
- [ ] **Verified end-to-end in a running browser before merge** (use the
      project `verify` skill — a passing build is not verification)

## 2a. Reviewing a PR (yours or someone else's) — ask in order

1. Would this screen be safe and fast for a busy, possibly-first-time user
   under real facility conditions (poor connectivity, tablet, high volume)?
2. Could it contribute to a wrong-patient, wrong-medication, wrong-order,
   duplicate-record, or wrong-billing error? If yes, has clinical-safety.md
   been applied?
3. Could a keyboard-only or screen-reader user complete this task? If
   unsure, test — don't assume.
4. Does every colour-conveyed state also have a text label?
5. Is every new/changed field's FHIR mapping and validation rule documented
   somewhere findable?

## 3. Usability testing protocol (AHRQ 2009; NIST 2015)

Task-based, role-based, realistic Nigerian facility scenarios, before each
release phase. Benchmark tasks and thresholds:

| # | Scenario | User | Pass threshold |
|---|---|---|---|
| T1 | Find existing patient, avoid duplicate | records officer | correct patient <30s; 0 duplicates; warning understood |
| T2 | Register new patient | records officer | complete <4 min; validation self-recovered |
| T3 | Check in + record vitals | nurse | encounter created; correct units; abnormal flag noticed |
| T4 | Document consultation + lab order | doctor | note saved; complete order; context never lost |
| T5 | Receive specimen + enter result | lab scientist | correct order matched; critical result flagged |
| T6 | Prescribe + dispense | doctor + pharmacist | allergy visible pre-sign; status updated |
| T7 | Generate bill + receipt | cashier | accurate charges; receipt produced |
| T8 | Merge duplicate records | HIM officer | risk understood; traceable; zero data loss |

Metrics: task success ≥90%, critical errors = 0, non-critical error rate,
time on task, clicks/steps, help requests, confidence, **SUS ≥ 75**,
accessibility issues, qualitative notes. Below-threshold results block
release and feed the remediation backlog.

## 4. Performance budgets

- Shell JS ≤ 200KB gzip; charts and heavy modules lazy-loaded per route
  (never import demo/chart modules into the shell bundle).
- Interactive < 3s on a mid-range Android tablet over 3G.
- 60fps scrolling on 1,000-row virtualised tables.
- Autosave + retry queue keep working under intermittent connectivity;
  failed writes are visible, never silent.

## 5. Roadmap gates

| Phase | Scope | Exit criteria |
|---|---|---|
| 1 Discovery | personas, workflow catalogue, risk register, data dictionary | signed workflow maps |
| 2 Design foundation | tokens, components, IA, templates (the showcase) | showcase approved ✅ |
| 3 HIM/registration pilot | search, registration, appointments, queue | T1/T2 met |
| 4 Clinical workflows | triage, consultation, orders, lab, pharmacy, results | T3–T6 met; safety audit |
| 5 Revenue & admin | billing, claims, reports, admin | T7/T8 met |
| 6 Validation & rollout | usability + a11y + perf + security + interop checks | all gates green; pilot report |
