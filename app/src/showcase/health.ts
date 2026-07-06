/**
 * Mock data for the Rednoxx product demo — a hospital-network analytics view.
 * Series are 14 days ending today; numbers are plausible, not real.
 */

const DAY_MS = 86_400_000
const fmt = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })

/** Labels for the last `n` days, oldest first — e.g. "Jun 23". */
export function lastDays(n: number): string[] {
  const today = Date.now()
  return Array.from({ length: n }, (_, i) => fmt.format(new Date(today - (n - 1 - i) * DAY_MS)))
}

export const DAYS = lastDays(14)

export interface Kpi {
  key: string
  label: string
  value: string
  delta: string
  deltaTone: 'up' | 'down'
  sub: string
  series: number[]
}

export const KPIS: Kpi[] = [
  {
    key: 'enrolments',
    label: 'New enrolments',
    value: '1,284',
    delta: '+12.4%',
    deltaTone: 'up',
    sub: 'vs 1,142 last period',
    series: [62, 71, 68, 80, 76, 88, 84, 95, 91, 102, 98, 110, 118, 121],
  },
  {
    key: 'consultations',
    label: 'Consultations',
    value: '3,842',
    delta: '+8.1%',
    deltaTone: 'up',
    sub: 'vs 3,554 last period',
    series: [244, 251, 238, 262, 270, 258, 240, 275, 288, 281, 296, 290, 304, 310],
  },
  {
    key: 'prescriptions',
    label: 'Prescriptions issued',
    value: '2,916',
    delta: '+5.6%',
    deltaTone: 'up',
    sub: 'vs 2,761 last period',
    series: [188, 195, 182, 201, 208, 198, 186, 210, 218, 214, 224, 220, 231, 236],
  },
  {
    key: 'consult-time',
    label: 'Avg consultation time',
    value: '14m 32s',
    delta: '−1m 08s',
    deltaTone: 'up',
    sub: 'vs 15m 40s last period',
    series: [16.4, 16.1, 15.9, 15.7, 15.8, 15.4, 15.2, 15.0, 14.9, 14.8, 14.7, 14.6, 14.5, 14.5],
  },
  {
    key: 'claims',
    label: 'Claims approval rate',
    value: '92.4%',
    delta: '+1.9pt',
    deltaTone: 'up',
    sub: 'vs 90.5% last period',
    series: [90.2, 90.4, 90.1, 90.8, 91.0, 90.7, 91.2, 91.5, 91.4, 91.8, 92.0, 92.1, 92.3, 92.4],
  },
  {
    key: 'lab-orders',
    label: 'Lab orders completed',
    value: '1,978',
    delta: '+6.3%',
    deltaTone: 'up',
    sub: 'vs 1,861 last period',
    series: [128, 134, 126, 140, 138, 145, 132, 150, 148, 156, 152, 160, 158, 166],
  },
]

export interface Facility {
  id: string
  name: string
  city: string
  patients: number
  consults: number
  waitMins: number
  approvedPct: number
  trend: number[]
  status: 'active' | 'pending'
}

export const FACILITIES: Facility[] = [
  { id: 'f1', name: 'Garki General Hospital', city: 'Abuja', patients: 4820, consults: 612, waitMins: 18, approvedPct: 95, trend: [4, 5, 5, 6, 6, 7, 8], status: 'active' },
  { id: 'f2', name: 'Ikeja Medical Centre', city: 'Lagos', patients: 6140, consults: 748, waitMins: 24, approvedPct: 93, trend: [6, 6, 7, 7, 8, 8, 9], status: 'active' },
  { id: 'f3', name: 'Kano Specialist Clinic', city: 'Kano', patients: 3260, consults: 401, waitMins: 15, approvedPct: 91, trend: [5, 4, 5, 5, 6, 6, 6], status: 'active' },
  { id: 'f4', name: 'Port Harcourt Family Health', city: 'Port Harcourt', patients: 2890, consults: 356, waitMins: 21, approvedPct: 89, trend: [3, 4, 4, 5, 4, 5, 5], status: 'active' },
  { id: 'f5', name: 'Enugu Teaching Hospital', city: 'Enugu', patients: 5310, consults: 664, waitMins: 27, approvedPct: 94, trend: [7, 7, 6, 7, 8, 8, 8], status: 'active' },
  { id: 'f6', name: 'Kaduna Community Clinic', city: 'Kaduna', patients: 1740, consults: 208, waitMins: 12, approvedPct: 88, trend: [2, 3, 3, 3, 4, 4, 4], status: 'pending' },
  { id: 'f7', name: 'Ibadan Central Hospital', city: 'Ibadan', patients: 4470, consults: 539, waitMins: 19, approvedPct: 92, trend: [5, 5, 6, 6, 6, 7, 7], status: 'active' },
  { id: 'f8', name: 'Jos Wellness Centre', city: 'Jos', patients: 2150, consults: 262, waitMins: 16, approvedPct: 90, trend: [3, 3, 4, 4, 4, 5, 5], status: 'active' },
  { id: 'f9', name: 'Benin Riverside Clinic', city: 'Benin City', patients: 1980, consults: 240, waitMins: 22, approvedPct: 87, trend: [3, 3, 3, 4, 4, 4, 5], status: 'pending' },
]

