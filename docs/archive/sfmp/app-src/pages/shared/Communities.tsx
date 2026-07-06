import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, MapPin, Plus, UsersRound } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useDomain, useSubRole } from '@/components/shell/RoleContext'
import { Badge, Button, Card, DataTable, EmptyState, Field, Input, Modal, SearchInput, StatusPill, Textarea, ViewToggle, useToast, type Column, type ViewMode } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { can, DOMAIN_META } from '@/data/nav'
import type { Community } from '@/data/types'

export function Communities() {
  const navigate = useNavigate()
  const domain = useDomain()
  const subRole = useSubRole()
  const toast = useToast()
  const { communities, createCommunity } = useStore()
  const maker = can('create', subRole)

  const [query, setQuery] = useState('')
  const [view, setView] = useState<ViewMode>('table')
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return communities.filter((c) => !q || `${c.name} ${c.description} ${c.location}`.toLowerCase().includes(q))
  }, [communities, query])

  const submit = () => {
    if (!name.trim() || !description.trim()) {
      toast.error('Missing details', 'A community needs a name and description.')
      return
    }
    createCommunity({ name: name.trim(), description: description.trim(), location: location.trim() })
    toast.success('Community created', `${name.trim()} is now active.`)
    setCreating(false)
    setName(''); setDescription(''); setLocation('')
  }

  const columns: Column<Community>[] = [
    {
      key: 'name',
      header: 'Community',
      cell: (c) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-navy">{c.name}</p>
          <p className="truncate text-xs text-navy-400">{c.location || '—'}</p>
        </div>
      ),
    },
    { key: 'members', header: 'Members', align: 'right', cell: (c) => <span className="tnum text-navy-500">{c.members.length}</span> },
    { key: 'leaders', header: 'Leaders', align: 'right', cell: (c) => <span className="tnum text-navy-500">{c.leaders.length}</span> },
    { key: 'offers', header: 'Offers', align: 'right', cell: (c) => <span className="tnum text-navy-500">{c.offers.length}</span> },
    { key: 'status', header: 'Status', align: 'right', cell: (c) => <StatusPill status={c.status} /> },
  ]

  return (
    <>
      <PageHeader
        title="Communities"
        subtitle="Community-based lending — leaders, members and published loan offers."
        actions={maker && <Button leftIcon={<Plus size={16} />} onClick={() => setCreating(true)}>New community</Button>}
      />

      <div className="mb-5 flex items-center justify-between gap-3">
        <SearchInput placeholder="Search communities…" value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full sm:w-96" />
        <ViewToggle value={view} onChange={setView} first="table" />
      </div>

      {rows.length === 0 ? (
        <Card>
          <EmptyState variant="users" title="No communities yet" description="Create a community to start publishing loan offers to its members." />
        </Card>
      ) : view === 'table' ? (
        <Card pad={false}>
          <div className="px-3 py-3 sm:px-4">
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(c) => c.id}
              onRowClick={(c) => navigate(`${DOMAIN_META[domain].base}/communities/${c.id}`)}
            />
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`${DOMAIN_META[domain].base}/communities/${c.id}`)}
              className="group flex flex-col rounded-4xl border border-hair bg-white p-5 text-left transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-50 text-navy">
                  <UsersRound size={20} />
                </span>
                <StatusPill status={c.status} />
              </div>
              <h3 className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-navy">{c.name}</h3>
              <p className="mt-1 line-clamp-2 flex-1 text-[13px] leading-relaxed text-navy-400">{c.description}</p>
              {c.location && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-navy-400">
                  <MapPin size={13} /> {c.location}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone="neutral">{c.members.length} member(s)</Badge>
                <Badge tone="neutral">{c.leaders.length} leader(s)</Badge>
                <Badge tone="info">{c.offers.length} offer(s)</Badge>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy">
                Open community
                <ChevronRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="New community"
        subtitle="Set up a community for member lending."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
            <Button onClick={submit}>Create community</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Community name" required>
            <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jos Solar Traders Cooperative" />
          </Field>
          <Field label="Description" required>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <Field label="Location">
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" />
          </Field>
        </div>
      </Modal>
    </>
  )
}
