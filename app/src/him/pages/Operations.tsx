import { useState } from 'react'
import { Plus } from 'lucide-react'
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
  Modal,
  RadioGroup,
  SelectMenu,
  Tabs,
  Tag,
  Textarea,
  useToast,
  type Column,
} from '@/components/ui'
import { useRole } from '../rbac'
import { HimPageHeader } from '../HimShell'
import {
  CONFIG_CHANGES,
  DOWNTIME_RECORDS,
  FHIR_RUNS,
  MIGRATION_BATCHES,
  SUPPORT_SESSIONS,
  type ConfigChange,
  type DowntimeRecord,
  type FhirRun,
  type MigrationBatch,
  type SupportSession,
} from '../data'

const syncTone = { 'pending reconciliation': 'warning', bound: 'success', conflict: 'danger' } as const
const batchTone = { 'in review': 'warning', closed: 'success', binding: 'info' } as const
const cfgTone = { 'pending approval': 'warning', approved: 'info', rejected: 'danger', live: 'success' } as const
const supTone = { active: 'info', expired: 'neutral', revoked: 'danger' } as const
const fhirTone = { pass: 'success', 'pass with warnings': 'warning', fail: 'danger' } as const

function downtimeColumns(
  onResolve: (d: DowntimeRecord) => void,
  onReconcile: (d: DowntimeRecord) => void,
  allowed: boolean,
): Column<DowntimeRecord>[] {
  return [
  { key: 'label', header: 'Downtime record', cell: (d) => <span className="font-medium text-forest">{d.label}</span> },
  { key: 'captured', header: 'Captured', cell: (d) => <span className="tnum">{d.capturedAt}</span> },
  { key: 'desk', header: 'Desk', cell: (d) => d.desk },
  { key: 'note', header: 'Sync note', cell: (d) => d.note },
  {
    key: 'status',
    header: 'Sync status',
    cell: (d) => (
      <Badge tone={syncTone[d.syncStatus]} dot>
        {d.syncStatus}
      </Badge>
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    cell: (d) =>
      !allowed ? null : d.syncStatus === 'conflict' ? (
        <Button size="sm" variant="secondary" onClick={() => onResolve(d)}>
          Resolve…
        </Button>
      ) : d.syncStatus === 'pending reconciliation' ? (
        <Button size="sm" variant="ghost" onClick={() => onReconcile(d)}>
          Reconcile
        </Button>
      ) : null,
  },
  ]
}

const migrationColumns: Column<MigrationBatch>[] = [
  {
    key: 'batch',
    header: 'Batch',
    cell: (b) => (
      <span>
        <span className="tnum block font-mono text-[13px] font-medium text-forest">{b.id}</span>
        <span className="block text-xs text-forest-400">{b.source}</span>
      </span>
    ),
  },
  { key: 'imported', header: 'Imported', align: 'right', cell: (b) => <span className="tnum">{b.imported.toLocaleString()}</span> },
  { key: 'bound', header: 'Bound', align: 'right', cell: (b) => <span className="tnum">{b.bound.toLocaleString()}</span> },
  { key: 'exceptions', header: 'Exceptions', align: 'right', cell: (b) => <span className="tnum">{b.exceptions}</span> },
  { key: 'duplicates', header: 'Duplicates', align: 'right', cell: (b) => <span className="tnum">{b.duplicates}</span> },
  {
    key: 'status',
    header: 'Status',
    cell: (b) => (
      <span>
        <Badge tone={batchTone[b.status]} dot>
          {b.status}
        </Badge>
        {b.signOff && <span className="mt-1 block text-xs text-forest-400">{b.signOff}</span>}
      </span>
    ),
  },
]

function migrationColumnsWithActions(onSignOff: (id: string) => void, allowed: boolean): Column<MigrationBatch>[] {
  return [
    ...migrationColumns,
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (b) =>
        allowed && b.status === 'in review' ? (
          <Button size="sm" variant="secondary" onClick={() => onSignOff(b.id)}>
            Sign off batch
          </Button>
        ) : null,
    },
  ]
}

