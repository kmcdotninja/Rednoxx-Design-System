import { useMemo, useState } from 'react'
import { GitMerge } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DataTable,
  Drawer,
  EmptyState,
  Field,
  KeyValue,
  Modal,
  RadioGroup,
  Tabs,
  Textarea,
  useToast,
  type Column,
  type RadioOption,
  type TabItem,
} from '@/components/ui'
import { FilterBar } from '@/components/blocks'
import { cn } from '@/lib/cn'
import { HimPageHeader } from '../HimShell'
import { useRole } from '../rbac'
import {
  DUPLICATE_CANDIDATES,
  himPatientById,
  patientDisplayName,
  type DuplicateCandidate,
  type DuplicateDecision,
  type HimPatient,
} from '../data'
import { RecordStatusPill } from '../shared'

type QueueBucket = 'pending' | 'decided' | 'all'

const decisionTone: Record<DuplicateCandidate['status'], 'warning' | 'success' | 'neutral' | 'info'> = {
  'pending review': 'warning',
  'duplicate confirmed': 'info',
  'not duplicate': 'success',
  'insufficient information': 'neutral',
  defer: 'neutral',
}

function pairOf(c: DuplicateCandidate) {
  return { a: himPatientById(c.recordAId), b: himPatientById(c.recordBId) }
}

