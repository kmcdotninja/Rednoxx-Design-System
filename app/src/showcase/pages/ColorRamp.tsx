import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { hexToOklch } from '../tokens'

/** WCAG grade for a contrast ratio, as body text. */
function grade(ratio: number): 'AAA' | 'AA' | 'AA lg' | 'Fail' {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA lg'
  return 'Fail'
}

export interface RampStop {
  /** Step label shown inside the band, e.g. `500`. */
  step: string
  /** Token name without the `--color-` prefix, e.g. `azure-500`. */
  token: string
  hex: string
  /** Contrast against white, where this tone is legal as text. */
  ratio?: number
  /** Light text needed on this band. */
  ink?: boolean
}

/**
 * One colour family as a stacked ramp.
 *
 * Bands sit flush so the ramp reads as a single continuous scale — the point
 * of a ramp is the relationship between steps, which gaps destroy. Hovering a
 * band floats its token and OKLCH value above the column; clicking copies the
 * Tailwind class. OKLCH is quoted because its lightness is perceptual, so the
 * same step across two families should read as the same weight.
 */
export function ColorRamp({ name, stops }: { name: string; stops: RampStop[] }) {
  const [hovered, setHovered] = useState<RampStop | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async (stop: RampStop) => {
    try {
      await navigator.clipboard.writeText(stop.token)
      setCopied(stop.token)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(null), 1400)
    } catch {
      // Clipboard blocked — the readout still shows the value.
    }
  }

  const readout = hovered ?? null

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13px] font-medium text-forest">{name}</p>
        {/* Reserve the row so the ramp never shifts when the readout appears. */}
        <p className="h-4 truncate font-mono text-[11px] text-forest-400">
          {readout ? `${readout.token} · ${hexToOklch(readout.hex) ?? readout.hex}` : ''}
        </p>
      </div>

      <div
        className="mt-2 overflow-hidden border border-hair"
        onMouseLeave={() => setHovered(null)}
      >
        {stops.map((stop) => {
          const isCopied = copied === stop.token
          return (
            <button
              key={stop.token}
              type="button"
              onMouseEnter={() => setHovered(stop)}
              onFocus={() => setHovered(stop)}
              onBlur={() => setHovered(null)}
              onClick={() => copy(stop)}
              title={`${stop.token} · ${stop.hex}`}
              aria-label={`Copy ${stop.token}`}
              className={cn(
                'flex h-10 w-full items-center justify-between px-3 text-left transition-[filter]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure/60',
                'hover:brightness-[0.97]',
              )}
              style={{ background: stop.hex }}
            >
              <span
                className={cn(
                  'tnum text-[12px] font-medium',
                  stop.ink ? 'text-white/90' : 'text-navy-500',
                )}
              >
                {stop.step}
              </span>
              <span
                className={cn(
                  'tnum text-[11px] transition-opacity',
                  stop.ink ? 'text-white/70' : 'text-navy-400',
                  isCopied ? 'opacity-100' : 'opacity-0',
                )}
              >
                Copied
              </span>
              {stop.ratio != null && !isCopied && (
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn('tnum text-[11px]', stop.ink ? 'text-white/70' : 'text-navy-400')}
                  >
                    {stop.ratio}:1
                  </span>
                  {/* The grade, not just the number — a ratio alone doesn't say
                      whether this tone is legal as text. */}
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-px text-[9px] font-medium',
                      grade(stop.ratio) === 'AAA' || grade(stop.ratio) === 'AA'
                        ? 'bg-mint-soft text-mint'
                        : 'bg-gold-soft text-gold-600',
                    )}
                  >
                    {grade(stop.ratio)}
                  </span>
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Turn the existing swatch list into ramp stops, deriving the step label. */
export function toStops(
  swatches: { name: string; hex: string; ratio?: number; ink?: boolean }[],
  base: string,
): RampStop[] {
  return swatches.map((s) => ({
    step: s.name === base ? '500' : (s.name.split('-').pop() ?? s.name),
    token: s.name,
    hex: s.hex,
    ratio: s.ratio,
    ink: s.ink,
  }))
}
