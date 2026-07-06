import { useEffect, useMemo, useState } from 'react'
import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { ArrowRight, Info, ShieldCheck } from 'lucide-react'
import { RoleContext } from './RoleContext'
import { AccountContext, type AccountInfo } from './AccountContext'
import { OnboardingDrawerContext } from './OnboardingDrawerContext'
import { TopNav } from './TopNav'
import { Sidebar } from './Sidebar'
import { sessionEnded } from '@/lib/session'
import { BorrowerFlow } from '@/components/onboarding/BorrowerFlow'
import { FinancierFlow } from '@/components/onboarding/FinancierFlow'
import { Button, Drawer, Modal } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { DOMAIN_META, navFor } from '@/data/nav'
import { CURRENT_USERS } from '@/data/mock'
import type { Domain, OnboardStatus, SubRole } from '@/data/types'
import { cn } from '@/lib/cn'
import { useSessionTimeout } from '@/lib/useSessionTimeout'

function MobileNav({ domain, subRole }: { domain: Domain; subRole: SubRole }) {
  const nav = navFor(domain, subRole)
  return (
    <div className="-mx-4 mb-5 overflow-x-auto px-4 lg:hidden">
      <div className="flex w-max gap-2">
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors',
                  isActive ? 'border-navy bg-navy text-white' : 'border-hair bg-white text-navy-500',
                )
              }
            >
              <Icon size={15} />
              {item.label}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

function bannerCopy(status: OnboardStatus): { title: string; body: string; cta: string } {
  switch (status) {
    case 'submitted':
      return {
        title: 'Onboarding under review',
        body: 'Your submission is with the SFMP team. Creating projects, funding deals and messaging unlock once you’re verified.',
        cta: 'View status',
      }
    case 'in_progress':
      return {
        title: 'Finish your onboarding',
        body: 'Complete your corporate profile to unlock the marketplace.',
        cta: 'Continue onboarding',
      }
    case 'rejected':
      return {
        title: 'Onboarding was declined',
        body: 'Review the notes from the SFMP team and resubmit your details.',
        cta: 'Resubmit',
      }
    default:
      return {
        title: 'Complete onboarding to unlock SFMP',
        body: 'Submit your corporate profile for review. Every feature stays locked until your institution is verified.',
        cta: 'Start onboarding',
      }
  }
}

function OnboardingBanner({ status, onResume }: { status: OnboardStatus; onResume: () => void }) {
  if (status === 'verified') return null
  const copy = bannerCopy(status)
  return (
    <div className="mb-6 flex items-center gap-3 rounded-3xl border border-gold/30 bg-gold-soft/60 px-4 py-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-gold-600">
        <Info size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-navy">{copy.title}</p>
        <p className="text-xs text-navy-400">{copy.body}</p>
      </div>
      <button
        onClick={onResume}
        className="hidden shrink-0 items-center gap-1.5 rounded-xl bg-navy px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-navy-600 sm:flex"
      >
        {copy.cta}
        <ArrowRight size={15} />
      </button>
    </div>
  )
}

