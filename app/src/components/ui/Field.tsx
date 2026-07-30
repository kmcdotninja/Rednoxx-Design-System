import { Children, createContext, isValidElement, useContext, useEffect, useId, useRef, useState } from 'react'
import type {
  ButtonHTMLAttributes,
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { Check, ChevronDown, Eye, EyeOff } from 'lucide-react'
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
            {required && (
              <span className="ml-0.5 text-rose-ink" aria-hidden>
                *
              </span>
            )}
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

/**
 * Mouse/keyboard handlers are dropped from the public type: the trigger is a
 * button, not a `<select>`, so a caller-supplied `onKeyDown` typed against
 * HTMLSelectElement would be a lie. `onChange` keeps its select signature —
 * that is the contract every call site already reads `e.target.value` from.
 */
interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onClick' | 'onKeyDown' | 'size'> {
  invalid?: boolean
}

interface ParsedOption {
  value: string
  label: string
  disabled?: boolean
}

/** Flatten `<option>` / `<optgroup>` children into plain data. */
function parseOptions(children: ReactNode): ParsedOption[] {
  const out: ParsedOption[] = []
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return
    const props = child.props as {
      value?: string | number
      children?: ReactNode
      disabled?: boolean
    }
    if (child.type === 'optgroup') {
      out.push(...parseOptions(props.children))
      return
    }
    if (child.type !== 'option') return
    const label = typeof props.children === 'string' ? props.children : String(props.children ?? '')
    out.push({ value: String(props.value ?? label), label, disabled: props.disabled })
  })
  return out
}

/**
 * Single-choice select. Deliberately **not** a native `<select>` — the OS popup
 * ignores our tokens, renders at system scale and can't be styled for the
 * clinical density this product needs, so it's a custom listbox throughout.
 *
 * The API is unchanged: pass `<option>` children and read `e.target.value` in
 * `onChange`. Callers get an event-shaped payload, and a hidden input carries
 * `name`/`value` so native form submission still works.
 */
export function Select({
  className,
  children,
  invalid,
  value,
  defaultValue,
  onChange,
  disabled,
  name,
  required,
  id,
  ...rest
}: SelectProps) {
  const describedBy = useFieldDescription()
  const options = parseOptions(children)

  const isControlled = value !== undefined
  const [internal, setInternal] = useState(() => String(defaultValue ?? options[0]?.value ?? ''))
  const current = String(isControlled ? value : internal)
  const selected = options.find((o) => o.value === current)

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  useEffect(() => {
    if (open) setActive(Math.max(0, options.findIndex((o) => o.value === current)))
    // `options` is rebuilt each render from children; keying on `open` is what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const commit = (option: ParsedOption) => {
    if (option.disabled) return
    if (!isControlled) setInternal(option.value)
    setOpen(false)
    // Callers read `e.target.value`; hand them that shape.
    onChange?.({
      target: { value: option.value, name: name ?? '' },
      currentTarget: { value: option.value, name: name ?? '' },
    } as unknown as ChangeEvent<HTMLSelectElement>)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setOpen(true)
      return
    }
    if (!open) return
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(options.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(options.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const option = options[active]
      if (option) commit(option)
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className={cn(
          baseField,
          'flex h-10 cursor-pointer items-center pl-3 pr-9 text-left font-medium',
          !selected && 'font-normal text-forest-300',
          invalid && invalidField,
          className,
        )}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <span className="truncate">{selected?.label ?? ''}</span>
      </button>
      <ChevronDown
        className={cn(
          'pointer-events-none absolute right-3.5 top-5 -translate-y-1/2 text-forest-300 transition-transform duration-150',
          open && 'rotate-180',
        )}
        size={18}
      />
      {/* Keeps native form submission working for callers that rely on it. */}
      <input type="hidden" name={name} value={current} />

      {open && (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Options"
          className="absolute z-50 mt-1 max-h-64 w-full animate-pop overflow-y-auto border border-hair bg-white py-1 shadow-pop"
        >
          {options.map((option, i) => {
            const isSelected = option.value === current
            return (
              <div
                key={option.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                onMouseEnter={() => setActive(i)}
                onClick={() => commit(option)}
                className={cn(
                  'flex min-h-10 cursor-pointer items-center gap-2 px-3 text-sm',
                  option.disabled && 'cursor-not-allowed text-forest-300',
                  !option.disabled && i === active && 'bg-panel',
                  isSelected ? 'font-medium text-forest' : 'text-forest-500',
                )}
              >
                <Check
                  size={15}
                  className={cn('shrink-0 text-azure', !isSelected && 'invisible')}
                  aria-hidden
                />
                <span className="truncate">{option.label}</span>
              </div>
            )
          })}
        </div>
      )}
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
