import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Building2,
  Check,
  CircleCheck,
  Copy,
  Fingerprint,
  KeyRound,
  Lock,
  MailCheck,
  MessageSquareText,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  TimerReset,
  Wrench,
} from 'lucide-react'
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CodeInput,
  Field,
  Input,
  Modal,
  PasswordInput,
  Tag,
  Toggle,
  useToast,
} from '@/components/ui'
import { Logo, Mark } from '@/components/Logo'
import { cn } from '@/lib/cn'
import type { ComponentDoc } from '../types'

/* ------------------------------ shared bits ------------------------------ */

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

/** The form column of every auth screen — logo, title, body. */
function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card pad={false} className="w-full max-w-sm p-6 sm:p-7">
      <Mark className="h-7 w-7" />
      <h3 className="mt-4 text-[19px] font-medium tracking-[-0.01em] text-forest">{title}</h3>
      {subtitle && <p className="mt-1 text-[13px] leading-relaxed text-forest-400">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </Card>
  )
}

/* ------------------------------- examples -------------------------------- */

function SplitLayoutExample() {
  return (
    <div className="grid w-full overflow-hidden rounded-4xl border border-hair shadow-card lg:grid-cols-[5fr_7fr]">
      <div className="flex flex-col justify-between bg-navy p-7 text-white">
        <Logo className="h-6 brightness-0 invert" />
        <div className="py-10">
          <p className="max-w-[26ch] text-[19px] font-medium leading-snug tracking-[-0.01em] text-balance">
            One record. Every facility. The whole care journey.
          </p>
          <p className="mt-3 max-w-[38ch] text-[13px] leading-relaxed text-white/60">
            Enrolments, consultations, prescriptions, labs and claims — connected across 9
            facilities nationwide.
          </p>
        </div>
        <p className="text-[11px] text-white/40">© 2026 Rednoxx Health Ltd · NDPR compliant</p>
      </div>
      <div className="flex items-center justify-center bg-canvas p-7 sm:p-10">
        <AuthCard title="Welcome back" subtitle="Sign in to your workspace.">
          <div className="space-y-4">
            <Field label="Work email">
              <Input type="email" placeholder="name@rednoxx.health" />
            </Field>
            <Button block>Continue</Button>
          </div>
        </AuthCard>
      </div>
    </div>
  )
}

function LoginExample() {
  const { success } = useToast()
  const [remember, setRemember] = useState(true)
  const [failed, setFailed] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [password, setPassword] = useState('')

  const submit = () => {
    // The demo password is deliberately guessable so both outcomes are playable.
    if (password === 'rednoxx') {
      setFailed(false)
      setAttempts(0)
      success('Signed in', 'Welcome back, Amina.')
    } else {
      setFailed(true)
      setAttempts((n) => n + 1)
    }
  }

  return (
    <AuthCard title="Sign in" subtitle="Use your work email. The demo password is “rednoxx”.">
      <div className="space-y-4">
        {failed && attempts < 3 && (
          <Alert tone="danger" title="Email or password is incorrect">
            Check both and try again — passwords are case-sensitive.
          </Alert>
        )}
        {attempts >= 3 && (
          <Alert tone="warning" title="Too many attempts">
            Try again in 5 minutes, or reset your password below.
          </Alert>
        )}
        <Field label="Work email">
          <Input type="email" defaultValue="amina@rednoxx.health" />
        </Field>
        <Field label="Password">
          <PasswordInput
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </Field>
        <div className="flex items-center justify-between">
          <Toggle checked={remember} onChange={setRemember} label="Remember me" />
          <button type="button" className="text-[13px] font-medium text-azure-600 hover:underline">
            Forgot password?
          </button>
        </div>
        <Button block onClick={submit} disabled={attempts >= 3}>
          Sign in
        </Button>
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-hair" />
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">or</span>
          <span className="h-px flex-1 bg-hair" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" leftIcon={<GoogleGlyph />}>
            Google
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<MicrosoftGlyph />}>
            Microsoft
          </Button>
        </div>
      </div>
    </AuthCard>
  )
}