export const DEPARTMENTS = [
  'All departments',
  'General practice',
  'Paediatrics',
  'Obstetrics & gynaecology',
  'Cardiology',
  'Laboratory',
  'Surgery',
  'Pharmacy',
]

/* ============================== Demo entities ==============================
   Enough rows per entity to exercise search, filters, tabs and pagination. */

export interface Patient {
  id: string
  mrn: string
  name: string
  age: number
  plan: string
  gp: string
  lastVisit: string
  status: 'active' | 'inactive'
}

export const PATIENTS: Patient[] = [
  { id: 'p1', mrn: '004-2213', name: 'Ngozi Eze', age: 34, plan: 'Family Gold · HMO', gp: 'Dr. Sani Ahmed', lastVisit: '12 Jun 2026', status: 'active' },
  { id: 'p2', mrn: '004-1187', name: 'Efe Ojo', age: 41, plan: 'Corporate Silver', gp: 'Dr. Bisi Adeyemi', lastVisit: '28 Jun 2026', status: 'active' },
  { id: 'p3', mrn: '004-3320', name: 'Sani Ahmed', age: 58, plan: 'Retail Basic', gp: 'Dr. Kemi Balogun', lastVisit: '01 Jul 2026', status: 'active' },
  { id: 'p4', mrn: '004-0916', name: 'Amara Nwosu', age: 27, plan: 'Family Gold · HMO', gp: 'Dr. Sani Ahmed', lastVisit: '19 May 2026', status: 'active' },
  { id: 'p5', mrn: '004-2744', name: 'Tunde Bakare', age: 63, plan: 'Corporate Silver', gp: 'Dr. Bisi Adeyemi', lastVisit: '03 Jul 2026', status: 'active' },
  { id: 'p6', mrn: '004-1502', name: 'Hauwa Musa', age: 29, plan: 'Maternity Plus', gp: 'Dr. Kemi Balogun', lastVisit: '30 Jun 2026', status: 'active' },
  { id: 'p7', mrn: '004-2088', name: 'Chidi Okafor', age: 45, plan: 'Retail Basic', gp: 'Dr. Femi Alade', lastVisit: '11 Apr 2026', status: 'inactive' },
  { id: 'p8', mrn: '004-3491', name: 'Yemi Adeola', age: 36, plan: 'Corporate Silver', gp: 'Dr. Femi Alade', lastVisit: '25 Jun 2026', status: 'active' },
  { id: 'p9', mrn: '004-0733', name: 'Fatima Bello', age: 52, plan: 'Family Gold · HMO', gp: 'Dr. Sani Ahmed', lastVisit: '02 Feb 2026', status: 'inactive' },
  { id: 'p10', mrn: '004-2951', name: 'Ikenna Obi', age: 38, plan: 'Retail Basic', gp: 'Dr. Kemi Balogun', lastVisit: '04 Jul 2026', status: 'active' },
  { id: 'p11', mrn: '004-1830', name: 'Zainab Lawal', age: 31, plan: 'Maternity Plus', gp: 'Dr. Bisi Adeyemi', lastVisit: '05 Jul 2026', status: 'active' },
  { id: 'p12', mrn: '004-2367', name: 'Emeka Uche', age: 49, plan: 'Corporate Silver', gp: 'Dr. Femi Alade', lastVisit: '17 Jun 2026', status: 'active' },
]

export interface Appointment {
  id: string
  time: string
  day: string
  patient: string
  clinician: string
  type: 'Consultation' | 'Follow-up' | 'Antenatal' | 'Vaccination' | 'Screening'
  bucket: 'upcoming' | 'past' | 'cancelled'
}

