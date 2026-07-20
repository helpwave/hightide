import { createContext } from 'react'

export type LocaleInformation = {
  locale: string,
  localName: string,
}

export type LocalizationContextValue = {
  locale: string,
  setLocale: (locale: string) => void,
  supportedLocales: readonly LocaleInformation[],
  timeZone: string | undefined,
  setTimeZone: (timeZone: string | null) => void,
  is24HourFormat: boolean | undefined,
  setIs24HourFormat: (is24HourFormat: boolean | null) => void,
  isInitialized: boolean,
}

export const LocalizationContext = createContext<LocalizationContextValue | null>(null)
