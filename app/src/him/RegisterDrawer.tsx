import { useEffect, useState } from 'react'
import { Check, Printer, UserPlus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import {
  Alert,
  Button,
  Checkbox,
  DatePicker,
  Field,
  Input,
  KeyValue,
  Drawer,
  SelectMenu,
  Stepper,
  Tag,
  Textarea,
  useToast,
  type Step,
} from '@/components/ui'
import { HIM_PATIENTS, patientDisplayName } from './data'
import { RegistrationSlipModal } from './RegistrationSlip'
import { RecordStatusPill } from './shared'

const STEPS: Step[] = [
  { title: 'Identity', label: 'Name, DOB, sex, identifiers' },
  { title: 'Contact', label: 'Address, phone, email' },
  { title: 'Next of kin', label: 'Related persons & authority' },
  { title: 'Coverage', label: 'Category & payer' },
  { title: 'Consent', label: 'Treatment & disclosure' },
]

const DOB_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** ISO yyyy-mm-dd → "d MMM yyyy" for display, matching the register's dates. */
function dobDisplay(iso: string): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  return `${String(d).padStart(2, '0')} ${DOB_MONTHS[m - 1]} ${y}`
}

const SCENARIOS = [
  'standard',
  'walk-in',
  'appointment-linked',
  'emergency',
  'unknown',
  'mass-casualty',
  'neonate',
  'minor',
  'foreign',
  'deceased-on-arrival',
] as const

type Phase = 'form' | 'duplicate-review' | 'saved'

/** Scenarios that trade full capture for speed and reconcile later (W-HIM-009/010/011). */
const RAPID_SCENARIOS = ['emergency', 'unknown', 'mass-casualty'] as const
type RapidScenario = (typeof RAPID_SCENARIOS)[number]

function isRapid(s: string): s is RapidScenario {
  return (RAPID_SCENARIOS as readonly string[]).includes(s)
}

/**
 * Registration wizard in a 2xl drawer (W-HIM-001), launched from the patient
 * index after a search. Saving runs the duplicate check — a BLOCKING review
 * step (clinical-safety §1); overriding it requires a reason and is audited.
 */
