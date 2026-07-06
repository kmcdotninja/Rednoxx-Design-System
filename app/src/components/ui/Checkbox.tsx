import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Native checkbox with the system's box, label and optional description. */
export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
  className?: string
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-2.5',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer h-[18px] w-[18px] appearance-none rounded-lg border border-hair bg-white transition-colors duration-150 checked:border-azure checked:bg-azure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50 focus-visible:ring-offset-1"
        />
        <Check
          size={12}
          strokeWidth={3.5}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-forest">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[13px] leading-relaxed text-forest-400">{description}</span>
        )}
      </span>
    </label>
  )
}
