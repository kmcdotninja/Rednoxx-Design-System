import { FolderArchive, Stethoscope } from 'lucide-react'
import type { ModuleOption } from '@/components/blocks'

/** The product's top-level workspaces the ModuleSwitcher moves between. */
export type ModuleId = 'care' | 'him'

/**
 * Single source of truth for the module switcher — Care is the clinical demo
 * (`/demo`), HIM is the records workspace (`/him-demo`). Admin joins here once it has
 * its own module. Both shells and the design-system showcase render this list.
 */
export const PRODUCT_MODULES: ModuleOption[] = [
  {
    id: 'care',
    name: 'Care',
    description: 'Clinical work — registration, encounters, orders and results.',
    icon: Stethoscope,
  },
  {
    id: 'him',
    name: 'HIM',
    description: 'Health records, coding, release of information and audit.',
    icon: FolderArchive,
  },
]

/** Landing route for each module. */
export const MODULE_HOME: Record<ModuleId, string> = {
  care: '/demo/overview',
  him: '/him-demo',
}
