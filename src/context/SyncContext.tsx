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
import type { RealtimeChannel } from '@supabase/supabase-js'
import { NOTES_TABLE, REALTIME_ENABLED, ROOM, supabase } from '@/lib/realtime'
import { getClientId, getStoredName, storeName } from '@/lib/identity'
import { useNav } from '@/context/NavContext'
import { SLIDES } from '@/data/slides'

/* ============================================================================
   Cross-device realtime layer (Supabase) layered on top of NavContext.

   - Presence  → the list of joined devices (name + role + current slide).
   - Broadcast → live nav events ('nav') + the control hand-off protocol
     ('control') + instant note keystrokes ('notes').
   - Postgres  → the `deck_notes` table persists notes + streams changes so late
     joiners and reloads see the latest text.

   Followers auto-apply the controller's slide/scroll/lightbox while `following`.
   Navigating manually detaches them (following=false) until they tap "Ikuti
   lagi". When Supabase isn't configured (or in the local present window) the
   whole layer is inert and the deck behaves exactly as before.
   ========================================================================== */

type Role = 'controller' | 'follower'

interface TrackMeta {
  clientId: string
  name: string
  role: Role
  index: number
}

export interface Peer extends TrackMeta {
  /** True for this device's own entry. */
  self: boolean
}

interface PendingRequest {
  fromId: string
  fromName: string
}

type NotesStatus = 'idle' | 'saving' | 'saved'

export interface SyncState {
  enabled: boolean
  clientId: string
  /** This device's display name. */
  name: string
  setName: (name: string) => void
  /** Realtime is on but the user hasn't chosen a name yet → show the prompt. */
  needsName: boolean

  peers: Peer[]
  role: Role
  isController: boolean
  /** The peer currently holding control (may be this device). */
  controller: Peer | null

  following: boolean
  followAgain: () => void

  requestControl: () => void
  releaseControl: () => void
  /** Incoming hand-off request shown to the current controller. */
  pendingRequest: PendingRequest | null
  approveRequest: () => void
  denyRequest: () => void
  /** True while this device waits for its own control request to be answered. */
  outgoingRequest: boolean

  notice: string | null
  dismissNotice: () => void

  /** Effective note text for a slide (live override → baked default). */
  getNote: (slideId: string) => string
  setNote: (slideId: string, content: string) => void
  canEditNotes: boolean
  notesStatus: NotesStatus
}

/** Baked-in speaker scripts — the seed/default until a slide's note is edited. */
const BAKED_NOTES: Record<string, string> = Object.fromEntries(
  SLIDES.map((s) => [s.id, s.notes ?? '']),
)

const SyncCtx = createContext<SyncState | null>(null)

