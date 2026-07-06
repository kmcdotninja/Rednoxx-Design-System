import { BLOCKS_META } from '../blocks-meta'
import type { ComponentDoc } from '../types'
import { AUTH_BLOCK_DOCS } from './auth'
import { PATIENT_BLOCK_DOCS } from './patient'
import { DASHBOARD_BLOCK_DOCS } from './dashboard'
import { PATTERN_BLOCK_DOCS } from './patterns'

const bodies = [...AUTH_BLOCK_DOCS, ...PATIENT_BLOCK_DOCS, ...DASHBOARD_BLOCK_DOCS, ...PATTERN_BLOCK_DOCS]

/** Full block docs — meta (shared with the shell) merged with the lazy example bodies. */
export const BLOCK_DOCS: ComponentDoc[] = BLOCKS_META.map((meta) => {
  const body = bodies.find((b) => b.slug === meta.slug)
  if (!body) throw new Error(`No doc body for block "${meta.slug}"`)
  return { ...meta, ...body }
})

export function blockBySlug(slug: string | undefined): ComponentDoc | undefined {
  return BLOCK_DOCS.find((doc) => doc.slug === slug)
}
