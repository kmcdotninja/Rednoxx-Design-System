import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronsUpDown, LayoutGrid, type LucideIcon } from 'lucide-react'
import { Modal } from '@/components/ui'
import { cn } from '@/lib/cn'
import { FloatingPill } from './FloatingDock'

export interface ModuleOption {
  /** Stable id used for the active selection and returned by onSwitch. */
  id: string
  name: string
  /** One-line explanation of what the module is for. */
  description?: string
  icon: LucideIcon
}

/** How long the hand-off overlay holds before the caller navigates. */
const SWITCH_HOLD_MS = 1000

/** True when the user has asked the OS to minimise motion. */
function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Module switcher — moves the user between the product's top-level workspaces
 * (Care, Admin, HIM). Unlike the facility/account switchers (a quick dropdown),
 * changing module swaps the *entire* navigation and screen set, so the choice
 * is deliberate: the trigger opens a dialog of full module cards rather than a
 * menu. Single active module at a time — you work inside one workspace.
 *
 * Picking a different module plays a short branded hand-off ("Switching to …")
 * before firing `onSwitch`, so the whole-app navigation reads as intentional.
 * The overlay is skipped under reduced-motion — the switch is immediate.
 *
 * Presentational and generic: the caller owns the module list and the active
 * id, so HIM, the demo and the showcase all render this one block — a single
 * source of truth for switching modules.
 */
