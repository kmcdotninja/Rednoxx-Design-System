export type ClassValue =
  | string
  | false
  | null
  | undefined
  | Record<string, boolean | null | undefined>

/** Tiny className joiner (clsx-style) — strings plus conditional object maps. */
export function cn(...parts: ClassValue[]): string {
  const out: string[] = []
  for (const part of parts) {
    if (!part) continue
    if (typeof part === 'string') {
      out.push(part)
    } else {
      for (const [key, on] of Object.entries(part)) {
        if (on) out.push(key)
      }
    }
  }
  return out.join(' ')
}
