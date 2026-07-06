import { useEffect, useMemo, useRef, useState } from 'react'
import { endSession } from '@/lib/session'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Building2, ChartPie, Check, ChevronDown, ChevronRight, CornerDownLeft, Mail, Search } from 'lucide-react'
import { Logo, Mark } from '@/components/Logo'
import { Avatar } from '@/components/ui'
import { DOMAINS, DOMAIN_META, SUBROLES, SUBROLE_LABEL, navFor } from '@/data/nav'
import { CURRENT_USERS } from '@/data/mock'
import { useStore } from '@/store/AppStore'
import { useSession } from './RoleContext'
import type { Domain, SubRole, UserAccount } from '@/data/types'
import { cn } from '@/lib/cn'
import { useDismiss } from '@/lib/useDismiss'

interface SearchResult {
  id: string
  label: string
  sub: string
  to: string
  kind: 'page' | 'data'
}

function useSearchIndex(domain: Domain, subRole: SubRole): SearchResult[] {
  const store = useStore()
  return useMemo(() => {
    const base = DOMAIN_META[domain].base
    const pages: SearchResult[] = navFor(domain, subRole).map((n) => ({
      id: `page-${n.to}`,
      label: n.label,
      sub: 'Jump to page',
      to: n.to,
      kind: 'page',
    }))
    const data: SearchResult[] = []
    store.projects.forEach((p) =>
      data.push({ id: p.id, label: `${p.ref} — ${p.name}`, sub: `${p.borrower} · ${p.status.replace(/_/g, ' ')}`, to: `${base}/projects`, kind: 'data' }),
    )
    if (domain === 'admin') {
      store.sectors.forEach((s) => data.push({ id: s.id, label: `${s.name} sector`, sub: `${s.facilityTypes.length} facility types · ${s.status}`, to: '/admin/sectors', kind: 'data' }))
    }
    store.messages
      .filter((m) => m.fromDomain === domain || m.toDomain === domain)
      .forEach((m) => data.push({ id: m.id, label: m.subject, sub: `${m.ref} · ${m.fromCompany}`, to: `${base}/messages`, kind: 'data' }))
    return [...pages, ...data]
  }, [domain, subRole, store])
}

function GlobalSearch({ domain, subRole }: { domain: Domain; subRole: SubRole }) {
  const index = useSearchIndex(domain, subRole)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
      if (e.key === '/' && !typing) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return index.filter((r) => r.kind === 'page').slice(0, 5)
    return index.filter((r) => `${r.label} ${r.sub}`.toLowerCase().includes(q)).slice(0, 8)
  }, [query, index])

  const wrapRef = useRef<HTMLDivElement>(null)
  useDismiss(wrapRef, open, () => setOpen(false))

  const go = (to: string) => {
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
    navigate(to)
  }

  const iconFor = (r: SearchResult) => (r.to.includes('sectors') ? ChartPie : r.to.includes('messages') ? Mail : Building2)

  return (
    <div ref={wrapRef} className="relative mx-auto hidden w-full max-w-xl md:block">
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results[0]) go(results[0].to)
          if (e.key === 'Escape') {
            setOpen(false)
            inputRef.current?.blur()
          }
        }}
        placeholder="Search projects, sectors, messages…"
        className="h-9 w-full rounded-2xl border border-white/10 bg-white/10 pl-11 pr-12 text-sm text-white placeholder:text-white/40 transition-[border-color,background-color,box-shadow] focus:border-white/25 focus:bg-white/15 focus:outline-none focus:ring-4 focus:ring-white/10"
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/15 bg-white/10 px-1.5 py-0.5 text-[11px] font-medium text-white/60">/</kbd>

      {open && (
        <>
          <div className="absolute left-0 top-[calc(100%+8px)] z-50 max-h-[60vh] w-full origin-top animate-pop overflow-y-auto rounded-3xl border border-hair bg-white p-2 shadow-pop">
            {results.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-navy-400">No matches for “{query}”.</div>
            ) : (
              results.map((r) => {
                const Icon = iconFor(r)
                return (
                  <button
                    key={`${r.kind}-${r.id}`}
                    onClick={() => go(r.to)}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-panel"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-panel text-navy-400">
                      <Icon size={14} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-navy">{r.label}</span>
                      <span className="block truncate text-xs text-navy-400">{r.sub}</span>
                    </span>
                    {r.kind === 'page' && (
                      <span className="rounded-md bg-panel px-1.5 py-0.5 text-[10px] font-medium uppercase text-navy-300">Page</span>
                    )}
                  </button>
                )
              })
            )}
            <div className="mt-1 flex items-center gap-1.5 border-t border-hair px-3 py-2 text-[11px] text-navy-300">
              <CornerDownLeft size={12} /> to open · <kbd className="rounded border border-hair px-1">esc</kbd> to close
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* --------------- compact shadcn-style dropdown menu primitives ------------- */

function MenuLabel({ children }: { children: React.ReactNode }) {
  return <p className="px-2.5 pb-1 pt-1.5 text-sm text-navy-300">{children}</p>
}

function MenuSep() {
  return <div className="-mx-1.5 my-1.5 h-px bg-hair" />
}

function MenuItem({
  onClick,
  children,
  trailing,
  active,
}: {
  onClick?: () => void
  children: React.ReactNode
  trailing?: React.ReactNode
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-sm text-navy transition-colors hover:bg-panel',
        active && 'bg-panel',
      )}
    >
      <span className="min-w-0 truncate">{children}</span>
      {trailing}
    </button>
  )
}

