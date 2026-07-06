import type { ReactNode } from 'react'
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  Upload,
} from 'lucide-react'

/* ------------------------------------------------------------------ helpers */

/** Skeleton line — the neutral placeholder bar used across previews. */
function Sk({ w = 'w-full', h = 'h-1.5', c = 'bg-panel' }: { w?: string; h?: string; c?: string }) {
  return <span className={`block rounded-full ${h} ${w} ${c}`} />
}

/** A run of segmented OTP boxes; empty strings render an unfilled cell. */
function Otp({ digits }: { digits: string[] }) {
  return (
    <div className="flex gap-1.5">
      {digits.map((d, i) => (
        <span
          key={i}
          className={`flex h-8 w-6 items-center justify-center border text-[13px] font-medium text-forest ${
            d ? 'border-navy-300' : 'border-hair'
          }`}
        >
          {d}
        </span>
      ))}
    </div>
  )
}

/** A small bottom-aligned bar chart. Heights are percentages. */
function Bars({ values, c = 'bg-azure-100', h = 'h-8' }: { values: number[]; c?: string; h?: string }) {
  return (
    <div className={`flex ${h} w-full items-end gap-1`}>
      {values.map((v, i) => (
        <span key={i} className={`flex-1 ${c}`} style={{ height: `${v}%` }} />
      ))}
    </div>
  )
}

/** Fallback when a slug has no bespoke preview yet. */
export function PreviewFallback({ label }: { label: string }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center bg-panel text-sm font-medium text-forest-300">
      {label.slice(0, 2)}
    </span>
  )
}

/* ------------------------------------------------------------- components */