export function ModuleSwitcher({
  modules,
  activeId,
  onSwitch,
  compact,
  block,
  floating,
  transition = true,
  title = 'Switch module',
  subtitle = 'You are moving between workspaces — the whole navigation and screen set changes.',
  triggerLabel = 'Switch module',
  className,
}: {
  modules: ModuleOption[]
  activeId: string
  onSwitch: (id: string) => void
  /** Collapsed rail variant — the active module's icon only. */
  compact?: boolean
  /** Stretch the (non-compact) trigger to fill its container — e.g. a sidebar. */
  block?: boolean
  /** Floating-dock variant — a rounded "sticker" pill (see FloatingDock). */
  floating?: boolean
  /** Play the "Switching to …" hand-off before onSwitch. Default true. */
  transition?: boolean
  /** Dialog heading. */
  title?: string
  /** Dialog supporting line under the heading. */
  subtitle?: ReactNode
  /** Accessible name on the trigger (used as its label when compact/floating). */
  triggerLabel?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [switching, setSwitching] = useState<ModuleOption | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const active = modules.find((m) => m.id === activeId) ?? modules[0]
  const ActiveIcon = active?.icon ?? LayoutGrid

  // Don't leave a pending navigation behind if the switcher unmounts first.
  useEffect(() => () => clearTimeout(timer.current), [])

  const choose = (id: string) => {
    setOpen(false)
    if (id === active?.id) return
    const target = modules.find((m) => m.id === id)
    if (!transition || prefersReducedMotion() || !target) {
      onSwitch(id)
      return
    }
    setSwitching(target)
    timer.current = setTimeout(() => {
      onSwitch(id)
      // Retire the overlay. Navigating hosts unmount before this fires; hosts
      // that only swap state (the showcase) rely on it so it never sticks.
      timer.current = setTimeout(() => setSwitching(null), 400)
    }, SWITCH_HOLD_MS)
  }

  return (
    <>
      {floating ? (
        <FloatingPill
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          icon={<ActiveIcon size={16} className="shrink-0 text-azure" aria-hidden />}
          className={className}
        >
          {triggerLabel}
        </FloatingPill>
      ) : compact ? (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={triggerLabel}
          title={triggerLabel}
          onClick={() => setOpen(true)}
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-hair bg-white text-forest transition-colors hover:bg-panel',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50',
            className,
          )}
        >
          <ActiveIcon size={16} className="text-forest-500" aria-hidden />
        </button>
      ) : (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={cn(
            'flex h-9 items-center gap-2 rounded-xl border border-hair bg-white px-2.5 text-left text-[13px] font-medium text-forest transition-colors hover:bg-panel',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50',
            block ? 'w-full' : 'min-w-[9.5rem] max-w-[16rem]',
            className,
          )}
        >
          <ActiveIcon size={15} className="shrink-0 text-azure" aria-hidden />
          <span className="min-w-0 flex-1 truncate">{active?.name}</span>
          <ChevronsUpDown size={14} className="shrink-0 text-forest-300" aria-hidden />
        </button>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        subtitle={subtitle}
        size="lg"
        // A little extra breathing room around the cards — no forced min-height,
        // which would strand the cards in dead space under the subtitle.
        bodyClassName="pb-7 pt-6"
      >
        <ModuleCardList modules={modules} activeId={active?.id} onChoose={choose} />
      </Modal>

      {switching && <ModuleSwitchOverlay module={switching} />}
    </>
  )
}

/**
 * The dialog's module cards. Extracted so the switcher's own dialog and a
 * static specimen (the case-study gallery) render the same markup — a still of
 * this UI would otherwise drift from it silently.
 *
 * Flex, not a fixed 2-col grid: cards size to their content and wrap, so
 * descriptions read on ~two lines instead of a cramped column.
 */
export function ModuleCardList({
  modules,
  activeId,
  onChoose,
}: {
  modules: ModuleOption[]
  activeId?: string
  /** Omitted in a static specimen — the cards render, they just don't switch. */
  onChoose?: (id: string) => void
}) {
  return (
    <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {modules.map((module) => {
        const Icon = module.icon
        const isActive = module.id === activeId
        return (
          <li key={module.id} className="sm:min-w-[15rem] sm:flex-1 sm:basis-0">
            <button
              type="button"
              aria-current={isActive ? 'true' : undefined}
              onClick={onChoose ? () => onChoose(module.id) : undefined}
              className={cn(
                'flex h-full w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50',
                isActive
                  ? 'border-azure bg-azure-50'
                  : 'border-hair bg-white hover:border-navy-200 hover:bg-panel/50',
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  isActive ? 'bg-azure text-white' : 'bg-panel text-forest-500',
                )}
              >
                <Icon size={18} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-[15px] font-medium tracking-[-0.01em] text-forest">
                    {module.name}
                  </span>
                  {isActive && <Check size={15} className="text-azure" aria-hidden />}
                </span>
                {module.description && (
                  <span className="mt-0.5 block text-pretty text-[13px] leading-relaxed text-forest-400">
                    {module.description}
                  </span>
                )}
                {isActive && <span className="sr-only"> (current module)</span>}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

/** Serpentine route the lit snake segment travels, hugging the grid lines. */
const SNAKE_PATH = 'M20 20H140V60H20V100H140V140H20'

/**
 * Full-screen hand-off shown while the caller navigates to the new workspace.
 * A lit segment snakes along a faint grid behind the card and the target
 * module's badge breathes, so the pause reads as deliberate, not a hang.
 * Announced politely for screen readers; the source shell unmounts it on nav.
 *
 * `inline` drops the portal, the backdrop and the fixed positioning so the same
 * card can be shown in a documentation gallery. Exported for that use only —
 * the switcher itself always renders the full-screen form.
 */
export function ModuleSwitchOverlay({
  module,
  inline,
}: {
  module: ModuleOption
  inline?: boolean
}) {
  const Icon = module.icon
  const card = (
    <div className="animate-pop relative flex w-full max-w-xs flex-col items-center gap-4 overflow-hidden rounded-4xl bg-white px-8 py-9 text-center shadow-pop">
      <SwitchGridSnake />
      <span className="gx-switch-mark relative flex h-14 w-14 items-center justify-center rounded-2xl bg-azure text-white">
        <Icon size={26} aria-hidden />
      </span>
      <span className="relative flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
          Switching to
        </span>
        <span className="text-[17px] font-medium tracking-[-0.01em] text-forest">
          {module.name}
        </span>
      </span>
    </div>
  )

  if (inline) return <div className="flex justify-center">{card}</div>

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[70] flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 bg-forest-900/25 backdrop-blur-[3px]" />
      {card}
    </div>,
    document.body,
  )
}

/**
 * Decorative snake-on-a-grid backdrop for the switch overlay. A single lit
 * segment (dash) slides along a serpentine route; a softer, wider copy trails
 * beneath it as a glow. Masked to fade out behind the centred text.
 */
function SwitchGridSnake() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 160 160"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80 [mask-image:radial-gradient(circle_at_center,transparent_26%,black_72%)]"
    >
      <defs>
        <pattern id="gx-switch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--color-hair)" strokeWidth={1} />
        </pattern>
      </defs>
      <rect width="160" height="160" fill="url(#gx-switch-grid)" />
      <path
        d={SNAKE_PATH}
        pathLength={100}
        fill="none"
        stroke="currentColor"
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="16 84"
        opacity={0.45}
        className="gx-snake text-azure-300"
      />
      <path
        d={SNAKE_PATH}
        pathLength={100}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="16 84"
        className="gx-snake text-azure"
      />
    </svg>
  )
}
