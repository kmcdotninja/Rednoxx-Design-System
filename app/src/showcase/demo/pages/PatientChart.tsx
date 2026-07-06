import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarPlus, Plus, Stethoscope } from 'lucide-react'
import { AreaChart } from '@/components/ui/AreaChart'
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  DataTable,
  KeyValue,
  StatusPill,
  Tabs,
  Tag,
  useToast,
  type Column,
  type TabItem,
} from '@/components/ui'
import { PatientBanner, VitalsRow } from '@/components/blocks'
import {
  APPOINTMENTS,
  CLAIMS,
  CONSULTATIONS,
  LAB_ORDERS,
  PATIENTS,
  PATIENT_BIO,
  PAYMENTS,
  PRESCRIPTIONS,
  type Appointment,
  type Claim,
  type Consultation,
  type LabOrder,
  type Payment,
  type Prescription,
} from '../../health'

const BRAND = '#5833fb'
const ngn = (v: number) => `₦${v.toLocaleString()}`

type ChartTab = 'overview' | 'prescriptions' | 'labs' | 'appointments' | 'billing'

const bucketStatus: Record<Appointment['bucket'], string> = {
  upcoming: 'scheduled',
  past: 'completed',
  cancelled: 'cancelled',
}

function RailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">{title}</h3>
      <div className="mt-2.5">{children}</div>
    </section>
  )
}

