import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as mock from '@/data/mock'
import type {
  Approval,
  ApprovalType,
  AuditChange,
  AuditEntry,
  BorrowerProfile,
  ChecklistItem,
  Community,
  CommunityMember,
  Domain,
  FinancierProfile,
  LoanApplication,
  Meeting,
  Message,
  NotificationItem,
  Offer,
  OnboardStatus,
  Persona,
  Project,
  RepaymentTerm,
  Sector,
  SubRole,
  UserAccount,
} from '@/data/types'

const KEY = 'sfmp.store.v4'

/* ------------------------------- identity --------------------------------- */

export interface Actor {
  domain: Domain
  subRole: SubRole
  user: string
  company: string
}

/* -------------------------- the shared world ------------------------------ */

interface World {
  sectors: Sector[]
  projects: Project[]
  borrowers: BorrowerProfile[]
  financiers: FinancierProfile[]
  messages: Message[]
  meetings: Meeting[]
  communities: Community[]
  loanApplications: LoanApplication[]
  personas: Persona[]
  approvals: Approval[]
  auditTrail: AuditEntry[]
  notifications: NotificationItem[]
}

function seedWorld(): World {
  return {
    sectors: mock.SECTORS,
    projects: mock.PROJECTS,
    borrowers: mock.BORROWERS,
    financiers: mock.FINANCIERS,
    messages: mock.MESSAGES,
    meetings: mock.MEETINGS,
    communities: mock.COMMUNITIES,
    loanApplications: mock.LOAN_APPLICATIONS,
    personas: mock.PERSONAS,
    approvals: mock.APPROVALS,
    auditTrail: mock.AUDIT,
    notifications: mock.NOTIFICATIONS,
  }
}

interface AppState {
  world: World
  accounts: UserAccount[]
  activeAccountId: string | null
  actor: Actor
}

const DEFAULT_ACTOR: Actor = {
  domain: 'borrower',
  subRole: 'root',
  user: mock.CURRENT_USERS.borrower.name,
  company: mock.BORROWER_CO,
}

function initialApp(): AppState {
  return { world: seedWorld(), accounts: [], activeAccountId: null, actor: DEFAULT_ACTOR }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initialApp(), ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return initialApp()
}

/* -------------------------------- helpers --------------------------------- */

