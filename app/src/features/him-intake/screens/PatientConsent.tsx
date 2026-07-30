import { Link, useParams } from '@tanstack/react-router'
import { Button, Card } from '@/components/ui'

/**
 * AS-05 deep-link target for `/him/patients/$id/consent`.
 * Full consent UI lives at `/him/records/privacy/consent` (HIM-S24);
 * this page makes the patient-scoped URL load instead of a global 404.
 */
export function PatientConsentPage() {
  const { id } = useParams({ strict: false }) as { id: string }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Card className="space-y-3 p-6">
        <p className="text-[11px] font-medium uppercase tracking-wide text-forest-300">
          HIM-S24 · Consent
        </p>
        <h1 className="text-[20px] font-medium text-forest">Patient consent</h1>
        <p className="tnum text-[13px] text-forest-400">patientId: {id}</p>
        <p className="text-[13px] text-forest-400">
          Capture, review and withdraw consent for this patient. The full consent register is in
          HIM Records.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {/* Design-system port: the consent register (HIM-S24, him-records
              stream) lives in the product repo, so the action is disabled here. */}
          <Button size="sm" disabled>
            Open consent register
          </Button>
          <Link to="/him/patients/$id" params={{ id }}>
            <Button size="sm" variant="secondary">
              Back to record
            </Button>
          </Link>
        </div>
        <p className="text-[12px] text-forest-400">
          The consent register opens in the product app — the HIM Records stream is not
          part of this design-system port.
        </p>
      </Card>
    </div>
  )
}
