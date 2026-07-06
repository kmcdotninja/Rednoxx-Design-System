import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ArrowRight, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react'
import { StatusPill } from '@/components/ui'
import { DOMAIN_META, SUBROLE_LABEL, navFor } from '@/data/nav'
import { useSession } from './RoleContext'
import { useAccount } from './AccountContext'
import { useOnboardingDrawer } from './OnboardingDrawerContext'
import { cn } from '@/lib/cn'

export function Sidebar() {
  const { domain, subRole } = useSession()
  const { company, onboarding, verified } = useAccount()
  const { openForm, openStatus } = useOnboardingDrawer()
  const nav = navFor(domain, subRole)
  const isAdmin = domain === 'admin'

  const [popped, setPopped] = useState<string | null>(null)
  const pop = (to: string) => {
    setPopped(to)
    window.setTimeout(() => setPopped((p) => (p === to ? null : p)), 480)
  }

  let lastSection: string | undefined

  return (
    <aside className="no-scrollbar sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[240px] shrink-0 flex-col gap-1 overflow-y-auto px-3 py-5 lg:flex">
      {/* Workspace block — full width, aligned with the nav items */}
      <div className="pb-3">
        <div className="overflow-hidden rounded-xl border border-hair bg-white">
          <div className="min-w-0 px-2.5 py-2">
            <p className="truncate text-[13px] font-medium leading-tight text-navy">{company}</p>
            <p className="text-[11px] leading-tight text-navy-300">
              {DOMAIN_META[domain].label} · {SUBROLE_LABEL[subRole]}
            </p>
          </div>
          {!isAdmin && (
            <button
              onClick={verified ? openStatus : openForm}
              className="group flex w-full items-center justify-between gap-2 border-t border-hair px-2.5 py-2 transition-colors hover:bg-panel/60"
            >
              <span className="truncate text-xs font-medium text-navy-400">Onboarding</span>
              <span className="flex shrink-0 items-center gap-1">
                <StatusPill status={onboarding} className="px-2 py-0.5 text-[11px]" />
                <ChevronRight size={13} className="text-navy-300 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Nav — grouped with tiny section labels */}
      <nav className="flex flex-col">
        {nav.map((item) => {
          const Icon = item.icon
          const label =
            item.section && item.section !== lastSection ? (
              <p key={`s-${item.section}`} className="px-3 pb-1.5 pt-5 text-xs font-medium text-navy-300">
                {item.section}
              </p>
            ) : null
          lastSection = item.section
          return (
            <div key={item.to}>
              {label}
              <NavLink
                to={item.to}
                end={item.end}
                onClick={() => pop(item.to)}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors duration-100',
                    isActive
                      ? 'bg-panel font-medium text-navy'
                      : 'font-medium text-navy-400 hover:bg-panel/60 hover:text-navy-600',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={16}
                      className={cn(
                        'shrink-0 transition-colors',
                        isActive ? 'text-navy' : 'text-navy-300 group-hover:text-navy-500',
                        popped === item.to && 'gx-icon-pop',
                      )}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            </div>
          )
        })}
      </nav>

      {/* Footer nudge — full width, aligned with the nav items */}
      <div className="mt-auto pt-6">
        {isAdmin ? null : verified ? (
          <div className="rounded-3xl border border-hair bg-white p-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-soft text-mint">
              <ShieldCheck size={16} />
            </span>
            <p className="mt-2.5 text-[13px] font-medium text-navy">Verified institution</p>
            <p className="mt-0.5 text-xs leading-relaxed text-navy-400">
              The marketplace is fully unlocked for your account.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl bg-navy p-4 text-white">
            <Sparkles size={18} className="text-azure" />
            <p className="mt-2 text-[13px] font-medium">Complete onboarding</p>
            <p className="mt-0.5 text-xs leading-relaxed text-white/70">
              Verify your institution to unlock projects, funding and advisory.
            </p>
            <button
              onClick={openForm}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-[13px] font-medium text-navy transition-colors hover:bg-white/90"
            >
              Resume onboarding
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
