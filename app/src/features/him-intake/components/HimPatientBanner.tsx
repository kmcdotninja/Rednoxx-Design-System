import type { ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Avatar, Card, Tag } from '@/components/ui'
import { PatientStatusBadges } from '../shared'
import type { PatientBannerContract } from '../types'

export function HimPatientBanner({
  patient,
  actions,
}: {
  patient: PatientBannerContract
  actions?: ReactNode
}) {
  const restricted = patient.statusFlags.includes('restricted')

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={restricted ? '?' : patient.displayName} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[22px] font-medium tracking-[-0.02em] text-forest">
                {patient.displayName}
              </h1>
              <PatientStatusBadges flags={patient.statusFlags} />
              {patient.allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="inline-flex items-center gap-1 rounded-full bg-rose-soft px-2 py-0.5 text-[11px] font-medium text-rose-ink"
                >
                  <TriangleAlert size={11} aria-hidden />
                  Allergy: {allergy}
                </span>
              ))}
            </div>
            <p className="tnum mt-1 text-[13px] text-forest-400">
              {patient.estimatedAge != null ? `${patient.estimatedAge}y` : 'Age unknown'} ·{' '}
              {patient.dateOfBirth ?? 'DOB unknown'} · {patient.sex} ·{' '}
              <span className="font-mono">MRN {patient.mrn}</span>
            </p>
            {(patient.coverage || patient.facility) && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {patient.coverage && (
                  <Tag>
                    {patient.coverage.payer} · {patient.coverage.status}
                  </Tag>
                )}
                {patient.facility && <Tag>{patient.facility}</Tag>}
              </div>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </Card>
  )
}
