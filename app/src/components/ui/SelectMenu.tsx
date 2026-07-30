import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface SelectMenuOption<T extends string = string> {
  value: T
  label: string
  /** Quiet right-aligned meta text, e.g. an MRN. */
  hint?: string
  disabled?: boolean
}

const PANEL_MAX_H = 264 // matches max-h-64

/**
 * Custom-rendered single select — our own option panel instead of the native
 * picker, so options match the design language on every OS. The panel portals
 * to <body> with fixed positioning, so it never clips inside modal/drawer
 * scroll containers and flips upward when out of viewport room. Full listbox
 * semantics: arrows move, Enter/Space choose, Escape closes (the menu only),
 * Home/End jump. For long lists that need filtering use Combobox; for menus
 * of actions use Dropdown.
 */
export function SelectMenu<T extends string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select…',
  size = 'md',
  side = 'auto',
  invalid,
  disabled,
  className,
}: {
  options: SelectMenuOption<T>[]
  value?: T
  /** Uncontrolled initial value — ignored when `value` is provided. */
  defaultValue?: T
  onChange?: (value: T) => void
  placeholder?: string
  /** `sm` for toolbar-height pickers. */
  size?: 'sm' | 'md'
  /** Panel direction; `auto` flips upward when viewport room below runs out. */
  side?: 'auto' | 'bottom' | 'top'
  invalid?: boolean
  disabled?: boolean
  className?: string
}) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [inner, setInner] = useState<T | undefined>(defaultValue)
  const current = value !== undefined ? value : inner
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLUListElement>(null)

  const selected = options.find((o) => o.value === current)
  const enabled = options.map((o, i) => ({ o, i })).filter(({ o }) => !o.disabled)

  const measure = () => {
    const r = triggerRef.current?.getBoundingClientRect()
    if (!r) return
    const roomBelow = window.innerHeight - r.bottom
    const up = side === 'top' || (side === 'auto' && roomBelow < PANEL_MAX_H && r.top > roomBelow)
    setPos({
      left: r.left,
      width: r.width,
      ...(up ? { bottom: window.innerHeight - r.top + 6 } : { top: r.bottom + 6 }),
    })
  }

  // Keep the panel glued to the trigger while anything scrolls or resizes.
  useEffect(() => {
    if (!open) return
    measure()
    window.addEventListener('scroll', measure, true)
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Outside pointerdown closes — the portalled panel counts as inside.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (open) {
      const selectedIndex = options.findIndex((o) => o.value === current && !o.disabled)
      setActive(selectedIndex >= 0 ? selectedIndex : (enabled[0]?.i ?? 0))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    panelRef.current
      ?.querySelector(`#${CSS.escape(`${listId}-${active}`)}`)
      ?.scrollIntoView?.({ block: 'nearest' })
  }, [open, active, listId])

  const move = (dir: 1 | -1) => {
    if (enabled.length === 0) return
    const at = enabled.findIndex(({ i }) => i === active)
    const next = enabled[(at + dir + enabled.length) % enabled.length]
    setActive(next.i)
  }

  const pick = (option: SelectMenuOption<T>) => {
    if (option.disabled) return
    setInner(option.value)
    onChange?.(option.value)
    setOpen(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setOpen(true)
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      move(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      move(-1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(enabled[0]?.i ?? 0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(enabled[enabled.length - 1]?.i ?? 0)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const option = options[active]
      if (option) pick(option)
    } else if (e.key === 'Escape') {
      // The menu owns this Escape — a parent Modal/Drawer must not close too.
      e.stopPropagation()
      setOpen(false)
    }
  }

  return (
    <div className={cn('relative', className)} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-2xl border border-hair bg-white text-left text-forest',
          'transition-[border-color,box-shadow] focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure-50',
          'disabled:pointer-events-none disabled:opacity-40',
          size === 'sm' ? 'h-8 rounded-xl px-2.5 text-[13px]' : 'h-10 px-3 text-sm',
          invalid && 'border-rose-ink focus:border-rose-ink focus:ring-rose-soft',
        )}
      >
        <span className={cn('truncate', !selected && 'text-forest-300')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={size === 'sm' ? 14 : 16}
          className={cn('shrink-0 text-forest-300 transition-transform duration-150', open && 'rotate-180')}
        />
      </button>

      {open &&
        pos &&
        createPortal(
          <ul
            ref={panelRef}
            id={listId}
            role="listbox"
            aria-activedescendant={`${listId}-${active}`}
            style={{ left: pos.left, top: pos.top, bottom: pos.bottom, width: Math.max(pos.width, 208) }}
            className="fixed z-[80] max-h-64 overflow-y-auto rounded-3xl border border-hair bg-white p-1.5 shadow-pop animate-pop"
          >
            {options.map((option, i) => {
              const isSelected = option.value === current
              return (
                <li
                  key={option.value}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  onMouseEnter={() => !option.disabled && setActive(i)}
                  onClick={() => pick(option)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-[13px]',
                    option.disabled
                      ? 'cursor-not-allowed text-forest-300'
                      : active === i
                        ? 'bg-panel text-forest'
                        : 'text-forest-500',
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {option.hint && (
                    <span className="tnum shrink-0 font-mono text-xs text-forest-400">{option.hint}</span>
                  )}
                  {isSelected && <Check size={14} className="shrink-0 text-azure" />}
                </li>
              )
            })}
          </ul>,
          document.body,
        )}
    </div>
  )
}
