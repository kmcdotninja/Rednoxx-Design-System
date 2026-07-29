# REDNOXX EHR V1 — HIM / Medical Records Module

## User Story Catalogue

*Workflow-derived user stories for product backlog, engineering, QA, UAT and traceability*

| Document version | v1.0 draft |
|---|---|
| Prepared for | REDNOXX EHR V1 Product and Delivery Team |
| Module | Health Information Management (HIM) / Medical Records |
| Source basis | REDNOXX HIM Workflow Catalogue v1.0 and REDNOXX HIM Module Detailed SRS v0.2, derived from REDNOXX project delivery materials. |
| Story count | 135 workflow-derived stories plus 15 cross-cutting enabler stories |
| Workflow coverage | 45 HIM workflows from W-HIM-001 through W-HIM-045 |
| Status | Draft for product owner, HIM, architecture, security, privacy, engineering and QA review |
| Compliance note | This catalogue supports readiness and traceability. It does not claim formal NDHI, DHIN, SON, NDPC, NITDA or production certification without applicable authority validation. |

## 1. Purpose and Use

This user story catalogue converts the REDNOXX HIM / Medical Records Module workflows into backlog-ready stories that can be estimated, prioritised, designed, built, tested and traced. The catalogue is intended for Product Owner, Business Analyst, UX, Engineering, QA/UAT, HIM, Privacy, Security, Implementation and Support teams. Each story contains persona, goal, business value, acceptance criteria, data dependencies, controls, interoperability mapping and traceability to the underlying HIM workflow and requirement area.
- Use the workflow-derived stories as the product backlog baseline for HIM implementation.
- Use the acceptance criteria as the starting point for BDD scenarios, UAT scripts and regression packs.
- Use linked workflows and requirements to maintain traceability from SRS through design, build, test and release evidence.
- Use the enabler stories to plan security, audit, configuration, privacy, reporting and interoperability capabilities that cut across individual workflows.

## 2. Source Basis and Story Model

| Workflow source | REDNOXX HIM Workflow Catalogue v1.0, containing 45 individually mapped workflows. |
|---|---|
| SRS source | REDNOXX HIM Module Detailed SRS v0.2, including workflow maps, requirements, data model, privacy/security and FHIR/DHIN alignment. |
| Story structure | Each workflow is converted into three stories: primary functional execution, exception/safety control handling, and audit/reporting/interoperability support. |
| Story ID pattern | US-HIM-<workflow-number>-A/B/C for workflow-derived stories; US-HIM-EN-### for cross-cutting enablers. |
| Priority model | Critical or High based on patient safety, privacy risk, identity risk, record integrity, operational continuity and regulatory evidence. |
| Definition of Ready | Story has actor, workflow link, acceptance criteria, dependencies, data elements, controls and testable outcome. |
| Definition of Done | Code/configuration completed, peer reviewed, tested, audit evidence generated, role permissions validated, privacy controls tested and UAT evidence attached. |

## 3. Actor and Persona Catalogue

The following actors are used across the HIM user stories. Role permissions must be implemented through the Core Platform RBAC model and configured per facility, department and job function.

| Actor / persona | Role in HIM user stories |
|---|---|
| Patient | Person receiving care or requesting access to own health record. |
| Guardian / Next of Kin | Authorised representative or emergency contact for minor, incapacitated, neonate or deceased patient workflows. |
| Front Desk / Registration Officer | Registers patients, verifies returning patients, checks in appointments and routes patients to queues. |
| HIM Officer / Medical Records Clerk | Manages records, corrections, documents, release requests, incomplete records and daily HIM work queues. |
| HIM Supervisor | Approves high-risk updates, merge/unmerge, record-release decisions and HIM quality actions. |
| A&E Registration Officer | Creates emergency or unknown patient records and initiates reconciliation. |
| Triage Nurse / A&E Nurse | Receives emergency patient, validates minimal identity, prioritises and links patient to emergency encounter. |
| Clinician | Uses verified patient context and may initiate internal records or correction requests. |
| Ward Clerk / Admission User | Uses patient identity for admission, transfer and discharge context. |
| Billing Officer / Cashier | Uses patient identity, category and payer details for invoice and payment handoff. |
| Claims / HMO Officer | Uses identity, coverage and medical-record evidence for eligibility, pre-authorisation and claims. |
| Facility Administrator | Configures facilities, departments, MRN rules, forms, document types, queues and roles. |
| Data Protection Officer | Reviews privacy, data-subject, disclosure, restriction, breach and consent workflows. |
| Auditor / Compliance Reviewer | Reviews access logs, restricted record events, release logs, merge history and compliance evidence. |

| REDNOXX Support User | Provides time-bound and approved troubleshooting support with audit controls. |
|---|---|
| Integration/FHIR Service | Generates, validates or exchanges internal canonical data as Nigeria Core/DHIN-compatible payloads where approved. |

## 4. Story Taxonomy and Backlog Governance

| A story | Primary workflow execution. It covers the main happy-path capability required for the actor to complete the workflow. |
|---|---|
| B story | Exception, validation, privacy and clinical-safety controls for the workflow. |
| C story | Audit, reporting, traceability and interoperability support for the workflow. |
| Enabler story | Cross-cutting technical, configuration, security, privacy, audit or integration capability required by multiple workflow stories. |
| Acceptance tests | Every story should produce automated and/or manual test evidence, including role behaviour, validation messages, audit event and expected output. |
| Traceability | Every story should map to workflow ID, requirement ID(s), test case ID(s), defect(s), release version and UAT evidence. |

## 5. Workflow Epic Matrix

Each HIM workflow is treated as an epic or feature group. Three backlog stories are generated for each workflow.

| Workflow ID | Workflow / epic | Category | Primary actor | Priority | Story IDs |
|---|---|---|---|---|---|
| W-HIM-001 | Standard new patient registration | Registration | Front Desk / Registration Officer | High | US-HIM-001-A/B/C |
| W-HIM-002 | Registration with NIN / National ID | Registration / Identifier | Front Desk / Registration Officer | High | US-HIM-002-A/B/C |
| W-HIM-003 | Registration without NIN | Registration | Front Desk / Registration Officer | High | US-HIM-003-A/B/C |
| W-HIM-004 | Alternative ID registration | Registration / Identifier | Front Desk / Registration Officer | High | US-HIM-004-A/B/C |
| W-HIM-005 | Foreign patient registration | Registration | Front Desk / Registration Officer | High | US-HIM-005-A/B/C |
| W-HIM-006 | Returning patient verification | Registration / Search | Front Desk / Registration Officer | High | US-HIM-006-A/B/C |
| W-HIM-007 | Appointment-linked check-in | Appointments / Queue | Front Desk / Registration Officer | High | US-HIM-007-A/B/C |
| W-HIM-008 | Walk-in registration and routing | Registration / Queue | Front Desk / Registration Officer | High | US-HIM-008-A/B/C |
| W-HIM-009 | Emergency temporary registration | Emergency | A&E Registration Officer | Critical | US-HIM-009-A/B/C |
| W-HIM-010 | Unknown or unconscious patient | Emergency | A&E Registration Officer | Critical | US-HIM-010-A/B/C |
| W-HIM-011 | Mass casualty rapid registration | Emergency / Contingency | A&E Registration Officer | Critical | US-HIM-011-A/B/C |
| W-HIM-012 | Neonate registration and mother-baby linkage | Registration / MNCH | HIM Officer | High | US-HIM-012-A/B/C |
| W-HIM-013 | Minor registration with guardian | Registration / Consent | Front Desk / Registration Officer | Critical | US-HIM-013-A/B/C |
| W-HIM-014 | Deceased-on-arrival or deceased status | Registration / Record Lifecycle | HIM Officer | Critical | US-HIM-014-A/B/C |
| W-HIM-015 | Demographic correction/update | Record Maintenance | HIM Officer | High | US-HIM-015-A/B/C |
| W-HIM-016 | Identity document update | Identifier Maintenance | HIM Officer | High | US-HIM-016-A/B/C |
| W-HIM-017 | NIN or high-confidence identifier verification | Identifier / Verification | HIM Officer | High | US-HIM-017-A/B/C |
| W-HIM-018 | Incomplete record completion | Data Quality | HIM Officer | High | US-HIM-018-A/B/C |
| W-HIM-019 | Duplicate detected before save | MPI / Duplicate | Front Desk / Registration Officer | High | US-HIM-019-A/B/C |
| W-HIM-020 | Duplicate review queue | MPI / Governance | HIM Officer | High | US-HIM-020-A/B/C |
| W-HIM-021 | Merge approved duplicate records | Merge / MPI | HIM Supervisor | Critical | US-HIM-021-A/B/C |
| W-HIM-022 | Unmerge incorrect merge | Merge / Correction | HIM Supervisor | Critical | US-HIM-022-A/B/C |
| W-HIM-023 | Patient search and record retrieval | Search | Authorised User | High | US-HIM-023-A/B/C |
| W-HIM-024 | Restricted record and break-glass | Privacy / Access | Clinician or HIM Supervisor | Critical | US-HIM-024-A/B/C |

| W-HIM-025 | Document upload and indexing | Medical Records | HIM Officer | High | US-HIM-025-A/B/C |
|---|---|---|---|---|---|
| W-HIM-026 | Legacy scanned record indexing | Migration / Records | HIM Officer | High | US-HIM-026-A/B/C |
| W-HIM-027 | Document correction, replacement or created-in-error | Medical Records / Correction | HIM Officer | High | US-HIM-027-A/B/C |
| W-HIM-028 | Patient requests record release | Release of Information | HIM Officer | Critical | US-HIM-028-A/B/C |
| W-HIM-029 | Guardian or third-party record release | Release / Privacy | HIM Officer | Critical | US-HIM-029-A/B/C |
| W-HIM-030 | Internal clinical records request | Medical Records / Internal Request | Clinician | High | US-HIM-030-A/B/C |
| W-HIM-031 | HMO / claims document request | Claims / Release | Claims / HMO Officer | High | US-HIM-031-A/B/C |
| W-HIM-032 | Consent capture, update or withdrawal | Consent / Privacy | HIM Officer | Critical | US-HIM-032-A/B/C |
| W-HIM-033 | Referral registration | Referral / Registration | Front Desk / Registration Officer | High | US-HIM-033-A/B/C |
| W-HIM-034 | Payer / insurance coverage capture | Billing / Claims | Front Desk / Registration Officer | High | US-HIM-034-A/B/C |
| W-HIM-035 | Queue routing after registration | Queue / Operations | Front Desk / Registration Officer | High | US-HIM-035-A/B/C |
| W-HIM-036 | Encounter creation/linkage | Encounter / Integration | Front Desk / Registration Officer | High | US-HIM-036-A/B/C |
| W-HIM-037 | Offline/degraded registration | Resilience | Front Desk / Registration Officer | High | US-HIM-037-A/B/C |
| W-HIM-038 | Offline sync and reconciliation | Resilience / Data Quality | HIM Officer | Critical | US-HIM-038-A/B/C |
| W-HIM-039 | Legacy data migration and patient binding | Migration | Migration Team | High | US-HIM-039-A/B/C |
| W-HIM-040 | Audit review and HIM reporting | Audit / Reporting | Auditor / Compliance Reviewer | High | US-HIM-040-A/B/C |
| W-HIM-041 | Data subject access or rectification request | Privacy / Data Rights | Data Protection Officer | High | US-HIM-041-A/B/C |
| W-HIM-042 | Archive, inactivate or reactivate patient record | Record Lifecycle | HIM Supervisor | High | US-HIM-042-A/B/C |
| W-HIM-043 | Controlled REDNOXX support access | Support / Security | REDNOXX Support User | High | US-HIM-043-A/B/C |
| W-HIM-044 | HIM configuration change | Configuration / Governance | Facility Administrator | High | US-HIM-044-A/B/C |
| W-HIM-045 | FHIR / DHIN payload generation and validation | Interoperability | Integration/FHIR Service | Critical | US-HIM-045-A/B/C |

## 6. Detailed Workflow-Derived User Stories

The following stories are backlog-ready drafts. Product Owner, SMEs and Engineering should refine estimates, UI notes and implementation sequencing during sprint planning.

### W-HIM-001: Standard new patient registration

| Category | Registration |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, HIM Officer, Billing Officer, Queue Service |
| Trigger | A person presents for care and cannot be found as an existing patient after mandatory search. |
| Goal / output | Create a permanent patient record, assign MRN, capture demographics and route patient to next service. |
| Linked requirements | FR-HIM-REG-001, FR-HIM-REG-002, FR-HIM-REG-003, FR-HIM-REG-004, FR-HIM-REG-005, FR-HIM-REG-006, FR-HIM-REG-007, FR-HIM-REG-008, FR-HIM-REG-009 |

#### US-HIM-001-A: Complete Standard new patient registration

| Epic / workflow | W-HIM-001 - Standard new patient registration |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to create a permanent patient record, assign MRN, capture demographics and route patient to next service., so that create a permanent patient record, assign mrn, capture demographics and route patient to next service. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |

| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
|---|---|
| Linked requirements | FR-HIM-REG-001, FR-HIM-REG-002, FR-HIM-REG-003, FR-HIM-REG-004, FR-HIM-REG-005, FR-HIM-REG-006, FR-HIM-REG-007, FR-HIM-REG-008, FR-HIM-REG-009 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: A person presents for care and cannot be found as an existing patient after mandatory search. Supporting actors: Patient, HIM Officer, Billing Officer, Queue Service |

**Acceptance criteria**

1. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Standard new patient registration, then the system confirms patient context, applicable record status and required configuration before completion.
2. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
3. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
4. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Create a permanent patient record, assign MRN, capture demographics and route patient to next service..
5. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-001-B: Handle exceptions and safety controls for Standard new patient registration

| Epic / workflow | W-HIM-001 - Standard new patient registration |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Standard new patient registration, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-001, FR-HIM-REG-002, FR-HIM-REG-003, FR-HIM-REG-004, FR-HIM-REG-005, FR-HIM-REG-006, FR-HIM-REG-007, FR-HIM-REG-008, FR-HIM-REG-009 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

6. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
7. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: manage missing demographics, duplicate candidates, unavailable identifiers, payer/category gaps and cancelled/created-in-error registrations.
8. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
9. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
10. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-001-C: Audit, reporting and interoperability for Standard new patient registration

| Epic / workflow | W-HIM-001 - Standard new patient registration |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Standard new patient registration, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |

| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
|---|---|
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

11. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
12. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
13. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
14. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
15. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-002: Registration with NIN / National ID

| Category | Registration / Identifier |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, HIM Officer, Identity Verification Service where available |
| Trigger | Patient presents a NIN or other configured national identity reference. |
| Goal / output | Capture national identifier safely and prevent duplicate identity creation. |
| Linked requirements | FR-HIM-ID-006, FR-HIM-ID-007, FR-HIM-ID-011, FR-HIM-ID-012, FR-HIM-ID-021, FR-HIM-ID-022 |

#### US-HIM-002-A: Complete Registration with NIN / National ID

| Epic / workflow | W-HIM-002 - Registration with NIN / National ID |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to capture national identifier safely and prevent duplicate identity creation., so that capture national identifier safely and prevent duplicate identity creation. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-ID-006, FR-HIM-ID-007, FR-HIM-ID-011, FR-HIM-ID-012, FR-HIM-ID-021, FR-HIM-ID-022 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient presents a NIN or other configured national identity reference. Supporting actors: Patient, HIM Officer, Identity Verification Service where available |

**Acceptance criteria**

16. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Registration with NIN / National ID, then the system confirms patient context, applicable record status and required configuration before completion.
17. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
18. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
19. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Capture national identifier safely and prevent duplicate identity creation..
20. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-002-B: Handle exceptions and safety controls for Registration with NIN / National ID

| Epic / workflow | W-HIM-002 - Registration with NIN / National ID |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Registration with NIN / National ID, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |

| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
|---|---|
| Linked requirements | FR-HIM-ID-006, FR-HIM-ID-007, FR-HIM-ID-011, FR-HIM-ID-012, FR-HIM-ID-021, FR-HIM-ID-022 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

21. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
22. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: manage missing demographics, duplicate candidates, unavailable identifiers, payer/category gaps and cancelled/created-in-error registrations.
23. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
24. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
25. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-002-C: Audit, reporting and interoperability for Registration with NIN / National ID

| Epic / workflow | W-HIM-002 - Registration with NIN / National ID |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Registration with NIN / National ID, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

26. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
27. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
28. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
29. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
30. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-003: Registration without NIN

| Category | Registration |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, HIM Officer |
| Trigger | Patient lacks NIN, does not know NIN, is a minor/foreign patient, or NIN capture is unavailable. |
| Goal / output | Allow lawful care registration without making NIN a blocking requirement. |
| Linked requirements | FR-HIM-REG-016, FR-HIM-REG-017, FR-HIM-REG-018, FR-HIM-REG-019, FR-HIM-REG-020 |

#### US-HIM-003-A: Complete Registration without NIN

| Epic / workflow | W-HIM-003 - Registration without NIN |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |

| User story | As a Front Desk / Registration Officer, I want to allow lawful care registration without making NIN a blocking requirement., so that allow lawful care registration without making nin a blocking requirement. |
|---|---|
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-016, FR-HIM-REG-017, FR-HIM-REG-018, FR-HIM-REG-019, FR-HIM-REG-020 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient lacks NIN, does not know NIN, is a minor/foreign patient, or NIN capture is unavailable. Supporting actors: Patient, HIM Officer |

**Acceptance criteria**

31. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Registration without NIN, then the system confirms patient context, applicable record status and required configuration before completion.
32. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
33. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
34. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Allow lawful care registration without making NIN a blocking requirement..
35. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-003-B: Handle exceptions and safety controls for Registration without NIN

| Epic / workflow | W-HIM-003 - Registration without NIN |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Registration without NIN, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-016, FR-HIM-REG-017, FR-HIM-REG-018, FR-HIM-REG-019, FR-HIM-REG-020 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

36. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
37. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: manage missing demographics, duplicate candidates, unavailable identifiers, payer/category gaps and cancelled/created-in-error registrations.
38. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
39. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
40. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-003-C: Audit, reporting and interoperability for Registration without NIN

