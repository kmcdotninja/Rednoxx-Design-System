import type { ReactNode } from 'react'
import {
  ArrowRight,
  Check,
  Layers,
  MonitorPlay,
  ShieldCheck,
  SwatchBook,
  X,
  type LucideIcon,
} from 'lucide-react'
import { ButtonLink, Card, CodeBlock, Divider, StatCard, StatusPill, Tag } from '@/components/ui'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/cn'
import { HimSnippetGallery } from './HimSnippets'

/* ─────────────────────────────────────────────────────────────────────────────
   EDIT ME — the only place personal details appear on this page.
   ──────────────────────────────────────────────────────────────────────────── */
const AUTHOR = {
  name: 'Your Name',
  role: 'Design system, product design, front-end',
  period: '2025 — 2026',
  contact: 'you@example.com',
}

/* Every figure below is counted from this repository — keep them true.
   Sources: showcase/components-meta.ts (36 entries), showcase/blocks-meta.ts
   (30 entries), app/router.ts (50 routed product screens — 13 HIM module,
   16 care demo, 19 intake stream, 2 error screens; the /design docs routes
   and the entry hall are excluded). */
const FIGURES: { label: string; value: string; sub: string }[] = [
  { label: 'Documented components', value: '36', sub: 'Buttons through the ⌘K palette' },
  { label: 'Blocks & patterns', value: '30', sub: 'Recurring healthcare compositions' },
  { label: 'Routed screens', value: '50', sub: 'Care demo, HIM module, intake stream' },
  { label: 'Conformance target', value: 'AA', sub: 'WCAG 2.2, enforced per component' },
]

const LAYERS: { icon: LucideIcon; name: string; blurb: string }[] = [
  {
    icon: SwatchBook,
    name: 'Tokens',
    blurb:
      'One CSS theme block holds every colour, type style, shadow, radius and motion curve. Nothing downstream is allowed a literal value.',
  },
  {
    icon: Layers,
    name: 'Components',
    blurb:
      'Thirty-six primitives, each with documented props, states and keyboard behaviour. Screens compose them; they never fork them.',
  },
  {
    icon: ShieldCheck,
    name: 'Blocks',
    blurb:
      'The compositions healthcare keeps needing — patient banner, vitals row, filter bar, audit timeline — solved once, correctly.',
  },
  {
    icon: MonitorPlay,
    name: 'Screens',
    blurb:
      'Fifty product screens assembled from the layers above, so a fix to a token or a component reaches all of them at once.',
  },
]

/** Ink ramp — the readable-text floor is the point of the exhibit.
    Ratios are measured against a white surface, from the token values in
    app/src/index.css. */
const INK_RAMP: {
  token: string
  swatch: string
  ratio: string
  role: 'fill' | 'floor' | 'text'
}[] = [
  { token: 'navy-100', swatch: 'bg-navy-100', ratio: '1.21:1', role: 'fill' },
  { token: 'navy-200', swatch: 'bg-navy-200', ratio: '1.47:1', role: 'fill' },
  { token: 'navy-300', swatch: 'bg-navy-300', ratio: '4.87:1', role: 'floor' },
  { token: 'navy-400', swatch: 'bg-navy-400', ratio: '7.79:1', role: 'text' },
  { token: 'navy-500', swatch: 'bg-navy-500', ratio: '10.51:1', role: 'text' },
  { token: 'navy', swatch: 'bg-navy', ratio: '17.75:1', role: 'text' },
]

const TYPE_SPECIMENS: { name: string; size: string; className: string }[] = [
  { name: 'Page title', size: '26 / 1.2', className: 'text-[26px] font-medium leading-[1.2] tracking-[-0.02em]' },
  { name: 'Section', size: '17 / 1.4', className: 'text-[17px] font-medium leading-[1.4] tracking-[-0.01em]' },
  { name: 'Body', size: '14 / 1.6', className: 'text-sm leading-relaxed' },
  { name: 'Overline', size: '11 / 1.4', className: 'text-[11px] font-medium uppercase tracking-[0.08em]' },
]

/* Quoted from app/src/index.css — the whole square-corner reskin is these
   eight declarations. */
