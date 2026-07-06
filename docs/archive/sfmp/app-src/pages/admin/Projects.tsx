import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shell/PageHeader'
import { Card, DataTable, EmptyState, SearchInput, StatusPill, Tabs, type Column, type TabItem } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { facilityTypeName } from '@/lib/sfmp'
import { formatDate, money } from '@/lib/format'
import type { Project, ProjectStatus } from '@/data/types'

type Tab = 'all' | 'review' | 'recommended' | 'selected' | 'accepted' | 'rejected'

const TAB_STATUS: Record<Tab, ProjectStatus[]> = {
  all: ['on_marketplace', 'recommended', 'selected', 'accepted', 'rejected'],
  review: ['on_marketplace'],
  recommended: ['recommended'],
  selected: ['selected'],
  accepted: ['accepted'],
  rejected: ['rejected'],
}

export function AdminProjects() {
  const navigate = useNavigate()
  const { projects, sectors } = useStore()
  const [tab, setTab] = useState<Tab>('all')
  const [query, setQuery] = useState('')

  const visible = projects.filter((p) => p.status !== 'in_progress')
  const counts = (t: Tab) => visible.filter((p) => TAB_STATUS[t].includes(p.status)).length

  const tabs: TabItem<Tab>[] = [
    { value: 'all', label: 'All' },
    { value: 'review', label: 'Awaiting review', count: counts('review') },
    { value: 'recommended', label: 'Recommended', count: counts('recommended') },
    { value: 'selected', label: 'Selected', count: counts('selected') },
    { value: 'accepted', label: 'Accepted', count: counts('accepted') },
    { value: 'rejected', label: 'Rejected', count: counts('rejected') },
  ]

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return visible
      .filter((p) => TAB_STATUS[tab].includes(p.status))
      .filter((p) => !q || `${p.name} ${p.ref} ${p.borrower} ${facilityTypeName(sectors, p.facilityTypeId)} ${p.amount}`.toLowerCase().includes(q))
  }, [visible, tab, query, sectors])

  const columns: Column<Project>[] = [
    {
      key: 'name',
      header: 'Project',
      cell: (p) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-navy">{p.name}</p>
          <p className="truncate text-xs text-navy-400">{p.ref} · {p.borrower}</p>
        </div>
      ),
    },
    { key: 'ft', header: 'Facility type', cell: (p) => <span className="text-navy-500">{facilityTypeName(sectors, p.facilityTypeId)}</span> },
    { key: 'amount', header: 'Amount', align: 'right', cell: (p) => <span className="tnum font-medium text-navy">{money(p.amount)}</span> },
    { key: 'equity', header: 'Equity', align: 'right', cell: (p) => <span className="tnum text-navy-500">{p.equity}%</span> },
    { key: 'updated', header: 'Updated', align: 'right', cell: (p) => <span className="text-navy-400">{formatDate(p.updatedAt)}</span> },
    { key: 'status', header: 'Status', align: 'right', cell: (p) => <StatusPill status={p.status} /> },
  ]

  return (
    <>
      <PageHeader title="Projects" subtitle="Review submissions and recommend strong projects to financiers." />

      <Card pad={false}>
        <div className="border-b border-hair px-5 pt-5 sm:px-6">
          <Tabs items={tabs} value={tab} onChange={setTab} size="md" />
        </div>
        <div className="px-5 pt-4 sm:px-6">
          <SearchInput placeholder="Search by name, ref, borrower…" value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full sm:w-72" />
        </div>
        <div className="px-3 pb-4 pt-3 sm:px-4">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(p) => p.id}
            onRowClick={(p) => navigate(`/admin/projects/${p.id}`)}
            empty={<EmptyState compact variant="folder" title="No projects in this stage" description="Projects will appear here as borrowers submit and the lifecycle progresses." />}
          />
            </div>
          </Card>
    </>
  )
}
