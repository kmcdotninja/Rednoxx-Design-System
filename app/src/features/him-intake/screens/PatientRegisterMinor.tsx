import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, UserPlus } from 'lucide-react'
import {
  Button,
  Card,
  Checkbox,
  DatePicker,
  Field,
  Input,
  KeyValue,
  Select,
  Textarea,
  useToast,
} from '@/components/ui'
import { PageHeader } from '../shared'
import { registerMinor } from '../api'
import { FACILITIES } from '../data'
import type { MinorRegistrationDraft, PatientSex } from '../types'

const RELATIONSHIPS = [
  'Mother',
  'Father',
  'Grandparent',
  'Aunt',
  'Uncle',
  'Sibling',
  'Legal guardian',
  'Foster parent',
  'Other',
]

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

const EMPTY_DRAFT: MinorRegistrationDraft = {
  surname: '',
  givenNames: '',
  dateOfBirth: '',
  estimatedAge: null,
  sex: 'unknown',
  phone: '',
  address: '',
  nin: '',
  ninUnavailable: false,
  ninUnavailableReason: '',
  altIdType: '',
  altIdValue: '',
  altIdIssuer: '',
  guardianName: '',
  guardianRelationship: '',
  guardianId: '',
  consentAuthority: false,
  consentNotes: '',
  facility: FACILITIES[0],
}

export function PatientRegisterMinorPage() {
  const navigate = useNavigate()
  const { success } = useToast()

  const [draft, setDraft] = useState<MinorRegistrationDraft>(EMPTY_DRAFT)
  const [submitting, setSubmitting] = useState(false)

  const set = <K extends keyof MinorRegistrationDraft>(key: K, value: MinorRegistrationDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }))

  /** Setting DOB also updates the estimated age automatically. */
  const setDateOfBirth = (iso: string) =>
    setDraft((d) => ({
      ...d,
      dateOfBirth: iso,
      estimatedAge: iso ? calculateAge(iso) : d.estimatedAge,
    }))

  const ready =
    draft.surname.trim().length > 0 &&
    draft.givenNames.trim().length > 0 &&
    draft.sex !== 'unknown' &&
    draft.guardianName.trim().length > 0 &&
    draft.guardianRelationship.trim().length > 0 &&
    draft.consentAuthority

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const result = await registerMinor(draft)
      success('Minor registered', `MRN ${result.mrn} issued with guardian link.`)
      navigate({ to: '/him/patients/$id', params: { id: result.id } })
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
        title="Register a minor patient"
        subtitle="For patients below the age threshold — guardian and consent authority are mandatory."
      />

      <Card className="space-y-5">
        {/* Demographics */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Surname" required>
            <Input
              value={draft.surname}
              onChange={(e) => set('surname', e.target.value)}
              placeholder="Ibrahim"
            />
          </Field>
          <Field label="Given name(s)" required>
            <Input
              value={draft.givenNames}
              onChange={(e) => set('givenNames', e.target.value)}
              placeholder="Aisha"
            />
          </Field>
          <Field label="Date of birth" required>
            <DatePicker
              value={draft.dateOfBirth}
              onChange={setDateOfBirth}
              placeholder="Select DOB"
            />
          </Field>
          <Field label="Sex" required>
            <Select value={draft.sex} onChange={(e) => set('sex', e.target.value as PatientSex)}>
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
                max={17}
                value={draft.estimatedAge ?? ''}
                onChange={(e) =>
                  set('estimatedAge', e.target.value ? Number(e.target.value) : null)
                }
              />
            </Field>
          )}
          <Field label="Phone" optional>
            <Input value={draft.phone} onChange={(e) => set('phone', e.target.value)} />
          </Field>
          <Field label="Address" optional className="sm:col-span-2">
            <Textarea value={draft.address} onChange={(e) => set('address', e.target.value)} />
          </Field>
        </div>

        {/* Guardian block */}
        <div className="rounded-2xl border border-hair bg-panel/30 p-4 space-y-4">
          <h3 className="text-[13px] font-medium text-forest">Guardian / legal authority</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Guardian full name" required>
              <Input
                value={draft.guardianName}
                onChange={(e) => set('guardianName', e.target.value)}
              />
            </Field>
            <Field label="Relationship to minor" required>
              <Select
                value={draft.guardianRelationship}
                onChange={(e) => set('guardianRelationship', e.target.value)}
              >
                <option value="">Select…</option>
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Guardian ID" optional hint="e.g. NIN, voter's card, passport">
              <Input value={draft.guardianId} onChange={(e) => set('guardianId', e.target.value)} />
            </Field>
          </div>

          <Checkbox
            checked={draft.consentAuthority}
            onChange={(checked) => set('consentAuthority', checked)}
            label="Consent authority confirmed"
            description="This guardian has legal authority to consent to treatment on behalf of the minor. (Separate from next-of-kin; must be explicitly confirmed.)"
          />

          {draft.consentAuthority && (
            <Field label="Consent notes (optional)">
              <Textarea
                value={draft.consentNotes}
                onChange={(e) => set('consentNotes', e.target.value)}
                placeholder="e.g. court order, foster care documents…"
              />
            </Field>
          )}
        </div>

        {/* Facility */}
        <Field label="Facility" required>
          <Select value={draft.facility} onChange={(e) => set('facility', e.target.value)}>
            {FACILITIES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
        </Field>

        <div className="flex justify-end">
          <Button
            leftIcon={<UserPlus size={14} />}
            onClick={handleSubmit}
            disabled={!ready || submitting}
          >
            {submitting ? 'Registering…' : 'Register minor'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
