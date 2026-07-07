# FHIR R4 mapping — Nigeria Core alignment

Every persisted field maps to a FHIR R4 resource, profiled against the
**Nigeria Core Implementation Guide** (https://build.fhir.org/ig/digitalhealth-gov-ng/Nigeria-Core/branches/main/).
UI forms and displays MUST mirror these structures so the API contract and
the screen never drift.

## Field metadata (required for every persisted field)

| Attribute | Meaning |
|---|---|
| Data owner | module/team accountable for the field |
| Validation rule | format, range, required-ness |
| Terminology source | ICD-10 (diagnoses), LOINC (labs/vitals), national drug list (medications), NHIA codes (insurance/claims) |
| FHIR path | resource.element, per the tables below |
| Privacy class | public / internal / restricted / confidential — drives masking + audit-on-view |

## Identifiers

`Patient.identifier` slices per Nigeria Core: **MRN** (facility-scoped),
**NIN** (national), **phone** as contact point. Identifiers render mono +
`.tnum`, are format-validated in UI, and uniqueness is enforced server-side
and surfaced inline at the field.

## Module → resource map

| Module | Resources | Key UI-mapped elements |
|---|---|---|
| Registration | `Patient`, `RelatedPerson`, `Coverage`, `Consent` | name, birthDate (+computed age), gender, identifiers, address, contact; next-of-kin → RelatedPerson; insurance → Coverage; consent record → Consent |
| Appointments/queue | `Appointment`, `Slot`, `Schedule`, `Encounter` | status transitions map to Appointment.status; check-in creates Encounter |
| Triage/vitals | `Observation` | one Observation per vital, LOINC-coded, valueQuantity with UCUM units, Encounter-linked; abnormal flag → interpretation |
| Consultation | `Encounter`, `Condition`, `ClinicalImpression`, `DocumentReference` | diagnosis typeahead writes Condition (ICD-10); note sections → ClinicalImpression / DocumentReference; sign-off → Encounter status + audit |
| Orders/lab | `ServiceRequest`, `Specimen`, `DiagnosticReport`, `Observation` | basket rows = ServiceRequest; specimen tracking = Specimen.status; results = Observation under DiagnosticReport; critical flag → interpretation + ack workflow |
| Pharmacy | `MedicationRequest`, `MedicationDispense`, `AllergyIntolerance` | dose/route/frequency/duration → dosageInstruction; allergy warnings read AllergyIntolerance at prescribe time; dispense status chip = MedicationDispense.status |
| Billing/claims | `ChargeItem`, `Invoice`, `Claim`, `ClaimResponse`, `PaymentNotice` | itemised charges = ChargeItem; receipt = Invoice; claim chips map Claim/ClaimResponse.status; NHIA terminology |
| HIM/records | `Patient` (link/merge), `DocumentReference`, `AuditEvent` | merge = Patient.link + replaced-by semantics, reversible in retention window; uploads = DocumentReference with confidentiality flag |
| Referrals | `ServiceRequest`, `Task`, `Communication` | referral = ServiceRequest(intent=order) + Task for tracking; acknowledgement = Communication |
| Reporting | `MeasureReport` | national indicators; provenance footer fields map to MeasureReport metadata |

## UI rules that follow from FHIR

- Status chips on screen enumerate the FHIR status value set for that
  resource — no invented statuses.
- Dates/times captured with timezone; displayed local, stored ISO 8601.
- Coded fields are typeaheads over the terminology source — free text only
  in explicitly free-text elements (with that made visible).
- Attachments carry required metadata (type, date, author) before upload
  completes → DocumentReference.
- Nigeria Core security/privacy expectations: restricted records audit on
  view; privacy class drives field masking by role.
