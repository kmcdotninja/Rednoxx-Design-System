import { useMemo, useState } from 'react'
import { CalendarClock, CalendarPlus, Link2, Plus, Users, Video, X } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useDomain } from '@/components/shell/RoleContext'
import { Badge, Button, Card, DataTable, DatePicker, Drawer, EmptyState, Field, Input, Select, StatusPill, Tabs, TimePicker, ViewToggle, useToast, type Column, type TabItem, type ViewMode } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { DOMAINS, DOMAIN_META } from '@/data/nav'
import { formatDateTime } from '@/lib/format'
import type { Domain, Meeting, MeetingGuest } from '@/data/types'

type Tab = 'upcoming' | 'invites' | 'cancelled'

function isSafeUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

export function Meetings() {
  const domain = useDomain()
  const toast = useToast()
  const { meetings, createMeeting, cancelMeeting, borrowers, financiers } = useStore()

  const [tab, setTab] = useState<Tab>('upcoming')
  const [view, setView] = useState<ViewMode>('table')
  const [creating, setCreating] = useState(false)

  const [subject, setSubject] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00')
  const [duration, setDuration] = useState('30')
  const [link, setLink] = useState('')
  const [guests, setGuests] = useState<MeetingGuest[]>([])
  const [gDomain, setGDomain] = useState<Domain>(domain === 'admin' ? 'borrower' : 'admin')
  const [gCompany, setGCompany] = useState('')

  const hosted = meetings.filter((m) => m.hostDomain === domain)
  const invited = meetings.filter((m) => m.guests.some((g) => g.domain === domain))
  const upcoming = hosted.filter((m) => m.status === 'scheduled')
  const cancelled = hosted.filter((m) => m.status === 'cancelled')

  const tabs: TabItem<Tab>[] = [
    { value: 'upcoming', label: 'My meetings', count: upcoming.length },
    { value: 'invites', label: 'Invites', count: invited.length },
    { value: 'cancelled', label: 'Cancelled', count: cancelled.length },
  ]
  const rows: Meeting[] = tab === 'upcoming' ? upcoming : tab === 'invites' ? invited : cancelled

  const guestOptions = useMemo(() => {
    if (gDomain === 'admin') return [DOMAIN_META.admin.company]
    if (gDomain === 'borrower') return borrowers.map((b) => b.company)
    return financiers.map((f) => f.company)
  }, [gDomain, borrowers, financiers])

  const addGuest = () => {
    const target = gCompany || guestOptions[0]
    if (!target || guests.some((g) => g.company === target)) return
    setGuests((g) => [...g, { domain: gDomain, company: target }])
  }

  const submit = () => {
    if (!subject.trim() || guests.length === 0 || !date || !link.trim()) {
      toast.error('Missing details', 'Add a subject, at least one guest, a date and a meeting link.')
      return
    }
    const when = new Date(`${date}T${time || '09:00'}:00`)
    if (when.getTime() < Date.now()) {
      toast.error('Invalid date', 'The meeting date cannot be in the past.')
      return
    }
    if (!isSafeUrl(link.trim())) {
      toast.error('Invalid link', 'Enter a valid http(s) meeting link.')
      return
    }
    createMeeting({ subject: subject.trim(), guests, date: when.toISOString(), duration: Number(duration) || 30, link: link.trim() })
    toast.success('Meeting scheduled', 'Invitations have been sent to your guests.')
    setCreating(false)
    setSubject(''); setDate(''); setLink(''); setGuests([])
  }

  const emptyState = (
    <EmptyState compact variant="calendar" title="No meetings here" description={tab === 'invites' ? 'Invitations from other institutions appear here.' : 'Schedule a meeting to get started.'} />
  )

  const columns: Column<Meeting>[] = [
    { key: 'subject', header: 'Subject', cell: (m) => <p className="truncate font-medium text-navy">{m.subject}</p> },
    { key: 'when', header: 'When', cell: (m) => <span className="tnum text-navy-500">{formatDateTime(m.date)} · {m.duration} min</span> },
    {
      key: 'who',
      header: tab === 'invites' ? 'Host' : 'Guests',
      cell: (m) => <span className="truncate text-navy-500">{tab === 'invites' ? m.hostCompany : m.guests.map((g) => g.company).join(', ')}</span>,
    },
    { key: 'status', header: 'Status', align: 'right', cell: (m) => <StatusPill status={m.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (m) => (
        <div className="flex items-center justify-end gap-2">
          <a href={m.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-navy-600">
            <Link2 size={13} /> Join
          </a>
          {tab === 'upcoming' && (
            <Button size="sm" variant="danger" onClick={() => { cancelMeeting(m.id); toast.info('Meeting cancelled', 'Guests will see the cancellation.') }}>
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Meetings"
        subtitle="Schedule and manage advisory meetings with other institutions."
        actions={<Button leftIcon={<CalendarPlus size={16} />} onClick={() => setCreating(true)}>New meeting</Button>}
      />

      <Card pad={false}>
        <div className="flex items-start justify-between gap-3 border-b border-hair px-5 pt-5 sm:px-6">
          <Tabs items={tabs} value={tab} onChange={setTab} size="md" />
          <ViewToggle value={view} onChange={setView} first="table" className="mb-3" />
        </div>
        {view === 'table' ? (
          <div className="px-3 pb-4 pt-3 sm:px-4">
            <DataTable columns={columns} rows={rows} rowKey={(m) => m.id} empty={emptyState} />
          </div>
        ) : (
        <div className="grid gap-3 px-5 py-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-3">
          {rows.length === 0 && (
            <div className="sm:col-span-2 xl:col-span-3">
              {emptyState}
            </div>
          )}
          {rows.map((m) => (
            <div key={m.id} className="flex flex-col rounded-3xl border border-hair bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-navy-50 text-navy"><Video size={18} /></span>
                <StatusPill status={m.status} />
              </div>
              <h3 className="mt-3 text-[15px] font-medium leading-snug text-navy">{m.subject}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-navy-400">
                <CalendarClock size={14} /> {formatDateTime(m.date)} · {m.duration} min
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-navy-400">
                <Users size={14} /> {tab === 'invites' ? `Host: ${m.hostCompany}` : m.guests.map((g) => g.company).join(', ')}
              </p>
              <div className="mt-4 flex items-center gap-2 border-t border-hair pt-4">
                <a href={m.link} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-navy px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-navy-600">
                  <Link2 size={14} /> Join meeting
                </a>
                {tab === 'upcoming' && (
                  <Button size="sm" variant="danger" onClick={() => { cancelMeeting(m.id); toast.info('Meeting cancelled', 'Guests will see the cancellation.') }}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        )}
      </Card>

      {/* create meeting */}
      <Drawer
        open={creating}
        onClose={() => setCreating(false)}
        title="Schedule a meeting"
        subtitle="Invite guests, set a time and add the meeting link."
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
            <Button onClick={submit} leftIcon={<CalendarPlus size={15} />}>Schedule meeting</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Subject" required>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Appraisal review — SFMP-PRJ-0002" />
          </Field>

          <Field label="Guests" hint="Add one or more institutions." required>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={gDomain} onChange={(e) => { setGDomain(e.target.value as Domain); setGCompany('') }} className="w-40">
                {DOMAINS.filter((d) => d !== domain).map((d) => <option key={d} value={d}>{DOMAIN_META[d].label}</option>)}
              </Select>
              <Select value={gCompany || guestOptions[0] || ''} onChange={(e) => setGCompany(e.target.value)} className="min-w-52 flex-1">
                {guestOptions.map((g) => <option key={g}>{g}</option>)}
              </Select>
              <Button size="sm" variant="secondary" leftIcon={<Plus size={14} />} onClick={addGuest}>Add</Button>
            </div>
            {guests.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {guests.map((g) => (
                  <span key={g.company} className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 py-1 pl-3 pr-1.5 text-xs font-medium text-navy">
                    {g.company}
                    <button type="button" onClick={() => setGuests((cur) => cur.filter((x) => x.company !== g.company))} className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-navy-100">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Date" required hint="Cannot be in the past.">
              <DatePicker value={date} onChange={setDate} />
            </Field>
            <Field label="Time">
              <TimePicker value={time} onChange={setTime} />
            </Field>
            <Field label="Duration (min)">
              <Select value={duration} onChange={(e) => setDuration(e.target.value)}>
                {['15', '30', '45', '60', '90'].map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
          </div>

          <Field label="Meeting link" required hint="A valid https link (Teams, Meet, Zoom…).">
            <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://meet.example.com/…" />
          </Field>

          {guests.length === 0 && <Badge tone="warning" dot>At least one guest is required</Badge>}
        </div>
      </Drawer>
    </>
  )
}
