import { Navigate, useParams } from 'react-router-dom'
import { BLOCK_DOCS, blockBySlug } from '../blockdocs'
import { DocArticle } from './DocArticle'

/** One documented block — a reusable composition of components. */
export function BlockPage() {
  const { slug } = useParams()
  const doc = blockBySlug(slug)
  if (!doc) return <Navigate to="/" replace />

  const index = BLOCK_DOCS.indexOf(doc)
  return (
    <DocArticle
      doc={doc}
      prev={BLOCK_DOCS[index - 1]}
      next={BLOCK_DOCS[index + 1]}
      basePath="/blocks"
      rootLabel="Blocks"
    />
  )
}
