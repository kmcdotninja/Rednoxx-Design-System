import type { InputHTMLAttributes, ReactNode } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label?: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        className={cn(
          'relative h-6 w-10 rounded-full transition-colors duration-200',
          checked ? 'bg-forest' : 'bg-hair',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform duration-200',
            checked && 'translate-x-4',
          )}
        />
      </span>
      {label && <span className="text-sm font-medium text-forest-500">{label}</span>}
    </button>
  )
}

export function SearchInput({
  className,
  wrapClassName,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { wrapClassName?: string }) {
  return (
    <div className={cn('relative', wrapClassName)}>
      <Search
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest-300"
      />
      <input
        className={cn(
          'h-10 w-full rounded-2xl border border-hair bg-white pl-11 pr-4 text-sm text-forest placeholder:text-forest-300',
          'transition-[border-color,box-shadow] focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure-50',
          className,
        )}
        {...props}
      />
    </div>
  )
}

export type EmptyVariant =
  | 'document'
  | 'search'
  | 'message'
  | 'calendar'
  | 'folder'
  | 'chart'
  | 'notifications'
  | 'no-access'
  // legacy aliases kept for older call sites
  | 'gem'
  | 'inbox'
  | 'users'

/** Hand-drawn ink illustrations in /public/empty — one per situation. */
const EMPTY_ART: Record<EmptyVariant, string> = {
  document: '/empty/document.svg',
  search: '/empty/nothing-found.svg',
  message: '/empty/message.svg',
  calendar: '/empty/calendar.svg',
  folder: '/empty/folder.svg',
  chart: '/empty/chart.svg',
  notifications: '/empty/notifications.svg',
  'no-access': '/empty/no-access.svg',
  gem: '/empty/document.svg',
  inbox: '/empty/document.svg',
  users: '/empty/folder.svg',
}

export function EmptyState({
  variant = 'document',
  title,
  description,
  action,
  compact,
}: {
  variant?: EmptyVariant
  title: string
  description?: string
  action?: ReactNode
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'px-6 py-10' : 'px-6 py-16',
      )}
    >
      <img
        src={EMPTY_ART[variant]}
        alt=""
        aria-hidden
        draggable={false}
        className={cn('select-none', compact ? 'h-28 w-28' : 'h-44 w-44')}
      />
      <p className={cn('font-medium tracking-[-0.01em] text-forest', compact ? 'mt-2 text-[15px]' : 'mt-3 text-[16px]')}>{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-forest-400">{description}</p>
      )}
      {action && <div className="mt-5 flex items-center gap-4">{action}</div>}
    </div>
  )
}

/** Section heading inside a card/form. */
export function SectionLabel({
  children,
  hint,
}: {
  children: ReactNode
  hint?: ReactNode
}) {
  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">
        {children}
      </h4>
      {hint && <p className="mt-1 text-[13px] text-forest-400 normal-case">{hint}</p>}
    </div>
  )
}
