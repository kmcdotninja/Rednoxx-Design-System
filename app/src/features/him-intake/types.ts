export type HimPermission =
  | 'him.dashboard.view'
  | 'patient.search'
  | 'patient.read'
  | 'patient.register'
  | 'patient.register.emergency'
  | 'patient.register.neonate'
  | 'patient.register.offline'
  | 'patient.duplicate.override'
  | 'patient.identifier.manage'
  | 'patient.identifier.verify'
  | 'patient.identifier.unmask'
  | 'patient.relatedperson.manage'
  | 'patient.verify'
  | 'patient.demographics.update'
  | 'patient.identity.update'
  | 'patient.mci.manage'
  | 'encounter.create'
  | 'encounter.checkin'
  | 'queue.route'
  | 'him.offline.view'
  | 'him.offline.reconcile'
  | 'him.migration.manage'
  | 'him.migration.rehearse'
  | 'him.migration.commit'

export interface HimSession {
  id: string
  name: string
  title: string
  facilities: string[]
  permissions: HimPermission[]
}

/** Status flags that change how a patient record is displayed and acted on
 *  everywhere it appears — banner, search results, worklists. */
export type PatientStatusFlag = 'deceased' | 'restricted' | 'merged' | 'temporary'

export type PatientSex = 'M' | 'F' | 'O' | 'unknown'

export type CoverageStatus = 'active' | 'expired' | 'none'

/**
 * The canonical patient-banner data contract owned by this stream. OESC
 * screens (Streams E & F) render `HimPatientBanner` against this shape when
 * a patient is in context — it does not change without a cross-stream note.
 */
export interface PatientBannerContract {
  id: string
  mrn: string
  fullName: string
  displayName: string
  dateOfBirth: string | null
  estimatedAge: number | null
  sex: PatientSex
  statusFlags: PatientStatusFlag[]
  mergedIntoId?: string | null
  allergies: string[]
  coverage: { payer: string; status: CoverageStatus } | null
  facility?: string
}

export interface PatientIdentifier {
  id: string
  type: 'NIN' | 'ALT_ID' | 'PASSPORT' | 'INSURANCE' | 'LEGACY_MRN'
  namespace: string
  value: string
  maskedValue: string
  verified: boolean
  verifiedAt?: string | null
  verifiedSource?: string | null
  active: boolean
  expiryDate?: string | null
  issuer?: string | null
}

export interface PatientSearchResult {
  id: string
  mrn: string
  displayName: string
  age: number | null
  sex: PatientSex
  statusFlags: PatientStatusFlag[]
  mergedIntoId?: string | null
  lastVisit: string | null
  facility: string
  restrictedStub: boolean
}

export interface PatientSearchParams {
  q: string
  facility?: string
  status?: string
  sex?: PatientSex
  ageMin?: number
  ageMax?: number
}

export interface PatientSearchResponse {
  results: PatientSearchResult[]
  /** True when matches exceeded the display threshold — prompt to refine (§States). */
  tooMany: boolean
}

/* --------------------------------- S00 ----------------------------------- */

export interface HimSummary {
  registrationsToday: number
  incompleteRecords: number
  duplicateCandidates: number
  pendingReleaseRequests: number
  openDsars: number
  breakGlassToReview: number
}

export type HimWorklistType = 'incomplete' | 'duplicates' | 'release' | 'dsar'

export interface HimWorklistItem {
  id: string
  type: HimWorklistType
  patientName: string
  mrn?: string
  ageHours: number
  detailTo: string
  patientId?: string
  assignedToMe: boolean
  facility: string
}

export interface HimActivityEvent {
  id: string
  actor: string
  action: string
  targetLabel: string
  targetPatientId?: string
  occurredAt: string // ISO timestamp
}
/* --------------------------------- S03 ----------------------------------- */

/** A candidate returned by the duplicate check during registration. */
export interface DuplicateCandidate {
  id: string
  displayName: string
  mrn: string
  age: number | null
  sex: PatientSex
  facility: string
  /** Which fields triggered this match, e.g. ['surname', 'dateOfBirth'] */
  matchedOn: string[]
}

export interface RegistrationDraft {
  surname: string
  givenNames: string
  dateOfBirth: string
  phone: string
  sex: PatientSex
  estimatedAge: number | null
  address: string
  nin: string
  ninUnavailable: boolean
  ninUnavailableReason: string
  altIdType: string
  altIdValue: string
  altIdIssuer: string
  nokName: string
  nokRelationship: string
  nokPhone: string
  hasCoverage: boolean
  coveragePayer: string
  coverageMemberId: string
  facility: string
  duplicateOverrideConfirmed: boolean
  duplicateOverrideReason: string
}

export interface RegisterPatientResult {
  id: string
  mrn: string
}

/* --------------------------------- S08 ----------------------------------- */

export interface VerificationAttribute {
  key: 'mrn' | 'name' | 'phone' | 'dob' | 'id'
  label: string
  expected: string
}

export interface VerificationContext {
  patient: PatientBannerContract
  /** 0-100 match confidence from the search step. */
  matchScore: number
  attributes: VerificationAttribute[]
}

/* --------------------------------- S04 ----------------------------------- */

export type AgeBand = 'neonate_infant' | 'child' | 'adolescent' | 'adult' | 'elderly' | 'unknown'

