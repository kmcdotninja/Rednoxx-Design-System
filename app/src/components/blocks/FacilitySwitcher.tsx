import { Building2, Check, ChevronDown } from 'lucide-react'
import { Dropdown, type DropdownItem } from '@/components/ui'

export interface FacilityOption {
  /** Stable id used for the active selection and returned by onSwitch. */
  id: string
  name: string
  /** Optional qualifier — LGA, tier, or catchment. */
  detail?: string
}

/**
 * Facility switcher — the top-bar control for the facility/site context a user
 * is working in. Presentational and generic: HIM, the demo and the showcase all
 * render this one block. The active facility carries a check and is disabled in
 * the menu. Switching facility is a context change, so it belongs in the top
 * bar next to the location trail — not buried in a settings screen.
 */
export function FacilitySwitcher({
  facilities,
  activeId,
  onSwitch,
  align = 'left',
  className,
}: {
  facilities: FacilityOption[]
  activeId: string
  onSwitch: (id: string) => void
  align?: 'left' | 'right'
  className?: string
}) {
  const active = facilities.find((f) => f.id === activeId) ?? facilities[0]

  const items: DropdownItem[] = facilities.map((f) => ({
    label: f.detail ? `${f.name} · ${f.detail}` : f.name,
    icon: Building2,
    hint: f.id === active?.id ? <Check size={14} className="text-azure" /> : undefined,
    disabled: f.id === active?.id,
    onSelect: () => onSwitch(f.id),
  }))

  return (
    <Dropdown
      align={align}
      side="bottom"
      items={items}
      className={className}
      trigger={
        <span
          className="flex h-9 min-w-[9.5rem] max-w-[14rem] items-center justify-between gap-2 rounded-xl border border-hair bg-white px-3 text-[13px] font-medium text-forest transition-colors hover:bg-panel"
          title="Switch facility"
        >
          <span className="truncate">{active?.name}</span>
          <ChevronDown size={15} className="shrink-0 text-forest-300" />
        </span>
      }
    />
  )
}
