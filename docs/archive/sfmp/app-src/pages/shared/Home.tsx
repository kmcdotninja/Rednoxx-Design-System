import { useNavigate } from 'react-router-dom'
import {
  Building2,
  CalendarClock,
  ClipboardCheck,
  FileClock,
  FilePen,
  FolderKanban,
  Landmark,
  Mail,
  MessageSquareWarning,
  Plus,
  ShieldCheck,
  Store,
  type LucideIcon,
} from 'lucide-react'
import { useDomain, useSubRole } from '@/components/shell/RoleContext'
import { useAccount, GatedButton } from '@/components/shell/AccountContext'
import { useOnboardingDrawer } from '@/components/shell/OnboardingDrawerContext'
import { Badge, Button, Card, CardHeader, EmptyState } from '@/components/ui'
import { BorrowerDashboard } from '@/pages/borrower/Dashboard'
import { FinancierDashboard } from '@/pages/financier/Dashboard'
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { useStore } from '@/store/AppStore'
import { can, DOMAIN_META } from '@/data/nav'
import { CURRENT_USERS } from '@/data/mock'
import { money, timeAgo } from '@/lib/format'

interface AttentionItem {
  id: string
  icon: LucideIcon
  title: string
  description: string
  /** ISO date used to order the feed — newest first. */
  at: string
  go: () => void
}

interface Glance {
  id: string
  icon: LucideIcon
  label: string
  description: string
  value: number
  go: () => void
}

const FEED_SIZE = 3

/** Role-aware landing page: a personal greeting, a time-ordered feed of the
 *  actual items waiting on this account, and a snapshot of where things
 *  stand today. */
