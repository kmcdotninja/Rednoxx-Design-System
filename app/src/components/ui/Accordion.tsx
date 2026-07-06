import { useId, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface AccordionItem {
  title: ReactNode
  content: ReactNode
}

/**
 * Collapsible sections — one open at a time by default, or several with
 * `multiple`. Panels animate open via the grid-rows technique so height
 * stays fluid.
 */
export function Accordion({
  items,
  multiple,
  defaultOpen = [0],
  className,
}: {
  items: AccordionItem[]
  multiple?: boolean
  /** Indices open initially. */
  defaultOpen?: number[]
  className?: string
}) {
  const baseId = useId()
  const [open, setOpen] = useState<Set<number>>(new Set(defaultOpen))

  const toggle = (index: number) =>
    setOpen((prev) => {
      const next = new Set(multiple ? prev : ([] as number[]))
      if (prev.has(index)) next.delete(index)
      else next.add(index)
      return next
    })

  return (
    <div className={cn('divide-y divide-hair rounded-3xl border border-hair bg-white', className)}>
      {items.map((item, i) => {
        const isOpen = open.has(i)
        return (
          <div key={i}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${baseId}-panel-${i}`}
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-panel/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure/50"
            >
              <span className="text-sm font-medium text-forest">{item.title}</span>
              <ChevronDown
                size={16}
                className={cn('shrink-0 text-forest-300 transition-transform duration-200', isOpen && 'rotate-180')}
              />
            </button>
            <div
              id={`${baseId}-panel-${i}`}
              role="region"
              className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-4 text-sm leading-relaxed text-forest-500">{item.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
