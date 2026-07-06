import type { ReactNode } from 'react'
import { BadgeCheck, Landmark, Leaf, ShieldCheck } from 'lucide-react'
import { Mark } from '@/components/Logo'

const STATS = [
  { value: '₦4.1bn', label: 'Facilities structured' },
  { value: '38', label: 'Verified financiers' },
  { value: '12', label: 'States electrified' },
]

const BADGES = [
  { icon: ShieldCheck, label: 'Maker-checker controls' },
  { icon: Leaf, label: 'Renewable-energy focus' },
  { icon: BadgeCheck, label: 'Sterling-grade security' },
]

function BrandPanel() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-4xl bg-navy p-10 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-azure/30 blur-[90px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-mint/20 blur-[90px]" />

      <div className="relative flex items-center gap-2 text-azure">
        <Mark className="h-8 w-8" />
        <span className="text-lg font-medium tracking-[-0.02em] text-white">SFMP</span>
      </div>

      <div className="relative mt-auto">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[13px] font-medium text-white/80">
          <Landmark size={15} className="text-azure" />
          Sustainable Finance Marketplace
        </span>
        <h2 className="mt-5 max-w-md text-[30px] font-medium leading-tight tracking-[-0.02em]">
          Structured finance for Nigeria’s renewable-energy transition.
        </h2>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/60">
          One marketplace connecting borrowers, financiers and the SFMP team — from project appraisal to funded deal.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="tnum text-2xl font-medium tracking-[-0.02em] text-white">{s.value}</p>
              <p className="mt-0.5 text-xs text-white/55">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          {BADGES.map((b) => {
            const Icon = b.icon
            return (
              <span key={b.label} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-[13px] font-medium text-white/80">
                <Icon size={16} className="text-azure" />
                {b.label}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:px-16">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>
        <footer className="flex items-center gap-2 pt-6 text-xs text-navy-300">
          <Mark className="h-4 w-4 text-navy-300" />
          Proudly Powered by Sterling Bank · demo build
        </footer>
      </div>

      <div className="hidden p-3 lg:block lg:w-[48%]">
        <BrandPanel />
      </div>
    </div>
  )
}
