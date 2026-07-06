import { useState } from 'react'
import { Banknote, Bell, CalendarClock, FlaskConical, Pill, ShieldCheck, Stethoscope, User } from 'lucide-react'
import {
  Accordion,
  Breadcrumb,
  Button,
  DotStepper,
  HorizontalStepper,
  Pagination,
  Segmented,
  Stepper,
  Tabs,
  VerticalTabs,
  type TabItem,
} from '@/components/ui'
import { DemoNavbar, DemoSidebar } from '../demo/DemoShell'
import type { ComponentDoc } from '../types'

type TabValue = 'upcoming' | 'past' | 'cancelled'

function TabsExample() {
  const [tab, setTab] = useState<TabValue>('upcoming')
  const items: TabItem<TabValue>[] = [
    { value: 'upcoming', label: 'Upcoming', count: 18, icon: CalendarClock },
    { value: 'past', label: 'Past', count: 214, icon: Stethoscope },
    { value: 'cancelled', label: 'Cancelled', count: 3 },
  ]
  const copy: Record<TabValue, string> = {
    upcoming: '18 appointments scheduled for the next 7 days.',
    past: '214 completed consultations in this period.',
    cancelled: '3 cancellations, all rebooked.',
  }
  return (
    <div className="w-full max-w-lg">
      <div className="border-b border-hair">
        <Tabs items={items} value={tab} onChange={setTab} />
      </div>
      <p className="pt-4 text-sm text-forest-500">{copy[tab]}</p>
    </div>
  )
}

function TabsLargeExample() {
  const [tab, setTab] = useState<'summary' | 'history'>('summary')
  return (
    <div className="w-full max-w-lg border-b border-hair">
      <Tabs
        size="lg"
        items={[
          { value: 'summary', label: 'Summary' },
          { value: 'history', label: 'Medical history' },
        ]}
        value={tab}
        onChange={setTab}
      />
    </div>
  )
}

type SettingsTab = 'profile' | 'notifications' | 'security' | 'billing'

function VerticalTabsExample() {
  const [tab, setTab] = useState<SettingsTab>('profile')
  const items: TabItem<SettingsTab>[] = [
    { value: 'profile', label: 'Profile', icon: User },
    { value: 'notifications', label: 'Notifications', icon: Bell, count: 3 },
    { value: 'security', label: 'Security', icon: ShieldCheck },
    { value: 'billing', label: 'Billing', icon: Banknote },
  ]
  const copy: Record<SettingsTab, string> = {
    profile: 'Name, photo and contact details.',
    notifications: 'Three channels need review.',
    security: 'Two-factor and session settings.',
    billing: 'Plans, invoices and payment methods.',
  }
  return (
    <div className="flex w-full max-w-lg gap-6">
      <VerticalTabs items={items} value={tab} onChange={setTab} className="w-44 shrink-0" />
      <p className="flex-1 pt-2 text-sm text-forest-500">{copy[tab]}</p>
    </div>
  )
}

function SegmentedExample() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week')
  return (
    <Segmented
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
      value={period}
      onChange={setPeriod}
    />
  )
}

function SegmentedVariantsExample() {
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d')
  return (
    <div className="w-full max-w-sm space-y-4">
      <Segmented
        size="sm"
        options={[
          { value: 'chart', label: 'Chart' },
          { value: 'table', label: 'Table' },
        ]}
        value={view}
        onChange={setView}
      />
      <Segmented
        block
        options={[
          { value: '7d', label: '7 days' },
          { value: '30d', label: '30 days' },
          { value: '90d', label: '90 days' },
        ]}
        value={range}
        onChange={setRange}
      />
    </div>
  )
}

