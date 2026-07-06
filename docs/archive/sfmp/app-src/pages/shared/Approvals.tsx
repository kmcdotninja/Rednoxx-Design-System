import { useMemo, useState } from 'react'
import { CheckCircle2, ShieldAlert, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useDomain, useSubRole } from '@/components/shell/RoleContext'
import { Badge, Button, Card, DataTable, Drawer, EmptyState, Field, SearchInput, StatusPill, Tabs, Textarea, useToast, type Column, type TabItem } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { can, SUBROLE_LABEL } from '@/data/nav'
import { formatDate, formatDateTime } from '@/lib/format'
import type { Approval } from '@/data/types'

type Tab = 'pending' | 'approved' | 'rejected'

const TYPE_LABEL: Record<Approval['type'], string> = {
  sector_create: 'Sector creation',
  sector_change: 'Sector change',
  project_recommend: 'Project recommendation',
  project_accept: 'Project acceptance',
  persona_create: 'New user',
  community_create: 'New community',
  offer_publish: 'Offer publication',
  loan_disburse: 'Loan disbursement',
}

export function Approvals() {
  const domain = useDomain()
  const subRole = useSubRole()
  const toast = useToast()
  const { approvals, resolveApproval } = useStore()

  const [tab, setTab] = useState<Tab>('pending')
  const [query, setQuery] = useState('')
  const [reviewing, setReviewing] = useState<Approval | null>(null)
  const [note, setNote] = useState('')

  const checker = can('approve', subRole)
  const mine = approvals.filter((a) => a.domain === domain)
  const counts = (t: Tab) => mine.filter((a) => a.status === t).length

  const tabs: TabItem<Tab>[] = [
    { value: 'pending', label: 'Pending', count: counts('pending') },
    { value: 'approved', label: 'Approved', count: counts('approved') },
    { value: 'rejected', label: 'Rejected', count: counts('rejected') },
  ]

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mine
      .filter((a) => a.status === tab)
      .filter((a) => !q || `${a.ref} ${a.title} ${a.description} ${a.submittedBy} ${TYPE_LABEL[a.type]}`.toLowerCase().includes(q))
  }, [mine, tab, query])

  const columns: Column<Approval>[] = [
    {
      key: 'request',
      header: 'Request',
      cell: (a) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-navy">{a.title}</p>
          <p className="truncate text-xs text-navy-400">{a.ref} · by {a.submittedBy}</p>
        </div>
      ),
    },
    { key: 'type', header: 'Type', cell: (a) => <Badge tone="neutral">{TYPE_LABEL[a.type]}</Badge> },
    { key: 'submitted', header: 'Submitted', align: 'right', cell: (a) => <span className="text-navy-400">{formatDate(a.at)}</span> },
    {
      key: 'reviewed',
      header: 'Reviewed by',
      align: 'right',
      cell: (a) => <span className="text-navy-400">{a.reviewedBy ?? '—'}</span>,
    },
    { key: 'status', header: 'Status', align: 'right', cell: (a) => <StatusPill status={a.status} /> },
  ]

  const decide = (approve: boolean) => {
    if (!reviewing) return
    resolveApproval(reviewing.id, approve, note.trim() || undefined)
    toast.success(approve ? 'Request approved' : 'Request rejected', approve ? 'The change is now live across the marketplace.' : 'The initiator has been notified.')
    setReviewing(null)
    setNote('')
  }

  if (!checker) {
    return (
      <>
        <PageHeader title="Approvals" subtitle="The maker-checker approval queue." />
        <Card>
          <EmptyState
            variant="no-access"
            title="Authorizer access required"
            description={`You are acting as ${SUBROLE_LABEL[subRole]}. Switch to the Authorizer or Root persona (top navigation) to review this queue.`}
          />
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Approvals"
        subtitle="Review what initiators have submitted. Approved changes go live across the marketplace."
      />

      <Card pad={false}>
        <div className="border-b border-hair px-5 pt-5 sm:px-6">
          <Tabs items={tabs} value={tab} onChange={setTab} size="md" />
        </div>
        <div className="px-5 pt-4 sm:px-6">
          <SearchInput placeholder="Search the queue…" value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full sm:w-72" />
        </div>
        <div className="px-3 pb-4 pt-3 sm:px-4">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(a) => a.id}
            onRowClick={(a) => { setReviewing(a); setNote('') }}
            empty={<EmptyState compact variant="inbox" title="Queue is clear" description="Requests appear here when initiators submit changes for approval." />}
          />
        </div>
      </Card>

      {/* review drawer */}
      <Drawer
        open={reviewing !== null}
        onClose={() => setReviewing(null)}
        title={reviewing?.title}
        subtitle={reviewing ? `${reviewing.ref} · ${TYPE_LABEL[reviewing.type]}` : undefined}
        footer={
          reviewing?.status === 'pending' ? (
            <div className="flex items-center justify-end gap-2">
              <Button variant="danger" leftIcon={<XCircle size={16} />} onClick={() => decide(false)}>Reject</Button>
              <Button leftIcon={<CheckCircle2 size={16} />} onClick={() => decide(true)}>Approve</Button>
            </div>
          ) : undefined
        }
      >
        {reviewing && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-2xl bg-panel/70 p-4">
              <ShieldAlert size={18} className="mt-0.5 shrink-0 text-navy-400" />
              <p className="text-sm leading-relaxed text-navy-500">{reviewing.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-medium text-navy-400">Submitted by</p>
                <p className="mt-0.5 font-medium text-navy">{reviewing.submittedBy}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-navy-400">Submitted</p>
                <p className="mt-0.5 font-medium text-navy">{formatDateTime(reviewing.at)}</p>
              </div>
              {reviewing.reviewedBy && (
                <>
                  <div>
                    <p className="text-xs font-medium text-navy-400">Reviewed by</p>
                    <p className="mt-0.5 font-medium text-navy">{reviewing.reviewedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-navy-400">Outcome</p>
                    <StatusPill status={reviewing.status} className="mt-1" />
                  </div>
                </>
              )}
            </div>
            {reviewing.note && (
              <div>
                <p className="text-xs font-medium text-navy-400">Reviewer note</p>
                <p className="mt-1 rounded-2xl bg-panel px-4 py-3 text-sm leading-relaxed text-navy-600">{reviewing.note}</p>
              </div>
            )}
            {reviewing.status === 'pending' && (
              <Field label="Note (optional)" hint="Shared with the initiator alongside your decision.">
                <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add context for your decision…" />
              </Field>
            )}
          </div>
        )}
      </Drawer>
    </>
  )
}
