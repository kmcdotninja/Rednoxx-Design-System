import { useCallback, useSyncExternalStore } from 'react'

/**
 * Theme state — dark mode is a token-value flip, not a component concern.
 *
 * The source of truth is the `dark` class on <html>: `index.css` overrides the
 * design-token custom properties under `:root.dark`, so every component that
 * reads tokens (all of them) re-skins automatically. This module owns the
 * class: it reads localStorage('theme') and defaults to LIGHT — the light theme
 * leads; dark is an explicit opt-in via the toggle, never inferred from the
 * OS. A tiny inline script in `index.html` applies the same logic before
 * first paint so a chosen dark session never flashes light.
 */

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

const listeners = new Set<() => void>()

/** The user's explicit choice, or null when they follow the system. */
export function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

/** The theme in effect right now — explicit choice, else light (light leads). */
export function resolvedTheme(): Theme {
  return storedTheme() ?? 'light'
}

function apply() {
  // A theme flip changes color/background/border on nearly every element at
  // once; 60+ components declare transition-colors, so without suppression
  // the switch smears instead of snapping. Disable transitions for the flip,
  // force a reflow, restore on the next frame. [data-theme-transition]
  // subtrees (the toggle's icon cross-fade) are exempt — that fade IS the
  // flip's feedback.
  const style = document.createElement('style')
  style.textContent =
    '*:not([data-theme-transition] *),*::before,*::after{transition:none!important}'
  document.head.appendChild(style)
  document.documentElement.classList.toggle('dark', resolvedTheme() === 'dark')
  void document.documentElement.offsetHeight
  requestAnimationFrame(() => style.remove())
  listeners.forEach((notify) => notify())
}

/** Set an explicit theme, or pass null to return to the light default. */
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
