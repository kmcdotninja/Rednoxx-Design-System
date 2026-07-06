import { CalendarPlus, Stethoscope } from 'lucide-react'
import { AreaChart } from '@/components/ui/AreaChart'
import { Avatar, Badge, Button, Card, CardHeader, KeyValue, StatusPill, Tag } from '@/components/ui'
import { PatientBanner, VitalsRow } from '@/components/blocks'
import { PATIENTS, PATIENT_BIO, PRESCRIPTIONS } from '../health'
import type { ComponentDoc } from '../types'

const patient = PATIENTS[4] // Tunde Bakare
const bio = PATIENT_BIO.p5
const rx = PRESCRIPTIONS.find((r) => r.patient === patient.name)!

export const PATIENT_BLOCK_DOCS: Omit<ComponentDoc, 'name' | 'group' | 'summary'>[] = [
  {
    slug: 'patient-banner',
    description:
      'One banner for every patient-scoped screen: who they are, how they’re covered, and what you can do next. Actions are a slot, so each screen brings its own — the identity block never changes.',
    code: `<PatientBanner
  patient={patient}
  bio={bio}
  actions={<><Button variant="secondary" size="sm">Schedule</Button><Button size="sm">Start consultation</Button></>}
/>`,
    examples: [
      {
        title: 'Default',
        wide: true,
        body: (
          <PatientBanner
            patient={patient}
            bio={bio}
            actions={
              <>
                <Button variant="secondary" size="sm" leftIcon={<CalendarPlus size={14} />}>
                  Schedule
                </Button>
                <Button size="sm" leftIcon={<Stethoscope size={14} />}>
                  Start consultation
                </Button>
              </>
            }
          />
        ),
      },
    ],
    a11y: [
      'The patient name is the page’s h1 — use the banner once per screen.',
      'Status is a labelled pill, never colour alone; MRN and dates use tabular figures.',
      'Actions are ordinary buttons in reading order, after the identity content.',
    ],
  },
  {
    slug: 'clinical-cards',
    description:
      'The chart-rail vocabulary: each card answers one clinical question at a glance. Allergies always render in the danger tone; everything else stays quiet.',
    code: `<Card pad={false} className="p-5">
  <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">Allergies</h3>
  <Badge tone="danger" dot>Penicillin</Badge>
</Card>`,
    examples: [
      {
        title: 'Rail cards',
        wide: true,
        body: (
          <div className="grid gap-4 sm:grid-cols-2">
            <Card pad={false} className="p-5">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">Allergies</h3>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {bio.allergies.map((a) => (
                  <Badge key={a} tone="danger" dot>
                    {a}
                  </Badge>
                ))}
              </div>
            </Card>
            <Card pad={false} className="p-5">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">Insurance</h3>
              <dl className="mt-2.5 space-y-3">
                <KeyValue label="Insurer" value={bio.insurer} />
                <KeyValue label="Member ID" value={<span className="tnum">{bio.memberId}</span>} />
                <KeyValue label="Valid till" value={<span className="tnum">{bio.validTill}</span>} />
              </dl>
            </Card>
            <Card pad={false} className="p-5">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">Medication</h3>
              <div className="mt-2.5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-forest">{rx.drug}</p>
                  <p className="text-xs text-forest-400">{rx.dose}</p>
                  <p className="mt-1 text-xs text-forest-300">{rx.prescriber} · {rx.issued}</p>
                </div>
                <StatusPill status={rx.status} />
              </div>
            </Card>
            <Card pad={false} className="p-5">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">Care team</h3>
              <div className="mt-2.5 flex items-center gap-2.5">
                <Avatar name={patient.gp} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-forest">{patient.gp}</p>
                  <p className="text-[11px] text-forest-400">Assigned GP · last visit {patient.lastVisit}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2.5">
                <Avatar name="Dr. Obi Nnamdi" size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-forest">Dr. Obi Nnamdi</p>
                  <p className="text-[11px] text-forest-400">Surgeon · consulted 03 Jul</p>
                </div>
              </div>
            </Card>
          </div>
        ),
      },
      {
        title: 'Emergency contact',
        wide: true,
        body: (
          <Card pad={false} className="max-w-sm p-5">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">Next of kin</h3>
            <p className="mt-2.5 text-sm font-medium text-forest">{bio.nextOfKin.split(' · ')[0]}</p>
            <p className="text-[13px] text-forest-400">{bio.nextOfKin.split(' · ').slice(1).join(' · ')}</p>
            <div className="mt-3">
              <Tag>Emergency contact</Tag>
            </div>
          </Card>
        ),
      },
    ],
    a11y: [
      'Card titles are real headings in small caps — the rail reads as a document outline.',
      'Allergy severity is carried by the danger tone plus the word, never colour alone.',
      'Identifiers and dates use tabular figures so rail values align.',
    ],
  },
  {
    slug: 'vitals',
    description:
      'Observations as a row of tiles for the latest reading, with a trend card for any measure that matters over time. Tiles stay compact so five fit above the fold.',
    code: `<VitalsRow vitals={bio.vitals} />`,
    examples: [
      {
        title: 'Latest observations',
        wide: true,
        body: <VitalsRow vitals={bio.vitals} />,
      },
      {
        title: 'Trend card',
        note: 'The same AreaChart the dashboards use, scoped to one patient measure.',
        wide: true,
        body: (
          <Card className="max-w-xl">
            <CardHeader title="Weight trend" subtitle="Last six visits, kg" />
            <div className="mt-4">
              <AreaChart
                data={bio.weightSeries}
                labels={['−5', '−4', '−3', '−2', '−1', 'Latest']}
                height={140}
                line="#5833fb"
                fill="#5833fb"
                seriesLabel="Weight"
                valueFormat={(v) => `${v.toFixed(1)} kg`}
                showAxes={false}
              />
            </div>
          </Card>
        ),
      },
    ],
    a11y: [
      'Each tile pairs a visible label with the value — no unit-less numbers.',
      'Values use tabular figures; units are visually quieter but still in the text.',
      'The trend chart has a hover tooltip and the same data belongs in a table nearby for non-visual access.',
    ],
  },
]
