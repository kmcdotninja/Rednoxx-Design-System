import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, MoreHorizontal, Pencil, UserCheck, ShieldCheck } from 'lucide-react'
import { Button, Dropdown, EmptyState, KeyValue, Skeleton, Tabs, Badge } from '@/components/ui'
import { HimPatientBanner } from '../components/HimPatientBanner'
import { getDemographicsForEdit, getPatientBanner, getPatientIdentifiers } from '../api'
import { ErrorState, PatientStatusNotices, RestrictedGate } from '../shared'
import type { PatientBannerContract } from '../types'

type TabValue =
  | 'overview'
  | 'demographics'
  | 'identifiers'
  | 'encounters'
  | 'documents'
  | 'consent'
  | 'coverage'
  | 'referrals'
  | 'history'

const TABS: { value: TabValue; label: string; owningScreen: string }[] = [
  { value: 'overview', label: 'Overview', owningScreen: '' },
  { value: 'demographics', label: 'Demographics', owningScreen: 'HIM-S10' },
  { value: 'identifiers', label: 'Identifiers', owningScreen: 'HIM-S11' },
  { value: 'encounters', label: 'Encounters', owningScreen: 'OESC' },
  { value: 'documents', label: 'Documents', owningScreen: 'HIM-S18' },
  { value: 'consent', label: 'Consent', owningScreen: 'HIM-S24' },
  { value: 'coverage', label: 'Coverage', owningScreen: 'HIM-S25' },
  { value: 'referrals', label: 'Referrals', owningScreen: 'HIM-S09' },
  { value: 'history', label: 'History', owningScreen: 'HIM-S31' },
]

export function PatientSummaryPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const [tab, setTab] = useState<TabValue>('overview')

  const {
    data: patient,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['patient-banner', id],
    queryFn: () => getPatientBanner(id),
  })

  if (isPending) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-32" />
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  if (isError) {
    return <ErrorState message="We couldn’t load this patient record." onRetry={() => refetch()} />
  }

  if (!patient) {
    return (
      <EmptyState
        variant="search"
        title="Patient not found"
        description="This record doesn't exist, or you don't have access to view it."
      />
    )
  }

  const restricted = patient.statusFlags.includes('restricted')

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

      <HimPatientBanner
        patient={patient}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              leftIcon={<UserCheck size={14} />}
              onClick={() =>
                navigate({ to: '/him/patients/$id/checkin', params: { id: patient.id } })
              }
            >
              Check in
            </Button>
            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  aria-label="Patient actions"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-forest-300 hover:bg-panel hover:text-forest"
                >
                  <MoreHorizontal size={18} />
                </button>
              }
              items={[
                {
                  label: 'Edit demographics',
                  onSelect: () =>
                    navigate({
                      to: '/him/patients/$id/demographics/edit',
                      params: { id: patient.id },
                    }),
                },
                {
                  label: 'Manage identifiers',
                  onSelect: () =>
                    navigate({ to: '/him/patients/$id/identifiers', params: { id: patient.id } }),
                },
                {
                  label: 'Upload document — coming soon (HIM-S18)',
                  disabled: true,
                  onSelect: () => {},
                },
                {
                  label: 'Capture consent',
                  onSelect: () =>
                    navigate({ to: '/him/patients/$id/consent', params: { id: patient.id } }),
                },
                {
                  label: 'Start release — coming soon (HIM-S21)',
                  disabled: true,
                  separator: true,
                  onSelect: () => {},
                },
              ]}
            />
          </div>
        }
      />

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
          <Tabs
            items={TABS.map((t) => ({ value: t.value, label: t.label }))}
            value={tab}
            onChange={(next) => {
              if (next === 'consent') {
                navigate({ to: '/him/patients/$id/consent', params: { id: patient.id } })
                return
              }
              setTab(next)
            }}
          />

          {tab === 'overview' ? (
            <OverviewTab patient={patient} />
          ) : tab === 'demographics' ? (
            <DemographicsTab patientId={patient.id} />
          ) : tab === 'identifiers' ? (
            <IdentifiersTab patientId={patient.id} />
          ) : (
            <EmptyState
              compact
              variant="document"
              title={`${TABS.find((t) => t.value === tab)?.label} — coming soon`}
              description={`This tab ships with ${TABS.find((t) => t.value === tab)?.owningScreen}, built later in this stream.`}
            />
          )}
        </>
      )}
    </div>
  )
}

