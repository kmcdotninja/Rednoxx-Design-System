import { useEffect, useState } from 'react'
import { MoreHorizontal, Pencil, Plus, Power, PowerOff, Trash2 } from 'lucide-react'
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  DataTable,
  Drawer,
  Dropdown,
  EmptyState,
  Field,
  Input,
  Modal,
  SelectMenu,
  StatusPill,
  Toggle,
  useToast,
  type Column,
} from '@/components/ui'
import { FilterBar, ProfileSettings, SelectionBar } from '@/components/blocks'
import { DemoPageHeader, DEMO_USER } from '../DemoShell'
import { TableTabs, type Facet } from '../TableTabs'
import { STAFF, type StaffMember } from '../health'

/* -------------------------------- Staff --------------------------------- */

/** Facilities offered in the staff form — the set the directory already uses. */
const STAFF_FACILITIES = Array.from(new Set(STAFF.map((s) => s.facility)))

/** Create/edit a staff member — one drawer for both (pass `editing` to edit). */
function StaffDrawer({
  open,
  onClose,
  editing,
  onSave,
}: {
  open: boolean
  onClose: () => void
  editing: StaffMember | null
  onSave: (member: StaffMember) => void
}) {
  const { success } = useToast()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [facility, setFacility] = useState(STAFF_FACILITIES[0] ?? '')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; role?: string; email?: string }>({})

  // Seed on open: from the record when editing, blank when creating.
  useEffect(() => {
    if (!open) return
    setName(editing?.name ?? '')
    setRole(editing?.role ?? '')
    setFacility(editing?.facility ?? STAFF_FACILITIES[0] ?? '')
    setEmail(editing?.email ?? '')
    setErrors({})
  }, [open, editing])

  const submit = () => {
    const next = {
      name: name.trim() === '' ? 'Enter the member’s name.' : undefined,
      role: role.trim() === '' ? 'Enter their role.' : undefined,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? undefined : 'Enter a valid work email.',
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return
    onSave({
      id: editing?.id ?? `s-${Date.now().toString(36)}`,
      name: name.trim(),
      role: role.trim(),
      facility,
      email: email.trim(),
      status: editing?.status ?? 'active',
    })
    success(editing ? 'Member updated' : 'Member added', `${name.trim()} saved.`)
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="lg"
      title={editing ? 'Edit member' : 'Add member'}
      subtitle={editing ? 'Update this team member’s details.' : 'Add someone to the staff directory.'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit}>{editing ? 'Save changes' : 'Add member'}</Button>
        </>
      }
    >
      <div className="grid gap-4">
        <Field label="Full name" required error={errors.name}>
          <Input value={name} invalid={!!errors.name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Ada Okeke" />
        </Field>
        <Field label="Role" required error={errors.role} hint="Their job title — controls what they can see and sign off.">
          <Input value={role} invalid={!!errors.role} onChange={(e) => setRole(e.target.value)} placeholder="Cardiologist" />
        </Field>
        <Field label="Facility">
          <SelectMenu value={facility} onChange={setFacility} options={STAFF_FACILITIES.map((f) => ({ value: f, label: f }))} />
        </Field>
        <Field label="Work email" required error={errors.email}>
          <Input type="email" value={email} invalid={!!errors.email} onChange={(e) => setEmail(e.target.value)} placeholder="name@rednoxx.health" />
        </Field>
      </div>
    </Drawer>
  )
}

/**
 * Staff directory — the full team as a table with create/read/update/delete.
 * One drawer creates and edits; delete is a guarded confirm, with deactivate as
 * the reversible alternative. UI-only: rows live in page state so every mutation
 * shows immediately.
 */
