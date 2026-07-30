import { ArrowRight, FolderSearch, MonitorPlay, SwatchBook, type LucideIcon } from 'lucide-react'
import { Link, useLocation, type LinkProps } from '@tanstack/react-router'
import { ErrorPage } from '@/components/blocks'
import { ButtonLink } from '@/components/ui'

/* Design-system port: Admin (/admin) and Care (/care) homes live in the product
   repo, so this 404 offers the surfaces that exist here — the same three the
   entry hall lists, in the same order. */
const DESTINATIONS: {
  to: LinkProps['to']
  icon: LucideIcon
  title: string
  blurb: string
}[] = [
  {
    to: '/design',
    icon: SwatchBook,
    title: 'Design system',
    blurb: 'Foundations, components and healthcare blocks.',
  },
  {
    to: '/demo/overview',
    icon: MonitorPlay,
    title: 'Product demo',
    blurb: 'The clinical walkthrough on live mock data.',
  },
  {
    to: '/him-demo',
    icon: FolderSearch,
    title: 'HIM module',
    blurb: 'Master patient index, registration, merge and audit.',
  },
]

/**
 * Root 404 for any path no stream claims. Standalone (outside every shell), so
 * it carries its own way out: the address that failed — printed, because a
 * mistyped URL is only diagnosable if you can see it — then the entry hall and
 * one card per surface that does exist.
 */
export function NotFoundPage() {
  const { pathname, searchStr } = useLocation()
  const attempted = pathname + searchStr

  return (
    <ErrorPage
      kind="not-found"
      description="No stream claims this address. Nothing was changed, and any work in another tab is untouched."
      detail={
        <p className="flex max-w-full flex-wrap items-baseline justify-center gap-x-2 gap-y-1 text-caption text-forest-400">
          You asked for
          <code className="max-w-full break-all border border-hair bg-panel px-2 py-1 font-mono text-caption text-forest-500">
            {attempted}
          </code>
        </p>
      }
      action={
        <ButtonLink to="/start" rightIcon={<ArrowRight size={15} />}>
          Back to Home
        </ButtonLink>
      }
      footer={
        <div className="mx-auto w-full max-w-4xl">
          <div className="border-t border-hair pt-8">
            <h2 className="text-center text-overline uppercase text-forest-300">
              Try these sections
            </h2>
            <ul className="mt-4 grid gap-gutter sm:grid-cols-3">
              {DESTINATIONS.map(({ to, icon: Icon, title, blurb }) => (
                <li key={title}>
                  <Link
                    to={to}
                    className="group flex h-full flex-col border border-hair bg-white p-card-sm transition-[border-color,box-shadow] duration-150 hover:border-navy-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center bg-azure-50 text-azure">
                      <Icon size={17} aria-hidden />
                    </span>
                    <span className="mt-4 flex items-center justify-between text-heading text-forest">
                      {title}
                      <ArrowRight
                        size={15}
                        aria-hidden
                        className="text-forest-300 transition-transform duration-150 group-hover:translate-x-0.5"
                      />
                    </span>
                    <span className="mt-1.5 text-secondary text-forest-400">{blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    />
  )
}
