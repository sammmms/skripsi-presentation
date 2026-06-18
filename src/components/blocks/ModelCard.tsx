import { motion, useReducedMotion } from 'framer-motion'
import type { ModelCardSpec } from '@/types/slide'
import { toneColor, toneFill } from '@/lib/tone'
import { Icon } from '@/lib/icon'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function ModelCard({
  model,
  className = '',
}: {
  model: ModelCardSpec
  className?: string
}) {
  const reduce = useReducedMotion()
  const color = toneColor(model.tone)

  return (
    <motion.article
      className={`surface-card relative flex flex-col overflow-hidden p-5 lg:p-6 ${className}`}
      style={{
        borderColor: `color-mix(in srgb, ${color} 40%, var(--color-border))`,
        boxShadow: `0 0 32px -18px ${color}`,
      }}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {/* Top accent bar */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: color }} />

      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-tight text-ink lg:text-xl xl:text-2xl">
            {model.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted lg:text-base">{model.tagline}</p>
        </div>
        {model.params && (
          <span
            className="shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-xs"
            style={{ background: toneFill(model.tone, 16), color }}
          >
            {model.params}
          </span>
        )}
      </header>

      <ul className="flex flex-1 flex-col gap-1.5 text-sm text-ink-soft lg:gap-2 lg:text-base xl:text-lg">
        {model.points.map((point, i) => (
          <li key={i} className="flex items-start gap-2">
            <Icon name="Dot" className="mt-0.5 size-4 shrink-0 lg:size-5" style={{ color }} />
            <span className="text-pretty leading-snug">{point}</span>
          </li>
        ))}
      </ul>

      {model.metric && (
        <div
          className="mt-4 flex items-baseline gap-2 rounded-xl px-3 py-2"
          style={{ background: toneFill(model.tone, 12) }}
        >
          <span
            className="font-display text-2xl font-semibold tabular-nums leading-none lg:text-3xl"
            style={{ color }}
          >
            {model.metric.value}
          </span>
          <span className="text-xs text-muted lg:text-sm">{model.metric.label}</span>
        </div>
      )}
    </motion.article>
  )
}
