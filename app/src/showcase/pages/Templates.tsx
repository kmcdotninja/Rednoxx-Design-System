import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Card, Tag } from '@/components/ui'
import { cn } from '@/lib/cn'

/** Wireframe block for the schematic diagrams — gray unless a bg is passed. */
function W({ className }: { className?: string }) {
  const hasBg = className?.includes('bg-')
  return <div aria-hidden className={cn('rounded-sm', !hasBg && 'bg-navy-100', className)} />
}

function DashboardWire() {
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <W className="h-2.5 w-24" />
        <W className="h-5 w-16 bg-azure-300" />
      </div>
      <W className="h-5 w-full bg-azure-100" />
      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <W key={i} className="h-10" />
        ))}
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2">
        <W className="h-full" />
        <W className="h-full" />
      </div>
    </div>
  )
}

function ListWire() {
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <W className="h-2.5 w-20" />
        <W className="h-5 w-16 bg-azure-300" />
      </div>
      <W className="h-5 w-32" />
      <div className="flex flex-1 flex-col gap-1.5 border border-hair bg-white p-2.5">
        <div className="flex gap-3 border-b border-hair pb-1.5">
          <W className="h-2 w-10 bg-azure-300" />
          <W className="h-2 w-10" />
          <W className="h-2 w-10" />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <W className="h-3.5 w-3.5 rounded-full" />
            <W className="h-2 flex-1" />
            <W className="h-3 w-10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

function RecordWire() {
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <W className="h-2 w-14" />
      <div className="flex items-center gap-2 border border-hair bg-white p-2.5">
        <W className="h-6 w-6 rounded-full" />
        <div className="flex-1 space-y-1">
          <W className="h-2.5 w-24" />
          <W className="h-2 w-32" />
        </div>
        <W className="h-5 w-14 bg-azure-300" />
      </div>
      <div className="grid flex-1 grid-cols-[1fr_2.2fr] gap-2">
        <div className="flex flex-col gap-2">
          <W className="flex-1" />
          <W className="flex-1" />
        </div>
        <div className="flex flex-col gap-1.5 border border-hair bg-white p-2.5">
          <div className="flex gap-3 border-b border-hair pb-1.5">
            <W className="h-2 w-12 bg-azure-300" />
            <W className="h-2 w-12" />
            <W className="h-2 w-12" />
          </div>
          <W className="flex-1" />
        </div>
      </div>
    </div>
  )
}

function SettingsWire() {
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <W className="h-2.5 w-20" />
        <W className="h-5 w-20 bg-azure-300" />
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="flex flex-1 flex-col gap-2 border border-hair bg-white p-2.5">
          <W className="h-2 w-16" />
          <div className="grid grid-cols-2 gap-2">
            <W className="h-5" />
            <W className="h-5" />
          </div>
        </div>
      ))}
    </div>
  )
}

function AuthWire() {
  return (
    <div className="grid h-full grid-cols-[2fr_3fr]">
      <div className="flex flex-col justify-between bg-navy p-3.5">
        <W className="h-3 w-3 rounded-full bg-azure-300" />
        <div className="space-y-1.5">
          <W className="h-2.5 w-20 bg-white/30" />
          <W className="h-2 w-24 bg-white/15" />
        </div>
        <W className="h-1.5 w-12 bg-white/15" />
      </div>
      <div className="flex items-center justify-center p-4">
        <div className="w-3/4 space-y-2 border border-hair bg-white p-3">
          <W className="h-3 w-3 rounded-full bg-azure-300" />
          <W className="h-2.5 w-20" />
          <W className="h-5 w-full" />
          <W className="h-5 w-full bg-azure-300" />
        </div>
      </div>
    </div>
  )
}

interface Template {
  name: string
  description: string
  anatomy: string[]
  usedBy: { label: string; to: string }[]
  wire: React.ReactNode
}

