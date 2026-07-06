import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChartPie, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useSubRole } from '@/components/shell/RoleContext'
import { Badge, Button, Card, DataTable, EmptyState, Field, Input, Modal, SearchInput, StatusPill, ViewToggle, useToast, type Column, type ViewMode } from '@/components/ui'
import { useStore, newId } from '@/store/AppStore'
import { can } from '@/data/nav'
import type { Sector } from '@/data/types'

export function AdminSectors() {
  const navigate = useNavigate()
  const toast = useToast()
  const subRole = useSubRole()
  const { sectors, saveSectorDraft } = useStore()
  const maker = can('create', subRole)

  const [query, setQuery] = useState('')
  const [view, setView] = useState<ViewMode>('table')
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [facilityNames, setFacilityNames] = useState<string[]>([''])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    // Draft sectors are visible on the initiator view only — the checker sees
    // them once they reach the approval queue (status "pending").
    return sectors
      .filter((s) => (maker ? true : s.status !== 'draft'))
      .filter((s) => !q || `${s.name} ${s.status} ${s.facilityTypes.map((f) => f.name).join(' ')}`.toLowerCase().includes(q))
  }, [sectors, query, maker])

  const createSector = () => {
    const facilityTypes = facilityNames
      .map((n) => n.trim())
      .filter(Boolean)
      .map((n) => ({ id: newId('ft'), name: n, tooltip: '', documentSections: [] }))
    const sector: Sector = { id: newId('sec'), name: name.trim(), status: 'draft', facilityTypes, detailFields: [], additionalFields: [] }
    saveSectorDraft(sector)
    toast.success('Sector created', 'Saved to your initiator view — add project detail fields, then submit for approval.')
    setCreating(false)
    setName('')
    setFacilityNames([''])
    navigate(`/admin/sectors/${sector.id}`)
  }

  const columns: Column<Sector>[] = [
    { key: 'name', header: 'Sector', cell: (s) => <p className="truncate font-medium text-navy">{s.name}</p> },
    {
      key: 'facilities',
      header: 'Facility types',
      cell: (s) =>
        s.facilityTypes.length === 0 ? (
          <span className="text-navy-300">—</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {s.facilityTypes.slice(0, 3).map((f) => (
              <Badge key={f.id} tone="neutral">{f.name}</Badge>
            ))}
            {s.facilityTypes.length > 3 && <Badge tone="neutral">+{s.facilityTypes.length - 3}</Badge>}
          </div>
        ),
    },
    {
      key: 'fields',
      header: 'Fields',
      align: 'right',
      cell: (s) => <span className="tnum text-navy-500">{s.detailFields.length + s.additionalFields.length}</span>,
    },
    { key: 'status', header: 'Status', align: 'right', cell: (s) => <StatusPill status={s.status} /> },
  ]

  return (
    <>
      <PageHeader
        title="Sectors"
        subtitle="Industry categories, facility types and the fields borrowers must complete."
        actions={
          maker && (
            <Button leftIcon={<Plus size={16} />} onClick={() => setCreating(true)}>
              Create new sector
            </Button>
          )
        }
      />

      <div className="mb-5 flex items-center justify-between gap-3">
        <SearchInput placeholder="Search sectors, facility types…" value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full sm:w-96" />
        <ViewToggle value={view} onChange={setView} first="table" />
      </div>

      {rows.length === 0 ? (
        <Card>
          <EmptyState variant="search" title="No sectors found" description="Create a sector to start configuring facility types and fields." />
        </Card>
      ) : view === 'table' ? (
        <Card pad={false}>
          <div className="px-3 py-3 sm:px-4">
            <DataTable
              columns={columns}
              rows={rows}
              rowKey={(s) => s.id}
              onRowClick={(s) => navigate(`/admin/sectors/${s.id}`)}
            />
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/admin/sectors/${s.id}`)}
              className="group flex flex-col rounded-4xl border border-hair bg-white p-5 text-left transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-50 text-navy">
                  <ChartPie size={20} />
                </span>
                <StatusPill status={s.status} />
              </div>
              <h3 className="mt-4 text-[17px] font-medium tracking-[-0.01em] text-navy">{s.name}</h3>
              <p className="mt-1 flex-1 text-[13px] text-navy-400">
                {s.facilityTypes.length} facility type(s) · {s.detailFields.length + s.additionalFields.length} configured field(s)
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.facilityTypes.slice(0, 3).map((f) => (
                  <Badge key={f.id} tone="neutral">{f.name}</Badge>
                ))}
                {s.facilityTypes.length > 3 && <Badge tone="neutral">+{s.facilityTypes.length - 3}</Badge>}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy">
                Configure
                <ChevronRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Create new sector */}
      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Create new sector"
        subtitle="Name the sector and add its facility types. It saves to your initiator view for further edits."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
            <Button onClick={createSector} disabled={!name.trim()}>Save sector</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Sector name" required>
            <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Renewable Energy" />
          </Field>
          <Field label="Facility types" hint="Add the loan products available under this sector.">
            <div className="space-y-2">
              {facilityNames.map((fn, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={fn} onChange={(e) => setFacilityNames((cur) => cur.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`Facility type ${i + 1}`} />
                  {facilityNames.length > 1 && (
                    <button type="button" onClick={() => setFacilityNames((cur) => cur.filter((_, j) => j !== i))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-navy-300 transition-colors hover:bg-rose-soft hover:text-rose-ink">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
              <Button size="sm" variant="secondary" leftIcon={<Plus size={14} />} onClick={() => setFacilityNames((cur) => [...cur, ''])}>
                Add more
              </Button>
            </div>
          </Field>
        </div>
      </Modal>
    </>
  )
}