export function StaffPage() {
  const { success } = useToast()
  const [members, setMembers] = useState<StaffMember[]>(STAFF)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Facet<StaffMember['status']>>('all')
  const [form, setForm] = useState<{ open: boolean; editing: StaffMember | null }>({ open: false, editing: null })
  const [deleting, setDeleting] = useState<StaffMember | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

  const q = query.trim().toLowerCase()
  const shown = members.filter(
    (m) =>
      (filter === 'all' || m.status === filter) &&
      (q === '' || [m.name, m.role, m.facility, m.email].some((f) => f.toLowerCase().includes(q))),
  )
  const activeCount = members.filter((m) => m.status === 'active').length
  const nounFor = (n: number) => (n === 1 ? 'member' : 'members')

  /** Insert a created record, or replace the edited one (matched by id). */
  const upsert = (rec: StaffMember) =>
    setMembers((prev) => (prev.some((x) => x.id === rec.id) ? prev.map((x) => (x.id === rec.id ? rec : x)) : [rec, ...prev]))
  const toggleStatus = (id: string) =>
    setMembers((prev) => prev.map((x) => (x.id === id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x)))
  const confirmDelete = () => {
    if (!deleting) return
    setMembers((prev) => prev.filter((x) => x.id !== deleting.id))
    setSelected((prev) => prev.filter((id) => id !== deleting.id))
    success('Removed', `${deleting.name} removed from the directory.`)
    setDeleting(null)
  }
  const bulkSetStatus = (status: StaffMember['status']) => {
    const ids = new Set(selected)
    setMembers((prev) => prev.map((x) => (ids.has(x.id) ? { ...x, status } : x)))
    success(status === 'active' ? 'Activated' : 'Deactivated', `${selected.length} ${nounFor(selected.length)} updated.`)
    setSelected([])
  }
  const confirmBulkDelete = () => {
    const ids = new Set(selected)
    setMembers((prev) => prev.filter((x) => !ids.has(x.id)))
    success('Removed', `${selected.length} ${nounFor(selected.length)} removed.`)
    setSelected([])
    setBulkDeleteOpen(false)
  }

  const columns: Column<StaffMember>[] = [
    {
      key: 'member',
      header: 'Member',
      cell: (m) => (
        <span className="flex items-center gap-3">
          <Avatar name={m.name} size="sm" />
          <span className="min-w-0">
            <span className="block font-medium text-forest">{m.name}</span>
            <span className="block text-xs text-forest-400">{m.email}</span>
          </span>
        </span>
      ),
    },
    { key: 'role', header: 'Role', cell: (m) => m.role },
    { key: 'facility', header: 'Facility', cell: (m) => m.facility },
    { key: 'status', header: 'Status', cell: (m) => <StatusPill status={m.status} /> },
    {
      key: 'actions',
      header: <span className="sr-only">Actions</span>,
      align: 'right',
      cell: (m) => (
        <div className="flex justify-end">
          <Dropdown
            align="right"
            items={[
              { label: 'Edit', icon: Pencil, onSelect: () => setForm({ open: true, editing: m }) },
              {
                label: m.status === 'active' ? 'Deactivate' : 'Activate',
                icon: m.status === 'active' ? PowerOff : Power,
                onSelect: () => toggleStatus(m.id),
              },
              { label: 'Remove', icon: Trash2, danger: true, separator: true, onSelect: () => setDeleting(m) },
            ]}
            trigger={
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg text-forest-400 transition-colors hover:bg-panel"
                aria-label={`Actions for ${m.name}`}
              >
                <MoreHorizontal size={16} />
              </span>
            }
          />
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader
          title="Staff"
          subtitle={`${activeCount} active of ${members.length} members across the network`}
          actions={
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setForm({ open: true, editing: null })}>
              Add member
            </Button>
          }
        />
      </div>

      <FilterBar
        search={{
          value: query,
          onChange: setQuery,
          label: 'Search staff by name, role, facility or email',
          placeholder: 'Search staff…',
        }}
      />

      <Card pad={false} className="animate-rise">
        {/* Counts follow the live directory, so activate/deactivate/remove update the tabs. */}
        <TableTabs
          className="px-5 pt-4 sm:px-6"
          rows={members}
          facetOf={(m) => m.status}
          order={['active', 'inactive']}
          value={filter}
          onChange={setFilter}
        />
        {shown.length === 0 ? (
          <EmptyState
            variant="search"
            title={q ? `No staff match “${query.trim()}”` : filter === 'all' ? 'No staff yet' : `No ${filter} members`}
            description={
              q
                ? 'Try another name, role or facility.'
                : filter === 'all'
                  ? 'Add your first team member to the directory.'
                  : 'Switch tabs to see the rest of the directory.'
            }
            action={
              q ? (
                <Button variant="secondary" onClick={() => setQuery('')}>
                  Clear search
                </Button>
              ) : filter === 'all' ? (
                <Button leftIcon={<Plus size={14} />} onClick={() => setForm({ open: true, editing: null })}>
                  Add member
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => setFilter('all')}>
                  Show all members
                </Button>
              )
            }
          />
        ) : (
          <DataTable
            columns={columns}
            rows={shown}
            rowKey={(m) => m.id}
            selectable
            selectedKeys={selected}
            onSelectionChange={setSelected}
          />
        )}
      </Card>

      {/* Floating bulk-action bar — shown while rows are selected. */}
      <SelectionBar count={selected.length} onClear={() => setSelected([])} noun={`${nounFor(selected.length)} selected`}>
        <Button size="sm" variant="ghost" leftIcon={<Power size={14} />} onClick={() => bulkSetStatus('active')}>
          Activate
        </Button>
        <Button size="sm" variant="ghost" leftIcon={<PowerOff size={14} />} onClick={() => bulkSetStatus('inactive')}>
          Deactivate
        </Button>
        <Button size="sm" variant="danger" leftIcon={<Trash2 size={14} />} onClick={() => setBulkDeleteOpen(true)}>
          Remove
        </Button>
      </SelectionBar>

      <StaffDrawer
        open={form.open}
        onClose={() => setForm((s) => ({ ...s, open: false }))}
        editing={form.editing}
        onSave={upsert}
      />

      {/* Delete → a decision, so a modal. */}
      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title={`Remove ${deleting?.name}?`}
        subtitle="This removes them from the staff directory. It cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="danger" leftIcon={<Trash2 size={14} />} onClick={confirmDelete}>
              Remove
            </Button>
          </>
        }
      >
        <p className="text-[13px] leading-relaxed text-forest-500">
          Removing a member revokes their access. If they may return, deactivate them instead — inactive
          members keep their history but can’t sign in.
        </p>
      </Modal>

      <Modal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        title={`Remove ${selected.length} ${nounFor(selected.length)}?`}
        subtitle="This removes them from the staff directory. It cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setBulkDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" leftIcon={<Trash2 size={14} />} onClick={confirmBulkDelete}>
              Remove {selected.length}
            </Button>
          </>
        }
      >
        <p className="text-[13px] leading-relaxed text-forest-500">
          These {nounFor(selected.length)} will lose access. If any may return, deactivate them instead.
        </p>
      </Modal>
    </>
  )
}

