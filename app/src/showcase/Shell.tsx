import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  type LinkProps,
  type NavigateOptions,
} from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  Component,
  Menu,
  MonitorPlay,
  PanelLeft,
  PanelRight,
  Search,
  X,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/Logo'
import { CommandMenu, Kbd, Tag, useCommandMenu, type Command } from '@/components/ui'
import { ShellSlotProvider, useSlotTarget } from './controls-slot'
import { ALL_ITEMS, SECTIONS, itemForPath, neighbours, sectionForPath } from './nav'

/** Site paths are plain strings; TanStack wants its generated union. */
const to = (path: string) => path as LinkProps['to']

/* --------------------------------- Top nav -------------------------------- */

function TopNav({ onOpenSearch, onOpenMenu }: { onOpenSearch: () => void; onOpenMenu: () => void }) {
  const { pathname } = useLocation()
  const active = sectionForPath(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-hair bg-white px-4 sm:px-5">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open navigation"
        className="flex h-10 w-10 items-center justify-center text-forest-500 transition-colors hover:bg-panel lg:hidden"
      >
        <Menu size={18} />
      </button>

      <Link
        to="/design"
        className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/50"
      >
        <Logo className="h-6" />
      </Link>

      <nav
        aria-label="Sections"
        className="no-scrollbar hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto lg:flex"
      >
        {SECTIONS.map((section) => {
          const isActive = active?.id === section.id
          return (
            <Link
              key={section.id}
              to={to(section.path)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex h-9 shrink-0 items-center px-3 text-[13px] transition-colors',
                isActive
                  ? 'bg-panel font-medium text-forest'
                  : 'text-forest-400 hover:bg-panel/60 hover:text-forest',
              )}
            >
              {section.label}
            </Link>
          )
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden h-9 w-56 items-center gap-2 border border-hair bg-white px-3 text-[13px] text-forest-300 transition-colors hover:border-navy-200 hover:text-forest-400 md:flex"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search…</span>
          <Kbd>⌘K</Kbd>
        </button>
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center text-forest-500 transition-colors hover:bg-panel md:hidden"
        >
          <Search size={17} />
        </button>
        <Link
          to="/demo"
          className="hidden h-9 items-center gap-2 border border-hair px-3 text-[13px] text-forest-400 transition-colors hover:border-navy-200 hover:text-forest sm:flex"
        >
          <MonitorPlay size={14} />
          Product demo
        </Link>
      </div>
    </header>
  )
}

/* -------------------------------- Sidebar --------------------------------- */

function navClass(isActive: boolean) {
  return cn(
    'flex min-h-10 items-center px-2.5 py-2 text-[13px] transition-colors',
    isActive
      ? 'bg-panel font-medium text-forest'
      : 'text-forest-400 hover:bg-panel/60 hover:text-forest',
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation()
  const section = sectionForPath(pathname) ?? SECTIONS[0]

  return (
    <nav
      aria-label={`${section.label} pages`}
      className="no-scrollbar flex-1 overflow-y-auto overscroll-contain px-3 pb-6"
    >
      {section.groups.map((group, index) => (
        <div key={group.label ?? `lead-${index}`}>
          {group.label && (
            <p className="px-2.5 pb-1 pt-5 text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
              {group.label}
            </p>
          )}
          {group.items.map((item) => (
            <Link
              key={item.path}
              to={to(item.path)}
              onClick={onNavigate}
              className={navClass(pathname === item.path)}
              aria-current={pathname === item.path ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  )
}

function SidebarHeader({ onCollapse, onClose }: { onCollapse?: () => void; onClose?: () => void }) {
  const { pathname } = useLocation()
  const section = sectionForPath(pathname) ?? SECTIONS[0]

  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-hair px-5">
      <p className="truncate text-[13px] font-medium text-forest">{section.label}</p>
      {onCollapse && (
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Collapse navigation"
          className="flex h-8 w-8 items-center justify-center text-forest-300 transition-colors hover:bg-panel hover:text-forest"
        >
          <PanelLeft size={16} />
        </button>
      )}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="flex h-10 w-10 items-center justify-center text-forest-400 transition-colors hover:bg-panel"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}

/* ----------------------------- Page header -------------------------------- */

function PageHeader({
  railOpen,
  showRailToggle,
  onOpenRail,
  onOpenSidebar,
  headerSlotRef,
}: {
  railOpen: boolean
  showRailToggle: boolean
  onOpenRail: () => void
  onOpenSidebar?: () => void
  headerSlotRef: (el: HTMLDivElement | null) => void
}) {
  const { pathname } = useLocation()
  const entry = itemForPath(pathname)
  const { prev, next } = neighbours(pathname)
  const title = entry?.item.label ?? 'Overview'

  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-hair bg-white px-5 sm:px-6">
      {onOpenSidebar && (
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Expand navigation"
          className="flex h-10 w-10 shrink-0 items-center justify-center text-forest-300 transition-colors hover:bg-panel hover:text-forest"
        >
          <PanelLeft size={16} />
        </button>
      )}
      <h1 className="shrink-0 truncate text-[15px] font-medium text-forest">{title}</h1>

      {/* Page tabs — "When to use", "Props" and friends portal in here. */}
      <div ref={headerSlotRef} className="no-scrollbar min-w-0 flex-1 overflow-x-auto" />

      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        {prev ? (
          <Link
            to={to(prev.path)}
            aria-label={`Previous: ${prev.label}`}
            title={prev.label}
            className="flex h-10 w-10 items-center justify-center text-forest-400 transition-colors hover:bg-panel hover:text-forest"
          >
            <ArrowLeft size={16} />
          </Link>
        ) : (
          <span className="flex h-10 w-10 items-center justify-center text-navy-200" aria-hidden>
            <ArrowLeft size={16} />
          </span>
        )}
        {next ? (
          <Link
            to={to(next.path)}
            aria-label={`Next: ${next.label}`}
            title={next.label}
            className="flex h-10 w-10 items-center justify-center text-forest-400 transition-colors hover:bg-panel hover:text-forest"
          >
            <ArrowRight size={16} />
          </Link>
        ) : (
          <span className="flex h-10 w-10 items-center justify-center text-navy-200" aria-hidden>
            <ArrowRight size={16} />
          </span>
        )}
        {showRailToggle && !railOpen && (
          <button
            type="button"
            onClick={onOpenRail}
            aria-label="Show controls"
            className="ml-1 flex h-10 w-10 items-center justify-center text-forest-300 transition-colors hover:bg-panel hover:text-forest"
          >
            <PanelRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

/* ---------------------------------- Shell --------------------------------- */

/**
 * The documentation frame — a fixed three-pane app layout: a section top nav,
 * the section's sidebar, a scrolling content column with its own header, and a
 * Controls rail that component and block pages portal into. Panes scroll
 * independently and both sides collapse; below `lg` the sidebar becomes an
 * overlay and the rail folds away.
 */
export function Shell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [railOpen, setRailOpen] = useState(true)
  const [searchOpen, setSearchOpen] = useCommandMenu()
  const [railEl, setRailEl] = useSlotTarget()
  const [headerEl, setHeaderEl] = useSlotTarget()
  const [railActive, setRailActive] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const slots = useMemo(
    () => ({ rail: railEl, header: headerEl, setRailActive }),
    [railEl, headerEl],
  )

  const commands: Command[] = useMemo(
    () =>
      ALL_ITEMS.map(({ item, section }) => ({
        id: `nav-${item.path}`,
        label: item.label,
        group: section.label,
        icon: section.id === 'blocks' ? Blocks : Component,
        hint: section.label,
        keywords: item.path,
        onSelect: () => navigate({ to: item.path as NavigateOptions['to'] }),
      })),
    [navigate],
  )

  return (
    /* `overflow-clip`, not `overflow-hidden`: a hidden box is still
       programmatically scrollable, so on a very long page (the icon set)
       scroll chaining or a focus reveal could scroll the whole shell and
       push the top nav and sidebar off-screen. Clip cannot scroll at all. */
    <div className="flex h-screen flex-col overflow-clip bg-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-forest focus:shadow-pop focus:outline-none focus:ring-2 focus:ring-azure/50"
      >
        Skip to content
      </a>
      <CommandMenu
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        commands={commands}
        placeholder="Search the design system…"
      />

      <TopNav onOpenSearch={() => setSearchOpen(true)} onOpenMenu={() => setMenuOpen(true)} />

      <div className="flex min-h-0 flex-1">
        {/* Section sidebar */}
        {sidebarOpen && (
          <aside className="hidden w-60 shrink-0 flex-col border-r border-hair bg-white lg:flex">
            <SidebarHeader onCollapse={() => setSidebarOpen(false)} />
            <SidebarContent />
            <div className="flex shrink-0 items-center gap-2 border-t border-hair px-5 py-3.5">
              <Tag>v1.0</Tag>
              <Tag>WCAG 2.2 AA</Tag>
            </div>
          </aside>
        )}

        {/* Content column */}
        <main id="main" tabIndex={-1} className="flex min-w-0 flex-1 flex-col focus:outline-none">
          <PageHeader
            railOpen={railOpen}
            showRailToggle={railActive}
            onOpenRail={() => setRailOpen(true)}
            onOpenSidebar={sidebarOpen ? undefined : () => setSidebarOpen(true)}
            headerSlotRef={setHeaderEl}
          />
          {/* `overscroll-contain` keeps a wheel gesture that reaches the end of
              this column from chaining out into the shell or the document. */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <ShellSlotProvider value={slots}>
              <Outlet />
            </ShellSlotProvider>
          </div>
        </main>

        {/* Controls rail. The element stays mounted so a page can portal into it
            the moment it renders; it only becomes visible once a page reports
            controls — so Examples and Props show no empty panel. */}
        <aside
          className={cn(
            'w-80 shrink-0 flex-col border-l border-hair bg-white',
            railActive && railOpen ? 'hidden xl:flex' : 'hidden',
          )}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-hair px-5">
            <p className="text-[13px] font-medium text-forest">Controls</p>
            <button
              type="button"
              onClick={() => setRailOpen(false)}
              aria-label="Hide controls"
              className="flex h-10 w-10 items-center justify-center text-forest-300 transition-colors hover:bg-panel hover:text-forest"
            >
              <PanelRight size={16} />
            </button>
          </div>
          <div ref={setRailEl} className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-4" />
        </aside>
      </div>

      {/* Mobile navigation overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-forest-900/25 backdrop-blur-[3px]"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 animate-pop flex-col bg-white shadow-pop">
            <SidebarHeader onClose={() => setMenuOpen(false)} />
            <nav aria-label="Sections" className="shrink-0 border-b border-hair px-3 py-2">
              {SECTIONS.map((section) => (
                <Link
                  key={section.id}
                  to={to(section.path)}
                  onClick={() => setMenuOpen(false)}
                  className={navClass(sectionForPath(pathname)?.id === section.id)}
                >
                  {section.label}
                </Link>
              ))}
            </nav>
            <SidebarContent onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

/** Readable measure for article-style pages inside the content column. */
export function DocContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">{children}</div>
}
