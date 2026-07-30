import { createContext, useContext, useState, type ReactNode } from 'react'

/**
 * RBAC demo model (user-story catalogue §3): "Role permissions must be
 * implemented through the Core Platform RBAC model and configured per
 * facility, department and job function." Each persona carries a scoped menu
 * and default landing — role-based IA, not one generic menu with hidden items.
 */

export type HimRole =
  | 'front-desk'
  | 'him-officer'
  | 'him-supervisor'
  | 'ae-registration'
  | 'triage-nurse'
  | 'clinician'
  | 'ward-clerk'
  | 'billing'
  | 'claims'
  | 'facility-admin'
  | 'dpo'
  | 'auditor'

export interface HimPermissions {
  register: boolean
  checkIn: boolean
  decideDuplicates: boolean
  merge: boolean
  unmerge: boolean
  approveRelease: boolean
  requestRelease: boolean
  logDsar: boolean
  uploadDocuments: boolean
  recordActions: boolean
  markDeceased: boolean
  documentException: boolean
  breakGlass: boolean
  exportAudit: boolean
  manageConfig: boolean
}

export interface RolePersona {
  role: HimRole
  /** Exact actor title from the user-story catalogue. */
  title: string
  name: string
  facility: string
  department: string
  /** Default landing slug after switching to this role. */
  landing: string
  /** Scoped menu — nav slugs this role works in. */
  nav: string[]
  permissions: HimPermissions
}

const NONE: HimPermissions = {
  register: false,
  checkIn: false,
  decideDuplicates: false,
  merge: false,
  unmerge: false,
  approveRelease: false,
  requestRelease: false,
  logDsar: false,
  uploadDocuments: false,
  recordActions: false,
  markDeceased: false,
  documentException: false,
  breakGlass: false,
  exportAudit: false,
  manageConfig: false,
}

