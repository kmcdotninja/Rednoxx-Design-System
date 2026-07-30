import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Copy, Monitor, Plus, Smartphone, Tablet, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CodeBlock, Input, SelectMenu, Toggle } from '@/components/ui'
import { ControlsRail } from '../controls-slot'
import {
  defaultValues,
  toList,
  visibleControls,
  type ControlDef,
  type ControlValues,
  type PlaygroundSpec,
} from './types'

const VIEWPORTS = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, width: '768px' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, width: '390px' },
] as const

type ViewportId = (typeof VIEWPORTS)[number]['id']

/** A vertical option list — the selected row is filled, the whole row is the target. */
function RadioRows({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { id: string; label: string }[]
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div role="radiogroup" aria-label={label} className="-mx-2">
      {options.map((option) => {
        const selected = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              'flex min-h-10 w-full items-center px-2 text-left text-[13px] transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50',
              selected
                ? 'bg-panel font-medium text-forest'
                : 'text-forest-400 hover:bg-panel/60 hover:text-forest',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/** Editor for a `string[]` prop — existing entries as removable chips, plus an add field. */
function ListRows({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder?: string
  onChange: (next: string) => void
}) {
  const items = toList(value)
  const [draft, setDraft] = useState('')

  const add = () => {
    const entry = draft.trim()
    if (!entry) return
    onChange([...items, entry].join(', '))
    setDraft('')
  }

  return (
    <div className="py-3">
      <p className="pb-1.5 text-[13px] text-forest-500">{label}</p>
      {items.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <li key={`${item}-${i}`}>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i).join(', '))}
                aria-label={`Remove ${item}`}
                className="flex min-h-8 items-center gap-1.5 border border-hair bg-panel px-2 text-[12px] text-forest-500 transition-colors hover:border-navy-200 hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50"
              >
                {item}
                <X size={12} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-1.5">
        <Input
          value={draft}
          placeholder={placeholder ?? 'Add an entry'}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          className="h-10 min-w-0 flex-1 text-[13px]"
        />
        <button
          type="button"
          onClick={add}
          aria-label={`Add to ${label}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center border border-hair text-forest-400 transition-colors hover:border-navy-200 hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50"
        >
          <Plus size={15} aria-hidden />
        </button>
      </div>
    </div>
  )
}

/** One labelled control row in the rail — input picked by control kind. */
function ControlRow({
  control,
  value,
  onChange,
}: {
  control: ControlDef
  value: string | number | boolean
  onChange: (next: string | number | boolean) => void
}) {
  const label = control.label ?? control.name

  if (control.kind === 'radio') {
    return (
      <div className="py-3">
        <p className="pb-1.5 text-[13px] text-forest-500">{label}</p>
        <RadioRows
          label={label}
          options={control.options.map((o) => ({ id: o, label: o }))}
          value={String(value)}
          onChange={onChange}
        />
      </div>
    )
  }

  if (control.kind === 'list') {
    return (
      <ListRows
        label={label}
        value={String(value)}
        placeholder={control.placeholder}
        onChange={onChange}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex min-h-10 items-center justify-between gap-3 py-2.5',
        control.indent && 'pl-4',
      )}
    >
      <label className="flex min-w-0 items-center gap-1.5 text-[13px] text-forest-500">
        {control.indent && (
          <span className="font-mono text-[13px] leading-none text-navy-200" aria-hidden>
            └
          </span>
        )}
        <span className="truncate">{label}</span>
      </label>
      {(control.kind === 'select' || control.kind === 'icon') && (
        <SelectMenu
          size="sm"
          value={String(value)}
          onChange={(v) => onChange(v)}
          options={control.options.map((o) => ({ value: o, label: o }))}
          className="w-36 shrink-0"
        />
      )}
      {control.kind === 'boolean' && <Toggle checked={Boolean(value)} onChange={onChange} />}
      {control.kind === 'number' && (
        <Input
          type="number"
          value={String(value)}
          min={control.min}
          max={control.max}
          step={control.step}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          className="h-10 w-24 shrink-0 text-[13px]"
        />
      )}
      {control.kind === 'text' && (
        <Input
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-40 shrink-0 text-[13px]"
        />
      )}
    </div>
  )
}

/** Code / Usage panel — tabs left, copy and collapse right, light code beneath. */
function CodePanel({ code, usage }: { code: string; usage?: string }) {
  const [tab, setTab] = useState<'code' | 'usage'>('code')
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const shown = tab === 'code' ? code : (usage ?? code)
  const tabs = usage ? (['code', 'usage'] as const) : (['code'] as const)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shown)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard blocked (insecure origin / denied) — leave the button idle.
    }
  }

  return (
    <div className={cn('flex shrink-0 flex-col border-t border-hair bg-white', open && 'max-h-[45%]')}>
      <div className="flex shrink-0 items-center gap-0.5 border-b border-hair px-4 py-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={cn(
              'flex h-10 items-center px-3 text-[13px] font-medium capitalize transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50',
              tab === t ? 'bg-panel text-forest' : 'text-forest-400 hover:text-forest',
            )}
          >
            {t}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-0.5">
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
            className="flex h-10 w-10 items-center justify-center text-forest-300 transition-colors hover:bg-panel hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50"
          >
            {copied ? <Check size={15} className="text-mint" aria-hidden /> : <Copy size={15} aria-hidden />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Collapse code' : 'Expand code'}
            className="flex h-10 w-10 items-center justify-center text-forest-300 transition-colors hover:bg-panel hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50"
          >
            <ChevronDown
              size={16}
              className={cn('transition-transform duration-150', !open && '-rotate-90')}
              aria-hidden
            />
          </button>
        </div>
      </div>
      {open && (
        <div className="min-h-0 flex-1 overflow-auto">
          <CodeBlock variant="plain" code={shown} />
        </div>
      )}
      <span aria-live="polite" className="sr-only">
        {copied ? 'Code copied to clipboard' : ''}
      </span>
    </div>
  )
}

/**
 * The interactive component explorer. It fills the Shell's content column — a
 * preview canvas with responsive viewport toggles above a Code / Usage panel —
 * and portals its editable props into the Shell's Controls rail.
 *
 * Named examples are presets rather than a separate tab: picking one seeds the
 * controls and the component stays live, so an example is somewhere to start
 * playing from instead of a static screenshot.
 */
export function Playground({
  spec,
  summary,
  usageCode,
}: {
  spec: PlaygroundSpec
  /** One line describing the component, shown atop the Controls rail. */
  summary?: string
  /** Hand-written usage snippet for the Usage tab. */
  usageCode?: string
}) {
  const presets = spec.presets ?? []
  const [preset, setPreset] = useState(presets[0]?.id ?? '')
  const [values, setValues] = useState<ControlValues>(() => ({
    ...defaultValues(spec.controls),
    ...(presets[0]?.values ?? {}),
  }))
  const [viewport, setViewport] = useState<ViewportId>('desktop')

  const set = (name: string, next: string | number | boolean) =>
    setValues((v) => ({ ...v, [name]: next }))

  const choosePreset = (id: string) => {
    setPreset(id)
    const found = presets.find((p) => p.id === id)
    if (found) setValues((v) => ({ ...v, ...found.values }))
  }

  const vp = VIEWPORTS.find((v) => v.id === viewport) ?? VIEWPORTS[0]
  const shown = useMemo(() => visibleControls(spec.controls, values), [spec.controls, values])

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* The toggles sit outside the scroll area: pinned to the canvas rather than
          to the content, and the canvas reserves a bottom gutter so a full-width
          preview (a table, a wide block) never runs underneath them. */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="canvas-grid flex min-h-0 flex-1 items-center justify-center overflow-auto p-8 pb-20">
          {/* Two nested centres: the viewport frame centres in the canvas, and the
              component centres inside the frame — so a preview is centred at every
              breakpoint, whatever width the spec asks for. */}
          <div
            className="flex w-full items-center justify-center transition-[max-width] duration-300 ease-out"
            style={{ maxWidth: vp.width }}
          >
            <div
              className={cn(
                'flex flex-wrap items-center justify-center gap-3',
                spec.canvasClassName,
              )}
            >
              {spec.render(values)}
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-0.5 border border-hair bg-white p-0.5 shadow-chip">
          {VIEWPORTS.map((v) => {
            const Icon = v.icon
            const active = v.id === viewport
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setViewport(v.id)}
                aria-label={v.label}
                aria-pressed={active}
                className={cn(
                  'flex h-10 w-10 items-center justify-center transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50',
                  active ? 'bg-panel text-forest' : 'text-forest-300 hover:text-forest-500',
                )}
              >
                <Icon size={15} />
              </button>
            )
          })}
        </div>
      </div>

      <CodePanel code={spec.code(values)} usage={usageCode} />

      <ControlsRail>
        {summary && <p className="text-[13px] leading-relaxed text-forest-400">{summary}</p>}

        {presets.length > 1 && (
          <div className={cn('py-3', summary && 'mt-3 border-t border-hair')}>
            <p className="pb-1.5 text-[13px] text-forest-500">Example</p>
            <RadioRows
              label="Example"
              options={presets.map((p) => ({ id: p.id, label: p.label }))}
              value={preset}
              onChange={choosePreset}
            />
          </div>
        )}

        <div
          className={cn(
            'divide-y divide-hair/70',
            (summary || presets.length > 1) && 'border-t border-hair pt-1',
            presets.length > 1 ? 'mt-1' : summary && 'mt-4',
          )}
        >
          {shown.map((c) => (
            <ControlRow
              key={c.name}
              control={c}
              value={values[c.name]}
              onChange={(next) => set(c.name, next)}
            />
          ))}
        </div>
      </ControlsRail>
    </div>
  )
}
