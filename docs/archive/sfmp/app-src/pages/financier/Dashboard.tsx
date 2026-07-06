import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Building2, CheckCircle2, HandCoins, Store } from 'lucide-react'
import { Badge, Card, CardHeader, DataTable, StatCard, type Column } from '@/components/ui'
import { TrendChart } from '@/components/ui/TrendChart'
import { useStore } from '@/store/AppStore'
import { DISBURSEMENT_RANGES } from '@/data/mock'
import { useAccount } from '@/components/shell/AccountContext'
import { facilityTypeName, financierProjects, marketplaceProjects, sum } from '@/lib/sfmp'
import { compactMoney, money } from '@/lib/format'
import type { Project } from '@/data/types'

export function FinancierDashboard() {
  const navigate = useNavigate()
  const { company } = useAccount()
  const { projects, sectors } = useStore()

  const available = marketplaceProjects(projects)
  const mine = financierProjects(projects, company)
  const selected = mine.filter((p) => p.status === 'selected')
  const accepted = mine.filter((p) => p.status === 'accepted')
  const borrowers = new Set(accepted.map((p) => p.borrower)).size

  const columns: Column<Project>[] = [
    {
      key: 'name',
      header: 'Project',
      cell: (p) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-navy">{p.name}</p>
          <p className="truncate text-xs text-navy-400">{p.borrower} · {facilityTypeName(sectors, p.facilityTypeId)}</p>
        </div>
      ),
    },
    { key: 'amount', header: 'Amount', align: 'right', cell: (p) => <span className="tnum font-medium text-navy">{money(p.amount)}</span> },
    { key: 'equity', header: 'Equity', align: 'right', cell: (p) => <span className="tnum text-navy-500">{p.equity}%</span> },
    { key: 'status', header: '', align: 'right', cell: () => <Badge tone="lime" dot>Recommended</Badge> },
  ]

  return (
    <>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Marketplace value" value={compactMoney(sum(available))} icon={<Store size={18} />} sub={`${available.length} live for funding`} />
        <StatCard label="In appraisal" value={compactMoney(sum(selected))} icon={<HandCoins size={18} />} sub={`${selected.length} selected`} />
        <StatCard label="Committed value" value={compactMoney(sum(accepted))} icon={<CheckCircle2 size={18} />} sub={`${accepted.length} accepted`} />
        <StatCard label="Borrowers funded" value={borrowers} icon={<Building2 size={18} />} sub="Active relationships" />
      </div>

      <TrendChart
        className="mt-6"
        title="Disbursement trend"
        subtitle="Funds committed across your portfolio"
        ranges={DISBURSEMENT_RANGES}
        seriesLabel="Committed"
        fill="#45e227"
        valueFormat={(v) => compactMoney(v * 1_000_000)}
        yTickFormat={(v) => compactMoney(v * 1_000_000)}
      />

      <Card className="mt-6" pad={false}>
        <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
          <CardHeader title="Recommended for you" subtitle="Projects awaiting a financier" />
          <button onClick={() => navigate('/financier/marketplace')} className="inline-flex items-center gap-1 text-sm font-medium text-mint hover:underline">
            View all <ArrowUpRight size={15} />
          </button>
        </div>
        <div className="px-3 pb-4 sm:px-4">
          <DataTable columns={columns} rows={available.slice(0, 5)} rowKey={(p) => p.id} onRowClick={(p) => navigate(`/financier/marketplace/${p.id}`)} empty={<p className="py-6 text-center text-sm text-navy-400">No recommended projects right now.</p>} />
        </div>
      </Card>
    </>
  )
}
