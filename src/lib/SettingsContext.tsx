import { createContext, useContext, useState, type ReactNode } from 'react'

export type RequiredDays = 3 | 4

type SettingsContextValue = {
  requiredDays: RequiredDays
  setRequiredDays: (n: RequiredDays) => void
  weekendsCount: boolean
  setWeekendsCount: (v: boolean) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

const REQUIRED_DAYS_KEY = 'cadence.settings.requiredDays'
const WEEKENDS_COUNT_KEY = 'cadence.settings.weekendsCount'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [requiredDays, setRequiredDaysRaw] = useState<RequiredDays>(() => {
    return localStorage.getItem(REQUIRED_DAYS_KEY) === '4' ? 4 : 3
  })

  const [weekendsCount, setWeekendsCountRaw] = useState<boolean>(() => {
    return localStorage.getItem(WEEKENDS_COUNT_KEY) !== 'false'
  })

  function setRequiredDays(n: RequiredDays) {
    localStorage.setItem(REQUIRED_DAYS_KEY, String(n))
    setRequiredDaysRaw(n)
  }

  function setWeekendsCount(v: boolean) {
    localStorage.setItem(WEEKENDS_COUNT_KEY, String(v))
    setWeekendsCountRaw(v)
  }

  return (
    <SettingsContext.Provider value={{ requiredDays, setRequiredDays, weekendsCount, setWeekendsCount }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