/* ------------------------------- Settings ------------------------------- */

const NOTIFICATIONS = [
  { key: 'reminders', label: 'Appointment reminders', hint: 'SMS to patients 24 hours ahead' },
  { key: 'labs', label: 'Lab results ready', hint: 'Notify the ordering clinician' },
  { key: 'claims', label: 'Claim decisions', hint: 'Approvals and rejections from insurers' },
  { key: 'digest', label: 'Weekly digest', hint: 'Network summary every Monday morning' },
]

export function SettingsPage() {
  const { success } = useToast()
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    reminders: true,
    labs: true,
    claims: true,
    digest: false,
  })
  const [twoFa, setTwoFa] = useState(true)

  return (
    <>
      <div className="animate-rise">
        <DemoPageHeader
          title="Settings"
          subtitle="Organisation profile, notifications and security"
          actions={
            <Button size="sm" onClick={() => success('Settings saved', 'Changes apply across all facilities.')}>
              Save changes
            </Button>
          }
        />
      </div>

      <ProfileSettings user={DEMO_USER} className="animate-rise" />

      <Card className="animate-rise" style={{ animationDelay: '60ms' }}>
        <CardHeader title="Organisation" subtitle="Shown on invoices, SMS and patient-facing pages" />
        <div className="mt-5 grid max-w-2xl gap-4 sm:grid-cols-2">
          <Field label="Organisation name" required>
            <Input defaultValue="Rednoxx Health Ltd" />
          </Field>
          <Field label="Support email" required>
            <Input type="email" defaultValue="care@rednoxx.health" />
          </Field>
          <Field label="Support phone">
            <Input type="tel" defaultValue="+234 700 733 6699" />
          </Field>
          <Field label="Default timezone">
            <SelectMenu
              defaultValue="Africa/Lagos (WAT)"
              options={['Africa/Lagos (WAT)', 'Africa/Accra (GMT)', 'Europe/London (BST)'].map((tz) => ({ value: tz, label: tz }))}
            />
          </Field>
        </div>
      </Card>

      <Card className="animate-rise" style={{ animationDelay: '120ms' }}>
        <CardHeader title="Notifications" subtitle="What Rednoxx sends, and to whom" />
        <ul className="mt-4 max-w-2xl divide-y divide-hair/70">
          {NOTIFICATIONS.map((n) => (
            <li key={n.key} className="flex items-center justify-between gap-4 py-3.5">
              <span>
                <span className="block text-sm font-medium text-forest">{n.label}</span>
                <span className="block text-[13px] text-forest-400">{n.hint}</span>
              </span>
              <Toggle
                checked={toggles[n.key]}
                onChange={(next) => setToggles((t) => ({ ...t, [n.key]: next }))}
              />
            </li>
          ))}
        </ul>
      </Card>

      <Card className="animate-rise" style={{ animationDelay: '180ms' }}>
        <CardHeader title="Security" subtitle="Applies to every staff account" />
        <div className="mt-4 max-w-2xl space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span>
              <span className="block text-sm font-medium text-forest">Two-factor authentication</span>
              <span className="block text-[13px] text-forest-400">Required at sign-in on new devices</span>
            </span>
            <Toggle checked={twoFa} onChange={setTwoFa} />
          </div>
          <Field label="Session timeout" hint="Staff are signed out after this period of inactivity.">
            <SelectMenu
              defaultValue="15 minutes"
              className="max-w-52"
              options={['5 minutes', '15 minutes', '30 minutes', '1 hour'].map((t) => ({ value: t, label: t }))}
            />
          </Field>
        </div>
      </Card>
    </>
  )
}
