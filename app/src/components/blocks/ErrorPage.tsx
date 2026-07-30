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
  titleAs = 'h1',
  description,
  detail,
  action,
  footer,
  framed,
  className,
}: {
  kind: ErrorKind
  /** Override the default copy where the context knows better. */
  title?: string
  /**
   * The error replaces the page's content, so its title is the page's `h1` —
   * including inside a shell, where the route that failed never rendered one.
   * Drop to `p` only for an embedded specimen on a page that owns its own `h1`.
   */
  titleAs?: 'p' | 'h1' | 'h2'
  description?: string
  /** Evidence under the copy — typically the address or request that failed. */
  detail?: ReactNode
  /** The way forward — a ButtonLink home, a retry, a sign-in. */
  action?: ReactNode
  /**
   * Supplementary block under the action — diagnostics (the address that
   * failed) and secondary destinations. Stacked, not a button row, so a
   * standalone error page can offer more than one way out.
   */
  footer?: ReactNode
  /** Standalone example (no min-height claim). */
  framed?: boolean
  className?: string
}) {
  const spec = KINDS[kind]
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-canvas px-page sm:px-page-lg',
        framed ? 'border border-hair py-10' : 'min-h-screen py-16',
        className,
      )}
    >
      <p className="tnum font-mono text-secondary font-medium uppercase tracking-[0.2em] text-azure">
        {spec.code}
      </p>
      <EmptyState
        variant={spec.art}
        title={title ?? spec.title}
        titleAs={titleAs}
        description={description ?? spec.description}
        detail={detail}
        action={action}
      />
      {footer && <div className="w-full">{footer}</div>}
    </div>
  )
}
