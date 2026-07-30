import { useState, type ReactNode } from 'react'
import { Eye, EyeOff, TriangleAlert } from 'lucide-react'
import { Avatar, Card, StatusPill, Tag } from '@/components/ui'
import type { Patient, PatientBio } from '@/demo/health'

function ageFrom(dob: string): number {
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 86_400_000))
}

/** Mask a string showing only the last N characters: e.g. "004-2744" → "•••-2744" */
function maskEnd(value: string, visible = 4): string {
  if (value.length <= visible) return '•'.repeat(value.length)
  return '•'.repeat(value.length - visible) + value.slice(-visible)
}

/** Mask a date string — show only the year: "17 May 1963" → "••/••/1963" */
function maskDob(dob: string): string {
  const d = new Date(dob)
  return `••/••/${d.getFullYear()}`
}

/**
 * The patient chart banner — identity, demographics, coverage and the page's
 * primary actions. Every patient-scoped screen opens with this block.
 *
 * Sensitive fields (DOB, MRN) are masked by default and can be revealed
 * with an explicit "Show sensitive data" toggle. Allergy flags are always
 * visible and can never be hidden — they are a clinical safety item.
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
  const [revealed, setRevealed] = useState(false)

  const displayMrn = revealed ? patient.mrn : maskEnd(patient.mrn, 4)
  const displayDob = revealed ? bio.dob : maskDob(bio.dob)

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
              {/* Allergy flags — always visible; never hidden */}
              {bio.allergies.map((allergy) => (
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
              {ageFrom(bio.dob)}y
              {' · '}
              <span title={revealed ? 'Date of birth' : 'Date of birth — masked'}>
                {displayDob}
              </span>
              {' · '}
              {bio.sex}
              {' · '}
              <span className="font-mono">
                MRN{' '}
                <span title={revealed ? patient.mrn : 'MRN — last 4 digits shown'}>
                  {displayMrn}
                </span>
              </span>
              {' · '}
              {/* Reveal / hide toggle */}
              <button
                type="button"
                onClick={() => setRevealed((r) => !r)}
                className="inline-flex items-center gap-1 rounded px-1 py-0.5 text-[11px] font-medium text-forest-400 hover:bg-panel hover:text-forest transition-colors"
                aria-label={revealed ? 'Hide sensitive data' : 'Show sensitive data'}
              >
                {revealed ? (
                  <><EyeOff size={11} aria-hidden /> Hide</>
                ) : (
                  <><Eye size={11} aria-hidden /> Show</>
                )}
              </button>
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
        <Card key={v.label} pad={false} className="p-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-forest-300 leading-tight break-words">{v.label}</p>
          <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0.5 mt-1">
            <span className="tnum text-[15px] font-medium leading-none tracking-[-0.01em] text-forest">
              {v.value}
            </span>
            {v.unit && (
              <span className="text-[10px] font-normal text-forest-400 leading-none">
                {v.unit}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
