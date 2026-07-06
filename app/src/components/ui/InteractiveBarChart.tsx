import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './chart'
import { Card } from './Card'
import { cn } from '@/lib/cn'

export interface InteractiveSeries {
  key: string
  label: string
  color: string
}

/**
 * The shadcn "Bar Chart – Interactive" block: title on the left, clickable
 * per-series total tiles on the right, and a dense daily bar chart below
 * showing whichever series is active.
 */
export function InteractiveBarChart({
  title,
  subtitle,
  data,
  series,
  height = 250,
  valueFormat = (v) => v.toLocaleString(),
  className,
}: {
  title: string
  subtitle?: string
  /** Rows shaped `{ label: 'Apr 2', <seriesKey>: number, … }`. */
  data: Array<Record<string, string | number>>
  series: InteractiveSeries[]
  height?: number
  valueFormat?: (v: number) => string
  className?: string
}) {
  const [active, setActive] = useState(series[0].key)

  const config: ChartConfig = Object.fromEntries(
    series.map((s) => [s.key, { label: s.label, color: s.color }]),
  )

  const totals = useMemo(
    () =>
      Object.fromEntries(
        series.map((s) => [s.key, data.reduce((acc, row) => acc + Number(row[s.key] ?? 0), 0)]),
      ),
    [data, series],
  )

  return (
    <Card pad={false} className={cn('overflow-hidden', className)}>
      {/* Header — title left, series total tiles right */}
      <div className="flex flex-col items-stretch border-b border-hair sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-0.5 px-5 py-4 sm:px-6">
          <h3 className="text-[15px] font-medium tracking-[-0.01em] text-navy">{title}</h3>
          {subtitle && <p className="text-[13px] text-navy-400">{subtitle}</p>}
        </div>
        <div className="flex">
          {series.map((s) => (
            <button
              key={s.key}
              data-active={active === s.key}
              onClick={() => setActive(s.key)}
              className="relative z-10 flex flex-1 flex-col justify-center gap-1 border-t border-hair px-5 py-3 text-left transition-colors even:border-l data-[active=true]:bg-panel/60 sm:border-l sm:border-t-0 sm:px-7 sm:py-4"
            >
              <span className="text-xs text-navy-400">{s.label}</span>
              <span className="tnum text-lg font-medium leading-none text-navy sm:text-2xl">
                {totals[s.key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="px-2 pb-4 pt-4 sm:px-5">
        <ChartContainer config={config} className="aspect-auto w-full" style={{ height }}>
          <BarChart data={data} margin={{ top: 4, left: 12, right: 12, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[160px]"
                  indicator="dot"
                  formatter={(value, name, item) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{ background: item?.color ?? `var(--color-${active})` }}
                      />
                      <div className="flex flex-1 items-center justify-between leading-none">
                        <span className="text-navy-400">{config[name as string]?.label ?? name}</span>
                        <span className="text-navy tnum ml-2 font-medium">{valueFormat(Number(value))}</span>
                      </div>
                    </>
                  )}
                />
              }
            />
            <Bar dataKey={active} fill={`var(--color-${active})`} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  )
}
