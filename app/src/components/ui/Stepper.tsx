import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface Step {
  title: string
  label: string
}

export function Stepper({
  steps,
  current,
  onSelect,
}: {
  steps: Step[]
  current: number
  onSelect?: (index: number) => void
}) {
  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        const isLast = i === steps.length - 1
        return (
          <li key={step.title} className="relative flex gap-3.5">
            {/* connector */}
            {!isLast && (
              <span
                className={cn(
                  'absolute left-[15px] top-9 h-[calc(100%-1.5rem)] w-px',
                  done ? 'bg-forest-200' : 'bg-hair',
                )}
              />
            )}
            <button
              type="button"
              onClick={() => onSelect?.(i)}
              className={cn(
                'relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-medium transition-all duration-200',
                done && 'bg-forest text-white',
                active && 'bg-forest text-white shadow-soft ring-4 ring-forest-100',
                !done && !active && 'bg-panel text-forest-300',
              )}
            >
              {done ? <Check size={15} strokeWidth={3} /> : i + 1}
            </button>
            <div className={cn('pb-8', isLast && 'pb-0')}>
              <p
                className={cn(
                  'text-xs font-medium',
                  active || done ? 'text-forest-400' : 'text-forest-300',
                )}
              >
                {step.title}
              </p>
              <p
                className={cn(
                  'mt-0.5 text-[15px] font-medium transition-colors',
                  active ? 'text-forest' : done ? 'text-forest-500' : 'text-forest-300',
                )}
              >
                {step.label}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Horizontal stepper — numbered circles joined by connectors, for wizards
 * that fit on one row (the vertical Stepper handles long checklists).
 */
export function HorizontalStepper({
  steps,
  current,
  onSelect,
}: {
  /** Step labels, in order. */
  steps: string[]
  current: number
  onSelect?: (index: number) => void
}) {
  return (
    <ol className="flex items-center">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        const isLast = i === steps.length - 1
        return (
          <li key={label} className={cn('flex items-center', !isLast && 'flex-1')}>
            <button
              type="button"
              onClick={() => onSelect?.(i)}
              aria-current={active ? 'step' : undefined}
              className="group flex items-center gap-2.5"
            >
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-medium transition-all duration-200',
                  done && 'bg-forest text-white',
                  active && 'bg-forest text-white ring-4 ring-forest-100',
                  !done && !active && 'bg-panel text-forest-300',
                )}
              >
                {done ? <Check size={13} strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  'whitespace-nowrap text-[13px] font-medium transition-colors',
                  active ? 'text-forest' : done ? 'text-forest-500' : 'text-forest-300',
                )}
              >
                {label}
              </span>
            </button>
            {!isLast && (
              <span className={cn('mx-3 h-px flex-1', done ? 'bg-forest-200' : 'bg-hair')} />
            )}
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Dot stepper — position within a short sequence (carousels, micro-wizards)
 * when labels would be noise. The active dot elongates.
 */
export function DotStepper({
  count,
  current,
  onSelect,
  className,
}: {
  count: number
  current: number
  onSelect?: (index: number) => void
  className?: string
}) {
  return (
    <div role="tablist" aria-label={`Step ${current + 1} of ${count}`} className={cn('flex items-center gap-1.5', className)}>
      {Array.from({ length: count }).map((_, i) => {
        const active = i === current
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Step ${i + 1}`}
            onClick={() => onSelect?.(i)}
            disabled={!onSelect}
            className={cn(
              'h-2 rounded-full transition-all duration-200',
              active ? 'w-6 bg-azure' : 'w-2 bg-navy-200',
              onSelect && !active && 'hover:bg-navy-300',
            )}
          />
        )
      })}
    </div>
  )
}
