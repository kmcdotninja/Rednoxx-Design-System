import type { ComponentDoc, DocGroup } from './types'
import { FORM_DOCS } from './docs/forms'
import { DISPLAY_DOCS } from './docs/display'
import { FEEDBACK_DOCS } from './docs/feedback'
import { NAVIGATION_DOCS } from './docs/navigation'
import { OVERLAY_DOCS } from './docs/overlays'

export const GROUP_ORDER: DocGroup[] = ['Forms', 'Data display', 'Feedback', 'Navigation', 'Overlays']

/** Every documented component, in sidebar order. */
export const REGISTRY: ComponentDoc[] = [
  ...FORM_DOCS,
  ...DISPLAY_DOCS,
  ...FEEDBACK_DOCS,
  ...NAVIGATION_DOCS,
  ...OVERLAY_DOCS,
]

export function docBySlug(slug: string | undefined): ComponentDoc | undefined {
  return REGISTRY.find((doc) => doc.slug === slug)
}

export function docsInGroup(group: DocGroup): ComponentDoc[] {
  return REGISTRY.filter((doc) => doc.group === group)
}