const configColumns: Column<ConfigChange>[] = [
  {
    key: 'item',
    header: 'Configuration item',
    cell: (c) => (
      <span>
        <span className="block font-medium text-forest">{c.item}</span>
        <span className="block text-xs text-forest-400">{c.requester}</span>
      </span>
    ),
  },
  { key: 'change', header: 'Change', cell: (c) => c.change },
  { key: 'note', header: 'Governance note', cell: (c) => c.note },
  {
    key: 'status',
    header: 'Status',
    cell: (c) => (
      <Badge tone={cfgTone[c.status]} dot>
        {c.status}
      </Badge>
    ),
  },
]

const supportColumns: Column<SupportSession>[] = [
  { key: 'ticket', header: 'Ticket', cell: (s) => <span className="tnum font-mono text-[13px]">{s.ticket}</span> },
  { key: 'engineer', header: 'Engineer', cell: (s) => s.engineer },
  { key: 'scope', header: 'Scope (least privilege)', cell: (s) => s.scope },
  { key: 'window', header: 'Window', cell: (s) => <span className="tnum">{s.window}</span> },
  {
    key: 'masked',
    header: 'Masking',
    cell: (s) => <Tag>{s.masked ? 'Identifiers masked' : 'Unmasked'}</Tag>,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (s) => (
      <Badge tone={supTone[s.status]} dot>
        {s.status}
      </Badge>
    ),
  },
]

const fhirColumns: Column<FhirRun>[] = [
  {
    key: 'resource',
    header: 'Resource · profile',
    cell: (f) => (
      <span>
        <span className="block font-medium text-forest">{f.resource}</span>
        <span className="block text-xs text-forest-400">{f.profile}</span>
      </span>
    ),
  },
  { key: 'payloads', header: 'Payloads', align: 'right', cell: (f) => <span className="tnum">{f.payloads}</span> },
  { key: 'note', header: 'Validator output', cell: (f) => f.note },
  { key: 'ran', header: 'Ran', cell: (f) => <span className="tnum">{f.ran}</span> },
  {
    key: 'result',
    header: 'Result',
    cell: (f) => (
      <Badge tone={fhirTone[f.result]} dot>
        {f.result}
      </Badge>
    ),
  },
]

type OpsTab = 'downtime' | 'migration' | 'config' | 'support' | 'fhir'

/**
 * Resilience & governance operations as one tabbed worklist: downtime sync
 * (W-HIM-037/038), legacy migration (039), configuration change control
 * (044), controlled support access (043) and FHIR/DHIN validation (045).
 * One full-width table per tab — pagination and long content keep room.
 */
