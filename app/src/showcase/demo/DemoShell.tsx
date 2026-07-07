import { useEffect, type ReactNode } from 'react'
import {
  Banknote,
  Bell,
  CalendarClock,
  ChartLine,
  ClipboardList,
  FileText,
  FlaskConical,
  Home,
  LifeBuoy,
  LogOut,
  Pill,
  Scissors,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Logo, Mark } from '@/components/Logo'
import { Avatar, Breadcrumb, type Crumb } from '@/components/ui'
import { PATIENTS } from '../health'

export interface DemoNavItem {
  slug: string
  label: string
  icon: LucideIcon
  /** Tiny gray group label rendered above this item. */
  section?: string
}

/** The Rednoxx product IA — grouped the way clinical & admin staff work. */
export const DEMO_NAV: DemoNavItem[] = [
  { slug: 'overview', label: 'Overview', icon: Home },
  { slug: 'analytics', label: 'Analytics', icon: ChartLine, section: 'Analyze' },
  { slug: 'reports', label: 'Reports', icon: FileText },
  { slug: 'patients', label: 'Patients', icon: Users, section: 'Clinical' },
  { slug: 'appointments', label: 'Appointments', icon: CalendarClock },
  { slug: 'consultations', label: 'Consultations', icon: Stethoscope },
  { slug: 'prescriptions', label: 'Prescriptions', icon: Pill },
  { slug: 'lab-orders', label: 'Lab orders', icon: FlaskConical, section: 'Orders' },
  { slug: 'surgical-orders', label: 'Surgical orders', icon: Scissors },
  { slug: 'payments', label: 'Payments', icon: Banknote, section: 'Finance' },
  { slug: 'insurance-claims', label: 'Insurance claims', icon: ShieldCheck },
  { slug: 'staff', label: 'Staff', icon: ClipboardList, section: 'Manage' },
  { slug: 'settings', label: 'Settings', icon: Settings },
]

/**
 * The product sidebar — grouped primary navigation with an account footer.
 * In the demo the items are inert except for their active state; `framed`
 * renders it as a standalone example (no fixed positioning).
 */
export function DemoSidebar({
  active = 'analytics',
  onSelect,
  onSignOut,
  framed,
  className,
}: {
  /** Slug of the active nav item. */
  active?: string
  onSelect?: (slug: string) => void
  /** Renders a sign-out control on the account card when provided. */
  onSignOut?: () => void
  framed?: boolean
  className?: string
}) {
  return (
    <aside
      className={cn(
        'flex h-full w-60 shrink-0 flex-col border-r border-hair bg-white',
        className,
      )}
    >
      <div className={cn('flex items-center px-5', framed ? 'pt-4 pb-2' : 'pt-5 pb-3')}>
        <Logo className="h-6" />
      </div>

      <nav aria-label="Primary" className="no-scrollbar flex-1 overflow-y-auto px-3 py-2">
        {DEMO_NAV.map((item) => {
          const isActive = item.slug === active
          const Icon = item.icon
          return (
            <div key={item.slug}>
              {item.section && (
                <p className="px-2.5 pb-1 pt-4 text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
                  {item.section}
                </p>
              )}
              <button
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelect?.(item.slug)}
                className={cn(
                  'flex h-9 w-full items-center gap-2.5 rounded-xl px-2.5 text-left text-[13px] transition-colors',
                  isActive
                    ? 'bg-panel font-medium text-forest'
                    : 'text-forest-400 hover:bg-panel/60 hover:text-forest',
                )}
              >
                <Icon size={16} className={isActive ? 'text-azure' : 'text-forest-300'} />
                {item.label}
              </button>
            </div>
          )
        })}
      </nav>

      <div className="border-t border-hair px-3 py-3">
        <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2">
          <Avatar name="Amina Bello" size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-forest">Amina Bello</p>
            <p className="truncate text-[11px] text-forest-400">Clinical operations</p>
          </div>
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              aria-label="Sign out"
              title="Sign out"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-forest-300 transition-colors hover:bg-panel hover:text-forest"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}

/** The product top bar — location trail on the left, support & account on the right. */
export function DemoNavbar({
  crumbs = [{ label: 'Analytics', to: '#' }, { label: 'Overview' }],
  actions,
  className,
}: {
  crumbs?: Crumb[]
  actions?: ReactNode
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
          className="flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-[13px] font-medium text-forest-500 transition-colors hover:bg-panel"
        >
          <LifeBuoy size={15} className="text-forest-300" />
          Support
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-forest-400 transition-colors hover:bg-panel hover:text-forest"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-azure" />
        </button>
        <Avatar name="Amina Bello" size="sm" className="ml-1" />
      </div>
    </header>
  )
}

/** Shared page-title row for demo screens. */
export function DemoPageHeader({
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

/**
 * The routed product frame: sidebar + navbar around an <Outlet/>. The active
 * nav item and the breadcrumb both derive from the current /demo/:slug route.
 */
export function DemoLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [, , slugSeg, detailSeg] = pathname.split('/')
  const slug = slugSeg || 'overview'
  const page = DEMO_NAV.find((item) => item.slug === slug) ?? DEMO_NAV[0]

  // Detail routes (e.g. /demo/patients/p1) extend the trail with the record name.
  const detailPatient = slug === 'patients' && detailSeg ? PATIENTS.find((p) => p.id === detailSeg) : undefined
  const title = detailPatient ? detailPatient.name : page.label

  useEffect(() => {
    document.title = `${title} — Rednoxx`
    return () => {
      document.title = 'Rednoxx — Healthcare Platform Design System'
    }
  }, [title])

  const crumbs: Crumb[] = [
    { label: page.section ?? 'Home' },
    detailPatient ? { label: page.label, to: `/demo/${page.slug}` } : { label: page.label },
    ...(detailPatient ? [{ label: detailPatient.name }] : []),
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <a
        href="#demo-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-2xl focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-forest focus:shadow-pop focus:outline-none focus:ring-2 focus:ring-azure/50"
      >
        Skip to content
      </a>
      <DemoSidebar
        className="hidden lg:flex"
        active={page.slug}
        onSelect={(next) => navigate(`/demo/${next}`)}
        onSignOut={() => navigate('/demo/sign-in')}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DemoNavbar crumbs={crumbs} />
        {/* Keyed by page so navigation resets the scroll position. */}
        <main key={page.slug} id="demo-main" tabIndex={-1} className="flex-1 overflow-y-auto focus:outline-none">
          <div className="mx-auto w-full max-w-[1180px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Framer-style sticker back to the docs — the demo has no in-app exit. */}
      <Link
        to="/"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-hair bg-white py-2 pl-2.5 pr-3.5 shadow-pop transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.96]"
      >
        <Mark className="h-[18px] w-[18px]" />
        <span className="text-[13px] font-medium text-forest">Design system</span>
      </Link>
    </div>
  )
}