export const COMPONENT_PREVIEWS: Record<string, ReactNode> = {
  /* ---- Forms ---- */
  button: (
    <div className="flex w-full max-w-[150px] flex-col gap-1.5">
      <span className="flex h-8 items-center justify-center bg-azure text-[12px] font-medium text-white">Primary</span>
      <span className="flex h-8 items-center justify-center bg-forest text-[12px] font-medium text-white">Ink</span>
      <span className="flex h-8 items-center justify-center border border-hair text-[12px] font-medium text-forest-500">
        Secondary
      </span>
    </div>
  ),
  input: (
    <div className="w-[180px]">
      <Sk w="w-16" c="bg-navy-100" />
      <div className="mt-1.5 flex h-9 items-center border border-hair px-3 text-[12px] text-forest-300">
        Patient name
        <span className="ml-0.5 h-4 w-px bg-azure" />
      </div>
    </div>
  ),
  select: (
    <div className="flex h-9 w-[180px] items-center justify-between border border-hair px-3 text-[12px] text-forest-500">
      Central Clinic
      <ChevronDown size={14} className="text-forest-300" />
    </div>
  ),
  combobox: (
    <div className="w-[180px]">
      <div className="flex h-9 items-center justify-between border border-hair px-3 text-[12px] text-forest-300">
        Search facilities…
        <ChevronDown size={14} />
      </div>
      <div className="mt-1 border border-hair bg-white p-1">
        <div className="bg-panel px-2 py-1.5 text-[11px] text-forest">Central Clinic</div>
        <div className="px-2 py-1.5 text-[11px] text-forest-400">Northside Hospital</div>
      </div>
    </div>
  ),
  datepicker: (
    <div className="w-[150px] border border-hair bg-white p-2.5">
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-medium text-forest">
        <ChevronLeft size={12} className="text-forest-300" />
        March
        <ChevronRight size={12} className="text-forest-300" />
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 21 }).map((_, i) => (
          <span
            key={i}
            className={`flex h-3.5 items-center justify-center rounded-full text-[8px] ${
              i === 9 ? 'bg-azure font-medium text-white' : 'text-forest-400'
            }`}
          >
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  ),
  search: (
    <div className="flex h-9 w-[190px] items-center gap-2 border border-hair bg-panel px-3">
      <Search size={14} className="text-forest-300" />
      <span className="text-[12px] text-forest-300">Search</span>
      <span className="ml-auto flex items-center gap-0.5 text-[10px] text-forest-400">
        <span className="border border-hair bg-white px-1">⌘</span>
        <span className="border border-hair bg-white px-1">S</span>
      </span>
    </div>
  ),
  checkbox: (
    <div className="flex w-[180px] flex-col gap-2.5">
      <span className="flex items-center gap-2 text-[12px] text-forest">
        <span className="flex h-4 w-4 items-center justify-center bg-forest text-white">
          <Check size={11} />
        </span>
        Share records
      </span>
      <span className="flex items-center gap-2 text-[12px] text-forest-400">
        <span className="h-4 w-4 border border-navy-200" />
        SMS reminders
      </span>
    </div>
  ),
  radio: (
    <div className="flex w-[160px] flex-col gap-2.5">
      <span className="flex items-center gap-2 text-[12px] text-forest">
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-forest">
          <span className="h-2 w-2 rounded-full bg-forest" />
        </span>
        In person
      </span>
      <span className="flex items-center gap-2 text-[12px] text-forest-400">
        <span className="h-4 w-4 rounded-full border border-navy-200" />
        Telehealth
      </span>
    </div>
  ),
  slider: (
    <div className="w-[170px]">
      <div className="mb-2 flex items-center justify-between text-[11px] text-forest-400">
        <span>Dosage</span>
        <span className="tnum text-forest">60mg</span>
      </div>
      <div className="relative h-1 rounded-full bg-navy-100">
        <div className="absolute inset-y-0 left-0 w-3/5 rounded-full bg-azure" />
        <div
          className="absolute -top-1.5 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-azure bg-white"
          style={{ left: '60%' }}
        />
      </div>
    </div>
  ),
  switch: (
    <div className="flex w-[160px] flex-col gap-3">
      <span className="flex items-center justify-between text-[12px] text-forest">
        Notifications
        <span className="flex h-5 w-9 items-center justify-end rounded-full bg-azure px-0.5">
          <span className="h-4 w-4 rounded-full bg-white" />
        </span>
      </span>
      <span className="flex items-center justify-between text-[12px] text-forest-400">
        Auto-refill
        <span className="flex h-5 w-9 items-center rounded-full bg-navy-100 px-0.5">
          <span className="h-4 w-4 rounded-full bg-white" />
        </span>
      </span>
    </div>
  ),
  'color-picker': (
    <div className="flex items-center gap-2.5">
      <span className="h-6 w-6 rounded-full bg-azure ring-2 ring-azure ring-offset-2" />
      <span className="h-6 w-6 rounded-full bg-mint" />
      <span className="h-6 w-6 rounded-full bg-gold" />
      <span className="h-6 w-6 rounded-full bg-rose-ink" />
      <span className="h-6 w-6 rounded-full bg-forest" />
    </div>
  ),
  'digit-input': <Otp digits={['4', '2', '9', '', '', '']} />,

  /* ---- Data display ---- */
  avatar: (
    <div className="flex -space-x-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-azure text-[11px] font-medium text-white ring-2 ring-white">AM</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-[11px] font-medium text-white ring-2 ring-white">KD</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-600 text-[11px] font-medium text-white ring-2 ring-white">RT</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-200 text-[11px] font-medium text-forest-500 ring-2 ring-white">+4</span>
    </div>
  ),
  badge: (
    <div className="flex flex-col items-start gap-1.5">
      <span className="rounded-full bg-azure-100 px-2 py-0.5 text-[11px] font-medium text-azure-600">Queued</span>
      <span className="flex items-center gap-1 rounded-full bg-mint-soft px-2 py-0.5 text-[11px] font-medium text-mint">
        <Check size={11} />
        Success
      </span>
      <span className="rounded-full bg-rose-soft px-2 py-0.5 text-[11px] font-medium text-rose-ink">Failed</span>
    </div>
  ),
  card: (
    <div className="w-[170px] border border-hair bg-white p-3">
      <Sk w="w-20" h="h-2.5" c="bg-navy-100" />
      <div className="mt-2 space-y-1.5">
        <Sk />
        <Sk w="w-4/5" />
      </div>
    </div>
  ),
  table: (
    <div className="w-[190px] overflow-hidden border border-hair text-[10px]">
      <div className="flex bg-panel px-2 py-1 text-forest-400">
        <span className="flex-1">Patient</span>
        <span className="w-10">Status</span>
      </div>
      <div className="flex items-center border-t border-hair px-2 py-1">
        <span className="flex-1 text-forest">Ada Lovelace</span>
        <span className="w-10"><span className="inline-block h-1.5 w-1.5 rounded-full bg-mint" /></span>
      </div>
      <div className="flex items-center border-t border-hair px-2 py-1">
        <span className="flex-1 text-forest">Alan Turing</span>
        <span className="w-10"><span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" /></span>
      </div>
      <div className="flex items-center border-t border-hair px-2 py-1">
        <span className="flex-1 text-forest">Grace Hopper</span>
        <span className="w-10"><span className="inline-block h-1.5 w-1.5 rounded-full bg-azure" /></span>
      </div>
    </div>
  ),
  progress: (
    <div className="w-[180px] space-y-2.5">
      <div className="h-1.5 w-full rounded-full bg-navy-100"><div className="h-full w-[35%] rounded-full bg-azure" /></div>
      <div className="h-1.5 w-full rounded-full bg-navy-100"><div className="h-full w-[70%] rounded-full bg-azure" /></div>
      <div className="h-1.5 w-full rounded-full bg-navy-100"><div className="h-full w-[90%] rounded-full bg-mint" /></div>
    </div>
  ),
  rating: (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={20} className={i < 4 ? 'fill-gold text-gold' : 'text-navy-200'} />
      ))}
    </div>
  ),
  divider: (
    <div className="flex w-[180px] items-center gap-3 text-[10px] uppercase tracking-[0.1em] text-forest-300">
      <span className="h-px flex-1 bg-hair" />
      OR
      <span className="h-px flex-1 bg-hair" />
    </div>
  ),
  kbd: (
    <div className="flex items-center gap-1.5 font-mono text-[13px] text-forest-500">
      <span className="border border-hair bg-white px-2 py-1">⌘</span>
      <span className="border border-hair bg-white px-2 py-1">K</span>
    </div>
  ),

  /* ---- Feedback ---- */
  alert: (
    <div className="flex w-[190px] gap-2 border border-hair bg-white p-2.5">
      <AlertTriangle size={15} className="mt-0.5 shrink-0 text-gold-600" />
      <div className="flex-1">
        <div className="text-[11px] font-medium text-forest">Results delayed</div>
        <div className="mt-1 space-y-1"><Sk /><Sk w="w-2/3" /></div>
      </div>
    </div>
  ),
  toast: (
    <div className="flex w-[180px] items-center gap-2 bg-forest px-3 py-2.5">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-mint text-white">
        <Check size={11} />
      </span>
      <span className="text-[11px] text-white">Changes saved</span>
    </div>
  ),
  dialog: (
    <div className="relative h-[110px] w-[180px] overflow-hidden bg-navy-100">
      <div className="absolute left-1/2 top-1/2 w-[140px] -translate-x-1/2 -translate-y-1/2 border border-hair bg-white p-3">
        <Sk w="w-16" h="h-2.5" c="bg-navy-100" />
        <div className="mt-2 space-y-1"><Sk /><Sk w="w-3/4" /></div>
        <div className="mt-3 flex justify-end gap-1.5">
          <span className="h-5 w-10 border border-hair" />
          <span className="h-5 w-12 bg-azure" />
        </div>
      </div>
    </div>
  ),
  drawer: (
    <div className="relative h-[110px] w-[190px] overflow-hidden border border-hair bg-panel">
      <div className="absolute inset-y-0 right-0 w-[112px] border-l border-hair bg-white p-3">
        <Sk w="w-14" h="h-2.5" c="bg-navy-100" />
        <div className="mt-2 space-y-1.5"><Sk /><Sk w="w-3/4" /><Sk w="w-4/5" /></div>
      </div>
    </div>
  ),
  tooltip: (
    <div className="flex flex-col items-center">
      <span className="bg-forest px-2.5 py-1 text-[11px] text-white">Copy link</span>
      <span className="-mt-1 h-2 w-2 rotate-45 bg-forest" />
      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-navy-200" />
    </div>
  ),

  /* ---- Navigation ---- */
  tabs: (
    <div className="flex w-[190px] gap-4 border-b border-hair text-[11px]">
      <span className="border-b-2 border-forest pb-1.5 font-medium text-forest">Overview</span>
      <span className="pb-1.5 text-forest-400">Vitals</span>
      <span className="pb-1.5 text-forest-400">Orders</span>
    </div>
  ),
  segmented: (
    <div className="flex gap-0.5 bg-panel p-1 text-[11px]">
      <span className="bg-white px-3 py-1 font-medium text-forest">Day</span>
      <span className="px-3 py-1 text-forest-400">Week</span>
      <span className="px-3 py-1 text-forest-400">Month</span>
    </div>
  ),
  accordion: (
    <div className="w-[180px] divide-y divide-hair border border-hair">
      <div className="flex items-center justify-between px-3 py-2 text-[11px] font-medium text-forest">
        Allergies
        <ChevronDown size={13} className="text-forest-300" />
      </div>
      <div className="space-y-1.5 px-3 py-2"><Sk /><Sk w="w-2/3" /></div>
      <div className="flex items-center justify-between px-3 py-2 text-[11px] text-forest-400">
        Medications
        <ChevronRight size={13} className="text-forest-300" />
      </div>
    </div>
  ),
  stepper: (
    <div className="flex items-center">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint text-white"><Check size={12} /></span>
      <span className="h-px w-7 bg-mint" />
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-azure text-[10px] font-medium text-white">2</span>
      <span className="h-px w-7 bg-navy-100" />
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-navy-200 text-[10px] text-forest-300">3</span>
    </div>
  ),
  pagination: (
    <div className="flex items-center gap-1 text-[11px]">
      <span className="flex h-7 w-7 items-center justify-center border border-hair text-forest-300"><ChevronLeft size={13} /></span>
      <span className="flex h-7 w-7 items-center justify-center bg-forest text-white">1</span>
      <span className="flex h-7 w-7 items-center justify-center border border-hair text-forest-500">2</span>
      <span className="flex h-7 w-7 items-center justify-center border border-hair text-forest-500">3</span>
      <span className="flex h-7 w-7 items-center justify-center border border-hair text-forest-300"><ChevronRight size={13} /></span>
    </div>
  ),
  breadcrumb: (
    <div className="flex items-center gap-1.5 text-[11px] text-forest-400">
      Home
      <ChevronRight size={12} className="text-navy-200" />
      Patients
      <ChevronRight size={12} className="text-navy-200" />
      <span className="font-medium text-forest">Ada L.</span>
    </div>
  ),
  sidebar: (
    <div className="flex h-[100px] w-[180px] overflow-hidden border border-hair">
      <div className="w-12 shrink-0 space-y-1.5 border-r border-hair bg-panel p-2">
        <Sk c="bg-azure" />
        <Sk c="bg-navy-100" />
        <Sk c="bg-navy-100" />
      </div>
      <div className="flex-1 space-y-1.5 p-2">
        <Sk w="w-2/3" h="h-2" c="bg-navy-100" />
        <Sk />
        <Sk w="w-4/5" />
      </div>
    </div>
  ),
  navbar: (
    <div className="flex w-[190px] items-center gap-2 border border-hair bg-white px-3 py-2">
      <span className="h-3.5 w-3.5 rounded-full bg-azure" />
      <Sk w="w-8" c="bg-navy-100" />
      <Sk w="w-6" />
      <span className="ml-auto h-5 w-5 rounded-full bg-navy-200" />
    </div>
  ),

  /* ---- Overlays ---- */
  dropdown: (
    <div className="w-[150px]">
      <div className="flex h-8 items-center justify-between border border-hair px-2.5 text-[11px] text-forest-500">
        Actions
        <ChevronDown size={13} className="text-forest-300" />
      </div>
      <div className="mt-1 border border-hair bg-white py-1 text-[11px]">
        <div className="bg-panel px-2.5 py-1.5 text-forest">Edit</div>
        <div className="px-2.5 py-1.5 text-forest-500">Duplicate</div>
        <div className="px-2.5 py-1.5 text-rose-ink">Delete</div>
      </div>
    </div>
  ),
  popover: (
    <div className="flex flex-col items-center">
      <div className="w-[150px] space-y-1.5 border border-hair bg-white p-2.5">
        <Sk w="w-16" h="h-2" c="bg-navy-100" />
        <Sk />
        <Sk w="w-3/4" />
      </div>
      <span className="-mt-1 h-2 w-2 rotate-45 border-b border-r border-hair bg-white" />
      <span className="mt-2 flex h-6 w-16 items-center justify-center bg-forest text-[10px] text-white">Details</span>
    </div>
  ),
  'command-menu': (
    <div className="w-[190px] border border-hair bg-white">
      <div className="flex items-center gap-2 border-b border-hair px-3 py-2">
        <Search size={13} className="text-forest-300" />
        <span className="text-[11px] text-forest-300">Type a command…</span>
      </div>
      <div className="p-1 text-[11px]">
        <div className="bg-panel px-2 py-1.5 text-forest">New patient</div>
        <div className="px-2 py-1.5 text-forest-500">Search orders</div>
      </div>
    </div>
  ),
}