export const APPOINTMENTS: Appointment[] = [
  { id: 'a1', time: '09:00', day: 'Today', patient: 'Ngozi Eze', clinician: 'Dr. Sani Ahmed', type: 'Follow-up', bucket: 'upcoming' },
  { id: 'a2', time: '09:40', day: 'Today', patient: 'Tunde Bakare', clinician: 'Dr. Bisi Adeyemi', type: 'Consultation', bucket: 'upcoming' },
  { id: 'a3', time: '10:20', day: 'Today', patient: 'Hauwa Musa', clinician: 'Dr. Kemi Balogun', type: 'Antenatal', bucket: 'upcoming' },
  { id: 'a4', time: '11:00', day: 'Today', patient: 'Ikenna Obi', clinician: 'Dr. Femi Alade', type: 'Screening', bucket: 'upcoming' },
  { id: 'a5', time: '11:40', day: 'Today', patient: 'Zainab Lawal', clinician: 'Dr. Bisi Adeyemi', type: 'Antenatal', bucket: 'upcoming' },
  { id: 'a6', time: '13:20', day: 'Tomorrow', patient: 'Yemi Adeola', clinician: 'Dr. Femi Alade', type: 'Consultation', bucket: 'upcoming' },
  { id: 'a7', time: '14:00', day: 'Tomorrow', patient: 'Emeka Uche', clinician: 'Dr. Sani Ahmed', type: 'Vaccination', bucket: 'upcoming' },
  { id: 'a8', time: '15:30', day: '02 Jul', patient: 'Efe Ojo', clinician: 'Dr. Bisi Adeyemi', type: 'Consultation', bucket: 'past' },
  { id: 'a9', time: '10:00', day: '01 Jul', patient: 'Sani Ahmed', clinician: 'Dr. Kemi Balogun', type: 'Follow-up', bucket: 'past' },
  { id: 'a10', time: '09:20', day: '30 Jun', patient: 'Hauwa Musa', clinician: 'Dr. Kemi Balogun', type: 'Antenatal', bucket: 'past' },
  { id: 'a11', time: '12:40', day: '28 Jun', patient: 'Amara Nwosu', clinician: 'Dr. Sani Ahmed', type: 'Screening', bucket: 'past' },
  { id: 'a12', time: '08:40', day: '27 Jun', patient: 'Chidi Okafor', clinician: 'Dr. Femi Alade', type: 'Consultation', bucket: 'cancelled' },
  { id: 'a13', time: '16:00', day: '25 Jun', patient: 'Fatima Bello', clinician: 'Dr. Sani Ahmed', type: 'Follow-up', bucket: 'cancelled' },
]

export interface Consultation {
  id: string
  patient: string
  clinician: string
  dept: string
  started: string
  duration: string
  status: 'completed' | 'in_progress'
}

export const CONSULTATIONS: Consultation[] = [
  { id: 'c1', patient: 'Tunde Bakare', clinician: 'Dr. Bisi Adeyemi', dept: 'Cardiology', started: '09:42', duration: '18m', status: 'in_progress' },
  { id: 'c2', patient: 'Ngozi Eze', clinician: 'Dr. Sani Ahmed', dept: 'General practice', started: '09:05', duration: '21m', status: 'completed' },
  { id: 'c3', patient: 'Ikenna Obi', clinician: 'Dr. Femi Alade', dept: 'General practice', started: '08:50', duration: '12m', status: 'completed' },
  { id: 'c4', patient: 'Hauwa Musa', clinician: 'Dr. Kemi Balogun', dept: 'Obstetrics & gynaecology', started: '08:30', duration: '26m', status: 'completed' },
  { id: 'c5', patient: 'Zainab Lawal', clinician: 'Dr. Kemi Balogun', dept: 'Obstetrics & gynaecology', started: '10:15', duration: '—', status: 'in_progress' },
  { id: 'c6', patient: 'Yemi Adeola', clinician: 'Dr. Femi Alade', dept: 'Paediatrics', started: '07:55', duration: '15m', status: 'completed' },
  { id: 'c7', patient: 'Emeka Uche', clinician: 'Dr. Sani Ahmed', dept: 'General practice', started: '07:40', duration: '9m', status: 'completed' },
  { id: 'c8', patient: 'Efe Ojo', clinician: 'Dr. Bisi Adeyemi', dept: 'Cardiology', started: '07:20', duration: '24m', status: 'completed' },
]

export interface Prescription {
  id: string
  patient: string
  drug: string
  dose: string
  prescriber: string
  issued: string
  status: 'active' | 'dispensed' | 'cancelled'
}

export const PRESCRIPTIONS: Prescription[] = [
  { id: 'RX-20841', patient: 'Ngozi Eze', drug: 'Amoxicillin', dose: '500mg · 3/day · 7d', prescriber: 'Dr. Sani Ahmed', issued: '06 Jul 2026', status: 'active' },
  { id: 'RX-20838', patient: 'Tunde Bakare', drug: 'Amlodipine', dose: '10mg · 1/day · 30d', prescriber: 'Dr. Bisi Adeyemi', issued: '06 Jul 2026', status: 'active' },
  { id: 'RX-20834', patient: 'Hauwa Musa', drug: 'Folic acid', dose: '5mg · 1/day · 90d', prescriber: 'Dr. Kemi Balogun', issued: '05 Jul 2026', status: 'dispensed' },
  { id: 'RX-20829', patient: 'Ikenna Obi', drug: 'Artemether-lumefantrine', dose: '80/480mg · 2/day · 3d', prescriber: 'Dr. Femi Alade', issued: '05 Jul 2026', status: 'dispensed' },
  { id: 'RX-20825', patient: 'Emeka Uche', drug: 'Metformin', dose: '1000mg · 2/day · 30d', prescriber: 'Dr. Sani Ahmed', issued: '04 Jul 2026', status: 'dispensed' },
  { id: 'RX-20821', patient: 'Yemi Adeola', drug: 'Loratadine', dose: '10mg · 1/day · 14d', prescriber: 'Dr. Femi Alade', issued: '04 Jul 2026', status: 'active' },
  { id: 'RX-20816', patient: 'Efe Ojo', drug: 'Atorvastatin', dose: '20mg · 1/day · 30d', prescriber: 'Dr. Bisi Adeyemi', issued: '03 Jul 2026', status: 'dispensed' },
  { id: 'RX-20812', patient: 'Fatima Bello', drug: 'Ibuprofen', dose: '400mg · 3/day · 5d', prescriber: 'Dr. Sani Ahmed', issued: '02 Jul 2026', status: 'cancelled' },
  { id: 'RX-20807', patient: 'Zainab Lawal', drug: 'Ferrous sulphate', dose: '200mg · 1/day · 90d', prescriber: 'Dr. Kemi Balogun', issued: '02 Jul 2026', status: 'dispensed' },
]