| Epic / workflow | W-HIM-003 - Registration without NIN |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Registration without NIN, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |

| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |
|---|---|
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

41. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
42. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
43. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
44. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
45. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-004: Alternative ID registration

| Category | Registration / Identifier |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, HIM Officer |
| Trigger | Patient provides passport, driver licence, voter card, birth certificate, staff ID, insurance card or other configured ID. |
| Goal / output | Capture alternative identity evidence and use it for search/matching. |
| Linked requirements | FR-HIM-REG-021, FR-HIM-REG-022, FR-HIM-REG-023, FR-HIM-REG-024 |

#### US-HIM-004-A: Complete Alternative ID registration

| Epic / workflow | W-HIM-004 - Alternative ID registration |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to capture alternative identity evidence and use it for search/matching., so that capture alternative identity evidence and use it for search/matching. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-021, FR-HIM-REG-022, FR-HIM-REG-023, FR-HIM-REG-024 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient provides passport, driver licence, voter card, birth certificate, staff ID, insurance card or other configured ID. Supporting actors: Patient, HIM Officer |

**Acceptance criteria**

46. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Alternative ID registration, then the system confirms patient context, applicable record status and required configuration before completion.
47. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
48. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
49. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Capture alternative identity evidence and use it for search/matching..
50. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-004-B: Handle exceptions and safety controls for Alternative ID registration

| Epic / workflow | W-HIM-004 - Alternative ID registration |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Alternative ID registration, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |

| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
|---|---|
| Linked requirements | FR-HIM-REG-021, FR-HIM-REG-022, FR-HIM-REG-023, FR-HIM-REG-024 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

51. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
52. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: manage missing demographics, duplicate candidates, unavailable identifiers, payer/category gaps and cancelled/created-in-error registrations.
53. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
54. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
55. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-004-C: Audit, reporting and interoperability for Alternative ID registration

| Epic / workflow | W-HIM-004 - Alternative ID registration |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Alternative ID registration, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

56. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
57. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
58. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
59. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
60. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-005: Foreign patient registration

| Category | Registration |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, Billing Officer, Claims Officer |
| Trigger | Patient is not a Nigerian resident/citizen or presents foreign identity/insurance information. |
| Goal / output | Register foreign patient while preserving identity, nationality, local contact and payer details. |
| Linked requirements | FR-HIM-REG-016, FR-HIM-REG-021, FR-HIM-REG-022, FR-HIM-REG-023 |

#### US-HIM-005-A: Complete Foreign patient registration

| Epic / workflow | W-HIM-005 - Foreign patient registration |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to register foreign patient while preserving identity, nationality, local contact and payer details., so that |

|  | register foreign patient while preserving identity, nationality, local contact and payer details. |
|---|---|
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-016, FR-HIM-REG-021, FR-HIM-REG-022, FR-HIM-REG-023 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient is not a Nigerian resident/citizen or presents foreign identity/insurance information. Supporting actors: Patient, Billing Officer, Claims Officer |

**Acceptance criteria**

61. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Foreign patient registration, then the system confirms patient context, applicable record status and required configuration before completion.
62. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
63. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
64. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Register foreign patient while preserving identity, nationality, local contact and payer details..
65. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-005-B: Handle exceptions and safety controls for Foreign patient registration

| Epic / workflow | W-HIM-005 - Foreign patient registration |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Foreign patient registration, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-016, FR-HIM-REG-021, FR-HIM-REG-022, FR-HIM-REG-023 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

66. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
67. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: manage missing demographics, duplicate candidates, unavailable identifiers, payer/category gaps and cancelled/created-in-error registrations.
68. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
69. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
70. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-005-C: Audit, reporting and interoperability for Foreign patient registration

| Epic / workflow | W-HIM-005 - Foreign patient registration |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Foreign patient registration, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |

| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
|---|---|
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

71. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
72. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
73. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
74. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
75. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-006: Returning patient verification

| Category | Registration / Search |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, HIM Officer, Queue Service, Billing Officer |
| Trigger | Known patient returns for appointment, walk-in, follow-up, billing or service. |
| Goal / output | Locate existing record, verify identity and route patient without creating duplicate. |
| Linked requirements | FR-HIM-REG-025, FR-HIM-REG-026, FR-HIM-REG-027, FR-HIM-REG-028, FR-HIM-REG-029, FR-HIM-REG-030 |

#### US-HIM-006-A: Complete Returning patient verification

| Epic / workflow | W-HIM-006 - Returning patient verification |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to locate existing record, verify identity and route patient without creating duplicate., so that locate existing record, verify identity and route patient without creating duplicate. |
| Data involved | search criteria, candidate list, selected patient, verification decision, patient banner, access/view log and routing status |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-025, FR-HIM-REG-026, FR-HIM-REG-027, FR-HIM-REG-028, FR-HIM-REG-029, FR-HIM-REG-030 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Known patient returns for appointment, walk-in, follow-up, billing or service. Supporting actors: Patient, HIM Officer, Queue Service, Billing Officer |

**Acceptance criteria**

76. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Returning patient verification, then the system confirms patient context, applicable record status and required configuration before completion.
77. Given required inputs are provided, when the workflow is saved, then the system captures or updates search criteria, candidate list, selected patient, verification decision, patient banner, access/view log and routing status.
78. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
79. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Locate existing record, verify identity and route patient without creating duplicate..
80. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-006-B: Handle exceptions and safety controls for Returning patient verification

| Epic / workflow | W-HIM-006 - Returning patient verification |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Returning patient verification, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |

| Data involved | search criteria, candidate list, selected patient, verification decision, patient banner, access/view log and routing status |
|---|---|
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-025, FR-HIM-REG-026, FR-HIM-REG-027, FR-HIM-REG-028, FR-HIM-REG-029, FR-HIM-REG-030 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

81. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
82. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle unverified identifiers, namespace conflicts, masked display, high-confidence duplicate matches and supervisor review.
83. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
84. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
85. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-006-C: Audit, reporting and interoperability for Returning patient verification

| Epic / workflow | W-HIM-006 - Returning patient verification |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Returning patient verification, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | search criteria, candidate list, selected patient, verification decision, patient banner, access/view log and routing status |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-SRH; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

86. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
87. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
88. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
89. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
90. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-007: Appointment-linked check-in

| Category | Appointments / Queue |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, Appointment Service, Queue Service, Clinic Nurse |
| Trigger | Patient arrives for scheduled appointment. |
| Goal / output | Verify appointment patient identity and move patient to correct queue/service. |
| Linked requirements | FR-HIM-REG-031, FR-HIM-REG-032, FR-HIM-REG-033, FR-HIM-REG-034, FR-HIM-REG-035, FR-HIM-REG-036 |

#### US-HIM-007-A: Complete Appointment-linked check-in

| Epic / workflow | W-HIM-007 - Appointment-linked check-in |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |

| User story | As a Front Desk / Registration Officer, I want to verify appointment patient identity and move patient to correct queue/service., so that verify appointment patient identity and move patient to correct queue/service. |
|---|---|
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Appointment, Encounter, Patient and Provenance |
| Linked requirements | FR-HIM-REG-031, FR-HIM-REG-032, FR-HIM-REG-033, FR-HIM-REG-034, FR-HIM-REG-035, FR-HIM-REG-036 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient arrives for scheduled appointment. Supporting actors: Patient, Appointment Service, Queue Service, Clinic Nurse |

**Acceptance criteria**

91. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Appointment-linked check-in, then the system confirms patient context, applicable record status and required configuration before completion.
92. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage.
93. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
94. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Verify appointment patient identity and move patient to correct queue/service..
95. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-007-B: Handle exceptions and safety controls for Appointment-linked check-in

| Epic / workflow | W-HIM-007 - Appointment-linked check-in |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Appointment-linked check-in, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Appointment, Encounter, Patient and Provenance |
| Linked requirements | FR-HIM-REG-031, FR-HIM-REG-032, FR-HIM-REG-033, FR-HIM-REG-034, FR-HIM-REG-035, FR-HIM-REG-036 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

96. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
97. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle late/no-show appointments, wrong patient linkage, unavailable clinic/service point, urgent redirection and queue correction.
98. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
99. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
100. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-007-C: Audit, reporting and interoperability for Appointment-linked check-in

| Epic / workflow | W-HIM-007 - Appointment-linked check-in |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Appointment-linked check-in, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Appointment, Encounter, Patient and Provenance |
| Linked requirements | FR-HIM-GEN; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |

| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |
|---|---|

**Acceptance criteria**

101. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
102. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Appointment, Encounter, Patient and Provenance where applicable without altering the REDNOXX canonical record.
103. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
104. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
105. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-008: Walk-in registration and routing

| Category | Registration / Queue |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, Queue Service, Billing Officer, Clinic Nurse |
| Trigger | Patient presents without appointment. |
| Goal / output | Register or verify patient and route to correct service. |
| Linked requirements | FR-HIM-REG-037, FR-HIM-REG-038, FR-HIM-REG-039, FR-HIM-REG-040 |

#### US-HIM-008-A: Complete Walk-in registration and routing

| Epic / workflow | W-HIM-008 - Walk-in registration and routing |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to register or verify patient and route to correct service., so that register or verify patient and route to correct service. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-037, FR-HIM-REG-038, FR-HIM-REG-039, FR-HIM-REG-040 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient presents without appointment. Supporting actors: Patient, Queue Service, Billing Officer, Clinic Nurse |

**Acceptance criteria**

106. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Walk-in registration and routing, then the system confirms patient context, applicable record status and required configuration before completion.
107. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
108. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
109. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Register or verify patient and route to correct service..
110. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-008-B: Handle exceptions and safety controls for Walk-in registration and routing

| Epic / workflow | W-HIM-008 - Walk-in registration and routing |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Walk-in registration and routing, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-037, FR-HIM-REG-038, FR-HIM-REG-039, FR-HIM-REG-040 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |

| Notes | Exception paths must be included in QA regression and UAT scripts. |
|---|---|

**Acceptance criteria**

111. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
112. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: manage missing demographics, duplicate candidates, unavailable identifiers, payer/category gaps and cancelled/created-in-error registrations.
113. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
114. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
115. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-008-C: Audit, reporting and interoperability for Walk-in registration and routing

| Epic / workflow | W-HIM-008 - Walk-in registration and routing |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Walk-in registration and routing, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

116. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
117. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
118. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
119. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
120. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-009: Emergency temporary registration

| Category | Emergency |
|---|---|
| Primary actor | A&E Registration Officer |
| Supporting actors | Triage Nurse, Clinician, Guardian/Next of Kin, HIM Officer |
| Trigger | Patient requires urgent care and complete identity is unavailable or cannot be collected before care. |
| Goal / output | Create temporary emergency identity quickly while preserving later reconciliation. |
| Linked requirements | FR-HIM-REG-041, FR-HIM-REG-042, FR-HIM-REG-043, FR-HIM-REG-044, FR-HIM-REG-045, FR-HIM-REG-046, FR-HIM-REG-047, FR-HIM-REG-048, FR-HIM-REG-049, FR-HIM-REG-050 |

#### US-HIM-009-A: Complete Emergency temporary registration

| Epic / workflow | W-HIM-009 - Emergency temporary registration |
|---|---|
| Persona | A&E Registration Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a A&E Registration Officer, I want to create temporary emergency identity quickly while preserving later reconciliation., so that create temporary emergency identity quickly while preserving later reconciliation. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |

| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
|---|---|
| Linked requirements | FR-HIM-REG-041, FR-HIM-REG-042, FR-HIM-REG-043, FR-HIM-REG-044, FR-HIM-REG-045, FR-HIM-REG-046, FR-HIM-REG-047, FR-HIM-REG-048, FR-HIM-REG-049, FR-HIM-REG-050 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient requires urgent care and complete identity is unavailable or cannot be collected before care. Supporting actors: Triage Nurse, Clinician, Guardian/Next of Kin, HIM Officer |

**Acceptance criteria**

121. Given an authenticated A&E Registration Officer with the required permission, when the user initiates Emergency temporary registration, then the system confirms patient context, applicable record status and required configuration before completion.
122. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
123. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
124. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Create temporary emergency identity quickly while preserving later reconciliation..
125. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-009-B: Handle exceptions and safety controls for Emergency temporary registration

| Epic / workflow | W-HIM-009 - Emergency temporary registration |
|---|---|
| Persona | A&E Registration Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a A&E Registration Officer, I want to handle exceptions, validations and safety controls during Emergency temporary registration, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-041, FR-HIM-REG-042, FR-HIM-REG-043, FR-HIM-REG-044, FR-HIM-REG-045, FR-HIM-REG-046, FR-HIM-REG-047, FR-HIM-REG-048, FR-HIM-REG-049, FR-HIM-REG-050 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

126. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
127. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle reduced mandatory fields, unknown identity, rapid temporary IDs, duplicate temporary IDs, reconciliation and immediate care without delay.
128. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
129. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
130. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-009-C: Audit, reporting and interoperability for Emergency temporary registration

| Epic / workflow | W-HIM-009 - Emergency temporary registration |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Emergency temporary registration, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |

| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |
|---|---|

**Acceptance criteria**

131. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
132. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
133. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
134. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
135. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-010: Unknown or unconscious patient

| Category | Emergency |
|---|---|
| Primary actor | A&E Registration Officer |
| Supporting actors | Triage Nurse, Clinician, Security/Police Liaison, HIM Officer |
| Trigger | Patient identity is unknown because patient is unconscious, confused, abandoned, deceased on arrival or cannot communicate. |
| Goal / output | Create safe unknown patient record that can later be identified and reconciled. |
| Linked requirements | FR-HIM-REG-051, FR-HIM-REG-052, FR-HIM-REG-053, FR-HIM-REG-054, FR-HIM-REG-055, FR-HIM-REG-056 |

#### US-HIM-010-A: Complete Unknown or unconscious patient

| Epic / workflow | W-HIM-010 - Unknown or unconscious patient |
|---|---|
| Persona | A&E Registration Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a A&E Registration Officer, I want to create safe unknown patient record that can later be identified and reconciled., so that create safe unknown patient record that can later be identified and reconciled. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-051, FR-HIM-REG-052, FR-HIM-REG-053, FR-HIM-REG-054, FR-HIM-REG-055, FR-HIM-REG-056 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient identity is unknown because patient is unconscious, confused, abandoned, deceased on arrival or cannot communicate. Supporting actors: Triage Nurse, Clinician, Security/Police Liaison, HIM Officer |

**Acceptance criteria**

136. Given an authenticated A&E Registration Officer with the required permission, when the user initiates Unknown or unconscious patient, then the system confirms patient context, applicable record status and required configuration before completion.
137. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage.
138. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
139. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Create safe unknown patient record that can later be identified and reconciled..
140. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-010-B: Handle exceptions and safety controls for Unknown or unconscious patient

| Epic / workflow | W-HIM-010 - Unknown or unconscious patient |
|---|---|
| Persona | A&E Registration Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a A&E Registration Officer, I want to handle exceptions, validations and safety controls during Unknown or unconscious patient, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |

| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
|---|---|
| Linked requirements | FR-HIM-REG-051, FR-HIM-REG-052, FR-HIM-REG-053, FR-HIM-REG-054, FR-HIM-REG-055, FR-HIM-REG-056 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

141. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
142. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle reduced mandatory fields, unknown identity, rapid temporary IDs, duplicate temporary IDs, reconciliation and immediate care without delay.
143. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
144. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
145. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-010-C: Audit, reporting and interoperability for Unknown or unconscious patient

| Epic / workflow | W-HIM-010 - Unknown or unconscious patient |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Unknown or unconscious patient, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-GEN; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

146. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
147. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
148. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
149. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
150. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-011: Mass casualty rapid registration

| Category | Emergency / Contingency |
|---|---|
| Primary actor | A&E Registration Officer |
| Supporting actors | Triage Nurse, Incident Commander, HIM Supervisor, Clinician |
| Trigger | Multiple emergency patients arrive during accident, disaster, outbreak or security incident. |
| Goal / output | Create rapid temporary identities and preserve triage/encounter linkage under surge conditions. |
| Linked requirements | FR-HIM-REG-074, FR-HIM-REG-075, FR-HIM-REG-076, FR-HIM-REG-077, FR-HIM-REG-078 |

#### US-HIM-011-A: Complete Mass casualty rapid registration

| Epic / workflow | W-HIM-011 - Mass casualty rapid registration |
|---|---|
| Persona | A&E Registration Officer |
| Priority / MoSCoW | Critical / Must |

| User story | As a A&E Registration Officer, I want to create rapid temporary identities and preserve triage/encounter linkage under surge conditions., so that create rapid temporary identities and preserve triage/encounter linkage under surge conditions. |
|---|---|
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-074, FR-HIM-REG-075, FR-HIM-REG-076, FR-HIM-REG-077, FR-HIM-REG-078 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Multiple emergency patients arrive during accident, disaster, outbreak or security incident. Supporting actors: Triage Nurse, Incident Commander, HIM Supervisor, Clinician |

**Acceptance criteria**

151. Given an authenticated A&E Registration Officer with the required permission, when the user initiates Mass casualty rapid registration, then the system confirms patient context, applicable record status and required configuration before completion.
152. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
153. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
154. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Create rapid temporary identities and preserve triage/encounter linkage under surge conditions..
155. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-011-B: Handle exceptions and safety controls for Mass casualty rapid registration

| Epic / workflow | W-HIM-011 - Mass casualty rapid registration |
|---|---|
| Persona | A&E Registration Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a A&E Registration Officer, I want to handle exceptions, validations and safety controls during Mass casualty rapid registration, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-074, FR-HIM-REG-075, FR-HIM-REG-076, FR-HIM-REG-077, FR-HIM-REG-078 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

156. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
157. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: manage missing demographics, duplicate candidates, unavailable identifiers, payer/category gaps and cancelled/created-in-error registrations.
158. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
159. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
160. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-011-C: Audit, reporting and interoperability for Mass casualty rapid registration

| Epic / workflow | W-HIM-011 - Mass casualty rapid registration |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Mass casualty rapid registration, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |

| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
|---|---|
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

161. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
162. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
163. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
164. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
165. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-012: Neonate registration and mother-baby linkage

