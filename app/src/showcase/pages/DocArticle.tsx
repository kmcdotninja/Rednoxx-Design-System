import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CodeBlock } from '@/components/ui'
import { HeaderSlot } from '../controls-slot'
import type { ComponentDoc } from '../types'

type TabId = 'preview' | 'guidance' | 'examples' | 'props' | 'a11y'

/** Readable measure for the scrolling (non-preview) tabs. */
function Sheet({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">{children}</div>
}

function TabStrip({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: TabId; label: string }[]
  value: TabId
  onChange: (id: TabId) => void
}) {
  return (
    <div role="tablist" aria-label="Documentation sections" className="flex items-center gap-0.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex h-10 shrink-0 items-center px-3 text-[13px] transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50',
            value === tab.id
              ? 'bg-panel font-medium text-forest'
              : 'text-forest-400 hover:bg-panel/60 hover:text-forest',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

/**
 * Shared renderer for a documented component or block.
 *
 * The Shell owns the title, the prev/next pager and the Controls rail, so this
 * renders only the body — split across tabs that portal into the page header.
 * Preview fills the frame (canvas over code, controls in the rail); everything
 * written about the component sits behind the other tabs rather than pushing
 * the component itself down the page.
 */
export function DocArticle({
  doc,
  playground,
  examplesFirst,
}: {
  doc: ComponentDoc
  /** Interactive explorer; when present it becomes the default tab. */
  playground?: ReactNode
  /**
   * Lead with Examples instead of "When to use". Blocks set this: a block is
   * understood by seeing the composition, where a component is understood by
   * first reading what it is for.
   */
  examplesFirst?: boolean
}) {
  useEffect(() => {
    document.title = `${doc.name} — Rednoxx Design System`
    return () => {
      document.title = 'Rednoxx — Healthcare Platform Design System'
    }
  }, [doc.name])

  const tabs = useMemo(() => {
    const list: { id: TabId; label: string }[] = []
    if (playground) list.push({ id: 'preview', label: 'Preview' })

    const guidance =
      doc.whenToUse?.length || doc.description
        ? ({ id: 'guidance', label: 'When to use' } as const)
        : undefined
    // Examples are not a tab when a playground exists — they are presets inside
    // Preview, so a scenario stays interactive instead of becoming a static
    // screenshot. Docs with no playground still need somewhere to show them.
    const examples =
      !playground && doc.examples.length
        ? ({ id: 'examples', label: 'Examples' } as const)
        : undefined

    // Whichever lands first also becomes the default tab (see `tabs[0]` below).
    for (const entry of examplesFirst ? [examples, guidance] : [guidance, examples]) {
      if (entry) list.push(entry)
    }

    if (doc.props?.length) list.push({ id: 'props', label: 'Props' })
    if (doc.a11y.length) list.push({ id: 'a11y', label: 'Accessibility' })
    return list
  }, [doc, playground, examplesFirst])

  const [tab, setTab] = useState<TabId>(tabs[0]?.id ?? 'examples')

  // Tab sets differ per component; reset when the doc changes so a tab that
  // doesn't exist on the next page can't leave the body blank.
  useEffect(() => {
    setTab(tabs[0]?.id ?? 'examples')
  }, [doc.slug, tabs])

  return (
    <div className="h-full" key={doc.slug}>
      <HeaderSlot>
        <TabStrip tabs={tabs} value={tab} onChange={setTab} />
      </HeaderSlot>

      {tab === 'preview' && playground}

      {tab === 'guidance' && (
        <Sheet>
          <p className="text-[15px] leading-relaxed text-forest-400">{doc.summary}</p>
          {doc.description && (
            <p className="mt-4 text-sm leading-relaxed text-forest-500">{doc.description}</p>
          )}
          {doc.whenToUse && doc.whenToUse.length > 0 && (
            <section className="mt-6 border border-hair bg-white p-5">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
                When to use
              </h2>
              <ul className="mt-2.5 space-y-1.5">
                {doc.whenToUse.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2.5 text-[13px] leading-relaxed text-forest-500"
                  >
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-azure" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {doc.code && <CodeBlock code={doc.code} label="Usage" className="mt-6" />}
        </Sheet>
      )}

      {tab === 'examples' && (
        <Sheet>
          <div className="space-y-8">
            {doc.examples.map((example) => (
              <section key={example.title}>
                <h2 className="text-sm font-medium text-forest">{example.title}</h2>
                {example.note && (
                  <p className="mt-0.5 text-[13px] leading-relaxed text-forest-400">
                    {example.note}
                  </p>
                )}
                <div className="mt-3 border border-hair bg-white p-5 sm:p-7">
                  <div className={cn(!example.wide && 'flex flex-wrap items-center gap-3')}>
                    {example.body}
                  </div>
                </div>
              </section>
            ))}
          </div>
        </Sheet>
      )}

      {tab === 'props' && doc.props && (
        <Sheet>
          <div className="overflow-x-auto border border-hair bg-white">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-hair">
                  <th className="px-5 py-3 text-[13px] font-normal text-forest-400">Prop</th>
                  <th className="px-5 py-3 text-[13px] font-normal text-forest-400">Type</th>
                  <th className="px-5 py-3 text-[13px] font-normal text-forest-400">Default</th>
                  <th className="px-5 py-3 text-[13px] font-normal text-forest-400">Description</th>
                </tr>
              </thead>
              <tbody>
                {doc.props.map((prop) => (
                  <tr key={prop.name} className="border-b border-hair/60 align-top last:border-0">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[13px] font-medium text-forest">
                        {prop.name}
                        {prop.required && <span className="ml-0.5 text-gold-600">*</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex flex-wrap items-center gap-x-1 gap-y-1.5">
                        {prop.type.split(' | ').map((t, i) => (
                          <span key={t + i} className="flex items-center gap-1">
                            {i > 0 && <span className="text-navy-200">|</span>}
                            <code className="bg-panel px-1.5 py-0.5 font-mono text-[12px] text-forest-500">
                              {t}
                            </code>
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {prop.default ? (
                        <code className="bg-panel px-1.5 py-0.5 font-mono text-[12px] text-forest-500">
                          {prop.default}
                        </code>
                      ) : (
                        <span className="text-[13px] text-forest-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] leading-relaxed text-forest-400">
                      {prop.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sheet>
      )}

      {tab === 'a11y' && (
        <Sheet>
          <ul className="space-y-2.5">
            {doc.a11y.map((note) => (
              <li key={note} className="flex gap-2.5 text-sm leading-relaxed text-forest-500">
                <Check size={15} className="mt-0.5 shrink-0 text-mint" aria-hidden />
                {note}
              </li>
            ))}
          </ul>
        </Sheet>
      )}
    </div>
  )
}