/* ----------------------------------------------------------------- blocks */

export const BLOCK_PREVIEWS: Record<string, ReactNode> = {
  /* ---- Auth ---- */
  'auth-layout': (
    <div className="flex h-[110px] w-[190px] overflow-hidden border border-hair">
      <div className="flex w-1/2 flex-col justify-between bg-forest p-2.5">
        <span className="h-3 w-3 rounded-full bg-azure" />
        <span className="block h-1.5 w-12 rounded-full bg-white/30" />
      </div>
      <div className="flex w-1/2 flex-col justify-center gap-1.5 bg-white p-2.5">
        <div className="h-6 border border-hair" />
        <div className="h-6 border border-hair" />
        <div className="h-6 bg-azure" />
      </div>
    </div>
  ),
  login: (
    <div className="w-[160px] space-y-2 border border-hair bg-white p-3">
      <Sk w="w-16" h="h-2.5" c="bg-navy-100" />
      <div className="h-7 border border-hair" />
      <div className="h-7 border border-hair" />
      <div className="h-7 bg-azure" />
    </div>
  ),
  registration: (
    <div className="w-[160px] space-y-1.5 border border-hair bg-white p-3">
      <div className="grid grid-cols-2 gap-1.5">
        <div className="h-6 border border-hair" />
        <div className="h-6 border border-hair" />
      </div>
      <div className="h-6 border border-hair" />
      <div className="h-6 border border-hair" />
      <div className="h-6 bg-azure" />
    </div>
  ),
  verification: (
    <div className="flex flex-col items-center gap-2">
      <Otp digits={['5', '2', '', '']} />
      <span className="text-[10px] text-forest-300">Resend in 0:24</span>
    </div>
  ),
  mfa: (
    <div className="w-[170px] space-y-2 border border-hair bg-white p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-forest">
        <ShieldCheck size={14} className="text-azure" />
        Verify it’s you
      </div>
      <Otp digits={['', '', '', '']} />
    </div>
  ),
  password: (
    <div className="w-[170px] space-y-2">
      <div className="flex h-8 items-center justify-between border border-hair px-2.5 text-[13px] tracking-[0.2em] text-forest-400">
        ••••••••
        <Eye size={13} className="text-forest-300" />
      </div>
      <div className="flex gap-1">
        <span className="h-1 flex-1 rounded-full bg-mint" />
        <span className="h-1 flex-1 rounded-full bg-mint" />
        <span className="h-1 flex-1 rounded-full bg-mint" />
        <span className="h-1 flex-1 rounded-full bg-navy-100" />
      </div>
      <span className="text-[10px] text-mint">Strong password</span>
    </div>
  ),
  'org-access': (
    <div className="w-[184px] space-y-1.5">
      <div className="flex items-center gap-2 border border-azure bg-azure-50 px-2.5 py-2">
        <span className="flex h-6 w-6 items-center justify-center bg-azure text-[9px] font-medium text-white">CC</span>
        <span className="flex-1"><Sk w="w-16" c="bg-navy-200" /></span>
        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-azure">
          <span className="h-1.5 w-1.5 rounded-full bg-azure" />
        </span>
      </div>
      <div className="flex items-center gap-2 border border-hair px-2.5 py-2">
        <span className="flex h-6 w-6 items-center justify-center bg-navy-200 text-[9px] font-medium text-white">NH</span>
        <span className="flex-1"><Sk w="w-20" /></span>
        <span className="h-3.5 w-3.5 rounded-full border border-navy-200" />
      </div>
    </div>
  ),
  'auth-states': (
    <div className="w-[184px] space-y-1.5">
      <div className="flex items-center gap-2 border border-hair bg-white px-2.5 py-2 text-[11px] text-mint">
        <Check size={13} />
        Email verified
      </div>
      <div className="flex items-center gap-2 border border-hair bg-white px-2.5 py-2 text-[11px] text-rose-ink">
        <AlertTriangle size={13} />
        Invalid code
      </div>
    </div>
  ),

  /* ---- Patient ---- */
  'patient-banner': (
    <div className="flex w-[194px] items-center gap-2.5 border border-hair bg-white p-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-azure text-[12px] font-medium text-white">AL</span>
      <div className="flex-1">
        <div className="text-[11px] font-medium text-forest">Ada Lovelace</div>
        <div className="mt-1 flex gap-1">
          <span className="rounded-full bg-panel px-1.5 py-0.5 text-[8px] text-forest-400">MRN 4821</span>
          <span className="rounded-full bg-panel px-1.5 py-0.5 text-[8px] text-forest-400">36y</span>
        </div>
      </div>
    </div>
  ),
  'clinical-cards': (
    <div className="grid w-[190px] grid-cols-2 gap-1.5">
      <div className="border border-hair bg-white p-2">
        <div className="text-[8px] uppercase tracking-wide text-forest-300">Heart rate</div>
        <div className="tnum text-[13px] font-medium text-forest">72</div>
      </div>
      <div className="border border-hair bg-white p-2">
        <div className="text-[8px] uppercase tracking-wide text-forest-300">BP</div>
        <div className="tnum text-[13px] font-medium text-forest">120/80</div>
      </div>
      <div className="border border-hair bg-white p-2">
        <div className="text-[8px] uppercase tracking-wide text-forest-300">SpO₂</div>
        <div className="tnum text-[13px] font-medium text-forest">98%</div>
      </div>
      <div className="border border-hair bg-white p-2">
        <div className="text-[8px] uppercase tracking-wide text-forest-300">Temp</div>
        <div className="tnum text-[13px] font-medium text-forest">36.8</div>
      </div>
    </div>
  ),
  vitals: (
    <div className="w-[180px] border border-hair bg-white p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-[9px] uppercase tracking-wide text-forest-300">Heart rate</span>
        <span className="tnum text-[16px] font-medium text-forest">
          72 <span className="text-[9px] text-forest-300">bpm</span>
        </span>
      </div>
      <svg viewBox="0 0 100 24" className="mt-1.5 h-6 w-full text-azure" preserveAspectRatio="none">
        <polyline points="0,18 15,10 30,14 45,6 60,12 75,4 100,10" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  ),

  /* ---- Dashboard / toolbars ---- */
  'kpi-card': (
    <div className="w-[180px] border border-hair bg-white p-3">
      <div className="text-[9px] uppercase tracking-wide text-forest-300">Revenue</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="tnum text-[20px] font-medium text-forest">$48.2k</span>
        <span className="flex items-center gap-0.5 text-[10px] text-mint">
          <TrendingUp size={11} />
          12%
        </span>
      </div>
      <div className="mt-2">
        <Bars values={[45, 60, 50, 72, 58, 85, 70]} />
      </div>
    </div>
  ),
  'dashboard-lists': (
    <div className="w-[186px] divide-y divide-hair border border-hair bg-white">
      <div className="flex items-center gap-2 px-2.5 py-1.5">
        <span className="h-5 w-5 rounded-full bg-azure" />
        <Sk w="w-16" c="bg-navy-100" />
        <span className="tnum ml-auto text-[10px] text-forest-500">$1.2k</span>
      </div>
      <div className="flex items-center gap-2 px-2.5 py-1.5">
        <span className="h-5 w-5 rounded-full bg-mint" />
        <Sk w="w-20" c="bg-navy-100" />
        <span className="tnum ml-auto text-[10px] text-forest-500">$980</span>
      </div>
      <div className="flex items-center gap-2 px-2.5 py-1.5">
        <span className="h-5 w-5 rounded-full bg-gold-600" />
        <Sk w="w-14" c="bg-navy-100" />
        <span className="tnum ml-auto text-[10px] text-forest-500">$640</span>
      </div>
    </div>
  ),
  'filter-bar': (
    <div className="flex w-[192px] items-center gap-1.5 border border-hair bg-white p-2">
      <span className="flex items-center gap-1 border border-hair px-2 py-1 text-[9px] text-forest-400">
        <Search size={10} />
        Search
      </span>
      <span className="rounded-full bg-azure-100 px-2 py-1 text-[9px] font-medium text-azure-600">Active</span>
      <span className="ml-auto flex gap-0.5 bg-panel p-0.5">
        <span className="bg-white px-1.5 py-0.5 text-[9px]">List</span>
        <span className="px-1.5 py-0.5 text-[9px] text-forest-400">Grid</span>
      </span>
    </div>
  ),
  'page-header': (
    <div className="w-[190px]">
      <div className="flex items-center gap-1 text-[9px] text-forest-300">
        Patients
        <ChevronRight size={9} />
        All
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="h-3 w-20 rounded-full bg-navy-100" />
        <span className="flex h-6 w-14 items-center justify-center bg-azure text-[9px] font-medium text-white">New</span>
      </div>
    </div>
  ),

  /* ---- Records / patterns ---- */
  'file-upload': (
    <div className="flex w-[180px] flex-col items-center gap-1.5 border border-dashed border-navy-200 bg-panel p-4">
      <Upload size={18} className="text-forest-300" />
      <span className="text-[10px] text-forest-400">Drop files or browse</span>
    </div>
  ),
  signature: (
    <div className="w-[180px] border border-hair bg-white p-2">
      <svg viewBox="0 0 160 40" className="h-10 w-full text-forest" preserveAspectRatio="none">
        <path
          d="M5,30 C20,5 30,35 45,20 S70,5 85,25 S110,35 125,15 S150,8 155,22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="mt-1 border-t border-dashed border-navy-200 pt-1 text-[8px] text-forest-300">Sign above</div>
    </div>
  ),
  timeline: (
    <div className="w-[170px]">
      {['Order placed', 'Sample collected', 'In progress'].map((label, i, arr) => (
        <div key={label} className="flex gap-2.5">
          <div className="flex flex-col items-center">
            <span className={`h-2.5 w-2.5 rounded-full ${i === 0 ? 'bg-azure' : 'bg-navy-200'}`} />
            {i < arr.length - 1 && <span className="w-px flex-1 bg-hair" />}
          </div>
          <div className="pb-3">
            <div className="text-[10px] font-medium text-forest">{label}</div>
            <div className="mt-1 h-1.5 w-16 rounded-full bg-panel" />
          </div>
        </div>
      ))}
    </div>
  ),
  'empty-states': (
    <div className="flex flex-col items-center gap-2">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-panel">
        <Inbox size={20} className="text-forest-300" />
      </span>
      <span className="h-1.5 w-20 rounded-full bg-navy-100" />
      <span className="flex h-6 w-16 items-center justify-center bg-forest text-[9px] font-medium text-white">Add</span>
    </div>
  ),
  loading: (
    <div className="w-[180px] space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="h-8 w-8 rounded-full bg-panel" />
        <div className="flex-1 space-y-1.5">
          <Sk w="w-2/3" h="h-2" />
          <Sk w="w-1/2" h="h-2" c="bg-navy-100" />
        </div>
      </div>
      <Sk h="h-2" />
      <Sk w="w-4/5" h="h-2" />
    </div>
  ),
  'form-blocks': (
    <div className="w-[180px] space-y-2">
      <div>
        <Sk w="w-12" c="bg-navy-100" />
        <div className="mt-1 h-7 border border-hair" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Sk w="w-8" c="bg-navy-100" />
          <div className="mt-1 h-7 border border-hair" />
        </div>
        <div>
          <Sk w="w-8" c="bg-navy-100" />
          <div className="mt-1 h-7 border border-hair" />
        </div>
      </div>
    </div>
  ),
  'overlay-patterns': (
    <div className="relative h-[110px] w-[192px] overflow-hidden border border-hair bg-navy-100">
      <div className="absolute inset-y-2 right-2 w-16 space-y-1 border border-hair bg-white p-2">
        <Sk w="w-10" c="bg-navy-100" />
        <Sk />
      </div>
      <div className="absolute left-2 top-1/2 w-20 -translate-y-1/2 space-y-1 border border-hair bg-white p-2">
        <Sk w="w-12" c="bg-navy-100" />
        <Sk />
        <span className="block h-3 w-10 bg-azure" />
      </div>
    </div>
  ),
}
