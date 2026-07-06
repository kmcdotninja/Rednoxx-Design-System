import { useId } from 'react'
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ReferenceDot,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './chart'
import { cn } from '@/lib/cn'

/**
 * Area chart built on the official shadcn/ui chart primitives — ChartContainer
 * config drives series colours via `var(--color-*)`; the tooltip is the stock
 * ChartTooltipContent with a value formatter.
 */
export function AreaChart({
  data,
  height = 240,
  line = '#171723',
  fill = '#45e227',
  seriesLabel = 'Value',
  className,
  showEndDot = false,
  labels,
  valueFormat = (v) => `${Math.round(v).toLocaleString()}`,
  yTickFormat,
  xTickFormat = (v) => v.slice(0, 3),
  interactive = true,
  showAxes = true,
}: {
  data: number[]
  height?: number
  line?: string
  fill?: string
  /** Series name shown in the tooltip row. */
  seriesLabel?: string
  className?: string
  showEndDot?: boolean
  /** X-axis tick labels (e.g. months or days) — falls back to 1…n. */
  labels?: string[]
  valueFormat?: (v: number) => string
  /** Y-axis tick formatter — falls back to `valueFormat`. */
  yTickFormat?: (v: number) => string
  /** X-axis tick formatter — defaults to 3-char month abbreviation. */
  xTickFormat?: (v: string) => string
  interactive?: boolean
  showAxes?: boolean
}) {
  const gradientId = useId().replace(/:/g, '')
  const chartData = data.map((v, i) => ({ x: labels?.[i] ?? `${i + 1}`, v }))
  const config: ChartConfig = {
    v: { label: seriesLabel, color: line },
    fill: { color: fill },
  }
  const last = chartData[chartData.length - 1]
  const yFormat = yTickFormat ?? valueFormat

  return (
    <ChartContainer config={config} className={cn('aspect-auto w-full', className)} style={{ height }}>
      <RechartsAreaChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`area-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-fill)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--color-fill)" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        {showAxes && (
          <XAxis
            dataKey="x"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={24}
            tickFormatter={xTickFormat}
            padding={{ left: 4, right: 4 }}
          />
        )}
        {showAxes && (
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={52}
            tickCount={4}
            tickFormatter={(v: number) => yFormat(v)}
            domain={[0, 'dataMax + 2']}
          />
        )}
        {!showAxes && <XAxis dataKey="x" hide padding={{ left: 6, right: 6 }} />}
        {!showAxes && <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />}
        {interactive && (
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dot"
                formatter={(value, name, item) => (
                  <>
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                      style={{ background: item?.color ?? 'var(--color-v)' }}
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
        <Area
          dataKey="v"
          type="natural"
          stroke="var(--color-v)"
          strokeWidth={2}
          fill={`url(#area-${gradientId})`}
          dot={false}
          activeDot={interactive ? { r: 4, fill: 'var(--color-v)', stroke: '#fff', strokeWidth: 2 } : false}
          isAnimationActive
        />
        {showEndDot && last && (
          <ReferenceDot x={last.x} y={last.v} r={4} fill="var(--color-v)" stroke="#fff" strokeWidth={2} />
        )}
      </RechartsAreaChart>
    </ChartContainer>
  )
}

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1]
    const p1 = points[i]
    const cx = (p0.x + p1.x) / 2
    d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`
  }
  return d
}

/** Minimal inline sparkline for table rows / cards. */
export function Sparkline({
  data,
  width = 96,
  height = 32,
  color = '#171723',
}: {
  data: number[]
  width?: number
  height?: number
  color?: string
}) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: 3 + (1 - (v - min) / range) * (height - 6),
  }))
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={smoothPath(pts)}
        fill="none"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