function OverviewTab({ patient }: { patient: PatientBannerContract }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <KeyValue label="Full name" value={patient.fullName} />
      <KeyValue label="Sex" value={patient.sex} />
      <KeyValue label="Date of birth" value={patient.dateOfBirth ?? '—'} />
      <KeyValue
        label="Estimated age"
        value={patient.estimatedAge != null ? `${patient.estimatedAge}y` : '—'}
      />
      <KeyValue label="Facility" value={patient.facility ?? '—'} />
      <KeyValue
        label={
          patient.statusFlags.includes('merged')
            ? 'Original MRN (retained after merge)'
            : 'MRN'
        }
        value={patient.mrn}
      />
      <KeyValue
        label="Coverage"
        value={
          patient.coverage
            ? `${patient.coverage.payer} · ${patient.coverage.status}`
            : 'Self-pay / none on file'
        }
      />
      <KeyValue
        label="Allergies"
        value={patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None recorded'}
      />
    </div>
  )
}

function DemographicsTab({ patientId }: { patientId: string }) {
  const navigate = useNavigate()
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['demographics-edit', patientId],
    queryFn: () => getDemographicsForEdit(patientId),
  })

  if (isPending) return <Skeleton className="h-40" />
  if (isError || !data) {
    return <ErrorState message="We couldn't load demographics." onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          leftIcon={<Pencil size={14} />}
          onClick={() =>
            navigate({ to: '/him/patients/$id/demographics/edit', params: { id: patientId } })
          }
        >
          Edit demographics
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KeyValue label="Full name" value={data.fullName} />
        <KeyValue label="Sex" value={data.sex} />
        <KeyValue label="Date of birth" value={data.dateOfBirth ?? '—'} />
        <KeyValue
          label="Estimated age"
          value={data.estimatedAge != null ? `${data.estimatedAge}y` : '—'}
        />
        <KeyValue label="Phone" value={data.phone || '—'} />
        <KeyValue label="Address" value={data.address || '—'} />
        <KeyValue label="Facility" value={data.facility || '—'} />
      </div>
    </div>
  )
}

// ---------- Identifiers Tab (inline, read‑only) ----------
function IdentifiersTab({ patientId }: { patientId: string }) {
  const navigate = useNavigate()
  const {
    data: identifiers,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['patient-identifiers', patientId],
    queryFn: () => getPatientIdentifiers(patientId),
  })

  if (isPending) return <Skeleton className="h-40" />
  if (isError)
    return <ErrorState message="We couldn't load identifiers." onRetry={() => refetch()} />

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          leftIcon={<ShieldCheck size={14} />}
          onClick={() =>
            navigate({ to: '/him/patients/$id/identifiers', params: { id: patientId } })
          }
        >
          Manage identifiers
        </Button>
      </div>

      {identifiers && identifiers.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {identifiers.map((idf) => (
            <div key={idf.id} className="rounded-2xl border border-hair bg-white p-3.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-forest">{idf.type}</span>
                <Badge tone={idf.active ? 'success' : 'neutral'} dot>
                  {idf.active ? 'Active' : 'Inactive'}
                </Badge>
                <Badge tone={idf.verified ? 'success' : 'warning'} dot>
                  {idf.verified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
              <p className="text-sm text-forest-600 mt-0.5">{idf.maskedValue}</p>
              {idf.verifiedAt && (
                <p className="text-[12px] text-forest-400 mt-0.5">
                  Verified {new Date(idf.verifiedAt).toLocaleDateString()} · {idf.verifiedSource}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState compact variant="document" title="No identifiers on file" />
      )}
    </div>
  )
}
