import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Hairline separator — horizontal by default, optional centered label. */
export function Divider({
  label,
  vertical,
  className,
}: {
  label?: ReactNode
  /** Renders a full-height vertical rule (parent controls the height). */
  vertical?: boolean
  className?: string
}) {
  if (vertical) {
    return <span role="separator" aria-orientation="vertical" className={cn('mx-2 w-px self-stretch bg-hair', className)} />
  }
  if (label) {
    return (
      <div role="separator" className={cn('flex items-center gap-3', className)}>
        <span className="h-px flex-1 bg-hair" />
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">{label}</span>
        <span className="h-px flex-1 bg-hair" />
      </div>
    )
  }
  return <hr className={cn('border-0 border-t border-hair', className)} />
}
