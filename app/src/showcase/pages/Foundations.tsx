import { useState } from 'react'
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
import { Button, Card, Tag } from '@/components/ui'
import { Logo, Mark } from '@/components/Logo'

interface Swatch {
  name: string
  hex: string
  note?: string
  /** Dark swatches get light captions. */
  ink?: boolean
}

const INK: Swatch[] = [
  { name: 'navy-50', hex: '#f4f4f6' },
  { name: 'navy-100', hex: '#e9e9ee' },
  { name: 'navy-200', hex: '#d4d4dd' },
  { name: 'navy-300', hex: '#70707f', note: 'muted text', ink: true },
  { name: 'navy-400', hex: '#515160', note: 'secondary text', ink: true },
  { name: 'navy-500', hex: '#3e3e4c', ink: true },
  { name: 'navy', hex: '#171723', note: 'primary ink', ink: true },
  { name: 'navy-900', hex: '#0a0a11', ink: true },
]

const ACCENT: Swatch[] = [
  { name: 'azure-50', hex: '#f3f1ff' },
  { name: 'azure-100', hex: '#e9e4ff' },
  { name: 'azure-200', hex: '#d4cbfe' },
  { name: 'azure-300', hex: '#ab97fd' },
  { name: 'azure', hex: '#5833fb', note: 'brand · 6.4:1', ink: true },
  { name: 'azure-500', hex: '#4a28e0', ink: true },
  { name: 'azure-600', hex: '#3c1ec2', ink: true },
]

const STATUS: Swatch[] = [
  { name: 'mint', hex: '#15803d', note: 'success', ink: true },
  { name: 'gold', hex: '#e0a526', note: 'warning' },
  { name: 'gold-600', hex: '#9a6b0f', note: 'warning text', ink: true },
  { name: 'rose-ink', hex: '#b91c1c', note: 'danger', ink: true },
]

function SwatchRow({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
      {swatches.map((s) => (
        <div key={s.name} className="min-w-0">
          <div
            className="flex h-14 items-end rounded-2xl border border-black/5 px-2.5 pb-2"
            style={{ background: s.hex }}
          >
            {s.note && (
              <span className={`text-[10px] font-medium ${s.ink ? 'text-white/80' : 'text-navy-500'}`}>
                {s.note}
              </span>
            )}
          </div>
          <p className="mt-1.5 truncate text-[11px] font-medium text-forest-500">{s.name}</p>
          <p className="tnum text-[11px] uppercase text-forest-300">{s.hex}</p>
        </div>
      ))}
    </div>
  )
}

const TYPE_SCALE = [
  { name: 'Display', cls: 'text-[26px] font-medium tracking-[-0.02em]', sample: 'Facility performance' },
  { name: 'Title', cls: 'text-[17px] font-medium tracking-[-0.01em]', sample: 'Advanced reporting' },
  { name: 'Heading', cls: 'text-[15px] font-medium tracking-[-0.01em]', sample: 'Today’s clinic' },
  { name: 'Body', cls: 'text-sm', sample: 'Results from the analyser are delayed by roughly 20 minutes.' },
  { name: 'Caption', cls: 'text-[13px] text-forest-400', sample: 'vs 3,554 last period' },
  { name: 'Micro', cls: 'text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300', sample: 'Clinical' },
]

const RADII = [
  { name: 'surfaces · 0px', cls: 'rounded-2xl', box: 'h-16 w-16' },
  { name: 'cards · 0px', cls: 'rounded-4xl', box: 'h-24 w-24' },
  { name: 'pills · full', cls: 'rounded-full', box: 'h-9 w-24' },
  { name: 'avatars · full', cls: 'rounded-full', box: 'h-14 w-14' },
]

const SHADOWS = [
  { name: 'shadow-card', note: 'resting cards', style: 'var(--shadow-card)' },
  { name: 'shadow-card-hover', note: 'lifted on hover', style: 'var(--shadow-card-hover)' },
  { name: 'shadow-soft', note: 'quiet chrome', style: 'var(--shadow-soft)' },
  { name: 'shadow-pop', note: 'popovers & modals', style: 'var(--shadow-pop)' },
]

