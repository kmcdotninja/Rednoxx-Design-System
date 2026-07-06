import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

/** The preset palette — calendar categories, tags, ward colour-coding. */
export const SWATCHES = [
  '#5833fb', '#0ea5e9', '#15803d', '#e0a526', '#ea580c',
  '#b91c1c', '#be185d', '#7c3aed', '#0f766e', '#515160',
]

/**
 * Swatch-based colour picker — a fixed, accessible palette rather than a
 * freeform wheel, so category colours stay consistent product-wide.
 */
export function ColorPicker({
  value,
  onChange,
  swatches = SWATCHES,
  label = 'Colour',
  className,
}: {
  value: string
  onChange: (hex: string) => void
  swatches?: string[]
  /** Accessible name for the group. */
  label?: string
  className?: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('flex flex-wrap gap-1.5', className)}>
      {swatches.map((hex) => {
        const active = value.toLowerCase() === hex.toLowerCase()
        return (
          <button
            key={hex}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={hex}
            onClick={() => onChange(hex)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 active:scale-95',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50 focus-visible:ring-offset-1',
              active && 'ring-2 ring-offset-2 ring-navy-300',
            )}
            style={{ background: hex }}
          >
            {active && <Check size={14} strokeWidth={3} className="text-white" />}
          </button>
        )
      })}
    </div>
  )
}
