import {
  createRouter,
  createRootRoute,
  createRoute,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router'
import { authAndPermissionBeforeLoad } from './auth/guard'
import { bootstrapStreamContributions } from './contributions'
import { Landing } from './Landing'

// Register stream mock contributions (side-effect of contributing modules).
// Design-system port: only the him-intake stream is present here; the other
// product streams (platform-iam, platform-config, care-*, him-records) were
// not ported from the product repo.
import '@/features/him-intake/routes.him-intake'

bootstrapStreamContributions()

// Routes are composed here by the App Shell. Stream modules contribute
// nav / permissions / mocks; typed createRoute calls stay in this file so
// TanStack keeps path-param inference.
const rootRoute = createRootRoute()

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    // The product repo sends `/` to its auth flow; this design-system port
    // lands on the entry hall instead.
    throw redirect({ to: '/start', replace: true })
  },
})

/* `/login` belongs to the platform-iam product stream, which is not ported.
   The route is kept (sign-out, guards and Forbidden all link to it) and
   forwards to the entry hall. */
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
  beforeLoad: () => {
    throw redirect({ to: '/start', replace: true })
  },
})

/* ============================== /design ==================================
   The design-system documentation site — foundations, component and block
   docs, templates. Everything is lazy so the product bundle stays lean. */

const designRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'design',
  component: lazyRouteComponent(() => import('../showcase/Shell'), 'Shell'),
})

const designChildRoutes = [
  createRoute({
    getParentRoute: () => designRoute,
    path: '/',
    component: lazyRouteComponent(() => import('../showcase/pages/Overview'), 'Overview'),
  }),

  /* Foundations — one topic per route; `overview` indexes them. */
  createRoute({
    getParentRoute: () => designRoute,
    path: 'foundations',
    beforeLoad: () => {
      throw redirect({ to: '/design/foundations/$slug', params: { slug: 'overview' }, replace: true })
    },
  }),
  createRoute({
    getParentRoute: () => designRoute,
    path: 'foundations/$slug',
    component: lazyRouteComponent(() => import('../showcase/pages/Foundations'), 'Foundations'),
  }),

  /* Components */
  createRoute({
    getParentRoute: () => designRoute,
    path: 'components',
    component: lazyRouteComponent(() => import('../showcase/pages/SectionIndex'), 'ComponentsIndex'),
  }),
  createRoute({
    getParentRoute: () => designRoute,
    path: 'components/$slug',
    component: lazyRouteComponent(() => import('../showcase/pages/ComponentPage'), 'ComponentPage'),
  }),

  /* Blocks — includes the page templates, which are blocks at page scale. */
  createRoute({
    getParentRoute: () => designRoute,
    path: 'blocks',
    component: lazyRouteComponent(() => import('../showcase/pages/SectionIndex'), 'BlocksIndex'),
  }),
  createRoute({
    getParentRoute: () => designRoute,
    path: 'blocks/$slug',
    component: lazyRouteComponent(() => import('../showcase/pages/BlockOrTemplate'), 'BlockOrTemplate'),
  }),

  /* Written sections */
  // Get started opens on the site landing — the two overviews were one page.
  createRoute({
    getParentRoute: () => designRoute,
    path: 'get-started',
    beforeLoad: () => {
      throw redirect({ to: '/design', replace: true })
    },
  }),
  createRoute({
    getParentRoute: () => designRoute,
    path: 'get-started/overview',
    beforeLoad: () => {
      throw redirect({ to: '/design', replace: true })
    },
  }),
  createRoute({
    getParentRoute: () => designRoute,
    path: 'get-started/$slug',
    component: lazyRouteComponent(() => import('../showcase/pages/ArticleRoutes'), 'GetStartedPage'),
  }),
  createRoute({
    getParentRoute: () => designRoute,
    path: 'content',
    beforeLoad: () => {
      throw redirect({ to: '/design/content/$slug', params: { slug: 'overview' }, replace: true })
    },
  }),
  createRoute({
    getParentRoute: () => designRoute,
    path: 'content/$slug',
    component: lazyRouteComponent(() => import('../showcase/pages/ArticleRoutes'), 'ContentPage'),
  }),
  createRoute({
    getParentRoute: () => designRoute,
    path: 'patterns',
    beforeLoad: () => {
      throw redirect({ to: '/design/patterns/$slug', params: { slug: 'overview' }, replace: true })
    },
  }),
  // The Patterns landing is a card explorer (like Components/Blocks/Foundations),
  // so the `overview` slug renders the index rather than the prose article.
  createRoute({
    getParentRoute: () => designRoute,
    path: 'patterns/overview',
    component: lazyRouteComponent(() => import('../showcase/pages/PatternsIndex'), 'PatternsIndex'),
  }),
  createRoute({
    getParentRoute: () => designRoute,
    path: 'patterns/$slug',
    component: lazyRouteComponent(() => import('../showcase/pages/ArticleRoutes'), 'PatternsPage'),
  }),
  createRoute({
    getParentRoute: () => designRoute,
    path: 'support',
    beforeLoad: () => {
      throw redirect({ to: '/design/support/$slug', params: { slug: 'overview' }, replace: true })
    },
  }),
  createRoute({
    getParentRoute: () => designRoute,
    path: 'support/$slug',
    component: lazyRouteComponent(() => import('../showcase/pages/ArticleRoutes'), 'SupportPage'),
  }),

  /* Legacy path — Templates now live under Blocks. */
  createRoute({
    getParentRoute: () => designRoute,
    path: 'templates',
    beforeLoad: () => {
      throw redirect({
        to: '/design/blocks/$slug',
        params: { slug: 'template-dashboard' },
        replace: true,
      })
    },
  }),
]

