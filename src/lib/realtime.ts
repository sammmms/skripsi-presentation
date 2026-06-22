import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/* ============================================================================
   Supabase Realtime — the cross-device backbone.

   BroadcastChannel (NavContext) only reaches tabs of the SAME browser. To sync
   the deck across separate devices we route the same events through a Supabase
   Realtime channel: Presence (who's connected), Broadcast (live nav + control
   protocol), and one Postgres table (persistent presenter notes).

   This module is the single place that reads the env vars. When they are
   absent `supabase` is null and the whole realtime layer becomes a no-op — the
   deck runs solo exactly as before (important for local dev + the current
   deploy until keys are added).
   ========================================================================== */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
// New-style publishable key (sb_publishable_…); falls back to the legacy anon
// JWT for older projects. Both are public, client-safe keys.
const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined

/** Singleton client, or null when the deck isn't wired to Supabase. */
export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { realtime: { params: { eventsPerSecond: 20 } } }) : null

/** True when Supabase is configured — gates every realtime feature. */
export const REALTIME_ENABLED = supabase !== null

/** Shared Realtime channel name. All devices join the same room (no room code
 *  per the chosen design — fine for a closed defense). */
export const ROOM = 'deck-room'

/** Postgres table backing the editable presenter notes. */
export const NOTES_TABLE = 'deck_notes'
