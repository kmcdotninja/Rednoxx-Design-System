import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { isTopLayer, popLayer, pushLayer } from '@/lib/layerStack'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * A floating, detached side drawer — rounded on all corners with a margin from
 * the viewport edge, sliding in from the right. API-compatible with Modal.
 */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title?: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: 'md' | 'lg' | 'xl' | '2xl'
}) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
    } else if (mounted) {
      setClosing(true)
      const t = setTimeout(() => {
        setMounted(false)
        setClosing(false)
      }, 280)
      return () => clearTimeout(t)
    }
  }, [open, mounted])

  const layerId = useRef(Symbol('drawer'))
  // Hold the latest onClose in a ref so the focus-trap effect below depends
  // only on `mounted` — if it depended on the (usually inline) onClose, every
  // parent re-render would re-run it and steal focus back to the panel on each
  // keystroke.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])
  useEffect(() => {
    if (!mounted) return
    const id = layerId.current
    const opener = document.activeElement as HTMLElement | null
    pushLayer(id)
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTopLayer(id)) onCloseRef.current()
      // Focus trap: keep Tab cycling inside the panel.
      if (e.key === 'Tab' && isTopLayer(id) && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (nodes.length === 0) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        const active = document.activeElement
        if (e.shiftKey && (active === first || active === panelRef.current)) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      popLayer(id)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      opener?.focus()
    }
  }, [mounted])

  if (!mounted) return null

  return createPortal(
    // z-[60]: one layer below Modal (z-[70]) so a confirm dialog opened from
    // inside a drawer sits *above* it; poppers (Dropdown/Select, z-[80]) stay
    // above both. Nested same-type dialogs stack by portal/DOM order.
    <div className="fixed inset-0 z-[60]">
      <div
        className={cn(
          'absolute inset-0 bg-forest-900/25 backdrop-blur-[3px]',
          closing ? 'animate-fade-out' : 'animate-fade-in',
        )}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          'absolute right-2 top-2 bottom-2 flex w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-4xl border border-hair bg-white shadow-pop focus:outline-none sm:right-3 sm:top-3 sm:bottom-3',
          size === '2xl'
            ? 'sm:w-[min(1200px,calc(100vw-2rem))]'
            : size === 'xl'
              ? 'sm:w-[640px]'
              : size === 'lg'
                ? 'sm:w-[540px]'
                : 'sm:w-[440px]',
          closing ? 'animate-drawer-out' : 'animate-drawer-in',
        )}
      >
        <div className={cn('flex items-start justify-between gap-4 border-b border-hair py-5', size === '2xl' ? 'px-8' : 'px-6')}>
          <div className="min-w-0">
            {title && (
              <h3 id={titleId} className="text-[15px] font-medium tracking-[-0.01em] text-forest">{title}</h3>
            )}
            {subtitle && <p className="mt-0.5 truncate text-sm text-forest-400">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-forest-400 transition-colors hover:bg-panel hover:text-forest"
          >
            <X size={18} />
          </button>
        </div>

        <div className={cn('flex-1 overflow-y-auto', size === '2xl' ? 'px-8 py-7' : 'px-6 py-5')}>{children}</div>

        {footer && (
          <div className={cn('flex items-center justify-end gap-2 border-t border-hair py-4', size === '2xl' ? 'px-8' : 'px-6')}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