function RoleSwitcher({ domain, subRole, setSubRole }: { domain: Domain; subRole: SubRole; setSubRole: (s: SubRole) => void }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { accounts, switchAccount } = useStore()
  const wrapRef = useRef<HTMLDivElement>(null)
  useDismiss(wrapRef, open, () => setOpen(false))

  const pickDomain = (d: Domain) => {
    setOpen(false)
    switchAccount(null)
    navigate(DOMAIN_META[d].base)
  }
  const pickPersona = (s: SubRole) => setSubRole(s)
  const pickAccount = (a: UserAccount) => {
    setOpen(false)
    switchAccount(a.id)
    navigate(DOMAIN_META[a.domain].base)
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 py-1 pl-1.5 pr-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15"
      >
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-navy">{DOMAIN_META[domain].label}</span>
        <span className="hidden text-xs font-medium text-white/70 sm:block">{SUBROLE_LABEL[subRole]}</span>
        <ChevronDown size={15} className="text-white/50" />
      </button>
      {open && (
        <>
          <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-56 origin-top-left animate-pop rounded-xl border border-hair bg-white p-1.5 shadow-pop">
            <MenuLabel>Interface</MenuLabel>
            {DOMAINS.map((d) => (
              <MenuItem
                key={d}
                onClick={() => pickDomain(d)}
                trailing={d === domain ? <Check size={15} className="shrink-0 text-navy" /> : undefined}
              >
                {DOMAIN_META[d].label}
              </MenuItem>
            ))}

            <MenuSep />
            <MenuLabel>Acting as</MenuLabel>
            {SUBROLES.map((s) => (
              <MenuItem
                key={s}
                onClick={() => pickPersona(s)}
                trailing={s === subRole ? <Check size={15} className="shrink-0 text-navy" /> : undefined}
              >
                {SUBROLE_LABEL[s]}
              </MenuItem>
            ))}

            {accounts.length > 0 && (
              <>
                <MenuSep />
                <MenuLabel>Your accounts</MenuLabel>
                {accounts.map((a) => (
                  <MenuItem
                    key={a.id}
                    onClick={() => pickAccount(a)}
                    trailing={<span className="shrink-0 text-xs text-navy-300">{a.onboarding === 'verified' ? 'Verified' : DOMAIN_META[a.domain].label}</span>}
                  >
                    {a.company}
                  </MenuItem>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function NotificationsBell({ domain, subRole }: { domain: Domain; subRole: SubRole }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const mine = notifications.filter((n) => n.audience === domain && (!n.audienceSub || n.audienceSub === subRole))
  const unread = mine.filter((n) => !n.read).length

  const wrapRef = useRef<HTMLDivElement>(null)
  useDismiss(wrapRef, open, () => setOpen(false))

  const openNotif = (id: string, link?: string) => {
    markNotificationRead(id)
    setOpen(false)
    if (link) navigate(link)
  }
  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={unread > 0 ? `Notifications · ${unread} unread` : 'Notifications'}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/80 transition-colors hover:bg-white/15"
      >
        <Bell size={18} className={cn(unread > 0 && 'gx-bell')} />
        {unread > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-azure/70 gx-ping" />
            <span className="relative inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-azure px-1 text-[10px] font-medium leading-none text-navy ring-2 ring-navy">
              {unread > 9 ? '9+' : unread}
            </span>
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-80 origin-top-right animate-pop rounded-3xl border border-hair bg-white p-2 shadow-pop">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="flex items-center gap-2 text-sm font-medium text-navy">
                Notifications
                {unread > 0 && (
                  <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-azure-100 px-1.5 text-[11px] font-medium text-navy-500">{unread}</span>
                )}
              </p>
              {unread > 0 ? (
                <button onClick={() => markAllNotificationsRead(domain)} className="text-xs font-medium text-mint hover:underline">Mark all read</button>
              ) : (
                <span className="text-xs text-navy-300">All caught up</span>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {mine.length === 0 ? (
                <div className="flex flex-col items-center px-3 py-6 text-center">
                  <img src="/empty/notifications.svg" alt="" aria-hidden draggable={false} className="h-24 w-24 select-none" />
                  <p className="mt-1 text-sm font-medium text-navy">All caught up</p>
                  <p className="mt-0.5 text-xs text-navy-400">New activity will land here.</p>
                </div>
              ) : (
                mine.slice(0, 7).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => openNotif(n.id, n.link)}
                    className="flex w-full gap-3 rounded-2xl px-3 py-2.5 text-left transition-[background-color,transform] hover:bg-panel active:scale-[0.99]"
                  >
                    <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-hair' : 'bg-azure')} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-navy">{n.title}</span>
                      <span className="block text-xs leading-snug text-navy-400">{n.body}</span>
                      <span className="mt-0.5 block text-[11px] text-navy-300">{n.time}</span>
                    </span>
                    {n.link && <ChevronRight size={14} className="mt-1 shrink-0 text-navy-300" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ProfileMenu({ domain }: { domain: Domain }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const base = DOMAIN_META[domain].base
  const user = CURRENT_USERS[domain]

  const wrapRef = useRef<HTMLDivElement>(null)
  useDismiss(wrapRef, open, () => setOpen(false))

  const go = (to: string) => {
    setOpen(false)
    navigate(to)
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1 pl-1 pr-2 transition-colors hover:bg-white/15 sm:pr-2.5"
      >
        <Avatar name={user.name} size="sm" />
        <span className="hidden text-sm font-medium text-white sm:block">{user.firstName}</span>
        <ChevronDown size={15} className="hidden text-white/50 sm:block" />
      </button>
      {open && (
        <>
          <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-56 origin-top-right animate-pop rounded-xl border border-hair bg-white p-1.5 shadow-pop">
            <div className="px-2.5 pb-1 pt-1.5">
              <p className="truncate text-sm text-navy">{user.name}</p>
              <p className="truncate text-xs text-navy-300">{user.email}</p>
            </div>
            <MenuSep />
            <MenuItem onClick={() => go(`${base}/settings?section=profile`)}>Profile</MenuItem>
            <MenuItem onClick={() => go(`${base}/settings?section=company`)}>Company</MenuItem>
            <MenuItem onClick={() => go(`${base}/settings?section=security`)}>Security</MenuItem>
            <MenuSep />
            <MenuItem onClick={() => { endSession(); go('/') }}>Log out</MenuItem>
          </div>
        </>
      )}
    </div>
  )
}

export function TopNav() {
  const { domain, subRole, setSubRole } = useSession()
  return (
    <header className="sticky top-0 z-30 border-b border-navy-800 bg-navy">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Link to="/" className="flex items-center text-white">
            <Logo className="hidden h-7 sm:inline-flex" />
            <Mark className="h-7 w-7 sm:hidden" />
          </Link>
          <RoleSwitcher domain={domain} subRole={subRole} setSubRole={setSubRole} />
        </div>

        <GlobalSearch domain={domain} subRole={subRole} />

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <NotificationsBell domain={domain} subRole={subRole} />
          <ProfileMenu domain={domain} />
        </div>
      </div>
    </header>
  )
}
