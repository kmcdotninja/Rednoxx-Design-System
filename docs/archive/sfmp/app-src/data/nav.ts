import {
  Building2,
  Home,
  CalendarClock,
  ChartPie,
  ClipboardCheck,
  FolderKanban,
  Landmark,
  Mail,
  ScrollText,
  ShieldCheck,
  Store,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import type { Domain, SubRole } from './types'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
  /** Sub-roles that can see this item (undefined = everyone in the domain). */
  subRoles?: SubRole[]
  /** Tiny gray group label rendered above this item's section in the sidebar. */
  section?: string
}

export interface DomainMeta {
  label: string
  company: string
  base: string
  blurb: string
  icon: LucideIcon
}

export const DOMAINS: Domain[] = ['borrower', 'financier', 'admin']
export const SUBROLES: SubRole[] = ['root', 'initiator', 'authorizer']

export const SUBROLE_LABEL: Record<SubRole, string> = {
  root: 'Root',
  initiator: 'Initiator',
  authorizer: 'Authorizer',
}

export const SUBROLE_BLURB: Record<SubRole, string> = {
  root: 'Organisation super-user — manages users and can act on any request.',
  initiator: 'Makes requests and changes for the authorizer to review.',
  authorizer: 'Approves or rejects what initiators submit (checker).',
}

export const DOMAIN_META: Record<Domain, DomainMeta> = {
  borrower: {
    label: 'Borrower',
    company: 'Helios Renewables Ltd',
    base: '/borrower',
    blurb:
      'Onboard your company, build a project with the right document pack, and raise structured finance from verified financiers.',
    icon: Building2,
  },
  financier: {
    label: 'Financier',
    company: 'Meridian Capital Partners',
    base: '/financier',
    blurb:
      'Browse admin-recommended renewable-energy projects, run appraisal, and select and fund deals under a maker-checker workflow.',
    icon: Landmark,
  },
  admin: {
    label: 'Admin',
    company: 'SFMP · Sterling Bank',
    base: '/admin',
    blurb:
      'Curate sectors and facility types, review and recommend projects, run approvals, and keep the marketplace compliant.',
    icon: ShieldCheck,
  },
}

const makerChecker: SubRole[] = ['root', 'initiator', 'authorizer']

export const DOMAIN_NAV: Record<Domain, NavItem[]> = {
  borrower: [
    { label: 'Home', to: '/borrower', icon: Home, end: true },
    { label: 'Projects', to: '/borrower/projects', icon: FolderKanban, section: 'Financing' },
    { label: 'My Financiers', to: '/borrower/financiers', icon: Landmark, section: 'Financing' },
    { label: 'Messages', to: '/borrower/messages', icon: Mail, subRoles: ['root', 'initiator'], section: 'Advisory' },
    { label: 'Meetings', to: '/borrower/meetings', icon: CalendarClock, subRoles: ['root', 'initiator'], section: 'Advisory' },
    { label: 'Approvals', to: '/borrower/approvals', icon: ClipboardCheck, subRoles: ['root', 'authorizer'], section: 'Organisation' },
    { label: 'User Management', to: '/borrower/users', icon: Users, subRoles: ['root'], section: 'Organisation' },
  ],
  financier: [
    { label: 'Home', to: '/financier', icon: Home, end: true },
    { label: 'Marketplace', to: '/financier/marketplace', icon: Store, section: 'Financing' },
    { label: 'Projects', to: '/financier/projects', icon: FolderKanban, section: 'Financing' },
    { label: 'My Borrowers', to: '/financier/borrowers', icon: Building2, section: 'Financing' },
    { label: 'Communities', to: '/financier/communities', icon: UsersRound, section: 'Financing' },
    { label: 'Messages', to: '/financier/messages', icon: Mail, subRoles: ['root', 'initiator'], section: 'Advisory' },
    { label: 'Meetings', to: '/financier/meetings', icon: CalendarClock, subRoles: ['root', 'initiator'], section: 'Advisory' },
    { label: 'Approvals', to: '/financier/approvals', icon: ClipboardCheck, subRoles: ['root', 'authorizer'], section: 'Organisation' },
    { label: 'User Management', to: '/financier/users', icon: Users, subRoles: ['root'], section: 'Organisation' },
  ],
  admin: [
    { label: 'Home', to: '/admin', icon: Home, end: true },
    { label: 'Sectors', to: '/admin/sectors', icon: ChartPie, section: 'Marketplace' },
    { label: 'Projects', to: '/admin/projects', icon: FolderKanban, section: 'Marketplace' },
    { label: 'Borrowers', to: '/admin/borrowers', icon: Building2, section: 'Marketplace' },
    { label: 'Financiers', to: '/admin/financiers', icon: Landmark, section: 'Marketplace' },
    { label: 'Communities', to: '/admin/communities', icon: UsersRound, section: 'Marketplace' },
    { label: 'Messages', to: '/admin/messages', icon: Mail, subRoles: ['root', 'initiator'], section: 'Advisory' },
    { label: 'Meetings', to: '/admin/meetings', icon: CalendarClock, subRoles: ['root', 'initiator'], section: 'Advisory' },
    { label: 'Approvals', to: '/admin/approvals', icon: ClipboardCheck, subRoles: ['root', 'authorizer'], section: 'Governance' },
    { label: 'Audit Trail', to: '/admin/audit', icon: ScrollText, section: 'Governance' },
    { label: 'User Management', to: '/admin/users', icon: Users, subRoles: ['root'], section: 'Governance' },
  ],
}

export const DOMAIN_TAGLINE: Record<Domain, { icon: LucideIcon; blurb: string }> = {
  borrower: { icon: Building2, blurb: DOMAIN_META.borrower.blurb },
  financier: { icon: Landmark, blurb: DOMAIN_META.financier.blurb },
  admin: { icon: ShieldCheck, blurb: DOMAIN_META.admin.blurb },
}

/* ----------------------- maker-checker capabilities ----------------------- */

/** Capability → the sub-roles that hold it. Initiators make, authorizers check,
 *  root can do everything within its domain. Mirrors the reference app's
 *  AuthUserUIPermission gating. */
export const CAPABILITIES = {
  create: ['root', 'initiator'] as SubRole[], // create / edit / submit
  approve: ['root', 'authorizer'] as SubRole[], // approve / reject in the queue
  manageUsers: ['root'] as SubRole[],
  advisory: ['root', 'initiator'] as SubRole[], // messages / meetings
} as const

export type Capability = keyof typeof CAPABILITIES

export function can(cap: Capability, subRole: SubRole): boolean {
  return CAPABILITIES[cap].includes(subRole)
}

export function navFor(domain: Domain, subRole: SubRole): NavItem[] {
  return DOMAIN_NAV[domain].filter((n) => !n.subRoles || n.subRoles.includes(subRole))
}

/** Unused today but handy for search/labels. */
export { makerChecker }
