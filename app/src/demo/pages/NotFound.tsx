import { ErrorPage } from '@/components/blocks'
import { ButtonLink } from '@/components/ui'

/** In-shell 404 for unknown /demo/* paths — keeps the product frame. */
export function DemoNotFoundPage() {
  return (
    <ErrorPage
      framed
      kind="not-found"
      action={
        <ButtonLink to="/demo/overview" variant="secondary">
          Back to the overview
        </ButtonLink>
      }
    />
  )
}