function MotionTile({ label, animation }: { label: string; animation: string }) {
  const [run, setRun] = useState(0)
  return (
    <div className="flex flex-col items-start gap-3 rounded-3xl border border-hair bg-white p-4">
      <div key={run} className={`${animation} flex h-16 w-full items-center justify-center rounded-2xl bg-panel`}>
        <HeartPulse size={18} className="text-azure" aria-hidden />
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

export function Foundations() {
  return (
    <div className="space-y-12">
      <header className="animate-rise">
        <h1 className="text-[26px] font-medium tracking-[-0.02em] text-forest">Foundations</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-forest-400">
          The tokens every component is built from. Change a token here and the whole product
          follows — that is the point.
        </p>
      </header>

      {/* Brand */}
      <section className="animate-rise" style={{ animationDelay: '60ms' }}>
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">Brand</h2>
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
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-forest-400">
          The mark and logotype live in <span className="font-mono">/public</span> so the favicon
          and in-app brand always match. The wordmark keeps its own violet — never recolour it.
        </p>
      </section>

      {/* Color */}
      <section className="animate-rise" style={{ animationDelay: '120ms' }}>
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">Colour</h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-forest-400">
          Near-black ink on white surfaces carries the interface; the brand violet is reserved for
          accents, focus and data. Status colours never appear without a text label.
        </p>
        <div className="mt-5 space-y-6">
          <div>
            <p className="mb-2.5 text-[13px] font-medium text-forest-500">Ink</p>
            <SwatchRow swatches={INK} />
          </div>
          <div>
            <p className="mb-2.5 text-[13px] font-medium text-forest-500">Accent · brand violet</p>
            <SwatchRow swatches={ACCENT} />
          </div>
          <div>
            <p className="mb-2.5 text-[13px] font-medium text-forest-500">Status</p>
            <SwatchRow swatches={STATUS} />
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="animate-rise" style={{ animationDelay: '180ms' }}>
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">Typography</h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-forest-400">
          Geist for everything, Geist Mono for code and identifiers. Numbers that update wear
          tabular figures (<span className="font-mono">.tnum</span>) so nothing shifts.
        </p>
        <Card className="mt-4 divide-y divide-hair/70 p-0" pad={false}>
          {TYPE_SCALE.map((t) => (
            <div key={t.name} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-5 py-4 sm:px-6">
              <span className="w-20 shrink-0 text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
                {t.name}
              </span>
              <span className={`${t.cls} text-forest`}>{t.sample}</span>
            </div>
          ))}
        </Card>
      </section>

      {/* Radius */}
      <section className="animate-rise" style={{ animationDelay: '240ms' }}>
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">Radius</h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-forest-400">
          Square corners, Carbon-style: every structural surface — buttons, inputs, cards,
          popovers, overlays — sits at 0px. Only pills, dots, toggles and avatars stay fully
          round, which keeps status and identity instantly tellable from structure.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-5 rounded-4xl border border-hair bg-white p-6">
          {RADII.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div className={`${r.box} ${r.cls} border border-navy-200 bg-panel`} />
              <span className="font-mono text-[11px] text-forest-400">{r.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Elevation */}
      <section className="animate-rise" style={{ animationDelay: '300ms' }}>
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">Elevation</h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-forest-400">
          Layered transparent shadows (a 1px ring plus a soft lift) instead of heavy borders —
          they read cleanly on any surface.
        </p>
        <div className="mt-4 grid gap-4 rounded-4xl bg-panel p-6 sm:grid-cols-2 lg:grid-cols-4">
          {SHADOWS.map((s) => (
            <div key={s.name} className="rounded-3xl bg-white p-4" style={{ boxShadow: s.style }}>
              <p className="font-mono text-[12px] text-forest-500">{s.name}</p>
              <p className="mt-0.5 text-[11px] text-forest-300">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Motion */}
      <section className="animate-rise" style={{ animationDelay: '360ms' }}>
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">Motion</h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-forest-400">
          Two entrances cover nearly everything: <span className="font-mono">rise</span> for page
          content, <span className="font-mono">pop</span> for overlays. Every animation is
          disabled under <span className="font-mono">prefers-reduced-motion</span>.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <MotionTile label="animate-rise · 400ms" animation="animate-rise" />
          <MotionTile label="animate-pop · 160ms" animation="animate-pop" />
        </div>
      </section>

      {/* Iconography */}
      <section className="animate-rise" style={{ animationDelay: '420ms' }}>
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">Iconography</h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-forest-400">
          Lucide, stroke-based, at 14–18px depending on density. Icons never carry meaning alone —
          they always sit beside a label or an aria-label.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-4xl border border-hair bg-white p-6">
          {[Stethoscope, Pill, FlaskConical, CalendarClock, Users, Banknote, ShieldCheck, HeartPulse].map(
            (Icon, i) => (
              <span key={i} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-panel text-forest-500">
                <Icon size={18} aria-hidden />
              </span>
            ),
          )}
          <Tag className="ml-2">lucide-react</Tag>
        </div>
      </section>
    </div>
  )
}
