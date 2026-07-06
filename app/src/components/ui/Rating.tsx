import { Star } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Star rating — interactive when `onChange` is given, read-only otherwise
 * (patient-satisfaction scores, facility reviews).
 */
export function Rating({
  value,
  onChange,
  max = 5,
  size = 18,
  className,
}: {
  value: number
  onChange?: (value: number) => void
  max?: number
  size?: number
  className?: string
}) {
  const readOnly = !onChange
  return (
    <span
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={readOnly ? `${value} of ${max} stars` : 'Rating'}
      className={cn('inline-flex items-center gap-0.5', className)}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < value
        const star = (
          <Star
            size={size}
            className={cn(
              'transition-colors duration-150',
              filled ? 'fill-gold text-gold' : 'fill-navy-100 text-navy-100',
            )}
          />
        )
        if (readOnly) return <span key={i}>{star}</span>
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i + 1}
            aria-label={`${i + 1} star${i > 0 ? 's' : ''}`}
            onClick={() => onChange(i + 1)}
            className="rounded-lg p-0.5 transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50 active:scale-95"
          >
            {star}
          </button>
        )
      })}
    </span>
  )
}
