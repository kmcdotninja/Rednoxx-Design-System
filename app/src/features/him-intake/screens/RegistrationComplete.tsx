import { useState } from 'react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle2, Copy, Printer, UserPlus } from 'lucide-react'
import { Alert, Button, Card, KeyValue, Skeleton, useToast } from '@/components/ui'
import { getPatientBanner } from '../api'
import { ErrorState, PageHeader } from '../shared'
import { getMrnSchemeLabel } from '../mrn'

/** HIM-S02 — Registration complete; permanent MRN shown as immutable. */
export function RegistrationCompletePage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { success } = useToast()
  const [copied, setCopied] = useState(false)

  const { data: patient, isPending, isError, refetch } = useQuery({
    queryKey: ['patient-banner', id],
    queryFn: () => getPatientBanner(id),
  })

  if (isPending) return <Skeleton className="h-64" />
  if (isError || !patient) {
    return <ErrorState message="Couldn't load the new registration." onRetry={() => refetch()} />
  }

  const copyMrn = async () => {
    try {
      await navigator.clipboard.writeText(patient.mrn)
      setCopied(true)
      success('MRN copied', patient.mrn)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      success('MRN', patient.mrn)
    }
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => navigate({ to: '/him/patients/search' })}
        className="flex items-center gap-1.5 text-[13px] font-medium text-forest-400 transition-colors hover:text-forest"
      >
        <ArrowLeft size={14} />
        Back to search
      </button>

      <PageHeader
        title="Patient registered"
        subtitle="A permanent medical record number was assigned automatically."
      />

      <Alert tone="success" title="Registration complete">
        MRN is permanent for this facility namespace — it cannot be edited or deleted.
      </Alert>

      <Card className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-soft text-mint">
            <CheckCircle2 size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[18px] font-medium text-forest">{patient.fullName}</p>
            <p className="text-[12px] text-forest-400">
              {patient.facility} · scheme {getMrnSchemeLabel(patient.facility ?? '')}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-hair bg-panel/50 px-4 py-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
            Medical record number
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <p className="tnum font-mono text-[28px] font-medium tracking-tight text-forest">
              {patient.mrn}
            </p>
            <Button size="sm" variant="secondary" leftIcon={<Copy size={14} />} onClick={copyMrn}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <p className="mt-2 text-[12px] text-forest-400">
            Read-only · immutable · unique within this facility’s MRN namespace
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <KeyValue label="Sex" value={patient.sex} />
          <KeyValue label="Age" value={patient.estimatedAge != null ? `${patient.estimatedAge}y` : '—'} />
          <KeyValue label="Facility" value={patient.facility} />
        </div>

        <div className="flex flex-wrap gap-2 border-t border-hair pt-4">
          <Button
            leftIcon={<Printer size={14} />}
            variant="secondary"
            onClick={() => success('Slip queued', 'Demo printer — registration slip ready.')}
          >
            Print slip
          </Button>
          <Link to="/him/patients/$id" params={{ id: patient.id }}>
            <Button variant="secondary">Open full record</Button>
          </Link>
          <Button
            leftIcon={<UserPlus size={14} />}
            onClick={() => navigate({ to: '/him/patients/register' })}
          >
            Register another
          </Button>
        </div>
      </Card>
    </div>
  )
}
