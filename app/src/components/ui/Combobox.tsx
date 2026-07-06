import { useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useDismiss } from '@/lib/useDismiss'

export interface ComboOption {
  value: string
  label: string
  /** Quiet right-aligned meta text, e.g. a code or count. */
  hint?: string
}

/**
 * Searchable single-select for long lists — type to filter, arrow keys to move,
 * Enter to choose, Escape to close. Prefer the plain Select under ~10 options.
 */
export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No matches found',
  disabled,
  className,
}: {
  options: ComboOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
}) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)

  const close = () => {
    setOpen(false)
    setQuery('')
    setActive(0)
  }
  useDismiss(wrapRef, open, close)

  const selected = options.find((o) => o.value === value)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  const pick = (option: ComboOption) => {
    onChange?.(option.value)
    close()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(filtered.length - 1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[active]) pick(filtered[active])
    }
  }

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (open ? close() : setOpen(true))}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-2xl border border-hair bg-white px-3 text-sm',
          'transition-[border-color,box-shadow] hover:border-forest-200 focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure-50',
          'disabled:bg-panel disabled:text-forest-300 disabled:pointer-events-none',
        )}
      >
        <span className={cn('truncate', selected ? 'font-medium text-forest' : 'text-forest-300')}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={18}
          className={cn('shrink-0 text-forest-300 transition-transform duration-150', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-full min-w-[220px] animate-pop rounded-3xl border border-hair bg-white p-2 shadow-pop">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-forest-300"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActive(0)
              }}
              onKeyDown={onKeyDown}
              placeholder={searchPlaceholder}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={filtered[active] ? `${listId}-${filtered[active].value}` : undefined}
              aria-autocomplete="list"
              className="h-9 w-full rounded-xl bg-panel pl-9 pr-3 text-sm text-forest placeholder:text-forest-300 focus:outline-none"
            />
          </div>

          <ul id={listId} role="listbox" className="mt-1.5 max-h-56 space-y-0.5 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-3 py-6 text-center text-[13px] text-forest-400">{emptyText}</li>
            )}
            {filtered.map((option, i) => {
              const isSelected = option.value === value
              return (
                <li
                  key={option.value}
                  id={`${listId}-${option.value}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(option)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                    i === active ? 'bg-panel text-forest' : 'text-forest-500',
                  )}
                >
                  <span className={cn('truncate', isSelected && 'font-medium text-forest')}>
                    {option.label}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {option.hint && <span className="text-xs text-forest-300">{option.hint}</span>}
                    {isSelected && <Check size={15} className="text-azure" />}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
