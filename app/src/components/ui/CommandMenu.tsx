import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import { isTopLayer, popLayer, pushLayer } from '@/lib/layerStack'
import { Kbd } from './Kbd'

export interface Command {
  id: string
  label: string
  /** Section heading the command is grouped under. */
  group: string
  icon?: LucideIcon
  /** Quiet meta text, e.g. an MRN or route. */
  hint?: string
  keywords?: string
  onSelect: () => void
}

/** Binds ⌘K / Ctrl+K to toggle the menu. Returns [open, setOpen]. */
export function useCommandMenu(): [boolean, (open: boolean) => void] {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  return [open, setOpen]
}

/**
 * The ⌘K palette — search commands, pages and records from anywhere.
 * Arrow keys move, Enter runs, Escape closes.
 */
export function CommandMenu({
  open,
  onClose,
  commands,
  placeholder = 'Search or jump to…',
}: {
  open: boolean
  onClose: () => void
  commands: Command[]
  placeholder?: string
}) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const layerId = useRef(Symbol('command-menu'))
  useEffect(() => {
    if (!open) return
    const id = layerId.current
    pushLayer(id)
    setQuery('')
    setActive(0)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTopLayer(id)) onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      popLayer(id)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      `${c.label} ${c.group} ${c.hint ?? ''} ${c.keywords ?? ''}`.toLowerCase().includes(q),
    )
  }, [commands, query])

  const groups = useMemo(() => {
    const order: string[] = []
    const byGroup = new Map<string, Command[]>()
    for (const c of filtered) {
      if (!byGroup.has(c.group)) {
        byGroup.set(c.group, [])
        order.push(c.group)
      }
      byGroup.get(c.group)!.push(c)
    }
    return order.map((g) => ({ group: g, items: byGroup.get(g)! }))
  }, [filtered])

  const run = (command: Command) => {
    onClose()
    command.onSelect()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[active]) run(filtered[active])
    }
  }

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[14vh]">
      <div className="absolute inset-0 animate-fade-in bg-forest-900/25 backdrop-blur-[3px]" onClick={onClose} />
      <div
        role="dialog"
        aria-label="Command menu"
        className="relative flex max-h-[60vh] w-full max-w-lg animate-pop flex-col overflow-hidden rounded-4xl border border-hair bg-white shadow-pop"
      >
        <div className="flex items-center gap-3 border-b border-hair px-4">
          <Search size={16} className="shrink-0 text-forest-300" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label="Search commands"
            className="h-12 flex-1 bg-transparent text-sm text-forest placeholder:text-forest-300 focus:outline-none"
          />
          <Kbd>esc</Kbd>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto p-1.5">
          {filtered.length === 0 && (
            <p className="px-3 py-8 text-center text-[13px] text-forest-400">
              Nothing matches “{query}”.
            </p>
          )}
          {groups.map(({ group, items }) => (
            <div key={group}>
              <p className="px-3 pb-1 pt-3 text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
                {group}
              </p>
              {items.map((command) => {
                const index = filtered.indexOf(command)
                const Icon = command.icon
                return (
                  <button
                    key={command.id}
                    type="button"
                    data-index={index}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => run(command)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors',
                      index === active ? 'bg-panel text-forest' : 'text-forest-500',
                    )}
                  >
                    {Icon && <Icon size={15} className="shrink-0 text-forest-300" />}
                    <span className="flex-1 truncate">{command.label}</span>
                    {command.hint && <span className="tnum shrink-0 text-[11px] text-forest-300">{command.hint}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-hair px-4 py-2.5 text-[11px] text-forest-300">
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd> open
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
