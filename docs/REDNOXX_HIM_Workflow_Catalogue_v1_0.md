# REDNOXX EHR V1 — HIM Workflow Catalogue

**REDNOXX EHR V1**
**HIM / Medical Records Module**
**Workflow Catalogue**

*Full workflow maps with actors, triggers, preconditions, main flow, exceptions, data, controls, integrations and acceptance criteria*

| Field | Value |
|---|---|
| Document version | v1.0 |
| Document date | 4 July 2026 |
| Prepared for | REDNOXX EHR / HIMS V1 HIM Module |
| Document purpose | Appendix/workflow catalogue for the REDNOXX HIM Module SRS |
| Source basis | Uploaded REDNOXX Agile Delivery Plan, REDNOXX HIMS/EHR V1 Agile Project Plan and REDNOXX HIM Module Detailed SRS v0.2, plus verified external references listed in Section 11. |
| Compliance note | This catalogue supports readiness and traceability. It does not claim formal NDHI, DHIN, SON, NDPC, NITDA or national production certification unless validated through the applicable authority process. |

*Confidential draft for REDNOXX SRS development — generated 4 July 2026*

---

## Table of Contents

1. [Purpose and Use](#1-purpose-and-use)
2. [Source Basis and Standards Alignment](#2-source-basis-and-standards-alignment)
3. [Actor Catalogue](#3-actor-catalogue)
4. [Workflow Governance Model](#4-workflow-governance-model)
5. [Master Workflow Matrix](#5-master-workflow-matrix)
6. [Detailed Workflow Catalogue](#6-detailed-workflow-catalogue)
7. [Workflow-to-Standards Traceability](#7-workflow-to-standards-traceability)
8. [Workflow Acceptance and Testing Rules](#8-workflow-acceptance-and-testing-rules)
9. [Open Issues and Assumptions](#9-open-issues-and-assumptions)
10. [Change Control](#10-change-control)
11. [Reference Resources](#11-reference-resources)

---

## 1. Purpose and Use

This workflow catalogue is a detailed operational companion to the REDNOXX HIM / Medical Records Module SRS. It decomposes the HIM scope into individually testable workflows with named actors, triggers, preconditions, main steps, alternate paths, data requirements, controls, integrations, and acceptance criteria.

The catalogue is intended for business analysis, UX design, engineering, QA/UAT, implementation, training, audit and compliance evidence. Each workflow should be converted into user stories, test cases, configuration tasks, SOPs and training scenarios before production deployment.

## 2. Source Basis and Standards Alignment

The REDNOXX-provided delivery materials position REDNOXX EHR V1 as a reusable enterprise EHR/HIMS product for Nigerian tertiary-hospital environments, with patient registration, medical records, OPD, A&E, inpatient, diagnostics, pharmacy, insurance, claims, billing, dashboards and reporting unified around a common patient identity. They also emphasise configuration over one-off customisation, interoperability-by-design, clinical workflow validation, privacy, cybersecurity, testing and release evidence.

The workflow controls in this catalogue are aligned to the following verified external themes: NDHI national EHR deployment and interoperable EHR direction; Nigeria Core FHIR R4 as the national interoperability baseline; DHIN FHIR IG as practical sandbox/connectathon reference; DHIN security guidance for OAuth2/SMART-style authentication, RBAC and organisation scoping; NDPA/NDPC data subject rights and controller responsibilities; NITDA software development/testing requirements; SON standards governance; and ISO/TC 215 health informatics scope. See Section 11 for source URLs.

| Source | Workflow implication | Applied mainly in | Reference |
|---|---|---|---|
| NDHI EHR RFI | Demonstrable EHR capabilities, interoperable digital systems, improved records from first point of care. | All registration, records, audit and interoperability workflows | R1 |
| Nigeria Core FHIR IG | FHIR R4 national baseline, profiles, REST interactions, conformance/sandbox readiness. | W-HIM-001, 023, 032, 033, 034, 036, 045 | R2 |
| DHIN FHIR IG | Practical profiles/use cases for claims, ePharmacy, MNCH, immunisation, devices, registries, consent/pseudonymisation. | W-HIM-012, 031, 032, 033, 034, 045 | R3 |
| DHIN Privacy/Security | Authenticated clients, RBAC scopes, organisation scoping, data minimisation and validation before bundle commit. | W-HIM-024, 040, 041, 043, 045 | R4 |
| NDPC / NDPA | Data subject rights, privacy, rectification, access, restriction, portability and accountability. | W-HIM-028, 029, 032, 041 | R5 |
| NITDA SDLC/Testing | Secure, reliable, interoperable software; documented requirements, testing and release evidence. | All workflows; especially testing and change control | R6, R7 |
| SON / ISO-TC 215 | Standards, health informatics, audit, consent, pseudonymisation, EHR architecture and interoperability. | All workflow controls and evidence matrices | R8, R9, R10 |

## 3. Actor Catalogue

| Actor | Role in HIM workflows |
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
| Integration/FHIR Service | Generates, validates or exchanges internal canonical data as Nigeria Core/DHIN-compatible payloads where approved. |

## 4. Workflow Governance Model

Every HIM workflow shall be controlled using the following governance model.

| Element | Description |
|---|---|
| Workflow ID | Unique identifier used for requirements, user stories, tests and evidence. |
| Trigger | Event that starts the workflow. |
| Primary actor | User or service accountable for completion. |
| Supporting actors | Other users, departments or services participating in the workflow. |
| Preconditions | Minimum conditions that must exist before the workflow can start. |
| Main flow | Expected happy-path steps. |
| Alternate paths / exceptions | Allowed deviations and error-handling paths. |
| Data captured/updated | Information created, changed, linked or logged. |
| Controls and audit | Security, privacy, safety and audit controls. |
| Integration/FHIR/DHIN mapping | Downstream module and standards mapping readiness. |
| Acceptance criteria | Observable evidence that the workflow is complete and testable. |

### 4.1 Common controls used across workflows

- Authenticated user session and role-based permission check.
- Patient banner confirmation before high-risk actions.
- Audit record with actor, timestamp, source workstation/device, patient ID, action and outcome.
- No hard deletion of patient records after creation; use status, correction, merge or created-in-error workflow.
- Privacy-by-design: minimum necessary access and masking for sensitive identifiers where configured.

## 5. Master Workflow Matrix

| ID | Workflow | Category | Primary actor | Key output |
|---|---|---|---|---|
| W-HIM-001 | Standard new patient registration | Registration | Front Desk / Registration Officer | Create a permanent patient record, assign MRN, capture demographics and route patient to next service. |
| W-HIM-002 | Registration with NIN / National ID | Registration / Identifier | Front Desk / Registration Officer | Capture national identifier safely and prevent duplicate identity creation. |
| W-HIM-003 | Registration without NIN | Registration | Front Desk / Registration Officer | Allow lawful care registration without making NIN a blocking requirement. |
| W-HIM-004 | Alternative ID registration | Registration / Identifier | Front Desk / Registration Officer | Capture alternative identity evidence and use it for search/matching. |
| W-HIM-005 | Foreign patient registration | Registration | Front Desk / Registration Officer | Register foreign patient while preserving identity, nationality, local contact and payer details. |
| W-HIM-006 | Returning patient verification | Registration / Search | Front Desk / Registration Officer | Locate existing record, verify identity and route patient without creating duplicate. |
| W-HIM-007 | Appointment-linked check-in | Appointments / Queue | Front Desk / Registration Officer | Verify appointment patient identity and move patient to correct queue/service. |
| W-HIM-008 | Walk-in registration and routing | Registration / Queue | Front Desk / Registration Officer | Register or verify patient and route to correct service. |
| W-HIM-009 | Emergency temporary registration | Emergency | A&E Registration Officer | Create temporary emergency identity quickly while preserving later reconciliation. |
| W-HIM-010 | Unknown or unconscious patient | Emergency | A&E Registration Officer | Create safe unknown patient record that can later be identified and reconciled. |
| W-HIM-011 | Mass casualty rapid registration | Emergency / Contingency | A&E Registration Officer | Create rapid temporary identities and preserve triage/encounter linkage under surge conditions. |
| W-HIM-012 | Neonate registration and mother-baby linkage | Registration / MNCH | HIM Officer | Create neonate identity linked to mother/guardian and maternity encounter where applicable. |
| W-HIM-013 | Minor registration with guardian | Registration / Consent | Front Desk / Registration Officer | Register minor and capture guardian/authorised representative details. |
| W-HIM-014 | Deceased-on-arrival or deceased status | Registration / Record Lifecycle | HIM Officer | Create or update record status as deceased while controlling downstream actions and disclosure. |
| W-HIM-015 | Demographic correction/update | Record Maintenance | HIM Officer | Correct demographics without losing historical values or creating identity risk. |
| W-HIM-016 | Identity document update | Identifier Maintenance | HIM Officer | Update identifier evidence safely with namespace, verification and audit controls. |
| W-HIM-017 | NIN or high-confidence identifier verification | Identifier / Verification | HIM Officer | Update verification status and prevent conflicting identity records. |
| W-HIM-018 | Incomplete record completion | Data Quality | HIM Officer | Complete missing fields and improve record quality without blocking urgent care. |
| W-HIM-019 | Duplicate detected before save | MPI / Duplicate | Front Desk / Registration Officer | Prevent unnecessary duplicate patient record creation while allowing reviewed exceptions. |
| W-HIM-020 | Duplicate review queue | MPI / Governance | HIM Officer | Review suspected duplicate records and decide whether to merge, reject or defer. |
| W-HIM-021 | Merge approved duplicate records | Merge / MPI | HIM Supervisor | Safely combine records without deleting history or losing linked encounters/documents. |
| W-HIM-022 | Unmerge incorrect merge | Merge / Correction | HIM Supervisor | Reverse merge where possible and flag manual reconciliation where automatic restoration is unsafe. |
| W-HIM-023 | Patient search and record retrieval | Search | Authorised User | Retrieve the correct patient record while protecting privacy and preventing wrong-patient actions. |
| W-HIM-024 | Restricted record and break-glass | Privacy / Access | Clinician or HIM Supervisor | Protect sensitive records while permitting justified emergency access. |
| W-HIM-025 | Document upload and indexing | Medical Records | HIM Officer | Attach document to correct patient/encounter with metadata, classification and audit. |
| W-HIM-026 | Legacy scanned record indexing | Migration / Records | HIM Officer | Index legacy records with source, date range and quality status while preserving legacy MRN. |
| W-HIM-027 | Document correction, replacement or created-in-error | Medical Records / Correction | HIM Officer | Correct document metadata or status without deleting evidence improperly. |
| W-HIM-028 | Patient requests record release | Release of Information | HIM Officer | Process authorised patient release request with scope, approval, fee handling and audit. |
| W-HIM-029 | Guardian or third-party record release | Release / Privacy | HIM Officer | Ensure disclosure is lawful, authorised, minimal and auditable. |
| W-HIM-030 | Internal clinical records request | Medical Records / Internal Request | Clinician | Provide authorised internal access to required record material while logging access. |
| W-HIM-031 | HMO / claims document request | Claims / Release | Claims / HMO Officer | Provide authorised evidence package linked to patient, encounter and coverage. |
| W-HIM-032 | Consent capture, update or withdrawal | Consent / Privacy | HIM Officer | Record consent status, scope and source in a reusable and auditable form. |
| W-HIM-033 | Referral registration | Referral / Registration | Front Desk / Registration Officer | Register or verify patient and preserve referral source/context for care continuity. |
| W-HIM-034 | Payer / insurance coverage capture | Billing / Claims | Front Desk / Registration Officer | Capture payer and coverage data separately from patient identity for billing and claims. |
| W-HIM-035 | Queue routing after registration | Queue / Operations | Front Desk / Registration Officer | Place patient into correct queue with patient context, priority and payer prerequisites. |
| W-HIM-036 | Encounter creation/linkage | Encounter / Integration | Front Desk / Registration Officer | Create or link encounter so downstream clinical, billing and claims actions share the same patient context. |
| W-HIM-037 | Offline/degraded registration | Resilience | Front Desk / Registration Officer | Continue essential registration safely while preserving reconciliation and audit requirements. |
| W-HIM-038 | Offline sync and reconciliation | Resilience / Data Quality | HIM Officer | Convert downtime/offline records into trusted patient records without duplicates or data loss. |
| W-HIM-039 | Legacy data migration and patient binding | Migration | Migration Team | Import legacy patient data while preserving source identifiers and controlling duplicates. |
| W-HIM-040 | Audit review and HIM reporting | Audit / Reporting | Auditor / Compliance Reviewer | Review HIM actions and generate reports without exposing unnecessary patient data. |
| W-HIM-041 | Data subject access or rectification request | Privacy / Data Rights | Data Protection Officer | Process patient data-rights requests consistently with NDPA obligations and health-record retention rules. |
| W-HIM-042 | Archive, inactivate or reactivate patient record | Record Lifecycle | HIM Supervisor | Control record lifecycle without hard deletion and without losing history. |
| W-HIM-043 | Controlled REDNOXX support access | Support / Security | REDNOXX Support User | Permit support only with approval, least privilege, time limit and audit. |
| W-HIM-044 | HIM configuration change | Configuration / Governance | Facility Administrator | Change configuration safely with review, testing and audit. |
| W-HIM-045 | FHIR / DHIN payload generation and validation | Interoperability | Integration/FHIR Service | Generate validated FHIR payloads from REDNOXX canonical data without compromising privacy or overstating conformance. |

## 6. Detailed Workflow Catalogue

### W-HIM-001: Standard new patient registration

| Field | Value |
|---|---|
| Category | Registration |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, HIM Officer, Billing Officer, Queue Service |
| Trigger | A person presents for care and cannot be found as an existing patient after mandatory search. |
| Goal / output | Create a permanent patient record, assign MRN, capture demographics and route patient to next service. |
| Linked requirement IDs | FR-HIM-REG-001, FR-HIM-REG-002, FR-HIM-REG-003, FR-HIM-REG-004, FR-HIM-REG-005, FR-HIM-REG-006, FR-HIM-REG-007, FR-HIM-REG-008, FR-HIM-REG-009 |

**Preconditions**
- User has registration permission.
- MRN configuration is active.
- Patient has not been found as an existing active record or user has documented reason to proceed.

**Main flow**
1. Search by MRN, name, phone, date of birth and available identifiers.
2. Start new registration and capture core identity, contacts, address, next of kin and patient category.
3. Capture payer/insurance information where applicable.
4. Validate mandatory fields and data formats.
5. Run duplicate check before save.
6. Display duplicate candidates if threshold is met.
7. Generate MRN and create permanent patient record if no blocking duplicate exists.
8. Print or display registration slip/card where configured.
9. Route patient to appointment, queue, billing or service point.

**Alternate paths and exceptions**
- If duplicate is suspected, route to W-HIM-019.
- If minimum data is incomplete, save as provisional only if policy permits and add to W-HIM-018.
- If patient requires immediate emergency care, switch to W-HIM-009.

**Data captured or updated**
- Patient identity, demographics, contacts, address, next of kin, patient category, payer category, identifiers, registration location, MRN, audit metadata.

**Controls, privacy and audit**
- Search-before-create rule; duplicate prevention; mandatory field validation; MRN uniqueness; patient banner creation; audit log.

**Integration, Nigeria Core and DHIN mapping**
- Queue routing; appointment check-in; billing category; future NgPatient / Nigeria Core Patient generation.

**Acceptance criteria**
- A permanent patient record exists with unique MRN.
- Duplicate check result is stored.
- Registration audit event is available.
- Patient can be routed to downstream workflow.

---

### W-HIM-002: Registration with NIN / National ID

| Field | Value |
|---|---|
| Category | Registration / Identifier |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, HIM Officer, Identity Verification Service where available |
| Trigger | Patient presents a NIN or other configured national identity reference. |
| Goal / output | Capture national identifier safely and prevent duplicate identity creation. |
| Linked requirement IDs | FR-HIM-ID-006, FR-HIM-ID-007, FR-HIM-ID-011, FR-HIM-ID-012, FR-HIM-ID-021, FR-HIM-ID-022 |

**Preconditions**
- NIN capture is enabled by facility policy.
- User has permission to capture or view national identifiers.
- Privacy notice/lawful basis requirements are met.

**Main flow**
1. Search by NIN before new registration.
2. If NIN matches an existing patient, display candidate record for verification.
3. If no match exists, continue registration and capture NIN value and verification status.
4. Mask NIN display for roles that do not need full value.
5. Run demographic duplicate checks in addition to NIN check.
6. Create or update patient record and audit identifier action.

**Alternate paths and exceptions**
- If NIN belongs to another active patient, block save or route to HIM supervisor review.
- If verification service is unavailable, store status as unverified or pending verification.
- If patient cannot provide NIN, continue with W-HIM-003.

**Data captured or updated**
- NIN/national identifier, identifier system, assigning authority, verification status, capture source, audit metadata.

**Controls, privacy and audit**
- Identifier namespace; high-confidence duplicate warning; masking; audit of identifier view/update; no NIN requirement for emergency care.

**Integration, Nigeria Core and DHIN mapping**
- Future NgPatient.identifier:NationalIDNo; future client registry readiness; duplicate/MPI service.

**Acceptance criteria**
- NIN is stored in correct namespace.
- Duplicate check uses NIN and demographics.
- Identifier update is auditable and masked where configured.

---

### W-HIM-003: Registration without NIN

| Field | Value |
|---|---|
| Category | Registration |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, HIM Officer |
| Trigger | Patient lacks NIN, does not know NIN, is a minor/foreign patient, or NIN capture is unavailable. |
| Goal / output | Allow lawful care registration without making NIN a blocking requirement. |
| Linked requirement IDs | FR-HIM-REG-016, FR-HIM-REG-017, FR-HIM-REG-018, FR-HIM-REG-019, FR-HIM-REG-020 |

**Preconditions**
- Registration is required.
- User has registration permission.

**Main flow**
1. Confirm NIN is unavailable and record reason if configured.
2. Capture alternative identifiers, demographics, phone/address and related-person details.
3. Run duplicate matching using available fields.
4. Create patient record with MRN after validation.
5. Flag record for later identifier completion if policy requires.

**Alternate paths and exceptions**
- If patient later presents NIN, use W-HIM-017.
- If identity is too incomplete for standard registration, use emergency/provisional workflow.

**Data captured or updated**
- Reason NIN unavailable, alternative identifiers, demographics, related persons, completeness status.

**Controls, privacy and audit**
- NIN not mandatory; enhanced duplicate checks; incomplete-record flag; audit trail.

**Integration, Nigeria Core and DHIN mapping**
- NgPatient can be generated without national identifier but with MRN/other identifiers.

**Acceptance criteria**
- Patient can be registered without NIN.
- Record is searchable and MRN is unique.
- Completeness exceptions are reportable.

---

### W-HIM-004: Alternative ID registration

| Field | Value |
|---|---|
| Category | Registration / Identifier |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, HIM Officer |
| Trigger | Patient provides passport, driver licence, voter card, birth certificate, staff ID, insurance card or other configured ID. |
| Goal / output | Capture alternative identity evidence and use it for search/matching. |
| Linked requirement IDs | FR-HIM-REG-021, FR-HIM-REG-022, FR-HIM-REG-023, FR-HIM-REG-024 |

**Preconditions**
- Alternative ID types are configured.
- User has identifier capture permission.

**Main flow**
1. Select ID type from controlled list.
2. Capture ID number, issuing authority, expiry and verification status where applicable.
3. Search existing records using ID value and namespace.
4. Continue registration or update existing record.
5. Audit identifier capture/update.

**Alternate paths and exceptions**
- If ID is duplicate, route to duplicate review.
- If ID type is not configured, create support/configuration request rather than free-text workaround.

**Data captured or updated**
- ID type, value, issuer, expiry, status, document image if permitted, audit metadata.

**Controls, privacy and audit**
- Identifier namespace; field validation; controlled ID type list; audit.

**Integration, Nigeria Core and DHIN mapping**
- NgPatient.identifier where applicable; payer/claims workflow if insurance ID.

**Acceptance criteria**
- Alternative ID appears under correct identifier namespace.
- Search can retrieve by the ID.
- Changes are auditable.

---

### W-HIM-005: Foreign patient registration

| Field | Value |
|---|---|
| Category | Registration |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, Billing Officer, Claims Officer |
| Trigger | Patient is not a Nigerian resident/citizen or presents foreign identity/insurance information. |
| Goal / output | Register foreign patient while preserving identity, nationality, local contact and payer details. |
| Linked requirement IDs | FR-HIM-REG-016, FR-HIM-REG-021, FR-HIM-REG-022, FR-HIM-REG-023 |

**Preconditions**
- Foreign patient category and ID types are configured.

**Main flow**
1. Search by name, date of birth, phone, passport or foreign ID.
2. Capture nationality, passport/foreign ID, local contact and address in Nigeria where available.
3. Capture payer/insurance category.
4. Run duplicate check.
5. Create MRN and route to service/billing.

**Alternate paths and exceptions**
- If passport unavailable, use alternative ID or provisional workflow.
- If international insurance requires pre-authorisation, hand off to claims workflow.

**Data captured or updated**
- Nationality, passport/foreign ID, local contact, international phone/address, payer/insurance details.

**Controls, privacy and audit**
- Do not require NIN; identifier namespace for passport/foreign IDs; privacy masking; audit.

**Integration, Nigeria Core and DHIN mapping**
- Billing/claims; NgPatient identifiers/address where applicable.

**Acceptance criteria**
- Foreign patient is registered without NIN.
- Identity documents and payer details are captured separately.
- Record is searchable by passport/foreign ID.

---

### W-HIM-006: Returning patient verification

| Field | Value |
|---|---|
| Category | Registration / Search |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, HIM Officer, Queue Service, Billing Officer |
| Trigger | Known patient returns for appointment, walk-in, follow-up, billing or service. |
| Goal / output | Locate existing record, verify identity and route patient without creating duplicate. |
| Linked requirement IDs | FR-HIM-REG-025, FR-HIM-REG-026, FR-HIM-REG-027, FR-HIM-REG-028, FR-HIM-REG-029, FR-HIM-REG-030 |

**Preconditions**
- User has patient search permission.
- Patient provides at least one search attribute.

**Main flow**
1. Search by MRN or other attribute.
2. Review search results and select candidate.
3. Confirm identity using at least two configured identifiers/demographics.
4. Review alerts: restricted, deceased, merged, temporary, duplicate suspected.
5. Update permitted contacts or demographics if needed.
6. Route to queue, appointment, billing or service.
7. Audit view/update/check-in.

**Alternate paths and exceptions**
- If no match, proceed to new registration.
- If multiple similar matches, route to duplicate review before creating new record.
- If record is restricted, apply W-HIM-024.

**Data captured or updated**
- Search criteria, verification decision, contact updates, route/check-in details.

**Controls, privacy and audit**
- Wrong-patient prevention; patient banner; search result masking; audit.

**Integration, Nigeria Core and DHIN mapping**
- Appointments, queue, billing, OPD/A&E encounter linkage.

**Acceptance criteria**
- Existing patient is selected and verified.
- No duplicate record is created.
- Route/check-in event is auditable.

---

### W-HIM-007: Appointment-linked check-in

| Field | Value |
|---|---|
| Category | Appointments / Queue |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, Appointment Service, Queue Service, Clinic Nurse |
| Trigger | Patient arrives for scheduled appointment. |
| Goal / output | Verify appointment patient identity and move patient to correct queue/service. |
| Linked requirement IDs | FR-HIM-REG-031, FR-HIM-REG-032, FR-HIM-REG-033, FR-HIM-REG-034, FR-HIM-REG-035, FR-HIM-REG-036 |

**Preconditions**
- Appointment exists.
- Patient identity is linked or linkable to a patient record.

**Main flow**
1. Search appointment list by date, clinic, name or appointment ID.
2. Open appointment and confirm linked patient identity.
3. If patient record is not linked, search and bind to existing patient or register new patient.
4. Verify demographics and update permitted details.
5. Mark appointment as checked-in.
6. Place patient into configured clinic/triage/billing queue.
7. Audit check-in and route.

**Alternate paths and exceptions**
- If appointment belongs to wrong patient, do not check in; correct linkage.
- If patient is late/no-show, apply facility scheduling rules.
- If patient requires emergency care, redirect to A&E workflow.

**Data captured or updated**
- Appointment ID, patient ID, check-in time, clinic, queue, status.

**Controls, privacy and audit**
- Patient confirmation before check-in; no wrong-patient appointment binding; audit.

**Integration, Nigeria Core and DHIN mapping**
- Appointment module, queue service, billing/encounter creation.

**Acceptance criteria**
- Appointment status changes to checked-in.
- Patient appears in correct queue.
- Check-in is linked to verified patient.

---

### W-HIM-008: Walk-in registration and routing

| Field | Value |
|---|---|
| Category | Registration / Queue |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, Queue Service, Billing Officer, Clinic Nurse |
| Trigger | Patient presents without appointment. |
| Goal / output | Register or verify patient and route to correct service. |
| Linked requirement IDs | FR-HIM-REG-037, FR-HIM-REG-038, FR-HIM-REG-039, FR-HIM-REG-040 |

**Preconditions**
- Walk-in workflow is enabled.
- Service point/clinic is configured.

**Main flow**
1. Search for existing patient.
2. Verify existing patient or complete new registration.
3. Select visit type, clinic/service point and priority where configured.
4. Capture payer/category and billing class.
5. Create queue entry or billing precondition.
6. Display patient route and instructions.
7. Audit routing action.

**Alternate paths and exceptions**
- If service requires appointment, create referral to scheduling.
- If urgent, redirect to emergency registration.

**Data captured or updated**
- Visit type, service point, queue, priority, payer/category, route status.

**Controls, privacy and audit**
- Patient identity confirmation; service-point validation; audit; no queue without patient ID.

**Integration, Nigeria Core and DHIN mapping**
- Queue, billing, encounter creation, dashboards.

**Acceptance criteria**
- Walk-in patient is linked to patient record and routed.
- Queue or billing handoff exists.

---

### W-HIM-009: Emergency temporary registration

| Field | Value |
|---|---|
| Category | Emergency |
| Primary actor | A&E Registration Officer |
| Supporting actors | Triage Nurse, Clinician, Guardian/Next of Kin, HIM Officer |
| Trigger | Patient requires urgent care and complete identity is unavailable or cannot be collected before care. |
| Goal / output | Create temporary emergency identity quickly while preserving later reconciliation. |
| Linked requirement IDs | FR-HIM-REG-041 through FR-HIM-REG-050 |

**Preconditions**
- User has emergency registration permission.
- Emergency identifier pattern is configured.

**Main flow**
1. Select emergency registration.
2. System generates temporary emergency ID.
3. Capture minimum available identity: approximate name/label, sex if known, estimated age, arrival time/mode and distinguishing notes.
4. Mark record as temporary emergency.
5. Route patient immediately to triage/A&E queue.
6. Place record on reconciliation worklist.
7. Audit emergency registration.

**Alternate paths and exceptions**
- If patient is unconscious/unknown, use W-HIM-010.
- If multiple casualties arrive, use W-HIM-011.
- If identity later confirmed, use reconciliation and possible merge.

**Data captured or updated**
- Temporary ID, emergency label, estimated age, sex, arrival time/mode, accompanying person, notes, triage route.

**Controls, privacy and audit**
- Reduced mandatory fields; temporary status; reconciliation queue; audit; no blocking for NIN/insurance.

**Integration, Nigeria Core and DHIN mapping**
- A&E queue, triage, encounter creation, later NgPatient conversion.

**Acceptance criteria**
- Temporary patient record and emergency ID are created.
- Patient can be triaged without full demographics.
- Record is visible in reconciliation queue.

---

### W-HIM-010: Unknown or unconscious patient

| Field | Value |
|---|---|
| Category | Emergency |
| Primary actor | A&E Registration Officer |
| Supporting actors | Triage Nurse, Clinician, Security/Police Liaison, HIM Officer |
| Trigger | Patient identity is unknown because patient is unconscious, confused, abandoned, deceased on arrival or cannot communicate. |
| Goal / output | Create safe unknown patient record that can later be identified and reconciled. |
| Linked requirement IDs | FR-HIM-REG-051, FR-HIM-REG-052, FR-HIM-REG-053, FR-HIM-REG-054, FR-HIM-REG-055, FR-HIM-REG-056 |

**Preconditions**
- Emergency registration permission exists.

**Main flow**
1. Create unknown patient using configured placeholder naming convention.
2. Capture sex if known, estimated age/age band, arrival source, date/time, and distinguishing notes.
3. Capture photo only if facility policy permits.
4. Mark as unknown/temporary.
5. Route to A&E triage.
6. Start reconciliation task for HIM/A&E team.

**Alternate paths and exceptions**
- If identity document is later found, update through controlled identity correction.
- If matching existing patient is found, initiate merge workflow.
- If patient remains unknown, keep unresolved status with review date.

**Data captured or updated**
- Unknown label, temporary ID, estimated demographics, arrival details, distinguishing notes, photo reference if permitted.

**Controls, privacy and audit**
- Placeholder naming rule; restricted update; reconciliation queue; audit; privacy safeguard for photo/notes.

**Integration, Nigeria Core and DHIN mapping**
- A&E encounter, MPI duplicate service, NgPatient temporary representation.

**Acceptance criteria**
- Unknown patient can receive care with temporary ID.
- Record is flagged as unresolved identity.
- Later identification does not lose emergency encounter history.

---

### W-HIM-011: Mass casualty rapid registration

| Field | Value |
|---|---|
| Category | Emergency / Contingency |
| Primary actor | A&E Registration Officer |
| Supporting actors | Triage Nurse, Incident Commander, HIM Supervisor, Clinician |
| Trigger | Multiple emergency patients arrive during accident, disaster, outbreak or security incident. |
| Goal / output | Create rapid temporary identities and preserve triage/encounter linkage under surge conditions. |
| Linked requirement IDs | FR-HIM-REG-074, FR-HIM-REG-075, FR-HIM-REG-076, FR-HIM-REG-077, FR-HIM-REG-078 |

**Preconditions**
- Mass casualty workflow is enabled.
- Temporary ID series is configured.

**Main flow**
1. Activate mass casualty registration mode.
2. Generate sequential temporary IDs/bands.
3. Capture minimum attributes for each patient.
4. Assign triage/priority tag where configured.
5. Route each patient to A&E queue/triage area.
6. Produce mass casualty list for incident team.
7. Begin post-event identity reconciliation.

**Alternate paths and exceptions**
- If system unavailable, use pre-numbered paper tags and import/reconcile later.
- If duplicate temporary ID is detected, lock one record for review.

**Data captured or updated**
- Temporary ID, tag number, triage category, arrival source/time, estimated demographics, incident reference.

**Controls, privacy and audit**
- Batch ID uniqueness; incident audit; reconciliation worklist; downtime fallback.

**Integration, Nigeria Core and DHIN mapping**
- A&E queue, emergency dashboard, reconciliation reports.

**Acceptance criteria**
- Multiple temporary records are created without MRN collision.
- Each record is independently reconcilable.
- Incident list/report can be produced.

---

### W-HIM-012: Neonate registration and mother-baby linkage

| Field | Value |
|---|---|
| Category | Registration / MNCH |
| Primary actor | HIM Officer |
| Supporting actors | Maternity Nurse, Mother/Guardian, Clinician |
| Trigger | Baby is born or presents for care before legal name/birth certificate is available. |
| Goal / output | Create neonate identity linked to mother/guardian and maternity encounter where applicable. |
| Linked requirement IDs | FR-HIM-REG-057, FR-HIM-REG-058, FR-HIM-REG-059, FR-HIM-REG-060, FR-HIM-REG-061, FR-HIM-REG-062 |

**Preconditions**
- Mother record exists or is registered.
- Neonate naming and multiple-birth rules are configured.

**Main flow**
1. Open mother record or register mother if needed.
2. Start neonate registration.
3. Capture temporary baby name, date/time of birth, sex, birth order and birth weight if available.
4. Link neonate to mother and maternity encounter.
5. Capture guardian/parent details and birth certificate number if available.
6. Generate neonate MRN or temporary ID per policy.
7. Audit linkage and registration.

**Alternate paths and exceptions**
- If mother identity is unknown, create mother/baby temporary linkage for later reconciliation.
- If multiple birth, capture birth order and unique baby identifiers.
- When legal name is confirmed, update with reason and audit.

**Data captured or updated**
- Neonate name/temporary label, DOB/time, sex, mother ID, birth order, guardian, birth certificate number, MRN.

**Controls, privacy and audit**
- Mother-baby linkage; no shared MRN; audit name changes; duplicate checks for neonates.

**Integration, Nigeria Core and DHIN mapping**
- MNCH referral, immunization, NgPatient/NgRelatedPerson, maternity encounter.

**Acceptance criteria**
- Baby has unique record linked to mother.
- Multiple births are distinguishable.
- Temporary name can be legally updated without losing history.

---

### W-HIM-013: Minor registration with guardian

| Field | Value |
|---|---|
| Category | Registration / Consent |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Guardian, Patient, HIM Officer, Data Protection Officer |
| Trigger | Patient is below configured age threshold or cannot legally act independently. |
| Goal / output | Register minor and capture guardian/authorised representative details. |
| Linked requirement IDs | FR-HIM-REG-063, FR-HIM-REG-064, FR-HIM-REG-065, FR-HIM-REG-066, FR-HIM-REG-067, FR-HIM-REG-068 |

**Preconditions**
- Minor age threshold is configured.
- Guardian data fields are enabled.

**Main flow**
1. Capture patient demographics and DOB/estimated age.
2. System identifies patient as minor.
3. Capture guardian name, relationship, contact, address and ID where required.
4. Capture consent/authorisation metadata where applicable.
5. Run duplicate check using patient and guardian details.
6. Create patient record and route to service.

**Alternate paths and exceptions**
- If guardian absent, follow facility emergency/child-protection policy.
- If guardian authority is disputed, flag for HIM supervisor/DPO review.

**Data captured or updated**
- Guardian details, relationship, contact, authority status, consent metadata, minor flag.

**Controls, privacy and audit**
- Guardian required by policy; next of kin not assumed legal authority; restricted release for minors; audit.

**Integration, Nigeria Core and DHIN mapping**
- NgRelatedPerson, NgConsent, MNCH, immunization.

**Acceptance criteria**
- Minor record includes guardian relationship.
- Consent/release rules can identify guardian status.
- Guardian changes are auditable.

---

### W-HIM-014: Deceased-on-arrival or deceased status

| Field | Value |
|---|---|
| Category | Registration / Record Lifecycle |
| Primary actor | HIM Officer |
| Supporting actors | A&E Clinician, Mortuary Officer, Guardian/Next of Kin, HIM Supervisor |
| Trigger | Patient arrives deceased or an existing patient is confirmed deceased. |
| Goal / output | Create or update record status as deceased while controlling downstream actions and disclosure. |
| Linked requirement IDs | FR-HIM-REG-069, FR-HIM-REG-070, FR-HIM-REG-071, FR-HIM-REG-072, FR-HIM-REG-073 |

**Preconditions**
- User has deceased status permission.
- Clinical/legal confirmation workflow is defined by facility.

**Main flow**
1. Search existing patient or create deceased-on-arrival record if required.
2. Capture date/time of death or declaration, source and certifying clinician where applicable.
3. Set deceased status distinct from inactive/archive status.
4. Restrict routine clinical routing and updates.
5. Notify downstream modules where configured.
6. Audit deceased status action.

**Alternate paths and exceptions**
- If identity unknown, use W-HIM-010 with deceased flag.
- If death status entered in error, require supervisor reversal and audit.

**Data captured or updated**
- Deceased flag, date/time, certifier/source, next-of-kin details, mortuary/reference notes.

**Controls, privacy and audit**
- Elevated permission; audit; restricted routine changes; disclosure controls.

**Integration, Nigeria Core and DHIN mapping**
- A&E, mortuary, record release, NgPatient.deceased[x].

**Acceptance criteria**
- Deceased status is visible in patient banner.
- Routine care routing is prevented or warned.
- Status change is auditable.

---

### W-HIM-015: Demographic correction/update

| Field | Value |
|---|---|
| Category | Record Maintenance |
| Primary actor | HIM Officer |
| Supporting actors | Patient, Front Desk Officer, HIM Supervisor |
| Trigger | Patient demographic information is found to be incomplete, outdated or incorrect. |
| Goal / output | Correct demographics without losing historical values or creating identity risk. |
| Linked requirement IDs | FR-HIM-REG-079, FR-HIM-REG-080, FR-HIM-REG-081, FR-HIM-REG-082, FR-HIM-REG-083 |

**Preconditions**
- User has update permission.
- Patient record is active/provisional and not locked for merge unless supervisor allows.

**Main flow**
1. Open patient profile and confirm patient identity.
2. Select field(s) to update.
3. Enter corrected value and reason.
4. System validates format and business rules.
5. For high-risk fields, route to supervisor approval.
6. System saves new value, preserves old value and triggers duplicate check if identity fields changed.
7. Audit update.

**Alternate paths and exceptions**
- If update suggests duplicate, route to duplicate review.
- If patient disputes existing record, create correction request rather than overwrite.
- If record is deceased/restricted, apply special permission rules.

**Data captured or updated**
- Old value, new value, correction reason, supporting document, approval status, audit metadata.

**Controls, privacy and audit**
- Versioned changes; high-risk approval; duplicate trigger; audit; no silent overwrite.

**Integration, Nigeria Core and DHIN mapping**
- Patient banner, duplicate/MPI, NgProvenance/AuditEvent.

**Acceptance criteria**
- Old and new values are traceable.
- High-risk updates require approval where configured.
- Duplicate check runs for identity changes.

---

### W-HIM-016: Identity document update

| Field | Value |
|---|---|
| Category | Identifier Maintenance |
| Primary actor | HIM Officer |
| Supporting actors | Patient, HIM Supervisor |
| Trigger | Patient presents new or corrected identity document or identifier verification status changes. |
| Goal / output | Update identifier evidence safely with namespace, verification and audit controls. |
| Linked requirement IDs | FR-HIM-ID-011, FR-HIM-ID-012, FR-HIM-ID-021 through FR-HIM-ID-028 |

**Preconditions**
- User has identifier update permission.
- Patient identity is verified.

**Main flow**
1. Open identifier panel.
2. Add/update identifier type, value, issuer, expiry and verification status.
3. Check for existing use of same identifier in same namespace.
4. If conflict found, route to duplicate/identity review.
5. Save update with reason and audit.

**Alternate paths and exceptions**
- If identifier belongs to another patient, block save pending supervisor review.
- If document is expired/unverified, mark status accordingly rather than reject care.

**Data captured or updated**
- Identifier type, value, system, issuer, verification status, start/end date, reason.

**Controls, privacy and audit**
- Namespace, uniqueness rules, high-confidence duplicate checks, masking, audit.

**Integration, Nigeria Core and DHIN mapping**
- MPI, NgPatient.identifier slices, claims if insurance ID.

**Acceptance criteria**
- Identifier is stored correctly and searchable.
- Conflicts are blocked or reviewed.
- Identifier changes are auditable.

---

### W-HIM-017: NIN or high-confidence identifier verification

| Field | Value |
|---|---|
| Category | Identifier / Verification |
| Primary actor | HIM Officer |
| Supporting actors | Patient, Identity Verification Service, HIM Supervisor |
| Trigger | A previously unverified NIN/national ID/strong identifier needs verification or correction. |
| Goal / output | Update verification status and prevent conflicting identity records. |
| Linked requirement IDs | FR-HIM-ID-006, FR-HIM-ID-011, FR-HIM-ID-012, FR-HIM-ID-021, FR-HIM-ID-022 |

**Preconditions**
- Verification method is available or manual verification policy exists.

**Main flow**
1. Open patient identifiers.
2. Submit identifier for automated verification or record manual verification evidence.
3. Receive verification outcome: verified, failed, unavailable, pending or mismatch.
4. If verified, update status.
5. If mismatch/conflict, create identity review task.
6. Audit verification attempt and outcome.

**Alternate paths and exceptions**
- If verification service unavailable, keep pending status and retry later.
- If identifier is shared by two active records, route to duplicate/merge review.

**Data captured or updated**
- Verification status, method, timestamp, service response reference, reviewer, reason.

**Controls, privacy and audit**
- Audit; no blind overwrite; RBAC; masking; identity conflict escalation.

**Integration, Nigeria Core and DHIN mapping**
- Identity verification service, MPI, future client registry.

**Acceptance criteria**
- Verification status is stored and visible to authorised roles.
- Conflicts are not ignored.
- Audit evidence exists.

---

### W-HIM-018: Incomplete record completion

| Field | Value |
|---|---|
| Category | Data Quality |
| Primary actor | HIM Officer |
| Supporting actors | Front Desk Officer, Patient, HIM Supervisor |
| Trigger | Patient record lacks required demographic, contact, identifier or related-person data. |
| Goal / output | Complete missing fields and improve record quality without blocking urgent care. |
| Linked requirement IDs | FR-HIM-DEM-051 through FR-HIM-DEM-060 |

**Preconditions**
- Record completeness rules are configured.

**Main flow**
1. System lists incomplete records in worklist.
2. HIM officer opens record and reviews missing fields.
3. Contact patient/guardian or verify from source document.
4. Enter missing data or document formal exception.
5. Run validations and duplicate checks if identity fields change.
6. Update completeness status and audit.

**Alternate paths and exceptions**
- If patient unavailable, keep unresolved with review date.
- If missing data relates to emergency temporary record, follow reconciliation workflow.

**Data captured or updated**
- Missing field list, updated values, exception reason, review date, completeness status.

**Controls, privacy and audit**
- Completeness dashboard; audit; no fabrication of data; formal exception option.

**Integration, Nigeria Core and DHIN mapping**
- HIM dashboard, reporting, MPI, NgPatient mapping readiness.

**Acceptance criteria**
- Record completeness is recalculated.
- Outstanding gaps are visible in reports.
- Updates are auditable.

---

### W-HIM-019: Duplicate detected before save

| Field | Value |
|---|---|
| Category | MPI / Duplicate |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | HIM Officer, HIM Supervisor |
| Trigger | Duplicate matching threshold is met during registration or identity update. |
| Goal / output | Prevent unnecessary duplicate patient record creation while allowing reviewed exceptions. |
| Linked requirement IDs | FR-HIM-MPI-001 through FR-HIM-MPI-010 |

**Preconditions**
- Duplicate matching rules are active.

**Main flow**
1. System displays candidate duplicates and match reasons.
2. User compares key demographics and identifiers.
3. If same patient, select existing record and cancel new registration.
4. If uncertain, save as possible duplicate only if policy permits and create review task.
5. If not duplicate, document reason and proceed.
6. Audit warning and decision.

**Alternate paths and exceptions**
- If exact verified identifier duplicate exists, block registration pending supervisor review.
- If emergency care required, allow temporary emergency record but keep reconciliation flag.

**Data captured or updated**
- Candidate records, match score/category, decision, reason, reviewer, audit metadata.

**Controls, privacy and audit**
- Duplicate warning; reason capture; override permission; audit; high-confidence block.

**Integration, Nigeria Core and DHIN mapping**
- MPI worklist, patient search, merge queue.

**Acceptance criteria**
- Duplicate warning appears before save.
- Decision is stored.
- Potential duplicate is routed to worklist.

---

### W-HIM-020: Duplicate review queue

| Field | Value |
|---|---|
| Category | MPI / Governance |
| Primary actor | HIM Officer |
| Supporting actors | HIM Supervisor, Front Desk Officer, Clinician |
| Trigger | System or user flags two or more records as possible duplicates. |
| Goal / output | Review suspected duplicate records and decide whether to merge, reject or defer. |
| Linked requirement IDs | FR-HIM-MPI-011 through FR-HIM-MPI-016 |

**Preconditions**
- User has duplicate review permission.
- Candidate records exist.

**Main flow**
1. Open duplicate review queue.
2. Review candidate pair/group and match explanation.
3. Compare identifiers, demographics, contacts, related persons, encounters and documents.
4. Select decision: duplicate confirmed, not duplicate, insufficient information or defer.
5. Capture reason and supporting evidence.
6. If confirmed, create merge request.
7. Audit decision.

**Alternate paths and exceptions**
- If clinical/billing activity is active, coordinate with affected departments before merge.
- If insufficient evidence, schedule follow-up review.

**Data captured or updated**
- Candidate pair, match attributes, reviewer decision, reason, evidence, status.

**Controls, privacy and audit**
- Role-restricted review; explanation of match; decision reason; audit; no automatic merge.

**Integration, Nigeria Core and DHIN mapping**
- Merge workflow, MPI dashboard, audit reports.

**Acceptance criteria**
- Each candidate has review status.
- Confirmed duplicates create merge requests.
- Rejected duplicates do not keep warning.

---

### W-HIM-021: Merge approved duplicate records

| Field | Value |
|---|---|
| Category | Merge / MPI |
| Primary actor | HIM Supervisor |
| Supporting actors | HIM Officer, Billing Officer, Clinician, Claims Officer |
| Trigger | Duplicate review confirms two or more records represent the same patient. |
| Goal / output | Safely combine records without deleting history or losing linked encounters/documents. |
| Linked requirement IDs | FR-HIM-MRG-001 through FR-HIM-MRG-011 |

**Preconditions**
- Merge request exists.
- Supervisor has merge permission.
- Active downstream conflicts are reviewed.

**Main flow**
1. Open merge request and compare records side by side.
2. Select survivor record.
3. Resolve demographic and identifier conflicts.
4. Review linked encounters, documents, orders, invoices and claims.
5. Confirm merge with reason.
6. System moves linkages to survivor and marks non-survivor as merged.
7. Preserve all historical identifiers and audit history.
8. Notify dependent modules where configured.

**Alternate paths and exceptions**
- If conflicting clinical/billing data cannot be safely resolved, defer merge and assign review.
- If merge is entered in error, use W-HIM-022.

**Data captured or updated**
- Survivor patient ID, non-survivor IDs, selected values, identifiers preserved, reason, approver.

**Controls, privacy and audit**
- Supervisor approval; conflict review; no deletion; full merge audit; ability to unmerge.

**Integration, Nigeria Core and DHIN mapping**
- All downstream modules, MPI, NgProvenance/AuditEvent.

**Acceptance criteria**
- Search redirects merged identifiers to survivor.
- All historical links are preserved.
- Merge audit is complete.

---

### W-HIM-022: Unmerge incorrect merge

| Field | Value |
|---|---|
| Category | Merge / Correction |
| Primary actor | HIM Supervisor |
| Supporting actors | HIM Officer, Auditor, Clinical/Billing Representatives |
| Trigger | A previous merge is discovered to be incorrect or unsafe. |
| Goal / output | Reverse merge where possible and flag manual reconciliation where automatic restoration is unsafe. |
| Linked requirement IDs | FR-HIM-MRG-012 through FR-HIM-MRG-017 |

**Preconditions**
- User has unmerge permission.
- Original merge audit record is available.

**Main flow**
1. Open merge audit history.
2. Create unmerge request with reason and evidence.
3. Review records, linkages and downstream impacts.
4. Approve unmerge.
5. System restores pre-merge identifiers and linkages where deterministically known.
6. Flag ambiguous linkages for manual review.
7. Audit unmerge and notify affected modules.

**Alternate paths and exceptions**
- If full automated unmerge is unsafe, create manual remediation tasks.
- If billing/claims already submitted, flag for claims/billing correction.

**Data captured or updated**
- Original merge ID, unmerge reason, restored records, unresolved items, approvals.

**Controls, privacy and audit**
- Elevated permission; approval; audit; manual review for ambiguity; no silent data loss.

**Integration, Nigeria Core and DHIN mapping**
- MPI, encounters, documents, billing, claims, audit reports.

**Acceptance criteria**
- Unmerge action has full audit record.
- Ambiguous items are not silently assigned.
- Affected modules receive correction status.

---

### W-HIM-023: Patient search and record retrieval

| Field | Value |
|---|---|
| Category | Search |
| Primary actor | Authorised User |
| Supporting actors | HIM Officer, Clinician, Front Desk Officer, Auditor |
| Trigger | User needs to locate patient record for care, administration, billing, audit or records work. |
| Goal / output | Retrieve the correct patient record while protecting privacy and preventing wrong-patient actions. |
| Linked requirement IDs | FR-HIM-SRH-001 through FR-HIM-SRH-010 |

**Preconditions**
- User is authenticated and has search permission.

**Main flow**
1. Enter search criteria such as MRN, name, phone, date of birth, identifier or appointment.
2. System returns role-appropriate results with key verification fields.
3. User filters/sorts results and selects candidate.
4. System displays patient banner and record status alerts.
5. User confirms patient context before action.
6. System logs search/view activity where configured.

**Alternate paths and exceptions**
- Restricted record requires special permission or break-glass.
- Merged record redirects to survivor.
- No results found may trigger new registration.

**Data captured or updated**
- Search criteria, result set, selected patient, view event, role, workstation.

**Controls, privacy and audit**
- RBAC; masking; patient banner; wrong-patient prevention; audit.

**Integration, Nigeria Core and DHIN mapping**
- All patient-context modules; Nigeria Core/DHIN query readiness.

**Acceptance criteria**
- Search returns relevant matches quickly.
- Restricted/merged/deceased statuses are visible.
- Patient view can be audited.

---

### W-HIM-024: Restricted record and break-glass

| Field | Value |
|---|---|
| Category | Privacy / Access |
| Primary actor | Clinician or HIM Supervisor |
| Supporting actors | Data Protection Officer, Auditor, Security Admin |
| Trigger | User attempts to access a restricted/confidential patient record or sensitive document. |
| Goal / output | Protect sensitive records while permitting justified emergency access. |
| Linked requirement IDs | NFR-HIM-PRI-003, NFR-HIM-PRI-004, NFR-HIM-PRI-006, NFR-HIM-PRI-007, NFR-HIM-PRI-008 |

**Preconditions**
- Record/document has restricted flag or user lacks standard permission.

**Main flow**
1. System detects restricted access condition.
2. If user lacks permission, deny access and show safe message.
3. If emergency access is needed, user initiates break-glass.
4. User enters justification and confirms emergency need.
5. System grants time-bound access if policy permits.
6. System logs high-priority audit event and notifies reviewer where configured.
7. DPO/Auditor reviews break-glass events.

**Alternate paths and exceptions**
- If break-glass disabled for role, deny and route to supervisor.
- If justification inadequate, deny and log attempt.

**Data captured or updated**
- Restriction flag, justification, access duration, reviewer status, audit event.

**Controls, privacy and audit**
- RBAC; time-bound access; justification; alerting; audit review; minimum necessary access.

**Integration, Nigeria Core and DHIN mapping**
- Audit dashboard, privacy reporting, patient banner.

**Acceptance criteria**
- Unauthorised users cannot access restricted record.
- Break-glass requires justification and is auditable.
- Review list is available.

---

### W-HIM-025: Document upload and indexing

| Field | Value |
|---|---|
| Category | Medical Records |
| Primary actor | HIM Officer |
| Supporting actors | Patient, Clinician, Scanner Service |
| Trigger | A scanned, uploaded or generated document needs to become part of the patient medical record. |
| Goal / output | Attach document to correct patient/encounter with metadata, classification and audit. |
| Linked requirement IDs | FR-HIM-DOC-001 through FR-HIM-DOC-010 |

**Preconditions**
- Patient identity is confirmed.
- User has document upload permission.
- Document type configuration exists.

**Main flow**
1. Open patient record and confirm patient banner.
2. Select upload/add document.
3. Choose file or scanner output.
4. System validates file type, size and malware/security checks.
5. User enters document type, date, source, encounter, confidentiality and notes.
6. System saves document metadata and file reference.
7. System creates audit/provenance record.

**Alternate paths and exceptions**
- If wrong patient selected, cancel before save.
- If file fails validation, reject and show reason.
- If metadata incomplete, save as draft/pending index only if policy allows.

**Data captured or updated**
- File reference, document type, source, date, encounter, confidentiality, uploader, quality status.

**Controls, privacy and audit**
- Patient confirmation; file validation; metadata requirement; confidentiality flag; audit.

**Integration, Nigeria Core and DHIN mapping**
- DocumentReference readiness, legacy records, clinical record view.

**Acceptance criteria**
- Document is retrievable under correct patient.
- Metadata is complete.
- Upload/view actions are auditable.

---

### W-HIM-026: Legacy scanned record indexing

| Field | Value |
|---|---|
| Category | Migration / Records |
| Primary actor | HIM Officer |
| Supporting actors | Scanning Clerk, HIM Supervisor, Migration Team |
| Trigger | Paper record or legacy file is scanned/imported for attachment to patient record. |
| Goal / output | Index legacy records with source, date range and quality status while preserving legacy MRN. |
| Linked requirement IDs | FR-HIM-DOC-011 through FR-HIM-DOC-015 |

**Preconditions**
- Patient record exists or legacy MRN mapping is available.
- Document taxonomy is configured.

**Main flow**
1. Scan or import legacy file.
2. Search patient by legacy MRN/current MRN/demographics.
3. Confirm correct patient or flag for binding review.
4. Enter document type, source archive, date range, legacy MRN, batch ID and quality status.
5. Attach document and mark indexing complete.
6. Audit import and indexing.

**Alternate paths and exceptions**
- If patient cannot be confidently matched, put in unbound legacy record queue.
- If scan quality inadequate, mark for rescanning.

**Data captured or updated**
- Legacy MRN, batch ID, source, date range, document type, quality score, patient binding status.

**Controls, privacy and audit**
- No blind binding; legacy identifier preservation; QC; audit; migration batch evidence.

**Integration, Nigeria Core and DHIN mapping**
- Migration register, document management, patient search.

**Acceptance criteria**
- Legacy record is linked to correct patient or held in exception queue.
- Legacy MRN remains searchable.
- Batch audit evidence exists.

---

### W-HIM-027: Document correction, replacement or created-in-error

| Field | Value |
|---|---|
| Category | Medical Records / Correction |
| Primary actor | HIM Officer |
| Supporting actors | HIM Supervisor, Clinician, Auditor |
| Trigger | Document is uploaded to wrong patient, wrong encounter, wrong type, poor quality, duplicate or created in error. |
| Goal / output | Correct document metadata or status without deleting evidence improperly. |
| Linked requirement IDs | FR-HIM-DOC-016 through FR-HIM-DOC-020 |

**Preconditions**
- User has document correction permission.
- Document exists and is not locked by legal hold unless supervisor permits.

**Main flow**
1. Open document metadata and current audit history.
2. Select correction type: metadata correction, replacement, duplicate, created-in-error or restrict.
3. Enter reason and supporting details.
4. For high-risk changes, route for supervisor approval.
5. System applies correction, preserves prior version/status and logs audit.
6. Notify affected users/modules where configured.

**Alternate paths and exceptions**
- If document belongs to another patient, remove access from wrong record and reattach through controlled correction.
- If document was already released externally, flag incident/review.

**Data captured or updated**
- Correction type, old metadata, new metadata, replacement file, reason, approver, audit.

**Controls, privacy and audit**
- Versioning; no silent deletion; approval; audit; wrong-patient incident review.

**Integration, Nigeria Core and DHIN mapping**
- DocumentReference status, audit/provenance, privacy incident workflow.

**Acceptance criteria**
- Original action remains auditable.
- Corrected document state is clear.
- Wrong-patient upload can be remediated safely.

---

### W-HIM-028: Patient requests record release

| Field | Value |
|---|---|
| Category | Release of Information |
| Primary actor | HIM Officer |
| Supporting actors | Patient, HIM Supervisor, Data Protection Officer, Billing Officer |
| Trigger | Patient requests copy, summary, medical report or disclosure of own record. |
| Goal / output | Process authorised patient release request with scope, approval, fee handling and audit. |
| Linked requirement IDs | FR-HIM-REL-001 through FR-HIM-REL-008 |

**Preconditions**
- Requester identity is verified.
- Record release policy is configured.

**Main flow**
1. Create release request and verify patient identity.
2. Capture request purpose, requested documents/date range and preferred delivery method.
3. Check restrictions, consent, legal hold and outstanding approval requirements.
4. Route for approval if required.
5. Prepare release package with minimum necessary documents.
6. Apply redaction/masking where required.
7. Record release method, date, recipient and audit.

**Alternate paths and exceptions**
- If requester identity cannot be verified, reject or pend.
- If record has sensitive/restricted content, escalate to supervisor/DPO.
- If fee applies, hand off to billing before release.

**Data captured or updated**
- Requester identity, purpose, scope, requested docs, approval, release package, delivery method, fee status.

**Controls, privacy and audit**
- Identity verification; scope limitation; approval; redaction; release register; audit.

**Integration, Nigeria Core and DHIN mapping**
- Billing, document management, consent, audit, privacy reporting.

**Acceptance criteria**
- Release is recorded with requester, scope and approver.
- Only authorised content is released.
- Release audit can be reviewed.

---

### W-HIM-029: Guardian or third-party record release

| Field | Value |
|---|---|
| Category | Release / Privacy |
| Primary actor | HIM Officer |
| Supporting actors | Guardian/Next of Kin, HIM Supervisor, DPO, Legal/Compliance |
| Trigger | Guardian, next of kin, employer, insurer, lawyer, court or other third party requests patient records. |
| Goal / output | Ensure disclosure is lawful, authorised, minimal and auditable. |
| Linked requirement IDs | FR-HIM-REL-009 through FR-HIM-REL-015 |

**Preconditions**
- Requester identity and authority must be verified.

**Main flow**
1. Create release request and classify requester type.
2. Verify authority: guardian status, patient consent, court order, insurer agreement or facility policy.
3. Define requested scope/date range.
4. Check restrictions, minors/deceased rules and sensitive documents.
5. Route for supervisor/DPO/legal approval as required.
6. Prepare redacted/minimum necessary release package.
7. Record release or rejection with reason.

**Alternate paths and exceptions**
- If authority insufficient, reject with reason.
- If patient consent is required but missing, hold request pending consent.
- If court/legal request is complex, escalate to legal/compliance.

**Data captured or updated**
- Requester type, authority evidence, patient consent, scope, approval, release/rejection reason.

**Controls, privacy and audit**
- Authority verification; consent check; minimum necessary; legal/DPO approval; audit.

**Integration, Nigeria Core and DHIN mapping**
- Consent, document management, billing, audit.

**Acceptance criteria**
- No third-party release occurs without authority evidence.
- Rejected requests are logged.
- Released package is scoped and auditable.

---

### W-HIM-030: Internal clinical records request

| Field | Value |
|---|---|
| Category | Medical Records / Internal Request |
| Primary actor | Clinician |
| Supporting actors | HIM Officer, HIM Supervisor, Ward Clerk |
| Trigger | Clinician or department requests archived, legacy, restricted or paper-scanned record for care. |
| Goal / output | Provide authorised internal access to required record material while logging access. |
| Linked requirement IDs | FR-HIM-REL-016, FR-HIM-REL-017, FR-HIM-REL-018 |

**Preconditions**
- Requesting user has clinical relationship or approved need.

**Main flow**
1. Clinician submits internal record request specifying patient, document/date range and purpose.
2. HIM verifies patient and requester role/department.
3. Retrieve digital/scanned document or locate physical record reference.
4. Grant access or provide controlled copy within system.
5. Log request fulfilment and access.

**Alternate paths and exceptions**
- If restricted record, apply break-glass or approval.
- If document unavailable, mark as not found and escalate search.

**Data captured or updated**
- Requester, purpose, documents requested, fulfilment status, access grant, audit.

**Controls, privacy and audit**
- Need-to-know; role validation; restricted handling; audit.

**Integration, Nigeria Core and DHIN mapping**
- Document management, clinical modules, audit dashboard.

**Acceptance criteria**
- Internal request is linked to patient and requester.
- Access is limited to required records.
- Fulfilment status is trackable.

---

### W-HIM-031: HMO / claims document request

| Field | Value |
|---|---|
| Category | Claims / Release |
| Primary actor | Claims / HMO Officer |
| Supporting actors | HIM Officer, Billing Officer, HIM Supervisor, Payer Representative |
| Trigger | Insurance/HMO/claims workflow requires medical-record evidence, eligibility or pre-authorisation documentation. |
| Goal / output | Provide authorised evidence package linked to patient, encounter and coverage. |
| Linked requirement IDs | FR-HIM-REL-019, FR-HIM-REL-020, FR-HIM-REL-021 |

**Preconditions**
- Patient coverage/payer details exist or are captured.
- Release-to-payer basis is configured/authorised.

**Main flow**
1. Open claims request linked to patient and encounter.
2. Verify payer/coverage details and requested evidence.
3. Select required documents/orders/results/encounter summaries.
4. Apply minimum necessary and masking rules.
5. Obtain approval if required.
6. Package evidence for claims/pre-auth workflow.
7. Audit disclosure/package generation.

**Alternate paths and exceptions**
- If coverage is invalid, route to billing/coverage correction.
- If requested document is missing, create HIM retrieval task.
- If payer request exceeds scope, reject or ask for revised request.

**Data captured or updated**
- Coverage, payer, encounter, claim/pre-auth reference, evidence package, approval, release log.

**Controls, privacy and audit**
- Payer authorisation; consent/disclosure rules; minimum necessary; audit.

**Integration, Nigeria Core and DHIN mapping**
- NgCoverage, NgClaim, NgInvoice, billing/claims, document management.

**Acceptance criteria**
- Evidence package is linked to patient, encounter and payer.
- Disclosure is approved/auditable.
- Claims team can track status.

---

### W-HIM-032: Consent capture, update or withdrawal

| Field | Value |
|---|---|
| Category | Consent / Privacy |
| Primary actor | HIM Officer |
| Supporting actors | Patient, Guardian, Clinician, DPO |
| Trigger | Consent is required for treatment administration, record sharing, research/analytics, portal, insurance or disclosure workflow. |
| Goal / output | Record consent status, scope and source in a reusable and auditable form. |
| Linked requirement IDs | FR-HIM-CON-001 through FR-HIM-CON-005 |

**Preconditions**
- Consent types/templates are configured.
- Patient or authorised representative is identified.

**Main flow**
1. Select consent type and scope.
2. Verify consenting party and authority.
3. Capture consent status, date, method and source document/signature where applicable.
4. Link consent to patient and related workflow/document.
5. If withdrawal, update status and effective date.
6. Audit consent action.

**Alternate paths and exceptions**
- If consent unavailable in emergency, record emergency exception.
- If guardian consent is disputed, escalate to DPO/HIM supervisor.

**Data captured or updated**
- Consent status, scope, category, consenting party, date, source, withdrawal/effective date.

**Controls, privacy and audit**
- Authority verification; versioning; withdrawal; audit; minimum necessary.

**Integration, Nigeria Core and DHIN mapping**
- NgConsent, record release, DHIN/Nigeria Core exchange, patient privacy rules.

**Acceptance criteria**
- Consent record is linked to patient and scope.
- Withdrawal changes future disclosure behaviour.
- Consent action is auditable.

---

### W-HIM-033: Referral registration

| Field | Value |
|---|---|
| Category | Referral / Registration |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, Referring Facility, Clinician, HIM Officer |
| Trigger | Patient arrives with referral or system receives referral context. |
| Goal / output | Register or verify patient and preserve referral source/context for care continuity. |
| Linked requirement IDs | FR-HIM-REG-105 through FR-HIM-REG-108 |

**Preconditions**
- Referral source and receiving service fields are configured.

**Main flow**
1. Search patient by referral details and demographics.
2. Verify existing patient or create new registration.
3. Capture referring facility/provider, referral reason, date and receiving service.
4. Attach referral document if available.
5. Create or link encounter/queue.
6. Audit referral registration.

**Alternate paths and exceptions**
- If referral patient is unknown/emergency, use emergency workflow and attach referral later.
- If referral document belongs to another patient, reject and investigate.

**Data captured or updated**
- Referral source, provider, reason, date, receiving service, document, patient link.

**Controls, privacy and audit**
- Patient identity confirmation; document indexing; audit; confidentiality handling.

**Integration, Nigeria Core and DHIN mapping**
- NgServiceRequest, NgTask, NgEncounter, document management.

**Acceptance criteria**
- Referral context is preserved.
- Patient is routed to receiving service.
- Referral document is indexed where available.

---

### W-HIM-034: Payer / insurance coverage capture

| Field | Value |
|---|---|
| Category | Billing / Claims |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Patient, Billing Officer, Claims Officer, Payer/HMO |
| Trigger | Patient declares insurance, HMO, corporate, NHIA, staff, welfare or other payer category. |
| Goal / output | Capture payer and coverage data separately from patient identity for billing and claims. |
| Linked requirement IDs | FR-HIM-REG-100 through FR-HIM-REG-104 |

**Preconditions**
- Payer categories/plans are configured.

**Main flow**
1. Select payer category and payer organisation.
2. Capture insurance/enrollee number, plan, policy/member status and validity dates where available.
3. Attach insurance card/document if required.
4. Check eligibility manually or through future service where available.
5. Expose payer data to billing/claims.
6. Audit payer capture/update.

**Alternate paths and exceptions**
- If eligibility cannot be verified, mark pending and route to claims/billing.
- If payer data conflicts with patient identity, route to review.

**Data captured or updated**
- Payer, plan, coverage ID, enrollee number, validity, eligibility status, document.

**Controls, privacy and audit**
- Coverage not same as identity; audit; document confidentiality; verifier/reviewer.

**Integration, Nigeria Core and DHIN mapping**
- NgCoverage, CoverageEligibilityRequest/Response, billing, claims.

**Acceptance criteria**
- Payer data is captured separately from demographics.
- Billing/claims can retrieve coverage details.
- Eligibility status is trackable.

---

### W-HIM-035: Queue routing after registration

| Field | Value |
|---|---|
| Category | Queue / Operations |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Queue Service, Clinic Nurse, Billing Officer |
| Trigger | Registration or verification is complete and patient needs next service. |
| Goal / output | Place patient into correct queue with patient context, priority and payer prerequisites. |
| Linked requirement IDs | FR-HIM-GEN-007, FR-HIM-GEN-010, FR-HIM-GEN-011, FR-HIM-GEN-012 |

**Preconditions**
- Patient record exists.
- Queue and service-point configurations are active.

**Main flow**
1. Select service/clinic/department.
2. System checks patient category, appointment, payment/pre-auth prerequisites where configured.
3. Assign priority or triage flag if applicable.
4. Create queue entry with patient ID and encounter/visit reference.
5. Display queue ticket/position.
6. Notify service point dashboard.

**Alternate paths and exceptions**
- If payment/pre-auth required, route to billing/claims before clinical queue.
- If wrong queue selected, allow authorised reroute with reason.

**Data captured or updated**
- Queue ID, service point, priority, encounter/visit reference, timestamp, user.

**Controls, privacy and audit**
- No queue without patient ID; configured routing rules; audit; reroute reason.

**Integration, Nigeria Core and DHIN mapping**
- Queue module, appointment, billing, encounter.

**Acceptance criteria**
- Patient appears in correct queue.
- Queue entry links to patient and visit.
- Rerouting is audited.

---

### W-HIM-036: Encounter creation/linkage

| Field | Value |
|---|---|
| Category | Encounter / Integration |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | Clinician, Billing Officer, Queue Service, Encounter Service |
| Trigger | A verified patient starts OPD, A&E, diagnostic-only, pharmacy-only, inpatient or other visit. |
| Goal / output | Create or link encounter so downstream clinical, billing and claims actions share the same patient context. |
| Linked requirement IDs | FR-HIM-GEN-001, FR-HIM-GEN-002, FR-HIM-GEN-007 |

**Preconditions**
- Patient record exists.
- Encounter types are configured.

**Main flow**
1. Select visit/encounter type and service point.
2. System creates encounter or links existing appointment/admission/queue event.
3. Attach patient, facility, department, provider/service and payer context.
4. Expose encounter to clinical/billing modules.
5. Audit encounter creation/linkage.

**Alternate paths and exceptions**
- If encounter already exists for same service/time, prevent duplicate or ask for confirmation.
- If patient is deceased/inactive/restricted, show blocking or warning rules.

**Data captured or updated**
- Encounter ID, patient ID, type, start time, service, facility, payer, source workflow.

**Controls, privacy and audit**
- Patient context lock; duplicate encounter prevention; audit; downstream consistency.

**Integration, Nigeria Core and DHIN mapping**
- NgEncounter, Appointment, billing, OPD, A&E, diagnostics, pharmacy.

**Acceptance criteria**
- Encounter is linked to patient and source workflow.
- Downstream modules use same encounter context.
- Duplicate encounter risk is controlled.

---

### W-HIM-037: Offline/degraded registration

| Field | Value |
|---|---|
| Category | Resilience |
| Primary actor | Front Desk / Registration Officer |
| Supporting actors | HIM Supervisor, IT Support, A&E Registration Officer |
| Trigger | Network, server, power or endpoint issue prevents normal online registration. |
| Goal / output | Continue essential registration safely while preserving reconciliation and audit requirements. |
| Linked requirement IDs | NFR-HIM-RESIL-001 through NFR-HIM-RESIL-005 |

**Preconditions**
- Downtime procedure exists.
- Offline/degraded mode or paper fallback has been approved.

**Main flow**
1. Detect degraded mode or invoke downtime SOP.
2. Issue pre-controlled temporary/downtime identifier.
3. Capture minimum patient data on approved offline form/tool.
4. Prioritise emergency care where needed.
5. Store forms/files securely until system restoration.
6. Enter/import data after restoration.
7. Flag all downtime records for duplicate/reconciliation review.

**Alternate paths and exceptions**
- If offline electronic capture is unavailable, use paper downtime log.
- If duplicate found after sync, route to merge review.

**Data captured or updated**
- Downtime ID, capture time, operator, minimum demographics, service route, sync/import status.

**Controls, privacy and audit**
- Controlled ID range; secure storage; reconciliation mandatory; audit/import batch; duplicate review.

**Integration, Nigeria Core and DHIN mapping**
- Sync/reconciliation, MPI, downtime reports.

**Acceptance criteria**
- Care can proceed with controlled temporary identity.
- All downtime records are reconciled.
- No silent duplicate/permanent MRN creation occurs.

---

### W-HIM-038: Offline sync and reconciliation

| Field | Value |
|---|---|
| Category | Resilience / Data Quality |
| Primary actor | HIM Officer |
| Supporting actors | IT Support, HIM Supervisor, Front Desk Officer |
| Trigger | System connectivity returns after offline/degraded registration or import. |
| Goal / output | Convert downtime/offline records into trusted patient records without duplicates or data loss. |
| Linked requirement IDs | NFR-HIM-RESIL-006 through NFR-HIM-RESIL-009 |

**Preconditions**
- Offline/downtime records exist.
- System is available.

**Main flow**
1. Import or enter downtime records as pending reconciliation.
2. Run duplicate search against active patient index.
3. Review each pending record.
4. Bind to existing patient, create new permanent patient or keep temporary pending review.
5. Resolve identifier and encounter links.
6. Close downtime batch with exception list.
7. Audit import and decisions.

**Alternate paths and exceptions**
- If patient already has active record, initiate merge/bind rather than create duplicate.
- If fields conflict, route to HIM supervisor.

**Data captured or updated**
- Downtime batch ID, temporary IDs, reconciliation decision, permanent patient ID/MRN, exceptions.

**Controls, privacy and audit**
- No automatic blind promotion; batch audit; duplicate checks; exception report.

**Integration, Nigeria Core and DHIN mapping**
- MPI, MRN generation, A&E/queue/encounter, dashboards.

**Acceptance criteria**
- Every downtime record has status.
- Duplicate risks are reviewed.
- Batch closure report exists.

---

### W-HIM-039: Legacy data migration and patient binding

| Field | Value |
|---|---|
| Category | Migration |
| Primary actor | Migration Team |
| Supporting actors | HIM Officer, HIM Supervisor, Data Quality Lead, IT Support |
| Trigger | Existing patient records from paper, spreadsheets or legacy systems need loading into REDNOXX. |
| Goal / output | Import legacy patient data while preserving source identifiers and controlling duplicates. |
| Linked requirement IDs | FR-HIM-MIG-001 through FR-HIM-MIG-005 |

**Preconditions**
- Migration mapping, validation rules and rollback plan are approved.

**Main flow**
1. Prepare source data and mapping.
2. Validate mandatory fields, identifiers and formats.
3. Load records into staging.
4. Run duplicate detection against existing REDNOXX records.
5. Review exceptions and conflicts.
6. Approve migration batch.
7. Import into production/target environment with legacy identifiers preserved.
8. Produce migration audit report.

**Alternate paths and exceptions**
- Reject rows that fail critical validation.
- If source record matches existing patient, bind or queue for review rather than create duplicate.

**Data captured or updated**
- Source system, legacy MRN, import batch, field mappings, exceptions, decisions, audit.

**Controls, privacy and audit**
- Staging validation; duplicate checks; sample verification; rollback plan; audit.

**Integration, Nigeria Core and DHIN mapping**
- Patient index, document indexing, legacy MRN search, reports.

**Acceptance criteria**
- Imported records are traceable to source.
- Legacy MRNs are searchable.
- Exceptions and duplicates are documented.

---

### W-HIM-040: Audit review and HIM reporting

| Field | Value |
|---|---|
| Category | Audit / Reporting |
| Primary actor | Auditor / Compliance Reviewer |
| Supporting actors | HIM Supervisor, DPO, Facility Administrator |
| Trigger | Scheduled audit, incident investigation, privacy review, management report or release readiness assessment. |
| Goal / output | Review HIM actions and generate reports without exposing unnecessary patient data. |
| Linked requirement IDs | NFR-HIM-AUD-001 through NFR-HIM-AUD-010 |

**Preconditions**
- User has audit/reporting permission.
- Audit retention and report definitions are configured.

**Main flow**
1. Select audit/report type and date range.
2. Apply filters by actor, patient, action, module, department, exception or event type.
3. System returns role-appropriate records.
4. Reviewer investigates anomalies and records findings where supported.
5. Export report only if permitted and audited.

**Alternate paths and exceptions**
- If report includes sensitive fields, require elevated permission or masking.
- If audit gaps are detected, create compliance issue.

**Data captured or updated**
- Audit events, filters, report outputs, export logs, review notes.

**Controls, privacy and audit**
- Read-only access; masking; export permission; audit of auditor actions.

**Integration, Nigeria Core and DHIN mapping**
- AuditEvent/provenance, dashboards, compliance evidence pack.

**Acceptance criteria**
- Audit report can show registration, update, merge, release and restricted access events.
- Exports are controlled and logged.

---

### W-HIM-041: Data subject access or rectification request

| Field | Value |
|---|---|
| Category | Privacy / Data Rights |
| Primary actor | Data Protection Officer |
| Supporting actors | HIM Officer, Patient, HIM Supervisor, Legal/Compliance |
| Trigger | Patient requests access, correction, restriction, portability, objection, erasure/forgetting assessment or other data-subject right. |
| Goal / output | Process patient data-rights requests consistently with NDPA obligations and health-record retention rules. |
| Linked requirement IDs | NFR-HIM-PRI-001 through NFR-HIM-PRI-010 |

**Preconditions**
- Requester identity is verified.
- DPO workflow is configured.

**Main flow**
1. Create data-subject request record.
2. Verify requester identity and authority.
3. Classify request type: access, rectification, restriction, portability, objection, erasure/retention assessment.
4. Assess scope, legal basis and medical-record retention constraints.
5. Coordinate HIM action: export, correction, restriction, response or rejection with reason.
6. Record outcome, response date and audit.

**Alternate paths and exceptions**
- If request conflicts with health-record retention/legal obligation, explain refusal/limitation and log reason.
- If correction affects identity fields, use demographic correction/duplicate checks.

**Data captured or updated**
- Request type, requester, authority, scope, decision, response, due date, evidence.

**Controls, privacy and audit**
- Identity verification; DPO oversight; retention/legal basis check; audit; minimum disclosure.

**Integration, Nigeria Core and DHIN mapping**
- Record release, demographic correction, restriction flags, audit reports.

**Acceptance criteria**
- Request is tracked from receipt to closure.
- Outcome and rationale are auditable.
- Correction/restriction actions update HIM record correctly.

---

### W-HIM-042: Archive, inactivate or reactivate patient record

| Field | Value |
|---|---|
| Category | Record Lifecycle |
| Primary actor | HIM Supervisor |
| Supporting actors | HIM Officer, Auditor, Clinician, DPO |
| Trigger | Patient record needs lifecycle status change due to inactivity, created-in-error, archival, restoration or policy review. |
| Goal / output | Control record lifecycle without hard deletion and without losing history. |
| Linked requirement IDs | FR-HIM-GEN-004, FR-HIM-GEN-005, FR-HIM-GEN-006, FR-HIM-GEN-009, FR-HIM-GEN-010 |

**Preconditions**
- User has status-change permission.
- Status transition rules are configured.

**Main flow**
1. Open patient record and review current status, encounters, billing/claims and documents.
2. Select status action: inactive, archived, created in error, reactivate or restore.
3. Enter reason and supporting evidence.
4. System validates permitted transition.
5. Apply status and update patient banner/search behaviour.
6. Audit status change.

**Alternate paths and exceptions**
- If active clinical/billing events exist, block or require supervisor/clinical review.
- If created-in-error duplicate exists, use merge/correction workflows where appropriate.

**Data captured or updated**
- Old status, new status, reason, approver, effective date, restrictions.

**Controls, privacy and audit**
- No hard deletion; transition rules; approval; audit; downstream warning.

**Integration, Nigeria Core and DHIN mapping**
- Search, patient banner, downstream modules, retention reports.

**Acceptance criteria**
- Record status changes safely and visibly.
- History remains intact.
- Status change is auditable.

---

### W-HIM-043: Controlled REDNOXX support access

| Field | Value |
|---|---|
| Category | Support / Security |
| Primary actor | REDNOXX Support User |
| Supporting actors | Facility Administrator, Security Admin, DPO, Auditor |
| Trigger | Support team needs access to investigate defect, configuration issue or incident. |
| Goal / output | Permit support only with approval, least privilege, time limit and audit. |
| Linked requirement IDs | NFR-HIM-SEC-001 through NFR-HIM-SEC-007 |

**Preconditions**
- Support case exists.
- Facility approval is obtained where required.

**Main flow**
1. Create support access request linked to ticket.
2. Specify purpose, scope, environment, duration and data access level.
3. Facility/security approver grants time-bound role.
4. Support performs task with patient data masked where feasible.
5. System logs all support actions.
6. Access expires automatically and is reviewed.

**Alternate paths and exceptions**
- If identifiable patient data is not required, use synthetic/de-identified environment.
- If emergency production support is needed, require post-event approval review.

**Data captured or updated**
- Ticket ID, approver, access scope, start/end, actions performed, review status.

**Controls, privacy and audit**
- Least privilege; time-bound access; masking; audit; approval; expiry.

**Integration, Nigeria Core and DHIN mapping**
- IAM/RBAC, audit, support ticketing, privacy logs.

**Acceptance criteria**
- Support cannot access patient data by default.
- All granted access is time-limited and auditable.
- Access removal is automatic or verified.

---

### W-HIM-044: HIM configuration change

| Field | Value |
|---|---|
| Category | Configuration / Governance |
| Primary actor | Facility Administrator |
| Supporting actors | HIM Supervisor, Product Owner, QA, Security Admin |
| Trigger | Facility needs to change MRN format, forms, mandatory fields, document types, patient categories, queues or matching rules. |
| Goal / output | Change configuration safely with review, testing and audit. |
| Linked requirement IDs | FR-HIM-CFG-001 through FR-HIM-CFG-010 |

**Preconditions**
- User has configuration permission.
- Change request and approval policy exists.

**Main flow**
1. Create configuration change request.
2. Specify affected configuration and rationale.
3. Assess safety, privacy, interoperability and reporting impact.
4. Test change in non-production where required.
5. Approve and apply change.
6. Audit change and notify affected users.
7. Monitor post-change errors.

**Alternate paths and exceptions**
- If change disables safety-critical field/control, require product/clinical governance approval or reject.
- If MRN pattern changes, ensure existing MRNs are not retroactively altered.

**Data captured or updated**
- Config item, old value, new value, requester, approver, test evidence, effective date.

**Controls, privacy and audit**
- Change control; approval; test evidence; audit; safety gates.

**Integration, Nigeria Core and DHIN mapping**
- MRN service, forms, queues, document taxonomy, duplicate rules.

**Acceptance criteria**
- Change is approved, tested and auditable.
- Safety-critical controls are not bypassed.
- Affected users know the new configuration.

---

### W-HIM-045: FHIR / DHIN payload generation and validation

| Field | Value |
|---|---|
| Category | Interoperability |
| Primary actor | Integration/FHIR Service |
| Supporting actors | Enterprise Architect, HIM Officer, QA, DPO, Security Admin |
| Trigger | Approved integration, sandbox test, connectathon, reporting or exchange requires FHIR/DHIN-compatible payload. |
| Goal / output | Generate validated FHIR payloads from REDNOXX canonical data without compromising privacy or overstating conformance. |
| Linked requirement IDs | NFR-HIM-INT-001 through NFR-HIM-INT-010 |

**Preconditions**
- Integration is approved.
- Mapping register exists.
- Security scope and data-sharing basis are defined.

**Main flow**
1. Select workflow payload type: NgPatient, NgRelatedPerson, NgEncounter, NgConsent, NgProvenance, NgCoverage, NgClaim, NgInvoice, NgServiceRequest or bundle.
2. Extract required REDNOXX canonical data.
3. Apply mapping, value-set translation and identifier namespaces.
4. Apply privacy filtering, organisation scoping and masking/pseudonymisation.
5. Validate payload against applicable Nigeria Core/DHIN profile using FHIR validator.
6. Store validation result and exchange/audit log.
7. Transmit only through approved authenticated channel.

**Alternate paths and exceptions**
- If validation fails, reject payload and create remediation task.
- If mapping gap exists, log gap and do not claim conformance.
- If requestor scope is insufficient, deny export.

**Data captured or updated**
- FHIR resource type, mapping version, payload ID, validation result, recipient/requestor, export log.

**Controls, privacy and audit**
- OAuth2/SMART-ready access; RBAC scopes; organisation scoping; minimisation; validation before commit; audit.

**Integration, Nigeria Core and DHIN mapping**
- Nigeria Core, DHIN IG, FHIR server/sandbox, claims/referral/immunization/device tracks.

**Acceptance criteria**
- Payload validates or documented warnings are reviewed.
- Exchange is authenticated/scoped.
- Conformance claim is evidence-based and not overstated.

---

## 7. Workflow-to-Standards Traceability

| Workflow group | Workflow IDs | NDHI/NDHA/Nigeria Core | DHIN IG | NDPC/privacy | NITDA/SON/ISO evidence |
|---|---|---|---|---|---|
| Registration and patient identity | W-HIM-001 to W-HIM-008 | Patient record from first point of care; Patient profile readiness | NgPatient identifier/demographic mapping | Minimum necessary data; access control | Requirements and test cases for registration |
| Emergency/unknown/mass casualty | W-HIM-009 to W-HIM-011 | Encounter and Patient readiness with temporary identity | NgPatient temporary-to-permanent profile handling | Emergency exception with audit | Resilience and safety tests |
| Neonate/minor/deceased | W-HIM-012 to W-HIM-014 | Patient, RelatedPerson, deceased status | NgPatient, NgRelatedPerson, MNCH/immunisation readiness | Guardian/authority and release restrictions | Clinical safety and policy tests |
| Updates, identifiers and completeness | W-HIM-015 to W-HIM-018 | Patient profile updates, provenance | NgProvenance, identifier slices | Rectification and minimisation | Audit and regression evidence |
| Duplicates and merge/unmerge | W-HIM-019 to W-HIM-022 | MPI/client registry readiness | Identifier namespace, Provenance/AuditEvent | Wrong-patient risk controls | Safety and data-integrity tests |
| Search, restricted access and documents | W-HIM-023 to W-HIM-027 | Patient search, DocumentReference readiness | NgPatient, DocumentReference-style mapping | RBAC, break-glass, masking | Access-control and audit evidence |
| Release, consent and claims | W-HIM-028 to W-HIM-034 | Consent, coverage, claim, referral readiness | NgConsent, NgCoverage, NgClaim, NgInvoice, NgServiceRequest | Rights, disclosure, authority verification | Privacy and release testing |
| Queue, encounter, downtime, migration | W-HIM-035 to W-HIM-039 | Encounter and operational workflow readiness | NgEncounter and bundle support | Audit and minimisation | Resilience, migration and rollback evidence |
| Audit, data rights, support, configuration, FHIR | W-HIM-040 to W-HIM-045 | Conformance, sandbox and API readiness | Validated DHIN payloads and security controls | Data subject rights and support-access governance | Testing, change control and evidence pack |

## 8. Workflow Acceptance and Testing Rules

Each workflow is not accepted until the following evidence exists.

- At least one positive-path test case and one exception-path test case are executed.
- Role-permission tests confirm that unauthorised actors cannot complete restricted actions.
- Audit-log checks confirm the required events are captured.
- Duplicate/wrong-patient risk scenarios are tested where patient identity is involved.
- Privacy and masking tests are executed for NIN, identifiers, restricted records, third-party release and exports.
- Downstream integration handoff is tested for queue, appointment, encounter, billing, claims or FHIR where applicable.
- UAT sign-off is obtained from HIM or operational subject-matter experts for each workflow group.

| Test pack | Workflow IDs | Minimum scenarios | Evidence artefact | Owner |
|---|---|---|---|---|
| Registration UAT | W-HIM-001 to 008 | New, returning, walk-in, appointment, NIN/no-NIN, foreign, alternative ID | Executed UAT script and screenshots | BA / HIM Lead |
| Emergency UAT | W-HIM-009 to 011 | Emergency temporary, unknown, mass casualty, reconciliation trigger | Executed emergency workflow script | A&E SME / QA |
| Identity/MPI UAT | W-HIM-015 to 022 | Update, identifier verification, duplicate warning, queue, merge, unmerge | Merge audit evidence and test data | HIM Supervisor / QA |
| Records and release UAT | W-HIM-025 to 032 | Upload, index, correction, patient release, third-party release, consent withdrawal | Release register and audit logs | HIM Lead / DPO |
| Interoperability UAT | W-HIM-033 to 045 | Referral, claims, FHIR payload validation, support access, config change | Validator output and traceability register | Architect / QA |

## 9. Open Issues and Assumptions

- Production access to national registries, HIE/SHR, NHCR, NHFR, NHWR or HCX is not assumed for V1 unless REDNOXX completes the relevant onboarding and conformance process.
- DHIN IG is a practical/draft connectathon implementation guide and should be used as a sandbox/testing reference unless a formal authority recognises a production conformance pathway.
- Facility policies must define mandatory fields, release-of-information rules, data-retention periods, consent templates, emergency exceptions and guardian authority handling.
- Biometric enrolment/verification and AI-based probabilistic matching are excluded unless separately approved and governed.
- Final FHIR field mappings must be maintained in a living mapping register because Nigeria Core and DHIN profiles may evolve.

## 10. Change Control

- Any workflow change must update this catalogue, user stories, requirements, test cases, training materials and SOPs as applicable.
- Changes affecting patient identity, duplicate matching, merge/unmerge, restricted records, consent, record release, exports or FHIR mappings require HIM, privacy, security and architecture review.
- Configuration changes must not disable safety-critical controls without formal approval and test evidence.

## 11. Reference Resources

| Ref | Resource | URL |
|---|---|---|
| R1 | NDHI RFI: National Electronic Health Records | https://www.digitalhealth.gov.ng/ndhi-rfi |
| R2 | Nigeria Core FHIR Implementation Guide | https://build.fhir.org/ig/digitalhealth-gov-ng/Nigeria-Core/branches/main/ |
| R3 | DHIN 2025 Connectathon FHIR Implementation Guide | https://build.fhir.org/ig/Nigeria-FHIR-Community/2025Connectathon/index.html |
| R4 | DHIN Privacy and Security guidance | https://build.fhir.org/ig/Nigeria-FHIR-Community/2025Connectathon/privacy-security.html |
| R5 | Nigeria Data Protection Commission | https://ndpc.gov.ng/ |
| R6 | NITDA National Software Development Guideline | https://nitda.gov.ng/?download_id=9427&sdm_process_download=1 |
| R7 | NITDA National Software Testing Guideline | https://nitda.gov.ng/wp-content/uploads/2026/04/National-Software-Testing-Guideline.pdf |
| R8 | Standards Organisation of Nigeria — Standards | https://son.gov.ng/standards/ |
| R9 | ISO/TC 215 Health Informatics | https://www.iso.org/committee/54960.html |
| R10 | DHIN National Standards list | https://www.dhin-hie.org/standards/national-standards |

---

*Confidential draft for REDNOXX SRS development — generated 4 July 2026*
