import { AnimatePresence, motion } from 'framer-motion'
import { useNav } from '@/context/NavContext'
import { SECTION_BY_ID } from '@/data/sections'
import { Icon } from '@/lib/icon'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function num(n: number): string {
  return String(n).padStart(2, '0')
}

/** Bottom drawer (toggle: `notesOpen`, hotkey 'n') with the current slide's
 *  speaker script and prev/next title previews. Audience never sees it unless
 *  toggled. Does not block slide navigation (keyboard/swipe still work). */
export function PresenterDrawer() {
  const { slides, index, slide, total, notesOpen, toggleNotes } = useNav()
  const reduce = useReducedMotion()

  const section = SECTION_BY_ID[slide.sectionId]
  const prev = index > 0 ? slides[index - 1] : null
  const next = index < total - 1 ? slides[index + 1] : null

  return (
    <AnimatePresence>
      {notesOpen && (
        <motion.aside
          // pointer-events handled per-region: the drawer itself is interactive,
          // but it does not cover the whole stage, so nav gestures above it work.
          className="surface-card fixed inset-x-2 bottom-2 z-40 max-h-[44dvh] overflow-hidden rounded-card sm:inset-x-4 lg:left-auto lg:right-4 lg:w-[28rem]"
          initial={reduce ? { opacity: 0 } : { y: '110%', opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: '110%', opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          aria-label="Catatan presenter"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span style={{ color: section.accent }}>
                <Icon name="NotebookPen" className="size-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Catatan Presenter
              </span>
              <span className="font-mono text-[0.65rem] tabular-nums text-faint">
                {num(slide.index)} / {num(total)}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleNotes}
              aria-label="Tutup catatan"
              className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink"
            >
              <Icon name="X" className="size-4" />
            </button>
          </div>

          {/* Script */}
          <div className="no-scrollbar max-h-[26dvh] overflow-y-auto px-4 py-3">
            {slide.notes ? (
              <p className="text-pretty text-sm leading-relaxed text-ink-soft">
                {slide.notes}
              </p>
            ) : (
              <p className="text-sm italic text-faint">
                Tidak ada catatan untuk slide ini.
              </p>
            )}
          </div>

          {/* Prev / next preview */}
          <div className="grid grid-cols-2 gap-px border-t border-border bg-border text-xs">
            <div className="bg-surface px-4 py-2.5">
              <span className="text-[0.6rem] font-medium uppercase tracking-[0.14em] text-faint">
                Sebelumnya
              </span>
              <p className="mt-0.5 line-clamp-1 text-ink-soft">
                {prev ? `${num(prev.index)} · ${prev.title}` : '—'}
              </p>
            </div>
            <div className="bg-surface px-4 py-2.5">
              <span className="text-[0.6rem] font-medium uppercase tracking-[0.14em] text-faint">
                Berikutnya
              </span>
              <p className="mt-0.5 line-clamp-1 text-ink-soft">
                {next ? `${num(next.index)} · ${next.title}` : '—'}
              </p>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

export default PresenterDrawer
