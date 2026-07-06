import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, FolderKanban, Layers, Store } from 'lucide-react'
import { Card, CardHeader, DataTable, StatusPill, StatCard, type Column } from '@/components/ui'
import { BarChart, type BarDatum } from '@/components/ui/BarChart'
import { InteractiveBarChart } from '@/components/ui/InteractiveBarChart'
import { useStore } from '@/store/AppStore'
import { MARKET_ACTIVITY } from '@/data/mock'
import { facilityTypeName, sum } from '@/lib/sfmp'
import { compactMoney, money } from '@/lib/format'
import type { Project } from '@/data/types'

export function AdminDashboard() {
  const navigate = useNavigate()
  const { projects, sectors } = useStore()

  const onMkt = projects.filter((p) => p.status === 'on_marketplace')
  const recommended = projects.filter((p) => p.status === 'recommended')
  const accepted = projects.filter((p) => p.status === 'accepted')

  // sector/facility-type breakdown across all projects
  const byFacility = new Map<string, number>()
  for (const p of projects) {
    const name = facilityTypeName(sectors, p.facilityTypeId)
    byFacility.set(name, (byFacility.get(name) ?? 0) + 1)
  }
  const breakdown: BarDatum[] = [...byFacility.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      label: name
        .replace(' Projects', '')
        .replace('Commercial and Industrial', 'C&I')
        .replace('Interconnected Mini Grid', 'Interconn. Grid')
        .replace('Isolated Mini Grid', 'Isolated Grid'),
      value: count,
    }))

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
    { key: 'status', header: 'Status', align: 'right', cell: (p) => <StatusPill status={p.status} /> },
  ]

  return (
    <>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total projects" value={projects.length} icon={<FolderKanban size={18} />} sub={compactMoney(sum(projects)) + ' requested'} />
        <StatCard label="Awaiting review" value={onMkt.length} icon={<Store size={18} />} sub="On marketplace, not yet recommended" />
        <StatCard label="Recommended" value={recommended.length} icon={<Layers size={18} />} sub="Live for financiers" />
        <StatCard label="Committed value" value={compactMoney(sum(accepted))} icon={<CheckCircle2 size={18} />} sub={`${accepted.length} deal(s) accepted`} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <InteractiveBarChart
          className="lg:col-span-2"
          title="Marketplace activity"
          subtitle="Daily activity for the last 3 months"
          data={MARKET_ACTIVITY}
          series={[
            { key: 'submissions', label: 'Submissions', color: '#45e227' },
            { key: 'funded', label: 'Funded deals', color: '#171723' },
          ]}
        />
        <Card>
          <CardHeader title="By facility type" subtitle="Distribution of projects" />
          <div className="mt-4">
            <BarChart
              data={breakdown}
              layout="horizontal"
              seriesLabel="Projects"
              color="#45e227"
              height={260}
              valueFormat={(v) => `${Math.round(v)} project(s)`}
              yTickFormat={(v) => `${Math.round(v)}`}
            />
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card pad={false}>
          <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
            <CardHeader title="Recent submissions" subtitle="Projects to review and recommend" />
            <button onClick={() => navigate('/admin/projects')} className="inline-flex items-center gap-1 text-sm font-medium text-mint hover:underline">
              View all <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="px-3 pb-4 sm:px-4">
            <DataTable columns={columns} rows={projects.slice(0, 5)} rowKey={(p) => p.id} onRowClick={(p) => navigate(`/admin/projects/${p.id}`)} />
          </div>
        </Card>

      </div>
    </>
  )
}