export interface EmergencyRegistrationDraft {
  sex: PatientSex
  ageBand: AgeBand
  estimatedAge: number | null
  partialName: string
  distinguishingNotes: string
  arrivalBroughtBy: string
  facility: string
}

export interface EmergencyRegistrationResult {
  id: string
  mrn: string
  placeholderName: string
  /** A fake encounter reference — OESC (Streams E/F) owns real encounter
   *  creation; this stream only needs to show that one was opened. */
  encounterId: string
}

/* --------------------------------- S05 ----------------------------------- */

export type MciEventStatus = 'active' | 'closed'

export interface MciEvent {
  id: string
  tag: string
  activatedBy: string
  activatedAt: string
  status: MciEventStatus
  closedAt: string | null
}

export type TriagePriority = 'immediate' | 'delayed' | 'minor' | 'expectant' | 'unassigned'

export interface MciCasualty {
  id: string
  patientId: string
  eventId: string
  sequence: number
  placeholderName: string
  mrn: string
  sex: PatientSex
  ageBand: AgeBand
  triagePriority: TriagePriority
  createdAt: string
}

export interface MciReconciliationReport {
  eventId: string
  tag: string
  totalCasualties: number
  reconciledCount: number
  closedAt: string | null
}

/* --------------------------------- S06 ----------------------------------- */

export interface NeonateRegistrationDraft {
  motherId: string
  motherName: string
  birthDateTime: string
  birthOrder: number
  multipleBirth: boolean
  numberOfBabies: number
  sex: PatientSex
  givenName?: string
  birthCertificateNo?: string
}

export interface NeonateRegistrationResult {
  id: string
  mrn: string
  babyOfName: string
  birthEventId: string
}

export interface Neonate {
  id: string
  sex: PatientSex
  givenName: string
  birthOrder: number
  birthCertificateNo?: string
}

/* --------------------------------- S07 ----------------------------------- */

export interface MinorRegistrationDraft {
  surname: string
  givenNames: string
  dateOfBirth: string
  estimatedAge: number | null
  sex: PatientSex
  phone: string
  address: string
  nin: string
  ninUnavailable: boolean
  ninUnavailableReason: string
  altIdType: string
  altIdValue: string
  altIdIssuer: string
  guardianName: string
  guardianRelationship: string
  guardianId: string
  consentAuthority: boolean
  consentNotes: string
  facility: string
}

export interface MinorRegistrationResult {
  id: string
  mrn: string
  guardianLinked: boolean
}

/* --------------------------------- S09 ----------------------------------- */

export interface CheckinDraft {
  patientId: string
  visitType: 'appointment' | 'walkin'
  appointmentId?: string
  service: string
  billingCategory: string
  coveragePayer?: string
  priority: 'normal' | 'urgent'
  destinationQueue: string
}

export interface CheckinResult {
  encounterId: string
  visitNumber: string
  queuedAt: string
  queueName: string
}

/* --------------------------------- S10 ----------------------------------- */

export interface DemographicEditDraft {
  fullName: string
  sex: PatientSex
  dateOfBirth: string | null
  estimatedAge: number | null
  phone: string
  address: string
  facility?: string
  reason: string
  supervisorApproved: boolean
}

/* --------------------------------- S28 ----------------------------------- */

export interface OfflineRegistrationDraft {
  fullName: string
  sex: PatientSex
  estimatedAge: number | null
  notes: string
  facility: string
}

export interface OfflineRegistrationResult {
  id: string
  temporaryId: string
  capturedAt: string
}

export interface OfflineQueueItem {
  id: string
  temporaryId: string
  fullName: string
  capturedAt: string
}

/* --------------------------------- S29 ----------------------------------- */

/** A pending offline record enriched with duplicate‑check results. */
export interface OfflineReconciliationRecord {
  item: OfflineQueueItem
  duplicateCandidates: PatientSearchResult[]
  proposedFullName: string
  proposedSex: PatientSex
  proposedEstimatedAge: number | null
  proposedFacility: string
  conflicts: string[]
}

/** Payload to commit an offline record. */
export interface CommitOfflineRecordDraft {
  offlineId: string
  fullName: string
  sex: PatientSex
  estimatedAge: number | null
  facility: string
  overrideDuplicate: boolean
  overrideReason?: string
}

/* --------------------------------- S30 ----------------------------------- */

export type MigrationJobStatus =
  'draft' | 'mapped' | 'validated' | 'rehearsed' | 'committed' | 'rolled_back'

export interface MigrationFieldMapping {
  sourceField: string
  targetField: string
}

export interface MigrationValidationError {
  row: number
  field: string
  message: string
}

export interface MigrationDuplicateCandidate {
  existingPatientId: string
  displayName: string
  mrn: string
  matchFields: string[]
}

export interface MigrationRehearsalResult {
  totalRows: number
  validRows: number
  errorRows: number
  duplicateRows: number
  samplePatients: { fullName: string; mrn: string }[]
}

export interface MigrationJob {
  id: string
  name: string
  status: MigrationJobStatus
  uploadedAt: string | null
  totalRows: number
  mapping: MigrationFieldMapping[]
  validationErrors: MigrationValidationError[]
  duplicateCandidates: MigrationDuplicateCandidate[]
  rehearsalResult: MigrationRehearsalResult | null
  committedAt: string | null
}
