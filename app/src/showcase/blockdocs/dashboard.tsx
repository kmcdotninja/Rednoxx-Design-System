import { useMemo, useState } from 'react'
import { ArrowRight, CalendarRange, Download, FlaskConical, Pill, Plus, Stethoscope, UserPlus } from 'lucide-react'
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
import { FilterBar, KpiCard } from '@/components/blocks'
import { DemoPageHeader } from '../demo/DemoShell'
import { APPOINTMENTS, DAYS, KPIS, LAB_ORDERS, PATIENTS } from '../health'
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

const today = APPOINTMENTS.filter((a) => a.bucket === 'upcoming' && a.day === 'Today').slice(0, 4)

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
  <CardHeader title="Today's schedule" subtitle="5 appointments" action={<Button variant="ghost" size="sm">View all</Button>} />
  {rows.map(…)}
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
]
