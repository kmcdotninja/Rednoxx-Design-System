import type { NotificationItem } from '@/components/blocks'

/**
 * Mock data for the HIM (Health Information Management) module demo.
 * Vocabulary — record statuses, duplicate decisions, release states, roles —
 * follows the REDNOXX HIM SRS v0.2 and Workflow Catalogue v1.0 verbatim
 * (docs/REDNOXX_HIM_Module_Detailed_SRS_v0.2.md and companions).
 */

/* ---- Patients (Master Patient Index) ------------------------------------ */

export type RecordStatus =
  | 'permanent'
  | 'temporary'
  | 'provisional'
  | 'merged'
  | 'restricted'
  | 'deceased'
  | 'inactive'
  | 'archived'
  | 'duplicate-suspected'

export type PatientCategory = 'cash' | 'NHIA' | 'HMO' | 'corporate' | 'staff' | 'welfare'

export interface HimIdentifier {
  type: string
  system: string
  value: string
  issuer: string
  verification: 'verified' | 'pending verification' | 'unverified'
  active: boolean
}

export interface HimEncounter {
  visitNumber: string
  servicePoint: string
  payerCategory: string
  status: 'planned' | 'in progress' | 'finished' | 'cancelled'
  start: string
  end?: string
}

export interface HimPatient {
  id: string
  mrn: string
  familyName: string
  givenNames: string
  /** dd MMM yyyy, or undefined when age is estimated (emergency/unknown). */
  dob?: string
  estimatedAge?: number
  sex: 'Female' | 'Male'
  phone?: string
  address?: string
  state?: string
  lga?: string
  category: PatientCategory
  recordStatus: RecordStatus
  /** Percent of required demographic/identifier fields present. */
  completeness: number
  missingFields?: string[]
  registered: string
  identifiers: HimIdentifier[]
  nextOfKin?: { name: string; relationship: string; phone: string; hasAuthority: boolean }
  coverage?: { payer: string; insuranceNumber: string; eligibility: 'active' | 'expired' | 'pending'; billingCategory: string }
  consents: { category: string; scope: string; status: 'captured' | 'withdrawn'; date: string }[]
  encounters?: HimEncounter[]
  /** Mother-baby and similar record linkages (W-HIM-012). */
  linkedRecords?: { patientId: string; relationship: string }[]
}

