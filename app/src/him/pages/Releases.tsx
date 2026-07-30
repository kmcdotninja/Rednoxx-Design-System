import { useState } from 'react'
import { Check, FilePlus2, X } from 'lucide-react'
import {
  Alert,
  Badge,
  Button,
  Card,
  DataTable,
  Drawer,
  Field,
  Input,
  KeyValue,
  SelectMenu,
  Tabs,
  useToast,
  type Column,
  type TabItem,
} from '@/components/ui'
import { HimPageHeader } from '../HimShell'
import {
  DATA_RIGHTS_REQUESTS,
  HIM_PATIENTS,
  himPatientById,
  patientDisplayName,
  RELEASE_REQUESTS,
  type DataRightsRequest,
  type ReleaseRequest,
} from '../data'
import { ReleaseStatusPill } from '../shared'
import { useRole } from '../rbac'

type ReleasesTab = 'releases' | 'data-rights'

const dsrTone = { received: 'neutral', 'in progress': 'info', completed: 'success', overdue: 'danger' } as const

const dsrColumns: Column<DataRightsRequest>[] = [
  {
    key: 'type',
    header: 'Request type',
    cell: (r) => <span className="font-medium capitalize text-forest">{r.type}</span>,
  },
  {
    key: 'requester',
    header: 'Requester',
    cell: (r) => {
      const p = himPatientById(r.patientId)
      return (
        <span className="block max-w-[12rem]">
          <span className="block truncate text-[13px]" title={r.requester}>{r.requester}</span>
          <span className="tnum block font-mono text-xs text-forest-400">{p?.mrn}</span>
        </span>
      )
    },
  },
  { key: 'received', header: 'Received', cell: (r) => <span className="tnum">{r.received}</span> },
  {
    key: 'due',
    header: 'Due',
    cell: (r) => (
      <span className={r.status === 'overdue' ? 'tnum font-medium text-rose-ink' : 'tnum'}>
        {r.due}
      </span>
    ),
  },
  { key: 'assignee', header: 'Assignee', cell: (r) => <span className="block max-w-[10rem] truncate" title={r.assignee}>{r.assignee}</span> },
  {
    key: 'status',
    header: 'Status',
    cell: (r) => (
      <Badge tone={dsrTone[r.status]} dot>
        {r.status}
      </Badge>
    ),
  },
]

