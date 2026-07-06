import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ChevronDown, FileText, Hash, Pencil, Percent, Plus, Send, Trash2, Type } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useSubRole } from '@/components/shell/RoleContext'
import { Badge, Button, Card, Drawer, EmptyState, Field, InfoTip, Input, Modal, SearchInput, Segmented, StatusPill, Textarea, useToast, type SegOption } from '@/components/ui'
import { useStore, newId } from '@/store/AppStore'
import { can } from '@/data/nav'
import type { FieldType, Sector, SectorField } from '@/data/types'
import { cn } from '@/lib/cn'

type Segment = 'facility' | 'details' | 'documents' | 'additional'

const SEGMENT_LABEL: Record<Segment, string> = {
  facility: 'Facility Type',
  details: 'Project Details',
  documents: 'Supporting Documents',
  additional: 'Additional Requirement',
}
const SEGMENTS: SegOption<Segment>[] = (Object.keys(SEGMENT_LABEL) as Segment[]).map((value) => ({
  value,
  label: SEGMENT_LABEL[value],
}))
const SEGMENT_ORDER: Segment[] = ['facility', 'details', 'documents', 'additional']

const FIELD_TYPES: { value: FieldType; label: string; icon: typeof Type }[] = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'document', label: 'Document', icon: FileText },
  { value: 'number', label: 'Number', icon: Hash },
  { value: 'percentage', label: 'Percentage', icon: Percent },
]

interface FieldForm {
  id: string | null
  name: string
  section: string
  description: string
  type: FieldType
  /** Which segment opened the form (drives default routing). */
  origin: Segment
}