export const HIM_PATIENTS: HimPatient[] = [
  {
    id: 'hp1',
    mrn: 'GGH-004213',
    familyName: 'Eze',
    givenNames: 'Ngozi Amara',
    dob: '14 Mar 1992',
    sex: 'Female',
    phone: '+234 803 221 4410',
    address: '12 Awolowo Rd, Garki',
    state: 'FCT',
    lga: 'Abuja Municipal',
    category: 'HMO',
    recordStatus: 'permanent',
    completeness: 100,
    registered: '02 Feb 2024',
    identifiers: [
      { type: 'MRN', system: 'urn:rednoxx:garki-general', value: 'GGH-004213', issuer: 'Garki General Hospital', verification: 'verified', active: true },
      { type: 'NIN', system: 'urn:nimc:nin', value: '••••••2841', issuer: 'NIMC', verification: 'verified', active: true },
      { type: 'Insurance number', system: 'urn:hygeia:member', value: 'HYG-118-2213', issuer: 'Hygeia HMO', verification: 'verified', active: true },
    ],
    nextOfKin: { name: 'Chinedu Eze', relationship: 'Husband', phone: '+234 803 221 4411', hasAuthority: true },
    coverage: { payer: 'Hygeia HMO', insuranceNumber: 'HYG-118-2213', eligibility: 'active', billingCategory: 'Family Gold' },
    consents: [
      { category: 'Treatment', scope: 'All encounters at facility', status: 'captured', date: '02 Feb 2024' },
      { category: 'Disclosure — payer', scope: 'Claims to Hygeia HMO', status: 'captured', date: '02 Feb 2024' },
    ],
    encounters: [
      { visitNumber: 'V-2026-08812', servicePoint: 'OPD — General practice', payerCategory: 'HMO', status: 'finished', start: '12 Jun 2026 · 09:40', end: '12 Jun 2026 · 10:05' },
      { visitNumber: 'V-2026-09104', servicePoint: 'Laboratory — phlebotomy', payerCategory: 'HMO', status: 'in progress', start: 'Today · 08:20' },
    ],
  },
  {
    id: 'hp2',
    mrn: 'GGH-004876',
    familyName: 'Bakare',
    givenNames: 'Tunde Olusegun',
    dob: '02 Aug 1985',
    sex: 'Male',
    phone: '+234 805 118 9034',
    address: '4 Allen Ave, Ikeja',
    state: 'Lagos',
    lga: 'Ikeja',
    category: 'NHIA',
    recordStatus: 'duplicate-suspected',
    completeness: 92,
    missingFields: ['Ward/community'],
    registered: '17 Jun 2026',
    identifiers: [
      { type: 'MRN', system: 'urn:rednoxx:garki-general', value: 'GGH-004876', issuer: 'Garki General Hospital', verification: 'verified', active: true },
      { type: 'Phone', system: 'urn:phone', value: '+234 805 118 9034', issuer: 'Self-reported', verification: 'unverified', active: true },
    ],
    nextOfKin: { name: 'Sade Bakare', relationship: 'Wife', phone: '+234 805 118 9035', hasAuthority: false },
    coverage: { payer: 'NHIA', insuranceNumber: 'NHIA-220-4471', eligibility: 'active', billingCategory: 'Formal sector' },
    consents: [{ category: 'Treatment', scope: 'All encounters at facility', status: 'captured', date: '17 Jun 2026' }],
  },
  {
    id: 'hp3',
    mrn: 'GGH-001102',
    familyName: 'Bakare',
    givenNames: 'Tunde O.',
    dob: '02 Aug 1985',
    sex: 'Male',
    phone: '+234 805 118 9034',
    address: 'Allen Avenue, Ikeja',
    state: 'Lagos',
    lga: 'Ikeja',
    category: 'cash',
    recordStatus: 'duplicate-suspected',
    completeness: 74,
    missingFields: ['NIN', 'Next of kin', 'Ward/community'],
    registered: '03 Nov 2021',
    identifiers: [
      { type: 'Legacy MRN', system: 'urn:legacy:gghis', value: 'L-88213', issuer: 'GGH legacy system', verification: 'verified', active: true },
      { type: 'MRN', system: 'urn:rednoxx:garki-general', value: 'GGH-001102', issuer: 'Garki General Hospital', verification: 'verified', active: true },
    ],
    consents: [{ category: 'Treatment', scope: 'All encounters at facility', status: 'captured', date: '03 Nov 2021' }],
  },
  {
    id: 'hp4',
    mrn: 'TEMP-0091',
    familyName: 'Unknown',
    givenNames: 'A&E Male 0091',
    estimatedAge: 35,
    sex: 'Male',
    category: 'cash',
    recordStatus: 'temporary',
    completeness: 28,
    missingFields: ['Family name', 'Given names', 'DOB', 'NIN', 'Address', 'Next of kin'],
    registered: 'Today · 06:42',
    identifiers: [
      { type: 'Temporary emergency ID', system: 'urn:rednoxx:temp', value: 'TEMP-0091', issuer: 'A&E registration', verification: 'unverified', active: true },
    ],
    consents: [],
  },
  {
    id: 'hp5',
    mrn: 'GGH-003448',
    familyName: 'Danladi',
    givenNames: 'Hassan',
    dob: '30 Jan 1958',
    sex: 'Male',
    phone: '+234 806 400 1123',
    address: '9 Zaria Rd, Kaduna',
    state: 'Kaduna',
    lga: 'Kaduna North',
    category: 'welfare',
    recordStatus: 'restricted',
    completeness: 100,
    registered: '11 Sep 2023',
    identifiers: [
      { type: 'MRN', system: 'urn:rednoxx:garki-general', value: 'GGH-003448', issuer: 'Garki General Hospital', verification: 'verified', active: true },
      { type: 'NIN', system: 'urn:nimc:nin', value: '••••••7702', issuer: 'NIMC', verification: 'verified', active: true },
    ],
    nextOfKin: { name: 'Amina Danladi', relationship: 'Daughter', phone: '+234 806 400 1124', hasAuthority: true },
    consents: [
      { category: 'Treatment', scope: 'All encounters at facility', status: 'captured', date: '11 Sep 2023' },
      { category: 'Disclosure — third party', scope: 'Any external disclosure', status: 'withdrawn', date: '02 May 2026' },
    ],
    encounters: [
      { visitNumber: 'V-2026-09090', servicePoint: 'A&E — resuscitation', payerCategory: 'welfare', status: 'in progress', start: 'Today · 06:30' },
      { visitNumber: 'V-2025-04471', servicePoint: 'Psychiatry — outpatient', payerCategory: 'welfare', status: 'finished', start: '03 Nov 2025 · 11:00', end: '03 Nov 2025 · 11:40' },
    ],
  },
  {
    id: 'hp6',
    mrn: 'GGH-002731',
    familyName: 'Okafor',
    givenNames: 'Ada Chiamaka',
    dob: '22 Sep 1968',
    sex: 'Female',
    phone: '+234 813 774 0921',
    address: '31 Ogui Rd, Enugu',
    state: 'Enugu',
    lga: 'Enugu North',
    category: 'HMO',
    recordStatus: 'permanent',
    completeness: 96,
    missingFields: ['Email'],
    registered: '08 Apr 2022',
    identifiers: [
      { type: 'MRN', system: 'urn:rednoxx:garki-general', value: 'GGH-002731', issuer: 'Garki General Hospital', verification: 'verified', active: true },
      { type: 'NIN', system: 'urn:nimc:nin', value: '••••••0446', issuer: 'NIMC', verification: 'pending verification', active: true },
      { type: 'Insurance number', system: 'urn:axa:member', value: 'AXA-990-1102', issuer: 'AXA Mansard', verification: 'verified', active: true },
    ],
    nextOfKin: { name: 'Obi Okafor', relationship: 'Son', phone: '+234 813 774 0922', hasAuthority: true },
    coverage: { payer: 'AXA Mansard', insuranceNumber: 'AXA-990-1102', eligibility: 'active', billingCategory: 'Corporate' },
    consents: [{ category: 'Treatment', scope: 'All encounters at facility', status: 'captured', date: '08 Apr 2022' }],
  },
  {
    id: 'hp7',
    mrn: 'GGH-000913',
    familyName: 'Adeyemi',
    givenNames: 'Folake',
    dob: '05 Dec 1990',
    sex: 'Female',
    phone: '+234 802 664 8710',
    state: 'Oyo',
    lga: 'Ibadan North',
    category: 'cash',
    recordStatus: 'merged',
    completeness: 100,
    registered: '19 Mar 2020',
    identifiers: [
      { type: 'MRN', system: 'urn:rednoxx:garki-general', value: 'GGH-000913', issuer: 'Garki General Hospital', verification: 'verified', active: false },
    ],
    consents: [],
  },
  {
    id: 'hp8',
    mrn: 'GGH-005027',
    familyName: 'Lawal',
    givenNames: 'Baby of Zainab',
    dob: '06 Jul 2026',
    sex: 'Female',
    category: 'HMO',
    recordStatus: 'provisional',
    completeness: 61,
    missingFields: ['Given names (formal)', 'Birth certificate number'],
    registered: 'Yesterday · 21:15',
    identifiers: [
      { type: 'MRN', system: 'urn:rednoxx:garki-general', value: 'GGH-005027', issuer: 'Garki General Hospital', verification: 'verified', active: true },
    ],
    nextOfKin: { name: 'Zainab Lawal', relationship: 'Mother', phone: '+234 810 556 2290', hasAuthority: true },
    consents: [{ category: 'Treatment', scope: 'Neonatal care — consent by mother', status: 'captured', date: 'Yesterday' }],
    linkedRecords: [{ patientId: 'hp13', relationship: 'Mother' }],
  },
  {
    id: 'hp13',
    mrn: 'GGH-002980',
    familyName: 'Lawal',
    givenNames: 'Zainab',
    dob: '27 Oct 1994',
    sex: 'Female',
    phone: '+234 810 556 2290',
    address: '26 Ikorodu Rd, Maryland, Lagos',
    state: 'Lagos',
    lga: 'Ikeja',
    category: 'HMO',
    recordStatus: 'permanent',
    completeness: 100,
    registered: '14 Jan 2025',
    identifiers: [
      { type: 'MRN', system: 'urn:rednoxx:garki-general', value: 'GGH-002980', issuer: 'Garki General Hospital', verification: 'verified', active: true },
      { type: 'Insurance number', system: 'urn:hygeia:member', value: 'HYG-118-1830', issuer: 'Hygeia HMO', verification: 'verified', active: true },
    ],
    nextOfKin: { name: 'Abdul Lawal', relationship: 'Husband', phone: '+234 810 556 2291', hasAuthority: true },
    coverage: { payer: 'Hygeia HMO', insuranceNumber: 'HYG-118-1830', eligibility: 'active', billingCategory: 'Family Silver' },
    consents: [{ category: 'Treatment', scope: 'All encounters at facility', status: 'captured', date: '14 Jan 2025' }],
    encounters: [
      { visitNumber: 'V-2026-09061', servicePoint: 'Maternity — delivery', payerCategory: 'HMO', status: 'finished', start: 'Yesterday · 19:40', end: 'Yesterday · 23:55' },
    ],
    linkedRecords: [{ patientId: 'hp8', relationship: 'Baby' }],
  },
  {
    id: 'hp9',
    mrn: 'GGH-004990',
    familyName: 'Mensah',
    givenNames: 'Kwame',
    dob: '19 May 1979',
    sex: 'Male',
    phone: '+233 24 555 0192',
    address: 'Transcorp Hilton (temporary), Abuja',
    state: 'FCT',
    lga: 'Abuja Municipal',
    category: 'cash',
    recordStatus: 'permanent',
    completeness: 88,
    missingFields: ['LGA of residence', 'Ward/community'],
    registered: '28 Jun 2026',
    identifiers: [
      { type: 'MRN', system: 'urn:rednoxx:garki-general', value: 'GGH-004990', issuer: 'Garki General Hospital', verification: 'verified', active: true },
      { type: 'Alternative ID — passport', system: 'urn:gha:passport', value: 'G••••382', issuer: 'Republic of Ghana', verification: 'verified', active: true },
    ],
    nextOfKin: { name: 'Abena Mensah', relationship: 'Wife (abroad)', phone: '+233 24 555 0193', hasAuthority: false },
    consents: [{ category: 'Treatment', scope: 'All encounters at facility', status: 'captured', date: '28 Jun 2026' }],
    encounters: [
      { visitNumber: 'V-2026-08998', servicePoint: 'OPD — General practice', payerCategory: 'cash', status: 'finished', start: '28 Jun 2026 · 14:10', end: '28 Jun 2026 · 14:35' },
    ],
  },
  {
    id: 'hp10',
    mrn: 'GGH-005011',
    familyName: 'Yusuf',
    givenNames: 'Maryam',
    dob: '09 Feb 2015',
    sex: 'Female',
    address: '7 Sokoto Rd, Kaduna',
    state: 'Kaduna',
    lga: 'Kaduna South',
    category: 'NHIA',
    recordStatus: 'permanent',
    completeness: 100,
    registered: '30 Jun 2026',
    identifiers: [
      { type: 'MRN', system: 'urn:rednoxx:garki-general', value: 'GGH-005011', issuer: 'Garki General Hospital', verification: 'verified', active: true },
      { type: 'Birth certificate number', system: 'urn:npc:birth', value: 'KD-2015-44821', issuer: 'National Population Commission', verification: 'verified', active: true },
    ],
    nextOfKin: { name: 'Ibrahim Yusuf', relationship: 'Father · Guardian', phone: '+234 803 900 4451', hasAuthority: true },
    coverage: { payer: 'NHIA', insuranceNumber: 'NHIA-771-2098', eligibility: 'active', billingCategory: 'Dependant' },
    consents: [
      { category: 'Treatment', scope: 'Consent by guardian — father, evidence on file', status: 'captured', date: '30 Jun 2026' },
    ],
    encounters: [
      { visitNumber: 'V-2026-09077', servicePoint: 'Paediatrics — OPD', payerCategory: 'NHIA', status: 'planned', start: 'Thu · 10:40' },
    ],
  },
  {
    id: 'hp11',
    mrn: 'GGH-000388',
    familyName: 'Adebayo',
    givenNames: 'Samuel',
    dob: '11 Jul 1949',
    sex: 'Male',
    phone: '+234 802 118 7345',
    address: '2 Marina Rd, Lagos Island',
    state: 'Lagos',
    lga: 'Lagos Island',
    category: 'HMO',
    recordStatus: 'deceased',
    completeness: 100,
    registered: '15 Jan 2019',
    identifiers: [
      { type: 'MRN', system: 'urn:rednoxx:garki-general', value: 'GGH-000388', issuer: 'Garki General Hospital', verification: 'verified', active: true },
      { type: 'NIN', system: 'urn:nimc:nin', value: '••••••5510', issuer: 'NIMC', verification: 'verified', active: true },
    ],
    nextOfKin: { name: 'Grace Adebayo', relationship: 'Wife', phone: '+234 802 118 7346', hasAuthority: true },
    consents: [{ category: 'Treatment', scope: 'All encounters at facility', status: 'captured', date: '15 Jan 2019' }],
    encounters: [
      { visitNumber: 'V-2026-07541', servicePoint: 'ICU — cardiology', payerCategory: 'HMO', status: 'finished', start: '02 May 2026 · 23:15', end: '04 May 2026 · 06:10' },
    ],
  },
  {
    id: 'hp12',
    mrn: 'GGH-000401',
    familyName: 'Chukwu',
    givenNames: 'Ifeoma',
    dob: '25 Apr 1987',
    sex: 'Female',
    phone: '+234 810 445 8821',
    state: 'Anambra',
    lga: 'Awka South',
    category: 'cash',
    recordStatus: 'inactive',
    completeness: 81,
    missingFields: ['Address line', 'Next of kin'],
    registered: '22 Mar 2019',
    identifiers: [
      { type: 'MRN', system: 'urn:rednoxx:garki-general', value: 'GGH-000401', issuer: 'Garki General Hospital', verification: 'verified', active: true },
    ],
    consents: [{ category: 'Treatment', scope: 'All encounters at facility', status: 'captured', date: '22 Mar 2019' }],
  },
]

