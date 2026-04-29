import { useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Stats from './pages/Stats'
import About from './pages/About'
import { useBadgeInsContext } from './lib/BadgeInsContext'
import { useSettings } from './lib/SettingsContext'
import {
  alignmentRatio,
  buildRollingWeeks,
  startOfDay,
} from './lib/dateUtils'

export default function App() {
  const today = useMemo(() => startOfDay(new Date()), [])
  const { badgeIns } = useBadgeInsContext()
  const { requiredDays, weekendsCount } = useSettings()
  const ratio = useMemo(() => {
    const weeks = buildRollingWeeks(today)
    return alignmentRatio(weeks, badgeIns, requiredDays, weekendsCount)
  }, [today, badgeIns, requiredDays, weekendsCount])

  return (
    <Layout
      status={ratio.status}
      compliantCount={ratio.compliantCount}
      totalWeeks={ratio.total}
    >
      <Routes>
        <Route path="/" element={<Home today={today} />} />
        <Route path="/stats" element={<Stats today={today} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  )
}
