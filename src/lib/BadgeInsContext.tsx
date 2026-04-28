import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'
import { isoDate } from './dateUtils'

type BadgeInsContextValue = {
  badgeIns: Set<string>
  isBadgedIn: (date: Date) => boolean
  toggle: (date: Date) => void
  set: (dates: Set<string>) => void
  clear: () => void
}

const BadgeInsContext = createContext<BadgeInsContextValue | null>(null)

const STORAGE_KEY = 'cadence.badgeIns.v1'

function loadLocal(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export function BadgeInsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [badgeIns, setBadgeIns] = useState<Set<string>>(loadLocal)

  // Keep a ref to current badgeIns so the user effect can read it without a dependency
  const badgeInsRef = { current: badgeIns }
  badgeInsRef.current = badgeIns

  useEffect(() => {
    if (!user) {
      // Snapshot in-memory state to localStorage before switching to local-only mode.
      // Needed because localStorage is cleared after Supabase sync to prevent stale
      // dates from being re-merged on refresh.
      const snapshot = badgeInsRef.current
      if (snapshot.size > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...snapshot]))
      }
      setBadgeIns(loadLocal())
      return
    }

    async function syncFromSupabase() {
      const { data, error } = await supabase
        .from('badge_ins')
        .select('date')
        .eq('user_id', user!.id)

      if (error) return

      const remote = new Set(data.map((r: { date: string }) => r.date))

      // Merge any local-only dates up to Supabase on first sign-in
      const localOnly = [...loadLocal()].filter((d) => !remote.has(d))
      if (localOnly.length > 0) {
        await supabase
          .from('badge_ins')
          .upsert(localOnly.map((date) => ({ user_id: user!.id, date })))
        localOnly.forEach((d) => remote.add(d))
      }

      setBadgeIns(remote)
      localStorage.removeItem(STORAGE_KEY)
    }

    syncFromSupabase()
  }, [user])

  // Persist to localStorage only when signed out
  useEffect(() => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...badgeIns]))
    }
  }, [badgeIns, user])

  function isBadgedIn(date: Date) {
    return badgeIns.has(isoDate(date))
  }

  function toggle(date: Date) {
    const key = isoDate(date)
    setBadgeIns((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
        if (user) {
          supabase.from('badge_ins').delete().eq('user_id', user.id).eq('date', key).then(() => {})
        }
      } else {
        next.add(key)
        if (user) {
          supabase.from('badge_ins').upsert({ user_id: user.id, date: key }).then(() => {})
        }
      }
      return next
    })
  }

  function set(dates: Set<string>) {
    setBadgeIns(dates)
  }

  function clear() {
    setBadgeIns(new Set())
    if (user) {
      supabase.from('badge_ins').delete().eq('user_id', user.id).then(() => {})
    }
  }

  return (
    <BadgeInsContext.Provider value={{ badgeIns, isBadgedIn, toggle, set, clear }}>
      {children}
    </BadgeInsContext.Provider>
  )
}

export function useBadgeInsContext(): BadgeInsContextValue {
  const ctx = useContext(BadgeInsContext)
  if (!ctx) throw new Error('useBadgeInsContext must be used within BadgeInsProvider')
  return ctx
}
