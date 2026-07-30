/**
 * Lightweight component metadata — safe to import from the shell and nav.
 * The full docs (with live examples) load lazily with the /components routes,
 * mirroring how blocks-meta.ts pairs with blockdocs/.
 */

export type DocGroup = 'Forms' | 'Data display' | 'Feedback' | 'Navigation' | 'Overlays'

export interface ComponentMeta {
  slug: string
  name: string
  group: DocGroup
  summary: string
}

export const GROUP_ORDER: DocGroup[] = [
  'Forms',
  'Data display',
  'Feedback',
  'Navigation',
  'Overlays',
]

export const COMPONENTS_META: ComponentMeta[] = [
  {
    slug: 'button',
    name: 'Button',
    group: 'Forms',
    summary: 'Actions and commands — six variants, three sizes, optional icon slots.',
  },
  {
    slug: 'input',
    name: 'Input',
    group: 'Forms',
    summary: 'Single-line text entry with label, hint, required, disabled and password states.',
  },
  {
    slug: 'select',
    name: 'Select',
    group: 'Forms',
    summary: 'Native single-choice dropdown styled to the field baseline.',
  },
  {
    slug: 'select-menu',
    name: 'Select menu',
    group: 'Forms',
    summary: 'Single choice with a custom-rendered option panel — consistent on every platform.',
  },
  {
    slug: 'combobox',
    name: 'Combobox',
    group: 'Forms',
    summary: 'Searchable select for long lists — type to filter, full keyboard support.',
  },
  {
    slug: 'datepicker',
    name: 'DatePicker',
    group: 'Forms',
    summary: 'Calendar picker with a year grid for far-back dates; emits ISO strings.',
  },
  {
    slug: 'search',
    name: 'Search',
    group: 'Forms',
    summary: 'Query input with a leading icon, used across every list screen.',
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    group: 'Forms',
    summary: 'Binary choices and consent lists, with label and supporting description.',
  },
  {
    slug: 'radio',
    name: 'Radio',
    group: 'Forms',
    summary: 'Single choice among a few always-visible options.',
  },
  {
    slug: 'slider',
    name: 'Slider',
    group: 'Forms',
    summary: 'Range input with a filled track and live readout — pain scores, doses.',
  },
  {
    slug: 'switch',
    name: 'Switch',
    group: 'Forms',
    summary: 'On/off settings that apply immediately.',
  },
  {
    slug: 'color-picker',
    name: 'Color picker',
    group: 'Forms',
    summary: 'A fixed, accessible swatch palette — calendar categories, ward coding.',
  },
  {
    slug: 'digit-input',
    name: 'Digit input',
    group: 'Forms',
    summary: 'Segmented one-time-code entry — auto-advance, backspace, paste.',
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    group: 'Data display',
    summary: 'Identity mark with an image and a deterministic-colour initials fallback.',
  },
  {
    slug: 'badge',
    name: 'Badge',
    group: 'Data display',
    summary: 'Status and metadata pills with semantic tones.',
  },
  {
    slug: 'card',
    name: 'Card',
    group: 'Data display',
    summary: 'The base surface — raised white, recessed panel, and dark variants.',
  },
  {
    slug: 'table',
    name: 'Table',
    group: 'Data display',
    summary: 'Data table with pagination, empty state and clickable rows.',
  },
  {
    slug: 'progress',
    name: 'Progress',
    group: 'Data display',
    summary: 'Linear and circular progress — completeness, utilisation, capacity.',
  },
  {
    slug: 'rating',
    name: 'Rating',
    group: 'Data display',
    summary: 'Star rating — interactive for feedback, read-only for scores.',
  },
  {
    slug: 'divider',
    name: 'Divider',
    group: 'Data display',
    summary: 'Hairline separators — plain, labelled, or vertical.',
  },
  {
    slug: 'kbd',
    name: 'Kbd',
    group: 'Data display',
    summary: 'Keyboard-key chips for shortcut hints.',
  },
  {
    slug: 'code-block',
    name: 'Code block',
    group: 'Data display',
    summary: 'Syntax-highlighted code with copy-to-clipboard — how every snippet is shown.',
  },
  {
    slug: 'alert',
    name: 'Alert',
    group: 'Feedback',
    summary: 'Inline contextual messages for a page or section.',
  },
  {
    slug: 'toast',
    name: 'Toast',
    group: 'Feedback',
    summary: 'Transient confirmations layered over the UI, bottom-right.',
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    group: 'Feedback',
    summary: 'Modal surface for confirmation and short focused tasks.',
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    group: 'Feedback',
    summary: 'Detached side panel for detail views and multi-field editing.',
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    group: 'Feedback',
    summary: 'Hover/focus hint bubble — clarification, never essential content.',
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    group: 'Navigation',
    summary: 'Underline tabs with counts for switching sibling views.',
  },
  {
    slug: 'segmented',
    name: 'Segmented control',
    group: 'Navigation',
    summary: 'Pill switcher for 2–4 equivalent views of the same data.',
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    group: 'Navigation',
    summary: 'Collapsible sections — FAQs, policies, optional detail.',
  },
  {
    slug: 'stepper',
    name: 'Stepper',
    group: 'Navigation',
    summary: 'Wizard progress in three densities — horizontal, vertical, dots.',
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    group: 'Navigation',
    summary: 'Page controls with a windowed number strip (1 … 4 5 6 … 12).',
  },
  {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    group: 'Navigation',
    summary: 'Hierarchical location trail; the last item is the current page.',
  },
  {
    slug: 'dropdown',
    name: 'Dropdown',
    group: 'Overlays',
    summary: 'Action menu behind a trigger — row actions, account menus, “more”.',
  },
  {
    slug: 'popover',
    name: 'Popover',
    group: 'Overlays',
    summary: 'Anchored panel for rich content — notification trays, previews, mini-forms.',
  },
  {
    slug: 'command-menu',
    name: 'Command menu',
    group: 'Overlays',
    summary: 'The ⌘K palette — jump to pages, records and actions from anywhere.',
  },
]

export function componentsInGroup(group: DocGroup): ComponentMeta[] {
  return COMPONENTS_META.filter((c) => c.group === group)
}