| Category | Registration / MNCH |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | Maternity Nurse, Mother/Guardian, Clinician |
| Trigger | Baby is born or presents for care before legal name/birth certificate is available. |
| Goal / output | Create neonate identity linked to mother/guardian and maternity encounter where applicable. |
| Linked requirements | FR-HIM-REG-057, FR-HIM-REG-058, FR-HIM-REG-059, FR-HIM-REG-060, FR-HIM-REG-061, FR-HIM-REG-062 |

#### US-HIM-012-A: Complete Neonate registration and mother-baby linkage

| Epic / workflow | W-HIM-012 - Neonate registration and mother-baby linkage |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to create neonate identity linked to mother/guardian and maternity encounter where applicable., so that create neonate identity linked to mother/guardian and maternity encounter where applicable. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-057, FR-HIM-REG-058, FR-HIM-REG-059, FR-HIM-REG-060, FR-HIM-REG-061, FR-HIM-REG-062 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Baby is born or presents for care before legal name/birth certificate is available. Supporting actors: Maternity Nurse, Mother/Guardian, Clinician |

**Acceptance criteria**

166. Given an authenticated HIM Officer with the required permission, when the user initiates Neonate registration and mother-baby linkage, then the system confirms patient context, applicable record status and required configuration before completion.
167. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
168. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
169. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Create neonate identity linked to mother/guardian and maternity encounter where applicable..
170. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-012-B: Handle exceptions and safety controls for Neonate registration and mother-baby linkage

| Epic / workflow | W-HIM-012 - Neonate registration and mother-baby linkage |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |

| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Neonate registration and mother-baby linkage, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
|---|---|
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-057, FR-HIM-REG-058, FR-HIM-REG-059, FR-HIM-REG-060, FR-HIM-REG-061, FR-HIM-REG-062 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

171. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
172. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: manage missing demographics, duplicate candidates, unavailable identifiers, payer/category gaps and cancelled/created-in-error registrations.
173. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
174. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
175. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-012-C: Audit, reporting and interoperability for Neonate registration and mother-baby linkage

| Epic / workflow | W-HIM-012 - Neonate registration and mother-baby linkage |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Neonate registration and mother-baby linkage, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

176. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
177. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
178. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
179. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
180. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-013: Minor registration with guardian

| Category | Registration / Consent |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Guardian, Patient, HIM Officer, Data Protection Officer |
| Trigger | Patient is below configured age threshold or cannot legally act independently. |
| Goal / output | Register minor and capture guardian/authorised representative details. |
| Linked requirements | FR-HIM-REG-063, FR-HIM-REG-064, FR-HIM-REG-065, FR-HIM-REG-066, FR-HIM-REG-067, FR-HIM-REG-068 |

#### US-HIM-013-A: Complete Minor registration with guardian

| Epic / workflow | W-HIM-013 - Minor registration with guardian |
|---|---|

| Persona | Front Desk / Registration Officer |
|---|---|
| Priority / MoSCoW | Critical / Must |
| User story | As a Front Desk / Registration Officer, I want to register minor and capture guardian/authorised representative details., so that register minor and capture guardian/authorised representative details. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-063, FR-HIM-REG-064, FR-HIM-REG-065, FR-HIM-REG-066, FR-HIM-REG-067, FR-HIM-REG-068 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient is below configured age threshold or cannot legally act independently. Supporting actors: Guardian, Patient, HIM Officer, Data Protection Officer |

**Acceptance criteria**

181. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Minor registration with guardian, then the system confirms patient context, applicable record status and required configuration before completion.
182. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
183. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
184. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Register minor and capture guardian/authorised representative details..
185. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-013-B: Handle exceptions and safety controls for Minor registration with guardian

| Epic / workflow | W-HIM-013 - Minor registration with guardian |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Minor registration with guardian, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-063, FR-HIM-REG-064, FR-HIM-REG-065, FR-HIM-REG-066, FR-HIM-REG-067, FR-HIM-REG-068 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

186. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
187. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: manage missing demographics, duplicate candidates, unavailable identifiers, payer/category gaps and cancelled/created-in-error registrations.
188. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
189. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
190. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-013-C: Audit, reporting and interoperability for Minor registration with guardian

| Epic / workflow | W-HIM-013 - Minor registration with guardian |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Minor registration with guardian, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |

| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
|---|---|
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

191. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
192. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
193. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
194. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
195. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-014: Deceased-on-arrival or deceased status

| Category | Registration / Record Lifecycle |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | A&E Clinician, Mortuary Officer, Guardian/Next of Kin, HIM Supervisor |
| Trigger | Patient arrives deceased or an existing patient is confirmed deceased. |
| Goal / output | Create or update record status as deceased while controlling downstream actions and disclosure. |
| Linked requirements | FR-HIM-REG-069, FR-HIM-REG-070, FR-HIM-REG-071, FR-HIM-REG-072, FR-HIM-REG-073 |

#### US-HIM-014-A: Complete Deceased-on-arrival or deceased status

| Epic / workflow | W-HIM-014 - Deceased-on-arrival or deceased status |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Officer, I want to create or update record status as deceased while controlling downstream actions and disclosure., so that create or update record status as deceased while controlling downstream actions and disclosure. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-069, FR-HIM-REG-070, FR-HIM-REG-071, FR-HIM-REG-072, FR-HIM-REG-073 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient arrives deceased or an existing patient is confirmed deceased. Supporting actors: A&E Clinician, Mortuary Officer, Guardian/Next of Kin, HIM Supervisor |

**Acceptance criteria**

196. Given an authenticated HIM Officer with the required permission, when the user initiates Deceased-on-arrival or deceased status, then the system confirms patient context, applicable record status and required configuration before completion.
197. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage.
198. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
199. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Create or update record status as deceased while controlling downstream actions and disclosure..
200. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-014-B: Handle exceptions and safety controls for Deceased-on-arrival or deceased status

| Epic / workflow | W-HIM-014 - Deceased-on-arrival or deceased status |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | Critical / Must |

| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Deceased-on-arrival or deceased status, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
|---|---|
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-069, FR-HIM-REG-070, FR-HIM-REG-071, FR-HIM-REG-072, FR-HIM-REG-073 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

201. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
202. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle unknown deceased identity, death status reversal, routine care routing restrictions and controlled disclosure.
203. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
204. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
205. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-014-C: Audit, reporting and interoperability for Deceased-on-arrival or deceased status

| Epic / workflow | W-HIM-014 - Deceased-on-arrival or deceased status |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Deceased-on-arrival or deceased status, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

206. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
207. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
208. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
209. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
210. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-015: Demographic correction/update

| Category | Record Maintenance |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | Patient, Front Desk Officer, HIM Supervisor |
| Trigger | Patient demographic information is found to be incomplete, outdated or incorrect. |
| Goal / output | Correct demographics without losing historical values or creating identity risk. |
| Linked requirements | FR-HIM-REG-079, FR-HIM-REG-080, FR-HIM-REG-081, FR-HIM-REG-082, FR-HIM-REG-083 |

#### US-HIM-015-A: Complete Demographic correction/update

| Epic / workflow | W-HIM-015 - Demographic correction/update |
|---|---|

| Persona | HIM Officer |
|---|---|
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to correct demographics without losing historical values or creating identity risk., so that correct demographics without losing historical values or creating identity risk. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-079, FR-HIM-REG-080, FR-HIM-REG-081, FR-HIM-REG-082, FR-HIM-REG-083 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient demographic information is found to be incomplete, outdated or incorrect. Supporting actors: Patient, Front Desk Officer, HIM Supervisor |

**Acceptance criteria**

211. Given an authenticated HIM Officer with the required permission, when the user initiates Demographic correction/update, then the system confirms patient context, applicable record status and required configuration before completion.
212. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage.
213. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
214. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Correct demographics without losing historical values or creating identity risk..
215. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-015-B: Handle exceptions and safety controls for Demographic correction/update

| Epic / workflow | W-HIM-015 - Demographic correction/update |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Demographic correction/update, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG-079, FR-HIM-REG-080, FR-HIM-REG-081, FR-HIM-REG-082, FR-HIM-REG-083 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

216. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
217. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle high-risk identity changes, duplicate triggers, missing evidence, incomplete record exceptions and approval requirements.
218. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
219. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
220. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-015-C: Audit, reporting and interoperability for Demographic correction/update

| Epic / workflow | W-HIM-015 - Demographic correction/update |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Demographic correction/update, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |

| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
|---|---|
| Linked requirements | FR-HIM-GEN; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

221. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
222. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
223. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
224. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
225. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-016: Identity document update

| Category | Identifier Maintenance |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | Patient, HIM Supervisor |
| Trigger | Patient presents new or corrected identity document or identifier verification status changes. |
| Goal / output | Update identifier evidence safely with namespace, verification and audit controls. |
| Linked requirements | FR-HIM-ID-011, FR-HIM-ID-012, FR-HIM-ID-021, FR-HIM-ID-022, FR-HIM-ID-023, FR-HIM-ID-024, FR-HIM-ID-025, FR-HIM-ID-026, FR-HIM-ID-027, FR-HIM-ID-028 |

#### US-HIM-016-A: Complete Identity document update

| Epic / workflow | W-HIM-016 - Identity document update |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to update identifier evidence safely with namespace, verification and audit controls., so that update identifier evidence safely with namespace, verification and audit controls. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-ID-011, FR-HIM-ID-012, FR-HIM-ID-021, FR-HIM-ID-022, FR-HIM-ID-023, FR-HIM-ID-024, FR-HIM-ID-025, FR-HIM-ID-026, FR-HIM-ID-027, FR-HIM-ID-028 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient presents new or corrected identity document or identifier verification status changes. Supporting actors: Patient, HIM Supervisor |

**Acceptance criteria**

226. Given an authenticated HIM Officer with the required permission, when the user initiates Identity document update, then the system confirms patient context, applicable record status and required configuration before completion.
227. Given required inputs are provided, when the workflow is saved, then the system captures or updates document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata.
228. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
229. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Update identifier evidence safely with namespace, verification and audit controls..
230. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-016-B: Handle exceptions and safety controls for Identity document update

| Epic / workflow | W-HIM-016 - Identity document update |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |

| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Identity document update, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
|---|---|
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-ID-011, FR-HIM-ID-012, FR-HIM-ID-021, FR-HIM-ID-022, FR-HIM-ID-023, FR-HIM-ID-024, FR-HIM-ID-025, FR-HIM-ID-026, FR-HIM-ID-027, FR-HIM-ID-028 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

231. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
232. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle unverified identifiers, namespace conflicts, masked display, high-confidence duplicate matches and supervisor review.
233. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
234. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
235. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-016-C: Audit, reporting and interoperability for Identity document update

| Epic / workflow | W-HIM-016 - Identity document update |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Identity document update, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-DOC; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

236. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
237. Given approved interoperability or reporting is required, when the output is mapped, then it can map to DocumentReference, Provenance, AuditEvent and Consent where applicable where applicable without altering the REDNOXX canonical record.
238. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
239. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
240. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-017: NIN or high-confidence identifier verification

| Category | Identifier / Verification |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | Patient, Identity Verification Service, HIM Supervisor |
| Trigger | A previously unverified NIN/national ID/strong identifier needs verification or correction. |
| Goal / output | Update verification status and prevent conflicting identity records. |
| Linked requirements | FR-HIM-ID-006, FR-HIM-ID-011, FR-HIM-ID-012, FR-HIM-ID-021, FR-HIM-ID-022 |

#### US-HIM-017-A: Complete NIN or high-confidence identifier verification

| Epic / workflow | W-HIM-017 - NIN or high-confidence identifier verification |
|---|---|

| Persona | HIM Officer |
|---|---|
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to update verification status and prevent conflicting identity records., so that update verification status and prevent conflicting identity records. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-ID-006, FR-HIM-ID-011, FR-HIM-ID-012, FR-HIM-ID-021, FR-HIM-ID-022 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: A previously unverified NIN/national ID/strong identifier needs verification or correction. Supporting actors: Patient, Identity Verification Service, HIM Supervisor |

**Acceptance criteria**

241. Given an authenticated HIM Officer with the required permission, when the user initiates NIN or high-confidence identifier verification, then the system confirms patient context, applicable record status and required configuration before completion.
242. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage.
243. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
244. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Update verification status and prevent conflicting identity records..
245. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-017-B: Handle exceptions and safety controls for NIN or high-confidence identifier verification

| Epic / workflow | W-HIM-017 - NIN or high-confidence identifier verification |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during NIN or high-confidence identifier verification, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-ID-006, FR-HIM-ID-011, FR-HIM-ID-012, FR-HIM-ID-021, FR-HIM-ID-022 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

246. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
247. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle unverified identifiers, namespace conflicts, masked display, high-confidence duplicate matches and supervisor review.
248. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
249. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
250. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-017-C: Audit, reporting and interoperability for NIN or high-confidence identifier verification

| Epic / workflow | W-HIM-017 - NIN or high-confidence identifier verification |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of NIN or high-confidence identifier verification, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |

| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
|---|---|
| Linked requirements | FR-HIM-ID; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

251. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
252. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
253. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
254. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
255. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-018: Incomplete record completion

| Category | Data Quality |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | Front Desk Officer, Patient, HIM Supervisor |
| Trigger | Patient record lacks required demographic, contact, identifier or related-person data. |
| Goal / output | Complete missing fields and improve record quality without blocking urgent care. |
| Linked requirements | FR-HIM-DEM-051, FR-HIM-DEM-052, FR-HIM-DEM-053, FR-HIM-DEM-054, FR-HIM-DEM-055, FR-HIM-DEM-056, FR-HIM-DEM-057, FR-HIM-DEM-058, FR-HIM-DEM-059, FR-HIM-DEM-060 |

#### US-HIM-018-A: Complete Incomplete record completion

| Epic / workflow | W-HIM-018 - Incomplete record completion |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to complete missing fields and improve record quality without blocking urgent care., so that complete missing fields and improve record quality without blocking urgent care. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-DEM-051, FR-HIM-DEM-052, FR-HIM-DEM-053, FR-HIM-DEM-054, FR-HIM-DEM-055, FR-HIM-DEM-056, FR-HIM-DEM-057, FR-HIM-DEM-058, FR-HIM-DEM-059, FR-HIM-DEM-060 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient record lacks required demographic, contact, identifier or related-person data. Supporting actors: Front Desk Officer, Patient, HIM Supervisor |

**Acceptance criteria**

256. Given an authenticated HIM Officer with the required permission, when the user initiates Incomplete record completion, then the system confirms patient context, applicable record status and required configuration before completion.
257. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage.
258. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
259. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Complete missing fields and improve record quality without blocking urgent care..
260. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-018-B: Handle exceptions and safety controls for Incomplete record completion

| Epic / workflow | W-HIM-018 - Incomplete record completion |
|---|---|
| Persona | HIM Officer |

| Priority / MoSCoW | High / Must |
|---|---|
| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Incomplete record completion, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-DEM-051, FR-HIM-DEM-052, FR-HIM-DEM-053, FR-HIM-DEM-054, FR-HIM-DEM-055, FR-HIM-DEM-056, FR-HIM-DEM-057, FR-HIM-DEM-058, FR-HIM-DEM-059, FR-HIM-DEM-060 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

261. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
262. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle high-risk identity changes, duplicate triggers, missing evidence, incomplete record exceptions and approval requirements.
263. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
264. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
265. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-018-C: Audit, reporting and interoperability for Incomplete record completion

| Epic / workflow | W-HIM-018 - Incomplete record completion |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Incomplete record completion, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-GEN; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

266. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
267. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
268. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
269. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
270. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-019: Duplicate detected before save

| Category | MPI / Duplicate |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | HIM Officer, HIM Supervisor |
| Trigger | Duplicate matching threshold is met during registration or identity update. |
| Goal / output | Prevent unnecessary duplicate patient record creation while allowing reviewed exceptions. |
| Linked requirements | FR-HIM-MPI-001, FR-HIM-MPI-002, FR-HIM-MPI-003, FR-HIM-MPI-004, FR-HIM-MPI-005, FR-HIM-MPI-006, |

|  | FR-HIM-MPI-007, FR-HIM-MPI-008, FR-HIM-MPI-009, FR-HIM-MPI-010 |
|---|---|

#### US-HIM-019-A: Complete Duplicate detected before save

| Epic / workflow | W-HIM-019 - Duplicate detected before save |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to prevent unnecessary duplicate patient record creation while allowing reviewed exceptions., so that prevent unnecessary duplicate patient record creation while allowing reviewed exceptions. |
| Data involved | candidate records, match score/reasons, review decision, reviewer, reason, decision timestamp and downstream action |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-MPI-001, FR-HIM-MPI-002, FR-HIM-MPI-003, FR-HIM-MPI-004, FR-HIM-MPI-005, FR-HIM-MPI-006, FR-HIM-MPI-007, FR-HIM-MPI-008, FR-HIM-MPI-009, FR-HIM-MPI-010 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Duplicate matching threshold is met during registration or identity update. Supporting actors: HIM Officer, HIM Supervisor |

**Acceptance criteria**

271. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Duplicate detected before save, then the system confirms patient context, applicable record status and required configuration before completion.
272. Given required inputs are provided, when the workflow is saved, then the system captures or updates candidate records, match score/reasons, review decision, reviewer, reason, decision timestamp and downstream action.
273. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
274. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Prevent unnecessary duplicate patient record creation while allowing reviewed exceptions..
275. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-019-B: Handle exceptions and safety controls for Duplicate detected before save

| Epic / workflow | W-HIM-019 - Duplicate detected before save |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Duplicate detected before save, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | candidate records, match score/reasons, review decision, reviewer, reason, decision timestamp and downstream action |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-MPI-001, FR-HIM-MPI-002, FR-HIM-MPI-003, FR-HIM-MPI-004, FR-HIM-MPI-005, FR-HIM-MPI-006, FR-HIM-MPI-007, FR-HIM-MPI-008, FR-HIM-MPI-009, FR-HIM-MPI-010 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

276. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
277. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle false positives, insufficient evidence, survivor selection conflicts, downstream preservation and reversal/manual reconciliation.
278. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
279. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
280. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-019-C: Audit, reporting and interoperability for Duplicate detected before save

| Epic / workflow | W-HIM-019 - Duplicate detected before save |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |

