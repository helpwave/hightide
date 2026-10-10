import type { DateTimeFormat, DateTimePrecision } from '@helpwave/hightide-utils/utils'
import { DateUtils } from '@helpwave/hightide-utils/utils'

export const editableSegmentTypes = [
  'day',
  'month',
  'year',
  'hour',
  'minute',
  'second',
  'millisecond',
  'dayPeriod',
] as const

export type EditableSegmentType = typeof editableSegmentTypes[number]

export type DateTimeSegment =
  | { kind: 'literal', text: string }
  | { kind: 'editable', type: EditableSegmentType }

export type SegmentValues = Partial<Record<EditableSegmentType, number>>

export type SegmentBuffer = {
  type: EditableSegmentType,
  text: string,
}

export type SegmentEditState = {
  values: SegmentValues,
  buffer: SegmentBuffer | null,
}

export type SegmentBounds = {
  min: number,
  max: number,
}

export type SegmentLayoutOptions = {
  locale: string,
  mode: DateTimeFormat,
  precision: DateTimePrecision,
  is24HourFormat: boolean,
}

const dayPeriodPm = 1
const dayPeriodAm = 0

const digitLength: Record<EditableSegmentType, number> = {
  day: 2,
  month: 2,
  year: 4,
  hour: 2,
  minute: 2,
  second: 2,
  millisecond: 3,
  dayPeriod: 0,
}

export const timeUnitTranslationKey = {
  day: 'time.day',
  month: 'time.month',
  year: 'time.year',
  hour: 'time.hour',
  minute: 'time.minute',
  second: 'time.second',
  millisecond: 'time.millisecond',
} as const satisfies Record<Exclude<EditableSegmentType, 'dayPeriod'>, string>

const referenceDate = new Date(2024, 0, 1, 13, 5, 9, 123)

const maxDayFor = (values: SegmentValues): number => {
  if (values.month === undefined) {
    return 31
  }
  return DateUtils.daysInMonth(values.year ?? 2000, values.month - 1)
}

export const segmentBounds = (type: EditableSegmentType, values: SegmentValues, is24HourFormat: boolean): SegmentBounds => {
  switch (type) {
  case 'day':
    return { min: 1, max: maxDayFor(values) }
  case 'month':
    return { min: 1, max: 12 }
  case 'year':
    return { min: 1, max: 9999 }
  case 'hour':
    return is24HourFormat ? { min: 0, max: 23 } : { min: 1, max: 12 }
  case 'minute':
  case 'second':
    return { min: 0, max: 59 }
  case 'millisecond':
    return { min: 0, max: 999 }
  case 'dayPeriod':
    return { min: dayPeriodAm, max: dayPeriodPm }
  }
}

const segmentsFromParts = (parts: Intl.DateTimeFormatPart[]): DateTimeSegment[] => {
  return parts.map((part): DateTimeSegment => {
    switch (part.type) {
    case 'day':
      return { kind: 'editable', type: 'day' }
    case 'month':
      return { kind: 'editable', type: 'month' }
    case 'year':
      return { kind: 'editable', type: 'year' }
    case 'hour':
      return { kind: 'editable', type: 'hour' }
    case 'minute':
      return { kind: 'editable', type: 'minute' }
    case 'second':
      return { kind: 'editable', type: 'second' }
    case 'dayPeriod':
      return { kind: 'editable', type: 'dayPeriod' }
    default:
      return { kind: 'literal', text: part.value }
    }
  })
}

const buildDateSegments = (locale: string): DateTimeSegment[] => {
  const parts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(referenceDate)
  return segmentsFromParts(parts)
}

const buildTimeSegments = (locale: string, precision: DateTimePrecision, is24HourFormat: boolean): DateTimeSegment[] => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: is24HourFormat ? 'h23' : 'h12',
  }
  if (precision === 'second' || precision === 'millisecond') {
    options.second = '2-digit'
  }
  const parts = new Intl.DateTimeFormat(locale, options).formatToParts(referenceDate)
  const segments = segmentsFromParts(parts)
  if (precision !== 'millisecond') {
    return segments
  }
  return segments.flatMap((segment): DateTimeSegment[] => {
    if (segment.kind === 'editable' && segment.type === 'second') {
      return [segment, { kind: 'literal', text: '.' }, { kind: 'editable', type: 'millisecond' }]
    }
    return [segment]
  })
}

export const buildSegmentLayout = ({ locale, mode, precision, is24HourFormat }: SegmentLayoutOptions): DateTimeSegment[] => {
  switch (mode) {
  case 'date':
    return buildDateSegments(locale)
  case 'time':
    return buildTimeSegments(locale, precision, is24HourFormat)
  case 'dateTime':
    return [
      ...buildDateSegments(locale),
      { kind: 'literal', text: ' - ' },
      ...buildTimeSegments(locale, precision, is24HourFormat),
    ]
  }
}

export const editableTypesOf = (layout: DateTimeSegment[]): EditableSegmentType[] => {
  return layout.flatMap(segment => segment.kind === 'editable' ? [segment.type] : [])
}

const requiredTypesOf = (layout: DateTimeSegment[]): EditableSegmentType[] => {
  return editableTypesOf(layout).filter(type => type !== 'dayPeriod')
}

export const isComplete = (values: SegmentValues, layout: DateTimeSegment[]): boolean => {
  return requiredTypesOf(layout).every(type => values[type] !== undefined)
}

export const isEmpty = (values: SegmentValues, layout: DateTimeSegment[]): boolean => {
  return requiredTypesOf(layout).every(type => values[type] === undefined)
}

