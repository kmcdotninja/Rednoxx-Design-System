import { useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useDismiss } from '@/lib/useDismiss'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const pad = (n: number) => String(n).padStart(2, '0')
const toISO = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`
function parseISO(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m: m - 1, d }
}
function fmtDate(iso: string) {
  if (!iso) return ''
  const { y, m, d } = parseISO(iso)
  return `${d} ${MONTHS[m]} ${y}`
}

const triggerClass =
  'flex h-10 w-full items-center justify-between rounded-2xl border border-hair bg-white px-3 text-sm ' +
  'transition-[border-color,box-shadow] hover:border-forest-200 focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure-50'

function Popover({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <div
      className={cn(
        'absolute top-[calc(100%+6px)] z-50 animate-pop rounded-3xl border border-hair bg-white p-3 shadow-pop',
        align === 'right' ? 'right-0' : 'left-0',
      )}
    >
      {children}
    </div>
  )
}

function NavButton({ onClick, children, label }: { onClick: () => void; children: React.ReactNode; label: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="flex h-7 w-7 items-center justify-center rounded-lg text-forest-400 transition-colors hover:bg-panel">
      {children}
    </button>
  )
}

/**
 * Custom calendar date picker (no native input) — month grid with a year-grid
 * mode (click the header) so far-back years like dates of birth are two taps away.
 * Emits `yyyy-mm-dd`.
 */
export function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = 'Select date',
  align = 'left',
}: {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  /** Right-align the calendar when the trigger sits near the right edge. */
  align?: 'left' | 'right'
}) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue ?? '')
  const current = isControlled ? value : internal
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'days' | 'years'>('days')
  const [view, setView] = useState(() => {
    const base = current ? parseISO(current) : null
    const now = new Date()
    return base ? { y: base.y, m: base.m } : { y: now.getFullYear(), m: now.getMonth() }
  })
  // First year shown in the 12-year grid.
  const [yearPage, setYearPage] = useState(() => view.y - 6)
  const wrapRef = useRef<HTMLDivElement>(null)
  useDismiss(wrapRef, open, () => {
    setOpen(false)
    setMode('days')
  })

  const set = (iso: string) => {
    onChange?.(iso)
    if (!isControlled) setInternal(iso)
    setOpen(false)
    setMode('days')
  }

  const step = (dir: number) => {
    setView((v) => {
      let m = v.m + dir
      let y = v.y
      if (m < 0) { m = 11; y-- }
      if (m > 11) { m = 0; y++ }
      return { y, m }
    })
  }

  const firstWeekday = new Date(view.y, view.m, 1).getDay()
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const today = new Date()
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate())

  return (
    <div ref={wrapRef} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className={triggerClass}>
        <span className={current ? 'font-medium text-forest' : 'text-forest-300'}>
          {current ? fmtDate(current) : placeholder}
        </span>
        <CalendarDays size={16} className="text-forest-300" />
      </button>

      {open && (
        <Popover align={align}>
          <div className="w-[260px]">
            <div className="mb-2 flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => {
                  setYearPage(view.y - 6)
                  setMode((m) => (m === 'days' ? 'years' : 'days'))
                }}
                className="rounded-lg px-1.5 py-0.5 text-sm font-medium text-forest transition-colors hover:bg-panel"
              >
                {mode === 'days' ? `${MONTHS_FULL[view.m]} ${view.y}` : `${yearPage} – ${yearPage + 11}`}
              </button>
              <div className="flex gap-1">
                {mode === 'days' ? (
                  <>
                    <NavButton label="Previous month" onClick={() => step(-1)}><ChevronLeft size={16} /></NavButton>
                    <NavButton label="Next month" onClick={() => step(1)}><ChevronRight size={16} /></NavButton>
                  </>
                ) : (
                  <>
                    <NavButton label="Earlier years" onClick={() => setYearPage((y) => y - 12)}><ChevronLeft size={16} /></NavButton>
                    <NavButton label="Later years" onClick={() => setYearPage((y) => y + 12)}><ChevronRight size={16} /></NavButton>
                  </>
                )}
              </div>
            </div>

            {mode === 'years' ? (
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 12 }).map((_, i) => {
                  const y = yearPage + i
                  const selected = view.y === y
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => {
                        setView((v) => ({ ...v, y }))
                        setMode('days')
                      }}
                      className={cn(
                        'tnum flex h-9 items-center justify-center rounded-lg text-[13px] font-medium transition-colors',
                        selected ? 'bg-forest text-white' : 'text-forest-500 hover:bg-panel',
                      )}
                    >
                      {y}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="flex h-7 items-center justify-center text-[11px] font-medium text-forest-300">
                    {w}
                  </span>
                ))}
                {Array.from({ length: firstWeekday }).map((_, i) => <span key={`b-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const iso = toISO(view.y, view.m, day)
                  const selected = current === iso
                  const isToday = todayISO === iso
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => set(iso)}
                      className={cn(
                        'tnum flex h-8 w-8 items-center justify-center rounded-lg text-[13px] font-medium transition-colors',
                        selected ? 'bg-forest text-white' : 'text-forest-500 hover:bg-panel',
                        !selected && isToday && 'ring-1 ring-forest-300',
                      )}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </Popover>
      )}
    </div>
  )
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = [0, 15, 30, 45]

/** Custom time picker (no native input) — hour + quarter-minute columns. Emits `HH:mm`. */
export function TimePicker({
  value,
  defaultValue,
  onChange,
  placeholder = 'Select time',
}: {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
}) {
  const isControlled = value !== undefined
  const [internal, setInternal] = useState(defaultValue ?? '')
  const current = isControlled ? value : internal
  const [open, setOpen] = useState(false)

  const [h, m] = current ? current.split(':').map(Number) : [null, null]
  const wrapRef = useRef<HTMLDivElement>(null)
  useDismiss(wrapRef, open, () => setOpen(false))

  const set = (hh: number, mm: number) => {
    const iso = `${pad(hh)}:${pad(mm)}`
    onChange?.(iso)
    if (!isControlled) setInternal(iso)
  }

  return (
    <div ref={wrapRef} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className={triggerClass}>
        <span className={cn('tnum', current ? 'font-medium text-forest' : 'text-forest-300')}>
          {current || placeholder}
        </span>
        <Clock size={16} className="text-forest-300" />
      </button>

      {open && (
        <Popover align="right">
          <div className="flex w-[180px] gap-2">
            <div className="flex-1">
              <p className="mb-1 px-1 text-[11px] font-medium uppercase text-forest-300">Hour</p>
              <div className="max-h-48 space-y-0.5 overflow-y-auto pr-1">
                {HOURS.map((hh) => (
                  <button
                    key={hh}
                    type="button"
                    onClick={() => set(hh, m ?? 0)}
                    className={cn(
                      'tnum flex w-full items-center justify-center rounded-lg py-1.5 text-[13px] font-medium transition-colors',
                      h === hh ? 'bg-forest text-white' : 'text-forest-500 hover:bg-panel',
                    )}
                  >
                    {pad(hh)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="mb-1 px-1 text-[11px] font-medium uppercase text-forest-300">Min</p>
              <div className="space-y-0.5">
                {MINUTES.map((mm) => (
                  <button
                    key={mm}
                    type="button"
                    onClick={() => set(h ?? 9, mm)}
                    className={cn(
                      'tnum flex w-full items-center justify-center rounded-lg py-1.5 text-[13px] font-medium transition-colors',
                      m === mm ? 'bg-forest text-white' : 'text-forest-500 hover:bg-panel',
                    )}
                  >
                    {pad(mm)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Popover>
      )}
    </div>
  )
}