| Priority / MoSCoW | High / Must |
|---|---|
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Duplicate detected before save, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | candidate records, match score/reasons, review decision, reviewer, reason, decision timestamp and downstream action |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-MPI; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

281. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
282. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
283. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
284. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
285. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-020: Duplicate review queue

| Category | MPI / Governance |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | HIM Supervisor, Front Desk Officer, Clinician |
| Trigger | System or user flags two or more records as possible duplicates. |
| Goal / output | Review suspected duplicate records and decide whether to merge, reject or defer. |
| Linked requirements | FR-HIM-MPI-011, FR-HIM-MPI-012, FR-HIM-MPI-013, FR-HIM-MPI-014, FR-HIM-MPI-015, FR-HIM-MPI-016 |

#### US-HIM-020-A: Complete Duplicate review queue

| Epic / workflow | W-HIM-020 - Duplicate review queue |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to review suspected duplicate records and decide whether to merge, reject or defer., so that review suspected duplicate records and decide whether to merge, reject or defer. |
| Data involved | candidate records, match score/reasons, review decision, reviewer, reason, decision timestamp and downstream action |
| Mapping / interoperability | Encounter, Task/QueueEvent, Appointment and Provenance |
| Linked requirements | FR-HIM-MPI-011, FR-HIM-MPI-012, FR-HIM-MPI-013, FR-HIM-MPI-014, FR-HIM-MPI-015, FR-HIM-MPI-016 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: System or user flags two or more records as possible duplicates. Supporting actors: HIM Supervisor, Front Desk Officer, Clinician |

**Acceptance criteria**

286. Given an authenticated HIM Officer with the required permission, when the user initiates Duplicate review queue, then the system confirms patient context, applicable record status and required configuration before completion.
287. Given required inputs are provided, when the workflow is saved, then the system captures or updates candidate records, match score/reasons, review decision, reviewer, reason, decision timestamp and downstream action.
288. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
289. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Review suspected duplicate records and decide whether to merge, reject or defer..
290. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-020-B: Handle exceptions and safety controls for Duplicate review queue

| Epic / workflow | W-HIM-020 - Duplicate review queue |
|---|---|

| Persona | HIM Officer |
|---|---|
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Duplicate review queue, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | candidate records, match score/reasons, review decision, reviewer, reason, decision timestamp and downstream action |
| Mapping / interoperability | Encounter, Task/QueueEvent, Appointment and Provenance |
| Linked requirements | FR-HIM-MPI-011, FR-HIM-MPI-012, FR-HIM-MPI-013, FR-HIM-MPI-014, FR-HIM-MPI-015, FR-HIM-MPI-016 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

291. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
292. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle late/no-show appointments, wrong patient linkage, unavailable clinic/service point, urgent redirection and queue correction.
293. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
294. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
295. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-020-C: Audit, reporting and interoperability for Duplicate review queue

| Epic / workflow | W-HIM-020 - Duplicate review queue |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Duplicate review queue, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | candidate records, match score/reasons, review decision, reviewer, reason, decision timestamp and downstream action |
| Mapping / interoperability | Encounter, Task/QueueEvent, Appointment and Provenance |
| Linked requirements | FR-HIM-MPI; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

296. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
297. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Encounter, Task/QueueEvent, Appointment and Provenance where applicable without altering the REDNOXX canonical record.
298. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
299. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
300. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-021: Merge approved duplicate records

| Category | Merge / MPI |
|---|---|
| Primary actor | HIM Supervisor |
| Supporting actors | HIM Officer, Billing Officer, Clinician, Claims Officer |
| Trigger | Duplicate review confirms two or more records represent the same patient. |
| Goal / output | Safely combine records without deleting history or losing linked encounters/documents. |
| Linked requirements | FR-HIM-MRG-001, FR-HIM-MRG-002, FR-HIM-MRG-003, FR-HIM-MRG-004, FR-HIM-MRG-005, FR-HIM-MRG-006, FR-HIM-MRG-007, FR-HIM-MRG-008, FR-HIM-MRG-009, FR-HIM-MRG-010, FR-HIM-MRG-011 |

#### US-HIM-021-A: Complete Merge approved duplicate records

| Epic / workflow | W-HIM-021 - Merge approved duplicate records |
|---|---|
| Persona | HIM Supervisor |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Supervisor, I want to safely combine records without deleting history or losing linked encounters/documents., so that safely combine records without deleting history or losing linked encounters/documents. |
| Data involved | candidate records, match score/reasons, review decision, reviewer, reason, decision timestamp and downstream action |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-MRG-001, FR-HIM-MRG-002, FR-HIM-MRG-003, FR-HIM-MRG-004, FR-HIM-MRG-005, FR-HIM-MRG-006, FR-HIM-MRG-007, FR-HIM-MRG-008, FR-HIM-MRG-009, FR-HIM-MRG-010, FR-HIM-MRG-011 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Duplicate review confirms two or more records represent the same patient. Supporting actors: HIM Officer, Billing Officer, Clinician, Claims Officer |

**Acceptance criteria**

301. Given an authenticated HIM Supervisor with the required permission, when the user initiates Merge approved duplicate records, then the system confirms patient context, applicable record status and required configuration before completion.
302. Given required inputs are provided, when the workflow is saved, then the system captures or updates candidate records, match score/reasons, review decision, reviewer, reason, decision timestamp and downstream action.
303. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
304. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Safely combine records without deleting history or losing linked encounters/documents..
305. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-021-B: Handle exceptions and safety controls for Merge approved duplicate records

| Epic / workflow | W-HIM-021 - Merge approved duplicate records |
|---|---|
| Persona | HIM Supervisor |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Supervisor, I want to handle exceptions, validations and safety controls during Merge approved duplicate records, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | candidate records, match score/reasons, review decision, reviewer, reason, decision timestamp and downstream action |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-MRG-001, FR-HIM-MRG-002, FR-HIM-MRG-003, FR-HIM-MRG-004, FR-HIM-MRG-005, FR-HIM-MRG-006, FR-HIM-MRG-007, FR-HIM-MRG-008, FR-HIM-MRG-009, FR-HIM-MRG-010, FR-HIM-MRG-011 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

306. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
307. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle false positives, insufficient evidence, survivor selection conflicts, downstream preservation and reversal/manual reconciliation.
308. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
309. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
310. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-021-C: Audit, reporting and interoperability for Merge approved duplicate records

| Epic / workflow | W-HIM-021 - Merge approved duplicate records |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |

| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Merge approved duplicate records, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
|---|---|
| Data involved | candidate records, match score/reasons, review decision, reviewer, reason, decision timestamp and downstream action |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-MPI; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

311. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
312. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
313. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
314. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
315. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-022: Unmerge incorrect merge

| Category | Merge / Correction |
|---|---|
| Primary actor | HIM Supervisor |
| Supporting actors | HIM Officer, Auditor, Clinical/Billing Representatives |
| Trigger | A previous merge is discovered to be incorrect or unsafe. |
| Goal / output | Reverse merge where possible and flag manual reconciliation where automatic restoration is unsafe. |
| Linked requirements | FR-HIM-MRG-012, FR-HIM-MRG-013, FR-HIM-MRG-014, FR-HIM-MRG-015, FR-HIM-MRG-016, FR-HIM-MRG-017 |

#### US-HIM-022-A: Complete Unmerge incorrect merge

| Epic / workflow | W-HIM-022 - Unmerge incorrect merge |
|---|---|
| Persona | HIM Supervisor |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Supervisor, I want to reverse merge where possible and flag manual reconciliation where automatic restoration is unsafe., so that reverse merge where possible and flag manual reconciliation where automatic restoration is unsafe. |
| Data involved | survivor/non-survivor records, conflicting fields, selected values, preserved identifiers, linked encounters/documents and merge/unmerge audit |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-MRG-012, FR-HIM-MRG-013, FR-HIM-MRG-014, FR-HIM-MRG-015, FR-HIM-MRG-016, FR-HIM-MRG-017 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: A previous merge is discovered to be incorrect or unsafe. Supporting actors: HIM Officer, Auditor, Clinical/Billing Representatives |

**Acceptance criteria**

316. Given an authenticated HIM Supervisor with the required permission, when the user initiates Unmerge incorrect merge, then the system confirms patient context, applicable record status and required configuration before completion.
317. Given required inputs are provided, when the workflow is saved, then the system captures or updates survivor/non-survivor records, conflicting fields, selected values, preserved identifiers, linked encounters/documents and merge/unmerge audit.
318. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
319. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Reverse merge where possible and flag manual reconciliation where automatic restoration is unsafe..
320. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-022-B: Handle exceptions and safety controls for Unmerge incorrect merge

| Epic / workflow | W-HIM-022 - Unmerge incorrect merge |
|---|---|
| Persona | HIM Supervisor |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Supervisor, I want to handle exceptions, validations and safety controls during Unmerge incorrect merge, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | survivor/non-survivor records, conflicting fields, selected values, preserved identifiers, linked encounters/documents and merge/unmerge audit |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-MRG-012, FR-HIM-MRG-013, FR-HIM-MRG-014, FR-HIM-MRG-015, FR-HIM-MRG-016, FR-HIM-MRG-017 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

321. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
322. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle false positives, insufficient evidence, survivor selection conflicts, downstream preservation and reversal/manual reconciliation.
323. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
324. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
325. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-022-C: Audit, reporting and interoperability for Unmerge incorrect merge

| Epic / workflow | W-HIM-022 - Unmerge incorrect merge |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Unmerge incorrect merge, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | survivor/non-survivor records, conflicting fields, selected values, preserved identifiers, linked encounters/documents and merge/unmerge audit |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-MRG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

326. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
327. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
328. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
329. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
330. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-023: Patient search and record retrieval

| Category | Search |
|---|---|
| Primary actor | Authorised User |
| Supporting actors | HIM Officer, Clinician, Front Desk Officer, Auditor |
| Trigger | User needs to locate patient record for care, administration, billing, audit or records work. |
| Goal / output | Retrieve the correct patient record while protecting privacy and preventing wrong-patient actions. |

| Linked requirements | FR-HIM-SRH-001, FR-HIM-SRH-002, FR-HIM-SRH-003, FR-HIM-SRH-004, FR-HIM-SRH-005, FR-HIM-SRH-006, FR-HIM-SRH-007, FR-HIM-SRH-008, FR-HIM-SRH-009, FR-HIM-SRH-010 |
|---|---|

#### US-HIM-023-A: Complete Patient search and record retrieval

| Epic / workflow | W-HIM-023 - Patient search and record retrieval |
|---|---|
| Persona | Authorised User |
| Priority / MoSCoW | High / Must |
| User story | As a Authorised User, I want to retrieve the correct patient record while protecting privacy and preventing wrong-patient actions., so that retrieve the correct patient record while protecting privacy and preventing wrong-patient actions. |
| Data involved | search criteria, candidate list, selected patient, verification decision, patient banner, access/view log and routing status |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-SRH-001, FR-HIM-SRH-002, FR-HIM-SRH-003, FR-HIM-SRH-004, FR-HIM-SRH-005, FR-HIM-SRH-006, FR-HIM-SRH-007, FR-HIM-SRH-008, FR-HIM-SRH-009, FR-HIM-SRH-010 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: User needs to locate patient record for care, administration, billing, audit or records work. Supporting actors: HIM Officer, Clinician, Front Desk Officer, Auditor |

**Acceptance criteria**

331. Given an authenticated Authorised User with the required permission, when the user initiates Patient search and record retrieval, then the system confirms patient context, applicable record status and required configuration before completion.
332. Given required inputs are provided, when the workflow is saved, then the system captures or updates search criteria, candidate list, selected patient, verification decision, patient banner, access/view log and routing status.
333. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
334. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Retrieve the correct patient record while protecting privacy and preventing wrong-patient actions..
335. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-023-B: Handle exceptions and safety controls for Patient search and record retrieval

| Epic / workflow | W-HIM-023 - Patient search and record retrieval |
|---|---|
| Persona | Authorised User |
| Priority / MoSCoW | High / Must |
| User story | As a Authorised User, I want to handle exceptions, validations and safety controls during Patient search and record retrieval, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | search criteria, candidate list, selected patient, verification decision, patient banner, access/view log and routing status |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-SRH-001, FR-HIM-SRH-002, FR-HIM-SRH-003, FR-HIM-SRH-004, FR-HIM-SRH-005, FR-HIM-SRH-006, FR-HIM-SRH-007, FR-HIM-SRH-008, FR-HIM-SRH-009, FR-HIM-SRH-010 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

336. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
337. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle no match, multiple matches, restricted records, deceased/merged/temporary status and wrong-patient prevention.
338. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
339. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
340. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-023-C: Audit, reporting and interoperability for Patient search and record retrieval

| Epic / workflow | W-HIM-023 - Patient search and record retrieval |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Patient search and record retrieval, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | search criteria, candidate list, selected patient, verification decision, patient banner, access/view log and routing status |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-SRH; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

341. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
342. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
343. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
344. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
345. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-024: Restricted record and break-glass

| Category | Privacy / Access |
|---|---|
| Primary actor | Clinician or HIM Supervisor |
| Supporting actors | Data Protection Officer, Auditor, Security Admin |
| Trigger | User attempts to access a restricted/confidential patient record or sensitive document. |
| Goal / output | Protect sensitive records while permitting justified emergency access. |
| Linked requirements | NFR-HIM-PRI-003, NFR-HIM-PRI-004, NFR-HIM-PRI-006, NFR-HIM-PRI-007, NFR-HIM-PRI-008 |

#### US-HIM-024-A: Complete Restricted record and break-glass

| Epic / workflow | W-HIM-024 - Restricted record and break-glass |
|---|---|
| Persona | Clinician or HIM Supervisor |
| Priority / MoSCoW | Critical / Must |
| User story | As a Clinician or HIM Supervisor, I want to protect sensitive records while permitting justified emergency access., so that protect sensitive records while permitting justified emergency access. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | NFR-HIM-PRI-003, NFR-HIM-PRI-004, NFR-HIM-PRI-006, NFR-HIM-PRI-007, NFR-HIM-PRI-008 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: User attempts to access a restricted/confidential patient record or sensitive document. Supporting actors: Data Protection Officer, Auditor, Security Admin |

**Acceptance criteria**

346. Given an authenticated Clinician or HIM Supervisor with the required permission, when the user initiates Restricted record and break-glass, then the system confirms patient context, applicable record status and required configuration before completion.
347. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage.
348. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
349. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Protect sensitive records while permitting justified emergency access..
350. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-024-B: Handle exceptions and safety controls for Restricted record and break-glass

| Epic / workflow | W-HIM-024 - Restricted record and break-glass |
|---|---|
| Persona | Clinician or HIM Supervisor |
| Priority / MoSCoW | Critical / Must |
| User story | As a Clinician or HIM Supervisor, I want to handle exceptions, validations and safety controls during Restricted record and break-glass, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | NFR-HIM-PRI-003, NFR-HIM-PRI-004, NFR-HIM-PRI-006, NFR-HIM-PRI-007, NFR-HIM-PRI-008 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

351. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
352. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: enforce role denial, emergency justification, post-event review, denied-attempt logging and minimum necessary access.
353. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
354. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
355. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-024-C: Audit, reporting and interoperability for Restricted record and break-glass

| Epic / workflow | W-HIM-024 - Restricted record and break-glass |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Restricted record and break-glass, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-RES; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

356. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
357. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
358. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
359. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
360. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-025: Document upload and indexing

| Category | Medical Records |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | Patient, Clinician, Scanner Service |
| Trigger | A scanned, uploaded or generated document needs to become part of the patient medical record. |

| Goal / output | Attach document to correct patient/encounter with metadata, classification and audit. |
|---|---|
| Linked requirements | FR-HIM-DOC-001, FR-HIM-DOC-002, FR-HIM-DOC-003, FR-HIM-DOC-004, FR-HIM-DOC-005, FR-HIM-DOC-006, FR-HIM-DOC-007, FR-HIM-DOC-008, FR-HIM-DOC-009, FR-HIM-DOC-010 |

#### US-HIM-025-A: Complete Document upload and indexing

| Epic / workflow | W-HIM-025 - Document upload and indexing |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to attach document to correct patient/encounter with metadata, classification and audit., so that attach document to correct patient/encounter with metadata, classification and audit. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-DOC-001, FR-HIM-DOC-002, FR-HIM-DOC-003, FR-HIM-DOC-004, FR-HIM-DOC-005, FR-HIM-DOC-006, FR-HIM-DOC-007, FR-HIM-DOC-008, FR-HIM-DOC-009, FR-HIM-DOC-010 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: A scanned, uploaded or generated document needs to become part of the patient medical record. Supporting actors: Patient, Clinician, Scanner Service |

**Acceptance criteria**

361. Given an authenticated HIM Officer with the required permission, when the user initiates Document upload and indexing, then the system confirms patient context, applicable record status and required configuration before completion.
362. Given required inputs are provided, when the workflow is saved, then the system captures or updates document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata.
363. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
364. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Attach document to correct patient/encounter with metadata, classification and audit..
365. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-025-B: Handle exceptions and safety controls for Document upload and indexing

| Epic / workflow | W-HIM-025 - Document upload and indexing |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Document upload and indexing, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-DOC-001, FR-HIM-DOC-002, FR-HIM-DOC-003, FR-HIM-DOC-004, FR-HIM-DOC-005, FR-HIM-DOC-006, FR-HIM-DOC-007, FR-HIM-DOC-008, FR-HIM-DOC-009, FR-HIM-DOC-010 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

366. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
367. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle wrong-patient document, malware/file validation, bad scan quality, metadata errors, replacement and created-in-error status.
368. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
369. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
370. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-025-C: Audit, reporting and interoperability for Document upload and indexing

| Epic / workflow | W-HIM-025 - Document upload and indexing |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Document upload and indexing, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-DOC; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

371. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
372. Given approved interoperability or reporting is required, when the output is mapped, then it can map to DocumentReference, Provenance, AuditEvent and Consent where applicable where applicable without altering the REDNOXX canonical record.
373. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
374. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
375. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-026: Legacy scanned record indexing

