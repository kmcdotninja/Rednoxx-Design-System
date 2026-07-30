import { useState } from 'react'
import {
  Archive,
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  FileEdit,
  HeartCrack,
  IdCard,
  Link2,
  LockKeyhole,
  Plus,
  ShieldAlert,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Navigate, useNavigate, useParams } from '@tanstack/react-router'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  Checkbox,
  DataTable,
  Drawer,
  Dropdown,
  EmptyState,
  Field,
  Input,
  KeyValue,
  Modal,
  SelectMenu,
  Tabs,
  Tag,
  Textarea,
  useToast,
  type Column,
  type DropdownItem,
  type TabItem,
} from '@/components/ui'
import { RecordBanner, Timeline, type TimelineEvent } from '@/components/blocks'
import {
  AUDIT_EVENTS,
  HIM_DOCUMENTS,
  himPatientById,
  patientDisplayName,
  type HimDocument,
  type HimEncounter,
  type HimIdentifier,
  type HimPatient,
} from '../data'
import { DocumentStatusPill, RecordStatusPill, VerificationPill } from '../shared'
import { DocumentPreviewDrawer } from '../DocumentPreview'
import { useRole } from '../rbac'

type RecordTab = 'identifiers' | 'demographics' | 'encounters' | 'consents' | 'documents' | 'audit'

