import type { ReactNode } from 'react'
import { PanelLeftClose, PanelLeftOpen, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface SidebarNavItem {
  slug: string
  label: string
  icon: LucideIcon
  /** Tiny gray group label rendered above this item (hidden when collapsed). */
  section?: string
}

/**
 * The product sidebar — grouped primary navigation that collapses to an
 * icon-only rail. Collapsed items keep their accessible name (aria-label +
 * title); sections become hairline dividers so grouping survives collapse.
 * Width is controlled by the caller via `collapsed`/`onCollapsedChange`.
 */
export function SidebarNav({
  items,
  active,
  onSelect,
  header,
  headerCollapsed,
  footer,
  footerCollapsed,
  collapsed = false,
  onCollapsedChange,
  framed,
  className,
}: {
  items: SidebarNavItem[]
  /** Slug of the active nav item. */
  active?: string
  onSelect?: (slug: string) => void
  /** Brand/header area when expanded (e.g. logo + tag). */
  header?: ReactNode
  /** Compact header when collapsed (e.g. the mark alone). */
  headerCollapsed?: ReactNode
  /** Footer when expanded (e.g. account card). */
  footer?: ReactNode
  /** Compact footer when collapsed (e.g. avatar alone). */
  footerCollapsed?: ReactNode
  collapsed?: boolean
  /** Renders the collapse toggle when provided. */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Standalone example (no full-height assumptions). */
  framed?: boolean
  className?: string
}) {
  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r border-hair bg-white transition-[width] duration-200',
        collapsed ? 'w-[68px]' : 'w-60',
        framed ? 'rounded-3xl border' : 'h-full',
        className,
      )}
    >
      <div className={cn('flex items-center px-5 pb-3 pt-5', collapsed && 'justify-center px-0')}>
        {collapsed ? (headerCollapsed ?? header) : header}
      </div>

      <nav aria-label="Primary" className="no-scrollbar flex-1 overflow-y-auto px-3 py-2">
        {items.map((item) => {
          const isActive = item.slug === active
          const Icon = item.icon
          return (
            <div key={item.slug}>
              {item.section &&
                (collapsed ? (
                  <div role="presentation" className="mx-2.5 my-3 border-t border-hair" />
                ) : (
                  <p className="px-2.5 pb-1 pt-4 text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
                    {item.section}
                  </p>
                ))}
              <button
                type="button"
                aria-current={isActive ? 'page' : undefined}
                aria-label={collapsed ? item.label : undefined}
                title={collapsed ? item.label : undefined}
                onClick={() => onSelect?.(item.slug)}
                className={cn(
                  'flex h-9 w-full items-center gap-2.5 rounded-xl text-left text-[13px] transition-colors',
                  collapsed ? 'justify-center px-0' : 'px-2.5',
                  isActive
                    ? 'bg-panel font-medium text-forest'
                    : 'text-forest-400 hover:bg-panel/60 hover:text-forest',
                )}
              >
                <Icon size={16} className={cn('shrink-0', isActive ? 'text-azure' : 'text-forest-300')} />
                {!collapsed && item.label}
              </button>
            </div>
          )
        })}
      </nav>

      {onCollapsedChange && (
        <div className={cn('px-3 pb-1', collapsed && 'flex justify-center px-0')}>
          <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            onClick={() => onCollapsedChange(!collapsed)}
            className={cn(
              'flex h-9 items-center gap-2.5 rounded-xl text-[13px] text-forest-400 transition-colors hover:bg-panel/60 hover:text-forest',
              collapsed ? 'w-9 justify-center' : 'w-full px-2.5',
            )}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} className="text-forest-300" />}
            {!collapsed && 'Collapse'}
          </button>
        </div>
      )}

      {(footer || footerCollapsed) && (
        <div className={cn('border-t border-hair', collapsed ? 'flex justify-center px-0 py-3' : 'px-3 py-3')}>
          {collapsed ? (footerCollapsed ?? footer) : footer}
        </div>
      )}
    </aside>
  )
}
