import {
  HIM_PATIENTS,
  HIM_SUMMARY,
  HIM_WORKLIST,
  MCI_EVENTS,
  MCI_CASUALTIES,
  CURRENT_HIM_USER,
  FACILITIES,
  HIM_RECENT_ACTIVITY,
} from './data'
import { allocatePermanentMrn } from './mrn'
import type {
  DuplicateCandidate,
  EmergencyRegistrationDraft,
  EmergencyRegistrationResult,
  HimSummary,
  HimWorklistItem,
  HimWorklistType,
  PatientBannerContract,
  PatientSearchParams,
  PatientSearchResponse,
  PatientSearchResult,
  PatientStatusFlag,
  PatientIdentifier,
  RegisterPatientResult,
  RegistrationDraft,
  VerificationContext,
  MciEvent,
  MciCasualty,
  TriagePriority,
  AgeBand,
  MciReconciliationReport,
  PatientSex,
  NeonateRegistrationDraft,
  NeonateRegistrationResult,
  MinorRegistrationDraft,
  MinorRegistrationResult,
  CheckinResult,
  CheckinDraft,
  DemographicEditDraft,
  OfflineRegistrationDraft,
  OfflineRegistrationResult,
  OfflineQueueItem,
  OfflineReconciliationRecord,
  CommitOfflineRecordDraft,
  MigrationJob,
  MigrationFieldMapping,
  HimActivityEvent,
} from './types'

// ---------- Mock identifier store ----------
let nextIdentifierId = 1
const identifierStore: Record<string, PatientIdentifier[]> = {}

function getOrCreatePatientIdentifiers(patientId: string): PatientIdentifier[] {
  if (!identifierStore[patientId]) {
    // Seed some identifiers based on patient fixtures
    const patient = HIM_PATIENTS.find((p) => p.id === patientId)
    identifierStore[patientId] = [
      {
        id: `idf-${nextIdentifierId++}`,
        type: 'NIN',
        namespace: 'ng-nin',
        value: patient ? `NIN-${patient.mrn.replace(/\D/g, '')}` : 'NIN-00000000000',
        maskedValue: patient ? `NIN-****${patient.mrn.slice(-4)}` : 'NIN-****0000',
        verified: true,
        verifiedAt: new Date().toISOString(),
        verifiedSource: 'NIMC',
        active: true,
      },
      {
        id: `idf-${nextIdentifierId++}`,
        type: 'LEGACY_MRN',
        namespace: 'legacy',
        value: patient ? `OLD-${patient.mrn}` : 'OLD-0000',
        maskedValue: patient ? `OLD-${patient.mrn.slice(0, 4)}****` : 'OLD-0000',
        verified: false,
        active: true,
      },
    ]
  }
  return identifierStore[patientId]
}

const delay = (ms = 450) => new Promise((r) => setTimeout(r, ms))

/** Read `?fail=1` from the URL to force the error state for any call. */
function shouldFail() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('fail') === '1'
}

async function resolve<T>(value: T, ms?: number): Promise<T> {
  await delay(ms)
  if (shouldFail()) throw new Error('The service is temporarily unavailable.')
  return value
}

/** Redacts a name to initials + dot-fill, e.g. "Ngozi Eze" → "N•••• E••". */
export function maskName(fullName: string): string {
  return fullName
    .split(' ')
    .map((part) =>
      part.length <= 1 ? part : `${part[0]}${'•'.repeat(Math.min(part.length - 1, 6))}`,
    )
    .join(' ')
}

/** Builds the canonical banner contract from a seed record — the one place
 *  that applies restricted-name masking, so every consumer (S02, S08, …)
 *  stays consistent without re-implementing the rule. */
function toBannerContract(p: (typeof HIM_PATIENTS)[number]): PatientBannerContract {
  const restricted = p.statusFlags.includes('restricted' as PatientStatusFlag)
  return {
    id: p.id,
    mrn: p.mrn,
    fullName: p.fullName,
    displayName: restricted ? maskName(p.fullName) : p.fullName,
    dateOfBirth: p.dateOfBirth,
    estimatedAge: p.age,
    sex: p.sex,
    statusFlags: p.statusFlags,
    mergedIntoId: p.mergedIntoId,
    allergies: p.allergies,
    coverage: p.coverage,
    facility: p.facility,
  }
}