function RegistrationExample() {
  const [done, setDone] = useState(false)
  const [agreed, setAgreed] = useState(false)

  if (done) {
    return (
      <AuthCard title="Check your inbox" subtitle="We sent a verification link to a.bello@garki.rednoxx.health.">
        <div className="flex items-center gap-3 rounded-3xl bg-mint-soft px-4 py-3.5">
          <MailCheck size={18} className="shrink-0 text-mint" />
          <p className="text-[13px] leading-relaxed text-forest-500">
            Account created. Verify your email within 24 hours to activate it.
          </p>
        </div>
        <Button block variant="secondary" className="mt-4" onClick={() => setDone(false)}>
          Back to the form
        </Button>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Create your account" subtitle="For clinicians and staff of member facilities.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" required>
            <Input placeholder="Amina" />
          </Field>
          <Field label="Last name" required>
            <Input placeholder="Bello" />
          </Field>
        </div>
        <Field label="Work email" required hint="Use your facility-issued address.">
          <Input type="email" placeholder="name@facility.rednoxx.health" />
        </Field>
        <Field label="Password" required>
          <PasswordInput placeholder="8+ characters" />
        </Field>
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#5833fb]"
          />
          <span className="text-[13px] leading-relaxed text-forest-500">
            I agree to the{' '}
            <span className="font-medium text-azure-600 hover:underline">Terms of Service</span> and{' '}
            <span className="font-medium text-azure-600 hover:underline">Privacy Policy</span>,
            including NDPR patient-data handling.
          </span>
        </label>
        <Button block disabled={!agreed} onClick={() => setDone(true)}>
          Create account
        </Button>
      </div>
    </AuthCard>
  )
}

const DEMO_OTP = '424242'

function VerificationExample() {
  const [code, setCode] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'success'>('idle')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const check = (value: string) => {
    if (value === DEMO_OTP) {
      setState('success')
    } else {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <AuthCard title="You're verified" subtitle="This device is now trusted for 30 days.">
        <div className="flex items-center gap-3 rounded-3xl bg-mint-soft px-4 py-3.5">
          <ShieldCheck size={18} className="shrink-0 text-mint" />
          <p className="text-[13px] text-forest-500">Code accepted — signing you in.</p>
        </div>
        <Button
          block
          variant="secondary"
          className="mt-4"
          onClick={() => {
            setState('idle')
            setCode('')
          }}
        >
          Try it again
        </Button>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Enter the 6-digit code"
      subtitle={`Sent by SMS to +234 ••• ••• 4410. The demo code is ${DEMO_OTP}.`}
    >
      <div className="space-y-4">
        <CodeInput
          value={code}
          onChange={(next) => {
            setCode(next)
            if (state === 'error') setState('idle')
          }}
          onComplete={check}
          error={state === 'error'}
        />
        {state === 'error' && (
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
      </div>
    </AuthCard>
  )
}

const MFA_METHODS = [
  { key: 'app', icon: Smartphone, label: 'Authenticator app', hint: 'Codes from Google Authenticator, 1Password…', tag: 'Recommended' },
  { key: 'passkey', icon: Fingerprint, label: 'Passkey', hint: 'Face, fingerprint or device PIN.' },
  { key: 'sms', icon: MessageSquareText, label: 'SMS code', hint: 'Sent to your registered phone.' },
]

function MfaMethodExample() {
  const [method, setMethod] = useState('app')
  return (
    <AuthCard title="Add a second factor" subtitle="Required for all clinical and finance roles.">
      <div role="radiogroup" aria-label="Second factor method" className="space-y-2">
        {MFA_METHODS.map(({ key, icon: Icon, label, hint, tag }) => {
          const active = method === key
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setMethod(key)}
              className={cn(
                'flex w-full items-start gap-3 rounded-3xl border p-3.5 text-left transition-[border-color,background-color]',
                active ? 'border-azure bg-azure-50/60' : 'border-hair hover:border-forest-200',
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  active ? 'bg-azure text-white' : 'bg-panel text-forest-400',
                )}
              >
                <Icon size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-medium text-forest">
                  {label}
                  {tag && <Tag className="bg-azure-100 text-azure-600">{tag}</Tag>}
                </span>
                <span className="mt-0.5 block text-[13px] text-forest-400">{hint}</span>
              </span>
              {active && <Check size={16} className="mt-1 shrink-0 text-azure" />}
            </button>
          )
        })}
      </div>
      <Button block className="mt-4">
        Continue
      </Button>
    </AuthCard>
  )
}

const BACKUP_CODES = ['84D2-91XF', 'K3P7-22MQ', 'T9RC-40ZH', 'W6JN-58AV', 'B1QY-73LS', 'F5MD-06KT', 'R8WX-31CP', 'H2GV-67NB']

function AuthenticatorSetupExample() {
  const { success } = useToast()
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <Card pad={false} className="p-5">
        <h3 className="text-sm font-medium text-forest">1 · Scan with your authenticator</h3>
        <div className="mt-3 flex justify-center rounded-3xl bg-panel p-5">
          <div className="rounded-2xl bg-white p-3">
            <QRCodeSVG
              value="otpauth://totp/Rednoxx:amina@rednoxx.health?secret=JBSWY3DPEHPK3PXP&issuer=Rednoxx"
              size={124}
              fgColor="#171723"
            />
          </div>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-forest-400">
          Can’t scan? Enter <span className="tnum font-mono text-forest-500">JBSW Y3DP EHPK 3PXP</span> manually.
        </p>
      </Card>
      <Card pad={false} className="p-5">
        <h3 className="text-sm font-medium text-forest">2 · Save your backup codes</h3>
        <p className="mt-1 text-[12px] text-forest-400">Each works once if you lose your device.</p>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {BACKUP_CODES.map((code) => (
            <span key={code} className="tnum rounded-xl bg-panel px-2.5 py-1.5 text-center font-mono text-[12px] text-forest-500">
              {code}
            </span>
          ))}
        </div>
        <Button
          block
          variant="secondary"
          size="sm"
          className="mt-3"
          leftIcon={<Copy size={13} />}
          onClick={() => {
            navigator.clipboard?.writeText(BACKUP_CODES.join('\n')).catch(() => {})
            success('Backup codes copied', 'Store them somewhere safe — not in email.')
          }}
        >
          Copy all codes
        </Button>
      </Card>
    </div>
  )
}

const REQUIREMENTS: { label: string; test: (v: string) => boolean }[] = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One number', test: (v) => /\d/.test(v) },
  { label: 'One symbol', test: (v) => /[^A-Za-z0-9]/.test(v) },
]

