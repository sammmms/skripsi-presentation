import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSync, type Peer } from '@/context/SyncContext'
import { Icon } from '@/lib/icon'

/** Compact session status + control hand-off, rendered in the desktop sidebar
 *  footer (`variant="sidebar"`) and the mobile top bar (`variant="topbar"`).
 *  Hidden entirely when realtime isn't configured. */
export function ControlBar({ variant }: { variant: 'sidebar' | 'topbar' }) {
  const sync = useSync()
  const [open, setOpen] = useState(false)

  if (!sync.enabled) return null

  const { isController, controller, peers, following } = sync

  const status = isController
    ? { label: 'Anda mengontrol', dot: 'bg-good' }
    : !controller
      ? { label: 'Belum ada pengontrol', dot: 'bg-faint' }
      : following
        ? { label: `Mengikuti ${controller.name}`, dot: 'bg-spatial' }
        : { label: 'Menjelajah bebas', dot: 'bg-warn' }

  return (
    <div className="relative">
      {variant === 'sidebar' ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-surface-2/50 px-3 py-2 text-left transition-colors hover:border-border-strong"
        >
          <span className={`size-2 shrink-0 rounded-full ${status.dot}`} aria-hidden />
          <span className="min-w-0 flex-1 truncate text-[0.8rem] font-medium text-ink-soft">
            {status.label}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-faint">
            <Icon name="Users" className="size-3.5" />
            <span className="font-mono text-[0.7rem] tabular-nums">{peers.length}</span>
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Sesi langsung"
          className="relative flex size-11 items-center justify-center rounded-lg text-muted hover:bg-surface-2"
        >
          <Icon name="Radio" className="size-5" />
          <span
            className={`absolute right-2 top-2 size-2 rounded-full ${status.dot} ring-2 ring-surface`}
            aria-hidden
          />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <>
            {/* click-away */}
            <button
              type="button"
              aria-label="Tutup"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: variant === 'sidebar' ? 8 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: variant === 'sidebar' ? 8 : -8 }}
              transition={{ duration: 0.18 }}
              className={`surface-card absolute z-50 w-72 p-3 ${
                variant === 'sidebar'
                  ? 'bottom-full left-0 mb-2'
                  : 'right-0 top-full mt-2'
              }`}
            >
              <SessionPanel sync={sync} onAction={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function SessionPanel({
  sync,
  onAction,
}: {
  sync: ReturnType<typeof useSync>
  onAction: () => void
}) {
  const {
    peers,
    isController,
    controller,
    following,
    outgoingRequest,
    requestControl,
    releaseControl,
    followAgain,
    unfollow,
  } = sync

  return (
    <div>
      <p className="px-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
        Peserta sesi · {peers.length}
      </p>
      <ul className="mt-2 max-h-48 space-y-0.5 overflow-y-auto">
        {peers.length === 0 && (
          <li className="px-1 py-1 text-sm italic text-faint">Menyambungkan…</li>
        )}
        {peers.map((p: Peer) => (
          <li
            key={p.clientId}
            className="flex items-center gap-2 rounded-md px-1 py-1.5 text-sm"
          >
            <span
              className={`size-2 shrink-0 rounded-full ${
                p.role === 'controller' ? 'bg-good' : 'bg-faint'
              }`}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-ink-soft">
              {p.name}
              {p.self && <span className="text-faint"> (Anda)</span>}
            </span>
            {p.role === 'controller' && (
              <span className="shrink-0 rounded bg-good/15 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-good">
                Kontrol
              </span>
            )}
          </li>
        ))}
      </ul>

      {!isController && controller && (
        <div className="mt-2 border-t border-border pt-2">
          <button
            type="button"
            onClick={() => {
              ;(following ? unfollow : followAgain)()
              onAction()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-border-strong hover:text-ink"
          >
            <Icon name={following ? 'Unlink' : 'Link'} className="size-4" />
            {following ? 'Jelajah sendiri' : 'Ikuti presenter'}
          </button>
        </div>
      )}

      <div className="mt-2 border-t border-border pt-2">
        {isController ? (
          <button
            type="button"
            onClick={() => {
              releaseControl()
              onAction()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-bad hover:text-bad"
          >
            <Icon name="LogOut" className="size-4" />
            Lepas kontrol
          </button>
        ) : outgoingRequest ? (
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-faint"
          >
            <Icon name="Loader" className="size-4 animate-spin" />
            Menunggu persetujuan…
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              requestControl()
              onAction()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-spatial px-3 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
          >
            <Icon name="Hand" className="size-4" />
            Minta kontrol
          </button>
        )}
      </div>
    </div>
  )
}

export default ControlBar
