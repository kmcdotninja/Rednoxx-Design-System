import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/cn'

/* A small JSX/TS highlighter. Deliberately dependency-free and forgiving: docs
   snippets are short and well-formed, so a single-pass tokeniser beats pulling
   a full grammar into the bundle. Unknown text simply renders unstyled. */

type TokenKind = 'comment' | 'string' | 'tag' | 'attr' | 'keyword' | 'number' | 'plain'

const KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'const', 'let', 'var', 'function',
  'return', 'if', 'else', 'new', 'async', 'await', 'type', 'interface', 'as',
  'true', 'false', 'null', 'undefined',
])

/** Ordered alternation — earlier groups win, so strings beat words. */
const TOKEN_RE = new RegExp(
  [
    '(/\\*[\\s\\S]*?\\*/|//[^\\n]*)', // 1 comment
    '(`(?:\\\\.|[^`\\\\])*`|\'(?:\\\\.|[^\'\\\\])*\'|"(?:\\\\.|[^"\\\\])*")', // 2 string
    '(</?[A-Za-z][\\w.-]*)', // 3 opening/closing tag name
    '([A-Za-z_$][\\w$]*)(?=\\s*=(?!=|>))', // 4 attribute / assignment target
    '\\b(\\d+(?:\\.\\d+)?)\\b', // 5 number
    '\\b([A-Za-z_$][\\w$]*)\\b', // 6 word → keyword or plain
  ].join('|'),
  'g',
)

const TOKEN_CLASS: Record<TokenKind, string> = {
  comment: 'text-navy-300 italic',
  string: 'text-mint-soft',
  tag: 'text-azure-300',
  attr: 'text-gold',
  keyword: 'text-azure-300',
  number: 'text-gold-soft',
  plain: '',
}

/** Same grammar, retuned for a white surface — every tone AA on white. */
const TOKEN_CLASS_LIGHT: Record<TokenKind, string> = {
  comment: 'text-navy-300 italic',
  string: 'text-mint',
  tag: 'text-azure',
  attr: 'text-gold-600',
  keyword: 'text-azure-600',
  number: 'text-gold-600',
  plain: 'text-forest',
}

/** Split source into styled spans. Never throws — worst case it renders plain. */
function highlight(code: string, light = false): ReactNode[] {
  const classes = light ? TOKEN_CLASS_LIGHT : TOKEN_CLASS
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  const push = (text: string, kind: TokenKind) => {
    if (!text) return
    const cls = classes[kind]
    out.push(cls ? <span key={key++} className={cls}>{text}</span> : text)
  }

  TOKEN_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = TOKEN_RE.exec(code)) !== null) {
    if (m.index > last) push(code.slice(last, m.index), 'plain')
    const [raw, comment, str, tag, attr, num, word] = m
    if (comment) push(raw, 'comment')
    else if (str) push(raw, 'string')
    else if (tag) push(raw, 'tag')
    else if (attr) push(raw, 'attr')
    else if (num) push(raw, 'number')
    else if (word) push(raw, KEYWORDS.has(word) ? 'keyword' : 'plain')
    else push(raw, 'plain')
    last = m.index + raw.length
  }
  if (last < code.length) push(code.slice(last), 'plain')
  return out
}

/**
 * Dark, syntax-highlighted code sample with copy-to-clipboard — the canonical
 * way to show a snippet. Snippets are real, runnable code (no elisions), so an
 * engineer can copy the block straight into a screen.
 */
export function CodeBlock({
  code,
  label,
  className,
  variant = 'dark',
}: {
  /** Source to render and copy, verbatim. */
  code: string
  /** Optional caption, e.g. a file name or "Usage". */
  label?: string
  className?: string
  /**
   * `dark` is the standalone snippet card. `plain` renders on a white surface
   * with no chrome of its own — for panels that supply their own header and
   * copy control, like the playground's Code / Usage tabs.
   */
  variant?: 'dark' | 'plain'
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard blocked (insecure origin / denied) — leave the button idle.
    }
  }

  if (variant === 'plain') {
    return (
      <div className={cn('overflow-x-auto bg-white px-5 py-4', className)}>
        <pre className="font-mono text-[13px] leading-relaxed">
          <code>{highlight(code, true)}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden rounded-3xl bg-navy', className)}>
      {label && (
        <div className="flex items-center border-b border-white/10 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-navy-300">
          {label}
        </div>
      )}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
        className={cn(
          'absolute right-3 flex h-8 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 text-[12px] font-medium text-navy-100 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/60',
          label ? 'top-11' : 'top-3',
        )}
      >
        {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <div className="overflow-x-auto px-5 py-5 pr-24">
        <pre className="font-mono text-[13px] leading-relaxed text-navy-100">
          <code>{highlight(code)}</code>
        </pre>
      </div>
      {/* Announce the copy for screen readers without moving focus. */}
      <span aria-live="polite" className="sr-only">
        {copied ? 'Code copied to clipboard' : ''}
      </span>
    </div>
  )
}