export function himPatientById(id: string | undefined): HimPatient | undefined {
  return HIM_PATIENTS.find((p) => p.id === id)
}

export function patientDisplayName(p: HimPatient): string {
  return `${p.givenNames} ${p.familyName}`
}

/* ---- Duplicate review queue (W-HIM-019/020/021) -------------------------- */

export type DuplicateDecision = 'duplicate confirmed' | 'not duplicate' | 'insufficient information' | 'defer'

export interface DuplicateCandidate {
  id: string
  recordAId: string
  recordBId: string
  matchScore: number
  matchingFields: string[]
  status: 'pending review' | DuplicateDecision
  flaggedBy: string
  flagged: string
}

export const DUPLICATE_CANDIDATES: DuplicateCandidate[] = [
  {
    id: 'dup1',
    recordAId: 'hp2',
    recordBId: 'hp3',
    matchScore: 0.94,
    matchingFields: ['Family name', 'DOB', 'Sex', 'Phone'],
    status: 'pending review',
    flaggedBy: 'System — registration duplicate check',
    flagged: 'Today · 09:12',
  },
  {
    id: 'dup2',
    recordAId: 'hp6',
    recordBId: 'hp7',
    matchScore: 0.71,
    matchingFields: ['Given names (partial)', 'State'],
    status: 'not duplicate',
    flaggedBy: 'Front Desk — B. Adamu',
    flagged: 'Yesterday · 14:30',
  },
  {
    id: 'dup3',
    recordAId: 'hp4',
    recordBId: 'hp5',
    matchScore: 0.58,
    matchingFields: ['Sex', 'Estimated age range'],
    status: 'insufficient information',
    flaggedBy: 'System — reconciliation sweep',
    flagged: 'Today · 07:05',
  },
  {
    id: 'dup4',
    recordAId: 'hp12',
    recordBId: 'hp6',
    matchScore: 0.66,
    matchingFields: ['Given names (phonetic)', 'Sex'],
    status: 'defer',
    flaggedBy: 'Migration team — legacy import batch 12',
    flagged: '29 Jun 2026',
  },
]

