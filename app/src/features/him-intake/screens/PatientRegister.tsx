import { useCallback, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft, ShieldAlert, UserPlus } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Field,
  HorizontalStepper,
  Input,
  KeyValue,
  Modal,
  Select,
  Skeleton,
  Textarea,
  useToast,
} from '@/components/ui'
import { duplicateCheckAttrs, registerPatient } from '../api'
import { can, PageHeader } from '../shared'
import { FACILITIES } from '../data'
import { getMrnSchemeLabel } from '../mrn'
import type { RegistrationDraft } from '../types'

const STEPS = [
  'Confirm no duplicate',
  'Demographics',
  'Identifiers',
  'Contacts / NOK',
  'Coverage',
  'Review & register',
]

const RELATIONSHIPS = ['Spouse', 'Parent', 'Child', 'Sibling', 'Guardian', 'Other']

const EMPTY_DRAFT: RegistrationDraft = {
  surname: '',
  givenNames: '',
  dateOfBirth: '',
  phone: '',
  sex: 'unknown',
  estimatedAge: null,
  address: '',
  nin: '',
  ninUnavailable: false,
  ninUnavailableReason: '',
  altIdType: '',
  altIdValue: '',
  altIdIssuer: '',
  nokName: '',
  nokRelationship: '',
  nokPhone: '',
  hasCoverage: false,
  coveragePayer: '',
  coverageMemberId: '',
  facility: FACILITIES[0],
  duplicateOverrideConfirmed: false,
  duplicateOverrideReason: '',
}

type SetField = <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => void

/** Age in whole years as of today, from a `yyyy-mm-dd` date of birth. */
function calculateAge(iso: string): number | null {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  const today = new Date()
  let age = today.getFullYear() - y
  const hadBirthdayThisYear =
    today.getMonth() + 1 > m || (today.getMonth() + 1 === m && today.getDate() >= d)
  if (!hadBirthdayThisYear) age--
  return age
}

export function PatientRegisterPage() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const searchHint = (useSearch({ strict: false }) as { q?: string })?.q ?? ''

  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<RegistrationDraft>(EMPTY_DRAFT)
  const [submitting, setSubmitting] = useState(false)

  const set: SetField = (key, value) => setDraft((d) => ({ ...d, [key]: value }))

  /** Setting DOB also recalculates the estimated age, so Step 2 and the
   *  review step never show a stale age after the officer edits DOB. */
  const setDateOfBirth = (iso: string) =>
    setDraft((d) => ({
      ...d,
      dateOfBirth: iso,
      estimatedAge: iso ? calculateAge(iso) : d.estimatedAge,
    }))

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const handleRegister = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const result = await registerPatient(draft)
      success('Patient registered', `MRN ${result.mrn} issued automatically.`)
      navigate({ to: '/him/patients/register/complete/$id', params: { id: result.id } })
    } catch (e) {
      error(
        'Registration failed',
        e instanceof Error ? e.message : 'Could not allocate a unique MRN. Try again.',
      )
    } finally {
      setSubmitting(false)
    }
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
        title="Register a new patient"
        subtitle={
          searchHint
            ? `Reachable because your search for "${searchHint}" returned no confident match.`
            : 'Search before create. Permanent MRN is assigned automatically on save.'
        }
      />

      <Card pad={false} className="overflow-x-auto p-4 sm:p-5">
        <HorizontalStepper steps={STEPS} current={step} onSelect={(i) => i < step && setStep(i)} />
      </Card>

      <Card>
        {step === 0 && (
          <Step1Duplicate
            draft={draft}
            set={set}
            onDateOfBirthChange={setDateOfBirth}
            onContinue={next}
          />
        )}
        {step === 1 && (
          <Step2Demographics draft={draft} set={set} onBack={back} onContinue={next} />
        )}
        {step === 2 && <Step3Identifiers draft={draft} set={set} onBack={back} onContinue={next} />}
        {step === 3 && <Step4Contacts draft={draft} set={set} onBack={back} onContinue={next} />}
        {step === 4 && <Step5Coverage draft={draft} set={set} onBack={back} onContinue={next} />}
        {step === 5 && (
          <Step6Review
            draft={draft}
            set={set}
            onBack={back}
            onRegister={handleRegister}
            submitting={submitting}
          />
        )}
      </Card>
    </div>
  )
}

