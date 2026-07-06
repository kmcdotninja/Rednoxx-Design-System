import type { ReactNode } from 'react'
import { CircleCheck, Info, OctagonAlert, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/cn'

type Tone = 'info' | 'success' | 'warning' | 'danger'

const tones: Record<
  Tone,
  { wrap: string; iconColor: string; icon: typeof Info }
> = {
  info: { wrap: 'bg-azure-50', iconColor: 'text-azure-600', icon: Info },
  success: { wrap: 'bg-mint-soft', iconColor: 'text-mint', icon: CircleCheck },
  warning: { wrap: 'bg-gold-soft', iconColor: 'text-gold-600', icon: TriangleAlert },
  danger: { wrap: 'bg-rose-soft', iconColor: 'text-rose-ink', icon: OctagonAlert },
}

/**
 * Inline contextual message for a page or section — stays in the layout flow
 * (use Toast for transient confirmations). Warnings and dangers announce as
 * `role="alert"`; quieter tones as `role="status"`.
 */
export function Alert({
  tone = 'info',
  title,
  children,
  action,
  onDismiss,
  className,
}: {
  tone?: Tone
  title: ReactNode
  /** Optional supporting copy under the title. */
  children?: ReactNode
  /** Optional action rendered under the copy (e.g. a small button or link). */
  action?: ReactNode
  /** Renders a dismiss button when provided. */
  onDismiss?: () => void
  className?: string
}) {
  const t = tones[tone]
  const Icon = t.icon
  return (
    <div
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-3xl px-4 py-3.5', t.wrap, className)}
    >
      <Icon size={18} className={cn('mt-0.5 shrink-0', t.iconColor)} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-forest">{title}</p>
        {children && (
          <div className="mt-0.5 text-[13px] leading-relaxed text-forest-500">{children}</div>
        )}
        {action && <div className="mt-2.5">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-m-1.5 flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-xl text-forest-400 transition-colors hover:bg-white/60 hover:text-forest"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
