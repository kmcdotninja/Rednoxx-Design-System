import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Copy, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Input } from '@/components/ui'
import { hexToOklch, readCssTokens, tokensMatching, type Token } from '../tokens'

/** A colour value gets a chip; everything else is quoted as-is. */
function ValueCell({ token }: { token: Token }) {
  const value = token.resolved ?? token.value
  const isColour = /^#|^rgb|^oklch|^hsl/.test(value)
  const oklch = isColour ? hexToOklch(value) : null

  return (
    <span className="flex min-w-0 items-center gap-2">
      {isColour && (
        <span
          aria-hidden
          className="h-4 w-4 shrink-0 border border-black/10"
          style={{ background: value }}
        />
      )}
      <code className="truncate font-mono text-[12px] text-forest-500">{value}</code>
      {oklch && <code className="hidden shrink-0 font-mono text-[11px] text-forest-300 lg:inline">{oklch}</code>}
    </span>
  )
}

function Row({ token }: { token: Token }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`var(${token.name})`)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1400)
    } catch {
      // Clipboard blocked — leave the row idle.
    }
  }

  return (
    <tr className="group border-b border-hair/60 last:border-0">
      <td className="px-4 py-2.5">
        <code className="font-mono text-[12px] font-medium text-forest">{token.name}</code>
      </td>
      <td className="px-4 py-2.5">
        <ValueCell token={token} />
      </td>
      <td className="w-10 px-2 py-2.5">
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Copied' : `Copy var(${token.name})`}
          className={cn(
            'flex h-10 w-10 items-center justify-center text-forest-300 transition-colors',
            'hover:bg-panel hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50',
            'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
          )}
        >
          {copied ? <Check size={14} className="text-mint" aria-hidden /> : <Copy size={14} aria-hidden />}
        </button>
      </td>
    </tr>
  )
}

/**
 * The Tokens view every Foundations page carries beside its Styles view.
 *
 * Values are read from the running stylesheet, so this table is the tokens —
 * not a transcription of them that can fall out of date.
 */
export function TokenTable({ prefixes }: { prefixes: string[] }) {
  const [query, setQuery] = useState('')

  // Styles are parsed once per mount; the sheet doesn't change at runtime.
  const all = useMemo(() => readCssTokens(), [])
  const scoped = useMemo(() => tokensMatching(all, prefixes), [all, prefixes])
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return scoped
    return scoped.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.resolved ?? t.value).toLowerCase().includes(q),
    )
  }, [scoped, query])

  return (
    <div>
      {/* Filter by token name or value — a ramp can run to forty rows. */}
      <div className="relative mb-3 max-w-xs">
        <Search
          size={15}
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-forest-300"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter tokens…"
          aria-label="Filter tokens"
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto border border-hair bg-white">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-hair">
              <th className="px-4 py-2.5 text-[13px] font-normal text-forest-400">Token</th>
              <th className="px-4 py-2.5 text-[13px] font-normal text-forest-400">Value</th>
              <th className="w-10 px-2" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-[13px] text-forest-300">
                  No token matches “{query}”.
                </td>
              </tr>
            ) : (
              rows.map((token) => <Row key={token.name} token={token} />)
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[12px] tabular-nums text-forest-300">
        {rows.length} token{rows.length === 1 ? '' : 's'} · read from{' '}
        <code className="bg-panel px-1.5 py-0.5 font-mono text-[11px]">frontend/src/index.css</code>
      </p>
    </div>
  )
}
