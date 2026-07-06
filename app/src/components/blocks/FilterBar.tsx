import type { ReactNode } from 'react'
import { SearchInput } from '@/components/ui'
import { cn } from '@/lib/cn'

/**
 * The list-screen toolbar: search on the left, page-level actions pushed to
 * the right. Status buckets belong in the Tabs component directly above the
 * table — one switcher pattern across the product.
 */
export function FilterBar({
  search,
  children,
  className,
}: {
  search?: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    /** Accessible name — what is being searched. */
    label: string
  }
  /** Right-aligned actions (buttons, selects, date chips). */
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {search && (
        <SearchInput
          placeholder={search.placeholder}
          aria-label={search.label}
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
          wrapClassName="w-full max-w-xs"
        />
      )}
      {children && <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}
