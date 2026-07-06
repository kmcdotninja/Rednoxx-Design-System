import { useNavigate } from 'react-router-dom'
import { ArrowRight, Banknote, CalendarClock, Download, FlaskConical, Play, Plus, Users } from 'lucide-react'
import {
  Alert,
  Button,
  Card,
  CardHeader,
  StatCard,
  StatusPill,
  Tag,
  Avatar,
  useToast,
} from '@/components/ui'
import { DemoPageHeader } from '../DemoShell'
import { APPOINTMENTS, LAB_ORDERS, PAYMENTS, REPORTS, SURGICAL_ORDERS } from '../../health'

const longDate = new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'long' })

export function OverviewPage() {
  const navigate = useNavigate()
  const today = APPOINTMENTS.filter((a) => a.bucket === 'upcoming' && a.day === 'Today')
  const pendingLabs = LAB_ORDERS.filter((o) => o.status !== 'completed')
  const outstanding = PAYMENTS.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const awaitingSignoff = SURGICAL_ORDERS.filter((o) => o.status === 'submitted').length

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader
          title="Good morning, Amina"
          subtitle={longDate.format(new Date())}
          actions={
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => navigate('/demo/appointments')}>
              Schedule appointment
            </Button>
          }
        />
      </div>

      {awaitingSignoff > 0 && (
        <div className="animate-rise" style={{ animationDelay: '60ms' }}>
          <Alert
            tone="info"
            title={`${awaitingSignoff} surgical orders await sign-off`}
            action={
              <Button size="sm" variant="secondary" onClick={() => navigate('/demo/surgical-orders')}>
                Review queue
              </Button>
            }
          >
            Orders older than 48 hours are escalated to the medical director.
          </Alert>
        </div>
      )}

      <div className="grid gap-4 animate-rise sm:grid-cols-2 xl:grid-cols-4" style={{ animationDelay: '120ms' }}>
        <StatCard label="Today's appointments" value={today.length} icon={<CalendarClock size={16} />} sub="2 walk-ins expected" />
        <StatCard label="Patients in queue" value={9} icon={<Users size={16} />} delta="−3" deltaTone="up" sub="vs this time yesterday" />
        <StatCard label="Lab results pending" value={pendingLabs.length} icon={<FlaskConical size={16} />} sub="oldest 38 minutes" />
        <StatCard label="Outstanding invoices" value={`₦${Math.round(outstanding / 1000)}k`} icon={<Banknote size={16} />} sub={`${PAYMENTS.filter((p) => p.status === 'pending').length} awaiting HMO settlement`} />
      </div>

      <div className="grid gap-4 animate-rise lg:grid-cols-2" style={{ animationDelay: '180ms' }}>
        <Card>
          <CardHeader
            title="Today's schedule"
            subtitle={`${today.length} appointments`}
            action={
              <Button size="sm" variant="ghost" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/demo/appointments')}>
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
                <span className="hidden text-[13px] text-forest-400 sm:block">{a.clinician}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Recent lab orders"
            subtitle="Across all facilities"
            action={
              <Button size="sm" variant="ghost" rightIcon={<ArrowRight size={14} />} onClick={() => navigate('/demo/lab-orders')}>
                View all
              </Button>
            }
          />
          <ul className="mt-4 space-y-1">
            {LAB_ORDERS.slice(0, 5).map((o) => (
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
      </div>
    </>
  )
}

export function ReportsPage() {
  const { success } = useToast()
  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader
          title="Reports"
          subtitle="Scheduled and on-demand reporting across the network"
          actions={
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => success('Report builder opened', 'Pick a template to start from.')}>
              New report
            </Button>
          }
        />
      </div>

      <div className="grid gap-4 animate-rise sm:grid-cols-2 xl:grid-cols-3" style={{ animationDelay: '80ms' }}>
        {REPORTS.map((r) => (
          <Card key={r.id} pad={false} className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-forest">{r.name}</p>
              <Tag>{r.cadence}</Tag>
            </div>
            <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-forest-400">{r.description}</p>
            <p className="mt-3 text-xs text-forest-300">Last generated {r.lastRun}</p>
            <div className="mt-3 flex items-center gap-2 border-t border-hair pt-3">
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<Play size={13} />}
                onClick={() => success('Report queued', `“${r.name}” is generating — usually under a minute.`)}
              >
                Run now
              </Button>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Download size={13} />}
                onClick={() => success('Download started', `${r.name} · ${r.lastRun} (PDF)`)}
              >
                Latest
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
