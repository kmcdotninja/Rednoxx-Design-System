import { useEffect, useMemo, useState } from 'react'
import { AlignCenter, AlignLeft, AlignRight, Bold, ChevronLeft, ChevronRight, Italic, Link2, List, PenSquare, Send, Underline, type LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/shell/PageHeader'
import { useDomain } from '@/components/shell/RoleContext'
import { useAccount } from '@/components/shell/AccountContext'
import { Avatar, Badge, Button, Card, DatePicker, Drawer, EmptyState, Field, SearchInput, Select, Tabs, Textarea, useToast, type TabItem } from '@/components/ui'
import { useStore } from '@/store/AppStore'
import { DOMAINS, DOMAIN_META } from '@/data/nav'
import { formatDateTime } from '@/lib/format'
import type { Domain, Message } from '@/data/types'
import { cn } from '@/lib/cn'

type Folder = 'inbox' | 'sent'
const PAGE_SIZE = 8

export function Messages() {
  const domain = useDomain()
  const { company } = useAccount()
  const toast = useToast()
  const { messages, sendMessage, replyMessage, markMessageRead, borrowers, financiers } = useStore()

  const [folder, setFolder] = useState<Folder>('inbox')
  const [query, setQuery] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(0)

  const [open, setOpen] = useState<Message | null>(null)
  const [reply, setReply] = useState('')

  const [composing, setComposing] = useState(false)
  const [cDomain, setCDomain] = useState<Domain>(domain === 'admin' ? 'borrower' : 'admin')
  const [cCompany, setCCompany] = useState('')
  const [cSubject, setCSubject] = useState('')
  const [cBody, setCBody] = useState('')

  const inbox = messages.filter((m) => m.toDomain === domain)
  const sent = messages.filter((m) => m.fromDomain === domain)
  const unread = inbox.filter((m) => !m.read).length

  /* Value-based search across every attribute (sender, subject, body, ref,
     amounts inside the text…) + a date range filter — both applied to the whole
     store, not just the visible page. */
  const filtered = useMemo(() => {
    const list = folder === 'inbox' ? inbox : sent
    const q = query.trim().toLowerCase()
    return list.filter((m) => {
      if (q) {
        const hay = `${m.ref} ${m.fromCompany} ${m.toCompany} ${m.fromDomain} ${m.toDomain} ${m.subject} ${m.body} ${m.replies.map((r) => `${r.fromCompany} ${r.body}`).join(' ')}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      const t = new Date(m.at).getTime()
      if (from && t < new Date(from).getTime()) return false
      if (to && t > new Date(to).getTime() + 86_399_000) return false
      return true
    })
  }, [folder, inbox, sent, query, from, to])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  useEffect(() => setPage(0), [folder, query, from, to])

  const tabs: TabItem<Folder>[] = [
    { value: 'inbox', label: 'Inbox', count: unread },
    { value: 'sent', label: 'Sent', count: sent.length },
  ]

  const openMessage = (m: Message) => {
    setOpen(m)
    setReply('')
    if (folder === 'inbox' && !m.read) markMessageRead(m.id)
  }

  const targets = useMemo(() => {
    if (cDomain === 'admin') return [DOMAIN_META.admin.company]
    if (cDomain === 'borrower') return borrowers.map((b) => b.company)
    return financiers.map((f) => f.company)
  }, [cDomain, borrowers, financiers])

  useEffect(() => setCCompany(targets[0] ?? ''), [targets])

  const compose = () => {
    if (cSubject.trim().length < 5 || cBody.trim().length < 5) {
      toast.error('Too short', 'Subject and message must each be at least 5 characters.')
      return
    }
    sendMessage({ toDomain: cDomain, toCompany: cCompany, subject: cSubject.trim(), body: cBody.trim() })
    toast.success('Message sent', `Delivered to ${cCompany}.`)
    setComposing(false)
    setCSubject('')
    setCBody('')
    setFolder('sent')
  }

  const sendReply = () => {
    if (!open || !reply.trim()) return
    replyMessage(open.id, reply.trim())
    toast.success('Reply sent', 'Your reply has been delivered.')
    setOpen(null)
  }

  const openThread = open ? messages.find((m) => m.id === open.id) ?? open : null

  return (
    <>
      <PageHeader
        title="Messages"
        subtitle="Advisory messaging across the marketplace."
        actions={<Button leftIcon={<PenSquare size={16} />} onClick={() => setComposing(true)}>Compose</Button>}
      />

      <Card pad={false}>
        <div className="border-b border-hair px-5 pt-5 sm:px-6">
          <Tabs items={tabs} value={folder} onChange={setFolder} size="md" />
        </div>

        {/* search + date filter */}
        <div className="flex flex-col gap-3 px-5 pt-4 sm:px-6 lg:flex-row lg:items-end">
          <SearchInput placeholder="Search by any value — sender, subject, amount…" value={query} onChange={(e) => setQuery(e.target.value)} wrapClassName="w-full lg:flex-1" />
          <div className="flex items-end gap-2">
            <Field label="From" className="w-44"><DatePicker value={from} onChange={setFrom} placeholder="Any date" align="right" /></Field>
            <Field label="To" className="w-44"><DatePicker value={to} onChange={setTo} placeholder="Any date" align="right" /></Field>
            {(from || to || query) && (
              <Button variant="ghost" size="sm" className="mb-0.5" onClick={() => { setFrom(''); setTo(''); setQuery('') }}>Clear</Button>
            )}
          </div>
        </div>

        {/* list */}
        <div className="px-3 pb-2 pt-3 sm:px-4">
          {pageRows.length === 0 ? (
            <EmptyState compact variant="message" title="No messages" description={query || from || to ? 'No messages match your search or date filter.' : 'Messages will appear here.'} />
          ) : (
            pageRows.map((m) => {
              const other = folder === 'inbox' ? m.fromCompany : m.toCompany
              const isUnread = folder === 'inbox' && !m.read
              return (
                <button key={m.id} onClick={() => openMessage(m)} className="flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-panel">
                  <Avatar name={other} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className={cn('truncate text-sm', isUnread ? 'font-medium text-navy' : 'font-medium text-navy-600')}>{other}</span>
                      <span className="shrink-0 text-[11px] text-navy-300">{formatDateTime(m.at)}</span>
                    </span>
                    <span className={cn('block truncate text-[13px]', isUnread ? 'font-medium text-navy' : 'text-navy-500')}>{m.subject}</span>
                    <span className="block truncate text-xs text-navy-400">{m.body}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
                    {isUnread && <span className="h-2 w-2 rounded-full bg-azure" />}
                    {m.replies.length > 0 && <Badge tone="neutral">{m.replies.length} repl{m.replies.length === 1 ? 'y' : 'ies'}</Badge>}
                  </span>
                </button>
              )
            })
          )}
        </div>

        {/* pagination */}
        <div className="flex items-center justify-between border-t border-hair px-5 py-3.5 sm:px-6">
          <p className="text-xs text-navy-400">
            {filtered.length} message(s) · page {page + 1} of {pages}
          </p>
          <div className="flex items-center gap-1.5">
            <PagerBtn disabled={page === 0} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={16} /></PagerBtn>
            <PagerBtn disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}><ChevronRight size={16} /></PagerBtn>
          </div>
        </div>
      </Card>

      {/* thread drawer */}
      <Drawer
        open={openThread !== null}
        onClose={() => setOpen(null)}
        title={openThread?.subject}
        subtitle={openThread ? `${openThread.ref} · ${openThread.fromCompany} → ${openThread.toCompany}` : undefined}
        size="lg"
        footer={
          <div className="flex items-end gap-2">
            <Textarea rows={2} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" className="flex-1" />
            <Button onClick={sendReply} disabled={!reply.trim()} leftIcon={<Send size={15} />}>Reply</Button>
          </div>
        }
      >
        {openThread && (
          <div className="space-y-4">
            <ThreadBubble author={openThread.fromCompany} at={openThread.at} body={openThread.body} mine={openThread.fromCompany === company} />
            {openThread.replies.map((r) => (
              <ThreadBubble key={r.id} author={r.fromCompany} at={r.at} body={r.body} mine={r.fromCompany === company} />
            ))}
          </div>
        )}
      </Drawer>

      {/* compose drawer */}
      <Drawer
        open={composing}
        onClose={() => setComposing(false)}
        title="New message"
        subtitle="Send an advisory message to another institution."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setComposing(false)}>Cancel</Button>
            <Button onClick={compose} leftIcon={<Send size={15} />}>Send message</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="To (institution type)">
              <Select value={cDomain} onChange={(e) => setCDomain(e.target.value as Domain)}>
                {DOMAINS.filter((d) => d !== domain).map((d) => (
                  <option key={d} value={d}>{DOMAIN_META[d].label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Recipient">
              <Select value={cCompany} onChange={(e) => setCCompany(e.target.value)}>
                {targets.map((t) => <option key={t}>{t}</option>)}
              </Select>
            </Field>
          </div>

          {/* Wrangle-style composer — inline subject, toolbar, borderless body */}
          <div className="overflow-hidden rounded-2xl border border-hair bg-white focus-within:border-navy-300">
            <div className="flex items-center gap-2 border-b border-hair px-4 py-2.5">
              <span className="shrink-0 text-sm text-navy-400">Subject:</span>
              <input
                value={cSubject}
                onChange={(e) => setCSubject(e.target.value)}
                placeholder="What is this about?"
                className="h-7 min-w-0 flex-1 border-0 bg-transparent text-sm font-medium text-navy outline-none placeholder:font-normal placeholder:text-navy-300"
              />
            </div>
            <ComposerToolbar />
            <textarea
              rows={11}
              value={cBody}
              onChange={(e) => setCBody(e.target.value)}
              placeholder="Write your message…"
              className="block w-full resize-none border-0 bg-transparent px-4 py-3 text-sm leading-relaxed text-navy outline-none placeholder:text-navy-300"
            />
          </div>
        </div>
      </Drawer>
    </>
  )
}

/** Formatting toolbar for the composer (visual toggles, Wrangle-style). */
function ComposerToolbar() {
  const [on, setOn] = useState<Record<string, boolean>>({ alignLeft: true })
  const toggle = (key: string, group?: string[]) =>
    setOn((cur) => {
      const next = { ...cur }
      if (group) for (const g of group) next[g] = false
      next[key] = group ? true : !cur[key]
      return next
    })

  const align = ['alignLeft', 'alignCenter', 'alignRight']
  const items: { key: string; icon: LucideIcon; group?: string[]; sep?: boolean }[] = [
    { key: 'bold', icon: Bold },
    { key: 'italic', icon: Italic },
    { key: 'underline', icon: Underline, sep: true },
    { key: 'link', icon: Link2, sep: true },
    { key: 'alignLeft', icon: AlignLeft, group: align },
    { key: 'alignCenter', icon: AlignCenter, group: align },
    { key: 'alignRight', icon: AlignRight, group: align, sep: true },
    { key: 'list', icon: List },
  ]

  return (
    <div className="flex items-center gap-0.5 border-b border-hair px-2 py-1.5">
      {items.map(({ key, icon: Icon, group, sep }) => (
        <span key={key} className="flex items-center">
          <button
            type="button"
            aria-label={key}
            aria-pressed={!!on[key]}
            onClick={() => toggle(key, group)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
              on[key] ? 'bg-panel text-navy' : 'text-navy-400 hover:bg-panel/60 hover:text-navy-600',
            )}
          >
            <Icon size={15} />
          </button>
          {sep && <span className="mx-1.5 h-4 w-px bg-hair" />}
        </span>
      ))}
    </div>
  )
}

function PagerBtn({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-hair bg-white text-navy-500 transition-colors hover:bg-panel disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}

function ThreadBubble({ author, at, body, mine }: { author: string; at: string; body: string; mine: boolean }) {
  return (
    <div className={cn('flex gap-3', mine && 'flex-row-reverse')}>
      <Avatar name={author} size="sm" />
      <div className={cn('max-w-[85%] rounded-3xl px-4 py-3', mine ? 'bg-navy text-white' : 'bg-panel text-navy-600')}>
        <p className={cn('text-[11px] font-medium', mine ? 'text-white/60' : 'text-navy-400')}>{author} · {formatDateTime(at)}</p>
        <p className="mt-1 text-sm leading-relaxed">{body}</p>
      </div>
    </div>
  )
}