const TOO_MANY_THRESHOLD = 8

/* --------------------------------- S00 ----------------------------------- */

export const getHimSummary = (): Promise<HimSummary> => resolve(HIM_SUMMARY)

export const getHimWorklists = (type?: HimWorklistType): Promise<HimWorklistItem[]> =>
  resolve(type ? HIM_WORKLIST.filter((w) => w.type === type) : HIM_WORKLIST)

export const getHimRecentActivity = (): Promise<HimActivityEvent[]> =>
  resolve(
    [...HIM_RECENT_ACTIVITY].sort((a, b) => +new Date(b.occurredAt) - +new Date(a.occurredAt)),
  )

/* --------------------------------- S01 ----------------------------------- */
/** An empty query browses the full (facility/sex-filtered) patient list —
 *  only an actual search term triggers the "too many, refine" truncation. */
export const searchPatients = (params: PatientSearchParams): Promise<PatientSearchResponse> => {
  const q = params.q.trim().toLowerCase()

  const matches = HIM_PATIENTS.filter((p) => {
    if (params.facility && p.facility !== params.facility) return false
    if (params.sex && p.sex !== params.sex) return false
    if (params.ageMin != null && (p.age == null || p.age < params.ageMin)) return false
    if (params.ageMax != null && (p.age == null || p.age > params.ageMax)) return false
    if (!q) return true
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.mrn.toLowerCase().includes(q) ||
      p.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
    )
  })

  const tooMany = q.length > 0 && matches.length > TOO_MANY_THRESHOLD
  const page = q.length > 0 ? matches.slice(0, TOO_MANY_THRESHOLD) : matches

  const results: PatientSearchResult[] = page.map((p) => {
    const restricted = p.statusFlags.includes('restricted' as PatientStatusFlag)
    return {
      id: p.id,
      mrn: p.mrn,
      displayName: restricted ? maskName(p.fullName) : p.fullName,
      age: p.age,
      sex: p.sex,
      statusFlags: p.statusFlags,
      mergedIntoId: p.mergedIntoId,
      lastVisit: p.lastVisit,
      facility: p.facility,
      restrictedStub: restricted,
    }
  })

  return resolve({ results, tooMany })
}

/* --------------------------------- S02 ----------------------------------- */
export const getPatientBanner = (id: string): Promise<PatientBannerContract | undefined> => {
  const p = HIM_PATIENTS.find((x) => x.id === id)
  return resolve(p ? toBannerContract(p) : undefined, p ? undefined : 300)
}

/* --------------------------------- S03 ----------------------------------- */
export const duplicateCheckAttrs = (attrs: {
  surname: string
  givenNames: string
  dateOfBirth: string
  phone: string
}): Promise<DuplicateCandidate[]> => {
  const candidates: DuplicateCandidate[] = []

  for (const p of HIM_PATIENTS) {
    const matchedOn: string[] = []
    const name = p.fullName.toLowerCase()
    if (attrs.surname && name.includes(attrs.surname.toLowerCase())) matchedOn.push('surname')
    if (attrs.givenNames && name.includes(attrs.givenNames.toLowerCase()))
      matchedOn.push('given name(s)')
    if (attrs.dateOfBirth && p.dateOfBirth === attrs.dateOfBirth) matchedOn.push('date of birth')
    if (attrs.phone && p.phone.replace(/\s/g, '') === attrs.phone.replace(/\s/g, ''))
      matchedOn.push('phone')

    // A shared surname or given name alone is common and not meaningful on
    // its own — only flag as a duplicate candidate once at least 3 distinct
    // attributes match (e.g. name + date of birth + phone).
    if (matchedOn.length >= 3) {
      const restricted = p.statusFlags.includes('restricted' as PatientStatusFlag)
      candidates.push({
        id: p.id,
        displayName: restricted ? maskName(p.fullName) : p.fullName,
        mrn: p.mrn,
        age: p.age,
        sex: p.sex,
        facility: p.facility,
        matchedOn,
      })
    }
  }

  return resolve(candidates)
}

/** Registers a new patient and appends it to the in-memory fixture set.
 *  Permanent MRN is allocated by the shared facility allocator (unique,
 *  format-compliant, concurrent-safe). Never accept a client-supplied MRN. */
