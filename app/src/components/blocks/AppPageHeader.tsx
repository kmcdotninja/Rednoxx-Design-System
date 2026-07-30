import type { ReactNode } from 'react'

/**
 * The one page-title row used across every workspace (Care, HIM, …): a title,
 * an optional supporting line, and optional right-aligned actions. Both shells
 * render this single block — see the design-system single-source rule.
 */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-[22px] font-medium tracking-[-0.02em] text-forest">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[13px] text-forest-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
