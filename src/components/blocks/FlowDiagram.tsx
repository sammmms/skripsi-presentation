import { motion, useReducedMotion } from 'framer-motion'
import type { FlowStep } from '@/types/slide'
import { toneColor, toneFill } from '@/lib/tone'
import { Icon } from '@/lib/icon'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function StepChip({ step }: { step: FlowStep }) {
  const color = toneColor(step.tone)
  return (
    <div
      className="surface-card flex items-center gap-3 px-4 py-3"
      style={{ borderColor: `color-mix(in srgb, ${color} 45%, var(--color-border))` }}
    >
      {step.icon && (
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: toneFill(step.tone, 18), color }}
        >
          <Icon name={step.icon} className="size-5" />
        </span>
      )}
      <div className="min-w-0">
        <div className="font-display text-sm font-semibold text-ink">{step.label}</div>
        {step.detail && <div className="text-xs text-muted">{step.detail}</div>}
      </div>
    </div>
  )
}

export function FlowDiagram({
  steps,
  className = '',
}: {
  steps: FlowStep[]
  className?: string
}) {
  const reduce = useReducedMotion()

  return (
    <div className={className}>
      {/* Desktop: horizontal, wrapping ------------------------------------- */}
      <div className="hidden flex-wrap items-stretch gap-y-3 md:flex">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex items-center"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : i * 0.12 }}
          >
            <StepChip step={step} />
            {i < steps.length - 1 && (
              <span className="mx-2 flex items-center text-faint">
                <Icon name="ChevronRight" className="size-6" />
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Mobile: vertical with down-connectors ----------------------------- */}
      <div className="flex flex-col md:hidden">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : i * 0.1 }}
          >
            <StepChip step={step} />
            {i < steps.length - 1 && (
              <span className="my-1 flex justify-center text-faint">
                <Icon name="ChevronDown" className="size-5" />
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
