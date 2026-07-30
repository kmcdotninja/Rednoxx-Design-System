import {
  ArrowRight,
  BookOpen,
  FolderSearch,
  MonitorPlay,
  SwatchBook,
  type LucideIcon,
} from 'lucide-react'
import { Link, type LinkProps } from '@tanstack/react-router'
import { Logo } from '@/components/Logo'

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
    blurb: 'Foundations, thirty-six documented components and healthcare blocks — the language every screen is built from.',
  },
  {
    to: '/demo/overview',
    icon: MonitorPlay,
    title: 'Product demo',
    blurb: 'The clinical product walkthrough — dashboards, patients, orders, finance and staff on live mock data.',
  },
  {
    to: '/him-demo',
    icon: FolderSearch,
    title: 'HIM module',
    blurb: 'Health Information Management — master patient index, registration, duplicates & merge, releases and audit.',
  },
  {
    to: '/case-study',
    icon: BookOpen,
    title: 'Case study',
    blurb: 'The written argument — the problem clinical software poses, the four layers, and the decisions behind them.',
  },
]

/** Entry hall for the Rednoxx workspace — one card per destination. */
export function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-canvas px-6 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <Logo className="h-7" />
        <p className="max-w-md text-sm text-forest-400">
          One design language for the Rednoxx healthcare platform. Pick a surface to explore.
        </p>
      </div>

      {/* Wider than the 896px reading measure: this is a card grid, and a
          fourth destination at max-w-4xl squeezed each blurb to five lines. */}
      <ul className="grid w-full max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DESTINATIONS.map(({ to, icon: Icon, title, blurb }) => (
          <li key={title}>
            <Link
              to={to}
              className="group flex h-full flex-col rounded-4xl border border-hair bg-white p-5 transition-[border-color,box-shadow] duration-150 hover:border-navy-200 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-azure-50 text-azure">
                <Icon size={17} />
              </span>
              <span className="mt-4 flex items-center justify-between text-[15px] font-medium tracking-[-0.01em] text-forest">
                {title}
                <ArrowRight
                  size={15}
                  className="text-forest-300 transition-transform duration-150 group-hover:translate-x-0.5"
                />
              </span>
              <span className="mt-1.5 text-[13px] leading-relaxed text-forest-400">{blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
