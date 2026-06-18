import { AnimatePresence, motion } from 'framer-motion'
import { useNav } from '@/context/NavContext'
import { SECTION_BY_ID } from '@/data/sections'
import { Icon } from '@/lib/icon'
import { LAYOUT_LABELS } from '@/data/slidesConfig'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Slide } from '@/types/slide'

function num(n: number): string {
  return String(n).padStart(2, '0')
}

/** Full-screen modal grid of every slide as a tappable thumbnail card.
 *  Tap → jump & close. Shown when `overviewOpen`. Escape/backdrop close. */
export function OverviewGrid() {
  const { slides, slide: current, go, overviewOpen, toggleOverview } = useNav()
  const reduce = useReducedMotion()

  function select(s: Slide) {
    go(s.index - 1)
    toggleOverview()
  }

  return (
    <AnimatePresence>
      {overviewOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-bg/92 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          onClick={toggleOverview}
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between px-5 py-4 sm:px-8">
            <div>
              <p className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-faint">
                Ikhtisar
              </p>
              <h2 className="font-display text-lg font-semibold text-ink">
                Semua Slide
              </h2>
            </div>
            <button
              type="button"
              onClick={toggleOverview}
              aria-label="Tutup ikhtisar"
              className="flex size-11 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink"
            >
              <Icon name="X" className="size-5" />
            </button>
          </div>

          {/* Grid — stop propagation so taps inside don't close via backdrop */}
          <div
            className="no-scrollbar flex-1 overflow-y-auto px-4 pb-8 sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {slides.map((s) => {
                const section = SECTION_BY_ID[s.sectionId]
                const active = s.index === current.index
                return (
                  <motion.button
                    key={s.id}
                    type="button"
                    onClick={() => select(s)}
                    aria-current={active ? 'true' : undefined}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduce ? 0 : 0.25,
                      delay: reduce ? 0 : Math.min(s.index * 0.012, 0.25),
                    }}
                    whileHover={reduce ? undefined : { y: -3 }}
                    className="surface-card group relative flex aspect-[4/3] flex-col justify-between p-3 text-left transition-shadow"
                    style={{
                      borderColor: active ? section.accent : undefined,
                      boxShadow: active
                        ? `0 0 0 1px ${section.accent}, var(--shadow-card)`
                        : undefined,
                    }}
                  >
                    {/* top: number + layout tag */}
                    <div className="flex items-center justify-between">
                      <span
                        className="font-mono text-xs font-semibold tabular-nums"
                        style={{ color: section.accent }}
                      >
                        {num(s.index)}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide"
                        style={{
                          background: `color-mix(in srgb, ${section.accent} 14%, transparent)`,
                          color: section.accent,
                        }}
                      >
                        {LAYOUT_LABELS[s.layout]}
                      </span>
                    </div>

                    {/* title */}
                    <p className="line-clamp-3 text-pretty text-sm font-medium leading-snug text-ink-soft group-hover:text-ink">
                      {s.title}
                    </p>

                    {/* bottom accent rule */}
                    <span
                      className="h-0.5 w-8 rounded-full"
                      style={{ background: section.accent }}
                      aria-hidden
                    />
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default OverviewGrid