export function AdminSector() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const subRole = useSubRole()
  const { sectors, saveSectorDraft, submitSectorForApproval, approvals } = useStore()
  const maker = can('create', subRole)

  const source = sectors.find((s) => s.id === id)
  // Local working copy — segment saves persist to the initiator view; only
  // "Submit Changes" routes the sector to the authorizer's queue.
  const [working, setWorking] = useState<Sector | null>(source ? structuredClone(source) : null)
  const isNew = useRef(source?.status === 'draft' && source.detailFields.length === 0 && source.additionalFields.length === 0)

  const [segment, setSegment] = useState<Segment>('facility')
  const [query, setQuery] = useState('')
  const [form, setForm] = useState<FieldForm | null>(null)
  const [deleting, setDeleting] = useState<SectorField | null>(null)
  const [ftDraft, setFtDraft] = useState<{ id: string | null; name: string; tooltip: string } | null>(null)

  const pendingApproval = approvals.some((a) => a.status === 'pending' && (a.type === 'sector_create' || a.type === 'sector_change') && (a.payload.sector as Sector | undefined)?.id === id)

  /** Previously-entered sections offered by the combo selector. */
  const knownSections = useMemo(() => {
    if (!working) return []
    const all = [...working.detailFields, ...working.additionalFields].map((f) => f.section).filter(Boolean)
    return [...new Set(all)]
  }, [working])

  if (!source || !working) {
    return (
      <Card>
        <EmptyState variant="search" title="Sector not found" action={<Button onClick={() => navigate('/admin/sectors')}>Back to sectors</Button>} />
      </Card>
    )
  }

  const editable = maker && !pendingApproval

  /* ------------------------- derived field views --------------------------- */

  const q = query.trim().toLowerCase()
  const match = (f: SectorField) => !q || `${f.name} ${f.section} ${f.description} ${f.type}`.toLowerCase().includes(q)

  const detailFields = working.detailFields.filter((f) => f.type !== 'document').filter(match)
  const documentFields = working.detailFields.filter((f) => f.type === 'document').filter(match)
  const additionalFields = working.additionalFields.filter(match)
  const facilityTypes = working.facilityTypes.filter((f) => !q || `${f.name} ${f.tooltip}`.toLowerCase().includes(q))

  /* ------------------------------- mutations ------------------------------- */

  const saveField = () => {
    if (!form || !form.name.trim()) return
    const field: SectorField = {
      id: form.id ?? newId('fld'),
      name: form.name.trim(),
      section: form.section.trim() || defaultSection(form),
      description: form.description.trim(),
      type: form.type,
    }
    setWorking((w) => {
      if (!w) return w
      const stripped = {
        ...w,
        detailFields: w.detailFields.filter((f) => f.id !== field.id),
        additionalFields: w.additionalFields.filter((f) => f.id !== field.id),
      }
      // Routing rules: Document fields live in the Supporting Documents segment;
      // Text/Number/Percentage stay in the segment/section chosen at creation.
      if (field.type !== 'document' && form.origin === 'additional') {
        return { ...stripped, additionalFields: [...stripped.additionalFields, field] }
      }
      return { ...stripped, detailFields: [...stripped.detailFields, field] }
    })
    setForm(null)
  }

  const confirmDelete = () => {
    if (!deleting) return
    setWorking((w) =>
      w
        ? {
            ...w,
            detailFields: w.detailFields.filter((f) => f.id !== deleting.id),
            additionalFields: w.additionalFields.filter((f) => f.id !== deleting.id),
          }
        : w,
    )
    setDeleting(null)
  }

  const saveFacilityType = () => {
    if (!ftDraft || !ftDraft.name.trim()) return
    setWorking((w) => {
      if (!w) return w
      if (ftDraft.id) {
        return { ...w, facilityTypes: w.facilityTypes.map((f) => (f.id === ftDraft.id ? { ...f, name: ftDraft.name.trim(), tooltip: ftDraft.tooltip.trim() } : f)) }
      }
      return { ...w, facilityTypes: [...w.facilityTypes, { id: newId('ft'), name: ftDraft.name.trim(), tooltip: ftDraft.tooltip.trim(), documentSections: [] }] }
    })
    setFtDraft(null)
  }

  const saveAndContinue = () => {
    saveSectorDraft(working)
    const idx = SEGMENT_ORDER.indexOf(segment)
    if (idx < SEGMENT_ORDER.length - 1) {
      setSegment(SEGMENT_ORDER[idx + 1])
      toast.info('Segment saved', 'Changes are stored on your initiator view.')
    }
  }

  const submitChanges = () => {
    if (working.detailFields.length === 0) {
      toast.error('Add project details first', 'A sector only moves to the authorizer once it has project detail fields.')
      return
    }
    // Every published sector carries a default additional field.
    const defaultAdditional: SectorField = {
      id: newId('fld'),
      name: 'Additional information',
      section: 'Additional Requirement',
      description: 'Anything else the applicant would like the reviewers to consider.',
      type: 'text',
    }
    const outgoing = working.additionalFields.length > 0 ? working : { ...working, additionalFields: [defaultAdditional] }
    submitSectorForApproval(outgoing, isNew.current)
    toast.success('Submitted for approval', 'The sector change is now in the authorizer’s queue. It reflects on borrower views once approved.')
    navigate('/admin/sectors')
  }

  /* --------------------------------- render -------------------------------- */

  return (
    <>
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <button onClick={() => navigate('/admin/sectors')} aria-label="Back to sectors" className="flex h-9 w-9 items-center justify-center rounded-full border border-hair bg-white text-navy-500 transition-colors hover:bg-panel">
              <ArrowLeft size={17} />
            </button>
            {working.name}
            <StatusPill status={pendingApproval ? 'pending' : working.status} />
          </span>
        }
        subtitle={
          pendingApproval
            ? 'A change to this sector is awaiting authorizer approval — editing is locked until it is resolved.'
            : editable
              ? 'Configure each segment, save as you go, then submit all changes for approval.'
              : 'Read-only view — only initiators and root can edit sector configuration.'
        }
      />

      <Card pad={false}>
        <div className="flex flex-col gap-3 border-b border-hair px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Segmented options={SEGMENTS} value={segment} onChange={(s) => { setSegment(s); setQuery('') }} size="sm" />
          <SearchInput placeholder={`Search ${SEGMENT_LABEL[segment].toLowerCase()}…`} value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full sm:w-72" />
        </div>

        <div className="px-5 py-5 sm:px-6">
          {/* -------------------------- Facility Type ------------------------- */}
          {segment === 'facility' && (
            <div className="space-y-3">
              {facilityTypes.length === 0 && <EmptyState compact variant="search" title="No facility types" description="Add the loan products available under this sector." />}
              {facilityTypes.map((f) => (
                <div key={f.id} className="flex items-center gap-3 rounded-2xl border border-hair bg-white px-4 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-navy">
                      {f.name}
                      {f.tooltip && <InfoTip content={f.tooltip} />}
                    </p>
                    <p className="text-xs text-navy-400">{f.documentSections.length} document section(s)</p>
                  </div>
                  {editable && (
                    <div className="flex shrink-0 items-center gap-1">
                      <IconAction label="Edit" onClick={() => setFtDraft({ id: f.id, name: f.name, tooltip: f.tooltip })}><Pencil size={15} /></IconAction>
                      <IconAction danger label="Delete" onClick={() => setWorking((w) => (w ? { ...w, facilityTypes: w.facilityTypes.filter((x) => x.id !== f.id) } : w))}><Trash2 size={15} /></IconAction>
                    </div>
                  )}
                </div>
              ))}
              {editable && (
                <Button variant="secondary" leftIcon={<Plus size={16} />} onClick={() => setFtDraft({ id: null, name: '', tooltip: '' })}>
                  Add facility type
                </Button>
              )}
            </div>
          )}

          {/* ------------------------- Project Details ------------------------ */}
          {segment === 'details' && (
            <FieldList
              fields={detailFields}
              editable={editable}
              emptyHint="Add the project-detail fields borrowers must complete (Text, Number or Percentage)."
              onAdd={() => setForm({ id: null, name: '', section: '', description: '', type: 'text', origin: 'details' })}
              onEdit={(f) => setForm({ id: f.id, name: f.name, section: f.section, description: f.description, type: f.type, origin: 'details' })}
              onDelete={setDeleting}
            />
          )}

          {/* ----------------------- Supporting Documents --------------------- */}
          {segment === 'documents' && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-navy-50 px-4 py-3 text-[13px] leading-relaxed text-navy-500">
                Document-based fields always live here, regardless of where they were created. Facility-type document packs (the per-product mandatory documents) are shown under each facility type.
              </div>
              <FieldList
                fields={documentFields}
                editable={editable}
                emptyHint="Add sector-wide document requirements. Document fields created in other segments are routed here."
                onAdd={() => setForm({ id: null, name: '', section: 'Supporting Document', description: '', type: 'document', origin: 'documents' })}
                onEdit={(f) => setForm({ id: f.id, name: f.name, section: f.section, description: f.description, type: f.type, origin: 'documents' })}
                onDelete={setDeleting}
              />
            </div>
          )}

          {/* ---------------------- Additional Requirement -------------------- */}
          {segment === 'additional' && (
            <FieldList
              fields={additionalFields}
              editable={editable}
              emptyHint="Additional requirements shown at the end of the borrower's application."
              onAdd={() => setForm({ id: null, name: '', section: 'Additional Requirement', description: '', type: 'text', origin: 'additional' })}
              onEdit={(f) => setForm({ id: f.id, name: f.name, section: f.section, description: f.description, type: f.type, origin: 'additional' })}
              onDelete={setDeleting}
            />
          )}
        </div>

        {editable && (
          <div className="flex items-center justify-between border-t border-hair px-5 py-4 sm:px-6">
            <p className="text-xs text-navy-400">
              Changes reflect on borrower / financier views only after authorizer approval.
            </p>
            <div className="flex items-center gap-2">
              {segment !== 'additional' ? (
                <Button variant="secondary" onClick={saveAndContinue} rightIcon={<ArrowRight size={16} />}>Save and continue</Button>
              ) : (
                <>
                  <Button variant="secondary" onClick={() => { saveSectorDraft(working); toast.info('Draft saved', 'Stored on your initiator view.') }}>Save draft</Button>
                  <Button onClick={submitChanges} leftIcon={<Send size={16} />}>Submit changes</Button>
                </>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* -------------------------- typed field form --------------------------- */}
      <Drawer
        open={form !== null}
        onClose={() => setForm(null)}
        title={form?.id ? 'Edit field' : 'Add field'}
        subtitle="Field name, section, description and type."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setForm(null)}>Cancel</Button>
            <Button onClick={saveField} disabled={!form?.name.trim()}>{form?.id ? 'Save changes' : 'Add field'}</Button>
          </div>
        }
      >
        {form && (
          <div className="space-y-4">
            <Field label="Field name" required>
              <Input autoFocus value={form.name} onChange={(e) => setForm((f) => (f ? { ...f, name: e.target.value } : f))} placeholder="e.g. Off-taker concentration" />
            </Field>
            <Field label="Section" hint="Pick a previous section or type a new one — new values are registered for future use.">
              <SectionCombo value={form.section} options={knownSections} onChange={(v) => setForm((f) => (f ? { ...f, section: v } : f))} />
            </Field>
            <Field label="Description" hint="Shown to borrowers via the info icon, keeping the page tidy.">
              <Textarea rows={3} value={form.description} onChange={(e) => setForm((f) => (f ? { ...f, description: e.target.value } : f))} />
            </Field>
            <Field label="Field type">
              <div className="grid grid-cols-2 gap-2">
                {FIELD_TYPES.map((t) => {
                  const Icon = t.icon
                  const active = form.type === t.value
                  return (
                    <button key={t.value} type="button" onClick={() => setForm((f) => (f ? { ...f, type: t.value } : f))} className={cn('flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-left transition-colors', active ? 'border-navy bg-navy-50' : 'border-hair bg-white hover:bg-panel')}>
                      <span className={cn('flex h-8 w-8 items-center justify-center rounded-xl', active ? 'bg-navy text-azure' : 'bg-panel text-navy-400')}>
                        <Icon size={15} />
                      </span>
                      <span className="text-sm font-medium text-navy">{t.label}</span>
                      {active && <Check size={15} className="ml-auto text-navy" />}
                    </button>
                  )
                })}
              </div>
              {form.type === 'document' && (
                <p className="mt-2 text-xs font-medium text-azure-600">Document fields are filed under the Supporting Documents segment.</p>
              )}
            </Field>
          </div>
        )}
      </Drawer>

      {/* --------------------------- delete confirm ---------------------------- */}
      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete field?"
        subtitle={deleting ? `“${deleting.name}” will be removed when you submit changes.` : undefined}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete field</Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-navy-500">
          The deletion is saved with your other segment edits and only takes effect across borrower and financier views after the authorizer approves your submitted changes.
        </p>
      </Modal>

      {/* --------------------------- facility type form ------------------------ */}
      <Modal
        open={ftDraft !== null}
        onClose={() => setFtDraft(null)}
        title={ftDraft?.id ? 'Edit facility type' : 'Add facility type'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setFtDraft(null)}>Cancel</Button>
            <Button onClick={saveFacilityType} disabled={!ftDraft?.name.trim()}>{ftDraft?.id ? 'Save changes' : 'Add facility type'}</Button>
          </div>
        }
      >
        {ftDraft && (
          <div className="space-y-4">
            <Field label="Facility type name" required>
              <Input autoFocus value={ftDraft.name} onChange={(e) => setFtDraft((f) => (f ? { ...f, name: e.target.value } : f))} placeholder="e.g. Captive Power" />
            </Field>
            <Field label="Nomenclature tool-tip" hint="Displayed on the borrower's dropdown so applicants understand the product.">
              <Textarea rows={3} value={ftDraft.tooltip} onChange={(e) => setFtDraft((f) => (f ? { ...f, tooltip: e.target.value } : f))} />
            </Field>
          </div>
        )}
      </Modal>
    </>
  )
}

