import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

export interface Crumb {
  label: ReactNode
  /** Omit on the current (last) page. */
  to?: string
}

/** Hierarchical location trail — the last item is the current page. */
export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex min-w-0 items-center gap-0.5 text-[13px]">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="flex min-w-0 items-center gap-0.5">
              {i > 0 && <ChevronRight size={14} aria-hidden className="shrink-0 text-forest-300" />}
              {item.to && !last ? (
                <Link
                  to={item.to}
                  className="truncate rounded-lg px-1.5 py-1 text-forest-400 transition-colors hover:bg-panel hover:text-forest"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  className={cn('truncate px-1.5 py-1', last ? 'font-medium text-forest' : 'text-forest-400')}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
