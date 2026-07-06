import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Blocks,
  BookOpen,
  Component,
  LayoutTemplate,
  Menu,
  MonitorPlay,
  Search,
  SwatchBook,
  X,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/Logo'
import { CommandMenu, Kbd, Tag, useCommandMenu, type Command } from '@/components/ui'
import { GROUP_ORDER, REGISTRY, docsInGroup } from './registry'
import { BLOCK_GROUP_ORDER, BLOCKS_META, blocksInGroup } from './blocks-meta'

/** Demo screens, listed as literals — importing DEMO_NAV would pull the lazy demo chunk into the shell. */
const DEMO_SCREENS: { slug: string; label: string }[] = [
  { slug: 'overview', label: 'Overview' },
  { slug: 'analytics', label: 'Analytics' },
  { slug: 'reports', label: 'Reports' },
  { slug: 'patients', label: 'Patients' },
  { slug: 'appointments', label: 'Appointments' },
  { slug: 'consultations', label: 'Consultations' },
  { slug: 'prescriptions', label: 'Prescriptions' },
  { slug: 'lab-orders', label: 'Lab orders' },
  { slug: 'surgical-orders', label: 'Surgical orders' },
  { slug: 'payments', label: 'Payments' },
  { slug: 'insurance-claims', label: 'Insurance claims' },
  { slug: 'staff', label: 'Staff' },
  { slug: 'settings', label: 'Settings' },
]

function navClass(isActive: boolean) {
  return cn(
    'flex h-8 items-center gap-2.5 rounded-xl px-2.5 text-[13px] transition-colors',
    isActive
      ? 'bg-panel font-medium text-forest'
      : 'text-forest-400 hover:bg-panel/60 hover:text-forest',
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="flex items-center justify-between px-5 pb-3 pt-5">
        <NavLink to="/" onClick={onNavigate} className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50">
          <Logo className="h-6" />
        </NavLink>
      </div>

      <nav aria-label="Documentation" className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
        <p className="px-2.5 pb-1 pt-3 text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
          Getting started
        </p>
        <NavLink to="/" end onClick={onNavigate} className={({ isActive }) => navClass(isActive)}>
          <BookOpen size={15} className="text-forest-300" />
          Overview
        </NavLink>
        <NavLink to="/foundations" onClick={onNavigate} className={({ isActive }) => navClass(isActive)}>
          <SwatchBook size={15} className="text-forest-300" />
          Foundations
        </NavLink>
        <NavLink to="/templates" onClick={onNavigate} className={({ isActive }) => navClass(isActive)}>
          <LayoutTemplate size={15} className="text-forest-300" />
          Templates
        </NavLink>
        <NavLink to="/demo" onClick={onNavigate} className={({ isActive }) => navClass(isActive)}>
          <MonitorPlay size={15} className="text-forest-300" />
          Product demo
        </NavLink>

        {GROUP_ORDER.map((group) => (
          <div key={group}>
            <p className="px-2.5 pb-1 pt-5 text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
              {group}
            </p>
            {docsInGroup(group).map((doc) => (
              <NavLink
                key={doc.slug}
                to={`/components/${doc.slug}`}
                onClick={onNavigate}
                className={({ isActive }) => navClass(isActive)}
              >
                {doc.name}
              </NavLink>
            ))}
          </div>
        ))}

        <p className="mt-6 border-t border-hair px-2.5 pb-1 pt-5 text-[11px] font-medium uppercase tracking-[0.08em] text-azure-600">
          Blocks
        </p>
        {BLOCK_GROUP_ORDER.map((group) => (
          <div key={group}>
            <p className="px-2.5 pb-1 pt-3 text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
              {group}
            </p>
            {blocksInGroup(group).map((block) => (
              <NavLink
                key={block.slug}
                to={`/blocks/${block.slug}`}
                onClick={onNavigate}
                className={({ isActive }) => navClass(isActive)}
              >
                {block.name}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-2 border-t border-hair px-5 py-4">
        <Tag>v1.0</Tag>
        <Tag>WCAG 2.2 AA</Tag>
      </div>
    </>
  )
}

/** The documentation shell — fixed sidebar on desktop, overlay menu on mobile. */
export function Shell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useCommandMenu()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const commands: Command[] = useMemo(
    () => [
      { id: 'page-overview', label: 'Overview', group: 'Pages', icon: BookOpen, keywords: 'home start engagement layers index', onSelect: () => navigate('/') },
      { id: 'page-foundations', label: 'Foundations', group: 'Pages', icon: SwatchBook, keywords: 'tokens colour color type typography spacing radius elevation shadow motion icons brand', onSelect: () => navigate('/foundations') },
      { id: 'page-templates', label: 'Templates', group: 'Pages', icon: LayoutTemplate, keywords: 'layouts dashboard list record settings auth pages', onSelect: () => navigate('/templates') },
      { id: 'page-demo', label: 'Product demo', group: 'Pages', icon: MonitorPlay, keywords: 'live app screens', onSelect: () => navigate('/demo') },
      ...REGISTRY.map((doc) => ({
        id: `component-${doc.slug}`,
        label: doc.name,
        group: 'Components',
        icon: Component,
        hint: doc.group,
        keywords: `${doc.slug} ${doc.summary}`,
        onSelect: () => navigate(`/components/${doc.slug}`),
      })),
      ...BLOCKS_META.map((block) => ({
        id: `block-${block.slug}`,
        label: block.name,
        group: 'Blocks',
        icon: Blocks,
        hint: block.group,
        keywords: `${block.slug} ${block.summary}`,
        onSelect: () => navigate(`/blocks/${block.slug}`),
      })),
      ...DEMO_SCREENS.map((screen) => ({
        id: `demo-${screen.slug}`,
        label: screen.label,
        group: 'Product demo',
        icon: MonitorPlay,
        keywords: screen.slug,
        onSelect: () => navigate(`/demo/${screen.slug}`),
      })),
    ],
    [navigate],
  )

  return (
    <div className="min-h-screen bg-canvas">
      <CommandMenu
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        commands={commands}
        placeholder="Search components, blocks, pages…"
      />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-hair bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Desktop search — fixed top-right, shadcn-style */}
      <div className="fixed right-6 top-5 z-30 hidden lg:block">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex h-9 w-60 items-center gap-2 rounded-2xl border border-hair bg-white/90 px-3 text-[13px] text-forest-300 shadow-chip backdrop-blur transition-colors hover:border-navy-200 hover:text-forest-400"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search documentation…</span>
          <Kbd>⌘K</Kbd>
        </button>
      </div>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-hair bg-white/90 px-4 backdrop-blur lg:hidden">
        <NavLink to="/">
          <Logo className="h-5" />
        </NavLink>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-forest-500 transition-colors hover:bg-panel"
          >
            <Search size={17} />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-forest-500 transition-colors hover:bg-panel"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-forest-900/25 backdrop-blur-[3px]" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 animate-pop flex-col bg-white shadow-pop">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 flex h-10 w-10 items-center justify-center rounded-xl text-forest-400 transition-colors hover:bg-panel"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <main className="lg:pl-60">
        <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
