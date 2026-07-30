import { useMemo, useState } from 'react'
import {
  Building2,
  DoorOpen,
  MoreHorizontal,
  Network,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Trash2,
  UserCog,
} from 'lucide-react'
import {
  Alert,
  Button,
  Card,
  DataTable,
  Dropdown,
  EmptyState,
  Modal,
  StatusPill,
  Tabs,
  Tag,
  useToast,
  type Column,
  type DropdownItem,
  type TabItem,
} from '@/components/ui'
import { FilterBar, SelectionBar } from '@/components/blocks'
import { HimPageHeader } from '../HimShell'
import {
  HIM_DEPARTMENTS,
  HIM_DIRECTORS,
  HIM_ORG_FACILITIES,
  HIM_WARDS,
  type HimDepartment,
  type HimDirector,
  type HimFacility,
  type HimWard,
  type OrgStatus,
} from '../data'
import { DepartmentDrawer, DirectorDrawer, FacilityDrawer, WardDrawer } from '../AdminDrawers'
import { useRole } from '../rbac'

type AdminTab = 'facilities' | 'departments' | 'wards' | 'directors'

/** Monospace code cell — org codes are identifiers, like MRNs. */
function Code({ children }: { children: string }) {
  return <span className="font-mono text-[13px] text-forest-500">{children}</span>
}

/** What the delete confirm needs to render — including why it may be blocked. */
interface Deleting {
  kind: AdminTab
  id: string
  label: string
  /** Non-null when the record has dependents and cannot be deleted. */
  blocked: string | null
}

/**
 * Facility administration — the org spine: facilities, the departments inside
 * them, the wards inside those, and the appointed directors. Full CRUD:
 * creating and editing use the same drawer per entity; deleting is a guarded
 * confirm (blocked while dependents exist), with deactivate as the softer path.
 * All mutation is gated on the RBAC `manageConfig` permission (Facility Admin).
 */
