import { Bell } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Badge, EmptyState, Popover } from '@/components/ui'

export type NotificationSeverity = 'critical' | 'warning' | 'info' | 'success'

export interface NotificationItem {
  id: string
  title: string
  description?: string
  /** Short clock or relative time — rendered `.tnum` ("2m ago", "09:41"). */
  time: string
  severity: NotificationSeverity
  read?: boolean
}

const severityTone: Record<NotificationSeverity, 'danger' | 'warning' | 'info' | 'success'> = {
  critical: 'danger',
  warning: 'warning',
  info: 'info',
  success: 'success',
}

const severityWord: Record<NotificationSeverity, string> = {
  critical: 'Critical',
  warning: 'Action needed',
  info: 'Update',
  success: 'Done',
}

/**
 * Bell trigger + anchored notification tray. Presentational — the caller owns
 * the items and marks them read via `onSelect` / `onMarkAllRead`. Severity is
 * always a worded badge (never colour alone); unread state pairs the dot with
 * screen-reader text. Interruptive alerts (severity ≥ high) still go through
 * the Alert/Modal patterns — this tray is for awareness, not acknowledgement.
 */
export function NotificationCenter({
  items,
  onSelect,
  onMarkAllRead,
  align = 'right',
  className,
}: {
  items: NotificationItem[]
  /** Fired with the notification id — mark it read and/or navigate. */
  onSelect?: (id: string) => void
  onMarkAllRead?: () => void
  align?: 'left' | 'right'
  className?: string
}) {
  const unread = items.filter((n) => !n.read).length

  return (
    <Popover
      align={align}
      className={className}
      triggerLabel={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
      panelClassName="w-96 max-w-[calc(100vw-2rem)] overflow-hidden"
      trigger={(open) => (
        <span
          className={cn(
            'relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
            open ? 'bg-panel text-forest' : 'text-forest-400 hover:bg-panel hover:text-forest',
          )}
        >
          <Bell size={16} />
          {unread > 0 && (
            <span
              aria-hidden
              className="tnum absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-azure px-1 text-[10px] font-medium leading-none text-white"
            >
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </span>
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-hair px-4 py-3">
        <p className="text-sm font-medium text-forest">
          Notifications
          {unread > 0 && (
            <span className="ml-2 text-[13px] font-normal text-forest-400">
              <span className="tnum">{unread}</span> unread
            </span>
          )}
        </p>
        {unread > 0 && onMarkAllRead && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="rounded-lg px-1.5 py-1 text-[13px] font-medium text-azure-600 transition-colors hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50"
          >
            Mark all read
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          compact
          variant="notifications"
          title="You’re all caught up"
          description="New results, sign-off requests and claim updates land here."
        />
      ) : (
        <ul className="max-h-[min(60vh,400px)] divide-y divide-hair overflow-y-auto">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect?.(item.id)}
                className={cn(
                  'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-panel/60',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure/50',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                    item.read ? 'bg-transparent' : 'bg-azure',
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span
                      className={cn(
                        'truncate text-[13px] text-forest',
                        !item.read && 'font-medium',
                      )}
                    >
                      {!item.read && <span className="sr-only">Unread — </span>}
                      {item.title}
                    </span>
                    <span className="tnum shrink-0 text-[11px] text-forest-300">{item.time}</span>
                  </span>
                  {item.description && (
                    <span className="mt-0.5 line-clamp-2 block text-[13px] text-forest-400">
                      {item.description}
                    </span>
                  )}
                  <Badge tone={severityTone[item.severity]} dot className="mt-1.5">
                    {severityWord[item.severity]}
                  </Badge>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  )
}
