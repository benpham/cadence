import { useEffect } from 'react'
import AlignmentStatusBanner from '../components/AlignmentStatusBanner'
import Calendar from '../components/Calendar'
import { useBadgeInsContext } from '../lib/BadgeInsContext'
import {
  alignmentRatio,
  buildRollingWeeks,
} from '../lib/dateUtils'
import './Home.css'

type HomeProps = {
  today: Date
}

export default function Home({ today }: HomeProps) {
  useEffect(() => {
    document.title = 'Cadence'
  }, [])

  const { badgeIns, isBadgedIn, toggle } = useBadgeInsContext()
  const rollingWeeks = buildRollingWeeks(today)
  const ratio = alignmentRatio(rollingWeeks, badgeIns)

  return (
    <div className="container home">
      <AlignmentStatusBanner
        status={ratio.status}
        compliantCount={ratio.compliantCount}
        totalWeeks={ratio.total}
      />
      <Calendar
        today={today}
        badgeIns={badgeIns}
        isBadgedIn={isBadgedIn}
        toggle={toggle}
      />
    </div>
  )
}