export function AppShell({ domain }: { domain: Domain }) {
  useSessionTimeout()
  const store = useStore()
  const { accounts, activeAccountId, borrowers, financiers, setActor } = store

  const [subRole, setSubRole] = useState<SubRole>('root')
  const [verifyPromptFor, setVerifyPromptFor] = useState<string | null>(null)
  const [onboardingOpen, setOnboardingOpen] = useState(false)

  const activeAccount = accounts.find((a) => a.id === activeAccountId && a.domain === domain)
  const company = activeAccount?.company ?? DOMAIN_META[domain].company
  const contactName = activeAccount?.contactName ?? CURRENT_USERS[domain].name

  const onboarding: OnboardStatus = useMemo(() => {
    if (domain === 'admin') return 'verified'
    if (domain === 'borrower') return borrowers.find((b) => b.company === company)?.onboarding ?? activeAccount?.onboarding ?? 'not_started'
    return financiers.find((f) => f.company === company)?.onboarding ?? activeAccount?.onboarding ?? 'not_started'
  }, [domain, company, borrowers, financiers, activeAccount])

  const verified = onboarding === 'verified'

  // Keep the store's acting identity in sync for audit + notification routing.
  useEffect(() => {
    setActor({ domain, subRole, user: contactName, company })
    // setActor is stable-guarded in the store; deps intentionally exclude it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, subRole, contactName, company])

  // The whole onboarding experience lives in a near-full-height drawer, so
  // users keep their context instead of being routed to a separate page.
  const openForm = () => setOnboardingOpen(true)
  const openStatus = () => setOnboardingOpen(true)
  const openVerifyPrompt = (action?: string) => setVerifyPromptFor(action ?? '')

  const onboardingSubtitle =
    onboarding === 'verified'
      ? `${company} · fully verified`
      : onboarding === 'submitted'
        ? `${company} · under review by the SFMP team`
        : onboarding === 'rejected'
          ? `${company} · submission declined — review and resubmit`
          : `${company} · complete your corporate profile to unlock the marketplace`

  const account: AccountInfo = {
    domain,
    company,
    contactName,
    onboarding,
    verified,
    isDemo: !activeAccount,
  }

  const pendingReview = onboarding === 'submitted'

  // Logged out or timed out: the shell stays sealed (back button included)
  // until the user signs in again.
  if (sessionEnded()) return <Navigate to="/login" replace />

  return (
    <RoleContext.Provider value={{ domain, subRole, setSubRole }}>
      <AccountContext.Provider value={account}>
        <OnboardingDrawerContext.Provider value={{ openForm, openStatus, openVerifyPrompt }}>
          <div className="min-h-screen bg-canvas">
            <TopNav />
            <div className="mx-auto flex w-full max-w-[1440px]">
              <Sidebar />
              <main className="min-w-0 flex-1 px-4 pb-24 pt-8 sm:px-6 lg:px-8">
                <MobileNav domain={domain} subRole={subRole} />
                <OnboardingBanner status={onboarding} onResume={pendingReview ? openStatus : openForm} />
                <Outlet />
              </main>
            </div>

            {/* Onboarding — full experience in a large drawer, in context */}
            {domain !== 'admin' && (
              <Drawer
                open={onboardingOpen}
                onClose={() => setOnboardingOpen(false)}
                title={domain === 'borrower' ? 'Borrower onboarding' : 'Financier onboarding'}
                subtitle={onboardingSubtitle}
                size="2xl"
              >
                {domain === 'borrower' ? (
                  <BorrowerFlow onClose={() => setOnboardingOpen(false)} />
                ) : (
                  <FinancierFlow onClose={() => setOnboardingOpen(false)} />
                )}
              </Drawer>
            )}

            <Modal
              open={verifyPromptFor !== null}
              onClose={() => setVerifyPromptFor(null)}
              title={pendingReview ? 'Onboarding in review' : 'Onboarding required'}
              subtitle={
                verifyPromptFor
                  ? `Your institution must be verified before you can ${verifyPromptFor}.`
                  : 'Your institution must be verified before you can use this feature.'
              }
              footer={
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setVerifyPromptFor(null)}>Not now</Button>
                  <Button
                    leftIcon={<ShieldCheck size={16} />}
                    onClick={() => {
                      setVerifyPromptFor(null)
                      openForm()
                    }}
                  >
                    {pendingReview ? 'View status' : 'Complete onboarding'}
                  </Button>
                </div>
              }
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold-soft text-gold-600">
                  <ShieldCheck size={22} />
                </span>
                <p className="text-sm leading-relaxed text-navy-500">
                  {pendingReview
                    ? 'Your onboarding is with the SFMP team. Once verified, this and every other feature will unlock.'
                    : 'Submit your corporate profile for review. Once the SFMP team verifies your institution, the marketplace unlocks.'}
                </p>
              </div>
            </Modal>
          </div>
        </OnboardingDrawerContext.Provider>
      </AccountContext.Provider>
    </RoleContext.Provider>
  )
}
