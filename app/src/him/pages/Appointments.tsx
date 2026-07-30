import { useState } from 'react'
import { ArrowLeftRight, CalendarCheck, Plus } from 'lucide-react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  DataTable,
  Drawer,
  Field,
  Input,
  Modal,
  SelectMenu,
  Tabs,
  useToast,
  type Column,
  type TabItem,
} from '@/components/ui'
import { HimPageHeader } from '../HimShell'
import {
  HIM_APPOINTMENTS,
  HIM_PATIENTS,
  HIM_REFERRALS,
  himPatientById,
  patientDisplayName,
  QUEUE_TARGETS,
  type HimAppointment,
  type HimReferral,
} from '../data'
import { RecordStatusPill } from '../shared'
import { useRole } from '../rbac'

type PageTab = 'appointments' | 'referrals'

const apptTone = { scheduled: 'neutral', 'checked-in': 'success', late: 'warning', 'no-show': 'danger' } as const
const refTone = { received: 'neutral', registered: 'info', sent: 'warning', completed: 'success' } as const

const referralColumns: Column<HimReferral>[] = [
  {
    key: 'patient',
    header: 'Patient',
    cell: (r) => {
      const p = himPatientById(r.patientId)
      return p ? (
        <span>
          <span className="block font-medium text-forest">{patientDisplayName(p)}</span>
          <span className="tnum block font-mono text-xs text-forest-400">{p.mrn}</span>
        </span>
      ) : (
        '—'
      )
    },
  },
  {
    key: 'direction',
    header: 'Direction',
    cell: (r) => (
      <span className="inline-flex items-center gap-1.5 capitalize">
        <ArrowLeftRight size={13} className="text-forest-300" />
        {r.direction}
      </span>
    ),
  },
  { key: 'facility', header: 'Other facility', cell: (r) => r.otherFacility },
  { key: 'service', header: 'Service', cell: (r) => r.service },
  { key: 'reason', header: 'Reason', cell: (r) => r.reason },
  { key: 'date', header: 'Date', cell: (r) => <span className="tnum">{r.date}</span> },
  {
    key: 'status',
    header: 'Status',
    cell: (r) => (
      <Badge tone={refTone[r.status]} dot>
        {r.status}
      </Badge>
    ),
  },
]

/**
 * Appointment-linked check-in and queue routing (W-HIM-007/035) plus the
 * referral register (W-HIM-033). Identity is confirmed against the linked
 * record before check-in; routing carries priority and payer prerequisites.
 */
