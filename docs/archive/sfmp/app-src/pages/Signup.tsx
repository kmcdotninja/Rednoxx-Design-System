import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, MailCheck } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { CodeInput } from '@/components/auth/CodeInput'
import { Logo } from '@/components/Logo'
import { Button, Field, Input, Segmented, useToast } from '@/components/ui'
import { DOMAIN_META } from '@/data/nav'
import { useStore } from '@/store/AppStore'
import type { Domain } from '@/data/types'

type SignupDomain = Extract<Domain, 'borrower' | 'financier'>
const SIGNUP_DOMAINS: { value: SignupDomain; label: string }[] = [
  { value: 'borrower', label: 'Borrower' },
  { value: 'financier', label: 'Financier' },
]

type Step = 'details' | 'otp' | 'password'

export function Signup() {
  const navigate = useNavigate()
  const toast = useToast()
  const { createAccount } = useStore()

  const [step, setStep] = useState<Step>('details')
  const [domain, setDomain] = useState<SignupDomain>('borrower')
  const [company, setCompany] = useState('')
  const [tin, setTin] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [showPw, setShowPw] = useState(false)

  const finish = () => {
    createAccount({ domain, subRole: 'root', company: company.trim(), tin: tin.trim(), contactName: name.trim(), email: email.trim() })
    toast.success('Account created', `${company.trim()} is ready — complete onboarding to unlock the marketplace.`)
    navigate(DOMAIN_META[domain].base)
  }

  return (
    <AuthLayout>
      <Logo className="mb-8 h-7 text-navy" />

      {step === 'details' && (
        <>
          <h1 className="text-[22px] font-medium tracking-[-0.01em] text-navy">Create your account</h1>
          <p className="mt-1 text-[15px] text-navy-400">Register your institution on SFMP</p>
          <form className="mt-7 space-y-4" onSubmit={(e) => { e.preventDefault(); setStep('otp') }}>
            <Field label="I am registering as">
              <Segmented<SignupDomain> block options={SIGNUP_DOMAINS} value={domain} onChange={setDomain} />
            </Field>
            <Field label="Company name">
              <Input required autoFocus placeholder="Acme Renewables Ltd" value={company} onChange={(e) => setCompany(e.target.value)} />
            </Field>
            <Field label="Tax Identification Number (TIN)" hint="Format: 8–10 digits, a dash, then 4 digits (e.g. 20481123-0001).">
              <Input required placeholder="20481123-0001" value={tin} onChange={(e) => setTin(e.target.value)} />
            </Field>
            <Field label="Full name">
              <Input required placeholder="Amara Okonkwo" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Work email">
              <Input type="email" required placeholder="me@company.ng" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Button type="submit" block className="mt-2" rightIcon={<ArrowRight size={16} />}>Continue</Button>
          </form>
        </>
      )}

      {step === 'otp' && (
        <>
          <h1 className="text-[22px] font-medium tracking-[-0.01em] text-navy">Verify your email</h1>
          <p className="mt-1 text-[15px] text-navy-400">We sent a 6-digit code to <span className="font-medium text-navy">{email || 'your email'}</span>.</p>
          <form className="mt-7" onSubmit={(e) => { e.preventDefault(); setStep('password') }}>
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-hair bg-panel/60 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy text-azure"><MailCheck size={18} /></span>
              <p className="text-[13px] leading-relaxed text-navy-500">Enter the verification code to confirm your email address.</p>
            </div>
            <Field label="Verification code">
              <CodeInput value={otp} onChange={setOtp} />
            </Field>
            <Button type="submit" block className="mt-5" disabled={otp.length < 6}>Verify email</Button>
            <button type="button" onClick={() => setStep('details')} className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-navy-400 hover:text-navy-600">
              <ArrowLeft size={14} /> Change details
            </button>
          </form>
        </>
      )}

      {step === 'password' && (
        <>
          <h1 className="text-[22px] font-medium tracking-[-0.01em] text-navy">Set your password</h1>
          <p className="mt-1 text-[15px] text-navy-400">Choose a strong password to secure your account.</p>
          <form className="mt-7 space-y-4" onSubmit={(e) => { e.preventDefault(); finish() }}>
            <Field label="Password" hint="8–32 characters with upper, lower, a digit and a symbol.">
              <div className="relative">
                <Input type={showPw ? 'text' : 'password'} required autoFocus placeholder="Create a password" className="pr-11" />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 transition-colors hover:text-navy-500">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>
            <Field label="Confirm password">
              <Input type="password" required placeholder="Re-enter your password" />
            </Field>
            <Button type="submit" block className="mt-2">Create account</Button>
          </form>
        </>
      )}

      <p className="mt-6 text-[13px] leading-relaxed text-navy-300">
        By creating an account, you accept our{' '}
        <a href="#" className="font-medium text-navy-400 underline underline-offset-2">Terms of Use</a> and{' '}
        <a href="#" className="font-medium text-navy-400 underline underline-offset-2">Privacy Policy</a>.
      </p>
      <p className="mt-5 text-sm text-navy-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-navy hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
