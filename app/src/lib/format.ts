export type Currency = 'NGN' | 'USD'

export const currencySymbol: Record<Currency, string> = {
  NGN: '₦',
  USD: '$',
}

/** Full money string, e.g. ₦12,400,000 or $1,204.50 */
export function money(amount: number, currency: Currency = 'NGN'): string {
  const decimals = currency === 'USD' ? 2 : 0
  return (
    currencySymbol[currency] +
    amount.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  )
}

/** Compact money, e.g. ₦96.9K or $1.2M */
export function compactMoney(amount: number, currency: Currency = 'NGN'): string {
  return (
    currencySymbol[currency] +
    new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount)
  )
}

export function num(value: number, maxFractionDigits = 2): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: maxFractionDigits })
}

export function compact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

/** 0x1cf2…9a56 style truncation */
export function shortAddr(addr: string): string {
  if (addr.length <= 11) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function maskId(value: string): string {
  if (!value) return ''
  const last4 = value.slice(-4)
  return `•••• •••• ${last4}`
}

/** e.g. "12 May 2026" from an ISO string or yyyy-mm-dd. */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** e.g. "12 May 2026, 14:05". */
export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/** Relative time, e.g. "just now", "2h ago", "3d ago"; falls back to the date. */
export function timeAgo(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const mins = Math.floor((Date.now() - d.getTime()) / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w ago`
  return formatDate(iso)
}
