import { createContext } from 'react'
import type { CalendarType, Weekday } from '../../utils/date'

export type Locale = string

export type TimeZone = string

export type { Weekday, CalendarType }

export type LocaleInformation = {
  localName: string,
  defaultTimeZone?: TimeZone,
  defaultIs24HourFormat?: boolean,
  defaultStartingWeekday?: Weekday,
  defaultCalendarType?: CalendarType,
}

export type SupportedLocalesConfig = Record<string, LocaleInformation>

export type LocalizationContextValue = {
  locale: Locale,
  setLocale: (locale: Locale) => void,
  timeZone: TimeZone | undefined,
  setTimeZone: (timeZone: TimeZone | null) => void,
  is24HourFormat: boolean | undefined,
  setIs24HourFormat: (is24HourFormat: boolean | null) => void,
  startingWeekday: Weekday,
  setStartingWeekday: (startingWeekday: Weekday | null) => void,
  calendarType: CalendarType,
  setCalendarType: (calendarType: CalendarType | null) => void,
  supportedLocales: SupportedLocalesConfig,
  isInitialized: boolean,
}

export const LocalizationContext = createContext<LocalizationContextValue | null>(null)
