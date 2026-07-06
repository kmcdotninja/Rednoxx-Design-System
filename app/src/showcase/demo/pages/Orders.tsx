import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import {
  Alert,
  Avatar,
  Button,
  Card,
  DataTable,
  Drawer,
  KeyValue,
  SignaturePad,
  StatusPill,
  Tabs,
  Tag,
  Toggle,
  useToast,
  type Column,
  type TabItem,
} from '@/components/ui'
import { DemoPageHeader } from '../DemoShell'
import { LAB_ORDERS, SURGICAL_ORDERS, type LabOrder, type SurgicalOrder } from '../../health'

/* ------------------------------ Lab orders ------------------------------ */

type LabFilter = 'all' | LabOrder['status']

export function LabOrdersPage() {
  const [filter, setFilter] = useState<LabFilter>('all')
  const [delayVisible, setDelayVisible] = useState(true)

  const statusTabs: TabItem<LabFilter>[] = [
    { value: 'all', label: 'All', count: LAB_ORDERS.length },
    { value: 'pending', label: 'Pending', count: LAB_ORDERS.filter((o) => o.status === 'pending').length },
    { value: 'in_progress', label: 'In progress', count: LAB_ORDERS.filter((o) => o.status === 'in_progress').length },
    { value: 'completed', label: 'Completed', count: LAB_ORDERS.filter((o) => o.status === 'completed').length },
  ]

  const rows = useMemo(
    () => LAB_ORDERS.filter((o) => filter === 'all' || o.status === filter),
    [filter],
  )

  const columns: Column<LabOrder>[] = [
    { key: 'id', header: 'Order', cell: (o) => <span className="tnum font-mono text-[13px] text-forest-500">{o.id}</span> },
    {
      key: 'patient',
      header: 'Patient',
      cell: (o) => (
        <span className="flex items-center gap-2.5">
          <Avatar name={o.patient} size="xs" />
          <span className="truncate font-medium text-forest">{o.patient}</span>
        </span>
      ),
    },
    { key: 'test', header: 'Test', cell: (o) => o.test },
    { key: 'facility', header: 'Facility', cell: (o) => <span className="text-forest-400">{o.facility}</span> },
    { key: 'ordered', header: 'Ordered', cell: (o) => <span className="tnum">{o.ordered}</span> },
    { key: 'tat', header: 'Turnaround', align: 'right', cell: (o) => <span className="tnum">{o.tat}</span> },
    { key: 'status', header: 'Status', cell: (o) => <StatusPill status={o.status} /> },
  ]

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader title="Lab orders" subtitle="Order-to-result tracking across facilities" />
      </div>

      {delayVisible && (
        <div className="animate-rise" style={{ animationDelay: '40ms' }}>
          <Alert tone="warning" title="Lab interface degraded" onDismiss={() => setDelayVisible(false)}>
            Results from the Kano Specialist Clinic analyser are delayed by roughly 20 minutes.
          </Alert>
        </div>
      )}

      <Card className="animate-rise" style={{ animationDelay: '100ms' }}>
        <div className="border-b border-hair">
          <Tabs items={statusTabs} value={filter} onChange={setFilter} />
        </div>
        <div className="mt-2">
          <DataTable columns={columns} rows={rows} rowKey={(o) => o.id} pageSize={8} />
        </div>
      </Card>
    </>
  )
}

/* ---------------------------- Surgical orders --------------------------- */

