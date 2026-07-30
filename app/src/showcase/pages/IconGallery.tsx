import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Copy, icons } from 'lucide-react'
import { Button, Card, CodeBlock, EmptyState, SearchInput, Tag } from '@/components/ui'
import { cn } from '@/lib/cn'

/**
 * The whole Lucide set, browsable — a designer finds the shape, an engineer
 * copies the import. Loaded behind its own chunk (see Foundations) because the
 * full set is ~1,745 components; no other page pays for it.
 *
 * `icons` is Lucide's canonical map: one entry per icon under the name we
 * import it by, with the deprecated aliases the flat exports still carry left
 * out — so the count here is the count of icons that actually exist.
 */

/** `CircleAlert` → `circle-alert`, so kebab searches hit too. */
function kebab(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

interface Entry {
  name: string
  Icon: (typeof icons)[keyof typeof icons]
  /** Pre-lowered haystack: "circle-alert circlealert". */
  hay: string
}

const ALL: Entry[] = Object.entries(icons).map(([name, Icon]) => {
  const dashed = kebab(name)
  return { name, Icon, hay: `${dashed} ${dashed.replace(/-/g, '')}` }
})

const BY_NAME = new Map(ALL.map((entry) => [entry.name, entry]))

/** Icons per render pass — bounds the DOM and the tab order on first paint.
    Five to a row, so a pass is twenty rows. */
const PAGE = 100

const fmt = (n: number) => n.toLocaleString('en-US')

export function IconGallery() {
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE)
  const [picked, setPicked] = useState('Stethoscope')
  /** The icon whose import is on the clipboard right now, for its tile’s tick. */
  const [copied, setCopied] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, '-')
    if (!q) return ALL
    const flat = q.replace(/-/g, '')
    return ALL.filter((entry) => entry.hay.includes(q) || entry.hay.includes(flat))
  }, [query])

  const shown = matches.slice(0, limit)

  /** Alphabetical runs, so a long scroll keeps its bearings. */
  const groups: { letter: string; items: Entry[] }[] = []
  for (const item of shown) {
    const letter = item.name[0].toUpperCase()
    const last = groups[groups.length - 1]
    if (last?.letter === letter) last.items.push(item)
    else groups.push({ letter, items: [item] })
  }

  const entry = BY_NAME.get(picked) ?? ALL[0]
  const Picked = entry.Icon
  const snippet = `import { ${entry.name} } from 'lucide-react'\n\n<${entry.name} size={15} aria-hidden />`

  /** Selecting an icon also puts its import on the clipboard — that is the job. */
  const pick = async (name: string) => {
    setPicked(name)
    try {
      await navigator.clipboard.writeText(`import { ${name} } from 'lucide-react'`)
      setCopied(name)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(null), 1600)
    } catch {
      // Clipboard blocked (insecure origin / denied) — selection still works.
      setCopied(null)
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {/* The picked icon and the import it needs — whole statement, not a fragment. */}
      <Card pad={false} className="grid gap-5 p-5 lg:grid-cols-[15rem_1fr] lg:items-center sm:p-6">
        <div>
          <div className="flex items-end gap-3.5">
            <Picked size={32} className="text-forest" aria-hidden />
            {[24, 18, 15, 13].map((px) => (
              <Picked key={px} size={px} className="text-forest-400" aria-hidden />
            ))}
          </div>
          <p className="mt-3.5 text-sm font-medium text-forest">{entry.name}</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-forest-300">
            {copied ? 'Import copied to the clipboard.' : 'Pick any icon to copy its import.'}
          </p>
        </div>
        <CodeBlock code={snippet} label="Usage" />
      </Card>

      {/* Search over the whole set. */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setLimit(PAGE)
          }}
          placeholder="Search the set — “heart”, “pill”, “calendar”…"
          aria-label="Search icons"
          wrapClassName="min-w-56 flex-1"
        />
        <p className="tnum text-[13px] text-forest-300">
          {matches.length === ALL.length
            ? `${fmt(ALL.length)} icons`
            : `${fmt(matches.length)} of ${fmt(ALL.length)}`}
          {shown.length < matches.length && ` · showing ${fmt(shown.length)}`}
        </p>
        <Tag>lucide-react</Tag>
      </div>

      {matches.length === 0 ? (
        <Card pad={false}>
          <EmptyState
            compact
            variant="search"
            title="No icon by that name"
            description="Lucide names describe the shape, not the meaning — try “circle”, “file” or “arrow”."
          />
        </Card>
      ) : (
        <>
          {/* Five to a row on desktop: the name reads top-left, the glyph sits
              in the middle of the cell, and the copy affordance appears on
              hover — one hairline grid, no gutters. */}
          <div className="space-y-6">
            {groups.map((group) => (
              <section key={group.letter}>
                <h3 className="text-[17px] font-medium tracking-[-0.01em] text-forest">
                  {group.letter}
                  <span className="tnum ml-2 text-[12px] font-normal text-forest-300">
                    {fmt(group.items.length)}
                  </span>
                </h3>
                <div className="mt-2.5 grid grid-cols-2 gap-px border border-hair bg-hair sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {group.items.map(({ name, Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => pick(name)}
                      title={name}
                      aria-pressed={name === entry.name}
                      className={cn(
                        'group relative flex h-36 min-w-0 flex-col p-3.5 text-left transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure/60',
                        name === entry.name
                          ? 'bg-azure-50 text-azure ring-1 ring-inset ring-azure'
                          : 'bg-white text-forest-500 hover:bg-panel/60',
                      )}
                    >
                      {/* Set in Geist like every other label — 1,745 mono names
                          read as code noise at this density. */}
                      <span className="line-clamp-2 w-full text-[12px] leading-snug text-forest-400">
                        {name}
                      </span>
                      <span className="flex flex-1 items-center justify-center pb-2">
                        <Icon size={26} aria-hidden />
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          'absolute bottom-3 right-3.5 transition-opacity duration-150',
                          copied === name
                            ? 'text-mint opacity-100'
                            : 'text-forest-300 opacity-0 group-hover:opacity-100',
                        )}
                      >
                        {copied === name ? <Check size={14} /> : <Copy size={14} />}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {shown.length < matches.length && (
            <div className="flex justify-center pt-2">
              <Button variant="secondary" onClick={() => setLimit((n) => n + PAGE * 2)}>
                Show {fmt(Math.min(PAGE * 2, matches.length - shown.length))} more
              </Button>
            </div>
          )}
        </>
      )}

      {/* Announce the copy without moving focus. */}
      <span aria-live="polite" className="sr-only">
        {copied ? `${copied} import copied to clipboard` : ''}
      </span>
    </div>
  )
}