| Category | Migration / Records |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | Scanning Clerk, HIM Supervisor, Migration Team |
| Trigger | Paper record or legacy file is scanned/imported for attachment to patient record. |
| Goal / output | Index legacy records with source, date range and quality status while preserving legacy MRN. |
| Linked requirements | FR-HIM-DOC-011, FR-HIM-DOC-012, FR-HIM-DOC-013, FR-HIM-DOC-014, FR-HIM-DOC-015 |

#### US-HIM-026-A: Complete Legacy scanned record indexing

| Epic / workflow | W-HIM-026 - Legacy scanned record indexing |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to index legacy records with source, date range and quality status while preserving legacy MRN., so that index legacy records with source, date range and quality status while preserving legacy mrn. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-DOC-011, FR-HIM-DOC-012, FR-HIM-DOC-013, FR-HIM-DOC-014, FR-HIM-DOC-015 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Paper record or legacy file is scanned/imported for attachment to patient record. Supporting actors: Scanning Clerk, HIM Supervisor, Migration Team |

**Acceptance criteria**

376. Given an authenticated HIM Officer with the required permission, when the user initiates Legacy scanned record indexing, then the system confirms patient context, applicable record status and required configuration before completion.
377. Given required inputs are provided, when the workflow is saved, then the system captures or updates document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata.
378. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
379. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Index legacy records with source, date range and quality status while preserving legacy MRN..
380. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-026-B: Handle exceptions and safety controls for Legacy scanned record indexing

| Epic / workflow | W-HIM-026 - Legacy scanned record indexing |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Legacy scanned record indexing, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-DOC-011, FR-HIM-DOC-012, FR-HIM-DOC-013, FR-HIM-DOC-014, FR-HIM-DOC-015 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

381. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
382. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle wrong-patient document, malware/file validation, bad scan quality, metadata errors, replacement and created-in-error status.
383. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
384. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
385. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-026-C: Audit, reporting and interoperability for Legacy scanned record indexing

| Epic / workflow | W-HIM-026 - Legacy scanned record indexing |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Legacy scanned record indexing, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-DOC; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

386. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
387. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
388. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
389. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
390. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-027: Document correction, replacement or created-in-error

| Category | Medical Records / Correction |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | HIM Supervisor, Clinician, Auditor |
| Trigger | Document is uploaded to wrong patient, wrong encounter, wrong type, poor quality, duplicate or created in error. |

| Goal / output | Correct document metadata or status without deleting evidence improperly. |
|---|---|
| Linked requirements | FR-HIM-DOC-016, FR-HIM-DOC-017, FR-HIM-DOC-018, FR-HIM-DOC-019, FR-HIM-DOC-020 |

#### US-HIM-027-A: Complete Document correction, replacement or created-in-error

| Epic / workflow | W-HIM-027 - Document correction, replacement or created-in-error |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to correct document metadata or status without deleting evidence improperly., so that correct document metadata or status without deleting evidence improperly. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-DOC-016, FR-HIM-DOC-017, FR-HIM-DOC-018, FR-HIM-DOC-019, FR-HIM-DOC-020 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Document is uploaded to wrong patient, wrong encounter, wrong type, poor quality, duplicate or created in error. Supporting actors: HIM Supervisor, Clinician, Auditor |

**Acceptance criteria**

391. Given an authenticated HIM Officer with the required permission, when the user initiates Document correction, replacement or created-in-error, then the system confirms patient context, applicable record status and required configuration before completion.
392. Given required inputs are provided, when the workflow is saved, then the system captures or updates document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata.
393. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
394. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Correct document metadata or status without deleting evidence improperly..
395. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-027-B: Handle exceptions and safety controls for Document correction, replacement or created-in-error

| Epic / workflow | W-HIM-027 - Document correction, replacement or created-in-error |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Document correction, replacement or created-in-error, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-DOC-016, FR-HIM-DOC-017, FR-HIM-DOC-018, FR-HIM-DOC-019, FR-HIM-DOC-020 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

396. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
397. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle wrong-patient document, malware/file validation, bad scan quality, metadata errors, replacement and created-in-error status.
398. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
399. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
400. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-027-C: Audit, reporting and interoperability for Document correction, replacement or created-in-error

| Epic / workflow | W-HIM-027 - Document correction, replacement or created-in-error |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |

| Priority / MoSCoW | High / Must |
|---|---|
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Document correction, replacement or created-in-error, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-DOC; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

401. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
402. Given approved interoperability or reporting is required, when the output is mapped, then it can map to DocumentReference, Provenance, AuditEvent and Consent where applicable where applicable without altering the REDNOXX canonical record.
403. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
404. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
405. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-028: Patient requests record release

| Category | Release of Information |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | Patient, HIM Supervisor, Data Protection Officer, Billing Officer |
| Trigger | Patient requests copy, summary, medical report or disclosure of own record. |
| Goal / output | Process authorised patient release request with scope, approval, fee handling and audit. |
| Linked requirements | FR-HIM-REL-001, FR-HIM-REL-002, FR-HIM-REL-003, FR-HIM-REL-004, FR-HIM-REL-005, FR-HIM-REL-006, FR-HIM-REL-007, FR-HIM-REL-008 |

#### US-HIM-028-A: Complete Patient requests record release

| Epic / workflow | W-HIM-028 - Patient requests record release |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Officer, I want to process authorised patient release request with scope, approval, fee handling and audit., so that process authorised patient release request with scope, approval, fee handling and audit. |
| Data involved | requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-REL-001, FR-HIM-REL-002, FR-HIM-REL-003, FR-HIM-REL-004, FR-HIM-REL-005, FR-HIM-REL-006, FR-HIM-REL-007, FR-HIM-REL-008 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient requests copy, summary, medical report or disclosure of own record. Supporting actors: Patient, HIM Supervisor, Data Protection Officer, Billing Officer |

**Acceptance criteria**

406. Given an authenticated HIM Officer with the required permission, when the user initiates Patient requests record release, then the system confirms patient context, applicable record status and required configuration before completion.
407. Given required inputs are provided, when the workflow is saved, then the system captures or updates requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata.
408. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
409. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Process authorised patient release request with scope, approval, fee handling and audit..
410. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-028-B: Handle exceptions and safety controls for Patient requests record release

| Epic / workflow | W-HIM-028 - Patient requests record release |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Patient requests record release, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-REL-001, FR-HIM-REL-002, FR-HIM-REL-003, FR-HIM-REL-004, FR-HIM-REL-005, FR-HIM-REL-006, FR-HIM-REL-007, FR-HIM-REL-008 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

411. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
412. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: verify requester authority, apply minimisation/redaction, route approvals, link fees where configured and audit disclosure.
413. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
414. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
415. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-028-C: Audit, reporting and interoperability for Patient requests record release

| Epic / workflow | W-HIM-028 - Patient requests record release |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Patient requests record release, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-REL; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

416. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
417. Given approved interoperability or reporting is required, when the output is mapped, then it can map to DocumentReference, Provenance, AuditEvent and Consent where applicable where applicable without altering the REDNOXX canonical record.
418. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
419. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
420. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-029: Guardian or third-party record release

| Category | Release / Privacy |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | Guardian/Next of Kin, HIM Supervisor, DPO, Legal/Compliance |
| Trigger | Guardian, next of kin, employer, insurer, lawyer, court or other third party requests patient records. |
| Goal / output | Ensure disclosure is lawful, authorised, minimal and auditable. |

| Linked requirements | FR-HIM-REL-009, FR-HIM-REL-010, FR-HIM-REL-011, FR-HIM-REL-012, FR-HIM-REL-013, FR-HIM-REL-014, FR-HIM-REL-015 |
|---|---|

#### US-HIM-029-A: Complete Guardian or third-party record release

| Epic / workflow | W-HIM-029 - Guardian or third-party record release |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Officer, I want to ensure disclosure is lawful, authorised, minimal and auditable., so that ensure disclosure is lawful, authorised, minimal and auditable. |
| Data involved | requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-REL-009, FR-HIM-REL-010, FR-HIM-REL-011, FR-HIM-REL-012, FR-HIM-REL-013, FR-HIM-REL-014, FR-HIM-REL-015 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Guardian, next of kin, employer, insurer, lawyer, court or other third party requests patient records. Supporting actors: Guardian/Next of Kin, HIM Supervisor, DPO, Legal/Compliance |

**Acceptance criteria**

421. Given an authenticated HIM Officer with the required permission, when the user initiates Guardian or third-party record release, then the system confirms patient context, applicable record status and required configuration before completion.
422. Given required inputs are provided, when the workflow is saved, then the system captures or updates requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata.
423. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
424. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Ensure disclosure is lawful, authorised, minimal and auditable..
425. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-029-B: Handle exceptions and safety controls for Guardian or third-party record release

| Epic / workflow | W-HIM-029 - Guardian or third-party record release |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Guardian or third-party record release, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-REL-009, FR-HIM-REL-010, FR-HIM-REL-011, FR-HIM-REL-012, FR-HIM-REL-013, FR-HIM-REL-014, FR-HIM-REL-015 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

426. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
427. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle absent or disputed guardian authority, mother-baby linkage, multiple births, legal-name update and consent/release restrictions.
428. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
429. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
430. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-029-C: Audit, reporting and interoperability for Guardian or third-party record release

| Epic / workflow | W-HIM-029 - Guardian or third-party record release |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |

| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Guardian or third-party record release, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
|---|---|
| Data involved | requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-REL; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

431. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
432. Given approved interoperability or reporting is required, when the output is mapped, then it can map to DocumentReference, Provenance, AuditEvent and Consent where applicable where applicable without altering the REDNOXX canonical record.
433. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
434. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
435. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-030: Internal clinical records request

| Category | Medical Records / Internal Request |
|---|---|
| Primary actor | Clinician |
| Supporting actors | HIM Officer, HIM Supervisor, Ward Clerk |
| Trigger | Clinician or department requests archived, legacy, restricted or paper-scanned record for care. |
| Goal / output | Provide authorised internal access to required record material while logging access. |
| Linked requirements | FR-HIM-REL-016, FR-HIM-REL-017, FR-HIM-REL-018 |

#### US-HIM-030-A: Complete Internal clinical records request

| Epic / workflow | W-HIM-030 - Internal clinical records request |
|---|---|
| Persona | Clinician |
| Priority / MoSCoW | High / Must |
| User story | As a Clinician, I want to provide authorised internal access to required record material while logging access., so that provide authorised internal access to required record material while logging access. |
| Data involved | requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REL-016, FR-HIM-REL-017, FR-HIM-REL-018 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Clinician or department requests archived, legacy, restricted or paper-scanned record for care. Supporting actors: HIM Officer, HIM Supervisor, Ward Clerk |

**Acceptance criteria**

436. Given an authenticated Clinician with the required permission, when the user initiates Internal clinical records request, then the system confirms patient context, applicable record status and required configuration before completion.
437. Given required inputs are provided, when the workflow is saved, then the system captures or updates requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata.
438. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
439. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Provide authorised internal access to required record material while logging access..
440. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-030-B: Handle exceptions and safety controls for Internal clinical records request

| Epic / workflow | W-HIM-030 - Internal clinical records request |
|---|---|

| Persona | Clinician |
|---|---|
| Priority / MoSCoW | High / Must |
| User story | As a Clinician, I want to handle exceptions, validations and safety controls during Internal clinical records request, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REL-016, FR-HIM-REL-017, FR-HIM-REL-018 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

441. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
442. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: verify requester authority, apply minimisation/redaction, route approvals, link fees where configured and audit disclosure.
443. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
444. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
445. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-030-C: Audit, reporting and interoperability for Internal clinical records request

| Epic / workflow | W-HIM-030 - Internal clinical records request |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Internal clinical records request, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REL; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

446. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
447. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
448. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
449. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
450. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-031: HMO / claims document request

| Category | Claims / Release |
|---|---|
| Primary actor | Claims / HMO Officer |
| Supporting actors | HIM Officer, Billing Officer, HIM Supervisor, Payer Representative |
| Trigger | Insurance/HMO/claims workflow requires medical-record evidence, eligibility or pre-authorisation documentation. |
| Goal / output | Provide authorised evidence package linked to patient, encounter and coverage. |
| Linked requirements | FR-HIM-REL-019, FR-HIM-REL-020, FR-HIM-REL-021 |

#### US-HIM-031-A: Complete HMO / claims document request

| Epic / workflow | W-HIM-031 - HMO / claims document request |
|---|---|

| Persona | Claims / HMO Officer |
|---|---|
| Priority / MoSCoW | High / Must |
| User story | As a Claims / HMO Officer, I want to provide authorised evidence package linked to patient, encounter and coverage., so that provide authorised evidence package linked to patient, encounter and coverage. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-REL-019, FR-HIM-REL-020, FR-HIM-REL-021 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Insurance/HMO/claims workflow requires medical-record evidence, eligibility or pre-authorisation documentation. Supporting actors: HIM Officer, Billing Officer, HIM Supervisor, Payer Representative |

**Acceptance criteria**

451. Given an authenticated Claims / HMO Officer with the required permission, when the user initiates HMO / claims document request, then the system confirms patient context, applicable record status and required configuration before completion.
452. Given required inputs are provided, when the workflow is saved, then the system captures or updates document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata.
453. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
454. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Provide authorised evidence package linked to patient, encounter and coverage..
455. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-031-B: Handle exceptions and safety controls for HMO / claims document request

| Epic / workflow | W-HIM-031 - HMO / claims document request |
|---|---|
| Persona | Claims / HMO Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Claims / HMO Officer, I want to handle exceptions, validations and safety controls during HMO / claims document request, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-REL-019, FR-HIM-REL-020, FR-HIM-REL-021 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

456. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
457. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle wrong-patient document, malware/file validation, bad scan quality, metadata errors, replacement and created-in-error status.
458. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
459. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
460. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-031-C: Audit, reporting and interoperability for HMO / claims document request

| Epic / workflow | W-HIM-031 - HMO / claims document request |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of HMO / claims document request, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | document file, document type, patient/encounter link, source, date, confidentiality level, version/status and audit metadata |
| Mapping / interoperability | DocumentReference, Provenance, AuditEvent and Consent where applicable |
| Linked requirements | FR-HIM-DOC; NFR-HIM-AUD; NFR-HIM-INT |

| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
|---|---|
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

461. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
462. Given approved interoperability or reporting is required, when the output is mapped, then it can map to DocumentReference, Provenance, AuditEvent and Consent where applicable where applicable without altering the REDNOXX canonical record.
463. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
464. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
465. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-032: Consent capture, update or withdrawal

| Category | Consent / Privacy |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | Patient, Guardian, Clinician, DPO |
| Trigger | Consent is required for treatment administration, record sharing, research/analytics, portal, insurance or disclosure workflow. |
| Goal / output | Record consent status, scope and source in a reusable and auditable form. |
| Linked requirements | FR-HIM-CON-001, FR-HIM-CON-002, FR-HIM-CON-003, FR-HIM-CON-004, FR-HIM-CON-005 |

#### US-HIM-032-A: Complete Consent capture, update or withdrawal

| Epic / workflow | W-HIM-032 - Consent capture, update or withdrawal |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Officer, I want to record consent status, scope and source in a reusable and auditable form., so that record consent status, scope and source in a reusable and auditable form. |
| Data involved | consent status, scope, category, patient, representative, date, source document, withdrawal and audit metadata |
| Mapping / interoperability | Consent / NgConsent, Provenance and AuditEvent |
| Linked requirements | FR-HIM-CON-001, FR-HIM-CON-002, FR-HIM-CON-003, FR-HIM-CON-004, FR-HIM-CON-005 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Consent is required for treatment administration, record sharing, research/analytics, portal, insurance or disclosure workflow. Supporting actors: Patient, Guardian, Clinician, DPO |

**Acceptance criteria**

466. Given an authenticated HIM Officer with the required permission, when the user initiates Consent capture, update or withdrawal, then the system confirms patient context, applicable record status and required configuration before completion.
467. Given required inputs are provided, when the workflow is saved, then the system captures or updates consent status, scope, category, patient, representative, date, source document, withdrawal and audit metadata.
468. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
469. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Record consent status, scope and source in a reusable and auditable form..
470. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-032-B: Handle exceptions and safety controls for Consent capture, update or withdrawal

| Epic / workflow | W-HIM-032 - Consent capture, update or withdrawal |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Consent capture, update or withdrawal, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | consent status, scope, category, patient, representative, date, source document, withdrawal and audit metadata |
| Mapping / interoperability | Consent / NgConsent, Provenance and AuditEvent |

| Linked requirements | FR-HIM-CON-001, FR-HIM-CON-002, FR-HIM-CON-003, FR-HIM-CON-004, FR-HIM-CON-005 |
|---|---|
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

471. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
472. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle consent withdrawal, guardian consent, disputed authority, entered-in-error status and separate treatment versus disclosure consent.
473. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
474. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
475. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-032-C: Audit, reporting and interoperability for Consent capture, update or withdrawal

| Epic / workflow | W-HIM-032 - Consent capture, update or withdrawal |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Consent capture, update or withdrawal, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | consent status, scope, category, patient, representative, date, source document, withdrawal and audit metadata |
| Mapping / interoperability | Consent / NgConsent, Provenance and AuditEvent |
| Linked requirements | FR-HIM-CON; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

476. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
477. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Consent / NgConsent, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
478. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
479. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
480. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-033: Referral registration

| Category | Referral / Registration |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, Referring Facility, Clinician, HIM Officer |
| Trigger | Patient arrives with referral or system receives referral context. |
| Goal / output | Register or verify patient and preserve referral source/context for care continuity. |
| Linked requirements | FR-HIM-REG-105, FR-HIM-REG-106, FR-HIM-REG-107, FR-HIM-REG-108 |

#### US-HIM-033-A: Complete Referral registration

| Epic / workflow | W-HIM-033 - Referral registration |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to register or verify patient and preserve referral source/context for care continuity., so that register or verify patient and preserve referral source/context for care continuity. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | ServiceRequest, Task, Encounter and Provenance |
| Linked requirements | FR-HIM-REG-105, FR-HIM-REG-106, FR-HIM-REG-107, FR-HIM-REG-108 |

| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
|---|---|
| Notes | Workflow trigger: Patient arrives with referral or system receives referral context. Supporting actors: Patient, Referring Facility, Clinician, HIM Officer |