const readSegment = (date: Date, type: EditableSegmentType, is24HourFormat: boolean): number => {
  switch (type) {
  case 'day':
    return date.getDate()
  case 'month':
    return date.getMonth() + 1
  case 'year':
    return date.getFullYear()
  case 'hour':
    return is24HourFormat ? date.getHours() : (date.getHours() % 12 || 12)
  case 'minute':
    return date.getMinutes()
  case 'second':
    return date.getSeconds()
  case 'millisecond':
    return date.getMilliseconds()
  case 'dayPeriod':
    return date.getHours() >= 12 ? dayPeriodPm : dayPeriodAm
  }
}

export const decomposeDate = (date: Date, layout: DateTimeSegment[], is24HourFormat: boolean): SegmentValues => {
  const values: SegmentValues = {}
  for (const type of editableTypesOf(layout)) {
    values[type] = readSegment(date, type, is24HourFormat)
  }
  return values
}

export const composeDate = (
  values: SegmentValues,
  layout: DateTimeSegment[],
  mode: DateTimeFormat,
  is24HourFormat: boolean,
  reference: Date = new Date()
): Date | null => {
  if (!isComplete(values, layout)) {
    return null
  }

  const hasDate = mode === 'date' || mode === 'dateTime'
  const hasTime = mode === 'time' || mode === 'dateTime'

  const year = hasDate ? values.year! : reference.getFullYear()
  const monthIndex = (hasDate ? values.month! : reference.getMonth() + 1) - 1
  const day = Math.min(hasDate ? values.day! : reference.getDate(), DateUtils.daysInMonth(year, monthIndex))

  let hour = 0
  if (hasTime) {
    hour = is24HourFormat
      ? values.hour!
      : (values.hour! % 12) + (values.dayPeriod === dayPeriodPm ? 12 : 0)
  }
  const minute = hasTime ? values.minute! : 0
  const second = hasTime ? values.second ?? 0 : 0
  const millisecond = hasTime ? values.millisecond ?? 0 : 0

  return new Date(year, monthIndex, day, hour, minute, second, millisecond)
}

const setSegment = (values: SegmentValues, type: EditableSegmentType, value: number | undefined): SegmentValues => {
  const next: SegmentValues = { ...values }
  if (value === undefined) {
    delete next[type]
  } else {
    next[type] = value
  }
  if (next.day !== undefined) {
    const maxDay = maxDayFor(next)
    if (next.day > maxDay) {
      next.day = maxDay
    }
  }
  return next
}

export const typeDigit = (
  state: SegmentEditState,
  type: EditableSegmentType,
  digit: number,
  is24HourFormat: boolean
): { state: SegmentEditState, advance: boolean } => {
  const { min, max } = segmentBounds(type, state.values, is24HourFormat)
  const continuing = state.buffer?.type === type

  let text = (continuing ? state.buffer!.text : '') + String(digit)
  if (Number(text) > max) {
    text = String(digit)
  }
  const numeric = Number(text)

  const values = setSegment(state.values, type, numeric >= min ? numeric : undefined)
  const advance = text.length >= digitLength[type] || numeric * 10 > max

  return {
    state: { values, buffer: advance ? null : { type, text } },
    advance,
  }
}

export const stepSegment = (
  state: SegmentEditState,
  type: EditableSegmentType,
  delta: number,
  is24HourFormat: boolean
): SegmentEditState => {
  const { min, max } = segmentBounds(type, state.values, is24HourFormat)
  const current = state.values[type]

  let next: number
  if (current === undefined) {
    next = delta > 0 ? min : max
  } else {
    next = current + delta
    if (next > max) {
      next = min
    } else if (next < min) {
      next = max
    }
  }

  return { values: setSegment(state.values, type, next), buffer: null }
}

export const clearSegment = (state: SegmentEditState, type: EditableSegmentType): SegmentEditState => {
  return { values: setSegment(state.values, type, undefined), buffer: null }
}

export const setDayPeriod = (state: SegmentEditState, period: number): SegmentEditState => {
  return { values: setSegment(state.values, 'dayPeriod', period), buffer: null }
}

const formatDayPeriod = (value: number, locale: string): string => {
  const part = new Intl.DateTimeFormat(locale, { hour: 'numeric', hourCycle: 'h12' })
    .formatToParts(new Date(2020, 0, 1, value === dayPeriodPm ? 13 : 1))
    .find(entry => entry.type === 'dayPeriod')
  return part?.value ?? (value === dayPeriodPm ? 'PM' : 'AM')
}

export const segmentPlaceholder = (type: EditableSegmentType, locale: string): string => {
  const german = locale.toLowerCase().startsWith('de')
  switch (type) {
  case 'day':
    return german ? 'TT' : 'DD'
  case 'month':
    return 'MM'
  case 'year':
    return german ? 'JJJJ' : 'YYYY'
  case 'hour':
    return 'hh'
  case 'minute':
    return 'mm'
  case 'second':
    return 'ss'
  case 'millisecond':
    return 'sss'
  case 'dayPeriod':
    return formatDayPeriod(dayPeriodAm, locale)
  }
}

export const formatSegment = (
  type: EditableSegmentType,
  values: SegmentValues,
  buffer: SegmentBuffer | null,
  locale: string
): string => {
  if (buffer?.type === type) {
    return buffer.text
  }
  const value = values[type]
  if (value === undefined) {
    return segmentPlaceholder(type, locale)
  }
  if (type === 'dayPeriod') {
    return formatDayPeriod(value, locale)
  }
  return String(value).padStart(digitLength[type], '0')
}
