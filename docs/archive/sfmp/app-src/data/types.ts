/* ============================================================================
 * SFMP — Sustainable Finance Marketplace · domain model
 * A renewable-energy structured-finance lending marketplace. Three domains
 * (borrower / financier / admin), each with a banking maker-checker persona
 * (root / initiator / authorizer). Powered by Sterling Bank.
 * ==========================================================================*/

export type Domain = 'borrower' | 'financier' | 'admin'
export type SubRole = 'root' | 'initiator' | 'authorizer'

/* ------------------------------ chart series ------------------------------ */

/** Time ranges offered by trend charts (shadcn interactive-chart pattern). */
export type TimeRange = 'day' | 'month' | 'year'

export interface RangeSeries {
  labels: string[]
  data: number[]
}

/** A fully-qualified role, e.g. "borrower.initiator". */
export type Role = `${Domain}.${SubRole}`

export type Currency = 'NGN' | 'USD'

/* ------------------------------ Accounts ---------------------------------- */

/** A user-created institution account (from signup), shown in the switcher. */
export interface UserAccount {
  id: string
  domain: Domain
  subRole: SubRole
  company: string
  tin: string
  contactName: string
  email: string
  onboarding: OnboardStatus
  createdAt: string
}

export type OnboardStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'verified'
  | 'rejected'

/* ------------------------------ Documents --------------------------------- */

/** A single uploaded file reference (mock — no real bytes stored). */
export interface FileRef {
  id: string
  name: string
  /** id of the document section it was filed under. */
  section: string
  sizeKb: number
  at: string
}

/** A supporting-document section within a facility type's document pack. */
export interface DocSection {
  id: string
  name: string
  description: string
  /** "Other" allows multiple uploads. */
  multiple?: boolean
}

/* ------------------------- Sectors & facility types ----------------------- */

export type SectorStatus = 'draft' | 'pending' | 'active' | 'inactive'

/** Admin-configurable typed field for a sector (drives dynamic forms). */
export type FieldType = 'text' | 'document' | 'number' | 'percentage'

export interface SectorField {
  id: string
  name: string
  /** Free-form section this field is grouped under (combo selector). */
  section: string
  description: string
  type: FieldType
}

export interface FacilityType {
  id: string
  name: string
  /** Nomenclature tool-tip shown on the dropdown. */
  tooltip: string
  /** Supporting-document taxonomy specific to this facility type. */
  documentSections: DocSection[]
}

export interface Sector {
  id: string
  name: string
  status: SectorStatus
  facilityTypes: FacilityType[]
  /** Extra admin-defined project-detail fields (Text/Number/Percentage). */
  detailFields: SectorField[]
  /** Extra admin-defined additional-requirement fields. */
  additionalFields: SectorField[]
}

/* -------------------------------- Projects -------------------------------- */

export type ProjectStatus =
  | 'in_progress' // draft (auto-saved)
  | 'on_marketplace' // submitted & live for funding
  | 'recommended' // admin recommended
  | 'selected' // a financier selected it
  | 'accepted' // financier accepted — deal proceeding
  | 'rejected'

export interface ProjectRisk {
  id: string
  risk: string
  consequences: string
  mitigants: string
}

export interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

export interface RepaymentTerm {
  frequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual'
  firstDate: string
  amount: number
  account: string
}

export interface ProjectRejection {
  by: string
  reason: string
  at: string
}

export interface InfoRequest {
  id: string
  by: string
  question: string
  answer?: string
  at: string
}

export interface Project {
  id: string
  ref: string
  borrower: string
  borrowerAccountId?: string
  sectorId: string
  facilityTypeId: string
  name: string
  description: string
  purpose: string
  amount: number
  tenor: number // whole months
  moratorium: string
  domiciliation: string
  equity: number // percent, min 20
  sourceOfRepayment: string
  risks: ProjectRisk[]
  /** Uploaded docs keyed by document-section id. */
  documents: Record<string, FileRef[]>
  /** Values for admin-defined dynamic fields, keyed by field id. */
  fieldValues: Record<string, string>
  additional: string
  status: ProjectStatus
  financier?: string
  recommendedBy?: string
  checklist?: ChecklistItem[]
  repayment?: RepaymentTerm
  rejections?: ProjectRejection[]
  infoRequests?: InfoRequest[]
  createdAt: string
  updatedAt: string
}

/* --------------------------- Borrower profile ----------------------------- */

export interface EduEntry {
  school: string
  qualification: string
  year: string
}
export interface WorkEntry {
  place: string
  position: string
}