**Acceptance criteria**

481. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Referral registration, then the system confirms patient context, applicable record status and required configuration before completion.
482. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
483. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
484. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Register or verify patient and preserve referral source/context for care continuity..
485. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-033-B: Handle exceptions and safety controls for Referral registration

| Epic / workflow | W-HIM-033 - Referral registration |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Referral registration, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | ServiceRequest, Task, Encounter and Provenance |
| Linked requirements | FR-HIM-REG-105, FR-HIM-REG-106, FR-HIM-REG-107, FR-HIM-REG-108 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

486. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
487. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: manage missing demographics, duplicate candidates, unavailable identifiers, payer/category gaps and cancelled/created-in-error registrations.
488. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
489. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
490. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-033-C: Audit, reporting and interoperability for Referral registration

| Epic / workflow | W-HIM-033 - Referral registration |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Referral registration, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | ServiceRequest, Task, Encounter and Provenance |
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

491. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
492. Given approved interoperability or reporting is required, when the output is mapped, then it can map to ServiceRequest, Task, Encounter and Provenance where applicable without altering the REDNOXX canonical record.
493. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
494. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
495. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-034: Payer / insurance coverage capture

| Category | Billing / Claims |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, Billing Officer, Claims Officer, Payer/HMO |
| Trigger | Patient declares insurance, HMO, corporate, NHIA, staff, welfare or other payer category. |
| Goal / output | Capture payer and coverage data separately from patient identity for billing and claims. |
| Linked requirements | FR-HIM-REG-100, FR-HIM-REG-101, FR-HIM-REG-102, FR-HIM-REG-103, FR-HIM-REG-104 |

#### US-HIM-034-A: Complete Payer / insurance coverage capture

| Epic / workflow | W-HIM-034 - Payer / insurance coverage capture |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to capture payer and coverage data separately from patient identity for billing and claims., so that capture payer and coverage data separately from patient identity for billing and claims. |
| Data involved | payer, plan, insurance number, eligibility/coverage status, patient binding, encounter link and claims evidence reference |
| Mapping / interoperability | Coverage, CoverageEligibilityRequest/Response, Claim, Invoice and Patient identifier mappings |
| Linked requirements | FR-HIM-REG-100, FR-HIM-REG-101, FR-HIM-REG-102, FR-HIM-REG-103, FR-HIM-REG-104 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient declares insurance, HMO, corporate, NHIA, staff, welfare or other payer category. Supporting actors: Patient, Billing Officer, Claims Officer, Payer/HMO |

**Acceptance criteria**

496. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Payer / insurance coverage capture, then the system confirms patient context, applicable record status and required configuration before completion.
497. Given required inputs are provided, when the workflow is saved, then the system captures or updates payer, plan, insurance number, eligibility/coverage status, patient binding, encounter link and claims evidence reference.
498. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
499. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Capture payer and coverage data separately from patient identity for billing and claims..
500. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-034-B: Handle exceptions and safety controls for Payer / insurance coverage capture

| Epic / workflow | W-HIM-034 - Payer / insurance coverage capture |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Payer / insurance coverage capture, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | payer, plan, insurance number, eligibility/coverage status, patient binding, encounter link and claims evidence reference |
| Mapping / interoperability | Coverage, CoverageEligibilityRequest/Response, Claim, Invoice and Patient identifier mappings |
| Linked requirements | FR-HIM-REG-100, FR-HIM-REG-101, FR-HIM-REG-102, FR-HIM-REG-103, FR-HIM-REG-104 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

501. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
502. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle inactive coverage, payer mismatch, eligibility pending, coverage changes and claims handoff without changing core identity.
503. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
504. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
505. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-034-C: Audit, reporting and interoperability for Payer / insurance coverage capture

| Epic / workflow | W-HIM-034 - Payer / insurance coverage capture |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Payer / insurance coverage capture, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | payer, plan, insurance number, eligibility/coverage status, patient binding, encounter link and claims evidence reference |
| Mapping / interoperability | Coverage, CoverageEligibilityRequest/Response, Claim, Invoice and Patient identifier mappings |
| Linked requirements | FR-HIM-CLAIMS; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

506. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
507. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Coverage, CoverageEligibilityRequest/Response, Claim, Invoice and Patient identifier mappings where applicable without altering the REDNOXX canonical record.
508. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
509. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
510. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-035: Queue routing after registration

| Category | Queue / Operations |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Queue Service, Clinic Nurse, Billing Officer |
| Trigger | Registration or verification is complete and patient needs next service. |
| Goal / output | Place patient into correct queue with patient context, priority and payer prerequisites. |
| Linked requirements | FR-HIM-GEN-007, FR-HIM-GEN-010, FR-HIM-GEN-011, FR-HIM-GEN-012 |

#### US-HIM-035-A: Complete Queue routing after registration

| Epic / workflow | W-HIM-035 - Queue routing after registration |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to place patient into correct queue with patient context, priority and payer prerequisites., so that place patient into correct queue with patient context, priority and payer prerequisites. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Encounter, Task/QueueEvent, Appointment and Provenance |
| Linked requirements | FR-HIM-GEN-007, FR-HIM-GEN-010, FR-HIM-GEN-011, FR-HIM-GEN-012 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |

| Notes | Workflow trigger: Registration or verification is complete and patient needs next service. Supporting actors: Queue Service, Clinic Nurse, Billing Officer |
|---|---|

**Acceptance criteria**

511. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Queue routing after registration, then the system confirms patient context, applicable record status and required configuration before completion.
512. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
513. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
514. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Place patient into correct queue with patient context, priority and payer prerequisites..
515. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-035-B: Handle exceptions and safety controls for Queue routing after registration

| Epic / workflow | W-HIM-035 - Queue routing after registration |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Queue routing after registration, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Encounter, Task/QueueEvent, Appointment and Provenance |
| Linked requirements | FR-HIM-GEN-007, FR-HIM-GEN-010, FR-HIM-GEN-011, FR-HIM-GEN-012 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

516. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
517. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: manage missing demographics, duplicate candidates, unavailable identifiers, payer/category gaps and cancelled/created-in-error registrations.
518. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
519. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
520. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-035-C: Audit, reporting and interoperability for Queue routing after registration

| Epic / workflow | W-HIM-035 - Queue routing after registration |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Queue routing after registration, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Encounter, Task/QueueEvent, Appointment and Provenance |
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

521. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
522. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Encounter, Task/QueueEvent, Appointment and Provenance where applicable without altering the REDNOXX canonical record.
523. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
524. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
525. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-036: Encounter creation/linkage

| Category | Encounter / Integration |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Clinician, Billing Officer, Queue Service, Encounter Service |
| Trigger | A verified patient starts OPD, A&E, diagnostic-only, pharmacy-only, inpatient or other visit. |
| Goal / output | Create or link encounter so downstream clinical, billing and claims actions share the same patient context. |
| Linked requirements | FR-HIM-GEN-001, FR-HIM-GEN-002, FR-HIM-GEN-007 |

#### US-HIM-036-A: Complete Encounter creation/linkage

| Epic / workflow | W-HIM-036 - Encounter creation/linkage |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to create or link encounter so downstream clinical, billing and claims actions share the same patient context., so that create or link encounter so downstream clinical, billing and claims actions share the same patient context. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Encounter, Task/QueueEvent, Appointment and Provenance |
| Linked requirements | FR-HIM-GEN-001, FR-HIM-GEN-002, FR-HIM-GEN-007 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: A verified patient starts OPD, A&E, diagnostic-only, pharmacy-only, inpatient or other visit. Supporting actors: Clinician, Billing Officer, Queue Service, Encounter Service |

**Acceptance criteria**

526. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Encounter creation/linkage, then the system confirms patient context, applicable record status and required configuration before completion.
527. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage.
528. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
529. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Create or link encounter so downstream clinical, billing and claims actions share the same patient context..
530. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-036-B: Handle exceptions and safety controls for Encounter creation/linkage

| Epic / workflow | W-HIM-036 - Encounter creation/linkage |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Encounter creation/linkage, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Encounter, Task/QueueEvent, Appointment and Provenance |
| Linked requirements | FR-HIM-GEN-001, FR-HIM-GEN-002, FR-HIM-GEN-007 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

531. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
532. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle missing data, duplicate candidates, restricted access, system/network errors and unauthorised user attempts.
533. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
534. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
535. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-036-C: Audit, reporting and interoperability for Encounter creation/linkage

| Epic / workflow | W-HIM-036 - Encounter creation/linkage |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Encounter creation/linkage, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Encounter, Task/QueueEvent, Appointment and Provenance |
| Linked requirements | FR-HIM-GEN; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

536. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
537. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Encounter, Task/QueueEvent, Appointment and Provenance where applicable without altering the REDNOXX canonical record.
538. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
539. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
540. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-037: Offline/degraded registration

| Category | Resilience |
|---|---|
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | HIM Supervisor, IT Support, A&E Registration Officer |
| Trigger | Network, server, power or endpoint issue prevents normal online registration. |
| Goal / output | Continue essential registration safely while preserving reconciliation and audit requirements. |
| Linked requirements | NFR-HIM-RESIL-001, NFR-HIM-RESIL-002, NFR-HIM-RESIL-003, NFR-HIM-RESIL-004, NFR-HIM-RESIL-005 |

#### US-HIM-037-A: Complete Offline/degraded registration

| Epic / workflow | W-HIM-037 - Offline/degraded registration |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to continue essential registration safely while preserving reconciliation and audit requirements., so that continue essential registration safely while preserving reconciliation and audit requirements. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | NFR-HIM-RESIL-001, NFR-HIM-RESIL-002, NFR-HIM-RESIL-003, NFR-HIM-RESIL-004, NFR-HIM-RESIL-005 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Network, server, power or endpoint issue prevents normal online registration. Supporting actors: HIM Supervisor, IT Support, A&E Registration Officer |

**Acceptance criteria**

541. Given an authenticated Front Desk / Registration Officer with the required permission, when the user initiates Offline/degraded registration, then the system confirms patient context, applicable record status and required configuration before completion.
542. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata.
543. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
544. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Continue essential registration safely while preserving reconciliation and audit requirements..
545. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-037-B: Handle exceptions and safety controls for Offline/degraded registration

| Epic / workflow | W-HIM-037 - Offline/degraded registration |
|---|---|
| Persona | Front Desk / Registration Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / Registration Officer, I want to handle exceptions, validations and safety controls during Offline/degraded registration, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | NFR-HIM-RESIL-001, NFR-HIM-RESIL-002, NFR-HIM-RESIL-003, NFR-HIM-RESIL-004, NFR-HIM-RESIL-005 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

546. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
547. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: manage missing demographics, duplicate candidates, unavailable identifiers, payer/category gaps and cancelled/created-in-error registrations.
548. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
549. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
550. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-037-C: Audit, reporting and interoperability for Offline/degraded registration

| Epic / workflow | W-HIM-037 - Offline/degraded registration |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Offline/degraded registration, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient identity, MRN/temporary ID, demographics, identifiers, contacts, next of kin/guardian, patient category, payer/category and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

551. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
552. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
553. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
554. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
555. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-038: Offline sync and reconciliation

| Category | Resilience / Data Quality |
|---|---|
| Primary actor | HIM Officer |
| Supporting actors | IT Support, HIM Supervisor, Front Desk Officer |
| Trigger | System connectivity returns after offline/degraded registration or import. |
| Goal / output | Convert downtime/offline records into trusted patient records without duplicates or data loss. |
| Linked requirements | NFR-HIM-RESIL-006, NFR-HIM-RESIL-007, NFR-HIM-RESIL-008, NFR-HIM-RESIL-009 |

#### US-HIM-038-A: Complete Offline sync and reconciliation

| Epic / workflow | W-HIM-038 - Offline sync and reconciliation |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Officer, I want to convert downtime/offline records into trusted patient records without duplicates or data loss., so that convert downtime/offline records into trusted patient records without duplicates or data loss. |
| Data involved | downtime records, temporary IDs, legacy MRNs, imported source, conflict log, duplicate review items and reconciliation audit |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | NFR-HIM-RESIL-006, NFR-HIM-RESIL-007, NFR-HIM-RESIL-008, NFR-HIM-RESIL-009 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: System connectivity returns after offline/degraded registration or import. Supporting actors: IT Support, HIM Supervisor, Front Desk Officer |

**Acceptance criteria**

556. Given an authenticated HIM Officer with the required permission, when the user initiates Offline sync and reconciliation, then the system confirms patient context, applicable record status and required configuration before completion.
557. Given required inputs are provided, when the workflow is saved, then the system captures or updates downtime records, temporary IDs, legacy MRNs, imported source, conflict log, duplicate review items and reconciliation audit.
558. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
559. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Convert downtime/offline records into trusted patient records without duplicates or data loss..
560. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-038-B: Handle exceptions and safety controls for Offline sync and reconciliation

| Epic / workflow | W-HIM-038 - Offline sync and reconciliation |
|---|---|
| Persona | HIM Officer |
| Priority / MoSCoW | Critical / Must |
| User story | As a HIM Officer, I want to handle exceptions, validations and safety controls during Offline sync and reconciliation, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | downtime records, temporary IDs, legacy MRNs, imported source, conflict log, duplicate review items and reconciliation audit |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | NFR-HIM-RESIL-006, NFR-HIM-RESIL-007, NFR-HIM-RESIL-008, NFR-HIM-RESIL-009 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

561. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
562. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle duplicate imported records, paper fallback entries, sync conflicts, rollback and mandatory reconciliation.
563. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
564. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
565. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-038-C: Audit, reporting and interoperability for Offline sync and reconciliation

| Epic / workflow | W-HIM-038 - Offline sync and reconciliation |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Offline sync and reconciliation, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | downtime records, temporary IDs, legacy MRNs, imported source, conflict log, duplicate review items and reconciliation audit |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | NFR-HIM-RESIL; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

566. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
567. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
568. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
569. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
570. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-039: Legacy data migration and patient binding

| Category | Migration |
|---|---|
| Primary actor | Migration Team |
| Supporting actors | HIM Officer, HIM Supervisor, Data Quality Lead, IT Support |
| Trigger | Existing patient records from paper, spreadsheets or legacy systems need loading into REDNOXX. |
| Goal / output | Import legacy patient data while preserving source identifiers and controlling duplicates. |
| Linked requirements | FR-HIM-MIG-001, FR-HIM-MIG-002, FR-HIM-MIG-003, FR-HIM-MIG-004, FR-HIM-MIG-005 |

#### US-HIM-039-A: Complete Legacy data migration and patient binding

| Epic / workflow | W-HIM-039 - Legacy data migration and patient binding |
|---|---|
| Persona | Migration Team |
| Priority / MoSCoW | High / Must |
| User story | As a Migration Team, I want to import legacy patient data while preserving source identifiers and controlling duplicates., so that import legacy patient data while preserving source identifiers and controlling duplicates. |
| Data involved | downtime records, temporary IDs, legacy MRNs, imported source, conflict log, duplicate review items and reconciliation audit |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-MIG-001, FR-HIM-MIG-002, FR-HIM-MIG-003, FR-HIM-MIG-004, FR-HIM-MIG-005 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Existing patient records from paper, spreadsheets or legacy systems need loading into REDNOXX. Supporting actors: HIM Officer, HIM Supervisor, Data Quality Lead, IT Support |

**Acceptance criteria**

571. Given an authenticated Migration Team with the required permission, when the user initiates Legacy data migration and patient binding, then the system confirms patient context, applicable record status and required configuration before completion.
572. Given required inputs are provided, when the workflow is saved, then the system captures or updates downtime records, temporary IDs, legacy MRNs, imported source, conflict log, duplicate review items and reconciliation audit.
573. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
574. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Import legacy patient data while preserving source identifiers and controlling duplicates..
575. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-039-B: Handle exceptions and safety controls for Legacy data migration and patient binding

| Epic / workflow | W-HIM-039 - Legacy data migration and patient binding |
|---|---|
| Persona | Migration Team |
| Priority / MoSCoW | High / Must |
| User story | As a Migration Team, I want to handle exceptions, validations and safety controls during Legacy data migration and patient binding, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | downtime records, temporary IDs, legacy MRNs, imported source, conflict log, duplicate review items and reconciliation audit |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-MIG-001, FR-HIM-MIG-002, FR-HIM-MIG-003, FR-HIM-MIG-004, FR-HIM-MIG-005 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

576. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
577. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle duplicate imported records, paper fallback entries, sync conflicts, rollback and mandatory reconciliation.
578. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
579. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
580. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-039-C: Audit, reporting and interoperability for Legacy data migration and patient binding

| Epic / workflow | W-HIM-039 - Legacy data migration and patient binding |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Legacy data migration and patient binding, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | downtime records, temporary IDs, legacy MRNs, imported source, conflict log, duplicate review items and reconciliation audit |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-GEN; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

581. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
582. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
583. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
584. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
585. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-040: Audit review and HIM reporting

| Category | Audit / Reporting |
|---|---|
| Primary actor | Auditor / Compliance Reviewer |
| Supporting actors | HIM Supervisor, DPO, Facility Administrator |
| Trigger | Scheduled audit, incident investigation, privacy review, management report or release readiness assessment. |
| Goal / output | Review HIM actions and generate reports without exposing unnecessary patient data. |
| Linked requirements | NFR-HIM-AUD-001, NFR-HIM-AUD-002, NFR-HIM-AUD-003, NFR-HIM-AUD-004, NFR-HIM-AUD-005, NFR-HIM-AUD-006, NFR-HIM-AUD-007, NFR-HIM-AUD-008, NFR-HIM-AUD-009, NFR-HIM-AUD-010 |

#### US-HIM-040-A: Complete Audit review and HIM reporting

| Epic / workflow | W-HIM-040 - Audit review and HIM reporting |
|---|---|
| Persona | Auditor / Compliance Reviewer |
| Priority / MoSCoW | High / Must |
| User story | As a Auditor / Compliance Reviewer, I want to review HIM actions and generate reports without exposing unnecessary patient data., so that review him actions and generate reports without exposing unnecessary patient data. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | AuditEvent, Provenance and configuration/version metadata |
| Linked requirements | NFR-HIM-AUD-001, NFR-HIM-AUD-002, NFR-HIM-AUD-003, NFR-HIM-AUD-004, NFR-HIM-AUD-005, NFR-HIM-AUD-006, NFR-HIM-AUD-007, NFR-HIM-AUD-008, NFR-HIM-AUD-009, NFR-HIM-AUD-010 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Scheduled audit, incident investigation, privacy review, management report or release readiness assessment. Supporting actors: HIM Supervisor, DPO, Facility Administrator |

