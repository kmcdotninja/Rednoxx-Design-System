import type { ReactNode } from 'react'

export type ControlValues = Record<string, string | number | boolean>

/** Fields every control shares, whatever its input kind. */
interface ControlBase {
  name: string
  label?: string
  /**
   * Hide the row unless this predicate passes — lets one control reveal its
   * dependants (e.g. "Number of tabs" only matters once Leading content = Tabs).
   */
  showWhen?: (values: ControlValues) => boolean
  /** Render one level in, with a tree elbow — for controls owned by the row above. */
  indent?: boolean
}

/** A single editable prop control shown in the right-hand Controls rail. */
export type ControlDef =
  | (ControlBase & { kind: 'select'; options: string[]; default: string })
  /** Vertical option list — the whole row is the target, selection is a filled row. */
  | (ControlBase & { kind: 'radio'; options: string[]; default: string })
  | (ControlBase & { kind: 'boolean'; default: boolean })
  | (ControlBase & { kind: 'number'; default: number; min?: number; max?: number; step?: number })
  | (ControlBase & { kind: 'text'; default: string })
  /**
   * A `string[]` prop — names in an AvatarGroup, open panels in an Accordion.
   * Stored comma-separated so ControlValues stays scalar; read it with `toList`.
   */
  | (ControlBase & { kind: 'list'; default: string; placeholder?: string })
  /** A ReactNode icon slot. The value is an icon name from the spec's own set. */
  | (ControlBase & { kind: 'icon'; options: string[]; default: string })

/**
 * A component playground: editable controls, a live render driven by their
 * values, and the JSX those values produce. The Controls rail, preview canvas
 * and Code tab are all generated from this one spec.
 */
export interface PlaygroundSpec {
  controls: ControlDef[]
  /** Render the component from the current control values. */
  render: (values: ControlValues) => ReactNode
  /** The JSX the current control values produce — shown in the Code tab, copyable. */
  code: (values: ControlValues) => string
  /** Extra classes on the centered preview stage (e.g. a width cap). */
  canvasClassName?: string
  /**
   * Named starting points shown as an "Example" list atop the Controls rail.
   * Choosing one seeds the controls, which then stay live — so a scenario is a
   * place to start playing from, not a static screenshot.
   */
  presets?: { id: string; label: string; values: ControlValues }[]
}

/** Read a `list` control back as an array, dropping blank entries. */
export function toList(value: string | number | boolean): string[] {
  return String(value)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

/** Seed a value bag from a spec's declared defaults. */
export function defaultValues(controls: ControlDef[]): ControlValues {
  const out: ControlValues = {}
  for (const c of controls) out[c.name] = c.default
  return out
}

/** The controls currently visible, given what the dependent ones are watching. */
export function visibleControls(controls: ControlDef[], values: ControlValues): ControlDef[] {
  return controls.filter((c) => !c.showWhen || c.showWhen(values))
}

/**
 * One JSX attribute string. Booleans render bare (`block`) or vanish; numbers
 * render as `{n}`; strings as `="…"`. Pass `omitWhen` (usually the prop's
 * default) to drop the attribute entirely — so generated code stays minimal.
 */
export function attr(
  name: string,
  value: string | number | boolean,
  omitWhen?: string | number | boolean,
): string {
  if (omitWhen !== undefined && value === omitWhen) return ''
  if (typeof value === 'boolean') return value ? ` ${name}` : ''
  if (typeof value === 'number') return ` ${name}={${value}}`
  return ` ${name}="${value}"`
}
