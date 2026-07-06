import { useId } from 'react'
import { cn } from '@/lib/cn'

export interface RadioOption<T extends string> {
  value: T
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
}

/** Native radio group with the system's dot, labels and descriptions. */
export function RadioGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  inline,
  className,
}: {
  options: RadioOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Accessible name for the group. */
  label: string
  /** Lay options out in a row instead of a column. */
  inline?: boolean
  className?: string
}) {
  const name = useId()
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(inline ? 'flex flex-wrap gap-x-5 gap-y-2' : 'space-y-2.5', className)}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex cursor-pointer items-start gap-2.5',
            option.disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <input
            type="radio"
            name={name}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onChange(option.value)}
            className={cn(
              'mt-0.5 h-[18px] w-[18px] shrink-0 appearance-none rounded-full border border-hair bg-white',
              'transition-[border-color,border-width] duration-150 checked:border-[5px] checked:border-azure',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50 focus-visible:ring-offset-1',
            )}
          />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-forest">{option.label}</span>
            {option.description && (
              <span className="mt-0.5 block text-[13px] leading-relaxed text-forest-400">
                {option.description}
              </span>
            )}
          </span>
        </label>
      ))}
    </div>
  )
}
