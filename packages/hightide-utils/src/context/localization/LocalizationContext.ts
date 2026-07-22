import { createContext } from 'react'

export type Locale = 'de-DE' | 'en-US' | string

export type TimeZone = string

export type LocaleInformation = {
  localName: string,
}

export type SupportedLocalesConfig = Record<string, LocaleInformation>

export type LocalizationContextValue = {
  locale: Locale,
  setLocale: (locale: Locale) => void,
  supportedLocales: SupportedLocalesConfig,
  timeZone: TimeZone | undefined,
  setTimeZone: (timeZone: TimeZone | null) => void,
  is24HourFormat: boolean | undefined,
  setIs24HourFormat: (is24HourFormat: boolean | null) => void,
  isInitialized: boolean,
}

export const LocalizationContext = createContext<LocalizationContextValue | null>(null)
