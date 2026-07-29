# REDNOXX EHR V1 — Health Information Management (HIM) / Medical Records Module
## Software Requirements Specification

*Updated detailed SRS with individual workflow mapping, NDHI/NDHA, Nigeria Core FHIR, DHIN FHIR IG, NDPC, NITDA and SON/ISO-TC 215 alignment*

| Document field | Value |
|---|---|
| Document ID | REDNOXX-HIM-SRS-V0.2 |
| Status | Draft for product, architecture, HIM, privacy, security and QA review |
| Prepared for | REDNOXX EHR V1 product development |
| Primary context | Nigerian tertiary hospitals and complex secondary facilities |
| Prepared date | 2026-07-04 |
| Prepared by | ChatGPT assisted drafting based on uploaded REDNOXX materials and verified public references |
| Important disclaimer | This document supports readiness and traceability. It does not assert formal NDHI, NDHA, DHIN, SON, NITDA or NDPC certification unless those authorities complete the relevant validation/onboarding/certification process. |

---

## Table of Contents

0. [Document control and source basis](#0-document-control-and-source-basis)
1. [Introduction](#1-introduction)
2. [Product context and scope](#2-product-context-and-scope)
3. [Standards, regulatory and interoperability alignment](#3-standards-regulatory-and-interoperability-alignment)
4. [Stakeholders and user classes](#4-stakeholders-and-user-classes)
5. [Operating environment and constraints](#5-operating-environment-and-constraints)
6. [Overall module description](#6-overall-him-module-description)
7. [Data model and master data](#7-data-model-and-master-data)
8. [Patient identity, MRN and MPI requirements](#8-patient-identity-mrn-and-mpi-requirements)
9. [Workflow catalogue and individual workflow maps](#9-workflow-catalogue-and-individual-workflow-maps)
10. [Functional requirements catalogue](#10-functional-requirements-catalogue)
11. [Non-functional requirements](#11-non-functional-requirements)
12. [Security, privacy, audit and consent requirements](#12-security-privacy-audit-and-consent-requirements)
13. [Integration and FHIR mapping](#13-integration-and-fhir-mapping)
14. [Configuration requirements](#14-configuration-requirements)
15. [Reporting and dashboards](#15-reporting-and-dashboards)
16. [Migration and legacy records](#16-migration-and-legacy-records)
17. [Testing and acceptance strategy](#17-testing-and-acceptance-strategy)
18. [Traceability matrices](#18-traceability-matrices)
19. [Open issues, risks and assumptions](#19-open-issues-risks-and-assumptions)
20. [References and appendices](#20-references)

---

## 0. Document Control and Source Basis

### 0.1 Purpose of this document

This SRS defines the functional, non-functional, workflow, data, security, privacy, audit, configuration, reporting, integration and acceptance requirements for the REDNOXX EHR V1 HIM / Medical Records Module. It is intended to be used by product, business analysis, architecture, engineering, QA, HIM, privacy, security and implementation teams as the controlled product baseline for HIM delivery.

### 0.2 Source basis

| Source class | Specific source used | How it is applied |
|---|---|---|
| Uploaded REDNOXX delivery material | REDNOXX Agile Delivery Plan and REDNOXX HIMS/EHR V1 Agile Project Plan PM | Product scope, delivery governance, module boundaries, HIM placement, V1/deferred scope, assurance controls and sprint-readiness principles. |
| Uploaded compliance material | SON standards list, NDHA/NDHI architecture PDFs, NDPA/NDPC documents, Ne-GIF, NGEA, NITDA and related files | Compliance register, standards applicability, privacy/security controls, public-sector readiness and documentation evidence. |
| Verified public references | NDHI, Nigeria Core, DHIN IG, NDPC, NITDA, ISO/TC 215 and DHIN standards pages listed in references | Validation of current public requirements and external alignment. |

### 0.3 Document conventions

| Term | Meaning |
|---|---|
| Shall | Mandatory requirement for REDNOXX HIM V1 unless formally deferred. |
| Should | Recommended requirement; may be deferred with documented approval. |
| May | Optional or configurable capability. |
| Must not | Prohibited behaviour. |
| Future-ready | Data model/API/traceability is prepared, but production connection/certification is not claimed. |
| Canonical internal model | REDNOXX-owned stable model from which Nigeria Core, DHIN IG and future NDHA mappings may be produced. |

---

## 1. Introduction

### 1.1 Purpose

The HIM Module is the foundational patient identity and medical-record governance module in REDNOXX EHR V1. It creates and maintains the patient record, MRN, demographic profile, identifier set, next-of-kin/guardian structures, record status, duplicate/MPI worklists, document index, record release register and audit trail required by clinical, operational, billing, claims, reporting and interoperability workflows.

### 1.2 Intended readers

| Reader | Primary use |
|---|---|
| Product Owner | Approve scope, priorities, acceptance and deferred items. |
| HIM/Medical Records Lead | Validate record custody, registration, indexing, release and merge workflows. |
| Enterprise Architect | Validate module boundaries, data model, APIs and NDHA/Nigeria Core/DHIN mapping. |
| Engineering Team | Implement functional, non-functional and integration requirements. |
| QA/UAT Team | Develop test cases, regression pack, UAT scripts and evidence. |
| Security/DPO/Compliance | Validate NDPA, security, audit, release, consent and access controls. |
| Implementation Team | Configure the module for facility-specific workflows without unsafe code changes. |

### 1.3 Scope statement

- The module covers patient registration, patient search, demographic management, identifiers, MRN, MPI readiness, duplicate detection, merge/unmerge, record status lifecycle, document upload/indexing, release of information, restricted records, consent metadata, audit and reporting.
- The module provides patient context to appointments, queues, OPD, A&E, inpatient, diagnostics, pharmacy, billing, claims and reporting modules.
- The module is not a patient portal, national registry, HIE or full enterprise content management system, although its data model must support future integration and exchange.

---

## 2. Product Context and Scope

### 2.1 REDNOXX context

REDNOXX EHR V1 is a reusable enterprise EHR/HIMS product baseline for Nigerian tertiary-hospital environments. The uploaded REDNOXX plan positions the product as a unified platform across patient registration, medical records, outpatient, emergency, inpatient, diagnostics, pharmacy, insurance, claims, billing, payments, dashboards and reporting, with configuration preferred over one-off hospital customisation.

| Design principle | Implication for HIM |
|---|---|
| One patient, one trusted record | HIM shall prevent avoidable duplicates, support merge governance and preserve longitudinal context. |
| Interoperability by design | HIM shall use structured internal data and mapping registers for Nigeria Core and DHIN IG. |
| Privacy by design | HIM shall enforce least privilege, masking, disclosure controls and audit. |
| Tertiary-care readiness | HIM shall support A&E, mass casualty, neonates, minors, insurance, referrals, wards, clinics and high-volume queues. |
| Configuration-first | Forms, roles, MRN patterns, document types, release templates and duplicate thresholds shall be configurable. |

### 2.2 In scope

- Permanent and temporary patient registration.
- MRN generation and identifier management.
- Patient search and returning-patient verification.
- MPI readiness and duplicate management.
- Merge/unmerge with preservation of history.
- Demographic, next-of-kin, guardian and related-person management.
- Medical-record document upload/indexing and release.
- Consent/disclosure metadata, privacy controls and audit.
- FHIR/DHIN/Nigeria Core mapping readiness.
- HIM reporting and dashboards.

### 2.3 Out of scope for V1 unless separately approved

- Production integration with NHCR, NHFR, NHWR, national HIE/SHR or HCX unless official onboarding is completed.
- Biometric enrolment/verification.
- Patient portal or PHR application.
- AI/ML identity matching beyond controlled rule-based matching.
- Full enterprise document-management replacement outside medical-record scope.
- Formal certification claims without authority-issued evidence.

---

## 3. Standards, Regulatory and Interoperability Alignment

The SRS aligns REDNOXX HIM with national digital health direction while avoiding unsupported certification claims. Nigeria Core is treated as the national interoperability floor; DHIN IG is treated as a practical connectathon/sandbox implementation reference; REDNOXX internal canonical model remains the product-owned source model.

| Alignment area | External expectation | REDNOXX HIM design response |
|---|---|---|
| NDHI EHR RFI | Vendors must demonstrate capability claimed and support modern EHR functions. | Every HIM workflow has acceptance criteria, tests and evidence expectations. |
| NDHA | Interoperable ecosystem with shared health record, registries, FHIR R4, terminology, consent and claims exchange readiness. | Patient identity, facility/user references, consent, audit, claims and FHIR-ready mapping are built into the HIM model. |
| Nigeria Core FHIR IG | National foundation for FHIR profiles, identifiers, terminology, REST interactions and implementation expectations. | HIM maintains mapping to Patient, Person, RelatedPerson, Encounter, Appointment, DocumentReference, Consent, Provenance, AuditEvent and related resources. |
| DHIN FHIR IG | FHIR R4 IG for connectathon tracks: claims, ePharmacy, MNCH referral, immunisation, device data, registries, consent/pseudonymisation and privacy. | HIM maps patient, identifiers, address, guardian, consent, provenance, coverage, claim and referral fields to DHIN profiles where applicable. |
| NDPA/NDPC | Data subject rights, lawful processing, accountability, transparency and responsible data handling. | HIM includes access control, masking, audit, release workflow, correction workflow, DSAR support and privacy evidence. |
| NITDA software guidelines | Secure, reliable, interoperable software and risk-based testing for Nigerian government systems. | HIM release requires requirements, design, test plan, evidence, deployment documentation and defect controls. |
| SON/ISO-TC 215 | Health informatics standards for EHR architecture, audit, consent, safety, security, pseudonymisation and terminology. | Applicability register and requirements traceability are required for relevant standards. |

### 3.1 Compliance stance

- REDNOXX shall maintain readiness evidence but shall not claim formal NDHI/NDHA/DHIN/SON/NITDA certification or production interoperability unless the applicable authority validates or certifies it.
- The system shall maintain a standards applicability matrix with status values: Supported, Partially Supported, Deferred, Not Applicable and Requires External Authority.
- Every standards-derived requirement shall trace to workflow, functional requirement, test case and evidence artefact.

---

## 4. Stakeholders and User Classes

| User class | Core permissions | Key restrictions | Primary safety/privacy risk |
|---|---|---|---|
| Front Desk Officer | Search, register, verify, update permitted fields, check-in, queue routing | No merge, unmerge, record release approval or restricted document access | Duplicate creation or wrong-patient selection |
| HIM Officer | Record update, document upload/indexing, incomplete record worklist, release processing | No final merge/unmerge unless supervisor role | Misfiled documents and unauthorised updates |
| HIM Supervisor | Duplicate decisions, merge/unmerge approval, sensitive updates, release approval, audit review | Cannot bypass audit or hard-delete formal records | Incorrect merge or disclosure |
| Emergency Registration User | Temporary emergency registration and A&E routing | No final merge; limited identity update | Incomplete identity and later duplicate risk |
| Clinician | Patient search/read, banner, authorised document view, encounter context | Cannot modify core identity unless permitted | Wrong-patient clinical action |
| Billing/Claims User | Payer details, coverage identifiers, claims evidence request | Cannot alter core identity without HIM permission | Wrong billing/claims and excessive disclosure |
| Auditor/DPO | Read-only audit, access, release and privacy evidence review | No patient record modification | Excessive exposure during audit |
| Facility Admin | Configuration of roles, departments, forms, MRN, document types | Admin role does not automatically grant patient data access | Unsafe configuration |
| REDNOXX Support | Time-bound technical support by approval | No default identifiable patient data access | Privileged support misuse |

---

## 5. Operating Environment and Constraints

| Environment factor | Requirement |
|---|---|
| Facilities | Tertiary and complex secondary hospitals with multiple departments, clinics, A&E, wards, diagnostics, pharmacy, billing and medical-record offices. |
| Deployment | Cloud, on-premise or hybrid deployment subject to implementation architecture and security approvals. |
| Devices | Modern browsers on desktops/laptops; optional tablets; scanner, printer, barcode/QR and card-printer readiness. |
| Connectivity | Normal online workflows plus approved degraded/offline/paper fallback and reconciliation. |
| Shared workstations | Session timeout, user identity display, MFA baseline, logout, audit and re-authentication for sensitive actions. |
| Paper coexistence | Legacy paper scanning, document indexing and migration worklists supported. |
| Data reality | Patients may lack NIN, phone, formal address, exact DOB or full name at emergency arrival. |

---

## 6. Overall HIM Module Description

| Capability | Description |
|---|---|
| Patient registration | New, returning, emergency, unknown, mass casualty, neonate, minor, foreign and deceased-on-arrival workflows. |
| Patient search | Exact, partial and fuzzy search with role-aware masking and status warnings. |
| Identifiers/MRN | MRN, legacy MRN, NIN/national ID, alternative ID, insurance number, phone-as-identifier, pseudonym and future CR ID readiness. |
| MPI/duplicate management | Candidate detection, review queue, decisioning, merge, unmerge and historical preservation. |
| Medical records | Document capture, indexing, classification, status/versioning, release and disclosure. |
| Privacy/security | RBAC, restricted records, break-glass, consent metadata, audit, export controls and support-access controls. |
| Interoperability | Nigeria Core and DHIN FHIR mapping registers; future API and payload validation readiness. |
| Reporting | HIM KPIs, record quality, duplicate worklist, release register, audit and operational dashboards. |

---

## 7. Data Model and Master Data

| Entity | Key attributes | FHIR/DHIN mapping |
|---|---|---|
| Patient | Internal ID, MRN namespace, names, DOB/age, sex, deceased status, record status, category | Patient / NgPatient |
| Identifier | Type, system, value, issuer, verification status, active status, start/end, source | Patient.identifier slices |
| RelatedPerson | Name, relationship, phone, address, authority status, guardian flag | RelatedPerson / NgRelatedPerson; Patient.contact |
| Address | Line, city/town, state, LGA, ward/community, country | Patient.address.state/district; administrative ward extension |
| Encounter link | Visit number, appointment/queue link, service point, payer category | Encounter / NgEncounter |
| Document | File metadata, type, status, version, source, encounter, confidentiality, retention | DocumentReference; Provenance |
| Consent | Status, category, scope, patient, representative, date, source, withdrawal | Consent / NgConsent |
| Release request | Requester, authority, purpose, scope, approval, package, method, fee link | Consent/Provenance/AuditEvent, DocumentReference/Bundle as needed |
| Duplicate candidate | Records compared, score, matching fields, decision, reviewer, reason | MPI internal; AuditEvent/Provenance for actions |
| Audit event | Actor, patient, action, timestamp, old/new value, reason, device/IP, outcome | AuditEvent / NgProvenance |

> See also `HIM_ERD.md` for the full entity-relationship diagram of this data model.

---

## 8. Patient Identity, MRN and MPI Requirements

HIM shall separate local MRN, internal technical ID, national/alternative identifiers, insurance identifiers, temporary identifiers and pseudonyms. Identifier namespaces are mandatory to prevent mixing different identifier systems.

| Identifier | Mandatory? | Notes | DHIN/Nigeria Core readiness |
|---|---|---|---|
| Internal patient ID | Yes | Technical, non-reusable, not user-facing by default | Resource logical/internal ID |
| MRN | Yes for permanent records | Unique within MRN namespace; configurable pattern | NgPatient.identifier:MedicalRecordsNumber |
| NIN / National ID | Optional/configurable | Lawful capture, masked display, duplicate support; not emergency blocker | NgPatient.identifier:NationalIDNo |
| Birth certificate no. | Optional | Useful for neonates/children | NgPatient.identifier:BirthCertificateNo |
| Phone number | Optional/supporting | Can support matching but is not unique proof | NgPatient.identifier:PhoneNumber and/or telecom |
| Insurance number | Conditional | Required where payer/coverage applies | NgPatient.identifier:InsuranceNumber; NgCoverage |
| Pseudonym | Conditional | Required for approved de-identified or privacy-preserving exchange | NgPatient.identifier:Pseudonym |
| Temporary emergency ID | Conditional | Required for emergency/unknown/degraded registration | Local identifier; later reconciled |
| Legacy MRN | Conditional | Migration and scanned record indexing | Additional identifier with old/use metadata |

---

## 9. Workflow Catalogue and Individual Workflow Maps

Each workflow below is independently testable. Workflow maps are written in a compact SRS format: trigger, actor, goal/output, mapping, key controls and acceptance criteria. Detailed UI wireframes and SOPs should be produced separately during design.

### 9.0 Workflow catalogue (summary table)

| ID | Workflow | Primary actor | Trigger | Output | Data elements | FHIR/DHIN alignment | Critical controls |
|---|---|---|---|---|---|---|---|
| W-HIM-001 | Standard new patient registration | Front Desk Officer | Patient presents for first visit with adequate demographics | Create permanent patient record, MRN, patient banner and audit trail | Patient, MRN, identifiers, demographics, RelatedPerson if captured, Encounter/Appointment link if applicable | NgPatient; Patient.identifier:MedicalRecordsNumber; NgProvenance | Search-before-create; mandatory fields; duplicate warning; MRN collision prevention |
| W-HIM-002 | Registration with NIN / National ID | Front Desk Officer / HIM Officer | Patient provides NIN or approved national identifier | Link patient profile to national ID identifier where lawfully captured | Patient.identifier with verification status | NgPatient.identifier:NationalIDNo | NIN optional except where facility policy requires; masked display by role; duplicate check |
| W-HIM-003 | Registration without NIN | Front Desk Officer | Patient has no NIN, cannot recall it, is minor/foreign, or urgent care cannot wait | Register safely using MRN and alternative matching attributes | Patient record with NIN-unavailable reason where configured | NgPatient without NationalIDNo; local MRN identifier | NIN must not block urgent or standard care where policy permits alternatives |
| W-HIM-004 | Alternative ID registration | Front Desk Officer / HIM Officer | Patient presents passport, voter card, driver licence, birth certificate, staff ID or other configured ID | Capture alternative identifier and use for matching | Identifier type/value/issuer/expiry/verification | NgPatient.identifier; BirthCertificateNo where applicable | Identifier namespace must be explicit; phone is not sole identity proof |
| W-HIM-005 | Foreign patient registration | Front Desk Officer | Patient is non-Nigerian or has foreign identity document | Create record with passport/foreign ID and local contact | Patient, address, nationality, passport/foreign ID, payer | NgPatient plus local extensions/mappings if supported | NIN not required; document validity and emergency contact captured |
| W-HIM-006 | Returning patient verification | Front Desk Officer / HIM Officer | Patient claims prior registration or appointment exists | Retrieve and verify existing record, avoid duplicate creation | Verified patient context, updated demographics if needed | Patient read/search; NgProvenance for updates | Match by MRN/name/phone/DOB/ID; warning for deceased/restricted/merged/temporary |
| W-HIM-007 | Appointment-linked check-in | Front Desk Officer | Patient arrives for scheduled appointment | Verify identity, check in appointment and route to queue/service | Patient, Appointment, Encounter or QueueEvent | NgAppointment; NgEncounter | Appointment patient must be confirmed before check-in |
| W-HIM-008 | Walk-in registration and routing | Front Desk Officer | Patient arrives without appointment | Register/verify, select service, create queue or billing handoff | Patient, Encounter/QueueEvent, patient category | NgPatient; NgEncounter; NgAppointment if created | Clinic/service selection required; billing category captured |
| W-HIM-009 | Emergency temporary registration | Emergency Registration User | Urgent patient requires care before full identity is known | Create temporary patient identity and route to A&E/triage | Temporary ID, emergency record, reconciliation task | NgPatient-ready after reconciliation; NgEncounter | Reduced mandatory fields; audit; reconciliation worklist mandatory |
| W-HIM-010 | Unknown or unconscious patient | Emergency Registration User | Name or identity unavailable | Create safe unknown-patient record with placeholder naming | Temporary patient, distinguishing notes, estimated age/sex | Temporary local identifier; later NgPatient conversion | Must not delay care; later duplicate search/identity confirmation required |
| W-HIM-011 | Mass casualty rapid registration | Emergency Registration User / HIM Supervisor | Multiple emergency patients arrive together | Rapidly create sequential temporary identities and later reconcile | Temporary patient batch, casualty event tag, reconciliation report | NgPatient after reconciliation; NgEncounter | Temporary IDs must be unique and printable/label-ready |
| W-HIM-012 | Neonate registration and mother-baby linkage | HIM Officer / Maternity Clerk | Baby is born or presents before legal name is confirmed | Create neonate record linked to mother/guardian and birth event | Baby patient, mother link, birth order, birth certificate if available | NgPatient; NgRelatedPerson; BirthCertificateNo | Supports baby-of naming, multiple births, later legal-name update |
| W-HIM-013 | Minor registration with guardian | Front Desk Officer / HIM Officer | Patient below age threshold or requires guardian | Capture guardian/contact and consent/authority metadata | Patient, guardian, relationship, guardian ID if required | NgPatient.contact; NgRelatedPerson; NgConsent | Next of kin is not automatically legal consent authority |
| W-HIM-014 | Deceased-on-arrival or deceased status | HIM Supervisor / Authorised Clinician | Patient is DOA or death status must be recorded | Mark deceased status separately from inactive/archive status | Patient.deceased flag/date, record status, death-note metadata | NgPatient.deceased[x]; NgProvenance | Routine care workflows blocked; release controlled by policy |
| W-HIM-015 | Demographic correction/update | HIM Officer / Front Desk where permitted | Demographic field is wrong, incomplete or outdated | Update patient profile with old/new values and reason | Updated demographics, audit, possible duplicate re-check | NgPatient update; NgProvenance | Key identity changes require reason and optional supervisor approval |
| W-HIM-016 | Identity document update | HIM Officer | New ID document is presented or previous ID requires correction | Add/update/deactivate identifier with namespace and verification state | Identifier version, verification status, audit | NgPatient.identifier slices | Cannot overwrite verified identifier silently; duplicate trigger |
| W-HIM-017 | NIN or high-confidence identifier verification | HIM Officer / Supervisor | Identifier requires verification or correction | Verify, mark verified/unverified, and trigger duplicate review | Identifier status, duplicate candidates, audit | NgPatient.identifier:NationalIDNo | Verification source and date captured; masked display rules apply |
| W-HIM-018 | Incomplete record completion | HIM Officer | Emergency/provisional record lacks mandatory details | Complete missing fields or formalise exception | Completeness score, data-quality status | NgPatient readiness improves | Incomplete records remain on worklist until resolved or excepted |
| W-HIM-019 | Duplicate detected before save | Front Desk Officer | Potential duplicate threshold reached during registration | Warn user, compare records, select existing or continue with reason | Duplicate decision, registration outcome | Patient search/read; AuditEvent | Override requires reason and permission; no silent duplicate creation |
| W-HIM-020 | Duplicate review queue | HIM Supervisor | System creates duplicate candidate after registration/update/migration | Review, classify and decide duplicate status | Duplicate candidate state and decision | Provenance/AuditEvent; future MPI | Outcome: duplicate, not duplicate, insufficient info, deferred |
| W-HIM-021 | Merge approved duplicate records | HIM Supervisor | Two records confirmed same person | Select survivor, resolve conflicts, merge and preserve history | Merged patient, preserved identifiers, redirected non-survivor | Patient.link/Person concept; NgProvenance | No deletion; all encounters/documents/orders/invoices/audits preserved |
| W-HIM-022 | Unmerge incorrect merge | HIM Supervisor + Admin | Merge later found unsafe/wrong | Reverse or manually separate record relationships with review | Restored records, unmerge audit, exception list | NgProvenance; AuditEvent | Requires approval; may require manual reconciliation |
| W-HIM-023 | Patient search and record retrieval | All authorised users | User needs patient context | Search, filter, select and confirm patient | Patient context, patient banner, access log | FHIR Patient search/read | Search results masked by role; restricted/deceased flags visible as authorised |
| W-HIM-024 | Restricted record and break-glass | Clinician / HIM Supervisor / Auditor | Patient or document is confidential and access is restricted | Deny, permit by role, or allow emergency break-glass with reason | Access decision, reason, alert/review task | Consent/AuditEvent; privacy controls | All access and denied attempts logged; review queue for break-glass |
| W-HIM-025 | Document upload and indexing | HIM Officer / Authorised User | Paper, consent, insurance, referral or clinical document is scanned/uploaded | Confirm patient, upload, classify, index and store metadata | DocumentReference-like metadata, file, audit | DocumentReference; NgProvenance | Virus/file validation; wrong-patient prevention; metadata required |
| W-HIM-026 | Legacy scanned record indexing | HIM Officer | Historical paper file is digitised | Scan, link to patient, tag legacy MRN and date range | Legacy document package and metadata | DocumentReference; Patient.identifier old MRN | Quality check; batch validation; no overwrite of current record |
| W-HIM-027 | Document correction/replacement/created-in-error | HIM Officer / Supervisor | Document attached to wrong patient, wrong type, corrupted or replaced | Mark created-in-error or superseded; upload corrected version | Document status/version and audit | DocumentReference.status; Provenance | No hard delete after formal record entry without governed redaction process |
| W-HIM-028 | Patient requests record release | HIM Officer / Supervisor | Patient requests copy, summary or medical report | Authenticate requester, define scope, approve, prepare and release | Release request, package, disclosure audit | NgConsent where applicable; DocumentReference/IPS | Fees/billing if configured; release scope and method recorded |
| W-HIM-029 | Guardian/third-party record release | HIM Supervisor | Guardian, next of kin, insurer, court or external provider requests record | Verify authority, approve/reject, redact if required, release | Authority evidence, release package, audit | NgConsent; Provenance/AuditEvent | Next of kin alone not sufficient legal authority; policy required |
| W-HIM-030 | Internal clinical records request | Clinician / HIM Officer | Internal care team needs historical chart/document | Request, approve if needed, retrieve and log access | Document access event | DocumentReference; AuditEvent | Restricted records require special permission or break-glass |
| W-HIM-031 | HMO/claims document request | Claims Officer / HIM Supervisor | Payer requests evidence for eligibility, pre-auth or claim | Validate coverage/request, prepare permitted evidence, release to claims | Claims evidence package | NgCoverage; NgClaim; NgInvoice; DocumentReference | Only minimum necessary documentation; release to payer audited |
| W-HIM-032 | Consent capture/update/withdrawal | HIM Officer / DPO where relevant | Consent is required for sharing, disclosure, research or communication | Capture consent terms, status, scope and withdrawal | Consent record, consent document, audit | NgConsent; ISO/TR 17975 alignment | Treatment workflows distinguished from disclosure/secondary-use consent |
| W-HIM-033 | Referral registration | Front Desk / Referral Desk | Patient arrives with referral or is referred out | Capture referring/receiving facility, service, reason and encounter link | Referral metadata, encounter/service request | NgServiceRequest; NgTask; NgEncounter | Referral source and receiving service structured for reporting/exchange |
| W-HIM-034 | Payer/insurance coverage capture | Front Desk / Billing / Claims | Patient is covered by HMO/NHIA/corporate plan | Capture coverage, payer, insurance number and eligibility status | Coverage profile, payer link, billing category | NgCoverage; CoverageEligibilityRequest/Response | Coverage separate from identity; changes audited |
| W-HIM-035 | Queue routing after registration | Front Desk Officer | Registration/verification complete | Send patient to clinic, triage, billing, lab or other service queue | Queue event, service point, timestamp | Appointment/Encounter/Task concepts | Incorrect routing can be corrected with audit; priority flag supported |
| W-HIM-036 | Encounter creation/linkage | Front Desk / Clinician / System | Patient begins service interaction | Create/link encounter to patient, appointment, queue and payer | Encounter, visit number, episode link | NgEncounter; Encounter | Every downstream clinical/financial action must link to patient and encounter where applicable |
| W-HIM-037 | Offline/degraded registration | Front Desk / Emergency User | Network/system degraded and registration must continue | Use approved fallback or local temporary capture | Downtime register or temporary patient records | Later FHIR mapping after reconciliation | No silent permanent MRN collision; reconciliation mandatory |
| W-HIM-038 | Offline sync and reconciliation | HIM Supervisor / Support | Downtime records are re-entered/synchronised | Validate, duplicate-check, resolve conflicts and audit | Permanent records, conflict log, duplicate queue | NgProvenance; AuditEvent | Conflicts cannot auto-resolve high-risk identity fields |
| W-HIM-039 | Legacy data migration and patient binding | Migration Team / HIM Supervisor | Existing patient data imported from paper/spreadsheet/old EMR | Map, cleanse, import, de-duplicate and validate | Migrated patient records, migration audit | Patient/DocumentReference; legacy MRN | Sample migration rehearsal and rollback plan required |
| W-HIM-040 | Audit review and HIM reporting | Auditor / HIM Supervisor / DPO | Periodic audit or incident investigation | Review search/view/update/merge/release/restricted access logs | Audit report, exception list, remediation tasks | AuditEvent; NgProvenance | Auditor role read-only; exports controlled and logged |
| W-HIM-041 | Data subject access or rectification request | DPO / HIM Supervisor | Patient requests access/copy/correction or restriction | Log request, validate identity, process, approve and close | Request record, action, response evidence | Consent/Provenance; privacy workflow | Aligns with NDPA rights; clinical record integrity preserved |
| W-HIM-042 | Archive/inactivate/reactivate patient record | HIM Supervisor | Record is obsolete, inactive, nullified, migrated or reactivated | Change status using policy-controlled workflow | Record status, reason, audit | Patient.active/deceased/status mapping; Provenance | No hard deletion; reactivation requires approval |
| W-HIM-043 | Controlled REDNOXX support access | Support Lead / Facility Admin | Support incident needs technical access | Approve time-bound access, mask data where feasible, log activity | Support session log, access expiry | AuditEvent | Support role not default patient-data access |
| W-HIM-044 | HIM configuration change | Facility Admin / Product Admin | MRN rule, form field, document type, role or workflow setting changes | Review, test, approve and activate configuration | Configuration version and audit | N/A; impacts mapping registers | Safety-critical fields cannot be disabled without approval |
| W-HIM-045 | FHIR/DHIN payload generation and validation | Integration Admin / QA | FHIR exchange, sandbox test or interoperability demo is required | Generate payload, validate profile, log outcome and correct gaps | Sample NgPatient/NgConsent/NgProvenance bundles and validator output | Nigeria Core; DHIN IG; FHIR R4 | No production-conformance claim without official validation/onboarding |

### 9.1 Detailed Workflow Step Patterns

| Workflow group | Reusable step pattern |
|---|---|
| Registration | Authenticate → search → classify scenario → capture data → validate → duplicate check → save/generate ID → route → audit. |
| Returning verification | Search → compare candidates → confirm identity → update permitted fields → check status warnings → route → audit. |
| Emergency identity | Rapid temporary ID → minimum data → A&E routing → reconciliation worklist → identity update → duplicate review → merge if required. |
| Duplicate review | Candidate queue → comparison view → decision/reason → merge request or dismiss → audit → report. |
| Merge/unmerge | Supervisor approval → survivor/field selection → downstream preservation → redirect/non-survivor status → audit → reversal path if needed. |
| Document management | Confirm patient → upload/scan → validate file → classify/index → store version → access controls → audit. |
| Record release | Receive request → verify requester/authority → scope/minimise → approve/reject → prepare/redact → release → audit. |
| Privacy rights | Log request → validate identity → assess lawful basis → act/deny/limit → document response → audit. |
| FHIR/DHIN validation | Map fields → generate payload → validate profile → store validator output → resolve gaps → claim only tested capability. |

### 9.2 Individual workflow specifications (W-HIM-001 to W-HIM-045)

All 45 workflows share the same specification template. Rather than repeat the identical `Preconditions`, `Main steps`, `Exception handling`, and `Audit events` rows 45 times, they are stated once below as the **common template**, followed by the workflow-specific fields (actor, trigger, output, data elements, mapping, acceptance criteria) for each workflow.

**Common to every workflow (W-HIM-001 through W-HIM-045):**

| Item | Specification |
|---|---|
| Preconditions | User authenticated; role permission granted; active facility/service configuration; applicable downtime status known. |
| Main steps | 1) Start workflow. 2) Confirm patient context or create temporary context. 3) Capture required fields/documents. 4) Validate rules and permissions. 5) Run duplicate/privacy/security checks where applicable. 6) Save/update/create output. 7) Route to downstream process or worklist. 8) Write audit/provenance event. |
| Exception handling | Handle missing data, duplicate candidate, restricted record, system/network error, unauthorised user, conflicting updates and cancellation/created-in-error according to policy. |
| Audit events | Start where material, create/update/view/release/export/merge/configuration decision, old/new value for key changes, reason/approval for high-risk actions. |
| Completion note | Workflow is demonstrable end-to-end with test data, role-based permissions, validation messages, audit event and expected output. |

**Workflow-specific fields:**

| ID | Primary actor | Trigger | Core data/output | Data elements involved | FHIR/DHIN mapping | Acceptance criteria (workflow-specific) |
|---|---|---|---|---|---|---|
| W-HIM-001 | Front Desk Officer | Patient presents for first visit with adequate demographics | Create permanent patient record, MRN, patient banner and audit trail | Patient, MRN, identifiers, demographics, RelatedPerson if captured, Encounter/Appointment link if applicable | NgPatient; Patient.identifier:MedicalRecordsNumber; NgProvenance | Search-before-create; mandatory fields; duplicate warning; MRN collision prevention. |
| W-HIM-002 | Front Desk Officer / HIM Officer | Patient provides NIN or approved national identifier | Link patient profile to national ID identifier where lawfully captured | Patient.identifier with verification status | NgPatient.identifier:NationalIDNo | NIN optional except where facility policy requires; masked display by role; duplicate check. |
| W-HIM-003 | Front Desk Officer | Patient has no NIN, cannot recall it, is minor/foreign, or urgent care cannot wait | Register safely using MRN and alternative matching attributes | Patient record with NIN-unavailable reason where configured | NgPatient without NationalIDNo; local MRN identifier | NIN must not block urgent or standard care where policy permits alternatives. |
| W-HIM-004 | Front Desk Officer / HIM Officer | Patient presents passport, voter card, driver licence, birth certificate, staff ID or other configured ID | Capture alternative identifier and use for matching | Identifier type/value/issuer/expiry/verification | NgPatient.identifier; BirthCertificateNo where applicable | Identifier namespace must be explicit; phone is not sole identity proof. |
| W-HIM-005 | Front Desk Officer | Patient is non-Nigerian or has foreign identity document | Create record with passport/foreign ID and local contact | Patient, address, nationality, passport/foreign ID, payer | NgPatient plus local extensions/mappings if supported | NIN not required; document validity and emergency contact captured. |
| W-HIM-006 | Front Desk Officer / HIM Officer | Patient claims prior registration or appointment exists | Retrieve and verify existing record, avoid duplicate creation | Verified patient context, updated demographics if needed | Patient read/search; NgProvenance for updates | Match by MRN/name/phone/DOB/ID; warning for deceased/restricted/merged/temporary. |
| W-HIM-007 | Front Desk Officer | Patient arrives for scheduled appointment | Verify identity, check in appointment and route to queue/service | Patient, Appointment, Encounter or QueueEvent | NgAppointment; NgEncounter | Appointment patient must be confirmed before check-in. |
| W-HIM-008 | Front Desk Officer | Patient arrives without appointment | Register/verify, select service, create queue or billing handoff | Patient, Encounter/QueueEvent, patient category | NgPatient; NgEncounter; NgAppointment if created | Clinic/service selection required; billing category captured. |
| W-HIM-009 | Emergency Registration User | Urgent patient requires care before full identity is known | Create temporary patient identity and route to A&E/triage | Temporary ID, emergency record, reconciliation task | NgPatient-ready after reconciliation; NgEncounter | Reduced mandatory fields; audit; reconciliation worklist mandatory. |
| W-HIM-010 | Emergency Registration User | Name or identity unavailable | Create safe unknown-patient record with placeholder naming | Temporary patient, distinguishing notes, estimated age/sex | Temporary local identifier; later NgPatient conversion | Must not delay care; later duplicate search/identity confirmation required. |
| W-HIM-011 | Emergency Registration User / HIM Supervisor | Multiple emergency patients arrive together | Rapidly create sequential temporary identities and later reconcile | Temporary patient batch, casualty event tag, reconciliation report | NgPatient after reconciliation; NgEncounter | Temporary IDs must be unique and printable/label-ready. |
| W-HIM-012 | HIM Officer / Maternity Clerk | Baby is born or presents before legal name is confirmed | Create neonate record linked to mother/guardian and birth event | Baby patient, mother link, birth order, birth certificate if available | NgPatient; NgRelatedPerson; BirthCertificateNo | Supports baby-of naming, multiple births, later legal-name update. |
| W-HIM-013 | Front Desk Officer / HIM Officer | Patient below age threshold or requires guardian | Capture guardian/contact and consent/authority metadata | Patient, guardian, relationship, guardian ID if required | NgPatient.contact; NgRelatedPerson; NgConsent | Next of kin is not automatically legal consent authority. |
| W-HIM-014 | HIM Supervisor / Authorised Clinician | Patient is DOA or death status must be recorded | Mark deceased status separately from inactive/archive status | Patient.deceased flag/date, record status, death-note metadata | NgPatient.deceased[x]; NgProvenance | Routine care workflows blocked; release controlled by policy. |
| W-HIM-015 | HIM Officer / Front Desk where permitted | Demographic field is wrong, incomplete or outdated | Update patient profile with old/new values and reason | Updated demographics, audit, possible duplicate re-check | NgPatient update; NgProvenance | Key identity changes require reason and optional supervisor approval. |
| W-HIM-016 | HIM Officer | New ID document is presented or previous ID requires correction | Add/update/deactivate identifier with namespace and verification state | Identifier version, verification status, audit | NgPatient.identifier slices | Cannot overwrite verified identifier silently; duplicate trigger. |
| W-HIM-017 | HIM Officer / Supervisor | Identifier requires verification or correction | Verify, mark verified/unverified, and trigger duplicate review | Identifier status, duplicate candidates, audit | NgPatient.identifier:NationalIDNo | Verification source and date captured; masked display rules apply. |
| W-HIM-018 | HIM Officer | Emergency/provisional record lacks mandatory details | Complete missing fields or formalise exception | Completeness score, data-quality status | NgPatient readiness improves | Incomplete records remain on worklist until resolved or excepted. |
| W-HIM-019 | Front Desk Officer | Potential duplicate threshold reached during registration | Warn user, compare records, select existing or continue with reason | Duplicate decision, registration outcome | Patient search/read; AuditEvent | Override requires reason and permission; no silent duplicate creation. |
| W-HIM-020 | HIM Supervisor | System creates duplicate candidate after registration/update/migration | Review, classify and decide duplicate status | Duplicate candidate state and decision | Provenance/AuditEvent; future MPI | Outcome: duplicate, not duplicate, insufficient info, deferred. |
| W-HIM-021 | HIM Supervisor | Two records confirmed same person | Select survivor, resolve conflicts, merge and preserve history | Merged patient, preserved identifiers, redirected non-survivor | Patient.link/Person concept; NgProvenance | No deletion; all encounters/documents/orders/invoices/audits preserved. |
| W-HIM-022 | HIM Supervisor + Admin | Merge later found unsafe/wrong | Reverse or manually separate record relationships with review | Restored records, unmerge audit, exception list | NgProvenance; AuditEvent | Requires approval; may require manual reconciliation. |
| W-HIM-023 | All authorised users | User needs patient context | Search, filter, select and confirm patient | Patient context, patient banner, access log | FHIR Patient search/read | Search results masked by role; restricted/deceased flags visible as authorised. |
| W-HIM-024 | Clinician / HIM Supervisor / Auditor | Patient or document is confidential and access is restricted | Deny, permit by role, or allow emergency break-glass with reason | Access decision, reason, alert/review task | Consent/AuditEvent; privacy controls | All access and denied attempts logged; review queue for break-glass. |
| W-HIM-025 | HIM Officer / Authorised User | Paper, consent, insurance, referral or clinical document is scanned/uploaded | Confirm patient, upload, classify, index and store metadata | DocumentReference-like metadata, file, audit | DocumentReference; NgProvenance | Virus/file validation; wrong-patient prevention; metadata required. |
| W-HIM-026 | HIM Officer | Historical paper file is digitised | Scan, link to patient, tag legacy MRN and date range | Legacy document package and metadata | DocumentReference; Patient.identifier old MRN | Quality check; batch validation; no overwrite of current record. |
| W-HIM-027 | HIM Officer / Supervisor | Document attached to wrong patient, wrong type, corrupted or replaced | Mark created-in-error or superseded; upload corrected version | Document status/version and audit | DocumentReference.status; Provenance | No hard delete after formal record entry without governed redaction process. |
| W-HIM-028 | HIM Officer / Supervisor | Patient requests copy, summary or medical report | Authenticate requester, define scope, approve, prepare and release | Release request, package, disclosure audit | NgConsent where applicable; DocumentReference/IPS | Fees/billing if configured; release scope and method recorded. |
| W-HIM-029 | HIM Supervisor | Guardian, next of kin, insurer, court or external provider requests record | Verify authority, approve/reject, redact if required, release | Authority evidence, release package, audit | NgConsent; Provenance/AuditEvent | Next of kin alone not sufficient legal authority; policy required. |
| W-HIM-030 | Clinician / HIM Officer | Internal care team needs historical chart/document | Request, approve if needed, retrieve and log access | Document access event | DocumentReference; AuditEvent | Restricted records require special permission or break-glass. |
| W-HIM-031 | Claims Officer / HIM Supervisor | Payer requests evidence for eligibility, pre-auth or claim | Validate coverage/request, prepare permitted evidence, release to claims | Claims evidence package | NgCoverage; NgClaim; NgInvoice; DocumentReference | Only minimum necessary documentation; release to payer audited. |
| W-HIM-032 | HIM Officer / DPO where relevant | Consent is required for sharing, disclosure, research or communication | Capture consent terms, status, scope and withdrawal | Consent record, consent document, audit | NgConsent; ISO/TR 17975 alignment | Treatment workflows distinguished from disclosure/secondary-use consent. |
| W-HIM-033 | Front Desk / Referral Desk | Patient arrives with referral or is referred out | Capture referring/receiving facility, service, reason and encounter link | Referral metadata, encounter/service request | NgServiceRequest; NgTask; NgEncounter | Referral source and receiving service structured for reporting/exchange. |
| W-HIM-034 | Front Desk / Billing / Claims | Patient is covered by HMO/NHIA/corporate plan | Capture coverage, payer, insurance number and eligibility status | Coverage profile, payer link, billing category | NgCoverage; CoverageEligibilityRequest/Response | Coverage separate from identity; changes audited. |
| W-HIM-035 | Front Desk Officer | Registration/verification complete | Send patient to clinic, triage, billing, lab or other service queue | Queue event, service point, timestamp | Appointment/Encounter/Task concepts | Incorrect routing can be corrected with audit; priority flag supported. |
| W-HIM-036 | Front Desk / Clinician / System | Patient begins service interaction | Create/link encounter to patient, appointment, queue and payer | Encounter, visit number, episode link | NgEncounter; Encounter | Every downstream clinical/financial action must link to patient and encounter where applicable. |
| W-HIM-037 | Front Desk / Emergency User | Network/system degraded and registration must continue | Use approved fallback or local temporary capture | Downtime register or temporary patient records | Later FHIR mapping after reconciliation | No silent permanent MRN collision; reconciliation mandatory. |
| W-HIM-038 | HIM Supervisor / Support | Downtime records are re-entered/synchronised | Validate, duplicate-check, resolve conflicts and audit | Permanent records, conflict log, duplicate queue | NgProvenance; AuditEvent | Conflicts cannot auto-resolve high-risk identity fields. |
| W-HIM-039 | Migration Team / HIM Supervisor | Existing patient data imported from paper/spreadsheet/old EMR | Map, cleanse, import, de-duplicate and validate | Migrated patient records, migration audit | Patient/DocumentReference; legacy MRN | Sample migration rehearsal and rollback plan required. |
| W-HIM-040 | Auditor / HIM Supervisor / DPO | Periodic audit or incident investigation | Review search/view/update/merge/release/restricted access logs | Audit report, exception list, remediation tasks | AuditEvent; NgProvenance | Auditor role read-only; exports controlled and logged. |
| W-HIM-041 | DPO / HIM Supervisor | Patient requests access/copy/correction or restriction | Log request, validate identity, process, approve and close | Request record, action, response evidence | Consent/Provenance; privacy workflow | Aligns with NDPA rights; clinical record integrity preserved. |
| W-HIM-042 | HIM Supervisor | Record is obsolete, inactive, nullified, migrated or reactivated | Change status using policy-controlled workflow | Record status, reason, audit | Patient.active/deceased/status mapping; Provenance | No hard deletion; reactivation requires approval. |
| W-HIM-043 | Support Lead / Facility Admin | Support incident needs technical access | Approve time-bound access, mask data where feasible, log activity | Support session log, access expiry | AuditEvent | Support role not default patient-data access. |
| W-HIM-044 | Facility Admin / Product Admin | MRN rule, form field, document type, role or workflow setting changes | Review, test, approve and activate configuration | Configuration version and audit | N/A; impacts mapping registers | Safety-critical fields cannot be disabled without approval. |
| W-HIM-045 | Integration Admin / QA | FHIR exchange, sandbox test or interoperability demo is required | Generate payload, validate profile, log outcome and correct gaps | Sample NgPatient/NgConsent/NgProvenance bundles and validator output | Nigeria Core; DHIN IG; FHIR R4 | No production-conformance claim without official validation/onboarding. |

---

## 10. Functional Requirements Catalogue

### Patient identity and identifiers

| Requirement ID | Requirement statement |
|---|---|
| FR-HIM-ID-001 | The system shall assign every patient a non-reusable internal patient ID. |
| FR-HIM-ID-002 | The system shall assign each permanent patient a unique MRN within the configured MRN namespace. |
| FR-HIM-ID-003 | The system shall support MRN, legacy MRN, NIN/national ID, birth certificate number, alternative ID, insurance number, temporary emergency ID, pseudonym and future client-registry ID fields. |
| FR-HIM-ID-004 | The system shall store identifier type, system/namespace, value, assigning authority, verification status, start/end date, active status, source and audit metadata. |
| FR-HIM-ID-005 | The system shall map supported identifiers to DHIN NgPatient identifier slices where applicable, including NationalIDNo, MedicalRecordsNumber, BirthCertificateNo, PhoneNumber, InsuranceNumber and Pseudonym. |
| FR-HIM-ID-006 | The system shall not make NIN mandatory for emergency registration or for patients who cannot lawfully or practically provide NIN. |
| FR-HIM-ID-007 | The system shall preserve retired, old, temporary, merged and legacy identifiers rather than deleting them. |

### Registration and verification

| Requirement ID | Requirement statement |
|---|---|
| FR-HIM-REG-001 | The system shall require patient search before standard new registration unless an emergency bypass or downtime procedure is invoked. |
| FR-HIM-REG-002 | The system shall support standard, walk-in, appointment-linked, emergency, unknown, mass-casualty, neonate, minor, foreign, deceased-on-arrival and migration registration scenarios. |
| FR-HIM-REG-003 | The system shall validate mandatory fields for standard registration and reduced mandatory fields for emergency registration. |
| FR-HIM-REG-004 | The system shall support returning-patient verification before check-in, queue routing or encounter creation. |
| FR-HIM-REG-005 | The system shall display status warnings for temporary, deceased, restricted, merged, duplicate-suspected, inactive or created-in-error records. |
| FR-HIM-REG-006 | The system shall audit all registration, verification, cancellation and correction actions. |

### MPI, duplicate management, merge/unmerge

| Requirement ID | Requirement statement |
|---|---|
| FR-HIM-MPI-001 | The system shall detect possible duplicates during registration, identity update, emergency reconciliation and migration. |
| FR-HIM-MPI-002 | The system shall support exact matching on configured unique identifiers and fuzzy/weighted matching on name, DOB/age, sex, phone, address, guardian and payer identifiers. |
| FR-HIM-MPI-003 | The system shall present duplicate candidates with comparison data and match reasons. |
| FR-HIM-MPI-004 | The system shall maintain a duplicate-review queue with decisions and audit history. |
| FR-HIM-MRG-001 | The system shall support approved merge with survivor selection, field-conflict resolution, preservation of all identifiers and redirection of non-survivor records. |
| FR-HIM-MRG-002 | The system shall support unmerge or manual separation with approval, reason, audit and exception reporting. |

### Patient demographics and related persons

| Requirement ID | Requirement statement |
|---|---|
| FR-HIM-DEM-001 | The system shall store surname/family name and given names separately. |
| FR-HIM-DEM-002 | The system shall support exact DOB, estimated age, sex, address, phone, email, state, LGA, ward/community and preferred contact method. |
| FR-HIM-DEM-003 | The system shall support next of kin, emergency contact, guardian, caregiver, parent and related-person records with relationship type and authority status. |
| FR-HIM-DEM-004 | The system shall support NgPatient mapping for gender/sex value set, address.state, address.district and administrative ward extension where configured. |
| FR-HIM-DEM-005 | The system shall maintain demographic completeness status, incomplete-record worklists and data-quality reports. |

### Document and records management

| Requirement ID | Requirement statement |
|---|---|
| FR-HIM-DOC-001 | The system shall support upload, scanning, indexing, classification, confidentiality marking and retrieval of patient documents. |
| FR-HIM-DOC-002 | The system shall require patient-context confirmation before document upload. |
| FR-HIM-DOC-003 | The system shall store document type, source, author/uploader, upload date/time, encounter link, confidentiality level, status, version and file metadata. |
| FR-HIM-DOC-004 | The system shall support superseded and created-in-error document statuses without unsafe physical deletion. |
| FR-HIM-DOC-005 | The system shall support scanned legacy records and legacy MRN indexing. |

### Consent, release and privacy

| Requirement ID | Requirement statement |
|---|---|
| FR-HIM-CON-001 | The system shall support consent capture, update, withdrawal, status, scope, category, patient, representative and source metadata where consent applies. |
| FR-HIM-REL-001 | The system shall support record-release requests for patient, guardian, legal, payer, internal clinical and external provider scenarios. |
| FR-HIM-REL-002 | The system shall capture requester identity, authority, purpose, requested scope, approval, rejection reason, release package, release method and audit trail. |
| NFR-HIM-PRI-001 | The system shall enforce data minimisation, lawful processing, role-based access, masking, export controls and audit logging. |
| NFR-HIM-PRI-002 | The system shall support workflows for data-subject access, correction/rectification, objection/restriction and evidence of response. |

### Security, audit and restricted access

| Requirement ID | Requirement statement |
|---|---|
| NFR-HIM-SEC-001 | The system shall enforce RBAC and least privilege across search, view, create, update, merge, document, release, export and configuration actions. |
| NFR-HIM-SEC-002 | The system shall support MFA baseline, session timeout, shared-workstation safety and re-authentication for sensitive actions where configured. |
| NFR-HIM-AUD-001 | The system shall audit patient create, search, view, update, identifier change, document action, merge, unmerge, release, export, break-glass and configuration changes. |
| NFR-HIM-AUD-002 | Audit records shall include actor, role, patient, action, timestamp, source device/IP where available, old/new values where applicable and reason for high-risk actions. |
| FR-HIM-RES-001 | The system shall support restricted records and break-glass with reason capture, access logging and review queue. |

### Interoperability and configuration

| Requirement ID | Requirement statement |
|---|---|
| NFR-HIM-INT-001 | The system shall maintain a canonical internal model capable of mapping to Nigeria Core FHIR and DHIN FHIR IG without hard-coding only one external profile. |
| NFR-HIM-INT-002 | The system shall maintain FHIR mapping registers for Patient, RelatedPerson, Encounter, Appointment, DocumentReference, Consent, Provenance, AuditEvent, Coverage, Claim, Invoice, ServiceRequest and Task where relevant. |
| NFR-HIM-INT-003 | Future external APIs shall use authenticated, authorised, scoped and logged access; anonymous FHIR submission/retrieval shall not be permitted. |
| FR-HIM-CFG-001 | The system shall support configurable MRN patterns, registration forms, mandatory fields, document types, patient categories, payer types, duplicate thresholds, roles and release templates. |
| FR-HIM-CFG-002 | Configuration changes affecting patient identity, mandatory fields, MRN, duplicate rules or access shall be versioned, approved and audited. |

---

## 11. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Exact MRN search should return within 3 seconds under approved test load; standard registration save should complete within agreed response threshold; duplicate matching shall not block emergency care. |
| Availability | HIM search, registration and emergency registration are critical workflows and shall be included in availability and downtime planning. |
| Resilience | Backup, restore, audit preservation and downtime reconciliation shall be tested before release. |
| Usability | Registration screens shall be keyboard-friendly, clear, low-clutter and tolerant of incomplete real-world patient information. |
| Accessibility | Core workflows should be reviewed against agreed accessibility and readability criteria. |
| Scalability | The patient search/indexing design shall support growth from pilot to tertiary-hospital volumes. |
| Maintainability | MRN formats, forms, document types, roles and duplicate thresholds shall be configurable without source-code changes where safe. |
| Security | All APIs and workflows that access patient data shall require authentication, authorisation and audit. |
| Privacy | Sensitive identifiers and restricted records shall support masking and minimum necessary access. |

---

## 12. Security, Privacy, Audit and Consent Requirements

| Control area | Mandatory controls |
|---|---|
| RBAC | Separate permissions for search, view, create, update, identifier update, document upload, restricted record view, merge, unmerge, release, export and configuration. |
| MFA/session | MFA baseline for privileged roles; timeout for shared workstations; re-authentication for high-risk actions where configured. |
| Audit | Immutable/tamper-evident logs for high-risk actions; old/new values and reasons for identity changes. |
| Restricted records | Record/document confidentiality flags; deny or require break-glass with reason and review. |
| Consent | Consent metadata for disclosure, sharing, communication, research/secondary use and withdrawal; treatment consent documents may be uploaded/indexed. |
| Privacy rights | DSAR/access, rectification, restriction/objection, portability/export and evidence of response workflows. |
| Support access | Approved, time-bound, logged and minimum-necessary support access; data masking where feasible. |
| FHIR security | Future DHIN-facing bundle operations shall require OAuth2/SMART-on-FHIR or approved equivalent, RBAC/scopes and organisation scoping. |

---

## 13. Integration and FHIR Mapping

| REDNOXX HIM concept | Nigeria Core / HL7 FHIR resource | DHIN IG artefact | Notes |
|---|---|---|---|
| Patient profile | Patient / Person | NgPatient | Canonical patient model must map to both Nigeria Core and DHIN. |
| MRN/NIN/insurance/pseudonym | Patient.identifier | NgPatient identifier slices | Identifier namespaces and systems required. |
| Guardian/next of kin/caregiver | RelatedPerson / Patient.contact | NgRelatedPerson | Authority status separate from relationship. |
| Appointment/check-in | Appointment | NG Appointment | Appointment-linked registration and immunisation/referral readiness. |
| Visit/encounter | Encounter / EpisodeOfCare | NG Encounter | Created/linked during registration and routing. |
| Documents | DocumentReference / Composition / Bundle | NG IPS Document Bundle / NG IPS Composition | Document metadata; IPS readiness for summary exchange. |
| Consent | Consent | NgConsent | Consent and disclosure metadata. |
| Audit/provenance | AuditEvent / Provenance | NgProvenance | Create/update/merge/release provenance. |
| Coverage/claims | Coverage, CoverageEligibilityRequest/Response, Claim, ClaimResponse, Invoice, ExplanationOfBenefit | NgCoverage, NgClaim, NgClaimResponse, NgInvoice | Insurance/claims readiness; claims evidence workflow. |
| Referral | ServiceRequest, Task, Communication | NgServiceRequest, NgTask, NG Referral bundle | Referral registration and MNCH referral readiness. |

---

## 14. Configuration Requirements

| Configurable item | Requirement |
|---|---|
| Facility/departments/clinics/wards/service points | Maintain master data and routing rules used by registration and queue workflows. |
| MRN format | Configure prefix, sequence, namespace, check-digit readiness and activation date; changes audited. |
| Registration forms | Configure optional fields and scenario-specific required fields; safety-critical fields protected. |
| Document types | Configure document classes, metadata, retention and confidentiality defaults. |
| Patient categories/payers | Configure cash, NHIA, HMO, corporate, staff, welfare and other categories. |
| Duplicate thresholds | Configure match weights and review thresholds; test before activation. |
| Roles/permissions | Configure permission bundles with segregation of duties and audit. |
| Release templates | Configure request types, approval roles, redaction rules, fees and release packages. |

---

## 15. Reporting and Dashboards

| Report/dashboard | Purpose | Key fields |
|---|---|---|
| Registration volume dashboard | Operational throughput | Date, desk, user, patient category, registration type. |
| Incomplete records dashboard | Data quality | MRN, missing fields, age of incomplete record, owner. |
| Duplicate candidate dashboard | MPI quality | Candidate pairs, score, status, reviewer, age. |
| Merge/unmerge report | Record integrity control | Records involved, survivor, approver, reason, date. |
| Emergency reconciliation report | Temporary identity resolution | Temporary ID, status, days unresolved, assigned reviewer. |
| Document upload/indexing report | Records office performance | Document type, uploader, status, indexing completeness. |
| Record release register | Disclosure governance | Requester, authority, purpose, scope, approver, method. |
| Restricted/break-glass report | Privacy and security monitoring | Patient, actor, reason, timestamp, review status. |
| Audit exception report | Compliance monitoring | High-risk actions, failed attempts, unusual search/export patterns. |

---

## 16. Migration and Legacy Records

- Migration shall preserve legacy MRNs and source-system identifiers.
- Migration shall not silently overwrite existing active patient records.
- Migration shall include cleansing, field mapping, duplicate detection, sampling, reconciliation and rollback plan.
- Scanned paper records shall be indexed as documents with date range, document type, source, legacy MRN and quality-check status.
- Migration audit evidence shall include import batch, records imported, exceptions, duplicates, rejected rows and reviewer sign-off.

---

## 17. Testing and Acceptance Strategy

| Test category | Minimum HIM test coverage |
|---|---|
| Functional workflow testing | All 45 mapped workflows pass positive, negative and exception tests. |
| Clinical/patient-safety testing | Wrong-patient prevention, duplicate creation, emergency identity, merge/unmerge and document misfiling tests. |
| Security testing | RBAC, session timeout, restricted records, support access, export controls and API authentication. |
| Privacy testing | Masking, DSAR/correction, consent withdrawal, record release and minimum-necessary disclosure. |
| Audit testing | Verify audit log content for all high-risk actions and reports. |
| Performance testing | Search, save, duplicate matching, dashboards and document upload under agreed load. |
| Interoperability testing | Generate and validate sample NgPatient, NgRelatedPerson, NgEncounter, NgConsent and NgProvenance payloads. |
| Downtime testing | Offline/degraded registration, paper fallback, sync and duplicate/conflict reconciliation. |
| Migration testing | Legacy MRN import, duplicate review, scanned document indexing and rollback. |

---

## 18. Traceability Matrices

| Source requirement area | Mapped SRS sections | Evidence expected |
|---|---|---|
| NDHI functional requirements | Sections 8-10, workflow maps, requirements catalogue | Demo script, UAT results, screenshots, test report. |
| NDHI non-functional requirements | Sections 11-12, 17 | Performance, security, resilience and audit test evidence. |
| NDHA building blocks | Sections 3, 7-8, 13 | Data model, mapping register, API catalogue, architecture decision records. |
| Nigeria Core FHIR | Sections 3, 7, 10, 13 | FHIR mapping register and validator output where payloads are generated. |
| DHIN IG | Sections 3, 8-10, 13, 17 | NgPatient/NgRelatedPerson/NgConsent/NgProvenance sample payloads and validation results. |
| NDPA/NDPC | Sections 12, 15, 17 | DPIA, privacy requirements, access logs, release register, DSAR workflow test. |
| NITDA development/testing | Sections 0, 10-18 | SRS, test plan, test evidence, release notes, defect log, third-party testing plan where applicable. |
| SON/ISO-TC 215 | Sections 3, 12, 17 | Applicability matrix, audit/consent/security/safety evidence. |

---

## 19. Open Issues, Risks and Assumptions

| Risk/assumption | Impact | Mitigation |
|---|---|---|
| National registry APIs may not be available for V1 | Production NHCR/NHFR/NHWR integration cannot be claimed. | Maintain data model readiness and defer live connection. |
| Nigeria Core and DHIN IG are draft/CI builds | Profiles may change. | Maintain mapping registers and versioned conformance notes. |
| NIN availability may be inconsistent | Registration cannot rely on NIN as mandatory identity. | Support alternatives and emergency workflows. |
| Paper records and legacy MRNs are common | Migration and duplicate risk. | Use legacy MRN preservation, scanning, indexing and migration QA. |
| Shared workstations increase access risk | Patient data exposure. | Session timeout, MFA, re-authentication and visible logged-in user. |
| Unsafe merge can corrupt longitudinal record | Patient-safety and legal risk. | Supervisor approval, conflict view, audit and unmerge path. |
| Formal SON/NDHI/DHIN certification pathway may require external validation | Readiness does not equal certification. | Avoid unsupported claims; prepare evidence for authority processes. |

---

## 20. References

- **NDHI EHR RFI**: https://www.digitalhealth.gov.ng/ndhi-rfi — NDHI EHR RFI page; vendor capability demonstration and national EHR market assessment.
- **NDHI Relevant Documents / NDHA**: https://www.digitalhealth.gov.ng/relevant-documents — NDHI page hosting the Nigeria Digital Health Architecture for an interoperable digital health ecosystem.
- **Nigeria Core FHIR IG**: https://build.fhir.org/ig/digitalhealth-gov-ng/Nigeria-Core/branches/main/ — NDHI-published continuous-build FHIR implementation guide defining the national interoperability floor for Nigeria.
- **DHIN 2025 Connectathon FHIR IG**: https://build.fhir.org/ig/Nigeria-FHIR-Community/2025Connectathon/index.html — Draft/CI FHIR R4 IG for DHIN connectathon tracks, sandbox and implementation testing.
- **DHIN Artifacts Summary**: https://build.fhir.org/ig/Nigeria-FHIR-Community/2025Connectathon/artifacts.html — DHIN profiles, value sets, bundles and capability statements relevant to HIM mapping.
- **DHIN NG Patient**: https://build.fhir.org/ig/Nigeria-FHIR-Community/2025Connectathon/StructureDefinition-ng-patient.html — DHIN patient profile with identifier slices, demographics, address and Nigerian value-set bindings.
- **DHIN Privacy and Security**: https://build.fhir.org/ig/Nigeria-FHIR-Community/2025Connectathon/privacy-security.html — Authentication, RBAC and data filtering guidance for FHIR bundle operations.
- **NDPC**: https://ndpc.gov.ng/ — Nigeria Data Protection Commission homepage and data subject rights summary.
- **Nigeria Data Protection Act 2023**: https://ndpc.gov.ng/wp-content/uploads/2024/03/Nigeria_Data_Protection_Act_2023.pdf — Official NDPA text as published by NDPC.
- **NITDA National Software Development Guideline**: https://nitda.gov.ng/?download_id=9427&sdm_process_download=1 — 2026 guideline defining minimum software development requirements for Nigerian government systems.
- **NITDA National Software Testing Guideline**: https://nitda.gov.ng/wp-content/uploads/2026/04/National-Software-Testing-Guideline.pdf — 2026 guideline defining risk-based testing and pre-deployment quality assurance requirements.
- **ISO/TC 215 Health Informatics**: https://www.iso.org/committee/54960.html — ISO health informatics technical committee scope.
- **DHIN National Standards**: https://www.dhin-hie.org/standards/national-standards — DHIN list of ISO/TC 215 and digital health standards relevant to Nigerian implementations.

### Appendix A: Requirement ID Scheme

| Prefix | Meaning |
|---|---|
| FR-HIM-REG | Functional registration requirements |
| FR-HIM-ID | Identifiers and MRN |
| FR-HIM-MPI | MPI and duplicate management |
| FR-HIM-MRG | Merge/unmerge |
| FR-HIM-DEM | Demographics and related persons |
| FR-HIM-DOC | Documents and records |
| FR-HIM-CON | Consent |
| FR-HIM-REL | Record release |
| FR-HIM-CFG | Configuration |
| NFR-HIM-SEC | Security |
| NFR-HIM-PRI | Privacy |
| NFR-HIM-AUD | Audit |
| NFR-HIM-INT | Interoperability |
| NFR-HIM-PER | Performance |
| NFR-HIM-RESIL | Resilience |

---

*REDNOXX HIM Module SRS v0.2 — Draft for review — 2026-07-04*
