import { useRef } from 'react'

/** A row of single-digit inputs for OTP / OneToken entry. */
export function CodeInput({
  length = 6,
  value,
  onChange,
}: {
  length?: number
  value: string
  onChange: (next: string) => void
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const setDigit = (i: number, d: string) => {
    const digit = d.replace(/\D/g, '').slice(-1)
    const chars = value.split('')
    chars[i] = digit
    const next = chars.join('').slice(0, length)
    onChange(next)
    if (digit && i < length - 1) refs.current[i + 1]?.focus()
  }

  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (digits) onChange(digits)
  }

  return (
    <div className="flex gap-2" onPaste={onPaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          className="h-13 w-full rounded-2xl border border-hair bg-white text-center text-xl font-medium text-navy transition-[border-color,box-shadow] focus:border-navy-400 focus:outline-none focus:ring-4 focus:ring-navy-50"
        />
      ))}
    </div>
  )
}
