import { ArrowRight, GitMerge, ShieldAlert, Stethoscope } from 'lucide-react'
import { useNavigate, type NavigateOptions } from '@tanstack/react-router'
import { Alert, Badge, Button, Card, CardHeader, StatCard, Tag } from '@/components/ui'
import { HimPageHeader } from '../HimShell'
import { useRole } from '../rbac'
import {
  AUDIT_EVENTS,
  CONFIG_CHANGES,
  DATA_RIGHTS_REQUESTS,
  DOWNTIME_RECORDS,
  DUPLICATE_CANDIDATES,
  FHIR_RUNS,
  HIM_APPOINTMENTS,
  HIM_DOCUMENTS,
  HIM_KPIS,
  HIM_PATIENTS,
  himPatientById,
  MIGRATION_BATCHES,
  patientDisplayName,
  RECONCILIATION_WORKLIST,
  REGISTRATIONS_TODAY,
  RELEASE_REQUESTS,
  SUPPORT_SESSIONS,
} from '../data'
import { ReleaseStatusPill } from '../shared'

const dsrTone = { received: 'neutral', 'in progress': 'info', completed: 'success', overdue: 'danger' } as const

/** "View all" escape hatch used by every list card. */
function GoTo({ label, to }: { label: string; to: string }) {
  const navigate = useNavigate()
  return (
    <Button
      size="sm"
      variant="ghost"
      rightIcon={<ArrowRight size={14} />}
      onClick={() => navigate({ to: to as NavigateOptions['to'] })}
    >
      {label}
    </Button>
  )
}

function ListRow({ title, meta, right }: { title: string; meta: string; right?: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-panel/50">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-forest">{title}</span>
        <span className="tnum block truncate text-xs text-forest-400">{meta}</span>
      </span>
      {right}
    </li>
  )
}

/* ---- HIM Officer: registration quality & records throughput ---------------- */

