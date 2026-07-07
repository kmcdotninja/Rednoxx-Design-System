import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

/** `lime` is the legacy name for the solid-ink button; kept for old call sites. */
type Variant = 'primary' | 'lime' | 'secondary' | 'ghost' | 'subtle' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-azure text-white hover:bg-azure-500',
  lime: 'bg-navy text-white hover:bg-navy-600',
  secondary:
    'bg-white text-forest border border-hair hover:bg-panel hover:border-forest-200',
  ghost: 'text-forest-500 hover:bg-panel',
  subtle: 'bg-panel text-forest hover:bg-hair',
  danger: 'bg-rose-soft text-rose-ink hover:brightness-[0.97]',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] rounded-xl gap-1.5',
  md: 'h-9 px-3.5 text-sm rounded-2xl gap-2',
  lg: 'h-11 px-4.5 text-[15px] rounded-2xl gap-2.5',
}

const base =
  'inline-flex items-center justify-center font-medium whitespace-nowrap ' +
  'transition-[transform,background-color,box-shadow,filter,opacity] duration-150 ease-out active:scale-[0.96] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50 focus-visible:ring-offset-1 ' +
  'disabled:opacity-40 disabled:pointer-events-none'

export function buttonClass(
  variant: Variant = 'primary',
  size: Size = 'md',
  block?: boolean,
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], block && 'w-full', className)
}

interface CommonProps {
  variant?: Variant
  size?: Size
  block?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

interface ButtonProps
  extends CommonProps,
    ButtonHTMLAttributes<HTMLButtonElement> {
  /** Disables the button and swaps the left icon for a spinner. Change the
      label alongside ("Saving…") — the live region announces it. */
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  block,
  leftIcon,
  rightIcon,
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClass(variant, size, block, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 size={15} className="animate-spin" aria-hidden /> : leftIcon}
      <span aria-live="polite">{children}</span>
      {rightIcon}
    </button>
  )
}

interface ButtonLinkProps extends CommonProps, Omit<LinkProps, 'className'> {
  className?: string
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  block,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, block, className)} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  )
}
