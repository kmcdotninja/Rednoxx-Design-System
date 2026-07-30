import { useEffect, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, type LinkProps } from '@tanstack/react-router'
import { BLOCKS_META, BLOCK_GROUP_ORDER } from '../blocks-meta'
import { COMPONENTS_META, GROUP_ORDER } from '../components-meta'
import { TEMPLATE_ITEMS } from '../nav'
import {
  BLOCK_PREVIEWS,
  COMPONENT_PREVIEWS,
  PreviewFallback,
  TEMPLATE_PREVIEWS,
  TEMPLATE_SUMMARIES,
} from './previews'

interface Entry {
  slug: string
  name: string
  summary: string
}

/**
 * A section landing — one preview card per item, grouped. The cards are the
 * same ones the /design overview uses (name · live preview · summary), so the
 * index reads as an explorer rather than a bare list. A missing preview falls
 * back to a labelled placeholder.
 */
function Index({
  title,
  intro,
  groups,
  basePath,
  previews,
}: {
  title: string
  intro: string
  groups: { label: string; items: Entry[] }[]
  basePath: string
  /** slug → preview node; borrowed from the overview's preview set. */
  previews: Record<string, ReactNode>
}) {
  useEffect(() => {
    document.title = `${title} — Rednoxx Design System`
    return () => {
      document.title = 'Rednoxx — Healthcare Platform Design System'
    }
  }, [title])

  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
      <p className="max-w-2xl text-[15px] leading-relaxed text-forest-400">{intro}</p>
      <p className="mt-2 text-[13px] tabular-nums text-forest-300">
        {total} documented · {groups.length} groups
      </p>

      {groups.map((group) => (
        <section key={group.label} className="mt-8">
          <h2 className="text-[13px] font-medium text-forest-500">{group.label}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <Link
                key={item.slug}
                to={`${basePath}/${item.slug}` as LinkProps['to']}
                className="group flex flex-col rounded-4xl border border-hair bg-white p-4 transition-[border-color,box-shadow] duration-150 hover:border-navy-200 hover:shadow-card-hover"
              >
                <p className="flex items-center justify-between text-sm font-medium text-forest">
                  {item.name}
                  <ArrowRight
                    size={14}
                    className="text-forest-200 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:text-forest-400"
                  />
                </p>
                <div className="flex min-h-[116px] flex-1 items-center justify-center overflow-hidden py-4">
                  {previews[item.slug] ?? <PreviewFallback label={item.name} />}
                </div>
                <p className="text-[12px] leading-relaxed text-forest-400">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export function ComponentsIndex() {
  return (
    <Index
      title="Components"
      intro="The primitives in components/ui — one interaction each, no domain knowledge. Anything that knows what a patient is lives in Blocks instead."
      basePath="/design/components"
      previews={COMPONENT_PREVIEWS}
      groups={GROUP_ORDER.map((group) => ({
        label: group,
        items: COMPONENTS_META.filter((c) => c.group === group),
      }))}
    />
  )
}

export function BlocksIndex() {
  return (
    <Index
      title="Blocks"
      intro="Compositions in components/blocks — they carry product meaning, and screens are assembled from them rather than from raw primitives. Page templates sit at the end."
      basePath="/design/blocks"
      previews={{ ...BLOCK_PREVIEWS, ...TEMPLATE_PREVIEWS }}
      groups={[
        ...BLOCK_GROUP_ORDER.map((group) => ({
          label: group,
          items: BLOCKS_META.filter((b) => b.group === group),
        })),
        {
          label: 'Templates',
          items: TEMPLATE_ITEMS.map((t) => {
            const slug = t.path.split('/').pop() ?? ''
            return {
              slug,
              name: t.label,
              summary:
                TEMPLATE_SUMMARIES[slug] ??
                'Page-scale layout — pick the template, then fill its slots with blocks.',
            }
          }),
        },
      ]}
    />
  )
}