const RADIUS_TOKENS = `@theme {
  /* Carbon-style square corners. Every structural surface — buttons,
     inputs, cards, popovers, modals, drawers — reads from these.
     rounded-full is the only survivor: pills, dots, toggles, avatars. */
  --radius-sm:  0px;
  --radius-md:  0px;
  --radius-lg:  0px;
  --radius-xl:  0px; /* chips, small icon buttons */
  --radius-2xl: 0px; /* buttons, inputs, list rows */
  --radius-3xl: 0px; /* inner tiles, popovers */
  --radius-4xl: 0px; /* cards, modals, drawers */
  --radius-5xl: 0px;
}`

/* ─── small page-level presentation helpers ──────────────────────────────── */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">{children}</p>
  )
}

function Section({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string
  title: string
  lede?: string
  children: ReactNode
}) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="text-[19px] font-medium leading-[1.35] tracking-[-0.01em] text-forest">
          {title}
        </h2>
        {lede && <p className="max-w-2xl text-sm leading-relaxed text-forest-400">{lede}</p>}
      </header>
      {children}
    </section>
  )
}

/** A decision, its reasoning, and the evidence — the unit this page is built from. */
function Decision({
  n,
  title,
  because,
  children,
}: {
  n: string
  title: string
  because: string
  children: ReactNode
}) {
  return (
    <Card className="space-y-5">
      <div className="flex items-baseline gap-3">
        <span className="tnum text-[11px] font-medium tracking-[0.08em] text-forest-300">{n}</span>
        <div className="min-w-0 space-y-2">
          <h3 className="text-[17px] font-medium leading-[1.4] tracking-[-0.01em] text-forest">
            {title}
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed text-forest-400">{because}</p>
        </div>
      </div>
      <div className="bg-panel p-4 sm:p-5">{children}</div>
    </Card>
  )
}

/** Side-by-side counter-example. Judgement shows in what got rejected. */
function Verdict({ ok, label, children }: { ok: boolean; label: string; children: ReactNode }) {
  return (
    <div className="flex-1 space-y-3 bg-white p-4">
      <p
        className={cn(
          'flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em]',
          ok ? 'text-mint' : 'text-rose-ink',
        )}
      >
        {ok ? <Check size={13} aria-hidden /> : <X size={13} aria-hidden />}
        {label}
      </p>
      {children}
    </div>
  )
}

/* ─── the page ───────────────────────────────────────────────────────────── */

