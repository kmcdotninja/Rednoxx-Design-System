import { useEffect, useState, type ReactNode } from 'react'
import {
  Banknote,
  CalendarClock,
  ChartLine,
  ClipboardList,
  FileText,
  FlaskConical,
  Home,
  Pill,
  Scissors,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Link, Outlet, useLocation, useNavigate, type NavigateOptions } from '@tanstack/react-router'
import { Logo, Mark } from '@/components/Logo'
import { type Crumb } from '@/components/ui'
import {
  AccountSwitcher,
  AppNavbar,
  FloatingDock,
  ModuleSwitcher,
  SidebarNav,
  UserMenu,
  floatingPillClass,
  type AccountOption,
  type FacilityOption,
  type ProfileUser,
} from '@/components/blocks'
import { MODULE_HOME, PRODUCT_MODULES, type ModuleId } from '@/app/modules'
import { NOTIFICATIONS, PATIENTS } from './health'

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

/** The signed-in user for the demo — drives the top-bar account menu and the
    profile settings screen. Distinct from the switchable account catalogue. */
export const DEMO_USER: ProfileUser = {
  name: 'Dr. Femi Alade',
  email: 'femi.alade@rednoxx.health',
  phone: '+234 802 555 0142',
  jobTitle: 'Clinician',
  department: 'General practice',
  facility: 'Garki General Hospital',
  language: 'en',
}

/** Sample accounts the demo can act as — the "switch account" catalogue. */
export const DEMO_ACCOUNTS: AccountOption[] = [
  { id: 'clinical-ops', name: 'Amina Bello', detail: 'Clinical operations' },
  { id: 'care', name: 'Dr. Femi Alade', detail: 'Care · Clinician' },
  { id: 'admin', name: 'Dayo Okon', detail: 'Facility administrator' },
  { id: 'front-desk', name: 'Bala Adamu', detail: 'Front desk' },
  { id: 'finance', name: 'Patience Udo', detail: 'Billing & finance' },
]

/** Sample facilities the demo can switch context between. */
export const DEMO_FACILITIES: FacilityOption[] = [
  { id: 'all', name: 'All facilities' },
  { id: 'garki', name: 'Garki General Hospital', detail: 'AMAC · Tier 2' },
  { id: 'wuse', name: 'Wuse District Hospital', detail: 'AMAC · Tier 2' },
  { id: 'asokoro', name: 'Asokoro Model PHC', detail: 'AMAC · Tier 1' },
  { id: 'national', name: 'National Hospital Abuja', detail: 'Federal · Tier 3' },
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
  accounts = DEMO_ACCOUNTS,
  accountId,
  onAccountChange,
  framed,
  className,
}: {
  /** Slug of the active nav item. */
  active?: string
  onSelect?: (slug: string) => void
  /** Renders a sign-out row on the account switcher when provided. */
  onSignOut?: () => void
  /** Accounts offered by the footer switcher. */
  accounts?: AccountOption[]
  /** Controlled active account id; omit to let the sidebar manage its own. */
  accountId?: string
  onAccountChange?: (id: string) => void
  framed?: boolean
  className?: string
}) {
  // Uncontrolled fallback so standalone/showcase usage still switches.
  const [localAccount, setLocalAccount] = useState(accounts[0]?.id ?? '')
  const activeAccount = accountId ?? localAccount
  const changeAccount = onAccountChange ?? setLocalAccount
  return (
    <SidebarNav
      items={DEMO_NAV}
      active={active}
      onSelect={onSelect}
      framed={framed}
      className={className}
      header={<Logo className="h-6" />}
      footer={
        <AccountSwitcher
          accounts={accounts}
          activeId={activeAccount}
          onSwitch={changeAccount}
          onSignOut={onSignOut}
        />
      }
    />
  )
}

/** The product top bar — location trail on the left, support & account on the right. */
export function DemoNavbar({
  crumbs = [{ label: 'Analytics', to: '#' }, { label: 'Overview' }],
  actions,
  facilities = DEMO_FACILITIES,
  facilityId,
  onFacilityChange,
  className,
}: {
  crumbs?: Crumb[]
  actions?: ReactNode
  facilities?: FacilityOption[]
  facilityId?: string
  onFacilityChange?: (id: string) => void
  className?: string
}) {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  // Uncontrolled fallback so standalone/showcase usage still switches.
  const [localFacility, setLocalFacility] = useState(facilities[0]?.id ?? '')
  const activeFacility = facilityId ?? localFacility
  const changeFacility = onFacilityChange ?? setLocalFacility
  return (
    <AppNavbar
      crumbs={crumbs}
      actions={actions}
      notifications={notifications}
      onNotificationSelect={(id) =>
        setNotifications((all) => all.map((n) => (n.id === id ? { ...n, read: true } : n)))
      }
      onNotificationMarkAllRead={() =>
        setNotifications((all) => all.map((n) => ({ ...n, read: true })))
      }
      facilities={facilities}
      facilityId={activeFacility}
      onFacilityChange={changeFacility}
      className={className}
      user={
        <UserMenu
          compact
          name={DEMO_USER.name}
          detail={DEMO_USER.jobTitle}
          onProfile={() => navigate({ to: '/demo/settings' })}
          onSignOut={() => navigate({ to: '/demo/sign-in' })}
        />
      }
    />
  )
}

/** Page-title row for demo screens — the shared design-system block. */
export { PageHeader as DemoPageHeader } from '@/components/blocks'

/**
 * The routed product frame: sidebar + navbar around an <Outlet/>. The active
 * nav item and the breadcrumb both derive from the current /demo/:slug route.
 */
export function DemoLayout() {
  const navigate = useNavigate()
  // Sidebar destinations are slug-driven strings; every slug maps to a registered /demo route.
  const go = (path: string) => navigate({ to: path as NavigateOptions['to'] })
  // Account + facility context, shared so the sidebar and top bar stay in lockstep.
  const [accountId, setAccountId] = useState(DEMO_ACCOUNTS[0].id)
  const [facilityId, setFacilityId] = useState(DEMO_FACILITIES[0].id)
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
      document.title = 'Rednoxx EHR'
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
        onSelect={(next) => go(`/demo/${next}`)}
        onSignOut={() => navigate({ to: '/demo/sign-in' })}
        accountId={accountId}
        onAccountChange={setAccountId}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DemoNavbar
          crumbs={crumbs}
          facilityId={facilityId}
          onFacilityChange={setFacilityId}
        />
        {/* Keyed by page so navigation resets the scroll position. */}
        <main key={page.slug} id="demo-main" tabIndex={-1} className="flex-1 overflow-y-auto focus:outline-none">
          <div className="w-full space-y-5 px-4 py-6 sm:px-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating dock — switch workspace, or slip back to the design-system docs. */}
      <FloatingDock>
        <ModuleSwitcher
          floating
          modules={PRODUCT_MODULES}
          activeId="care"
          onSwitch={(id) => navigate({ to: MODULE_HOME[id as ModuleId] as NavigateOptions['to'] })}
        />
        <Link to="/design" className={floatingPillClass}>
          <Mark className="h-[18px] w-[18px]" />
          <span>Design system</span>
        </Link>
      </FloatingDock>
    </div>
  )
}
