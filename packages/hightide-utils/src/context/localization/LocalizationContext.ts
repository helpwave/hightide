import { createContext } from 'react'

export type Locale = 'de-DE' | 'en-US' | string

export type TimeZone = string

export type LocaleInformation = {
  locale: Locale,
  localName: string,
}

export type LocalizationContextValue = {
  locale: Locale,
  setLocale: (locale: Locale) => void,
  supportedLocales: readonly LocaleInformation[],
  timeZone: TimeZone | undefined,
  setTimeZone: (timeZone: TimeZone | null) => void,
  is24HourFormat: boolean | undefined,
  setIs24HourFormat: (is24HourFormat: boolean | null) => void,
  isInitialized: boolean,
}

export const LocalizationContext = createContext<LocalizationContextValue | null>(null)
