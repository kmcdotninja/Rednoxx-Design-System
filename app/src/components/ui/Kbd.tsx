import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Keyboard-key chip for shortcut hints — pair inside menus and tooltips. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-[20px] min-w-[20px] items-center justify-center rounded-lg border border-hair bg-panel px-1.5',
        'font-sans text-[11px] font-medium text-forest-500 shadow-chip',
        className,
      )}
    >
      {children}
    </kbd>
  )
}
