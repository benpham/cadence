import { useEffect } from 'react'
import { useBadgeInsContext } from '../lib/BadgeInsContext'
import {
  COMPLIANT_DAYS_PER_WEEK,
  COMPLIANT_WEEKS_REQUIRED,
  alignmentRatio,
  buildRollingWeeks,
  isSameDay,
  statusLabel,
  weekCompliance,
} from '../lib/dateUtils'
import './Stats.css'

type StatsProps = {
  today: Date
}

export default function Stats({ today }: StatsProps) {
  useEffect(() => {
    document.title = 'Stats — Cadence'
  }, [])

  const { badgeIns } = useBadgeInsContext()
  const weeks = buildRollingWeeks(today)
  const ratio = alignmentRatio(weeks, badgeIns)

  const totalBadgeIns = weeks.reduce(
    (sum, w) => sum + weekCompliance(w, badgeIns).badgeInCount,
    0,
  )
  const avgPerWeek = weeks.length === 0 ? 0 : totalBadgeIns / weeks.length

  return (
    <div className="container stats">
      <header className="stats__header fade-up">
        <p className="stats__eyebrow">Last 12 weeks</p>
        <h1 className="stats__title">Compliance breakdown</h1>
        <p className="stats__lede">
          Each row is one Sunday-to-Saturday week. {COMPLIANT_DAYS_PER_WEEK} or more badge-ins
          marks the week as compliant. {COMPLIANT_WEEKS_REQUIRED} or more compliant weeks puts
          you In Alignment.
        </p>
      </header>

      <div className="stats__cards">
        <div className="card stats__metric fade-up fade-up-delay-1">
          <span className="stats__metric-label">Status</span>
          <span className="stats__metric-value" data-status={ratio.status}>
            {statusLabel(ratio.status)}
          </span>
        </div>
        <div className="card stats__metric fade-up fade-up-delay-2">
          <span className="stats__metric-label">Compliant weeks</span>
          <span className="stats__metric-value">
            {ratio.compliantCount}
            <span className="stats__metric-sep"> / {ratio.total}</span>
          </span>
        </div>
        <div className="card stats__metric fade-up fade-up-delay-3">
          <span className="stats__metric-label">Total badge-ins</span>
          <span className="stats__metric-value">{totalBadgeIns}</span>
        </div>
        <div className="card stats__metric fade-up fade-up-delay-4">
          <span className="stats__metric-label">Avg per week</span>
          <span className="stats__metric-value">{avgPerWeek.toFixed(1)}</span>
        </div>
      </div>

      <section className="card stats__table-card fade-up fade-up-delay-3" aria-labelledby="stats-table-title">
        <h2 id="stats-table-title" className="stats__table-title">Week-by-week</h2>
        <div className="stats__table-wrap">
          <table className="stats__table">
            <thead>
              <tr>
                <th scope="col">Week of</th>
                <th scope="col">Range</th>
                <th scope="col" className="stats__col-num">Badge-ins</th>
                <th scope="col">Compliant</th>
                <th scope="col">Progress</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, idx) => {
                const c = weekCompliance(week, badgeIns)
                const pct = Math.min(100, (c.badgeInCount / COMPLIANT_DAYS_PER_WEEK) * 100)
                const isCurrent = week.days.some((d) => isSameDay(d, today))
                return (
                  <tr key={week.start.toISOString()} className={isCurrent ? 'stats__row--current' : ''}>
                    <td>
                      <span className="stats__week-num">Week {idx + 1}</span>
                      {isCurrent && <span className="stats__current-tag">This week</span>}
                    </td>
                    <td className="stats__range">{week.label}</td>
                    <td className="stats__col-num">
                      <strong>{c.badgeInCount}</strong>
                      <span className="stats__divisor"> / {COMPLIANT_DAYS_PER_WEEK}+</span>
                    </td>
                    <td>
                      <span
                        className="status-pill"
                        data-status={c.isCompliant ? 'aligned' : 'off-track'}
                      >
                        {c.isCompliant ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="stats__progress-cell">
                      <span
                        className="stats__bar"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={COMPLIANT_DAYS_PER_WEEK}
                        aria-valuenow={Math.min(c.badgeInCount, COMPLIANT_DAYS_PER_WEEK)}
                        aria-label={`Week ${idx + 1} progress: ${c.badgeInCount} of ${COMPLIANT_DAYS_PER_WEEK} badge-ins`}
                      >
                        <span
                          className={`stats__bar-fill${c.isCompliant ? ' is-compliant' : ''}`}
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