export function newId(prefix = 'sf'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

function mkNotif(
  audience: Domain,
  category: NotificationItem['category'],
  title: string,
  body: string,
  link?: string,
  audienceSub?: SubRole,
): NotificationItem {
  return { id: newId('n'), audience, audienceSub, category, title, body, read: false, time: 'Just now', link }
}

const REF_SEQ = { prj: 7, msg: 4030, apr: 5011, cl: 2210 }
function nextRef(kind: keyof typeof REF_SEQ, prefix: string, pad = 4): string {
  const n = REF_SEQ[kind]++
  return `${prefix}${String(n).padStart(pad, '0')}`
}

/* ------------------------------- store API -------------------------------- */

interface StoreApi extends World {
  accounts: UserAccount[]
  activeAccountId: string | null
  actor: Actor
  setActor: (actor: Actor) => void

  // accounts
  createAccount: (input: { domain: Domain; subRole: SubRole; company: string; tin: string; contactName: string; email: string }) => UserAccount
  switchAccount: (id: string | null) => void
  setAccountOnboarding: (id: string, status: UserAccount['onboarding']) => void

  // projects
  createProject: (input: Partial<Project> & { facilityTypeId: string; sectorId: string }) => Project
  saveProject: (id: string, changes: Partial<Project>) => void
  submitProject: (id: string) => void
  recommendProject: (id: string) => void
  selectProject: (id: string) => void
  acceptProject: (id: string) => void
  rejectProject: (id: string, reason: string) => void
  requestProjectInfo: (id: string, question: string) => void
  provideProjectInfo: (id: string, requestId: string, answer: string) => void
  submitChecklist: (id: string, checklist: ChecklistItem[], repayment: RepaymentTerm) => void

  // sectors + maker-checker
  saveSectorDraft: (sector: Sector) => void
  submitSectorForApproval: (sector: Sector, isNew: boolean) => void
  submitApproval: (input: { domain: Domain; type: ApprovalType; title: string; description: string; payload: Record<string, unknown> }) => void
  resolveApproval: (id: string, approve: boolean, note?: string) => void

  // onboarding
  submitBorrowerOnboarding: (profile: BorrowerProfile) => void
  submitFinancierOnboarding: (profile: FinancierProfile) => void
  verifyBorrower: (company: string) => void
  verifyFinancier: (company: string) => void
  /** Demo helper — flip a company's onboarding state to preview each stage. */
  setOnboardingStatus: (domain: 'borrower' | 'financier', company: string, status: OnboardStatus) => void

  // advisory
  sendMessage: (input: { toDomain: Domain; toCompany: string; subject: string; body: string }) => void
  replyMessage: (id: string, body: string) => void
  markMessageRead: (id: string) => void
  createMeeting: (input: Omit<Meeting, 'id' | 'status' | 'createdAt' | 'hostDomain' | 'hostCompany'>) => void
  cancelMeeting: (id: string) => void

  // communities
  createCommunity: (input: { name: string; description: string; location: string }) => void
  addCommunityMember: (communityId: string, member: Omit<CommunityMember, 'id'>) => void
  createOffer: (communityId: string, offer: Omit<Offer, 'id' | 'subscribers'>) => void
  applyLoan: (input: Omit<LoanApplication, 'id' | 'ref' | 'status' | 'at'>) => void
  setLoanStatus: (id: string, status: LoanApplication['status']) => void

  // personas
  createPersona: (input: Omit<Persona, 'id' | 'createdAt' | 'status'>) => void
  setPersonaStatus: (id: string, status: Persona['status']) => void

  // notifications
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: (audience?: Domain) => void

  reset: () => void
}

const StoreContext = createContext<StoreApi | null>(null)

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within AppStoreProvider')
  return ctx
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const api = useMemo<StoreApi>(() => {
    const { world, actor } = state

    const patch = (fn: (w: World) => World) =>
      setState((prev) => ({ ...prev, world: fn(prev.world) }))

    const audit = (
      w: World,
      module: string,
      activity: string,
      changes?: AuditChange[],
    ): AuditEntry[] => [
      {
        id: newId('au'),
        ip: `102.89.${20 + (activity.length % 200)}.${activity.length % 250}`,
        user: state.actor.user,
        domain: state.actor.domain,
        module,
        activity,
        at: new Date().toISOString(),
        changes,
      },
      ...w.auditTrail,
    ]

    const applyApproval = (w: World, approval: Approval): World => {
      const p = approval.payload
      switch (approval.type) {
        case 'sector_create':
        case 'sector_change': {
          const sector = p.sector as Sector | undefined
          if (!sector?.id) return w
          const committed: Sector = { ...sector, status: 'active' }
          const exists = w.sectors.some((s) => s.id === committed.id)
          return {
            ...w,
            sectors: exists
              ? w.sectors.map((s) => (s.id === committed.id ? committed : s))
              : [committed, ...w.sectors],
            notifications: [
              mkNotif('admin', 'sector', 'Sector change approved', `${committed.name} is now published across the marketplace.`, '/admin/sectors'),
              ...w.notifications,
            ],
          }
        }
        case 'project_recommend': {
          const projectId = p.projectId as string
          const proj = w.projects.find((pr) => pr.id === projectId)
          return {
            ...w,
            projects: w.projects.map((pr) =>
              pr.id === projectId ? { ...pr, status: 'recommended', recommendedBy: state.actor.company, updatedAt: new Date().toISOString() } : pr,
            ),
            notifications: [
              mkNotif('financier', 'project', 'New recommended project', `${proj?.name ?? 'A project'} is now on the marketplace.`, '/financier/marketplace'),
              mkNotif('borrower', 'project', 'Project recommended', `${proj?.ref ?? 'Your project'} was recommended to financiers.`, '/borrower/projects'),
              ...w.notifications,
            ],
          }
        }
        case 'persona_create': {
          const persona = p.persona as Persona
          return { ...w, personas: [persona, ...w.personas] }
        }
        case 'community_create': {
          const community = p.community as Community
          return { ...w, communities: [community, ...w.communities] }
        }
        case 'offer_publish': {
          const { communityId, offer } = p as { communityId: string; offer: Offer }
          return {
            ...w,
            communities: w.communities.map((c) => (c.id === communityId ? { ...c, offers: [offer, ...c.offers] } : c)),
          }
        }
        case 'loan_disburse': {
          const loanId = p.loanId as string
          return {
            ...w,
            loanApplications: w.loanApplications.map((l) => (l.id === loanId ? { ...l, status: 'disbursed' } : l)),
          }
        }
        default:
          return w
      }
    }

    return {
      ...world,
      accounts: state.accounts,
      activeAccountId: state.activeAccountId,
      actor,

      setActor: (next) => setState((prev) => (prev.actor.domain === next.domain && prev.actor.subRole === next.subRole && prev.actor.company === next.company ? prev : { ...prev, actor: next })),

      /* ------------------------------ accounts ------------------------------ */
      createAccount: (input) => {
        const acct: UserAccount = { id: newId('acc'), ...input, onboarding: 'not_started', createdAt: 'Just now' }
        setState((prev) => ({ ...prev, accounts: [...prev.accounts, acct], activeAccountId: acct.id }))
        return acct
      },
      switchAccount: (id) => setState((prev) => ({ ...prev, activeAccountId: id })),
      setAccountOnboarding: (id, status) =>
        setState((prev) => ({ ...prev, accounts: prev.accounts.map((a) => (a.id === id ? { ...a, onboarding: status } : a)) })),

      /* ------------------------------ projects ------------------------------ */
      createProject: (input) => {
        const now = new Date().toISOString()
        const project: Project = {
          id: newId('prj'),
          ref: nextRef('prj', 'SFMP-PRJ-'),
          borrower: state.actor.company,
          sectorId: input.sectorId,
          facilityTypeId: input.facilityTypeId,
          name: input.name ?? '',
          description: input.description ?? '',
          purpose: input.purpose ?? '',
          amount: input.amount ?? 0,
          tenor: input.tenor ?? 0,
          moratorium: input.moratorium ?? '',
          domiciliation: input.domiciliation ?? '',
          equity: input.equity ?? 0,
          sourceOfRepayment: input.sourceOfRepayment ?? '',
          risks: input.risks ?? [],
          documents: input.documents ?? {},
          fieldValues: input.fieldValues ?? {},
          additional: input.additional ?? '',
          status: input.status ?? 'in_progress',
          createdAt: now,
          updatedAt: now,
        }
        patch((w) => ({ ...w, projects: [project, ...w.projects] }))
        return project
      },
      saveProject: (id, changes) =>
        patch((w) => ({
          ...w,
          projects: w.projects.map((p) => (p.id === id ? { ...p, ...changes, updatedAt: new Date().toISOString() } : p)),
        })),
      submitProject: (id) =>
        patch((w) => {
          const proj = w.projects.find((p) => p.id === id)
          if (!proj) return w
          return {
            ...w,
            projects: w.projects.map((p) => (p.id === id ? { ...p, status: 'on_marketplace', updatedAt: new Date().toISOString() } : p)),
            auditTrail: audit(w, 'Projects', `Submitted ${proj.ref} to the marketplace`),
            notifications: [
              mkNotif('admin', 'project', 'New project submission', `${state.actor.company} submitted ${proj.ref}.`, `/admin/projects?focus=${id}`),
              ...w.notifications,
            ],
          }
        }),
      recommendProject: (id) =>
        patch((w) => {
          const proj = w.projects.find((p) => p.id === id)
          if (!proj) return w
          return {
            ...w,
            projects: w.projects.map((p) => (p.id === id ? { ...p, status: 'recommended', recommendedBy: state.actor.company, updatedAt: new Date().toISOString() } : p)),
            auditTrail: audit(w, 'Projects', `Recommended ${proj.ref} to the marketplace`, [{ field: 'status', from: proj.status, to: 'recommended' }]),
            notifications: [
              mkNotif('financier', 'project', 'New recommended project', `${proj.name} is now on the marketplace.`, '/financier/marketplace'),
              mkNotif('borrower', 'project', 'Project recommended', `${proj.ref} was recommended to financiers.`, '/borrower/projects'),
              ...w.notifications,
            ],
          }
        }),
      selectProject: (id) =>
        patch((w) => {
          const proj = w.projects.find((p) => p.id === id)
          if (!proj) return w
          return {
            ...w,
            projects: w.projects.map((p) => (p.id === id ? { ...p, status: 'selected', financier: state.actor.company, updatedAt: new Date().toISOString() } : p)),
            auditTrail: audit(w, 'Projects', `Selected ${proj.ref} for funding`, [{ field: 'status', from: proj.status, to: 'selected' }]),
            notifications: [
              mkNotif('borrower', 'project', 'A financier selected your project', `${state.actor.company} selected ${proj.ref}.`, '/borrower/projects'),
              mkNotif('admin', 'project', 'Project selected', `${state.actor.company} selected ${proj.ref}.`, '/admin/projects'),
              ...w.notifications,
            ],
          }
        }),
      acceptProject: (id) =>
        patch((w) => {
          const proj = w.projects.find((p) => p.id === id)
          if (!proj) return w
          const checklist: ChecklistItem[] = proj.checklist ?? [
            { id: 'c1', label: 'Facility agreement executed', checked: false },
            { id: 'c2', label: 'Security perfected', checked: false },
            { id: 'c3', label: 'Conditions precedent met', checked: false },
            { id: 'c4', label: 'Disbursement account set up', checked: false },
          ]
          return {
            ...w,
            projects: w.projects.map((p) => (p.id === id ? { ...p, status: 'accepted', financier: state.actor.company, checklist, updatedAt: new Date().toISOString() } : p)),
            auditTrail: audit(w, 'Projects', `Accepted ${proj.ref}`, [{ field: 'status', from: proj.status, to: 'accepted' }]),
            notifications: [
              mkNotif('borrower', 'project', 'Project accepted', `${state.actor.company} accepted ${proj.ref}. Complete the acceptance checklist.`, '/borrower/projects'),
              mkNotif('admin', 'project', 'Deal proceeding', `${proj.ref} was accepted by ${state.actor.company}.`, '/admin/projects'),
              ...w.notifications,
            ],
          }
        }),
      rejectProject: (id, reason) =>
        patch((w) => {
          const proj = w.projects.find((p) => p.id === id)
          if (!proj) return w
          return {
            ...w,
            projects: w.projects.map((p) =>
              p.id === id
                ? { ...p, status: 'rejected', rejections: [...(p.rejections ?? []), { by: state.actor.company, reason, at: new Date().toISOString() }], updatedAt: new Date().toISOString() }
                : p,
            ),
            auditTrail: audit(w, 'Projects', `Rejected ${proj.ref}`, [{ field: 'status', from: proj.status, to: 'rejected' }]),
            notifications: [
              mkNotif('borrower', 'project', 'Project rejected', `${state.actor.company} rejected ${proj.ref}: ${reason}`, '/borrower/projects'),
              ...w.notifications,
            ],
          }
        }),
      requestProjectInfo: (id, question) =>
        patch((w) => {
          const proj = w.projects.find((p) => p.id === id)
          if (!proj) return w
          return {
            ...w,
            projects: w.projects.map((p) =>
              p.id === id ? { ...p, infoRequests: [...(p.infoRequests ?? []), { id: newId('ir'), by: state.actor.company, question, at: new Date().toISOString() }] } : p,
            ),
            notifications: [
              mkNotif('borrower', 'message', 'Information requested', `${state.actor.company} requested more information on ${proj.ref}.`, '/borrower/projects'),
              ...w.notifications,
            ],
          }
        }),
      provideProjectInfo: (id, requestId, answer) =>
        patch((w) => ({
          ...w,
          projects: w.projects.map((p) =>
            p.id === id ? { ...p, infoRequests: (p.infoRequests ?? []).map((r) => (r.id === requestId ? { ...r, answer } : r)) } : p,
          ),
        })),
      submitChecklist: (id, checklist, repayment) =>
        patch((w) => {
          const proj = w.projects.find((p) => p.id === id)
          if (!proj) return w
          return {
            ...w,
            projects: w.projects.map((p) => (p.id === id ? { ...p, checklist, repayment, updatedAt: new Date().toISOString() } : p)),
            auditTrail: audit(w, 'Projects', `Completed acceptance checklist for ${proj.ref}`),
            notifications: [
              mkNotif('financier', 'project', 'Checklist submitted', `${proj.borrower} completed the acceptance checklist for ${proj.ref}.`, '/financier/projects'),
              ...w.notifications,
            ],
          }
        }),

      /* -------------------------- sectors + approvals ----------------------- */
      // Drafts live only on the admin-initiator view until submitted for approval.
      saveSectorDraft: (sector) =>
        patch((w) => {
          const exists = w.sectors.some((s) => s.id === sector.id)
          return {
            ...w,
            sectors: exists ? w.sectors.map((s) => (s.id === sector.id ? sector : s)) : [sector, ...w.sectors],
            auditTrail: audit(w, 'Sectors', `Saved draft changes to ${sector.name}`),
          }
        }),
      submitSectorForApproval: (sector, isNew) =>
        patch((w) => {
          const pendingSector: Sector = { ...sector, status: 'pending' }
          const exists = w.sectors.some((s) => s.id === sector.id)
          const approval: Approval = {
            id: newId('ap'),
            ref: nextRef('apr', 'APR-'),
            domain: 'admin',
            type: isNew ? 'sector_create' : 'sector_change',
            title: `${isNew ? 'Create' : 'Update'} sector — ${sector.name}`,
            description: `${isNew ? 'New sector' : 'Changes'} submitted with ${sector.facilityTypes.length} facility type(s).`,
            payload: { sector },
            submittedBy: state.actor.user,
            status: 'pending',
            at: new Date().toISOString(),
          }
          return {
            ...w,
            sectors: exists ? w.sectors.map((s) => (s.id === sector.id ? pendingSector : s)) : [pendingSector, ...w.sectors],
            approvals: [approval, ...w.approvals],
            auditTrail: audit(w, 'Sectors', `Submitted ${sector.name} for approval`),
            notifications: [
              mkNotif('admin', 'approval', 'Approval pending', `A sector ${isNew ? 'creation' : 'change'} is awaiting your review.`, '/admin/approvals', 'authorizer'),
              ...w.notifications,
            ],
          }
        }),
      submitApproval: (input) =>
        patch((w) => {
          const approval: Approval = {
            id: newId('ap'),
            ref: nextRef('apr', 'APR-'),
            domain: input.domain,
            type: input.type,
            title: input.title,
            description: input.description,
            payload: input.payload,
            submittedBy: state.actor.user,
            status: 'pending',
            at: new Date().toISOString(),
          }
          return {
            ...w,
            approvals: [approval, ...w.approvals],
            auditTrail: audit(w, 'Approvals', `Submitted for approval: ${input.title}`),
            notifications: [
              mkNotif(input.domain, 'approval', 'Approval pending', `${input.title} is awaiting your review.`, `/${input.domain}/approvals`, 'authorizer'),
              ...w.notifications,
            ],
          }
        }),
      resolveApproval: (id, approve, note) =>
        patch((w) => {
          const approval = w.approvals.find((a) => a.id === id)
          if (!approval || approval.status !== 'pending') return w
          const resolved: Approval = { ...approval, status: approve ? 'approved' : 'rejected', reviewedBy: state.actor.user, note, reviewedAt: new Date().toISOString() }
          let next: World = {
            ...w,
            approvals: w.approvals.map((a) => (a.id === id ? resolved : a)),
            auditTrail: audit(w, 'Approvals', `${approve ? 'Approved' : 'Rejected'} ${approval.ref} — ${approval.title}`),
          }
          if (approve) next = applyApproval(next, resolved)
          return next
        }),

      /* ------------------------------ onboarding ---------------------------- */
      submitBorrowerOnboarding: (profile) =>
        patch((w) => {
          const exists = w.borrowers.some((b) => b.company === profile.company)
          const saved: BorrowerProfile = { ...profile, onboarding: 'submitted' }
          return {
            ...w,
            borrowers: exists ? w.borrowers.map((b) => (b.company === profile.company ? saved : b)) : [saved, ...w.borrowers],
            auditTrail: audit(w, 'Onboarding', `Submitted borrower onboarding for ${profile.company}`),
            notifications: [
              mkNotif('admin', 'onboarding', 'New borrower onboarding', `${profile.company} submitted onboarding for review.`, '/admin/borrowers'),
              ...w.notifications,
            ],
          }
        }),
      submitFinancierOnboarding: (profile) =>
        patch((w) => {
          const exists = w.financiers.some((f) => f.company === profile.company)
          const saved: FinancierProfile = { ...profile, onboarding: 'submitted' }
          return {
            ...w,
            financiers: exists ? w.financiers.map((f) => (f.company === profile.company ? saved : f)) : [saved, ...w.financiers],
            auditTrail: audit(w, 'Onboarding', `Submitted financier onboarding for ${profile.company}`),
            notifications: [
              mkNotif('admin', 'onboarding', 'New financier onboarding', `${profile.company} submitted onboarding for review.`, '/admin/financiers'),
              ...w.notifications,
            ],
          }
        }),
      verifyBorrower: (company) =>
        patch((w) => ({
          ...w,
          borrowers: w.borrowers.map((b) => (b.company === company ? { ...b, onboarding: 'verified' } : b)),
          auditTrail: audit(w, 'Borrowers', `Verified borrower ${company}`),
          notifications: [mkNotif('borrower', 'onboarding', 'Onboarding verified', `${company} is fully verified — all features are unlocked.`, '/borrower'), ...w.notifications],
        })),
      verifyFinancier: (company) =>
        patch((w) => ({
          ...w,
          financiers: w.financiers.map((f) => (f.company === company ? { ...f, onboarding: 'verified' } : f)),
          auditTrail: audit(w, 'Financiers', `Verified financier ${company}`),
          notifications: [mkNotif('financier', 'onboarding', 'Onboarding verified', `${company} is fully verified — all features are unlocked.`, '/financier'), ...w.notifications],
        })),
      setOnboardingStatus: (domain, company, status) =>
        patch((w) =>
          domain === 'borrower'
            ? { ...w, borrowers: w.borrowers.map((b) => (b.company === company ? { ...b, onboarding: status } : b)) }
            : { ...w, financiers: w.financiers.map((f) => (f.company === company ? { ...f, onboarding: status } : f)) },
        ),

      /* ------------------------------- advisory ----------------------------- */
      sendMessage: (input) =>
        patch((w) => {
          const msg: Message = {
            id: newId('msg'),
            ref: nextRef('msg', 'MSG-', 4),
            fromDomain: state.actor.domain,
            fromCompany: state.actor.company,
            toDomain: input.toDomain,
            toCompany: input.toCompany,
            subject: input.subject,
            body: input.body,
            read: false,
            at: new Date().toISOString(),
            replies: [],
          }
          return {
            ...w,
            messages: [msg, ...w.messages],
            notifications: [mkNotif(input.toDomain, 'message', 'New message', `${state.actor.company}: ${input.subject}`, `/${input.toDomain}/messages`), ...w.notifications],
          }
        }),
      replyMessage: (id, body) =>
        patch((w) => {
          const msg = w.messages.find((m) => m.id === id)
          if (!msg) return w
          const other = msg.fromDomain === state.actor.domain ? msg.toDomain : msg.fromDomain
          return {
            ...w,
            messages: w.messages.map((m) =>
              m.id === id ? { ...m, replies: [...m.replies, { id: newId('rp'), fromDomain: state.actor.domain, fromCompany: state.actor.company, body, at: new Date().toISOString() }] } : m,
            ),
            notifications: [mkNotif(other, 'message', 'New reply', `${state.actor.company} replied on “${msg.subject}”.`, `/${other}/messages`), ...w.notifications],
          }
        }),
      markMessageRead: (id) =>
        patch((w) => ({ ...w, messages: w.messages.map((m) => (m.id === id ? { ...m, read: true } : m)) })),
      createMeeting: (input) =>
        patch((w) => {
          const meeting: Meeting = { ...input, id: newId('mtg'), status: 'scheduled', hostDomain: state.actor.domain, hostCompany: state.actor.company, createdAt: new Date().toISOString() }
          const notifs = input.guests.map((g) => mkNotif(g.domain, 'meeting', 'Meeting invitation', `${state.actor.company} invited you to “${input.subject}”.`, `/${g.domain}/meetings`))
          return { ...w, meetings: [meeting, ...w.meetings], notifications: [...notifs, ...w.notifications] }
        }),
      cancelMeeting: (id) =>
        patch((w) => ({ ...w, meetings: w.meetings.map((m) => (m.id === id ? { ...m, status: 'cancelled' } : m)) })),

      /* ------------------------------ communities --------------------------- */
      createCommunity: (input) =>
        patch((w) => {
          const community: Community = { id: newId('com'), name: input.name, description: input.description, location: input.location, status: 'active', leaders: [], members: [], offers: [] }
          return { ...w, communities: [community, ...w.communities], auditTrail: audit(w, 'Communities', `Created community ${input.name}`) }
        }),
      addCommunityMember: (communityId, member) =>
        patch((w) => ({
          ...w,
          communities: w.communities.map((c) =>
            c.id === communityId
              ? member.role === 'leader'
                ? { ...c, leaders: [...c.leaders, { ...member, id: newId('cm') }] }
                : { ...c, members: [...c.members, { ...member, id: newId('cm') }] }
              : c,
          ),
        })),
      createOffer: (communityId, offer) =>
        patch((w) => ({
          ...w,
          communities: w.communities.map((c) => (c.id === communityId ? { ...c, offers: [{ ...offer, id: newId('of'), subscribers: 0 }, ...c.offers] } : c)),
        })),
      applyLoan: (input) =>
        patch((w) => {
          const loan: LoanApplication = { ...input, id: newId('la'), ref: nextRef('cl', 'CL-', 4), status: 'pending', at: new Date().toISOString() }
          return { ...w, loanApplications: [loan, ...w.loanApplications] }
        }),
      setLoanStatus: (id, status) =>
        patch((w) => ({ ...w, loanApplications: w.loanApplications.map((l) => (l.id === id ? { ...l, status } : l)) })),

      /* ------------------------------- personas ----------------------------- */
      createPersona: (input) =>
        patch((w) => {
          const persona: Persona = { ...input, id: newId('ps'), status: 'active', createdAt: new Date().toISOString() }
          return { ...w, personas: [persona, ...w.personas], auditTrail: audit(w, 'User Management', `Created ${input.subRole} persona ${input.name}`) }
        }),
      setPersonaStatus: (id, status) =>
        patch((w) => ({ ...w, personas: w.personas.map((p) => (p.id === id ? { ...p, status } : p)) })),

      /* ----------------------------- notifications -------------------------- */
      markNotificationRead: (id) =>
        patch((w) => ({ ...w, notifications: w.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllNotificationsRead: (audience) =>
        patch((w) => ({ ...w, notifications: w.notifications.map((n) => (!audience || n.audience === audience ? { ...n, read: true } : n)) })),

      reset: () => {
        try {
          localStorage.removeItem(KEY)
        } catch {
          /* ignore */
        }
        setState(initialApp())
      },
    }
  }, [state])

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}
