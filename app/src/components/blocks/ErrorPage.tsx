import type { ReactNode } from 'react'
import { EmptyState, type EmptyVariant } from '@/components/ui'
import { cn } from '@/lib/cn'

type ErrorKind = 'not-found' | 'no-access' | 'server-error' | 'offline' | 'maintenance'

const KINDS: Record<
  ErrorKind,
  { code: string; art: EmptyVariant; title: string; description: string }
> = {
  'not-found': {
    code: '404',
    art: 'search',
    title: 'This page doesn’t exist',
    description: 'The address may be mistyped, or the page may have moved. Nothing was changed on your account.',
  },
  'no-access': {
    code: '403',
    art: 'no-access',
    title: 'You don’t have access to this',
    description: 'Access follows your configured role. If you need this area, ask your facility administrator — denied attempts are logged.',
  },
  'server-error': {
    code: '500',
    art: 'document',
    title: 'Something went wrong on our side',
    description: 'The error is recorded and nothing you entered was lost. Try again — if it persists, support already has the trace.',
  },
  offline: {
    code: 'Offline',
    art: 'notifications',
    title: 'You’re working offline',
    description: 'Essential registration continues on the downtime register; everything reconciles when the connection returns.',
  },
  maintenance: {
    code: 'Back soon',
    art: 'folder',
    title: 'Scheduled maintenance in progress',
    description: 'The system is being updated and will be back shortly. In-progress work is preserved.',
  },
}

/**
 * Full-page error states — 404, access denied, failure, offline, maintenance.
 * One layout for all of them: status overline, situation-specific empty-state
 * illustration, plain-language copy and a way forward (never a dead end).
 */
export function ErrorPage({
  kind,
  title,
  description,
  action,
  framed,
  className,
}: {
  kind: ErrorKind
  /** Override the default copy where the context knows better. */
  title?: string
  description?: string
  /** The way forward — a ButtonLink home, a retry, a sign-in. */
  action?: ReactNode
  /** Standalone example (no min-height claim). */
  framed?: boolean
  className?: string
}) {
  const spec = KINDS[kind]
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-canvas px-6',
        framed ? 'rounded-3xl border border-hair py-10' : 'min-h-screen py-16',
        className,
      )}
    >
      <p className="tnum font-mono text-[13px] font-medium uppercase tracking-[0.2em] text-azure">
        {spec.code}
      </p>
      <EmptyState
        variant={spec.art}
        title={title ?? spec.title}
        description={description ?? spec.description}
        action={action}
      />
    </div>
  )
}
