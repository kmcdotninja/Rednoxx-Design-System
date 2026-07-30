import type { ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { isTopLayer, popLayer, pushLayer } from '@/lib/layerStack'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  bodyClassName,
}: {
  open: boolean
  onClose: () => void
  title?: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: 'md' | 'lg'
  /** Extra classes on the scrollable body — e.g. a min-height to give a short
      dialog more presence. Width stays governed by `size`. */
  bodyClassName?: string
}) {
  const layerId = useRef(Symbol('modal'))
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()

  // Latest onClose in a ref so the open/close effect depends only on `open` —
  // an inline onClose changing each render would re-run it and steal focus
  // back to the panel on every keystroke (e.g. typing in a Textarea).
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])


  useEffect(() => {
    if (!open) return
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
  }, [open])

  if (!open) return null

  return createPortal(
    // z-[70]: one layer above Drawer (z-[60]) so a confirm modal opened from
    // inside a drawer sits on top; poppers (Dropdown/Select, z-[80]) stay above.
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-forest-900/25 backdrop-blur-[3px]"
        onClick={() => onCloseRef.current()}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-4xl bg-white shadow-pop animate-pop focus:outline-none sm:rounded-4xl',
          size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-lg',
        )}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div className="min-w-0">
            {title && (
              <h3 id={titleId} className="text-[15px] font-medium tracking-[-0.01em] text-forest">
                {title}
              </h3>
            )}
            {subtitle && <p className="mt-1 text-sm text-forest-400">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={() => onCloseRef.current()}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-forest-400 transition-colors hover:bg-panel"
          >
            <X size={18} />
          </button>
        </div>
        <div className={cn('overflow-y-auto px-6 py-5', bodyClassName)}>{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-hair px-6 py-4">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  )
}
