import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { ChevronDown, LayoutGrid, type LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ALL_NAV_CONTRIBUTIONS } from './contributions'
import { PermissionGate, usePermission } from './permissions'
import { getSession, peekSession, signOut, subscribeSession } from './auth/session'
import { Avatar, Button } from '@/components/ui'
import { cn } from '@/lib/cn'
import { OfflineBanner } from './OfflineBanner'
import type { StreamNamespace } from './stream-contract'

/** Top-level module switcher — also the source of truth for where a user
 *  lands after login (first module here their permissions unlock).
 *  Design-system port: only the HIM module is ported; Admin (/admin) and
 *  Care (/care) stay in the product repo. */
export const MODULES: {
  to: '/him'
  label: string
  permission: string
  match: string
}[] = [
  { to: '/him', label: 'HIM', permission: 'him.records.view', match: '/him' },
]

const FACILITIES = [
  'All facilities',
  'Garki General Hospital',
  'Asokoro District Hospital',
  'Wuse Model Clinic',
]

export function ProductChrome({ showAnnouncements: _showAnnouncements = false }: { showAnnouncements?: boolean }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [session, setSession] = useState(getSession)
  const [facility, setFacility] = useState(FACILITIES[0])

  useEffect(() => subscribeSession(() => setSession(getSession())), [])

  return (
    <div className="flex flex-col">
      <div className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-hair bg-white px-4 sm:px-6">
        <nav aria-label="Product modules" className="flex items-center gap-1">
          <span className="mr-1 hidden items-center gap-1 text-[11px] font-medium uppercase tracking-[0.06em] text-forest-300 sm:inline-flex">
            <LayoutGrid size={12} aria-hidden />
            Modules
          </span>
          {MODULES.map((m) => (
            <PermissionGate key={m.to} permission={m.permission}>
              <Link
                to={m.to}
                className={cn(
                  'rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors',
                  pathname.startsWith(m.match)
                    ? 'bg-panel text-forest'
                    : 'text-forest-400 hover:bg-panel/60 hover:text-forest',
                )}
              >
                {m.label}
              </Link>
            </PermissionGate>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <select
              aria-label="Facility"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              className="h-8 cursor-pointer appearance-none rounded-lg border border-hair bg-white pl-2.5 pr-7 text-[12px] font-medium text-forest"
            >
              {FACILITIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-forest-300"
            />
          </div>
          <div className="hidden items-center gap-2 border-l border-hair pl-2 md:flex">
            <Avatar name={session?.name ?? peekSession()?.name ?? 'User'} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-medium text-forest">
                {session?.name ?? peekSession()?.name ?? 'Signed out'}
              </p>
              <p className="truncate text-[10px] text-forest-400">
                {session?.email ?? peekSession()?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              void signOut()
              navigate({ to: '/login' })
            }}
            aria-label="Sign out"
          >
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>

      {/* Design-system port: AnnouncementsBar (platform-config data) and
          PatientContextBanner (care-ambulatory encounters) belong to
          unported product streams; `showAnnouncements` is kept for API
          compatibility. */}
      <OfflineBanner />
    </div>
  )
}

/** RBAC-filtered sidebar links from stream nav contributions (US-G3). */
export function ContributionNav({
  namespace,
  onNavigate,
  extra,
}: {
  namespace: StreamNamespace
  onNavigate?: () => void
  extra?: { to: string; label: string; icon?: LucideIcon; permission?: string; match?: string[] }[]
}) {
  const { pathname } = useLocation()
  const items = [
    ...ALL_NAV_CONTRIBUTIONS.filter((n) => n.namespace === namespace),
    ...(extra ?? []).map((e) => ({ ...e, namespace, stream: 'care-ambulatory' as const })),
  ]

  const seen = new Set<string>()
  const unique = items.filter((item) => {
    if (seen.has(item.to)) return false
    seen.add(item.to)
    return true
  })

  return (
    <nav
      aria-label={`${namespace} navigation`}
      className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto px-2 py-2"
    >
      {unique.map((item) => (
        <ContributionNavItem
          key={item.to}
          item={item}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  )
}

function ContributionNavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: { to: string; label: string; icon?: LucideIcon; permission?: string; match?: string[] }
  pathname: string
  onNavigate?: () => void
}) {
  const allowed = usePermission(item.permission)
  if (!allowed) return null
  const Icon = item.icon
  const roots = new Set(['/admin', '/care', '/him'])
  const active = roots.has(item.to)
    ? pathname === item.to
    : (item.match ?? [item.to]).some((m) => pathname === m || pathname.startsWith(`${m}/`))

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex h-9 w-full flex-row items-center gap-2.5 rounded-xl px-2.5 text-left text-[13px] transition-colors',
        active
          ? 'bg-panel font-medium text-forest'
          : 'text-forest-400 hover:bg-panel/60 hover:text-forest',
      )}
    >
      {Icon ? (
        <Icon size={16} className={cn('shrink-0', active ? 'text-azure' : 'text-forest-300')} />
      ) : null}
      <span className="min-w-0 truncate">{item.label}</span>
    </Link>
  )
}
