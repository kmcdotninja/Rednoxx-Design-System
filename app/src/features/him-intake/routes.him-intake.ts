import { UserPlus } from 'lucide-react'
import { registerMockContribution } from '@/app/mocks/registry'
import type { NavContribution, PermissionContribution } from '@/app/stream-contract'

registerMockContribution({
  stream: 'him-intake',
  kind: 'fixture',
  surfaces: [
    'patient-search',
    'register',
    'register-complete',
    'mrn-allocator',
    'check-in',
  ],
})

export const HIM_INTAKE_PERMISSIONS: PermissionContribution[] = [{
  stream: 'him-intake',
  module: 'HIM Intake',
  permissions: [
    { key: 'him.intake.view', label: 'Access intake & registration' },
  ],
}]

export const HIM_INTAKE_NAV: NavContribution[] = [
  { to: '/him/intake', label: 'Intake', icon: UserPlus, namespace: 'him', stream: 'him-intake', permission: 'him.intake.view', match: ['/him/intake'] },
]