const STRENGTH = [
  { label: 'Weak', bar: 'bg-rose-ink', text: 'text-rose-ink' },
  { label: 'Fair', bar: 'bg-gold', text: 'text-gold-600' },
  { label: 'Good', bar: 'bg-azure', text: 'text-azure-600' },
  { label: 'Strong', bar: 'bg-mint', text: 'text-mint' },
]

function PasswordExample() {
  const { success } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const passed = REQUIREMENTS.filter((r) => r.test(password)).length
  const level = password ? STRENGTH[Math.max(0, passed - 1)] : undefined
  const mismatch = confirm.length > 0 && confirm !== password
  const valid = passed === REQUIREMENTS.length && confirm === password

  return (
    <AuthCard title="Create a new password" subtitle="Your reset link was verified.">
      <div className="space-y-4">
        <Field label="New password">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type to watch the meter"
          />
        </Field>
        <div>
          <div className="flex gap-1.5" aria-hidden>
            {STRENGTH.map((s, i) => (
              <span
                key={s.label}
                className={cn('h-1 flex-1 rounded-full transition-colors duration-200', password && i < passed ? level?.bar : 'bg-hair')}
              />
            ))}
          </div>
          <p className={cn('mt-1.5 text-[12px] font-medium', level ? level.text : 'text-forest-300')} role="status">
            {level ? `${level.label} password` : 'Password strength'}
          </p>
        </div>
        <ul className="space-y-1.5">
          {REQUIREMENTS.map((r) => {
            const ok = r.test(password)
            return (
              <li key={r.label} className={cn('flex items-center gap-2 text-[13px]', ok ? 'text-mint' : 'text-forest-400')}>
                <CircleCheck size={14} className={ok ? 'text-mint' : 'text-forest-200'} />
                {r.label}
              </li>
            )
          })}
        </ul>
        <Field label="Confirm password" hint={mismatch ? undefined : ' '}>
          <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </Field>
        {mismatch && (
          <p className="-mt-2 text-[13px] font-medium text-rose-ink" role="alert">
            Passwords don’t match yet.
          </p>
        )}
        <Button block disabled={!valid} onClick={() => success('Password updated', 'Use it the next time you sign in.')}>
          Set new password
        </Button>
      </div>
    </AuthCard>
  )
}

