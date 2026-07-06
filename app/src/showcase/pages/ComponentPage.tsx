import { Navigate, useParams } from 'react-router-dom'
import { docBySlug, REGISTRY } from '../registry'
import { DocArticle } from './DocArticle'

/** One documented component — summary, usage, live examples, accessibility. */
export function ComponentPage() {
  const { slug } = useParams()
  const doc = docBySlug(slug)
  if (!doc) return <Navigate to="/" replace />

  const index = REGISTRY.indexOf(doc)
  return (
    <DocArticle
      doc={doc}
      prev={REGISTRY[index - 1]}
      next={REGISTRY[index + 1]}
      basePath="/components"
      rootLabel="Components"
    />
  )
}