/** Release of information register (W-HIM-028/029/031). */
export function ReleasesPage() {
  const { success, info } = useToast()
  const { can } = useRole()
  const [tab, setTab] = useState<ReleasesTab>('releases')
  const [requests, setRequests] = useState(RELEASE_REQUESTS)
  const [dsrRows, setDsrRows] = useState(DATA_RIGHTS_REQUESTS)
  const [openId, setOpenId] = useState<string | null>(null)
  const [intakeOpen, setIntakeOpen] = useState(false)
  const [intakeType, setIntakeType] = useState<DataRightsRequest['type']>('data-subject access')
  const [intakePatientId, setIntakePatientId] = useState('')
  const [newRelOpen, setNewRelOpen] = useState(false)
  const [relType, setRelType] = useState<ReleaseRequest['requesterType']>('internal clinical')
  const [relPatientId, setRelPatientId] = useState('')
  const [relRequester, setRelRequester] = useState('')
  const [relPurpose, setRelPurpose] = useState('')
  const [relScope, setRelScope] = useState('')

  const createRelease = () => {
    if (!relPatientId || relRequester.trim() === '' || relScope.trim() === '') return
    const internal = relType === 'internal clinical'
    setRequests((all) => [
      {
        id: `rel${all.length + 1}`,
        patientId: relPatientId,
        requester: relRequester.trim(),
        requesterType: relType,
        authority:
          internal ? 'Treating clinician — access logged' : relType === 'payer' ? 'Payer agreement + patient disclosure consent' : 'Authority evidence required before approval',
        purpose: relPurpose.trim() || '—',
        scope: relScope.trim(),
        method: internal ? ('portal' as const) : ('secure email' as const),
        status: internal ? ('released' as const) : ('pending approval' as const),
        created: 'Today',
        approver: internal ? 'Auto — internal clinical policy' : undefined,
      },
      ...all,
    ])
    success(
      internal ? 'Internal request released' : 'Release request created',
      internal
        ? 'Internal clinical access follows policy — released immediately, access logged and auditable.'
        : 'Queued for approval — minimum-necessary scope and authority verification apply.',
    )
    setNewRelOpen(false)
  }

  const logIntake = () => {
    const p = himPatientById(intakePatientId)
    if (!p) return
    setDsrRows((all) => [
      {
        id: `dsr${all.length + 1}`,
        patientId: p.id,
        type: intakeType,
        requester: `${patientDisplayName(p)} (self)`,
        received: 'Today',
        due: '21 Jul 2026',
        status: 'received',
        assignee: 'Unassigned',
      },
      ...all,
    ])
    success(
      'Request logged',
      'Identity verification comes first; the request is tracked from receipt to closure against its statutory due date.',
    )
    setIntakeOpen(false)
  }

  const tabs: TabItem<ReleasesTab>[] = [
    { value: 'releases', label: 'Release requests', count: requests.length },
    { value: 'data-rights', label: 'Data-subject requests', count: dsrRows.length },
  ]

  const open = requests.find((r) => r.id === openId)
  const openPatient = open ? himPatientById(open.patientId) : undefined

  const decide = (id: string, status: 'approved' | 'rejected') => {
    setRequests((all) => all.map((r) => (r.id === id ? { ...r, status, approver: 'HIM Supervisor — U. Musa' } : r)))
    if (status === 'approved') {
      success('Release approved', 'Package preparation applies minimum-necessary scope and any redactions before release.')
    } else {
      info('Release rejected', 'The requester is notified with the reason; the decision is audited.')
    }
    setOpenId(null)
  }

  const columns: Column<ReleaseRequest>[] = [
    {
      key: 'requester',
      header: 'Requester',
      cell: (r) => (
        <span className="block max-w-[12rem]">
          <span className="block truncate font-medium text-forest" title={r.requester}>{r.requester}</span>
          <span className="block truncate text-xs capitalize text-forest-400">{r.requesterType}</span>
        </span>
      ),
    },
    {
      key: 'patient',
      header: 'Patient',
      cell: (r) => {
        const p = himPatientById(r.patientId)
        return p ? (
          <span className="block max-w-[11rem]">
            <span className="block truncate text-[13px]" title={patientDisplayName(p)}>{patientDisplayName(p)}</span>
            <span className="tnum block font-mono text-xs text-forest-400">{p.mrn}</span>
          </span>
        ) : (
          '—'
        )
      },
    },
    {
      key: 'purpose',
      header: 'Purpose',
      cell: (r) => <span className="block max-w-[13rem] truncate" title={r.purpose}>{r.purpose}</span>,
    },
    {
      key: 'scope',
      header: 'Scope',
      cell: (r) => <span className="block max-w-[12rem] truncate" title={r.scope}>{r.scope}</span>,
    },
    {
      key: 'created',
      header: 'Created',
      cell: (r) => <span className="tnum">{r.created}</span>,
    },
    { key: 'status', header: 'Status', cell: (r) => <ReleaseStatusPill status={r.status} /> },
  ]

  return (
    <>
      <HimPageHeader
        title="Releases & data rights"
        subtitle="Record release register and NDPA data-subject requests — scoped, authorised, audited"
        actions={
          tab === 'releases' && can.requestRelease ? (
            <Button
              size="sm"
              leftIcon={<FilePlus2 size={14} />}
              onClick={() => {
                setRelType('internal clinical')
                setRelPatientId('')
                setRelRequester('')
                setRelPurpose('')
                setRelScope('')
                setNewRelOpen(true)
              }}
            >
              New release request
            </Button>
          ) : tab === 'data-rights' && can.logDsar ? (
            <Button
              size="sm"
              leftIcon={<FilePlus2 size={14} />}
              onClick={() => {
                setIntakeType('data-subject access')
                setIntakePatientId('')
                setIntakeOpen(true)
              }}
            >
              Log request
            </Button>
          ) : undefined
        }
      />

      <div className="border-b border-hair">
        <Tabs items={tabs} value={tab} onChange={setTab} />
      </div>

      {tab === 'releases' ? (
        <Card pad={false}>
          <div className="px-2 py-2">
            <DataTable columns={columns} rows={requests} rowKey={(r) => r.id} onRowClick={(r) => setOpenId(r.id)} />
          </div>
        </Card>
      ) : (
        <Card pad={false}>
          <div className="px-2 py-2">
            <DataTable columns={dsrColumns} rows={dsrRows} rowKey={(r) => r.id} />
          </div>
          <p className="border-t border-hair px-5 py-3 text-xs text-forest-400">
            Access, rectification, restriction and portability requests are tracked from receipt to
            closure with statutory due dates. Identity is verified before any response; every decision
            and export is audited.
          </p>
        </Card>
      )}

      <Drawer
        open={open !== undefined}
        onClose={() => setOpenId(null)}
        title={open ? `Release request — ${open.requester}` : undefined}
        subtitle={openPatient ? `${patientDisplayName(openPatient)} · ${openPatient.mrn}` : undefined}
        footer={
          can.approveRelease && (open?.status === 'pending approval' || open?.status === 'created') ? (
            <>
              <Button variant="secondary" leftIcon={<X size={14} />} onClick={() => decide(open.id, 'rejected')}>
                Reject
              </Button>
              <Button leftIcon={<Check size={14} />} onClick={() => decide(open.id, 'approved')}>
                Approve release
              </Button>
            </>
          ) : undefined
        }
      >
        {open && (
          <div className="space-y-4">
            {open.status === 'pended' && (
              <Alert tone="warning" title="Pended — authority not yet verified">
                A court order is claimed but unverified. No third-party release happens without
                authority evidence on file.
              </Alert>
            )}
            <KeyValue label="Requester type" value={<span className="capitalize">{open.requesterType}</span>} />
            <KeyValue label="Authority" value={open.authority} />
            <KeyValue label="Purpose" value={open.purpose} />
            <KeyValue label="Requested scope" value={open.scope} />
            <KeyValue label="Release method" value={<span className="capitalize">{open.method}</span>} />
            {open.feeStatus && (
              <KeyValue
                label="Fee"
                value={
                  <Badge tone={open.feeStatus === 'paid' ? 'success' : 'warning'} dot>
                    {open.feeStatus}
                  </Badge>
                }
              />
            )}
            {open.approver && <KeyValue label="Approved by" value={open.approver} />}
            <p className="rounded-2xl bg-panel px-4 py-3 text-xs leading-relaxed text-forest-400">
              Packages are assembled minimum-necessary: only the scoped documents and date range,
              with redaction applied where required. The disclosure — requester, scope, approver,
              method and date — is written to the release register and audit log.
            </p>
          </div>
        )}
      </Drawer>

      {/* New release request (W-HIM-028/029/030/031). */}
      <Drawer
        open={newRelOpen}
        onClose={() => setNewRelOpen(false)}
        title="New release request"
        subtitle="Internal clinical requests release under policy; external ones queue for approval"
        footer={
          <>
            <Button variant="secondary" onClick={() => setNewRelOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!relPatientId || relRequester.trim() === '' || relScope.trim() === ''}
              onClick={createRelease}
            >
              Create request
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <Field label="Requester type" required>
            <SelectMenu
              value={relType}
              onChange={setRelType}
              options={[
                { value: 'internal clinical' as const, label: 'Internal clinical' },
                { value: 'payer' as const, label: 'Payer / HMO claims' },
                { value: 'patient' as const, label: 'Patient (self)' },
                { value: 'guardian' as const, label: 'Guardian / third party' },
                { value: 'legal' as const, label: 'Legal' },
                { value: 'external provider' as const, label: 'External provider' },
              ]}
            />
          </Field>
          <Field label="Patient" required>
            <SelectMenu
              value={relPatientId}
              onChange={setRelPatientId}
              placeholder="Select patient…"
              options={HIM_PATIENTS.filter((p) => p.recordStatus !== 'merged').map((p) => ({
                value: p.id,
                label: patientDisplayName(p),
                hint: p.mrn,
              }))}
            />
          </Field>
          <Field label="Requester" required>
            <Input value={relRequester} onChange={(e) => setRelRequester(e.target.value)} placeholder="e.g. Dr. Sani Ahmed / Hygeia claims unit" />
          </Field>
          <Field label="Purpose" optional>
            <Input value={relPurpose} onChange={(e) => setRelPurpose(e.target.value)} placeholder="e.g. Claim adjudication HYG-9932" />
          </Field>
          <Field label="Requested scope" required hint="Minimum necessary — documents and date range only.">
            <Input value={relScope} onChange={(e) => setRelScope(e.target.value)} placeholder="e.g. Operation note + invoice, 30 Jun 2026" />
          </Field>
        </div>
      </Drawer>

      {/* DSAR intake (W-HIM-041): logged on receipt, tracked to closure. */}
      <Drawer
        open={intakeOpen}
        onClose={() => setIntakeOpen(false)}
        title="Log a data-subject request"
        subtitle="NDPA rights — access, rectification, restriction, portability"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIntakeOpen(false)}>
              Cancel
            </Button>
            <Button disabled={intakePatientId === ''} onClick={logIntake}>
              Log request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Request type" required>
            <SelectMenu
              value={intakeType}
              onChange={setIntakeType}
              options={[
                { value: 'data-subject access' as const, label: 'Data-subject access' },
                { value: 'rectification' as const, label: 'Rectification' },
                { value: 'restriction' as const, label: 'Restriction' },
                { value: 'portability' as const, label: 'Portability' },
              ]}
            />
          </Field>
          <Field label="Patient" required hint="Identity is verified before any response is prepared.">
            <SelectMenu
              value={intakePatientId}
              onChange={setIntakePatientId}
              placeholder="Select patient…"
              options={HIM_PATIENTS.filter((p) => p.recordStatus !== 'merged').map((p) => ({
                value: p.id,
                label: patientDisplayName(p),
                hint: p.mrn,
              }))}
            />
          </Field>
          <Field label="Statutory due date">
            <Input value="21 Jul 2026 (14 days from receipt)" disabled />
          </Field>
        </div>
      </Drawer>
    </>
  )
}
