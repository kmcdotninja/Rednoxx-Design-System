import { useEffect, type ReactNode } from 'react'
import {
  ArrowRight,
  CalendarClock,
  Check,
  GitMerge,
  Hash,
  ListChecks,
  Lock,
  Network,
  ScrollText,
  Search,
  ShieldAlert,
  Trash2,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { Link, type LinkProps } from '@tanstack/react-router'
import { cn } from '@/lib/cn'
import { PATTERN_ARTICLES } from '../articles/patterns'
import { PreviewFallback } from './previews'

/** Icon tile — the fallback preview for the more abstract patterns. */
function Tile({ icon: Icon, tone = 'azure' }: { icon: LucideIcon; tone?: 'azure' | 'rose' | 'mint' | 'gold' }) {
  const toneCls = {
    azure: 'bg-azure-50 text-azure',
    rose: 'bg-rose-soft text-rose-ink',
    mint: 'bg-mint-soft text-mint',
    gold: 'bg-gold-soft text-gold-600',
  }[tone]
  return (
    <span className={cn('flex h-14 w-14 items-center justify-center', toneCls)}>
      <Icon size={26} strokeWidth={1.6} aria-hidden />
    </span>
  )
}

/**
 * Component-style previews per pattern — the visual clinical-safety ones get a
 * mini-UI (a banner, an allergy chip, a dose field); the more abstract ones get
 * a tinted icon tile, tinted to their meaning (rose = danger, gold = caution).
 */
const PREVIEWS: Record<string, ReactNode> = {
  'patient-identification': (
    <div className="flex items-center gap-2.5 border border-hair bg-white px-3 py-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-azure-100 text-[11px] font-medium text-azure-600">
        TB
      </span>
      <span>
        <span className="block text-[12px] font-medium text-forest">Tunde Bakare</span>
        <span className="tnum block font-mono text-[10px] text-forest-400">GGH-005104</span>
      </span>
    </div>
  ),
  alerts: (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-soft px-2.5 py-1 text-[11px] font-medium text-rose-ink">
      <TriangleAlert size={12} aria-hidden /> Penicillin allergy
    </span>
  ),
  'numeric-entry': (
    <span className="inline-flex items-center border border-hair bg-white px-3 py-2 text-[15px] text-forest">
      <span className="tnum font-medium">500</span>
      <span className="ml-1 text-[13px] text-forest-400">mg</span>
    </span>
  ),
  'order-signing': (
    <span className="inline-flex items-center gap-2 text-[12px] text-forest-500">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint-soft text-mint">
        <Check size={14} aria-hidden />
      </span>
      Signed · Dr. Alade
    </span>
  ),
  'destructive-actions': (
    <span className="inline-flex items-center gap-1.5 bg-rose-ink px-3 py-2 text-[12px] font-medium text-white">
      <Trash2 size={13} aria-hidden /> Delete record
    </span>
  ),
  'search-before-create': (
    <span className="inline-flex w-44 items-center gap-2 border border-hair bg-white px-2.5 py-2 text-[12px] text-forest-300">
      <Search size={13} aria-hidden /> Search MRN or name…
    </span>
  ),
  'result-flagging': <Tile icon={TriangleAlert} tone="gold" />,
  override: <Tile icon={ShieldAlert} tone="gold" />,
  worklist: <Tile icon={ListChecks} />,
  merge: <Tile icon={GitMerge} />,
  fhir: <Tile icon={Network} />,
  'coded-values': <Tile icon={Hash} />,
  dates: <Tile icon={CalendarClock} />,
  rbac: <Tile icon={Lock} />,
  'break-glass': <Tile icon={ShieldAlert} tone="rose" />,
  'audit-trail': <Tile icon={ScrollText} />,
}

/**
 * The Patterns landing — a card explorer, matching Components/Blocks/Foundations
 * rather than a bare list. Titles and summaries come straight from the pattern
 * articles, so this never drifts from them; the "overview" entry is the intro,
 * not a card.
 */
export function PatternsIndex() {
  useEffect(() => {
    document.title = 'Patterns — Rednoxx Design System'
    return () => {
      document.title = 'Rednoxx — Healthcare Platform Design System'
    }
  }, [])

  const overview = PATTERN_ARTICLES.find((a) => a.slug === 'overview')
  const patterns = PATTERN_ARTICLES.filter((a) => a.slug !== 'overview')

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <p className="max-w-2xl text-[15px] leading-relaxed text-forest-400">
        {overview?.summary ??
          'Cross-cutting rules the whole product obeys — patient identity, alerts, dose entry, signing and destructive actions. Each is a safety contract, not a suggestion.'}
      </p>
      <p className="mt-2 text-[13px] tabular-nums text-forest-300">{patterns.length} patterns</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => (
          <Link
            key={pattern.slug}
            to={`/design/patterns/${pattern.slug}` as LinkProps['to']}
            className="group flex flex-col rounded-4xl border border-hair bg-white p-4 transition-[border-color,box-shadow] duration-150 hover:border-navy-200 hover:shadow-card-hover"
          >
            <p className="flex items-center justify-between text-sm font-medium text-forest">
              {pattern.title}
              <ArrowRight
                size={14}
                className="text-forest-200 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-forest-400"
              />
            </p>
            <div className="flex min-h-[116px] flex-1 items-center justify-center overflow-hidden py-4">
              {PREVIEWS[pattern.slug] ?? <PreviewFallback label={pattern.title} />}
            </div>
            <p className="text-[12px] leading-relaxed text-forest-400">{pattern.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
