import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './chart'
import { cn } from '@/lib/cn'

export interface BarDatum {
  label: string
  value: number
}

/**
 * Bar chart built on the official shadcn/ui chart primitives — config-driven
 * colour via `var(--color-value)` and the stock ChartTooltipContent.
 * `layout="horizontal"` renders category bars growing to the right.
 */
export function BarChart({
  data,
  height = 240,
  color = '#45e227',
  seriesLabel = 'Value',
  className,
  layout = 'vertical',
  valueFormat = (v) => `${Math.round(v).toLocaleString()}`,
  yTickFormat,
  interactive = true,
}: {
  data: BarDatum[]
  height?: number
  color?: string
  /** Series name shown in the tooltip row. */
  seriesLabel?: string
  className?: string
  /** "vertical" = columns over an X axis (months/days); "horizontal" = bars per category. */
  layout?: 'vertical' | 'horizontal'
  valueFormat?: (v: number) => string
  yTickFormat?: (v: number) => string
  interactive?: boolean
}) {
  const config: ChartConfig = { value: { label: seriesLabel, color } }
  const yFormat = yTickFormat ?? valueFormat
  const horizontal = layout === 'horizontal'

  return (
    <ChartContainer config={config} className={cn('aspect-auto w-full', className)} style={{ height }}>
      <RechartsBarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
        barCategoryGap="28%"
      >
        <CartesianGrid horizontal={!horizontal} vertical={horizontal} strokeDasharray="3 3" />
        {horizontal ? (
          <>
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} tickCount={4} tickFormatter={(v: number) => yFormat(v)} />
            <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} tickMargin={8} width={120} />
          </>
        ) : (
          <>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={24}
              tickFormatter={(v: string) => v.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={52} tickCount={4} tickFormatter={(v: number) => yFormat(v)} />
          </>
        )}
        {interactive && (
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="dot"
                formatter={(value, name, item) => (
                  <>
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                      style={{ background: item?.color ?? 'var(--color-value)' }}
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
        )}
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}
          maxBarSize={horizontal ? 22 : 40}
          isAnimationActive
        />
      </RechartsBarChart>
    </ChartContainer>
  )
}