export function CaseStudy() {
  return (
    <div className="min-h-screen bg-canvas">
      <main className="mx-auto max-w-4xl animate-rise px-5 py-16 sm:px-8 sm:py-24">
        <div className="space-y-12">
          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <header className="space-y-8">
            <div className="flex items-center justify-between gap-4">
              <Logo className="h-6" />
              <Tag>Case study</Tag>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-2xl text-[32px] font-medium leading-[1.15] tracking-[-0.02em] text-forest">
                A design system for clinical software, where the interface is a
                patient-safety control
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-forest-400">
                Rednoxx is an electronic health record platform. I own its design language
                end to end — tokens, components, blocks, accessibility and clinical-safety
                patterns — and I build it in React and Tailwind myself, so the system that
                gets specified is the system that ships.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-hair pt-6 sm:grid-cols-4">
              {[
                ['Role', AUTHOR.role],
                ['Period', AUTHOR.period],
                ['Stack', 'React 19, TypeScript, Tailwind v4'],
                ['Standards', 'WCAG 2.2 AA, FHIR R4'],
              ].map(([label, value]) => (
                <div key={label} className="space-y-1">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
                    {label}
                  </dt>
                  <dd className="text-[13px] leading-relaxed text-forest">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/design" rightIcon={<ArrowRight size={15} aria-hidden />}>
                Open the design system
              </ButtonLink>
              <ButtonLink to="/demo/overview" variant="secondary">
                Open the product demo
              </ButtonLink>
              <ButtonLink to="/him-demo" variant="ghost">
                HIM module
              </ButtonLink>
            </div>
          </header>

          <Divider />

          {/* ── Figures ──────────────────────────────────────────────────── */}
          <section aria-label="Project figures">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {FIGURES.map(({ label, value, sub }) => (
                <li key={label}>
                  <StatCard label={label} value={value} sub={sub} />
                </li>
              ))}
            </ul>
          </section>

          {/* ── Problem ──────────────────────────────────────────────────── */}
          <Section
            eyebrow="The problem"
            title="Consumer-software instincts get people hurt here"
            lede="Most design systems optimise for speed and delight. A clinical one is read by someone standing up, gloved, mid-shift, on their eleventh patient — and a misread number becomes a wrong dose."
          >
            <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-forest-400">
              <p>
                That changes what &ldquo;good&rdquo; means. Ambiguity is the defect, not
                ugliness. Density matters more than whitespace, because scrolling costs
                attention that belongs on the patient. Confirmation friction is a feature
                everywhere a mistake is expensive and irreversible — orders, prescriptions,
                record merges, sign-off.
              </p>
              <p>
                So the system&rsquo;s rule is inverted from the usual one: when a situation
                isn&rsquo;t covered by an explicit pattern, default to the{' '}
                <span className="text-forest">strictest</span> applicable option — more
                context, more confirmation, more contrast — never the fastest to build.
              </p>
            </div>
          </Section>

          {/* ── Architecture ─────────────────────────────────────────────── */}
          <Section
            eyebrow="Approach"
            title="Four layers, each one the single source for the next"
            lede="The value isn't the component count. It's that a decision made once at the bottom is enforced everywhere above it, without anyone remembering to apply it."
          >
            <ol className="grid gap-3 sm:grid-cols-2">
              {LAYERS.map(({ icon: Icon, name, blurb }, i) => (
                <li key={name}>
                  <Card className="h-full space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center bg-azure-50 text-azure">
                        <Icon size={17} aria-hidden />
                      </span>
                      <span className="tnum text-[11px] font-medium tracking-[0.08em] text-forest-300">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-medium leading-[1.45] tracking-[-0.01em] text-forest">
                      {name}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-forest-400">{blurb}</p>
                  </Card>
                </li>
              ))}
            </ol>
          </Section>

          {/* ── Decisions ────────────────────────────────────────────────── */}
          <Section
            eyebrow="Selected decisions"
            title="Four calls, and what each one is protecting"
            lede="Every rule below is enforced in the theme file or a component API, not in a document people are asked to remember."
          >
            <div className="space-y-3">
              <Decision
                n="01"
                title="Status is never colour alone"
                because="Around one in twelve men has a colour-vision deficiency, and clinical screens get read on bad monitors in bright rooms. So a status is always a soft fill, an AA-contrast label, and the word itself — three redundant signals. A bare coloured dot is unshippable."
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Verdict ok={false} label="Rejected">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-ink" aria-hidden />
                      <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />
                      <span className="h-2 w-2 rounded-full bg-mint" aria-hidden />
                    </div>
                    <p className="text-[12px] text-forest-400">
                      Hue is the only carrier. Unreadable to a colour-blind clinician, and
                      invisible to a screen reader.
                    </p>
                  </Verdict>
                  <Verdict ok label="Shipped">
                    <div className="flex flex-wrap gap-2">
                      <StatusPill status="rejected" />
                      <StatusPill status="pending" />
                      <StatusPill status="verified" />
                    </div>
                    <p className="text-[12px] text-forest-400">
                      Fill, AA text and the word travel together. Survives greyscale, low
                      vision and assistive tech.
                    </p>
                  </Verdict>
                </div>
              </Decision>

              <Decision
                n="02"
                title="The palette carries its own contrast floor"
                because="Accessibility fails when it lives in a review checklist. Instead the ink ramp is built so that every tone permitted for text already clears WCAG AA on white — and the tones below that line are documented as fills only. You cannot pick an illegal text colour from the scale, because it isn't in the scale."
              >
                {/* The rows sit on white because that is the surface the ratios
                    are measured against — and it keeps navy-100/200 visible. */}
                <ul className="divide-y divide-hair bg-white">
                  {INK_RAMP.map(({ token, swatch, ratio, role }) => (
                    <li key={token} className="flex items-center gap-2 px-4 py-2.5 sm:gap-3">
                      <span className={cn('h-6 w-9 shrink-0 sm:w-14', swatch)} aria-hidden />
                      <span className="whitespace-nowrap font-mono text-[12px] text-forest-400">
                        {token}
                      </span>
                      <span className="tnum ml-auto whitespace-nowrap font-mono text-[12px] text-forest-400">
                        {ratio}
                      </span>
                      {/* nowrap keeps every row the same height — a taller row
                          would read as a defect, not an emphasis. */}
                      <span className="w-[72px] shrink-0 whitespace-nowrap text-right sm:w-28">
                        {role === 'floor' ? (
                          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-azure sm:text-[11px]">
                            Text floor
                          </span>
                        ) : (
                          <span className="text-[10px] text-forest-300 sm:text-[11px]">
                            {role === 'fill' ? 'Fill only' : 'Text'}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </Decision>

              <Decision
                n="03"
                title="Ten type styles, and the set is closed"
                because="Open scales drift — someone needs a 15px semibold at 4pm and the system quietly gains an eleventh style, then a fourteenth. Ten named styles cover every screen in the product. Adding one is a system change with a reviewer, not a local decision."
              >
                {/* Specimens wrap rather than truncate — at narrow widths the
                    second line is what shows the style's leading. */}
                <ul className="space-y-4">
                  {TYPE_SPECIMENS.map(({ name, size, className }) => (
                    <li
                      key={name}
                      className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                    >
                      <span className={`${className} min-w-0 text-forest`}>
                        Serum creatinine 1.1 mg/dL
                      </span>
                      <span className="shrink-0 space-x-2 sm:text-right">
                        <span className="text-[12px] text-forest-400">{name}</span>
                        <span className="tnum font-mono text-[12px] text-forest-300">{size}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </Decision>

              <Decision
                n="04"
                title="Shape is one decision, not fifty"
                because="The product moved from rounded to square corners late, after the component library was already built. Because no component hard-codes a radius, the whole reskin was these eight declarations — and every button, input, card, modal and drawer followed. Systems earn their keep on the day the brand changes."
              >
                <CodeBlock code={RADIUS_TOKENS} label="app/src/index.css" />
              </Decision>
            </div>
          </Section>

          {/* ── HIM specimens ────────────────────────────────────────────── */}
          <Section
            eyebrow="The system in use"
            title="Fifteen specimens from the product"
            lede="Records management stresses the system hardest — it is where identity, duplicates and disclosure live — so most of these come from there, with the Care chart and the module switcher alongside. Every tile is live, rendered from the same components the product runs on."
          >
            {/* Breaks the 896px reading measure deliberately: these are
                specimens, not prose, and two columns of them need the width. */}
            <div className="lg:-mx-24 xl:-mx-32">
              <HimSnippetGallery />
            </div>
          </Section>

          {/* ── Outcome ──────────────────────────────────────────────────── */}
          <Section
            eyebrow="Outcome"
            title="What the system actually bought"
            lede="Fifty routed screens across registration, the patient index, duplicates and merge, consultation, orders, pharmacy, billing and audit — none of them designed from scratch."
          >
            <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-forest-400">
              <p>
                New screens now start from blocks rather than a blank canvas, which moved the
                design work from arranging boxes to the part that matters: what a clinician
                needs to see first, and what the product should refuse to let them do by
                accident. Accessibility stopped being a phase — it&rsquo;s a property of the
                primitives.
              </p>
              <p>
                The documentation site is the system, generated from the same components the
                product runs on, so it can&rsquo;t drift out of date.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink to="/design" rightIcon={<ArrowRight size={15} aria-hidden />}>
                Browse the system
              </ButtonLink>
              <ButtonLink to="/demo/overview" variant="secondary">
                See it in the product
              </ButtonLink>
            </div>
          </Section>

          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-hair pt-6">
            <p className="text-[13px] text-forest-400">
              {AUTHOR.name} — {AUTHOR.contact}
            </p>
            <Logo className="h-5 opacity-60" />
          </footer>
        </div>
      </main>
    </div>
  )
}
