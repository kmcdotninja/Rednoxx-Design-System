import { useState } from 'react'
import { FileWarning } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import {
  Button,
  Card,
  DataTable,
  EmptyState,
  Field,
  Modal,
  ProgressMeter,
  Textarea,
  useToast,
  type Column,
} from '@/components/ui'
import { HimPageHeader } from '../HimShell'
import { HIM_PATIENTS, patientDisplayName, type HimPatient } from '../data'
import { RecordStatusPill } from '../shared'
import { useRole } from '../rbac'

/**
 * Incomplete-record completion worklist (W-HIM-018). Records missing required
 * demographic/contact/identifier data stay here until completed or a formal
 * exception is documented — completion never blocks urgent care.
 */
export function IncompletePage() {
  const navigate = useNavigate()
  const { success } = useToast()
  const { can } = useRole()
  const [exceptionFor, setExceptionFor] = useState<HimPatient | null>(null)
  const [reason, setReason] = useState('')
  const [excepted, setExcepted] = useState<string[]>([])

  const rows = HIM_PATIENTS.filter(
    (p) => p.completeness < 100 && p.recordStatus !== 'merged' && !excepted.includes(p.id),
  ).sort((a, b) => a.completeness - b.completeness)

  const grantException = () => {
    if (!exceptionFor) return
    setExcepted((ids) => [...ids, exceptionFor.id])
    success(
      'Formal exception documented',
      `${patientDisplayName(exceptionFor)} leaves the worklist; the exception, reason and reviewer are audited.`,
    )
    setExceptionFor(null)
    setReason('')
  }

  const columns: Column<HimPatient>[] = [
    {
      key: 'patient',
      header: 'Patient',
      cell: (p) => (
        <span>
          <span className="block font-medium text-forest">{patientDisplayName(p)}</span>
          <span className="tnum block font-mono text-xs text-forest-400">{p.mrn}</span>
        </span>
      ),
    },
    {
      key: 'completeness',
      header: 'Complete',
      align: 'right',
      cell: (p) => <ProgressMeter value={p.completeness} />,
    },
    {
      key: 'missing',
      header: 'Missing fields',
      cell: (p) => p.missingFields?.join(', ') ?? '—',
    },
    { key: 'age', header: 'Registered', cell: (p) => <span className="tnum">{p.registered}</span> },
    { key: 'status', header: 'Record status', cell: (p) => <RecordStatusPill status={p.recordStatus} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (p) =>
        can.documentException ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              setExceptionFor(p)
              setReason('')
            }}
          >
            Document exception
          </Button>
        ) : null,
    },
  ]

  return (
    <>
      <HimPageHeader
        title="Incomplete records"
        subtitle="Complete the record, or document a formal exception — gaps stay visible in reports either way"
      />

      {rows.length === 0 ? (
        <Card pad={false}>
          <EmptyState
            variant="folder"
            title="Nothing on the completion worklist"
            description="Records missing required demographics, contacts or identifiers appear here automatically."
          />
        </Card>
      ) : (
        <Card pad={false}>
          <div className="px-2 py-2">
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(p) => p.id}
              onRowClick={(p) => navigate({ to: '/him-demo/patients/$id', params: { id: p.id } })}
            />
          </div>
          <p className="border-t border-hair px-5 py-3 text-xs text-forest-400">
            Open a record to enter the missing data — identity-field changes re-run the duplicate
            check. Temporary emergency records resolve through the reconciliation worklist instead.
          </p>
        </Card>
      )}

      <Modal
        open={exceptionFor !== null}
        onClose={() => setExceptionFor(null)}
        title="Document a formal exception"
        subtitle={
          exceptionFor
            ? `${patientDisplayName(exceptionFor)} · ${exceptionFor.mrn} — missing: ${exceptionFor.missingFields?.join(', ')}`
            : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setExceptionFor(null)}>
              Cancel
            </Button>
            <Button leftIcon={<FileWarning size={14} />} disabled={reason.trim() === ''} onClick={grantException}>
              Record exception
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-forest-500">
            An exception removes this record from the completion worklist without filling the gaps.
            The reason is required, carries a review date, and{' '}
            <strong>will be recorded in the audit log</strong>.
          </p>
          <Field label="Reason" required hint="e.g. patient unreachable after three contact attempts; no NIN issued.">
            <Textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Patient unreachable — phone disconnected; next review 01 Aug 2026…"
            />
          </Field>
        </div>
      </Modal>
    </>
  )
}
