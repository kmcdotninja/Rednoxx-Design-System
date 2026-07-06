import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useDismiss } from '@/lib/useDismiss'

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
 */
export function Dropdown({
  trigger,
  items,
  align = 'left',
  className,
}: {
  trigger: ReactNode | ((open: boolean) => ReactNode)
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  useDismiss(wrapRef, open, () => setOpen(false))

  const enabled = items.map((item, i) => ({ item, i })).filter(({ item }) => !item.disabled)

  useEffect(() => {
    if (open) setActive(enabled[0]?.i ?? 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div ref={wrapRef} className={cn('relative inline-flex', className)} onKeyDown={onKeyDown}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50"
      >
        {typeof trigger === 'function' ? trigger(open) : trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute top-[calc(100%+6px)] z-50 min-w-52 animate-pop rounded-3xl border border-hair bg-white p-1.5 shadow-pop',
            align === 'right' ? 'right-0' : 'left-0',
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
        </div>
      )}
    </div>
  )
}
