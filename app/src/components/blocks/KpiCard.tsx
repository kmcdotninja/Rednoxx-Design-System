import { AreaChart } from '@/components/ui/AreaChart'
import { Badge, Card } from '@/components/ui'

/**
 * Dashboard KPI card — label, headline value, delta vs the previous period,
 * and a compact trend of the same measure. The default analytics tile.
 */
export function KpiCard({
  label,
  value,
  delta,
  deltaTone = 'up',
  sub,
  series,
  labels,
  valueFormat = (v) => Math.round(v).toLocaleString(),
  height = 96,
}: {
  label: string
  value: string
  delta?: string
  deltaTone?: 'up' | 'down'
  sub?: string
  series: number[]
  /** X labels for the trend tooltip (e.g. dates). */
  labels?: string[]
  valueFormat?: (v: number) => string
  height?: number
}) {
  return (
    <Card pad={false} className="p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-forest-400">{label}</span>
        {delta && (
          <Badge tone={deltaTone === 'up' ? 'success' : 'danger'} className="normal-case">
            {delta}
          </Badge>
        )}
      </div>
      <p className="tnum mt-2 text-[26px] font-medium leading-none tracking-[-0.02em] text-forest">
        {value}
      </p>
      {sub && <p className="mt-1.5 text-[13px] text-forest-400">{sub}</p>}
      <div className="mt-4">
        <AreaChart
          data={series}
          labels={labels}
          height={height}
          line="#5833fb"
          fill="#5833fb"
          seriesLabel={label}
          valueFormat={valueFormat}
          showAxes={false}
        />
      </div>
    </Card>
  )
}
