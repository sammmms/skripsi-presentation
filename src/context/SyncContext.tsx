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
   Cross-device realtime layer (Supabase), built entirely on BROADCAST.

   Supabase *Presence* proved unreliable on this project (it returns an empty
   state even after track()), so NOTHING here depends on it. Instead:

   - Roster   → each device periodically announces {clientId,name,role,index}
                over a 'roster' broadcast; everyone keeps a local peer map with
                last-seen timestamps and prunes the stale. This is the source of
                the participant list, the controller's slide (follow backstop),
                and late-join controller discovery.
   - Control  → 'control' broadcasts (took/grant/deny/released) are the
                authoritative source of who holds control.
   - Nav      → 'nav' broadcasts (goto/scroll/lightbox) drive live following.
   - Notes    → 'notes' broadcast (instant) + the deck_notes table (persist).

   Follow model: a following follower is LOCKED (NavContext.setNavLock) so its
   own swipes/taps can't break sync; it browses only by tapping "Jelajah
   sendiri" (unfollow) and re-syncs with "Ikuti lagi". No fragile remote-vs-
   manual inference anywhere.
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

interface RosterEntry extends TrackMeta {
  lastSeen: number
}

interface PendingRequest {
  fromId: string
  fromName: string
}

type NotesStatus = 'idle' | 'saving' | 'saved'

const HEARTBEAT_MS = 3000
const PEER_TTL_MS = 10000

export interface SyncState {
  enabled: boolean
  clientId: string
  name: string
  setName: (name: string) => void
  needsName: boolean

  peers: Peer[]
  role: Role
  isController: boolean
  controller: Peer | null

  following: boolean
  followAgain: () => void
  /** Detach from the presenter to browse freely (un-lock). */
  unfollow: () => void

  requestControl: () => void
  releaseControl: () => void
  pendingRequest: PendingRequest | null
  approveRequest: () => void
  denyRequest: () => void
  outgoingRequest: boolean

  notice: string | null
  dismissNotice: () => void

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

  // The present (projector) window stays purely local (BroadcastChannel).
  const enabled = REALTIME_ENABLED && !nav.isPresent

  const [name, setNameState] = useState<string>(() => getStoredName() ?? '')
  const [otherPeers, setOtherPeers] = useState<Peer[]>([])
  const [role, setRole] = useState<Role>('follower')
  const [following, setFollowing] = useState(true)
  const [controllerId, setControllerId] = useState<string | null>(null)
  const [pendingRequest, setPendingRequest] = useState<PendingRequest | null>(null)
  const [outgoingRequest, setOutgoingRequest] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [notesMap, setNotesMap] = useState<Record<string, string>>({})
  const [notesStatus, setNotesStatus] = useState<NotesStatus>('idle')

  // --- Latest-value refs for the once-subscribed channel handlers. ---------
  const channelRef = useRef<RealtimeChannel | null>(null)
  const subscribedRef = useRef(false)
  const roleRef = useRef(role)
  const followingRef = useRef(following)
  const nameRef = useRef(name)
  const navRef = useRef(nav)
  const lastScrollSentRef = useRef(0)
  // Broadcast-based roster: other devices only (self is merged in at render).
  const rosterRef = useRef<Map<string, RosterEntry>>(new Map())

  roleRef.current = role
  followingRef.current = following
  nameRef.current = name
  navRef.current = nav

