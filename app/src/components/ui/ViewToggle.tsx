import { LayoutGrid, Rows3 } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ViewMode = 'table' | 'grid'

const OPTIONS = {
  grid: { icon: LayoutGrid, label: 'Grid view' },
  table: { icon: Rows3, label: 'Table view' },
} as const

/** Segmented grid/table switch for listing pages. `first` sets the leading option — match it to the page's default view. */
export function ViewToggle({
  value,
  onChange,
  first = 'grid',
  className,
}: {
  value: ViewMode
  onChange: (view: ViewMode) => void
  first?: ViewMode
  className?: string
}) {
  const order: ViewMode[] = first === 'table' ? ['table', 'grid'] : ['grid', 'table']
  return (
    <div className={cn('flex shrink-0 items-center gap-0.5 rounded-xl border border-hair bg-white p-0.5', className)}>
      {order.map((view) => {
        const { icon: Icon, label } = OPTIONS[view]
        return (
          <button
            key={view}
            type="button"
            onClick={() => onChange(view)}
            aria-label={label}
            aria-pressed={value === view}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors',
              value === view ? 'bg-panel text-navy' : 'text-navy-300 hover:text-navy-500',
            )}
          >
            <Icon size={15} />
          </button>
        )
      })}
    </div>
  )
}
