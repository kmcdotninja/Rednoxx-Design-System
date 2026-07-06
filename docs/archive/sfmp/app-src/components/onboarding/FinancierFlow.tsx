import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { useAccount } from '@/components/shell/AccountContext'
import { DemoStatePicker, OnboardingStatus } from '@/components/onboarding/OnboardingStatus'
import { Button, Card, Field, FileField, Input, Stepper, KeyValue, useToast, type Step } from '@/components/ui'
import { useStore, newId } from '@/store/AppStore'
import { SECTOR_CATEGORIES } from '@/data/mock'
import type { FinancierProfile } from '@/data/types'
import { cn } from '@/lib/cn'

const STEPS: Step[] = [
  { title: 'Step 1', label: 'Company details' },
  { title: 'Step 2', label: 'Sectors of interest' },
  { title: 'Step 3', label: 'Documents' },
  { title: 'Step 4', label: 'Review & submit' },
]

/** The full financier onboarding experience, rendered inside the AppShell's
 *  full-height drawer so users never leave their current context. */
export function FinancierFlow({ onClose }: { onClose: () => void }) {
  const toast = useToast()
  const { company, verified, onboarding } = useAccount()
  const { submitFinancierOnboarding, financiers } = useStore()
  const profile = financiers.find((f) => f.company === company)

  const [editing, setEditing] = useState(false)
  const [step, setStep] = useState(0)
  const [rc, setRc] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPosition, setContactPosition] = useState('')
  const [sectors, setSectors] = useState<string[]>(['Renewable Energy'])
  const [docsProvided, setDocsProvided] = useState<Record<string, boolean>>({})

  if (verified) {
    return (
      <>
        <Card inset>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint-soft text-mint"><ShieldCheck size={22} /></span>
            <div>
              <p className="text-[15px] font-medium text-navy">{company} is verified</p>
              <p className="mt-1 text-sm text-navy-400">All marketplace features are unlocked. You can update your company profile from Settings.</p>
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
          rejectedNote="Your investment policy document was unreadable — re-upload a current copy."
          documents={profile?.documents ?? []}
          facts={[
            { label: 'Company', value: company },
            { label: 'RC number', value: profile?.rcNumber || '—' },
            { label: 'Primary contact', value: profile?.contactName || '—' },
            { label: 'Position', value: profile?.contactPosition || '—' },
            { label: 'Phone', value: profile?.contactPhone || '—' },
            { label: 'Email', value: profile?.contactEmail || '—' },
            { label: 'Sectors of interest', value: profile?.sectorsOfInterest.join(', ') || '—' },
          ]}
        />
        <DemoStatePicker />
      </>
    )
  }

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))
  const toggleSector = (s: string) => setSectors((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))

  const submit = () => {
    const missing: string[] = []
    if (!rc.trim()) missing.push('RC number')
    if (!contactName.trim()) missing.push('contact name')
    if (contactPhone.replace(/\D/g, '').length !== 11) missing.push('an 11-digit contact phone')
    if (!contactEmail.trim()) missing.push('contact email')
    if (sectors.length === 0) missing.push('at least one sector of interest')
    if (!Object.values(docsProvided).some(Boolean)) missing.push('supporting documents')
    if (missing.length > 0) {
      toast.error('Incomplete submission', `Provide ${missing.join(', ')} before submitting.`)
      return
    }
    const submitted: FinancierProfile = {
      company, rcNumber: rc, contactName, contactPhone, contactEmail, contactPosition,
      sectorsOfInterest: sectors,
      documents: Object.keys(docsProvided).filter((k) => docsProvided[k]).map((k) => ({ id: newId('f'), name: `${k}.pdf`, section: k, sizeKb: 540, at: new Date().toISOString() })),
      onboarding: 'submitted',
    }
    submitFinancierOnboarding(submitted)
    toast.success('Onboarding submitted', 'Your company profile is now under review by the SFMP team.')
    setEditing(false)
  }

  return (
    <>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="h-fit md:sticky md:top-0">
          <Stepper steps={STEPS} current={step} onSelect={setStep} />
        </div>

        <Card inset>
          {step === 0 && (
            <div className="space-y-5">
              <SectionTitle title="Company details" hint="Your institution and primary contact." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company name"><Input value={company} disabled /></Field>
                <Field label="RC number" required><Input value={rc} onChange={(e) => setRc(e.target.value)} placeholder="RC-1234567" /></Field>
                <Field label="Primary contact name" required><Input value={contactName} onChange={(e) => setContactName(e.target.value)} /></Field>
                <Field label="Contact position" required><Input value={contactPosition} onChange={(e) => setContactPosition(e.target.value)} placeholder="Head, Structured Finance" /></Field>
                <Field label="Contact phone" required hint="11 digits"><Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} maxLength={11} placeholder="0803..." /></Field>
                <Field label="Contact email" required><Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /></Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <SectionTitle title="Sectors of interest" hint="Choose the sectors you want to fund." />
              <div className="grid gap-3 sm:grid-cols-2">
                {SECTOR_CATEGORIES.map((s) => {
                  const on = sectors.includes(s)
                  return (
                    <button key={s} type="button" onClick={() => toggleSector(s)} className={cn('flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-colors', on ? 'border-navy bg-navy-50' : 'border-hair bg-white hover:bg-panel')}>
                      <span className="text-sm font-medium text-navy">{s}</span>
                      <span className={cn('flex h-5 w-5 items-center justify-center rounded-md border', on ? 'border-navy bg-navy text-white' : 'border-hair')}>
                        {on && <Check size={13} strokeWidth={3} />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <SectionTitle title="Documents" hint="Upload your registration and policy documents." />
              <div className="grid gap-3">
                {['Certificate of incorporation', 'Investment policy', 'Regulatory license', 'Proof of address'].map((doc) => (
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

          {step === 3 && (
            <div className="space-y-5">
              <SectionTitle title="Review & submit" hint="Confirm your details before submitting for review." />
              <div className="grid gap-4 sm:grid-cols-2">
                <KeyValue label="Company" value={company} />
                <KeyValue label="RC number" value={rc || '—'} />
                <KeyValue label="Contact" value={contactName || '—'} />
                <KeyValue label="Phone" value={contactPhone || '—'} />
                <KeyValue label="Sectors of interest" value={sectors.join(', ') || '—'} />
                <KeyValue label="Documents" value={Object.values(docsProvided).filter(Boolean).length} />
              </div>
              <div className="rounded-2xl bg-navy-50 px-4 py-3 text-[13px] text-navy-500">
                By submitting, your profile is sent to the SFMP team for verification. Funding features unlock once verified.
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
