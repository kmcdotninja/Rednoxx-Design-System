import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Database, CheckCircle, XCircle, ArrowLeft, AlertTriangle, FileText } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Field,
  Input,
  Select,
  Modal,
  HorizontalStepper,
  EmptyState,
  Skeleton,
  useToast,
  Alert,
} from '@/components/ui'
import { PageHeader, can } from '../shared'
import {
  getMigrationJobs,
  createMigrationJob,
  updateMigrationMapping,
  validateMigration,
  rehearseMigration,
  commitMigration,
  rollbackMigration,
} from '../api'
import type { MigrationJob, MigrationFieldMapping } from '../types'

const STEPS = ['Upload', 'Map Fields', 'Validate', 'De‑duplicate', 'Rehearse', 'Commit']

// ---------------------------------------------------------------
//  Parent page – job list + button to open wizard
// ---------------------------------------------------------------
export function MigrationPage() {
  const queryClient = useQueryClient()
  const [wizardOpen, setWizardOpen] = useState(false)

  const {
    data: jobs = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['migration-jobs'],
    queryFn: getMigrationJobs,
  })

  const invalidateJobs = () => {
    queryClient.invalidateQueries({ queryKey: ['migration-jobs'] })
    refetch()
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex items-center gap-1.5 text-[13px] font-medium text-forest-400 transition-colors hover:text-forest"
      >
        <ArrowLeft size={14} />
        Back
      </button>
      <PageHeader
        title="Legacy migration"
        subtitle="Import, map, validate, and commit legacy patient data."
        actions={
          can('him.migration.manage') && (
            <Button size="sm" leftIcon={<Database size={14} />} onClick={() => setWizardOpen(true)}>
              New migration
            </Button>
          )
        }
      />

      {isPending ? (
        <Skeleton className="h-64" />
      ) : jobs.length === 0 ? (
        <EmptyState
          variant="folder"
          title="No migration jobs"
          description="Start a new legacy data import to begin migrating patient records."
          action={
            can('him.migration.manage') && (
              <Button
                size="sm"
                leftIcon={<Database size={14} />}
                onClick={() => setWizardOpen(true)}
              >
                Start migration
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id} className="flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-panel text-forest-400">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-forest">{job.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge
                      tone={
                        job.status === 'committed'
                          ? 'success'
                          : job.status === 'rolled_back'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {job.status}
                    </Badge>
                    <span className="text-[12px] text-forest-400">
                      {job.totalRows} rows ·{' '}
                      {job.uploadedAt
                        ? new Date(job.uploadedAt).toLocaleDateString()
                        : 'Not uploaded'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {job.status === 'committed' && (
                  <Badge tone="success" className="flex items-center gap-1">
                    <CheckCircle size={12} />
                    Completed
                  </Badge>
                )}
                {job.status === 'rolled_back' && (
                  <Badge tone="danger" className="flex items-center gap-1">
                    <XCircle size={12} />
                    Rolled back
                  </Badge>
                )}
                <Button variant="secondary" size="sm" disabled>
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {wizardOpen && (
        <MigrationWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onSuccess={() => {
            invalidateJobs()
            setWizardOpen(false)
          }}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------
//  Wizard – manages its own state, but job name is local to StepUpload
// ---------------------------------------------------------------
function MigrationWizard({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const { success, error } = useToast()
  const queryClient = useQueryClient()

  const [step, setStep] = useState(0)
  const [currentJob, setCurrentJob] = useState<MigrationJob | null>(null)
  const [rollbackPlan, setRollbackPlan] = useState('')

  const createMutation = useMutation({
    mutationFn: (name: string) => createMigrationJob(name),
    onSuccess: (job) => {
      success('Job created')
      setCurrentJob(job)
      setStep(1)
    },
    onError: () => error('Could not create job'),
  })

  const handleMapping = async (mapping: MigrationFieldMapping[]) => {
    if (!currentJob) return
    const updated = await updateMigrationMapping(currentJob.id, mapping)
    setCurrentJob(updated)
    setStep(2)
  }

  const handleValidate = async () => {
    if (!currentJob) return
    const updated = await validateMigration(currentJob.id)
    setCurrentJob(updated)
    setStep(3)
  }

  const handleDedupContinue = () => setStep(4)

  const handleRehearse = async () => {
    if (!currentJob) return
    const updated = await rehearseMigration(currentJob.id)
    setCurrentJob(updated)
    setStep(5)
  }

  const handleCommit = async () => {
    if (!currentJob) return
    await commitMigration(currentJob.id)
    queryClient.invalidateQueries({ queryKey: ['migration-jobs'] })
    onSuccess()
  }

  const handleRollback = async () => {
    if (!currentJob) return
    // Capture rollback plan before committing
    if (!rollbackPlan.trim()) {
      error('Please describe your rollback plan before proceeding.')
      return
    }
    await rollbackMigration(currentJob.id)
    queryClient.invalidateQueries({ queryKey: ['migration-jobs'] })
    success('Migration rolled back successfully')
    onSuccess()
  }

  const handleClose = () => {
    setStep(0)
    setCurrentJob(null)
    setRollbackPlan('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="lg"
      title={currentJob ? `Migration: ${currentJob.name}` : 'New migration'}
      footer={
        <div className="flex justify-between">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          {step < STEPS.length - 1 && (
            <Button onClick={() => setStep((s) => s + 1)}>Next step</Button>
          )}
        </div>
      }
    >
      <HorizontalStepper steps={STEPS} current={step} onSelect={setStep} />

      <div className="mt-4">
        {step === 0 && (
          <StepUpload
            onCreate={(name) => createMutation.mutate(name)}
            isCreating={createMutation.isPending}
          />
        )}
        {step === 1 && currentJob && <StepMapping job={currentJob} onSave={handleMapping} />}
        {step === 2 && currentJob && <StepValidate job={currentJob} onValidate={handleValidate} />}
        {step === 3 && currentJob && (
          <StepDedup job={currentJob} onContinue={handleDedupContinue} />
        )}
        {step === 4 && currentJob && <StepRehearse job={currentJob} onRehearse={handleRehearse} />}
        {step === 5 && currentJob && (
          <StepCommit
            job={currentJob}
            onCommit={handleCommit}
            onRollback={handleRollback}
            rollbackPlan={rollbackPlan}
            setRollbackPlan={setRollbackPlan}
          />
        )}
      </div>
    </Modal>
  )
}

// ---------------------------------------------------------------
//  Step components
// ---------------------------------------------------------------
function StepUpload({
  onCreate,
  isCreating,
}: {
  onCreate: (name: string) => void
  isCreating: boolean
}) {
  const [name, setName] = useState('')

  return (
    <div className="space-y-4">
      <Field label="Job name" required>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Old EMR Export"
        />
      </Field>
      <Button onClick={() => onCreate(name)} disabled={!name.trim() || isCreating}>
        {isCreating ? 'Creating…' : 'Create job & upload (simulated)'}
      </Button>
    </div>
  )
}

function StepMapping({
  job,
  onSave,
}: {
  job: MigrationJob
  onSave: (mapping: MigrationFieldMapping[]) => void
}) {
  const [mapping, setMapping] = useState<MigrationFieldMapping[]>(job.mapping)
  const sourceFields = ['Name', 'Age', 'Sex', 'DOB', 'Phone']
  const targetFields = ['fullName', 'dateOfBirth', 'sex', 'phone']

  return (
    <div className="space-y-4">
      {sourceFields.map((sf) => (
        <div key={sf} className="flex items-center gap-2">
          <span className="text-sm w-20">{sf}</span>
          <Select
            value={mapping.find((m) => m.sourceField === sf)?.targetField || ''}
            onChange={(e) => {
              setMapping((prev) => [
                ...prev.filter((m) => m.sourceField !== sf),
                { sourceField: sf, targetField: e.target.value },
              ])
            }}
          >
            <option value="">Ignore</option>
            {targetFields.map((tf) => (
              <option key={tf} value={tf}>
                {tf}
              </option>
            ))}
          </Select>
        </div>
      ))}
      <Button onClick={() => onSave(mapping)}>Save mapping & parse</Button>
    </div>
  )
}

function StepValidate({ job, onValidate }: { job: MigrationJob; onValidate: () => void }) {
  return (
    <div className="space-y-4">
      <p>Total rows: {job.totalRows}</p>
      {job.validationErrors.length > 0 ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-soft/30 p-4">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle size={16} />
            <span className="font-medium">Validation errors found</span>
          </div>
          <ul className="mt-2 list-disc pl-5 text-rose-600">
            {job.validationErrors.map((e, i) => (
              <li key={i}>
                Row {e.row}: {e.message}
              </li>
            ))}
          </ul>
        </div>
      ) : job.validationErrors.length === 0 && job.totalRows > 0 ? (
        <Alert tone="success" title="Validation passed">
          All {job.totalRows} rows are valid.
        </Alert>
      ) : null}
      <Button onClick={onValidate}>Run validation</Button>
    </div>
  )
}

function StepDedup({ job, onContinue }: { job: MigrationJob; onContinue: () => void }) {
  return (
    <div className="space-y-4">
      {job.duplicateCandidates.length > 0 ? (
        <div>
          <Alert
            tone="warning"
            title={`${job.duplicateCandidates.length} duplicate candidates found`}
          >
            Review the potential duplicates below before proceeding.
          </Alert>
          <div className="mt-3 space-y-2">
            {job.duplicateCandidates.map((c) => (
              <div key={c.existingPatientId} className="rounded-xl border border-hair bg-white p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-forest">{c.displayName}</p>
                    <p className="text-[12px] text-forest-400">MRN: {c.mrn}</p>
                  </div>
                  <Badge tone="warning">{c.matchFields.join(', ')}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Alert tone="success" title="No duplicates found">
          All records appear to be unique. Ready to proceed.
        </Alert>
      )}
      <Button onClick={onContinue}>Continue</Button>
    </div>
  )
}

function StepRehearse({ job, onRehearse }: { job: MigrationJob; onRehearse: () => void }) {
  return (
    <div className="space-y-4">
      {job.rehearsalResult ? (
        <div className="rounded-2xl border border-hair bg-panel/30 p-4">
          <h4 className="font-medium text-forest">Rehearsal results</h4>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-[11px] uppercase text-forest-400">Total rows</p>
              <p className="text-[15px] font-medium text-forest">{job.rehearsalResult.totalRows}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-forest-400">Valid</p>
              <p className="text-[15px] font-medium text-green-600">
                {job.rehearsalResult.validRows}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-forest-400">Errors</p>
              <p className="text-[15px] font-medium text-rose-600">
                {job.rehearsalResult.errorRows}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase text-forest-400">Duplicates</p>
              <p className="text-[15px] font-medium text-amber-600">
                {job.rehearsalResult.duplicateRows}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Button onClick={onRehearse}>Run rehearsal</Button>
      )}
    </div>
  )
}

function StepCommit({
  job,
  onCommit,
  onRollback,
  rollbackPlan,
  setRollbackPlan,
}: {
  job: MigrationJob
  onCommit: () => void
  onRollback: () => void
  rollbackPlan: string
  setRollbackPlan: (plan: string) => void
}) {
  return (
    <div className="space-y-4">
      <Alert tone="info" title="Ready to commit">
        This will permanently import {job.totalRows} patient records into the system.
      </Alert>

      <div className="rounded-2xl border border-hair bg-panel/30 p-4">
        <h4 className="font-medium text-forest">Rollback plan</h4>
        <p className="mt-1 text-[13px] text-forest-400">
          Describe how this migration can be rolled back if issues are discovered.
        </p>
        <Field label="Rollback strategy" required className="mt-2">
          <Input
            value={rollbackPlan}
            onChange={(e) => setRollbackPlan(e.target.value)}
            placeholder="e.g. Restore from backup before migration, revert to previous version..."
          />
        </Field>
      </div>

      <div className="flex gap-2">
        <Button leftIcon={<CheckCircle size={14} />} onClick={onCommit}>
          Commit migration
        </Button>
        <Button
          variant="secondary"
          leftIcon={<XCircle size={14} />}
          onClick={onRollback}
          disabled={!rollbackPlan.trim()}
          title={!rollbackPlan.trim() ? 'Please describe a rollback plan first' : ''}
        >
          Rollback
        </Button>
      </div>
    </div>
  )
}
