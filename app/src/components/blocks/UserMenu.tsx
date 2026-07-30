import { ChevronsUpDown, LogOut, UserRoundCog } from 'lucide-react'
import { Avatar, Dropdown, type DropdownItem } from '@/components/ui'
import { cn } from '@/lib/cn'

/**
 * The signed-in user's account menu — the avatar in the top bar opens it.
 * Profile goes to the user's settings/profile screen; Log out ends the session.
 * Distinct from AccountSwitcher (which *switches* which account you act as) —
 * this is "you": your profile and your sign-out.
 *
 * Presentational and generic: the caller owns the identity and the handlers, so
 * every shell (demo, HIM, …) renders this one block.
 */
export function UserMenu({
  name,
  detail,
  avatarSrc,
  onProfile,
  onSignOut,
  profileLabel = 'Profile',
  signOutLabel = 'Log out',
  items = [],
  align = 'right',
  side = 'bottom',
  compact,
  className,
}: {
  name: string
  /** Secondary line — role/title/email — shown on the non-compact trigger. */
  detail?: string
  avatarSrc?: string
  /** Opens the profile/settings screen. */
  onProfile?: () => void
  /** Ends the session. */
  onSignOut?: () => void
  profileLabel?: string
  signOutLabel?: string
  /** Extra rows inserted between Profile and Log out (e.g. Help, Shortcuts). */
  items?: DropdownItem[]
  align?: 'left' | 'right'
  /** Open above the trigger — for a sidebar-footer placement. */
  side?: 'top' | 'bottom'
  /** Avatar-only trigger, for the top bar. */
  compact?: boolean
  className?: string
}) {
  const menu: DropdownItem[] = []
  if (onProfile) menu.push({ label: profileLabel, icon: UserRoundCog, onSelect: onProfile })
  menu.push(...items)
  if (onSignOut)
    menu.push({ label: signOutLabel, icon: LogOut, danger: true, separator: menu.length > 0, onSelect: onSignOut })

  return (
    <Dropdown
      align={align}
      side={side}
      block={!compact}
      className={className}
      items={menu}
      trigger={
        compact ? (
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-95"
            title={name}
          >
            <Avatar name={name} src={avatarSrc} size="sm" />
          </span>
        ) : (
          <span
            className={cn(
              'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-panel/60',
            )}
            title={name}
          >
            <Avatar name={name} src={avatarSrc} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-forest">{name}</span>
              {detail && <span className="block truncate text-[11px] text-forest-400">{detail}</span>}
            </span>
            <ChevronsUpDown size={14} className="shrink-0 text-forest-300" aria-hidden />
          </span>
        )
      }
    />
  )
}
