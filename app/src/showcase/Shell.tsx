import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { BookOpen, LayoutTemplate, Menu, MonitorPlay, SwatchBook, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/Logo'
import { Tag } from '@/components/ui'
import { GROUP_ORDER, docsInGroup } from './registry'
import { BLOCK_GROUP_ORDER, blocksInGroup } from './blocks-meta'

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
  const { pathname } = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-hair bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-hair bg-white/90 px-4 backdrop-blur lg:hidden">
        <NavLink to="/">
          <Logo className="h-5" />
        </NavLink>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-forest-500 transition-colors hover:bg-panel"
        >
          <Menu size={18} />
        </button>
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
