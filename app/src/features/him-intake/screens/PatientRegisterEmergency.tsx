import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Printer, Siren, ArrowLeft } from 'lucide-react'
import { Button, Card, Field, Input, Select, Textarea, useToast } from '@/components/ui'
import { registerEmergencyPatient } from '../api'
import { PageHeader } from '../shared'
import { FACILITIES } from '../data'
import type { AgeBand, EmergencyRegistrationDraft } from '../types'

const AGE_BANDS: { value: AgeBand; label: string }[] = [
  { value: 'neonate_infant', label: 'Neonate / infant (0–1y)' },
  { value: 'child', label: 'Child (2–12y)' },
  { value: 'adolescent', label: 'Adolescent (13–17y)' },
  { value: 'adult', label: 'Adult (18–64y)' },
  { value: 'elderly', label: 'Elderly (65y+)' },
  { value: 'unknown', label: 'Unknown' },
]

const SEX_WORD: Record<string, string> = { M: 'Male', F: 'Female', O: 'Other', unknown: '' }

const EMPTY_DRAFT: EmergencyRegistrationDraft = {
  sex: 'unknown',
  ageBand: 'unknown',
  estimatedAge: null,
  partialName: '',
  distinguishingNotes: '',
  arrivalBroughtBy: '',
  facility: FACILITIES[0],
}

export function PatientRegisterEmergencyPage() {
  const navigate = useNavigate()
  const { success } = useToast()
  const [draft, setDraft] = useState<EmergencyRegistrationDraft>(EMPTY_DRAFT)
  const [submitting, setSubmitting] = useState(false)

  const set = <K extends keyof EmergencyRegistrationDraft>(
    key: K,
    value: EmergencyRegistrationDraft[K],
  ) => setDraft((d) => ({ ...d, [key]: value }))

  const previewName = draft.partialName.trim()
    ? draft.partialName.trim()
    : SEX_WORD[draft.sex]
      ? `Unknown-${SEX_WORD[draft.sex]}-####`
      : 'Unknown-####'

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const result = await registerEmergencyPatient(draft)
      success(
        `Temporary ID ${result.mrn} created`,
        `${result.placeholderName} — added to the incomplete-records worklist for reconciliation.`,
      )
      navigate({ to: '/him/patients/$id', params: { id: result.id } })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-[13px] font-medium text-forest-400 transition-colors hover:text-forest"
      >
        <ArrowLeft size={14} />
        Back
      </button>
      <PageHeader
        title="Emergency registration"
        subtitle="For care that can't wait — creates a temporary identity in seconds and never blocks on missing details."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Sex (or unknown)" required>
              <Select
                value={draft.sex}
                onChange={(e) => set('sex', e.target.value as EmergencyRegistrationDraft['sex'])}
              >
                <option value="unknown">Unknown</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </Select>
            </Field>
            <Field label="Age band" required>
              <Select
                value={draft.ageBand}
                onChange={(e) => set('ageBand', e.target.value as AgeBand)}
              >
                {AGE_BANDS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Estimated age (years)" optional>
              <Input
                type="number"
                min={0}
                max={130}
                value={draft.estimatedAge ?? ''}
                onChange={(e) =>
                  set('estimatedAge', e.target.value ? Number(e.target.value) : null)
                }
              />
            </Field>
            <Field
              label="Partial name"
              optional
              hint="Only if something is known — leave blank to use the placeholder name."
            >
              <Input
                value={draft.partialName}
                onChange={(e) => set('partialName', e.target.value)}
                placeholder="e.g. believed to be 'John'"
              />
            </Field>
          </div>

          <Field
            label="Distinguishing notes"
            optional
            hint="Recommended — helps match this record during reconciliation."
          >
            <Textarea
              value={draft.distinguishingNotes}
              onChange={(e) => set('distinguishingNotes', e.target.value)}
              placeholder="Visible tattoos, clothing, effects carried, presenting complaint…"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Arrival / brought in by" optional>
              <Input
                value={draft.arrivalBroughtBy}
                onChange={(e) => set('arrivalBroughtBy', e.target.value)}
                placeholder="e.g. Ambulance, police, bystander"
              />
            </Field>
            <Field label="Facility" required>
              <Select value={draft.facility} onChange={(e) => set('facility', e.target.value)}>
                {FACILITIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="flex justify-end">
            <Button leftIcon={<Siren size={14} />} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Generating…' : 'Generate temporary ID & proceed'}
            </Button>
          </div>
        </Card>

        {/* Printable-label preview — spec calls for a "printable label/band". */}
        <Card className="h-fit space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-forest-300">
            Label preview
          </p>
          <div className="rounded-2xl border-2 border-dashed border-hair p-4">
            <p className="text-[15px] font-medium text-forest">{previewName}</p>
            <p className="tnum mt-1 text-[13px] text-forest-400">
              {AGE_BANDS.find((b) => b.value === draft.ageBand)?.label} ·{' '}
              {draft.sex === 'unknown' ? 'Sex unknown' : draft.sex}
            </p>
            <p className="mt-1 text-[12px] text-forest-400">{draft.facility}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Printer size={14} />}
            onClick={() => window.print()}
            className="w-full"
          >
            Print label
          </Button>
        </Card>
      </div>
    </div>
  )
}
