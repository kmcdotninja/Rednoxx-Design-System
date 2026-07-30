import { Suspense, lazy, useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate, useParams, type LinkProps } from '@tanstack/react-router'
import {
  ArrowRight,
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
import { Button, Card, InlineLoader, Input } from '@/components/ui'
import { Logo, Mark, type LogoTone } from '@/components/Logo'
import { cn } from '@/lib/cn'
import { ColorRamp, toStops } from './ColorRamp'
import { TokenTable } from './TokenTable'
import { TOKEN_LENSES, cssVarValue, hasTokens, lengthToPx } from '../tokens'

/** The whole icon set is ~1,745 components, so it loads in its own chunk —
    only the Iconography page pays for it. */
const IconGallery = lazy(() => import('./IconGallery').then((m) => ({ default: m.IconGallery })))

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

/**
 * The ten roles, each named by the single utility that carries it. The size,
 * line-height, tracking and weight quoted on every row are read back from the
 * token at render time, so this table cannot drift from `@theme`.
 * `extra` is presentation for the specimen only — colour, and the `uppercase`
 * that a font-size token can't carry.
 */
const TYPE_SCALE: { name: string; utility: string; usage: string; extra?: string; sample: string }[] = [
  { name: 'Display', utility: 'text-display', usage: 'Hero statements — one per flow', sample: 'One design language' },
  { name: 'Page title', utility: 'text-page-title', usage: 'The h1 — exactly one per page', sample: 'Facility performance' },
  { name: 'Title', utility: 'text-title', usage: 'Card, dialog and auth headings', sample: 'Advanced reporting' },
  { name: 'Section', utility: 'text-section', usage: 'Grouped content inside a page', sample: 'Vitals this visit' },
  { name: 'Heading', utility: 'text-heading', usage: 'List titles, panel headers, lede text', sample: 'Today’s clinic' },
  { name: 'Body', utility: 'text-body', usage: 'Default reading size — forms, tables, copy', sample: 'Results from the analyser are delayed by roughly 20 minutes.' },
  { name: 'Secondary', utility: 'text-secondary', usage: 'The dense-UI workhorse: summaries, rows, meta', extra: 'text-forest-500', sample: 'Escalated to Dr. Okafor — awaiting counter-signature.' },
  { name: 'Caption', utility: 'text-caption', usage: 'Supporting labels, chart annotations', extra: 'text-forest-400', sample: 'vs 3,554 last period' },
  { name: 'Overline', utility: 'text-overline', usage: 'Eyebrows, group labels, table headers', extra: 'uppercase text-forest-300', sample: 'Clinical' },
  { name: 'Micro', utility: 'text-micro', usage: 'Chips, axis ticks — never for reading', extra: 'text-forest-400', sample: 'NDPR · encrypted' },
]

/** Size · line-height · weight · tracking, read off the token behind a role. */
function typeMetrics(utility: string): string | null {
  const base = `--${utility}` // text-display → --text-display
  const raw = cssVarValue(base)
  if (!raw) return null
  const px = lengthToPx(raw)
  const lh = cssVarValue(`${base}--line-height`) ?? '1'
  const weight = cssVarValue(`${base}--font-weight`) ?? '400'
  const tracking = cssVarValue(`${base}--letter-spacing`)
  return [
    `${px ? `${Math.round(px)}px` : raw}/${lh}`,
    weight,
    tracking?.replace('-', '−'),
  ]
    .filter(Boolean)
    .join(' · ')
}

/* --------------------------------------------------------------- spacing */

/** The approved steps of the 4px grid — px are derived from `--spacing`. */
const SPACING_STEPS: { step: string; usage: string }[] = [
  { step: '1', usage: 'Icon–text gaps, chip padding' },
  { step: '1.5', usage: 'Tight inline gaps' },
  { step: '2', usage: 'Gaps between chips, small controls' },
  { step: '2.5', usage: 'Row padding in dense lists' },
  { step: '3', usage: 'Gaps in card grids, toolbar padding' },
  { step: '4', usage: 'Standard control padding, form gaps' },
  { step: '5', usage: 'Card padding (compact)' },
  { step: '6', usage: 'Card padding (default), section gaps' },
  { step: '8', usage: 'Between content groups' },
  { step: '10', usage: 'Page padding on desktop' },
  { step: '12', usage: 'Between page sections' },
]

/** The recurring layout measures, named so a page inset isn't a remembered 5. */
const SPACING_NAMED: { token: string; utility: string; usage: string }[] = [
  { token: '--spacing-page', utility: 'px-page', usage: 'Page inset on mobile' },
  { token: '--spacing-page-lg', utility: 'sm:px-page-lg', usage: 'Page inset from tablet up' },
  { token: '--spacing-section', utility: 'space-y-section', usage: 'Rhythm between page sections' },
  { token: '--spacing-card', utility: 'p-card', usage: 'Card padding, default' },
  { token: '--spacing-card-sm', utility: 'p-card-sm', usage: 'Card padding, compact' },
  { token: '--spacing-gutter', utility: 'gap-gutter', usage: 'Standard grid and form gap' },
  { token: '--spacing-gutter-dense', utility: 'gap-gutter-dense', usage: 'Dense index grids, toolbars' },
]

/** The steps, then the named measures — both quoting px read off the tokens. */
function SpacingSpec() {
  const base = lengthToPx(cssVarValue('--spacing')) ?? 4

  return (
    <>
      <Card pad={false} className="mt-4 divide-y divide-hair/70">
        {SPACING_STEPS.map((s) => {
          const px = Math.round(parseFloat(s.step) * base)
          return (
            <div
              key={s.step}
              className="grid grid-cols-[3.5rem_3rem_1fr] items-center gap-x-4 px-5 py-2 sm:grid-cols-[3.5rem_3rem_10rem_1fr]"
            >
              <span className="font-mono text-[12px] text-forest-500">{s.step}</span>
              <span className="tnum text-[12px] text-forest-400">{px}px</span>
              <span className="hidden sm:block">
                <span className="block h-3 bg-azure-200" style={{ width: px * 2 }} />
              </span>
              <span className="text-[12px] leading-relaxed text-forest-400">{s.usage}</span>
            </div>
          )
        })}
      </Card>

      <p className="mb-2.5 mt-8 text-[13px] font-medium text-forest-500">
        Named measures — the insets and rhythm every page repeats
      </p>
      <Card pad={false} className="divide-y divide-hair/70">
        {SPACING_NAMED.map((s) => {
          const px = lengthToPx(cssVarValue(s.token))
          return (
            <div
              key={s.token}
              className="grid grid-cols-[1fr_3rem] items-center gap-x-4 px-5 py-2.5 sm:grid-cols-[11rem_9rem_3rem_1fr]"
            >
              <span className="truncate font-mono text-[12px] text-forest-500">{s.token}</span>
              <span className="hidden truncate font-mono text-[12px] text-forest-400 sm:block">
                {s.utility}
              </span>
              <span className="tnum text-right text-[12px] text-forest-400 sm:text-left">
                {px ? `${Math.round(px)}px` : '—'}
              </span>
              <span className="col-span-2 text-[12px] leading-relaxed text-forest-400 sm:col-span-1">
                {s.usage}
              </span>
            </div>
          )
        })}
      </Card>
    </>
  )
}

/* ---------------------------------------------------------------- radius */

/**
 * Two rows, because there are two shapes — not eight.
 *
 * `--radius` is the single structural decision; the t-shirt sizes are aliases
 * of it, kept only so pre-reskin `rounded-md`…`rounded-5xl` classes still
 * resolve. `rounded-full` carries no token — it is Tailwind's built-in — so its
 * row quotes the literal value.
 */
const RADIUS_TOKENS: { utility: string; token?: string; value?: string; usage: string }[] = [
  {
    utility: 'rounded-sm … rounded-5xl',
    token: '--radius',
    usage: 'All structure: buttons, inputs, cards, tiles, popovers, modals, drawers',
  },
  {
    utility: 'rounded-full',
    value: '∞',
    usage: 'Pills, dots, toggles, avatars — the only exception',
  },
]

/* ------------------------------------------------------------- elevation */

const SHADOWS: { name: string; note: string; value: string }[] = [
  { name: 'shadow-chip', note: 'Chips & small controls', value: '1px ring + 1px 2px' },
  { name: 'shadow-card', note: 'Resting cards', value: '6px 16px, ≤5% black' },
  { name: 'shadow-card-hover', note: 'Lifted on hover', value: '12px 28px, ≤7% black' },
  { name: 'shadow-soft', note: 'Quiet chrome', value: '4px 16px, ≤7% black' },
  { name: 'shadow-pop', note: 'Popovers & modals', value: '1px ring + 8px 28px, 16% black' },
]

/* ---------------------------------------------------------------- motion */

/** Durations and curves are read from `--duration-*` / `--ease-*` at render. */
const MOTION_TOKENS: { name: string; duration: string; ease?: string; usage: string }[] = [
  { name: 'rise', duration: '--duration-rise', ease: '--ease-rise', usage: 'Page and card entrances' },
  { name: 'pop', duration: '--duration-pop', ease: '--ease-pop', usage: 'Overlays: dialogs, menus, the ⌘K palette' },
  { name: 'drawer-in', duration: '--duration-drawer-in', ease: '--ease-drawer-in', usage: 'Side drawers entering' },
  { name: 'drawer-out', duration: '--duration-drawer-out', ease: '--ease-drawer-out', usage: 'Side drawers leaving — exits are faster' },
  { name: 'fade-in', duration: '--duration-fade-in', usage: 'Backdrops and scrims entering' },
  { name: 'fade-out', duration: '--duration-fade-out', usage: 'Backdrops and scrims leaving' },
  { name: 'icon-pop', duration: '--duration-icon-pop', ease: '--ease-icon-pop', usage: 'Tap feedback on nav icons — the one overshoot' },
  { name: 'hover / press', duration: '--duration-hover', usage: 'Colour, border and transform micro-transitions' },
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

/* ------------------------------------------------------------------ brand */

/** The brand violet, read off the accent ramp so the two can never drift. */
const BRAND_HEX = ACCENT.find((s) => s.name === 'azure')!.hex

/** The four approved lockup tones, each on the surface it is meant for. */
const LOCKUPS: { tone: LogoTone; name: string; surface: string; ratio: string; usage: string }[] = [
  {
    tone: 'brand',
    name: 'Azure on white',
    surface: 'bg-white',
    ratio: '6.4:1',
    usage: 'The default — app chrome, auth, marketing',
  },
  {
    tone: 'white',
    name: 'White on ink',
    surface: 'bg-forest',
    ratio: '17.7:1',
    usage: 'Dark shells, footers, presentation decks',
  },
  {
    tone: 'white',
    name: 'White on azure',
    surface: 'bg-azure',
    ratio: '6.4:1',
    usage: 'Brand panels beside the sign-in card',
  },
  {
    tone: 'ink',
    name: 'Ink mono',
    surface: 'bg-canvas',
    ratio: '17.7:1',
    usage: 'Print, faxes, scanned records, greyscale',
  },
]

function LockupTile({ tone, name, surface, ratio, usage }: (typeof LOCKUPS)[number]) {
  return (
    <div className="border border-hair bg-white">
      <div className={cn('flex h-28 items-center justify-center px-5 sm:h-32', surface)}>
        <Logo tone={tone} className="h-8 w-auto sm:h-9" />
      </div>
      <div className="border-t border-hair px-4 py-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[13px] font-medium text-forest">{name}</p>
          <span className="tnum text-[11px] text-forest-300">{ratio}</span>
        </div>
        <p className="mt-0.5 text-[11px] leading-relaxed text-forest-400">{usage}</p>
      </div>
    </div>
  )
}

/** Mark ramp — every size the glyph ships at, largest first. */
const MARK_SIZES: { px: number; cls: string; usage: string }[] = [
  { px: 64, cls: 'h-16 w-16', usage: 'Empty states, splash' },
  { px: 40, cls: 'h-10 w-10', usage: 'Sign-in card, avatars' },
  { px: 32, cls: 'h-8 w-8', usage: 'Favicon @2x, collapsed rail' },
  { px: 24, cls: 'h-6 w-6', usage: 'Dense chrome, document headers' },
  { px: 16, cls: 'h-4 w-4', usage: 'Favicon, inline byline — floor' },
]

/* ------------------------------------------------------------ iconography */

/** Sizes come off `--spacing-icon-*`; Lucide takes them as a `size` number. */
const ICON_SIZES: { token: string; fallbackPx: number; usage: string }[] = [
  { token: '--spacing-icon-xs', fallbackPx: 13, usage: 'Inline meta, dense rows' },
  { token: '--spacing-icon-sm', fallbackPx: 14, usage: 'Meta rows, small buttons' },
  { token: '--spacing-icon-md', fallbackPx: 15, usage: 'Nav, standard buttons' },
  { token: '--spacing-icon-lg', fallbackPx: 17, usage: 'Page-level actions' },
  { token: '--spacing-icon-xl', fallbackPx: 18, usage: 'Tiles, empty states' },
]

/* -------------------------------------------------------------- the page */


/* ------------------------------------------------------------- sections */

/** Each Foundations page, keyed by its route slug. */
const FOUNDATION_SECTIONS: Record<string, ReactNode> = {
  "brand": (
        <Section
          title="Brand"
          delay={40}
          blurb={
            <>
              The mark and logotype live in <span className="font-mono">/public</span> so the favicon and
              in-app brand always match. Four tones are approved — azure, ink, and white reversed on ink
              or azure. Nothing else: no gradients, no tints, and never a surface that leaves the lockup
              under 3:1.
            </>
          }
        >
          <div className="mt-5 space-y-4">
            <Card className="relative overflow-hidden py-16 sm:py-24">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-azure-50),transparent_70%)]"
              />
              <div className="relative flex flex-col items-center gap-8">
                <Logo className="h-14 w-auto sm:h-20" />
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-[11px] text-forest-300">
                  <span className="font-medium text-forest-500">Primary lockup</span>
                  <span className="tnum uppercase">azure · {BRAND_HEX}</span>
                  <span>clear space = mark height ÷ 2</span>
                  <span className="tnum">min 96px wide</span>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {LOCKUPS.map((l) => (
                <LockupTile key={l.name} {...l} />
              ))}
            </div>

            <Card pad={false}>
              <div className="flex flex-wrap items-start gap-x-10 gap-y-8 px-5 py-8 sm:px-8 sm:py-10">
                {MARK_SIZES.map((m) => (
                  <div key={m.px} className="flex flex-col items-center gap-3">
                    <div className="flex h-16 items-end">
                      <Mark className={m.cls} />
                    </div>
                    <div className="text-center">
                      <p className="tnum text-[12px] font-medium text-forest">{m.px}px</p>
                      <p className="mt-0.5 max-w-[9rem] text-[11px] leading-relaxed text-forest-400">{m.usage}</p>
                    </div>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-16 items-end gap-2">
                    <span className="flex h-10 w-10 items-center justify-center border border-hair bg-white">
                      <Mark className="h-4 w-4" />
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center bg-forest">
                      <Mark tone="white" className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-[12px] font-medium text-forest">Favicon</p>
                    <p className="mt-0.5 max-w-[9rem] text-[11px] leading-relaxed text-forest-400">
                      Light and dark browser chrome
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Section>
  ),
  "colour": (
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
          <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            <ColorRamp name="Ink" stops={toStops(INK, 'navy')} />
            <ColorRamp name="Accent · brand violet" stops={toStops(ACCENT, 'azure')} />
            <ColorRamp name="Status" stops={toStops(STATUS, '')} />
            <ColorRamp name="Neutrals" stops={toStops(NEUTRALS, '')} />
          </div>
          <p className="mt-3 text-[12px] text-forest-300">
            Hover a band for its token and OKLCH value; click to copy the token. Ratios are
            contrast as text on white.
          </p>
  
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
  ),
  "typography": (
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
  
          <Card className="mt-4 divide-y divide-hair/70 p-0" pad={false}>
            {TYPE_SCALE.map((t) => (
              <div
                key={t.name}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:px-6"
              >
                <p className={cn(t.utility, t.extra ?? 'text-forest', 'min-w-0 truncate')}>{t.sample}</p>
                <div className="shrink-0 sm:w-72 sm:text-right">
                  <p className="text-[12px] font-medium text-forest">
                    {t.name}
                    <span className="tnum ml-2 font-mono text-[11px] font-normal text-forest-400">
                      {typeMetrics(t.utility)}
                    </span>
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-forest-400">{t.utility}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-forest-300">{t.usage}</p>
                </div>
              </div>
            ))}
          </Card>
          <p className="mt-3 text-[12px] leading-relaxed text-forest-300">
            One utility carries the whole role — size, line-height, weight and tracking all ride on
            the token, so <code className="bg-panel px-1.5 py-0.5 font-mono text-[11px]">text-secondary</code>{' '}
            replaces <code className="bg-panel px-1.5 py-0.5 font-mono text-[11px]">text-[13px] leading-relaxed</code>.
            Overline is the one exception: <span className="font-mono">uppercase</span> is a
            text-transform, which no font-size token can carry.
          </p>
        </Section>
  ),
  "space": (
        <Section
          title="Spacing"
          delay={160}
          blurb={
            <>
              A 4px base grid — every gap, inset and offset is a multiple of it. One token,{' '}
              <span className="font-mono">--spacing</span>, carries the base, so every numeric step
              is derived from it rather than typed out. Components use the steps below and nothing in
              between; if a layout needs 14px, the layout is wrong.
            </>
          }
        >
          <SpacingSpec />
        </Section>
  ),
  "layout": (
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
          {/* Rows and the shell they describe in one card — stacked, so the
              schematic reads as part of the spec rather than beside it. */}
          <Card pad={false} className="mt-4">
            <div className="divide-y divide-hair/70">
              {[
                ['Sidebar', '240px', 'w-sidebar — docs and demo share it'],
                ['Content max-width', '896px', 'max-w-measure, centred in the remaining space'],
                ['Page padding', '20 → 32px', 'px-page on mobile, sm:px-page-lg from tablet'],
                ['Section rhythm', '48px', 'space-y-section between page sections'],
                ['Card grid gaps', '12–16px', 'gap-gutter-dense indexes, gap-gutter standard'],
                ['Touch target', '≥ 40px', 'h-control; 44px (h-touch) on clinical tablets'],
              ].map(([name, value, note]) => (
                <div key={name} className="grid grid-cols-[10rem_5rem_1fr] items-baseline gap-x-4 px-5 py-2.5">
                  <span className="text-[13px] font-medium text-forest">{name}</span>
                  <span className="tnum font-mono text-[12px] text-forest-500">{value}</span>
                  <span className="text-[12px] text-forest-400">{note}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center border-t border-hair/70 p-6">
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
            </div>
          </Card>
        </Section>
  ),
  "shape": (
        <Section
          title="Shape"
          delay={240}
          blurb={
            <>
              One decision, one token: structure is square. Everything structural — buttons, inputs,
              cards, tiles, popovers, modals, drawers — takes{' '}
              <span className="font-mono">--radius</span>, and{' '}
              <span className="font-mono">rounded-full</span> is the only survivor, for pills, dots,
              toggles and avatars. So a round silhouette always means status or identity, never
              structure.
            </>
          }
        >
          {/* One card: the two shapes, then the silhouettes they produce as a
              footer band — the same anatomy as the Iconography card. */}
          <Card pad={false} className="mt-4">
            <div className="divide-y divide-hair/70">
              {RADIUS_TOKENS.map((r) => (
                <div
                  key={r.utility}
                  className="grid grid-cols-[10rem_4rem_1fr] items-baseline gap-x-4 px-5 py-2.5 sm:grid-cols-[10rem_6rem_4rem_1fr]"
                >
                  <span className="font-mono text-[12px] text-forest-500">{r.utility}</span>
                  <span className="hidden truncate font-mono text-[12px] text-forest-300 sm:block">
                    {r.token ?? '—'}
                  </span>
                  <span className="tnum text-[12px] text-forest-400">
                    {(r.token && cssVarValue(r.token)) ?? r.value}
                  </span>
                  <span className="text-[12px] leading-relaxed text-forest-400">{r.usage}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-end justify-center gap-4 border-t border-hair/70 p-6">
              <div className="h-16 w-16 rounded-2xl border border-navy-200 bg-panel" />
              <div className="h-20 w-20 rounded-4xl border border-navy-200 bg-panel" />
              <div className="h-9 w-20 rounded-full border border-navy-200 bg-panel" />
              <div className="h-12 w-12 rounded-full border border-navy-200 bg-panel" />
            </div>
          </Card>
          <p className="mt-3 text-[12px] leading-relaxed text-forest-300">
            The <span className="font-mono">rounded-sm … rounded-5xl</span> sizes are aliases of{' '}
            <span className="font-mono">--radius</span>, kept so components written before the
            square-corner reskin still resolve — roughly 870 usages across 157 files. Set{' '}
            <span className="font-mono">--radius</span> once and every one of them follows; there is
            no second radius to keep in step.
          </p>
        </Section>
  ),
  "elevation": (
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
          {/* Level 0 leads the grid: the default is a hairline and no shadow,
              so it has to be shown rather than implied by the four that lift. */}
          <div className="mt-4 grid gap-4 rounded-4xl bg-panel p-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-hair bg-white p-4">
              <p className="text-overline uppercase text-forest-300">Level 0 · default</p>
              <p className="mt-1 font-mono text-[12px] text-forest-500">border-hair</p>
              <p className="mt-0.5 text-[11px] text-forest-300">Everything at rest</p>
              <p className="tnum mt-2 text-[10px] text-forest-300">no shadow</p>
            </div>
            {SHADOWS.map((s) => (
              <div
                key={s.name}
                className="rounded-3xl bg-white p-4"
                style={{ boxShadow: `var(--${s.name})` }}
              >
                <p className="text-overline uppercase text-forest-300">Raised</p>
                <p className="mt-1 font-mono text-[12px] text-forest-500">{s.name}</p>
                <p className="mt-0.5 text-[11px] text-forest-300">{s.note}</p>
                <p className="tnum mt-2 text-[10px] text-forest-300">{s.value}</p>
              </div>
            ))}
          </div>
        </Section>
  ),
  "motion": (
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
                  <span className="tnum text-[12px] text-forest-400">
                    {cssVarValue(m.duration) ?? '—'}
                  </span>
                  <span className="tnum truncate font-mono text-[11px] text-forest-300">
                    {(m.ease && cssVarValue(m.ease)?.replace('-0.06', '−0.06')) ?? 'ease'}
                  </span>
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
  ),
  "iconography": (
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
          <Card pad={false} className="mt-4">
            <div className="grid grid-cols-2 gap-y-5 py-5 sm:grid-cols-5 sm:gap-y-0 sm:divide-x sm:divide-hair/70">
              {ICON_SIZES.map((s) => {
                const px = Math.round(lengthToPx(cssVarValue(s.token)) ?? s.fallbackPx)
                return (
                  <div key={s.token} className="flex flex-col items-center gap-1.5 px-3 text-center">
                    <span className="flex h-9 items-center justify-center text-forest-500">
                      <Stethoscope size={px} aria-hidden />
                    </span>
                    <span className="tnum text-[12px] font-medium text-forest">{px}px</span>
                    <span className="font-mono text-[11px] text-forest-400">
                      {s.token.replace('--spacing-icon-', 'icon-')}
                    </span>
                    <span className="text-[11px] leading-relaxed text-forest-300">{s.usage}</span>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* The whole set, searchable — no curated sample. Picking an icon
              gives you the import statement, ready to paste. */}
          <Suspense
            fallback={
              <div className="mt-4 flex h-40 items-center justify-center border border-hair bg-white">
                <InlineLoader label="Loading the icon set…" />
              </div>
            }
          >
            <IconGallery />
          </Suspense>
        </Section>
  ),
  "focus": (
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
  ),
}

/* ---------------------------------------------------------------- routing */

/** Sidebar order, used for the overview index. */
export const FOUNDATION_SLUGS = [
  'brand',
  'colour',
  'typography',
  'space',
  'layout',
  'shape',
  'elevation',
  'motion',
  'iconography',
  'focus',
] as const

const TITLES: Record<string, string> = {
  brand: 'Brand',
  colour: 'Colour',
  typography: 'Typography',
  space: 'Spacing',
  layout: 'Layout & grid',
  shape: 'Shape',
  elevation: 'Elevation',
  motion: 'Motion',
  iconography: 'Iconography',
  focus: 'Focus & interaction',
}

const BLURBS: Record<string, string> = {
  brand: 'The mark, logotype and the violet accent.',
  colour: 'Ink, brand violet and status ramps — each AA-checked.',
  typography: 'Geist on a closed ten-role type scale.',
  space: 'The 4px spacing scale everything snaps to.',
  layout: 'Page grids, columns and the reading measure.',
  shape: 'Square corners; rounded-full only for pills.',
  elevation: 'The shadow set — hairline ring plus soft lift.',
  motion: 'Rise, pop and the shared easing curve.',
  iconography: 'Lucide, one stroke weight, inline with text.',
  focus: 'The focus ring and interaction states.',
}

/** A small, purpose-built visual per foundation topic — component-style
    previews so the index reads as an explorer, mirroring the overview cards. */
const PREVIEWS: Record<string, ReactNode> = {
  brand: (
    <div className="flex flex-col items-center gap-3">
      <Mark className="h-10 w-10" />
      <div className="flex gap-1.5">
        <span className="h-3.5 w-3.5 rounded-full bg-azure" />
        <span className="h-3.5 w-3.5 rounded-full bg-forest" />
        <span className="h-3.5 w-3.5 rounded-full bg-mint" />
        <span className="h-3.5 w-3.5 rounded-full bg-gold" />
      </div>
    </div>
  ),
  colour: (
    <div className="grid grid-cols-5 gap-1.5">
      {['bg-azure-100', 'bg-azure-300', 'bg-azure', 'bg-azure-500', 'bg-azure-600', 'bg-mint', 'bg-gold', 'bg-rose-ink', 'bg-forest-400', 'bg-forest'].map(
        (c, i) => (
          <span key={i} className={cn('h-6 w-6', c)} />
        ),
      )}
    </div>
  ),
  typography: (
    <span className="text-[52px] font-medium leading-none tracking-[-0.03em] text-forest">Aa</span>
  ),
  space: (
    <div className="flex flex-col gap-2">
      {[16, 28, 44, 64].map((w) => (
        <span key={w} className="h-2.5 bg-azure-200" style={{ width: w }} />
      ))}
    </div>
  ),
  layout: (
    <div className="flex w-[172px] gap-2">
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
  shape: (
    <div className="flex items-center gap-3.5">
      <span className="h-11 w-11 border-2 border-forest" />
      <span className="h-6 w-16 rounded-full border-2 border-forest" />
    </div>
  ),
  elevation: (
    <div className="flex items-center gap-4">
      <span className="h-12 w-12 bg-white shadow-card" />
      <span className="h-12 w-12 bg-white shadow-pop" />
    </div>
  ),
  motion: (
    <div className="flex items-center gap-2">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="h-3 w-3 rounded-full bg-azure" style={{ opacity: 1 - i * 0.24 }} />
      ))}
    </div>
  ),
  iconography: (
    <div className="grid grid-cols-4 gap-3.5 text-forest-400">
      <Stethoscope size={20} />
      <Pill size={20} />
      <FlaskConical size={20} />
      <HeartPulse size={20} />
      <CalendarClock size={20} />
      <Users size={20} />
      <ShieldCheck size={20} />
      <Banknote size={20} />
    </div>
  ),
  focus: (
    <span className="flex h-10 items-center border border-azure bg-white px-4 text-[13px] text-forest-400 ring-4 ring-azure-50">
      Focused
    </span>
  ),
}

function Overview() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <p className="max-w-2xl text-[15px] leading-relaxed text-forest-400">
        The complete specification every component is built from — colour, type, spacing, shape,
        elevation, motion and iconography, each mapped to the token that carries it. Change a token
        here and the whole product follows; that is the point.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FOUNDATION_SLUGS.map((slug) => (
          <Link
            key={slug}
            to={`/design/foundations/${slug}` as LinkProps['to']}
            className="group flex flex-col rounded-4xl border border-hair bg-white p-4 transition-[border-color,box-shadow] duration-150 hover:border-navy-200 hover:shadow-card-hover"
          >
            <p className="flex items-center justify-between text-sm font-medium text-forest">
              {TITLES[slug]}
              <ArrowRight
                size={14}
                className="text-forest-200 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-forest-400"
              />
            </p>
            <div className="flex min-h-[116px] flex-1 items-center justify-center overflow-hidden py-4">
              {PREVIEWS[slug]}
            </div>
            <p className="text-[12px] leading-relaxed text-forest-400">{BLURBS[slug]}</p>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-[13px] leading-relaxed text-forest-300">
        Token values are generated from{' '}
        <code className="bg-panel px-1.5 py-0.5 font-mono text-[12px] text-forest-400">
          frontend/src/index.css
        </code>{' '}
        — that file wins any disagreement with a design tool.
      </p>
    </div>
  )
}

/** One Foundations topic per route; `/design/foundations/overview` indexes them. */
export function Foundations() {
  const { slug } = useParams({ strict: false })
  const key = slug ?? 'overview'

  if (key === 'overview') return <Overview />

  const section = FOUNDATION_SECTIONS[key]
  if (!section) return <Navigate to="/design/foundations/$slug" params={{ slug: 'overview' }} replace />

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <StylesOrTokens slug={key}>{section}</StylesOrTokens>
    </div>
  )
}

/**
 * Every foundation is shown two ways: Styles is the visual specimen, Tokens is
 * the machine-readable set behind it, read live from the stylesheet. Splitting
 * them keeps the specimen uncluttered while making the values copy-pasteable.
 */
function StylesOrTokens({ slug, children }: { slug: string; children: ReactNode }) {
  const [view, setView] = useState<'styles' | 'tokens'>('styles')
  const prefixes = TOKEN_LENSES[slug] ?? []

  // A slug change remounts nothing, so reset the view explicitly.
  useEffect(() => setView('styles'), [slug])

  // A foundation with no token family behind it shows the specimen alone,
  // rather than a Tokens tab that opens onto an empty table.
  if (!hasTokens(slug)) return <>{children}</>

  return (
    <>
      <div role="tablist" aria-label="View" className="mb-6 flex items-center gap-0.5">
        {(['styles', 'tokens'] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={view === id}
            onClick={() => setView(id)}
            className={cn(
              'flex h-10 items-center px-3 text-[13px] font-medium capitalize transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50',
              view === id ? 'bg-panel text-forest' : 'text-forest-400 hover:text-forest',
            )}
          >
            {id}
          </button>
        ))}
      </div>

      {view === 'styles' ? children : <TokenTable prefixes={prefixes} />}
    </>
  )
}