**Acceptance criteria**

586. Given an authenticated Auditor / Compliance Reviewer with the required permission, when the user initiates Audit review and HIM reporting, then the system confirms patient context, applicable record status and required configuration before completion.
587. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage.
588. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
589. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Review HIM actions and generate reports without exposing unnecessary patient data..
590. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-040-B: Handle exceptions and safety controls for Audit review and HIM reporting

| Epic / workflow | W-HIM-040 - Audit review and HIM reporting |
|---|---|
| Persona | Auditor / Compliance Reviewer |
| Priority / MoSCoW | High / Must |
| User story | As a Auditor / Compliance Reviewer, I want to handle exceptions, validations and safety controls during Audit review and HIM reporting, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | AuditEvent, Provenance and configuration/version metadata |
| Linked requirements | NFR-HIM-AUD-001, NFR-HIM-AUD-002, NFR-HIM-AUD-003, NFR-HIM-AUD-004, NFR-HIM-AUD-005, NFR-HIM-AUD-006, NFR-HIM-AUD-007, NFR-HIM-AUD-008, NFR-HIM-AUD-009, NFR-HIM-AUD-010 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

591. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
592. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle access scope, export approval, rectification limits, clinical-record integrity and privacy evidence.
593. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
594. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
595. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-040-C: Audit, reporting and interoperability for Audit review and HIM reporting

| Epic / workflow | W-HIM-040 - Audit review and HIM reporting |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Audit review and HIM reporting, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | AuditEvent, Provenance and configuration/version metadata |
| Linked requirements | NFR-HIM-AUD; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

596. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
597. Given approved interoperability or reporting is required, when the output is mapped, then it can map to AuditEvent, Provenance and configuration/version metadata where applicable without altering the REDNOXX canonical record.
598. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
599. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
600. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-041: Data subject access or rectification request

| Category | Privacy / Data Rights |
|---|---|
| Primary actor | Data Protection Officer |
| Supporting actors | HIM Officer, Patient, HIM Supervisor, Legal/Compliance |
| Trigger | Patient requests access, correction, restriction, portability, objection, erasure/forgetting assessment or other data-subject right. |
| Goal / output | Process patient data-rights requests consistently with NDPA obligations and health-record retention rules. |
| Linked requirements | NFR-HIM-PRI-001, NFR-HIM-PRI-002, NFR-HIM-PRI-003, NFR-HIM-PRI-004, NFR-HIM-PRI-005, NFR-HIM-PRI-006, NFR-HIM-PRI-007, NFR-HIM-PRI-008, NFR-HIM-PRI-009, NFR-HIM-PRI-010 |

#### US-HIM-041-A: Complete Data subject access or rectification request

| Epic / workflow | W-HIM-041 - Data subject access or rectification request |
|---|---|
| Persona | Data Protection Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Data Protection Officer, I want to process patient data-rights requests consistently with NDPA obligations and health-record retention rules., so that process patient data-rights requests consistently with ndpa obligations and health-record retention rules. |
| Data involved | requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | NFR-HIM-PRI-001, NFR-HIM-PRI-002, NFR-HIM-PRI-003, NFR-HIM-PRI-004, NFR-HIM-PRI-005, NFR-HIM-PRI-006, NFR-HIM-PRI-007, NFR-HIM-PRI-008, NFR-HIM-PRI-009, NFR-HIM-PRI-010 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |

| Notes | Workflow trigger: Patient requests access, correction, restriction, portability, objection, erasure/forgetting assessment or other data-subject right. Supporting actors: HIM Officer, Patient, HIM Supervisor, Legal/Compliance |
|---|---|

**Acceptance criteria**

601. Given an authenticated Data Protection Officer with the required permission, when the user initiates Data subject access or rectification request, then the system confirms patient context, applicable record status and required configuration before completion.
602. Given required inputs are provided, when the workflow is saved, then the system captures or updates requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata.
603. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
604. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Process patient data-rights requests consistently with NDPA obligations and health-record retention rules..
605. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-041-B: Handle exceptions and safety controls for Data subject access or rectification request

| Epic / workflow | W-HIM-041 - Data subject access or rectification request |
|---|---|
| Persona | Data Protection Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Data Protection Officer, I want to handle exceptions, validations and safety controls during Data subject access or rectification request, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | NFR-HIM-PRI-001, NFR-HIM-PRI-002, NFR-HIM-PRI-003, NFR-HIM-PRI-004, NFR-HIM-PRI-005, NFR-HIM-PRI-006, NFR-HIM-PRI-007, NFR-HIM-PRI-008, NFR-HIM-PRI-009, NFR-HIM-PRI-010 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

606. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
607. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle access scope, export approval, rectification limits, clinical-record integrity and privacy evidence.
608. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
609. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
610. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-041-C: Audit, reporting and interoperability for Data subject access or rectification request

| Epic / workflow | W-HIM-041 - Data subject access or rectification request |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Data subject access or rectification request, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | requester, authority evidence, purpose, scope, approval, release package, method, fee link where configured and audit metadata |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-REL; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

611. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
612. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
613. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
614. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
615. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-042: Archive, inactivate or reactivate patient record

| Category | Record Lifecycle |
|---|---|
| Primary actor | HIM Supervisor |
| Supporting actors | HIM Officer, Auditor, Clinician, DPO |
| Trigger | Patient record needs lifecycle status change due to inactivity, created-in-error, archival, restoration or policy review. |
| Goal / output | Control record lifecycle without hard deletion and without losing history. |
| Linked requirements | FR-HIM-GEN-004, FR-HIM-GEN-005, FR-HIM-GEN-006, FR-HIM-GEN-009, FR-HIM-GEN-010 |

#### US-HIM-042-A: Complete Archive, inactivate or reactivate patient record

| Epic / workflow | W-HIM-042 - Archive, inactivate or reactivate patient record |
|---|---|
| Persona | HIM Supervisor |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, I want to control record lifecycle without hard deletion and without losing history., so that control record lifecycle without hard deletion and without losing history. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-GEN-004, FR-HIM-GEN-005, FR-HIM-GEN-006, FR-HIM-GEN-009, FR-HIM-GEN-010 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Patient record needs lifecycle status change due to inactivity, created-in-error, archival, restoration or policy review. Supporting actors: HIM Officer, Auditor, Clinician, DPO |

**Acceptance criteria**

616. Given an authenticated HIM Supervisor with the required permission, when the user initiates Archive, inactivate or reactivate patient record, then the system confirms patient context, applicable record status and required configuration before completion.
617. Given required inputs are provided, when the workflow is saved, then the system captures or updates patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage.
618. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
619. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Control record lifecycle without hard deletion and without losing history..
620. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-042-B: Handle exceptions and safety controls for Archive, inactivate or reactivate patient record

| Epic / workflow | W-HIM-042 - Archive, inactivate or reactivate patient record |
|---|---|
| Persona | HIM Supervisor |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, I want to handle exceptions, validations and safety controls during Archive, inactivate or reactivate patient record, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-GEN-004, FR-HIM-GEN-005, FR-HIM-GEN-006, FR-HIM-GEN-009, FR-HIM-GEN-010 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

621. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
622. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle missing data, duplicate candidates, restricted access, system/network errors and unauthorised user attempts.
623. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
624. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
625. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-042-C: Audit, reporting and interoperability for Archive, inactivate or reactivate patient record

| Epic / workflow | W-HIM-042 - Archive, inactivate or reactivate patient record |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Archive, inactivate or reactivate patient record, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | patient context, workflow state, user/action timestamp, reason, outcome, audit metadata and downstream linkage |
| Mapping / interoperability | Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent |
| Linked requirements | FR-HIM-GEN; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

626. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
627. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Patient / NgPatient, RelatedPerson / NgRelatedPerson, Provenance and AuditEvent where applicable without altering the REDNOXX canonical record.
628. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
629. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
630. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-043: Controlled REDNOXX support access

| Category | Support / Security |
|---|---|
| Primary actor | REDNOXX Support User |
| Supporting actors | Facility Administrator, Security Admin, DPO, Auditor |
| Trigger | Support team needs access to investigate defect, configuration issue or incident. |
| Goal / output | Permit support only with approval, least privilege, time limit and audit. |
| Linked requirements | NFR-HIM-SEC-001, NFR-HIM-SEC-002, NFR-HIM-SEC-003, NFR-HIM-SEC-004, NFR-HIM-SEC-005, NFR-HIM-SEC-006, NFR-HIM-SEC-007 |

#### US-HIM-043-A: Complete Controlled REDNOXX support access

| Epic / workflow | W-HIM-043 - Controlled REDNOXX support access |
|---|---|
| Persona | REDNOXX Support User |
| Priority / MoSCoW | High / Must |
| User story | As a REDNOXX Support User, I want to permit support only with approval, least privilege, time limit and audit., so that permit support only with approval, least privilege, time limit and audit. |
| Data involved | support ticket, approved user, scope, access period, data masking status, session logs and access expiry |
| Mapping / interoperability | AuditEvent, Provenance and configuration/version metadata |
| Linked requirements | NFR-HIM-SEC-001, NFR-HIM-SEC-002, NFR-HIM-SEC-003, NFR-HIM-SEC-004, NFR-HIM-SEC-005, NFR-HIM-SEC-006, NFR-HIM-SEC-007 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |

| Notes | Workflow trigger: Support team needs access to investigate defect, configuration issue or incident. Supporting actors: Facility Administrator, Security Admin, DPO, Auditor |
|---|---|

**Acceptance criteria**

631. Given an authenticated REDNOXX Support User with the required permission, when the user initiates Controlled REDNOXX support access, then the system confirms patient context, applicable record status and required configuration before completion.
632. Given required inputs are provided, when the workflow is saved, then the system captures or updates support ticket, approved user, scope, access period, data masking status, session logs and access expiry.
633. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
634. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Permit support only with approval, least privilege, time limit and audit..
635. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-043-B: Handle exceptions and safety controls for Controlled REDNOXX support access

| Epic / workflow | W-HIM-043 - Controlled REDNOXX support access |
|---|---|
| Persona | REDNOXX Support User |
| Priority / MoSCoW | High / Must |
| User story | As a REDNOXX Support User, I want to handle exceptions, validations and safety controls during Controlled REDNOXX support access, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | support ticket, approved user, scope, access period, data masking status, session logs and access expiry |
| Mapping / interoperability | AuditEvent, Provenance and configuration/version metadata |
| Linked requirements | NFR-HIM-SEC-001, NFR-HIM-SEC-002, NFR-HIM-SEC-003, NFR-HIM-SEC-004, NFR-HIM-SEC-005, NFR-HIM-SEC-006, NFR-HIM-SEC-007 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

636. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
637. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle elevated access, time-bound approvals, unsafe configuration, test-before-activation and support audit.
638. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
639. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
640. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-043-C: Audit, reporting and interoperability for Controlled REDNOXX support access

| Epic / workflow | W-HIM-043 - Controlled REDNOXX support access |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of Controlled REDNOXX support access, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | support ticket, approved user, scope, access period, data masking status, session logs and access expiry |
| Mapping / interoperability | AuditEvent, Provenance and configuration/version metadata |
| Linked requirements | FR-HIM-GEN; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

641. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
642. Given approved interoperability or reporting is required, when the output is mapped, then it can map to AuditEvent, Provenance and configuration/version metadata where applicable without altering the REDNOXX canonical record.
643. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
644. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
645. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-044: HIM configuration change

| Category | Configuration / Governance |
|---|---|
| Primary actor | Facility Administrator |
| Supporting actors | HIM Supervisor, Product Owner, QA, Security Admin |
| Trigger | Facility needs to change MRN format, forms, mandatory fields, document types, patient categories, queues or matching rules. |
| Goal / output | Change configuration safely with review, testing and audit. |
| Linked requirements | FR-HIM-CFG-001, FR-HIM-CFG-002, FR-HIM-CFG-003, FR-HIM-CFG-004, FR-HIM-CFG-005, FR-HIM-CFG-006, FR-HIM-CFG-007, FR-HIM-CFG-008, FR-HIM-CFG-009, FR-HIM-CFG-010 |

#### US-HIM-044-A: Complete HIM configuration change

| Epic / workflow | W-HIM-044 - HIM configuration change |
|---|---|
| Persona | Facility Administrator |
| Priority / MoSCoW | High / Must |
| User story | As a Facility Administrator, I want to change configuration safely with review, testing and audit., so that change configuration safely with review, testing and audit. |
| Data involved | configuration item, old/new value, version, approver, test evidence, activation date and audit log |
| Mapping / interoperability | AuditEvent, Provenance and configuration/version metadata |
| Linked requirements | FR-HIM-CFG-001, FR-HIM-CFG-002, FR-HIM-CFG-003, FR-HIM-CFG-004, FR-HIM-CFG-005, FR-HIM-CFG-006, FR-HIM-CFG-007, FR-HIM-CFG-008, FR-HIM-CFG-009, FR-HIM-CFG-010 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |
| Notes | Workflow trigger: Facility needs to change MRN format, forms, mandatory fields, document types, patient categories, queues or matching rules. Supporting actors: HIM Supervisor, Product Owner, QA, Security Admin |

**Acceptance criteria**

646. Given an authenticated Facility Administrator with the required permission, when the user initiates HIM configuration change, then the system confirms patient context, applicable record status and required configuration before completion.
647. Given required inputs are provided, when the workflow is saved, then the system captures or updates configuration item, old/new value, version, approver, test evidence, activation date and audit log.
648. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
649. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Change configuration safely with review, testing and audit..
650. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-044-B: Handle exceptions and safety controls for HIM configuration change

| Epic / workflow | W-HIM-044 - HIM configuration change |
|---|---|
| Persona | Facility Administrator |
| Priority / MoSCoW | High / Must |
| User story | As a Facility Administrator, I want to handle exceptions, validations and safety controls during HIM configuration change, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | configuration item, old/new value, version, approver, test evidence, activation date and audit log |
| Mapping / interoperability | AuditEvent, Provenance and configuration/version metadata |
| Linked requirements | FR-HIM-CFG-001, FR-HIM-CFG-002, FR-HIM-CFG-003, FR-HIM-CFG-004, FR-HIM-CFG-005, FR-HIM-CFG-006, FR-HIM-CFG-007, FR-HIM-CFG-008, FR-HIM-CFG-009, FR-HIM-CFG-010 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

651. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
652. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle elevated access, time-bound approvals, unsafe configuration, test-before-activation and support audit.
653. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
654. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
655. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-044-C: Audit, reporting and interoperability for HIM configuration change

| Epic / workflow | W-HIM-044 - HIM configuration change |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of HIM configuration change, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | configuration item, old/new value, version, approver, test evidence, activation date and audit log |
| Mapping / interoperability | AuditEvent, Provenance and configuration/version metadata |
| Linked requirements | FR-HIM-CFG; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

656. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
657. Given approved interoperability or reporting is required, when the output is mapped, then it can map to AuditEvent, Provenance and configuration/version metadata where applicable without altering the REDNOXX canonical record.
658. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
659. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
660. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

### W-HIM-045: FHIR / DHIN payload generation and validation

| Category | Interoperability |
|---|---|
| Primary actor | Integration/FHIR Service |
| Supporting actors | Enterprise Architect, HIM Officer, QA, DPO, Security Admin |
| Trigger | Approved integration, sandbox test, connectathon, reporting or exchange requires FHIR/DHIN-compatible payload. |
| Goal / output | Generate validated FHIR payloads from REDNOXX canonical data without compromising privacy or overstating conformance. |
| Linked requirements | NFR-HIM-INT-001, NFR-HIM-INT-002, NFR-HIM-INT-003, NFR-HIM-INT-004, NFR-HIM-INT-005, NFR-HIM-INT-006, NFR-HIM-INT-007, NFR-HIM-INT-008, NFR-HIM-INT-009, NFR-HIM-INT-010 |

#### US-HIM-045-A: Complete FHIR / DHIN payload generation and validation

| Epic / workflow | W-HIM-045 - FHIR / DHIN payload generation and validation |
|---|---|
| Persona | Integration/FHIR Service |
| Priority / MoSCoW | Critical / Must |
| User story | As a Integration/FHIR Service, I want to generate validated FHIR payloads from REDNOXX canonical data without compromising privacy or overstating conformance., so that generate validated fhir payloads from rednoxx canonical data without compromising privacy or overstating conformance. |
| Data involved | source record IDs, mapped resources, generated payloads, validation results, mapping gaps and export/audit metadata |
| Mapping / interoperability | Nigeria Core FHIR, DHIN IG profiles and FHIR R4 validator outputs |
| Linked requirements | NFR-HIM-INT-001, NFR-HIM-INT-002, NFR-HIM-INT-003, NFR-HIM-INT-004, NFR-HIM-INT-005, NFR-HIM-INT-006, NFR-HIM-INT-007, NFR-HIM-INT-008, NFR-HIM-INT-009, NFR-HIM-INT-010 |
| Dependencies | User Management/RBAC, HIM configuration, patient identity/MPI, audit service, notification/worklist services where applicable. |

| Notes | Workflow trigger: Approved integration, sandbox test, connectathon, reporting or exchange requires FHIR/DHIN-compatible payload. Supporting actors: Enterprise Architect, HIM Officer, QA, DPO, Security Admin |
|---|---|

**Acceptance criteria**

661. Given an authenticated Integration/FHIR Service with the required permission, when the user initiates FHIR / DHIN payload generation and validation, then the system confirms patient context, applicable record status and required configuration before completion.
662. Given required inputs are provided, when the workflow is saved, then the system captures or updates source record IDs, mapped resources, generated payloads, validation results, mapping gaps and export/audit metadata.
663. Given a patient-context workflow is in progress, when the user reviews the screen, then patient banner, MRN/temporary ID, status flags and restricted-record indicators are shown according to role.
664. Given the workflow is completed successfully, when downstream modules need the output, then the workflow result is available as expected: Generate validated FHIR payloads from REDNOXX canonical data without compromising privacy or overstating conformance..
665. Given the workflow is completed, when audit review is performed, then actor, timestamp, patient, action and outcome are available in the audit trail.

