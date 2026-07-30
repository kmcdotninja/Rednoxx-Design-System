import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ShieldCheck, AlertTriangle } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  Select,
  Textarea,
  useToast,
  Skeleton,
  EmptyState,
} from '@/components/ui'
import { PageHeader, ErrorState } from '../shared'
import { getOfflineRecordsForReconciliation, commitOfflineRecord } from '../api'
import { FACILITIES } from '../data'
import type { OfflineReconciliationRecord, CommitOfflineRecordDraft, PatientSex } from '../types'

export function OfflineReconciliationPage() {
  const { success, error } = useToast()
  const queryClient = useQueryClient()

  const {
    data: records = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['offline-reconciliation'],
    queryFn: getOfflineRecordsForReconciliation,
  })

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editSex, setEditSex] = useState<PatientSex>('unknown')
  const [editAge, setEditAge] = useState<number | null>(null)
  const [editFacility, setEditFacility] = useState(FACILITIES[0])
  const [overrideDuplicate, setOverrideDuplicate] = useState(false)
  const [overrideReason, setOverrideReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const commitMutation = useMutation({
    mutationFn: (draft: CommitOfflineRecordDraft) => commitOfflineRecord(draft),
    onSuccess: (result) => {
      success('Record committed', `MRN ${result.mrn} assigned`)
      queryClient.invalidateQueries({ queryKey: ['offline-reconciliation'] })
      queryClient.invalidateQueries({ queryKey: ['offline-queue'] })
      setExpandedId(null)
    },
    onError: () => error('Commit failed'),
  })

  const openRecord = (record: OfflineReconciliationRecord) => {
    setExpandedId(record.item.id)
    setEditName(record.proposedFullName)
    setEditSex(record.proposedSex)
    setEditAge(record.proposedEstimatedAge)
    setEditFacility(record.proposedFacility)
    setOverrideDuplicate(false)
    setOverrideReason('')
  }

  const handleCommit = () => {
    if (!expandedId) return
    const record = records.find((r) => r.item.id === expandedId)
    if (!record) return

    const hasDuplicates = record.duplicateCandidates.length > 0
    if (hasDuplicates && !overrideDuplicate) return

    setSubmitting(true)
    commitMutation.mutate(
      {
        offlineId: expandedId,
        fullName: editName,
        sex: editSex,
        estimatedAge: editAge,
        facility: editFacility,
        overrideDuplicate,
        overrideReason: hasDuplicates ? overrideReason : undefined,
      },
      { onSettled: () => setSubmitting(false) },
    )
  }

  if (isPending) return <Skeleton className="h-64" />
  if (isError)
    return <ErrorState message="Couldn't load reconciliation list." onRetry={() => refetch()} />

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-[13px] font-medium text-forest-400 hover:text-forest"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <PageHeader
        title="Offline reconciliation"
        subtitle="Validate and commit offline records to the live system."
      />

      {records.length === 0 ? (
        <EmptyState
          variant="folder"
          title="No pending offline records"
          description="All offline records have been reconciled."
        />
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <Card key={record.item.id} className="p-0">
              <button
                type="button"
                onClick={() =>
                  expandedId === record.item.id ? setExpandedId(null) : openRecord(record)
                }
                className="flex w-full items-center justify-between p-3 text-left hover:bg-panel/50"
              >
                <div>
                  <p className="text-sm font-medium text-forest">{record.item.fullName}</p>
                  <p className="text-[12px] text-forest-400">
                    Temp ID: {record.item.temporaryId} ·{' '}
                    {new Date(record.item.capturedAt).toLocaleString()}
                  </p>
                </div>
                <Badge tone="warning" dot>
                  Pending
                </Badge>
              </button>

              {expandedId === record.item.id && (
                <div className="border-t border-hair p-3 space-y-5">
                  {/* Proposed permanent record fields */}
                  <div>
                    <h4 className="text-[13px] font-medium text-forest mb-3">
                      Proposed permanent record
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full name" required>
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                      </Field>
                      <Field label="Sex" required>
                        <Select
                          value={editSex}
                          onChange={(e) => setEditSex(e.target.value as PatientSex)}
                        >
                          <option value="unknown">Unknown</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="O">Other</option>
                        </Select>
                      </Field>
                      <Field label="Estimated age" optional>
                        <Input
                          type="number"
                          min={0}
                          max={130}
                          value={editAge ?? ''}
                          onChange={(e) =>
                            setEditAge(e.target.value ? Number(e.target.value) : null)
                          }
                        />
                      </Field>
                      <Field label="Facility" required>
                        <Select
                          value={editFacility}
                          onChange={(e) => setEditFacility(e.target.value)}
                        >
                          {FACILITIES.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    </div>
                  </div>

                  {/* Duplicate candidates */}
                  {record.duplicateCandidates.length > 0 && (
                    <div className="rounded-2xl border border-amber-ink/30 bg-amber-soft p-4 space-y-3">
                      <div className="flex items-center gap-2 text-amber-ink">
                        <AlertTriangle size={15} />
                        <span className="text-[13px] font-medium">
                          Possible duplicate{record.duplicateCandidates.length > 1 ? 's' : ''} found
                        </span>
                      </div>
                      <div className="space-y-2">
                        {record.duplicateCandidates.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2"
                          >
                            <div>
                              <p className="text-sm font-medium text-forest">{c.displayName}</p>
                              <p className="text-[12px] text-forest-400">
                                MRN {c.mrn} · {c.age != null ? `${c.age}y` : '—'} · {c.facility}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Checkbox
                        checked={overrideDuplicate}
                        onChange={(checked) => setOverrideDuplicate(checked)}
                        label="This is not a duplicate — confirm and commit"
                      />

                      {overrideDuplicate && (
                        <Field label="Reason for override" required>
                          <Textarea
                            value={overrideReason}
                            onChange={(e) => setOverrideReason(e.target.value)}
                            placeholder="Explain why this record should be committed despite the match…"
                          />
                        </Field>
                      )}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      leftIcon={<ShieldCheck size={14} />}
                      onClick={handleCommit}
                      disabled={
                        submitting ||
                        (record.duplicateCandidates.length > 0 &&
                          (!overrideDuplicate || !overrideReason.trim()))
                      }
                    >
                      {submitting ? 'Committing…' : 'Commit as permanent record'}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
