import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Two regions of the Shell are owned by the frame but filled by the page: the
 * Controls rail and the page-header tab strip. The frame stays fixed while
 * their contents change with the route.
 *
 * The Shell hands each region's element down and pages portal into it. Passing
 * the element (rather than storing a ReactNode in Shell state) keeps the page's
 * subtree in its own render tree, so control state survives navigation within a
 * page and nothing re-renders the Shell.
 */
interface Slots {
  rail: HTMLElement | null
  header: HTMLElement | null
  /** Set while a page actually has controls mounted, so the Shell can hide an empty rail. */
  setRailActive: (active: boolean) => void
}

const SlotContext = createContext<Slots>({
  rail: null,
  header: null,
  setRailActive: () => {},
})

export function ShellSlotProvider({ value, children }: { value: Slots; children: ReactNode }) {
  return <SlotContext.Provider value={value}>{children}</SlotContext.Provider>
}

/** Shell-side: a callback ref plus the element it captured. */
export function useSlotTarget() {
  return useState<HTMLElement | null>(null)
}

/**
 * Page-side: render `children` into the Shell's Controls rail, and tell the
 * Shell the rail is in use — so tabs without controls (Examples, Props) show
 * no empty panel.
 */
export function ControlsRail({ children }: { children: ReactNode }) {
  const { rail, setRailActive } = useContext(SlotContext)

  useEffect(() => {
    setRailActive(true)
    return () => setRailActive(false)
  }, [setRailActive])

  if (!rail) return null
  return createPortal(children, rail)
}

/** Page-side: render `children` into the page header, beside the title. */
export function HeaderSlot({ children }: { children: ReactNode }) {
  const { header } = useContext(SlotContext)
  if (!header) return null
  return createPortal(children, header)
}