/** One column of the side-by-side comparison (W-HIM-020). */
function CompareColumn({
  patient,
  matched,
  title,
}: {
  patient: HimPatient
  matched: string[]
  title: string
}) {
  const rows: { field: string; value: string }[] = [
    { field: 'Family name', value: patient.familyName },
    { field: 'Given names', value: patient.givenNames },
    { field: 'DOB', value: patient.dob ?? `Estimated ${patient.estimatedAge}y` },
    { field: 'Sex', value: patient.sex },
    { field: 'Phone', value: patient.phone ?? '—' },
    { field: 'Address', value: patient.address ?? '—' },
    { field: 'Category', value: patient.category },
    { field: 'Registered', value: patient.registered },
  ]
  return (
    <div className="min-w-0 flex-1">
      <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-forest">
        {title}: {patientDisplayName(patient)}
        <RecordStatusPill status={patient.recordStatus} />
      </p>
      <p className="tnum mt-0.5 font-mono text-xs text-forest-400">{patient.mrn}</p>
      <dl className="mt-3 space-y-1.5">
        {rows.map((row) => {
          const isMatch = matched.some((m) => row.field.toLowerCase().startsWith(m.split(' ')[0].toLowerCase()))
          return (
            <div
              key={row.field}
              className={cn(
                'flex items-baseline justify-between gap-3 rounded-lg px-2 py-1 text-[13px]',
                isMatch && 'bg-orange-soft/60',
              )}
            >
              <dt className="text-forest-400">{row.field}</dt>
              <dd className={cn('text-right', isMatch ? 'font-medium text-forest' : 'text-forest-500')}>
                {row.value}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

/**
 * Duplicate review queue (W-HIM-019/020/021). Built as a worklist: status
 * buckets, search, highest scores first (they block registrations), paginated.
 * Review happens in a drawer so the queue keeps its context at any length;
 * merging remains a high-risk confirmation on top (clinical-safety §1–2).
 */
export function DuplicatesPage() {
  const { success, info } = useToast()
  const { can } = useRole()
  const [candidates, setCandidates] = useState(DUPLICATE_CANDIDATES)
  const [bucket, setBucket] = useState<QueueBucket>('pending')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [mergeFor, setMergeFor] = useState<DuplicateCandidate | null>(null)
  const [survivorId, setSurvivorId] = useState<string>('')
  const [verified, setVerified] = useState(false)
  const [reason, setReason] = useState('')
  const [unmergeFor, setUnmergeFor] = useState<DuplicateCandidate | null>(null)
  const [unmergeReason, setUnmergeReason] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return candidates
      .filter((c) => {
        const inBucket =
          bucket === 'all' ||
          (bucket === 'pending' && c.status === 'pending review') ||
          (bucket === 'decided' && c.status !== 'pending review')
        if (!inBucket) return false
        if (!q) return true
        const { a, b } = pairOf(c)
        return [a, b]
          .filter(Boolean)
          .map((p) => `${patientDisplayName(p!)} ${p!.mrn}`)
          .join(' ')
          .toLowerCase()
          .includes(q)
      })
      .sort((x, y) => y.matchScore - x.matchScore)
  }, [candidates, bucket, query])

  const pendingCount = candidates.filter((c) => c.status === 'pending review').length
  const tabs: TabItem<QueueBucket>[] = [
    { value: 'pending', label: 'Pending review', count: pendingCount },
    { value: 'decided', label: 'Decided', count: candidates.length - pendingCount },
    { value: 'all', label: 'All', count: candidates.length },
  ]

  const open = candidates.find((c) => c.id === openId)
  const openPair = open ? pairOf(open) : undefined

  const decide = (id: string, decision: DuplicateDecision) => {
    setCandidates((all) => all.map((c) => (c.id === id ? { ...c, status: decision } : c)))
    if (decision === 'duplicate confirmed') {
      if (!can.merge) {
        // HIM Officers confirm; the merge itself is supervisor-only (RBAC).
        info('Merge request created', 'Merging needs HIM Supervisor permission — the request is queued for supervisor action.')
        setOpenId(null)
        return
      }
      const c = candidates.find((x) => x.id === id)
      if (c) {
        setMergeFor(c)
        setSurvivorId('')
        setVerified(false)
        setReason('')
      }
    } else {
      info(`Decision recorded: ${decision}`, 'Reviewer, reason and evidence are written to the audit log.')
      setOpenId(null)
    }
  }

  const completeMerge = () => {
    if (!mergeFor) return
    success(
      'Merge completed',
      'Non-survivor marked as merged; encounters, documents and identifiers redirected to the survivor. Reversible via unmerge within governance rules.',
    )
    setMergeFor(null)
    setOpenId(null)
  }

  const columns: Column<DuplicateCandidate>[] = [
    {
      key: 'pair',
      header: 'Candidate pair',
      cell: (c) => {
        const { a, b } = pairOf(c)
        return (
          <span>
            <span className="block font-medium text-forest">
              {a ? patientDisplayName(a) : c.recordAId} ↔ {b ? patientDisplayName(b) : c.recordBId}
            </span>
            <span className="tnum block font-mono text-xs text-forest-400">
              {a?.mrn} · {b?.mrn}
            </span>
          </span>
        )
      },
    },
    {
      key: 'score',
      header: 'Score',
      align: 'right',
      cell: (c) => (
        <span className={cn('tnum font-medium', c.matchScore >= 0.9 ? 'text-rose-ink' : 'text-forest')}>
          {c.matchScore.toFixed(2)}
        </span>
      ),
    },
    { key: 'fields', header: 'Matching fields', cell: (c) => c.matchingFields.join(', ') },
    {
      key: 'flagged',
      header: 'Flagged',
      cell: (c) => (
        <span>
          <span className="block text-[13px]">{c.flaggedBy}</span>
          <span className="tnum block text-xs text-forest-400">{c.flagged}</span>
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Decision',
      cell: (c) => (
        <Badge tone={decisionTone[c.status]} dot>
          {c.status}
        </Badge>
      ),
    },
  ]

  const survivorOptions: RadioOption<string>[] =
    mergeFor
      ? [mergeFor.recordAId, mergeFor.recordBId].map((pid) => {
          const p = himPatientById(pid)
          return {
            value: pid,
            label: p ? `${patientDisplayName(p)} — ${p.mrn}` : pid,
            description: p
              ? `${p.completeness}% complete · registered ${p.registered} · ${p.identifiers.length} identifiers`
              : undefined,
          }
        })
      : []

  const mergePair = mergeFor ? pairOf(mergeFor) : undefined

  return (
    <>
      <HimPageHeader
        title="Duplicates & merge"
        subtitle="One patient, one trusted record — highest scores first; exact verified-identifier matches block registration"
      />

      <FilterBar
        search={{
          value: query,
          onChange: setQuery,
          placeholder: 'Search names or MRNs in the queue…',
          label: 'Search duplicate candidates',
        }}
      />
      <div className="border-b border-hair">
        <Tabs items={tabs} value={bucket} onChange={setBucket} />
      </div>

      {rows.length === 0 ? (
        <Card pad={false}>
          <EmptyState
            variant="search"
            title={bucket === 'pending' ? 'No candidates awaiting review' : 'Nothing matches'}
            description={
              bucket === 'pending'
                ? 'New candidates arrive from registration duplicate checks, reconciliation sweeps and legacy imports.'
                : 'Adjust the search or switch buckets.'
            }
          />
        </Card>
      ) : (
        <Card pad={false}>
          <div className="px-2 py-2">
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(c) => c.id}
              pageSize={8}
              onRowClick={(c) => setOpenId(c.id)}
            />
          </div>
        </Card>
      )}

      {/* Side-by-side review — a drawer keeps the queue in context at any length. */}
      <Drawer
        open={open !== undefined}
        onClose={() => setOpenId(null)}
        size="2xl"
        title={
          open && openPair?.a && openPair.b
            ? `${patientDisplayName(openPair.a)} ↔ ${patientDisplayName(openPair.b)}`
            : 'Side-by-side review'
        }
        subtitle={
          open
            ? `Match score ${open.matchScore.toFixed(2)} — matched on ${open.matchingFields.join(', ')}. Matched fields are highlighted.`
            : undefined
        }
        footer={
          open?.status === 'pending review' && can.decideDuplicates ? (
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => decide(open.id, 'insufficient information')}>
                  Insufficient information
                </Button>
                <Button variant="ghost" onClick={() => decide(open.id, 'defer')}>
                  Defer
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => decide(open.id, 'not duplicate')}>
                  Not duplicate
                </Button>
                <Button
                  variant="danger"
                  leftIcon={<GitMerge size={14} />}
                  onClick={() => decide(open.id, 'duplicate confirmed')}
                >
                  Duplicate confirmed — merge
                </Button>
              </div>
            </div>
          ) : open ? (
            <div className="flex w-full items-center justify-between gap-2">
              <p className="text-[13px] text-forest-400">
                Decision recorded:{' '}
                <Badge tone={decisionTone[open.status]} dot className="ml-1">
                  {open.status}
                </Badge>
              </p>
              {open.status === 'duplicate confirmed' && can.unmerge && (
                <Button
                  variant="danger"
                  onClick={() => {
                    setUnmergeReason('')
                    setUnmergeFor(open)
                  }}
                >
                  Unmerge…
                </Button>
              )}
            </div>
          ) : undefined
        }
      >
        {open && openPair?.a && openPair.b && (
          <div className="flex flex-col gap-6 sm:flex-row">
            <CompareColumn patient={openPair.a} matched={open.matchingFields} title="Record A" />
            <div className="hidden w-px bg-hair sm:block" />
            <CompareColumn patient={openPair.b} matched={open.matchingFields} title="Record B" />
          </div>
        )}
      </Drawer>

      {/* High-risk confirmation — clinical-safety.md §2: identity restated,
          consequence in plain language, explicit verb, reason + verification
          required before the destructive control enables. */}
      <Modal
        open={mergeFor !== null}
        onClose={() => setMergeFor(null)}
        title="Merge records"
        subtitle={
          mergePair?.a && mergePair.b
            ? `${patientDisplayName(mergePair.a)} (${mergePair.a.mrn}) ↔ ${patientDisplayName(mergePair.b)} (${mergePair.b.mrn})`
            : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setMergeFor(null)}>
              Cancel
            </Button>
            <Button variant="danger" disabled={!survivorId || !verified || reason.trim() === ''} onClick={completeMerge}>
              Merge records
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-forest-500">
            The non-survivor record is marked as <strong>merged</strong> and its encounters, documents
            and identifiers are redirected to the survivor. Nothing is deleted; historical identifiers
            keep resolving. This action requires supervisor permission and{' '}
            <strong>will be recorded in the audit log</strong>.
          </p>
          <RadioGroup
            label="Survivor record"
            options={survivorOptions}
            value={survivorId}
            onChange={setSurvivorId}
          />
          <Field label="Reason" required hint="Shown in the merge report and audit trail.">
            <Textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Confirmed same patient after NIN verification…"
            />
          </Field>
          <Checkbox
            checked={verified}
            onChange={setVerified}
            label="I have verified these records represent the same patient"
            description="Checked against at least two identifiers or documents."
          />
          {mergePair?.a && mergePair.b && (
            <div className="rounded-2xl bg-panel px-4 py-3">
              <KeyValue
                label="Records in scope"
                value={`${mergePair.a.mrn} and ${mergePair.b.mrn} — encounters, documents, coverage and audit history are preserved on the survivor`}
              />
            </div>
          )}
        </div>
      </Modal>

      {/* Unmerge (W-HIM-022): elevated permission, reason, manual reconciliation. */}
      <Modal
        open={unmergeFor !== null}
        onClose={() => setUnmergeFor(null)}
        title="Unmerge records"
        subtitle={
          unmergeFor
            ? (() => {
                const { a, b } = pairOf(unmergeFor)
                return a && b ? `${patientDisplayName(a)} (${a.mrn}) ↔ ${patientDisplayName(b)} (${b.mrn})` : undefined
              })()
            : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setUnmergeFor(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={unmergeReason.trim() === ''}
              onClick={() => {
                if (unmergeFor) decide(unmergeFor.id, 'defer')
                info(
                  'Unmerge started',
                  'Requires HIM Supervisor + Admin approval. Linkages restore where safe; ambiguous items become manual reconciliation tasks — no silent data loss.',
                )
                setUnmergeFor(null)
              }}
            >
              Request unmerge
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-forest-500">
            Unmerging separates the records again and restores linkages where that is safe. Items
            that cannot be automatically attributed become <strong>manual reconciliation tasks</strong>.
            This needs supervisor <em>and</em> admin approval, and{' '}
            <strong>will be recorded in the audit log</strong> with an exception report.
          </p>
          <Field label="Reason" required hint="Why was this merge incorrect?">
            <Textarea
              rows={2}
              value={unmergeReason}
              onChange={(e) => setUnmergeReason(e.target.value)}
              placeholder="Records belong to twin brothers — NIN evidence provided…"
            />
          </Field>
        </div>
      </Modal>
    </>
  )
}