function SteppersExample() {
  const [step, setStep] = useState(1)
  return (
    <div className="w-full max-w-xl space-y-8">
      <HorizontalStepper steps={['Account', 'Verify', 'Workspace']} current={step} onSelect={setStep} />
      <div className="flex items-center justify-between">
        <DotStepper count={4} current={step} onSelect={setStep} />
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          <Button size="sm" disabled={step === 2} onClick={() => setStep((s) => s + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

function VerticalStepperExample() {
  const [current, setCurrent] = useState(2)
  return (
    <div className="max-w-sm">
      <Stepper
        steps={[
          { title: 'Step 1', label: 'Patient details' },
          { title: 'Step 2', label: 'Insurance & plan' },
          { title: 'Step 3', label: 'Consent & documents' },
          { title: 'Step 4', label: 'Review & enrol' },
        ]}
        current={current}
        onSelect={setCurrent}
      />
    </div>
  )
}

function PaginationExample() {
  const [page, setPage] = useState(4)
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3">
      <Pagination page={page} pages={12} onChange={setPage} />
      <p className="text-[13px] text-forest-400">
        Showing <span className="tnum font-medium text-forest">{page * 20 + 1}–{page * 20 + 20}</span> of{' '}
        <span className="tnum font-medium text-forest">240</span> lab orders
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

export const NAVIGATION_DOCS: ComponentDoc[] = [
  {
    slug: 'tabs',
    name: 'Tabs',
    group: 'Navigation',
    summary: 'Underline tabs with counts for switching sibling views.',
    props: [
      { name: 'items', type: 'TabItem[]', required: true, description: '{ value, label, count?, icon? } per tab.' },
      { name: 'value', type: 'string', required: true, description: 'The active tab value.' },
      { name: 'onChange', type: '(value: string) => void', required: true, description: 'Fired when a tab is chosen.' },
      { name: 'size', type: "'md' | 'lg'", default: "'md'", description: 'Tabs only — label size.' },
      { name: '(VerticalTabs)', type: 'same API', description: 'The rail variant shares items/value/onChange; active bar sits on the left.' },
    ],
    description:
      'Tabs switch between views of the same thing — never between unrelated pages. The active tab gets ink text and a 2px underline; count pills carry the size of each bucket.',
    code: `<Tabs
  items={[{ value: 'upcoming', label: 'Upcoming', count: 18 }, …]}
  value={tab}
  onChange={setTab}
/>`,
    examples: [
      {
        title: 'With icons and counts',
        wide: true,
        body: <TabsExample />,
      },
      {
        title: 'Large size',
        note: 'size="lg" for page-level tab rows.',
        wide: true,
        body: <TabsLargeExample />,
      },
      {
        title: 'Vertical tab menu',
        note: 'The rail variant for settings-style screens — active bar on the left.',
        wide: true,
        body: <VerticalTabsExample />,
      },
    ],
    a11y: [
      'The active tab is marked by weight, colour and the underline — three cues, not colour alone.',
      'Tabs are real buttons: focusable, Enter/Space activated, visible focus ring.',
      'Count pills are supplementary text, announced with the label.',
    ],
  },
  {
    slug: 'segmented',
    name: 'Segmented control',
    group: 'Navigation',
    summary: 'Pill switcher for 2–4 equivalent views of the same data.',
    props: [
      { name: 'options', type: 'SegOption[]', required: true, description: '{ value, label } per segment.' },
      { name: 'value', type: 'string', required: true, description: 'The active segment.' },
      { name: 'onChange', type: '(value: string) => void', required: true, description: 'Fired on switch.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Control height.' },
      { name: 'block', type: 'boolean', default: 'false', description: 'Stretch segments across the full width.' },
    ],
    description:
      'Tabs switch content sections; Segmented switches presentations — day/week/month, chart/table. It reads as one control, so keep options short and parallel.',
    code: `<Segmented
  options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]}
  value={period}
  onChange={setPeriod}
/>`,
    examples: [
      { title: 'Period switcher', body: <SegmentedExample /> },
      {
        title: 'Small and block',
        note: 'size="sm" for toolbars; block stretches across the container.',
        wide: true,
        body: <SegmentedVariantsExample />,
      },
    ],
    a11y: [
      'Options are real buttons; the active one lifts on a white chip, not colour alone.',
      'Best kept to ~4 short options — beyond that, use Tabs or a Select.',
      'The full-width `block` variant keeps 44px-class hit areas on mobile.',
    ],
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    group: 'Navigation',
    summary: 'Collapsible sections — FAQs, policies, optional detail.',
    props: [
      { name: 'items', type: 'AccordionItem[]', required: true, description: '{ title, content } per section.' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow several sections open at once.' },
      { name: 'defaultOpen', type: 'number[]', default: '[0]', description: 'Indices expanded on mount.' },
    ],
    description:
      'For content users consult selectively. Clinical information that must be read stays expanded on the page; accordions are for reference material.',
    code: `<Accordion
  items={[{ title: 'What does the plan cover?', content: '…' }, …]}
/>`,
    examples: [
      {
        title: 'Single open',
        wide: true,
        body: (
          <div className="max-w-xl">
            <Accordion
              items={[
                {
                  title: 'What does Family Gold cover?',
                  content:
                    'Consultations, prescriptions, maternity, lab work and surgical procedures at all member facilities, with pre-authorisation for procedures above ₦250,000.',
                },
                {
                  title: 'How do referrals work?',
                  content:
                    'Your assigned GP issues referrals in-app. Specialist visits without a referral are billed at the out-of-network rate.',
                },
                {
                  title: 'How is my data protected?',
                  content:
                    'Records are encrypted at rest and in transit, access is role-scoped per facility, and every access is written to the audit trail. Rednoxx is NDPR compliant.',
                },
              ]}
            />
          </div>
        ),
      },
      {
        title: 'Multiple open',
        note: 'multiple lets sections stay open independently; defaultOpen sets the start.',
        wide: true,
        body: (
          <div className="max-w-xl">
            <Accordion
              multiple
              defaultOpen={[0, 1]}
              items={[
                { title: 'Consultation fee', content: '₦8,500 at member facilities; waived on HMO plans.' },
                { title: 'Lab work', content: 'Priced per test; STAT orders carry a 50% surcharge.' },
                { title: 'Theatre fees', content: 'Quoted per procedure at pre-authorisation.' },
              ]}
            />
          </div>
        ),
      },
    ],
    a11y: [
      'Headers are buttons with aria-expanded and aria-controls wired to their panels.',
      'Panels are role="region", so screen readers can navigate section by section.',
      'The open/closed state shows as a rotating chevron plus the expanded content itself.',
    ],
  },
  {
    slug: 'stepper',
    name: 'Stepper',
    group: 'Navigation',
    summary: 'Wizard progress in three densities — horizontal, vertical, dots.',
    props: [
      { name: 'steps (Stepper)', type: 'Step[]', required: true, description: 'Vertical — { title, label } per step.' },
      { name: 'steps (HorizontalStepper)', type: 'string[]', required: true, description: 'Horizontal — plain labels, one row.' },
      { name: 'count (DotStepper)', type: 'number', required: true, description: 'Dots — total positions.' },
      { name: 'current', type: 'number', required: true, description: 'All three — the active index (0-based).' },
      { name: 'onSelect', type: '(index: number) => void', description: 'All three — makes steps clickable; omit to render inert.' },
    ],
    description:
      'Horizontal for short wizards that fit one row; vertical when steps carry titles and context (enrolment, onboarding); dots when position is all that matters.',
    code: `<HorizontalStepper steps={['Account', 'Verify', 'Workspace']} current={1} />
<Stepper steps={[{ title: 'Step 1', label: 'Patient details' }, …]} current={2} />
<DotStepper count={4} current={1} />`,
    examples: [
      { title: 'Horizontal & dots', note: 'Both track the same state here.', wide: true, body: <SteppersExample /> },
      { title: 'Vertical', note: 'Completed steps get a check; the current one a ring.', wide: true, body: <VerticalStepperExample /> },
    ],
    a11y: [
      'The current step carries aria-current="step"; done steps show a check plus the filled tone.',
      'Steps are buttons when navigation back is allowed; otherwise render them inert.',
      'Dot steppers expose “Step n of m” as the group label, never dots alone.',
    ],
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    group: 'Navigation',
    summary: 'Page controls with a windowed number strip (1 … 4 5 6 … 12).',
    props: [
      { name: 'page', type: 'number', required: true, description: 'Current page, 0-based.' },
      { name: 'pages', type: 'number', required: true, description: 'Total pages; renders nothing at 1.' },
      { name: 'onChange', type: '(page: number) => void', required: true, description: 'Fired with the target page.' },
    ],
    description:
      'Standalone pager used by Table internally and available on its own for card grids and search results. The window keeps first, last and neighbours reachable at any length.',
    code: `<Pagination page={page} pages={12} onChange={setPage} />`,
    examples: [
      {
        title: 'Twelve pages',
        note: 'Walk toward the middle to see both gaps appear.',
        wide: true,
        body: <PaginationExample />,
      },
    ],
    a11y: [
      'Wrapped in a <nav aria-label="Pagination"> landmark.',
      'The current page carries aria-current="page"; prev/next have explicit labels.',
      'Disabled endpoints stay visible so the strip never shifts position.',
      'Page numbers use tabular figures — the strip is stable while stepping.',
    ],
  },
  {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    group: 'Navigation',
    summary: 'Hierarchical location trail; the last item is the current page.',
    props: [
      { name: 'items', type: 'Crumb[]', required: true, description: '{ label, to? } — omit `to` on the current page.' },
      { name: 'className', type: 'string', description: 'Layout overrides.' },
    ],
    description:
      'Breadcrumbs answer “where am I?” on anything deeper than one level. Ancestors are quiet links; the current page is ink and not a link.',
    code: `<Breadcrumb items={[
  { label: 'Patients', to: '/patients' },
  { label: 'Ngozi Eze', to: '/patients/004-2213' },
  { label: 'Lab results' },
]} />`,
    examples: [
      {
        title: 'Three levels',
        body: (
          <Breadcrumb
            items={[
              { label: 'Patients', to: '#' },
              { label: 'Ngozi Eze', to: '#' },
              { label: 'Lab results' },
            ]}
          />
        ),
      },
      {
        title: 'Long labels truncate',
        body: (
          <div className="max-w-64">
            <Breadcrumb
              items={[
                { label: 'Insurance claims', to: '#' },
                { label: 'Port Harcourt Family Health Centre — claim batch 2026-Q2' },
              ]}
            />
          </div>
        ),
      },
    ],
    a11y: [
      '<nav aria-label="Breadcrumb"> with an ordered list — assistive tech announces position and count.',
      'The current page has aria-current="page" and is intentionally not a link.',
      'Chevron separators are aria-hidden; the structure carries the meaning.',
    ],
  },
  {
    slug: 'sidebar',
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