export function HimAdminPage() {
  const { persona, can } = useRole()
  const { success } = useToast()
  const [tab, setTab] = useState<AdminTab>('facilities')
  const [query, setQuery] = useState('')

  // UI-only demo: rows live in page state so create/edit/delete show at once.
  const [facilities, setFacilities] = useState<HimFacility[]>(HIM_ORG_FACILITIES)
  const [departments, setDepartments] = useState<HimDepartment[]>(HIM_DEPARTMENTS)
  const [wards, setWards] = useState<HimWard[]>(HIM_WARDS)
  const [directors, setDirectors] = useState<HimDirector[]>(HIM_DIRECTORS)

  // Each entity has one drawer that both creates (editing = null) and edits.
  const [facilityForm, setFacilityForm] = useState<{ open: boolean; editing: HimFacility | null }>({ open: false, editing: null })
  const [departmentForm, setDepartmentForm] = useState<{ open: boolean; editing: HimDepartment | null }>({ open: false, editing: null })
  const [wardForm, setWardForm] = useState<{ open: boolean; editing: HimWard | null }>({ open: false, editing: null })
  const [directorForm, setDirectorForm] = useState<{ open: boolean; editing: HimDirector | null }>({ open: false, editing: null })
  const [deleting, setDeleting] = useState<Deleting | null>(null)

  // Multi-select (rowKey = entity id) drives the floating bulk-action bar.
  const [selected, setSelected] = useState<string[]>([])
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const changeTab = (next: AdminTab) => {
    setTab(next)
    setSelected([]) // selection is per-tab
  }

  const facilityById = useMemo(() => Object.fromEntries(facilities.map((f) => [f.id, f])), [facilities])
  const departmentById = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d])), [departments])

  /** Insert a created record, or replace the edited one (matched by id). */
  function upsert<T extends { id: string }>(setList: React.Dispatch<React.SetStateAction<T[]>>) {
    return (rec: T) =>
      setList((prev) => (prev.some((x) => x.id === rec.id) ? prev.map((x) => (x.id === rec.id ? rec : x)) : [rec, ...prev]))
  }
  function toggleStatus<T extends { id: string; status: OrgStatus }>(
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    id: string,
  ) {
    setList((prev) => prev.map((x) => (x.id === id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x)))
  }

  const q = query.trim().toLowerCase()
  const matches = (...fields: string[]) => q === '' || fields.some((f) => f.toLowerCase().includes(q))

  const shownFacilities = facilities.filter((f) => matches(f.name, f.code, f.lga, f.state, f.type))
  const shownDepartments = departments.filter((d) => matches(d.name, d.code, d.type, d.head, facilityById[d.facilityId]?.name ?? ''))
  const shownWards = wards.filter((w) =>
    matches(w.name, w.code, w.type, facilityById[w.facilityId]?.name ?? '', departmentById[w.departmentId]?.name ?? ''),
  )
  const shownDirectors = directors.filter((d) => matches(d.name, d.role, d.email, facilityById[d.facilityId]?.name ?? ''))

  // ---- delete guards: a record with dependents cannot be hard-deleted -------
  const askDeleteFacility = (f: HimFacility) => {
    const deps =
      departments.filter((d) => d.facilityId === f.id).length +
      wards.filter((w) => w.facilityId === f.id).length +
      directors.filter((d) => d.facilityId === f.id).length
    setDeleting({
      kind: 'facilities',
      id: f.id,
      label: f.name,
      blocked: deps > 0 ? `${f.name} still has ${deps} linked ${deps === 1 ? 'record' : 'records'} (departments, wards or directors). Remove or reassign those first, or deactivate the facility instead.` : null,
    })
  }
  const askDeleteDepartment = (d: HimDepartment) => {
    const deps = wards.filter((w) => w.departmentId === d.id).length + directors.filter((x) => x.departmentId === d.id).length
    setDeleting({
      kind: 'departments',
      id: d.id,
      label: d.name,
      blocked: deps > 0 ? `${d.name} still has ${deps} linked ${deps === 1 ? 'record' : 'records'} (wards or directors). Remove or reassign those first, or deactivate the department instead.` : null,
    })
  }
  const askDeleteWard = (w: HimWard) => setDeleting({ kind: 'wards', id: w.id, label: w.name, blocked: null })
  const askDeleteDirector = (d: HimDirector) => setDeleting({ kind: 'directors', id: d.id, label: d.name, blocked: null })

  const confirmDelete = () => {
    if (!deleting || deleting.blocked) return
    const remove = <T extends { id: string }>(setList: React.Dispatch<React.SetStateAction<T[]>>) =>
      setList((prev) => prev.filter((x) => x.id !== deleting.id))
    if (deleting.kind === 'facilities') remove(setFacilities)
    else if (deleting.kind === 'departments') remove(setDepartments)
    else if (deleting.kind === 'wards') remove(setWards)
    else remove(setDirectors)
    setSelected((prev) => prev.filter((id) => id !== deleting.id))
    success('Deleted', `${deleting.label} removed.`)
    setDeleting(null)
  }

  /** From a blocked delete, deactivate instead — the reversible alternative. */
  const deactivateFromBlocked = () => {
    if (!deleting) return
    if (deleting.kind === 'facilities') toggleStatusTo(setFacilities, deleting.id, 'inactive')
    else if (deleting.kind === 'departments') toggleStatusTo(setDepartments, deleting.id, 'inactive')
    else if (deleting.kind === 'wards') toggleStatusTo(setWards, deleting.id, 'inactive')
    else toggleStatusTo(setDirectors, deleting.id, 'inactive')
    success('Deactivated', `${deleting.label} is now inactive.`)
    setDeleting(null)
  }
  function toggleStatusTo<T extends { id: string; status: OrgStatus }>(
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    id: string,
    status: OrgStatus,
  ) {
    setList((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)))
  }

  // ---- bulk actions (floating SelectionBar) --------------------------------
  const nouns: Record<AdminTab, [string, string]> = {
    facilities: ['facility', 'facilities'],
    departments: ['department', 'departments'],
    wards: ['ward', 'wards'],
    directors: ['director', 'directors'],
  }
  const nounFor = (n: number) => (n === 1 ? nouns[tab][0] : nouns[tab][1])

  /** True when a facility/department still has records pointing at it. */
  const hasDependents = (kind: AdminTab, id: string): boolean => {
    if (kind === 'facilities')
      return departments.some((d) => d.facilityId === id) || wards.some((w) => w.facilityId === id) || directors.some((d) => d.facilityId === id)
    if (kind === 'departments') return wards.some((w) => w.departmentId === id) || directors.some((d) => d.departmentId === id)
    return false
  }

  const bulkSetStatus = (status: OrgStatus) => {
    const ids = new Set(selected)
    const apply = <T extends { id: string; status: OrgStatus }>(x: T): T => (ids.has(x.id) ? { ...x, status } : x)
    if (tab === 'facilities') setFacilities((prev) => prev.map(apply))
    else if (tab === 'departments') setDepartments((prev) => prev.map(apply))
    else if (tab === 'wards') setWards((prev) => prev.map(apply))
    else setDirectors((prev) => prev.map(apply))
    success(status === 'active' ? 'Activated' : 'Deactivated', `${selected.length} ${nounFor(selected.length)} updated.`)
    setSelected([])
  }

  const bulkDeletableIds = selected.filter((id) => !hasDependents(tab, id))
  const bulkBlockedCount = selected.length - bulkDeletableIds.length

  const confirmBulkDelete = () => {
    const ids = new Set(bulkDeletableIds)
    if (tab === 'facilities') setFacilities((prev) => prev.filter((x) => !ids.has(x.id)))
    else if (tab === 'departments') setDepartments((prev) => prev.filter((x) => !ids.has(x.id)))
    else if (tab === 'wards') setWards((prev) => prev.filter((x) => !ids.has(x.id)))
    else setDirectors((prev) => prev.filter((x) => !ids.has(x.id)))
    success('Deleted', `${bulkDeletableIds.length} ${nounFor(bulkDeletableIds.length)} removed.`)
    setSelected([])
    setBulkDeleteOpen(false)
  }

  // ---- row-action menus (kebab), rendered only when the role can configure --
  const rowMenu = (items: DropdownItem[]) => (
    <div className="flex justify-end">
      <Dropdown
        align="right"
        items={items}
        trigger={
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-forest-400 transition-colors hover:bg-panel"
            aria-label="Row actions"
          >
            <MoreHorizontal size={16} />
          </span>
        }
      />
    </div>
  )
  const statusItem = (status: OrgStatus, onToggle: () => void): DropdownItem => ({
    label: status === 'active' ? 'Deactivate' : 'Activate',
    icon: status === 'active' ? PowerOff : Power,
    onSelect: onToggle,
  })
  const actionsHeader = <span className="sr-only">Actions</span>

  const facilityColumns: Column<HimFacility>[] = [
    {
      key: 'name',
      header: 'Facility',
      cell: (f) => (
        <span>
          <span className="block font-medium text-forest">{f.name}</span>
          <span className="block text-xs text-forest-400">{f.lga} · {f.state}</span>
        </span>
      ),
    },
    { key: 'code', header: 'Code', cell: (f) => <Code>{f.code}</Code> },
    { key: 'type', header: 'Type', cell: (f) => <Tag>{f.type}</Tag> },
    { key: 'tier', header: 'Tier', align: 'right', cell: (f) => <span className="tnum">{f.tier}</span> },
    { key: 'units', header: 'Departments', align: 'right', cell: (f) => <span className="tnum">{departments.filter((d) => d.facilityId === f.id).length}</span> },
    { key: 'status', header: 'Status', cell: (f) => <StatusPill status={f.status} /> },
    ...(can.manageConfig
      ? [{
          key: 'actions',
          header: actionsHeader,
          align: 'right',
          cell: (f: HimFacility) =>
            rowMenu([
              { label: 'Edit', icon: Pencil, onSelect: () => setFacilityForm({ open: true, editing: f }) },
              statusItem(f.status, () => toggleStatus(setFacilities, f.id)),
              { label: 'Delete', icon: Trash2, danger: true, separator: true, onSelect: () => askDeleteFacility(f) },
            ]),
        } as Column<HimFacility>]
      : []),
  ]

  const departmentColumns: Column<HimDepartment>[] = [
    {
      key: 'name',
      header: 'Department',
      cell: (d) => (
        <span>
          <span className="block font-medium text-forest">{d.name}</span>
          <span className="block text-xs text-forest-400">{facilityById[d.facilityId]?.name ?? 'Unknown facility'}</span>
        </span>
      ),
    },
    { key: 'code', header: 'Code', cell: (d) => <Code>{d.code}</Code> },
    { key: 'type', header: 'Type', cell: (d) => <Tag className="capitalize">{d.type}</Tag> },
    { key: 'head', header: 'Head', cell: (d) => d.head },
    { key: 'wards', header: 'Wards', align: 'right', cell: (d) => <span className="tnum">{wards.filter((w) => w.departmentId === d.id).length}</span> },
    { key: 'status', header: 'Status', cell: (d) => <StatusPill status={d.status} /> },
    ...(can.manageConfig
      ? [{
          key: 'actions',
          header: actionsHeader,
          align: 'right',
          cell: (d: HimDepartment) =>
            rowMenu([
              { label: 'Edit', icon: Pencil, onSelect: () => setDepartmentForm({ open: true, editing: d }) },
              statusItem(d.status, () => toggleStatus(setDepartments, d.id)),
              { label: 'Delete', icon: Trash2, danger: true, separator: true, onSelect: () => askDeleteDepartment(d) },
            ]),
        } as Column<HimDepartment>]
      : []),
  ]

  const wardColumns: Column<HimWard>[] = [
    {
      key: 'name',
      header: 'Ward',
      cell: (w) => (
        <span>
          <span className="block font-medium text-forest">{w.name}</span>
          <span className="block text-xs text-forest-400">
            {departmentById[w.departmentId]?.name ?? 'Unknown department'} · {facilityById[w.facilityId]?.name ?? 'Unknown facility'}
          </span>
        </span>
      ),
    },
    { key: 'code', header: 'Code', cell: (w) => <Code>{w.code}</Code> },
    { key: 'type', header: 'Type', cell: (w) => <Tag className="capitalize">{w.type}</Tag> },
    { key: 'sex', header: 'Admits', cell: (w) => <span className="capitalize">{w.sex}</span> },
    { key: 'beds', header: 'Beds', align: 'right', cell: (w) => <span className="tnum">{w.beds}</span> },
    { key: 'status', header: 'Status', cell: (w) => <StatusPill status={w.status} /> },
    ...(can.manageConfig
      ? [{
          key: 'actions',
          header: actionsHeader,
          align: 'right',
          cell: (w: HimWard) =>
            rowMenu([
              { label: 'Edit', icon: Pencil, onSelect: () => setWardForm({ open: true, editing: w }) },
              statusItem(w.status, () => toggleStatus(setWards, w.id)),
              { label: 'Delete', icon: Trash2, danger: true, separator: true, onSelect: () => askDeleteWard(w) },
            ]),
        } as Column<HimWard>]
      : []),
  ]

  const directorColumns: Column<HimDirector>[] = [
    {
      key: 'name',
      header: 'Director',
      cell: (d) => (
        <span>
          <span className="block font-medium text-forest">{d.name}</span>
          <span className="block text-xs text-forest-400">{d.email}</span>
        </span>
      ),
    },
    { key: 'role', header: 'Office', cell: (d) => d.role },
    {
      key: 'facility',
      header: 'Facility',
      cell: (d) => (
        <span>
          <span className="block">{facilityById[d.facilityId]?.name ?? 'Unknown facility'}</span>
          {d.departmentId && <span className="block text-xs text-forest-400">{departmentById[d.departmentId]?.name ?? 'Unknown department'}</span>}
        </span>
      ),
    },
    { key: 'appointed', header: 'Appointed', align: 'right', cell: (d) => <span className="tnum">{d.appointed}</span> },
    { key: 'status', header: 'Status', cell: (d) => <StatusPill status={d.status} /> },
    ...(can.manageConfig
      ? [{
          key: 'actions',
          header: actionsHeader,
          align: 'right',
          cell: (d: HimDirector) =>
            rowMenu([
              { label: 'Edit', icon: Pencil, onSelect: () => setDirectorForm({ open: true, editing: d }) },
              statusItem(d.status, () => toggleStatus(setDirectors, d.id)),
              { label: 'Delete', icon: Trash2, danger: true, separator: true, onSelect: () => askDeleteDirector(d) },
            ]),
        } as Column<HimDirector>]
      : []),
  ]

  const tabs: TabItem<AdminTab>[] = [
    { value: 'facilities', label: 'Facilities', count: facilities.length, icon: Building2 },
    { value: 'departments', label: 'Departments', count: departments.length, icon: Network },
    { value: 'wards', label: 'Wards', count: wards.length, icon: DoorOpen },
    { value: 'directors', label: 'Directors', count: directors.length, icon: UserCog },
  ]

  const create = {
    facilities: { label: 'New facility', open: () => setFacilityForm({ open: true, editing: null }) },
    departments: { label: 'New department', open: () => setDepartmentForm({ open: true, editing: null }) },
    wards: { label: 'New ward', open: () => setWardForm({ open: true, editing: null }) },
    directors: { label: 'New director', open: () => setDirectorForm({ open: true, editing: null }) },
  }[tab]

  const searchLabel = {
    facilities: 'Search facilities by name, code or LGA',
    departments: 'Search departments by name, code or facility',
    wards: 'Search wards by name, code, department or facility',
    directors: 'Search directors by name, office, email or facility',
  }[tab]

  const emptyCopy = {
    facilities: { title: 'No facilities match that search', description: 'Try the facility code, LGA or state.' },
    departments: { title: 'No departments match that search', description: 'Try the department code or its facility.' },
    wards: { title: 'No wards match that search', description: 'Try the ward code, its department or facility.' },
    directors: { title: 'No directors match that search', description: 'Try the office title or the facility.' },
  }[tab]

  const rowCount = { facilities: shownFacilities.length, departments: shownDepartments.length, wards: shownWards.length, directors: shownDirectors.length }[tab]

  return (
    <>
      <HimPageHeader
        title="Facility administration"
        subtitle="Facilities, departments, wards and directors — the org structure every record is scoped to."
        actions={can.manageConfig ? <Button leftIcon={<Plus size={14} />} onClick={create.open}>{create.label}</Button> : undefined}
      />

      {!can.manageConfig && (
        <Alert tone="info" title="Read-only for your role">
          {persona.title} can view the org structure but not change it. Facility, department, ward and
          director configuration is the Facility Admin's responsibility under the Core Platform RBAC model.
        </Alert>
      )}

      <Tabs items={tabs} value={tab} onChange={changeTab} />

      <FilterBar search={{ value: query, onChange: setQuery, label: searchLabel, placeholder: 'Search…' }} />

      {rowCount === 0 ? (
        <Card pad={false}>
          <EmptyState variant="search" title={emptyCopy.title} description={emptyCopy.description} action={<Button variant="secondary" onClick={() => setQuery('')}>Clear search</Button>} />
        </Card>
      ) : (
        <Card pad={false}>
          {tab === 'facilities' && (
            <DataTable columns={facilityColumns} rows={shownFacilities} rowKey={(f) => f.id} selectable={can.manageConfig} selectedKeys={selected} onSelectionChange={setSelected} />
          )}
          {tab === 'departments' && (
            <DataTable columns={departmentColumns} rows={shownDepartments} rowKey={(d) => d.id} selectable={can.manageConfig} selectedKeys={selected} onSelectionChange={setSelected} />
          )}
          {tab === 'wards' && (
            <DataTable columns={wardColumns} rows={shownWards} rowKey={(w) => w.id} selectable={can.manageConfig} selectedKeys={selected} onSelectionChange={setSelected} />
          )}
          {tab === 'directors' && (
            <DataTable columns={directorColumns} rows={shownDirectors} rowKey={(d) => d.id} selectable={can.manageConfig} selectedKeys={selected} onSelectionChange={setSelected} />
          )}
        </Card>
      )}

      {/* Floating bulk-action bar — shown while rows are selected. */}
      <SelectionBar count={selected.length} onClear={() => setSelected([])} noun={`${nounFor(selected.length)} selected`}>
        <Button size="sm" variant="ghost" leftIcon={<Power size={14} />} onClick={() => bulkSetStatus('active')}>
          Activate
        </Button>
        <Button size="sm" variant="ghost" leftIcon={<PowerOff size={14} />} onClick={() => bulkSetStatus('inactive')}>
          Deactivate
        </Button>
        <Button size="sm" variant="danger" leftIcon={<Trash2 size={14} />} onClick={() => setBulkDeleteOpen(true)}>
          Delete
        </Button>
      </SelectionBar>

      <FacilityDrawer
        open={facilityForm.open}
        onClose={() => setFacilityForm((s) => ({ ...s, open: false }))}
        editing={facilityForm.editing}
        facilities={facilities}
        onSave={upsert(setFacilities)}
      />
      <DepartmentDrawer
        open={departmentForm.open}
        onClose={() => setDepartmentForm((s) => ({ ...s, open: false }))}
        editing={departmentForm.editing}
        facilities={facilities}
        departments={departments}
        onSave={upsert(setDepartments)}
      />
      <WardDrawer
        open={wardForm.open}
        onClose={() => setWardForm((s) => ({ ...s, open: false }))}
        editing={wardForm.editing}
        facilities={facilities}
        departments={departments}
        wards={wards}
        onSave={upsert(setWards)}
      />
      <DirectorDrawer
        open={directorForm.open}
        onClose={() => setDirectorForm((s) => ({ ...s, open: false }))}
        editing={directorForm.editing}
        facilities={facilities}
        departments={departments}
        directors={directors}
        onSave={upsert(setDirectors)}
      />

      {/* Delete → a decision, so a modal. Blocked while dependents exist. */}
      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title={deleting?.blocked ? `Can’t delete ${deleting.label}` : `Delete ${deleting?.label}?`}
        subtitle={deleting?.blocked ? undefined : 'This removes the record from the register. It cannot be undone.'}
        footer={
          deleting?.blocked ? (
            <>
              <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
              <Button variant="secondary" leftIcon={<PowerOff size={14} />} onClick={deactivateFromBlocked}>Deactivate instead</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
              <Button variant="danger" leftIcon={<Trash2 size={14} />} onClick={confirmDelete}>Delete</Button>
            </>
          )
        }
      >
        <p className="text-[13px] leading-relaxed text-forest-500">
          {deleting?.blocked ?? 'Deleting is permanent. If this unit may be used again, deactivate it instead — inactive units keep their history but stop accepting new activity.'}
        </p>
      </Modal>

      {/* Bulk delete from the SelectionBar — skips any with dependents. */}
      <Modal
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        title={bulkDeletableIds.length === 0 ? `Can’t delete these ${nounFor(selected.length)}` : `Delete ${bulkDeletableIds.length} ${nounFor(bulkDeletableIds.length)}?`}
        subtitle={bulkDeletableIds.length === 0 ? undefined : 'This removes them from the register. It cannot be undone.'}
        footer={
          bulkDeletableIds.length === 0 ? (
            <>
              <Button variant="secondary" onClick={() => setBulkDeleteOpen(false)}>Cancel</Button>
              <Button variant="secondary" leftIcon={<PowerOff size={14} />} onClick={() => { setBulkDeleteOpen(false); bulkSetStatus('inactive') }}>Deactivate instead</Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setBulkDeleteOpen(false)}>Cancel</Button>
              <Button variant="danger" leftIcon={<Trash2 size={14} />} onClick={confirmBulkDelete}>Delete {bulkDeletableIds.length}</Button>
            </>
          )
        }
      >
        <p className="text-[13px] leading-relaxed text-forest-500">
          {bulkDeletableIds.length === 0
            ? `All ${selected.length} selected ${nounFor(selected.length)} still have linked records. Deactivate them instead — inactive units keep their history but stop accepting new activity.`
            : bulkBlockedCount > 0
              ? `${bulkBlockedCount} of the ${selected.length} selected still ${bulkBlockedCount === 1 ? 'has' : 'have'} linked records and will be kept — deactivate those instead. The other ${bulkDeletableIds.length} will be permanently deleted.`
              : `These ${nounFor(bulkDeletableIds.length)} will be permanently removed. If they may be used again, deactivate instead.`}
        </p>
      </Modal>
    </>
  )
}
