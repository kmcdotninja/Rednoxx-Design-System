import { useState } from 'react'
import { ArrowUpRight, CalendarRange, Download, SlidersHorizontal } from 'lucide-react'
import { AreaChart, Sparkline } from '@/components/ui/AreaChart'
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Combobox,
  DataTable,
  DatePicker,
  Drawer,
  Field,
  Input,
  KeyValue,
  Modal,
  Select,
  StatusPill,
  Textarea,
  useToast,
  type Column,
} from '@/components/ui'
import { KpiCard } from '@/components/blocks'
import { DemoPageHeader } from '../DemoShell'
import { DAYS, DEPARTMENTS, FACILITIES, KPIS, type Facility, type Kpi } from '../../health'

const BRAND = '#5833fb'

function kpiFormat(kpi: Kpi): (v: number) => string {
  if (kpi.key === 'consult-time') {
    return (v) => `${Math.floor(v)}m ${String(Math.round((v % 1) * 60)).padStart(2, '0')}s`
  }
  if (kpi.key === 'claims') return (v) => `${v.toFixed(1)}%`
  return (v) => Math.round(v).toLocaleString()
}

/** Network analytics — the screen from the engagement reference, assembled from the system. */
export function AnalyticsPage() {
  const { success } = useToast()
  const [filterOpen, setFilterOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  // `facility` is kept through the close animation so the drawer never blanks mid-exit.
  const [facility, setFacility] = useState<Facility | null>(null)
  const [facilityOpen, setFacilityOpen] = useState(false)
  const [filterFacility, setFilterFacility] = useState<string | undefined>()
  const dateRange = `${DAYS[0]} – ${DAYS[DAYS.length - 1]}, ${new Date().getFullYear()}`

  const topFacilities = [...FACILITIES].sort((a, b) => b.consults - a.consults).slice(0, 4)

  const columns: Column<Facility>[] = [
    {
      key: 'name',
      header: 'Facility',
      cell: (f) => (
        <span className="flex items-center gap-3">
          <Avatar name={f.name} size="sm" />
          <span className="min-w-0">
            <span className="block truncate font-medium text-forest">{f.name}</span>
            <span className="block text-xs text-forest-400">{f.city}</span>
          </span>
        </span>
      ),
    },
    { key: 'patients', header: 'Patients', align: 'right', cell: (f) => <span className="tnum">{f.patients.toLocaleString()}</span> },
    { key: 'consults', header: 'Consultations', align: 'right', cell: (f) => <span className="tnum">{f.consults.toLocaleString()}</span> },
    { key: 'wait', header: 'Avg wait', align: 'right', cell: (f) => <span className="tnum">{f.waitMins}m</span> },
    {
      key: 'claims',
      header: 'Claims approved',
      align: 'right',
      cell: (f) => (
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-14 overflow-hidden rounded-full bg-panel">
            <span className="block h-full rounded-full bg-azure" style={{ width: `${f.approvedPct}%` }} />
          </span>
          <span className="tnum font-medium text-forest">{f.approvedPct}%</span>
        </span>
      ),
    },
    { key: 'trend', header: 'Last 7 days', align: 'right', cell: (f) => <Sparkline data={f.trend} width={80} height={26} color={BRAND} /> },
    { key: 'status', header: 'Status', cell: (f) => <StatusPill status={f.status} /> },
  ]

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader
          title="Analytics"
          subtitle="Network-wide clinical and administrative activity"
          actions={
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download size={15} />}
              onClick={() => success('Export started', 'The report will land in your inbox shortly.')}
            >
              Export
            </Button>
          }
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 animate-rise" style={{ animationDelay: '60ms' }}>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<SlidersHorizontal size={15} />}
          onClick={() => setFilterOpen(true)}
        >
          Filter
        </Button>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-[13px] text-forest-400">
            Compare
            <Select className="h-8 w-auto rounded-xl text-[13px]" defaultValue="prev">
              <option value="prev">Previous period</option>
              <option value="year">Same period last year</option>
              <option value="none">No comparison</option>
            </Select>
          </label>
          <Button variant="secondary" size="sm" leftIcon={<CalendarRange size={15} />}>
            {dateRange}
          </Button>
        </div>
      </div>

      {/* Advanced reporting promo */}
      <Card pad={false} className="animate-rise overflow-hidden" style={{ animationDelay: '120ms' }}>
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_minmax(0,360px)]">
          <div className="flex flex-col justify-center">
            <h2 className="text-[17px] font-medium tracking-[-0.01em] text-forest">
              Advanced reporting
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-forest-400">
              Track facility performance without manual exports, segment patient cohorts for
              targeted care programmes, and sync visit data with your reporting stack.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Button size="sm" rightIcon={<ArrowUpRight size={15} />}>
                Try reports
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setContactOpen(true)}>
                Talk to us
              </Button>
            </div>
          </div>
          <div className="rounded-3xl bg-panel p-3">
            <p className="px-2 pb-2 pt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
              Busiest facilities
            </p>
            <ul className="space-y-0.5">
              {topFacilities.map((f) => (
                <li key={f.id} className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2 shadow-chip">
                  <Avatar name={f.name} size="xs" ring={false} />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-forest">{f.name}</span>
                  <span className="tnum text-xs text-forest-400">{f.consults}</span>
                  <Sparkline data={f.trend} width={52} height={18} color={BRAND} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* KPI tiles */}
      <div className="grid gap-4 animate-rise sm:grid-cols-2 xl:grid-cols-3" style={{ animationDelay: '180ms' }}>
        {KPIS.map((kpi) => (
          <KpiCard
            key={kpi.key}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            deltaTone={kpi.deltaTone}
            sub={kpi.sub}
            series={kpi.series}
            labels={DAYS}
            valueFormat={kpiFormat(kpi)}
          />
        ))}
      </div>

      {/* Facility table */}
      <Card className="animate-rise" style={{ animationDelay: '240ms' }}>
        <CardHeader
          title="Facility performance"
          subtitle="Consultations, wait times and claim outcomes across the network"
        />
        <div className="mt-3">
          <DataTable
            columns={columns}
            rows={FACILITIES}
            rowKey={(f) => f.id}
            pageSize={6}
            onRowClick={(f) => {
              setFacility(f)
              setFacilityOpen(true)
            }}
          />
        </div>
      </Card>

      {/* Filters */}
      <Drawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filter analytics"
        subtitle="Narrow the view to a facility, department or window"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setFilterFacility(undefined)}>
              Reset
            </Button>
            <Button
              onClick={() => {
                setFilterOpen(false)
                success('Filters applied', 'The dashboard now reflects your selection.')
              }}
            >
              Apply filters
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Facility">
            <Combobox
              options={FACILITIES.map((f) => ({ value: f.id, label: f.name, hint: f.city }))}
              value={filterFacility}
              onChange={setFilterFacility}
              placeholder="All facilities"
              searchPlaceholder="Search facilities…"
            />
          </Field>
          <Field label="Department">
            <Select defaultValue={DEPARTMENTS[0]}>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From">
              <DatePicker />
            </Field>
            <Field label="To">
              <DatePicker align="right" />
            </Field>
          </div>
        </div>
      </Drawer>

      {/* Facility detail */}
      <Drawer
        open={facilityOpen}
        onClose={() => setFacilityOpen(false)}
        title={facility?.name}
        subtitle={facility ? `${facility.city} · last 14 days` : undefined}
        size="lg"
      >
        {facility && (
          <div className="space-y-5">
            <dl className="grid grid-cols-2 gap-4">
              <KeyValue label="Registered patients" value={facility.patients.toLocaleString()} />
              <KeyValue label="Consultations" value={facility.consults.toLocaleString()} />
              <KeyValue label="Average wait" value={`${facility.waitMins} minutes`} />
              <KeyValue label="Claims approved" value={`${facility.approvedPct}%`} />
            </dl>
            <div className="rounded-3xl bg-panel p-4">
              <p className="mb-2 text-[13px] font-medium text-forest-500">Consultations · last 7 days</p>
              <AreaChart
                data={facility.trend}
                labels={lastSeven()}
                height={140}
                line={BRAND}
                fill={BRAND}
                seriesLabel="Consultations"
                valueFormat={(v) => `${Math.round(v * 10)}`}
                showAxes={false}
              />
            </div>
            <StatusPill status={facility.status} />
          </div>
        )}
      </Drawer>

      {/* Contact sales */}
      <Modal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Talk to us"
        subtitle="Tell us what you want out of advanced reporting."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setContactOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setContactOpen(false)
                success('Message sent', 'Our team will reach out within one working day.')
              }}
            >
              Send message
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Name" required>
            <Input defaultValue="Amina Bello" />
          </Field>
          <Field label="Work email" required>
            <Input type="email" placeholder="amina@rednoxx.health" />
          </Field>
          <Field label="What do you need?" hint="A sentence or two is plenty.">
            <Textarea placeholder="e.g. weekly claim-outcome reports per facility" />
          </Field>
        </div>
      </Modal>
    </>
  )
}

const fmtDay = new Intl.DateTimeFormat('en', { weekday: 'short' })
function lastSeven(): string[] {
  const today = Date.now()
  return Array.from({ length: 7 }, (_, i) => fmtDay.format(new Date(today - (6 - i) * 86_400_000)))
}
