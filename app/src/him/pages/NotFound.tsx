import { ErrorPage } from '@/components/blocks'
import { ButtonLink } from '@/components/ui'

/** In-shell 404 for unknown /him/* paths — keeps the sidebar and role context. */
export function HimNotFoundPage() {
  return (
    <ErrorPage
      framed
      kind="not-found"
      description="No HIM screen lives at this address. Your work and worklists are untouched."
      action={
        <ButtonLink to="/him-demo" variant="secondary">
          Back to my overview
        </ButtonLink>
      }
    />
  )
}
