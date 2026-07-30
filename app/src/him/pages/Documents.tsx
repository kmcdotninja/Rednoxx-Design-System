import { useMemo, useState } from 'react'
import { ShieldAlert, Upload } from 'lucide-react'
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  DataTable,
  Drawer,
  EmptyState,
  Field,
  FileUpload,
  Modal,
  SelectMenu,
  Tabs,
  Textarea,
  useToast,
  type Column,
  type TabItem,
} from '@/components/ui'
import { FilterBar } from '@/components/blocks'
import { HimPageHeader } from '../HimShell'
import { HIM_DOCUMENTS, HIM_PATIENTS, himPatientById, patientDisplayName, type HimDocument } from '../data'
import { DocumentStatusPill, RecordStatusPill } from '../shared'
import { DocumentPreviewDrawer } from '../DocumentPreview'
import { useRole } from '../rbac'

const DOC_TYPES = [
  'Discharge summary',
  'Operation note',
  'Lab report',
  'Referral letter',
  'Consent form',
  'Identity document',
  'Antenatal card (paper)',
  'Other',
]

type DocFilter = 'all' | 'pending index' | 'unbound legacy' | 'exceptions'

function docColumns(
  onBind: (d: HimDocument) => void,
  onError: (d: HimDocument) => void,
  allowed: boolean,
): Column<HimDocument>[] {
  return [
  {
    key: 'doc',
    header: 'Document',
    cell: (d) => (
      <span>
        <span className="flex items-center gap-2 font-medium text-forest">
          {d.type}
          {d.confidentiality === 'restricted' && (
            <span className="inline-flex items-center gap-1 text-xs font-normal text-rose-ink">
              <ShieldAlert size={12} aria-hidden /> restricted
            </span>
          )}
        </span>
        <span className="block text-xs text-forest-400">{d.patientLabel}</span>
      </span>
    ),
  },
  { key: 'source', header: 'Source', cell: (d) => d.source },
  { key: 'version', header: 'Version', align: 'right', cell: (d) => <span className="tnum">v{d.version}</span> },
  {
    key: 'uploaded',
    header: 'Uploaded',
    cell: (d) => (
      <span>
        <span className="block text-[13px]">{d.uploadedBy}</span>
        <span className="tnum block text-xs text-forest-400">{d.uploaded}</span>
      </span>
    ),
  },
  { key: 'status', header: 'Status', cell: (d) => <DocumentStatusPill status={d.status} /> },
  {
    key: 'actions',
    header: '',
    align: 'right',
    cell: (d) =>
      !allowed ? null : d.status === 'unbound legacy' ? (
        <Button
          size="sm"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation()
            onBind(d)
          }}
        >
          Bind to patient…
        </Button>
      ) : d.status === 'indexed' || d.status === 'pending index' ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            onError(d)
          }}
        >
          Created in error…
        </Button>
      ) : null,
  },
  ]
}