export const registerPatient = async (draft: RegistrationDraft): Promise<RegisterPatientResult> => {
  const allocated = await allocatePermanentMrn(draft.facility)
  const id = `new-${Date.now()}-${allocated.sequence}`

  HIM_PATIENTS.push({
    id,
    mrn: allocated.mrn,
    fullName: `${draft.givenNames} ${draft.surname}`.trim(),
    age: draft.estimatedAge,
    sex: draft.sex,
    phone: draft.phone,
    facility: draft.facility,
    lastVisit: null,
    statusFlags: [],
    dateOfBirth: draft.dateOfBirth || null,
    allergies: [],
    coverage:
      draft.hasCoverage && draft.coveragePayer
        ? { payer: draft.coveragePayer, status: 'active' }
        : null,
  })

  return resolve({ id, mrn: allocated.mrn }, 650)
}

/* --------------------------------- S04 ----------------------------------- */
const SEX_WORD: Record<string, string> = { M: 'Male', F: 'Female', O: 'Other', unknown: '' }

let nextTempSuffix = 1

/** Emergency/unknown temporary registration. Deliberately minimal — the
 *  spec requires this to never delay care, so there is no duplicate check
 *  and almost nothing is required. A reconciliation worklist item is always
 *  created alongside the record (business rule: mandatory reconciliation). */
export const registerEmergencyPatient = (
  draft: EmergencyRegistrationDraft,
): Promise<EmergencyRegistrationResult> => {
  const suffix = String(1000 + nextTempSuffix++).slice(-4)
  const sexWord = SEX_WORD[draft.sex]
  const placeholderName = draft.partialName.trim()
    ? draft.partialName.trim()
    : sexWord
      ? `Unknown-${sexWord}-${suffix}`
      : `Unknown-${suffix}`

  const id = `temp-${Date.now()}`
  const mrn = `TEMP-${suffix}`
  const encounterId = `enc-${Date.now()}`

  HIM_PATIENTS.push({
    id,
    mrn,
    fullName: placeholderName,
    age: draft.estimatedAge,
    sex: draft.sex,
    phone: '',
    facility: draft.facility,
    lastVisit: null,
    statusFlags: ['temporary'],
    dateOfBirth: null,
    allergies: [],
    coverage: null,
  })

  // Mandatory reconciliation task (business rule) — lands on the same
  // Incomplete records worklist HIM-S14 will eventually own.
  HIM_WORKLIST.push({
    id: `w-${id}`,
    type: 'incomplete',
    patientName: placeholderName,
    mrn,
    ageHours: 0,
    detailTo: '/him/worklists/incomplete',
    patientId: id,
    assignedToMe: false,
    facility: draft.facility,
  })

  return resolve({ id, mrn, placeholderName, encounterId }, 400)
}

/* --------------------------------- S05 ----------------------------------- */
/** Creates a new mass-casualty event. Only one active event is allowed. */
export const createMciEvent = (tag: string): Promise<MciEvent> => {
  if (MCI_EVENTS.some((e) => e.status === 'active')) {
    throw new Error('There is already an active MCI event.')
  }
  const event: MciEvent = {
    id: `mci-${Date.now()}`,
    tag,
    activatedBy: CURRENT_HIM_USER.name,
    activatedAt: new Date().toISOString(),
    status: 'active',
    closedAt: null,
  }
  MCI_EVENTS.push(event)
  return resolve(event)
}

