import type { ReactNode } from 'react'
import { LifeBuoy } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Breadcrumb, type Crumb } from '@/components/ui'
import { NotificationCenter, type NotificationItem } from './NotificationCenter'
import { FacilitySwitcher, type FacilityOption } from './FacilitySwitcher'

/**
 * The one top bar shared by every workspace shell (Care, HIM, …): a location
 * trail on the left and a fixed right cluster — page actions, Support, the
 * notification tray, the facility switcher and an account slot. Shells wire
 * their own data and account menu (routes differ) and render this block, so
 * the chrome stays identical across modules.
 */
export function AppNavbar({
  crumbs,
  actions,
  notifications,
  onNotificationSelect,
  onNotificationMarkAllRead,
  facilities,
  facilityId,
  onFacilityChange,
  onSupport,
  user,
  className,
}: {
  crumbs: Crumb[]
  /** Page-level actions rendered before the Support control. */
  actions?: ReactNode
  notifications: NotificationItem[]
  onNotificationSelect: (id: string) => void
  onNotificationMarkAllRead: () => void
  facilities: FacilityOption[]
  facilityId: string
  onFacilityChange: (id: string) => void
  onSupport?: () => void
  /** Account control (UserMenu / Avatar) — the shell owns its routes. */
  user: ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        'flex h-14 shrink-0 items-center justify-between gap-4 border-b border-hair bg-white px-4 sm:px-6',
        className,
      )}
    >
      <Breadcrumb items={crumbs} />
      <div className="flex items-center gap-1.5">
        {actions}
        <button
          type="button"
          onClick={onSupport}
          className="flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-[13px] font-medium text-forest-500 transition-colors hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50"
        >
          <LifeBuoy size={15} className="text-forest-300" />
          Support
        </button>
        <NotificationCenter
          items={notifications}
          onSelect={onNotificationSelect}
          onMarkAllRead={onNotificationMarkAllRead}
        />
        <FacilitySwitcher
          align="right"
          facilities={facilities}
          activeId={facilityId}
          onSwitch={onFacilityChange}
          className="ml-1"
        />
        <span className="ml-1">{user}</span>
      </div>
    </header>
  )
}
