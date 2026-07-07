import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { Breadcrumb, Tag } from '@/components/ui'
import type { ComponentDoc } from '../types'

/** Shared renderer for a documented component or block. */
export function DocArticle({
  doc,
  prev,
  next,
  basePath,
  rootLabel,
}: {
  doc: ComponentDoc
  prev?: ComponentDoc
  next?: ComponentDoc
  /** e.g. "/components" or "/blocks" */
  basePath: string
  /** e.g. "Components" or "Blocks" */
  rootLabel: string
}) {
  useEffect(() => {
    document.title = `${doc.name} — Rednoxx Design System`
    return () => {
      document.title = 'Rednoxx — Healthcare Platform Design System'
    }
  }, [doc.name])

  return (
    <article className="animate-rise" key={doc.slug}>
      <Breadcrumb items={[{ label: rootLabel, to: '/' }, { label: doc.name }]} className="-ml-1.5" />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-[26px] font-medium tracking-[-0.02em] text-forest">{doc.name}</h1>
        <Tag>{doc.group}</Tag>
      </div>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-forest-400">{doc.summary}</p>
      {doc.description && (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-forest-500">{doc.description}</p>
      )}

      {doc.whenToUse && doc.whenToUse.length > 0 && (
        <div className="mt-5 max-w-2xl rounded-3xl border border-hair bg-white p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
            When to use
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {doc.whenToUse.map((line) => (
              <li key={line} className="flex gap-2.5 text-[13px] leading-relaxed text-forest-500">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-azure" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {doc.code && (
        <div className="mt-6 overflow-x-auto rounded-3xl bg-navy p-5">
          <pre className="font-mono text-[13px] leading-relaxed text-navy-100">
            <code>{doc.code}</code>
          </pre>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {doc.examples.map((example) => (
          <section key={example.title}>
            <h2 className="text-sm font-medium text-forest">{example.title}</h2>
            {example.note && <p className="mt-0.5 text-[13px] text-forest-400">{example.note}</p>}
            <div className="mt-3 rounded-4xl border border-hair bg-white p-5 sm:p-7">
              <div className={cn(!example.wide && 'flex flex-wrap items-center gap-3')}>
                {example.body}
              </div>
            </div>
          </section>
        ))}
      </div>

      {doc.props && doc.props.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-medium text-forest">Props</h2>
          <div className="mt-3 overflow-x-auto rounded-4xl border border-hair bg-white">
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
                  <tr key={prop.name} className="border-b border-hair/60 last:border-0 align-top">
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
                            <code className="rounded-lg bg-panel px-1.5 py-0.5 font-mono text-[12px] text-forest-500">
                              {t}
                            </code>
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {prop.default ? (
                        <code className="rounded-lg bg-panel px-1.5 py-0.5 font-mono text-[12px] text-forest-500">
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
        </section>
      )}

      <section className="mt-10 rounded-4xl bg-panel p-5 sm:p-6">
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-forest-400">
          Accessibility
        </h2>
        <ul className="mt-3 space-y-2.5">
          {doc.a11y.map((note) => (
            <li key={note} className="flex gap-2.5 text-sm leading-relaxed text-forest-500">
              <Check size={15} className="mt-0.5 shrink-0 text-mint" aria-hidden />
              {note}
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="Document pagination" className="mt-10 flex items-center justify-between gap-3 border-t border-hair pt-5">
        {prev ? (
          <Link
            to={`${basePath}/${prev.slug}`}
            className="group flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-forest-400 transition-colors hover:bg-panel hover:text-forest"
          >
            <ArrowLeft size={15} className="transition-transform duration-150 group-hover:-translate-x-0.5" />
            {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            to={`${basePath}/${next.slug}`}
            className="group flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm text-forest-400 transition-colors hover:bg-panel hover:text-forest"
          >
            {next.name}
            <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        )}
      </nav>
    </article>
  )
}
