import { useState } from 'react'
import { FlaskConical, Pill } from 'lucide-react'
import { ModuleSwitcher, UserMenu } from '@/components/blocks'
import { PRODUCT_MODULES } from '@/app/modules'
import { DemoNavbar, DemoSidebar } from '@/demo/DemoShell'
import type { ComponentDoc } from '../types'

/* The four navigation blocks. They ship from components/blocks/, so they are
   documented here rather than alongside the Navigation *components* (Tabs,
   Segmented, Stepper …) they are built from. */

function ModuleSwitcherExample() {
  const [moduleId, setModuleId] = useState('care')
  const shared = { modules: PRODUCT_MODULES, activeId: moduleId, onSwitch: setModuleId }
  // All three triggers open the same dialog and play the same hand-off; the
  // shells use `floating` inside a FloatingDock.
  const variants = [
    { label: 'Floating · app shells', node: <ModuleSwitcher floating {...shared} /> },
    { label: 'Block · sidebar', node: <div className="w-52"><ModuleSwitcher block {...shared} /></div> },
    { label: 'Compact · rail', node: <ModuleSwitcher compact {...shared} /> },
  ]
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-5">
        {variants.map((v) => (
          <div key={v.label} className="flex flex-col items-center gap-2">
            {v.node}
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
              {v.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-[13px] text-forest-400">
        Active module:{' '}
        <span className="font-medium text-forest">{PRODUCT_MODULES.find((m) => m.id === moduleId)?.name}</span>
        {' — '}pick the other one to play the “Switching to…” hand-off.
      </p>
    </div>
  )
}

function UserMenuExample() {
  const [last, setLast] = useState<string | null>(null)
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="rounded-2xl border border-hair p-2">
        <UserMenu
          side="top"
          align="left"
          name="Dr. Femi Alade"
          detail="Clinician · Garki General"
          onProfile={() => setLast('Opened profile')}
          onSignOut={() => setLast('Logged out')}
        />
      </div>
      <p className="text-center text-[13px] text-forest-400">
        {last ? `Last action: ${last}` : 'Open the account menu.'}
      </p>
    </div>
  )
}

function SidebarExample() {
  const [active, setActive] = useState('analytics')
  return (
    <div className="h-[440px] w-full max-w-[248px] overflow-hidden rounded-3xl border border-hair bg-white shadow-card">
      <DemoSidebar active={active} onSelect={setActive} className="w-full border-r-0" />
    </div>
  )
}

export const NAVIGATION_BLOCK_DOCS: ComponentDoc[] = [
  {
    slug: 'module-switcher',
    whenToUse: [
      'Moving between the product\'s top-level workspaces — Care and HIM today (Admin joins once it has a module) — where switching swaps the entire navigation and screen set.',
      'A different facility or role within the same workspace → FacilitySwitcher / AccountSwitcher (a quick dropdown, not a dialog).',
      'Peer views inside one screen → Tabs; compact presentation toggles → Segmented.',
    ],
    name: 'Module switcher',
    group: 'Navigation',
    summary: 'Dialog-based switch between top-level workspaces (Care, Admin, HIM).',
    props: [
      { name: 'modules', type: 'ModuleOption[]', required: true, description: '{ id, name, description?, icon } per workspace.' },
      { name: 'activeId', type: 'string', required: true, description: 'Id of the current module.' },
      { name: 'onSwitch', type: '(id: string) => void', required: true, description: 'Fired with the chosen module id (never for re-selecting the current one).' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Collapsed-rail variant — the active module\'s icon only.' },
      { name: 'block', type: 'boolean', default: 'false', description: 'Stretch the trigger to fill its container (e.g. a sidebar).' },
      { name: 'floating', type: 'boolean', default: 'false', description: 'Floating-dock variant — a rounded FloatingPill sticker for use inside FloatingDock.' },
      { name: 'transition', type: 'boolean', default: 'true', description: 'Play the branded "Switching to …" hand-off before onSwitch. Off automatically under reduced-motion.' },
      { name: 'triggerLabel', type: 'string', default: "'Switch module'", description: 'Accessible name / floating + compact label.' },
      { name: 'title', type: 'string', default: "'Switch module'", description: 'Dialog heading.' },
      { name: 'subtitle', type: 'ReactNode', description: 'Supporting line under the heading.' },
    ],
    description:
      'Switching module is a bigger move than switching facility or role — it changes the whole workspace — so the trigger opens a deliberate dialog of full module cards rather than a menu, and picking a new one plays a short "Switching to …" hand-off before navigating. Presentational: the caller owns the module list and active id, so every shell renders this one block. In the app shells the floating variant lives in a FloatingDock beside the escape-hatch pill.',
    code: `import { FloatingDock, ModuleSwitcher } from '@/components/blocks'
import { PRODUCT_MODULES, MODULE_HOME } from '@/app/modules'

// How both shells render it: a floating pill in the dock.
<FloatingDock>
  <ModuleSwitcher
    floating
    modules={PRODUCT_MODULES}
    activeId="care"
    onSwitch={(id) => navigate({ to: MODULE_HOME[id] })}
  />
</FloatingDock>`,
    examples: [
      {
        title: 'Triggers → dialog → hand-off',
        note: 'Three trigger variants, one behaviour. Click any to open the dialog (the current module is marked; re-selecting it just closes). Pick the other module to play the full-screen “Switching to…” hand-off — the target badge breathes over a grid a lit segment snakes along — then onSwitch fires.',
        wide: true,
        body: <ModuleSwitcherExample />,
      },
    ],
    a11y: [
      'The trigger is a button with aria-haspopup="dialog"; the compact variant carries an aria-label.',
      'Built on Modal — focus is trapped, Escape closes, and focus returns to the trigger on close.',
      'The active module card carries aria-current and a check plus "(current module)" for screen readers — never colour alone.',
      'The hand-off overlay is role="status" aria-live="polite", so the switch is announced; its decorative grid/snake is aria-hidden.',
      'Under prefers-reduced-motion the hand-off is skipped entirely and onSwitch fires immediately.',
    ],
  },
  {
    slug: 'user-menu',
    whenToUse: [
      'The signed-in user\'s own account menu on the avatar — Profile (their settings) and Log out. "You", not a switcher.',
      'Acting *as* a different account or role → AccountSwitcher. A different facility → FacilitySwitcher.',
    ],
    name: 'User menu',
    group: 'Navigation',
    summary: 'Avatar account menu — Profile and Log out for the signed-in user.',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Signed-in user — drives the avatar and title.' },
      { name: 'detail', type: 'string', description: 'Secondary line (role/email) on the non-compact trigger.' },
      { name: 'onProfile', type: '() => void', description: 'Opens the profile/settings screen.' },
      { name: 'onSignOut', type: '() => void', description: 'Ends the session (rendered as a danger row).' },
      { name: 'items', type: 'DropdownItem[]', description: 'Extra rows between Profile and Log out.' },
      { name: 'compact', type: 'boolean', default: 'false', description: 'Avatar-only trigger, for the top bar.' },
      { name: 'side', type: "'top' | 'bottom'", default: "'bottom'", description: 'Open above (sidebar-footer) or below (top bar).' },
    ],
    description:
      'Built on Dropdown + Avatar. The top-bar avatar opens it: Profile takes the user to their settings/profile screen, Log out ends the session. Keep it distinct from AccountSwitcher — this is the user, not a context switch.',
    code: `<UserMenu
  compact
  name={user.name}
  detail={user.jobTitle}
  onProfile={() => navigate({ to: '/demo/settings' })}
  onSignOut={() => navigate({ to: '/demo/sign-in' })}
/>`,
    examples: [
      {
        title: 'Account menu',
        note: 'Profile and Log out; Log out is a danger row.',
        wide: true,
        body: <UserMenuExample />,
      },
    ],
    a11y: [
      'The trigger is a real button with aria-haspopup="menu"; arrow keys move, Enter selects, Escape closes (via Dropdown).',
      'Log out uses the danger tone plus its wording — never colour alone.',
      'The compact top-bar trigger keeps the avatar\'s name as its accessible title.',
    ],
  },
  {
    slug: 'sidebar',
    whenToUse: [
      'Primary navigation for the whole product — role-scoped modules, constant across pages (240px).',
      'Never reorder items by context or usage; predictable placement is an accessibility feature (WCAG consistent navigation).',
    ],
    name: 'Sidebar',
    group: 'Navigation',
    summary: 'Primary navigation rail with grouped sections and an account footer.',
    props: [
      { name: 'active', type: 'string', default: "'analytics'", description: 'Slug of the active nav item.' },
      { name: 'onSelect', type: '(slug: string) => void', description: 'Fired when an item is chosen.' },
      { name: 'onSignOut', type: '() => void', description: 'Renders the sign-out control on the account card.' },
      { name: 'framed', type: 'boolean', default: 'false', description: 'Standalone-example mode (no fixed positioning).' },
    ],
    description:
      'One rail, grouped the way staff work: Analyze, Clinical, Orders, Finance, Manage. The active item gets a quiet panel and a brand-violet icon; groups are labelled in small caps. See it live in the product demo.',
    code: `<DemoSidebar active="Analytics" onSelect={navigate} />`,
    examples: [
      {
        title: 'Interactive',
        note: 'Click around — active state is panel + violet icon, not colour alone.',
        wide: true,
        body: <SidebarExample />,
      },
    ],
    a11y: [
      '<nav aria-label="Primary"> landmark; the active item carries aria-current="page".',
      'Rows are 36px tall with full-width hit areas.',
      'Group labels are visible text, not title attributes — they read in scan order.',
      'On small screens the rail collapses behind a labelled menu button (see the docs shell).',
    ],
  },
  {
    slug: 'navbar',
    whenToUse: [
      'The page-level top bar — breadcrumbs, global search, notifications, account. Complements the sidebar, never duplicates it.',
    ],
    name: 'Navbar',
    group: 'Navigation',
    summary: 'Top bar with the location trail, support and account actions.',
    props: [
      { name: 'crumbs', type: 'Crumb[]', description: 'The location trail rendered on the left.' },
      { name: 'actions', type: 'ReactNode', description: 'Extra controls before the built-in support/notifications/account cluster.' },
    ],
    description:
      'The navbar carries context (breadcrumb) on the left and global actions on the right — support, notifications, account. Page-level actions belong in the page header below it, not here.',
    code: `<DemoNavbar crumbs={[{ label: 'Analytics', to: '/analytics' }, { label: 'Overview' }]} />`,
    examples: [
      {
        title: 'Default',
        wide: true,
        body: (
          <div className="w-full overflow-hidden rounded-3xl border border-hair shadow-card">
            <DemoNavbar
              crumbs={[
                { label: 'Lab orders', to: '#' },
                { label: 'FBC-20841' },
              ]}
            />
            <div className="flex h-16 items-center gap-2 bg-canvas px-6 text-[13px] text-forest-300">
              <Pill size={14} /> <FlaskConical size={14} /> page content
            </div>
          </div>
        ),
      },
    ],
    a11y: [
      'A <header> landmark holding the breadcrumb <nav> — two landmarks, cleanly nested.',
      'Icon-only controls (notifications) carry aria-labels; the unread dot is decorative.',
      'All controls are 36px+ and keyboard reachable in visual order.',
    ],
  },
]