/* ---- Documents (W-HIM-025/026/027) --------------------------------------- */

export type DocumentStatus = 'indexed' | 'pending index' | 'superseded' | 'created-in-error' | 'unbound legacy'

export interface HimDocument {
  id: string
  patientId?: string
  patientLabel: string
  type: string
  source: string
  confidentiality: 'normal' | 'restricted'
  status: DocumentStatus
  version: number
  uploadedBy: string
  uploaded: string
}

export const HIM_DOCUMENTS: HimDocument[] = [
  { id: 'doc1', patientId: 'hp1', patientLabel: 'Ngozi Eze · GGH-004213', type: 'Discharge summary', source: 'Clinical — consultation', confidentiality: 'normal', status: 'indexed', version: 1, uploadedBy: 'Dr. Sani Ahmed', uploaded: 'Today · 08:40' },
  { id: 'doc2', patientId: 'hp5', patientLabel: 'Hassan Danladi · GGH-003448', type: 'Psychiatric evaluation', source: 'Scanned — HIM office', confidentiality: 'restricted', status: 'indexed', version: 2, uploadedBy: 'HIM — F. Ibrahim', uploaded: 'Yesterday · 11:22' },
  { id: 'doc3', patientId: 'hp6', patientLabel: 'Ada Okafor · GGH-002731', type: 'Operation note', source: 'Clinical — theatre', confidentiality: 'normal', status: 'pending index', version: 1, uploadedBy: 'Dr. Ada Okeke', uploaded: 'Today · 07:58' },
  { id: 'doc4', patientId: 'hp1', patientLabel: 'Ngozi Eze · GGH-004213', type: 'Referral letter', source: 'Scanned — front desk', confidentiality: 'normal', status: 'superseded', version: 1, uploadedBy: 'HIM — F. Ibrahim', uploaded: '28 Jun 2026' },
  { id: 'doc5', patientLabel: 'Legacy batch 12 — unmatched', type: 'Antenatal card (paper)', source: 'Legacy scanning batch 12', confidentiality: 'normal', status: 'unbound legacy', version: 1, uploadedBy: 'Migration team', uploaded: '30 Jun 2026' },
  { id: 'doc6', patientId: 'hp2', patientLabel: 'Tunde Bakare · GGH-004876', type: 'Lab report', source: 'Clinical — laboratory', confidentiality: 'normal', status: 'created-in-error', version: 1, uploadedBy: 'Lab — M. Danjuma', uploaded: '01 Jul 2026' },
  { id: 'doc7', patientId: 'hp10', patientLabel: 'Maryam Yusuf · GGH-005011', type: 'Guardian consent form', source: 'Scanned — front desk', confidentiality: 'normal', status: 'indexed', version: 1, uploadedBy: 'Front Desk — B. Adamu', uploaded: '30 Jun 2026' },
  { id: 'doc8', patientId: 'hp9', patientLabel: 'Kwame Mensah · GGH-004990', type: 'Passport biodata page', source: 'Scanned — front desk', confidentiality: 'restricted', status: 'indexed', version: 1, uploadedBy: 'HIM — F. Ibrahim', uploaded: '28 Jun 2026' },
  { id: 'doc9', patientId: 'hp11', patientLabel: 'Samuel Adebayo · GGH-000388', type: 'Death notification form', source: 'Clinical — ICU', confidentiality: 'restricted', status: 'indexed', version: 1, uploadedBy: 'Dr. Bisi Adeyemi', uploaded: '04 May 2026' },
  { id: 'doc10', patientId: 'hp3', patientLabel: 'Tunde O. Bakare · GGH-001102', type: 'OPD card (paper, 2019–2021)', source: 'Legacy scanning batch 12', confidentiality: 'normal', status: 'pending index', version: 1, uploadedBy: 'Migration team', uploaded: '30 Jun 2026' },
]

/* ---- Release of information (W-HIM-028/029/031) --------------------------- */

export type ReleaseStatus = 'created' | 'pending approval' | 'approved' | 'released' | 'rejected' | 'pended'
export type RequesterType = 'patient' | 'guardian' | 'legal' | 'payer' | 'internal clinical' | 'external provider'

export interface ReleaseRequest {
  id: string
  patientId: string
  requester: string
  requesterType: RequesterType
  authority: string
  purpose: string
  scope: string
  method: 'printed copy' | 'secure email' | 'portal' | 'courier'
  status: ReleaseStatus
  created: string
  approver?: string
  feeStatus?: 'paid' | 'awaiting payment' | 'waived'
}

export const RELEASE_REQUESTS: ReleaseRequest[] = [
  { id: 'rel1', patientId: 'hp1', requester: 'Ngozi Eze (self)', requesterType: 'patient', authority: 'Verified in person — NIN', purpose: 'Visa medical documentation', scope: 'Encounters Jan–Jun 2026', method: 'printed copy', status: 'pending approval', created: 'Today · 08:15', feeStatus: 'paid' },
  { id: 'rel2', patientId: 'hp6', requester: 'Hygeia HMO — claims unit', requesterType: 'payer', authority: 'Payer agreement + patient disclosure consent', purpose: 'Claim adjudication HYG-9921', scope: 'Operation note + invoice, 30 Jun 2026', method: 'secure email', status: 'approved', created: 'Yesterday · 10:02', approver: 'HIM Supervisor — U. Musa' },
  { id: 'rel3', patientId: 'hp5', requester: 'Barr. K. Yusuf', requesterType: 'legal', authority: 'Court order — pending verification', purpose: 'Litigation', scope: 'Full record', method: 'courier', status: 'pended', created: '02 Jul 2026' },
  { id: 'rel4', patientId: 'hp8', requester: 'Zainab Lawal (mother)', requesterType: 'guardian', authority: 'Guardian — birth record on file', purpose: 'Immunisation transfer', scope: 'Neonatal summary', method: 'portal', status: 'released', created: '30 Jun 2026', approver: 'HIM Supervisor — U. Musa' },
  { id: 'rel5', patientId: 'hp2', requester: 'Dr. Bisi Adeyemi', requesterType: 'internal clinical', authority: 'Treating clinician', purpose: 'Continuity of care', scope: 'Lab reports, last 12 months', method: 'portal', status: 'released', created: '28 Jun 2026', approver: 'Auto — internal clinical policy' },
  { id: 'rel6', patientId: 'hp11', requester: 'Grace Adebayo (widow)', requesterType: 'guardian', authority: 'Next of kin — legal authority evidence requested', purpose: 'Life insurance claim', scope: 'Death summary + final admission', method: 'printed copy', status: 'pending approval', created: 'Today · 09:02', feeStatus: 'awaiting payment' },
  { id: 'rel7', patientId: 'hp6', requester: 'Sunshine Employer Services Ltd', requesterType: 'external provider', authority: 'Employer request — NO patient consent on file', purpose: 'Pre-employment fitness check', scope: 'Full record', method: 'secure email', status: 'rejected', created: '25 Jun 2026', approver: 'HIM Supervisor — U. Musa' },
]

