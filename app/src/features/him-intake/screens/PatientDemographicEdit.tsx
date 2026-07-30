import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, Save } from 'lucide-react'
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Field,
  Input,
  KeyValue,
  Select,
  Textarea,
  useToast,
  Skeleton,
  EmptyState,
} from '@/components/ui'
import { HimPatientBanner } from '../components/HimPatientBanner'
import { getPatientBanner, getDemographicsForEdit, updateDemographics } from '../api'
import { PageHeader, ErrorState } from '../shared'
import { FACILITIES } from '../data'
import type { DemographicEditDraft, PatientSex } from '../types'

// Identity‑critical fields that require supervisor approval if changed
const KEY_FIELDS = ['fullName', 'sex', 'dateOfBirth'] as const

export function PatientDemographicEditPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { success } = useToast()

  const {
    data: patient,
    isPending: patientLoading,
    isError: patientError,
    refetch,
  } = useQuery({
    queryKey: ['patient-banner', id],
    queryFn: () => getPatientBanner(id),
  })

  const { data: originalDraft, isPending: draftLoading } = useQuery({
    queryKey: ['demographics-edit', id],
    queryFn: () => getDemographicsForEdit(id),
    enabled: !!id,
  })

  const [draft, setDraft] = useState<DemographicEditDraft | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (originalDraft) setDraft({ ...originalDraft })
  }, [originalDraft])

  const mutation = useMutation({
    mutationFn: (payload: DemographicEditDraft) => updateDemographics(id, payload),
    onSuccess: () => {
      success('Demographics updated', 'Changes saved and audited.')
      navigate({ to: '/him/patients/$id', params: { id } })
    },
  })

  if (patientLoading || draftLoading) return <Skeleton className="h-64" />
  if (patientError || !patient)
    return <ErrorState message="Couldn't load patient." onRetry={() => refetch()} />
  if (!draft) return <EmptyState variant="search" title="No data" />

  // Determine which key fields changed
  const keyFieldsChanged = KEY_FIELDS.filter(
    (field) => draft[field] !== originalDraft?.[field],
  )
  const needsApproval = keyFieldsChanged.length > 0 && !draft.supervisorApproved

  const set = <K extends keyof DemographicEditDraft>(key: K, value: DemographicEditDraft[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d))

  const handleSubmit = () => {
    if (!draft) return
    setSubmitting(true)
    mutation.mutate(draft, { onSettled: () => setSubmitting(false) })
  }

  const ready = draft.reason.trim().length > 0 || keyFieldsChanged.length === 0

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
        title="Edit demographics"
        subtitle="Correct or update patient information. Identity‑critical changes require supervisor approval."
      />

      <HimPatientBanner patient={patient} />

      <Card className="border-hair bg-panel/40 px-4 py-3 text-[13px] text-forest-400">
        <KeyValue label="MRN (immutable)" value={patient.mrn} />
        <p className="mt-1 text-[12px]">
          The permanent MRN cannot be changed on this screen. Use identifiers for NIN / legacy values only.
        </p>
      </Card>

      <Card className="space-y-5">
        {/* Full name */}
        <Field label="Full name" required>
          <div className="space-y-2">
            <KeyValue label="Current" value={originalDraft?.fullName ?? '—'} />
            <Input value={draft.fullName} onChange={(e) => set('fullName', e.target.value)} />
          </div>
        </Field>

        {/* Sex */}
        <Field label="Sex" required>
          <div className="space-y-2">
            <KeyValue label="Current" value={originalDraft?.sex ?? 'unknown'} />
            <Select value={draft.sex} onChange={(e) => set('sex', e.target.value as PatientSex)}>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
              <option value="unknown">Unknown</option>
            </Select>
          </div>
        </Field>

        {/* Date of birth */}
        <Field label="Date of birth">
          <div className="space-y-2">
            <KeyValue label="Current" value={originalDraft?.dateOfBirth ?? 'Not provided'} />
            <DatePicker
              value={draft.dateOfBirth ?? ''}
              onChange={(v) => set('dateOfBirth', v)}
              placeholder="Leave empty if unknown"
            />
          </div>
        </Field>

        {/* Estimated age */}
        <Field label="Estimated age" optional>
          <div className="space-y-2">
            <KeyValue
              label="Current"
              value={originalDraft?.estimatedAge != null ? `${originalDraft.estimatedAge}y` : '—'}
            />
            <Input
              type="number"
              min={0}
              max={130}
              value={draft.estimatedAge ?? ''}
              onChange={(e) => set('estimatedAge', e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </Field>

        {/* Phone */}
        <Field label="Phone" optional>
          <div className="space-y-2">
            <KeyValue label="Current" value={originalDraft?.phone || '—'} />
            <Input value={draft.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
        </Field>

        {/* Address */}
        <Field label="Address" optional>
          <div className="space-y-2">
            <KeyValue label="Current" value={originalDraft?.address || '—'} />
            <Textarea value={draft.address} onChange={(e) => set('address', e.target.value)} />
          </div>
        </Field>

        {/* Facility */}
        <Field label="Facility">
          <div className="space-y-2">
            <KeyValue label="Current" value={originalDraft?.facility || '—'} />
            <Select value={draft.facility ?? ''} onChange={(e) => set('facility', e.target.value)}>
              {FACILITIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
          </div>
        </Field>

        {/* Reason for change (required if any change made) */}
        <Field label="Reason for change" required>
          <Textarea
            value={draft.reason}
            onChange={(e) => set('reason', e.target.value)}
            placeholder="Explain why these changes are necessary…"
          />
        </Field>

        {/* Supervisor approval for key field changes */}
        {keyFieldsChanged.length > 0 && (
          <div className="rounded-2xl border border-amber-ink/30 bg-amber-soft p-4">
            <Checkbox
              checked={draft.supervisorApproved}
              onChange={(checked) => set('supervisorApproved', checked)}
              label="Supervisor approval"
              description={`The following identity‑critical fields were changed: ${keyFieldsChanged.join(', ')}. Confirm supervisor approval.`}
            />
          </div>
        )}

        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button
            leftIcon={<Save size={14} />}
            onClick={handleSubmit}
            disabled={!ready || needsApproval || submitting}
          >
            {submitting ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
