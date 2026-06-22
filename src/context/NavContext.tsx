import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { LightboxSpec, NavState, Slide } from '@/types/slide'
import { SLIDES } from '@/data/slides'

const NavCtx = createContext<NavState | null>(null)

/** BroadcastChannel name used to keep the control + present windows in sync. */
const SYNC_CHANNEL = 'deck-sync'

/** True when this document is the dedicated present (projector) window. */
function detectPresent(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('view') === 'present'
}

/** Clamp an integer into the valid slide-index range [0, total-1]. */
function clampIndex(i: number, total: number): number {
  if (Number.isNaN(i)) return 0
  if (i < 0) return 0
  if (i > total - 1) return total - 1
  return i
}

/** Read `#slide-<id>` from the URL and resolve it to a slide index. */
function indexFromHash(slides: Slide[]): number | null {
  const raw = window.location.hash.replace(/^#/, '')
  if (!raw.startsWith('slide-')) return null
  const id = raw.slice('slide-'.length)
  const found = slides.findIndex((s) => s.id === id)
  return found >= 0 ? found : null
}

export function NavProvider({ children }: { children: ReactNode }) {
  const slides = SLIDES
  const total = slides.length

  // Initialise from the URL hash so deep-links / refreshes land on the slide.
  const [index, setIndex] = useState<number>(() => {
    if (typeof window === 'undefined') return 0
    return indexFromHash(slides) ?? 0
  })

  // +1 forward, -1 backward — drives directional transitions.
  const [direction, setDirection] = useState(1)

  const [notesOpen, setNotesOpen] = useState(false)
  const [overviewOpen, setOverviewOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lightbox, setLightbox] = useState<LightboxSpec | null>(null)

  const isPresent = useMemo(detectPresent, [])

  // Cross-window sync (control ↔ present). `remoteIndexRef` marks an index
  // change that arrived over the channel so the broadcast effect doesn't echo
  // it straight back (which would otherwise ping-pong between windows).
  const channelRef = useRef<BroadcastChannel | null>(null)
  const remoteIndexRef = useRef<number | null>(null)
  const presentWinRef = useRef<Window | null>(null)
  // Timestamp until which incoming (remote) scroll is being applied, so the
  // resulting scroll event isn't rebroadcast back.
  const applyingScrollUntilRef = useRef(0)

  const openLightbox = useCallback((spec: LightboxSpec) => {
    setLightbox(spec)
    channelRef.current?.postMessage({ type: 'lightbox', payload: spec })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox(null)
    channelRef.current?.postMessage({ type: 'lightbox', payload: null })
  }, [])

  // When locked (a follower glued to the presenter), user-driven `go` is a
  // no-op so accidental swipes/taps/buttons — trivially easy on a phone —
  // cannot break sync. `goRemote` (sync-driven) always bypasses the lock.
  const navLockRef = useRef(false)
  const setNavLock = useCallback((locked: boolean) => {
    navLockRef.current = locked
  }, [])

  const applyGo = useCallback(
    (i: number) => {
      setIndex((cur) => {
        const target = clampIndex(i, total)
        if (target === cur) return cur
        setDirection(target > cur ? 1 : -1)
        return target
      })
    },
    [total],
  )

  const go = useCallback(
    (i: number) => {
      if (navLockRef.current) return // glued to presenter — ignore self-nav
      applyGo(i)
    },
    [applyGo],
  )

  // Programmatic navigation (sync/remote-driven); always applies, lock or not.
  const goRemote = useCallback((i: number) => applyGo(i), [applyGo])

  const goToId = useCallback(
    (id: string) => {
      const target = slides.findIndex((s) => s.id === id)
      if (target >= 0) go(target)
    },
    [slides, go],
  )

  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  const toggleNotes = useCallback(() => setNotesOpen((v) => !v), [])
  const toggleOverview = useCallback(() => setOverviewOpen((v) => !v), [])
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), [])

  // Open (or re-focus) the clean present window, starting on the current slide.
  const openPresent = useCallback(() => {
    if (typeof window === 'undefined') return
    const id = slides[index]?.id ?? slides[0]?.id ?? ''
    const url = `${window.location.pathname}?view=present#slide-${id}`
    const existing = presentWinRef.current
    if (existing && !existing.closed) {
      existing.focus()
      return
    }
    const win = window.open(url, 'deck-present')
    if (win) {
      presentWinRef.current = win
      win.focus()
    }
  }, [slides, index])

  // Set up the BroadcastChannel once. Incoming index → apply locally (flagged
  // so we don't rebroadcast).
  useEffect(() => {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
      return
    }
    const bc = new BroadcastChannel(SYNC_CHANNEL)
    channelRef.current = bc
    bc.onmessage = (e: MessageEvent) => {
      const data = e.data as {
        type?: string
        index?: number
        payload?: LightboxSpec | null
        f?: number
      } | null
      if (!data) return

      if (data.type === 'goto' && typeof data.index === 'number') {
        remoteIndexRef.current = data.index
        goRemote(data.index)
      } else if (data.type === 'lightbox') {
        setLightbox(data.payload ?? null)
      } else if (data.type === 'scroll' && typeof data.f === 'number') {
        // Mirror the other window's scroll position within the active slide.
        const els = document.querySelectorAll<HTMLElement>('[data-slide-scroll]')
        const sc = els.length ? els[els.length - 1] : null
        if (sc) {
          const max = sc.scrollHeight - sc.clientHeight
          applyingScrollUntilRef.current = performance.now() + 180
          sc.scrollTop = data.f * max
        }
      }
    }
    return () => {
      bc.close()
      channelRef.current = null
    }
  }, [goRemote])

  // Broadcast local slide scrolling so the present (projector) window mirrors
  // it. Scroll events don't bubble → listen in the capture phase. Throttled to
  // one message per animation frame.
  useEffect(() => {
    if (typeof window === 'undefined') return
    let raf = 0
    const onScroll = (e: Event) => {
      const t = e.target
      if (!(t instanceof HTMLElement) || !t.matches('[data-slide-scroll]')) return
      if (performance.now() < applyingScrollUntilRef.current) return
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const max = t.scrollHeight - t.clientHeight
        channelRef.current?.postMessage({
          type: 'scroll',
          f: max > 0 ? t.scrollTop / max : 0,
        })
      })
    }
    window.addEventListener('scroll', onScroll, true)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Broadcast local index changes to the other window. Skip the echo when the
  // change itself came from the channel.
  useEffect(() => {
    if (remoteIndexRef.current === index) {
      remoteIndexRef.current = null
      return
    }
    channelRef.current?.postMessage({ type: 'goto', index })
  }, [index])

  // index → hash (refresh- & share-safe; replaceState avoids scroll + history
  // spam and — crucially — does NOT emit a `hashchange`, so there is no loop
  // with the listener below).
  useEffect(() => {
    const slide = slides[index]
    if (!slide) return
    const nextHash = `#slide-${slide.id}`
    if (window.location.hash === nextHash) return
    history.replaceState(null, '', nextHash)
  }, [index, slides])

  // hash → index (browser back/forward & manual edits). `go` no-ops when the
  // resolved index already matches, so syncing is idempotent.
  useEffect(() => {
    const onHashChange = () => {
      const fromHash = indexFromHash(slides)
      if (fromHash !== null) go(fromHash)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [slides, go])

  const slide = slides[index] ?? slides[0]

  const value = useMemo<NavState>(
    () => ({
      slides,
      index,
      slide,
      total,
      direction,
      go,
      goRemote,
      setNavLock,
      goToId,
      next,
      prev,
      notesOpen,
      toggleNotes,
      overviewOpen,
      toggleOverview,
      sidebarOpen,
      toggleSidebar,
      isPresent,
      openPresent,
      lightbox,
      openLightbox,
      closeLightbox,
    }),
    [
      slides,
      index,
      slide,
      total,
      direction,
      go,
      goRemote,
      setNavLock,
      goToId,
      next,
      prev,
      notesOpen,
      toggleNotes,
      overviewOpen,
      toggleOverview,
      sidebarOpen,
      toggleSidebar,
      isPresent,
      openPresent,
      lightbox,
      openLightbox,
      closeLightbox,
    ],
  )

  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>
}

/** Access navigation state. Throws when used outside <NavProvider>. */
export function useNav(): NavState {
  const ctx = useContext(NavCtx)
  if (!ctx) {
    throw new Error('useNav must be used within <NavProvider>')
  }
  return ctx
}
