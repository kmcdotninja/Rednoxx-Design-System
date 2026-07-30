import type { ReactNode } from 'react'
import { ChevronsUpDown, LogOut, UserRoundCog, type LucideIcon } from 'lucide-react'
import { Avatar, Dropdown, type DropdownItem } from '@/components/ui'
import { cn } from '@/lib/cn'

export interface AccountOption {
  /** Stable id used for the active selection and returned by onSwitch. */
  id: string
  name: string
  /** Secondary line — the role / title / department the account acts as. */
  detail: string
}

/**
 * Account / role switcher — the identity control that lives at the foot of the
 * product sidebar (and, collapsed, as an avatar). Presentational and generic:
 * HIM wires it to its RBAC personas, the demo to its sample accounts, and the
 * showcase renders this exact block — one source of truth for all three.
 *
 * The active account is disabled in the menu (you cannot switch to yourself).
 * Pass `onSignOut` to append an audited sign-out row.
 */
export function AccountSwitcher({
  accounts,
  activeId,
  onSwitch,
  compact,
  onSignOut,
  side = 'top',
  caption,
  menuLabel,
  title = 'Switch account',
  icon = UserRoundCog,
  className,
}: {
  accounts: AccountOption[]
  activeId: string
  onSwitch: (id: string) => void
  /** Collapsed rail variant — avatar only, name/detail hidden. */
  compact?: boolean
  /** When provided, appends a danger-styled sign-out row below a separator. */
  onSignOut?: () => void
  /** Which way the menu opens; sidebar-footer usage wants 'top'. */
  side?: 'top' | 'bottom'
  /** Override the trigger's second line (default: the active account's detail). */
  caption?: ReactNode
  /** Menu row label (default: `${detail} — ${name}`). */
  menuLabel?: (account: AccountOption) => string
  /** Accessible title on the trigger. */
  title?: string
  /** Leading icon on each account row. */
  icon?: LucideIcon
  className?: string
}) {
  const active = accounts.find((a) => a.id === activeId) ?? accounts[0]

  const items: DropdownItem[] = accounts.map((a) => ({
    label: menuLabel ? menuLabel(a) : `${a.detail} — ${a.name}`,
    icon,
    disabled: a.id === active?.id,
    onSelect: () => onSwitch(a.id),
  }))
  if (onSignOut) {
    items.push({ label: 'Sign out', icon: LogOut, danger: true, separator: true, onSelect: onSignOut })
  }

  return (
    <Dropdown
      align="left"
      side={side}
      block={!compact}
      className={className}
      items={items}
      trigger={
        compact ? (
          <span className="inline-flex" title={title}>
            <Avatar name={active?.name ?? ''} size="sm" />
          </span>
        ) : (
          <span
            className={cn(
              'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-panel/60',
            )}
            title={title}
          >
            <Avatar name={active?.name ?? ''} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-forest">{active?.name}</span>
              <span className="block truncate text-[11px] text-forest-400">{caption ?? active?.detail}</span>
            </span>
            <ChevronsUpDown size={14} className="shrink-0 text-forest-300" />
          </span>
        )
      }
    />
  )
}
