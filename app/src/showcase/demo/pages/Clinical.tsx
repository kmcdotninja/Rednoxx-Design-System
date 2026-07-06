import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import {
  Avatar,
  Button,
  Card,
  Combobox,
  DataTable,
  DatePicker,
  Drawer,
  Field,
  FileUpload,
  Input,
  KeyValue,
  Modal,
  SearchInput,
  Select,
  StatCard,
  StatusPill,
  Tabs,
  Tag,
  Textarea,
  TimePicker,
  useToast,
  type Column,
  type TabItem,
} from '@/components/ui'
import { FilterBar } from '@/components/blocks'
import { DemoPageHeader } from '../DemoShell'
import {
  APPOINTMENTS,
  CONSULTATIONS,
  PATIENTS,
  PRESCRIPTIONS,
  type Appointment,
  type Consultation,
  type Patient,
  type Prescription,
} from '../../health'

/* ------------------------------- Patients ------------------------------- */

type PatientFilter = 'all' | 'active' | 'inactive'

export function PatientsPage() {
  const { success } = useToast()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PatientFilter>('all')
  const [newOpen, setNewOpen] = useState(false)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PATIENTS.filter(
      (p) =>
        (filter === 'all' || p.status === filter) &&
        (!q || p.name.toLowerCase().includes(q) || p.mrn.includes(q)),
    )
  }, [query, filter])

  const statusTabs: TabItem<PatientFilter>[] = [
    { value: 'all', label: 'All', count: PATIENTS.length },
    { value: 'active', label: 'Active', count: PATIENTS.filter((p) => p.status === 'active').length },
    { value: 'inactive', label: 'Inactive', count: PATIENTS.filter((p) => p.status === 'inactive').length },
  ]

  const columns: Column<Patient>[] = [
    {
      key: 'name',
      header: 'Patient',
      cell: (p) => (
        <span className="flex items-center gap-3">
          <Avatar name={p.name} size="sm" />
          <span className="min-w-0">
            <span className="block truncate font-medium text-forest">{p.name}</span>
            <span className="tnum block text-xs text-forest-400">MRN {p.mrn}</span>
          </span>
        </span>
      ),
    },
    { key: 'age', header: 'Age', align: 'right', cell: (p) => <span className="tnum">{p.age}</span> },
    { key: 'plan', header: 'Plan', cell: (p) => <Tag>{p.plan}</Tag> },
    { key: 'gp', header: 'Assigned GP', cell: (p) => p.gp },
    { key: 'visit', header: 'Last visit', cell: (p) => <span className="tnum">{p.lastVisit}</span> },
    { key: 'status', header: 'Status', cell: (p) => <StatusPill status={p.status} /> },
  ]

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader
          title="Patients"
          subtitle={`${PATIENTS.length} registered across 9 facilities`}
          actions={
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setNewOpen(true)}>
              New patient
            </Button>
          }
        />
      </div>

      <div className="animate-rise" style={{ animationDelay: '60ms' }}>
        <FilterBar
          search={{
            value: query,
            onChange: setQuery,
            placeholder: 'Search by name or MRN…',
            label: 'Search patients',
          }}
        />
      </div>

      <Card className="animate-rise" style={{ animationDelay: '120ms' }}>
        <div className="border-b border-hair">
          <Tabs items={statusTabs} value={filter} onChange={setFilter} />
        </div>
        <div className="mt-2">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(p) => p.id}
            pageSize={8}
            onRowClick={(p) => navigate(`/demo/patients/${p.id}`)}
          />
        </div>
      </Card>

      {/* New patient */}
      <Drawer
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="New patient"
        subtitle="Enrol a patient into the network"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setNewOpen(false)
                success('Patient enrolled', 'An MRN has been assigned and a welcome SMS sent.')
              }}
            >
              Enrol patient
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Full name" required>
            <Input placeholder="As it appears on their ID" />
          </Field>
          <Field label="Date of birth" required>
            <DatePicker />
          </Field>
          <Field label="Plan" required>
            <Select defaultValue="Retail Basic">
              {['Retail Basic', 'Family Gold · HMO', 'Corporate Silver', 'Maternity Plus'].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </Field>
          <Field label="Phone" hint="Used for appointment reminders.">
            <Input type="tel" placeholder="+234 …" />
          </Field>
          <Field label="Referral letter" optional>
            <FileUpload label="Upload referral letter" multiple={false} />
          </Field>
        </div>
      </Drawer>
    </>
  )
}