export function Home() {
  const navigate = useNavigate()
  const domain = useDomain()
  const subRole = useSubRole()
  const account = useAccount()
  const { openForm, openStatus } = useOnboardingDrawer()
  const { projects, borrowers, financiers, approvals, messages, meetings } = useStore()

  const base = DOMAIN_META[domain].base
  const company = account.company
  const canApprove = can('approve', subRole)
  const seesAdvisory = subRole !== 'authorizer' // mirrors Messages/Meetings nav visibility
  const now = new Date().toISOString()

  /* --------------- needs your attention — one feed, ordered by time -------- */

  const attention: AttentionItem[] = []

  if (domain === 'borrower' || domain === 'financier') {
    if (account.onboarding === 'not_started')
      attention.push({ id: 'ob', icon: ShieldCheck, title: 'Start your onboarding', description: 'Submit your profile so you can transact on SFMP.', at: now, go: openForm })
    if (account.onboarding === 'rejected')
      attention.push({ id: 'ob', icon: ShieldCheck, title: 'Update and resubmit your onboarding', description: 'The SFMP team asked for changes to your submission.', at: now, go: openForm })
    if (account.onboarding === 'submitted')
      attention.push({ id: 'ob', icon: FileClock, title: 'Onboarding is under review', description: 'The SFMP team is reviewing your submission.', at: now, go: openStatus })
  }

  if (domain === 'borrower') {
    const mine = projects.filter((p) => p.borrower === company)
    for (const p of mine) {
      for (const r of p.infoRequests?.filter((r) => !r.answer) ?? [])
        attention.push({ id: `info_${r.id}`, icon: MessageSquareWarning, title: `Information requested — ${p.ref}`, description: r.question, at: r.at, go: () => navigate(`${base}/projects/${p.id}`) })
      if (p.status === 'accepted' && (!p.checklist || p.checklist.some((c) => !c.checked) || !p.repayment)) {
        const done = p.checklist?.filter((c) => c.checked).length ?? 0
        const total = p.checklist?.length ?? 0
        attention.push({ id: `chk_${p.id}`, icon: ClipboardCheck, title: `Complete checklist — ${p.name}`, description: `${done}/${total} items done · repayment ${p.repayment ? 'set' : 'not set'} · ${p.financier}`, at: p.updatedAt, go: () => navigate(`${base}/projects/${p.id}`) })
      }
      if (p.status === 'in_progress')
        attention.push({ id: `draft_${p.id}`, icon: FilePen, title: `Finish draft — ${p.name}`, description: `${p.ref} · ${money(p.amount)} requested`, at: p.updatedAt, go: () => navigate(`${base}/projects/${p.id}`) })
      if (p.status === 'rejected') {
        const last = p.rejections?.[p.rejections.length - 1]
        attention.push({ id: `rej_${p.id}`, icon: FolderKanban, title: `Feedback — ${p.name}`, description: last ? `${last.by}: ${last.reason}` : 'Read the rejection reasons and revise your application.', at: last?.at ?? p.updatedAt, go: () => navigate(`${base}/projects/${p.id}`) })
      }
    }
  }

  if (domain === 'financier') {
    for (const p of projects.filter((p) => p.status === 'selected' && p.financier === company))
      attention.push({ id: `dec_${p.id}`, icon: ClipboardCheck, title: `Decide on ${p.name}`, description: `${p.ref} · ${money(p.amount)} · ${p.borrower}`, at: p.updatedAt, go: () => navigate(`${base}/projects/${p.id}`) })
    for (const p of projects.filter((p) => p.status === 'recommended' && p.financier !== company))
      attention.push({ id: `mkt_${p.id}`, icon: Store, title: `New on the marketplace — ${p.name}`, description: `${money(p.amount)} · ${p.borrower}`, at: p.updatedAt, go: () => navigate(`${base}/marketplace/${p.id}`) })
  }

  if (domain === 'admin') {
    for (const b of borrowers.filter((b) => b.onboarding === 'submitted'))
      attention.push({ id: `vb_${b.company}`, icon: Building2, title: `Verify borrower — ${b.company}`, description: `${b.rcNumber} · ${b.state} · ${b.documents.length} document(s)`, at: b.documents[0]?.at ?? now, go: () => navigate(`${base}/borrowers/${encodeURIComponent(b.company)}`) })
    for (const f of financiers.filter((f) => f.onboarding === 'submitted'))
      attention.push({ id: `vf_${f.company}`, icon: Landmark, title: `Verify financier — ${f.company}`, description: `${f.contactName} · ${f.sectorsOfInterest.join(', ')}`, at: f.documents[0]?.at ?? now, go: () => navigate(`${base}/financiers/${encodeURIComponent(f.company)}`) })
    for (const p of projects.filter((p) => p.status === 'on_marketplace'))
      attention.push({ id: `rev_${p.id}`, icon: Store, title: `Review submission — ${p.name}`, description: `${p.ref} · ${p.borrower}`, at: p.updatedAt, go: () => navigate(`${base}/projects/${p.id}`) })
  }

  if (canApprove) {
    for (const a of approvals.filter((a) => a.domain === domain && a.status === 'pending'))
      attention.push({ id: `apr_${a.id}`, icon: ClipboardCheck, title: a.title, description: `${a.ref} · submitted by ${a.submittedBy}`, at: a.at, go: () => navigate(`${base}/approvals`) })
  }

  attention.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
  const attentionFeed = attention.slice(0, FEED_SIZE)

  /* ------------------------------- at a glance ------------------------------ */

  const unread = messages.filter((m) => m.toDomain === domain && !m.read).length
  const upcoming = meetings.filter(
    (m) =>
      m.status === 'scheduled' &&
      new Date(m.date) >= new Date() &&
      (m.hostDomain === domain || m.guests.some((g) => g.domain === domain)),
  ).length
  const pendingApprovals = approvals.filter((a) => a.domain === domain && a.status === 'pending').length

  const glances: Glance[] = []
  if (canApprove) glances.push({ id: 'approvals', icon: ClipboardCheck, label: 'Pending approvals', description: 'Waiting in the maker-checker queue', value: pendingApprovals, go: () => navigate(`${base}/approvals`) })
  if (seesAdvisory) {
    glances.push(
      { id: 'unread', icon: Mail, label: 'Unread messages', description: 'In your advisory inbox', value: unread, go: () => navigate(`${base}/messages`) },
      { id: 'meetings', icon: CalendarClock, label: 'Upcoming meetings', description: 'Scheduled sessions ahead', value: upcoming, go: () => navigate(`${base}/meetings`) },
    )
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = CURRENT_USERS[domain].firstName

  return (
    <>
      {/* Greeting */}
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-navy-400">{company}</p>
          <h1 className="mt-1 text-[26px] font-medium leading-tight tracking-[-0.02em] text-navy">
            {greeting}, {firstName}
          </h1>
        </div>
        {domain === 'borrower' && (
          <GatedButton action="create a project" leftIcon={<Plus size={16} />} onClick={() => navigate(`${base}/projects/new`)}>
            Create project
          </GatedButton>
        )}
        {domain === 'financier' && (
          <Button leftIcon={<Store size={16} />} onClick={() => navigate(`${base}/marketplace`)}>Browse marketplace</Button>
        )}
      </div>

      {/* Both cards share one fixed 3-row height — a shorter feed leaves quiet
          space rather than shrinking the card. */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Needs your attention — the actual items, newest first */}
        <Card className="flex min-h-[320px] flex-col lg:col-span-2">
          <CardHeader
            title="Needs your attention"
            subtitle="Everything waiting on you, newest first"
            action={attention.length > 0 ? <Badge tone="neutral">{attention.length}</Badge> : undefined}
          />
          <div className="mt-4 flex flex-1 flex-col">
            {attentionFeed.length === 0 ? (
              <div className="flex flex-1 flex-col justify-center">
                <EmptyState
                  compact
                  variant="notifications"
                  title="You’re all caught up"
                  description="Nothing is waiting on you right now — new tasks appear here as they come in."
                />
              </div>
            ) : (
              <div className="-mx-2 divide-y divide-hair/60">
                {attentionFeed.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={d.go}
                    className="flex w-full items-center gap-3.5 rounded-xl px-2.5 py-3.5 text-left transition-colors hover:bg-panel/60"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-panel/70 text-navy-500">
                      <d.icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-navy">{d.title}</span>
                      <span className="mt-0.5 block truncate text-[13px] text-navy-400">{d.description}</span>
                    </span>
                    <span className="shrink-0 text-[11px] text-navy-300">{timeAgo(d.at)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* At a glance */}
        <Card className="flex min-h-[320px] flex-col">
          <CardHeader title="At a glance" subtitle="Where things stand today" />
          <div className="mt-4 space-y-1">
            {glances.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={g.go}
                className="flex w-full items-center gap-3.5 rounded-2xl px-2.5 py-3 text-left transition-colors hover:bg-panel/60"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-panel/70 text-navy-500">
                  <g.icon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-navy">{g.label}</span>
                  <span className="block truncate text-[13px] text-navy-400">{g.description}</span>
                </span>
                <Badge tone="neutral">{g.value}</Badge>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Analytics — the full dashboard, on the same page */}
      <div className="mt-7">
        {domain === 'borrower' && <BorrowerDashboard />}
        {domain === 'financier' && <FinancierDashboard />}
        {domain === 'admin' && <AdminDashboard />}
      </div>
    </>
  )
}
