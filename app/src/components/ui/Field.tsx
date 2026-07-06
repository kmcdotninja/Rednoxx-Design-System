import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

const baseField =
  'w-full rounded-2xl border border-hair bg-white text-sm text-forest placeholder:text-forest-300 ' +
  'transition-[border-color,box-shadow,background-color] duration-150 focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure-50 ' +
  'disabled:bg-panel disabled:text-forest-300'

/** Danger styling for invalid controls — overrides border and focus ring. */
const invalidField = 'border-rose-ink focus:border-rose-ink focus:ring-rose-soft'

export function Field({
  label,
  hint,
  error,
  required,
  optional,
  children,
  className,
}: {
  label?: ReactNode
  hint?: ReactNode
  /** Validation message — replaces the hint and announces as an alert. */
  error?: ReactNode
  required?: boolean
  optional?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[13px] font-medium text-forest-500">
            {label}
            {required && <span className="ml-0.5 text-orange">*</span>}
          </span>
          {optional && (
            <span className="text-[11px] font-medium text-forest-300">Optional</span>
          )}
        </div>
      )}
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium leading-relaxed text-rose-ink">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs leading-relaxed text-forest-400">{hint}</p>
      )}
    </label>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Danger border + ring; pair with Field's `error` message. */
  invalid?: boolean
}

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(baseField, 'h-10 px-3', invalid && invalidField, className)}
      {...props}
    />
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export function Textarea({ className, rows = 4, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(baseField, 'resize-none px-4 py-3 leading-relaxed', invalid && invalidField, className)}
      {...props}
    />
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

export function Select({ className, children, invalid, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          baseField,
          'h-10 cursor-pointer appearance-none pl-3 pr-9 font-medium',
          invalid && invalidField,
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-300"
        size={18}
      />
    </div>
  )
}

/** Small label/value pair used in detail panels. */
export function KeyValue({
  label,
  value,
  className,
}: {
  label: ReactNode
  value: ReactNode
  className?: string
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="text-xs font-medium text-forest-400">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-medium text-forest">{value}</dd>
    </div>
  )
}
