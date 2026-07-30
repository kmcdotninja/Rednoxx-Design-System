/**
 * Cross-stream contribution contracts for the App Shell (Integration task).
 * Streams register routes/nav/permissions/mocks; only `src/app/` composes them.
 */
import type { AnyRoute } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type StreamNamespace = 'admin' | 'him' | 'care'

export type StreamId =
  | 'platform-iam'
  | 'platform-config'
  | 'him-intake'
  | 'him-records'
  | 'care-ambulatory'
  | 'care-emergency'

export interface NavContribution {
  to: string
  label: string
  icon?: LucideIcon
  /** Permission key required to show this entry (unified catalogue). */
  permission?: string
  section?: string
  match?: string[]
  namespace: StreamNamespace
  stream: StreamId
}

export interface PermissionEntry {
  key: string
  label: string
}

export interface PermissionContribution {
  stream: StreamId
  module: string
  permissions: PermissionEntry[]
}

/**
 * Lightweight mock descriptor until streams migrate fully to HTTP/MSW.
 * `kind: 'fixture'` means in-memory api.ts (current); `kind: 'msw'` reserved.
 */
export interface MockContribution {
  stream: StreamId
  kind: 'fixture' | 'msw'
  /** Human-readable list of mock surfaces owned by this stream. */
  surfaces: string[]
  /** Optional MSW handlers — composed by `getMswHandlers()` (US-G6). */
  handlers?: unknown[]
}

export type ParentRoute = AnyRoute

export type ChildRouteFactory = (parent: ParentRoute) => AnyRoute[]

export interface StreamRouteBundle {
  stream: StreamId
  attachToRoot?: (root: ParentRoute) => AnyRoute[]
  attachToAdmin?: ChildRouteFactory
  attachToCare?: ChildRouteFactory
  attachToHim?: ChildRouteFactory
}

export interface StubPageProps {
  title: string
  stream: StreamId
  description?: ReactNode
}
