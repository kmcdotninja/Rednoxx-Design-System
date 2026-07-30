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

/** Read every custom property declared on `:root` / `:host`. */
export function readCssTokens(): Token[] {
  if (typeof document === 'undefined') return []

  const seen = new Map<string, string>()
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      // Cross-origin sheet — not ours, and not readable. Skip it.
      continue
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) continue
      if (!/:root|:host/.test(rule.selectorText)) continue
      for (const prop of Array.from(rule.style)) {
        if (prop.startsWith('--')) seen.set(prop, rule.style.getPropertyValue(prop).trim())
      }
    }
  }

  const computed = getComputedStyle(document.documentElement)
  return Array.from(seen, ([name, value]) => {
    const resolved = computed.getPropertyValue(name).trim()
    return { name, value, resolved: resolved && resolved !== value ? resolved : undefined }
  }).sort((a, b) => a.name.localeCompare(b.name))
}

/** Tokens whose name starts with any of `prefixes`. */
export function tokensMatching(tokens: Token[], prefixes: string[]): Token[] {
  return tokens.filter((t) => prefixes.some((p) => t.name.startsWith(p)))
}

/**
 * Which token families belong to which Foundations page.
 *
 * Only four foundations are token-backed: colour, type, spacing and shape.
 * The rest — brand, layout, elevation, motion, focus, iconography — are rules
 * about how those four are applied, so they carry no Tokens view at all rather
 * than a thin or borrowed one.
 */
export const TOKEN_PREFIXES: Record<string, string[]> = {
  colour: ['--color-'],
  typography: ['--font-', '--text-', '--leading-', '--tracking-'],
  space: ['--spacing'],
  shape: ['--radius-'],
}

/** Whether a Foundations page has a Tokens view. */
export function hasTokens(slug: string): boolean {
  return Boolean(TOKEN_PREFIXES[slug]?.length)
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
