import { motion, useReducedMotion } from 'framer-motion'
import type { ChartSpec } from '@/types/slide'
import { toneColor } from '@/lib/tone'
import { fmt } from '@/lib/format'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type BarChartSpec = Extract<ChartSpec, { kind: 'bar' }>

/** Round an axis max up to a pleasant value so gridlines land on nice numbers. */
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

// SVG layout constants (in viewBox units).
const W = 720
const H = 380
const PAD_L = 56
const PAD_R = 20
const PAD_T = 20
const PAD_B = 56
const TICKS = 5

export function BarChart({ chart, className = '' }: { chart: BarChartSpec; className?: string }) {
  const reduce = useReducedMotion()
  const { series, groups, baseline } = chart
  const decimals = chart.decimals ?? 2

  const yMin = chart.yMin ?? 0
  const dataMax = Math.max(
    ...groups.flatMap((g) => series.map((s) => g.values[s.key] ?? 0)),
    baseline?.value ?? -Infinity,
  )
  const yMax = chart.yMax ?? niceMax(dataMax)
  const span = yMax - yMin || 1

  const plotW = W - PAD_L - PAD_R
  const plotH = H - PAD_T - PAD_B

  const yOf = (v: number) => PAD_T + plotH * (1 - (v - yMin) / span)

  const groupW = plotW / groups.length
  const innerPad = groupW * 0.18
  const bandW = groupW - innerPad * 2
  const barW = bandW / series.length

  const ticks = Array.from({ length: TICKS + 1 }, (_, i) => yMin + (span * i) / TICKS)

  return (
    <figure className={`flex flex-col ${className}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={chart.yLabel ? `Diagram batang: ${chart.yLabel}` : 'Diagram batang'}
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

        {/* y axis label */}
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

        {/* Baseline reference line */}
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

        {/* Bars */}
        {groups.map((g, gi) => {
          const gx = PAD_L + gi * groupW + innerPad
          return (
            <g key={gi}>
              {series.map((s, si) => {
                const v = g.values[s.key] ?? 0
                const x = gx + si * barW
                const top = yOf(v)
                const baseY = yOf(yMin)
                const h = Math.max(0, baseY - top)
                const fill = toneColor(s.tone)
                const w = barW * 0.82
                const bx = x + (barW - w) / 2
                return (
                  <g key={s.key}>
                    {reduce ? (
                      <rect x={bx} width={w} y={top} height={h} rx={3} fill={fill} />
                    ) : (
                      <motion.rect
                        x={bx}
                        width={w}
                        rx={3}
                        fill={fill}
                        initial={{ y: baseY, height: 0 }}
                        whileInView={{ y: top, height: h }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                          duration: 0.7,
                          ease: EASE,
                          delay: gi * 0.08 + si * 0.05,
                        }}
                      />
                    )}
                    <motion.text
                      x={bx + w / 2}
                      y={top - 6}
                      textAnchor="middle"
                      className="fill-ink font-mono"
                      fontSize={12.5}
                      initial={reduce ? false : { opacity: 0 }}
                      whileInView={reduce ? undefined : { opacity: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.3, delay: reduce ? 0 : gi * 0.08 + si * 0.05 + 0.5 }}
                    >
                      {fmt(v, decimals)}
                    </motion.text>
                  </g>
                )
              })}
              {/* x label */}
              <text
                x={PAD_L + gi * groupW + groupW / 2}
                y={H - PAD_B + 22}
                textAnchor="middle"
                className="fill-ink-soft"
                fontSize={13}
              >
                {g.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      {series.length > 1 && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {series.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-2 text-sm text-ink-soft">
              <span
                className="size-3 rounded-sm"
                style={{ background: toneColor(s.tone) }}
                aria-hidden
              />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </figure>
  )
}
