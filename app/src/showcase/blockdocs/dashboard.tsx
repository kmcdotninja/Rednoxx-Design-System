import { useMemo, useState } from 'react'
import { ArrowRight, CalendarRange, Download, FlaskConical, Pill, Plus, Power, PowerOff, Stethoscope, Trash2, UserPlus } from 'lucide-react'
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Select,
  StatCard,
  StatusPill,
  Tabs,
  Tag,
  type TabItem,
} from '@/components/ui'
import { FilterBar, NotificationCenter, SelectionBar, SidebarNav, type SidebarNavItem } from '@/components/blocks'
import { KpiCard } from '@/components/blocks/KpiCard'
import { DemoPageHeader } from '@/demo/DemoShell'
import { APPOINTMENTS, DAYS, KPIS, LAB_ORDERS, NOTIFICATIONS, PATIENTS } from '@/demo/health'
import type { ComponentDoc } from '../types'

type Status = 'all' | 'active' | 'inactive'

function FilterBarExample() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status>('all')
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PATIENTS.filter(
      (p) => (status === 'all' || p.status === status) && (!q || p.name.toLowerCase().includes(q)),
    )
  }, [query, status])
  const statusTabs: TabItem<Status>[] = [
    { value: 'all', label: 'All', count: PATIENTS.length },
    { value: 'active', label: 'Active', count: PATIENTS.filter((p) => p.status === 'active').length },
    { value: 'inactive', label: 'Inactive', count: PATIENTS.filter((p) => p.status === 'inactive').length },
  ]
  return (
    <div className="w-full space-y-3">
      <FilterBar
        search={{ value: query, onChange: setQuery, placeholder: 'Search patients…', label: 'Search patients' }}
      >
        <Button size="sm" leftIcon={<Plus size={14} />}>
          New patient
        </Button>
      </FilterBar>
      <div className="border-b border-hair">
        <Tabs items={statusTabs} value={status} onChange={setStatus} />
      </div>
      <p className="text-[13px] text-forest-400">
        <span className="tnum font-medium text-forest">{rows.length}</span> of{' '}
        <span className="tnum">{PATIENTS.length}</span> patients match
      </p>
    </div>
  )
}

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  { slug: 'overview', label: 'Overview', icon: ArrowRight },
  { slug: 'patients', label: 'Patients', icon: UserPlus, section: 'Clinical' },
  { slug: 'consultations', label: 'Consultations', icon: Stethoscope },
  { slug: 'lab-orders', label: 'Lab orders', icon: FlaskConical, section: 'Orders' },
  { slug: 'prescriptions', label: 'Prescriptions', icon: Pill },
]

function SidebarExample() {
  const [active, setActive] = useState('patients')
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="h-[420px]">
      <SidebarNav
        framed
        items={SIDEBAR_ITEMS}
        active={active}
        onSelect={setActive}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        header={<span className="text-[15px] font-medium tracking-[-0.01em] text-forest">Rednoxx</span>}
        headerCollapsed={<Avatar name="R X" size="sm" />}
        footer={
          <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2">
            <Avatar name="Amina Bello" size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-forest">Amina Bello</p>
              <p className="truncate text-[11px] text-forest-400">Clinical operations</p>
            </div>
          </div>
        }
        footerCollapsed={<Avatar name="Amina Bello" size="sm" />}
        className="h-full"
      />
    </div>
  )
}

function NotificationsExample() {
  const [items, setItems] = useState(NOTIFICATIONS)
  return (
    <NotificationCenter
      align="left"
      items={items}
      onSelect={(id) => setItems((all) => all.map((n) => (n.id === id ? { ...n, read: true } : n)))}
      onMarkAllRead={() => setItems((all) => all.map((n) => ({ ...n, read: true })))}
    />
  )
}

const today = APPOINTMENTS.filter((a) => a.bucket === 'upcoming' && a.day === 'Today').slice(0, 4)

function SelectionBarExample() {
  const [selected, setSelected] = useState(0)
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Canonical inline look, via `framed`. */}
      <SelectionBar framed count={1} noun="facility selected" onClear={() => {}}>
        <Button size="sm" variant="ghost" leftIcon={<Power size={14} />}>
          Activate
        </Button>
        <Button size="sm" variant="ghost" leftIcon={<PowerOff size={14} />}>
          Deactivate
        </Button>
        <Button size="sm" variant="danger" leftIcon={<Trash2 size={14} />}>
          Delete
        </Button>
      </SelectionBar>

      {/* Real behaviour: it floats bottom-centre of the viewport while a selection exists. */}
      <Button size="sm" variant="secondary" onClick={() => setSelected(3)}>
        Select 3 rows
      </Button>
      <SelectionBar
        count={selected}
        noun={selected === 1 ? 'row selected' : 'rows selected'}
        onClear={() => setSelected(0)}
      >
        <Button size="sm" variant="ghost" leftIcon={<Power size={14} />}>
          Activate
        </Button>
        <Button size="sm" variant="danger" leftIcon={<Trash2 size={14} />}>
          Delete
        </Button>
      </SelectionBar>
    </div>
  )
}

