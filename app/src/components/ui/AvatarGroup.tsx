import { Avatar } from './Avatar'
import { cn } from '@/lib/cn'

/**
 * Overlapping avatar stack with an overflow chip — care teams, viewers,
 * participants. `compact` tightens the overlap for dense rows.
 */
export function AvatarGroup({
  names,
  max = 4,
  size = 'sm',
  compact,
  className,
}: {
  names: string[]
  /** Avatars shown before folding into a +N chip. */
  max?: number
  size?: 'xs' | 'sm' | 'md'
  compact?: boolean
  className?: string
}) {
  const shown = names.slice(0, max)
  const rest = names.length - shown.length
  const chipSize = { xs: 'h-7 w-7 text-[10px]', sm: 'h-9 w-9 text-xs', md: 'h-10 w-10 text-[13px]' }[size]

  return (
    <span
      className={cn('flex items-center', compact ? '-space-x-3' : '-space-x-2', className)}
      role="group"
      aria-label={`${names.length} people`}
    >
      {shown.map((name) => (
        <Avatar key={name} name={name} size={size} />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            'tnum z-10 inline-flex items-center justify-center rounded-full bg-panel font-medium text-forest-500 ring-2 ring-white',
            chipSize,
          )}
          title={names.slice(max).join(', ')}
        >
          +{rest}
        </span>
      )}
    </span>
  )
}
