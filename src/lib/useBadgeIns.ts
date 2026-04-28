import { useCallback, useEffect, useState } from 'react'
import { isoDate } from './dateUtils'

const STORAGE_KEY = 'cadence.badgeIns.v1'

function readStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return new Set(parsed.filter((v) => typeof v === 'string'))
    return new Set()
  } catch {
    return new Set()
  }
}

function writeStorage(dates: Set<string>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...dates]))
  } catch {
    /* localStorage may be unavailable (private mode, quotas) — fail silently */
  }
}

export type UseBadgeInsResult = {
  badgeIns: Set<string>
  isBadgedIn: (date: Date) => boolean
  toggle: (date: Date) => void
  set: (date: Date, value: boolean) => void
  clear: () => void
}

export function useBadgeIns(): UseBadgeInsResult {
  const [badgeIns, setBadgeIns] = useState<Set<string>>(() => readStorage())

  useEffect(() => {
    writeStorage(badgeIns)
  }, [badgeIns])

  const isBadgedIn = useCallback(
    (date: Date) => badgeIns.has(isoDate(date)),
    [badgeIns],
  )

  const toggle = useCallback((date: Date) => {
    setBadgeIns((prev) => {
      const key = isoDate(date)
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const set = useCallback((date: Date, value: boolean) => {
    setBadgeIns((prev) => {
      const key = isoDate(date)
      const next = new Set(prev)
      if (value) next.add(key)
      else next.delete(key)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setBadgeIns(new Set())
  }, [])

  return { badgeIns, isBadgedIn, toggle, set, clear }
}