export interface LabOrder {
  id: string
  patient: string
  test: string
  facility: string
  ordered: string
  tat: string
  status: 'pending' | 'in_progress' | 'completed'
}

export const LAB_ORDERS: LabOrder[] = [
  { id: 'LAB-8841', patient: 'Tunde Bakare', test: 'Lipid panel', facility: 'Ikeja Medical Centre', ordered: '06 Jul · 09:58', tat: '—', status: 'pending' },
  { id: 'LAB-8839', patient: 'Ngozi Eze', test: 'Full blood count', facility: 'Garki General Hospital', ordered: '06 Jul · 09:26', tat: '—', status: 'in_progress' },
  { id: 'LAB-8836', patient: 'Zainab Lawal', test: 'OGTT', facility: 'Ikeja Medical Centre', ordered: '06 Jul · 08:44', tat: '—', status: 'in_progress' },
  { id: 'LAB-8830', patient: 'Ikenna Obi', test: 'Malaria RDT', facility: 'Kano Specialist Clinic', ordered: '05 Jul · 16:02', tat: '38m', status: 'completed' },
  { id: 'LAB-8827', patient: 'Emeka Uche', test: 'HbA1c', facility: 'Enugu Teaching Hospital', ordered: '05 Jul · 14:31', tat: '3h 12m', status: 'completed' },
  { id: 'LAB-8822', patient: 'Efe Ojo', test: 'Liver function', facility: 'Ikeja Medical Centre', ordered: '05 Jul · 11:19', tat: '4h 05m', status: 'completed' },
  { id: 'LAB-8818', patient: 'Hauwa Musa', test: 'Urinalysis', facility: 'Garki General Hospital', ordered: '04 Jul · 15:47', tat: '1h 22m', status: 'completed' },
  { id: 'LAB-8813', patient: 'Yemi Adeola', test: 'Thyroid panel', facility: 'Ibadan Central Hospital', ordered: '04 Jul · 10:05', tat: '5h 40m', status: 'completed' },
  { id: 'LAB-8809', patient: 'Sani Ahmed', test: 'PSA', facility: 'Kano Specialist Clinic', ordered: '03 Jul · 13:28', tat: '2h 51m', status: 'completed' },
  { id: 'LAB-8804', patient: 'Amara Nwosu', test: 'Full blood count', facility: 'Garki General Hospital', ordered: '03 Jul · 09:12', tat: '1h 05m', status: 'completed' },
]

export interface SurgicalOrder {
  id: string
  patient: string
  procedure: string
  theatre: string
  scheduled: string
  surgeon: string
  status: 'submitted' | 'approved' | 'scheduled'
  checklist: { item: string; done: boolean }[]
}

