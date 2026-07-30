import { useEffect } from 'react'
import { Navigate, useParams } from '@tanstack/react-router'
import { AlertTriangle, Check, Info, ShieldAlert, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { CodeBlock } from '@/components/ui'
import type { Article, ArticleBlock } from '../articles/types'

const CALLOUT = {
  info: { icon: Info, wrap: 'border-azure-200 bg-azure-50', mark: 'text-azure', word: 'Note' },
  warn: { icon: AlertTriangle, wrap: 'border-gold bg-gold-soft', mark: 'text-gold-600', word: 'Caution' },
  danger: { icon: ShieldAlert, wrap: 'border-rose-ink/30 bg-rose-soft', mark: 'text-rose-ink', word: 'Safety' },
  success: { icon: Check, wrap: 'border-mint/30 bg-mint-soft', mark: 'text-mint', word: 'Do' },
} as const

function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case 'h':
      return <h2 className="mt-10 text-[15px] font-medium text-forest first:mt-0">{block.text}</h2>

    case 'p':
      return <p className="mt-3 text-sm leading-relaxed text-forest-500">{block.text}</p>

    case 'list':
      return (
        <ul className="mt-3 space-y-1.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-forest-500">
              <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-azure" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )

    case 'steps':
      return (
        <ol className="mt-3 space-y-2">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-forest-500">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-panel text-[11px] font-medium tabular-nums text-forest-400"
                aria-hidden
              >
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )

    case 'table':
      return (
        <div className="mt-4 overflow-x-auto border border-hair bg-white">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="border-b border-hair">
                {block.head.map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[13px] font-normal text-forest-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join('|')} className="border-b border-hair/60 align-top last:border-0">
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={cn(
                        'px-4 py-3 text-[13px] leading-relaxed',
                        i === 0 ? 'font-medium text-forest' : 'text-forest-400',
                      )}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'code':
      return <CodeBlock code={block.code} label={block.label} className="mt-4" />

    case 'callout': {
      const { icon: Icon, wrap, mark, word } = CALLOUT[block.tone]
      return (
        <div className={cn('mt-4 border p-4', wrap)}>
          <p className={cn('flex items-center gap-2 text-[13px] font-medium', mark)}>
            <Icon size={15} aria-hidden />
            {/* Tone is carried by the word as well as the colour. */}
            <span className="uppercase tracking-[0.06em]">{word}</span>
            <span className="text-forest">· {block.title}</span>
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-forest-500">{block.text}</p>
        </div>
      )
    }

    case 'dodont':
      return (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {block.do && (
            <div className="border border-mint/30 bg-white p-4">
              <p className="flex items-center gap-2 text-[13px] font-medium text-mint">
                <Check size={15} aria-hidden /> Do
              </p>
              <ul className="mt-2 space-y-1.5">
                {block.do.map((item) => (
                  <li key={item} className="text-[13px] leading-relaxed text-forest-500">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {block.dont && (
            <div className="border border-rose-ink/30 bg-white p-4">
              <p className="flex items-center gap-2 text-[13px] font-medium text-rose-ink">
                <X size={15} aria-hidden /> Don’t
              </p>
              <ul className="mt-2 space-y-1.5">
                {block.dont.map((item) => (
                  <li key={item} className="text-[13px] leading-relaxed text-forest-500">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
  }
}

/** Renders one authored article. The Shell header owns the title and pager. */
export function ArticleView({ article }: { article: Article }) {
  useEffect(() => {
    document.title = `${article.title} — Rednoxx Design System`
    return () => {
      document.title = 'Rednoxx — Healthcare Platform Design System'
    }
  }, [article.title])

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8" key={article.slug}>
      <p className="text-[15px] leading-relaxed text-forest-400">{article.summary}</p>
      <div className="mt-2">
        {article.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
      {article.source && (
        <p className="mt-12 border-t border-hair pt-4 text-[13px] text-forest-300">
          Source of truth:{' '}
          <code className="bg-panel px-1.5 py-0.5 font-mono text-[12px] text-forest-400">
            {article.source}
          </code>
        </p>
      )}
    </div>
  )
}

/** Route component — resolves `$slug` against one section's article list. */
export function makeArticlePage(articles: Article[], fallback: string) {
  return function ArticlePage() {
    const { slug } = useParams({ strict: false })
    const article = articles.find((a) => a.slug === slug)
    if (!article) return <Navigate to={fallback} replace />
    return <ArticleView article={article} />
  }
}