export function RegisterPatientDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { success } = useToast()
  const [scenario, setScenario] = useState<(typeof SCENARIOS)[number]>('standard')
  const [step, setStep] = useState(0)
  const [phase, setPhase] = useState<Phase>('form')
  const [overrideReason, setOverrideReason] = useState('')

  const [familyName, setFamilyName] = useState('Bakare')
  const [givenNames, setGivenNames] = useState('Tunde')
  // ISO yyyy-mm-dd (the DatePicker's value); shown as "d MMM yyyy" via dobDisplay.
  const [dob, setDob] = useState('1985-08-02')
  const [sex, setSex] = useState('Male')
  const [nin, setNin] = useState('')
  const [phone, setPhone] = useState('+234 805 118 9034')
  const [address, setAddress] = useState('4 Allen Ave, Ikeja')
  const [stateVal, setStateVal] = useState('Lagos')
  const [lga, setLga] = useState('Ikeja')
  const [nokName, setNokName] = useState('Sade Bakare')
  const [nokRelation, setNokRelation] = useState('Wife')
  const [nokPhone, setNokPhone] = useState('+234 805 118 9035')
  const [category, setCategory] = useState('NHIA')
  const [insuranceNo, setInsuranceNo] = useState('NHIA-220-4471')
  const [treatmentConsent, setTreatmentConsent] = useState(true)
  const [disclosureConsent, setDisclosureConsent] = useState(false)
  const [altIdType, setAltIdType] = useState('')
  const [altIdValue, setAltIdValue] = useState('')
  const [ninReason, setNinReason] = useState('')
  const [nationality, setNationality] = useState('')
  const [localContact, setLocalContact] = useState('')
  const [guardianEvidence, setGuardianEvidence] = useState(false)
  const [routed, setRouted] = useState(false)
  const [routeTarget, setRouteTarget] = useState('Clinic queue')
  const [slipOpen, setSlipOpen] = useState(false)

  // Rapid path (W-HIM-009/010/011): minimum identity only.
  const rapid = isRapid(scenario)
  const [rapidLabel, setRapidLabel] = useState('')
  const [rapidSex, setRapidSex] = useState('Male')
  const [rapidAge, setRapidAge] = useState('')
  const [rapidArrival, setRapidArrival] = useState('Brought in by ambulance')
  const [rapidTriage, setRapidTriage] = useState('Red — resus')
  const [rapidCount, setRapidCount] = useState('1')
  const tempId = scenario === 'mass-casualty' ? 'TEMP-0102…0102+n' : 'TEMP-0102'

  // Fresh wizard every time the modal opens.
  useEffect(() => {
    if (open) {
      setStep(0)
      setPhase('form')
      setOverrideReason('')
      setRouted(false)
    }
  }, [open])

  // The demo's duplicate engine: the prefilled entry collides with Tunde Bakare.
  const candidate = HIM_PATIENTS.find(
    (p) => p.familyName.toLowerCase() === familyName.trim().toLowerCase() && p.recordStatus !== 'merged',
  )

  const save = () => {
    if (candidate) setPhase('duplicate-review')
    else finish()
  }

  const finish = () => {
    setPhase('saved')
    success('Patient record created', 'MRN GGH-005104 assigned — registration slip ready to print.')
  }

  const saveRapid = () => {
    setPhase('saved')
    success(
      scenario === 'mass-casualty' ? 'Casualty batch registered' : 'Temporary record created',
      `${tempId} issued — on the reconciliation worklist until identity is confirmed. Care is never delayed for identity checks.`,
    )
  }

  const footer =
    phase === 'form' && rapid ? (
      <div className="flex w-full items-center justify-end">
        <Button
          leftIcon={<UserPlus size={14} />}
          disabled={scenario !== 'unknown' && rapidLabel.trim() === ''}
          onClick={saveRapid}
        >
          {scenario === 'mass-casualty' ? 'Issue batch temporary IDs' : 'Issue temporary ID & route to care'}
        </Button>
      </div>
    ) : phase === 'form' ? (
      <div className="flex w-full items-center justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
        ) : (
          <Button
            leftIcon={<UserPlus size={14} />}
            disabled={!treatmentConsent || (scenario === 'minor' && !guardianEvidence)}
            onClick={save}
          >
            Save & run duplicate check
          </Button>
        )}
      </div>
    ) : phase === 'duplicate-review' && candidate ? (
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" onClick={() => setPhase('form')}>
          Back to form
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              onClose()
              navigate({ to: '/him-demo/patients/$id', params: { id: candidate.id } })
            }}
          >
            Use existing record
          </Button>
          <Button variant="secondary" disabled={overrideReason.trim() === ''} onClick={finish}>
            Create new anyway
          </Button>
        </div>
      </div>
    ) : (
      <div className="flex w-full items-center justify-end gap-2">
        <Button variant="secondary" leftIcon={<Printer size={14} />} onClick={() => setSlipOpen(true)}>
          Print registration slip
        </Button>
        <Button onClick={onClose}>Done</Button>
      </div>
    )

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="2xl"
      title={
        phase === 'duplicate-review'
          ? 'Possible duplicate found'
          : phase === 'saved'
            ? 'Registration complete'
            : 'Register patient'
      }
      subtitle={
        phase === 'duplicate-review'
          ? 'Review is required before this registration can be saved'
          : phase === 'saved'
            ? undefined
            : 'Search ran first on the patient index — registration is the second step'
      }
      footer={footer}
    >
      {phase === 'form' && rapid && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-forest-400">
              Rapid path — minimum identity, reconcile later
            </p>
            <label className="flex items-center gap-2 text-[13px] text-forest-400">
              Scenario
              <SelectMenu
                size="sm"
                className="w-44 capitalize"
                value={scenario}
                onChange={setScenario}
                options={SCENARIOS.map((s) => ({ value: s, label: s }))}
              />
            </label>
          </div>

          {scenario === 'emergency' && (
            <Alert tone="warning" title="Emergency registration path">
              Only minimum identity is required — a temporary emergency ID is issued and the record
              joins the reconciliation worklist. Identity checks never delay urgent care.
            </Alert>
          )}
          {scenario === 'unknown' && (
            <Alert tone="warning" title="Unknown / unconscious patient">
              A safe unknown-patient record is created with placeholder naming, sex and estimated
              age. Identification later resolves through the reconciliation worklist — never by
              overwriting another patient’s record.
            </Alert>
          )}
          {scenario === 'mass-casualty' && (
            <Alert tone="danger" title="Mass casualty rapid registration">
              Sequential temporary IDs and wristband labels are issued in batch under a casualty
              event tag, with triage category preserved per person. MRN collisions are prevented
              throughout.
            </Alert>
          )}

          <div className="grid gap-4">
            <Field
              label={scenario === 'unknown' ? 'Placeholder label' : 'Approximate name / label'}
              required={scenario !== 'unknown'}
              hint={scenario === 'unknown' ? 'Auto-generated when left blank (e.g. “A&E Male 0102”).' : undefined}
            >
              <Input
                value={rapidLabel}
                onChange={(e) => setRapidLabel(e.target.value)}
                placeholder={scenario === 'unknown' ? 'A&E Male 0102' : 'e.g. Musa (surname unknown)'}
              />
            </Field>
            <Field label="Sex" required>
              <SelectMenu
                value={rapidSex}
                onChange={setRapidSex}
                options={['Female', 'Male'].map((v) => ({ value: v, label: v }))}
              />
            </Field>
            <Field label="Estimated age" hint="Years — rough banding is fine.">
              <Input value={rapidAge} onChange={(e) => setRapidAge(e.target.value)} inputMode="numeric" placeholder="~35" />
            </Field>
            <Field label="Arrival mode & time">
              <Input value={rapidArrival} onChange={(e) => setRapidArrival(e.target.value)} />
            </Field>
            <Field label="Triage category" required>
              <SelectMenu
                value={rapidTriage}
                onChange={setRapidTriage}
                options={['Red — resus', 'Orange — very urgent', 'Yellow — urgent', 'Green — standard'].map(
                  (v) => ({ value: v, label: v }),
                )}
              />
            </Field>
            {scenario === 'mass-casualty' && (
              <Field label="Casualties in this batch" required hint="Sequential temporary IDs and wristbands are issued per person.">
                <Input value={rapidCount} onChange={(e) => setRapidCount(e.target.value)} inputMode="numeric" />
              </Field>
            )}
          </div>

          <div className="rounded-2xl bg-panel px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
              Temporary ID to issue
            </p>
            <p className="tnum mt-0.5 font-mono text-[18px] font-medium text-forest">{tempId}</p>
          </div>
        </div>
      )}

      {phase === 'form' && !rapid && (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <div className="h-fit rounded-3xl border border-hair p-4">
            <Stepper steps={STEPS} current={step} onSelect={setStep} />
          </div>

          <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-forest-400">
              Step <span className="tnum font-medium text-forest">{step + 1}</span> of{' '}
              <span className="tnum">{STEPS.length}</span> — {STEPS[step].title}
            </p>
            <label className="flex items-center gap-2 text-[13px] text-forest-400">
              Scenario
              <SelectMenu
                size="sm"
                className="w-44 capitalize"
                value={scenario}
                onChange={setScenario}
                options={SCENARIOS.map((s) => ({ value: s, label: s }))}
              />
            </label>
          </div>


          {step === 0 && (
            <div className="grid gap-4">
              <Field label="Family name" required>
                <Input value={familyName} onChange={(e) => setFamilyName(e.target.value)} autoComplete="family-name" />
              </Field>
              <Field label="Given names" required>
                <Input value={givenNames} onChange={(e) => setGivenNames(e.target.value)} autoComplete="given-name" />
              </Field>
              <Field label="Date of birth" required hint="Estimated age is accepted when DOB is unknown (rapid paths).">
                <DatePicker value={dob} onChange={setDob} placeholder="Pick date of birth" />
              </Field>
              <Field label="Sex" required>
                <SelectMenu
                  value={sex}
                  onChange={setSex}
                  options={['Female', 'Male'].map((v) => ({ value: v, label: v }))}
                />
              </Field>
              <Field
                label={
                  <span className="flex items-center gap-2">
                    NIN <Tag>Optional</Tag>
                  </span>
                }
                hint="11 digits. NIN never blocks registration — record a reason when unavailable."
               
              >
                <Input value={nin} onChange={(e) => setNin(e.target.value)} inputMode="numeric" placeholder="e.g. 12345678901" />
              </Field>
              {nin.trim() === '' && (
                <Field
                  label="Reason NIN unavailable"
                  optional
                  hint="Recorded on the identifier so completion reports can follow up (W-HIM-003)."
                 
                >
                  <SelectMenu
                    value={ninReason}
                    onChange={setNinReason}
                    options={[
                      { value: '', label: 'Not recorded' },
                      { value: 'Not yet enrolled with NIMC', label: 'Not yet enrolled with NIMC' },
                      { value: 'Enrolled — number not presented', label: 'Enrolled — number not presented' },
                      { value: 'Declined to provide', label: 'Declined to provide' },
                    ]}
                  />
                </Field>
              )}
              {/* Foreign patient (W-HIM-005): nationality + local contact. */}
              {scenario === 'foreign' && (
                <>
                  <Field label="Nationality" required hint="Passport captured as the alternative ID above.">
                    <Input value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="e.g. Ghanaian" />
                  </Field>
                  <Field label="Local contact while in Nigeria" required>
                    <Input value={localContact} onChange={(e) => setLocalContact(e.target.value)} placeholder="Hotel / host address & phone" />
                  </Field>
                </>
              )}
              {/* Alternative ID capture (W-HIM-004) — identifier stored with its namespace. */}
              <Field
                label={
                  <span className="flex items-center gap-2">
                    Alternative ID <Tag>Optional</Tag>
                  </span>
                }
              >
                <SelectMenu
                  value={altIdType}
                  onChange={setAltIdType}
                  options={[
                    { value: '', label: 'No alternative ID' },
                    ...['Passport', 'Driver licence', 'Voter card', 'Birth certificate', 'Staff ID', 'Insurance card'].map(
                      (v) => ({ value: v, label: v }),
                    ),
                  ]}
                />
              </Field>
              <Field label="Alternative ID number" hint="Searchable for matching, like every identifier.">
                <Input
                  value={altIdValue}
                  onChange={(e) => setAltIdValue(e.target.value)}
                  disabled={altIdType === ''}
                  placeholder={altIdType ? `${altIdType} number` : 'Select a type first'}
                />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4">
              <Field label="Phone" required hint="Nigerian format — phone is contact, not proof of identity.">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
              </Field>
              <Field label="Email" optional>
                <Input type="email" placeholder="name@example.com" />
              </Field>
              <Field label="Address line" required>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </Field>
              <Field label="State" required>
                <Input value={stateVal} onChange={(e) => setStateVal(e.target.value)} />
              </Field>
              <Field label="LGA" required>
                <Input value={lga} onChange={(e) => setLga(e.target.value)} />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-4">
              <Field label="Next of kin — name" required>
                <Input value={nokName} onChange={(e) => setNokName(e.target.value)} />
              </Field>
              <Field label="Relationship" required>
                <Input value={nokRelation} onChange={(e) => setNokRelation(e.target.value)} />
              </Field>
              <Field label="Next of kin — phone" required>
                <Input value={nokPhone} onChange={(e) => setNokPhone(e.target.value)} inputMode="tel" />
              </Field>
              <div>
                <Alert tone="info" title="Next of kin is not consent authority">
                  Legal authority to consent on the patient’s behalf is recorded separately, with
                  evidence — guardianship, court order or documented representative status.
                </Alert>
              </div>
              {/* Minor (W-HIM-013): guardian evidence is required before save. */}
              {scenario === 'minor' && (
                <div>
                  <Checkbox
                    checked={guardianEvidence}
                    onChange={setGuardianEvidence}
                    label="Guardian authority evidence sighted"
                    description="Required for minors — guardianship or documented representative status; linked to the consent record."
                  />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4">
              <Field label="Patient category" required>
                <SelectMenu
                  value={category}
                  onChange={setCategory}
                  options={['cash', 'NHIA', 'HMO', 'corporate', 'staff', 'welfare'].map((v) => ({ value: v, label: v }))}
                />
              </Field>
              <Field label="Insurance number" optional hint="Coverage is stored separately from identity.">
                <Input value={insuranceNo} onChange={(e) => setInsuranceNo(e.target.value)} />
              </Field>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Checkbox
                checked={treatmentConsent}
                onChange={setTreatmentConsent}
                label="Treatment consent captured"
                description="Consent to care at this facility, recorded with source and timestamp."
              />
              <Checkbox
                checked={disclosureConsent}
                onChange={setDisclosureConsent}
                label="Disclosure consent captured"
                description="Separate from treatment — covers releases to payers and third parties."
              />
            </div>
          )}
          </div>
        </div>
      )}

      {phase === 'duplicate-review' && candidate && (
        <div className="space-y-4">
          <Alert tone="warning" title="This entry matches an existing record">
            Matched on family name, DOB, sex and phone. Creating a duplicate splits the patient’s
            history across two records — compare carefully before proceeding.
          </Alert>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-hair p-4">
              <p className="text-[13px] font-medium text-forest">Your entry — not yet saved</p>
              <div className="mt-3 space-y-2.5">
                <KeyValue label="Name" value={`${givenNames} ${familyName}`} />
                <KeyValue label="DOB" value={dobDisplay(dob)} />
                <KeyValue label="Sex" value={sex} />
                <KeyValue label="Phone" value={phone} />
              </div>
            </div>
            <div className="rounded-3xl border border-hair p-4">
              <p className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-forest">
                Existing record <RecordStatusPill status={candidate.recordStatus} />
              </p>
              <div className="mt-3 space-y-2.5">
                <KeyValue label="Name" value={patientDisplayName(candidate)} />
                <KeyValue label="MRN" value={<span className="tnum font-mono">{candidate.mrn}</span>} />
                <KeyValue label="DOB" value={candidate.dob ?? '—'} />
                <KeyValue label="Phone" value={candidate.phone ?? '—'} />
              </div>
            </div>
          </div>

          <Field
            label="Reason to create anyway"
            required
            hint="Required to override a duplicate warning — the decision and reason are audited."
          >
            <Textarea
              rows={2}
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="Patient confirmed the existing card belongs to his brother…"
            />
          </Field>
        </div>
      )}

      {phase === 'saved' && (
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-soft text-teal">
            <Check size={18} />
          </span>
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="text-[15px] font-medium text-forest">
                {rapid ? rapidLabel || 'Unknown patient' : `${givenNames} ${familyName}`}
              </p>
              <p className="mt-1 text-[13px] text-forest-400">
                {rapid
                  ? `Temporary ${scenario} record · on the reconciliation worklist`
                  : `New permanent patient record · ${scenario} registration`}
              </p>
            </div>
            <div className="rounded-2xl bg-panel px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
                {rapid ? 'Temporary emergency ID' : 'Medical record number'}
              </p>
              <p className="tnum mt-0.5 font-mono text-[22px] font-medium text-forest">
                {rapid ? tempId : 'GGH-005104'}
              </p>
            </div>
            {/* Walk-in (W-HIM-008): registration and routing are one step. */}
            {scenario === 'walk-in' && !rapid && (
              <div className="flex flex-wrap items-end gap-2">
                <Field label="Route to" className="min-w-56 flex-1">
                  <SelectMenu
                    side="top"
                    value={routeTarget}
                    onChange={setRouteTarget}
                    disabled={routed}
                    options={['Clinic queue', 'Triage', 'Billing first (payer prerequisite)', 'Laboratory'].map(
                      (v) => ({ value: v, label: v }),
                    )}
                  />
                </Field>
                <Button
                  variant="secondary"
                  disabled={routed}
                  onClick={() => {
                    setRouted(true)
                    success('Routed', `Walk-in placed in ${routeTarget.toLowerCase()} — ticket Q-W104 issued; encounter created.`)
                  }}
                >
                  {routed ? 'Routed ✓' : 'Route now'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      <RegistrationSlipModal
        open={slipOpen}
        onClose={() => setSlipOpen(false)}
        slip={
          rapid
            ? {
                name: rapidLabel || 'Unknown patient',
                id: scenario === 'mass-casualty' ? 'TEMP-0102' : tempId,
                idLabel: 'Temporary emergency ID',
                detail: `${rapidSex} · est. ${rapidAge || '—'}y · ${rapidTriage}`,
                scenario,
              }
            : {
                name: `${givenNames} ${familyName}`,
                id: 'GGH-005104',
                idLabel: 'Medical record number',
                detail: `${sex} · DOB ${dobDisplay(dob)}`,
                category,
                scenario,
              }
        }
      />
    </Drawer>
  )
}
