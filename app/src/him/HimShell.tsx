import { useEffect, useState, type ReactNode } from 'react'
import {
  Building2,
  CalendarCheck,
  FileText,
  FileWarning,
  FolderOutput,
  GitMerge,
  Home,
  ScrollText,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { Link, Outlet, useLocation, useNavigate, type NavigateOptions } from '@tanstack/react-router'
import { Logo, Mark } from '@/components/Logo'
import { Button, Tag, type Crumb } from '@/components/ui'
import {
  AccountSwitcher,
  AppNavbar,
  ErrorPage,
  FloatingDock,
  ModuleSwitcher,
  SidebarNav,
  UserMenu,
  floatingPillClass,
  type FacilityOption,
} from '@/components/blocks'
import { MODULE_HOME, PRODUCT_MODULES, type ModuleId } from '@/app/modules'
import { HIM_NOTIFICATIONS, himPatientById, patientDisplayName } from './data'
import { PERSONAS, RoleProvider, useRole, type RolePersona } from './rbac'

export interface HimNavItem {
  slug: string
  label: string
  icon: LucideIcon
  section?: string
}

/** The full HIM workspace IA — each role sees its configured subset (RBAC). */
export const HIM_NAV: HimNavItem[] = [
  { slug: 'overview', label: 'Overview', icon: Home },
  { slug: 'patients', label: 'Patient index', icon: Users, section: 'Patients' },
  { slug: 'appointments', label: 'Appointments & check-in', icon: CalendarCheck },
  { slug: 'duplicates', label: 'Duplicates & merge', icon: GitMerge, section: 'Data quality' },
  { slug: 'incomplete', label: 'Incomplete records', icon: FileWarning },
  { slug: 'documents', label: 'Documents', icon: FileText, section: 'Records' },
  { slug: 'releases', label: 'Release requests', icon: FolderOutput },
  { slug: 'audit', label: 'Audit log', icon: ScrollText, section: 'Governance' },
  { slug: 'operations', label: 'Operations & sync', icon: Workflow },
  { slug: 'admin', label: 'Facility administration', icon: Building2, section: 'Administration' },
]

/**
 * Facilities the HIM workspace can act in. Switching is a UI-only context
 * change in this demo — the register is single-facility mock data.
 */
export const HIM_FACILITIES: FacilityOption[] = [
  { id: 'all', name: 'All facilities' },
  { id: 'garki', name: 'Garki General Hospital', detail: 'AMAC · Tier 2' },
  { id: 'wuse', name: 'Wuse District Hospital', detail: 'AMAC · Tier 2' },
  { id: 'asokoro', name: 'Asokoro Model PHC', detail: 'AMAC · Tier 1' },
  { id: 'gwarinpa', name: 'Gwarinpa General Hospital', detail: 'AMAC · Tier 2' },
]

/**
 * Account card / role switcher — the HIM RBAC personas rendered through the
 * shared design-system AccountSwitcher block (the demo's role catalogue §3).
 */
export function RoleSwitcher({ compact }: { compact?: boolean }) {
  const { persona, setRole } = useRole()
  return (
    <AccountSwitcher
      compact={compact}
      activeId={persona.role}
      accounts={PERSONAS.map((p) => ({ id: p.role, name: p.name, detail: p.title }))}
      onSwitch={(id) => setRole(id as RolePersona['role'])}
      caption={`Switch role · ${persona.title}`}
      title="Switch role (demo)"
    />
  )
}

function HimSidebar({ active, onSelect }: { active: string; onSelect: (slug: string) => void }) {
  const { persona } = useRole()
  const [collapsed, setCollapsed] = useState(false)
  const items = HIM_NAV.filter((item) => persona.nav.includes(item.slug))
  return (
    <SidebarNav
      items={items}
      active={active}
      onSelect={onSelect}
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      header={
        <span className="flex items-center gap-2">
          <Logo className="h-6" />
          <Tag>HIM</Tag>
        </span>
      }
      headerCollapsed={<Mark className="h-6 w-6" />}
      footer={<RoleSwitcher />}
      footerCollapsed={<RoleSwitcher compact />}
    />
  )
}

/** HIM top bar — facility context, location trail, support and the notification tray. */
export function HimNavbar({
  crumbs,
  actions,
  facilities,
  facilityId,
  onFacilityChange,
}: {
  crumbs: Crumb[]
  actions?: ReactNode
  facilities: FacilityOption[]
  facilityId: string
  onFacilityChange: (id: string) => void
}) {
  const { persona } = useRole()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(HIM_NOTIFICATIONS)
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
      facilityId={facilityId}
      onFacilityChange={onFacilityChange}
      user={
        <UserMenu
          compact
          name={persona.name}
          detail={persona.title}
          onProfile={() => navigate({ to: '/him-demo/settings' })}
          onSignOut={() => navigate({ to: '/start' })}
        />
      }
    />
  )
}

