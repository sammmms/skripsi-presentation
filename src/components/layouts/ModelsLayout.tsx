import { motion, useReducedMotion } from 'framer-motion'
import type { ModelsSlide } from '@/types/slide'
import { Figure, ModelCard, RichText } from '@/components/blocks'
import { SlideShell } from './SlideShell'

/** Optional lead, a responsive grid of model cards (3-up → 1-up), optional figure. */
export function ModelsLayout({ slide }: { slide: ModelsSlide }) {
  const reduce = useReducedMotion()
  const cols =
    slide.models.length >= 3
      ? 'sm:grid-cols-2 lg:grid-cols-3'
      : slide.models.length === 2
        ? 'sm:grid-cols-2'
        : ''

  return (
    <SlideShell slide={slide}>
      <div className="flex w-full flex-col gap-6">
        {slide.lead && (
          <RichText
            text={slide.lead}
            className="block max-w-3xl text-pretty text-base leading-relaxed text-ink-soft sm:text-lg"
          />
        )}

        <div className={`grid grid-cols-1 gap-4 ${cols}`}>
          {slide.models.map((model, i) => (
            <motion.div
              key={model.name}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <ModelCard model={model} className="h-full" />
            </motion.div>
          ))}
        </div>

        {slide.figure && <Figure figure={slide.figure} className="w-full" />}
      </div>
    </SlideShell>
  )
}