const TEMPLATES: Template[] = [
  {
    name: 'Dashboard',
    description:
      'For screens that answer “how are we doing right now?”. A greeting or page header, an optional attention strip, a row of KPI or stat cards, then two columns of lists — schedule on the left, activity on the right.',
    anatomy: ['Page header', 'Alert strip (optional)', 'KPI / Stat cards', 'Dashboard lists'],
    usedBy: [
      { label: 'Overview', to: '/demo/overview' },
      { label: 'Analytics', to: '/demo/analytics' },
      { label: 'Payments', to: '/demo/payments' },
    ],
    wire: <DashboardWire />,
  },
  {
    name: 'List',
    description:
      'The workhorse: everything that is fundamentally “a set of records”. Page header with the primary action, a filter bar for search and screen actions, status buckets as Tabs on the table card, and rows that open a record or a drawer.',
    anatomy: ['Page header', 'Filter bar', 'Tabs (status buckets)', 'Data table / card grid'],
    usedBy: [
      { label: 'Patients', to: '/demo/patients' },
      { label: 'Appointments', to: '/demo/appointments' },
      { label: 'Lab orders', to: '/demo/lab-orders' },
      { label: 'Insurance claims', to: '/demo/insurance-claims' },
      { label: 'Staff', to: '/demo/staff' },
    ],
    wire: <ListWire />,
  },
  {
    name: 'Record',
    description:
      'One entity in full — the EHR chart shape. A back link, the identity banner with the screen’s actions, a summary rail of clinical cards on the left, and every associated record set behind Tabs on the right.',
    anatomy: ['Back link', 'Patient banner', 'Summary rail (clinical cards)', 'Tabbed record sets'],
    usedBy: [{ label: 'Patient chart', to: '/demo/patients/p1' }],
    wire: <RecordWire />,
  },
  {
    name: 'Settings',
    description:
      'Configuration screens: a page header whose primary action is Save, followed by stacked cards — one per concern — holding form grids and toggle lists. Nothing collapses behind tabs; settings should be scannable end to end.',
    anatomy: ['Page header + Save', 'Form cards', 'Toggle lists'],
    usedBy: [{ label: 'Settings', to: '/demo/settings' }],
    wire: <SettingsWire />,
  },
  {
    name: 'Auth',
    description:
      'Everything outside the signed-in shell. A dark brand panel carries the product story; the canvas column centers a single card that swaps per step — login, verification, MFA, workspace hand-off — while the shell never changes.',
    anatomy: ['Brand panel', 'Auth card (login / OTP / MFA / org access)'],
    usedBy: [
      { label: 'Sign-in flow (full page)', to: '/demo/sign-in' },
      { label: 'Auth layout block', to: '/blocks/auth-layout' },
      { label: 'Login block', to: '/blocks/login' },
    ],
    wire: <AuthWire />,
  },
]

export function Templates() {
  return (
    <div className="space-y-10">
      <header className="animate-rise">
        <h1 className="text-[26px] font-medium tracking-[-0.02em] text-forest">Templates</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-forest-400">
          The page layouts between blocks and pages: five shapes cover every screen in the
          product. A new screen starts by picking its template, then filling the slots with
          blocks — never by arranging components from scratch.
        </p>
      </header>

      {TEMPLATES.map((t, i) => (
        <section
          key={t.name}
          className="grid gap-5 animate-rise lg:grid-cols-[minmax(0,1fr)_360px]"
          style={{ animationDelay: `${(i + 1) * 60}ms` }}
        >
          <div>
            <h2 className="text-[17px] font-medium tracking-[-0.01em] text-forest">{t.name}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-forest-500">{t.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {t.anatomy.map((part) => (
                <Tag key={part}>{part}</Tag>
              ))}
            </div>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
              See it live
            </p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {t.usedBy.map((u) => (
                <Link
                  key={u.to}
                  to={u.to}
                  className="group inline-flex items-center gap-1 rounded-xl border border-hair bg-white px-2.5 py-1.5 text-[13px] font-medium text-forest-500 transition-[border-color,color] hover:border-navy-200 hover:text-forest"
                >
                  {u.label}
                  <ArrowUpRight size={13} className="text-forest-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </div>
          </div>
          <Card pad={false} className="h-56 overflow-hidden bg-panel/60">
            {t.wire}
          </Card>
        </section>
      ))}
    </div>
  )
}