/** Page-title row for HIM screens — the shared design-system block. */
export { PageHeader as HimPageHeader } from '@/components/blocks'

/** The routed HIM frame — everything inside knows the active role. */
function HimFrame() {
  const { persona } = useRole()
  const navigate = useNavigate()
  const [facilityId, setFacilityId] = useState(HIM_FACILITIES[0].id)
  // Sidebar destinations are slug-driven strings; every slug maps to a registered /him route.
  const go = (path: string) => navigate({ to: path as NavigateOptions['to'] })
  const { pathname } = useLocation()
  const [, , slugSeg, detailSeg] = pathname.split('/')
  const slug = slugSeg || 'overview'
  // Unknown paths get NO page identity — no active nav item, no borrowed name.
  const isSettings = slug === 'settings'
  const page = HIM_NAV.find((item) => item.slug === slug)
  const pageLabel = page?.label ?? (isSettings ? 'My profile' : 'Page not found')
  const allowed = isSettings || !page || persona.nav.includes(page.slug)

  const detailPatient = slug === 'patients' && detailSeg ? himPatientById(detailSeg) : undefined
  const title = detailPatient ? patientDisplayName(detailPatient) : pageLabel

  useEffect(() => {
    document.title = `${title} — Rednoxx HIM`
    return () => {
      document.title = 'Rednoxx EHR'
    }
  }, [title])

  const crumbs: Crumb[] = [
    { label: 'HIM' },
    detailPatient && page ? { label: page.label, to: `/him-demo/${page.slug}` } : { label: pageLabel },
    ...(detailPatient ? [{ label: patientDisplayName(detailPatient) }] : []),
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <a
        href="#him-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-2xl focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-forest focus:shadow-pop focus:outline-none focus:ring-2 focus:ring-azure/50"
      >
        Skip to content
      </a>
      <HimSidebar active={page?.slug ?? ''} onSelect={(next) => go(`/him-demo/${next}`)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <HimNavbar
          crumbs={crumbs}
          facilities={HIM_FACILITIES}
          facilityId={facilityId}
          onFacilityChange={setFacilityId}
        />
        {/* Keyed by page so navigation resets the scroll position. */}
        <main key={slug} id="him-main" tabIndex={-1} className="flex-1 overflow-y-auto focus:outline-none">
          <div className="w-full space-y-5 px-4 py-6 sm:px-6">
            {allowed ? (
              <Outlet />
            ) : (
              <ErrorPage
                framed
                kind="no-access"
                title={`${pageLabel} is outside your role`}
                description={`${persona.title} (${persona.department}) is not configured for this area. Access follows the Core Platform RBAC model — per facility, department and job function. Denied attempts are logged.`}
                action={
                  <Button variant="secondary" onClick={() => go(`/him-demo/${persona.landing === 'overview' ? '' : persona.landing}`)}>
                    Back to my landing page
                  </Button>
                }
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating dock — switch workspace, or escape back to the entry hall. */}
      <FloatingDock>
        <ModuleSwitcher
          floating
          modules={PRODUCT_MODULES}
          activeId="him"
          onSwitch={(id) => navigate({ to: MODULE_HOME[id as ModuleId] as NavigateOptions['to'] })}
        />
        <Link to="/start" className={floatingPillClass}>
          <Mark className="h-[18px] w-[18px]" />
          <span>Rednoxx</span>
        </Link>
      </FloatingDock>
    </div>
  )
}

/** Route component: provides the role context and routes role switches to the persona's landing. */
export function HimLayout() {
  const navigate = useNavigate()
  const onRoleChange = (p: RolePersona) =>
    navigate({ to: `/him-demo/${p.landing === 'overview' ? '' : p.landing}` as NavigateOptions['to'] })
  return (
    <RoleProvider onRoleChange={onRoleChange}>
      <HimFrame />
    </RoleProvider>
  )
}