/* ---- Audit trail (W-HIM-040, NFR-HIM-AUD) --------------------------------- */

export interface HimAuditEvent {
  id: string
  actor: string
  role: string
  action: string
  patientLabel: string
  detail: string
  time: string
  tone: 'default' | 'brand' | 'success' | 'danger'
  breakGlass?: boolean
}

export const AUDIT_EVENTS: HimAuditEvent[] = [
  { id: 'a1', actor: 'Dr. Femi Alade', role: 'Clinician', action: 'Break-glass access', patientLabel: 'Hassan Danladi · GGH-003448', detail: 'Restricted record opened under emergency justification: "Unconscious in A&E, medication history needed." Time-bound access, 30 minutes. Review pending.', time: 'Today · 09:41', tone: 'danger', breakGlass: true },
  { id: 'a2', actor: 'U. Musa', role: 'HIM Supervisor', action: 'Merge completed', patientLabel: 'Folake Adeyemi · GGH-000913 → GGH-002731', detail: 'Non-survivor GGH-000913 marked as merged; 2 encounters and 3 documents redirected to survivor. Reason: confirmed same patient after NIN verification.', time: 'Yesterday · 16:20', tone: 'brand' },
  { id: 'a3', actor: 'F. Ibrahim', role: 'HIM Officer', action: 'Document status change', patientLabel: 'Tunde Bakare · GGH-004876', detail: 'Lab report marked created-in-error — uploaded to wrong patient. Incident review opened; original preserved.', time: '01 Jul 2026 · 13:05', tone: 'danger' },
  { id: 'a4', actor: 'B. Adamu', role: 'Front Desk Officer', action: 'Registration override', patientLabel: 'Tunde Bakare · GGH-004876', detail: 'Duplicate warning overridden with reason: "Patient insists prior card is his brother\'s." Saved as possible duplicate; review task created.', time: '17 Jun 2026 · 10:44', tone: 'default' },
  { id: 'a5', actor: 'U. Musa', role: 'HIM Supervisor', action: 'Release approved', patientLabel: 'Ada Okafor · GGH-002731', detail: 'Payer release to Hygeia HMO approved — minimum-necessary scope: operation note + invoice only.', time: 'Yesterday · 10:31', tone: 'success' },
  { id: 'a6', actor: 'System', role: 'Reconciliation sweep', action: 'Temporary record flagged', patientLabel: 'A&E Male 0091 · TEMP-0091', detail: 'Emergency temporary record older than 4 hours without identity reconciliation — added to reconciliation worklist.', time: 'Today · 10:42', tone: 'default' },
  { id: 'a7', actor: 'F. Ibrahim', role: 'HIM Officer', action: 'Identifier verified', patientLabel: 'Ada Okafor · GGH-002731', detail: 'NIN moved from pending verification to verified against NIMC lookup. Verification source and date recorded on the identifier.', time: 'Today · 08:05', tone: 'success' },
  { id: 'a8', actor: 'B. Adamu', role: 'Front Desk Officer', action: 'Demographic correction', patientLabel: 'Kwame Mensah · GGH-004990', detail: 'Address updated. Old value preserved: "Sheraton Hotel, Abuja" → "Transcorp Hilton (temporary), Abuja". No silent overwrite.', time: 'Yesterday · 15:47', tone: 'default' },
  { id: 'a9', actor: 'Dr. Bisi Adeyemi', role: 'Authorised Clinician', action: 'Deceased status set', patientLabel: 'Samuel Adebayo · GGH-000388', detail: 'Record marked deceased (04 May 2026) with death notification on file. Routine-care routing blocked; disclosure now requires authority evidence.', time: '04 May 2026 · 07:02', tone: 'default' },
  { id: 'a10', actor: 'U. Musa', role: 'HIM Supervisor', action: 'Release rejected', patientLabel: 'Ada Okafor · GGH-002731', detail: 'Employer request for full record rejected — no patient disclosure consent on file and scope exceeded minimum necessary.', time: '25 Jun 2026 · 12:20', tone: 'danger' },
  { id: 'a11', actor: 'REDNOXX Support — T. Eze', role: 'Support Lead', action: 'Controlled support access', patientLabel: 'Facility-wide (no patient data)', detail: 'Time-bound support session (45 min) under ticket RDX-4482 to investigate slow MPI search. Patient identifiers masked; session log retained.', time: '24 Jun 2026 · 17:30', tone: 'brand' },
]

/* ---- Dashboard KPIs (SRS §15 dashboards) ----------------------------------- */

export interface HimKpi {
  key: string
  label: string
  value: string
  sub: string
  delta?: string
  deltaTone?: 'up' | 'down'
}

export const HIM_KPIS: HimKpi[] = [
  { key: 'registrations', label: 'Registrations today', value: '47', sub: '5 desks · 3 walk-in scenarios', delta: '+12%', deltaTone: 'up' },
  { key: 'duplicates', label: 'Duplicate candidates pending', value: '1', sub: 'oldest flagged today 09:12', delta: '−2', deltaTone: 'up' },
  { key: 'releases', label: 'Release requests open', value: '2', sub: '1 pending approval · 1 pended', delta: '+1', deltaTone: 'down' },
  { key: 'incomplete', label: 'Incomplete records', value: '4', sub: 'oldest 4 years — legacy import', delta: '−3', deltaTone: 'up' },
]

/** Emergency/temporary records awaiting identity reconciliation (W-HIM-009/010/011). */
export const RECONCILIATION_WORKLIST = [
  { id: 'hp4', label: 'A&E Male 0091', tempId: 'TEMP-0091', age: '4h 12m', triage: 'Red — resus', assignee: 'Unassigned' },
  { id: 'hp8', label: 'Baby of Zainab Lawal', tempId: 'GGH-005027', age: '13h', triage: 'Routine — neonate', assignee: 'Maternity clerk' },
]