/** Adds a casualty to the active event. Sequential temp ID is auto‑generated. */
export const addMciCasualty = (
  eventId: string,
  attrs?: {
    sex?: PatientSex
    ageBand?: AgeBand
    partialName?: string
    distinguishingNotes?: string
    triagePriority?: TriagePriority
  },
): Promise<MciCasualty> => {
  const event = MCI_EVENTS.find((e) => e.id === eventId)
  if (!event || event.status !== 'active') {
    throw new Error('Event is not active.')
  }
  const seq = MCI_CASUALTIES.filter((c) => c.eventId === eventId).length + 1
  const suffix = String(seq).padStart(3, '0')
  const id = `mci-cas-${Date.now()}`
  const mrn = `MCI-${event.tag.replace(/\s/g, '')}-${suffix}`
  const placeholder =
    attrs?.partialName?.trim() ||
    (attrs?.sex && attrs.sex !== 'unknown'
      ? `Unknown-${attrs.sex === 'M' ? 'Male' : attrs.sex === 'F' ? 'Female' : 'Other'}-${suffix}`
      : `Unknown-${suffix}`)

  const casualty: MciCasualty = {
    id,
    patientId: id, // will be updated on reconciliation
    eventId,
    sequence: seq,
    placeholderName: placeholder,
    mrn,
    sex: attrs?.sex ?? 'unknown',
    ageBand: attrs?.ageBand ?? 'unknown',
    triagePriority: attrs?.triagePriority ?? 'unassigned',
    createdAt: new Date().toISOString(),
  }
  MCI_CASUALTIES.push(casualty)

  // Also add to HIM_PATIENTS as temporary (same as emergency)
  HIM_PATIENTS.push({
    id,
    mrn,
    fullName: placeholder,
    age: null,
    sex: attrs?.sex ?? 'unknown',
    phone: '',
    facility: CURRENT_HIM_USER.facilities[0],
    lastVisit: null,
    statusFlags: ['temporary'],
    dateOfBirth: null,
    allergies: [],
    coverage: null,
  })

  // Reconciliation worklist item
  HIM_WORKLIST.push({
    id: `w-${id}`,
    type: 'incomplete',
    patientName: placeholder,
    mrn,
    ageHours: 0,
    detailTo: '/him/worklists/incomplete',
    patientId: id,
    assignedToMe: false,
    facility: CURRENT_HIM_USER.facilities[0],
  })

  return resolve(casualty)
}

/** Closes the MCI event and returns a reconciliation report stub. */
export const closeMciEvent = (eventId: string): Promise<MciReconciliationReport> => {
  const event = MCI_EVENTS.find((e) => e.id === eventId)
  if (!event) throw new Error('Event not found.')
  event.status = 'closed'
  event.closedAt = new Date().toISOString()
  const casualties = MCI_CASUALTIES.filter((c) => c.eventId === eventId)
  return resolve({
    eventId: event.id,
    tag: event.tag,
    totalCasualties: casualties.length,
    reconciledCount: 0, // placeholder
    closedAt: event.closedAt,
  })
}

/** Returns current reconciliation report for an event. */
export const getMciReport = (eventId: string): Promise<MciReconciliationReport> => {
  const event = MCI_EVENTS.find((e) => e.id === eventId)
  if (!event) throw new Error('Event not found.')
  const casualties = MCI_CASUALTIES.filter((c) => c.eventId === eventId)
  return resolve({
    eventId: event.id,
    tag: event.tag,
    totalCasualties: casualties.length,
    reconciledCount: 0,
    closedAt: event.closedAt,
  })
}

/* --------------------------------- S06 ----------------------------------- */
let nextBabySuffix = 1

export const registerNeonate = (
  draft: NeonateRegistrationDraft,
): Promise<NeonateRegistrationResult> => {
  const mother = HIM_PATIENTS.find((p) => p.id === draft.motherId)
  const motherDisplay = mother ? mother.fullName : 'Unknown Mother'

  const babies: { id: string; mrn: string; babyOfName: string }[] = []

  const count = draft.multipleBirth ? draft.numberOfBabies : 1

  for (let i = 0; i < count; i++) {
    const suffix = String(nextBabySuffix++).padStart(4, '0')
    const babyOf = draft.givenName
      ? `${draft.givenName} (Baby of ${motherDisplay})`
      : `Baby of ${motherDisplay}`
    const id = `baby-${Date.now()}-${i}`
    const mrn = `BBY-${suffix}`

    babies.push({ id, mrn, babyOfName: babyOf })

    HIM_PATIENTS.push({
      id,
      mrn,
      fullName: babyOf,
      age: 0, // neonate
      sex: draft.sex,
      phone: mother?.phone ?? '',
      facility: mother?.facility ?? FACILITIES[0],
      lastVisit: null,
      statusFlags: [],
      dateOfBirth: draft.birthDateTime.split('T')[0],
      allergies: [],
      coverage: mother?.coverage ?? null,
    })
  }

  const birthEventId = `birth-${Date.now()}`

  return resolve(
    {
      id: babies[0].id, // link to first baby
      mrn: babies[0].mrn,
      babyOfName: babies[0].babyOfName,
      birthEventId,
    },
    600,
  )
}

