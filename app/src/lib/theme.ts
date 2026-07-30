import { useCallback, useSyncExternalStore } from 'react'

/**
 * Theme state — dark mode is a token-value flip, not a component concern.
 *
 * The source of truth is the `dark` class on <html>: `index.css` overrides the
 * design-token custom properties under `:root.dark`, so every component that
 * reads tokens (all of them) re-skins automatically. This module owns the
 * class: it reads localStorage('theme'), falls back to the OS preference, and
 * follows OS changes while the user hasn't chosen explicitly. A tiny inline
 * script in `index.html` applies the same logic before first paint so a dark
 * session never flashes light.
 */

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

const listeners = new Set<() => void>()

const media =
  typeof window !== 'undefined' && 'matchMedia' in window
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null

/** The user's explicit choice, or null when they follow the system. */
export function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

/** The theme in effect right now (explicit choice, else OS preference). */
export function resolvedTheme(): Theme {
  return storedTheme() ?? (media?.matches ? 'dark' : 'light')
}

function apply() {
  document.documentElement.classList.toggle('dark', resolvedTheme() === 'dark')
  listeners.forEach((notify) => notify())
}

// While no explicit choice is stored, follow the OS setting live.
media?.addEventListener('change', () => {
  if (!storedTheme()) apply()
})

/** Set an explicit theme, or pass null to return to following the system. */
export function setTheme(theme: Theme | null) {
  try {
    if (theme) localStorage.setItem(STORAGE_KEY, theme)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable — the class still flips for this session */
  }
  apply()
}

function subscribe(notify: () => void) {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

/** The current theme plus a light/dark toggle, shared across every mount. */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const theme = useSyncExternalStore(subscribe, resolvedTheme, () => 'light' as Theme)
  const toggle = useCallback(() => {
    setTheme(resolvedTheme() === 'dark' ? 'light' : 'dark')
  }, [])
  return { theme, toggle }
}
