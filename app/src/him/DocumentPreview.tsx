import { Printer, ShieldAlert } from 'lucide-react'
import { Button, Drawer, KeyValue } from '@/components/ui'
import { Logo } from '@/components/Logo'
import type { HimDocument } from './data'
import { DocumentStatusPill } from './shared'

/**
 * Read-only document preview — a Drawer per the overlay rule (supplementary
 * detail). The mock page stands in for the scanned/generated file; the
 * preview itself is printable via the `.print-area` isolation.
 */
export function DocumentPreviewDrawer({
  doc,
  onClose,
}: {
  doc: HimDocument | null
  onClose: () => void
}) {
  return (
    <Drawer
      open={doc !== null}
      onClose={onClose}
      size="lg"
      title={doc?.type}
      subtitle={doc ? `${doc.patientLabel} · v${doc.version}` : undefined}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button leftIcon={<Printer size={14} />} onClick={() => window.print()}>
            Print
          </Button>
        </>
      }
    >
      {doc && (
        <div className="space-y-4">
          {doc.confidentiality === 'restricted' && (
            <p className="flex items-center gap-2 rounded-2xl bg-rose-soft px-4 py-2.5 text-[13px] font-medium text-rose-ink">
              <ShieldAlert size={14} aria-hidden /> Restricted document — this view is audited.
            </p>
          )}

          {/* Mock page preview — letterhead + redacted body lines. */}
          <div className="print-area rounded-3xl border border-hair bg-white p-6 shadow-chip">
            <div className="flex items-center justify-between gap-4 border-b border-hair pb-4">
              <Logo className="h-5" />
              <span className="text-right text-[11px] leading-tight text-forest-400">
                Garki General Hospital
                <br />
                {doc.source}
              </span>
            </div>
            <p className="mt-4 text-[15px] font-medium text-forest">{doc.type}</p>
            <p className="mt-0.5 text-[13px] text-forest-400">{doc.patientLabel}</p>
            <div aria-hidden className="mt-4 space-y-2.5">
              {[92, 100, 96, 88, 100, 73, 0, 95, 100, 84].map((w, i) =>
                w === 0 ? (
                  <div key={i} className="h-2" />
                ) : (
                  <div key={i} className="h-2.5 rounded-full bg-panel" style={{ width: `${w}%` }} />
                ),
              )}
            </div>
            <p className="tnum mt-5 border-t border-hair pt-3 text-[11px] text-forest-300">
              {doc.uploadedBy} · {doc.uploaded} · version {doc.version}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <KeyValue label="Status" value={<DocumentStatusPill status={doc.status} />} />
            <KeyValue label="Confidentiality" value={<span className="capitalize">{doc.confidentiality}</span>} />
            <KeyValue label="Source" value={doc.source} />
            <KeyValue label="Uploaded" value={<span className="tnum">{`${doc.uploadedBy} · ${doc.uploaded}`}</span>} />
          </div>
          <p className="rounded-2xl bg-panel px-4 py-3 text-xs leading-relaxed text-forest-400">
            Views are audit events; superseded and created-in-error versions stay retrievable — no
            document is ever hard-deleted.
          </p>
        </div>
      )}
    </Drawer>
  )
}
