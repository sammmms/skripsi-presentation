import type { StatSpec } from '@/types/slide'
import { toneColor, toneFill } from '@/lib/tone'
import { CountUp } from './CountUp'

export function StatCard({ stat, className = '' }: { stat: StatSpec; className?: string }) {
  const color = toneColor(stat.tone)
  return (
    <div
      className={`surface-card relative flex flex-col gap-1 overflow-hidden p-4 sm:p-5 ${className}`}
    >
      {/* Subtle tone glow in the corner */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full blur-2xl"
        style={{ background: toneFill(stat.tone, 22) }}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <span
        className="font-display text-3xl font-semibold leading-none tabular-nums sm:text-4xl"
        style={{ color }}
      >
        <CountUp
          value={stat.value}
          decimals={stat.decimals ?? 0}
          prefix={stat.prefix}
          suffix={stat.suffix}
        />
      </span>

      <p className="mt-2 text-sm font-medium text-ink-soft">{stat.label}</p>
      {stat.sublabel && <p className="text-xs text-muted">{stat.sublabel}</p>}
    </div>
  )
}
