import { useState, type ReactNode } from 'react'
import {
  Banknote,
  CalendarClock,
  FlaskConical,
  HeartPulse,
  Pill,
  RotateCw,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react'
import { Button, Card, Input, Tag } from '@/components/ui'
import { Logo, Mark } from '@/components/Logo'
import { cn } from '@/lib/cn'

/* ---------------------------------------------------------------- chrome */

function Section({
  title,
  blurb,
  delay,
  children,
}: {
  title: string
  blurb?: ReactNode
  delay: number
  children: ReactNode
}) {
  return (
    <section className="animate-rise" style={{ animationDelay: `${delay}ms` }}>
      <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">{title}</h2>
      {blurb && <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-forest-400">{blurb}</p>}
      {children}
    </section>
  )
}

/** Compact AA/AAA conformance chip shown next to a contrast ratio. */
function WcagTag({ ratio }: { ratio: number }) {
  if (ratio >= 7) return <span className="rounded-full bg-mint-soft px-1.5 py-px text-[9px] font-medium text-mint">AAA</span>
  if (ratio >= 4.5) return <span className="rounded-full bg-mint-soft px-1.5 py-px text-[9px] font-medium text-mint">AA</span>
  if (ratio >= 3) return <span className="rounded-full bg-gold-soft px-1.5 py-px text-[9px] font-medium text-gold-600">AA lg</span>
  return null
}

/* ---------------------------------------------------------------- colour */

interface Swatch {
  name: string
  hex: string
  /** WCAG ratio of this colour as text on white. */
  ratio?: number
  /** Dark swatches get light captions. */
  ink?: boolean
}

const INK: Swatch[] = [
  { name: 'navy-50', hex: '#f4f4f6' },
  { name: 'navy-100', hex: '#e9e9ee' },
  { name: 'navy-200', hex: '#d4d4dd' },
  { name: 'navy-300', hex: '#70707f', ratio: 4.9, ink: true },
  { name: 'navy-400', hex: '#515160', ratio: 7.8, ink: true },
  { name: 'navy-500', hex: '#3e3e4c', ratio: 10.5, ink: true },
  { name: 'navy-600', hex: '#2a2a38', ratio: 14.1, ink: true },
  { name: 'navy', hex: '#171723', ratio: 17.7, ink: true },
  { name: 'navy-800', hex: '#12121c', ratio: 18.6, ink: true },
  { name: 'navy-900', hex: '#0a0a11', ratio: 19.7, ink: true },
]

const ACCENT: Swatch[] = [
  { name: 'azure-50', hex: '#f3f1ff' },
  { name: 'azure-100', hex: '#e9e4ff' },
  { name: 'azure-200', hex: '#d4cbfe' },
  { name: 'azure-300', hex: '#ab97fd', ratio: 2.4 },
  { name: 'azure', hex: '#5833fb', ratio: 6.4, ink: true },
  { name: 'azure-500', hex: '#4a28e0', ratio: 7.9, ink: true },
  { name: 'azure-600', hex: '#3c1ec2', ratio: 9.7, ink: true },
]

const STATUS: Swatch[] = [
  { name: 'mint-soft', hex: '#dcfce7' },
  { name: 'mint', hex: '#15803d', ratio: 5.0, ink: true },
  { name: 'gold-soft', hex: '#fbecc9' },
  { name: 'gold', hex: '#e0a526', ratio: 2.2 },
  { name: 'gold-600', hex: '#9a6b0f', ratio: 4.7, ink: true },
  { name: 'rose-soft', hex: '#fee2e2' },
  { name: 'rose-ink', hex: '#b91c1c', ratio: 6.5, ink: true },
]

const NEUTRALS: Swatch[] = [
  { name: 'white', hex: '#ffffff' },
  { name: 'canvas', hex: '#fcfcfc' },
  { name: 'panel', hex: '#f4f4f5' },
  { name: 'hair', hex: '#e4e4e7' },
]

function SwatchRow({ swatches, cols }: { swatches: Swatch[]; cols: string }) {
  return (
    <div className={cn('grid grid-cols-2 gap-2 sm:grid-cols-4', cols)}>
      {swatches.map((s) => (
        <div key={s.name} className="min-w-0">
          <div
            className="flex h-14 items-end rounded-2xl border border-black/5 px-2 pb-1.5"
            style={{ background: s.hex }}
          >
            {s.ratio != null && (
              <span className={cn('tnum text-[10px] font-medium', s.ink ? 'text-white/85' : 'text-navy-500')}>
                {s.ratio}:1
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-1">
            <p className="truncate text-[11px] font-medium text-forest-500">{s.name}</p>
            {s.ratio != null && <WcagTag ratio={s.ratio} />}
          </div>
          <p className="tnum text-[11px] uppercase text-forest-300">{s.hex}</p>
        </div>
      ))}
    </div>
  )
}

/** Colour roles — what each token is *for*, Material-style. */
const COLOR_ROLES: { token: string; hex: string; role: string; usage: string }[] = [
  { token: 'navy', hex: '#171723', role: 'Primary ink', usage: 'Headings, primary text, solid buttons, dark surfaces' },
  { token: 'navy-400', hex: '#515160', role: 'Secondary text', usage: 'Supporting copy, descriptions, values at rest' },
  { token: 'navy-300', hex: '#70707f', role: 'Muted text', usage: 'Hints, placeholders, timestamps, resting icons' },
  { token: 'white', hex: '#ffffff', role: 'Surface', usage: 'Cards, inputs, popovers, the sidebar' },
  { token: 'canvas', hex: '#fcfcfc', role: 'Background', usage: 'The app canvas behind all surfaces' },
  { token: 'panel', hex: '#f4f4f5', role: 'Quiet fill', usage: 'Hover states, table headers, skeletons, wells' },
  { token: 'hair', hex: '#e4e4e7', role: 'Hairline border', usage: 'Card and input borders, dividers — never darker' },
  { token: 'azure', hex: '#5833fb', role: 'Brand accent', usage: 'Primary actions, links, active nav, focus, data series' },
  { token: 'azure-50', hex: '#f3f1ff', role: 'Accent tint', usage: 'Focus rings, selected fills, quiet accent chips' },
  { token: 'mint', hex: '#15803d', role: 'Success', usage: 'Confirmations, healthy trends — on mint-soft fills' },
  { token: 'gold-600', hex: '#9a6b0f', role: 'Warning text', usage: 'Pending and caution copy — gold fills, gold-600 text' },
  { token: 'rose-ink', hex: '#b91c1c', role: 'Danger', usage: 'Errors, destructive actions — on rose-soft fills' },
]

/* ------------------------------------------------------------ typography */

const TYPE_SCALE: {
  name: string
  px: number
  lh: string
  weight: string
  tracking: string
  usage: string
  cls: string
  sample: string
}[] = [
  { name: 'Display', px: 32, lh: '1.15', weight: '500', tracking: '−0.02em', usage: 'Hero statements — one per flow', cls: 'text-[32px] font-medium leading-[1.15] tracking-[-0.02em]', sample: 'One design language' },
  { name: 'Page title', px: 26, lh: '1.2', weight: '500', tracking: '−0.02em', usage: 'The h1 — exactly one per page', cls: 'text-[26px] font-medium leading-[1.2] tracking-[-0.02em]', sample: 'Facility performance' },
  { name: 'Title', px: 19, lh: '1.35', weight: '500', tracking: '−0.01em', usage: 'Card, dialog and auth headings', cls: 'text-[19px] font-medium leading-[1.35] tracking-[-0.01em]', sample: 'Advanced reporting' },
  { name: 'Section', px: 17, lh: '1.4', weight: '500', tracking: '−0.01em', usage: 'Grouped content inside a page', cls: 'text-[17px] font-medium leading-[1.4] tracking-[-0.01em]', sample: 'Vitals this visit' },
  { name: 'Heading', px: 15, lh: '1.45', weight: '500', tracking: '−0.01em', usage: 'List titles, panel headers, lede text', cls: 'text-[15px] font-medium leading-[1.45] tracking-[-0.01em]', sample: 'Today’s clinic' },
  { name: 'Body', px: 14, lh: '1.6', weight: '400', tracking: '0', usage: 'Default reading size — forms, tables, copy', cls: 'text-sm leading-relaxed', sample: 'Results from the analyser are delayed by roughly 20 minutes.' },
  { name: 'Secondary', px: 13, lh: '1.55', weight: '400', tracking: '0', usage: 'The dense-UI workhorse: summaries, rows, meta', cls: 'text-[13px] leading-relaxed text-forest-500', sample: 'Escalated to Dr. Okafor — awaiting counter-signature.' },
  { name: 'Caption', px: 12, lh: '1.5', weight: '400', tracking: '0', usage: 'Supporting labels, chart annotations', cls: 'text-[12px] text-forest-400', sample: 'vs 3,554 last period' },
  { name: 'Overline', px: 11, lh: '1.4', weight: '500', tracking: '+0.08em', usage: 'Eyebrows, group labels, table headers — uppercase', cls: 'text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300', sample: 'Clinical' },
  { name: 'Micro', px: 10, lh: '1.3', weight: '500', tracking: '+0.02em', usage: 'Chips, axis ticks — never for reading', cls: 'text-[10px] font-medium text-forest-400', sample: 'NDPR · encrypted' },
]

/* --------------------------------------------------------------- spacing */

const SPACING: { step: string; px: number; usage: string }[] = [
  { step: '1', px: 4, usage: 'Icon–text gaps, chip padding' },
  { step: '1.5', px: 6, usage: 'Tight inline gaps' },
  { step: '2', px: 8, usage: 'Gaps between chips, small controls' },
  { step: '2.5', px: 10, usage: 'Row padding in dense lists' },
  { step: '3', px: 12, usage: 'Gaps in card grids, toolbar padding' },
  { step: '4', px: 16, usage: 'Standard control padding, form gaps' },
  { step: '5', px: 20, usage: 'Card padding (compact)' },
  { step: '6', px: 24, usage: 'Card padding (default), section gaps' },
  { step: '8', px: 32, usage: 'Between content groups' },
  { step: '10', px: 40, usage: 'Page padding on desktop' },
  { step: '12', px: 48, usage: 'Between page sections' },
]

/* ---------------------------------------------------------------- radius */

const RADIUS_TOKENS: { token: string; value: string; usage: string }[] = [
  { token: 'rounded-xl', value: '0px', usage: 'Chips, small icon buttons' },
  { token: 'rounded-2xl', value: '0px', usage: 'Buttons, inputs, list rows' },
  { token: 'rounded-3xl', value: '0px', usage: 'Inner tiles, popovers' },
  { token: 'rounded-4xl', value: '0px', usage: 'Cards, modals, drawers' },
  { token: 'rounded-full', value: '9999px', usage: 'Pills, dots, toggles, avatars — the only exception' },
]

/* ------------------------------------------------------------- elevation */

const SHADOWS: { name: string; note: string; style: string; value: string }[] = [
  { name: 'shadow-chip', note: 'chips & small controls', style: 'var(--shadow-chip)', value: '1px ring + 1px 2px' },
  { name: 'shadow-card', note: 'resting cards', style: 'var(--shadow-card)', value: '6px 16px, ≤5% black' },
  { name: 'shadow-card-hover', note: 'lifted on hover', style: 'var(--shadow-card-hover)', value: '12px 28px, ≤7% black' },
  { name: 'shadow-soft', note: 'quiet chrome', style: 'var(--shadow-soft)', value: '4px 16px, ≤7% black' },
  { name: 'shadow-pop', note: 'popovers & modals', style: 'var(--shadow-pop)', value: '1px ring + 8px 28px, 16% black' },
]

/* ---------------------------------------------------------------- motion */

const MOTION_TOKENS: { name: string; duration: string; easing: string; usage: string }[] = [
  { name: 'rise', duration: '400ms', easing: 'cubic-bezier(0.22, 1, 0.36, 1)', usage: 'Page and card entrances' },
  { name: 'pop', duration: '160ms', easing: 'cubic-bezier(0.22, 1, 0.36, 1)', usage: 'Overlays: dialogs, menus, the ⌘K palette' },
  { name: 'drawer-in', duration: '360ms', easing: 'cubic-bezier(0.32, 0.72, 0, 1)', usage: 'Side drawers entering' },
  { name: 'drawer-out', duration: '260ms', easing: 'cubic-bezier(0.36, 0, 0.66, −0.06)', usage: 'Side drawers leaving — exits are faster' },
  { name: 'fade-in / out', duration: '320 / 260ms', easing: 'ease', usage: 'Backdrops and scrims' },
  { name: 'colors / transform', duration: '150–200ms', easing: 'ease (default)', usage: 'Hover, focus and pressed micro-transitions' },
]

function MotionTile({ label, animation }: { label: string; animation: string }) {
  const [run, setRun] = useState(0)
  return (
    <div className="flex flex-col items-start gap-3 rounded-3xl border border-hair bg-white p-4">
      <div className="w-full overflow-hidden rounded-2xl bg-panel">
        <div key={run} className={`${animation} flex h-16 w-full items-center justify-center`}>
          <HeartPulse size={18} className="text-azure" aria-hidden />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <p className="font-mono text-[12px] text-forest-500">{label}</p>
        <Button size="sm" variant="ghost" leftIcon={<RotateCw size={13} />} onClick={() => setRun((n) => n + 1)}>
          Replay
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ iconography */

const ICON_SIZES: { px: number; usage: string }[] = [
  { px: 13, usage: 'Inline with Secondary text, dense rows' },
  { px: 14, usage: 'Meta rows, small buttons' },
  { px: 15, usage: 'Navigation, standard buttons' },
  { px: 17, usage: 'Page-level actions, outcome cards' },
  { px: 18, usage: 'Feature tiles, empty states' },
]

/* -------------------------------------------------------------- the page */

export function Foundations() {
  return (
    <div className="space-y-12">
      <header className="animate-rise">
        <h1 className="text-[26px] font-medium tracking-[-0.02em] text-forest">Foundations</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-forest-400">
          The complete specification every component is built from — colour, type, spacing,
          shape, elevation, motion and iconography, each mapped to the token that carries it.
          Change a token here and the whole product follows; that is the point.
        </p>
      </header>

      {/* Brand */}
      <Section
        title="Brand"
        delay={40}
        blurb={
          <>
            The mark and logotype live in <span className="font-mono">/public</span> so the favicon and
            in-app brand always match. The wordmark keeps its own violet — never recolour it, never
            set it on a colour that fails 3:1 against the violet.
          </>
        }
      >
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
          <Card className="flex items-center justify-center py-10">
            <Logo className="h-9" />
          </Card>
          <Card className="flex items-center justify-center gap-6 px-10">
            <Mark className="h-10 w-10" />
            <Mark className="h-7 w-7" />
            <Mark className="h-5 w-5" />
          </Card>
        </div>
      </Section>

      {/* Colour */}
      <Section
        title="Colour"
        delay={80}
        blurb={
          <>
            Near-black ink on white surfaces carries the interface; the brand violet is reserved for
            accents, focus and data. Every tile shows its contrast ratio as text on white with its
            WCAG grade — status colours never appear without a text label.
          </>
        }
      >
        <div className="mt-5 space-y-6">
          <div>
            <p className="mb-2.5 text-[13px] font-medium text-forest-500">Ink · 10 steps</p>
            <SwatchRow swatches={INK} cols="lg:grid-cols-10" />
          </div>
          <div>
            <p className="mb-2.5 text-[13px] font-medium text-forest-500">Accent · brand violet</p>
            <SwatchRow swatches={ACCENT} cols="lg:grid-cols-7" />
          </div>
          <div>
            <p className="mb-2.5 text-[13px] font-medium text-forest-500">Status · always paired with its soft fill</p>
            <SwatchRow swatches={STATUS} cols="lg:grid-cols-7" />
          </div>
          <div>
            <p className="mb-2.5 text-[13px] font-medium text-forest-500">Neutrals</p>
            <SwatchRow swatches={NEUTRALS} cols="lg:grid-cols-8" />
          </div>
        </div>

        <p className="mb-2.5 mt-8 text-[13px] font-medium text-forest-500">Roles — what each token is for</p>
        <Card pad={false} className="divide-y divide-hair/70 overflow-hidden">
          {COLOR_ROLES.map((r) => (
            <div key={r.token} className="grid grid-cols-[auto_7rem_1fr] items-center gap-x-4 px-4 py-2.5 sm:grid-cols-[auto_8rem_9rem_1fr] sm:px-5">
              <span className="h-5 w-5 shrink-0 rounded-lg border border-black/10" style={{ background: r.hex }} />
              <span className="truncate font-mono text-[12px] text-forest-500">{r.token}</span>
              <span className="hidden text-[13px] font-medium text-forest sm:block">{r.role}</span>
              <span className="text-[12px] leading-relaxed text-forest-400">
                <span className="font-medium text-forest sm:hidden">{r.role} — </span>
                {r.usage}
              </span>
            </div>
          ))}
        </Card>
      </Section>

      {/* Typography */}
      <Section
        title="Typography"
        delay={120}
        blurb={
          <>
            Geist carries everything; Geist Mono carries code and identifiers. Ten styles cover the
            whole product — negative tracking above 15px, uppercase with wide tracking below 12px,
            and nothing in between wears either.
          </>
        }
      >
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card pad={false} className="p-5">
            <p className="text-[22px] font-medium tracking-[-0.01em] text-forest">Geist</p>
            <p className="mt-1 text-[12px] text-forest-400">
              UI, headings, body — with <span className="font-mono">cv11</span> and{' '}
              <span className="font-mono">ss01</span> alternates enabled globally
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-forest-500">
              AaBbCcDdEeFfGg 0123456789 — the quick brown fox jumps over the lazy dog.
            </p>
          </Card>
          <Card pad={false} className="p-5">
            <p className="font-mono text-[20px] font-medium text-forest">Geist Mono</p>
            <p className="mt-1 text-[12px] text-forest-400">
              Code, tokens, MRNs and identifiers — data tables wear{' '}
              <span className="font-mono">.tnum</span> so updating numbers never shift
            </p>
            <p className="tnum mt-3 font-mono text-[13px] leading-relaxed text-forest-500">
              RDX-2026-018274 · ₦1,240,300.00 · 09:41
            </p>
          </Card>
        </div>

        <Card className="mt-4 overflow-x-auto p-0" pad={false}>
          <div className="min-w-[680px]">
            <div className="grid grid-cols-[7.5rem_3rem_3rem_3.5rem_4.5rem_1fr] gap-x-4 border-b border-hair bg-panel/60 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
              <span>Style</span>
              <span>Size</span>
              <span>Line</span>
              <span>Weight</span>
              <span>Tracking</span>
              <span>Usage</span>
            </div>
            <div className="divide-y divide-hair/70">
              {TYPE_SCALE.map((t) => (
                <div key={t.name} className="px-5 py-3.5">
                  <div className="tnum grid grid-cols-[7.5rem_3rem_3rem_3.5rem_4.5rem_1fr] gap-x-4 text-[12px] text-forest-400">
                    <span className="font-medium text-forest">{t.name}</span>
                    <span>{t.px}px</span>
                    <span>{t.lh}</span>
                    <span>{t.weight}</span>
                    <span>{t.tracking}</span>
                    <span className="text-forest-400">{t.usage}</span>
                  </div>
                  <p className={cn(t.cls, 'mt-1.5 truncate text-forest')}>{t.sample}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </Section>

      {/* Spacing */}
      <Section
        title="Spacing"
        delay={160}
        blurb={
          <>
            A 4px base grid — every gap, inset and offset is a multiple of it. Components use the
            steps below and nothing in between; if a layout needs 14px, the layout is wrong.
          </>
        }
      >
        <Card pad={false} className="mt-4 divide-y divide-hair/70">
          {SPACING.map((s) => (
            <div key={s.step} className="grid grid-cols-[3.5rem_3rem_1fr] items-center gap-x-4 px-5 py-2 sm:grid-cols-[3.5rem_3rem_10rem_1fr]">
              <span className="font-mono text-[12px] text-forest-500">{s.step}</span>
              <span className="tnum text-[12px] text-forest-400">{s.px}px</span>
              <span className="hidden sm:block">
                <span className="block h-3 rounded-sm bg-azure-200" style={{ width: s.px * 2 }} />
              </span>
              <span className="text-[12px] leading-relaxed text-forest-400">{s.usage}</span>
            </div>
          ))}
        </Card>
      </Section>

      {/* Layout */}
      <Section
        title="Layout"
        delay={200}
        blurb={
          <>
            One measured shell, everywhere: a fixed 240px sidebar, content capped at a readable
            896px, and a 48px rhythm between page sections.
          </>
        }
      >
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
          <Card pad={false} className="divide-y divide-hair/70">
            {[
              ['Sidebar', '240px', 'w-60 — docs and demo share it'],
              ['Content max-width', '896px', 'max-w-4xl, centred in the remaining space'],
              ['Page padding', '20 → 32px', 'px-5 on mobile, sm:px-8 from tablet'],
              ['Section rhythm', '48px', 'space-y-12 between page sections'],
              ['Card grid gaps', '12–16px', 'gap-3 dense indexes, gap-4 standard'],
              ['Touch target', '≥ 40px', 'h-10 controls; sm only inside clickable rows'],
            ].map(([name, value, note]) => (
              <div key={name} className="grid grid-cols-[10rem_5rem_1fr] items-baseline gap-x-4 px-5 py-2.5">
                <span className="text-[13px] font-medium text-forest">{name}</span>
                <span className="tnum font-mono text-[12px] text-forest-500">{value}</span>
                <span className="text-[12px] text-forest-400">{note}</span>
              </div>
            ))}
          </Card>
          <Card pad={false} className="hidden items-center justify-center p-6 lg:flex">
            <div className="flex h-40 w-56 gap-1.5 border border-hair bg-canvas p-1.5">
              <div className="w-10 shrink-0 border border-hair bg-white" />
              <div className="flex flex-1 items-start justify-center pt-3">
                <div className="h-28 w-3/4 space-y-2">
                  <div className="h-3 w-1/2 bg-navy-100" />
                  <div className="h-8 bg-white shadow-card" />
                  <div className="h-8 bg-white shadow-card" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Radius */}
      <Section
        title="Shape"
        delay={240}
        blurb={
          <>
            Square corners, Carbon-style: every structural radius token resolves to 0px, so buttons,
            inputs, cards and overlays all sit flush. Only <span className="font-mono">rounded-full</span>{' '}
            survives — pills, dots, toggles and avatars — which keeps status and identity instantly
            tellable from structure.
          </>
        }
      >
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
          <Card pad={false} className="divide-y divide-hair/70">
            {RADIUS_TOKENS.map((r) => (
              <div key={r.token} className="grid grid-cols-[7.5rem_4rem_1fr] items-baseline gap-x-4 px-5 py-2.5">
                <span className="font-mono text-[12px] text-forest-500">{r.token}</span>
                <span className="tnum text-[12px] text-forest-400">{r.value}</span>
                <span className="text-[12px] leading-relaxed text-forest-400">{r.usage}</span>
              </div>
            ))}
          </Card>
          <Card pad={false} className="flex items-end justify-center gap-4 p-6">
            <div className="h-16 w-16 rounded-2xl border border-navy-200 bg-panel" />
            <div className="h-20 w-20 rounded-4xl border border-navy-200 bg-panel" />
            <div className="h-9 w-20 rounded-full border border-navy-200 bg-panel" />
            <div className="h-12 w-12 rounded-full border border-navy-200 bg-panel" />
          </Card>
        </div>
      </Section>

      {/* Elevation */}
      <Section
        title="Elevation"
        delay={280}
        blurb={
          <>
            Five levels of layered, pure-black transparency — most of the interface lives at level 0
            (a hairline border, no shadow) and rises only while it needs attention. Nothing tints;
            shadows stay neutral on any surface.
          </>
        }
      >
        <div className="mt-4 grid gap-4 rounded-4xl bg-panel p-6 sm:grid-cols-2 lg:grid-cols-5">
          {SHADOWS.map((s, i) => (
            <div key={s.name} className="rounded-3xl bg-white p-4" style={{ boxShadow: s.style }}>
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">Level {i}</p>
              <p className="mt-1 font-mono text-[12px] text-forest-500">{s.name}</p>
              <p className="mt-0.5 text-[11px] text-forest-300">{s.note}</p>
              <p className="tnum mt-2 text-[10px] text-forest-300">{s.value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Motion */}
      <Section
        title="Motion"
        delay={320}
        blurb={
          <>
            Motion explains hierarchy, never decorates: content rises in, overlays pop, exits run
            faster than entrances. Every animation is removed under{' '}
            <span className="font-mono">prefers-reduced-motion</span>.
          </>
        }
      >
        <Card className="mt-4 overflow-x-auto p-0" pad={false}>
          <div className="min-w-[560px] divide-y divide-hair/70">
            {MOTION_TOKENS.map((m) => (
              <div key={m.name} className="grid grid-cols-[8rem_5.5rem_14rem_1fr] items-baseline gap-x-4 px-5 py-2.5">
                <span className="font-mono text-[12px] text-forest-500">{m.name}</span>
                <span className="tnum text-[12px] text-forest-400">{m.duration}</span>
                <span className="tnum truncate font-mono text-[11px] text-forest-300">{m.easing}</span>
                <span className="text-[12px] text-forest-400">{m.usage}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MotionTile label="rise · 400ms" animation="animate-rise" />
          <MotionTile label="pop · 160ms" animation="animate-pop" />
          <MotionTile label="drawer-in · 360ms" animation="animate-drawer-in" />
          <MotionTile label="fade-in · 320ms" animation="animate-fade-in" />
        </div>
      </Section>

      {/* Iconography */}
      <Section
        title="Iconography"
        delay={360}
        blurb={
          <>
            Lucide, stroke-based at the default 2px weight, sized to the text it sits beside. Icons
            never carry meaning alone — they always pair with a visible label or an{' '}
            <span className="font-mono">aria-label</span>.
          </>
        }
      >
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
          <Card pad={false} className="divide-y divide-hair/70">
            {ICON_SIZES.map((s) => (
              <div key={s.px} className="grid grid-cols-[3.5rem_3rem_1fr] items-center gap-x-4 px-5 py-2">
                <span className="flex items-center gap-2 text-forest-500">
                  <Stethoscope size={s.px} aria-hidden />
                </span>
                <span className="tnum text-[12px] text-forest-400">{s.px}px</span>
                <span className="text-[12px] leading-relaxed text-forest-400">{s.usage}</span>
              </div>
            ))}
          </Card>
          <Card pad={false} className="flex flex-wrap items-center gap-3 p-6">
            {[Stethoscope, Pill, FlaskConical, CalendarClock, Users, Banknote, ShieldCheck, HeartPulse].map(
              (Icon, i) => (
                <span key={i} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-panel text-forest-500">
                  <Icon size={18} aria-hidden />
                </span>
              ),
            )}
            <Tag className="ml-1">lucide-react</Tag>
          </Card>
        </div>
      </Section>

      {/* Focus & interaction */}
      <Section
        title="Focus & interaction"
        delay={400}
        blurb={
          <>
            One focus treatment everywhere: the control&apos;s border turns azure and grows a 4px{' '}
            <span className="font-mono">azure-50</span> ring. It is always visible, never colour-alone,
            and never suppressed. Tab through the examples to see it.
          </>
        }
      >
        <Card className="mt-4 flex flex-wrap items-center gap-4 p-6">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <div className="w-56">
            <Input placeholder="Focus me with Tab" />
          </div>
          <div className="space-y-1 text-[12px] leading-relaxed text-forest-400">
            <p>Hit targets are ≥ 40px; disabled controls stay in the tab order’s context.</p>
            <p>Text meets AA at every size; interactive states never rely on colour alone.</p>
          </div>
        </Card>
      </Section>
    </div>
  )
}
