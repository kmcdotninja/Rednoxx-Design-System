import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ChevronDown, IdCard, PencilLine, ShieldCheck, ShieldQuestion } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  Input,
  Skeleton,
  useToast,
} from '@/components/ui'
import { HimPatientBanner } from '../components/HimPatientBanner'
import { getDemographicsForEdit, getVerificationContext, updateDemographics } from '../api'
import { can, ErrorState, PageHeader, PatientStatusNotices, RestrictedGate } from '../shared'
import type { DemographicEditDraft } from '../types'

const LOW_CONFIDENCE_THRESHOLD = 70

export function PatientVerificationPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { success } = useToast()
  const queryClient = useQueryClient()

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['patient-verify', id],
    queryFn: () => getVerificationContext(id),
  })

  const [confirmed, setConfirmed] = useState<Set<string>>(new Set())
  const [extraIdConfirmed, setExtraIdConfirmed] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const lowConfidence = (data?.matchScore ?? 100) < LOW_CONFIDENCE_THRESHOLD

  const allConfirmed = useMemo(() => {
    if (!data) return false
    const attributesOk = data.attributes.every((a) => confirmed.has(a.key))
    return attributesOk && (!lowConfidence || extraIdConfirmed)
  }, [data, confirmed, lowConfidence, extraIdConfirmed])

  const toggle = (key: string) =>
    setConfirmed((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  if (isPending) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-32" />
        <Skeleton className="h-56" />
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorState message="We couldn’t load the verification context." onRetry={() => refetch()} />
    )
  }

  if (!data) {
    return (
      <EmptyState
        variant="search"
        title="Patient not found"
        description="This record doesn't exist, or you don't have access to view it."
      />
    )
  }

  const { patient, matchScore, attributes } = data
  const restricted = patient.statusFlags.includes('restricted')
  const deceased = patient.statusFlags.includes('deceased')
  const merged = patient.statusFlags.includes('merged')
  const blocked = deceased || merged || restricted

  return (
    <div className="space-y-5">
      <PageHeader
        title="Confirm this is the right patient"
        subtitle="Match every attribute before reusing this record — avoids creating a duplicate."
      />

      <HimPatientBanner patient={patient} />

      <PatientStatusNotices
        flags={patient.statusFlags}
        mergedIntoId={patient.mergedIntoId}
        mrn={patient.mrn}
        onOpenSurvivor={(survivorId) =>
          navigate({ to: '/him/patients/$id', params: { id: survivorId } })
        }
      />

      {restricted ? (
        <RestrictedGate />
      ) : (
        <>
          <Card>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-medium tracking-[-0.01em] text-forest">
                Verification checklist
              </h2>
              <Badge tone={lowConfidence ? 'danger' : matchScore >= 85 ? 'success' : 'warning'} dot>
                <span className="tnum">{matchScore}%</span> match confidence
              </Badge>
            </div>

            {lowConfidence && (
              <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-orange-soft px-3.5 py-2.5 text-[13px] text-orange-600">
                <ShieldQuestion size={15} className="shrink-0" />
                Low confidence match — confirm an additional identifier before proceeding.
              </div>
            )}

            <div className="mt-4 divide-y divide-hair/60">
              {attributes.map((attr) => (
                <div key={attr.key} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-start gap-2.5">
                    {attr.key === 'id' && (
                      <IdCard size={15} className="mt-0.5 shrink-0 text-forest-300" />
                    )}
                    <div>
                      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-forest-300">
                        {attr.label}
                      </p>
                      <p className="mt-0.5 text-sm text-forest">{attr.expected}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={confirmed.has(attr.key)}
                    onChange={() => toggle(attr.key)}
                    label="Confirmed"
                  />
                </div>
              ))}

              {lowConfidence && (
                <div className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-forest-300">
                      Additional identifier
                    </p>
                    <p className="mt-0.5 text-sm text-forest">
                      NIN, alternative ID, or another document checked in person
                    </p>
                  </div>
                  <Checkbox
                    checked={extraIdConfirmed}
                    onChange={() => setExtraIdConfirmed((v) => !v)}
                    label="Confirmed"
                  />
                </div>
              )}
            </div>

            {can('patient.demographics.update') && !blocked && (
              <div className="mt-4 border-t border-hair/60 pt-3">
                <button
                  type="button"
                  onClick={() => setEditOpen((v) => !v)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl px-1 py-1.5 text-left text-[13px] font-medium text-forest-400 transition-colors hover:text-forest"
                >
                  <span className="flex items-center gap-2">
                    <PencilLine size={14} />
                    Something doesn't match? Update demographics
                  </span>
                  <ChevronDown
                    size={15}
                    className={`shrink-0 transition-transform ${editOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {editOpen && (
                  <InlineDemographicUpdate
                    patientId={patient.id}
                    onSaved={() => {
                      setEditOpen(false)
                      queryClient.invalidateQueries({ queryKey: ['patient-verify', id] })
                      success(
                        'Demographics updated',
                        'The record now reflects the corrected details.',
                      )
                    }}
                  />
                )}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate({ to: '/him/patients/search' })}
              >
                Not a match — back to search
              </Button>
              {can('patient.verify') && (
                <Button
                  size="sm"
                  leftIcon={<ShieldCheck size={14} />}
                  disabled={!allConfirmed || blocked}
                  onClick={() => {
                    success('Patient verified', 'Every attribute was confirmed against the record.')
                    navigate({ to: '/him/patients/$id', params: { id: patient.id } })
                  }}
                >
                  Verify & continue
                </Button>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

function InlineDemographicUpdate({
  patientId,
  onSaved,
}: {
  patientId: string
  onSaved: () => void
}) {
  const {
    data: initial,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['demographics-edit', patientId],
    queryFn: () => getDemographicsForEdit(patientId),
  })

  const [draft, setDraft] = useState<DemographicEditDraft | null>(null)

  const form = draft ?? initial ?? null

  const mutation = useMutation({
    mutationFn: (payload: DemographicEditDraft) => updateDemographics(patientId, payload),
    onSuccess: onSaved,
  })

  if (isPending) {
    return (
      <div className="mt-3 space-y-2.5">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    )
  }

  if (isError || !form) {
    return (
      <div className="mt-3">
        <ErrorState
          message="We couldn’t load this patient's demographics."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  const update = <K extends keyof DemographicEditDraft>(key: K, value: DemographicEditDraft[K]) =>
    setDraft({ ...form, [key]: value })

  const canSave = form.reason.trim().length > 0 && form.supervisorApproved && !mutation.isPending

  return (
    <div className="mt-3 space-y-3 rounded-2xl bg-panel/60 p-3.5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-forest-300">
            Full name
          </span>
          <Input
            className="mt-1"
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-forest-300">
            Phone
          </span>
          <Input
            className="mt-1"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-forest-300">
            Date of birth
          </span>
          <Input
            className="mt-1"
            type="date"
            value={form.dateOfBirth ?? ''}
            onChange={(e) => update('dateOfBirth', e.target.value || null)}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-forest-300">
          Reason for change
        </span>
        <Input
          className="mt-1"
          placeholder="e.g. Corrected spelling from national ID"
          value={form.reason}
          onChange={(e) => update('reason', e.target.value)}
        />
      </label>

      <div className="flex items-center justify-between gap-3 pt-1">
        <Checkbox
          checked={form.supervisorApproved}
          onChange={() => update('supervisorApproved', !form.supervisorApproved)}
          label="Supervisor approved this change"
        />
        <Button size="sm" disabled={!canSave} onClick={() => mutation.mutate(form)}>
          {mutation.isPending ? 'Saving…' : 'Save updates'}
        </Button>
      </div>

      {mutation.isError && (
        <p className="text-[12px] text-rose-ink">
          Couldn't save those changes — check the fields and try again.
        </p>
      )}
    </div>
  )
}
