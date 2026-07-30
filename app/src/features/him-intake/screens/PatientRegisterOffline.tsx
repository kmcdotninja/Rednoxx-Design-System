import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { WifiOff, Save, ArrowLeft } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  Select,
  Textarea,
  useToast,
  EmptyState,
} from '@/components/ui'
import { PageHeader } from '../shared'
import { captureOfflineRegistration, getOfflineQueue } from '../api'
import { FACILITIES } from '../data'
import type { OfflineRegistrationDraft, PatientSex } from '../types'

const EMPTY_DRAFT: OfflineRegistrationDraft = {
  fullName: '',
  sex: 'unknown',
  estimatedAge: null,
  notes: '',
  facility: FACILITIES[0],
}

export function PatientRegisterOfflinePage() {
  const { success } = useToast()
  const queryClient = useQueryClient()

  const [draft, setDraft] = useState<OfflineRegistrationDraft>(EMPTY_DRAFT)
  const [submitting, setSubmitting] = useState(false)

  const { data: queue = [] } = useQuery({
    queryKey: ['offline-queue'],
    queryFn: getOfflineQueue,
  })

  const set = <K extends keyof OfflineRegistrationDraft>(
    key: K,
    value: OfflineRegistrationDraft[K],
  ) => setDraft((d) => ({ ...d, [key]: value }))

  const handleCapture = async () => {
    setSubmitting(true)
    try {
      const result = await captureOfflineRegistration(draft)
      success('Offline record captured', `Temporary ID: ${result.temporaryId}`)
      queryClient.invalidateQueries({ queryKey: ['offline-queue'] })
      setDraft(EMPTY_DRAFT)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Offline mode banner */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-[13px] font-medium text-forest-400 transition-colors hover:text-forest"
      >
        <ArrowLeft size={14} />
        Back
      </button>
      <div className="flex items-center gap-3 rounded-2xl bg-amber-soft px-4 py-3 text-amber-ink">
        <WifiOff size={18} className="shrink-0" />
        <div>
          <p className="text-sm font-medium">You are in offline / degraded mode</p>
          <p className="text-[13px]">
            Registration data will be saved locally and synchronised when connectivity is restored.
          </p>
        </div>
      </div>

      <PageHeader
        title="Offline registration"
        subtitle="Capture minimal patient information when the system is unavailable."
      />

      {/* Capture form */}
      <Card className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name (or partial)" optional>
            <Input
              value={draft.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="e.g. John Doe or Unknown"
            />
          </Field>
          <Field label="Sex" optional>
            <Select value={draft.sex} onChange={(e) => set('sex', e.target.value as PatientSex)}>
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
              value={draft.estimatedAge ?? ''}
              onChange={(e) => set('estimatedAge', e.target.value ? Number(e.target.value) : null)}
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
          <Field label="Notes" optional className="sm:col-span-2">
            <Textarea
              value={draft.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Any identifying details, reason for offline capture…"
            />
          </Field>
        </div>

        <div className="flex justify-end">
          <Button leftIcon={<Save size={14} />} onClick={handleCapture} disabled={submitting}>
            {submitting ? 'Saving…' : 'Capture offline record'}
          </Button>
        </div>
      </Card>

      {/* Pending offline queue */}
      <Card pad={false}>
        <div className="flex items-center justify-between p-3 border-b border-hair">
          <h3 className="text-[13px] font-medium text-forest">
            Pending offline records ({queue.length})
          </h3>
        </div>
        {queue.length === 0 ? (
          <EmptyState
            compact
            variant="folder"
            title="No pending records"
            description="Captured offline records will appear here."
          />
        ) : (
          <div className="divide-y divide-hair/60">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-forest truncate">{item.fullName}</p>
                  <p className="text-[12px] text-forest-400">
                    Temp ID: {item.temporaryId} · {new Date(item.capturedAt).toLocaleTimeString()}
                  </p>
                </div>
                <Badge tone="warning" dot>
                  Pending sync
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
