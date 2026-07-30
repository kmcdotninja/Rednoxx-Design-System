import { Printer } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button, Modal, Tag } from '@/components/ui'
import { Logo } from '@/components/Logo'

export interface SlipData {
  name: string
  /** MRN or temporary emergency ID. */
  id: string
  idLabel: string
  detail: string
  category?: string
  scenario: string
}

/**
 * Registration slip preview (W-HIM-001: "printable slip"). The slip itself is
 * the only thing that prints — `.print-area` + the print stylesheet isolate it.
 */
export function RegistrationSlipModal({
  open,
  onClose,
  slip,
}: {
  open: boolean
  onClose: () => void
  slip: SlipData
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registration slip"
      subtitle="Hand to the patient — the MRN is their key for every future visit"
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
      <div className="print-area mx-auto w-full max-w-sm rounded-3xl border border-hair bg-white p-6">
        <div className="flex items-center justify-between gap-4 border-b border-hair pb-4">
          <Logo className="h-6" />
          <span className="text-right text-[11px] leading-tight text-forest-400">
            Garki General Hospital
            <br />
            Health Information Management
          </span>
        </div>

        <div className="py-5 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest-300">
            {slip.idLabel}
          </p>
          <p className="tnum mt-1 font-mono text-[28px] font-medium tracking-wide text-forest">{slip.id}</p>
          {/* Scannable QR of the MRN — the slip's key at every desk. currentColor
              keeps it on the forest token; the white pad is its quiet zone. */}
          <div className="mx-auto mt-4 w-fit rounded-2xl border border-hair bg-white p-3">
            <QRCodeSVG
              value={slip.id}
              size={104}
              level="M"
              marginSize={0}
              bgColor="transparent"
              fgColor="currentColor"
              title={`QR code for ${slip.idLabel} ${slip.id}`}
              className="block text-forest"
            />
          </div>
        </div>

        <div className="space-y-2 border-t border-hair pt-4 text-[13px]">
          <div className="flex justify-between gap-3">
            <span className="text-forest-400">Patient</span>
            <span className="font-medium text-forest">{slip.name}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-forest-400">Details</span>
            <span className="text-forest-500">{slip.detail}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-forest-400">Registered</span>
            <span className="tnum text-forest-500">07 Jul 2026 · Front desk 2</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-forest-400">Registration</span>
            <Tag className="capitalize">{slip.scenario}</Tag>
          </div>
          {slip.category && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-forest-400">Category</span>
              <Tag className="capitalize">{slip.category}</Tag>
            </div>
          )}
        </div>

        <p className="mt-4 border-t border-hair pt-3 text-center text-[11px] leading-relaxed text-forest-300">
          Please bring this slip to every visit. Lost slips are re-issued at the records office —
          your record is never duplicated.
        </p>
      </div>
    </Modal>
  )
}
