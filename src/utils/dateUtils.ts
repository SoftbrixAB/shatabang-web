export const CALENDAR_BLOCK_WIDTH = 180
export const MAX_DAYS = 366 // Leap year

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export function dateToDay(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  let day = Math.floor(diff / (24 * 60 * 60 * 1000))

  // Adjust for non-leap years - skip Feb 29
  if (!isLeapYear(date.getFullYear()) && date.getMonth() > 1) {
    day += 1
  }

  return day
}

export function formatMonthDay(date: Date): string {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${date.getDate()} ${monthNames[date.getMonth()]}`
}

export function generateYearDays(): Date[] {
  const days: Date[] = []
  const baseYear = 2000 // Leap year for full 366 days
  const startDate = new Date(baseYear, 0, 1)

  for (let i = 0; i < MAX_DAYS; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    days.push(date)
  }

  return days
}
