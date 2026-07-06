import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Banknote, FolderKanban, Store, Wallet } from 'lucide-react'
import { useAccount } from '@/components/shell/AccountContext'
import { Card, CardHeader, DataTable, StatCard, StatusPill, type Column } from '@/components/ui'
import { TrendChart } from '@/components/ui/TrendChart'
import { useStore } from '@/store/AppStore'
import { BORROWER_PIPELINE_RANGES } from '@/data/mock'
import { borrowerProjects, facilityTypeName, sum } from '@/lib/sfmp'
import { compactMoney, money } from '@/lib/format'
import type { Project } from '@/data/types'

export function BorrowerDashboard() {
  const navigate = useNavigate()
  const { company } = useAccount()
  const { projects, sectors } = useStore()

  const mine = borrowerProjects(projects, company)
  const live = mine.filter((p) => p.status !== 'in_progress' && p.status !== 'rejected')
  const onMkt = mine.filter((p) => p.status === 'on_marketplace')
  const accepted = mine.filter((p) => p.status === 'accepted')

  const columns: Column<Project>[] = [
    {
      key: 'name',
      header: 'Project',
      cell: (p) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-navy">{p.name}</p>
          <p className="truncate text-xs text-navy-400">{p.ref} · {facilityTypeName(sectors, p.facilityTypeId)}</p>
        </div>
      ),
    },
    { key: 'amount', header: 'Amount', align: 'right', cell: (p) => <span className="tnum font-medium text-navy">{money(p.amount)}</span> },
    { key: 'tenor', header: 'Tenor', align: 'right', cell: (p) => <span className="tnum text-navy-500">{p.tenor} mo</span> },
    { key: 'status', header: 'Status', align: 'right', cell: (p) => <StatusPill status={p.status} className="capitalize" /> },
  ]

  return (
    <>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active projects" value={live.length} icon={<FolderKanban size={18} />} sub={`${mine.length} total`} />
        <StatCard label="On marketplace" value={onMkt.length} icon={<Store size={18} />} sub="Live for funding" />
        <StatCard label="Accepted value" value={compactMoney(sum(accepted))} icon={<Wallet size={18} />} sub={`${accepted.length} deal(s) proceeding`} delta={accepted.length ? '●' : undefined} deltaTone="up" />
        <StatCard label="Requested value" value={compactMoney(sum(live))} icon={<Banknote size={18} />} sub="Across active projects" />
      </div>

      <div className="mt-6">
        <TrendChart
          title="Facility pipeline"
          subtitle="Requested facility value across your active projects"
          ranges={BORROWER_PIPELINE_RANGES}
          seriesLabel="Requested"
          fill="#45e227"
          valueFormat={(v) => compactMoney(v * 1_000_000)}
          yTickFormat={(v) => compactMoney(v * 1_000_000)}
        />
      </div>

      <Card className="mt-6" pad={false}>
        <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
          <CardHeader title="Recent projects" subtitle="Your latest financing requests" />
          <button onClick={() => navigate('/borrower/projects')} className="inline-flex items-center gap-1 text-sm font-medium text-mint hover:underline">
            View all <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="px-3 pb-4 sm:px-4">
          <DataTable columns={columns} rows={mine.slice(0, 5)} rowKey={(p) => p.id} onRowClick={(p) => navigate(`/borrower/projects/${p.id}`)} />
        </div>
      </Card>
    </>
  )
}

