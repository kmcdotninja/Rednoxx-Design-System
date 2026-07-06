import { useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useDismiss } from '@/lib/useDismiss'

/**
 * Anchored floating panel for rich content — notification trays, previews,
 * mini-forms. Click the trigger to toggle; Escape or an outside click closes.
 * For plain action lists use Dropdown; for text hints use Tooltip.
 */
export function Popover({
  trigger,
  children,
  align = 'left',
  panelClassName,
  className,
}: {
  /** The always-visible element; the whole thing toggles the panel. */
  trigger: ReactNode | ((open: boolean) => ReactNode)
  children: ReactNode
  align?: 'left' | 'right'
  panelClassName?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  useDismiss(wrapRef, open, () => setOpen(false))

  return (
    <div ref={wrapRef} className={cn('relative inline-flex', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50"
      >
        {typeof trigger === 'function' ? trigger(open) : trigger}
      </button>
      {open && (
        <div
          role="dialog"
          className={cn(
            'absolute top-[calc(100%+6px)] z-50 w-80 animate-pop rounded-3xl border border-hair bg-white shadow-pop',
            align === 'right' ? 'right-0' : 'left-0',
            panelClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