export const SURGICAL_ORDERS: SurgicalOrder[] = [
  {
    id: 'SRG-1204', patient: 'Sani Ahmed', procedure: 'Inguinal hernia repair', theatre: 'Theatre 2', scheduled: '09 Jul 2026', surgeon: 'Dr. Obi Nnamdi', status: 'scheduled',
    checklist: [
      { item: 'Pre-op bloods reviewed', done: true },
      { item: 'Anaesthetist assessment', done: true },
      { item: 'Consent form signed', done: true },
      { item: 'Insurance pre-authorisation', done: true },
    ],
  },
  {
    id: 'SRG-1203', patient: 'Fatima Bello', procedure: 'Cataract extraction (left)', theatre: 'Theatre 1', scheduled: '10 Jul 2026', surgeon: 'Dr. Ada Okeke', status: 'approved',
    checklist: [
      { item: 'Pre-op bloods reviewed', done: true },
      { item: 'Anaesthetist assessment', done: true },
      { item: 'Consent form signed', done: false },
      { item: 'Insurance pre-authorisation', done: true },
    ],
  },
  {
    id: 'SRG-1201', patient: 'Chidi Okafor', procedure: 'Knee arthroscopy', theatre: 'Theatre 3', scheduled: '14 Jul 2026', surgeon: 'Dr. Obi Nnamdi', status: 'submitted',
    checklist: [
      { item: 'Pre-op bloods reviewed', done: true },
      { item: 'Anaesthetist assessment', done: false },
      { item: 'Consent form signed', done: false },
      { item: 'Insurance pre-authorisation', done: false },
    ],
  },
  {
    id: 'SRG-1199', patient: 'Efe Ojo', procedure: 'Coronary angiography', theatre: 'Cath lab', scheduled: '16 Jul 2026', surgeon: 'Dr. Bisi Adeyemi', status: 'submitted',
    checklist: [
      { item: 'Pre-op bloods reviewed', done: false },
      { item: 'Anaesthetist assessment', done: false },
      { item: 'Consent form signed', done: false },
      { item: 'Insurance pre-authorisation', done: true },
    ],
  },
  {
    id: 'SRG-1196', patient: 'Amara Nwosu', procedure: 'Laparoscopic appendicectomy', theatre: 'Theatre 2', scheduled: '18 Jul 2026', surgeon: 'Dr. Ada Okeke', status: 'submitted',
    checklist: [
      { item: 'Pre-op bloods reviewed', done: true },
      { item: 'Anaesthetist assessment', done: false },
      { item: 'Consent form signed', done: true },
      { item: 'Insurance pre-authorisation', done: false },
    ],
  },
]

export interface Payment {
  id: string
  patient: string
  method: 'Card' | 'Transfer' | 'Cash' | 'HMO'
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
}

export const PAYMENTS: Payment[] = [
  { id: 'INV-55214', patient: 'Tunde Bakare', method: 'HMO', amount: 68500, date: '06 Jul · 10:02', status: 'pending' },
  { id: 'INV-55212', patient: 'Ngozi Eze', method: 'Card', amount: 24000, date: '06 Jul · 09:31', status: 'completed' },
  { id: 'INV-55209', patient: 'Ikenna Obi', method: 'Cash', amount: 8500, date: '06 Jul · 09:04', status: 'completed' },
  { id: 'INV-55206', patient: 'Zainab Lawal', method: 'HMO', amount: 41200, date: '06 Jul · 08:47', status: 'pending' },
  { id: 'INV-55201', patient: 'Emeka Uche', method: 'Transfer', amount: 132750, date: '05 Jul · 17:15', status: 'completed' },
  { id: 'INV-55197', patient: 'Yemi Adeola', method: 'Card', amount: 18900, date: '05 Jul · 14:52', status: 'completed' },
  { id: 'INV-55193', patient: 'Efe Ojo', method: 'Card', amount: 76400, date: '05 Jul · 11:36', status: 'failed' },
  { id: 'INV-55190', patient: 'Hauwa Musa', method: 'HMO', amount: 52300, date: '05 Jul · 10:08', status: 'completed' },
  { id: 'INV-55186', patient: 'Sani Ahmed', method: 'Transfer', amount: 215000, date: '04 Jul · 16:44', status: 'completed' },
  { id: 'INV-55181', patient: 'Amara Nwosu', method: 'Cash', amount: 12000, date: '04 Jul · 12:19', status: 'completed' },
]

/** Daily collections for the last 14 days, in ₦ thousands. */
export const PAYMENT_TREND = [820, 940, 760, 1010, 980, 1120, 890, 1240, 1180, 1310, 1260, 1420, 1380, 1495]

export interface Claim {
  id: string
  patient: string
  insurer: string
  amount: number
  submitted: string
  status: 'approved' | 'pending' | 'rejected'
}

export const INSURERS = ['Hygeia HMO', 'AXA Mansard', 'Leadway Health', 'Reliance HMO', 'AIICO Multishield']

export const CLAIMS: Claim[] = [
  { id: 'CLM-8241', patient: 'Tunde Bakare', insurer: 'AXA Mansard', amount: 68500, submitted: '06 Jul 2026', status: 'pending' },
  { id: 'CLM-8238', patient: 'Zainab Lawal', insurer: 'Hygeia HMO', amount: 41200, submitted: '06 Jul 2026', status: 'pending' },
  { id: 'CLM-8232', patient: 'Hauwa Musa', insurer: 'Reliance HMO', amount: 52300, submitted: '05 Jul 2026', status: 'approved' },
  { id: 'CLM-8228', patient: 'Ngozi Eze', insurer: 'Hygeia HMO', amount: 24000, submitted: '05 Jul 2026', status: 'approved' },
  { id: 'CLM-8221', patient: 'Fatima Bello', insurer: 'AIICO Multishield', amount: 187500, submitted: '04 Jul 2026', status: 'rejected' },
  { id: 'CLM-8217', patient: 'Emeka Uche', insurer: 'Leadway Health', amount: 132750, submitted: '04 Jul 2026', status: 'approved' },
  { id: 'CLM-8210', patient: 'Efe Ojo', insurer: 'AXA Mansard', amount: 76400, submitted: '03 Jul 2026', status: 'approved' },
  { id: 'CLM-8204', patient: 'Sani Ahmed', insurer: 'Leadway Health', amount: 215000, submitted: '03 Jul 2026', status: 'approved' },
  { id: 'CLM-8197', patient: 'Yemi Adeola', insurer: 'Reliance HMO', amount: 18900, submitted: '02 Jul 2026', status: 'approved' },
]

