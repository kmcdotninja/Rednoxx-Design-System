import { Link } from '@tanstack/react-router'
import { Button, Card, Field, Input } from '@/components/ui'
import { useState } from 'react'

const DEMO_PATIENT = 'pat-demo-001'

export function IntakeHomePage() {
  const [q, setQ] = useState('')
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Card className="space-y-4 p-6">
        <p className="text-[11px] font-medium uppercase tracking-wide text-forest-300">HIM Intake stub</p>
        <h1 className="text-[22px] font-medium text-forest">Search / register</h1>
        <p className="text-[13px] text-forest-400">
          Full intake screens will replace this stub. Use it to exercise App Shell links into Care.
        </p>
        <Field label="Patient search">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, MRN or phone" />
        </Field>
        <div className="flex flex-wrap gap-2">
          <Link to="/him/intake/check-in/$patientId" params={{ patientId: DEMO_PATIENT }}>
            <Button size="sm">Check in demo patient</Button>
          </Link>
          <Link to="/him/patients/$id" params={{ id: DEMO_PATIENT }}>
            <Button size="sm" variant="secondary">Open record</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