/* ---- Navbar notifications (HIM-scoped) ------------------------------------ */

export const HIM_NOTIFICATIONS: NotificationItem[] = [
  { id: 'hn1', title: 'Break-glass access awaiting review', description: 'Dr. Femi Alade opened the restricted record of Hassan Danladi under emergency justification.', time: '1h ago', severity: 'critical' },
  { id: 'hn2', title: 'High-confidence duplicate flagged', description: 'Tunde Bakare — two records matched on name, DOB, sex and phone (score 0.94).', time: '2h ago', severity: 'warning' },
  { id: 'hn3', title: 'Release request pending approval', description: 'Ngozi Eze requested her record for visa documentation — fee paid, awaiting supervisor approval.', time: '3h ago', severity: 'info' },
  { id: 'hn4', title: 'Temporary record unreconciled for 4h', description: 'A&E Male 0091 (TEMP-0091) still has no confirmed identity — on the reconciliation worklist.', time: 'Today', severity: 'warning', read: true },
]


/* ---- Data-subject requests (NDPA rights, W-HIM-041) ------------------------ */

export type DataRightsType =
  | 'data-subject access'
  | 'rectification'
  | 'restriction'
  | 'portability'

export interface DataRightsRequest {
  id: string
  patientId: string
  type: DataRightsType
  requester: string
  received: string
  due: string
  status: 'received' | 'in progress' | 'completed' | 'overdue'
  assignee: string
}

export const DATA_RIGHTS_REQUESTS: DataRightsRequest[] = [
  { id: 'dsr1', patientId: 'hp1', type: 'data-subject access', requester: 'Ngozi Eze (self)', received: '30 Jun 2026', due: '14 Jul 2026', status: 'in progress', assignee: 'DPO — K. Olawale' },
  { id: 'dsr2', patientId: 'hp6', type: 'rectification', requester: 'Ada Okafor (self)', received: '28 Jun 2026', due: '12 Jul 2026', status: 'in progress', assignee: 'HIM — F. Ibrahim' },
  { id: 'dsr3', patientId: 'hp5', type: 'restriction', requester: 'Hassan Danladi (self)', received: '02 May 2026', due: '16 May 2026', status: 'completed', assignee: 'DPO — K. Olawale' },
  { id: 'dsr4', patientId: 'hp12', type: 'portability', requester: 'Ifeoma Chukwu (self)', received: '20 Jun 2026', due: '04 Jul 2026', status: 'overdue', assignee: 'Unassigned' },
]

/* ---- Registration volume today (SRS §15 registration dashboard) ------------ */

export const REGISTRATIONS_TODAY = [
  { desk: 'Front desk 1', officer: 'B. Adamu', count: 14, categories: 'NHIA 6 · HMO 4 · cash 4' },
  { desk: 'Front desk 2', officer: 'C. Nwosu', count: 11, categories: 'cash 7 · HMO 3 · staff 1' },
  { desk: 'A&E registration', officer: 'S. Bello', count: 9, categories: 'emergency 6 · unknown 1 · cash 2' },
  { desk: 'Maternity desk', officer: 'H. Garba', count: 8, categories: 'neonate 3 · NHIA 5' },
  { desk: 'Records office', officer: 'F. Ibrahim', count: 5, categories: 'migration 4 · foreign 1' },
]

/* ---- Appointments & check-in (W-HIM-007/035) -------------------------------- */

export interface HimAppointment {
  id: string
  patientId: string
  time: string
  clinic: string
  serviceType: string
  status: 'scheduled' | 'checked-in' | 'late' | 'no-show'
}

export const HIM_APPOINTMENTS: HimAppointment[] = [
  { id: 'ap1', patientId: 'hp1', time: '09:00', clinic: 'OPD — General practice', serviceType: 'Follow-up', status: 'scheduled' },
  { id: 'ap2', patientId: 'hp10', time: '10:40', clinic: 'Paediatrics — OPD', serviceType: 'Review', status: 'scheduled' },
  { id: 'ap3', patientId: 'hp6', time: '08:20', clinic: 'Surgical outpatient', serviceType: 'Post-op review', status: 'checked-in' },
  { id: 'ap4', patientId: 'hp2', time: '08:00', clinic: 'OPD — General practice', serviceType: 'Consultation', status: 'late' },
  { id: 'ap5', patientId: 'hp9', time: 'Yesterday 14:00', clinic: 'OPD — General practice', serviceType: 'Consultation', status: 'no-show' },
]

export const QUEUE_TARGETS = ['Clinic queue', 'Triage', 'Billing first (payer prerequisite)', 'Laboratory'] as const

/* ---- Referral register (W-HIM-033) ------------------------------------------ */

export interface HimReferral {
  id: string
  patientId: string
  direction: 'inbound' | 'outbound'
  otherFacility: string
  service: string
  reason: string
  status: 'received' | 'registered' | 'sent' | 'completed'
  date: string
}

export const HIM_REFERRALS: HimReferral[] = [
  { id: 'ref1', patientId: 'hp6', direction: 'inbound', otherFacility: 'Enugu Teaching Hospital', service: 'Ophthalmic surgery', reason: 'Cataract extraction — pre-op workup done', status: 'registered', date: '30 Jun 2026' },
  { id: 'ref2', patientId: 'hp5', direction: 'outbound', otherFacility: 'National Hospital Abuja', service: 'Nephrology', reason: 'Declining renal function — specialist review', status: 'sent', date: '28 Jun 2026' },
  { id: 'ref3', patientId: 'hp10', direction: 'inbound', otherFacility: 'Kaduna South PHC', service: 'Paediatrics', reason: 'Recurrent febrile episodes', status: 'completed', date: '30 Jun 2026' },
]

/* ---- Downtime & offline sync (W-HIM-037/038) --------------------------------- */

export interface DowntimeRecord {
  id: string
  label: string
  capturedAt: string
  desk: string
  syncStatus: 'pending reconciliation' | 'bound' | 'conflict'
  note: string
}

export const DOWNTIME_RECORDS: DowntimeRecord[] = [
  { id: 'dt1', label: 'Chika Obi (paper form 0042)', capturedAt: '05 Jul 2026 · 11:20', desk: 'Front desk 1', syncStatus: 'bound', note: 'Matched to GGH-002214 on sync — no conflicts.' },
  { id: 'dt2', label: 'Aisha Bello (paper form 0043)', capturedAt: '05 Jul 2026 · 11:35', desk: 'Front desk 2', syncStatus: 'conflict', note: 'Phone differs from existing record — manual review assigned.' },
  { id: 'dt3', label: 'New registration (paper form 0044)', capturedAt: '05 Jul 2026 · 11:50', desk: 'A&E registration', syncStatus: 'pending reconciliation', note: 'Awaiting duplicate check against MPI.' },
]

