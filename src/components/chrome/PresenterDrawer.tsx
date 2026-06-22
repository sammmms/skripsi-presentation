import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNav } from '@/context/NavContext'
import { useSync } from '@/context/SyncContext'
import { SECTION_BY_ID } from '@/data/sections'
import { RichText } from '@/components/blocks/RichText'
import { Icon } from '@/lib/icon'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function num(n: number): string {
  return String(n).padStart(2, '0')
}

/** Renders presenter notes as light rich text: blank-line-separated paragraphs,
 *  `- ` bullet lists, and inline **bold** / *italic* / `code` via RichText.
 *  Single newlines inside a paragraph are preserved (whitespace-pre-line). */
function NoteBody({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/)
  return (
    <div className="space-y-2.5 text-pretty text-sm leading-relaxed text-ink-soft">
      {blocks.map((block, i) => {
        const lines = block.split('\n')
        const isList = lines.every((l) => /^\s*-\s+/.test(l))
        if (isList) {
          return (
            <ul key={i} className="ml-1 space-y-1">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-2">
                  <span className="select-none text-faint">•</span>
                  <RichText text={l.replace(/^\s*-\s+/, '')} />
                </li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="whitespace-pre-line">
            <RichText text={block} />
          </p>
        )
      })}
    </div>
  )
}

/** Bottom drawer (toggle: `notesOpen`, hotkey 'n') with the current slide's
 *  speaker script and prev/next title previews. Audience never sees it unless
 *  toggled. Does not block slide navigation (keyboard/swipe still work). */
export function PresenterDrawer() {
  const { slides, index, slide, total, notesOpen, toggleNotes } = useNav()
  const { canEditNotes, getNote, setNote, notesStatus } = useSync()
  const reduce = useReducedMotion()
  // Controllers default to the rendered (rich-text) view while presenting and
  // flip to a raw-markdown textarea only when they tap "Edit".
  const [editing, setEditing] = useState(false)

  const section = SECTION_BY_ID[slide.sectionId]
  const note = getNote(slide.id)
  const prev = index > 0 ? slides[index - 1] : null
  const next = index < total - 1 ? slides[index + 1] : null

  // Whenever the slide changes (including a remote-driven move), jump the notes
  // back to the top — otherwise the prior slide's scroll position lingers.
  const scriptRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (scriptRef.current) scriptRef.current.scrollTop = 0
  }, [slide.id])

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
              {canEditNotes && notesStatus !== 'idle' && (
                <span className="font-mono text-[0.6rem] tabular-nums text-faint">
                  {notesStatus === 'saving' ? 'menyimpan…' : 'tersimpan ✓'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {canEditNotes && (
                <button
                  type="button"
                  onClick={() => setEditing((v) => !v)}
                  aria-label={editing ? 'Pratinjau catatan' : 'Edit catatan'}
                  aria-pressed={editing}
                  title={editing ? 'Pratinjau (rich text)' : 'Edit markdown'}
                  className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink"
                >
                  <Icon name={editing ? 'Eye' : 'Pencil'} className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={toggleNotes}
                aria-label="Tutup catatan"
                className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink"
              >
                <Icon name="X" className="size-4" />
              </button>
            </div>
          </div>

          {/* Script — editable live for the controller, read-only mirror for
              everyone else. */}
          <div
            ref={scriptRef}
            className="no-scrollbar max-h-[26dvh] overflow-y-auto px-4 py-3"
          >
            {canEditNotes && editing ? (
              <textarea
                value={note}
                onChange={(e) => setNote(slide.id, e.target.value)}
                placeholder="Tulis catatan presenter untuk slide ini… (mendukung **tebal**, *miring*, `kode`, dan daftar dengan - )"
                spellCheck={false}
                className="no-scrollbar h-[20dvh] min-h-24 w-full resize-none bg-transparent text-pretty text-sm leading-relaxed text-ink-soft outline-none placeholder:text-faint"
              />
            ) : note ? (
              <NoteBody text={note} />
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