export const PERSONAS: RolePersona[] = [
  {
    role: 'him-officer',
    title: 'HIM Officer',
    name: 'Funmi Ibrahim',
    facility: 'Garki General Hospital',
    department: 'Health Information Management',
    landing: 'overview',
    nav: ['overview', 'patients', 'appointments', 'duplicates', 'incomplete', 'documents', 'releases', 'audit'],
    permissions: {
      ...NONE,
      register: true,
      checkIn: true,
      decideDuplicates: true,
      requestRelease: true,
      logDsar: true,
      uploadDocuments: true,
      recordActions: true,
      markDeceased: true,
      documentException: true,
    },
  },
  {
    role: 'him-supervisor',
    title: 'HIM Supervisor',
    name: 'Umar Musa',
    facility: 'Garki General Hospital',
    department: 'Health Information Management',
    landing: 'duplicates',
    // Sees the org structure read-only — configuring it needs `manageConfig`.
    nav: ['overview', 'patients', 'appointments', 'duplicates', 'incomplete', 'documents', 'releases', 'audit', 'operations', 'admin'],
    permissions: {
      ...NONE,
      register: true,
      checkIn: true,
      decideDuplicates: true,
      merge: true,
      unmerge: true,
      approveRelease: true,
      requestRelease: true,
      logDsar: true,
      uploadDocuments: true,
      recordActions: true,
      markDeceased: true,
      documentException: true,
      breakGlass: true,
      exportAudit: true,
    },
  },
  {
    role: 'front-desk',
    title: 'Front Desk Officer',
    name: 'Bala Adamu',
    facility: 'Garki General Hospital',
    department: 'Registration · Front desk',
    landing: 'patients',
    nav: ['overview', 'patients', 'appointments'],
    permissions: { ...NONE, register: true, checkIn: true },
  },
  {
    role: 'ae-registration',
    title: 'A&E Registration Officer',
    name: 'Sani Bello',
    facility: 'Garki General Hospital',
    department: 'Accident & Emergency',
    landing: 'patients',
    nav: ['overview', 'patients', 'appointments'],
    permissions: { ...NONE, register: true, checkIn: true },
  },
  {
    role: 'triage-nurse',
    title: 'Triage Nurse',
    name: 'Chidinma Eke',
    facility: 'Garki General Hospital',
    department: 'A&E · Triage',
    landing: 'appointments',
    nav: ['overview', 'patients', 'appointments'],
    // Duty (catalogue §3): validates minimal identity, prioritises, links to encounter.
    permissions: { ...NONE, checkIn: true },
  },
  {
    role: 'clinician',
    title: 'Clinician',
    name: 'Dr. Femi Alade',
    facility: 'Garki General Hospital',
    department: 'General practice',
    landing: 'patients',
    nav: ['patients', 'releases'],
    permissions: { ...NONE, breakGlass: true, markDeceased: true, requestRelease: true },
  },
  {
    role: 'ward-clerk',
    title: 'Ward Clerk',
    name: 'Ibrahim Sule',
    facility: 'Garki General Hospital',
    department: 'Admissions · Ward B',
    landing: 'patients',
    nav: ['patients', 'appointments'],
    permissions: { ...NONE },
  },
  {
    role: 'billing',
    title: 'Billing Officer',
    name: 'Patience Udo',
    facility: 'Garki General Hospital',
    department: 'Billing & cashier',
    landing: 'patients',
    nav: ['patients'],
    permissions: { ...NONE },
  },
  {
    role: 'claims',
    title: 'Claims / HMO Officer',
    name: 'Tosin Ajayi',
    facility: 'Garki General Hospital',
    department: 'Claims & payer relations',
    landing: 'releases',
    nav: ['patients', 'releases'],
    permissions: { ...NONE, requestRelease: true },
  },
  {
    role: 'dpo',
    title: 'Data Protection Officer',
    name: 'Kemi Olawale',
    facility: 'Garki General Hospital',
    department: 'Privacy & compliance',
    landing: 'audit',
    nav: ['overview', 'patients', 'releases', 'audit', 'operations'],
    permissions: { ...NONE, approveRelease: true, requestRelease: true, logDsar: true, exportAudit: true },
  },
  {
    role: 'auditor',
    title: 'Auditor / Compliance Reviewer',
    name: 'Aisha Mohammed',
    facility: 'Garki General Hospital',
    department: 'Compliance',
    landing: 'audit',
    nav: ['overview', 'patients', 'audit', 'operations'],
    permissions: { ...NONE, exportAudit: true },
  },
  {
    role: 'facility-admin',
    title: 'Facility Admin',
    name: 'Dayo Okon',
    facility: 'Garki General Hospital',
    department: 'Administration',
    landing: 'admin',
    nav: ['overview', 'audit', 'operations', 'admin'],
    permissions: { ...NONE, manageConfig: true, exportAudit: true },
  },
]

interface RoleContextValue {
  persona: RolePersona
  can: HimPermissions
  setRole: (role: HimRole) => void
}

const RoleContext = createContext<RoleContextValue | null>(null)

/** Initial role can be set for demos via ?him-role=front-desk etc. */
function initialRole(): HimRole {
  if (typeof window === 'undefined') return 'him-officer'
  const param = new URLSearchParams(window.location.search).get('him-role')
  return PERSONAS.some((p) => p.role === param) ? (param as HimRole) : 'him-officer'
}

export function RoleProvider({
  children,
  onRoleChange,
}: {
  children: ReactNode
  /** Called with the new persona so the shell can navigate to its landing. */
  onRoleChange?: (persona: RolePersona) => void
}) {
  const [role, setRoleState] = useState<HimRole>(initialRole)
  const persona = PERSONAS.find((p) => p.role === role) ?? PERSONAS[0]
  const setRole = (next: HimRole) => {
    setRoleState(next)
    const p = PERSONAS.find((x) => x.role === next)
    if (p) onRoleChange?.(p)
  }
  return (
    <RoleContext.Provider value={{ persona, can: persona.permissions, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used inside the HIM RoleProvider')
  return ctx
}
