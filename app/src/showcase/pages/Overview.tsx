import type { ReactNode } from 'react'
import { Link, type LinkProps } from '@tanstack/react-router'
import {
  ArrowRight,
  Check,
  MousePointerClick,
  PersonStanding,
  Sprout,
  SwatchBook,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { ButtonLink, Card, Tag } from '@/components/ui'

const LAYERS: { name: string; blurb: string; to: string }[] = [
  { name: 'Foundations', blurb: 'Colour, type, spacing, elevation, motion, icons.', to: '/design/foundations/overview' },
  { name: 'Components', blurb: 'Thirty-six generic primitives — buttons to the ⌘K menu.', to: '/design/components/button' },
  { name: 'Blocks', blurb: 'Reusable compositions for recurring healthcare patterns.', to: '/design/blocks/patient-banner' },
  { name: 'Templates', blurb: 'Five page layouts: dashboard, list, record, settings, auth.', to: '/design/blocks/template-dashboard' },
  { name: 'Pages', blurb: 'The final screens — the live Rednoxx product demo.', to: '/demo' },
]

/** A small, purpose-built visual for each layer card — clean previews, not live demos. */
const LAYER_PREVIEWS: Record<string, ReactNode> = {
  Foundations: (
    <div className="flex flex-col items-center gap-3.5">
      <span className="text-[52px] font-medium leading-none tracking-[-0.03em] text-forest">Aa</span>
      <div className="flex gap-1.5">
        <span className="h-4 w-4 rounded-full bg-azure" />
        <span className="h-4 w-4 rounded-full bg-forest" />
        <span className="h-4 w-4 rounded-full bg-mint" />
        <span className="h-4 w-4 rounded-full bg-gold" />
      </div>
    </div>
  ),
  Components: (
    <div className="flex w-full max-w-[168px] flex-col gap-2.5">
      <div className="flex h-8 items-center border border-hair bg-white px-2.5 text-[11px] text-forest-300">
        Patient name
        <span className="ml-0.5 h-3.5 w-px bg-azure" />
      </div>
      <div className="flex items-center justify-between">
        <span className="relative h-5 w-9 rounded-full bg-forest">
          <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
        </span>
        <span className="rounded-full bg-mint-soft px-2 py-0.5 text-[10px] font-medium text-mint">
          Active
        </span>
        <span className="flex h-4 w-4 items-center justify-center bg-azure">
          <Check size={11} className="text-white" strokeWidth={3} />
        </span>
      </div>
      <span className="flex h-8 items-center justify-center bg-azure text-[12px] font-medium text-white">
        Save changes
      </span>
    </div>
  ),
  Blocks: (
    <div className="w-full max-w-[188px] border border-hair bg-white p-3.5 shadow-card">
      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-forest-300">Revenue</p>
      <p className="tnum mt-1 text-[22px] font-medium leading-none text-forest">$48.2k</p>
      <div className="mt-3 flex h-10 items-end gap-1">
        {[9, 15, 11, 20, 14, 22, 17].map((h, i) => (
          <span key={i} className="flex-1 bg-azure-100" style={{ height: h }} />
        ))}
      </div>
    </div>
  ),
  Templates: (
    <div className="flex w-full max-w-[188px] gap-2">
      <div className="h-[92px] w-9 shrink-0 bg-panel" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-2/3 bg-panel" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 bg-panel" />
          <div className="h-9 bg-panel" />
        </div>
        <div className="h-8 bg-panel" />
      </div>
    </div>
  ),
  Pages: (
    <div className="w-full max-w-[188px] border border-hair bg-white p-3.5">
      <div className="flex items-center justify-between">
        <div className="h-2.5 w-16 rounded-full bg-panel" />
        <div className="h-2.5 w-8 rounded-full bg-panel" />
      </div>
      <div className="mt-3 flex h-16 items-end gap-1.5">
        {[40, 62, 48, 80, 56, 72].map((h, i) => (
          <span key={i} className="flex-1 bg-azure" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  ),
}

const OUTCOMES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: SwatchBook,
    title: 'A single design language',
    body: 'One documented system applied consistently across the product.',
  },
  {
    icon: Zap,
    title: 'Faster delivery',
    body: 'New screens assembled from tested components, not designed from scratch.',
  },
  {
    icon: MousePointerClick,
    title: 'Better usability',
    body: 'Clinical and admin flows that behave consistently, so staff learn the product once.',
  },
  {
    icon: PersonStanding,
    title: 'Accessibility',
    body: 'WCAG 2.2 AA conformance across the core component library.',
  },
  {
    icon: Sprout,
    title: 'Longevity',
    body: 'A governance model so the system stays healthy as the product grows.',
  },
]

/** Where a reader goes next, by what they're about to do. */
const START_HERE: { title: string; body: string; to: string }[] = [
  {
    title: 'Designing a screen',
    body: 'Read the Patterns group that matches the workflow, then shop in Blocks.',
    to: '/design/patterns/overview',
  },
  {
    title: 'Implementing a screen',
    body: 'Import rules, the hard rules, and the checks that run before a PR.',
    to: '/design/get-started/developers',
  },
  {
    title: 'Writing anything a user reads',
    body: 'Copy is a clinical surface — voice, numerals, and the do-not-use list.',
    to: '/design/content/overview',
  },
]

export function Overview() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-5 py-8 sm:px-8 sm:py-10">
      {/* Hero */}
      <header className="animate-rise">
        <Tag className="bg-azure-50 text-azure-600">Design system · v1.0</Tag>
        <h1 className="mt-4 max-w-2xl text-[32px] font-medium leading-[1.15] tracking-[-0.02em] text-forest">
          One design language for Rednoxx.
        </h1>
        <div className="mt-5 max-w-2xl space-y-4 text-[15px] leading-relaxed text-forest-500">
          <p>
            Rednoxx is a healthcare platform spanning enrolments, payments, insurance, clinical
            consultation, prescriptions, lab and surgical orders, and reporting. This is the
            design system it&apos;s built from — foundations, thirty-six documented components,
            and twenty-two auth and healthcare blocks, each with live examples and WCAG 2.2 AA
            notes, proven in a thirteen-screen product demo assembled entirely from those parts.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonLink to="/design/components/$slug" params={{ slug: 'button' }} rightIcon={<ArrowRight size={15} />}>
            Browse components
          </ButtonLink>
          <ButtonLink to="/demo" variant="secondary">
            Open the product demo
          </ButtonLink>
        </div>
      </header>

      {/* Outcomes */}
      <section className="animate-rise" style={{ animationDelay: '80ms' }}>
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">
          What this delivers
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OUTCOMES.map(({ icon: Icon, title, body }) => (
            <Card key={title} pad={false} className="p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-azure-50 text-azure">
                <Icon size={17} aria-hidden />
              </span>
              <p className="mt-3.5 text-sm font-medium text-forest">{title}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-forest-400">{body}</p>
            </Card>
          ))}
          <Card dark pad={false} className="flex flex-col justify-between p-5">
            <p className="text-sm font-medium">See it assembled</p>
            <p className="mt-1 text-[13px] leading-relaxed text-white/60">
              A live analytics screen built entirely from the components below.
            </p>
            <Link
              to="/demo"
              className="group mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-azure-200 transition-colors hover:text-white"
            >
              Open the demo
              <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </Card>
        </div>
      </section>

      {/* The five layers */}
      <section className="animate-rise" style={{ animationDelay: '120ms' }}>
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">
          How the system is layered
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-forest-400">
          Components stay generic; blocks capture recurring healthcare patterns; templates and
          pages assemble them. Change flows downhill — a token edit reaches every screen.
        </p>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LAYERS.map((layer) => (
            <li key={layer.name}>
              <Link
                to={layer.to as LinkProps['to']}
                className="group flex h-full flex-col rounded-4xl border border-hair bg-white p-5 transition-[border-color,box-shadow] duration-150 hover:border-navy-200 hover:shadow-card-hover"
              >
                <span className="flex items-center justify-between text-[15px] font-medium tracking-[-0.01em] text-forest">
                  {layer.name}
                  <ArrowRight
                    size={15}
                    className="text-forest-200 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-forest-400"
                  />
                </span>
                <div className="flex min-h-[132px] flex-1 items-center justify-center py-6">
                  {LAYER_PREVIEWS[layer.name]}
                </div>
                <span className="text-[12px] leading-relaxed text-forest-400">{layer.blurb}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Getting started — the landing is also the Get started overview, so the
          rule and the routes in live here rather than on a second page. */}
      <section className="animate-rise" style={{ animationDelay: '160ms' }}>
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">
          Getting started
        </h2>

        <div className="mt-4 border border-azure-200 bg-azure-50 p-5">
          <p className="text-sm font-medium text-azure-600">The system is the single source of truth</p>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-forest-500">
            Build pages only from <code className="bg-white/70 px-1.5 py-0.5 font-mono text-[12px]">components/ui</code>{' '}
            and <code className="bg-white/70 px-1.5 py-0.5 font-mono text-[12px]">components/blocks</code>. If a
            component is missing, add it to the system first, then build the page — never fork a
            primitive into a feature folder.
          </p>
        </div>

        <div className="mt-4 grid gap-px border border-hair bg-hair sm:grid-cols-3">
          {START_HERE.map((route) => (
            <Link
              key={route.to}
              to={route.to as LinkProps['to']}
              className="group bg-white p-5 transition-colors hover:bg-panel"
            >
              <p className="flex items-center justify-between text-sm font-medium text-forest">
                {route.title}
                <ArrowRight
                  size={14}
                  className="text-forest-200 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-forest-400"
                />
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-forest-400">{route.body}</p>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
