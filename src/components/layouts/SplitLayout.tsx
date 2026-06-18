import { motion, useReducedMotion } from 'framer-motion'
import type { SplitSlide } from '@/types/slide'
import { Bullets, RichText } from '@/components/blocks'
import { toneColor } from '@/lib/tone'
import { SlideShell } from './SlideShell'

type Panel = SplitSlide['left']

function SplitPanel({ panel, delay }: { panel: Panel; delay: number }) {
  const reduce = useReducedMotion()
  const accent = toneColor(panel.tone)

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className="surface-card flex flex-col p-5 sm:p-6"
      style={{ borderColor: `color-mix(in srgb, ${accent} 24%, var(--color-border))` }}
    >
      {panel.heading && (
        <h3
          className="font-display text-lg font-semibold sm:text-xl"
          style={{ color: accent }}
        >
          {panel.heading}
        </h3>
      )}
      {panel.lead && (
        <RichText
          text={panel.lead}
          className="mt-2 block text-pretty text-sm leading-relaxed text-ink-soft sm:text-base"
        />
      )}
      <div className="mt-4">
        <Bullets items={panel.bullets} />
      </div>
    </motion.div>
  )
}

/** Two accented panels side-by-side (stacked on mobile). E.g. Tujuan | Hipotesis. */
export function SplitLayout({ slide }: { slide: SplitSlide }) {
  return (
    <SlideShell slide={slide}>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <SplitPanel panel={slide.left} delay={0.05} />
        <SplitPanel panel={slide.right} delay={0.15} />
      </div>
    </SlideShell>
  )
}