/** Verify action appears on pending identifiers (W-HIM-017). */
function identifierColumns(onVerify: (value: string) => void): Column<HimIdentifier>[] {
  return [
    { key: 'type', header: 'Type', cell: (i) => <span className="font-medium text-forest">{i.type}</span> },
    { key: 'value', header: 'Value', cell: (i) => <span className="tnum font-mono text-[13px]">{i.value}</span> },
    { key: 'system', header: 'System / namespace', cell: (i) => <span className="font-mono text-[13px]">{i.system}</span> },
    { key: 'issuer', header: 'Assigning authority', cell: (i) => i.issuer },
    { key: 'verification', header: 'Verification', cell: (i) => <VerificationPill status={i.verification} /> },
    {
      key: 'active',
      header: 'Active',
      cell: (i) => (
        <Badge tone={i.active ? 'success' : 'neutral'} dot>
          {i.active ? 'active' : 'retired'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (i) =>
        i.verification === 'pending verification' ? (
          <Button size="sm" variant="secondary" onClick={() => onVerify(i.value)}>
            Verify
          </Button>
        ) : null,
    },
  ]
}

const encounterTone = {
  planned: 'neutral',
  'in progress': 'info',
  finished: 'success',
  cancelled: 'danger',
} as const

const encounterColumns: Column<HimEncounter>[] = [
  {
    key: 'visit',
    header: 'Visit number',
    cell: (e) => <span className="tnum font-mono text-[13px]">{e.visitNumber}</span>,
  },
  { key: 'service', header: 'Service point', cell: (e) => e.servicePoint },
  { key: 'payer', header: 'Payer category', cell: (e) => <span className="capitalize">{e.payerCategory}</span> },
  {
    key: 'time',
    header: 'Start — end',
    cell: (e) => (
      <span className="tnum">
        {e.start}
        {e.end ? ` — ${e.end}` : ''}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (e) => (
      <Badge tone={encounterTone[e.status]} dot>
        {e.status}
      </Badge>
    ),
  },
]

/** One patient's HIM record — identity, identifiers, encounters, consents, documents, audit. */
export function PatientRecordPage() {
  const { id } = useParams({ strict: false })
  const navigate = useNavigate()
  const { success, info } = useToast()
  const { can, persona } = useRole()
  const [tab, setTab] = useState<RecordTab>('identifiers')
  const [breakGlassOpen, setBreakGlassOpen] = useState(false)
  const [justification, setJustification] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [deceasedOpen, setDeceasedOpen] = useState(false)
  const [deceasedReason, setDeceasedReason] = useState('')
  const [verifiedValues, setVerifiedValues] = useState<string[]>([])
  const [withdrawnKeys, setWithdrawnKeys] = useState<string[]>([])
  const [withdrawFor, setWithdrawFor] = useState<string | null>(null)
  const [correctOpen, setCorrectOpen] = useState(false)
  const [phoneDraft, setPhoneDraft] = useState('')
  const [addressDraft, setAddressDraft] = useState('')
  const [contactOverrides, setContactOverrides] = useState<
    Record<string, { phone?: string; address?: string }>
  >({})
  const [addedIdentifiers, setAddedIdentifiers] = useState<Record<string, HimIdentifier[]>>({})
  const [statusOverrides, setStatusOverrides] = useState<Record<string, HimPatient['recordStatus']>>({})
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [checkOne, setCheckOne] = useState(false)
  const [checkTwo, setCheckTwo] = useState(false)
  const [captureOpen, setCaptureOpen] = useState(false)
  const [captureCategory, setCaptureCategory] = useState('Disclosure — third party')
  const [captureScope, setCaptureScope] = useState('')
  const [addedConsents, setAddedConsents] = useState<Record<string, HimPatient['consents']>>({})
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [archiveReason, setArchiveReason] = useState('')
  const [previewDoc, setPreviewDoc] = useState<HimDocument | null>(null)
  const [addIdOpen, setAddIdOpen] = useState(false)
  const [addIdType, setAddIdType] = useState('NIN')
  const [addIdValue, setAddIdValue] = useState('')
  const [addIdIssuer, setAddIdIssuer] = useState('')
  const [eligibilityChecked, setEligibilityChecked] = useState<string[]>([])

  const basePatient = himPatientById(id)
  if (!basePatient) return <Navigate to="/him-demo/patients" replace />
  const patient = statusOverrides[basePatient.id]
    ? { ...basePatient, recordStatus: statusOverrides[basePatient.id] }
    : basePatient

  const phone = contactOverrides[patient.id]?.phone ?? patient.phone
  const address = contactOverrides[patient.id]?.address ?? patient.address
  const identifiers = [...patient.identifiers, ...(addedIdentifiers[patient.id] ?? [])].map((i) =>
    verifiedValues.includes(patient.id + i.value) ? { ...i, verification: 'verified' as const } : i,
  )
  const consents = [...patient.consents, ...(addedConsents[patient.id] ?? [])].map((c) =>
    withdrawnKeys.includes(patient.id + c.category) ? { ...c, status: 'withdrawn' as const, date: 'Today' } : c,
  )

  const restrictedLock = patient.recordStatus === 'restricted' && !unlocked
  const documents = HIM_DOCUMENTS.filter((d) => d.patientId === patient.id)
  const audit = AUDIT_EVENTS.filter((e) => e.patientLabel.includes(patient.mrn))
  const auditEvents: TimelineEvent[] = audit.map((e) => ({
    meta: `${e.time} · ${e.actor} (${e.role})`,
    title: e.action,
    description: e.detail,
    tone: e.tone,
  }))
  const encounters = patient.encounters ?? []

  const tabs: TabItem<RecordTab>[] = [
    { value: 'identifiers', label: 'Identifiers', count: identifiers.length },
    { value: 'demographics', label: 'Demographics & contacts' },
    { value: 'encounters', label: 'Encounters', count: encounters.length },
    { value: 'consents', label: 'Consents & coverage', count: consents.length },
    { value: 'documents', label: 'Documents', count: documents.length },
    { value: 'audit', label: 'Audit', count: audit.length },
  ]

  const recordActions: DropdownItem[] = [
    {
      label: 'Correct demographics',
      icon: FileEdit,
      onSelect: () => {
        setPhoneDraft(phone ?? '')
        setAddressDraft(address ?? '')
        setCorrectOpen(true)
      },
    },
    {
      label: 'Update identity document',
      icon: IdCard,
      onSelect: () =>
        info('Identity document update', 'New evidence is captured with namespace, issuer and verification status. Verified identifiers are never silently overwritten.'),
    },
    patient.recordStatus === 'inactive' || patient.recordStatus === 'archived'
      ? {
          label: patient.recordStatus === 'archived' ? 'Reactivate record…' : 'Archive record…',
          icon: Archive,
          separator: true,
          onSelect: () => {
            setArchiveReason('')
            setArchiveOpen(true)
          },
        }
      : {
          label: 'Archive record',
          icon: Archive,
          separator: true,
          onSelect: () =>
            info('Archive blocked', 'This record has activity within the retention window — archival needs supervisor and clinical review (W-HIM-042).'),
        },
    {
      label: can.markDeceased ? 'Mark as deceased…' : 'Mark as deceased (supervisor only)',
      icon: HeartCrack,
      danger: true,
      disabled: patient.recordStatus === 'deceased' || !can.markDeceased,
      onSelect: () => {
        setDeceasedReason('')
        setDeceasedOpen(true)
      },
    },
  ]

  const confirmDeceased = () => {
    setStatusOverrides((all) => ({ ...all, [patient.id]: 'deceased' }))
    success(
      'Deceased status set',
      'Routine-care routing is blocked; disclosure now requires authority evidence. Reversal needs supervisor approval.',
    )
    setDeceasedOpen(false)
  }

  const confirmArchive = () => {
    const reactivating = patient.recordStatus === 'archived'
    setStatusOverrides((all) => ({ ...all, [patient.id]: reactivating ? 'permanent' : 'archived' }))
    success(
      reactivating ? 'Record reactivated' : 'Record archived',
      reactivating
        ? 'Restored to the active register with full history intact.'
        : 'Removed from active worklists; nothing is deleted and the record stays retrievable (W-HIM-042).',
    )
    setArchiveOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => navigate({ to: '/him-demo/patients' })}
        className="group -ml-1.5 flex items-center gap-1.5 rounded-xl px-1.5 py-1 text-[13px] text-forest-400 transition-colors hover:bg-panel hover:text-forest"
      >
        <ArrowLeft size={14} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
        Patient index
      </button>

      {/* HIM record banner — the shared design-system RecordBanner block. */}
      <RecordBanner
        name={patientDisplayName(patient)}
        status={<RecordStatusPill status={patient.recordStatus} />}
        identifiers={
          <>
            {patient.dob ? patient.dob : `Estimated ${patient.estimatedAge}y`} · {patient.sex} · MRN{' '}
            <span className="font-mono">{patient.mrn}</span>
          </>
        }
        tags={
          <>
            <Tag className="capitalize">{patient.category}</Tag>
            {patient.coverage && <Tag>{patient.coverage.payer}</Tag>}
            <Tag>Registered {patient.registered}</Tag>
          </>
        }
        actions={
          <>
            {!restrictedLock && can.checkIn && !['deceased', 'merged', 'archived'].includes(patient.recordStatus) && (
              <Button
                variant="secondary"
                leftIcon={<BadgeCheck size={14} />}
                onClick={() => {
                  setCheckOne(false)
                  setCheckTwo(false)
                  setVerifyOpen(true)
                }}
              >
                Verify & route
              </Button>
            )}
            {/* Clinicians initiate correction requests without editing (catalogue §3). */}
            {!restrictedLock && !can.recordActions && persona.role === 'clinician' && (
              <Button
                variant="secondary"
                leftIcon={<FileEdit size={14} />}
                onClick={() =>
                  info('Correction request sent', 'Routed to the HIM Officer worklist with your note — corrections are made by HIM, with old values preserved.')
                }
              >
                Request correction
              </Button>
            )}
            {!restrictedLock && can.recordActions && (
              <Dropdown
                align="right"
                items={recordActions}
                trigger={
                  <span className="flex h-9 items-center gap-1.5 rounded-2xl border border-hair bg-white px-3.5 text-sm font-medium text-forest transition-colors hover:bg-panel">
                    Record actions
                    <ChevronDown size={14} className="text-forest-300" />
                  </span>
                }
              />
            )}
          </>
        }
      />

      {restrictedLock ? (
        <Card pad={false}>
          <EmptyState
            variant="no-access"
            title="Restricted record"
            description="Your role does not include routine access. Break-glass grants time-bound emergency access — the justification, access window and every view are audited, and the DPO reviews the event."
            action={
              can.breakGlass ? (
                <Button
                  variant="danger"
                  leftIcon={<LockKeyhole size={14} />}
                  onClick={() => {
                    setJustification('')
                    setBreakGlassOpen(true)
                  }}
                >
                  Break-glass access
                </Button>
              ) : (
                <p className="text-xs text-forest-400">
                  {persona.title} cannot break-glass — ask a clinician or HIM Supervisor. This denied
                  attempt is logged.
                </p>
              )
            }
          />
        </Card>
      ) : (
        <>
          {patient.recordStatus === 'restricted' && unlocked && (
            <Alert tone="danger" title="Break-glass access active — 30 minutes">
              This access is time-bound and under DPO review. Every view of this record is written to
              the audit log.
            </Alert>
          )}
          {patient.recordStatus === 'deceased' && (
            <Alert tone="info" title="Deceased patient">
              Routine-care workflows are blocked. Disclosure requires documented authority (e.g. legal
              representative); death-status reversal needs supervisor approval.
            </Alert>
          )}
          {patient.recordStatus === 'temporary' && (
            <Alert tone="warning" title="Temporary emergency identity">
              Minimum identity captured at A&E. Reconcile with a permanent record — or convert once the
              patient is identified — from the reconciliation worklist.
            </Alert>
          )}
          {patient.recordStatus === 'merged' && (
            <Alert tone="info" title="This record was merged">
              Its encounters, documents and identifiers now live on the survivor record; historical
              identifiers still resolve here and redirect.
            </Alert>
          )}
          {patient.completeness < 100 && patient.missingFields && (
            <Alert tone="info" title={`Record ${patient.completeness}% complete`}>
              Missing: {patient.missingFields.join(', ')}. Incomplete records stay on the completion
              worklist until resolved or a formal exception is documented.
            </Alert>
          )}

          <div className="border-b border-hair">
            <Tabs items={tabs} value={tab} onChange={setTab} />
          </div>

          {tab === 'identifiers' && (
            <Card pad={false}>
              <div className="px-2 py-2">
                <DataTable
                  columns={identifierColumns((value) => {
                    setVerifiedValues((all) => [...all, patient.id + value])
                    success('Identifier verified', 'Checked against the issuing authority; verification source and date recorded on the identifier and in the audit log.')
                  })}
                  rows={identifiers}
                  rowKey={(i) => i.value}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hair px-5 py-3">
                <p className="text-xs text-forest-400">
                  Identifier namespaces are never mixed; retired, merged and legacy identifiers are
                  preserved, never deleted. Sensitive identifiers display masked by role.
                </p>
                {can.recordActions && (
                  <Button
                    size="sm"
                    variant="secondary"
                    leftIcon={<Plus size={14} />}
                    onClick={() => {
                      setAddIdType('NIN')
                      setAddIdValue('')
                      setAddIdIssuer('')
                      setAddIdOpen(true)
                    }}
                  >
                    Add identifier
                  </Button>
                )}
              </div>
            </Card>
          )}

          {tab === 'demographics' && (
            <div className="grid gap-4 lg:grid-cols-2">
              {patient.linkedRecords && patient.linkedRecords.length > 0 && (
                <Card className="lg:col-span-2">
                  <CardHeader
                    title="Linked records"
                    subtitle="Mother-baby and related linkages — merging never breaks these"
                  />
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {patient.linkedRecords.map((link) => {
                      const linked = himPatientById(link.patientId)
                      if (!linked) return null
                      return (
                        <li key={link.patientId}>
                          <Link
                            to="/him-demo/patients/$id"
                            params={{ id: linked.id }}
                            className="group inline-flex items-center gap-2 rounded-2xl border border-hair bg-white px-3 py-2 text-[13px] transition-[border-color,box-shadow] hover:border-navy-200 hover:shadow-card-hover"
                          >
                            <Link2 size={14} className="text-forest-300" />
                            <span className="font-medium text-forest">{link.relationship}:</span>
                            <span className="text-forest-500">{patientDisplayName(linked)}</span>
                            <span className="tnum font-mono text-xs text-forest-400">{linked.mrn}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </Card>
              )}
              <Card>
                <CardHeader title="Demographics" />
                <div className="mt-4 space-y-3">
                  <KeyValue label="Family name" value={patient.familyName} />
                  <KeyValue label="Given names" value={patient.givenNames} />
                  <KeyValue label="Date of birth" value={patient.dob ?? `Estimated ${patient.estimatedAge}y`} />
                  <KeyValue label="Sex" value={patient.sex} />
                  <KeyValue label="Address" value={address ?? '—'} />
                  <KeyValue label="State · LGA" value={patient.state ? `${patient.state} · ${patient.lga}` : '—'} />
                </div>
              </Card>
              <Card>
                <CardHeader title="Contacts & next of kin" />
                <div className="mt-4 space-y-3">
                  <KeyValue label="Phone" value={phone ?? '—'} />
                  {patient.nextOfKin ? (
                    <>
                      <KeyValue
                        label="Next of kin"
                        value={`${patient.nextOfKin.name} · ${patient.nextOfKin.relationship}`}
                      />
                      <KeyValue label="Next-of-kin phone" value={patient.nextOfKin.phone} />
                      <KeyValue
                        label="Consent authority"
                        value={
                          patient.nextOfKin.hasAuthority
                            ? 'Documented authority on file'
                            : 'No documented authority — next of kin alone is not legal consent authority'
                        }
                      />
                    </>
                  ) : (
                    <KeyValue label="Next of kin" value="Not recorded" />
                  )}
                </div>
              </Card>
            </div>
          )}

          {tab === 'encounters' &&
            (encounters.length === 0 ? (
              <Card pad={false}>
                <EmptyState
                  variant="calendar"
                  title="No encounters on this record"
                  description="OPD, A&E, diagnostic and inpatient visits share this one patient context."
                />
              </Card>
            ) : (
              <Card pad={false}>
                <div className="px-2 py-2">
                  <DataTable columns={encounterColumns} rows={encounters} rowKey={(e) => e.visitNumber} />
                </div>
                <p className="border-t border-hair px-5 py-3 text-xs text-forest-400">
                  Encounters are created at check-in and routing (W-HIM-035/036); merging records moves
                  every encounter to the survivor — nothing is deleted.
                </p>
              </Card>
            ))}

          {tab === 'consents' && (
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader
                  title="Consents"
                  subtitle="Treatment consent is separate from disclosure consent"
                  action={
                    can.recordActions ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setCaptureCategory('Disclosure — third party')
                          setCaptureScope('')
                          setCaptureOpen(true)
                        }}
                      >
                        Capture consent
                      </Button>
                    ) : undefined
                  }
                />
                {patient.consents.length === 0 ? (
                  <EmptyState
                    compact
                    variant="document"
                    title="No consent on file"
                    description="Emergency registrations defer consent capture to reconciliation."
                  />
                ) : (
                  <ul className="mt-4 space-y-3">
                    {consents.map((c) => (
                      <li key={c.category} className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block text-sm font-medium text-forest">{c.category}</span>
                          <span className="block text-xs text-forest-400">
                            {c.scope} · {c.date}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          <Badge tone={c.status === 'captured' ? 'success' : 'danger'} dot>
                            {c.status}
                          </Badge>
                          {c.status === 'captured' && can.recordActions && (
                            <Button size="sm" variant="ghost" onClick={() => setWithdrawFor(c.category)}>
                              Withdraw
                            </Button>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
              <Card>
                <CardHeader title="Coverage" subtitle="Kept separate from identity; changes are audited" />
                {patient.coverage ? (
                  <div className="mt-4 space-y-3">
                    <KeyValue label="Payer" value={patient.coverage.payer} />
                    <KeyValue label="Insurance number" value={patient.coverage.insuranceNumber} />
                    <KeyValue label="Billing category" value={patient.coverage.billingCategory} />
                    <KeyValue
                      label="Eligibility"
                      value={
                        <span className="flex items-center gap-2">
                          <Badge tone={patient.coverage.eligibility === 'active' ? 'success' : 'warning'} dot>
                            {patient.coverage.eligibility}
                          </Badge>
                          {eligibilityChecked.includes(patient.id) && (
                            <span className="tnum text-xs text-forest-400">checked today</span>
                          )}
                        </span>
                      }
                    />
                    {can.recordActions && !eligibilityChecked.includes(patient.id) && (
                      <Button
                        size="sm"
                        variant="secondary"
                        leftIcon={<BadgeCheck size={14} />}
                        onClick={() => {
                          setEligibilityChecked((all) => [...all, patient.id])
                          success('Eligibility confirmed', 'Payer responded active — result recorded on the coverage profile and audited.')
                        }}
                      >
                        Check eligibility with payer
                      </Button>
                    )}
                  </div>
                ) : (
                  <EmptyState
                    compact
                    variant="folder"
                    title="No coverage on file"
                    description="Cash category until a payer profile is captured."
                  />
                )}
              </Card>
            </div>
          )}

          {tab === 'documents' &&
            (documents.length === 0 ? (
              <Card pad={false}>
                <EmptyState
                  variant="document"
                  title="No documents on this record"
                  description="Uploads, scans and clinical documents attach here with type, source and confidentiality."
                />
              </Card>
            ) : (
              <Card pad={false}>
                <ul className="divide-y divide-hair">
                  {documents.map((doc) => (
                    <li
                      key={doc.id}
                      onClick={() => setPreviewDoc(doc)}
                      className="flex cursor-pointer flex-wrap items-center gap-3 px-5 py-3 transition-colors hover:bg-panel/50"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-sm font-medium text-forest">
                          {doc.type}
                          {doc.confidentiality === 'restricted' && (
                            <span className="inline-flex items-center gap-1 text-xs font-normal text-rose-ink">
                              <ShieldAlert size={12} aria-hidden /> restricted
                            </span>
                          )}
                        </span>
                        <span className="block text-xs text-forest-400">
                          {doc.source} · v{doc.version} · {doc.uploadedBy} · {doc.uploaded}
                        </span>
                      </span>
                      <DocumentStatusPill status={doc.status} />
                    </li>
                  ))}
                </ul>
              </Card>
            ))}

          {tab === 'audit' &&
            (auditEvents.length === 0 ? (
              <Card pad={false}>
                <EmptyState
                  variant="document"
                  title="No audit events for this record yet"
                  description="Creates, views, updates, merges, releases and break-glass access all land here."
                />
              </Card>
            ) : (
              <Card>
                <Timeline events={auditEvents} />
              </Card>
            ))}
        </>
      )}

      <DocumentPreviewDrawer doc={previewDoc} onClose={() => setPreviewDoc(null)} />

      {/* Break-glass (W-HIM-024): justification required, time-bound, audited. */}
      <Modal
        open={breakGlassOpen}
        onClose={() => setBreakGlassOpen(false)}
        title="Break-glass access"
        subtitle={`${patientDisplayName(patient)} · ${patient.mrn} · ${patient.dob ?? `est. ${patient.estimatedAge}y`} · ${patient.sex}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setBreakGlassOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={justification.trim().length < 10}
              onClick={() => {
                setUnlocked(true)
                setBreakGlassOpen(false)
                success('Break-glass granted — 30 minutes', 'The DPO is notified; this access is now under review.')
              }}
            >
              Confirm emergency access
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-forest-500">
            Break-glass grants <strong>time-bound</strong> access without routine permission, for
            genuine emergency need only. The justification below, the access window and every view are{' '}
            <strong>recorded in the audit log</strong> and reviewed by the DPO. Inadequate
            justification is denied and the attempt logged.
          </p>
          <Field label="Emergency justification" required hint="Minimum 10 characters — state the clinical need.">
            <Textarea
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Unconscious in A&E — medication and allergy history needed before treatment…"
            />
          </Field>
        </div>
      </Modal>

      {/* Deceased status (W-HIM-014): elevated permission, high-risk confirm. */}
      <Modal
        open={deceasedOpen}
        onClose={() => setDeceasedOpen(false)}
        title="Mark as deceased"
        subtitle={`${patientDisplayName(patient)} · ${patient.mrn} · ${patient.dob ?? `est. ${patient.estimatedAge}y`} · ${patient.sex}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeceasedOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" disabled={deceasedReason.trim() === ''} onClick={confirmDeceased}>
              Mark as deceased
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-forest-500">
            Deceased status blocks routine-care routing and changes disclosure rules. It requires an
            authorised clinician, a death note or notification on file, and{' '}
            <strong>will be recorded in the audit log</strong>. Entered in error, reversal requires
            supervisor approval.
          </p>
          <Field label="Evidence / reason" required hint="Reference the death notification or clinical note.">
            <Textarea
              rows={2}
              value={deceasedReason}
              onChange={(e) => setDeceasedReason(e.target.value)}
              placeholder="Death notification form DN-2026-114 on file, certified by Dr.…"
            />
          </Field>
        </div>
      </Modal>

      {/* Returning-patient verification & routing (W-HIM-006). */}
      <Modal
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        title="Verify returning patient"
        subtitle={`${patientDisplayName(patient)} · ${patient.mrn} · ${patient.dob ?? `est. ${patient.estimatedAge}y`} · ${patient.sex}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setVerifyOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!checkOne || !checkTwo}
              onClick={() => {
                success('Identity verified & routed', 'Two identifiers confirmed — routed to the clinic queue; verification and check-in audited.')
                setVerifyOpen(false)
              }}
            >
              Confirm & route
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-forest-500">
            Confirm at least <strong>two</strong> identifiers or demographics with the person before
            acting on this record — the wrong-patient control for returning patients. Multiple
            similar matches go to duplicate review instead.
          </p>
          <Checkbox
            checked={checkOne}
            onChange={setCheckOne}
            label="Name and date of birth confirmed verbally"
          />
          <Checkbox
            checked={checkTwo}
            onChange={setCheckTwo}
            label="Second identifier sighted (MRN card, NIN or insurance card)"
          />
        </div>
      </Modal>

      {/* Consent capture (W-HIM-032). */}
      <Drawer
        open={captureOpen}
        onClose={() => setCaptureOpen(false)}
        title="Capture consent"
        subtitle={`${patientDisplayName(patient)} · ${patient.mrn}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCaptureOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={captureScope.trim() === ''}
              onClick={() => {
                setAddedConsents((all) => ({
                  ...all,
                  [patient.id]: [
                    ...(all[patient.id] ?? []),
                    { category: captureCategory, scope: captureScope.trim(), status: 'captured' as const, date: 'Today' },
                  ],
                }))
                success('Consent captured', 'Recorded with status, scope, source and timestamp. Disputed authority routes to the DPO.')
                setCaptureOpen(false)
              }}
            >
              Capture consent
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Category" required>
            <SelectMenu
              value={captureCategory}
              onChange={setCaptureCategory}
              options={['Treatment', 'Disclosure — payer', 'Disclosure — third party', 'Secondary use — research'].map(
                (v) => ({ value: v, label: v }),
              )}
            />
          </Field>
          <Field label="Scope" required hint="What exactly is consented to — minimum necessary.">
            <Input value={captureScope} onChange={(e) => setCaptureScope(e.target.value)} placeholder="e.g. Claims to Hygeia HMO for this admission" />
          </Field>
        </div>
      </Drawer>

      {/* Archive / reactivate (W-HIM-042): lifecycle change, never deletion. */}
      <Modal
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        title={patient.recordStatus === 'archived' ? 'Reactivate record' : 'Archive record'}
        subtitle={`${patientDisplayName(patient)} · ${patient.mrn}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setArchiveOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={patient.recordStatus === 'archived' ? 'primary' : 'danger'}
              disabled={archiveReason.trim() === ''}
              onClick={confirmArchive}
            >
              {patient.recordStatus === 'archived' ? 'Reactivate record' : 'Archive record'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[13px] leading-relaxed text-forest-500">
            {patient.recordStatus === 'archived'
              ? 'Reactivation restores the record to the active register with its full history.'
              : 'Archival removes the record from active worklists. Nothing is hard-deleted; the record stays retrievable and auditable.'}{' '}
            This action <strong>will be recorded in the audit log</strong>.
          </p>
          <Field label="Reason" required>
            <Textarea rows={2} value={archiveReason} onChange={(e) => setArchiveReason(e.target.value)} placeholder="No activity since 2019; retention window satisfied…" />
          </Field>
        </div>
      </Modal>

      {/* Add identifier (W-HIM-002/004/016): namespaced, starts unverified. */}
      <Drawer
        open={addIdOpen}
        onClose={() => setAddIdOpen(false)}
        title="Add identifier"
        subtitle={`${patientDisplayName(patient)} · ${patient.mrn}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddIdOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={addIdValue.trim() === ''}
              onClick={() => {
                setAddedIdentifiers((all) => ({
                  ...all,
                  [patient.id]: [
                    ...(all[patient.id] ?? []),
                    {
                      type: addIdType,
                      system: `urn:${addIdType.toLowerCase().replace(/[^a-z]+/g, '-')}`,
                      value: addIdValue.trim(),
                      issuer: addIdIssuer.trim() || 'Recorded at facility',
                      verification: 'unverified',
                      active: true,
                    },
                  ],
                }))
                success('Identifier added', 'Stored with its namespace and issuer; it starts unverified and never silently overwrites an existing verified identifier.')
                setAddIdOpen(false)
              }}
            >
              Add identifier
            </Button>
          </>
        }
      >
        <div className="grid gap-4">
          <Field label="Type" required>
            <SelectMenu
              value={addIdType}
              onChange={setAddIdType}
              options={['NIN', 'Passport', 'Driver licence', 'Voter card', 'Birth certificate number', 'Staff ID', 'Insurance number'].map(
                (v) => ({ value: v, label: v }),
              )}
            />
          </Field>
          <Field label="Value" required>
            <Input value={addIdValue} onChange={(e) => setAddIdValue(e.target.value)} />
          </Field>
          <Field label="Assigning authority" optional>
            <Input value={addIdIssuer} onChange={(e) => setAddIdIssuer(e.target.value)} placeholder="e.g. NIMC" />
          </Field>
        </div>
      </Drawer>

      {/* Consent withdrawal (W-HIM-032): changes future disclosure behaviour. */}
      <Modal
        open={withdrawFor !== null}
        onClose={() => setWithdrawFor(null)}
        title="Withdraw consent"
        subtitle={`${patientDisplayName(patient)} · ${patient.mrn} — ${withdrawFor ?? ''}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setWithdrawFor(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (withdrawFor) setWithdrawnKeys((all) => [...all, patient.id + withdrawFor])
                success(
                  'Consent withdrawn',
                  'Effective immediately for future disclosures; past lawful disclosures are unaffected. Recorded with source and date.',
                )
                setWithdrawFor(null)
              }}
            >
              Withdraw consent
            </Button>
          </>
        }
      >
        <p className="text-[13px] leading-relaxed text-forest-500">
          Withdrawal changes <strong>future</strong> disclosure behaviour from its effective date —
          it does not undo past lawful disclosures. Where consent authority is disputed, the request
          routes to the DPO instead. This action <strong>will be recorded in the audit log</strong>.
        </p>
      </Modal>

      {/* Demographic correction (W-HIM-015): low-risk fields inline; identity
          fields route to supervisor approval. Old values are preserved. */}
      <Drawer
        open={correctOpen}
        onClose={() => setCorrectOpen(false)}
        title="Correct demographics"
        subtitle={`${patientDisplayName(patient)} · ${patient.mrn}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCorrectOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setContactOverrides((all) => ({
                  ...all,
                  [patient.id]: { phone: phoneDraft || undefined, address: addressDraft || undefined },
                }))
                success(
                  'Correction saved',
                  'Old values are preserved in the record history — no silent overwrite. The change is audited with actor and reason.',
                )
                setCorrectOpen(false)
              }}
            >
              Save correction
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Alert tone="info" title="Identity fields need supervisor approval">
            Name, date of birth and sex are high-risk identity fields — corrections to them route to
            a HIM Supervisor with evidence, and re-run the duplicate check.
          </Alert>
          <div className="grid gap-4">
            <Field label="Family name">
              <Input value={patient.familyName} disabled />
            </Field>
            <Field label="Given names">
              <Input value={patient.givenNames} disabled />
            </Field>
            <Field label="Phone" hint="Low-risk contact field — editable with audit.">
              <Input value={phoneDraft} onChange={(e) => setPhoneDraft(e.target.value)} inputMode="tel" />
            </Field>
            <Field label="Address" hint="Low-risk contact field — editable with audit.">
              <Input value={addressDraft} onChange={(e) => setAddressDraft(e.target.value)} />
            </Field>
          </div>
        </div>
      </Drawer>
    </>
  )
}