/* ---- Migration staging (W-HIM-039) ------------------------------------------- */

export interface MigrationBatch {
  id: string
  source: string
  imported: number
  bound: number
  exceptions: number
  duplicates: number
  status: 'in review' | 'closed' | 'binding'
  signOff?: string
}

export const MIGRATION_BATCHES: MigrationBatch[] = [
  { id: 'batch-11', source: 'GGH legacy HIS (2015–2019)', imported: 4210, bound: 4198, exceptions: 8, duplicates: 4, status: 'closed', signOff: 'HIM Supervisor — U. Musa · 12 Jun 2026' },
  { id: 'batch-12', source: 'Paper archive scans (2019–2021)', imported: 1874, bound: 1791, exceptions: 61, duplicates: 22, status: 'in review' },
  { id: 'batch-13', source: 'Maternity register (2022)', imported: 640, bound: 0, exceptions: 0, duplicates: 0, status: 'binding' },
]

/* ---- Configuration change requests (W-HIM-044) -------------------------------- */

export interface ConfigChange {
  id: string
  item: string
  change: string
  requester: string
  status: 'pending approval' | 'approved' | 'rejected' | 'live'
  note: string
}

export const CONFIG_CHANGES: ConfigChange[] = [
  { id: 'cfg1', item: 'MRN pattern', change: 'Add check digit to new MRNs (GGH-XXXXXX-C)', requester: 'Facility Admin — D. Okon', status: 'pending approval', note: 'Existing MRNs are not retroactively altered. Needs product + clinical governance sign-off.' },
  { id: 'cfg2', item: 'Duplicate threshold', change: 'Raise auto-flag threshold 0.85 → 0.88', requester: 'HIM Supervisor — U. Musa', status: 'approved', note: 'Tested against 90-day candidate history; goes live Sunday 02:00.' },
  { id: 'cfg3', item: 'Registration form', change: 'Make ward/community mandatory for NHIA', requester: 'Facility Admin — D. Okon', status: 'rejected', note: 'Rejected: would block emergency path; safety-critical fields cannot be tightened without review.' },
  { id: 'cfg4', item: 'Document types', change: 'Add "Police report" with restricted default', requester: 'HIM Officer — F. Ibrahim', status: 'live', note: 'Versioned; rollback available.' },
]

/* ---- Support access sessions (W-HIM-043) --------------------------------------- */

export interface SupportSession {
  id: string
  ticket: string
  engineer: string
  scope: string
  window: string
  status: 'active' | 'expired' | 'revoked'
  masked: boolean
}

export const SUPPORT_SESSIONS: SupportSession[] = [
  { id: 'sup1', ticket: 'RDX-4482', engineer: 'T. Eze', scope: 'MPI search performance — no patient data', window: '24 Jun 2026 · 17:30–18:15', status: 'expired', masked: true },
  { id: 'sup2', ticket: 'RDX-4511', engineer: 'M. Adeola', scope: 'Document indexing queue — metadata only', window: 'Today · 14:00–15:00', status: 'active', masked: true },
]

/* ---- FHIR / DHIN validation runs (W-HIM-045) ------------------------------------ */

export interface FhirRun {
  id: string
  resource: string
  profile: string
  payloads: number
  result: 'pass' | 'pass with warnings' | 'fail'
  note: string
  ran: string
}

export const FHIR_RUNS: FhirRun[] = [
  { id: 'fhir1', resource: 'Patient', profile: 'NgPatient (Nigeria Core)', payloads: 128, result: 'pass', note: 'All identifier slices valid (MedicalRecordsNumber, NationalIDNo).', ran: 'Today · 06:00' },
  { id: 'fhir2', resource: 'Consent', profile: 'NgConsent', payloads: 41, result: 'pass with warnings', note: '3 payloads missing representativeId for guardian consents — logged, not blocking.', ran: 'Today · 06:00' },
  { id: 'fhir3', resource: 'DocumentReference', profile: 'DHIN DocumentReference', payloads: 87, result: 'fail', note: 'Mapping gap: confidentiality code system mismatch. Gap logged; conformance NOT claimed. Remediation task open.', ran: 'Today · 06:00' },
]

/* ---- Facility administration: facilities, departments, wards --------------------
   Realises the Facility Administrator actor (catalogue §4: "Configures
   facilities, departments, MRN rules, forms, document types, queues and
   roles"); changes to it are governed by W-HIM-044.
   The organisational spine every other HIM record hangs off: a patient is
   registered AT a facility, routed TO a department, and admitted INTO a ward.
   Configured by the Facility Admin (RBAC `manageConfig`). */

export type FacilityType =
  | 'Teaching hospital'
  | 'General hospital'
  | 'Cottage hospital'
  | 'Primary health centre'
  | 'Clinic'

/** Shared lifecycle for org units — inactive units stop accepting new activity. */
export type OrgStatus = 'active' | 'inactive'

export interface HimFacility {
  id: string
  name: string
  /** Unique across the network — appears on slips and identifiers. */
  code: string
  type: FacilityType
  /** Service tier 1–3 (PHC → tertiary). */
  tier: 1 | 2 | 3
  lga: string
  state: string
  address: string
  phone: string
  status: OrgStatus
}

export const HIM_ORG_FACILITIES: HimFacility[] = [
  { id: 'f1', name: 'Garki General Hospital', code: 'GGH-001', type: 'General hospital', tier: 2, lga: 'AMAC', state: 'FCT', address: 'Area 3, Garki, Abuja', phone: '+234 9 234 5100', status: 'active' },
  { id: 'f2', name: 'Wuse District Hospital', code: 'WDH-002', type: 'General hospital', tier: 2, lga: 'AMAC', state: 'FCT', address: 'Zone 5, Wuse, Abuja', phone: '+234 9 234 5200', status: 'active' },
  { id: 'f3', name: 'Asokoro Model PHC', code: 'AMP-003', type: 'Primary health centre', tier: 1, lga: 'AMAC', state: 'FCT', address: 'Asokoro District, Abuja', phone: '+234 9 234 5300', status: 'active' },
  { id: 'f4', name: 'Gwarinpa General Hospital', code: 'GWH-004', type: 'General hospital', tier: 2, lga: 'AMAC', state: 'FCT', address: '3rd Avenue, Gwarinpa, Abuja', phone: '+234 9 234 5400', status: 'inactive' },
]

export type DepartmentType = 'clinical' | 'diagnostic' | 'support' | 'administrative'

export interface HimDepartment {
  id: string
  name: string
  code: string
  facilityId: string
  type: DepartmentType
  head: string
  status: OrgStatus
}

