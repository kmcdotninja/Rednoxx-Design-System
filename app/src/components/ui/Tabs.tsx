import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface TabItem<T extends string> {
  value: T
  label: ReactNode
  count?: number
  icon?: LucideIcon
}

/**
 * Vertical tab menu — a left rail of sections with an active bar, for
 * settings-style screens with several sibling panels.
 */
export function VerticalTabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      {items.map((item) => {
        const active = item.value === value
        const Icon = item.icon
        return (
          <button
            key={item.value}
            type="button"
            aria-current={active ? 'true' : undefined}
            onClick={() => onChange(item.value)}
            className={cn(
              'relative flex h-9 items-center gap-2.5 rounded-xl px-3 text-left text-sm transition-colors',
              active ? 'bg-panel font-medium text-forest' : 'text-forest-400 hover:bg-panel/60 hover:text-forest',
            )}
          >
            {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-azure" />}
            {Icon && <Icon size={15} className={active ? 'text-azure' : 'text-forest-300'} />}
            {item.label}
            {typeof item.count === 'number' && (
              <span
                className={cn(
                  'tnum ml-auto inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-md px-1 text-[11px] font-medium',
                  active ? 'bg-white text-forest-600' : 'bg-panel text-forest-400',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Underline tabs — icon + label + quiet gray count pill (Langdock-style). */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  size = 'md',
  className,
}: {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  size?: 'md' | 'lg'
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-6', className)}>
      {items.map((item) => {
        const active = item.value === value
        const Icon = item.icon
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              'group relative -mb-px flex items-center gap-1.5 pb-3 font-medium transition-colors',
              size === 'lg' ? 'text-[15px]' : 'text-sm',
              active ? 'text-forest' : 'text-forest-300 hover:text-forest-500',
            )}
          >
            {Icon && <Icon size={15} className={cn('shrink-0', active ? 'text-forest' : 'text-forest-300 group-hover:text-forest-500')} />}
            {item.label}
            {typeof item.count === 'number' && (
              <span
                className={cn(
                  'tnum ml-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-md px-1 text-[11px] font-medium',
                  active ? 'bg-navy-100 text-forest-600' : 'bg-panel text-forest-400',
                )}
              >
                {item.count}
              </span>
            )}
            {active && (
              <span className="absolute -bottom-px left-0 h-[2px] w-full rounded-full bg-forest" />
            )}
          </button>
        )
      })}
    </div>
  )
}
