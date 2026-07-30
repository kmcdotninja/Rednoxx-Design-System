/**
 * Small shared pieces for the HIM Intake screens: RBAC helper, patient status
 * badges/notices (used on every patient-scoped screen, not just the banner),
 * and the standard loading / empty / error states every list reuses.
 */
import type { ReactNode } from 'react'
import { AlertCircle, ArrowRightLeft, Lock, ShieldAlert } from 'lucide-react'
import { Badge, Button, Skeleton } from '@/components/ui'
import { CURRENT_HIM_USER } from './data'
import type { HimPermission, PatientStatusFlag } from './types'

/* ------------------------------- RBAC ----------------------------------- */

export function can(permission: HimPermission): boolean {
  return CURRENT_HIM_USER.permissions.includes(permission)
}

/* --------------------------- Status badges ------------------------------- */

type Tone = 'success' | 'warning' | 'danger' | 'neutral'

const STATUS_TONE: Record<PatientStatusFlag, Tone> = {
  deceased: 'danger',
  restricted: 'danger',
  merged: 'warning',
  temporary: 'warning',
}

const STATUS_LABEL: Record<PatientStatusFlag, string> = {
  deceased: 'Deceased',
  restricted: 'Restricted',
  merged: 'Merged',
  temporary: 'Temporary',
}

/** Renders every active status flag as a pill — never colour alone (§4.3). */
export function PatientStatusBadges({
  flags,
  className,
}: {
  flags: PatientStatusFlag[]
  className?: string
}) {
  if (flags.length === 0) return null
  return (
    <div className={className ?? 'flex flex-wrap items-center gap-1.5'}>
      {flags.map((flag) => (
        <Badge key={flag} tone={STATUS_TONE[flag]} dot>
          {STATUS_LABEL[flag]}
        </Badge>
      ))}
    </div>
  )
}

export function PatientStatusNotices({
  flags,
  mergedIntoId,
  mrn,
  onOpenSurvivor,
}: {
  flags: PatientStatusFlag[]
  mergedIntoId?: string | null
  /** Original permanent MRN — retained after merge (FR-HIM-ID-007 / Jira AC). */
  mrn?: string | null
  onOpenSurvivor?: (id: string) => void
}) {
  const merged = flags.includes('merged')
  const deceased = flags.includes('deceased')
  const temporary = flags.includes('temporary')
  if (!merged && !deceased && !temporary) return null

  return (
    <div className="space-y-2">
      {merged && (
        <div className="space-y-2">
          <div className="rounded-2xl bg-orange-soft px-4 py-3 text-[13px] text-orange-600">
            <p className="flex items-start gap-2.5 font-medium">
              <ArrowRightLeft size={15} className="mt-0.5 shrink-0" />
              <span>
                This record has been merged
                {mrn ? (
                  <>
                    {' '}
                    — original MRN{' '}
                    <span className="tnum font-mono font-medium text-forest">{mrn}</span> is
                    retained and cannot be deleted or reused.
                  </>
                ) : (
                  '. The original MRN is retained and cannot be deleted or reused.'
                )}
              </span>
            </p>
          </div>
          {mergedIntoId && onOpenSurvivor && (
            <button
              type="button"
              onClick={() => onOpenSurvivor(mergedIntoId)}
              className="flex w-full items-center gap-2.5 rounded-2xl border border-orange-600/20 bg-white px-4 py-3 text-left text-[13px] font-medium text-orange-600 transition-colors hover:bg-orange-soft/40"
            >
              <ArrowRightLeft size={15} className="shrink-0" />
              Open the surviving record →
            </button>
          )}
        </div>
      )}
      {deceased && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-rose-soft px-4 py-3 text-[13px] text-rose-ink">
          <ShieldAlert size={15} className="shrink-0" />
          This patient is recorded as deceased. Routine registration actions are disabled. The
          permanent MRN remains on the record and is not deleted.
        </div>
      )}
      {temporary && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-panel px-4 py-3 text-[13px] text-forest-400">
          <ArrowRightLeft size={15} className="shrink-0" />
          This is a temporary record awaiting reconciliation.
        </div>
      )}
    </div>
  )
}

/** Blocks a whole screen behind an access-request notice for restricted
 *  records — used wherever a restricted patient would otherwise render full
 *  detail. Request-access itself. */
export function RestrictedGate() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-hair bg-white px-4 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-soft text-rose-ink">
        <Lock size={20} />
      </span>
      <div>
        <p className="text-[15px] font-medium text-forest">This record is restricted</p>
        <p className="mt-1 max-w-sm text-[13px] text-forest-400">
          Full detail is hidden until an access decision is made. Requesting access is not yet
          available in this build (HIM-S23).
        </p>
      </div>
    </div>
  )
}

/* --------------------------- Shared states ------------------------------- */

/** Page title row, shared across the HIM screens. */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[26px] font-medium leading-[1.2] tracking-[-0.02em] text-forest">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-[13px] leading-relaxed text-forest-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

/** Skeleton table body for list loading states. */
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={c === 0 ? 'h-9 flex-2' : 'h-9 flex-1'} />
          ))}
        </div>
      ))}
    </div>
  )
}

/** Standard error state with retry — never a bare "Something went wrong". */
export function ErrorState({
  message,
  onRetry,
  title = 'Couldn’t load',
}: {
  message: string
  onRetry: () => void
  title?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-soft text-rose-ink">
        <AlertCircle size={20} />
      </span>
      <div>
        <p className="text-[15px] font-medium text-forest">{title}</p>
        <p className="mt-1 text-[13px] text-forest-400">{message}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  )
}
