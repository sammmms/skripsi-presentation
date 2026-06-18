import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Slide } from '@/types/slide'
import { SECTION_BY_ID } from '@/data/sections'
import { SectionBadge } from '@/components/blocks'

/** Shared slide frame: section badge + kicker, accented title with underline
 *  rule, then a vertically-centred, flex-growing content area. Used by most
 *  layouts. Fills the available height; never overflows horizontally. */
export function SlideShell({
  slide,
  children,
  contentClassName = '',
}: {
  slide: Slide
  children: ReactNode
  contentClassName?: string
}) {
  const reduce = useReducedMotion()
  const accent = SECTION_BY_ID[slide.sectionId].accent

  return (
    <div className="flex h-full w-full flex-col overflow-hidden px-5 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10 lg:px-16">
      {/* Header --------------------------------------------------------- */}
      <motion.header
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="shrink-0"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <SectionBadge sectionId={slide.sectionId} />
          {slide.kicker && (
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-faint sm:text-xs">
              {slide.kicker}
            </span>
          )}
        </div>

        <h2 className="mt-3 max-w-[22ch] text-balance font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl md:max-w-[26ch] md:text-4xl">
          {slide.title}
        </h2>

        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 h-1 w-14 origin-left rounded-full sm:w-16"
          style={{ background: accent }}
        />
      </motion.header>

      {/* Content — outer scroller, inner wrapper centres when it fits and
          top-aligns + scrolls when it overflows (avoids justify-center clip). */}
      <div
        data-slide-scroll
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto"
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={`flex min-h-full flex-col justify-center py-4 ${contentClassName}`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
