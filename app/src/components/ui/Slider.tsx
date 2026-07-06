import { cn } from '@/lib/cn'

/**
 * Range slider with a filled track and value readout — pain scales, dosage,
 * thresholds. Built on the native input for full keyboard and SR support.
 */
export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  format = (v) => String(v),
  disabled,
  className,
}: {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Accessible name; also shown above the track. */
  label: string
  /** Formats the value readout (e.g. `v => `${v}mg``). */
  format?: (value: number) => string
  disabled?: boolean
  className?: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className={cn(disabled && 'opacity-50', className)}>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-forest-500">{label}</span>
        <span className="tnum text-[13px] font-medium text-forest">{format(value)}</span>
      </div>
      <div className="relative flex h-5 items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-panel" />
        <div className="absolute h-1.5 rounded-full bg-azure" style={{ width: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            'absolute inset-x-0 h-5 w-full cursor-pointer appearance-none bg-transparent',
            '[&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-hair',
            '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-chip',
            '[&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-hair [&::-moz-range-thumb]:bg-white',
            'focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-azure/50',
            'disabled:cursor-not-allowed',
          )}
        />
      </div>
      <div className="mt-1 flex justify-between">
        <span className="tnum text-[11px] text-forest-300">{format(min)}</span>
        <span className="tnum text-[11px] text-forest-300">{format(max)}</span>
      </div>
    </div>
  )
}
