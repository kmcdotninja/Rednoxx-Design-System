import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Shared look for the app's floating "sticker" pills — the small rounded
 * buttons that hover over a workspace (switch module, escape back to the entry
 * hall / design system). One class so every pill matches: hairline card on
 * white, soft pop shadow, a gentle lift on hover and a real focus ring.
 *
 * Anchors/router `Link`s that need the same look apply this directly; the
 * `FloatingPill` button below is for onClick actions.
 */
export const floatingPillClass =
  'inline-flex items-center gap-2 rounded-full border border-hair bg-white py-2 pl-2.5 pr-3.5 ' +
  'text-[13px] font-medium text-forest shadow-pop transition-[transform,box-shadow] duration-150 ' +
  'hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.96] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50'

/**
 * A single floating action pill (button). Pair an icon with a short label;
 * the label is the accessible name, so icon-only use still needs `aria-label`
 * from the caller.
 */
export function FloatingPill({
  icon,
  children,
  className,
  ...rest
}: { icon?: ReactNode } & ComponentPropsWithoutRef<'button'>) {
  return (
    <button type="button" className={cn(floatingPillClass, className)} {...rest}>
      {icon}
      {children != null && <span className="truncate">{children}</span>}
    </button>
  )
}

/**
 * Fixed bottom-right stack for floating pills. Children stack upward with a
 * 12px gap and align to the right edge, so the first child sits on top and the
 * last hugs the corner. Portalled overlays (module-switch dialog) render fine
 * from inside — the dock only positions its inline pills.
 */
export function FloatingDock({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3', className)}>
      {children}
    </div>
  )
}