export interface StaffMember {
  id: string
  name: string
  role: string
  facility: string
  email: string
  status: 'active' | 'inactive'
}

export const STAFF: StaffMember[] = [
  { id: 's1', name: 'Amina Bello', role: 'Clinical operations', facility: 'Head office', email: 'amina@rednoxx.health', status: 'active' },
  { id: 's2', name: 'Dr. Sani Ahmed', role: 'General practitioner', facility: 'Garki General Hospital', email: 'sani.ahmed@rednoxx.health', status: 'active' },
  { id: 's3', name: 'Dr. Bisi Adeyemi', role: 'Cardiologist', facility: 'Ikeja Medical Centre', email: 'bisi.adeyemi@rednoxx.health', status: 'active' },
  { id: 's4', name: 'Dr. Kemi Balogun', role: 'Obstetrician', facility: 'Ikeja Medical Centre', email: 'kemi.balogun@rednoxx.health', status: 'active' },
  { id: 's5', name: 'Dr. Femi Alade', role: 'Paediatrician', facility: 'Ibadan Central Hospital', email: 'femi.alade@rednoxx.health', status: 'active' },
  { id: 's6', name: 'Dr. Obi Nnamdi', role: 'Surgeon', facility: 'Enugu Teaching Hospital', email: 'obi.nnamdi@rednoxx.health', status: 'active' },
  { id: 's7', name: 'Dr. Ada Okeke', role: 'Ophthalmic surgeon', facility: 'Garki General Hospital', email: 'ada.okeke@rednoxx.health', status: 'active' },
  { id: 's8', name: 'Musa Danjuma', role: 'Lab scientist', facility: 'Kano Specialist Clinic', email: 'musa.danjuma@rednoxx.health', status: 'inactive' },
]

export interface Report {
  id: string
  name: string
  description: string
  cadence: 'Daily' | 'Weekly' | 'Monthly' | 'On demand'
  lastRun: string
}

export const REPORTS: Report[] = [
  { id: 'r1', name: 'Facility performance', description: 'Consultations, wait times and claim outcomes per facility.', cadence: 'Weekly', lastRun: '05 Jul 2026' },
  { id: 'r2', name: 'Claims ageing', description: 'Outstanding claims by insurer, bucketed by days pending.', cadence: 'Daily', lastRun: '06 Jul 2026' },
  { id: 'r3', name: 'Prescription audit', description: 'High-volume prescribers and controlled-substance issuance.', cadence: 'Monthly', lastRun: '01 Jul 2026' },
  { id: 'r4', name: 'Lab turnaround', description: 'Order-to-result times per test type and facility.', cadence: 'Weekly', lastRun: '04 Jul 2026' },
  { id: 'r5', name: 'Enrolment funnel', description: 'New members by plan, channel and completion state.', cadence: 'Weekly', lastRun: '05 Jul 2026' },
  { id: 'r6', name: 'Theatre utilisation', description: 'Scheduled vs actual theatre hours, cancellations and overruns.', cadence: 'On demand', lastRun: '28 Jun 2026' },
]

/* ---------------------------- Patient charts ----------------------------
   EHR-style bio data for the full patient page, keyed by patient id. */

export interface PatientBio {
  sex: 'Female' | 'Male'
  dob: string
  phone: string
  email: string
  address: string
  nextOfKin: string
  insurer: string
  memberId: string
  validTill: string
  allergies: string[]
  conditions: string[]
  vitals: { bp: string; hr: number; temp: string; spo2: string; weight: string }
  /** Weight (kg) across the last six visits. */
  weightSeries: number[]
  note: string
}

