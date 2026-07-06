import { cn } from '@/lib/cn'

type Tone = 'brand' | 'success' | 'warning' | 'danger'

const fills: Record<Tone, string> = {
  brand: 'bg-azure',
  success: 'bg-mint',
  warning: 'bg-gold',
  danger: 'bg-rose-ink',
}

const strokes: Record<Tone, string> = {
  brand: 'stroke-azure',
  success: 'stroke-mint',
  warning: 'stroke-gold',
  danger: 'stroke-rose-ink',
}

/** Linear progress with an optional label/value row above the track. */
export function ProgressBar({
  value,
  label,
  showValue,
  tone = 'brand',
  className,
}: {
  /** 0–100. */
  value: number
  label?: string
  showValue?: boolean
  tone?: Tone
  className?: string
}) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {label && <span className="text-[13px] font-medium text-forest-500">{label}</span>}
          {showValue && <span className="tnum text-[12px] text-forest-400">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-1.5 overflow-hidden rounded-full bg-panel"
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-300', fills[tone])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}

/** Circular progress — utilisation, completeness, capacity at a glance. */
export function ProgressCircle({
  value,
  size = 56,
  strokeWidth = 5,
  tone = 'brand',
  showValue = true,
  label,
  className,
}: {
  /** 0–100. */
  value: number
  size?: number
  strokeWidth?: number
  tone?: Tone
  showValue?: boolean
  label?: string
  className?: string
}) {
  const clamped = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <span
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-navy-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped / 100)}
          className={cn('transition-[stroke-dashoffset] duration-300', strokes[tone])}
        />
      </svg>
      {showValue && (
        <span className="tnum absolute text-[12px] font-medium text-forest">
          {Math.round(clamped)}%
        </span>
      )}
    </span>
  )
}
