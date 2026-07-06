import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useAccount } from '@/components/shell/AccountContext'
import { Button, Card, DataTable, EmptyState, SearchInput, StatusPill, Tabs, type Column, type TabItem } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { facilityTypeName, financierProjects } from '@/lib/sfmp'
import { formatDate, money } from '@/lib/format'
import type { Project, ProjectStatus } from '@/data/types'

type Tab = 'all' | 'selected' | 'accepted' | 'rejected'

const TAB_STATUS: Record<Tab, ProjectStatus[]> = {
  all: ['selected', 'accepted', 'rejected'],
  selected: ['selected'],
  accepted: ['accepted'],
  rejected: ['rejected'],
}

export function FinancierProjects() {
  const navigate = useNavigate()
  const { company } = useAccount()
  const { projects, sectors } = useStore()
  const [tab, setTab] = useState<Tab>('all')
  const [query, setQuery] = useState('')

  // Rejected projects the financier acted on carry their name in rejections.
  const mine = useMemo(
    () =>
      projects.filter(
        (p) => financierProjects([p], company).length > 0 || (p.rejections ?? []).some((r) => r.by === company),
      ),
    [projects, company],
  )

  const counts = (t: Tab) => mine.filter((p) => TAB_STATUS[t].includes(p.status)).length
  const tabs: TabItem<Tab>[] = [
    { value: 'all', label: 'All' },
    { value: 'selected', label: 'Selected', count: counts('selected') },
    { value: 'accepted', label: 'Accepted', count: counts('accepted') },
    { value: 'rejected', label: 'Rejected', count: counts('rejected') },
  ]

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mine
      .filter((p) => TAB_STATUS[tab].includes(p.status))
      .filter((p) => !q || `${p.name} ${p.ref} ${p.borrower}`.toLowerCase().includes(q))
  }, [mine, tab, query])

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
    {
      key: 'checklist',
      header: 'Checklist',
      align: 'right',
      cell: (p) =>
        p.status === 'accepted' && p.checklist ? (
          <span className="tnum text-navy-500">{p.checklist.filter((c) => c.checked).length}/{p.checklist.length}</span>
        ) : (
          <span className="text-navy-300">—</span>
        ),
    },
    { key: 'updated', header: 'Updated', align: 'right', cell: (p) => <span className="text-navy-400">{formatDate(p.updatedAt)}</span> },
    { key: 'status', header: 'Status', align: 'right', cell: (p) => <StatusPill status={p.status} /> },
  ]

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle="Your funding portfolio — selected, accepted and rejected projects."
        actions={<Button variant="secondary" leftIcon={<Store size={16} />} onClick={() => navigate('/financier/marketplace')}>Browse marketplace</Button>}
      />

      <Card pad={false}>
        <div className="border-b border-hair px-5 pt-5 sm:px-6">
          <Tabs items={tabs} value={tab} onChange={setTab} size="md" />
        </div>
        <div className="px-5 pt-4 sm:px-6">
          <SearchInput placeholder="Search your portfolio…" value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full sm:w-72" />
        </div>
        <div className="px-3 pb-4 pt-3 sm:px-4">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(p) => p.id}
            onRowClick={(p) => navigate(`/financier/projects/${p.id}`)}
            empty={<EmptyState compact variant="folder" title="Nothing here yet" description="Select recommended projects from the marketplace to build your portfolio." />}
          />
            </div>
          </Card>
    </>
  )
}
