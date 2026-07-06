import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import {
  Alert,
  Avatar,
  Button,
  CodeInput,
  Field,
  Input,
  PasswordInput,
  Tag,
  Toggle,
  useToast,
} from '@/components/ui'
import { Logo, Mark } from '@/components/Logo'
import { cn } from '@/lib/cn'

const DEMO_PASSWORD = 'rednoxx'
const DEMO_OTP = '424242'

type Step = 'login' | 'verify' | 'workspace'

const STEP_LABEL: Record<Step, string> = {
  login: 'Sign in',
  verify: 'Verify',
  workspace: 'Workspace',
}

function GoogleGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.1 3.7-8.7Z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-6-2.1-6.9-5.1L1.2 17.2C3.2 21.2 7.3 24 12 24Z" />
      <path fill="#FBBC05" d="M5.1 14.3a7.3 7.3 0 0 1 0-4.6L1.2 6.8a12 12 0 0 0 0 10.4l3.9-2.9Z" />
      <path fill="#EA4335" d="M12 4.6c1.8 0 3 .8 3.7 1.4L19 2.8C17 1 14.2 0 12 0 7.3 0 3.2 2.8 1.2 6.8l3.9 2.9c.9-3 3.7-5.1 6.9-5.1Z" />
    </svg>
  )
}

function MicrosoftGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <rect width="11" height="11" fill="#F25022" />
      <rect x="13" width="11" height="11" fill="#7FBA00" />
      <rect y="13" width="11" height="11" fill="#00A4EF" />
      <rect x="13" y="13" width="11" height="11" fill="#FFB900" />
    </svg>
  )
}

const ORGS = [
  { id: 'o1', name: 'Garki General Hospital', role: 'Clinical operations', members: 214 },
  { id: 'o2', name: 'Ikeja Medical Centre', role: 'Clinical operations', members: 342 },
  { id: 'o3', name: 'Rednoxx Head Office', role: 'Administrator', members: 58 },
]

/**
 * The full-page sign-in flow — the Auth template live: login → OTP → workspace,
 * then into the product. Assembled from the same blocks documented under
 * Blocks → Auth.
 */
