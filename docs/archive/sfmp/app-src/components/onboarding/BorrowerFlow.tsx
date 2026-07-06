import { useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { useAccount } from '@/components/shell/AccountContext'
import { DemoStatePicker, OnboardingStatus } from '@/components/onboarding/OnboardingStatus'
import { Button, Card, DatePicker, Field, FileField, Input, Select, Stepper, KeyValue, useToast, type Step } from '@/components/ui'
import { useStore, newId } from '@/store/AppStore'
import { NIGERIAN_STATES } from '@/data/mock'
import type { BorrowerProfile, Director, Management, Owner } from '@/data/types'
import { cn } from '@/lib/cn'

const STEPS: Step[] = [
  { title: 'Step 1', label: 'Business details' },
  { title: 'Step 2', label: 'Ownership' },
  { title: 'Step 3', label: 'Directors' },
  { title: 'Step 4', label: 'Management' },
  { title: 'Step 5', label: 'Documents' },
  { title: 'Step 6', label: 'Review & submit' },
]

const emptyOwner = (): Owner => ({ id: newId('o'), name: '', unitsHeld: 0, percentHeld: 0, position: '', bvn: '', boardRep: false })
const emptyDirector = (): Director => ({ id: newId('d'), name: '', dob: '', bvn: '', education: [{ school: '', qualification: '', year: '' }], work: [{ place: '', position: '' }], loanExposure: '', otherInvestments: '' })
const emptyManager = (): Management => ({ id: newId('m'), name: '', education: [{ school: '', qualification: '', year: '' }], work: [{ place: '', position: '' }] })

/** The full borrower onboarding experience, rendered inside the AppShell's
 *  full-height drawer so users never leave their current context. */
export function BorrowerFlow({ onClose }: { onClose: () => void }) {
  const toast = useToast()
  const { company, verified, onboarding } = useAccount()
  const { submitBorrowerOnboarding, borrowers } = useStore()
  const profile = borrowers.find((b) => b.company === company)

  const [editing, setEditing] = useState(false)
  const [step, setStep] = useState(0)
  const [rc, setRc] = useState('')
  const [tin, setTin] = useState('')
  const [address, setAddress] = useState('')
  const [state, setState] = useState(NIGERIAN_STATES[24])
  const [owners, setOwners] = useState<Owner[]>([emptyOwner()])
  const [directors, setDirectors] = useState<Director[]>([emptyDirector()])
  const [managers, setManagers] = useState<Management[]>([emptyManager()])
  const [docsProvided, setDocsProvided] = useState<Record<string, boolean>>({})

  if (verified) {
    return (
      <>
        <Card inset>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-mint"><ShieldCheck size={22} /></span>
            <div>
              <p className="text-[15px] font-medium text-navy">{company} is verified</p>
              <p className="mt-1 text-sm text-navy-400">All marketplace features are unlocked. You can update your corporate profile from Settings.</p>
              <Button className="mt-4" onClick={onClose}>Back to dashboard</Button>
            </div>
          </div>
        </Card>
        <DemoStatePicker />
      </>
    )
  }

  if ((onboarding === 'submitted' || onboarding === 'rejected') && !editing) {
    return (
      <>
        <OnboardingStatus
          status={onboarding}
          onEdit={() => setEditing(true)}
          rejectedNote="The CAC status report could not be matched to your RC number — re-upload a current report."
          documents={profile?.documents ?? []}
          facts={[
            { label: 'Company', value: company },
            { label: 'RC number', value: profile?.rcNumber || '—' },
            { label: 'TIN', value: profile?.tin || '—' },
            { label: 'State', value: profile?.state || '—' },
            { label: 'Shareholders', value: profile?.owners.length ?? 0 },
            { label: 'Directors', value: profile?.directors.length ?? 0 },
            { label: 'Management', value: profile?.management.length ?? 0 },
            { label: 'Registered address', value: profile?.address || '—' },
          ]}
        />
        <DemoStatePicker />
      </>
    )
  }

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))

  const submit = () => {
    const missing: string[] = []
    if (!rc.trim()) missing.push('RC number')
    if (!tin.trim()) missing.push('TIN')
    if (!address.trim()) missing.push('registered address')
    if (!owners.some((o) => o.name.trim())) missing.push('at least one shareholder')
    if (!directors.some((d) => d.name.trim())) missing.push('at least one director')
    if (!managers.some((m) => m.name.trim())) missing.push('at least one management member')
    if (!Object.values(docsProvided).some(Boolean)) missing.push('supporting documents')
    if (missing.length > 0) {
      toast.error('Incomplete submission', `Provide ${missing.join(', ')} before submitting.`)
      return
    }
    const submitted: BorrowerProfile = {
      company, rcNumber: rc, tin, address, state,
      owners: owners.filter((o) => o.name.trim()),
      directors: directors.filter((d) => d.name.trim()),
      management: managers.filter((m) => m.name.trim()),
      documents: Object.keys(docsProvided).filter((k) => docsProvided[k]).map((k) => ({ id: newId('f'), name: `${k}.pdf`, section: k, sizeKb: 640, at: new Date().toISOString() })),
      onboarding: 'submitted',
    }
    submitBorrowerOnboarding(submitted)
    toast.success('Onboarding submitted', 'Your corporate profile is now under review by the SFMP team.')
    setEditing(false)
  }

  return (
    <>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="h-fit md:sticky md:top-0">
          <Stepper steps={STEPS} current={step} onSelect={setStep} />
          {onboarding === 'submitted' && (
            <div className="mt-5 rounded-2xl bg-gold-soft/60 px-3 py-2.5 text-xs font-medium text-gold-600">Previously submitted — under review.</div>
          )}
        </div>

        <Card inset>
          {step === 0 && (
            <div className="space-y-5">
              <SectionTitle title="Business details" hint="Tell us about your company." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company name"><Input value={company} disabled /></Field>
                <Field label="RC number" required><Input value={rc} onChange={(e) => setRc(e.target.value)} placeholder="RC-1234567" /></Field>
                <Field label="Tax Identification Number (TIN)" required><Input value={tin} onChange={(e) => setTin(e.target.value)} placeholder="20481123-0001" /></Field>
                <Field label="State" required>
                  <Select value={state} onChange={(e) => setState(e.target.value)}>
                    {NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                  </Select>
                </Field>
                <Field label="Registered address" required className="sm:col-span-2"><Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city" /></Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <Repeater
              title="Ownership / shareholders"
              hint="Add each shareholder, their holdings and board representation."
              items={owners}
              onAdd={() => setOwners((o) => [...o, emptyOwner()])}
              onRemove={(id) => setOwners((o) => (o.length > 1 ? o.filter((x) => x.id !== id) : o))}
              onChange={(id, changes) => setOwners((o) => o.map((x) => (x.id === id ? { ...x, ...changes } : x)))}
              render={(o, update) => (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name"><Input value={o.name} onChange={(e) => update({ name: e.target.value })} /></Field>
                  <Field label="Position"><Input value={o.position} onChange={(e) => update({ position: e.target.value })} /></Field>
                  <Field label="Units held"><Input type="number" value={o.unitsHeld || ''} onChange={(e) => update({ unitsHeld: Number(e.target.value) })} /></Field>
                  <Field label="% held"><Input type="number" value={o.percentHeld || ''} onChange={(e) => update({ percentHeld: Number(e.target.value) })} /></Field>
                  <Field label="BVN" hint="11 digits"><Input value={o.bvn} onChange={(e) => update({ bvn: e.target.value })} maxLength={11} /></Field>
                  <Field label="Board representation">
                    <Select value={o.boardRep ? 'yes' : 'no'} onChange={(e) => update({ boardRep: e.target.value === 'yes' })}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </Select>
                  </Field>
                </div>
              )}
            />
          )}

          {step === 2 && (
            <Repeater
              title="Directors"
              hint="Personal details, plus education and work history."
              items={directors}
              onAdd={() => setDirectors((d) => [...d, emptyDirector()])}
              onRemove={(id) => setDirectors((d) => (d.length > 1 ? d.filter((x) => x.id !== id) : d))}
              onChange={(id, changes) => setDirectors((d) => d.map((x) => (x.id === id ? { ...x, ...changes } : x)))}
              render={(d, update) => (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name"><Input value={d.name} onChange={(e) => update({ name: e.target.value })} /></Field>
                  <Field label="Date of birth"><DatePicker value={d.dob} onChange={(v) => update({ dob: v })} placeholder="Select date of birth" /></Field>
                  <Field label="BVN"><Input value={d.bvn} onChange={(e) => update({ bvn: e.target.value })} maxLength={11} /></Field>
                  <Field label="Loan exposure"><Input value={d.loanExposure} onChange={(e) => update({ loanExposure: e.target.value })} placeholder="None" /></Field>
                  <Field label="School"><Input value={d.education[0].school} onChange={(e) => update({ education: [{ ...d.education[0], school: e.target.value }] })} /></Field>
                  <Field label="Qualification"><Input value={d.education[0].qualification} onChange={(e) => update({ education: [{ ...d.education[0], qualification: e.target.value }] })} /></Field>
                  <Field label="Year completed"><Input value={d.education[0].year} maxLength={4} onChange={(e) => update({ education: [{ ...d.education[0], year: e.target.value.replace(/\D/g, '') }] })} placeholder="2006" /></Field>
                  <Field label="Employer"><Input value={d.work[0].place} onChange={(e) => update({ work: [{ ...d.work[0], place: e.target.value }] })} /></Field>
                  <Field label="Role"><Input value={d.work[0].position} onChange={(e) => update({ work: [{ ...d.work[0], position: e.target.value }] })} /></Field>
                  <Field label="Other investments"><Input value={d.otherInvestments} onChange={(e) => update({ otherInvestments: e.target.value })} placeholder="None" /></Field>
                </div>
              )}
            />
          )}

          {step === 3 && (
            <Repeater
              title="Management"
              hint="Key management team members."
              items={managers}
              onAdd={() => setManagers((m) => [...m, emptyManager()])}
              onRemove={(id) => setManagers((m) => (m.length > 1 ? m.filter((x) => x.id !== id) : m))}
              onChange={(id, changes) => setManagers((m) => m.map((x) => (x.id === id ? { ...x, ...changes } : x)))}
              render={(m, update) => (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name"><Input value={m.name} onChange={(e) => update({ name: e.target.value })} /></Field>
                  <Field label="Qualification"><Input value={m.education[0].qualification} onChange={(e) => update({ education: [{ ...m.education[0], qualification: e.target.value }] })} /></Field>
                  <Field label="School"><Input value={m.education[0].school} onChange={(e) => update({ education: [{ ...m.education[0], school: e.target.value }] })} /></Field>
                  <Field label="Year completed"><Input value={m.education[0].year} maxLength={4} onChange={(e) => update({ education: [{ ...m.education[0], year: e.target.value.replace(/\D/g, '') }] })} placeholder="2014" /></Field>
                  <Field label="Employer"><Input value={m.work[0].place} onChange={(e) => update({ work: [{ ...m.work[0], place: e.target.value }] })} /></Field>
                  <Field label="Role"><Input value={m.work[0].position} onChange={(e) => update({ work: [{ ...m.work[0], position: e.target.value }] })} /></Field>
                </div>
              )}
            />
          )}

          {step === 4 && (
            <div className="space-y-5">
              <SectionTitle title="Documents" hint="Upload your business analysis and supporting documents." />
              <div className="grid gap-3">
                {['Business analysis', 'Certificate of incorporation', 'Memorandum & Articles', 'Proof of address'].map((doc) => (
                  <button key={doc} type="button" onClick={() => setDocsProvided((d) => ({ ...d, [doc]: !d[doc] }))} className="text-left">
                    <div className={cn('rounded-2xl border px-1 transition-colors', docsProvided[doc] ? 'border-mint bg-mint-soft/40' : 'border-transparent')}>
                      <FileField label={docsProvided[doc] ? `${doc} · uploaded` : doc} />
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-navy-400">Click a field to simulate an upload in this demo.</p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <SectionTitle title="Review & submit" hint="Confirm your details before submitting for review." />
              <div className="grid gap-4 sm:grid-cols-2">
                <KeyValue label="Company" value={company} />
                <KeyValue label="RC number" value={rc || '—'} />
                <KeyValue label="TIN" value={tin || '—'} />
                <KeyValue label="State" value={state} />
                <KeyValue label="Shareholders" value={owners.filter((o) => o.name).length} />
                <KeyValue label="Directors" value={directors.filter((d) => d.name).length} />
                <KeyValue label="Management" value={managers.filter((m) => m.name).length} />
                <KeyValue label="Documents" value={Object.values(docsProvided).filter(Boolean).length} />
              </div>
              <div className="rounded-2xl bg-navy-50 px-4 py-3 text-[13px] text-navy-500">
                By submitting, your profile is sent to the SFMP team for verification. The marketplace unlocks once verified.
              </div>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between border-t border-hair pt-5">
            <Button variant="ghost" onClick={back} disabled={step === 0} leftIcon={<ArrowLeft size={16} />}>Back</Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next} rightIcon={<ArrowRight size={16} />}>Save &amp; continue</Button>
            ) : (
              <Button onClick={submit} leftIcon={<Check size={16} />}>Submit for review</Button>
            )}
          </div>
        </Card>
      </div>
      <DemoStatePicker />
    </>
  )
}

function SectionTitle({ title, hint }: { title: string; hint: string }) {
  return (
    <div>
      <h3 className="text-[15px] font-medium tracking-[-0.01em] text-navy">{title}</h3>
      <p className="mt-1 text-sm text-navy-400">{hint}</p>
    </div>
  )
}

function Repeater<T extends { id: string }>({
  title, hint, items, onAdd, onRemove, onChange, render,
}: {
  title: string
  hint: string
  items: T[]
  onAdd: () => void
  onRemove: (id: string) => void
  onChange: (id: string, changes: Partial<T>) => void
  render: (item: T, update: (changes: Partial<T>) => void) => ReactNode
}) {
  return (
    <div className="space-y-5">
      <SectionTitle title={title} hint={hint} />
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-3xl border border-hair bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[13px] font-medium uppercase tracking-[0.06em] text-navy-400">#{i + 1}</span>
              {items.length > 1 && (
                <button type="button" onClick={() => onRemove(item.id)} className="inline-flex items-center gap-1 text-xs font-medium text-rose-ink hover:underline">
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </div>
            {render(item, (changes) => onChange(item.id, changes))}
          </div>
        ))}
      </div>
      <Button variant="secondary" onClick={onAdd} leftIcon={<Plus size={16} />}>Add more</Button>
    </div>
  )
}
