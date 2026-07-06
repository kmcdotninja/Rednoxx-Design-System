import { cn } from '@/lib/cn'

/** Pulsing placeholder block — size it with width/height utilities. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded-xl bg-navy-100/80', className)} />
}

/** A stack of text-shaped skeleton lines; the last line is shorter. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div aria-hidden className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn('h-3.5 animate-pulse rounded-md bg-navy-100/80', i === lines - 1 ? 'w-3/5' : 'w-full')}
        />
      ))}
    </div>
  )
}

/** Small inline spinner + label for in-place loading. */
export function InlineLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-[13px] text-forest-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-hair border-t-azure" />
      {label}
    </span>
  )
}