const ORGS = [
  { id: 'o1', name: 'Garki General Hospital', role: 'Clinical operations', members: 214 },
  { id: 'o2', name: 'Ikeja Medical Centre', role: 'Clinical operations', members: 342 },
  { id: 'o3', name: 'Rednoxx Head Office', role: 'Administrator', members: 58 },
]

function OrgSelectExample() {
  const { success } = useToast()
  const [org, setOrg] = useState('o1')
  return (
    <AuthCard title="Choose a workspace" subtitle="You belong to three organizations.">
      <div role="radiogroup" aria-label="Organization" className="space-y-2">
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
      <Button block className="mt-4" onClick={() => success('Workspace opened', ORGS.find((o) => o.id === org)?.name)}>
        Continue
      </Button>
    </AuthCard>
  )
}

function SessionTimeoutExample() {
  const [open, setOpen] = useState(false)
  const { success } = useToast()
  return (
    <>
      <Button variant="secondary" leftIcon={<TimerReset size={15} />} onClick={() => setOpen(true)}>
        Simulate session timeout
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Still there?"
        subtitle="You've been inactive for 14 minutes."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Sign out
            </Button>
            <Button
              onClick={() => {
                setOpen(false)
                success('Session extended', 'Another 15 minutes on the clock.')
              }}
            >
              Stay signed in
            </Button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-forest-500">
          For patient-data safety, sessions end after 15 minutes of inactivity. Unsaved
          consultation notes are kept as drafts.
        </p>
      </Modal>
    </>
  )
}

function StateCard({
  icon: Icon,
  tone,
  title,
  body,
  action,
}: {
  icon: typeof Lock
  tone: 'danger' | 'warning' | 'info'
  title: string
  body: string
  action: string
}) {
  const tones = {
    danger: 'bg-rose-soft text-rose-ink',
    warning: 'bg-gold-soft text-gold-600',
    info: 'bg-azure-50 text-azure-600',
  }
  return (
    <Card pad={false} className="flex flex-col items-center p-6 text-center">
      <span className={cn('flex h-11 w-11 items-center justify-center rounded-full', tones[tone])}>
        <Icon size={19} />
      </span>
      <p className="mt-3 text-sm font-medium text-forest">{title}</p>
      <p className="mt-1 flex-1 text-[13px] leading-relaxed text-forest-400">{body}</p>
      <Button size="sm" variant="secondary" className="mt-4">
        {action}
      </Button>
    </Card>
  )
}

/* --------------------------------- docs ---------------------------------- */