export function SurgicalOrdersPage() {
  const { success } = useToast()
  // `selected` is kept through the close animation so the drawer never blanks mid-exit.
  const [selected, setSelected] = useState<SurgicalOrder | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [checklist, setChecklist] = useState<{ item: string; done: boolean }[]>([])
  const [signature, setSignature] = useState<string | null>(null)
  const awaiting = SURGICAL_ORDERS.filter((o) => o.status === 'submitted').length

  const open = (order: SurgicalOrder) => {
    setSelected(order)
    setChecklist(order.checklist.map((c) => ({ ...c })))
    setSignature(null)
    setDetailOpen(true)
  }
  const allDone = checklist.every((c) => c.done)

  const columns: Column<SurgicalOrder>[] = [
    { key: 'id', header: 'Order', cell: (o) => <span className="tnum font-mono text-[13px] text-forest-500">{o.id}</span> },
    {
      key: 'patient',
      header: 'Patient',
      cell: (o) => (
        <span className="flex items-center gap-2.5">
          <Avatar name={o.patient} size="xs" />
          <span className="truncate font-medium text-forest">{o.patient}</span>
        </span>
      ),
    },
    { key: 'procedure', header: 'Procedure', cell: (o) => <span className="font-medium text-forest">{o.procedure}</span> },
    { key: 'theatre', header: 'Theatre', cell: (o) => <Tag>{o.theatre}</Tag> },
    { key: 'scheduled', header: 'Scheduled', cell: (o) => <span className="tnum">{o.scheduled}</span> },
    { key: 'surgeon', header: 'Surgeon', cell: (o) => o.surgeon },
    {
      key: 'readiness',
      header: 'Checklist',
      align: 'right',
      cell: (o) => {
        const done = o.checklist.filter((c) => c.done).length
        return (
          <span className="tnum text-[13px] text-forest-400">
            {done}/{o.checklist.length}
          </span>
        )
      },
    },
    { key: 'status', header: 'Status', cell: (o) => <StatusPill status={o.status} /> },
  ]

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader title="Surgical orders" subtitle="Pre-op readiness and theatre scheduling" />
      </div>

      {awaiting > 0 && (
        <div className="animate-rise" style={{ animationDelay: '40ms' }}>
          <Alert tone="info" title={`${awaiting} orders await sign-off`}>
            Open an order to work through its pre-op checklist — sign-off unlocks when every item
            is complete.
          </Alert>
        </div>
      )}

      <Card className="animate-rise" style={{ animationDelay: '100ms' }}>
        <DataTable columns={columns} rows={SURGICAL_ORDERS} rowKey={(o) => o.id} onRowClick={open} />
      </Card>

      <Drawer
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={selected ? selected.procedure : undefined}
        subtitle={selected ? `${selected.id} · ${selected.patient}` : undefined}
        size="lg"
        footer={
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] text-forest-400">
              {checklist.filter((c) => c.done).length}/{checklist.length} complete
              {allDone && !signature && ' · signature required'}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setDetailOpen(false)}>
                Close
              </Button>
              <Button
                disabled={!allDone || !signature}
                leftIcon={<Check size={15} />}
                onClick={() => {
                  setDetailOpen(false)
                  success('Order signed off', `${selected?.id} is cleared for theatre.`)
                }}
              >
                Sign off
              </Button>
            </div>
          </div>
        }
      >
        {selected && (
          <div className="space-y-5">
            <dl className="grid grid-cols-2 gap-4">
              <KeyValue label="Theatre" value={selected.theatre} />
              <KeyValue label="Scheduled" value={selected.scheduled} />
              <KeyValue label="Surgeon" value={selected.surgeon} />
              <KeyValue label="Status" value={<StatusPill status={selected.status} />} />
            </dl>
            <div>
              <p className="mb-2.5 text-[13px] font-medium text-forest-500">Pre-op checklist</p>
              <ul className="space-y-1">
                {checklist.map((c, i) => (
                  <li key={c.item} className="flex items-center justify-between gap-3 rounded-2xl bg-panel px-4 py-3">
                    <span className="text-sm text-forest-500">{c.item}</span>
                    <Toggle
                      checked={c.done}
                      onChange={(next) =>
                        setChecklist((list) => list.map((x, j) => (j === i ? { ...x, done: next } : x)))
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2.5 text-[13px] font-medium text-forest-500">Sign-off signature</p>
              <SignaturePad onChange={setSignature} height={130} />
              <p className="mt-1.5 text-[12px] text-forest-400">
                Signing as Amina Bello · Clinical operations
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </>
  )
}
