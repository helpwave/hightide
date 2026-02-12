import { equalSizeGroups } from '@/src/utils/array'
import type { DurationJSON } from '@/src/utils/duration'

const DateTimeFormat = ['date', 'time', 'dateTime'] as const
export type DateTimeFormat = typeof DateTimeFormat[number]

const timesInSeconds = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  monthImprecise: 2629800, // 30.4375 days
  yearImprecise: 31557600, // 365.25 days
} as const


const monthsList = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'] as const
export type Month = typeof monthsList[number]

const weekDayList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
export type WeekDay = typeof weekDayList[number]

const changeDuration = (date: Date, duration: Partial<DurationJSON>, isAdding?: boolean): Date => {
  const {
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  } = duration

  // Check ranges
  if (years < 0) {
    console.error(`Range error years must be greater than 0: received ${years}`)
    return new Date(date)
  }
  if (months < 0 || months > 11) {
    console.error(`Range error month must be 0 <= month <= 11: received ${months}`)
    return new Date(date)
  }
  if (days < 0) {
    console.error(`Range error days must be greater than 0: received ${days}`)
    return new Date(date)
  }
  if (hours < 0 || hours > 23) {
    console.error(`Range error hours must be 0 <= hours <= 23: received ${hours}`)
    return new Date(date)
  }
  if (minutes < 0 || minutes > 59) {
    console.error(`Range error minutes must be 0 <= minutes <= 59: received ${minutes}`)
    return new Date(date)
  }
  if (seconds < 0 || seconds > 59) {
    console.error(`Range error seconds must be 0 <= seconds <= 59: received ${seconds}`)
    return new Date(date)
  }
  if (milliseconds < 0) {
    console.error(`Range error seconds must be greater than 0: received ${milliseconds}`)
    return new Date(date)
  }

  const multiplier = isAdding ? 1 : -1

  const newDate = new Date(date)

  newDate.setFullYear(newDate.getFullYear() + multiplier * years)

  newDate.setMonth(newDate.getMonth() + multiplier * months)

  newDate.setDate(newDate.getDate() + multiplier * days)

  newDate.setHours(newDate.getHours() + multiplier * hours)

  newDate.setMinutes(newDate.getMinutes() + multiplier * minutes)

  newDate.setSeconds(newDate.getSeconds() + multiplier * seconds)

  newDate.setMilliseconds(newDate.getMilliseconds() + multiplier * milliseconds)

  return newDate
}

const addDuration = (date: Date, duration: Partial<DurationJSON>): Date => {
  return changeDuration(date, duration, true)
}

const subtractDuration = (date: Date, duration: Partial<DurationJSON>): Date => {
  return changeDuration(date, duration, false)
}

/** Checks if a given date is in the range of two dates
 *
 * An undefined value for startDate or endDate means no bound for the start or end respectively
 */
const between = (value: Date, startDate?: Date, endDate?: Date): boolean => {
  if (startDate && endDate) {
    console.assert(startDate <= endDate)
    return startDate <= value && value <= endDate
  } else if (startDate) {
    return startDate <= value
  } else if (endDate) {
    return endDate >= value
  } else {
    return true
  }
}

/** Compare two dates on the year, month, day */
const equalDate = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()
}

const weeksForCalenderMonth = (date: Date, weekStart: WeekDay, weeks: number = 6) => {
  const month = date.getMonth()
  const year = date.getFullYear()

  const dayList: Date[] = []
  let currentDate = new Date(year, month, 1) // Start of month
  const weekStartIndex = weekDayList.indexOf(weekStart)

  // Move the current day to the week before
  while (currentDate.getDay() !== weekStartIndex) {
    currentDate = subtractDuration(currentDate, { days: 1 })
  }

  while (dayList.length < 7 * weeks) {
    const date = new Date(currentDate)
    date.setHours(date.getHours(), date.getMinutes()) // To make sure we are not overwriting the time
    dayList.push(date)
    currentDate = addDuration(currentDate, { days: 1 })
  }

  // weeks
  return equalSizeGroups(dayList, 7)
}

const formatAbsolute = (date: Date, locale: string, format: DateTimeFormat) => {
  let options: Intl.DateTimeFormatOptions

  switch (format) {
  case 'date':
    options = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    }
    break
  case 'time':
    options = {
      hour: '2-digit',
      minute: '2-digit',
    }
    break
  case 'dateTime':
    options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }
    break
  }

  return new Intl.DateTimeFormat(locale, options).format(date)
}

const formatRelative = (date: Date, locale: string) => {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const now = new Date()
  const diffInSeconds = (date.getTime() - now.getTime()) / 1000

  if (Math.abs(diffInSeconds) < timesInSeconds.minute) return rtf.format(Math.round(diffInSeconds), 'second')
  if (Math.abs(diffInSeconds) < timesInSeconds.hour) return rtf.format(Math.round(diffInSeconds / timesInSeconds.minute), 'minute')
  if (Math.abs(diffInSeconds) < timesInSeconds.day) return rtf.format(Math.round(diffInSeconds / timesInSeconds.hour), 'hour')
  if (Math.abs(diffInSeconds) < timesInSeconds.week) return rtf.format(Math.round(diffInSeconds / timesInSeconds.day), 'day')
  if (Math.abs(diffInSeconds) < timesInSeconds.monthImprecise) return rtf.format(Math.round(diffInSeconds / timesInSeconds.week), 'week')
  if (Math.abs(diffInSeconds) < timesInSeconds.monthImprecise) return rtf.format(Math.round(diffInSeconds / timesInSeconds.monthImprecise), 'month')

  return rtf.format(Math.round(diffInSeconds / timesInSeconds.monthImprecise), 'year')
}

export const DateUtils = {
  monthsList,
  weekDayList,
  equalDate,
  formatAbsolute,
  formatRelative,
  addDuration,
  subtractDuration,
  between,
  weeksForCalenderMonth,
  timesInSeconds,
}