export const HIM_DEPARTMENTS: HimDepartment[] = [
  { id: 'd1', name: 'Health Information Management', code: 'HIM', facilityId: 'f1', type: 'administrative', head: 'Funmi Ibrahim', status: 'active' },
  { id: 'd2', name: 'Accident & Emergency', code: 'A&E', facilityId: 'f1', type: 'clinical', head: 'Dr. Bola Adeyemi', status: 'active' },
  { id: 'd3', name: 'General Outpatient', code: 'GOPD', facilityId: 'f1', type: 'clinical', head: 'Dr. Ngozi Eze', status: 'active' },
  { id: 'd4', name: 'Internal Medicine', code: 'MED', facilityId: 'f1', type: 'clinical', head: 'Dr. Yusuf Danladi', status: 'active' },
  { id: 'd5', name: 'Obstetrics & Gynaecology', code: 'O&G', facilityId: 'f1', type: 'clinical', head: 'Dr. Amaka Nwosu', status: 'active' },
  { id: 'd6', name: 'Laboratory', code: 'LAB', facilityId: 'f1', type: 'diagnostic', head: 'Tunde Salami', status: 'active' },
  { id: 'd7', name: 'Paediatrics', code: 'PAED', facilityId: 'f2', type: 'clinical', head: 'Dr. Sadiq Bello', status: 'active' },
  { id: 'd8', name: 'Pharmacy', code: 'PHARM', facilityId: 'f2', type: 'support', head: 'Grace Etim', status: 'active' },
]

export type WardType = 'general' | 'maternity' | 'paediatric' | 'intensive care' | 'isolation' | 'surgical'
export type WardSex = 'male' | 'female' | 'mixed'

export interface HimWard {
  id: string
  name: string
  code: string
  facilityId: string
  departmentId: string
  type: WardType
  beds: number
  sex: WardSex
  status: OrgStatus
}

export const HIM_WARDS: HimWard[] = [
  { id: 'w1', name: 'Male Medical Ward', code: 'MMW', facilityId: 'f1', departmentId: 'd4', type: 'general', beds: 24, sex: 'male', status: 'active' },
  { id: 'w2', name: 'Female Medical Ward', code: 'FMW', facilityId: 'f1', departmentId: 'd4', type: 'general', beds: 24, sex: 'female', status: 'active' },
  { id: 'w3', name: 'Maternity Ward', code: 'MAT', facilityId: 'f1', departmentId: 'd5', type: 'maternity', beds: 18, sex: 'female', status: 'active' },
  { id: 'w4', name: 'Intensive Care Unit', code: 'ICU', facilityId: 'f1', departmentId: 'd4', type: 'intensive care', beds: 8, sex: 'mixed', status: 'active' },
  { id: 'w5', name: 'Isolation Ward', code: 'ISO', facilityId: 'f1', departmentId: 'd2', type: 'isolation', beds: 10, sex: 'mixed', status: 'inactive' },
  { id: 'w6', name: "Children's Ward", code: 'PAEDW', facilityId: 'f2', departmentId: 'd7', type: 'paediatric', beds: 20, sex: 'mixed', status: 'active' },
]

/** Display name for a facility id — falls back to the raw id if unknown. */
export function facilityName(id: string, facilities: HimFacility[] = HIM_ORG_FACILITIES): string {
  return facilities.find((f) => f.id === id)?.name ?? id
}

/** Display name for a department id — falls back to the raw id if unknown. */
export function departmentName(id: string, departments: HimDepartment[] = HIM_DEPARTMENTS): string {
  return departments.find((d) => d.id === id)?.name ?? id
}

/* ---- Directors: the facility's appointed offices -------------------------------
   A hospital's leadership posts (Medical Director, DNS, Director of
   Administration…). Each office has ONE active holder per facility at a time —
   the create form enforces that, since two sitting Medical Directors is a
   governance error, not a data preference. */

export type DirectorRole =
  | 'Medical Director'
  | 'Chairman, Medical Advisory Committee'
  | 'Director of Administration'
  | 'Director of Clinical Services'
  | 'Director of Nursing Services'
  | 'Director of Pharmaceutical Services'
  | 'Director of Finance & Accounts'

export const DIRECTOR_ROLES: DirectorRole[] = [
  'Medical Director',
  'Chairman, Medical Advisory Committee',
  'Director of Administration',
  'Director of Clinical Services',
  'Director of Nursing Services',
  'Director of Pharmaceutical Services',
  'Director of Finance & Accounts',
]

export interface HimDirector {
  id: string
  name: string
  role: DirectorRole
  facilityId: string
  /** Optional — set when the director also heads a specific department. */
  departmentId?: string
  email: string
  phone: string
  /** Date the appointment took effect, displayed as "d MMM yyyy". */
  appointed: string
  status: OrgStatus
}

export const HIM_DIRECTORS: HimDirector[] = [
  { id: 'dir1', name: 'Dr. Emeka Obi', role: 'Medical Director', facilityId: 'f1', email: 'emeka.obi@garki.health.gov.ng', phone: '+234 803 555 0111', appointed: '01 Apr 2023', status: 'active' },
  { id: 'dir2', name: 'Dr. Chinwe Okeke', role: 'Chairman, Medical Advisory Committee', facilityId: 'f1', email: 'chinwe.okeke@garki.health.gov.ng', phone: '+234 803 555 0112', appointed: '15 Jun 2023', status: 'active' },
  { id: 'dir3', name: 'Dayo Okon', role: 'Director of Administration', facilityId: 'f1', email: 'dayo.okon@garki.health.gov.ng', phone: '+234 803 555 0113', appointed: '03 Jan 2024', status: 'active' },
  { id: 'dir4', name: 'Mrs. Halima Yusuf', role: 'Director of Nursing Services', facilityId: 'f1', email: 'halima.yusuf@garki.health.gov.ng', phone: '+234 803 555 0114', appointed: '12 Sep 2022', status: 'active' },
  { id: 'dir5', name: 'Dr. Ibrahim Musa', role: 'Medical Director', facilityId: 'f2', email: 'ibrahim.musa@wuse.health.gov.ng', phone: '+234 803 555 0121', appointed: '20 Feb 2024', status: 'active' },
  { id: 'dir6', name: 'Pharm. Grace Etim', role: 'Director of Pharmaceutical Services', facilityId: 'f2', departmentId: 'd8', email: 'grace.etim@wuse.health.gov.ng', phone: '+234 803 555 0122', appointed: '05 May 2024', status: 'active' },
  { id: 'dir7', name: 'Dr. Femi Alade', role: 'Director of Clinical Services', facilityId: 'f1', email: 'femi.alade@garki.health.gov.ng', phone: '+234 803 555 0115', appointed: '18 Nov 2021', status: 'inactive' },
]