/* -------------------------------- helpers ---------------------------------- */

function defaultSection(form: FieldForm): string {
  if (form.type === 'document') return 'Supporting Document'
  if (form.origin === 'additional') return 'Additional Requirement'
  return 'Project Details'
}

function IconAction({ children, label, onClick, danger }: { children: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
        danger ? 'text-navy-300 hover:bg-rose-soft hover:text-rose-ink' : 'text-navy-300 hover:bg-panel hover:text-navy-600',
      )}
    >
      {children}
    </button>
  )
}

function FieldList({
  fields, editable, emptyHint, onAdd, onEdit, onDelete,
}: {
  fields: SectorField[]
  editable: boolean
  emptyHint: string
  onAdd: () => void
  onEdit: (f: SectorField) => void
  onDelete: (f: SectorField) => void
}) {
  const typeMeta = (t: FieldType) => FIELD_TYPES.find((x) => x.value === t)!
  return (
    <div className="space-y-3">
      {fields.length === 0 && <EmptyState compact variant="search" title="No fields yet" description={emptyHint} />}
      {fields.map((f) => {
        const meta = typeMeta(f.type)
        const Icon = meta.icon
        return (
          <div key={f.id} className="flex items-center gap-3 rounded-2xl border border-hair bg-white px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-panel text-navy-400">
              <Icon size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-medium text-navy">
                <span className="truncate">{f.name}</span>
                {f.description && <InfoTip content={f.description} />}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-navy-400">
                <Badge tone="neutral">{meta.label}</Badge>
                {f.section && <span className="truncate">· {f.section}</span>}
              </p>
            </div>
            {editable && (
              <div className="flex shrink-0 items-center gap-1">
                <IconAction label="Edit" onClick={() => onEdit(f)}><Pencil size={15} /></IconAction>
                <IconAction danger label="Delete" onClick={() => onDelete(f)}><Trash2 size={15} /></IconAction>
              </div>
            )}
          </div>
        )
      })}
      {editable && (
        <Button variant="secondary" leftIcon={<Plus size={16} />} onClick={onAdd}>Add field</Button>
      )}
    </div>
  )
}

/** Combo control: free text input + dropdown of previously-entered sections.
 *  Selecting an item autofills; a new value registers as a new section option. */
function SectionCombo({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const suggestions = options.filter((o) => !value.trim() || o.toLowerCase().includes(value.trim().toLowerCase()))
  return (
    <div className="relative">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          placeholder="e.g. Sector Overview"
          className="pr-10"
        />
        <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-300" />
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-52 w-full origin-top animate-pop overflow-y-auto rounded-2xl border border-hair bg-white p-1.5 shadow-pop">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(s); setOpen(false) }}
              className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-navy-600 transition-colors hover:bg-panel"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
