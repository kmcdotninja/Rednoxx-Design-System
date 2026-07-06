import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarClock, Percent } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { Badge, Card, DataTable, EmptyState, SearchInput, Select, ViewToggle, type Column, type ViewMode } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { facilityTypeName, marketplaceProjects, sectorById } from '@/lib/sfmp'
import { money } from '@/lib/format'
import type { Project } from '@/data/types'

export function FinancierMarketplace() {
  const navigate = useNavigate()
  const { projects, sectors } = useStore()
  const [query, setQuery] = useState('')
  const [view, setView] = useState<ViewMode>('grid')
  const [ftFilter, setFtFilter] = useState('all')

  const recommended = marketplaceProjects(projects)
  const facilityTypes = useMemo(() => {
    const ids = new Set(recommended.map((p) => p.facilityTypeId))
    return [...ids].map((id) => ({ id, name: facilityTypeName(sectors, id) }))
  }, [recommended, sectors])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return recommended
      .filter((p) => ftFilter === 'all' || p.facilityTypeId === ftFilter)
      .filter((p) => !q || `${p.name} ${p.borrower} ${p.description} ${facilityTypeName(sectors, p.facilityTypeId)}`.toLowerCase().includes(q))
  }, [recommended, query, ftFilter, sectors])

  const columns: Column<Project>[] = [
    {
      key: 'name',
      header: 'Project',
      cell: (p) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-navy">{p.name}</p>
          <p className="truncate text-xs text-navy-400">{p.borrower}</p>
        </div>
      ),
    },
    {
      key: 'sector',
      header: 'Sector',
      cell: (p) => {
        const sector = sectorById(sectors, p.sectorId)
        return sector ? <Badge tone="neutral">{sector.name}</Badge> : <span className="text-navy-300">—</span>
      },
    },
    { key: 'ft', header: 'Facility type', cell: (p) => <span className="text-navy-500">{facilityTypeName(sectors, p.facilityTypeId)}</span> },
    { key: 'amount', header: 'Amount', align: 'right', cell: (p) => <span className="tnum font-medium text-navy">{money(p.amount)}</span> },
    { key: 'tenor', header: 'Tenor', align: 'right', cell: (p) => <span className="tnum text-navy-500">{p.tenor} mo</span> },
    { key: 'equity', header: 'Equity', align: 'right', cell: (p) => <span className="tnum text-navy-500">{p.equity}%</span> },
  ]

  return (
    <>
      <PageHeader
        title="Marketplace"
        subtitle="Renewable-energy projects recommended by the SFMP team, ready for appraisal."
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput placeholder="Search projects, borrowers…" value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full sm:w-96" />
        <div className="sm:w-72">
          <Select value={ftFilter} onChange={(e) => setFtFilter(e.target.value)}>
            <option value="all">All facility types</option>
            {facilityTypes.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </Select>
        </div>
        <ViewToggle value={view} onChange={setView} className="sm:ml-auto" />
      </div>

      {rows.length === 0 ? (
        <Card>
          <EmptyState variant="search" title="No recommended projects" description="When the SFMP team recommends projects matching your filters, they appear here." />
        </Card>
      ) : view === 'table' ? (
        <Card pad={false}>
          <div className="px-3 py-3 sm:px-4">
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(p) => p.id}
              onRowClick={(p) => navigate(`/financier/marketplace/${p.id}`)}
            />
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => {
            const sector = sectorById(sectors, p.sectorId)
            return (
              <button
                key={p.id}
                onClick={() => navigate(`/financier/marketplace/${p.id}`)}
                className="group flex flex-col rounded-4xl border border-hair bg-white p-5 text-left transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-card-hover"
              >
                <div className="flex items-center gap-2">
                  <Badge tone="lime" dot>Recommended</Badge>
                  {sector && <Badge tone="neutral">{sector.name}</Badge>}
                </div>
                <h3 className="mt-3 text-[17px] font-medium leading-snug tracking-[-0.01em] text-navy">{p.name}</h3>
                <p className="mt-1 text-[13px] text-navy-400">{p.borrower}</p>
                <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-navy-400">{p.description}</p>

                <div className="mt-4 rounded-2xl bg-panel/70 px-4 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-navy-400">Facility</p>
                  <p className="tnum mt-1 text-xl font-medium tracking-[-0.02em] text-navy">{money(p.amount)}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-navy-400">
                    <span className="flex items-center gap-1"><CalendarClock size={13} /> {p.tenor} mo</span>
                    <span className="flex items-center gap-1"><Percent size={13} /> {p.equity}% equity</span>
                  </div>
                </div>

                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy">
                  Review project
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}
