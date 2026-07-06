import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Building2, KeyRound, ShieldCheck, UserRound } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useDomain } from '@/components/shell/RoleContext'
import { useAccount } from '@/components/shell/AccountContext'
import { Avatar, Badge, Button, Card, CardHeader, Field, Input, StatusPill, Toggle, useToast } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { CURRENT_USERS } from '@/data/mock'
import { DOMAIN_META } from '@/data/nav'
import { cn } from '@/lib/cn'

type Section = 'profile' | 'company' | 'security'

const SECTIONS: { id: Section; label: string; icon: typeof UserRound }[] = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'security', label: 'Security', icon: KeyRound },
]

export function Settings() {
  const domain = useDomain()
  const toast = useToast()
  const { company, onboarding } = useAccount()
  const { reset } = useStore()
  const [params] = useSearchParams()

  const user = CURRENT_USERS[domain]
  const [section, setSection] = useState<Section>('profile')
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState('08030000000')
  const [twoFa, setTwoFa] = useState(true)

  useEffect(() => {
    const s = params.get('section')
    if (s === 'profile' || s === 'company' || s === 'security') setSection(s)
  }, [params])

  const save = () => toast.success('Saved', 'Your changes have been saved.')

  return (
    <>
      <PageHeader title="Settings" subtitle="Your profile, company details and account security." />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="h-fit lg:sticky lg:top-24" pad={false}>
          <nav className="flex flex-row gap-1 p-2 lg:flex-col">
            {SECTIONS.map((s) => {
              const Icon = s.icon
              const active = s.id === section
              return (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={cn(
                    'flex flex-1 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors lg:flex-none',
                    active ? 'bg-navy-50 font-medium text-navy' : 'font-medium text-navy-400 hover:bg-panel',
                  )}
                >
                  <Icon size={17} className={active ? 'text-navy' : 'text-navy-300'} />
                  {s.label}
                </button>
              )
            })}
          </nav>
        </Card>

        <div className="space-y-5">
          {section === 'profile' && (
            <Card>
              <CardHeader title="Profile" subtitle="How you appear across the marketplace." />
              <div className="mt-5 flex items-center gap-4">
                <Avatar name={name} size="lg" />
                <div>
                  <p className="text-sm font-medium text-navy">{name}</p>
                  <p className="text-xs text-navy-400">{DOMAIN_META[domain].label} · {company}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
                <Field label="Work email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
                <Field label="Phone" hint="11 digits"><Input value={phone} maxLength={11} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} /></Field>
              </div>
              <div className="mt-6 flex justify-end border-t border-hair pt-5">
                <Button onClick={save}>Save changes</Button>
              </div>
            </Card>
          )}

          {section === 'company' && (
            <Card>
              <CardHeader
                title="Company"
                subtitle="Your institution on SFMP."
                action={domain !== 'admin' ? <StatusPill status={onboarding} /> : <Badge tone="info" dot>Platform operator</Badge>}
              />
              <dl className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-medium text-navy-400">Institution</dt>
                  <dd className="mt-0.5 text-sm font-medium text-navy">{company}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-navy-400">Interface</dt>
                  <dd className="mt-0.5 text-sm font-medium text-navy">{DOMAIN_META[domain].label}</dd>
                </div>
              </dl>
              <p className="mt-5 rounded-2xl bg-panel/70 px-4 py-3 text-[13px] leading-relaxed text-navy-500">
                Company details are managed through onboarding{domain !== 'admin' ? ' — update your corporate profile from the onboarding page.' : '.'}
              </p>
            </Card>
          )}

          {section === 'security' && (
            <>
              <Card>
                <CardHeader title="Change password" subtitle="8–32 characters with upper, lower, a digit and a symbol." />
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Current password" className="sm:col-span-2"><Input type="password" placeholder="••••••••" /></Field>
                  <Field label="New password"><Input type="password" placeholder="New password" /></Field>
                  <Field label="Confirm new password"><Input type="password" placeholder="Repeat new password" /></Field>
                </div>
                <div className="mt-6 flex justify-end border-t border-hair pt-5">
                  <Button onClick={() => toast.success('Password changed', 'Use your new password at next sign-in.')}>Update password</Button>
                </div>
              </Card>
              <Card>
                <CardHeader title="Two-factor authentication" subtitle="Sterling OneToken protects every sign-in." action={<ShieldCheck size={18} className="text-mint" />} />
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-hair bg-white px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-navy">Require OneToken PIN at sign-in</p>
                    <p className="text-xs text-navy-400">Mandatory for admin users — recommended for everyone.</p>
                  </div>
                  <Toggle checked={twoFa} onChange={(v) => { setTwoFa(v); toast.info(v ? '2FA enabled' : '2FA disabled', v ? 'OneToken will be required at sign-in.' : 'You can re-enable it anytime.') }} />
                </div>
              </Card>
              <Card>
                <CardHeader title="Demo data" subtitle="Reset the marketplace to its seeded state." />
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-rose-soft bg-rose-soft/20 px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-rose-ink">Reset demo data</p>
                    <p className="text-xs text-navy-400">Clears all local changes — projects, sectors, messages and approvals.</p>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => { reset(); toast.info('Demo reset', 'The marketplace is back to its seeded state.') }}>
                    Reset
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  )
}
