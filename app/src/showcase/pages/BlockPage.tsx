import { Navigate, useParams } from '@tanstack/react-router'
import { blockBySlug } from '../blockdocs'
import { DocArticle } from './DocArticle'

/** One documented block — a reusable composition of components. */
export function BlockPage() {
  const { slug } = useParams({ strict: false })
  const doc = blockBySlug(slug)
  if (!doc) return <Navigate to="/design" replace />

  // Blocks lead with Examples — the composition is the explanation.
  return <DocArticle doc={doc} examplesFirst />
}
