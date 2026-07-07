import { createContext, useContext, useId, useState } from 'react'
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/cn'

/** Field → control channel: the id of the hint/error text, so controls can
    point aria-describedby at it without wiring ids by hand. */
const FieldDescription = createContext<string | undefined>(undefined)

function useFieldDescription() {
  return useContext(FieldDescription)
}

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
  const descriptionId = useId()
  const hasDescription = Boolean(error || hint)
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
      <FieldDescription value={hasDescription ? descriptionId : undefined}>
        {children}
      </FieldDescription>
      {error ? (
        <p id={descriptionId} role="alert" className="mt-1.5 text-xs font-medium leading-relaxed text-rose-ink">
          {error}
        </p>
      ) : (
        hint && (
          <p id={descriptionId} className="mt-1.5 text-xs leading-relaxed text-forest-400">
            {hint}
          </p>
        )
      )}
    </label>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Danger border + ring; pair with Field's `error` message. */
  invalid?: boolean
}

export function Input({ className, invalid, ...props }: InputProps) {
  const describedBy = useFieldDescription()
  return (
    <input
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={cn(baseField, 'h-10 px-3', invalid && invalidField, className)}
      {...props}
    />
  )
}

/** Input for secrets: type="password" with a show/hide eye toggle. */
export function PasswordInput({
  className,
  invalid,
  disabled,
  ...props
}: Omit<InputProps, 'type'>) {
  const [visible, setVisible] = useState(false)
  const describedBy = useFieldDescription()
  const Icon = visible ? EyeOff : Eye
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        className={cn(baseField, 'h-10 pl-3 pr-10', invalid && invalidField, className)}
        {...props}
      />
      <button
        type="button"
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        disabled={disabled}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-forest-300 transition-colors duration-150 hover:text-forest-500 focus:outline-none focus-visible:text-forest-500 focus-visible:ring-4 focus-visible:ring-azure-50 disabled:hidden"
      >
        <Icon size={16} aria-hidden />
      </button>
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export function Textarea({ className, rows = 4, invalid, ...props }: TextareaProps) {
  const describedBy = useFieldDescription()
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={cn(baseField, 'resize-none px-4 py-3 leading-relaxed', invalid && invalidField, className)}
      {...props}
    />
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

export function Select({ className, children, invalid, ...props }: SelectProps) {
  const describedBy = useFieldDescription()
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
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