export function SignInPage() {
  const navigate = useNavigate()
  const { success } = useToast()
  const [step, setStep] = useState<Step>('login')

  // Login state
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [failed, setFailed] = useState(false)

  // OTP state
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // Workspace state
  const [org, setOrg] = useState('o1')

  useEffect(() => {
    document.title = 'Sign in — Rednoxx'
    return () => {
      document.title = 'Rednoxx — Healthcare Platform Design System'
    }
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const submitLogin = () => {
    if (password === DEMO_PASSWORD) {
      setFailed(false)
      setStep('verify')
    } else {
      setFailed(true)
    }
  }

  const submitCode = (value: string) => {
    if (value === DEMO_OTP) {
      setCodeError(false)
      setStep('workspace')
    } else {
      setCodeError(true)
    }
  }

  const enter = () => {
    success('Welcome back, Amina', ORGS.find((o) => o.id === org)?.name)
    navigate('/demo/overview')
  }

  const steps: Step[] = ['login', 'verify', 'workspace']
  const stepIndex = steps.indexOf(step)

  return (
    <div className="grid min-h-screen lg:grid-cols-[5fr_7fr]">
      {/* Brand panel */}
      <div className="hidden flex-col justify-between bg-navy p-10 text-white lg:flex">
        <Logo className="h-6 brightness-0 invert" />
        <div className="py-10">
          <p className="max-w-[26ch] text-[26px] font-medium leading-snug tracking-[-0.01em] text-balance">
            One record. Every facility. The whole care journey.
          </p>
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-white/60">
            Enrolments, consultations, prescriptions, labs and claims — connected across 9
            facilities nationwide.
          </p>
        </div>
        <p className="text-[12px] text-white/40">© 2026 Rednoxx Health Ltd · NDPR compliant</p>
      </div>

      {/* Form column */}
      <div className="flex flex-col items-center justify-center bg-canvas px-5 py-10">
        {/* Step indicator */}
        <div className="mb-5 flex items-center gap-2" aria-label={`Step ${stepIndex + 1} of 3`}>
          {steps.map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              {i > 0 && <span className="h-px w-6 bg-hair" />}
              <span
                className={cn(
                  'text-[11px] font-medium uppercase tracking-[0.08em]',
                  i === stepIndex ? 'text-azure-600' : i < stepIndex ? 'text-forest-400' : 'text-forest-300',
                )}
              >
                {i < stepIndex ? '✓ ' : `${i + 1} · `}
                {STEP_LABEL[s]}
              </span>
            </span>
          ))}
        </div>

        <div key={step} className="w-full max-w-sm animate-pop rounded-4xl border border-hair bg-white p-6 sm:p-7">
          <Mark className="h-7 w-7 lg:hidden" />

          {step === 'login' && (
            <>
              <h1 className="text-[19px] font-medium tracking-[-0.01em] text-forest lg:mt-0">
                Welcome back
              </h1>
              <p className="mt-1 text-[13px] leading-relaxed text-forest-400">
                Sign in to your workspace. The demo password is “{DEMO_PASSWORD}”.
              </p>
              <div className="mt-5 space-y-4">
                {failed && (
                  <Alert tone="danger" title="Email or password is incorrect">
                    Check both and try again — passwords are case-sensitive.
                  </Alert>
                )}
                <Field label="Work email">
                  <Input type="email" defaultValue="amina@rednoxx.health" />
                </Field>
                <Field label="Password">
                  <PasswordInput
                    placeholder="••••••••"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitLogin()}
                  />
                </Field>
                <div className="flex items-center justify-between">
                  <Toggle checked={remember} onChange={setRemember} label="Remember me" />
                  <button type="button" className="text-[13px] font-medium text-azure-600 hover:underline">
                    Forgot password?
                  </button>
                </div>
                <Button block onClick={submitLogin}>
                  Sign in
                </Button>
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-hair" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">or</span>
                  <span className="h-px flex-1 bg-hair" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" size="sm" leftIcon={<GoogleGlyph />} onClick={() => setStep('workspace')}>
                    Google
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<MicrosoftGlyph />} onClick={() => setStep('workspace')}>
                    Microsoft
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === 'verify' && (
            <>
              <h1 className="text-[19px] font-medium tracking-[-0.01em] text-forest">
                Enter the 6-digit code
              </h1>
              <p className="mt-1 text-[13px] leading-relaxed text-forest-400">
                Sent by SMS to +234 ••• ••• 4410. The demo code is {DEMO_OTP}.
              </p>
              <div className="mt-5 space-y-4">
                <CodeInput
                  value={code}
                  onChange={(next) => {
                    setCode(next)
                    if (codeError) setCodeError(false)
                  }}
                  onComplete={submitCode}
                  error={codeError}
                />
                {codeError && (
                  <p className="text-[13px] font-medium text-rose-ink" role="alert">
                    That code isn’t right — check the latest SMS.
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    disabled={cooldown > 0}
                    onClick={() => setCooldown(30)}
                    className="text-[13px] font-medium text-azure-600 hover:underline disabled:cursor-default disabled:text-forest-300 disabled:no-underline"
                  >
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                  </button>
                  <Tag>Expires in 10:00</Tag>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('login')
                    setCode('')
                    setCodeError(false)
                  }}
                  className="group flex items-center gap-1.5 text-[13px] text-forest-400 transition-colors hover:text-forest"
                >
                  <ArrowLeft size={13} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
                  Use a different account
                </button>
              </div>
            </>
          )}

          {step === 'workspace' && (
            <>
              <h1 className="text-[19px] font-medium tracking-[-0.01em] text-forest">
                Choose a workspace
              </h1>
              <p className="mt-1 text-[13px] leading-relaxed text-forest-400">
                You belong to three organizations.
              </p>
              <div role="radiogroup" aria-label="Organization" className="mt-5 space-y-2">
                {ORGS.map((o) => {
                  const active = org === o.id
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setOrg(o.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-3xl border p-3 text-left transition-[border-color,background-color]',
                        active ? 'border-azure bg-azure-50/60' : 'border-hair hover:border-forest-200',
                      )}
                    >
                      <Avatar name={o.name} size="sm" ring={false} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-forest">{o.name}</span>
                        <span className="tnum block text-[12px] text-forest-400">
                          {o.role} · {o.members} members
                        </span>
                      </span>
                      {active && <Check size={16} className="shrink-0 text-azure" />}
                    </button>
                  )
                })}
              </div>
              <Button block className="mt-4" onClick={enter}>
                Continue
              </Button>
            </>
          )}
        </div>

        <p className="mt-5 text-[12px] text-forest-300">
          Need an account?{' '}
          <span className="cursor-pointer font-medium text-azure-600 hover:underline">
            Ask your facility administrator
          </span>
        </p>
      </div>

      {/* Escape hatch back to the docs */}
      <Link
        to="/"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-hair bg-white py-2 pl-2.5 pr-3.5 shadow-pop transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.96]"
      >
        <Mark className="h-[18px] w-[18px]" />
        <span className="text-[13px] font-medium text-forest">Design system</span>
      </Link>
    </div>
  )
}
