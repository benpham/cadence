import { useMemo, useState } from 'react'
import {
  COMPLIANT_DAYS_PER_WEEK,
  DAYS_OF_WEEK,
  DAYS_OF_WEEK_LONG,
  buildMonthGrid,
  buildRollingWeeks,
  isoDate,
  isSameDay,
  monthLabel,
  weekCompliance,
  type Week,
} from '../lib/dateUtils'
import './Calendar.css'

type CalendarMode = 'rolling' | 'month'

type CalendarProps = {
  today: Date
  badgeIns: Set<string>
  isBadgedIn: (date: Date) => boolean
  toggle: (date: Date) => void
}

export default function Calendar({ today, badgeIns, isBadgedIn, toggle }: CalendarProps) {
  const [mode, setMode] = useState<CalendarMode>('rolling')
  const [monthCursor, setMonthCursor] = useState<Date>(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const weeks = useMemo<Week[]>(() => {
    if (mode === 'rolling') return buildRollingWeeks(today)
    return buildMonthGrid(monthCursor).weeks
  }, [mode, today, monthCursor])

  const monthCursorDate = useMemo(
    () => new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1),
    [monthCursor],
  )

  function handlePrevMonth() {
    setMonthCursor(
      new Date(monthCursorDate.getFullYear(), monthCursorDate.getMonth() - 1, 1),
    )
  }
  function handleNextMonth() {
    setMonthCursor(
      new Date(monthCursorDate.getFullYear(), monthCursorDate.getMonth() + 1, 1),
    )
  }
  function handleThisMonth() {
    setMonthCursor(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  return (
    <section className="calendar card fade-up fade-up-delay-2" aria-labelledby="calendar-title">
      <div className="calendar__header">
        <div className="calendar__title-block">
          <h2 id="calendar-title" className="calendar__title">
            {mode === 'rolling' ? 'Rolling 12 Weeks' : monthLabel(monthCursorDate)}
          </h2>
          <p className="calendar__subtitle">
            Click any day to toggle a badge-in. Saved automatically to this browser.
          </p>
        </div>
        <div className="calendar__controls">
          {mode === 'month' && (
            <div className="calendar__month-nav" role="group" aria-label="Month navigation">
              <button
                type="button"
                className="calendar__icon-btn"
                onClick={handlePrevMonth}
                aria-label="Previous month"
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                className="calendar__today-btn"
                onClick={handleThisMonth}
              >
                Today
              </button>
              <button
                type="button"
                className="calendar__icon-btn"
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>
          )}
          <div
            className="calendar__view-toggle"
            role="tablist"
            aria-label="Calendar view"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'rolling'}
              className={`btn btn-ghost calendar__view-btn ${mode === 'rolling' ? 'is-active' : ''}`}
              onClick={() => setMode('rolling')}
            >
              12 weeks
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'month'}
              className={`btn btn-ghost calendar__view-btn ${mode === 'month' ? 'is-active' : ''}`}
              onClick={() => setMode('month')}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      <div className="calendar__grid" role="grid" aria-readonly="false">
        <div className="calendar__row calendar__row--head" role="row">
          <span className="calendar__week-head" role="columnheader">Week</span>
          {DAYS_OF_WEEK.map((dayName, i) => (
            <span
              key={dayName}
              className="calendar__day-head"
              role="columnheader"
              aria-label={DAYS_OF_WEEK_LONG[i]}
            >
              {dayName}
            </span>
          ))}
          <span className="calendar__summary-head" role="columnheader">3-of-3</span>
        </div>

        {weeks.map((week) => {
          const compliance = weekCompliance(week, badgeIns)
          return (
            <div className="calendar__row" key={week.start.toISOString()} role="row">
              <span className="calendar__week-label">{week.label}</span>
              {week.days.map((day) => (
                <DayCell
                  key={isoDate(day)}
                  day={day}
                  today={today}
                  cursorMonth={mode === 'month' ? monthCursorDate.getMonth() : null}
                  badgedIn={isBadgedIn(day)}
                  onToggle={() => toggle(day)}
                />
              ))}
              <WeekSummary count={compliance.badgeInCount} compliant={compliance.isCompliant} />
            </div>
          )
        })}
      </div>

      <div className="calendar__legend" aria-hidden="true">
        <span className="calendar__legend-item">
          <span className="calendar__swatch calendar__swatch--in" />
          Badge-in
        </span>
        <span className="calendar__legend-item">
          <span className="calendar__swatch calendar__swatch--today" />
          Today
        </span>
        <span className="calendar__legend-item">
          <span className="calendar__swatch calendar__swatch--compliant" />
          Compliant week ({COMPLIANT_DAYS_PER_WEEK}+ badge-ins)
        </span>
      </div>
    </section>
  )
}

type DayCellProps = {
  day: Date
  today: Date
  cursorMonth: number | null
  badgedIn: boolean
  onToggle: () => void
}

function DayCell({ day, today, cursorMonth, badgedIn, onToggle }: DayCellProps) {
  const isToday = isSameDay(day, today)
  const isFuture = day.getTime() > today.getTime() && !isToday
  const isOutsideMonth = cursorMonth !== null && day.getMonth() !== cursorMonth
  const labelDate = day.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <button
      type="button"
      className={`day-cell${badgedIn ? ' day-cell--in' : ''}${isToday ? ' day-cell--today' : ''}${isOutsideMonth ? ' day-cell--outside' : ''}${isFuture ? ' day-cell--future' : ''}`}
      onClick={onToggle}
      aria-pressed={badgedIn}
      aria-label={`${labelDate} — ${badgedIn ? 'badged in' : 'not badged in'}. Press to ${badgedIn ? 'unmark' : 'mark'}.`}
    >
      <span className="day-cell__date" aria-hidden="true">
        {day.getDate()}
      </span>
      <span className="day-cell__check" aria-hidden="true">
        {badgedIn ? '✓' : ''}
      </span>
    </button>
  )
}

type WeekSummaryProps = {
  count: number
  compliant: boolean
}

function WeekSummary({ count, compliant }: WeekSummaryProps) {
  const filled = Math.min(count, COMPLIANT_DAYS_PER_WEEK)
  const overflow = Math.max(0, count - COMPLIANT_DAYS_PER_WEEK)
  return (
    <div
      className={`week-summary${compliant ? ' week-summary--compliant' : ''}`}
      aria-label={`${count} badge-ins this week — ${compliant ? 'compliant' : 'not compliant'}`}
    >
      <span className="week-summary__pips" aria-hidden="true">
        {Array.from({ length: COMPLIANT_DAYS_PER_WEEK }).map((_, i) => (
          <span
            key={i}
            className={`week-summary__pip${i < filled ? ' is-on' : ''}`}
          />
        ))}
      </span>
      <span className="week-summary__count" aria-hidden="true">
        {count}
        {overflow > 0 ? '' : ''}
      </span>
    </div>
  )
}