export const AUTH_BLOCK_DOCS: Omit<ComponentDoc, 'name' | 'group' | 'summary'>[] = [
  {
    slug: 'auth-layout',
    description:
      'Every auth screen shares one shell: a dark brand panel that carries the product story, and a canvas column holding a single centered card. Swap the card — login, OTP, reset — and the shell never changes. On small screens the brand panel drops away and the card centers alone.',
    code: `<AuthSplitLayout
  brand={<BrandPanel />}
>
  <AuthCard title="Welcome back">…</AuthCard>
</AuthSplitLayout>`,
    examples: [
      {
        title: 'Split layout',
        note: 'Brand left, form right — the form column is the same card used by every flow below.',
        wide: true,
        body: <SplitLayoutExample />,
      },
    ],
    a11y: [
      'The form card holds the page h1 equivalent; the brand panel is decorative narrative.',
      'The layout collapses to a single centered column before the form compresses.',
      'Brand-panel text on ink keeps AA contrast (60% white minimum for body copy).',
    ],
  },
  {
    slug: 'login',
    description:
      'Email + password with remember-me, a forgot-password escape hatch, and SSO below a divider. Failure states are part of the block: a wrong password explains itself, and repeated failures throttle with a clear recovery path.',
    code: `<LoginForm
  onSubmit={signIn}
  sso={['google', 'microsoft']}
  onForgotPassword={goToReset}
/>`,
    examples: [
      {
        title: 'Live — try both outcomes',
        note: 'The demo password is “rednoxx”. Three wrong tries reaches the throttle state.',
        body: <LoginExample />,
      },
    ],
    a11y: [
      'Failure messages are role="alert" and name the fix, not just the failure.',
      'The throttle state disables the button and offers password reset — never a dead end.',
      'SSO buttons carry the provider name as text; logos are decorative.',
      'Remember-me is a labelled switch, off by default on shared clinical machines.',
    ],
  },
  {
    slug: 'registration',
    description:
      'Personal details, account details, then explicit consent — the agreement checkbox gates the primary action, and success swaps the card for a check-your-inbox confirmation rather than navigating away.',
    code: `<SignUpForm onSubmit={register} terms={<TermsLinks />} />`,
    examples: [
      {
        title: 'Live — agree, submit, and see the success state',
        body: <RegistrationExample />,
      },
    ],
    a11y: [
      'The terms checkbox is a real <input type="checkbox"> with the full agreement as its label.',
      'The primary action stays disabled until consent — state is communicated, not just styled.',
      'The success card confirms the exact address the verification email went to.',
    ],
  },
  {
    slug: 'verification',
    description:
      'One segmented CodeInput covers email, SMS and authenticator codes: auto-advance, backspace, arrow keys and paste all work. Wrong codes paint the cells and explain; resend goes quiet behind a countdown so users don’t spam themselves.',
    code: `<CodeInput
  value={code}
  onChange={setCode}
  onComplete={verify}
  error={failed}
/>`,
    examples: [
      {
        title: 'Live — wrong and right codes',
        note: `Type or paste any six digits. ${DEMO_OTP} succeeds; anything else shows the error state.`,
        body: <VerificationExample />,
      },
    ],
    a11y: [
      'Each cell is labelled “Digit n of 6” and the first carries autocomplete="one-time-code".',
      'Paste fills the whole code from any cell; arrow keys move between cells.',
      'The wrong-code message is role="alert" and clears as soon as typing resumes.',
      'Resend shows its cooldown as visible text on the disabled control.',
    ],
  },
  {
    slug: 'mfa',
    description:
      'Three pieces assemble every MFA flow: a method-selection radio group (authenticator recommended), a QR setup card with a manual-entry fallback, and one-time backup codes with a copy action.',
    code: `<MfaMethodSelect value={method} onChange={setMethod} />
<AuthenticatorSetup secret={secret} account="amina@rednoxx.health" />`,
    examples: [
      {
        title: 'Method selection',
        body: <MfaMethodExample />,
      },
      {
        title: 'Authenticator setup + backup codes',
        note: 'A real scannable TOTP QR; copy puts all eight codes on the clipboard.',
        wide: true,
        body: <AuthenticatorSetupExample />,
      },
    ],
    a11y: [
      'Method cards form a real radiogroup — arrow keys and aria-checked included.',
      'The QR always ships with a typable secret for users who can’t scan.',
      'Backup codes are selectable text plus a one-tap copy with toast confirmation.',
    ],
  },
  {
    slug: 'password',
    description:
      'Create, reset and change flows share one card: a four-segment strength meter driven by explicit requirements, each requirement visible and ticking as it passes. The submit gates on all requirements plus a matching confirmation.',
    code: `<Field label="New password">
  <PasswordInput value={password} onChange={…} />
</Field>
<StrengthMeter value={password} requirements={REQUIREMENTS} />`,
    examples: [
      {
        title: 'Live — type to drive the meter',
        note: 'Try “Garki@2026” for a strong one.',
        body: <PasswordExample />,
      },
    ],
    a11y: [
      'Strength is announced as text (role="status"), never colour-alone bars.',
      'Requirements are a visible checklist, so “weak” is actionable.',
      'The mismatch message is role="alert" and sits directly under the confirm field.',
      'Both fields carry the show/hide eye — a labelled button with aria-pressed, so users can verify long passwords before submitting.',
    ],
  },
  {
    slug: 'org-access',
    description:
      'Healthcare sign-in rarely ends at the password: staff pick an organization, facility or role before landing. One radio-card list covers all three hand-offs; the same block re-appears in the navbar as “switch workspace”.',
    code: `<WorkspaceSelect
  options={organizations}
  value={org}
  onChange={setOrg}
  onContinue={enter}
/>`,
    examples: [
      {
        title: 'Live — choose and continue',
        body: <OrgSelectExample />,
      },
    ],
    a11y: [
      'A real radiogroup with per-option aria-checked; the check icon is reinforcement, not the only cue.',
      'Each option states the user’s role in that workspace — no surprises after entry.',
      'Member counts use tabular figures.',
    ],
  },
  {
    slug: 'auth-states',
    description:
      'The unhappy paths, standardised: locked, unauthorized, pending approval and maintenance are all the same card anatomy — tone icon, plain-language reason, one recovery action. The session-timeout dialog is live.',
    code: `<AuthStateCard
  tone="danger"
  icon={Lock}
  title="Account locked"
  body="Five failed attempts…"
  action="Reset password"
/>`,
    examples: [
      {
        title: 'State cards',
        wide: true,
        body: (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StateCard
              icon={Lock}
              tone="danger"
              title="Account locked"
              body="Five failed attempts. Reset your password or wait 30 minutes."
              action="Reset password"
            />
            <StateCard
              icon={ShieldAlert}
              tone="danger"
              title="You don't have access"
              body="Billing is limited to finance roles at this facility."
              action="Request access"
            />
            <StateCard
              icon={KeyRound}
              tone="warning"
              title="Access pending"
              body="Your request is with the facility administrator."
              action="Check status"
            />
            <StateCard
              icon={Wrench}
              tone="info"
              title="Scheduled maintenance"
              body="Sign-in pauses Sunday 02:00–03:00 WAT. Active sessions continue."
              action="Read more"
            />
          </div>
        ),
      },
      {
        title: 'Session timeout',
        note: 'The 15-minute inactivity dialog — extend or sign out.',
        body: <SessionTimeoutExample />,
      },
      {
        title: 'Organization context',
        note: 'A quiet banner variant for org-wide notices.',
        wide: true,
        body: (
          <div className="max-w-xl space-y-3">
            <Alert tone="info" title="Signed in to Garki General Hospital">
              Switch workspaces from the account menu — your role differs per facility.
            </Alert>
            <div className="flex items-center gap-2">
              <Badge tone="success" dot>
                Session active
              </Badge>
              <Badge tone="neutral">2 other devices</Badge>
              <Building2 size={14} className="text-forest-300" />
            </div>
          </div>
        ),
      },
    ],
    a11y: [
      'Every state names the cause and offers exactly one primary recovery action.',
      'Lock and denial reasons are text, never icon-only; icons match the semantic tone.',
      'The timeout dialog traps focus, closes on Escape as “stay signed in”, and never loses work.',
    ],
  },
]