/* --------------------------------- S07 ----------------------------------- */
export const registerMinor = async (
  draft: MinorRegistrationDraft,
): Promise<MinorRegistrationResult> => {
  const allocated = await allocatePermanentMrn(draft.facility)
  const id = `minor-${Date.now()}-${allocated.sequence}`
  const mrn = allocated.mrn

  HIM_PATIENTS.push({
    id,
    mrn,
    fullName: `${draft.givenNames} ${draft.surname}`.trim(),
    age: draft.estimatedAge,
    sex: draft.sex,
    phone: draft.phone,
    facility: draft.facility,
    lastVisit: null,
    statusFlags: [],
    dateOfBirth: draft.dateOfBirth || null,
    allergies: [],
    coverage: null,
  })

  // In a real system, guardian info would create a RelatedPerson resource.
  // Here we just acknowledge the link.
  return resolve({ id, mrn, guardianLinked: true }, 600)
}
/* --------------------------------- S08 ----------------------------------- */
/** Records where the search match was weak enough to require an extra
 *  confirmation step before verifying (spec: "Low confidence: require
 *  additional attribute confirmation"). */
const LOW_CONFIDENCE_IDS = new Set(['p11'])

export const getVerificationContext = (id: string): Promise<VerificationContext | undefined> => {
  const p = HIM_PATIENTS.find((x) => x.id === id)
  if (!p) return resolve(undefined, 300)

  const patient = toBannerContract(p)

  const identifiers = getOrCreatePatientIdentifiers(id)
  const primaryIdentifier =
    identifiers.find((i) => i.type === 'NIN' && i.active) ?? identifiers.find((i) => i.active)

  const attributes: VerificationContext['attributes'] = [
    { key: 'mrn', label: 'MRN', expected: p.mrn },
    { key: 'name', label: 'Full name', expected: patient.displayName },
    { key: 'phone', label: 'Phone', expected: p.phone || 'Not on file' },
    { key: 'dob', label: 'Date of birth', expected: p.dateOfBirth ?? 'Not on file' },
    {
      key: 'id',
      label: primaryIdentifier ? `${primaryIdentifier.type} (ID)` : 'National ID',
      expected: primaryIdentifier ? primaryIdentifier.maskedValue : 'Not on file',
    },
  ]
  const matchScore = LOW_CONFIDENCE_IDS.has(id) ? 58 : 94

  return resolve({ patient, matchScore, attributes })
}
/* --------------------------------- S09 ----------------------------------- */

// Fake service/clinic options
const SERVICES = [
  'General OPD',
  'Paediatrics',
  'Obstetrics & Gynaecology',
  'Surgery',
  'Orthopaedics',
  'Emergency',
]

const QUEUES: Record<string, string[]> = {
  'General OPD': ['OPD Queue A', 'OPD Queue B'],
  Paediatrics: ['Paeds Room 1', 'Paeds Room 2'],
  'Obstetrics & Gynaecology': ['Obs/Gyn waiting'],
  Surgery: ['Pre-op waiting'],
  Orthopaedics: ['Ortho casting'],
  Emergency: ['Triage'],
}

export const checkinPatient = (draft: CheckinDraft): Promise<CheckinResult> => {
  const visitNumber = `V${String(Date.now()).slice(-6)}`
  const encounterId = `enc-${Date.now()}`
  const queueName = draft.destinationQueue || QUEUES[draft.service]?.[0] || 'General queue'

  return resolve(
    {
      encounterId,
      visitNumber,
      queuedAt: new Date().toISOString(),
      queueName,
    },
    500,
  )
}

export const getServices = (): Promise<string[]> => resolve(SERVICES)
export const getQueuesForService = (service: string): Promise<string[]> =>
  resolve(QUEUES[service] ?? [])

export const getDemographicsForEdit = (patientId: string): Promise<DemographicEditDraft> => {
  const p = HIM_PATIENTS.find((x) => x.id === patientId)
  if (!p) throw new Error('Patient not found')
  return resolve({
    fullName: p.fullName,
    sex: p.sex,
    dateOfBirth: p.dateOfBirth,
    estimatedAge: p.age,
    phone: p.phone,
    address: p.address ?? '',
    facility: p.facility,
    reason: '',
    supervisorApproved: false,
  })
}

