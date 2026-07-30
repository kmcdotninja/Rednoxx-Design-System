import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { ArrowLeft, Plus, ShieldCheck, Eye, Ban, Edit } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  KeyValue,
  Select,
  Modal,
  useToast,
  Skeleton,
  EmptyState,
  Alert,
} from '@/components/ui'
import { HimPatientBanner } from '../components/HimPatientBanner'
import {
  getPatientBanner,
  getPatientIdentifiers,
  addPatientIdentifier,
  verifyPatientIdentifier,
  deactivatePatientIdentifier,
  unmaskIdentifierValue,
  updatePatientIdentifier,
} from '../api'
import { PageHeader, can } from '../shared'
import type { PatientIdentifier } from '../types'

function AddIdentifierModal({
  open,
  onClose,
  onAdd,
  isAdding,
}: {
  open: boolean
  onClose: () => void
  onAdd: (identifier: {
    type: PatientIdentifier['type']
    namespace: string
    value: string
    issuer?: string
    expiryDate?: string
  }) => void
  isAdding: boolean
}) {
  const [newType, setNewType] = useState('NIN')
  const [newValue, setNewValue] = useState('')
  const [newNamespace, setNewNamespace] = useState('ng-nin')
  const [issuer, setIssuer] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  // Reset form each time the modal opens
  useEffect(() => {
    if (open) {
      setNewValue('')
      setNewType('NIN')
      setNewNamespace('ng-nin')
      setIssuer('')
      setExpiryDate('')
    }
  }, [open])

  const handleAdd = () => {
    if (!newValue.trim() || !newNamespace.trim()) return
    onAdd({
      type: newType as PatientIdentifier['type'],
      namespace: newNamespace,
      value: newValue,
      issuer: issuer || undefined,
      expiryDate: expiryDate || undefined,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add new identifier"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!newValue.trim() || !newNamespace.trim() || isAdding}
            onClick={handleAdd}
          >
            {isAdding ? 'Adding…' : 'Add'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="Type" required>
          <Select value={newType} onChange={(e) => setNewType(e.target.value)}>
            <option value="NIN">National ID (NIN)</option>
            <option value="ALT_ID">Alternative ID</option>
            <option value="PASSPORT">Passport</option>
            <option value="INSURANCE">Insurance ID</option>
            <option value="LEGACY_MRN">Legacy MRN</option>
          </Select>
        </Field>
        <Field label="Namespace / System" required hint="e.g. ng-nin, passport-ng, hospital-xyz">
          <Input
            value={newNamespace}
            onChange={(e) => setNewNamespace(e.target.value)}
            placeholder="Enter namespace (e.g. ng-nin)"
          />
        </Field>
        <Field label="Value" required>
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter identifier"
          />
        </Field>
        <Field label="Issuer (optional)">
          <Input
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            placeholder="e.g. NIMC, Passport Office"
          />
        </Field>
        <Field label="Expiry date (optional)">
          <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        </Field>
      </div>
    </Modal>
  )
}

function EditIdentifierModal({
  open,
  onClose,
  identifier,
  onEdit,
  isEditing,
}: {
  open: boolean
  onClose: () => void
  identifier: PatientIdentifier | null
  onEdit: (id: string, updates: Partial<PatientIdentifier>) => void
  isEditing: boolean
}) {
  const [namespace, setNamespace] = useState('')
  const [issuer, setIssuer] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open && identifier) {
      setNamespace(identifier.namespace || '')
      setIssuer(identifier.verifiedSource || '')
      setExpiryDate(identifier.expiryDate || '')
      setReason('')
    }
  }, [open, identifier])

  const handleSubmit = () => {
    if (!identifier) return
    onEdit(identifier.id, {
      namespace: namespace || undefined,
      verifiedSource: issuer || undefined,
      expiryDate: expiryDate || undefined,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit identifier"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!reason.trim() || isEditing} onClick={handleSubmit}>
            {isEditing ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Alert tone="info" title="Edit reason required">
          Please provide a reason for editing this identifier.
        </Alert>
        <Field label="Namespace / System">
          <Input
            value={namespace}
            onChange={(e) => setNamespace(e.target.value)}
            placeholder="e.g. ng-nin"
          />
        </Field>
        <Field label="Issuer">
          <Input
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            placeholder="e.g. NIMC"
          />
        </Field>
        <Field label="Expiry date">
          <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        </Field>
        <Field label="Reason for edit" required>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe why this identifier is being edited..."
          />
        </Field>
      </div>
    </Modal>
  )
}
function DeactivateIdentifierModal({
  open,
  onClose,
  onDeactivate,
  isDeactivating,
}: {
  open: boolean
  onClose: () => void
  onDeactivate: (reason: string) => void
  isDeactivating: boolean
}) {
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (open) {
      setReason('')
    }
  }, [open])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Deactivate identifier"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={!reason.trim() || isDeactivating}
            onClick={() => onDeactivate(reason)}
          >
            {isDeactivating ? 'Deactivating…' : 'Deactivate'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Alert tone="warning" title="This action cannot be undone">
          Deactivating this identifier will mark it as inactive. It can be reactivated later if
          needed.
        </Alert>
        <Field label="Reason for deactivation" required>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why is this identifier being deactivated?"
          />
        </Field>
      </div>
    </Modal>
  )
}

export function PatientIdentifiersPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const { success, error } = useToast()
  const queryClient = useQueryClient()

  const { data: patient, isPending: patientLoading } = useQuery({
    queryKey: ['patient-banner', id],
    queryFn: () => getPatientBanner(id),
  })

  const { data: identifiers = [], isPending: listLoading } = useQuery({
    queryKey: ['patient-identifiers', id],
    queryFn: () => getPatientIdentifiers(id),
  })

  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedIdentifier, setSelectedIdentifier] = useState<PatientIdentifier | null>(null)
  const [unmaskedId, setUnmaskedId] = useState<string | null>(null)
  const [unmaskedValue, setUnmaskedValue] = useState('')

  const addMutation = useMutation({
    mutationFn: (payload: {
      type: PatientIdentifier['type']
      namespace: string
      value: string
      issuer?: string
      expiryDate?: string
    }) =>
      addPatientIdentifier(id, {
        ...payload,
        maskedValue: maskValue(payload.value),
        verified: false,
        active: true,
      }),
    onSuccess: () => {
      success('Identifier added')
      queryClient.invalidateQueries({ queryKey: ['patient-identifiers', id] })
      setShowAddModal(false)
    },
    onError: () => error('Could not add identifier'),
  })

  const verifyMutation = useMutation({
    mutationFn: (identifierId: string) => verifyPatientIdentifier(id, identifierId),
    onSuccess: () => {
      success('Identifier verified')
      queryClient.invalidateQueries({ queryKey: ['patient-identifiers', id] })
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: (payload: { identifierId: string; reason: string }) =>
      deactivatePatientIdentifier(id, payload.identifierId),
    onSuccess: () => {
      success('Identifier deactivated')
      queryClient.invalidateQueries({ queryKey: ['patient-identifiers', id] })
      setShowDeactivateModal(false)
      setSelectedIdentifier(null)
    },
  })

  const editMutation = useMutation({
    mutationFn: (payload: { identifierId: string; updates: Partial<PatientIdentifier> }) =>
      updatePatientIdentifier(id, payload.identifierId, payload.updates),
    onSuccess: () => {
      success('Identifier updated')
      queryClient.invalidateQueries({ queryKey: ['patient-identifiers', id] })
      setShowEditModal(false)
      setSelectedIdentifier(null)
    },
    onError: () => error('Could not update identifier'),
  })

  const handleUnmask = async (identifierId: string) => {
    try {
      const val = await unmaskIdentifierValue(id, identifierId)
      setUnmaskedValue(val)
      setUnmaskedId(identifierId)
    } catch {
      error('Could not unmask identifier')
    }
  }

  const handleVerify = (identifierId: string) => {
    verifyMutation.mutate(identifierId)
  }

  if (patientLoading || listLoading) return <Skeleton className="h-64" />
  if (!patient) return <EmptyState variant="search" title="Patient not found" />

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-[13px] font-medium text-forest-400 hover:text-forest"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <PageHeader
        title="Manage identifiers"
        subtitle="Add, verify, and deactivate patient identifiers."
        actions={
          can('patient.identifier.manage') && (
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowAddModal(true)}>
              Add identifier
            </Button>
          )
        }
      />

      <HimPatientBanner patient={patient} />

      <Card className="space-y-2 px-4 py-3">
        <KeyValue
          label={
            patient.statusFlags.includes('merged')
              ? 'Permanent MRN (retained after merge — not deletable)'
              : 'Permanent MRN (not deletable)'
          }
          value={patient.mrn}
        />
        <p className="text-[12px] text-forest-400">
          Medical Records Numbers are system-assigned and immutable. Merged or retired records keep
          their original MRN (FR-HIM-ID-007) — it cannot be cleared or reused. Add NIN, passport,
          insurance, or legacy MRN below — never a replacement primary MRN.
        </p>
      </Card>

      {identifiers.length === 0 ? (
        <EmptyState variant="document" title="No identifiers on file" />
      ) : (
        <div className="space-y-3">
          {identifiers.map((idf) => (
            <Card key={idf.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-forest">{idf.type}</span>
                  <Badge tone={idf.active ? 'success' : 'neutral'} dot>
                    {idf.active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge tone={idf.verified ? 'success' : 'warning'} dot>
                    {idf.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                  {idf.namespace && <Badge tone="neutral">{idf.namespace}</Badge>}
                </div>
                <p className="text-sm text-forest-600 mt-1">
                  {unmaskedId === idf.id ? unmaskedValue : idf.maskedValue}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-0.5 text-[12px] text-forest-400">
                  {idf.verifiedAt && (
                    <span>
                      Verified: {new Date(idf.verifiedAt).toLocaleDateString()} · Source:{' '}
                      {idf.verifiedSource || 'N/A'}
                    </span>
                  )}
                  {idf.issuer && <span>Issuer: {idf.issuer}</span>}
                  {idf.expiryDate && (
                    <span>Expires: {new Date(idf.expiryDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {can('patient.identifier.unmask') && (
                  <button
                    type="button"
                    onClick={() => handleUnmask(idf.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-forest-300 hover:bg-panel hover:text-forest"
                    title="Unmask identifier"
                  >
                    <Eye size={14} />
                  </button>
                )}
                {can('patient.identifier.verify') && !idf.verified && (
                  <button
                    type="button"
                    onClick={() => handleVerify(idf.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-forest-300 hover:bg-panel hover:text-forest"
                    title="Verify identifier"
                  >
                    <ShieldCheck size={14} />
                  </button>
                )}
                {can('patient.identifier.manage') && idf.active && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIdentifier(idf)
                        setShowEditModal(true)
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-forest-300 hover:bg-panel hover:text-forest"
                      title="Edit identifier"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedIdentifier(idf)
                        setShowDeactivateModal(true)
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-xl text-forest-300 hover:bg-panel hover:text-forest"
                      title="Deactivate identifier"
                    >
                      <Ban size={14} />
                    </button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddIdentifierModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(payload) => addMutation.mutate(payload)}
        isAdding={addMutation.isPending}
      />

      <DeactivateIdentifierModal
        open={showDeactivateModal}
        onClose={() => {
          setShowDeactivateModal(false)
          setSelectedIdentifier(null)
        }}
        onDeactivate={(reason) => {
          if (selectedIdentifier) {
            deactivateMutation.mutate({ identifierId: selectedIdentifier.id, reason })
          }
        }}
        isDeactivating={deactivateMutation.isPending}
      />

      <EditIdentifierModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedIdentifier(null)
        }}
        identifier={selectedIdentifier}
        onEdit={(identifierId, updates) => {
          editMutation.mutate({ identifierId, updates })
        }}
        isEditing={editMutation.isPending}
      />
    </div>
  )
}

function maskValue(value: string): string {
  if (value.length <= 4) return value
  return '*'.repeat(value.length - 4) + value.slice(-4)
}