export function OperationsPage() {
  const [tab, setTab] = useState<OpsTab>('downtime')
  const { success } = useToast()
  const { can } = useRole()
  const [configRows, setConfigRows] = useState(CONFIG_CHANGES)
  const [cfgOpen, setCfgOpen] = useState(false)
  const [cfgItem, setCfgItem] = useState('MRN pattern')
  const [cfgChange, setCfgChange] = useState('')
  const [fhirDetail, setFhirDetail] = useState<FhirRun | null>(null)
  const [downtime, setDowntime] = useState(DOWNTIME_RECORDS)
  const [dtOpen, setDtOpen] = useState(false)
  const [dtLabel, setDtLabel] = useState('')
  const [dtDesk, setDtDesk] = useState('Front desk 1')
  const [resolveFor, setResolveFor] = useState<DowntimeRecord | null>(null)
  const [resolveChoice, setResolveChoice] = useState('existing')
  const [batches, setBatches] = useState(MIGRATION_BATCHES)
  const [supportRows, setSupportRows] = useState(SUPPORT_SESSIONS)
  const [supOpen, setSupOpen] = useState(false)
  const [supTicket, setSupTicket] = useState('')
  const [supScope, setSupScope] = useState('')

  const opsAllowed = can.manageConfig || can.unmerge

  const addDowntime = () => {
    if (dtLabel.trim() === '') return
    setDowntime((all) => [
      { id: `dt${all.length + 1}`, label: dtLabel.trim(), capturedAt: 'Today', desk: dtDesk, syncStatus: 'pending reconciliation' as const, note: 'Captured during downtime — awaiting duplicate check against MPI.' },
      ...all,
    ])
    success('Downtime entry captured', 'Held on the downtime register until sync reconciles it into a trusted record.')
    setDtOpen(false)
  }

  const reconcile = (d: DowntimeRecord) => {
    setDowntime((all) => all.map((x) => (x.id === d.id ? { ...x, syncStatus: 'bound' as const, note: 'Duplicate check passed — bound to a trusted record.' } : x)))
    success('Reconciled', 'Duplicate check passed; the downtime record is bound. Batch closes when every record is bound.')
  }

  const resolveConflict = () => {
    if (!resolveFor) return
    setDowntime((all) =>
      all.map((x) =>
        x.id === resolveFor.id
          ? { ...x, syncStatus: 'bound' as const, note: resolveChoice === 'existing' ? 'Conflict resolved — existing value kept; downtime value archived.' : 'Conflict resolved — downtime value accepted; old value preserved.' }
          : x,
      ),
    )
    success('Conflict resolved', 'Both values are preserved in history — no silent data loss. Resolution audited.')
    setResolveFor(null)
  }

  const signOffBatch = (id: string) => {
    setBatches((all) => all.map((b) => (b.id === id ? { ...b, status: 'closed' as const, signOff: 'HIM Supervisor — U. Musa · Today' } : b)))
    success('Batch signed off', 'Exceptions and duplicates documented; import is traceable to source and rollback window closes.')
  }

  const requestSupport = () => {
    if (supTicket.trim() === '' || supScope.trim() === '') return
    setSupportRows((all) => [
      { id: `sup${all.length + 1}`, ticket: supTicket.trim(), engineer: 'On-call — REDNOXX', scope: supScope.trim(), window: 'Today · next 60 min', status: 'active' as const, masked: true },
      ...all,
    ])
    success('Support session approved', 'Time-bound, least-privilege and masked; auto-expires and every action lands in the session log.')
    setSupOpen(false)
  }

  const requestChange = () => {
    if (cfgChange.trim() === '') return
    setConfigRows((all) => [
      {
        id: `cfg${all.length + 1}`,
        item: cfgItem,
        change: cfgChange.trim(),
        requester: 'Facility Admin — D. Okon',
        status: 'pending approval' as const,
        note: 'Versioned; requires test evidence and governance approval before activation. Rollback plan attached.',
      },
      ...all,
    ])
    success('Change request logged', 'Safety-critical controls cannot be loosened without product and clinical governance review.')
    setCfgOpen(false)
  }

  return (
    <>
      <HimPageHeader
        title="Operations & sync"
        subtitle="Downtime reconciliation, migration, configuration governance, support access and interoperability"
        actions={
          tab === 'downtime' && opsAllowed ? (
            <Button
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => {
                setDtLabel('')
                setDtDesk('Front desk 1')
                setDtOpen(true)
              }}
            >
              Add downtime entry
            </Button>
          ) : tab === 'config' && can.manageConfig ? (
            <Button
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => {
                setCfgItem('MRN pattern')
                setCfgChange('')
                setCfgOpen(true)
              }}
            >
              Request change
            </Button>
          ) : tab === 'support' && can.manageConfig ? (
            <Button
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => {
                setSupTicket('')
                setSupScope('')
                setSupOpen(true)
              }}
            >
              Approve session
            </Button>
          ) : undefined
        }
      />

      <div className="border-b border-hair">
        <Tabs
          items={[
            { value: 'downtime', label: 'Downtime & sync', count: downtime.length },
            { value: 'migration', label: 'Migration', count: batches.length },
            { value: 'config', label: 'Configuration', count: configRows.length },
            { value: 'support', label: 'Support access', count: supportRows.length },
            { value: 'fhir', label: 'FHIR validation', count: FHIR_RUNS.length },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {tab === 'downtime' && (
        <>
          <Alert tone="info" title="Working online">
            During downtime, essential registration continues on the paper fallback and the downtime
            register; every downtime record must reconcile — a batch closure report closes the
            incident (W-HIM-037/038).
          </Alert>
          <Card pad={false}>
            <div className="px-2 py-2">
              <DataTable
                columns={downtimeColumns(
                  (d) => {
                    setResolveChoice('existing')
                    setResolveFor(d)
                  },
                  reconcile,
                  opsAllowed,
                )}
                rows={downtime}
                rowKey={(d) => d.id}
              />
            </div>
          </Card>
        </>
      )}

      {tab === 'migration' && (
        <Card pad={false}>
          <div className="px-2 py-2">
            <DataTable columns={migrationColumnsWithActions(signOffBatch, opsAllowed)} rows={batches} rowKey={(b) => b.id} />
          </div>
          <p className="border-t border-hair px-5 py-3 text-xs text-forest-400">
            Legacy MRNs are preserved as identifiers; rows failing critical validation are rejected,
            possible duplicates queue for binding review, and rollback stays available until sign-off
            (W-HIM-039).
          </p>
        </Card>
      )}

      {tab === 'config' && (
        <Card pad={false}>
          <div className="px-2 py-2">
            <DataTable columns={configColumns} rows={configRows} rowKey={(c) => c.id} />
          </div>
          <p className="border-t border-hair px-5 py-3 text-xs text-forest-400">
            Versioned, tested, approved — a change that would disable a safety-critical control is
            rejected; MRN pattern changes never retroactively alter existing MRNs (W-HIM-044).
          </p>
        </Card>
      )}

      {tab === 'support' && (
        <Card pad={false}>
          <div className="px-2 py-2">
            <DataTable columns={supportColumns} rows={supportRows} rowKey={(s) => s.id} />
          </div>
          <p className="border-t border-hair px-5 py-3 text-xs text-forest-400">
            Support cannot access patient data by default; sessions are least-privilege, time-bound,
            masked and auto-expire — every action lands in the session log (W-HIM-043).
          </p>
        </Card>
      )}

      {tab === 'fhir' && (
        <Card pad={false}>
          <div className="px-2 py-2">
            <DataTable columns={fhirColumns} rows={FHIR_RUNS} rowKey={(f) => f.id} onRowClick={(f) => setFhirDetail(f)} />
          </div>
          <p className="border-t border-hair px-5 py-3 text-xs text-forest-400">
            Nigeria Core & DHIN conformance: validation runs before any commit or export; a mapping
            gap is logged and conformance is never claimed over it (W-HIM-045).
          </p>
        </Card>
      )}

      {/* Downtime capture (W-HIM-037). */}
      <Drawer
        open={dtOpen}
        onClose={() => setDtOpen(false)}
        title="Add downtime entry"
        subtitle="Paper-fallback registration captured while systems are degraded"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDtOpen(false)}>
              Cancel
            </Button>
            <Button disabled={dtLabel.trim() === ''} onClick={addDowntime}>
              Capture entry
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <Field label="Patient / paper form" required>
            <Input value={dtLabel} onChange={(e) => setDtLabel(e.target.value)} placeholder="e.g. Ngozi Eze (paper form 0045)" />
          </Field>
          <Field label="Desk" required>
            <SelectMenu
              value={dtDesk}
              onChange={setDtDesk}
              options={['Front desk 1', 'Front desk 2', 'A&E registration', 'Maternity desk'].map((v) => ({ value: v, label: v }))}
            />
          </Field>
        </div>
      </Drawer>

      {/* Sync conflict resolution (W-HIM-038): no silent data loss. */}
      <Modal
        open={resolveFor !== null}
        onClose={() => setResolveFor(null)}
        title="Resolve sync conflict"
        subtitle={resolveFor?.label}
        footer={
          <>
            <Button variant="secondary" onClick={() => setResolveFor(null)}>
              Cancel
            </Button>
            <Button onClick={resolveConflict}>Resolve conflict</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-forest-500">
            {resolveFor?.note} Choose which value wins — the losing value is preserved in history,
            never discarded.
          </p>
          <RadioGroup
            label="Resolution"
            value={resolveChoice}
            onChange={setResolveChoice}
            options={[
              { value: 'existing', label: 'Keep existing record value', description: 'Downtime value archived on the record history.' },
              { value: 'downtime', label: 'Accept downtime value', description: 'Existing value preserved as the previous value.' },
            ]}
          />
        </div>
      </Modal>

      {/* Support session approval (W-HIM-043). */}
      <Drawer
        open={supOpen}
        onClose={() => setSupOpen(false)}
        title="Approve support session"
        subtitle="Least privilege, time-bound, masked — support cannot access patient data by default"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSupOpen(false)}>
              Cancel
            </Button>
            <Button disabled={supTicket.trim() === '' || supScope.trim() === ''} onClick={requestSupport}>
              Approve for 60 minutes
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <Field label="Ticket" required>
            <Input value={supTicket} onChange={(e) => setSupTicket(e.target.value)} placeholder="RDX-…" />
          </Field>
          <Field label="Scope" required hint="Named systems only; identifiers stay masked.">
            <Input value={supScope} onChange={(e) => setSupScope(e.target.value)} placeholder="e.g. Document indexing queue — metadata only" />
          </Field>
        </div>
      </Drawer>

      {/* Config change request (W-HIM-044). */}
      <Drawer
        open={cfgOpen}
        onClose={() => setCfgOpen(false)}
        title="Request configuration change"
        subtitle="Goes to product & clinical governance with test evidence before activation"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCfgOpen(false)}>
              Cancel
            </Button>
            <Button disabled={cfgChange.trim() === ''} onClick={requestChange}>
              Log change request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Configuration item" required>
            <SelectMenu
              value={cfgItem}
              onChange={setCfgItem}
              options={['MRN pattern', 'Duplicate threshold', 'Registration form', 'Document types', 'Patient categories / payers', 'Release templates', 'Roles & permissions'].map(
                (v) => ({ value: v, label: v }),
              )}
            />
          </Field>
          <Field label="Requested change" required hint="If a change would disable a safety-critical control it is rejected.">
            <Textarea rows={2} value={cfgChange} onChange={(e) => setCfgChange(e.target.value)} placeholder="e.g. Add check digit to new MRNs…" />
          </Field>
        </div>
      </Drawer>

      {/* FHIR run detail (W-HIM-045). */}
      <Drawer
        open={fhirDetail !== null}
        onClose={() => setFhirDetail(null)}
        title={fhirDetail ? `${fhirDetail.resource} — validation detail` : undefined}
        subtitle={fhirDetail?.profile}
      >
        {fhirDetail && (
          <div className="space-y-3">
            <KeyValue label="Payloads validated" value={<span className="tnum">{fhirDetail.payloads}</span>} />
            <KeyValue
              label="Result"
              value={
                <Badge tone={fhirTone[fhirDetail.result]} dot>
                  {fhirDetail.result}
                </Badge>
              }
            />
            <KeyValue label="Validator output" value={fhirDetail.note} />
            <KeyValue label="Ran" value={<span className="tnum">{fhirDetail.ran}</span>} />
            <p className="rounded-2xl bg-panel px-4 py-3 text-xs leading-relaxed text-forest-400">
              Validation runs before any commit or export. A mapping gap is logged and conformance is
              never claimed over it; failed payloads open remediation tasks and export is denied for
              requestors without sufficient scope.
            </p>
          </div>
        )}
      </Drawer>
    </>
  )
}