export function SyncProvider({ children }: { children: ReactNode }) {
  const nav = useNav()
  const clientId = useMemo(getClientId, [])

  // The present (projector) window stays purely local (BroadcastChannel) — it
  // must not join the room as a ghost peer.
  const enabled = REALTIME_ENABLED && !nav.isPresent

  const [name, setNameState] = useState<string>(() => getStoredName() ?? '')
  const [peers, setPeers] = useState<Peer[]>([])
  const [role, setRole] = useState<Role>('follower')
  const [following, setFollowing] = useState(true)
  // Who currently holds control, learned from the (reliable) 'control'
  // broadcasts — NOT from presence, which is coalesced and can briefly drop a
  // peer. Used for display + the follow backstop; the live follow path doesn't
  // depend on it at all.
  const [controllerId, setControllerId] = useState<string | null>(null)
  const [pendingRequest, setPendingRequest] = useState<PendingRequest | null>(null)
  const [outgoingRequest, setOutgoingRequest] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [notesMap, setNotesMap] = useState<Record<string, string>>({})
  const [notesStatus, setNotesStatus] = useState<NotesStatus>('idle')

  // --- Latest-value refs so the once-subscribed channel handlers never read
  //     stale closures. ---------------------------------------------------
  const channelRef = useRef<RealtimeChannel | null>(null)
  const subscribedRef = useRef(false)
  const roleRef = useRef(role)
  const followingRef = useRef(following)
  const nameRef = useRef(name)
  const navRef = useRef(nav)
  // Throttle controller scroll broadcasts so they never trip the realtime rate
  // limit (which would silently drop subsequent slide changes too).
  const lastScrollSentRef = useRef(0)

  roleRef.current = role
  followingRef.current = following
  nameRef.current = name
  navRef.current = nav

  const showNotice = useCallback((msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice((cur) => (cur === msg ? null : cur)), 4000)
  }, [])

  /** Push this device's current state into Presence. */
  const trackPresence = useCallback(() => {
    const ch = channelRef.current
    if (!ch || !subscribedRef.current) return
    void ch.track({
      clientId,
      name: nameRef.current || `Tamu ${clientId.slice(0, 3)}`,
      role: roleRef.current,
      index: navRef.current.index,
    } satisfies TrackMeta)
  }, [clientId])

  /** Fire-and-forget broadcast helper. */
  const send = useCallback((event: string, payload: Record<string, unknown>) => {
    void channelRef.current?.send({ type: 'broadcast', event, payload })
  }, [])

  /** Apply a controller-driven slide change. `goRemote` tags it as programmatic
   *  so the detach logic never mistakes it for a manual move. */
  const applyRemoteGoto = useCallback((index: number) => {
    navRef.current.goRemote(index)
  }, [])

  // --- Channel lifecycle: subscribe once, drive everything through refs. ---
  useEffect(() => {
    if (!enabled || !supabase) return
    const sb = supabase

    const channel = sb.channel(ROOM, {
      config: { presence: { key: clientId }, broadcast: { self: false } },
    })
    channelRef.current = channel

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState<TrackMeta>()
      const list: Peer[] = []
      for (const key of Object.keys(state)) {
        const metas = state[key]
        const m = metas[metas.length - 1]
        if (m) list.push({ ...m, self: m.clientId === clientId })
      }
      // Controller first, then by name, for a stable list.
      list.sort((a, b) =>
        a.role === b.role ? a.name.localeCompare(b.name) : a.role === 'controller' ? -1 : 1,
      )
      setPeers(list)
    })

    channel.on('broadcast', { event: 'nav' }, ({ payload }) => {
      const d = payload as { type?: string; from?: string; index?: number; payload?: unknown; f?: number }
      // Only a controller emits 'nav', and self-broadcasts are off — so any
      // 'nav' a following follower receives is from the controller. We do NOT
      // gate on a presence-derived controller id: presence is coalesced and can
      // briefly drop the controller's entry, which used to make followers
      // silently reject every update while still believing they were following.
      if (roleRef.current === 'controller' || !followingRef.current) return
      if (!d.from || d.from === clientId) return

      if (d.type === 'goto' && typeof d.index === 'number') {
        applyRemoteGoto(d.index)
      } else if (d.type === 'lightbox') {
        const spec = d.payload as { src: string; alt: string; caption?: string } | null
        if (spec) navRef.current.openLightbox(spec)
        else navRef.current.closeLightbox()
      } else if (d.type === 'scroll' && typeof d.f === 'number') {
        const els = document.querySelectorAll<HTMLElement>('[data-slide-scroll]')
        const sc = els.length ? els[els.length - 1] : null
        if (sc) sc.scrollTop = d.f * (sc.scrollHeight - sc.clientHeight)
      }
    })

    channel.on('broadcast', { event: 'control' }, ({ payload }) => {
      const d = payload as { kind?: string; from?: string; fromName?: string; to?: string }
      switch (d.kind) {
        case 'request':
          if (d.to === clientId && roleRef.current === 'controller') {
            setPendingRequest({ fromId: d.from ?? '', fromName: d.fromName || 'Seseorang' })
          }
          break
        case 'took':
          // Someone grabbed free control — everyone records the new controller.
          if (d.from) setControllerId(d.from)
          setOutgoingRequest(false)
          break
        case 'grant':
          // Control handed to d.to — everyone records it; the grantee promotes.
          if (d.to) setControllerId(d.to)
          if (d.to === clientId) {
            setRole('controller')
            setFollowing(false)
            setOutgoingRequest(false)
            roleRef.current = 'controller'
            trackPresence()
            showNotice('Kontrol diberikan kepada Anda')
          }
          break
        case 'deny':
          if (d.to === clientId) {
            setOutgoingRequest(false)
            showNotice('Permintaan kontrol ditolak')
          }
          break
        case 'released':
          // Controller stepped down — clear if it was them.
          setControllerId((cur) => (cur === d.from ? null : cur))
          setOutgoingRequest(false)
          break
        default:
          break
      }
    })

    channel.on('broadcast', { event: 'notes' }, ({ payload }) => {
      const d = payload as { slideId?: string; content?: string }
      if (d.slideId != null && typeof d.content === 'string') {
        setNotesMap((m) => ({ ...m, [d.slideId as string]: d.content as string }))
      }
    })

    void channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        subscribedRef.current = true
        trackPresence()
      }
    })

    return () => {
      subscribedRef.current = false
      channelRef.current = null
      void sb.removeChannel(channel)
    }
  }, [enabled, clientId, applyRemoteGoto, trackPresence, showNotice])

  // --- Load existing notes once (independent of channel subscribe). --------
  useEffect(() => {
    if (!enabled || !supabase) return
    let cancelled = false
    void supabase
      .from(NOTES_TABLE)
      .select('slide_id, content')
      .then(({ data }) => {
        if (cancelled || !data) return
        const map: Record<string, string> = {}
        for (const row of data as Array<{ slide_id: string; content: string }>) {
          map[row.slide_id] = row.content
        }
        setNotesMap(map)
      })
    return () => {
      cancelled = true
    }
  }, [enabled])

  // --- Stream note edits from the DB on a SEPARATE channel, so a missing
  //     `deck_notes` table can't take down presence/control with it. --------
  useEffect(() => {
    if (!enabled || !supabase) return
    const sb = supabase
    const ch = sb
      .channel('deck-notes-db')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: NOTES_TABLE },
        (payload) => {
          const row = payload.new as { slide_id?: string; content?: string } | null
          if (row?.slide_id != null && typeof row.content === 'string') {
            setNotesMap((m) => ({ ...m, [row.slide_id as string]: row.content as string }))
          }
        },
      )
      .subscribe()
    return () => {
      void sb.removeChannel(ch)
    }
  }, [enabled])

  // --- Controller identity. Authoritative source = the 'control' broadcasts
  //     above; presence is only a late-join fallback. -----------------------
  const presenceController = useMemo(
    () => peers.find((p) => p.role === 'controller') ?? null,
    [peers],
  )

  // Late join / recovery: if we don't yet know the controller but presence
  // reveals one, adopt it (for display + the follow backstop).
  useEffect(() => {
    if (controllerId == null && presenceController) setControllerId(presenceController.clientId)
  }, [controllerId, presenceController])

  // The controller as a present peer (for name display + its current slide).
  const controllerPeer = useMemo(
    () => peers.find((p) => p.clientId === controllerId) ?? null,
    [peers, controllerId],
  )

  // Resolve the "two devices grabbed free control at once" race: higher id yields.
  useEffect(() => {
    if (role !== 'controller') return
    const other = peers.find((p) => p.role === 'controller' && p.clientId !== clientId)
    if (other && other.clientId < clientId) {
      setRole('follower')
      setFollowing(true)
      roleRef.current = 'follower'
      setControllerId(other.clientId)
      trackPresence()
    }
  }, [peers, role, clientId, trackPresence])

  // The controller's current slide (from presence), for the follow backstop.
  const controllerIndex =
    controllerPeer && controllerPeer.clientId !== clientId ? controllerPeer.index : null

  // Follow backstop: if a 'nav' broadcast is ever missed, the controller's
  // presence index still pulls a following follower into sync. Keyed on
  // controllerIndex — NOT nav.index — so it never fights manual browsing, and it
  // also fires when `following` flips back to true (e.g. "Ikuti lagi").
  useEffect(() => {
    if (!enabled || role !== 'follower' || !following) return
    if (controllerIndex == null) return
    if (controllerIndex !== navRef.current.index) applyRemoteGoto(controllerIndex)
  }, [controllerIndex, following, role, enabled, applyRemoteGoto])

  // --- Broadcast local slide changes when controlling; keep presence index
  //     current; detach a following follower that navigates MANUALLY. The
  //     remote-vs-manual test is deterministic: a change to the exact index we
  //     asked for is remote; anything else is the user moving. -------
  useEffect(() => {
    if (!enabled) return
    if (role === 'controller') {
      send('nav', { type: 'goto', from: clientId, index: nav.index })
    } else if (following && role === 'follower' && !navRef.current.isLastNavRemote()) {
      setFollowing(false) // a genuine user gesture moved us → detach
    }
    trackPresence()
  }, [nav.index, enabled, role, following, clientId, send, trackPresence])

  // Mirror the lightbox while controlling.
  useEffect(() => {
    if (!enabled || role !== 'controller') return
    send('nav', { type: 'lightbox', from: clientId, payload: nav.lightbox })
  }, [nav.lightbox, enabled, role, clientId, send])

  // Re-advertise on name change.
  useEffect(() => {
    if (enabled) trackPresence()
  }, [name, enabled, trackPresence])

  // Broadcast slide scrolling while controlling — coalesced to a frame AND
  // capped at ~12/s so it can never trip the realtime rate limit.
  useEffect(() => {
    if (!enabled) return
    let raf = 0
    const onScroll = (e: Event) => {
      if (roleRef.current !== 'controller') return
      const t = e.target
      if (!(t instanceof HTMLElement) || !t.matches('[data-slide-scroll]')) return
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const now = performance.now()
        if (now - lastScrollSentRef.current < 80) return
        lastScrollSentRef.current = now
        const max = t.scrollHeight - t.clientHeight
        send('nav', { type: 'scroll', from: clientId, f: max > 0 ? t.scrollTop / max : 0 })
      })
    }
    window.addEventListener('scroll', onScroll, true)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [enabled, clientId, send])

  // --- Actions -------------------------------------------------------------
  const setName = useCallback(
    (next: string) => {
      const trimmed = next.trim() || `Tamu ${clientId.slice(0, 3)}`
      storeName(trimmed)
      setNameState(trimmed)
    },
    [clientId],
  )

  const requestControl = useCallback(() => {
    if (role === 'controller') return
    // Free (or unknown / stale) → take it; otherwise ask the current holder.
    const heldByOther = controllerId != null && controllerId !== clientId
    if (!heldByOther) {
      setRole('controller')
      setFollowing(false)
      roleRef.current = 'controller'
      setControllerId(clientId)
      trackPresence()
      send('control', { kind: 'took', from: clientId })
    } else {
      send('control', {
        kind: 'request',
        from: clientId,
        fromName: nameRef.current || `Tamu ${clientId.slice(0, 3)}`,
        to: controllerId,
      })
      setOutgoingRequest(true)
    }
  }, [role, controllerId, clientId, send, trackPresence])

  const releaseControl = useCallback(() => {
    if (role !== 'controller') return
    setRole('follower')
    setFollowing(true)
    roleRef.current = 'follower'
    setControllerId(null)
    trackPresence()
    send('control', { kind: 'released', from: clientId })
  }, [role, clientId, send, trackPresence])

  const approveRequest = useCallback(() => {
    if (!pendingRequest) return
    send('control', { kind: 'grant', from: clientId, to: pendingRequest.fromId })
    setRole('follower')
    setFollowing(true)
    roleRef.current = 'follower'
    setControllerId(pendingRequest.fromId)
    trackPresence()
    setPendingRequest(null)
  }, [pendingRequest, clientId, send, trackPresence])

  const denyRequest = useCallback(() => {
    if (!pendingRequest) return
    send('control', { kind: 'deny', from: clientId, to: pendingRequest.fromId })
    setPendingRequest(null)
  }, [pendingRequest, clientId, send])

  const followAgain = useCallback(() => {
    setFollowing(true)
    followingRef.current = true
    if (controllerPeer) applyRemoteGoto(controllerPeer.index)
  }, [controllerPeer, applyRemoteGoto])

  // --- Notes ---------------------------------------------------------------
  const getNote = useCallback(
    (slideId: string) => notesMap[slideId] ?? BAKED_NOTES[slideId] ?? '',
    [notesMap],
  )

  const saveTimer = useRef<number | undefined>(undefined)
  const pendingSave = useRef<{ id: string; content: string } | null>(null)

  const canEditNotes = enabled && role === 'controller'

  const setNote = useCallback(
    (slideId: string, content: string) => {
      if (roleRef.current !== 'controller' || !supabase) return
      const sb = supabase
      setNotesMap((m) => ({ ...m, [slideId]: content }))
      send('notes', { slideId, content, from: clientId })
      pendingSave.current = { id: slideId, content }
      setNotesStatus('saving')
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => {
        const p = pendingSave.current
        if (!p) return
        void sb
          .from(NOTES_TABLE)
          .upsert({ slide_id: p.id, content: p.content })
          .then(({ error }) => setNotesStatus(error ? 'idle' : 'saved'))
      }, 500)
    },
    [clientId, send],
  )

  const controller = useMemo<Peer | null>(() => {
    if (role === 'controller') return peers.find((p) => p.self) ?? controllerPeer
    return controllerPeer
  }, [role, peers, controllerPeer])

  const value = useMemo<SyncState>(
    () => ({
      enabled,
      clientId,
      name,
      setName,
      needsName: enabled && name === '',
      peers,
      role,
      isController: role === 'controller',
      controller,
      following,
      followAgain,
      requestControl,
      releaseControl,
      pendingRequest,
      approveRequest,
      denyRequest,
      outgoingRequest,
      notice,
      dismissNotice: () => setNotice(null),
      getNote,
      setNote,
      canEditNotes,
      notesStatus,
    }),
    [
      enabled,
      clientId,
      name,
      setName,
      peers,
      role,
      controller,
      following,
      followAgain,
      requestControl,
      releaseControl,
      pendingRequest,
      approveRequest,
      denyRequest,
      outgoingRequest,
      notice,
      getNote,
      setNote,
      canEditNotes,
      notesStatus,
    ],
  )

  return <SyncCtx.Provider value={value}>{children}</SyncCtx.Provider>
}

/** Access realtime sync state. Throws when used outside <SyncProvider>. */
export function useSync(): SyncState {
  const ctx = useContext(SyncCtx)
  if (!ctx) throw new Error('useSync must be used within <SyncProvider>')
  return ctx
}
