import { cn } from '@/lib/cn'

/**
 * The four approved brand tones. Anything else is off-brand — the lockup is
 * either brand azure, solid ink, or reversed white on a dark/azure surface.
 * `inherit` opts out so the caller can drive the colour with its own text-*
 * class (used by the design-system showcase).
 */
export type LogoTone = 'brand' | 'ink' | 'white' | 'inherit'

const TONE: Record<LogoTone, string> = {
  // `text-(--color-azure)` reads the token directly, so the dark theme's
  // `.text-azure` readability override (→ azure-300) never recolours the
  // brand lockup — it stays #5833FB in both themes, matching bg-azure.
  brand: 'text-(--color-azure)',
  ink: 'text-forest',
  white: 'text-white',
  inherit: '',
}

interface BrandProps {
  className?: string
  tone?: LogoTone
}

/** Mark geometry — shared by the standalone mark and the full lockup. */
function MarkGlyph() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
      <path d="M30 5C16.1929 5 5 16.1929 5 30C5 43.8071 16.1929 55 30 55V5Z" />
      <path d="M30 5C43.8071 5 55 16.1929 55 30C55 43.8071 43.8071 55 30 55V5Z" strokeLinecap="butt" />
      <path d="M28.5897 41.7227H8.604" />
      <path d="M53.5723 30H5.7832" />
      <path d="M28.5897 18.6163H8.604" />
    </g>
  )
}

/**
 * The Rednoxx mark — the brand circle glyph. Drawn inline (same geometry as
 * /mark.svg, which the favicon uses) so it can take any approved tone.
 */
export function Mark({ className, tone = 'brand' }: BrandProps) {
  return (
    <svg
      viewBox="0 0 60 60"
      aria-hidden="true"
      focusable="false"
      className={cn('block shrink-0', TONE[tone], className)}
    >
      <MarkGlyph />
    </svg>
  )
}

/** Full Rednoxx logotype (mark + wordmark) — same artwork as /logo.svg. */
export function Logo({ className, tone = 'brand' }: BrandProps) {
  return (
    <svg
      viewBox="0 0 345 60"
      role="img"
      aria-label="Rednoxx"
      focusable="false"
      className={cn('block h-7 w-auto max-w-full select-none', TONE[tone], className)}
    >
      <MarkGlyph />
      <g fill="currentColor">
        <path d="M69 55.35V7.965H92.075C101.695 7.965 107.285 12.97 107.285 20.705C107.285 26.23 104.295 30.52 99.29 32.08C105.595 33.38 106.44 36.24 106.44 40.92V52.1C106.44 53.14 106.57 54.31 107.545 54.635V55.35H99.615C99.03 54.505 98.705 53.4 98.705 51.19V42.09C98.705 37.67 97.665 35.525 93.115 35.525H76.735V55.35H69ZM76.735 29.025H90.97C96.235 29.025 99.16 26.425 99.16 21.745C99.16 17.065 96.17 14.66 91.035 14.66H76.735V29.025Z" />
        <path d="M131.878 56C121.218 56 114.003 49.045 114.003 37.02C114.003 25.45 120.568 17.91 131.618 17.91C142.278 17.91 149.168 24.995 148.193 38.905H121.543C122.128 46.38 125.833 49.89 131.943 49.89C137.078 49.89 140.393 47.485 141.173 43.325L147.803 44.95C146.438 51.58 140.393 56 131.878 56ZM131.488 23.76C126.353 23.76 122.583 26.75 121.673 33.445H140.458C140.588 27.595 137.273 23.76 131.488 23.76Z" />
        <path d="M153.231 37.15C153.231 25.385 159.471 17.91 169.156 17.91C174.551 17.91 178.646 20.12 180.921 24.215V4H188.461V55.35H181.441L180.986 49.305C178.906 53.53 174.421 56 168.961 56C159.276 56 153.231 48.655 153.231 37.15ZM160.966 37.15C160.966 45.145 164.476 49.63 170.716 49.63C176.956 49.63 180.921 45.405 180.921 38.84V35.33C180.921 28.57 177.021 24.28 170.781 24.28C164.476 24.28 160.966 28.895 160.966 37.15Z" />
        <path d="M197.455 55.35V18.56H204.41L204.8 23.955C207.855 19.795 211.625 17.91 216.63 17.91C224.04 17.91 229.24 22.135 229.24 30.715V55.35H221.7V31.625C221.7 27.27 219.165 24.605 214.29 24.605C209.285 24.605 205.125 27.985 205.06 33.51V55.35H197.455Z" />
        <path d="M254.005 56C243.15 56 236.195 48.395 236.195 37.02C236.195 25.45 243.215 17.91 254.005 17.91C264.795 17.91 271.75 25.45 271.75 36.955C271.75 48.46 264.795 56 254.005 56ZM254.005 49.63C260.375 49.63 264.145 44.885 264.145 36.89C264.145 28.895 260.375 24.28 254.005 24.28C247.57 24.28 243.8 29.025 243.8 36.955C243.8 44.95 247.57 49.63 254.005 49.63Z" />
        <path d="M273.149 55.35L286.214 36.24L274.124 18.56H282.639L290.764 31.43L298.889 18.56H307.209L295.249 35.98L308.314 55.35H299.929L290.634 40.92L281.404 55.35H273.149Z" />
        <path d="M309.33 55.35L322.395 36.24L310.305 18.56H318.82L326.945 31.43L335.07 18.56H343.39L331.43 35.98L344.495 55.35H336.11L326.815 40.92L317.585 55.35H309.33Z" />
      </g>
    </svg>
  )
}
