export const COMPLIANT_DAYS_PER_WEEK = 3
export const COMPLIANT_WEEKS_REQUIRED = 8
export const ROLLING_WEEKS = 12
export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
export const DAYS_OF_WEEK_LONG = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
] as const

export type AlignmentStatus = 'aligned' | 'at-risk' | 'off-track'

export type Week = {
  start: Date
  end: Date
  days: Date[]
  label: string
}

export type WeekCompliance = {
  week: Week
  badgeInCount: number
  isCompliant: boolean
}

export function startOfDay(d: Date): Date {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function isoDate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function addDays(d: Date, n: number): Date {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Sunday-aligned start of the week containing `d`. */
export function startOfWeekSunday(d: Date): Date {
  const sod = startOfDay(d)
  const dayOfWeek = sod.getDay()
  return addDays(sod, -dayOfWeek)
}

export function endOfWeekSaturday(d: Date): Date {
  return addDays(startOfWeekSunday(d), 6)
}

export function buildWeek(weekStart: Date): Week {
  const start = startOfWeekSunday(weekStart)
  const end = addDays(start, 6)
  const days: Date[] = []
  for (let i = 0; i < 7; i++) days.push(addDays(start, i))
  return { start, end, days, label: weekRangeLabel(start, end) }
}

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function weekRangeLabel(start: Date, end: Date): string {
  const sameMonth = start.getMonth() === end.getMonth()
  const startLabel = `${MONTH_LABELS[start.getMonth()]} ${start.getDate()}`
  const endLabel = sameMonth
    ? String(end.getDate())
    : `${MONTH_LABELS[end.getMonth()]} ${end.getDate()}`
  return `${startLabel}–${endLabel}`
}

export function monthLabel(d: Date): string {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Build the rolling 12-week window ending with the week containing `today`, oldest first. */
export function buildRollingWeeks(today: Date, weeks = ROLLING_WEEKS): Week[] {
  const result: Week[] = []
  const currentWeekStart = startOfWeekSunday(today)
  for (let i = weeks - 1; i >= 0; i--) {
    result.push(buildWeek(addDays(currentWeekStart, -7 * i)))
  }
  return result
}

/** Build a 6-row month grid (Sun-aligned) for the month containing `cursor`. */
export function buildMonthGrid(cursor: Date): { weeks: Week[]; monthCursor: Date } {
  const monthCursor = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const firstDayOfGrid = startOfWeekSunday(monthCursor)
  const weeks: Week[] = []
  for (let i = 0; i < 6; i++) {
    weeks.push(buildWeek(addDays(firstDayOfGrid, 7 * i)))
  }
  return { weeks, monthCursor }
}

export function weekCompliance(
  week: Week,
  badgeInDates: Set<string>,
  requiredDays = COMPLIANT_DAYS_PER_WEEK,
): WeekCompliance {
  let count = 0
  for (const day of week.days) {
    if (badgeInDates.has(isoDate(day))) count++
  }
  return {
    week,
    badgeInCount: count,
    isCompliant: count >= requiredDays,
  }
}

export function alignmentRatio(
  weeks: Week[],
  badgeInDates: Set<string>,
  requiredDays = COMPLIANT_DAYS_PER_WEEK,
): {
  compliantCount: number
  total: number
  status: AlignmentStatus
} {
  let compliantCount = 0
  for (const week of weeks) {
    if (weekCompliance(week, badgeInDates, requiredDays).isCompliant) compliantCount++
  }
  let status: AlignmentStatus
  if (compliantCount >= COMPLIANT_WEEKS_REQUIRED) status = 'aligned'
  else if (compliantCount >= COMPLIANT_WEEKS_REQUIRED - 2) status = 'at-risk'
  else status = 'off-track'
  return { compliantCount, total: weeks.length, status }
}

export function statusLabel(status: AlignmentStatus): string {
  switch (status) {
    case 'aligned': return 'In Alignment'
    case 'at-risk': return 'At Risk'
    case 'off-track': return 'Out of Alignment'
  }
}

export function statusDescription(status: AlignmentStatus, count: number, total: number): string {
  const remaining = Math.max(0, COMPLIANT_WEEKS_REQUIRED - count)
  switch (status) {
    case 'aligned':
      return `You've hit the threshold with ${count} compliant week${count === 1 ? '' : 's'} out of the last ${total}. Keep it up.`
    case 'at-risk':
      return `${count} of the last ${total} weeks are compliant — ${remaining} more needed to reach In Alignment.`
    case 'off-track':
      return `Only ${count} of the last ${total} weeks are compliant. ${remaining} more weeks above the threshold to get In Alignment.`
  }
}
