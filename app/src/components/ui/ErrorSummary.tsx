import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface FormError {
  /** id of the offending control — clicking the summary link focuses it. */
  fieldId: string
  message: ReactNode
}

/**
 * Top-of-form error summary for long forms (>3 fields): announces as an
 * alert, receives focus when it appears, and each item is an anchor that
 * moves focus to its field.
 */
export function ErrorSummary({
  errors,
  title = 'There is a problem',
  className,
}: {
  errors: FormError[]
  title?: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (errors.length > 0) ref.current?.focus()
  }, [errors.length])

  if (errors.length === 0) return null

  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className={cn(
        'rounded-3xl border border-rose-ink/25 bg-rose-soft/60 px-4 py-3.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-soft',
        className,
      )}
    >
      <p className="flex items-center gap-2 text-sm font-medium text-rose-ink">
        <CircleAlert size={15} aria-hidden />
        {title}
      </p>
      <ul className="mt-2 space-y-1 pl-6">
        {errors.map((e) => (
          <li key={e.fieldId}>
            <a
              href={`#${e.fieldId}`}
              onClick={(event) => {
                event.preventDefault()
                document.getElementById(e.fieldId)?.focus()
              }}
              className="text-[13px] font-medium text-rose-ink underline underline-offset-2 hover:no-underline"
            >
              {e.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
