import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { AreaChart } from '@/components/ui/AreaChart'
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Combobox,
  DataTable,
  StatCard,
  StatusPill,
  Tag,
  useToast,
  type Column,
} from '@/components/ui'
import { DemoPageHeader } from '../DemoShell'
import { CLAIMS, DAYS, INSURERS, PAYMENTS, PAYMENT_TREND, type Claim, type Payment } from '../../health'

const BRAND = '#5833fb'
const ngn = (v: number) => `₦${v.toLocaleString()}`

/* ------------------------------- Payments ------------------------------- */

export function PaymentsPage() {
  const { success } = useToast()
  const outstanding = PAYMENTS.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const failed = PAYMENTS.filter((p) => p.status === 'failed').length

  const columns: Column<Payment>[] = [
    { key: 'id', header: 'Invoice', cell: (p) => <span className="tnum font-mono text-[13px] text-forest-500">{p.id}</span> },
    {
      key: 'patient',
      header: 'Patient',
      cell: (p) => (
        <span className="flex items-center gap-2.5">
          <Avatar name={p.patient} size="xs" />
          <span className="truncate font-medium text-forest">{p.patient}</span>
        </span>
      ),
    },
    { key: 'method', header: 'Method', cell: (p) => <Tag>{p.method}</Tag> },
    { key: 'amount', header: 'Amount', align: 'right', cell: (p) => <span className="tnum font-medium text-forest">{ngn(p.amount)}</span> },
    { key: 'date', header: 'Date', cell: (p) => <span className="tnum">{p.date}</span> },
    { key: 'status', header: 'Status', cell: (p) => <StatusPill status={p.status} /> },
  ]

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader
          title="Payments"
          subtitle="Collections across card, transfer, cash and HMO settlement"
          actions={
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download size={15} />}
              onClick={() => success('Statement export started', 'You’ll get a CSV in your inbox.')}
            >
              Export
            </Button>
          }
        />
      </div>

      <div className="grid gap-4 animate-rise sm:grid-cols-3" style={{ animationDelay: '60ms' }}>
        <StatCard label="Collected today" value="₦1.49m" delta="+8.3%" deltaTone="up" sub="vs yesterday" />
        <StatCard label="Outstanding" value={ngn(outstanding)} sub="awaiting HMO settlement" />
        <StatCard label="Failed payments" value={failed} deltaTone="down" sub="retry from the row menu" />
      </div>

      <Card className="animate-rise" style={{ animationDelay: '120ms' }}>
        <CardHeader title="Daily collections" subtitle="Last 14 days, all methods, ₦ thousands" />
        <div className="mt-4">
          <AreaChart
            data={PAYMENT_TREND}
            labels={DAYS}
            height={200}
            line={BRAND}
            fill={BRAND}
            seriesLabel="Collections"
            valueFormat={(v) => `₦${Math.round(v).toLocaleString()}k`}
            xTickFormat={(v) => v}
          />
        </div>
      </Card>

      <Card className="animate-rise" style={{ animationDelay: '180ms' }}>
        <CardHeader title="Recent payments" subtitle="Newest first" />
        <div className="mt-3">
          <DataTable columns={columns} rows={PAYMENTS} rowKey={(p) => p.id} pageSize={6} />
        </div>
      </Card>
    </>
  )
}

/* --------------------------- Insurance claims --------------------------- */

export function ClaimsPage() {
  const [insurer, setInsurer] = useState<string | undefined>()
  const rows = useMemo(
    () => CLAIMS.filter((c) => !insurer || c.insurer === insurer),
    [insurer],
  )
  const approved = CLAIMS.filter((c) => c.status === 'approved').length
  const pending = CLAIMS.filter((c) => c.status === 'pending').length

  const columns: Column<Claim>[] = [
    { key: 'id', header: 'Claim', cell: (c) => <span className="tnum font-mono text-[13px] text-forest-500">{c.id}</span> },
    {
      key: 'patient',
      header: 'Patient',
      cell: (c) => (
        <span className="flex items-center gap-2.5">
          <Avatar name={c.patient} size="xs" />
          <span className="truncate font-medium text-forest">{c.patient}</span>
        </span>
      ),
    },
    { key: 'insurer', header: 'Insurer', cell: (c) => c.insurer },
    { key: 'amount', header: 'Amount', align: 'right', cell: (c) => <span className="tnum font-medium text-forest">{ngn(c.amount)}</span> },
    { key: 'submitted', header: 'Submitted', cell: (c) => <span className="tnum">{c.submitted}</span> },
    { key: 'status', header: 'Status', cell: (c) => <StatusPill status={c.status} /> },
  ]

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader title="Insurance claims" subtitle="Submission through settlement, per insurer" />
      </div>

      <div className="grid gap-4 animate-rise sm:grid-cols-3" style={{ animationDelay: '60ms' }}>
        <StatCard
          label="Approval rate"
          value={`${Math.round((approved / CLAIMS.length) * 100)}%`}
          delta="+1.9pt"
          deltaTone="up"
          sub="last 14 days"
        />
        <StatCard label="Pending" value={pending} sub="oldest submitted today" />
        <StatCard label="Avg turnaround" value="2.1 days" delta="−0.4d" deltaTone="up" sub="submission → decision" />
      </div>

      <div className="max-w-xs animate-rise" style={{ animationDelay: '100ms' }}>
        <Combobox
          options={INSURERS.map((name) => ({ value: name, label: name }))}
          value={insurer}
          onChange={setInsurer}
          placeholder="All insurers"
          searchPlaceholder="Search insurers…"
        />
      </div>

      <Card className="animate-rise" style={{ animationDelay: '140ms' }}>
        <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} pageSize={8} />
      </Card>
    </>
  )
}
