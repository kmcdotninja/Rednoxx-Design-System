import { Badge } from '@/components/ui'
import type { DocumentStatus, RecordStatus, ReleaseStatus } from './data'

/* Worded status pills — colour never carries status alone (design guide). */

type Tone = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

const recordTone: Record<RecordStatus, Tone> = {
  permanent: 'success',
  temporary: 'warning',
  provisional: 'warning',
  merged: 'neutral',
  restricted: 'danger',
  deceased: 'neutral',
  inactive: 'neutral',
  archived: 'neutral',
  'duplicate-suspected': 'warning',
}

export function RecordStatusPill({ status }: { status: RecordStatus }) {
  return (
    <Badge tone={recordTone[status]} dot>
      {status.replace(/-/g, ' ')}
    </Badge>
  )
}

const verificationTone: Record<string, Tone> = {
  verified: 'success',
  'pending verification': 'warning',
  unverified: 'neutral',
}

export function VerificationPill({ status }: { status: string }) {
  return (
    <Badge tone={verificationTone[status] ?? 'neutral'} dot>
      {status}
    </Badge>
  )
}

const releaseTone: Record<ReleaseStatus, Tone> = {
  created: 'neutral',
  'pending approval': 'warning',
  approved: 'info',
  released: 'success',
  rejected: 'danger',
  pended: 'warning',
}

export function ReleaseStatusPill({ status }: { status: ReleaseStatus }) {
  return (
    <Badge tone={releaseTone[status]} dot>
      {status}
    </Badge>
  )
}

const documentTone: Record<DocumentStatus, Tone> = {
  indexed: 'success',
  'pending index': 'warning',
  superseded: 'neutral',
  'created-in-error': 'danger',
  'unbound legacy': 'warning',
}

export function DocumentStatusPill({ status }: { status: DocumentStatus }) {
  return (
    <Badge tone={documentTone[status]} dot>
      {status.replace(/-/g, ' ')}
    </Badge>
  )
}
