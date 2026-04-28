import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import type { AlignmentStatus } from '../lib/dateUtils'

type LayoutProps = {
  children: ReactNode
  status: AlignmentStatus
  compliantCount: number
  totalWeeks: number
}

export default function Layout({ children, status, compliantCount, totalWeeks }: LayoutProps) {
  return (
    <>
      <Header status={status} compliantCount={compliantCount} totalWeeks={totalWeeks} />
      <main id="main" tabIndex={-1} style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </>
  )
}
