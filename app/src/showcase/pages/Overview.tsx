import { Link } from 'react-router-dom'
import {
  ArrowRight,
  MousePointerClick,
  PersonStanding,
  Sprout,
  SwatchBook,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { ButtonLink, Card, Tag } from '@/components/ui'
import { GROUP_ORDER, docsInGroup } from '../registry'
import { BLOCK_GROUP_ORDER, blocksInGroup } from '../blocks-meta'

const LAYERS: { name: string; blurb: string; to: string }[] = [
  { name: 'Foundations', blurb: 'Colour, type, spacing, elevation, motion, icons.', to: '/foundations' },
  { name: 'Components', blurb: 'Thirty-six generic primitives — buttons to the ⌘K menu.', to: '/components/button' },
  { name: 'Blocks', blurb: 'Reusable compositions for recurring healthcare patterns.', to: '/blocks/patient-banner' },
  { name: 'Templates', blurb: 'Five page layouts: dashboard, list, record, settings, auth.', to: '/templates' },
  { name: 'Pages', blurb: 'The final screens — the live Rednoxx product demo.', to: '/demo' },
]

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
    body: 'Measurable improvement on the highest-traffic clinical and admin flows.',
  },
  {
    icon: PersonStanding,
    title: 'Accessibility',
    body: 'WCAG 2.2 AA conformance across the core component library.',
  },
  {
    icon: Sprout,
    title: 'Longevity',
    body: 'A governance model so the system stays healthy after handoff.',
  },
]

export function Overview() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <header className="animate-rise">
        <Tag className="bg-azure-50 text-azure-600">Design system · v1.0</Tag>
        <h1 className="mt-4 max-w-2xl text-[32px] font-medium leading-[1.15] tracking-[-0.02em] text-forest">
          One design language for Rednoxx.
        </h1>
        <div className="mt-5 max-w-2xl space-y-4 text-[15px] leading-relaxed text-forest-500">
          <p>
            Rednoxx has grown into a broad healthcare platform spanning enrolments, payments,
            insurance, clinical consultation, prescriptions, lab and surgical orders, and
            reporting. As with most fast-growing products, features shipped faster than a shared
            design language could keep up — leaving inconsistent components, uneven spacing,
            unclear navigation, and gaps in feedback and accessibility.
          </p>
          <p>
            This engagement addresses that at the root. Rather than a cosmetic reskin, we audit
            what exists, learn how clinical and administrative staff actually work, and build a
            reusable design system that every future screen can be assembled from — faster to
            build, easier to use, and consistent by default. We don’t redesign without a clear
            reason: every change is tied to a measured problem.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonLink to="/components/button" rightIcon={<ArrowRight size={15} />}>
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
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {LAYERS.map((layer, i) => (
            <li key={layer.name}>
              <Link
                to={layer.to}
                className="group flex h-full flex-col rounded-3xl border border-hair bg-white p-4 transition-[border-color,box-shadow] duration-150 hover:border-navy-200 hover:shadow-card-hover"
              >
                <span className="tnum text-[11px] font-medium text-azure-600">{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-1.5 flex items-center justify-between text-sm font-medium text-forest">
                  {layer.name}
                  <ArrowRight
                    size={14}
                    className="text-forest-200 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-forest-400"
                  />
                </span>
                <span className="mt-1 text-[12px] leading-relaxed text-forest-400">{layer.blurb}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Component index */}
      <section className="animate-rise" style={{ animationDelay: '160ms' }}>
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">
          The component library
        </h2>
        <div className="mt-4 space-y-8">
          {GROUP_ORDER.map((group) => (
            <div key={group}>
              <p className="text-[13px] font-medium text-forest-500">{group}</p>
              <div className="mt-2.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {docsInGroup(group).map((doc) => (
                  <Link
                    key={doc.slug}
                    to={`/components/${doc.slug}`}
                    className="group rounded-3xl border border-hair bg-white p-4 transition-[border-color,box-shadow] duration-150 hover:border-navy-200 hover:shadow-card-hover"
                  >
                    <p className="flex items-center justify-between text-sm font-medium text-forest">
                      {doc.name}
                      <ArrowRight
                        size={14}
                        className="text-forest-200 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-forest-400"
                      />
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-forest-400">{doc.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Block index */}
      <section className="animate-rise" style={{ animationDelay: '200ms' }}>
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">
          The block library
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-forest-400">
          Reusable compositions built from the components above — the patterns clinical and admin
          screens repeat, documented once.
        </p>
        <div className="mt-4 space-y-8">
          {BLOCK_GROUP_ORDER.map((group) => (
            <div key={group}>
              <p className="text-[13px] font-medium text-forest-500">{group}</p>
              <div className="mt-2.5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {blocksInGroup(group).map((block) => (
                  <Link
                    key={block.slug}
                    to={`/blocks/${block.slug}`}
                    className="group rounded-3xl border border-hair bg-white p-4 transition-[border-color,box-shadow] duration-150 hover:border-navy-200 hover:shadow-card-hover"
                  >
                    <p className="flex items-center justify-between text-sm font-medium text-forest">
                      {block.name}
                      <ArrowRight
                        size={14}
                        className="text-forest-200 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-forest-400"
                      />
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-forest-400">{block.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