/* ----------------------------- Appointments ----------------------------- */

type Bucket = 'upcoming' | 'past' | 'cancelled'
const bucketStatus: Record<Bucket, string> = {
  upcoming: 'scheduled',
  past: 'completed',
  cancelled: 'cancelled',
}

export function AppointmentsPage() {
  const { success } = useToast()
  const [bucket, setBucket] = useState<Bucket>('upcoming')
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [patient, setPatient] = useState<string | undefined>()

  const tabs: TabItem<Bucket>[] = (['upcoming', 'past', 'cancelled'] as const).map((b) => ({
    value: b,
    label: b[0].toUpperCase() + b.slice(1),
    count: APPOINTMENTS.filter((a) => a.bucket === b).length,
  }))

  const columns: Column<Appointment>[] = [
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
    {
      key: 'patient',
      header: 'Patient',
      cell: (a) => (
        <span className="flex items-center gap-2.5">
          <Avatar name={a.patient} size="xs" />
          <span className="truncate font-medium text-forest">{a.patient}</span>
        </span>
      ),
    },
    { key: 'type', header: 'Type', cell: (a) => <Tag>{a.type}</Tag> },
    { key: 'clinician', header: 'Clinician', cell: (a) => a.clinician },
    { key: 'status', header: 'Status', cell: (a) => <StatusPill status={bucketStatus[a.bucket]} /> },
  ]

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader
          title="Appointments"
          subtitle="Bookings across clinics, labs and theatres"
          actions={
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setScheduleOpen(true)}>
              Schedule appointment
            </Button>
          }
        />
      </div>

      <Card className="animate-rise" style={{ animationDelay: '80ms' }}>
        <div className="border-b border-hair">
          <Tabs items={tabs} value={bucket} onChange={setBucket} />
        </div>
        <div className="mt-2">
          <DataTable
            columns={columns}
            rows={APPOINTMENTS.filter((a) => a.bucket === bucket)}
            rowKey={(a) => a.id}
            pageSize={8}
          />
        </div>
      </Card>

      <Modal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title="Schedule appointment"
        subtitle="Reminders go out by SMS 24 hours ahead."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setScheduleOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setScheduleOpen(false)
                success('Appointment scheduled', 'The patient has been notified.')
              }}
            >
              Schedule
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Patient" required>
            <Combobox
              options={PATIENTS.map((p) => ({ value: p.id, label: p.name, hint: p.mrn }))}
              value={patient}
              onChange={setPatient}
              placeholder="Search patients…"
            />
          </Field>
          <Field label="Clinician" required>
            <Select defaultValue="Dr. Sani Ahmed">
              {['Dr. Sani Ahmed', 'Dr. Bisi Adeyemi', 'Dr. Kemi Balogun', 'Dr. Femi Alade'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" required>
              <DatePicker />
            </Field>
            <Field label="Time" required>
              <TimePicker defaultValue="09:00" />
            </Field>
          </div>
        </div>
      </Modal>
    </>
  )
}

/* ---------------------------- Consultations ----------------------------- */

