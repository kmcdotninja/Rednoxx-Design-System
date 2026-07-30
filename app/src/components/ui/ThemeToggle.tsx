import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/lib/theme'

/**
 * Light/dark theme switch — one icon button, mounted once per shell header.
 * The whole re-skin happens at the token layer (`:root.dark` in index.css);
 * this control only flips the class via `useTheme`. `aria-pressed` announces
 * the current state; the label always names the action, not the state.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'
  const label = dark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={dark}
      title={label}
      className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center text-forest-500 transition-colors',
        'hover:bg-panel hover:text-forest',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50',
        className,
      )}
    >
      {dark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  )
}
