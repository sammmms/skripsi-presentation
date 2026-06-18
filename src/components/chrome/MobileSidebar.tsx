import { AnimatePresence, motion } from 'framer-motion'
import { useNav } from '@/context/NavContext'
import { SECTIONS, SECTION_BY_ID } from '@/data/sections'
import { Icon } from '@/lib/icon'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { Slide } from '@/types/slide'

function num(n: number): string {
  return String(n).padStart(2, '0')
}

/** Slide-in left drawer mirroring the desktop Sidebar, shown when
 *  `sidebarOpen`. Closes on backdrop tap, selection, or Escape (handled by the
 *  keyboard hook). */
export function MobileSidebar() {
  const { slides, index, go, slide: current, total, sidebarOpen, toggleSidebar } =
    useNav()
  const reduce = useReducedMotion()

  const pct = total > 1 ? ((index + 1) / total) * 100 : 100

  const groups = SECTIONS.map((section) => ({
    section,
    items: slides.filter((s) => s.sectionId === section.id),
  })).filter((g) => g.items.length > 0)

  function select(s: Slide) {
    go(s.index - 1)
    toggleSidebar()
  }

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Tutup menu"
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={toggleSidebar}
          />

          {/* Drawer */}
          <motion.aside
            className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col border-r border-border bg-surface shadow-card"
            initial={reduce ? { opacity: 0 } : { x: '-100%' }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '-100%' }}
            transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <div className="flex shrink-0 items-start justify-between border-b border-border px-5 pb-4 pt-5">
              <div>
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-faint">
                  Sidang Skripsi
                </p>
                <h2 className="mt-1.5 font-display text-sm font-semibold leading-snug text-ink">
                  Deteksi Deepfake Hybrid
                </h2>
              </div>
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Tutup menu"
                className="-mr-1 flex size-11 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink"
              >
                <Icon name="X" className="size-5" />
              </button>
            </div>

            <div className="shrink-0 px-5 pb-3 pt-3">
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: SECTION_BY_ID[current.sectionId].accent,
                    }}
                  />
                </div>
                <span className="font-mono text-[0.65rem] tabular-nums text-faint">
                  {num(index + 1)}/{num(total)}
                </span>
              </div>
            </div>

            <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-[env(safe-area-inset-bottom)] pt-1">
              {groups.map(({ section, items }) => (
                <div key={section.id} className="mb-5 last:mb-2">
                  <div className="mb-1.5 flex items-center gap-2 px-2">
                    <span
                      className="flex size-5 items-center justify-center rounded-md"
                      style={{
                        background: `color-mix(in srgb, ${section.accent} 16%, transparent)`,
                        color: section.accent,
                      }}
                    >
                      <Icon name={section.icon} className="size-3.5" />
                    </span>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                      {section.label}
                    </span>
                  </div>

                  <ul className="space-y-0.5">
                    {items.map((s) => {
                      const active = s.index === current.index
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => select(s)}
                            aria-current={active ? 'true' : undefined}
                            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface-2/70"
                            style={
                              active
                                ? {
                                    background: `color-mix(in srgb, ${section.accent} 14%, transparent)`,
                                  }
                                : undefined
                            }
                          >
                            <span
                              className="font-mono text-[0.7rem] tabular-nums"
                              style={{
                                color: active
                                  ? section.accent
                                  : 'var(--color-faint)',
                              }}
                            >
                              {num(s.index)}
                            </span>
                            <span
                              className="line-clamp-2 flex-1 text-[0.82rem] leading-snug"
                              style={{
                                color: active
                                  ? 'var(--color-ink)'
                                  : 'var(--color-ink-soft)',
                              }}
                            >
                              {s.title}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}

export default MobileSidebar
