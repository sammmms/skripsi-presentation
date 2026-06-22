import { useEffect } from 'react'

/** Minimal shape of the WakeLock API we use (avoids depending on lib.dom
 *  experimental types, which vary by TS version). */
interface WakeLockSentinelLike {
  release: () => Promise<void>
  addEventListener?: (type: 'release', cb: () => void) => void
}
interface WakeLockLike {
  request: (type: 'screen') => Promise<WakeLockSentinelLike>
}

/**
 * Keep the screen awake while the deck is open — like a video player — so a
 * laptop/phone left idle on a slide doesn't dim or sleep mid-presentation.
 *
 * Uses the Screen Wake Lock API. The OS drops the lock whenever the tab is
 * hidden, so we re-acquire it on `visibilitychange`. No-op on browsers without
 * the API or outside a secure context (it just won't keep the screen on there).
 * Mount once.
 */
export function useWakeLock(): void {
  useEffect(() => {
    const wakeLock = (navigator as unknown as { wakeLock?: WakeLockLike }).wakeLock
    if (!wakeLock) return

    let sentinel: WakeLockSentinelLike | null = null
    let cancelled = false

    const acquire = async () => {
      if (cancelled || document.visibilityState !== 'visible' || sentinel) return
      try {
        const s = await wakeLock.request('screen')
        if (cancelled) {
          void s.release()
          return
        }
        sentinel = s
        // Clear our handle if the system releases the lock on its own.
        s.addEventListener?.('release', () => {
          sentinel = null
        })
      } catch {
        // Denied (e.g. low-power mode) — nothing actionable; leave it.
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void acquire()
    }

    void acquire()
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibility)
      void sentinel?.release()
      sentinel = null
    }
  }, [])
}
