import { useState } from 'react'
import { AreaChart } from './AreaChart'
import { Card, CardHeader } from './Card'
import { Segmented, type SegOption } from './Segmented'
import type { RangeSeries, TimeRange } from '@/data/types'

const RANGE_OPTIONS: SegOption<TimeRange>[] = [
  { value: 'day', label: 'Day' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

/**
 * shadcn-style interactive trend chart — an area chart with Day / Month / Year
 * time-range filters in the card header, so data progression is explorable
 * rather than a single static series.
 */
export function TrendChart({
  title,
  subtitle,
  ranges,
  seriesLabel = 'Value',
  valueFormat,
  yTickFormat,
  line = '#171723',
  fill = '#45e227',
  height = 260,
  defaultRange = 'month',
  className,
}: {
  title: string
  subtitle?: string
  ranges: Record<TimeRange, RangeSeries>
  /** Series name shown in the tooltip row. */
  seriesLabel?: string
  valueFormat?: (v: number) => string
  yTickFormat?: (v: number) => string
  line?: string
  fill?: string
  height?: number
  defaultRange?: TimeRange
  className?: string
}) {
  const [range, setRange] = useState<TimeRange>(defaultRange)
  const series = ranges[range]

  return (
    <Card className={className}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <CardHeader title={title} subtitle={subtitle} />
        <Segmented<TimeRange> size="sm" options={RANGE_OPTIONS} value={range} onChange={setRange} />
      </div>
      <div className="mt-4">
        <AreaChart
          data={series.data}
          labels={series.labels}
          seriesLabel={seriesLabel}
          // Month names abbreviate to 3 chars; day ("Jun 5") and year ("2026")
          // labels render as-is.
          xTickFormat={range === 'month' ? (v) => v.slice(0, 3) : (v) => v}
          line={line}
          fill={fill}
          height={height}
          valueFormat={valueFormat}
          yTickFormat={yTickFormat}
        />
      </div>
    </Card>
  )
}
