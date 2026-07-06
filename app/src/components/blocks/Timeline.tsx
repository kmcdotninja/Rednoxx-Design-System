import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface TimelineEvent {
  /** Short timestamp or date shown above the title. */
  meta: string
  title: ReactNode
  description?: ReactNode
  icon?: LucideIcon
  tone?: 'default' | 'brand' | 'success' | 'danger'
}

const dotTone: Record<NonNullable<TimelineEvent['tone']>, string> = {
  default: 'bg-white text-forest-400 border-hair',
  brand: 'bg-azure-50 text-azure border-azure-200',
  success: 'bg-mint-soft text-mint border-mint-soft',
  danger: 'bg-rose-soft text-rose-ink border-rose-soft',
}

/**
 * Vertical event timeline — medical history, admissions, audit trails.
 * Events are newest-first by convention; the rail connects the markers.
 */
export function Timeline({ events, className }: { events: TimelineEvent[]; className?: string }) {
  return (
    <ol className={cn('relative space-y-6 border-l border-hair pl-6 ml-3.5', className)}>
      {events.map((event, i) => {
        const Icon = event.icon
        return (
          <li key={i} className="relative">
            <span
              className={cn(
                'absolute -left-[37px] flex h-7 w-7 items-center justify-center rounded-full border',
                dotTone[event.tone ?? 'default'],
              )}
            >
              {Icon ? <Icon size={13} aria-hidden /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </span>
            <p className="tnum text-[11px] font-medium uppercase tracking-[0.06em] text-forest-300">
              {event.meta}
            </p>
            <p className="mt-0.5 text-sm font-medium text-forest">{event.title}</p>
            {event.description && (
              <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-forest-400">{event.description}</p>
            )}
          </li>
        )
      })}
    </ol>
  )
}