function OfficerOverview() {
  const navigate = useNavigate()
  const incomplete = HIM_PATIENTS.filter((p) => p.completeness < 100 && p.recordStatus !== 'merged').sort(
    (a, b) => a.completeness - b.completeness,
  )
  const pendingDocs = HIM_DOCUMENTS.filter((d) => d.status === 'pending index' || d.status === 'unbound legacy')

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HIM_KPIS.map((kpi) => (
          <StatCard key={kpi.key} label={kpi.label} value={kpi.value} delta={kpi.delta} deltaTone={kpi.deltaTone} sub={kpi.sub} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Reconciliation worklist"
            subtitle="Temporary and emergency identities awaiting resolution"
            action={<GoTo label="Patient index" to="/him-demo/patients" />}
          />
          <ul className="mt-4 space-y-1">
            {RECONCILIATION_WORKLIST.map((row) => (
              <ListRow
                key={row.id}
                title={row.label}
                meta={`${row.tempId} · unresolved ${row.age} · ${row.assignee}`}
                right={<Tag>{row.triage}</Tag>}
              />
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Documents needing work"
            subtitle="Pending index and unbound legacy scans"
            action={<GoTo label="Documents" to="/him-demo/documents" />}
          />
          <ul className="mt-4 space-y-1">
            {pendingDocs.map((d) => (
              <ListRow key={d.id} title={d.type} meta={`${d.patientLabel} · ${d.source}`} right={<Tag>{d.status}</Tag>} />
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Registration volume"
            subtitle={`${REGISTRATIONS_TODAY.reduce((s, d) => s + d.count, 0)} today across ${REGISTRATIONS_TODAY.length} desks`}
          />
          <ul className="mt-4 space-y-1">
            {REGISTRATIONS_TODAY.map((desk) => (
              <li key={desk.desk} className="flex items-center gap-3 rounded-2xl px-2 py-1.5">
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-forest">{desk.desk}</span>
                  <span className="block truncate text-xs text-forest-400">
                    {desk.officer} · {desk.categories}
                  </span>
                </span>
                <span className="tnum text-sm font-medium text-forest">{desk.count}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Incomplete records"
            subtitle="Completion worklist — worst first (W-HIM-018)"
            action={<GoTo label="Worklist" to="/him-demo/incomplete" />}
          />
          <ul className="mt-4 space-y-1">
            {incomplete.slice(0, 5).map((p) => (
              <li
                key={p.id}
                className="flex cursor-pointer items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-panel/50"
                onClick={() => navigate({ to: '/him-demo/patients/$id', params: { id: p.id } })}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-forest">{patientDisplayName(p)}</span>
                  <span className="block truncate text-xs text-forest-400">
                    Missing: {p.missingFields?.slice(0, 2).join(', ')}
                    {(p.missingFields?.length ?? 0) > 2 ? '…' : ''}
                  </span>
                </span>
                <span className="tnum text-xs text-forest-400">{p.completeness}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}

/* ---- HIM Supervisor: approvals & integrity actions -------------------------- */

function SupervisorOverview() {
  const pendingDups = DUPLICATE_CANDIDATES.filter((c) => c.status === 'pending review')
  const pendingReleases = RELEASE_REQUESTS.filter((r) => r.status === 'pending approval' || r.status === 'pended')
  const breakGlass = AUDIT_EVENTS.filter((e) => e.breakGlass)

  return (
    <>
      <Alert
        tone="warning"
        title={`${breakGlass.length} break-glass access awaiting review`}
      >
        Restricted-record access under emergency justification must be reviewed. It is recorded in
        the audit log.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Duplicates pending review" value={pendingDups.length} sub={`highest score ${Math.max(...DUPLICATE_CANDIDATES.map((c) => c.matchScore)).toFixed(2)}`} />
        <StatCard label="Releases awaiting approval" value={pendingReleases.length} sub="incl. 1 pended for authority" />
        <StatCard label="Break-glass under review" value={breakGlass.length} sub="time-bound access active" />
        <StatCard label="Unresolved temp identities" value={RECONCILIATION_WORKLIST.length} sub="oldest 4h 12m" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Duplicates needing your decision"
            subtitle="Merging is supervisor-only — officers queue requests here"
            action={<GoTo label="Duplicates & merge" to="/him-demo/duplicates" />}
          />
          <ul className="mt-4 space-y-1">
            {pendingDups.map((c) => {
              const a = himPatientById(c.recordAId)
              const b = himPatientById(c.recordBId)
              return (
                <ListRow
                  key={c.id}
                  title={`${a ? patientDisplayName(a) : c.recordAId} ↔ ${b ? patientDisplayName(b) : c.recordBId}`}
                  meta={`score ${c.matchScore.toFixed(2)} · ${c.matchingFields.join(', ')}`}
                  right={<GitMerge size={15} className="shrink-0 text-forest-300" />}
                />
              )
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Releases awaiting approval"
            subtitle="Minimum-necessary scope; authority verified first"
            action={<GoTo label="Releases" to="/him-demo/releases" />}
          />
          <ul className="mt-4 space-y-1">
            {pendingReleases.map((r) => {
              const p = himPatientById(r.patientId)
              return (
                <ListRow
                  key={r.id}
                  title={r.requester}
                  meta={`${p ? patientDisplayName(p) : ''} · ${r.scope}`}
                  right={<ReleaseStatusPill status={r.status} />}
                />
              )
            })}
          </ul>
        </Card>
      </div>
    </>
  )
}

/* ---- DPO / Auditor: privacy events & statutory clocks ------------------------ */

function DpoOverview() {
  const breakGlass = AUDIT_EVENTS.filter((e) => e.breakGlass)
  const openDsr = DATA_RIGHTS_REQUESTS.filter((r) => r.status !== 'completed')
  const overdue = openDsr.filter((r) => r.status === 'overdue')
  const pended = RELEASE_REQUESTS.filter((r) => r.status === 'pended' || r.status === 'pending approval')
  const restricted = HIM_PATIENTS.filter((p) => p.recordStatus === 'restricted')

  return (
    <>
      {overdue.length > 0 && (
        <Alert tone="danger" title={`${overdue.length} data-subject request overdue`}>
          Statutory response clocks apply — overdue requests are a reportable compliance risk.
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Break-glass to review" value={breakGlass.length} sub="denied attempts also logged" />
        <StatCard label="Data-subject requests open" value={openDsr.length} delta={overdue.length > 0 ? `${overdue.length} overdue` : undefined} deltaTone="down" sub="tracked receipt → closure" />
        <StatCard label="Disclosures awaiting decision" value={pended.length} sub="authority checks in progress" />
        <StatCard label="Restricted records" value={restricted.length} sub="all access audited" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Break-glass & restricted access"
            subtitle="High-priority audit events"
            action={<GoTo label="Audit log" to="/him-demo/audit" />}
          />
          <ul className="mt-4 space-y-1">
            {breakGlass.map((event) => (
              <li key={event.id} className="flex items-start gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-panel/50">
                <ShieldAlert size={15} className="mt-0.5 shrink-0 text-rose-ink" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-forest">
                    {event.actor} · {event.patientLabel}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs text-forest-400">{event.detail}</span>
                  <span className="tnum mt-1 block text-[11px] text-forest-300">{event.time}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Data-subject requests"
            subtitle="NDPA rights — due dates first"
            action={<GoTo label="All requests" to="/him-demo/releases" />}
          />
          <ul className="mt-4 space-y-1">
            {openDsr.map((r) => (
              <ListRow
                key={r.id}
                title={r.type}
                meta={`${r.requester} · due ${r.due} · ${r.assignee}`}
                right={
                  <Badge tone={dsrTone[r.status]} dot>
                    {r.status}
                  </Badge>
                }
              />
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}

/* ---- Facility Admin: platform governance health ------------------------------ */

function AdminOverview() {
  const pendingConfig = CONFIG_CHANGES.filter((c) => c.status === 'pending approval')
  const activeSupport = SUPPORT_SESSIONS.filter((s) => s.status === 'active')
  const migrationExceptions = MIGRATION_BATCHES.reduce((s, b) => s + b.exceptions, 0)
  const fhirFailures = FHIR_RUNS.filter((f) => f.result === 'fail')
  const conflicts = DOWNTIME_RECORDS.filter((d) => d.syncStatus === 'conflict')

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Config changes pending" value={pendingConfig.length} sub="governance approval required" />
        <StatCard label="Support sessions active" value={activeSupport.length} sub="time-bound · masked" />
        <StatCard label="Migration exceptions" value={migrationExceptions} sub="across open batches" />
        <StatCard label="FHIR validation failures" value={fhirFailures.length} sub="mapping gaps logged" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Governance queue"
            subtitle="Configuration changes and sync conflicts"
            action={<GoTo label="Operations & sync" to="/him-demo/operations" />}
          />
          <ul className="mt-4 space-y-1">
            {pendingConfig.map((c) => (
              <ListRow key={c.id} title={c.item} meta={c.change} right={<Tag>pending approval</Tag>} />
            ))}
            {conflicts.map((d) => (
              <ListRow key={d.id} title={d.label} meta={d.note} right={<Tag>sync conflict</Tag>} />
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Interoperability"
            subtitle="Latest FHIR / DHIN validation runs"
            action={<GoTo label="FHIR validation" to="/him-demo/operations" />}
          />
          <ul className="mt-4 space-y-1">
            {FHIR_RUNS.map((f) => (
              <ListRow
                key={f.id}
                title={`${f.resource} · ${f.profile}`}
                meta={`${f.payloads} payloads · ${f.ran}`}
                right={
                  <Badge tone={f.result === 'pass' ? 'success' : f.result === 'fail' ? 'danger' : 'warning'} dot>
                    {f.result}
                  </Badge>
                }
              />
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}

/* ---- Front Desk Officer: today at the desk ----------------------------------- */

function FrontDeskOverview() {
  const upcoming = HIM_APPOINTMENTS.filter((a) => a.status === 'scheduled' || a.status === 'late')
  const myDesk = REGISTRATIONS_TODAY[0]

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Appointments to check in" value={upcoming.length} sub={`${HIM_APPOINTMENTS.filter((a) => a.status === 'late').length} running late`} />
        <StatCard label="Registered at your desk" value={myDesk.count} sub={myDesk.categories} />
        <StatCard label="Walk-ins today" value="7" sub="registered & routed in one step" />
        <StatCard label="Duplicate warnings raised" value="2" sub="1 overridden with reason" />
      </div>

      <Card>
        <CardHeader
          title="Next check-ins"
          subtitle="Verify two identifiers before every check-in"
          action={<GoTo label="Appointments" to="/him-demo/appointments" />}
        />
        <ul className="mt-4 space-y-1">
          {upcoming.map((a) => {
            const p = himPatientById(a.patientId)
            return (
              <ListRow
                key={a.id}
                title={`${a.time} · ${p ? patientDisplayName(p) : ''}`}
                meta={`${a.clinic} · ${a.serviceType}`}
                right={<Stethoscope size={15} className="shrink-0 text-forest-300" />}
              />
            )
          })}
        </ul>
      </Card>
    </>
  )
}

/** Role-scoped overview — each persona gets its own dashboard (RBAC IA). */
export function HimOverviewPage() {
  const { persona } = useRole()
  const firstName = persona.name.split(' ')[0]

  return (
    <>
      <HimPageHeader
        title={`Good morning, ${firstName}`}
        subtitle={`${persona.title} · ${persona.department} · ${persona.facility}`}
      />
      {persona.role === 'him-supervisor' ? (
        <SupervisorOverview />
      ) : persona.role === 'dpo' || persona.role === 'auditor' ? (
        <DpoOverview />
      ) : persona.role === 'facility-admin' ? (
        <AdminOverview />
      ) : persona.role === 'front-desk' || persona.role === 'ae-registration' || persona.role === 'triage-nurse' ? (
        <FrontDeskOverview />
      ) : (
        <OfficerOverview />
      )}
    </>
  )
}
