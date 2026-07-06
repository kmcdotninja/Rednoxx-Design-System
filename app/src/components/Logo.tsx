import { cn } from '@/lib/cn'

/**
 * The Rednoxx mark — the brand-violet circle glyph, served from /mark.svg so
 * the favicon and in-app mark always match.
 */
export function Mark({ className }: { className?: string }) {
  return <img src="/mark.svg" alt="" aria-hidden="true" className={cn('block', className)} />
}

/** Full Rednoxx logotype (mark + wordmark), served from /logo.svg. */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src="/logo.svg"
      alt="Rednoxx"
      draggable={false}
      className={cn('block h-7 w-auto select-none', className)}
    />
  )
}
