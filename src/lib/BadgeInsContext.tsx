import { createContext, useContext, type ReactNode } from 'react'
import { useBadgeIns, type UseBadgeInsResult } from './useBadgeIns'

const BadgeInsContext = createContext<UseBadgeInsResult | null>(null)

export function BadgeInsProvider({ children }: { children: ReactNode }) {
  const value = useBadgeIns()
  return <BadgeInsContext.Provider value={value}>{children}</BadgeInsContext.Provider>
}

export function useBadgeInsContext(): UseBadgeInsResult {
  const ctx = useContext(BadgeInsContext)
  if (!ctx) {
    throw new Error('useBadgeInsContext must be used within BadgeInsProvider')
  }
  return ctx
}