/* --------------------------------- Step 1 --------------------------------- */

function Step1Duplicate({
  draft,
  set,
  onDateOfBirthChange,
  onContinue,
}: {
  draft: RegistrationDraft
  set: SetField
  onDateOfBirthChange: (iso: string) => void
  onContinue: () => void
}) {
  const navigate = useNavigate()
  const [overrideModalOpen, setOverrideModalOpen] = useState(false)
  const [reasonDraft, setReasonDraft] = useState(draft.duplicateOverrideReason)
  // Modal's effect keys off onClose's identity — an inline arrow here would
  // get a new reference every render (i.e. every keystroke in the textarea
  // below), re-triggering the effect's cleanup, which steals focus back to
  // the trigger button. useCallback keeps the reference stable.
  const closeOverrideModal = useCallback(() => setOverrideModalOpen(false), [])

  const { data: candidates, isPending } = useQuery({
    queryKey: ['duplicate-check', draft.surname, draft.givenNames, draft.dateOfBirth, draft.phone],
    queryFn: () =>
      duplicateCheckAttrs({
        surname: draft.surname,
        givenNames: draft.givenNames,
        dateOfBirth: draft.dateOfBirth,
        phone: draft.phone,
      }),
    enabled: draft.surname.trim().length > 0 && draft.givenNames.trim().length > 0,
  })

  const hasCandidates = (candidates?.length ?? 0) > 0
  const canOverride = can('patient.duplicate.override')
  const readyToContinue =
    draft.surname.trim().length > 0 &&
    draft.givenNames.trim().length > 0 &&
    (!hasCandidates || draft.duplicateOverrideConfirmed)

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Surname" required>
          <Input
            value={draft.surname}
            onChange={(e) => set('surname', e.target.value)}
            placeholder="Eze"
          />
        </Field>
        <Field label="Given name(s)" required>
          <Input
            value={draft.givenNames}
            onChange={(e) => set('givenNames', e.target.value)}
            placeholder="Ngozi"
          />
        </Field>
        <Field
          label="Date of birth"
          hint="Leave blank if unknown — capture an estimated age in the next step."
        >
          <DatePicker
            value={draft.dateOfBirth}
            onChange={onDateOfBirthChange}
            placeholder="Select date of birth"
          />
        </Field>
        <Field label="Phone" optional>
          <Input
            value={draft.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="0803 000 0000"
          />
        </Field>
      </div>

      {isPending && (draft.surname || draft.givenNames) && <Skeleton className="h-14" />}

      {!isPending && hasCandidates && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[13px] font-medium text-orange-600">
            <ShieldAlert size={15} />
            {candidates!.length} possible {candidates!.length === 1 ? 'match' : 'matches'} found —
            review before continuing
          </div>

          <div className="space-y-2">
            {candidates!.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hair p-3.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-forest">{c.displayName}</p>
                  <p className="tnum mt-0.5 text-[12px] text-forest-400">
                    MRN {c.mrn} · {c.age != null ? `${c.age}y` : 'age unknown'} · {c.sex} ·{' '}
                    {c.facility}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {c.matchedOn.map((m) => (
                      <Badge key={m} tone="warning">
                        matched on {m}
                      </Badge>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate({ to: '/him/patients/$id', params: { id: c.id } })}
                  className="shrink-0 text-[13px] font-medium text-azure hover:underline"
                >
                  Use this record →
                </button>
              </div>
            ))}
          </div>

          {canOverride ? (
            draft.duplicateOverrideConfirmed ? (
              <div className="rounded-2xl bg-panel px-4 py-3 text-[13px] text-forest-500">
                <span className="font-medium text-forest">Override confirmed.</span>{' '}
                {draft.duplicateOverrideReason}
              </div>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setReasonDraft(draft.duplicateOverrideReason)
                  setOverrideModalOpen(true)
                }}
              >
                None of these match — override
              </Button>
            )
          ) : (
            <p className="rounded-2xl bg-panel px-4 py-3 text-[13px] text-forest-400">
              You don't have permission to override a duplicate warning. Ask a supervisor to review
              this match.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button disabled={!readyToContinue} onClick={onContinue}>
          Continue
        </Button>
      </div>

      <Modal
        open={overrideModalOpen}
        onClose={closeOverrideModal}
        title="Confirm this is not a duplicate"
        subtitle="This overrides the duplicate warning and is recorded in the audit trail."
        footer={
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" onClick={closeOverrideModal}>
              Cancel
            </Button>
            <Button
              disabled={reasonDraft.trim().length === 0}
              onClick={() => {
                set('duplicateOverrideReason', reasonDraft)
                set('duplicateOverrideConfirmed', true)
                setOverrideModalOpen(false)
              }}
            >
              Confirm — proceed with registration
            </Button>
          </div>
        }
      >
        <Field label="Reason this is not a duplicate" required>
          <Textarea
            value={reasonDraft}
            onChange={(e) => setReasonDraft(e.target.value)}
            placeholder="Explain what distinguishes this patient from the match(es) above…"
          />
        </Field>
      </Modal>
    </div>
  )
}

/* --------------------------------- Step 2 --------------------------------- */

function Step2Demographics({
  draft,
  set,
  onBack,
  onContinue,
}: {
  draft: RegistrationDraft
  set: SetField
  onBack: () => void
  onContinue: () => void
}) {
  const ready = draft.sex !== 'unknown'
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <KeyValue label="Name" value={`${draft.givenNames} ${draft.surname}`.trim() || '—'} />
        <KeyValue label="Date of birth" value={draft.dateOfBirth || 'Not provided'} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sex" required>
          <Select
            value={draft.sex}
            onChange={(e) => set('sex', e.target.value as RegistrationDraft['sex'])}
          >
            <option value="unknown">Select…</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </Select>
        </Field>
        {draft.dateOfBirth ? (
          <KeyValue
            label="Age"
            value={
              draft.estimatedAge != null ? `${draft.estimatedAge}y (calculated from DOB)` : '—'
            }
          />
        ) : (
          <Field label="Estimated age" optional hint="Only if date of birth is unknown">
            <Input
              type="number"
              min={0}
              max={130}
              value={draft.estimatedAge ?? ''}
              onChange={(e) => set('estimatedAge', e.target.value ? Number(e.target.value) : null)}
            />
          </Field>
        )}
        <Field label="Address" optional className="sm:col-span-2">
          <Textarea value={draft.address} onChange={(e) => set('address', e.target.value)} />
        </Field>
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button disabled={!ready} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}

/* --------------------------------- Step 3 --------------------------------- */

function Step3Identifiers({
  draft,
  set,
  onBack,
  onContinue,
}: {
  draft: RegistrationDraft
  set: SetField
  onBack: () => void
  onContinue: () => void
}) {
  const [showAltId, setShowAltId] = useState(Boolean(draft.altIdType || draft.altIdValue))

  return (
    <div className="space-y-5">
      <div className="grid items-start gap-4 sm:grid-cols-2">
        <Field label="NIN / National ID" optional hint="Missing NIN never blocks registration.">
          <Input
            value={draft.nin}
            onChange={(e) => set('nin', e.target.value)}
            disabled={draft.ninUnavailable}
            placeholder="11-digit NIN"
          />
        </Field>
        <div className="pt-8">
          <Checkbox
            checked={draft.ninUnavailable}
            onChange={(checked) => set('ninUnavailable', checked)}
            label="NIN not available"
          />
        </div>
      </div>

      {draft.ninUnavailable && (
        <Field label="Reason NIN is unavailable" optional>
          <Textarea
            value={draft.ninUnavailableReason}
            onChange={(e) => set('ninUnavailableReason', e.target.value)}
            placeholder="e.g. patient has not yet enrolled with NIMC"
          />
        </Field>
      )}

      {!showAltId ? (
        <Button variant="secondary" size="sm" onClick={() => setShowAltId(true)}>
          + Add alternative identifier
        </Button>
      ) : (
        <div className="grid gap-4 rounded-2xl bg-panel p-4 sm:grid-cols-3">
          <Field label="Type">
            <Select value={draft.altIdType} onChange={(e) => set('altIdType', e.target.value)}>
              <option value="">Select…</option>
              <option value="voters_card">Voter's card</option>
              <option value="drivers_licence">Driver's licence</option>
              <option value="passport">Passport</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Value">
            <Input value={draft.altIdValue} onChange={(e) => set('altIdValue', e.target.value)} />
          </Field>
          <Field label="Issuer" optional>
            <Input value={draft.altIdIssuer} onChange={(e) => set('altIdIssuer', e.target.value)} />
          </Field>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </div>
  )
}

/* --------------------------------- Step 4 --------------------------------- */

function Step4Contacts({
  draft,
  set,
  onBack,
  onContinue,
}: {
  draft: RegistrationDraft
  set: SetField
  onBack: () => void
  onContinue: () => void
}) {
  const ready = draft.nokName.trim().length > 0 && draft.nokRelationship.trim().length > 0

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Next-of-kin name" required>
          <Input value={draft.nokName} onChange={(e) => set('nokName', e.target.value)} />
        </Field>
        <Field label="Relationship" required>
          <Select
            value={draft.nokRelationship}
            onChange={(e) => set('nokRelationship', e.target.value)}
          >
            <option value="">Select…</option>
            {RELATIONSHIPS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Next-of-kin phone" optional>
          <Input value={draft.nokPhone} onChange={(e) => set('nokPhone', e.target.value)} />
        </Field>
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button disabled={!ready} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}

/* --------------------------------- Step 5 --------------------------------- */

function Step5Coverage({
  draft,
  set,
  onBack,
  onContinue,
}: {
  draft: RegistrationDraft
  set: SetField
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <div className="space-y-5">
      <Checkbox
        checked={draft.hasCoverage}
        onChange={(checked) => set('hasCoverage', checked)}
        label="This patient has insurance / HMO coverage"
      />

      {draft.hasCoverage && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Payer / insurer" required>
            <Input
              value={draft.coveragePayer}
              onChange={(e) => set('coveragePayer', e.target.value)}
              placeholder="Hygeia HMO"
            />
          </Field>
          <Field label="Member ID" optional>
            <Input
              value={draft.coverageMemberId}
              onChange={(e) => set('coverageMemberId', e.target.value)}
            />
          </Field>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </div>
  )
}

/* --------------------------------- Step 6 --------------------------------- */

function Step6Review({
  draft,
  set,
  onBack,
  onRegister,
  submitting,
}: {
  draft: RegistrationDraft
  set: SetField
  onBack: () => void
  onRegister: () => void
  submitting: boolean
}) {
  return (
    <div className="space-y-5">
      <Field label="Registering facility" required>
        <Select value={draft.facility} onChange={(e) => set('facility', e.target.value)}>
          {FACILITIES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </Select>
      </Field>

      <div className="rounded-xl border border-azure/20 bg-azure-50 px-3.5 py-3 text-[13px] text-azure">
        <p className="font-medium">MRN will be assigned on save</p>
        <p className="mt-0.5 opacity-90">
          Facility format <span className="tnum font-mono">{getMrnSchemeLabel(draft.facility)}</span>
          . You cannot type or override the permanent MRN.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KeyValue label="Name" value={`${draft.givenNames} ${draft.surname}`.trim() || '—'} />
        <KeyValue label="Sex" value={draft.sex === 'unknown' ? '—' : draft.sex} />
        <KeyValue
          label="Date of birth"
          value={
            draft.dateOfBirth || (draft.estimatedAge ? `~${draft.estimatedAge}y (estimated)` : '—')
          }
        />
        <KeyValue label="Phone" value={draft.phone || '—'} />
        <KeyValue label="NIN" value={draft.ninUnavailable ? 'Not available' : draft.nin || '—'} />
        <KeyValue
          label="Alternative ID"
          value={draft.altIdValue ? `${draft.altIdType || 'ID'}: ${draft.altIdValue}` : 'None'}
        />
        <KeyValue
          label="Next of kin"
          value={draft.nokName ? `${draft.nokName} (${draft.nokRelationship})` : '—'}
        />
        <KeyValue
          label="Coverage"
          value={draft.hasCoverage && draft.coveragePayer ? draft.coveragePayer : 'Self-pay / none'}
        />
        {draft.duplicateOverrideReason && (
          <KeyValue
            label="Duplicate override reason"
            value={draft.duplicateOverrideReason}
            className="sm:col-span-2 xl:col-span-3"
          />
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack} disabled={submitting}>
          Back
        </Button>
        <Button leftIcon={<UserPlus size={14} />} onClick={onRegister} disabled={submitting}>
          {submitting ? 'Assigning MRN…' : 'Save & assign MRN'}
        </Button>
      </div>
    </div>
  )
}