export function ConsultationsPage() {
  // `selected` is kept through the close animation so the drawer never blanks mid-exit.
  const [selected, setSelected] = useState<Consultation | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const inProgress = CONSULTATIONS.filter((c) => c.status === 'in_progress').length

  const columns: Column<Consultation>[] = [
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
    { key: 'clinician', header: 'Clinician', cell: (c) => c.clinician },
    { key: 'dept', header: 'Department', cell: (c) => <Tag>{c.dept}</Tag> },
    { key: 'started', header: 'Started', align: 'right', cell: (c) => <span className="tnum">{c.started}</span> },
    { key: 'duration', header: 'Duration', align: 'right', cell: (c) => <span className="tnum">{c.duration}</span> },
    { key: 'status', header: 'Status', cell: (c) => <StatusPill status={c.status} /> },
  ]

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader title="Consultations" subtitle="Today, across all facilities" />
      </div>

      <div className="grid gap-4 animate-rise sm:grid-cols-3" style={{ animationDelay: '60ms' }}>
        <StatCard label="In progress" value={inProgress} sub="right now" />
        <StatCard label="Completed today" value={CONSULTATIONS.length - inProgress} delta="+12%" deltaTone="up" sub="vs yesterday" />
        <StatCard label="Avg duration" value="14m 32s" delta="−1m 08s" deltaTone="up" sub="vs last period" />
      </div>

      <Card className="animate-rise" style={{ animationDelay: '120ms' }}>
        <DataTable
          columns={columns}
          rows={CONSULTATIONS}
          rowKey={(c) => c.id}
          pageSize={8}
          onRowClick={(c) => {
            setSelected(c)
            setDetailOpen(true)
          }}
        />
      </Card>

      <Drawer
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={selected ? `Consultation · ${selected.patient}` : undefined}
        subtitle={selected ? `${selected.clinician} · ${selected.dept}` : undefined}
        footer={
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setDetailOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-5">
            <dl className="grid grid-cols-2 gap-4">
              <KeyValue label="Started" value={selected.started} />
              <KeyValue label="Duration" value={selected.duration} />
              <KeyValue label="Department" value={selected.dept} />
              <KeyValue label="Status" value={<StatusPill status={selected.status} />} />
            </dl>
            <Field label="Clinical notes" hint="Visible to the care team only.">
              <Textarea rows={4} placeholder="Presenting complaint, findings, plan…" />
            </Field>
          </div>
        )}
      </Drawer>
    </>
  )
}

/* ---------------------------- Prescriptions ----------------------------- */

export function PrescriptionsPage() {
  const { success } = useToast()
  const [query, setQuery] = useState('')
  const [voiding, setVoiding] = useState<Prescription | null>(null)
  const [voided, setVoided] = useState<Set<string>>(new Set())

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRESCRIPTIONS.filter(
      (rx) => !q || rx.patient.toLowerCase().includes(q) || rx.drug.toLowerCase().includes(q),
    )
  }, [query])

  const statusOf = (rx: Prescription) => (voided.has(rx.id) ? 'cancelled' : rx.status)

  const columns: Column<Prescription>[] = [
    { key: 'id', header: 'RX', cell: (rx) => <span className="tnum font-mono text-[13px] text-forest-500">{rx.id}</span> },
    {
      key: 'patient',
      header: 'Patient',
      cell: (rx) => (
        <span className="flex items-center gap-2.5">
          <Avatar name={rx.patient} size="xs" />
          <span className="truncate font-medium text-forest">{rx.patient}</span>
        </span>
      ),
    },
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
    { key: 'status', header: 'Status', cell: (rx) => <StatusPill status={statusOf(rx)} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (rx) =>
        statusOf(rx) === 'active' ? (
          <Button size="sm" variant="danger" onClick={() => setVoiding(rx)}>
            Void…
          </Button>
        ) : null,
    },
  ]

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader
          title="Prescriptions"
          subtitle="Issued across the network, newest first"
          actions={
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => success('New prescription', 'Opened in the consultation workspace.')}>
              New prescription
            </Button>
          }
        />
      </div>

      <div className="animate-rise" style={{ animationDelay: '60ms' }}>
        <SearchInput
          placeholder="Search by patient or drug…"
          aria-label="Search prescriptions"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          wrapClassName="max-w-xs"
        />
      </div>

      <Card className="animate-rise" style={{ animationDelay: '120ms' }}>
        <DataTable columns={columns} rows={rows} rowKey={(rx) => rx.id} pageSize={8} />
      </Card>

      <Modal
        open={voiding !== null}
        onClose={() => setVoiding(null)}
        title="Void this prescription?"
        subtitle={voiding ? `${voiding.id} · ${voiding.drug} · ${voiding.patient}` : undefined}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setVoiding(null)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (voiding) setVoided((s) => new Set(s).add(voiding.id))
                setVoiding(null)
                success('Prescription voided', 'The pharmacy has been notified.')
              }}
            >
              Void prescription
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-forest-500">
          The pharmacy will be notified immediately and the patient’s medication record will show
          this as voided. This cannot be undone.
        </p>
        <Field label="Reason" required className="mt-4">
          <Textarea rows={2} placeholder="e.g. issued against the wrong patient" />
        </Field>
      </Modal>
    </>
  )
}