#### US-HIM-045-B: Handle exceptions and safety controls for FHIR / DHIN payload generation and validation

| Epic / workflow | W-HIM-045 - FHIR / DHIN payload generation and validation |
|---|---|
| Persona | Integration/FHIR Service |
| Priority / MoSCoW | Critical / Must |
| User story | As a Integration/FHIR Service, I want to handle exceptions, validations and safety controls during FHIR / DHIN payload generation and validation, so that patient identity, privacy, clinical continuity and medical-record integrity are protected. |
| Data involved | source record IDs, mapped resources, generated payloads, validation results, mapping gaps and export/audit metadata |
| Mapping / interoperability | Nigeria Core FHIR, DHIN IG profiles and FHIR R4 validator outputs |
| Linked requirements | NFR-HIM-INT-001, NFR-HIM-INT-002, NFR-HIM-INT-003, NFR-HIM-INT-004, NFR-HIM-INT-005, NFR-HIM-INT-006, NFR-HIM-INT-007, NFR-HIM-INT-008, NFR-HIM-INT-009, NFR-HIM-INT-010 |
| Dependencies | RBAC, audit service, worklist/escalation engine, business rules engine and configuration governance. |
| Notes | Exception paths must be included in QA regression and UAT scripts. |

**Acceptance criteria**

666. Given the workflow has incomplete or conflicting data, when the user attempts to proceed, then the system requires correction, approved exception or worklist escalation before unsafe completion.
667. Given the workflow requires exception handling, when the exception occurs, then the system supports the following control focus: handle unverified identifiers, namespace conflicts, masked display, high-confidence duplicate matches and supervisor review.
668. Given a duplicate, restricted, deceased, merged, temporary or created-in-error status is encountered, when the user acts, then the system applies status-specific warnings, blocks or approvals.
669. Given an unauthorised user attempts the workflow, when permission is checked, then protected actions are denied and logged where appropriate.
670. Given a high-risk override is permitted, when the override is used, then reason, approval where configured, actor and timestamp are captured.

#### US-HIM-045-C: Audit, reporting and interoperability for FHIR / DHIN payload generation and validation

| Epic / workflow | W-HIM-045 - FHIR / DHIN payload generation and validation |
|---|---|
| Persona | HIM Supervisor / Auditor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, Auditor or Integration Service, I want to trace, report and map the output of FHIR / DHIN payload generation and validation, so that the workflow can support governance, quality assurance, reporting and future Nigeria Core/DHIN interoperability. |
| Data involved | source record IDs, mapped resources, generated payloads, validation results, mapping gaps and export/audit metadata |
| Mapping / interoperability | Nigeria Core FHIR, DHIN IG profiles and FHIR R4 validator outputs |
| Linked requirements | NFR-HIM-INT; NFR-HIM-AUD; NFR-HIM-INT |
| Dependencies | AuditEvent/provenance service, reporting dashboard, FHIR/DHIN mapping register, export controls and privacy configuration. |
| Notes | Interoperability readiness does not equal production conformance unless external validation/onboarding is completed. |

**Acceptance criteria**

671. Given the workflow creates, updates, views, releases, exports, merges or configures data, when the action is committed, then an audit/provenance event is recorded with actor, timestamp, patient/record, action, reason where applicable and outcome.
672. Given approved interoperability or reporting is required, when the output is mapped, then it can map to Nigeria Core FHIR, DHIN IG profiles and FHIR R4 validator outputs where applicable without altering the REDNOXX canonical record.
673. Given sensitive data is included, when the data is displayed, exported or transmitted, then masking, minimisation, organisation scoping and approval controls are enforced.
674. Given audit or quality review is performed, when authorised reviewer filters by patient, workflow, actor, date, outcome or department, then relevant events are retrievable without allowing record modification.
675. Given a workflow is used in a release, when evidence is requested, then test data, expected output, validation results and audit evidence are available for traceability.

## 7. Cross-Cutting Enabler Stories

These stories are not tied to a single workflow. They should be planned as platform, configuration, security, privacy, integration or QA enablers because multiple HIM workflows depend on them.

#### US-HIM-EN-001: Role-based access and permission matrix

| Epic / workflow | ENABLER - All workflows |
|---|---|
| Persona | Facility Administrator / Security Admin |
| Priority / MoSCoW | High / Must |
| User story | As a Facility Administrator / Security Admin, I want to create and maintain HIM permissions by role, facility, department and function, so that only authorised users can search, create, update, merge, release, export or configure records. |
| Data involved | roles, permissions, facilities, departments, effective dates, approvals and audit metadata |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: All workflows. |

**Acceptance criteria**

676. Given the role-based access and permission matrix capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
677. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates roles, permissions, facilities, departments, effective dates, approvals and audit metadata.
678. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
679. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
680. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-002: Patient banner and wrong-patient prevention

| Epic / workflow | ENABLER - All patient-context workflows |
|---|---|
| Persona | All authorised users |
| Priority / MoSCoW | High / Must |
| User story | As a All authorised users, I want to see a consistent patient banner before high-risk actions, so that wrong-patient registration, upload, release, billing or clinical handoff risks are reduced. |
| Data involved | patient name, MRN, DOB/age, sex, alerts, status, restricted flags and duplicate warnings |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: All patient-context workflows. |

**Acceptance criteria**

681. Given the patient banner and wrong-patient prevention capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
682. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates patient name, MRN, DOB/age, sex, alerts, status, restricted flags and duplicate warnings.
683. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
684. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
685. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-003: Audit and provenance backbone

| Epic / workflow | ENABLER - All workflows |
|---|---|
| Persona | Auditor / HIM Supervisor |
| Priority / MoSCoW | High / Must |

| User story | As a Auditor / HIM Supervisor, I want to capture complete audit/provenance events for HIM actions, so that governance, incident review, NDPA accountability and release evidence are supported. |
|---|---|
| Data involved | actor, timestamp, workstation/session, patient, old/new value, reason, outcome and linked workflow |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: All workflows. |

**Acceptance criteria**

686. Given the audit and provenance backbone capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
687. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates actor, timestamp, workstation/session, patient, old/new value, reason, outcome and linked workflow.
688. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
689. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
690. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-004: Privacy masking and minimum necessary access

| Epic / workflow | ENABLER - Privacy-sensitive workflows |
|---|---|
| Persona | Data Protection Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Data Protection Officer, I want to configure and enforce masking and minimisation rules, so that sensitive identifiers, restricted records and disclosure workflows are protected. |
| Data involved | field sensitivity, masking rule, role scope, purpose, access decision and audit metadata |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: Privacy-sensitive workflows. |

**Acceptance criteria**

691. Given the privacy masking and minimum necessary access capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
692. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates field sensitivity, masking rule, role scope, purpose, access decision and audit metadata.
693. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
694. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
695. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-005: Duplicate/MPI matching service

| Epic / workflow | ENABLER - Registration and MPI workflows |
|---|---|
| Persona | HIM Supervisor / Integration Service |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor / Integration Service, I want to configure and review duplicate matching rules, so that duplicate patient record creation is reduced and merge decisions are evidence-based. |
| Data involved | match attributes, thresholds, candidate pairs, score, reasons, decision and reviewer |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |

| Notes | Affected workflow group: Registration and MPI workflows. |
|---|---|

**Acceptance criteria**

696. Given the duplicate/mpi matching service capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
697. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates match attributes, thresholds, candidate pairs, score, reasons, decision and reviewer.
698. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
699. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
700. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-006: Configuration governance for HIM workflows

| Epic / workflow | ENABLER - Configuration-sensitive workflows |
|---|---|
| Persona | Facility Administrator / Product Admin |
| Priority / MoSCoW | High / Must |
| User story | As a Facility Administrator / Product Admin, I want to change HIM configuration through versioned approval and testing, so that unsafe form, identifier, MRN, document, queue or role changes are prevented. |
| Data involved | configuration item, old/new value, approver, test result, activation date and rollback plan |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: Configuration-sensitive workflows. |

**Acceptance criteria**

701. Given the configuration governance for him workflows capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
702. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates configuration item, old/new value, approver, test result, activation date and rollback plan.
703. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
704. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
705. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-007: Downtime and reconciliation framework

| Epic / workflow | ENABLER - Offline/degraded workflows |
|---|---|
| Persona | HIM Supervisor / Support |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor / Support, I want to manage downtime capture and post-downtime reconciliation, so that care can continue without unsafe duplicate creation or data loss. |
| Data involved | downtime register, temporary IDs, reconciliation status, conflict report and audit trail |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: Offline/degraded workflows. |

**Acceptance criteria**

706. Given the downtime and reconciliation framework capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
707. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates downtime register, temporary IDs, reconciliation status, conflict report and audit trail.
708. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
709. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
710. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-008: FHIR/DHIN mapping and validator evidence

| Epic / workflow | ENABLER - Interoperability workflows |
|---|---|
| Persona | Integration Admin / QA |
| Priority / MoSCoW | High / Must |
| User story | As a Integration Admin / QA, I want to generate sample FHIR/DHIN payloads and record validation output, so that REDNOXX can demonstrate interoperability readiness without overstating certification. |
| Data involved | mapping register, payloads, validator output, warnings/errors, resolved gaps and export audit |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: Interoperability workflows. |

**Acceptance criteria**

711. Given the fhir/dhin mapping and validator evidence capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
712. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates mapping register, payloads, validator output, warnings/errors, resolved gaps and export audit.
713. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
714. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
715. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-009: HIM worklists and dashboards

| Epic / workflow | ENABLER - Operational governance |
|---|---|
| Persona | HIM Supervisor |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor, I want to monitor duplicate candidates, incomplete records, temporary records, releases, audits and configuration tasks, so that operational risks are visible and actionable. |
| Data involved | worklist items, status, owner, due date, priority, SLA and resolution audit |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: Operational governance. |

**Acceptance criteria**

716. Given the him worklists and dashboards capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
717. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates worklist items, status, owner, due date, priority, SLA and resolution audit.
718. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
719. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
720. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-010: Secure document handling

| Epic / workflow | ENABLER - Document workflows |
|---|---|
| Persona | HIM Officer / Security Admin |
| Priority / MoSCoW | High / Must |

| User story | As a HIM Officer / Security Admin, I want to scan, upload and validate documents safely, so that malware, wrong-patient documents and unindexed records are reduced. |
|---|---|
| Data involved | file metadata, validation result, patient/encounter link, document type, confidentiality and version status |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: Document workflows. |

**Acceptance criteria**

721. Given the secure document handling capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
722. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates file metadata, validation result, patient/encounter link, document type, confidentiality and version status.
723. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
724. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
725. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-011: Record release controls and evidence package

| Epic / workflow | ENABLER - Release workflows |
|---|---|
| Persona | HIM Supervisor / DPO |
| Priority / MoSCoW | High / Must |
| User story | As a HIM Supervisor / DPO, I want to control release approvals, redaction, fees and disclosure evidence, so that external disclosures are lawful, minimal and auditable. |
| Data involved | requester, authority, scope, approval, redaction, package, method, fee link and disclosure log |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: Release workflows. |

**Acceptance criteria**

726. Given the record release controls and evidence package capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
727. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates requester, authority, scope, approval, redaction, package, method, fee link and disclosure log.
728. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
729. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
730. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-012: Support access control

| Epic / workflow | ENABLER - Support workflow |
|---|---|
| Persona | Facility Administrator / REDNOXX Support Lead |
| Priority / MoSCoW | High / Must |
| User story | As a Facility Administrator / REDNOXX Support Lead, I want to grant time-bound support access with least privilege, so that technical support can occur without uncontrolled patient-data exposure. |
| Data involved | ticket, approved user, scope, expiry, masking status, session log and revocation |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |

| Notes | Affected workflow group: Support workflow. |
|---|---|

**Acceptance criteria**

731. Given the support access control capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
732. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates ticket, approved user, scope, expiry, masking status, session log and revocation.
733. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
734. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
735. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-013: Data subject rights workflow support

| Epic / workflow | ENABLER - Privacy rights workflows |
|---|---|
| Persona | Data Protection Officer |
| Priority / MoSCoW | High / Must |
| User story | As a Data Protection Officer, I want to log and process access, rectification, restriction and portability requests, so that patient rights are handled consistently with health-record retention and clinical integrity. |
| Data involved | request, identity verification, action decision, response, evidence and closure audit |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: Privacy rights workflows. |

**Acceptance criteria**

736. Given the data subject rights workflow support capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
737. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates request, identity verification, action decision, response, evidence and closure audit.
738. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
739. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
740. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-014: Search and registration performance

| Epic / workflow | ENABLER - Search/registration workflows |
|---|---|
| Persona | Front Desk / HIM Supervisor |
| Priority / MoSCoW | High / Must |
| User story | As a Front Desk / HIM Supervisor, I want to complete patient search and registration within agreed operational thresholds, so that front-desk queues and emergency care are not slowed by system performance. |
| Data involved | search query, response time, result set, registration save time and performance logs |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: Search/registration workflows. |

**Acceptance criteria**

741. Given the search and registration performance capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
742. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates search query, response time, result set, registration save time and performance logs.
743. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
744. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
745. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

#### US-HIM-EN-015: UAT traceability and release evidence

| Epic / workflow | ENABLER - All workflows |
|---|---|
| Persona | QA Lead / Product Owner |
| Priority / MoSCoW | High / Must |
| User story | As a QA Lead / Product Owner, I want to trace user stories to workflows, requirements, test cases and evidence, so that release decisions are based on demonstrable tested capabilities. |
| Data involved | story ID, workflow ID, requirement IDs, test case, result, defect, sign-off and evidence location |
| Mapping / interoperability | AuditEvent, Provenance, Patient/NgPatient, Consent/NgConsent, DocumentReference and/or configuration metadata where applicable. |
| Linked requirements | Cross-cutting NFR/FR requirement area; trace to affected workflows during backlog refinement. |
| Dependencies | Core Platform, RBAC, audit, configuration, integration, privacy and reporting services as applicable. |
| Notes | Affected workflow group: All workflows. |

**Acceptance criteria**

746. Given the uat traceability and release evidence capability is enabled, when an authorised user performs related HIM actions, then the system enforces configured permissions and validations.
747. Given data is created, viewed, changed, released, exported or configured, when the action is completed, then the system records or updates story ID, workflow ID, requirement IDs, test case, result, defect, sign-off and evidence location.
748. Given a user lacks permission or purpose, when they try to perform a protected action, then the action is denied or routed for approval and logged where appropriate.
749. Given sensitive patient data is displayed, exported or transmitted, when privacy rules apply, then masking, minimisation, restriction and purpose-based access rules are enforced.
750. Given UAT or audit review is performed, when evidence is requested, then role-based behaviour, validation messages, audit records and expected outputs are demonstrable.

## 8. Suggested Release Slicing

| Release Slice 1 - Foundation | User access dependencies, patient search, standard registration, returning verification, MRN/identifier capture, audit/provenance and patient banner. |
|---|---|
| Release Slice 2 - Emergency and identity safety | Emergency temporary registration, unknown patient, mass casualty, incomplete record completion, duplicate detection and duplicate review queue. |
| Release Slice 3 - MPI and record integrity | Merge, unmerge, demographic correction, identity document update, deceased status and record lifecycle controls. |
| Release Slice 4 - Documents and release | Document upload/indexing, legacy scanned records, document correction, record release, third-party requests and restricted-record/break-glass. |
| Release Slice 5 - Consent, payer and integration | Consent, payer/coverage capture, HMO/claims requests, referral registration, encounter linkage and FHIR/DHIN validation evidence. |
| Release Slice 6 - Resilience and governance | Offline/degraded registration, offline sync, legacy migration, audit reporting, data-subject requests, support access and HIM configuration change. |

## 9. Testing and Acceptance Rules

- Every story must have at least one positive-path test and one exception/negative-path test.
- Every patient-context story must validate wrong-patient prevention and visible patient banner behaviour.
- Every high-risk update story must validate old/new value preservation, reason capture and approval where configured.
- Every duplicate, merge, unmerge and identity story must validate historical preservation and downstream linkage.
- Every document/release story must validate requester authority, scope, minimisation and disclosure audit.
- Every privacy-sensitive story must validate masking, role denial and audit logging.
- Every offline/migration story must validate duplicate checks, conflict handling and reconciliation audit.
- Every FHIR/DHIN story must validate mapping output using sample payloads and record validator results or documented gaps.

## 10. Traceability Fields to Maintain in Backlog Tool

| Traceability field | Expected value / purpose |
|---|---|
| Story ID | US-HIM-###-A/B/C or US-HIM-EN-###. |
| Workflow ID | W-HIM-001 through W-HIM-045, or ENABLER for cross-cutting stories. |
| Requirement ID(s) | Functional and non-functional requirement IDs from HIM SRS. |
| Persona / role | Actor expected to execute or govern the story. |
| Risk class | Critical, High or Medium based on clinical safety, privacy, identity, operational or compliance risk. |
| Data entities | Patient, Identifier, RelatedPerson, Encounter, Document, Consent, Release Request, Duplicate Candidate, Audit Event or configuration entity. |
| FHIR/DHIN mapping | Target resource/profile or explicit Not Applicable. |
| Test case ID(s) | Unit/integration/UAT/regression tests proving acceptance criteria. |
| Evidence link | Screenshots, audit log export, validator output, UAT sign-off, configuration version or defect closure. |
| Release version | Sprint/release where story is implemented. |

## 11. Reference Inputs

- REDNOXX HIM Workflow Catalogue v1.0 - 45 detailed workflows with actors, triggers, preconditions, controls, integrations and acceptance criteria.
- REDNOXX HIM Module Detailed SRS v0.2 - detailed SRS with workflow maps, data model, requirements, NDHI/NDHA, Nigeria Core FHIR, DHIN FHIR IG, NDPC, NITDA and SON/ISO alignment.
- REDNOXX HIMS/EHR V1 Agile Project Plan PM - product delivery workstream and module scope context.
