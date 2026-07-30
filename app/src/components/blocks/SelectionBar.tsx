import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Floating bulk-action bar — appears at the bottom-centre when a table (or any
 * multi-select surface) has a selection, and carries the actions that apply to
 * the whole selection. Presentational: the caller owns the count, the actions
 * (passed as children — design-system Buttons) and the clear handler.
 *
 * Renders nothing when `count` is 0, so callers can mount it unconditionally.
 */
export function SelectionBar({
  count,
  onClear,
  children,
  noun = 'selected',
  framed,
  className,
}: {
  count: number
  onClear: () => void
  /** Action buttons for the selection (e.g. Activate / Deactivate / Delete). */
  children: ReactNode
  /** Word after the count — e.g. "selected", "flagged". */
  noun?: string
  /** Render inline (no portal, not fixed) — for the design-system showcase. */
  framed?: boolean
  className?: string
}) {
  if (count === 0 && !framed) return null
  const bar = (
    <div
      role="region"
      aria-label={`${count} ${noun}`}
      className={cn(
        'flex items-center gap-1 rounded-2xl border border-hair bg-white p-1.5 pl-1.5 shadow-pop',
        !framed && 'animate-rise pointer-events-auto',
        className,
      )}
    >
      <span className="flex items-center gap-1.5 rounded-xl bg-panel px-2.5 py-1.5 text-[13px] font-medium text-forest">
        <span className="tnum tabular-nums">{count}</span>
        <span className="text-forest-400">{noun}</span>
      </span>
      <span className="mx-0.5 h-5 w-px shrink-0 bg-hair" aria-hidden />
      <div className="flex items-center gap-1">{children}</div>
      <span className="mx-0.5 h-5 w-px shrink-0 bg-hair" aria-hidden />
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear selection"
        className="flex h-8 w-8 items-center justify-center rounded-xl text-forest-400 transition-colors hover:bg-panel hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50"
      >
        <X size={16} />
      </button>
    </div>
  )
  if (framed) return bar
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">{bar}</div>,
    document.body,
  )
}
