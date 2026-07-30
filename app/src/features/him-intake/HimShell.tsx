import { useEffect, useMemo, useState } from 'react'
import {
  FileText,
  Inbox,
  Menu,
  ShieldQuestion,
  X,
  Users,
  UserPlus,
  FileStack,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'
import { Link, Outlet, useLocation, type NavigateOptions } from '@tanstack/react-router'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/Logo'
import { Avatar, Breadcrumb, type Crumb } from '@/components/ui'
import { ProductChrome } from '@/app/ProductChrome'
import { CURRENT_HIM_USER } from './data'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  built: boolean
  match?: string[]
}

const NAV: NavItem[] = [
  { to: '/him', label: 'Home', icon: Inbox, built: true, match: ['/him'] },
  { to: '/him/patients/search', label: 'Patients', icon: Users, built: true },
  { to: '/him/patients/register', label: 'Registration', icon: UserPlus, built: true },
  { to: '/him/worklists', label: 'Worklists', icon: FileText, built: false },
  { to: '/him/documents', label: 'Documents', icon: FileStack, built: false },
  { to: '/him/access', label: 'Release & consent', icon: ShieldQuestion, built: false },
  { to: '/him/reports', label: 'Reports', icon: BarChart3, built: false },
]

function HimSidebar({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-hair bg-white">
      <div className="flex items-center gap-2 px-5 pb-3 pt-5">
        <Logo className="h-6" />
        <span className="rounded-lg bg-panel px-2 py-0.5 text-[11px] font-medium text-forest-400">
          HIM
        </span>
      </div>
      <nav aria-label="HIM Intake" className="no-scrollbar flex-1 overflow-y-auto px-3 py-2">
        {NAV.map((item) => {
          const Icon = item.icon
          const isActive =
            item.to === '/him'
              ? pathname === '/him'
              : (item.match ?? [item.to]).some((m) => pathname.startsWith(m))

          if (!item.built) {
            return (
              <div
                key={item.to}
                aria-disabled
                className="flex h-9 w-full cursor-not-allowed items-center gap-2.5 rounded-xl px-2.5 text-left text-[13px] text-forest-300"
              >
                <Icon size={16} className="text-forest-300" />
                {item.label}
                <span className="ml-auto rounded-lg bg-panel px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.04em] text-forest-300">
                  Soon
                </span>
              </div>
            )
          }

          return (
            <Link
              key={item.to}
              to={item.to as NavigateOptions['to']}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex h-9 w-full items-center gap-2.5 rounded-xl px-2.5 text-left text-[13px] transition-colors',
                isActive
                  ? 'bg-panel font-medium text-forest'
                  : 'text-forest-400 hover:bg-panel/60 hover:text-forest',
              )}
            >
              <Icon size={16} className={isActive ? 'text-azure' : 'text-forest-300'} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-hair px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2">
          <Avatar name={CURRENT_HIM_USER.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-forest">{CURRENT_HIM_USER.name}</p>
            <p className="truncate text-[11px] text-forest-400">{CURRENT_HIM_USER.title}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

const TITLES: { prefix: string; label: string }[] = [
  { prefix: '/him/patients/verify', label: 'Patient verification' },
  { prefix: '/him/patients/search', label: 'Patient search' },
  { prefix: '/him', label: 'HIM Home' },
]

export function HimShell() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const meta = useMemo(
    () => TITLES.find((t) => pathname.startsWith(t.prefix)) ?? TITLES.at(-1)!,
    [pathname],
  )

  useEffect(() => {
    document.title = `${meta.label} — Rednoxx HIM`
    return () => {
      document.title = 'Rednoxx EHR'
    }
  }, [meta.label])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const crumbs: Crumb[] = [{ label: 'HIM', to: '/him' }, { label: meta.label }]

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <a
        href="#him-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-2xl focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-forest focus:shadow-pop focus:outline-none focus:ring-2 focus:ring-azure/50"
      >
        Skip to content
      </a>

      <div className="hidden lg:flex">
        <HimSidebar pathname={pathname} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-forest-900/25 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="animate-drawer-in absolute inset-y-0 left-0">
            <HimSidebar pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* App Shell chrome owns module switcher + real signOut (clears UI session). */}
        <ProductChrome showAnnouncements />
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-hair bg-white px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-forest-400 hover:bg-panel lg:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="hidden sm:block">
              <Breadcrumb items={crumbs} />
            </div>
          </div>
          <Avatar name={CURRENT_HIM_USER.name} size="sm" className="ml-0.5" />
        </header>

        <main
          key={pathname.split('/').slice(0, 3).join('/')}
          id="him-main"
          tabIndex={-1}
          className="flex-1 overflow-y-auto focus:outline-none"
        >
          <div className="mx-auto w-full max-w-295 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
