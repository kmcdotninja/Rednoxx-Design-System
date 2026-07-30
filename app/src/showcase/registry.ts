import type { ComponentDoc } from './types'
import { COMPONENTS_META } from './components-meta'
import { FORM_DOCS } from './docs/forms'
import { DISPLAY_DOCS } from './docs/display'
import { FEEDBACK_DOCS } from './docs/feedback'
import { NAVIGATION_DOCS } from './docs/navigation'
import { OVERLAY_DOCS } from './docs/overlays'

export { GROUP_ORDER, COMPONENTS_META, componentsInGroup } from './components-meta'
export type { DocGroup } from './components-meta'

const bodies = [...FORM_DOCS, ...DISPLAY_DOCS, ...FEEDBACK_DOCS, ...NAVIGATION_DOCS, ...OVERLAY_DOCS]

/**
 * Every documented component, in sidebar order. Driven by COMPONENTS_META so
 * the shell's nav and these pages can never drift apart — the same pairing
 * blocks-meta.ts has with blockdocs/.
 */
export const REGISTRY: ComponentDoc[] = COMPONENTS_META.map((meta) => {
  const body = bodies.find((b) => b.slug === meta.slug)
  if (!body) throw new Error(`No doc body for component "${meta.slug}"`)
  return { ...meta, ...body }
})

export function docBySlug(slug: string | undefined): ComponentDoc | undefined {
  return REGISTRY.find((doc) => doc.slug === slug)
}

export function docsInGroup(group: string): ComponentDoc[] {
  return REGISTRY.filter((doc) => doc.group === group)
}
