import { equalSizeGroups } from '@/src/utils/array'
import type { DurationJSON } from '@/src/utils/duration'

const DateTimeFormat = ['date', 'time', 'dateTime'] as const
export type DateTimeFormat = typeof DateTimeFormat[number]

export type DateTimePrecision = 'minute' | 'second' | 'millisecond'

const timesInSeconds = {
  second: 1,
  minute: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  monthImprecise: 2629800,
  yearImprecise: 31557600,
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

const equalDate = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()
}

const isLastMillisecondOfDay = (date: Date): boolean => {
  const next = new Date(date.getTime() + 1)
  return !equalDate(date, next)
}

const daysInMonth = (year: number, monthIndex: number): number => {
  return new Date(year, monthIndex + 1, 0).getDate()
}


const sameTime = (a: Date, b: Date, compareSeconds: boolean = false, compareMilliseconds: boolean = false): boolean => {
  if (a.getHours() !== b.getHours() || a.getMinutes() !== b.getMinutes()) {
    return false
  }
  if (compareSeconds && a.getSeconds() !== b.getSeconds()) {
    return false
  }
  if (compareMilliseconds && a.getMilliseconds() !== b.getMilliseconds()) {
    return false
  }
  return true
}

const withTime = (datePart: Date, timePart: Date): Date => {
  const out = new Date(datePart)
  out.setHours(
    timePart.getHours(),
    timePart.getMinutes(),
    timePart.getSeconds(),
    timePart.getMilliseconds()
  )
  return out
}

type ZonedParts = {
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  millisecond: number,
}

const zonedPartsFormatterCache = new Map<string, Intl.DateTimeFormat>()

const zonedPartsFormatter = (timeZone: string): Intl.DateTimeFormat => {
  let formatter = zonedPartsFormatterCache.get(timeZone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    zonedPartsFormatterCache.set(timeZone, formatter)
  }
  return formatter
}

const zonedParts = (date: Date, timeZone: string): ZonedParts => {
  const parts: Record<string, string> = {}
  for (const part of zonedPartsFormatter(timeZone).formatToParts(date)) {
    if (part.type !== 'literal') {
      parts[part.type] = part.value
    }
  }
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    second: Number(parts.second),
    millisecond: date.getMilliseconds(),
  }
}

const zoneOffsetMs = (date: Date, timeZone: string): number => {
  const parts = zonedParts(date, timeZone)
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second, parts.millisecond)
  return asUtc - date.getTime()
}

function toZonedDate(date: Date, timeZone?: string): Date
function toZonedDate(date: null, timeZone?: string): null
function toZonedDate(date: Date | null, timeZone?: string): Date | null
function toZonedDate(date: Date | null, timeZone?: string): Date | null {
  if (!date || !timeZone) {
    return date
  }
  const parts = zonedParts(date, timeZone)
  return new Date(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second, parts.millisecond)
}

function fromZonedDate(date: Date, timeZone?: string): Date
function fromZonedDate(date: null, timeZone?: string): null
function fromZonedDate(date: Date | null, timeZone?: string): Date | null
function fromZonedDate(date: Date | null, timeZone?: string): Date | null {
  if (!date || !timeZone) {
    return date
  }
  const asUtc = Date.UTC(
    date.getFullYear(), date.getMonth(), date.getDate(),
    date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()
  )
  let offset = zoneOffsetMs(new Date(asUtc), timeZone)
  const refined = zoneOffsetMs(new Date(asUtc - offset), timeZone)
  if (refined !== offset) {
    offset = refined
  }
  return new Date(asUtc - offset)
}

const weeksForCalenderMonth = (date: Date, weekStart: WeekDay, weeks: number = 6) => {
  const month = date.getMonth()
  const year = date.getFullYear()

  const dayList: Date[] = []
  let currentDate = new Date(year, month, 1)
  const weekStartIndex = weekDayList.indexOf(weekStart)

  while (currentDate.getDay() !== weekStartIndex) {
    currentDate = subtractDuration(currentDate, { days: 1 })
  }

  while (dayList.length < 7 * weeks) {
    const date = new Date(currentDate)
    date.setHours(date.getHours(), date.getMinutes())
    dayList.push(date)
    currentDate = addDuration(currentDate, { days: 1 })
  }

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
  if (Math.abs(diffInSeconds) < timesInSeconds.yearImprecise) return rtf.format(Math.round(diffInSeconds / timesInSeconds.monthImprecise), 'month')

  return rtf.format(Math.round(diffInSeconds / timesInSeconds.yearImprecise), 'year')
}

const toInputString = (date: Date, format: DateTimeFormat, precision: DateTimePrecision = 'minute', isLocalTime: boolean = true) => {
  const pad = (n: number, l = 2) => String(n).padStart(l, '0')

  const parts = isLocalTime
    ? {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      min: date.getMinutes(),
      s: date.getSeconds(),
      ms: date.getMilliseconds()
    }
    : {
      y: date.getUTCFullYear(),
      m: date.getUTCMonth() + 1,
      d: date.getUTCDate(),
      h: date.getUTCHours(),
      min: date.getUTCMinutes(),
      s: date.getUTCSeconds(),
      ms: date.getUTCMilliseconds()
    }

  const dateStr = `${pad(parts.y, 4)}-${pad(parts.m)}-${pad(parts.d)}`

  let timeStr = `${pad(parts.h)}:${pad(parts.min)}`

  if (precision === 'second' || precision === 'millisecond') {
    timeStr += `:${pad(parts.s)}`
  }

  if (precision === 'millisecond') {
    timeStr += `.${pad(parts.ms, 3)}`
  }

  switch (format) {
  case 'date':
    return dateStr
  case 'time':
    return timeStr
  case 'dateTime':
    return `${dateStr}T${timeStr}`
  }
}

function tryParseDate(dateValue: Date | string | number | undefined | null): Date | null {
  if (!dateValue) return null
  if (dateValue instanceof Date) return dateValue
  if (typeof dateValue === 'string' || typeof dateValue === 'number') {
    const parsed = new Date(dateValue)
    return isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

function normalizeToDateOnly(date: Date): Date {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

function normalizeDatetime(dateTime: Date): Date {
  const normalized = new Date(dateTime)
  normalized.setSeconds(0, 0)
  return normalized
}

export const DateUtils = {
  monthsList,
  weekDayList,
  equalDate,
  isLastMillisecondOfDay,
  daysInMonth,
  sameTime,
  withTime,
  zonedParts,
  toZonedDate,
  fromZonedDate,
  formatAbsolute,
  formatRelative,
  addDuration,
  subtractDuration,
  between,
  weeksForCalenderMonth,
  timesInSeconds,
  toInputString,
  tryParseDate,
  toOnlyDate: normalizeToDateOnly,
  toDateTimeOnly: normalizeDatetime,
}