import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { CodeInput } from '@/components/auth/CodeInput'
import { Logo } from '@/components/Logo'
import { Button, Field, Input, useToast } from '@/components/ui'
import { startSession } from '@/lib/session'

type Step = 'email' | 'password' | '2fa'

export function Login() {
  const navigate = useNavigate()
  const toast = useToast()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)

  // Relaxed demo credentials — any real input signs in. Failure paths exist
  // only behind deliberate sentinels so the QA stories stay demonstrable:
  // email local-part "unknown", the literal password "wrong" (5 tries then
  // lockout), and OneToken PIN 000000.
  const locked = attempts >= 5

  const submitEmail = () => {
    if (email.split('@')[0].toLowerCase() === 'unknown') {
      setError('User does not exist')
      return
    }
    setError(null)
    setStep('password')
  }

  const submitPassword = () => {
    if (locked) return
    if (password === 'wrong') {
      const n = attempts + 1
      setAttempts(n)
      setError(n >= 5 ? 'Too many failed attempts — your profile has been locked. Contact your administrator to restore access.' : 'Invalid credentials')
      return
    }
    setError(null)
    setStep('2fa')
  }

  const finish = () => {
    if (token === '000000') {
      setError('Invalid OneToken PIN. Check your token app and try again.')
      return
    }
    startSession()
    toast.success('Welcome back', 'Signed in to your SFMP account.')
    navigate('/borrower')
  }

  return (
    <AuthLayout>
      <Logo className="mb-8 h-7 text-navy" />

      <h1 className="text-[22px] font-medium tracking-[-0.01em] text-navy">Sustainable Finance Marketplace</h1>
      <p className="mt-1 text-[15px] text-navy-400">Sign in to your SFMP account</p>

      {step === 'email' && (
        <form className="mt-7" onSubmit={(e) => { e.preventDefault(); submitEmail() }}>
          <Field label="Work email">
            <Input type="email" autoFocus required placeholder="me@company.ng" value={email} onChange={(e) => { setEmail(e.target.value); setError(null) }} />
          </Field>
          {error && <p className="mt-2 text-[13px] font-medium text-rose-ink">{error}</p>}
          <Button type="submit" block className="mt-4" rightIcon={<ArrowRight size={16} />}>Continue</Button>
        </form>
      )}

      {step === 'password' && (
        <form className="mt-7" onSubmit={(e) => { e.preventDefault(); submitPassword() }}>
          <button type="button" onClick={() => { setStep('email'); setError(null) }} className="mb-4 inline-flex items-center gap-2 rounded-xl bg-panel px-3 py-1.5 text-[13px] font-medium text-navy-500 transition-colors hover:bg-hair">
            <ArrowLeft size={14} />
            {email || 'me@company.ng'}
          </button>
          <Field label="Password">
            <div className="relative">
              <Input type={showPw ? 'text' : 'password'} autoFocus required placeholder="Enter your password" className="pr-11" value={password} onChange={(e) => setPassword(e.target.value)} disabled={locked} />
              <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 transition-colors hover:text-navy-500">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </Field>
          {error && <p className="mt-2 text-[13px] font-medium text-rose-ink">{error}</p>}
          <div className="mt-2 text-right">
            <a className="text-[13px] font-medium text-mint hover:underline" href="#">Forgot password?</a>
          </div>
          <Button type="submit" block className="mt-4" disabled={locked} rightIcon={<ArrowRight size={16} />}>Continue</Button>
        </form>
      )}

      {step === '2fa' && (
        <form className="mt-7" onSubmit={(e) => { e.preventDefault(); finish() }}>
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-hair bg-panel/60 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy text-azure">
              <ShieldCheck size={18} />
            </span>
            <p className="text-[13px] leading-relaxed text-navy-500">
              Enter the 6-digit <span className="font-medium text-navy">Sterling OneToken</span> PIN from your token app to complete sign-in.
            </p>
          </div>
          <Field label="OneToken PIN">
            <CodeInput value={token} onChange={(v) => { setToken(v); setError(null) }} />
          </Field>
          {error && <p className="mt-2 text-[13px] font-medium text-rose-ink">{error}</p>}
          <Button type="submit" block className="mt-5" disabled={token.length < 6}>Verify &amp; sign in</Button>
          <p className="mt-3 text-center text-[13px] text-navy-400">
            Didn’t get a code? <button type="button" className="font-medium text-mint hover:underline">Resend</button>
          </p>
        </form>
      )}

      <p className="mt-7 text-[13px] leading-relaxed text-navy-300">
        By signing in, you accept our{' '}
        <a href="#" className="font-medium text-navy-400 underline underline-offset-2">Terms of Use</a> and confirm you’ve read our{' '}
        <a href="#" className="font-medium text-navy-400 underline underline-offset-2">Privacy Policy</a>.
      </p>

      <p className="mt-6 text-sm text-navy-400">
        New to SFMP?{' '}
        <Link to="/signup" className="font-medium text-navy hover:underline">Create an account</Link>
      </p>
    </AuthLayout>
  )
}