/* ============================== /him =====================================
   The HIM (Health Information Management) module demo — master patient
   index, registration, duplicates & merge, documents, releases and audit.
   Built from the REDNOXX HIM SRS/workflow docs; all pages lazy. */

/* ============================== /start ===================================
   The design entry hall — one page linking the design system, the Care demo
   and the HIM demo. `/` belongs to the product's auth flow (redirects to
   /login), so the hall keeps its own stable path. */

const startRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'start',
  component: Landing,
})

// `/him` belongs to the him-intake feature (below); the design-system HIM
// demo lives at /him-demo so both can be explored side by side.
const himRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'him-demo',
  component: lazyRouteComponent(() => import('../him/HimShell'), 'HimLayout'),
})

const himChildRoutes = [
  createRoute({
    getParentRoute: () => himRoute,
    path: '/',
    component: lazyRouteComponent(() => import('../him/pages/Overview'), 'HimOverviewPage'),
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: 'overview',
    beforeLoad: () => {
      throw redirect({ to: '/him-demo', replace: true })
    },
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: 'patients',
    component: lazyRouteComponent(() => import('../him/pages/PatientIndex'), 'PatientIndexPage'),
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: 'patients/$id',
    component: lazyRouteComponent(() => import('../him/pages/PatientRecord'), 'PatientRecordPage'),
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: 'duplicates',
    component: lazyRouteComponent(() => import('../him/pages/Duplicates'), 'DuplicatesPage'),
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: 'incomplete',
    component: lazyRouteComponent(() => import('../him/pages/Incomplete'), 'IncompletePage'),
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: 'appointments',
    component: lazyRouteComponent(() => import('../him/pages/Appointments'), 'AppointmentsPage'),
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: 'operations',
    component: lazyRouteComponent(() => import('../him/pages/Operations'), 'OperationsPage'),
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: 'documents',
    component: lazyRouteComponent(() => import('../him/pages/Documents'), 'DocumentsPage'),
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: 'releases',
    component: lazyRouteComponent(() => import('../him/pages/Releases'), 'ReleasesPage'),
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: 'audit',
    component: lazyRouteComponent(() => import('../him/pages/Audit'), 'AuditPage'),
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: 'admin',
    component: lazyRouteComponent(() => import('../him/pages/Admin'), 'HimAdminPage'),
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: 'settings',
    component: lazyRouteComponent(() => import('../him/pages/Settings'), 'HimSettingsPage'),
  }),
  createRoute({
    getParentRoute: () => himRoute,
    path: '$',
    component: lazyRouteComponent(() => import('../him/pages/NotFound'), 'HimNotFoundPage'),
  }),
]

/* ============================== /demo ====================================
   The routed Rednoxx product demo (design-system showcase data, no backend).
   Pages are lazy so the charting bundle loads only when a demo page is
   visited. Sign-in sits outside the signed-in DemoLayout frame. */

const demoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'demo',
})

const demoSignInRoute = createRoute({
  getParentRoute: () => demoRoute,
  path: 'sign-in',
  component: lazyRouteComponent(() => import('../demo/pages/SignIn'), 'SignInPage'),
})

const demoLayoutRoute = createRoute({
  getParentRoute: () => demoRoute,
  id: 'demo-layout',
  component: lazyRouteComponent(() => import('../demo/DemoShell'), 'DemoLayout'),
})

const demoIndexRoute = createRoute({
  getParentRoute: () => demoLayoutRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/demo/overview', replace: true })
  },
})

