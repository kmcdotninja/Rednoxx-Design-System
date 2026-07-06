import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CircleDashed, Plus } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { GatedButton, useAccount } from '@/components/shell/AccountContext'
import { Button, Card, DataTable, EmptyState, SearchInput, StatusPill, Tabs, type Column, type TabItem } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { borrowerProjects, facilityTypeName } from '@/lib/sfmp'
import { formatDate, money } from '@/lib/format'
import type { Project, ProjectStatus } from '@/data/types'

type Tab = 'all' | 'on_marketplace' | 'in_progress' | 'selected' | 'accepted' | 'rejected'

const TAB_STATUS: Record<Tab, ProjectStatus[]> = {
  all: ['on_marketplace', 'recommended', 'in_progress', 'selected', 'accepted', 'rejected'],
  on_marketplace: ['on_marketplace', 'recommended'],
  in_progress: ['in_progress'],
  selected: ['selected'],
  accepted: ['accepted'],
  rejected: ['rejected'],
}

export function BorrowerProjects() {
  const navigate = useNavigate()
  const { company } = useAccount()
  const { projects, sectors } = useStore()
  const [tab, setTab] = useState<Tab>('all')
  const [query, setQuery] = useState('')

  const mine = borrowerProjects(projects, company)
  const counts = (t: Tab) => mine.filter((p) => TAB_STATUS[t].includes(p.status)).length

  const tabs: TabItem<Tab>[] = [
    { value: 'all', label: 'All' },
    { value: 'on_marketplace', label: 'On Marketplace', count: counts('on_marketplace') },
    { value: 'in_progress', label: 'In progress', count: counts('in_progress') },
    { value: 'selected', label: 'Selected', count: counts('selected') },
    { value: 'accepted', label: 'Accepted', count: counts('accepted') },
    { value: 'rejected', label: 'Rejected', count: counts('rejected') },
  ]

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mine
      .filter((p) => TAB_STATUS[tab].includes(p.status))
      .filter((p) => !q || `${p.name} ${p.ref} ${facilityTypeName(sectors, p.facilityTypeId)}`.toLowerCase().includes(q))
  }, [mine, tab, query, sectors])

  const columns: Column<Project>[] = [
    {
      key: 'name',
      header: 'Project',
      cell: (p) => (
        <div className="flex min-w-0 items-center gap-2.5">
          {p.status === 'in_progress' && <CircleDashed size={15} className="shrink-0 text-gold-600" />}
          <div className="min-w-0">
            <p className="truncate font-medium text-navy">{p.name || 'Untitled project'}</p>
            <p className="truncate text-xs text-navy-400">{p.ref} · {facilityTypeName(sectors, p.facilityTypeId)}</p>
          </div>
        </div>
      ),
    },
    { key: 'amount', header: 'Amount', align: 'right', cell: (p) => <span className="tnum font-medium text-navy">{p.amount ? money(p.amount) : '—'}</span> },
    { key: 'tenor', header: 'Tenor', align: 'right', cell: (p) => <span className="tnum text-navy-500">{p.tenor ? `${p.tenor} mo` : '—'}</span> },
    { key: 'updated', header: 'Updated', align: 'right', cell: (p) => <span className="text-navy-400">{formatDate(p.updatedAt)}</span> },
    { key: 'status', header: 'Status', align: 'right', cell: (p) => <StatusPill status={p.status} /> },
    {
      key: 'action',
      header: '',
      align: 'right',
      cell: (p) =>
        p.status === 'in_progress' ? (
          <Button size="sm" variant="secondary" onClick={() => navigate(`/borrower/projects/new?draft=${p.id}`)}>Continue</Button>
        ) : null,
    },
  ]

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Your financing requests across the marketplace lifecycle."
        actions={
          <GatedButton action="create a project" leftIcon={<Plus size={16} />} onClick={() => navigate('/borrower/projects/new')}>
            Create new project
          </GatedButton>
        }
      />

      <Card pad={false}>
        <div className="border-b border-hair px-5 pt-5 sm:px-6">
          <Tabs items={tabs} value={tab} onChange={setTab} size="md" />
        </div>
        <div className="px-5 pt-4 sm:px-6">
          <SearchInput placeholder="Search projects…" value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full sm:w-72" />
        </div>
        <div className="px-3 pb-4 pt-3 sm:px-4">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(p) => p.id}
            onRowClick={(p) => (p.status === 'in_progress' ? navigate(`/borrower/projects/new?draft=${p.id}`) : navigate(`/borrower/projects/${p.id}`))}
            empty={
          <EmptyState
            compact
            variant="folder"
            title="Nothing here yet"
            description={tab === 'in_progress' ? 'Drafts you save mid-application appear here with an “in progress” state.' : 'Projects in this stage will appear here.'}
          />
            }
          />
            </div>
          </Card>
    </>
  )
}
