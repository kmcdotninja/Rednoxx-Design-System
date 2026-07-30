/**
 * Aggregates stream contributions for the App Shell composer.
 *
 * Design-system port: only the him-intake stream is present. The product
 * streams (platform-iam, platform-config, care-ambulatory, care-emergency,
 * him-records) live in the product repo and were not ported.
 */
import { HIM_INTAKE_NAV, HIM_INTAKE_PERMISSIONS } from '@/features/him-intake/routes.him-intake'
import type { NavContribution, PermissionContribution, StreamId } from './stream-contract'
import { assertMockCoverage } from './mocks/registry'

export const ALL_PERMISSION_CONTRIBUTIONS: PermissionContribution[] = [
  ...HIM_INTAKE_PERMISSIONS,
]

export const ALL_NAV_CONTRIBUTIONS: NavContribution[] = [
  ...HIM_INTAKE_NAV,
]

const EXPECTED_STREAMS: StreamId[] = ['him-intake']

/** Call once at app bootstrap so missing mock registrations surface in the console. */
export function bootstrapStreamContributions() {
  assertMockCoverage(EXPECTED_STREAMS)
}
