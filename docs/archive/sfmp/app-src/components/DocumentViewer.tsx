import { Download, FileText } from 'lucide-react'
import { Mark } from '@/components/Logo'
import { Button, Drawer, useToast } from '@/components/ui'
import { formatDate } from '@/lib/format'
import type { FileRef } from '@/data/types'
import { cn } from '@/lib/cn'

/** Deterministic skeleton line widths seeded from the file name, so every
 *  document renders a slightly different (but stable) mock page. */
function seededWidths(name: string, count: number): number[] {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  const widths: number[] = []
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) >>> 0
    widths.push(55 + (h % 45)) // 55–99%
  }
  return widths
}

/**
 * Mock document preview — a paper-style page for any uploaded FileRef.
 * There are no real bytes in the demo, so the viewer renders a plausible,
 * deterministic document body with letterhead, meta and a signature block.
 */
export function DocumentViewer({
  file,
  onClose,
  owner,
  sectionName,
}: {
  file: FileRef | null
  onClose: () => void
  /** Company shown on the letterhead (e.g. the borrower). */
  owner?: string
  /** Human name of the section the file was filed under. */
  sectionName?: string
}) {
  const toast = useToast()
  const title = file?.name.replace(/\.[a-z0-9]+$/i, '') ?? ''
  const lines = file ? seededWidths(file.name, 14) : []

  return (
    <Drawer
      open={file !== null}
      onClose={onClose}
      title={file?.name}
      subtitle={file ? `${sectionName ?? file.section} · ${file.sizeKb} KB · uploaded ${formatDate(file.at)}` : undefined}
      size="lg"
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-navy-300">Demo preview — no real file contents are stored.</span>
          <Button
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={() => toast.info('Download started', `${file?.name} (demo file)`)}
          >
            Download
          </Button>
        </div>
      }
    >
      {file && (
        <div className="space-y-3">
          {/* Page 1 */}
          <div className="relative mx-auto max-w-[540px] overflow-hidden rounded-xl border border-hair bg-white p-8 shadow-card">
            {/* watermark */}
            <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] select-none whitespace-nowrap text-[42px] font-medium tracking-widest text-navy-50">
              SFMP · DEMO COPY
            </span>

            {/* letterhead */}
            <div className="relative flex items-center justify-between border-b border-hair pb-4">
              <span className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-white">
                  <Mark className="h-4 w-4" />
                </span>
                <span className="text-[13px] font-medium text-navy">{owner ?? 'SFMP'}</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-navy-300">Confidential</span>
            </div>

            {/* document title + meta */}
            <h4 className="relative mt-5 text-[16px] font-medium leading-snug text-navy">{title}</h4>
            <p className="relative mt-1 text-xs text-navy-400">
              {sectionName ?? file.section} · Ref {file.id.slice(-6).toUpperCase()} · {formatDate(file.at)}
            </p>

            {/* body skeleton */}
            <div className="relative mt-6 space-y-2.5">
              {lines.slice(0, 6).map((w, i) => (
                <div key={i} className="h-2 rounded-full bg-panel" style={{ width: `${w}%` }} />
              ))}
            </div>

            {/* figures block */}
            <div className="relative mt-6 overflow-hidden rounded-lg border border-hair">
              <div className="grid grid-cols-3 border-b border-hair bg-panel/60 px-3 py-2">
                {['Item', 'Detail', 'Amount'].map((h) => (
                  <span key={h} className="text-[10px] font-medium uppercase tracking-wide text-navy-400">{h}</span>
                ))}
              </div>
              {lines.slice(6, 10).map((w, i) => (
                <div key={i} className={cn('grid grid-cols-3 items-center gap-3 px-3 py-2', i < 3 && 'border-b border-hair/60')}>
                  <div className="h-1.5 rounded-full bg-panel" style={{ width: `${40 + (w % 40)}%` }} />
                  <div className="h-1.5 rounded-full bg-panel" style={{ width: `${30 + (w % 55)}%` }} />
                  <div className="h-1.5 justify-self-end rounded-full bg-navy-100" style={{ width: `${25 + (w % 30)}%` }} />
                </div>
              ))}
            </div>

            <div className="relative mt-6 space-y-2.5">
              {lines.slice(10, 14).map((w, i) => (
                <div key={i} className="h-2 rounded-full bg-panel" style={{ width: `${w}%` }} />
              ))}
            </div>

            {/* signature block */}
            <div className="relative mt-8 flex items-end justify-between border-t border-hair pt-5">
              <div>
                <div className="h-6 w-28 border-b border-navy-300" />
                <p className="mt-1.5 text-[10px] uppercase tracking-wide text-navy-300">Authorized signatory</p>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] text-navy-300">
                <FileText size={11} /> Page 1 of 2
              </span>
            </div>
          </div>

          {/* Page 2 stub */}
          <div className="mx-auto h-8 max-w-[500px] rounded-t-xl border border-b-0 border-hair bg-white/70" />
        </div>
      )}
    </Drawer>
  )
}
