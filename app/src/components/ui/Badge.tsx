import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'lime' | 'info'

const tones: Record<Tone, { wrap: string; dot: string }> = {
  success: { wrap: 'bg-teal-soft text-teal', dot: 'bg-teal' },
  warning: { wrap: 'bg-orange-soft text-orange-600', dot: 'bg-orange' },
  danger: { wrap: 'bg-rose-soft text-rose-ink', dot: 'bg-rose-ink' },
  neutral: { wrap: 'bg-panel text-forest-400', dot: 'bg-forest-300' },
  lime: { wrap: 'bg-lime-100 text-forest-500', dot: 'bg-lime-500' },
  info: { wrap: 'bg-forest-50 text-forest-500', dot: 'bg-forest-400' },
}

export function Badge({
  tone = 'neutral',
  dot,
  className,
  children,
}: {
  tone?: Tone
  dot?: boolean
  className?: string
  children: ReactNode
}) {
  const t = tones[tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        t.wrap,
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', t.dot)} />}
      {children}
    </span>
  )
}

/** Tiny pill used for meta tags like `v4`, `0.05%`. */
export function Tag({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg bg-panel px-2 py-0.5 text-xs font-medium text-forest-400',
        className,
      )}
    >
      {children}
    </span>
  )
}

const statusTone: Record<string, Tone> = {
  // generic
  draft: 'neutral',
  pending: 'warning',
  approved: 'success',
  completed: 'success',
  rejected: 'danger',
  ongoing: 'warning',
  cancelled: 'danger',
  active: 'success',
  inactive: 'neutral',
  scheduled: 'info',
  disbursed: 'success',
  // project lifecycle
  on_marketplace: 'info',
  recommended: 'lime',
  selected: 'lime',
  accepted: 'success',
  in_progress: 'warning',
  // onboarding
  not_started: 'neutral',
  submitted: 'warning',
  verified: 'success',
  // misc
  failed: 'danger',
}

export function StatusPill({ status, className }: { status: string; className?: string }) {
  const tone = statusTone[status] ?? 'neutral'
  return (
    <Badge tone={tone} dot className={className}>
      {status.replace(/_/g, ' ')}
    </Badge>
  )
}
