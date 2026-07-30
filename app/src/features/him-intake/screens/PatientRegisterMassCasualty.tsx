import { useState } from 'react'
import { ArrowLeft, Plus, Printer, Siren } from 'lucide-react'
import {
  Button,
  Card,
  Field,
  Input,
  Select,
  Textarea,
  useToast,
  Badge,
  EmptyState,
} from '@/components/ui'
import { PageHeader } from '../shared'
import { createMciEvent, addMciCasualty, closeMciEvent } from '../api'
import { MCI_EVENTS, MCI_CASUALTIES } from '../data'
import type { AgeBand, TriagePriority } from '../types'

const AGE_BAND_OPTIONS: { value: AgeBand; label: string }[] = [
  { value: 'neonate_infant', label: 'Neonate / infant (0–1y)' },
  { value: 'child', label: 'Child (2–12y)' },
  { value: 'adolescent', label: 'Adolescent (13–17y)' },
  { value: 'adult', label: 'Adult (18–64y)' },
  { value: 'elderly', label: 'Elderly (65y+)' },
  { value: 'unknown', label: 'Unknown' },
]

const TRIAGE_OPTIONS: { value: TriagePriority; label: string }[] = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'minor', label: 'Minor' },
  { value: 'expectant', label: 'Expectant' },
  { value: 'unassigned', label: 'Unassigned' },
]

const EMPTY_CASUALTY_FORM = {
  sex: 'unknown' as const,
  ageBand: 'unknown' as AgeBand,
  partialName: '',
  distinguishingNotes: '',
  triagePriority: 'unassigned' as TriagePriority,
}

export function PatientRegisterMassCasualtyPage() {
  const { success } = useToast()

  // Look for an active event (only one allowed in this demo)
  const activeEvent = MCI_EVENTS.find((e) => e.status === 'active') ?? null

  const [form, setForm] = useState(EMPTY_CASUALTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [eventTag, setEventTag] = useState('')
  const [activating, setActivating] = useState(false)

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleActivate = async () => {
    if (!eventTag.trim()) return
    setActivating(true)
    try {
      const ev = await createMciEvent(eventTag.trim())
      success('Mass‑casualty event activated', `Tag: ${ev.tag}`)
      setEventTag('')
      // refresh active event
    } finally {
      setActivating(false)
    }
  }

  const handleAddCasualty = async () => {
    if (!activeEvent) return
    setSubmitting(true)
    try {
      const casualty = await addMciCasualty(activeEvent.id, {
        sex: form.sex,
        ageBand: form.ageBand,
        partialName: form.partialName,
        distinguishingNotes: form.distinguishingNotes,
        triagePriority: form.triagePriority,
      })
      success(`Casualty ${casualty.sequence} added`, `Temporary ID: ${casualty.mrn}`)
      setForm(EMPTY_CASUALTY_FORM) // reset for next entry
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseEvent = async () => {
    if (!activeEvent) return
    setSubmitting(true)
    try {
      const report = await closeMciEvent(activeEvent.id)
      success('Event closed', `Report: ${report.totalCasualties} casualties`)
      // force re-render
    } finally {
      setSubmitting(false)
    }
  }

  // Get casualties for the active event
  const casualties = activeEvent ? MCI_CASUALTIES.filter((c) => c.eventId === activeEvent.id) : []

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
        title="Mass‑casualty registration"
        subtitle="Rapidly register multiple casualties under one incident tag for triage and reconciliation."
      />

      {!activeEvent ? (
        <Card className="space-y-4">
          <h2 className="text-[15px] font-medium text-forest">Activate mass‑casualty event</h2>
          <p className="text-[13px] text-forest-400">
            Create an event tag to group all casualties from this incident.
          </p>
          <Field label="Event tag" required>
            <Input
              value={eventTag}
              onChange={(e) => setEventTag(e.target.value)}
              placeholder="e.g. 'Bus crash – Maitama'"
            />
          </Field>
          <Button
            leftIcon={<Siren size={14} />}
            onClick={handleActivate}
            disabled={activating || !eventTag.trim()}
          >
            {activating ? 'Activating…' : 'Activate event'}
          </Button>
        </Card>
      ) : (
        <>
          {/* Incident header */}
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-medium text-forest">Event: {activeEvent.tag}</h2>
                <p className="text-[13px] text-forest-400">
                  Activated by {activeEvent.activatedBy} at{' '}
                  {new Date(activeEvent.activatedAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="warning" dot>
                  Active
                </Badge>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCloseEvent}
                  disabled={submitting}
                >
                  Close event
                </Button>
              </div>
            </div>
          </Card>

          {/* Rapid‑entry form */}
          <Card className="space-y-4">
            <h3 className="text-[13px] font-medium text-forest">Add casualty</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Sex (or unknown)">
                <Select value={form.sex} onChange={(e) => set('sex', e.target.value)}>
                  <option value="unknown">Unknown</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </Select>
              </Field>
              <Field label="Age band">
                <Select value={form.ageBand} onChange={(e) => set('ageBand', e.target.value)}>
                  {AGE_BAND_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Partial name / clue" optional>
                <Input
                  value={form.partialName}
                  onChange={(e) => set('partialName', e.target.value)}
                  placeholder="e.g. believed to be 'John'"
                />
              </Field>
              <Field label="Triage priority" optional>
                <Select
                  value={form.triagePriority}
                  onChange={(e) => set('triagePriority', e.target.value)}
                >
                  {TRIAGE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Distinguishing notes" optional>
              <Textarea
                value={form.distinguishingNotes}
                onChange={(e) => set('distinguishingNotes', e.target.value)}
                placeholder="Visible injuries, clothing, location found…"
              />
            </Field>
            <div className="flex justify-end">
              <Button
                leftIcon={<Plus size={14} />}
                onClick={handleAddCasualty}
                disabled={submitting}
              >
                {submitting ? 'Adding…' : 'Add casualty'}
              </Button>
            </div>
          </Card>

          {/* Casualty list */}
          <Card pad={false}>
            {casualties.length === 0 ? (
              <EmptyState
                compact
                variant="folder"
                title="No casualties added"
                description="Use the form above to add the first casualty."
              />
            ) : (
              <>
                <div className="flex items-center justify-between p-3 border-b border-hair">
                  <h3 className="text-[13px] font-medium text-forest">
                    Casualties ({casualties.length})
                  </h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Printer size={14} />}
                    onClick={() => window.print()}
                  >
                    Print all labels
                  </Button>
                </div>
                <div className="divide-y divide-hair/60">
                  {casualties.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 px-3 py-2.5">
                      <Badge tone="neutral">{`#${c.sequence}`}</Badge>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-forest">
                          {c.placeholderName}
                        </p>
                        <p className="text-[12px] text-forest-400">
                          {c.mrn} · {c.sex} ·{' '}
                          {AGE_BAND_OPTIONS.find((o) => o.value === c.ageBand)?.label ?? c.ageBand}
                          {c.triagePriority !== 'unassigned' && (
                            <>
                              {' '}
                              ·{' '}
                              <span className="text-orange-600 font-medium">
                                {c.triagePriority}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        title="Print label"
                        onClick={() => window.print()}
                        className="flex h-8 w-8 items-center justify-center rounded-xl text-forest-300 hover:bg-panel"
                      >
                        <Printer size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