  const showNotice = useCallback((msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice((cur) => (cur === msg ? null : cur)), 4000)
  }, [])

  const send = useCallback((event: string, payload: Record<string, unknown>) => {
    void channelRef.current?.send({ type: 'broadcast', event, payload })
  }, [])

  /** Re-publish the `otherPeers` state from the roster map. */
  const flushPeers = useCallback(() => {
    setOtherPeers(
      Array.from(rosterRef.current.values()).map((p) => ({
        clientId: p.clientId,
        name: p.name,
        role: p.role,
        index: p.index,
        self: false,
      })),
    )
  }, [])

  /** Announce this device to everyone (roster heartbeat / change ping). */
  const announce = useCallback(() => {
    if (!subscribedRef.current) return
    send('roster', {
      clientId,
      name: nameRef.current || `Tamu ${clientId.slice(0, 3)}`,
      role: roleRef.current,
      index: navRef.current.index,
    } satisfies TrackMeta)
  }, [clientId, send])

  /** Apply a controller-driven slide change. `goRemote` bypasses the follow
   *  lock and never counts as a manual move. */
  const applyRemoteGoto = useCallback((index: number) => {
    navRef.current.goRemote(index)
  }, [])

  // --- Channel lifecycle: subscribe once, drive everything through refs. ---
  useEffect(() => {
    if (!enabled || !supabase) return
    const sb = supabase

    const channel = sb.channel(ROOM, { config: { broadcast: { self: false } } })
    channelRef.current = channel

    channel.on('broadcast', { event: 'roster' }, ({ payload }) => {
      const d = payload as Partial<TrackMeta>
      if (!d.clientId || d.clientId === clientId) return
      const isNew = !rosterRef.current.has(d.clientId)
      rosterRef.current.set(d.clientId, {
        clientId: d.clientId,
        name: d.name || 'Tamu',
        role: d.role || 'follower',
        index: d.index ?? 0,
        lastSeen: Date.now(),
      })
      flushPeers()
      if (isNew) announce() // help the newcomer learn us immediately
    })

    channel.on('broadcast', { event: 'bye' }, ({ payload }) => {
      const d = payload as { clientId?: string }
      if (d.clientId && rosterRef.current.delete(d.clientId)) flushPeers()
    })

    channel.on('broadcast', { event: 'nav' }, ({ payload }) => {
      const d = payload as { type?: string; from?: string; index?: number; payload?: unknown; f?: number }
      // Only a controller emits 'nav' and self-broadcast is off, so any 'nav' a
      // following follower receives is from the controller.
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
          if (d.from) setControllerId(d.from)
          setOutgoingRequest(false)
          break
        case 'grant':
          if (d.to) setControllerId(d.to)
          if (d.to === clientId) {
            setRole('controller')
            setFollowing(false)
            setOutgoingRequest(false)
            roleRef.current = 'controller'
            announce()
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
        announce()
      }
    })

    return () => {
      subscribedRef.current = false
      channelRef.current = null
      void channel.send({ type: 'broadcast', event: 'bye', payload: { clientId } })
      void sb.removeChannel(channel)
    }
  }, [enabled, clientId, applyRemoteGoto, announce, flushPeers, showNotice])

  // --- Roster heartbeat + prune stale peers. -------------------------------
  useEffect(() => {
    if (!enabled) return
    const iv = window.setInterval(() => {
      announce()
      const now = Date.now()
      let changed = false
      for (const [id, p] of rosterRef.current) {
        if (now - p.lastSeen > PEER_TTL_MS) {
          rosterRef.current.delete(id)
          changed = true
        }
      }
      if (changed) flushPeers()
    }, HEARTBEAT_MS)
    return () => window.clearInterval(iv)
  }, [enabled, announce, flushPeers])

  // Best-effort "leaving" so peers drop us promptly.
  useEffect(() => {
    if (!enabled) return
    const bye = () => send('bye', { clientId })
    window.addEventListener('pagehide', bye)
    return () => window.removeEventListener('pagehide', bye)
  }, [enabled, send, clientId])

  // --- Load existing notes once. -------------------------------------------
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

  // --- Stream note edits from the DB on a SEPARATE channel. ----------------
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

  // --- Peer list = self (live) + others (from roster). ---------------------
  const peers = useMemo<Peer[]>(() => {
    const self: Peer = {
      clientId,
      name: name || `Tamu ${clientId.slice(0, 3)}`,
      role,
      index: nav.index,
      self: true,
    }
    const list = [self, ...otherPeers]
    list.sort((a, b) =>
      a.role === b.role ? a.name.localeCompare(b.name) : a.role === 'controller' ? -1 : 1,
    )
    return list
  }, [clientId, name, role, nav.index, otherPeers])

  // --- Controller identity: from 'control' broadcasts; roster is the
  //     late-join fallback. ---------------------------------------------------
  const rosterController = useMemo(
    () => otherPeers.find((p) => p.role === 'controller') ?? null,
    [otherPeers],
  )
  useEffect(() => {
    if (controllerId == null && rosterController) setControllerId(rosterController.clientId)
  }, [controllerId, rosterController])

  const controllerPeer = useMemo(
    () => peers.find((p) => p.clientId === controllerId) ?? null,
    [peers, controllerId],
  )

  // Two-controllers race: higher clientId yields.
  useEffect(() => {
    if (role !== 'controller') return
    const other = otherPeers.find((p) => p.role === 'controller')
    if (other && other.clientId < clientId) {
      setRole('follower')
      setFollowing(true)
      roleRef.current = 'follower'
      setControllerId(other.clientId)
      announce()
    }
  }, [otherPeers, role, clientId, announce])

  // Follow backstop: if a 'nav' goto is ever missed, the controller's roster
  // index still pulls a following follower into sync.
  const controllerIndex =
    controllerPeer && controllerPeer.clientId !== clientId ? controllerPeer.index : null
  useEffect(() => {
    if (!enabled || role !== 'follower' || !following) return
    if (controllerIndex == null) return
    if (controllerIndex !== navRef.current.index) applyRemoteGoto(controllerIndex)
  }, [controllerIndex, following, role, enabled, applyRemoteGoto])

  // --- Broadcast slide changes when controlling; announce on every move. ---
  useEffect(() => {
    if (!enabled) return
    if (role === 'controller') {
      send('nav', { type: 'goto', from: clientId, index: nav.index })
    }
    announce()
  }, [nav.index, enabled, role, clientId, send, announce])

  // Lock self-navigation only while actually glued to a present controller, so
  // accidental swipes/taps can't break sync. Before anyone takes control (no
  // controllerId) the deck stays freely navigable for everyone.
  const lockedToPresenter =
    enabled &&
    role === 'follower' &&
    following &&
    controllerId != null &&
    controllerId !== clientId
  useEffect(() => {
    navRef.current.setNavLock(lockedToPresenter)
  }, [lockedToPresenter])

  // Mirror the lightbox while controlling.
  useEffect(() => {
    if (!enabled || role !== 'controller') return
    send('nav', { type: 'lightbox', from: clientId, payload: nav.lightbox })
  }, [nav.lightbox, enabled, role, clientId, send])

  // Re-announce on name change.
  useEffect(() => {
    if (enabled) announce()
  }, [name, enabled, announce])

  // Broadcast slide scrolling while controlling — coalesced + capped at ~12/s.
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
    const heldByOther = controllerId != null && controllerId !== clientId
    if (!heldByOther) {
      setRole('controller')
      setFollowing(false)
      roleRef.current = 'controller'
      setControllerId(clientId)
      announce()
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
  }, [role, controllerId, clientId, send, announce])

  const releaseControl = useCallback(() => {
    if (role !== 'controller') return
    setRole('follower')
    setFollowing(true)
    roleRef.current = 'follower'
    setControllerId(null)
    announce()
    send('control', { kind: 'released', from: clientId })
  }, [role, clientId, send, announce])

  const approveRequest = useCallback(() => {
    if (!pendingRequest) return
    send('control', { kind: 'grant', from: clientId, to: pendingRequest.fromId })
    setRole('follower')
    setFollowing(true)
    roleRef.current = 'follower'
    setControllerId(pendingRequest.fromId)
    announce()
    setPendingRequest(null)
  }, [pendingRequest, clientId, send, announce])

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

  const unfollow = useCallback(() => {
    setFollowing(false)
    followingRef.current = false
  }, [])

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
      unfollow,
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
      unfollow,
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
