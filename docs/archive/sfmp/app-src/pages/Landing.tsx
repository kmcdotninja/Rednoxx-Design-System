import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck, Landmark, Leaf, ShieldCheck, Sun } from 'lucide-react'
import { Logo, Mark } from '@/components/Logo'
import { DOMAINS, DOMAIN_META } from '@/data/nav'

export function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-azure/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-40 h-[380px] w-[380px] rounded-full bg-mint/10 blur-[100px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <Logo className="h-7 text-navy" />
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-navy-500 transition-colors hover:bg-panel">
              Sign in
            </Link>
            <Link to="/signup" className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-white shadow-soft transition-colors hover:bg-navy-600">
              Create account
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col justify-center py-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-hair bg-white px-3 py-1.5 text-[13px] font-medium text-navy-500 shadow-card">
              <span className="h-2 w-2 rounded-full bg-azure" />
              Nigeria’s sustainable-finance marketplace
            </span>
            <h1 className="mt-6 text-[44px] font-medium leading-[1.05] tracking-[-0.03em] text-navy sm:text-[58px]">
              Structured finance for
              <br />
              renewable energy, with{' '}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">confidence</span>
                <span className="absolute bottom-1.5 left-0 z-0 h-4 w-full -rotate-1 bg-azure/50" />
              </span>
              .
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-navy-400">
              SFMP unites borrowers, financiers and the SFMP team on one platform — projects appraised
              against a facility-type document pack, recommended to verified financiers, and funded under a
              banking maker-checker workflow.
            </p>
          </div>

          <div className="mt-12">
            <p className="mb-4 text-sm font-medium text-navy-400">Choose an interface to explore the demo</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {DOMAINS.map((domain) => {
                const meta = DOMAIN_META[domain]
                const Icon = meta.icon
                return (
                  <Link
                    key={domain}
                    to={meta.base}
                    className="group relative flex flex-col rounded-4xl border border-hair bg-white p-6 transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-navy-200"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-azure transition-transform duration-200 group-hover:scale-105">
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-4 text-lg font-medium text-navy">{meta.label}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-navy-400">{meta.blurb}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-navy">
                      Enter as {meta.label}
                      <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-navy-400">
            <span className="flex items-center gap-2"><Sun size={17} className="text-mint" /> Renewable-energy facility types</span>
            <span className="flex items-center gap-2"><ClipboardCheck size={17} className="text-mint" /> Maker-checker approvals</span>
            <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-mint" /> Onboarding &amp; verification</span>
            <span className="flex items-center gap-2"><Leaf size={17} className="text-mint" /> ESG-aligned appraisal</span>
          </div>
        </main>

        <footer className="flex items-center justify-between border-t border-hair py-5 text-sm text-navy-300">
          <span className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-navy-300" />
            Proudly Powered by Sterling Bank
          </span>
          <span className="flex items-center gap-1.5">
            <Mark className="h-4 w-4 text-navy-300" />© {new Date().getFullYear()} SFMP
          </span>
        </footer>
      </div>
    </div>
  )
}
