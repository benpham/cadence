import { createContext, useContext, useState, type ReactNode } from 'react'

export type RequiredDays = 3 | 4

type SettingsContextValue = {
  requiredDays: RequiredDays
  setRequiredDays: (n: RequiredDays) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

const STORAGE_KEY = 'cadence.settings.requiredDays'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [requiredDays, setRequiredDaysRaw] = useState<RequiredDays>(() => {
    return localStorage.getItem(STORAGE_KEY) === '4' ? 4 : 3
  })

  function setRequiredDays(n: RequiredDays) {
    localStorage.setItem(STORAGE_KEY, String(n))
    setRequiredDaysRaw(n)
  }

  return (
    <SettingsContext.Provider value={{ requiredDays, setRequiredDays }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
