import { useMemo, useState } from 'react'
import { UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useDomain, useSubRole } from '@/components/shell/RoleContext'
import { Avatar, Badge, Button, Card, DataTable, Drawer, EmptyState, Field, Input, SearchInput, Select, StatusPill, Tabs, useToast, type Column, type TabItem } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { SUBROLE_BLURB, SUBROLE_LABEL, SUBROLES, can } from '@/data/nav'
import { formatDate } from '@/lib/format'
import type { Persona, SubRole } from '@/data/types'

export function Users() {
  const domain = useDomain()
  const subRole = useSubRole()
  const toast = useToast()
  const { personas, createPersona, setPersonaStatus } = useStore()

  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'all' | 'active' | 'inactive'>('all')
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<SubRole>('initiator')

  const isRoot = can('manageUsers', subRole)
  const mine = personas.filter((p) => p.domain === domain)

  const tabs: TabItem<'all' | 'active' | 'inactive'>[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active', count: mine.filter((p) => p.status === 'active').length },
    { value: 'inactive', label: 'Deactivated', count: mine.filter((p) => p.status === 'inactive').length },
  ]

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mine
      .filter((p) => tab === 'all' || p.status === tab)
      .filter((p) => !q || `${p.name} ${p.email} ${p.phone} ${SUBROLE_LABEL[p.subRole]} ${p.status}`.toLowerCase().includes(q))
  }, [mine, tab, query])

  const submit = () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Missing details', 'Name and email are required.')
      return
    }
    if (phone && phone.replace(/\D/g, '').length !== 11) {
      toast.error('Invalid phone', 'Phone numbers must be 11 digits.')
      return
    }
    createPersona({ name: name.trim(), email: email.trim(), phone: phone.trim(), domain, subRole: role })
    toast.success('User created', `${name.trim()} was added as ${SUBROLE_LABEL[role]}.`)
    setCreating(false)
    setName(''); setEmail(''); setPhone(''); setRole('initiator')
  }

  const columns: Column<Persona>[] = [
    {
      key: 'name',
      header: 'User',
      cell: (p) => (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={p.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-navy">{p.name}</p>
            <p className="truncate text-xs text-navy-400">{p.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', cell: (p) => <Badge tone={p.subRole === 'root' ? 'info' : p.subRole === 'authorizer' ? 'lime' : 'neutral'}>{SUBROLE_LABEL[p.subRole]}</Badge> },
    { key: 'phone', header: 'Phone', cell: (p) => <span className="tnum text-navy-500">{p.phone || '—'}</span> },
    { key: 'created', header: 'Added', align: 'right', cell: (p) => <span className="text-navy-400">{formatDate(p.createdAt)}</span> },
    { key: 'status', header: 'Status', align: 'right', cell: (p) => <StatusPill status={p.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (p) =>
        isRoot && p.subRole !== 'root' ? (
          <Button
            size="sm"
            variant={p.status === 'active' ? 'danger' : 'secondary'}
            onClick={() => {
              setPersonaStatus(p.id, p.status === 'active' ? 'inactive' : 'active')
              toast.info(p.status === 'active' ? 'User deactivated' : 'User reactivated', p.name)
            }}
          >
            {p.status === 'active' ? 'Deactivate' : 'Reactivate'}
          </Button>
        ) : null,
    },
  ]

  if (!isRoot) {
    return (
      <>
        <PageHeader title="User Management" subtitle="Manage the personas in your organisation." />
        <Card>
          <EmptyState
            variant="no-access"
            title="Root access required"
            description={`You are acting as ${SUBROLE_LABEL[subRole]}. Switch to the Root persona (top navigation) to manage users.`}
          />
        </Card>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Create, deactivate and manage the maker-checker personas in your organisation."
        actions={<Button leftIcon={<UserPlus size={16} />} onClick={() => setCreating(true)}>New user</Button>}
      />

      <Card pad={false}>
        <div className="border-b border-hair px-5 pt-5 sm:px-6">
          <Tabs items={tabs} value={tab} onChange={setTab} size="md" />
        </div>
        <div className="px-5 pt-4 sm:px-6">
          <SearchInput placeholder="Search users…" value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full sm:w-72" />
        </div>
        <div className="px-3 pb-4 pt-3 sm:px-4">
          <DataTable columns={columns} rows={rows} rowKey={(p) => p.id} empty={<EmptyState compact variant="users" title="No users yet" description="Add initiators and authorizers to run the maker-checker workflow." />} />
        </div>
      </Card>

      <Drawer
        open={creating}
        onClose={() => setCreating(false)}
        title="New user"
        subtitle="Add a persona to your organisation."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
            <Button onClick={submit} leftIcon={<UserPlus size={15} />}>Create user</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Full name" required>
            <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="First and last name" />
          </Field>
          <Field label="Work email" required>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.ng" />
          </Field>
          <Field label="Phone" hint="11 digits">
            <Input value={phone} maxLength={11} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="0803…" />
          </Field>
          <Field label="Role">
            <Select value={role} onChange={(e) => setRole(e.target.value as SubRole)}>
              {SUBROLES.filter((s) => s !== 'root').map((s) => (
                <option key={s} value={s}>{SUBROLE_LABEL[s]}</option>
              ))}
            </Select>
            <p className="mt-1.5 text-xs leading-relaxed text-navy-400">{SUBROLE_BLURB[role]}</p>
          </Field>
        </div>
      </Drawer>
    </>
  )
}