const demoPageRoutes = [
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'overview',
    component: lazyRouteComponent(() => import('../demo/pages/Home'), 'OverviewPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'reports',
    component: lazyRouteComponent(() => import('../demo/pages/Home'), 'ReportsPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'analytics',
    component: lazyRouteComponent(() => import('../demo/pages/Analytics'), 'AnalyticsPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'patients',
    component: lazyRouteComponent(() => import('../demo/pages/Clinical'), 'PatientsPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'patients/$id',
    component: lazyRouteComponent(() => import('../demo/pages/PatientChart'), 'PatientChartPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'appointments',
    component: lazyRouteComponent(() => import('../demo/pages/Clinical'), 'AppointmentsPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'consultations',
    component: lazyRouteComponent(() => import('../demo/pages/Clinical'), 'ConsultationsPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'prescriptions',
    component: lazyRouteComponent(() => import('../demo/pages/Clinical'), 'PrescriptionsPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'lab-orders',
    component: lazyRouteComponent(() => import('../demo/pages/Orders'), 'LabOrdersPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'surgical-orders',
    component: lazyRouteComponent(() => import('../demo/pages/Orders'), 'SurgicalOrdersPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'payments',
    component: lazyRouteComponent(() => import('../demo/pages/Finance'), 'PaymentsPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'insurance-claims',
    component: lazyRouteComponent(() => import('../demo/pages/Finance'), 'ClaimsPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'staff',
    component: lazyRouteComponent(() => import('../demo/pages/Manage'), 'StaffPage'),
  }),
  createRoute({
    getParentRoute: () => demoLayoutRoute,
    path: 'settings',
    component: lazyRouteComponent(() => import('../demo/pages/Manage'), 'SettingsPage'),
  }),
]

/** Unknown /demo/* paths get a real 404 inside the product frame. */
const demoCatchAllRoute = createRoute({
  getParentRoute: () => demoLayoutRoute,
  path: '$',
  component: lazyRouteComponent(() => import('../demo/pages/NotFound'), 'DemoNotFoundPage'),
})


const himLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'him',
  beforeLoad: authAndPermissionBeforeLoad,
  component: lazyRouteComponent(() => import('../features/him-intake/HimShell'), 'HimShell'),
})

const himPageRoutes = [
  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: '/',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/HimHome'),
      'HimHomePage',
    ),
  }),
  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/search',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientSearch'),
      'PatientSearchPage',
    ),
  }),
  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/$id',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientSummary'),
      'PatientSummaryPage',
    ),
  }),
  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/$id/verify',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientVerification'),
      'PatientVerificationPage',
    ),
  }),

  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/register',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientRegister'),
      'PatientRegisterPage',
    ),
  }),
  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/register/complete/$id',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/RegistrationComplete'),
      'RegistrationCompletePage',
    ),
  }),
  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/register/emergency',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientRegisterEmergency'),
      'PatientRegisterEmergencyPage',
    ),
  }),

  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/register/mass-casualty',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientRegisterMassCasualty'),
      'PatientRegisterMassCasualtyPage',
    ),
  }),

  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/register/neonate',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientRegisterNeonate'),
      'PatientRegisterNeonatePage',
    ),
  }),

  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/register/minor',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientRegisterMinor'),
      'PatientRegisterMinorPage',
    ),
  }),
  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/$id/checkin',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientCheckin'),
      'PatientCheckinPage',
    ),
  }),

  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/$id/demographics/edit',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientDemographicEdit'),
      'PatientDemographicEditPage',
    ),
  }),

  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/$id/identifiers',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientIdentifiers'),
      'PatientIdentifiersPage',
    ),
  }),

  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'offline/register',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientRegisterOffline'),
      'PatientRegisterOfflinePage',
    ),
  }),

  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'offline/reconcile',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/OfflineReconciliation'),
      'OfflineReconciliationPage',
    ),
  }),
  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'migration',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/Migration'),
      'MigrationPage',
    ),
  }),

  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'intake',
    component: lazyRouteComponent(() => import('../features/him-intake/screens/IntakeHome'), 'IntakeHomePage'),
  }),
  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'intake/check-in/$patientId',
    component: lazyRouteComponent(() => import('../features/him-intake/screens/CheckInStub'), 'CheckInStubPage'),
  }),
  createRoute({
    getParentRoute: () => himLayoutRoute,
    path: 'patients/$id/consent',
    component: lazyRouteComponent(
      () => import('../features/him-intake/screens/PatientConsent'),
      'PatientConsentPage',
    ),
  }),
]

const forbiddenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'forbidden',
  validateSearch: (search: Record<string, unknown>): { missing?: string } => ({
    missing: typeof search.missing === 'string' ? search.missing : undefined,
  }),
  component: lazyRouteComponent(() => import('./permissions'), 'ForbiddenRoutePage'),
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$',
  component: lazyRouteComponent(() => import('./pages/NotFound'), 'NotFoundPage'),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  startRoute,
  himRoute.addChildren(himChildRoutes),
  designRoute.addChildren(designChildRoutes),
  demoRoute.addChildren([
    demoSignInRoute,
    demoLayoutRoute.addChildren([demoIndexRoute, ...demoPageRoutes, demoCatchAllRoute]),
  ]),
  loginRoute,
  himLayoutRoute.addChildren(himPageRoutes),
  forbiddenRoute,
  notFoundRoute,
])
export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
