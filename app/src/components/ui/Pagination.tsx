import type { ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Page-number strip with gaps, e.g. 1 … 4 5 6 … 12 (0-based indices). */
export function pageItems(pages: number, current: number): (number | 'gap')[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i)
  const around = [current - 1, current, current + 1].filter((p) => p > 0 && p < pages - 1)
  const items: (number | 'gap')[] = [0]
  if (around.length > 0 && around[0] > 1) items.push('gap')
  items.push(...around)
  if (around.length > 0 && around[around.length - 1] < pages - 2) items.push('gap')
  items.push(pages - 1)
  return items
}

function PagerButton({
  children,
  disabled,
  onClick,
  label,
}: {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-xl border border-hair bg-white text-navy-500 transition-colors hover:bg-panel disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}

/**
 * Standalone page controls — previous/next plus a windowed number strip.
 * `page` is 0-based; pair with your own “Showing x–y of z” summary if needed.
 */
export function Pagination({
  page,
  pages,
  onChange,
  className,
}: {
  page: number
  pages: number
  onChange: (page: number) => void
  className?: string
}) {
  if (pages <= 1) return null
  const current = Math.min(Math.max(page, 0), pages - 1)
  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)}>
      <PagerButton label="Previous page" disabled={current === 0} onClick={() => onChange(current - 1)}>
        <ChevronLeft size={15} />
      </PagerButton>
      {pageItems(pages, current).map((item, i) =>
        item === 'gap' ? (
          <span key={`gap_${i}`} aria-hidden className="px-1 text-[13px] text-navy-300">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === current ? 'page' : undefined}
            aria-label={`Page ${item + 1}`}
            className={cn(
              'tnum h-8 min-w-8 rounded-xl px-1.5 text-[13px] transition-colors',
              item === current ? 'bg-navy font-medium text-white' : 'text-navy-500 hover:bg-panel',
            )}
          >
            {item + 1}
          </button>
        ),
      )}
      <PagerButton label="Next page" disabled={current >= pages - 1} onClick={() => onChange(current + 1)}>
        <ChevronRight size={15} />
      </PagerButton>
    </nav>
  )
}