export interface Owner {
  id: string
  name: string
  unitsHeld: number
  percentHeld: number
  position: string
  bvn: string
  boardRep: boolean
}

export interface Director {
  id: string
  name: string
  dob: string
  bvn: string
  education: EduEntry[]
  work: WorkEntry[]
  loanExposure: string
  otherInvestments: string
}

export interface Management {
  id: string
  name: string
  education: EduEntry[]
  work: WorkEntry[]
}

export interface BorrowerProfile {
  accountId?: string
  company: string
  rcNumber: string
  tin: string
  address: string
  state: string
  owners: Owner[]
  directors: Director[]
  management: Management[]
  documents: FileRef[]
  onboarding: OnboardStatus
}

/* --------------------------- Financier profile ---------------------------- */

export interface FinancierProfile {
  accountId?: string
  company: string
  rcNumber: string
  contactName: string
  contactPhone: string
  contactEmail: string
  contactPosition: string
  sectorsOfInterest: string[]
  documents: FileRef[]
  onboarding: OnboardStatus
}

/* ------------------------------- Advisory --------------------------------- */

export interface MessageReply {
  id: string
  fromDomain: Domain
  fromCompany: string
  body: string
  at: string
}

export interface Message {
  id: string
  ref: string
  fromDomain: Domain
  fromCompany: string
  toDomain: Domain
  toCompany: string
  subject: string
  body: string
  read: boolean
  at: string // ISO
  replies: MessageReply[]
}

export interface MeetingGuest {
  domain: Domain
  company: string
}

export interface Meeting {
  id: string
  subject: string
  guests: MeetingGuest[]
  date: string // ISO
  duration: number // minutes
  link: string
  status: 'scheduled' | 'cancelled'
  hostDomain: Domain
  hostCompany: string
  createdAt: string
}

/* ------------------------------ Communities ------------------------------- */

export interface CommunityMember {
  id: string
  name: string
  phone: string
  role: 'leader' | 'member'
  status: 'active' | 'inactive' | 'pending'
}

export interface Offer {
  id: string
  name: string
  tenor: number // months
  rate: number // % interest
  subscribers: number
}

export interface Community {
  id: string
  name: string
  description: string
  location: string
  status: 'active' | 'inactive'
  leaders: CommunityMember[]
  members: CommunityMember[]
  offers: Offer[]
}

export type LoanAppStatus = 'pending' | 'approved' | 'disbursed' | 'rejected'

export interface LoanApplication {
  id: string
  ref: string
  communityId: string
  memberName: string
  phone: string
  address: string
  gender: string
  dob: string
  nationality: string
  state: string
  landmark: string
  amount: number
  bvn: string
  tin: string
  sector: string
  monthlySalary: number
  account: string
  documents: FileRef[]
  status: LoanAppStatus
  at: string
}

/* --------------------------- Personas (users) ----------------------------- */

export interface Persona {
  id: string
  name: string
  email: string
  phone: string
  domain: Domain
  subRole: SubRole
  status: 'active' | 'inactive'
  createdAt: string
}

/* --------------------------- Maker-checker -------------------------------- */

export type ApprovalType =
  | 'sector_create'
  | 'sector_change'
  | 'project_recommend'
  | 'project_accept'
  | 'persona_create'
  | 'community_create'
  | 'offer_publish'
  | 'loan_disburse'

export interface Approval {
  id: string
  ref: string
  domain: Domain
  type: ApprovalType
  title: string
  description: string
  /** Opaque data the store applies when approved. */
  payload: Record<string, unknown>
  submittedBy: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  note?: string
  at: string
  reviewedAt?: string
}

/* ------------------------------- Audit ------------------------------------ */

export interface AuditChange {
  field: string
  from: string
  to: string
}

export interface AuditEntry {
  id: string
  ip: string
  user: string
  domain: Domain
  module: string
  activity: string
  at: string
  changes?: AuditChange[]
}

/* --------------------------- Notifications -------------------------------- */

export type NotifCategory =
  | 'project'
  | 'sector'
  | 'approval'
  | 'message'
  | 'meeting'
  | 'onboarding'
  | 'community'
  | 'persona'
  | 'system'

export interface NotificationItem {
  id: string
  audience: Domain
  /** When set, only this persona sub-role sees it (e.g. approvals → authorizer). */
  audienceSub?: SubRole
  category: NotifCategory
  title: string
  body: string
  read: boolean
  time: string
  /** Deep-link route (may carry a `?focus=` query). */
  link?: string
}
