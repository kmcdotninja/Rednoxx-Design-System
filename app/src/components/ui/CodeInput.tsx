import { useRef } from 'react'
import { cn } from '@/lib/cn'

/**
 * Segmented one-time-code input — auto-advance, backspace to the previous
 * cell, and paste distributes the whole code. Controlled via a plain string.
 */
export function CodeInput({
  length = 6,
  value,
  onChange,
  onComplete,
  error,
  disabled,
  className,
}: {
  length?: number
  value: string
  onChange: (value: string) => void
  /** Fired once when all cells are filled. */
  onComplete?: (value: string) => void
  /** Paints the cells in the danger tone (wrong code). */
  error?: boolean
  disabled?: boolean
  className?: string
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const commit = (next: string) => {
    onChange(next)
    if (next.length === length && !next.includes(' ')) onComplete?.(next)
  }

  const setDigit = (index: number, digit: string) => {
    const chars = value.padEnd(length, ' ').split('')
    chars[index] = digit
    commit(chars.join('').trimEnd())
    if (digit && index < length - 1) refs.current[index + 1]?.focus()
  }

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index]?.trim() && index > 0) {
      refs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      refs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      refs.current[index + 1]?.focus()
    }
  }

  const onPaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!digits) return
    e.preventDefault()
    commit(digits)
    refs.current[Math.min(digits.length, length - 1)]?.focus()
  }

  return (
    <div className={cn('flex gap-2', className)} onPaste={onPaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          value={value[i]?.trim() ?? ''}
          onChange={(e) => {
            const digit = e.target.value.replace(/\D/g, '').slice(-1)
            setDigit(i, digit)
          }}
          onKeyDown={(e) => onKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className={cn(
            'tnum h-12 w-10 rounded-2xl border bg-white text-center text-[17px] font-medium text-forest',
            'transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-4',
            error
              ? 'border-rose-ink focus:border-rose-ink focus:ring-rose-soft'
              : 'border-hair focus:border-azure focus:ring-azure-50',
            'disabled:bg-panel disabled:text-forest-300',
          )}
        />
      ))}
    </div>
  )
}
