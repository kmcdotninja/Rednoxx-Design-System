import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Attached buttons acting as one control — view switchers, toolbars, split
 * actions. Children should be secondary/subtle Buttons; borders collapse
 * between them.
 */
export function ButtonGroup({
  children,
  className,
  'aria-label': ariaLabel,
}: {
  children: ReactNode
  className?: string
  'aria-label'?: string
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-stretch',
        '[&>*]:rounded-none [&>*:not(:first-child)]:-ml-px',
        '[&>*:focus-visible]:z-10 [&>*:hover]:z-10',
        className,
      )}
    >
      {children}
    </div>
  )
}
