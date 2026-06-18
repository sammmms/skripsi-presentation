import { motion, useReducedMotion } from 'framer-motion'
import type { OutlineSlide } from '@/types/slide'
import { SECTION_BY_ID } from '@/data/sections'
import { Icon } from '@/lib/icon'
import { SlideShell } from './SlideShell'

/** Numbered grid of section cards, each tinted with its section accent. */
export function OutlineLayout({ slide }: { slide: OutlineSlide }) {
  const reduce = useReducedMotion()

  return (
    <SlideShell slide={slide}>
      <ul className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {slide.items.map((item, i) => {
          const section = SECTION_BY_ID[item.sectionId]
          return (
            <motion.li
              key={`${item.sectionId}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              className="surface-card group flex items-center gap-4 p-4 sm:p-5"
              style={{ borderColor: `color-mix(in srgb, ${section.accent} 28%, var(--color-border))` }}
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold sm:size-12"
                style={{
                  color: section.accent,
                  background: `color-mix(in srgb, ${section.accent} 14%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${section.accent} 35%, transparent)`,
                }}
              >
                {section.no}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Icon
                    name={section.icon}
                    className="size-4 shrink-0"
                    style={{ color: section.accent }}
                  />
                  <p className="truncate font-display text-base font-semibold text-ink sm:text-lg">
                    {item.label}
                  </p>
                </div>
                {item.hint && (
                  <p className="mt-0.5 truncate text-xs text-muted sm:text-sm">{item.hint}</p>
                )}
              </div>
            </motion.li>
          )
        })}
      </ul>
    </SlideShell>
  )
}
