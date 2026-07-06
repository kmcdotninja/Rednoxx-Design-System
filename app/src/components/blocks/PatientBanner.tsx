import type { ReactNode } from 'react'
import { Avatar, Card, StatusPill, Tag } from '@/components/ui'
import type { Patient, PatientBio } from '@/showcase/health'

function ageFrom(dob: string): number {
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 86_400_000))
}

/**
 * The patient chart banner — identity, demographics, coverage and the page's
 * primary actions. Every patient-scoped screen opens with this block.
 */
export function PatientBanner({
  patient,
  bio,
  actions,
}: {
  patient: Patient
  bio: PatientBio
  actions?: ReactNode
}) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={patient.name} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[22px] font-medium tracking-[-0.02em] text-forest">
                {patient.name}
              </h1>
              <StatusPill status={patient.status} />
            </div>
            <p className="tnum mt-1 text-[13px] text-forest-400">
              MRN {patient.mrn} · {bio.sex} · {ageFrom(bio.dob)} yrs · b. {bio.dob}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <Tag>{patient.plan}</Tag>
              <Tag>{bio.insurer}</Tag>
              <Tag>GP · {patient.gp}</Tag>
            </div>
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </Card>
  )
}

/** The latest observations as a row of compact tiles. */
export function VitalsRow({ vitals }: { vitals: PatientBio['vitals'] }) {
  const tiles = [
    { label: 'Blood pressure', value: vitals.bp, unit: 'mmHg' },
    { label: 'Heart rate', value: String(vitals.hr), unit: 'bpm' },
    { label: 'Temperature', value: vitals.temp, unit: '' },
    { label: 'SpO₂', value: vitals.spo2, unit: '' },
    { label: 'Weight', value: vitals.weight, unit: '' },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      {tiles.map((v) => (
        <Card key={v.label} pad={false} className="p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-forest-300">{v.label}</p>
          <p className="tnum mt-1.5 text-[19px] font-medium leading-none tracking-[-0.01em] text-forest">
            {v.value}
            {v.unit && <span className="ml-1 text-[11px] font-normal text-forest-400">{v.unit}</span>}
          </p>
        </Card>
      ))}
    </div>
  )
}