/** Full EHR-style patient chart: banner, summary rail, and tabbed records. */
export function PatientChartPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success } = useToast()
  const [tab, setTab] = useState<ChartTab>('overview')

  const patient = PATIENTS.find((p) => p.id === id)
  const bio = id ? PATIENT_BIO[id] : undefined
  if (!patient || !bio) return <Navigate to="/demo/patients" replace />

  const prescriptions = PRESCRIPTIONS.filter((rx) => rx.patient === patient.name)
  const labs = LAB_ORDERS.filter((o) => o.patient === patient.name)
  const appointments = APPOINTMENTS.filter((a) => a.patient === patient.name)
  const encounters = CONSULTATIONS.filter((c) => c.patient === patient.name)
  const payments = PAYMENTS.filter((p) => p.patient === patient.name)
  const claims = CLAIMS.filter((c) => c.patient === patient.name)

  const tabs: TabItem<ChartTab>[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'prescriptions', label: 'Prescriptions', count: prescriptions.length },
    { value: 'labs', label: 'Lab results', count: labs.length },
    { value: 'appointments', label: 'Appointments', count: appointments.length },
    { value: 'billing', label: 'Billing', count: payments.length + claims.length },
  ]

  const rxColumns: Column<Prescription>[] = [
    { key: 'id', header: 'RX', cell: (rx) => <span className="tnum font-mono text-[13px] text-forest-500">{rx.id}</span> },
    {
      key: 'drug',
      header: 'Medication',
      cell: (rx) => (
        <span>
          <span className="block font-medium text-forest">{rx.drug}</span>
          <span className="block text-xs text-forest-400">{rx.dose}</span>
        </span>
      ),
    },
    { key: 'prescriber', header: 'Prescriber', cell: (rx) => rx.prescriber },
    { key: 'issued', header: 'Issued', cell: (rx) => <span className="tnum">{rx.issued}</span> },
    { key: 'status', header: 'Status', cell: (rx) => <StatusPill status={rx.status} /> },
  ]

  const labColumns: Column<LabOrder>[] = [
    { key: 'id', header: 'Order', cell: (o) => <span className="tnum font-mono text-[13px] text-forest-500">{o.id}</span> },
    { key: 'test', header: 'Test', cell: (o) => <span className="font-medium text-forest">{o.test}</span> },
    { key: 'facility', header: 'Facility', cell: (o) => <span className="text-forest-400">{o.facility}</span> },
    { key: 'ordered', header: 'Ordered', cell: (o) => <span className="tnum">{o.ordered}</span> },
    { key: 'tat', header: 'Turnaround', align: 'right', cell: (o) => <span className="tnum">{o.tat}</span> },
    { key: 'status', header: 'Status', cell: (o) => <StatusPill status={o.status} /> },
  ]

  const apptColumns: Column<Appointment>[] = [
    {
      key: 'when',
      header: 'When',
      cell: (a) => (
        <span className="tnum">
          <span className="font-medium text-forest">{a.day}</span>
          <span className="text-forest-400"> · {a.time}</span>
        </span>
      ),
    },
    { key: 'type', header: 'Type', cell: (a) => <Tag>{a.type}</Tag> },
    { key: 'clinician', header: 'Clinician', cell: (a) => a.clinician },
    { key: 'status', header: 'Status', cell: (a) => <StatusPill status={bucketStatus[a.bucket]} /> },
  ]

  const paymentColumns: Column<Payment>[] = [
    { key: 'id', header: 'Invoice', cell: (p) => <span className="tnum font-mono text-[13px] text-forest-500">{p.id}</span> },
    { key: 'method', header: 'Method', cell: (p) => <Tag>{p.method}</Tag> },
    { key: 'amount', header: 'Amount', align: 'right', cell: (p) => <span className="tnum font-medium text-forest">{ngn(p.amount)}</span> },
    { key: 'date', header: 'Date', cell: (p) => <span className="tnum">{p.date}</span> },
    { key: 'status', header: 'Status', cell: (p) => <StatusPill status={p.status} /> },
  ]

  const claimColumns: Column<Claim>[] = [
    { key: 'id', header: 'Claim', cell: (c) => <span className="tnum font-mono text-[13px] text-forest-500">{c.id}</span> },
    { key: 'insurer', header: 'Insurer', cell: (c) => c.insurer },
    { key: 'amount', header: 'Amount', align: 'right', cell: (c) => <span className="tnum font-medium text-forest">{ngn(c.amount)}</span> },
    { key: 'submitted', header: 'Submitted', cell: (c) => <span className="tnum">{c.submitted}</span> },
    { key: 'status', header: 'Status', cell: (c) => <StatusPill status={c.status} /> },
  ]

  return (
    <>
      {/* Back + banner */}
      <div className="animate-rise">
        <button
          type="button"
          onClick={() => navigate('/demo/patients')}
          className="group -ml-1.5 flex items-center gap-1.5 rounded-xl px-1.5 py-1 text-[13px] text-forest-400 transition-colors hover:bg-panel hover:text-forest"
        >
          <ArrowLeft size={14} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
          All patients
        </button>

        <div className="mt-3">
          <PatientBanner
            patient={patient}
            bio={bio}
            actions={
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<CalendarPlus size={14} />}
                  onClick={() => navigate('/demo/appointments')}
                >
                  Schedule
                </Button>
                <Button
                  size="sm"
                  leftIcon={<Stethoscope size={14} />}
                  onClick={() => success('Consultation started', `${patient.name} has been added to your queue.`)}
                >
                  Start consultation
                </Button>
              </>
            }
          />
        </div>
      </div>

      {bio.allergies.length > 0 && (
        <div className="animate-rise" style={{ animationDelay: '60ms' }}>
          <Alert tone="danger" title={`Allergies: ${bio.allergies.join(', ')}`}>
            Checked automatically against every new prescription and theatre order.
          </Alert>
        </div>
      )}

      <div className="grid gap-5 animate-rise lg:grid-cols-[300px_minmax(0,1fr)]" style={{ animationDelay: '120ms' }}>
        {/* Summary rail */}
        <div className="space-y-5">
          <Card pad={false} className="space-y-5 p-5">
            <RailSection title="Contact">
              <dl className="space-y-3">
                <KeyValue label="Phone" value={<span className="tnum">{bio.phone}</span>} />
                <KeyValue label="Email" value={bio.email} />
                <KeyValue label="Address" value={bio.address} />
                <KeyValue label="Next of kin" value={bio.nextOfKin} />
              </dl>
            </RailSection>
          </Card>

          <Card pad={false} className="space-y-5 p-5">
            <RailSection title="Insurance">
              <dl className="space-y-3">
                <KeyValue label="Insurer" value={bio.insurer} />
                <KeyValue label="Member ID" value={<span className="tnum">{bio.memberId}</span>} />
                <KeyValue label="Plan" value={patient.plan} />
                <KeyValue label="Valid till" value={<span className="tnum">{bio.validTill}</span>} />
              </dl>
            </RailSection>
          </Card>

          <Card pad={false} className="space-y-5 p-5">
            <RailSection title="Allergies">
              {bio.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {bio.allergies.map((a) => (
                    <Badge key={a} tone="danger" dot>
                      {a}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-forest-400">None recorded</p>
              )}
            </RailSection>
            <RailSection title="Conditions">
              {bio.conditions.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {bio.conditions.map((c) => (
                    <Tag key={c} className="normal-case">
                      {c}
                    </Tag>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-forest-400">None recorded</p>
              )}
            </RailSection>
            <RailSection title="Care team">
              <div className="flex items-center gap-2.5">
                <Avatar name={patient.gp} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-forest">{patient.gp}</p>
                  <p className="text-[11px] text-forest-400">Assigned GP · last visit {patient.lastVisit}</p>
                </div>
              </div>
            </RailSection>
          </Card>
        </div>

        {/* Records */}
        <div className="min-w-0">
          <div className="border-b border-hair">
            <Tabs items={tabs} value={tab} onChange={setTab} />
          </div>

          {tab === 'overview' && (
            <div className="mt-5 space-y-5">
              <VitalsRow vitals={bio.vitals} />

              <Card>
                <CardHeader title="Weight trend" subtitle="Last six visits, kg" />
                <div className="mt-4">
                  <AreaChart
                    data={bio.weightSeries}
                    labels={['−5', '−4', '−3', '−2', '−1', 'Latest']}
                    height={150}
                    line={BRAND}
                    fill={BRAND}
                    seriesLabel="Weight"
                    valueFormat={(v) => `${v.toFixed(1)} kg`}
                    showAxes={false}
                  />
                </div>
              </Card>

              <Card>
                <CardHeader title="Latest clinical note" subtitle={`${patient.gp} · ${patient.lastVisit}`} />
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-forest-500">{bio.note}</p>
              </Card>

              {encounters.length > 0 && (
                <Card>
                  <CardHeader title="Recent encounters" subtitle="Today" />
                  <ul className="mt-3 space-y-1">
                    {encounters.map((c: Consultation) => (
                      <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-panel px-4 py-3">
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-forest">{c.dept}</span>
                          <span className="block text-xs text-forest-400">
                            {c.clinician} · started {c.started} · {c.duration}
                          </span>
                        </span>
                        <StatusPill status={c.status} />
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}

          {tab === 'prescriptions' && (
            <Card className="mt-5">
              <CardHeader
                title="Prescriptions"
                subtitle="Checked against recorded allergies on issue"
                action={
                  <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => success('New prescription', 'Opened in the consultation workspace.')}>
                    New
                  </Button>
                }
              />
              <div className="mt-3">
                <DataTable columns={rxColumns} rows={prescriptions} rowKey={(rx) => rx.id} />
              </div>
            </Card>
          )}

          {tab === 'labs' && (
            <Card className="mt-5">
              <CardHeader
                title="Lab results"
                subtitle="Orders and turnaround for this patient"
                action={
                  <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => success('Lab order created', 'The lab has been notified.')}>
                    New order
                  </Button>
                }
              />
              <div className="mt-3">
                <DataTable columns={labColumns} rows={labs} rowKey={(o) => o.id} />
              </div>
            </Card>
          )}

          {tab === 'appointments' && (
            <Card className="mt-5">
              <CardHeader
                title="Appointments"
                subtitle="Upcoming and historical bookings"
                action={
                  <Button size="sm" leftIcon={<CalendarPlus size={14} />} onClick={() => navigate('/demo/appointments')}>
                    Schedule
                  </Button>
                }
              />
              <div className="mt-3">
                <DataTable columns={apptColumns} rows={appointments} rowKey={(a) => a.id} />
              </div>
            </Card>
          )}

          {tab === 'billing' && (
            <div className="mt-5 space-y-5">
              <Card>
                <CardHeader title="Payments" subtitle="Invoices raised for this patient" />
                <div className="mt-3">
                  <DataTable columns={paymentColumns} rows={payments} rowKey={(p) => p.id} />
                </div>
              </Card>
              <Card>
                <CardHeader title="Insurance claims" subtitle={`Submitted to ${bio.insurer}`} />
                <div className="mt-3">
                  <DataTable columns={claimColumns} rows={claims} rowKey={(c) => c.id} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
