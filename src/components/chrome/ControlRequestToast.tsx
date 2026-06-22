import { AnimatePresence, motion } from 'framer-motion'
import { useSync } from '@/context/SyncContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Icon } from '@/lib/icon'

/** Shown to the current controller when another device asks to take control.
 *  Approving hands control over; denying keeps it. */
export function ControlRequestToast() {
  const { pendingRequest, approveRequest, denyRequest } = useSync()
  const reduce = useReducedMotion()

  return (
    <AnimatePresence>
      {pendingRequest && (
        <motion.div
          className="surface-card fixed left-1/2 top-4 z-[55] flex w-[min(92vw,26rem)] -translate-x-1/2 items-center gap-3 p-3 pl-4"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          role="alertdialog"
          aria-label="Permintaan kontrol"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-warn">
            <Icon name="Hand" className="size-4.5" />
          </span>
          <p className="min-w-0 flex-1 text-sm leading-snug text-ink-soft">
            <span className="font-semibold text-ink">{pendingRequest.fromName}</span>{' '}
            minta kontrol presentasi
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={denyRequest}
              aria-label="Tolak"
              className="flex size-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-bad hover:text-bad"
            >
              <Icon name="X" className="size-4" />
            </button>
            <button
              type="button"
              onClick={approveRequest}
              className="flex items-center gap-1.5 rounded-lg bg-good px-3 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
            >
              <Icon name="Check" className="size-4" />
              Setujui
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ControlRequestToast
