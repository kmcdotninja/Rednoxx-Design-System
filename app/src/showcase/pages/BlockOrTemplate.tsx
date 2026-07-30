import { useParams } from '@tanstack/react-router'
import { BlockPage } from './BlockPage'
import { Templates } from './Templates'

/**
 * `/design/blocks/$slug` serves both block docs and page templates — templates
 * are blocks at page scale, so they share the section rather than owning a
 * top-level one. The `template-` prefix picks the renderer.
 */
export function BlockOrTemplate() {
  const { slug } = useParams({ strict: false })
  return slug?.startsWith('template-') ? <Templates /> : <BlockPage />
}
