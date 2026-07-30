import { Navigate, useParams } from '@tanstack/react-router'
import { docBySlug } from '../registry'
import { Playground } from '../playground/Playground'
import { PLAYGROUNDS } from '../playground/specs'
import { DocArticle } from './DocArticle'

/** One documented component — an interactive explorer plus its written docs. */
export function ComponentPage() {
  const { slug } = useParams({ strict: false })
  const doc = docBySlug(slug)
  if (!doc) return <Navigate to="/design" replace />

  const spec = slug ? PLAYGROUNDS[slug] : undefined

  return (
    <DocArticle
      doc={doc}
      playground={
        spec ? <Playground spec={spec} summary={doc.summary} usageCode={doc.code} /> : undefined
      }
    />
  )
}