export const updateDemographics = (
  patientId: string,
  draft: DemographicEditDraft,
): Promise<void> => {
  const p = HIM_PATIENTS.find((x) => x.id === patientId)
  if (!p) throw new Error('Patient not found')

  p.fullName = draft.fullName
  p.sex = draft.sex
  p.dateOfBirth = draft.dateOfBirth
  p.age = draft.estimatedAge
  p.phone = draft.phone
  p.address = draft.address // now valid
  if (draft.facility) p.facility = draft.facility

  return resolve(undefined, 300)
}

/* --------------------------------- S11 ----------------------------------- */
export const getPatientIdentifiers = (patientId: string): Promise<PatientIdentifier[]> =>
  resolve(getOrCreatePatientIdentifiers(patientId))

export const addPatientIdentifier = (
  patientId: string,
  identifier: Omit<PatientIdentifier, 'id'>,
): Promise<PatientIdentifier> => {
  const list = getOrCreatePatientIdentifiers(patientId)
  const newId: PatientIdentifier = { id: `idf-${nextIdentifierId++}`, ...identifier }
  list.push(newId)
  return resolve(newId)
}

export const updatePatientIdentifier = (
  patientId: string,
  identifierId: string,
  updates: Partial<PatientIdentifier>,
): Promise<PatientIdentifier> => {
  const list = getOrCreatePatientIdentifiers(patientId)
  const index = list.findIndex((x) => x.id === identifierId)
  if (index === -1) throw new Error('Identifier not found')
  list[index] = { ...list[index], ...updates }
  return resolve(list[index])
}

export const verifyPatientIdentifier = (
  patientId: string,
  identifierId: string,
): Promise<PatientIdentifier> =>
  updatePatientIdentifier(patientId, identifierId, {
    verified: true,
    verifiedAt: new Date().toISOString(),
    verifiedSource: 'HIM Officer',
  })

export const deactivatePatientIdentifier = (
  patientId: string,
  identifierId: string,
): Promise<PatientIdentifier> => updatePatientIdentifier(patientId, identifierId, { active: false })

export const unmaskIdentifierValue = (patientId: string, identifierId: string): Promise<string> => {
  const list = getOrCreatePatientIdentifiers(patientId)
  const idf = list.find((x) => x.id === identifierId)
  if (!idf) throw new Error('Identifier not found')
  return resolve(idf.value)
}

/* --------------------------------- S28 ----------------------------------- */
const offlineQueue: OfflineQueueItem[] = []

export const captureOfflineRegistration = (
  draft: OfflineRegistrationDraft,
): Promise<OfflineRegistrationResult> => {
  const id = `off-${Date.now()}`
  const temporaryId = `TEMP-${String(Date.now()).slice(-6)}`

  offlineQueue.push({
    id,
    temporaryId,
    fullName: draft.fullName || 'Unknown',
    capturedAt: new Date().toISOString(),
  })

  return resolve({ id, temporaryId, capturedAt: new Date().toISOString() }, 300)
}

export const getOfflineQueue = (): Promise<OfflineQueueItem[]> => resolve([...offlineQueue])

/* --------------------------------- S29 ----------------------------------- */
export const getOfflineRecordsForReconciliation = (): Promise<OfflineReconciliationRecord[]> => {
  return resolve(
    offlineQueue.map((item) => {
      // Build a simple duplicate check: search patients by name
      const q = item.fullName.toLowerCase()
      const duplicates = HIM_PATIENTS.filter((p) => {
        const name = p.fullName.toLowerCase()
        return name.includes(q) || q.includes(name)
      }).slice(0, 3) // at most 3 candidates

      const restricted = (p: (typeof HIM_PATIENTS)[number]) =>
        p.statusFlags.includes('restricted' as PatientStatusFlag)
      const candidates: PatientSearchResult[] = duplicates.map((p) => ({
        id: p.id,
        mrn: p.mrn,
        displayName: restricted(p) ? maskName(p.fullName) : p.fullName,
        age: p.age,
        sex: p.sex,
        statusFlags: p.statusFlags,
        lastVisit: p.lastVisit,
        facility: p.facility,
        restrictedStub: restricted(p),
      }))

      // Proposed fields from the offline item
      const proposedFullName = item.fullName
      const proposedSex: PatientSex = 'unknown'
      const proposedEstimatedAge: number | null = null
      const proposedFacility = FACILITIES[0]

      const conflicts: string[] = []
      if (candidates.length > 0) conflicts.push('fullName')

      return {
        item,
        duplicateCandidates: candidates,
        proposedFullName,
        proposedSex,
        proposedEstimatedAge,
        proposedFacility,
        conflicts,
      }
    }),
    500,
  )
}

