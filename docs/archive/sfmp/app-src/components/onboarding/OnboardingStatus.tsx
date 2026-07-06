import { useState, type ReactNode } from 'react'
import { Check, Clock3, FileText, Pencil, ShieldCheck, XCircle } from 'lucide-react'
import { Badge, Button, Card, CardHeader, KeyValue, Segmented, StatusPill, type SegOption } from '@/components/ui'
import { DocumentViewer } from '@/components/DocumentViewer'
import { useStore } from '@/store/AppStore'
import { useAccount } from '@/components/shell/AccountContext'
import { useDomain } from '@/components/shell/RoleContext'
import type { FileRef, OnboardStatus as Status } from '@/data/types'
import { cn } from '@/lib/cn'

/* ------------------------------ review timeline ---------------------------- */

type StepState = 'done' | 'active' | 'upcoming' | 'failed'

function TimelineStep({
  state,
  title,
  body,
  isLast,
}: {
  state: StepState
  title: string
  body: string
  isLast?: boolean
}) {
  return (
    <li className="relative flex gap-3.5">
      {!isLast && (
        <span className={cn('absolute left-[15px] top-9 h-[calc(100%-1.25rem)] w-px', state === 'done' ? 'bg-navy-200' : 'bg-hair')} />
      )}
      <span
        className={cn(
          'relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          state === 'done' && 'bg-navy text-white',
          state === 'active' && 'bg-gold-soft text-gold-600 ring-4 ring-gold-soft/50',
          state === 'upcoming' && 'bg-panel text-navy-300',
          state === 'failed' && 'bg-rose-soft text-rose-ink',
        )}
      >
        {state === 'done' ? (
          <Check size={15} strokeWidth={3} />
        ) : state === 'active' ? (
          <Clock3 size={15} />
        ) : state === 'failed' ? (
          <XCircle size={15} />
        ) : (
          <ShieldCheck size={15} />
        )}
        {state === 'active' && <span className="absolute inline-flex h-full w-full rounded-full bg-gold/40 gx-ping" />}
      </span>
      <div className={cn('pb-7', isLast && 'pb-0')}>
        <p className={cn('text-sm font-medium', state === 'upcoming' ? 'text-navy-300' : state === 'failed' ? 'text-rose-ink' : 'text-navy')}>
          {title}
        </p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-navy-400">{body}</p>
      </div>
    </li>
  )
}

/* ------------------------------- status view ------------------------------- */

export interface SubmittedFact {
  label: string
  value: ReactNode
}

/**
 * The onboarding-status view shown when a submission is with the SFMP team
 * (or was declined) — a review timeline plus everything that was submitted.
 */
export function OnboardingStatus({
  status,
  facts,
  documents,
  onEdit,
  rejectedNote,
}: {
  status: Extract<Status, 'submitted' | 'rejected'>
  facts: SubmittedFact[]
  documents: FileRef[]
  onEdit: () => void
  rejectedNote?: string
}) {
  const { company } = useAccount()
  const rejected = status === 'rejected'
  const [viewing, setViewing] = useState<FileRef | null>(null)

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_1fr]">
      {/* Review progress */}
      <Card className="h-fit">
        <div className="flex items-start gap-3">
          <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', rejected ? 'bg-rose-soft text-rose-ink' : 'bg-gold-soft text-gold-600')}>
            {rejected ? <XCircle size={22} /> : <Clock3 size={22} />}
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-medium text-navy">
              {rejected ? 'Onboarding declined' : 'Under review'}
            </p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-navy-400">
              {rejected
                ? 'The SFMP team could not verify your submission. Review the notes and resubmit.'
                : 'Your submission is with the SFMP team. Most reviews complete within 2 business days.'}
            </p>
          </div>
        </div>

        <ol className="mt-6 flex flex-col border-t border-hair pt-5">
          <TimelineStep state="done" title="Onboarding submitted" body={`${company} submitted its corporate profile for review.`} />
          <TimelineStep
            state={rejected ? 'failed' : 'active'}
            title={rejected ? 'Review declined' : 'SFMP team review'}
            body={
              rejected
                ? rejectedNote ?? 'Details could not be verified — update your profile and resubmit.'
                : 'Compliance is verifying your company details, directors and documents.'
            }
          />
          <TimelineStep
            state="upcoming"
            title="Verified — marketplace unlocked"
            body="Projects, funding and advisory unlock the moment you're verified."
            isLast
          />
        </ol>

        <div className="mt-6 border-t border-hair pt-5">
          <Button variant={rejected ? 'primary' : 'secondary'} block leftIcon={<Pencil size={15} />} onClick={onEdit}>
            {rejected ? 'Update & resubmit' : 'Update submission'}
          </Button>
          {!rejected && (
            <p className="mt-2.5 text-center text-xs text-navy-400">Editing re-submits your profile for a fresh review.</p>
          )}
        </div>
      </Card>

      {/* What was submitted */}
      <div className="space-y-5">
        <Card>
          <CardHeader
            title="Submitted details"
            subtitle="What the SFMP team is reviewing"
            action={<StatusPill status={status} />}
          />
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {facts.map((f) => (
              <KeyValue key={f.label} label={f.label} value={f.value} />
            ))}
          </dl>
        </Card>

        <Card>
          <CardHeader title="Documents" subtitle="Files included in your submission" action={<Badge tone="neutral">{documents.length} file(s)</Badge>} />
          {documents.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-panel/70 px-4 py-3 text-[13px] text-navy-400">
              No documents were attached — adding them speeds up review.
            </p>
          ) : (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {documents.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setViewing(d)}
                  className="flex items-center gap-3 rounded-2xl border border-hair bg-white px-4 py-3 text-left transition-colors hover:border-navy-200 hover:bg-panel/40"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint-soft text-mint">
                    <FileText size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-navy">{d.name}</p>
                    <p className="text-xs text-navy-400">{d.sizeKb} KB · received · click to view</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      <DocumentViewer file={viewing} owner={company} onClose={() => setViewing(null)} />
    </div>
  )
}

/* --------------------------- demo state switcher --------------------------- */

const DEMO_STATES: SegOption<Status>[] = [
  { value: 'not_started', label: 'Not started' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
]

/** Demo-only control: flip the acting company through each onboarding state to
 *  preview the banner, sidebar pill, gates and this page in every stage. */
export function DemoStatePicker() {
  const domain = useDomain()
  const { company, onboarding } = useAccount()
  const { setOnboardingStatus } = useStore()

  if (domain === 'admin') return null

  return (
    <div className="mt-6 flex flex-col gap-2.5 rounded-3xl border border-dashed border-hair bg-panel/40 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[13px] font-medium text-navy">Demo · preview onboarding states</p>
        <p className="text-xs text-navy-400">Flip {company} through each stage — the banner, sidebar and gates all follow.</p>
      </div>
      <Segmented<Status>
        size="sm"
        options={DEMO_STATES}
        value={(DEMO_STATES.some((s) => s.value === onboarding) ? onboarding : 'not_started') as Status}
        onChange={(s) => setOnboardingStatus(domain, company, s)}
      />
    </div>
  )
}