export const DASHBOARD_BLOCK_DOCS: Omit<ComponentDoc, 'name' | 'group' | 'summary'>[] = [
  {
    slug: 'kpi-card',
    description:
      'The analytics tile: a headline number, its delta against the previous period, and the trend that produced it. StatCard is the chart-less sibling for operational counts.',
    code: `<KpiCard
  label="Consultations"
  value="3,842"
  delta="+8.1%"
  sub="vs 3,554 last period"
  series={series}
  labels={days}
/>`,
    examples: [
      {
        title: 'With trend',
        wide: true,
        body: (
          <div className="grid gap-4 sm:grid-cols-2">
            {KPIS.slice(0, 2).map((kpi) => (
              <KpiCard
                key={kpi.key}
                label={kpi.label}
                value={kpi.value}
                delta={kpi.delta}
                deltaTone={kpi.deltaTone}
                sub={kpi.sub}
                series={kpi.series}
                labels={DAYS}
              />
            ))}
          </div>
        ),
      },
      {
        title: 'Stat cards',
        note: 'For counts that don’t need a trend — queues, pending work, money.',
        wide: true,
        body: (
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Patients in queue" value={9} delta="−3" deltaTone="up" sub="vs this time yesterday" />
            <StatCard label="Lab results pending" value={3} sub="oldest 38 minutes" />
            <StatCard label="Outstanding invoices" value="₦110k" sub="2 awaiting HMO settlement" />
          </div>
        ),
      },
    ],
    a11y: [
      'The delta badge pairs sign and words with its colour; “up is good” is set per metric via deltaTone.',
      'Values are tabular figures, so refreshing dashboards never shift layout.',
      'The trend is supplementary — the headline value and sub-line carry the message in text.',
    ],
  },
  {
    slug: 'dashboard-lists',
    description:
      'Overview screens are lists of what needs attention next. Two shapes cover nearly everything: a schedule (time-anchored rows) and an activity feed (status-anchored rows), each with a “view all” escape hatch.',
    code: `<Card>
  <CardHeader
    title="Today's schedule"
    subtitle="5 appointments"
    action={
      <Button variant="ghost" size="sm">
        View all
      </Button>
    }
  />
  <ul className="mt-4 divide-y divide-hair">
    {appointments.map((a) => (
      <li key={a.id} className="flex items-center justify-between py-3">
        <span>
          <span className="block text-sm font-medium text-forest">{a.patient}</span>
          <span className="block text-[13px] text-forest-400">{a.clinician}</span>
        </span>
        <span className="tnum text-[13px] text-forest-400">{a.time}</span>
      </li>
    ))}
  </ul>
</Card>`,
    examples: [
      {
        title: 'Schedule list',
        wide: true,
        body: (
          <Card className="max-w-xl">
            <CardHeader
              title="Today's schedule"
              subtitle={`${today.length} appointments`}
              action={
                <Button size="sm" variant="ghost" rightIcon={<ArrowRight size={14} />}>
                  View all
                </Button>
              }
            />
            <ul className="mt-4 space-y-1">
              {today.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-panel/50">
                  <span className="tnum w-11 text-[13px] font-medium text-forest-500">{a.time}</span>
                  <Avatar name={a.patient} size="xs" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-forest">{a.patient}</span>
                  <Tag>{a.type}</Tag>
                </li>
              ))}
            </ul>
          </Card>
        ),
      },
      {
        title: 'Activity feed',
        wide: true,
        body: (
          <Card className="max-w-xl">
            <CardHeader title="Recent lab orders" subtitle="Across all facilities" />
            <ul className="mt-4 space-y-1">
              {LAB_ORDERS.slice(0, 4).map((o) => (
                <li key={o.id} className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-panel/50">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-forest">{o.test}</span>
                    <span className="block truncate text-xs text-forest-400">
                      {o.patient} · {o.facility}
                    </span>
                  </span>
                  <StatusPill status={o.status} />
                </li>
              ))}
            </ul>
          </Card>
        ),
      },
      {
        title: 'Quick actions',
        body: (
          <>
            <Button size="sm" leftIcon={<UserPlus size={14} />}>
              New patient
            </Button>
            <Button size="sm" variant="secondary" leftIcon={<Stethoscope size={14} />}>
              Start consultation
            </Button>
            <Button size="sm" variant="secondary" leftIcon={<FlaskConical size={14} />}>
              Lab order
            </Button>
            <Button size="sm" variant="secondary" leftIcon={<Pill size={14} />}>
              Prescription
            </Button>
          </>
        ),
      },
    ],
    a11y: [
      'Rows are full-width targets with hover feedback; the whole row links to the record.',
      'Statuses are pills with text; times use tabular figures in a fixed-width column.',
      '“View all” gives keyboard and screen-reader users a named route to the complete list.',
    ],
  },
  {
    slug: 'notifications',
    description:
      'The navbar bell and its anchored tray. The block is presentational — the caller owns the items and marks them read via onSelect and onMarkAllRead. It is an awareness surface: critical results and sign-offs that require acknowledgement still interrupt through Alert and the confirmation Modal, never only here.',
    props: [
      { name: 'items', type: 'NotificationItem[]', required: true, description: 'Newest first. Each item: title, description, time, severity (critical | warning | info | success), read.' },
      { name: 'onSelect', type: '(id: string) => void', description: 'Fired when a notification is chosen — mark it read and/or navigate to the source record.' },
      { name: 'onMarkAllRead', type: '() => void', description: 'Renders the “Mark all read” action while anything is unread.' },
      { name: 'align', type: 'left | right', default: 'right', description: 'Which edge of the trigger the tray anchors to.' },
    ],
    code: `<NotificationCenter
  items={notifications}
  onSelect={(id) => markRead(id)}
  onMarkAllRead={() => markAllRead()}
/>`,
    examples: [
      {
        title: 'Live',
        note: 'Click the bell — choosing a notification marks it read; the count follows.',
        body: <NotificationsExample />,
      },
      {
        title: 'All caught up',
        note: 'The empty tray uses the notifications EmptyState, not a blank panel.',
        body: <NotificationCenter align="left" items={[]} />,
      },
    ],
    a11y: [
      'The trigger announces the unread count in its accessible name (“Notifications, 3 unread”), not just a red dot.',
      'Severity is a worded badge on every row — colour is never the only carrier.',
      'Unread rows pair the dot and weight with screen-reader text; Escape and outside clicks close the tray and the trigger exposes aria-expanded.',
    ],
  },
  {
    slug: 'sidebar',
    description:
      'The shell edge: grouped primary navigation with an account footer, collapsing to a 68px icon-only rail. Sections survive collapse as hairline dividers; every collapsed item keeps its accessible name. The caller owns the collapsed state, so it can persist per user.',
    props: [
      { name: 'items', type: 'SidebarNavItem[]', required: true, description: 'slug, label, icon, and an optional section label rendered above the item.' },
      { name: 'active', type: 'string', description: 'Slug of the active item — filled, with the icon in accent.' },
      { name: 'onSelect', type: '(slug: string) => void', description: 'Navigation callback.' },
      { name: 'collapsed', type: 'boolean', default: 'false', description: 'Icon-only rail when true.' },
      { name: 'onCollapsedChange', type: '(collapsed: boolean) => void', description: 'Renders the collapse toggle when provided.' },
      { name: 'header / headerCollapsed', type: 'ReactNode', description: 'Brand area for each width — logo expanded, mark collapsed.' },
      { name: 'footer / footerCollapsed', type: 'ReactNode', description: 'Account area for each width.' },
    ],
    code: `<SidebarNav
  items={NAV_ITEMS}
  active={active}
  onSelect={navigate}
  collapsed={collapsed}
  onCollapsedChange={setCollapsed}
  header={<Logo className="h-6" />}
  headerCollapsed={<Mark className="h-6 w-6" />}
/>`,
    examples: [
      {
        title: 'Live',
        note: 'Use the toggle at the bottom — grouping, active state and the account footer all adapt.',
        body: <SidebarExample />,
      },
    ],
    a11y: [
      'Collapsed items carry aria-label and title, so icon-only navigation stays named for every user.',
      'The toggle exposes aria-expanded and a state-specific label (“Collapse sidebar” / “Expand sidebar”).',
      'The active item is marked by fill, weight and aria-current="page" — never colour alone.',
    ],
  },
  {
    slug: 'filter-bar',
    description:
      'Search owns the left edge and screen actions keep to the right. Status buckets are not a second pattern — they are the same Tabs component, sitting on the table directly below the bar. Filtering is instant and the result count is announced under the tabs.',
    code: `<FilterBar
  search={{ value, onChange, placeholder: 'Search patients…', label: 'Search patients' }}
>
  <Button size="sm">New patient</Button>
</FilterBar>
<Tabs items={statusTabs} value={status} onChange={setStatus} />`,
    examples: [
      {
        title: 'Live',
        note: 'Type or switch tabs — the count updates instantly.',
        wide: true,
        body: <FilterBarExample />,
      },
      {
        title: 'With period controls',
        note: 'Analytics screens put comparison and range on the right.',
        wide: true,
        body: (
          <FilterBar>
            <label className="flex items-center gap-2 text-[13px] text-forest-400">
              Compare
              <Select className="h-8 w-auto rounded-xl text-[13px]" defaultValue="prev">
                <option value="prev">Previous period</option>
                <option value="year">Same period last year</option>
              </Select>
            </label>
            <Button variant="secondary" size="sm" leftIcon={<CalendarRange size={15} />}>
              Jun 23 – Jul 6, 2026
            </Button>
          </FilterBar>
        ),
      },
    ],
    a11y: [
      'The search input requires an accessible label naming what is searched.',
      'Status tabs expose counts as text; the active tab is marked by weight, colour and underline.',
      'Filtering updates in place without stealing focus; the match count is plain text.',
    ],
  },
  {
    slug: 'page-header',
    description:
      'Every screen opens the same way: a 22px title, a quiet context line, and the page’s actions on the right. The navbar above it carries location; this block carries intent.',
    code: `<DemoPageHeader
  title="Patients"
  subtitle="12 registered across 9 facilities"
  actions={<Button size="sm">New patient</Button>}
/>`,
    examples: [
      {
        title: 'Standard',
        wide: true,
        body: (
          <DemoPageHeader
            title="Patients"
            subtitle="12 registered across 9 facilities"
            actions={
              <>
                <Button variant="secondary" size="sm" leftIcon={<Download size={14} />}>
                  Export
                </Button>
                <Button size="sm" leftIcon={<Plus size={14} />}>
                  New patient
                </Button>
              </>
            }
          />
        ),
      },
      {
        title: 'Dashboard greeting',
        note: 'Overview screens may greet instead of label — same block, warmer copy.',
        wide: true,
        body: <DemoPageHeader title="Good morning, Amina" subtitle="Monday, July 6" />,
      },
    ],
    a11y: [
      'The title is the page h1; the subtitle is context, not a heading.',
      'Primary action sits last in the row — the natural end of the reading order.',
      'Actions wrap below the title on narrow screens rather than truncating.',
    ],
  },
  {
    slug: 'selection-bar',
    whenToUse: [
      'A table (or any multi-select surface) has a selection and you need to act on the whole set — activate, deactivate, delete, export.',
      'Acting on a single row → that row’s kebab menu (Dropdown), not this bar.',
      'A page-level action unrelated to selection → the Page header.',
    ],
    description:
      'Appears bottom-centre the moment a selection exists and carries the actions that apply to the whole set. Presentational — the caller owns the count, the actions (design-system Buttons) and the clear handler; it renders nothing when the count is 0, so mount it unconditionally. Destructive actions use the danger button and still route through a confirm dialog.',
    props: [
      { name: 'count', type: 'number', required: true, description: 'Size of the selection; the bar renders nothing at 0.' },
      { name: 'onClear', type: '() => void', required: true, description: 'Clears the selection (the ✕ button).' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Action buttons for the selection.' },
      { name: 'noun', type: 'string', default: "'selected'", description: 'Word after the count, e.g. “rows selected”.' },
      { name: 'framed', type: 'boolean', default: 'false', description: 'Render inline instead of floating — for the showcase.' },
    ],
    code: `<SelectionBar
  count={selected.length}
  noun={selected.length === 1 ? 'facility selected' : 'facilities selected'}
  onClear={() => setSelected([])}
>
  <Button size="sm" variant="ghost" leftIcon={<Power size={14} />}>Activate</Button>
  <Button size="sm" variant="ghost" leftIcon={<PowerOff size={14} />}>Deactivate</Button>
  <Button size="sm" variant="danger" leftIcon={<Trash2 size={14} />}>Delete</Button>
</SelectionBar>`,
    examples: [
      {
        title: 'Bulk actions',
        note: 'Shown inline here; in the product it floats bottom-centre. Use “Select 3 rows” to see the real thing.',
        wide: true,
        body: <SelectionBarExample />,
      },
    ],
    a11y: [
      'The bar is a labelled region ("N selected"), discoverable as a landmark.',
      'The count is tabular; the actions are real buttons in reading order, with clear (✕) last.',
      'Destructive actions never rely on colour alone — the word “Delete” plus a confirm dialog carry the meaning.',
    ],
  },
]
