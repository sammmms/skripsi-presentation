import { motion, useReducedMotion } from 'framer-motion'
import type { ChartSpec, LineSeries } from '@/types/slide'
import { toneColor } from '@/lib/tone'
import { fmt } from '@/lib/format'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type LineChartSpec = Extract<ChartSpec, { kind: 'line' }>

function niceMax(raw: number): number {
  if (raw <= 0) return 1
  const pow = Math.pow(10, Math.floor(Math.log10(raw)))
  const norm = raw / pow
  let step: number
  if (norm <= 1) step = 1
  else if (norm <= 2) step = 2
  else if (norm <= 2.5) step = 2.5
  else if (norm <= 5) step = 5
  else step = 10
  return step * pow
}

const W = 720
const H = 380
const PAD_L = 56
const PAD_R = 24
const PAD_T = 20
const PAD_B = 56
const TICKS = 5

export function LineChart({ chart, className = '' }: { chart: LineChartSpec; className?: string }) {
  const reduce = useReducedMotion()
  const { xLabels, lines, baseline } = chart
  const decimals = chart.decimals ?? 2

  const allValues = lines.flatMap((l) =>
    l.points.filter((p): p is number => p !== null),
  )
  const dataMax = Math.max(...allValues, baseline?.value ?? -Infinity)
  const dataMin = Math.min(...allValues, baseline?.value ?? Infinity)

  const yMin = chart.yMin ?? Math.min(0, dataMin)
  const yMax = chart.yMax ?? niceMax(dataMax)
  const span = yMax - yMin || 1

  const plotW = W - PAD_L - PAD_R
  const plotH = H - PAD_T - PAD_B

  const n = xLabels.length
  const xOf = (i: number) => (n <= 1 ? PAD_L + plotW / 2 : PAD_L + (plotW * i) / (n - 1))
  const yOf = (v: number) => PAD_T + plotH * (1 - (v - yMin) / span)

  const ticks = Array.from({ length: TICKS + 1 }, (_, i) => yMin + (span * i) / TICKS)

  /** Build path "M x y L x y ..." over contiguous non-null runs (skip gaps). */
  function pathFor(line: LineSeries): string {
    let d = ''
    let penDown = false
    line.points.forEach((p, i) => {
      if (p === null) {
        penDown = false
        return
      }
      const cmd = penDown ? 'L' : 'M'
      d += `${cmd}${xOf(i).toFixed(1)} ${yOf(p).toFixed(1)} `
      penDown = true
    })
    return d.trim()
  }

  return (
    <figure className={`flex flex-col ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={chart.yLabel ? `Diagram garis: ${chart.yLabel}` : 'Diagram garis'}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gridlines + y ticks */}
        {ticks.map((t, i) => {
          const y = yOf(t)
          return (
            <g key={i}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={y}
                y2={y}
                stroke="var(--color-border)"
                strokeWidth={1}
                opacity={i === 0 ? 0.9 : 0.4}
              />
              <text
                x={PAD_L - 10}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-muted font-mono"
                fontSize={13}
              >
                {fmt(t, decimals)}
              </text>
            </g>
          )
        })}

        {/* x ticks / labels */}
        {xLabels.map((lab, i) => (
          <text
            key={i}
            x={xOf(i)}
            y={H - PAD_B + 22}
            textAnchor="middle"
            className="fill-ink-soft"
            fontSize={13}
          >
            {lab}
          </text>
        ))}

        {/* Axis labels */}
        {chart.yLabel && (
          <text
            x={16}
            y={PAD_T + plotH / 2}
            textAnchor="middle"
            transform={`rotate(-90 16 ${PAD_T + plotH / 2})`}
            className="fill-ink-soft"
            fontSize={13}
          >
            {chart.yLabel}
          </text>
        )}
        {chart.xLabel && (
          <text
            x={PAD_L + plotW / 2}
            y={H - 6}
            textAnchor="middle"
            className="fill-ink-soft"
            fontSize={13}
          >
            {chart.xLabel}
          </text>
        )}

        {/* Baseline */}
        {baseline && (
          <g>
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={yOf(baseline.value)}
              y2={yOf(baseline.value)}
              stroke="var(--color-faint)"
              strokeWidth={1.5}
              strokeDasharray="6 5"
            />
            <text
              x={W - PAD_R}
              y={yOf(baseline.value) - 6}
              textAnchor="end"
              className="fill-faint"
              fontSize={12}
            >
              {baseline.label}
            </text>
          </g>
        )}

        {/* Lines + dots */}
        {lines.map((line, li) => {
          const color = toneColor(line.tone)
          const d = pathFor(line)
          return (
            <g key={line.key}>
              {reduce ? (
                <path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={line.dashed ? '7 6' : undefined}
                />
              ) : (
                <motion.path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={line.dashed ? '7 6' : undefined}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.1, ease: EASE, delay: li * 0.15 }}
                />
              )}
              {line.points.map((p, i) =>
                p === null ? null : (
                  <motion.circle
                    key={i}
                    cx={xOf(i)}
                    cy={yOf(p)}
                    r={3.5}
                    fill="var(--color-bg)"
                    stroke={color}
                    strokeWidth={2}
                    initial={reduce ? false : { opacity: 0, scale: 0 }}
                    whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: 0.3,
                      ease: EASE,
                      delay: reduce ? 0 : li * 0.15 + 0.6 + i * 0.03,
                    }}
                  />
                ),
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {lines.map((line) => (
          <span key={line.key} className="inline-flex items-center gap-2 text-sm text-ink-soft">
            <span
              className="inline-block h-0 w-5 border-t-2"
              style={{
                borderColor: toneColor(line.tone),
                borderStyle: line.dashed ? 'dashed' : 'solid',
              }}
              aria-hidden
            />
            {line.label}
          </span>
        ))}
      </div>
    </figure>
  )
}
