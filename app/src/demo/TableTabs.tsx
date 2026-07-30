import { Tabs, type TabItem } from '@/components/ui'
import { cn } from '@/lib/cn'

/**
 * A table's facet filter — `'all'` is always first and means "no filter".
 * Pages keep this in state and filter their rows with
 * `filter === 'all' || facetOf(row) === filter`.
 */
export type Facet<S extends string> = 'all' | S

/** "Sentence case" a facet value: `in_progress` → `In progress`. */
function facetLabel(value: string): string {
  return (value.charAt(0).toUpperCase() + value.slice(1)).replaceAll('_', ' ')
}

/**
 * Filter tabs for demo tables — every DataTable in the demo carries this strip
 * above it: "All" first with the total count, then one tab per facet value
 * (usually a status) with its own count, all computed from the rows. Selecting
 * a tab filters the table. Wraps the `Tabs` primitive on the card's hairline —
 * no forked styling. Pass `labels` only when the derived sentence-case label
 * isn't right.
 */
export function TableTabs<T, S extends string>({
  rows,
  facetOf,
  order,
  labels,
  value,
  onChange,
  className,
}: {
  rows: readonly T[]
  facetOf: (row: T) => S
  order: readonly S[]
  labels?: Partial<Record<S, string>>
  value: Facet<S>
  onChange: (value: Facet<S>) => void
  className?: string
}) {
  const items: TabItem<Facet<S>>[] = [
    { value: 'all', label: 'All', count: rows.length },
    ...order.map((facet) => ({
      value: facet,
      label: labels?.[facet] ?? facetLabel(facet),
      count: rows.filter((r) => facetOf(r) === facet).length,
    })),
  ]
  return (
    <div className={cn('border-b border-hair', className)}>
      <Tabs items={items} value={value} onChange={onChange} />
    </div>
  )
}
