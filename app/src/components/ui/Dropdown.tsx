import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface DropdownItem {
  label: string
  icon?: LucideIcon
  /** Right-aligned hint, e.g. a shortcut. */
  hint?: ReactNode
  danger?: boolean
  disabled?: boolean
  onSelect?: () => void
  /** Renders a separator above this item. */
  separator?: boolean
}

/**
 * Action menu behind a trigger — row actions, account menus, “more” buttons.
 * Arrow keys move, Enter selects, Escape closes.
 *
 * The menu is portalled to the body and positioned with `fixed` off the
 * trigger's rect, so it is never clipped by a scrolling/`overflow` ancestor
 * (e.g. a DataTable). It closes on scroll or resize to stay anchored.
 */
export function Dropdown({
  trigger,
  items,
  align = 'left',
  side = 'bottom',
  block,
  className,
}: {
  trigger: ReactNode | ((open: boolean) => ReactNode)
  items: DropdownItem[]
  align?: 'left' | 'right'
  /** Prefer opening above the trigger; the menu also flips up automatically
      when there isn't room below. */
  side?: 'bottom' | 'top'
  /** Fill the container width — trigger stretches and its content can truncate. */
  block?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState<{ top: number; left: number; maxHeight: number } | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const enabled = items.map((item, i) => ({ item, i })).filter(({ item }) => !item.disabled)

  useEffect(() => {
    if (open) setActive(enabled[0]?.i ?? 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Measure the rendered menu, then place it off the trigger's viewport rect —
  // flipping to the side with more room and clamping both axes so it is always
  // fully on screen. A menu taller than the space available is capped and
  // scrolls internally rather than spilling off the top/bottom edge.
  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    const trigger = wrapRef.current
    const menu = menuRef.current
    if (!trigger || !menu) return
    const gap = 6
    const margin = 8
    const vw = window.innerWidth
    const vh = window.innerHeight
    const r = trigger.getBoundingClientRect()
    const mw = menu.offsetWidth
    const mh = menu.scrollHeight
    const roomBelow = vh - r.bottom - margin
    const roomAbove = r.top - margin
    let openUp = side === 'top'
    if (openUp && mh > roomAbove && roomBelow > roomAbove) openUp = false
    if (!openUp && mh > roomBelow && roomAbove > roomBelow) openUp = true
    const room = openUp ? roomAbove : roomBelow
    const maxHeight = Math.max(140, Math.min(mh, room))
    const top = Math.max(
      margin,
      Math.min(openUp ? r.top - gap - maxHeight : r.bottom + gap, vh - maxHeight - margin),
    )
    const left = Math.max(margin, Math.min(align === 'right' ? r.right - mw : r.left, vw - mw - margin))
    setPos({ top, left, maxHeight })
  }, [open, side, align, items.length])

  // Keep the keyboard-focused row visible when the menu is scrolling.
  useEffect(() => {
    if (!open || !pos || !menuRef.current) return
    const rows = menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]')
    // Optional-chain the method itself — jsdom (tests) doesn't implement it.
    rows[active]?.scrollIntoView?.({ block: 'nearest' })
  }, [active, open, pos])

  // Dismiss: click outside (trigger AND menu), Escape, or any scroll/resize.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node
      if (wrapRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const close = () => setOpen(false)
    // Close when an ancestor scrolls (the menu would drift), but not when the
    // menu itself scrolls internally.
    const onScroll = (e: Event) => {
      if (menuRef.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown, { passive: true })
    document.addEventListener('keydown', onKey)
    // capture: catch scrolls inside any overflow ancestor, not just the window.
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  const move = (dir: 1 | -1) => {
    const pos = enabled.findIndex(({ i }) => i === active)
    const next = enabled[(pos + dir + enabled.length) % enabled.length]
    if (next) setActive(next.i)
  }

  const select = (item: DropdownItem) => {
    if (item.disabled) return
    setOpen(false)
    item.onSelect?.()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      move(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      move(-1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = items[active]
      if (item) select(item)
    }
  }

  return (
    <div ref={wrapRef} className={cn('relative', block ? 'flex w-full' : 'inline-flex', className)} onKeyDown={onKeyDown}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50',
          block ? 'flex w-full min-w-0' : 'inline-flex',
        )}
      >
        {typeof trigger === 'function' ? trigger(open) : trigger}
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={
              pos
                ? { position: 'fixed', top: pos.top, left: pos.left, maxHeight: pos.maxHeight }
                : { position: 'fixed', top: 0, left: 0, visibility: 'hidden' }
            }
            className={cn(
              'z-[80] min-w-52 max-w-[calc(100vw-1rem)] overflow-y-auto overscroll-contain animate-pop rounded-3xl border border-hair bg-white p-1.5 shadow-pop',
              !pos && 'pointer-events-none',
            )}
          >
            {items.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={`${item.label}_${i}`}>
                  {item.separator && <div className="mx-2 my-1.5 border-t border-hair" />}
                  <button
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => select(item)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition-colors',
                      item.danger ? 'text-rose-ink' : 'text-forest-500',
                      i === active && !item.disabled && (item.danger ? 'bg-rose-soft' : 'bg-panel text-forest'),
                      item.disabled && 'opacity-40',
                    )}
                  >
                    {Icon && <Icon size={15} className={item.danger ? 'text-rose-ink' : 'text-forest-300'} />}
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.hint && <span className="shrink-0 text-[11px] text-forest-300">{item.hint}</span>}
                  </button>
                </div>
              )
            })}
          </div>,
          document.body,
        )}
    </div>
  )
}
