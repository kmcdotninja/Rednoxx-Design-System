import type { ReactNode } from 'react'

export type DocGroup = 'Forms' | 'Data display' | 'Feedback' | 'Navigation' | 'Overlays'

export interface DocExample {
  title: string
  /** Small explanatory line under the example title. */
  note?: string
  /** Rendered preview. Stateful examples should be their own components. */
  body: ReactNode
  /** Render full-width (tables, shells) instead of the centered flex row. */
  wide?: boolean
}

export interface PropDef {
  name: string
  /** Union values separated by " | " render as individual chips. */
  type: string
  default?: string
  required?: boolean
  description: string
}

export interface ComponentDoc {
  slug: string
  name: string
  /** Sidebar group — a DocGroup for components, a BlockGroup for blocks. */
  group: string
  /** API reference rendered as the Props table. */
  props?: PropDef[]
  /** One-liner shown in the index and under the page title. */
  summary: string
  /** Optional longer guidance paragraph. */
  description?: string
  /** Primary usage snippet. */
  code?: string
  examples: DocExample[]
  /** WCAG 2.2 AA notes — what the component does and what callers must do. */
  a11y: string[]
}