/** Document capture & indexing worklist (W-HIM-025/026/027). */
export function DocumentsPage() {
  const { success } = useToast()
  const { can } = useRole()
  const [docs, setDocs] = useState(HIM_DOCUMENTS)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<DocFilter>('all')
  const [bindFor, setBindFor] = useState<HimDocument | null>(null)
  const [bindPatientId, setBindPatientId] = useState('')
  const [errorFor, setErrorFor] = useState<HimDocument | null>(null)
  const [errorReason, setErrorReason] = useState('')
  const [previewFor, setPreviewFor] = useState<HimDocument | null>(null)

  const bindDocument = () => {
    const p = himPatientById(bindPatientId)
    if (!bindFor || !p) return
    setDocs((all) =>
      all.map((d) =>
        d.id === bindFor.id
          ? { ...d, patientId: p.id, patientLabel: `${patientDisplayName(p)} · ${p.mrn}`, status: 'indexed' as const }
          : d,
      ),
    )
    success('Legacy record bound', `Attached to ${patientDisplayName(p)} — legacy MRN preserved as an identifier; binding audited.`)
    setBindFor(null)
  }

  const markError = () => {
    if (!errorFor) return
    setDocs((all) => all.map((d) => (d.id === errorFor.id ? { ...d, status: 'created-in-error' as const } : d)))
    success('Marked created-in-error', 'The document is excluded from the working record but preserved — no hard delete. Incident review opened.')
    setErrorFor(null)
  }
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadPatientId, setUploadPatientId] = useState('')
  const [uploadType, setUploadType] = useState('')
  const [restricted, setRestricted] = useState(false)
  const [files, setFiles] = useState<string[]>([])

  const uploadPatient = himPatientById(uploadPatientId)
  const canAttach = uploadPatient !== undefined && uploadType !== '' && files.length > 0

  const openUpload = () => {
    setUploadPatientId('')
    setUploadType('')
    setRestricted(false)
    setFiles([])
    setUploadOpen(true)
  }

  const attach = () => {
    if (!uploadPatient) return
    success(
      'Document attached',
      `${uploadType} indexed to ${patientDisplayName(uploadPatient)} (${uploadPatient.mrn})${restricted ? ' — marked restricted' : ''}. Provenance and audit recorded.`,
    )
    setUploadOpen(false)
  }

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return docs.filter((d) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'pending index' && d.status === 'pending index') ||
        (filter === 'unbound legacy' && d.status === 'unbound legacy') ||
        (filter === 'exceptions' && (d.status === 'created-in-error' || d.status === 'superseded'))
      return matchesFilter && (!q || `${d.type} ${d.patientLabel} ${d.source}`.toLowerCase().includes(q))
    })
  }, [docs, query, filter])

  const tabs: TabItem<DocFilter>[] = [
    { value: 'all', label: 'All', count: docs.length },
    {
      value: 'pending index',
      label: 'Pending index',
      count: docs.filter((d) => d.status === 'pending index').length,
    },
    {
      value: 'unbound legacy',
      label: 'Unbound legacy',
      count: docs.filter((d) => d.status === 'unbound legacy').length,
    },
    {
      value: 'exceptions',
      label: 'Exceptions',
      count: docs.filter((d) => d.status === 'created-in-error' || d.status === 'superseded').length,
    },
  ]

  return (
    <>
      <HimPageHeader
        title="Documents"
        subtitle="Upload, index and correct — no document is ever hard-deleted"
        actions={
          can.uploadDocuments ? (
            <Button size="sm" leftIcon={<Upload size={14} />} onClick={openUpload}>
              Upload document
            </Button>
          ) : undefined
        }
      />

      <FilterBar
        search={{ value: query, onChange: setQuery, placeholder: 'Search type, patient, source…', label: 'Search documents' }}
      />
      <div className="border-b border-hair">
        <Tabs items={tabs} value={filter} onChange={setFilter} />
      </div>

      {rows.length === 0 ? (
        <Card pad={false}>
          <EmptyState
            variant="document"
            title="No documents match"
            description="Clear the search or switch buckets — exceptions hold superseded and created-in-error items."
          />
        </Card>
      ) : (
        <Card pad={false}>
          <div className="px-2 py-2">
            <DataTable
              columns={docColumns(
                (d) => {
                  setBindPatientId('')
                  setBindFor(d)
                },
                (d) => {
                  setErrorReason('')
                  setErrorFor(d)
                },
                can.uploadDocuments,
              )}
              rows={rows}
              rowKey={(d) => d.id}
              onRowClick={(d) => setPreviewFor(d)}
            />
          </div>
        </Card>
      )}

      <DocumentPreviewDrawer doc={previewFor} onClose={() => setPreviewFor(null)} />

      {/* Bind unbound legacy scan to a patient (W-HIM-026). */}
      <Modal
        open={bindFor !== null}
        onClose={() => setBindFor(null)}
        title="Bind legacy record"
        subtitle={bindFor ? `${bindFor.type} · ${bindFor.source}` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setBindFor(null)}>
              Cancel
            </Button>
            <Button disabled={bindPatientId === ''} onClick={bindDocument}>
              Bind to patient
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-forest-500">
            Binding attaches this scanned legacy document to a patient record. When the match is not
            confident, it stays in the unbound queue — poor scans go back for rescanning.
          </p>
          <Field label="Patient" required hint="Verify against at least two identifiers before binding.">
            <SelectMenu
              value={bindPatientId}
              onChange={setBindPatientId}
              placeholder="Select patient…"
              options={HIM_PATIENTS.filter((p) => p.recordStatus !== 'merged').map((p) => ({
                value: p.id,
                label: patientDisplayName(p),
                hint: p.mrn,
              }))}
            />
          </Field>
        </div>
      </Modal>

      {/* Created-in-error (W-HIM-027): governed correction, never deletion. */}
      <Modal
        open={errorFor !== null}
        onClose={() => setErrorFor(null)}
        title="Mark created-in-error"
        subtitle={errorFor ? `${errorFor.type} — ${errorFor.patientLabel}` : undefined}
        footer={
          <>
            <Button variant="secondary" onClick={() => setErrorFor(null)}>
              Cancel
            </Button>
            <Button variant="danger" disabled={errorReason.trim() === ''} onClick={markError}>
              Mark created-in-error
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-forest-500">
            The document leaves the working record but is preserved — no hard delete. Wrong-patient
            uploads open an incident review; if already released externally, the disclosure is
            flagged. This action <strong>will be recorded in the audit log</strong>.
          </p>
          <Field label="Reason" required>
            <Textarea rows={2} value={errorReason} onChange={(e) => setErrorReason(e.target.value)} placeholder="Uploaded to the wrong patient — correct record is GGH-…" />
          </Field>
        </div>
      </Modal>

      {/* Upload (W-HIM-025): destination is confirmed against the patient
          banner BEFORE the file attaches — the wrong-patient control. */}
      <Drawer
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        size="lg"
        title="Upload document"
        subtitle="Confirm the destination patient before anything attaches"
        footer={
          <>
            <Button variant="secondary" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button leftIcon={<Upload size={14} />} disabled={!canAttach} onClick={attach}>
              Attach to record
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Destination patient" required hint="Search ran on the index? Verify two identifiers here before attaching.">
            <SelectMenu
              value={uploadPatientId}
              onChange={setUploadPatientId}
              placeholder="Select patient…"
              options={HIM_PATIENTS.filter((p) => p.recordStatus !== 'merged').map((p) => ({
                value: p.id,
                label: patientDisplayName(p),
                hint: p.mrn,
              }))}
            />
          </Field>

          {uploadPatient && (
            <div className="flex items-center gap-3 rounded-2xl bg-panel px-4 py-3">
              <Avatar name={patientDisplayName(uploadPatient)} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-forest">{patientDisplayName(uploadPatient)}</p>
                <p className="tnum text-xs text-forest-400">
                  {uploadPatient.mrn} · {uploadPatient.dob ?? `est. ${uploadPatient.estimatedAge}y`} ·{' '}
                  {uploadPatient.sex}
                </p>
              </div>
              <RecordStatusPill status={uploadPatient.recordStatus} />
            </div>
          )}

          <div className="grid gap-4">
            <Field label="Document type" required>
              <SelectMenu
                value={uploadType}
                onChange={setUploadType}
                placeholder="Select type…"
                options={DOC_TYPES.map((t) => ({ value: t, label: t }))}
              />
            </Field>
            <Field label="Source" required>
              <SelectMenu
                defaultValue="Scanned — front desk"
                options={['Scanned — front desk', 'Scanned — HIM office', 'Clinical — generated', 'Legacy scanning batch'].map(
                  (v) => ({ value: v, label: v }),
                )}
              />
            </Field>
          </div>

          <FileUpload
            label="Add file"
            caption="PDF or image up to 10 MB — files are validated before indexing."
            accept="application/pdf,image/*"
            multiple={false}
            onChange={setFiles}
          />

          <Checkbox
            checked={restricted}
            onChange={setRestricted}
            label="Mark as restricted"
            description="Restricted documents require special permission or break-glass to view; all access is audited."
          />
        </div>
      </Drawer>
    </>
  )
}
