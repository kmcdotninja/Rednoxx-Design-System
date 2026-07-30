import { Link, useParams } from '@tanstack/react-router'
import { Button, Card } from '@/components/ui'

/** Stub check-in → care encounter handoff. */
export function CheckInStubPage() {
  const { patientId } = useParams({ strict: false }) as { patientId: string }
  const encounterId = 'enc-demo-001'

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Card className="space-y-3 p-6">
        <h1 className="text-[20px] font-medium text-forest">Check-in</h1>
        <p className="tnum text-[13px] text-forest-400">patientId: {patientId}</p>
        <p className="text-[13px] text-forest-400">
          After check-in, intake hands the encounter to ambulatory or emergency care.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {/* Design-system port: the ambulatory / emergency care streams live
              in the product repo, so the handoff actions are disabled here. */}
          <Button size="sm" disabled>Open ambulatory encounter</Button>
          <Button size="sm" variant="secondary" disabled>Send to emergency</Button>
          <Link to="/him/patients/$id" params={{ id: patientId }}>
            <Button size="sm" variant="ghost">View record</Button>
          </Link>
        </div>
        <p className="text-[12px] text-forest-400">
          Encounter {encounterId}: the ambulatory and emergency handoffs open in the
          product app — those care streams are not part of this design-system port.
        </p>
      </Card>
    </div>
  )
}
