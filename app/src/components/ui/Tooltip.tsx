import { useState, type ReactNode } from 'react'
import { Info } from 'lucide-react'
import { cn } from '@/lib/cn'

type Side = 'top' | 'bottom' | 'left' | 'right'
type Size = 'xs' | 'sm' | 'md'

const positions: Record<Side, string> = {
  top: 'bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2',
  bottom: 'top-[calc(100%+8px)] left-1/2 -translate-x-1/2',
  left: 'right-[calc(100%+8px)] top-1/2 -translate-y-1/2',
  right: 'left-[calc(100%+8px)] top-1/2 -translate-y-1/2',
}

const arrows: Record<Side, string> = {
  top: '-bottom-1 left-1/2 -ml-1',
  bottom: '-top-1 left-1/2 -ml-1',
  left: '-right-1 top-1/2 -mt-1',
  right: '-left-1 top-1/2 -mt-1',
}

const sizes: Record<Size, string> = {
  /** One-line label — icon buttons, truncated values. */
  xs: 'whitespace-nowrap px-2 py-1 text-[11px]',
  /** Short sentence. */
  sm: 'w-48 px-3 py-2 text-[11px] leading-relaxed',
  /** Definition-length copy. */
  md: 'w-64 px-3.5 py-2.5 text-xs leading-relaxed',
}

/** Hover/focus tooltip bubble anchored to its trigger on any side. */
export function Tooltip({
  content,
  children,
  side = 'top',
  size = 'md',
  className,
}: {
  content: ReactNode
  children: ReactNode
  side?: Side
  size?: Size
  className?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 animate-pop rounded-2xl bg-navy font-medium text-white shadow-pop',
            positions[side],
            sizes[size],
          )}
        >
          {content}
          <span aria-hidden className={cn('absolute h-2 w-2 rotate-45 bg-navy', arrows[side])} />
        </span>
      )}
    </span>
  )
}

/** The little ⓘ icon that reveals a description on hover — keeps forms tidy. */
export function InfoTip({ content, className }: { content: ReactNode; className?: string }) {
  return (
    <Tooltip content={content} className={className}>
      <span tabIndex={0} className="inline-flex cursor-help items-center justify-center rounded-full text-navy-300 outline-none transition-colors hover:text-navy-500 focus-visible:text-navy-500">
        <Info size={14} />
      </span>
    </Tooltip>
  )
}
