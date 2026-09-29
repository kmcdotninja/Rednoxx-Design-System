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
      {/* Both icons stay in the DOM and cross-fade (opacity/scale/blur) —
          exempt from the flip's transition suppression via the data attr. */}
      <span data-theme-transition className="relative flex h-4 w-4 items-center justify-center" aria-hidden>
        <Sun
          size={16}
          className={cn(
            'absolute transition-[opacity,scale,filter] duration-200 [transition-timing-function:cubic-bezier(0.2,0,0,1)]',
            dark ? 'scale-100 opacity-100 blur-0' : 'scale-[0.25] opacity-0 blur-[4px]',
          )}
        />
        <Moon
          size={16}
          className={cn(
            'absolute transition-[opacity,scale,filter] duration-200 [transition-timing-function:cubic-bezier(0.2,0,0,1)]',
            dark ? 'scale-[0.25] opacity-0 blur-[4px]' : 'scale-100 opacity-100 blur-0',
          )}
        />
      </span>
    </button>
  )
}
