import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/shell/PageHeader'
import { useDomain } from '@/components/shell/RoleContext'
import { useAccount } from '@/components/shell/AccountContext'
import { Avatar, Badge, Card, DataTable, EmptyState, SearchInput, StatusPill, Tabs, type Column, type TabItem } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { DOMAIN_META } from '@/data/nav'
import type { BorrowerProfile, FinancierProfile } from '@/data/types'

type DirTab = 'all' | 'verified' | 'submitted'

const dirTabs = (verified: number, submitted: number): TabItem<DirTab>[] => [
  { value: 'all', label: 'All' },
  { value: 'verified', label: 'Verified', count: verified },
  { value: 'submitted', label: 'Pending review', count: submitted },
]

/** Directory of borrowers — rows open the full onboarding review page. */
export function BorrowersDirectory() {
  const navigate = useNavigate()
  const domain = useDomain()
  const { company } = useAccount()
  const { borrowers, projects } = useStore()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<DirTab>('all')

  const isAdmin = domain === 'admin'
  const base = DOMAIN_META[domain].base

  const list = useMemo(() => {
    let bs = borrowers
    if (!isAdmin) {
      const funded = new Set(projects.filter((p) => p.financier === company).map((p) => p.borrower))
      bs = borrowers.filter((b) => funded.has(b.company))
    }
    const q = query.trim().toLowerCase()
    return bs
      .filter((b) => tab === 'all' || b.onboarding === tab)
      .filter((b) => !q || `${b.company} ${b.rcNumber} ${b.tin} ${b.state}`.toLowerCase().includes(q))
  }, [borrowers, projects, company, isAdmin, tab, query])

  const columns: Column<BorrowerProfile>[] = [
    {
      key: 'company',
      header: 'Borrower',
      cell: (b) => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={b.company} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-navy">{b.company}</p>
            <p className="truncate text-xs text-navy-400">{b.rcNumber} · {b.state}</p>
          </div>
        </div>
      ),
    },
    { key: 'tin', header: 'TIN', cell: (b) => <span className="tnum text-navy-500">{b.tin}</span> },
    {
      key: 'projects',
      header: 'Projects',
      align: 'right',
      cell: (b) => <Badge tone="neutral">{projects.filter((p) => p.borrower === b.company).length}</Badge>,
    },
    { key: 'docs', header: 'Documents', align: 'right', cell: (b) => <span className="tnum text-navy-500">{b.documents.length}</span> },
    { key: 'status', header: 'Onboarding', align: 'right', cell: (b) => <StatusPill status={b.onboarding} /> },
  ]

  return (
    <>
      <PageHeader
        title={isAdmin ? 'Borrowers' : 'My Borrowers'}
        subtitle={isAdmin ? 'Open an institution to review its full onboarding submission.' : 'Borrowers whose projects you are funding.'}
      />
      <Card pad={false}>
        <div className="border-b border-hair px-5 pt-5 sm:px-6">
          <Tabs items={dirTabs(borrowers.filter((b) => b.onboarding === 'verified').length, borrowers.filter((b) => b.onboarding === 'submitted').length)} value={tab} onChange={setTab} size="md" />
        </div>
        <div className="px-5 pt-4 sm:px-6">
          <SearchInput placeholder="Search borrowers…" value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full sm:w-72" />
        </div>
        <div className="px-3 pb-4 pt-3 sm:px-4">
          <DataTable
            columns={columns}
            rows={list}
            rowKey={(b) => b.company}
            onRowClick={(b) => navigate(`${base}/borrowers/${encodeURIComponent(b.company)}`)}
            empty={<EmptyState compact variant="folder" title="No borrowers" description={isAdmin ? 'Borrowers appear here after onboarding.' : 'Accept a project to build borrower relationships.'} />}
          />
        </div>
      </Card>
    </>
  )
}

/** Directory of financiers — rows open the full onboarding review page. */
export function FinanciersDirectory() {
  const navigate = useNavigate()
  const domain = useDomain()
  const { company } = useAccount()
  const { financiers, projects } = useStore()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<DirTab>('all')

  const isAdmin = domain === 'admin'
  const base = DOMAIN_META[domain].base

  const list = useMemo(() => {
    let fs = financiers
    if (!isAdmin) {
      const engaged = new Set(projects.filter((p) => p.borrower === company && p.financier).map((p) => p.financier!))
      fs = financiers.filter((f) => engaged.has(f.company))
    }
    const q = query.trim().toLowerCase()
    return fs
      .filter((f) => tab === 'all' || f.onboarding === tab)
      .filter((f) => !q || `${f.company} ${f.contactName} ${f.sectorsOfInterest.join(' ')}`.toLowerCase().includes(q))
  }, [financiers, projects, company, isAdmin, tab, query])

  const columns: Column<FinancierProfile>[] = [
    {
      key: 'company',
      header: 'Financier',
      cell: (f) => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={f.company} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-navy">{f.company}</p>
            <p className="truncate text-xs text-navy-400">{f.contactName} · {f.contactPosition}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'sectors',
      header: 'Sectors of interest',
      cell: (f) => (
        <div className="flex flex-wrap gap-1">
          {f.sectorsOfInterest.map((s) => <Badge key={s} tone="neutral">{s}</Badge>)}
        </div>
      ),
    },
    {
      key: 'deals',
      header: 'Deals',
      align: 'right',
      cell: (f) => <Badge tone="neutral">{projects.filter((p) => p.financier === f.company).length}</Badge>,
    },
    { key: 'docs', header: 'Documents', align: 'right', cell: (f) => <span className="tnum text-navy-500">{f.documents.length}</span> },
    { key: 'status', header: 'Onboarding', align: 'right', cell: (f) => <StatusPill status={f.onboarding} /> },
  ]

  return (
    <>
      <PageHeader
        title={isAdmin ? 'Financiers' : 'My Financiers'}
        subtitle={isAdmin ? 'Open an institution to review its full onboarding submission.' : 'Financiers engaged on your projects.'}
      />
      <Card pad={false}>
        <div className="border-b border-hair px-5 pt-5 sm:px-6">
          <Tabs items={dirTabs(financiers.filter((f) => f.onboarding === 'verified').length, financiers.filter((f) => f.onboarding === 'submitted').length)} value={tab} onChange={setTab} size="md" />
        </div>
        <div className="px-5 pt-4 sm:px-6">
          <SearchInput placeholder="Search financiers…" value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full sm:w-72" />
        </div>
        <div className="px-3 pb-4 pt-3 sm:px-4">
          <DataTable
            columns={columns}
            rows={list}
            rowKey={(f) => f.company}
            onRowClick={(f) => navigate(`${base}/financiers/${encodeURIComponent(f.company)}`)}
            empty={<EmptyState compact variant="folder" title="No financiers" description={isAdmin ? 'Financiers appear here after onboarding.' : 'Financier relationships appear once your projects are selected.'} />}
          />
        </div>
      </Card>
    </>
  )
}