export const commitOfflineRecord = async (
  draft: CommitOfflineRecordDraft,
): Promise<RegisterPatientResult> => {
  const index = offlineQueue.findIndex((r) => r.id === draft.offlineId)
  if (index === -1) throw new Error('Offline record not found')

  const allocated = await allocatePermanentMrn(draft.facility)
  const id = `off-committed-${Date.now()}-${allocated.sequence}`
  const mrn = allocated.mrn

  // Add to HIM_PATIENTS
  HIM_PATIENTS.push({
    id,
    mrn,
    fullName: draft.fullName,
    age: draft.estimatedAge,
    sex: draft.sex,
    phone: '',
    facility: draft.facility,
    lastVisit: null,
    statusFlags: [],
    dateOfBirth: null,
    allergies: [],
    coverage: null,
  })

  // Remove from offline queue
  offlineQueue.splice(index, 1)

  return resolve({ id, mrn }, 600)
}

/* --------------------------------- S30 ----------------------------------- */
const migrationJobs: MigrationJob[] = []

export const getMigrationJobs = (): Promise<MigrationJob[]> => resolve([...migrationJobs])

export const createMigrationJob = (name: string): Promise<MigrationJob> => {
  const job: MigrationJob = {
    id: `mig-${Date.now()}`,
    name,
    status: 'draft',
    uploadedAt: new Date().toISOString(),
    totalRows: 0,
    mapping: [],
    validationErrors: [],
    duplicateCandidates: [],
    rehearsalResult: null,
    committedAt: null,
  }
  migrationJobs.push(job)
  return resolve(job)
}

export const updateMigrationMapping = (
  jobId: string,
  mapping: MigrationFieldMapping[],
): Promise<MigrationJob> => {
  const job = migrationJobs.find((j) => j.id === jobId)
  if (!job) throw new Error('Job not found')
  job.mapping = mapping
  job.status = 'mapped'
  // Simulate parsing: generate random rows
  job.totalRows = 20 + Math.floor(Math.random() * 30)
  return resolve(job)
}

export const validateMigration = (jobId: string): Promise<MigrationJob> => {
  const job = migrationJobs.find((j) => j.id === jobId)
  if (!job) throw new Error('Job not found')
  job.validationErrors = []
  for (let i = 0; i < Math.min(5, job.totalRows); i++) {
    if (Math.random() > 0.5) {
      job.validationErrors.push({
        row: i + 1,
        field: 'dateOfBirth',
        message: 'Invalid date format',
      })
    }
  }
  job.status = 'validated'
  return resolve(job)
}

export const rehearseMigration = (jobId: string): Promise<MigrationJob> => {
  const job = migrationJobs.find((j) => j.id === jobId)
  if (!job) throw new Error('Job not found')
  job.duplicateCandidates = [
    {
      existingPatientId: 'p1',
      displayName: 'Ngozi Eze',
      mrn: '004-2213',
      matchFields: ['fullName'],
    },
  ]
  job.rehearsalResult = {
    totalRows: job.totalRows,
    validRows: job.totalRows - job.validationErrors.length,
    errorRows: job.validationErrors.length,
    duplicateRows: 1,
    samplePatients: [
      { fullName: 'Sample Patient A', mrn: 'MRN-001001' },
      { fullName: 'Sample Patient B', mrn: 'MRN-001002' },
    ],
  }
  job.status = 'rehearsed'
  return resolve(job)
}

export const commitMigration = (jobId: string): Promise<MigrationJob> => {
  const job = migrationJobs.find((j) => j.id === jobId)
  if (!job) throw new Error('Job not found')
  job.status = 'committed'
  job.committedAt = new Date().toISOString()
  return resolve(job)
}

export const rollbackMigration = (jobId: string): Promise<MigrationJob> => {
  const job = migrationJobs.find((j) => j.id === jobId)
  if (!job) throw new Error('Job not found')
  job.status = 'rolled_back'
  return resolve(job)
}