export const PATIENT_BIO: Record<string, PatientBio> = {
  p1: {
    sex: 'Female', dob: '14 Mar 1992', phone: '+234 803 221 4410', email: 'ngozi.eze@gmail.com',
    address: '12 Awolowo Rd, Garki, Abuja', nextOfKin: 'Chinedu Eze · Husband · +234 803 221 4411',
    insurer: 'Hygeia HMO', memberId: 'HYG-118-2213', validTill: '31 Dec 2026',
    allergies: ['Penicillin'], conditions: ['Asthma (mild)'],
    vitals: { bp: '118/76', hr: 72, temp: '36.8°C', spo2: '98%', weight: '64 kg' },
    weightSeries: [66, 65.5, 65, 64.8, 64.2, 64],
    note: 'Follow-up for upper respiratory tract infection. Symptoms resolving on amoxicillin; advised to complete the course and return if fever recurs. Inhaler technique reviewed — good.',
  },
  p2: {
    sex: 'Male', dob: '02 Aug 1984', phone: '+234 805 114 8890', email: 'efe.ojo@yahoo.com',
    address: '4 Adeola Odeku St, Victoria Island, Lagos', nextOfKin: 'Ese Ojo · Wife · +234 805 114 8891',
    insurer: 'AXA Mansard', memberId: 'AXA-204-1187', validTill: '31 Mar 2027',
    allergies: [], conditions: ['Hyperlipidaemia', 'Hypertension (stage 1)'],
    vitals: { bp: '134/86', hr: 78, temp: '36.6°C', spo2: '97%', weight: '88 kg' },
    weightSeries: [91, 90.4, 90, 89.2, 88.6, 88],
    note: 'Cardiology review. Lipids trending down on atorvastatin; continue current dose. Encouraged 150 min/week moderate exercise and reduced salt intake. Review with repeat lipid panel in 3 months.',
  },
  p3: {
    sex: 'Male', dob: '21 Jan 1968', phone: '+234 806 733 0021', email: 'sani.ahmed68@gmail.com',
    address: '9 Zoo Rd, Nassarawa, Kano', nextOfKin: 'Amina Ahmed · Daughter · +234 806 733 0022',
    insurer: 'Leadway Health', memberId: 'LWH-330-3320', validTill: '30 Sep 2026',
    allergies: ['Sulpha drugs'], conditions: ['Benign prostatic hyperplasia'],
    vitals: { bp: '128/82', hr: 68, temp: '36.7°C', spo2: '98%', weight: '75 kg' },
    weightSeries: [74, 74.5, 74.8, 75, 75.2, 75],
    note: 'PSA within normal range for age. Urinary symptoms improved on tamsulosin. Inguinal hernia repair scheduled 09 Jul — pre-op checklist complete, fit for surgery.',
  },
  p4: {
    sex: 'Female', dob: '30 Nov 1998', phone: '+234 809 445 6672', email: 'amara.nwosu@outlook.com',
    address: '22 Okpara Ave, GRA, Enugu', nextOfKin: 'Ijeoma Nwosu · Mother · +234 809 445 6673',
    insurer: 'Hygeia HMO', memberId: 'HYG-118-0916', validTill: '31 Dec 2026',
    allergies: [], conditions: [],
    vitals: { bp: '110/70', hr: 66, temp: '36.5°C', spo2: '99%', weight: '58 kg' },
    weightSeries: [57.5, 57.8, 58, 58.1, 58, 58],
    note: 'Routine screening — all results within normal limits. Appendicectomy scheduled 18 Jul following two episodes of right iliac fossa pain; imaging consistent with recurrent appendicitis.',
  },
  p5: {
    sex: 'Male', dob: '17 May 1963', phone: '+234 802 998 1145', email: 'tbakare@bakare-co.com',
    address: '3 Allen Ave, Ikeja, Lagos', nextOfKin: 'Folake Bakare · Wife · +234 802 998 1146',
    insurer: 'AXA Mansard', memberId: 'AXA-204-2744', validTill: '31 Mar 2027',
    allergies: ['Aspirin (GI upset)'], conditions: ['Hypertension', 'Type 2 diabetes'],
    vitals: { bp: '142/90', hr: 82, temp: '36.9°C', spo2: '96%', weight: '94 kg' },
    weightSeries: [97, 96.2, 95.8, 95, 94.4, 94],
    note: 'BP above target despite amlodipine 10mg — added lifestyle review and home BP diary; consider ACE inhibitor at next visit if diary confirms. HbA1c 7.1%, improving. Lipid panel ordered today.',
  },
  p6: {
    sex: 'Female', dob: '08 Sep 1996', phone: '+234 810 220 7789', email: 'hauwa.musa96@gmail.com',
    address: '15 Ahmadu Bello Way, Kaduna', nextOfKin: 'Ibrahim Musa · Husband · +234 810 220 7790',
    insurer: 'Reliance HMO', memberId: 'REL-502-1502', validTill: '30 Jun 2027',
    allergies: [], conditions: ['Pregnancy · 28 weeks (G2P1)'],
    vitals: { bp: '116/74', hr: 84, temp: '36.8°C', spo2: '98%', weight: '71 kg' },
    weightSeries: [64, 65.5, 67, 68.4, 69.8, 71],
    note: 'Antenatal visit at 28 weeks — fundal height consistent with dates, foetal heart rate 148 bpm. OGTT pending. Continue folic acid and ferrous sulphate; next visit in 2 weeks.',
  },
  p7: {
    sex: 'Male', dob: '25 Jun 1981', phone: '+234 803 667 2210', email: 'chidi.okafor@gmail.com',
    address: '31 Ring Rd, Ibadan', nextOfKin: 'Ada Okafor · Wife · +234 803 667 2211',
    insurer: 'Self-pay', memberId: '—', validTill: '—',
    allergies: [], conditions: ['Right knee meniscal tear'],
    vitals: { bp: '124/80', hr: 74, temp: '36.6°C', spo2: '98%', weight: '82 kg' },
    weightSeries: [83, 82.8, 82.5, 82.4, 82.2, 82],
    note: 'Knee arthroscopy on the waiting list; anaesthetist assessment outstanding. Physiotherapy continuing in the interim — reports moderate improvement in pain scores.',
  },
  p8: {
    sex: 'Female', dob: '12 Feb 1990', phone: '+234 807 118 9034', email: 'yemi.adeola@gmail.com',
    address: '7 Bodija Estate, Ibadan', nextOfKin: 'Kunle Adeola · Brother · +234 807 118 9035',
    insurer: 'Reliance HMO', memberId: 'REL-502-3491', validTill: '30 Jun 2027',
    allergies: ['Dust mites (rhinitis)'], conditions: ['Allergic rhinitis', 'Subclinical hypothyroidism'],
    vitals: { bp: '112/72', hr: 70, temp: '36.5°C', spo2: '99%', weight: '61 kg' },
    weightSeries: [60, 60.4, 60.8, 61, 61.2, 61],
    note: 'Thyroid panel repeated — TSH mildly elevated, T4 normal; continue observation, repeat in 6 months. Loratadine effective for rhinitis during harmattan.',
  },
  p9: {
    sex: 'Female', dob: '19 Jul 1974', phone: '+234 805 442 1178', email: 'fatima.bello74@yahoo.com',
    address: '18 Sultan Rd, Ungwan Rimi, Kaduna', nextOfKin: 'Musa Bello · Son · +234 805 442 1179',
    insurer: 'AIICO Multishield', memberId: 'AIC-771-0733', validTill: '31 Dec 2026',
    allergies: ['Ibuprofen'], conditions: ['Bilateral cataracts', 'Osteoarthritis'],
    vitals: { bp: '138/88', hr: 76, temp: '36.7°C', spo2: '97%', weight: '70 kg' },
    weightSeries: [71, 70.8, 70.5, 70.4, 70.2, 70],
    note: 'Left cataract extraction approved and scheduled 10 Jul — consent to be completed at pre-op. Ibuprofen prescription cancelled due to documented allergy; paracetamol substituted.',
  },
  p10: {
    sex: 'Male', dob: '03 Apr 1988', phone: '+234 809 001 3345', email: 'ikenna.obi@gmail.com',
    address: '5 Aba Rd, Port Harcourt', nextOfKin: 'Nneka Obi · Wife · +234 809 001 3346',
    insurer: 'Self-pay', memberId: '—', validTill: '—',
    allergies: [], conditions: [],
    vitals: { bp: '120/78', hr: 71, temp: '37.4°C', spo2: '98%', weight: '78 kg' },
    weightSeries: [78.5, 78.4, 78.2, 78, 78.1, 78],
    note: 'Malaria RDT positive — commenced artemether-lumefantrine, day 2 of 3. Advised on hydration and to return if symptoms persist beyond 48 hours after completing treatment.',
  },
  p11: {
    sex: 'Female', dob: '27 Oct 1994', phone: '+234 810 556 2290', email: 'zainab.lawal@gmail.com',
    address: '26 Ikorodu Rd, Maryland, Lagos', nextOfKin: 'Abdul Lawal · Husband · +234 810 556 2291',
    insurer: 'Hygeia HMO', memberId: 'HYG-118-1830', validTill: '31 Dec 2026',
    allergies: [], conditions: ['Pregnancy · 24 weeks (G1P0)', 'Iron-deficiency anaemia (mild)'],
    vitals: { bp: '114/72', hr: 86, temp: '36.7°C', spo2: '98%', weight: '68 kg' },
    weightSeries: [62, 63.2, 64.5, 65.8, 66.9, 68],
    note: 'Antenatal visit at 24 weeks. Haemoglobin 10.4 — continue ferrous sulphate, recheck in 4 weeks. OGTT in progress today. Foetal movements normal.',
  },
  p12: {
    sex: 'Male', dob: '15 Dec 1976', phone: '+234 802 334 7761', email: 'emeka.uche@uchegroup.ng',
    address: '11 Independence Layout, Enugu', nextOfKin: 'Chioma Uche · Wife · +234 802 334 7762',
    insurer: 'Leadway Health', memberId: 'LWH-330-2367', validTill: '30 Sep 2026',
    allergies: [], conditions: ['Type 2 diabetes'],
    vitals: { bp: '126/82', hr: 75, temp: '36.6°C', spo2: '98%', weight: '86 kg' },
    weightSeries: [89, 88.4, 87.8, 87.2, 86.6, 86],
    note: 'Diabetes review — HbA1c 6.9%, at target on metformin. Weight down 3 kg since January; reinforced diet plan. Annual retinal screening booked.',
  },
}
