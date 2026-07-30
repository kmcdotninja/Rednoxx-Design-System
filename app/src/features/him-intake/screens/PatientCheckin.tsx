import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, UserCheck } from 'lucide-react'
import { Button, Card, Field, Input, Select, useToast, Skeleton, EmptyState } from '@/components/ui'
import { HimPatientBanner } from '../components/HimPatientBanner'
import { getPatientBanner, checkinPatient, getServices, getQueuesForService } from '../api'
import { PageHeader, ErrorState } from '../shared'
import type { CheckinDraft } from '../types'

const BILLING_CATEGORIES = ['Self-pay', 'Insured', 'Corporate']

export function PatientCheckinPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { success } = useToast()

  const {
    data: patient,
    isPending: patientLoading,
    isError: patientError,
    refetch: refetchPatient,
  } = useQuery({
    queryKey: ['patient-banner', id],
    queryFn: () => getPatientBanner(id),
  })

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    staleTime: Infinity,
  })

  const [visitType, setVisitType] = useState<'appointment' | 'walkin'>('walkin')
  const [service, setService] = useState('')
  const [billingCategory, setBillingCategory] = useState('Self-pay')
  const [coveragePayer, setCoveragePayer] = useState('')
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal')
  const [queue, setQueue] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { data: queues = [] } = useQuery({
    queryKey: ['queues', service],
    queryFn: () => getQueuesForService(service),
    enabled: !!service,
  })

  // Reset queue when service changes
  useEffect(() => {
    if (queues.length > 0 && !queues.includes(queue)) {
      setQueue(queues[0])
    }
  }, [queues, queue])

  const handleSubmit = async () => {
    if (!patient) return
    const draft: CheckinDraft = {
      patientId: patient.id,
      visitType,
      service,
      billingCategory,
      coveragePayer: billingCategory === 'Insured' ? coveragePayer : undefined,
      priority,
      destinationQueue: queue,
    }
    setSubmitting(true)
    try {
      const result = await checkinPatient(draft)
      success('Patient checked in', `Visit ${result.visitNumber} — ${result.queueName}`)
      // Navigate to the encounter or back to patient summary
      navigate({ to: '/him/patients/$id', params: { id: patient.id } })
    } finally {
      setSubmitting(false)
    }
  }

  if (patientLoading) return <Skeleton className="h-64" />
  if (patientError)
    return <ErrorState message="Couldn't load patient." onRetry={() => refetchPatient()} />
  if (!patient) return <EmptyState variant="search" title="Patient not found" />

  const ready = service.trim().length > 0 && queue.trim().length > 0

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
        title="Check‑in & encounter routing"
        subtitle="Verify visit details and route the patient to the correct queue."
      />

      <HimPatientBanner patient={patient} />

      <Card className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Visit type" required>
            <Select
              value={visitType}
              onChange={(e) => setVisitType(e.target.value as 'appointment' | 'walkin')}
            >
              <option value="walkin">Walk‑in</option>
              <option value="appointment">Appointment</option>
            </Select>
          </Field>
          {visitType === 'appointment' && (
            <Field label="Appointment" required hint="Appointment verification coming soon (S09)">
              <Input disabled value="Mock appointment – 10:00 AM" />
            </Field>
          )}
          <Field label="Service / clinic" required>
            <Select value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">Select…</option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Billing category" required>
            <Select value={billingCategory} onChange={(e) => setBillingCategory(e.target.value)}>
              {BILLING_CATEGORIES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          </Field>
          {billingCategory === 'Insured' && (
            <Field label="Coverage payer" required>
              <Input
                value={coveragePayer}
                onChange={(e) => setCoveragePayer(e.target.value)}
                placeholder="e.g. Hygeia HMO"
              />
            </Field>
          )}
          <Field label="Priority">
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'normal' | 'urgent')}
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </Select>
          </Field>
          <Field label="Destination queue" required>
            <Select value={queue} onChange={(e) => setQueue(e.target.value)}>
              <option value="">Select…</option>
              {queues.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="flex justify-end">
          <Button
            leftIcon={<UserCheck size={14} />}
            onClick={handleSubmit}
            disabled={!ready || submitting}
          >
            {submitting ? 'Checking in…' : 'Check in'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
