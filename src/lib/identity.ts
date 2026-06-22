/* ============================================================================
   Per-participant identity for the realtime session.

   `clientId`  — stable for the life of a TAB (sessionStorage): a reload keeps
                 the same participant, but a second tab is a distinct peer.
   `displayName` — persisted per DEVICE (localStorage) so the join prompt only
                 appears once; shown in the presence list + control requests.
   ========================================================================== */

const CLIENT_ID_KEY = 'deck-client-id'
const NAME_KEY = 'deck-display-name'

/** A short random id without relying on Math.random/crypto availability quirks. */
function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().slice(0, 8)
  }
  return Math.random().toString(36).slice(2, 10)
}

/** Stable id for this tab. Generated once, reused across reloads of the tab. */
export function getClientId(): string {
  if (typeof window === 'undefined') return 'ssr'
  let id = sessionStorage.getItem(CLIENT_ID_KEY)
  if (!id) {
    id = randomId()
    sessionStorage.setItem(CLIENT_ID_KEY, id)
  }
  return id
}

/** The saved display name, or null if the user hasn't chosen one yet. */
export function getStoredName(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(NAME_KEY)
}

/** Persist the chosen display name. */
export function storeName(name: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(NAME_KEY, name)
}
