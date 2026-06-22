import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSync } from '@/context/SyncContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Icon } from '@/lib/icon'

/** First-load name prompt. Appears only when realtime is on and the device
 *  hasn't picked a name yet — the name labels this device in the presence list
 *  and on control-hand-off requests. Skippable (defaults to a "Tamu" name). */
export function JoinPrompt() {
  const { needsName, setName, peers } = useSync()
  const reduce = useReducedMotion()
  const [value, setValue] = useState('')

  if (!needsName) return null

  const submit = () => setName(value)
  const skip = () => setName(`Tamu ${peers.length + 1}`)

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="surface-card w-full max-w-sm p-6"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 text-spatial">
            <Icon name="Radio" className="size-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              Sesi Langsung
            </span>
          </div>
          <h2 className="mt-3 font-display text-lg font-semibold text-ink">
            Masukkan nama Anda
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Slide akan otomatis mengikuti presenter. Nama Anda muncul di daftar
            peserta sesi.
          </p>

          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
            placeholder="mis. Budi"
            className="mt-4 w-full rounded-lg border border-border bg-surface-2/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-border-strong"
          />

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={submit}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-spatial px-3 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
            >
              <Icon name="LogIn" className="size-4" />
              Gabung
            </button>
            <button
              type="button"
              onClick={skip}
              className="rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              Lewati
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default JoinPrompt
