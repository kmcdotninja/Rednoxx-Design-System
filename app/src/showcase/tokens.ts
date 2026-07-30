/**
 * Design tokens, read from the running stylesheet rather than re-typed here.
 *
 * Tailwind v4 compiles `@theme` in index.css into custom properties on
 * `:root`, so enumerating those rules gives the live token set. A hand-kept
 * list would drift the first time someone edits a token and forgets the docs;
 * this cannot.
 */

export interface Token {
  /** Full custom-property name, e.g. `--color-azure-500`. */
  name: string
  /** Declared value, e.g. `#4a28e0`. */
  value: string
  /** Value with `var(--x)` indirection resolved, when it differs. */
  resolved?: string
}

/**
 * Collect `:root` / `:host` custom properties from a rule list, recursing into
 * grouping rules.
 *
 * The recursion is the whole point: Tailwind v4 emits the compiled theme as
 * `@layer theme { :root, :host { --color-azure: …; } }`. A layer block is a
 * CSSLayerBlockRule, not a CSSStyleRule, so a flat scan of the top-level rules
 * walks straight past every token and reports an empty set. Media, supports and
 * container blocks nest the same way, and a style rule can itself hold nested
 * rules, so each rule is inspected *and* descended into.
 */
function collectRootProps(rules: CSSRuleList, into: Map<string, string>): void {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule && /:root|:host/.test(rule.selectorText)) {
      for (const prop of Array.from(rule.style)) {
        if (prop.startsWith('--')) into.set(prop, rule.style.getPropertyValue(prop).trim())
      }
    }
    // CSSGroupingRule (layer/media/supports/container) — and nested style rules.
    const nested = (rule as CSSGroupingRule).cssRules
    if (nested) collectRootProps(nested, into)
  }
}

/** Read every custom property declared on `:root` / `:host`. */
export function readCssTokens(): Token[] {
  if (typeof document === 'undefined') return []

  const seen = new Map<string, string>()
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      collectRootProps(sheet.cssRules, seen)
    } catch {
      // Cross-origin sheet — not ours, and not readable. Skip it.
      continue
    }
  }

  const computed = getComputedStyle(document.documentElement)
  return Array.from(seen, ([name, value]) => {
    const resolved = computed.getPropertyValue(name).trim()
    return { name, value, resolved: resolved && resolved !== value ? resolved : undefined }
  }).sort((a, b) => a.name.localeCompare(b.name))
}

/** Live value of one custom property, or null when it isn't declared. */
export function cssVarValue(name: string): string | null {
  if (typeof document === 'undefined') return null
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || null
}

/**
 * A CSS length in px, resolving `rem` against the document's root font size —
 * so the spacing specimen quotes real pixels instead of assuming a 16px root.
 */
export function lengthToPx(value: string | null): number | null {
  if (!value) return null
  const n = parseFloat(value)
  if (Number.isNaN(n)) return null
  if (value.endsWith('rem') || value.endsWith('em')) {
    if (typeof document === 'undefined') return null
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize)
    return Number.isNaN(root) ? null : n * root
  }
  return n
}

/**
 * Tokens matching any of `patterns` — a prefix, or an exact name when the
 * pattern ends in `$`.
 *
 * The exact form exists because three legacy alias names (`lime`, `teal`,
 * `orange`) are also Tailwind default ramps: `--color-teal` as a prefix would
 * drag in `--color-teal-100` from Tailwind's palette wherever app code still
 * references it, and list it as though it were part of this design system.
 */
export function tokensMatching(tokens: Token[], patterns: string[]): Token[] {
  return tokens.filter((t) =>
    patterns.some((p) => (p.endsWith('$') ? t.name === p.slice(0, -1) : t.name.startsWith(p))),
  )
}

/** Mark lens entries as exact names rather than prefixes. */
function exact(...names: string[]): string[] {
  return names.map((name) => `${name}$`)
}

/**
 * Which token families belong to which Foundations page — and so which pages
 * carry the Styles/Tokens tabs at all.
 *
 * Six foundations own a scale: colour, type, spacing, shape, elevation and
 * icon sizing. Brand, layout, motion and focus are rules about how those
 * scales are applied — they read tokens (the layout measures and motion curves
 * are in the theme, listed on their own pages) but own no family of their own,
 * so they show the specimen alone rather than a borrowed token table.
 */
export const TOKEN_LENSES: Record<string, string[]> = {
  /* Named ramp by ramp, not a bare `--color-` sweep: Tailwind's own default
     palette is in `:root` too wherever app code still references it, and a
     table that listed `--color-amber-300` beside the ink ramp would read as a
     licence to use amber. Same reasoning for type — the scale is closed at ten
     roles, so Tailwind's `--text-xs … --text-9xl` are deliberately not shown.
     The cost is that a NEW ramp or role must be added here as well as to
     `@theme`; the Styles specimen needs the same edit, so they move together. */
  colour: [
    '--color-navy',
    '--color-azure',
    '--color-mint',
    '--color-gold',
    '--color-rose-soft',
    '--color-rose-ink',
    '--color-canvas',
    '--color-panel',
    '--color-hair',
    // Legacy aliases — still resolved by older primitives. lime/teal/orange are
    // Tailwind ramp names too, so they are matched exactly, step by step.
    '--color-forest',
    ...exact(
      '--color-lime',
      '--color-lime-50',
      '--color-lime-100',
      '--color-lime-200',
      '--color-lime-300',
      '--color-lime-500',
      '--color-lime-600',
      '--color-teal',
      '--color-teal-soft',
      '--color-orange',
      '--color-orange-soft',
      '--color-orange-600',
    ),
  ],
  typography: [
    '--font-sans',
    '--font-mono',
    '--text-display',
    '--text-page-title',
    '--text-title',
    '--text-section',
    '--text-heading',
    '--text-body',
    '--text-secondary',
    '--text-caption',
    '--text-overline',
    '--text-micro',
  ],
  space: ['--spacing'],
  // `--radius` first (the one real decision), then the size aliases that
  // resolve to it — the table shows the indirection rather than eight zeroes.
  shape: [...exact('--radius'), '--radius-'],
  elevation: ['--shadow-'],
  iconography: ['--spacing-icon-'],
}

/** Whether a Foundations page has a Tokens view. */
export function hasTokens(slug: string): boolean {
  return Boolean(TOKEN_LENSES[slug]?.length)
}

/* --------------------------------------------------------------------------
   Colour maths — hex → OKLCH, for the swatch readout. OKLCH is the useful
   space to quote in a design system: lightness is perceptual, so two ramps
   with matching L read as the same step even across hues. */

function srgbToLinear(c: number) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** Parse `#rgb` / `#rrggbb` into 0–1 channels; null for anything else. */
function parseHex(hex: string): [number, number, number] | null {
  const m = hex.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!m) return null
  const raw = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1]
  const int = parseInt(raw, 16)
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255]
}

/**
 * Convert a hex colour to an `oklch(L% C H)` string.
 * sRGB → linear → LMS → OKLab → OKLCH, per Björn Ottosson's definition.
 */
export function hexToOklch(hex: string): string | null {
  const rgb = parseHex(hex)
  if (!rgb) return null
  const [r, g, b] = rgb.map(srgbToLinear)

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const chroma = Math.sqrt(A * A + B * B)
  const hue = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360

  return `oklch(${(L * 100).toFixed(1)}% ${chroma.toFixed(3)} ${hue.toFixed(1)})`
}