export function AppointmentsPage() {
  const { success } = useToast()
  const { can } = useRole()
  const [tab, setTab] = useState<PageTab>('appointments')
  const [appointments, setAppointments] = useState(HIM_APPOINTMENTS)
  const [checkInFor, setCheckInFor] = useState<HimAppointment | null>(null)
  const [queueTarget, setQueueTarget] = useState<string>(QUEUE_TARGETS[0])
  const [referrals, setReferrals] = useState(HIM_REFERRALS)
  const [refOpen, setRefOpen] = useState(false)
  const [refPatientId, setRefPatientId] = useState('')
  const [refDirection, setRefDirection] = useState<'inbound' | 'outbound'>('inbound')
  const [refFacility, setRefFacility] = useState('')
  const [refService, setRefService] = useState('')
  const [refReason, setRefReason] = useState('')

  const createReferral = () => {
    if (!refPatientId || !refFacility.trim() || !refService.trim()) return
    setReferrals((all) => [
      {
        id: `ref${all.length + 1}`,
        patientId: refPatientId,
        direction: refDirection,
        otherFacility: refFacility.trim(),
        service: refService.trim(),
        reason: refReason.trim() || '—',
        status: refDirection === 'inbound' ? ('registered' as const) : ('sent' as const),
        date: 'Today',
      },
      ...all,
    ])
    success('Referral registered', 'Source facility, service and reason stay on the record for continuity of care.')
    setRefOpen(false)
  }

  const checkInPatient = checkInFor ? himPatientById(checkInFor.patientId) : undefined

  const completeCheckIn = () => {
    if (!checkInFor) return
    setAppointments((all) =>
      all.map((a) => (a.id === checkInFor.id ? { ...a, status: 'checked-in' as const } : a)),
    )
    success(
      'Checked in',
      `Encounter V-2026-09${checkInFor.id.replace(/\D/g, '').padStart(3, '0')} created and routed to ${queueTarget.toLowerCase()} — ticket Q-${checkInFor.id.toUpperCase()} issued. Check-in, encounter and routing are audited.`,
    )
    setCheckInFor(null)
  }

  const appointmentColumns: Column<HimAppointment>[] = [
    { key: 'time', header: 'Time', cell: (a) => <span className="tnum font-medium text-forest">{a.time}</span> },
    {
      key: 'patient',
      header: 'Patient',
      cell: (a) => {
        const p = himPatientById(a.patientId)
        return p ? (
          <span>
            <span className="block font-medium text-forest">{patientDisplayName(p)}</span>
            <span className="tnum block font-mono text-xs text-forest-400">{p.mrn}</span>
          </span>
        ) : (
          '—'
        )
      },
    },
    { key: 'clinic', header: 'Clinic', cell: (a) => a.clinic },
    { key: 'service', header: 'Service', cell: (a) => a.serviceType },
    {
      key: 'status',
      header: 'Status',
      cell: (a) => (
        <Badge tone={apptTone[a.status]} dot>
          {a.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (a) =>
        can.checkIn && (a.status === 'scheduled' || a.status === 'late') ? (
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<CalendarCheck size={14} />}
            onClick={(e) => {
              e.stopPropagation()
              setQueueTarget(QUEUE_TARGETS[0])
              setCheckInFor(a)
            }}
          >
            Check in
          </Button>
        ) : null,
    },
  ]

  const tabs: TabItem<PageTab>[] = [
    { value: 'appointments', label: 'Today’s appointments', count: appointments.length },
    { value: 'referrals', label: 'Referral register', count: referrals.length },
  ]

  return (
    <>
      <HimPageHeader
        title="Appointments & check-in"
        subtitle="Identity is confirmed against the linked record before check-in; wrong patient means correct the linkage, never check in"
        actions={
          tab === 'referrals' && can.checkIn ? (
            <Button
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => {
                setRefPatientId('')
                setRefDirection('inbound')
                setRefFacility('')
                setRefService('')
                setRefReason('')
                setRefOpen(true)
              }}
            >
              New referral
            </Button>
          ) : undefined
        }
      />

      <div className="border-b border-hair">
        <Tabs items={tabs} value={tab} onChange={setTab} />
      </div>

      {tab === 'appointments' ? (
        <Card pad={false}>
          <div className="px-2 py-2">
            <DataTable columns={appointmentColumns} rows={appointments} rowKey={(a) => a.id} />
          </div>
          <p className="border-t border-hair px-5 py-3 text-xs text-forest-400">
            Late and no-show handling follows facility scheduling rules; unlinked appointments are
            bound to a record (or registered) before check-in.
          </p>
        </Card>
      ) : (
        <Card pad={false}>
          <div className="px-2 py-2">
            <DataTable columns={referralColumns} rows={referrals} rowKey={(r) => r.id} />
          </div>
          <p className="border-t border-hair px-5 py-3 text-xs text-forest-400">
            Referral context — source facility, service and reason — stays on the record for
            continuity of care; outbound referrals track to completion.
          </p>
        </Card>
      )}

      {/* Referral registration (W-HIM-033). */}
      <Drawer
        open={refOpen}
        onClose={() => setRefOpen(false)}
        title="Register referral"
        subtitle="Inbound referrals register the context; outbound referrals track to completion"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRefOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!refPatientId || refFacility.trim() === '' || refService.trim() === ''}
              onClick={createReferral}
            >
              Register referral
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <Field label="Patient" required>
            <SelectMenu
              value={refPatientId}
              onChange={setRefPatientId}
              placeholder="Select patient…"
              options={HIM_PATIENTS.filter((p) => p.recordStatus !== 'merged').map((p) => ({
                value: p.id,
                label: patientDisplayName(p),
                hint: p.mrn,
              }))}
            />
          </Field>
          <Field label="Direction" required>
            <SelectMenu
              value={refDirection}
              onChange={setRefDirection}
              options={[
                { value: 'inbound' as const, label: 'Inbound — from another facility' },
                { value: 'outbound' as const, label: 'Outbound — to another facility' },
              ]}
            />
          </Field>
          <Field label="Other facility" required>
            <Input value={refFacility} onChange={(e) => setRefFacility(e.target.value)} placeholder="e.g. National Hospital Abuja" />
          </Field>
          <Field label="Service" required>
            <Input value={refService} onChange={(e) => setRefService(e.target.value)} placeholder="e.g. Nephrology" />
          </Field>
          <Field label="Reason" optional>
            <Input value={refReason} onChange={(e) => setRefReason(e.target.value)} />
          </Field>
        </div>
      </Drawer>

      {/* Check-in (W-HIM-007) + queue routing (W-HIM-035) + encounter (W-HIM-036). */}
      <Modal
        open={checkInFor !== null}
        onClose={() => setCheckInFor(null)}
        title="Confirm identity & check in"
        subtitle={checkInFor ? `${checkInFor.time} · ${checkInFor.clinic} · ${checkInFor.serviceType}` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCheckInFor(null)}>
              Cancel
            </Button>
            <Button leftIcon={<CalendarCheck size={14} />} onClick={completeCheckIn}>
              Check in & route
            </Button>
          </>
        }
      >
        {checkInPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-panel px-4 py-3">
              <Avatar name={patientDisplayName(checkInPatient)} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-forest">{patientDisplayName(checkInPatient)}</p>
                <p className="tnum text-xs text-forest-400">
                  {checkInPatient.mrn} · {checkInPatient.dob ?? `est. ${checkInPatient.estimatedAge}y`} ·{' '}
                  {checkInPatient.sex}
                </p>
              </div>
              <RecordStatusPill status={checkInPatient.recordStatus} />
            </div>
            <p className="text-[13px] leading-relaxed text-forest-500">
              Verify the person against the banner above — name, MRN and date of birth. If this is
              not the linked patient, do not check in; correct the appointment linkage instead.
            </p>
            <Field label="Route to" required hint="Payer prerequisites (e.g. NHIA pre-authorisation) gate clinic entry.">
              <SelectMenu
                value={queueTarget}
                onChange={setQueueTarget}
                options={QUEUE_TARGETS.map((q) => ({ value: q, label: q }))}
              />
            </Field>
          </div>
        )}
      </Modal>
    </>
  )
}
