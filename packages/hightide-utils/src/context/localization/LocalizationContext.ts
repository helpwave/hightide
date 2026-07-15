import { createContext } from 'react'

export type LocaleWithSystem<TLocale extends string> = TLocale | 'system'

export type LocalizationContextValue<TLocale extends string = string> = {
  locale: TLocale,
  setLocale: (locale: LocaleWithSystem<TLocale>) => void,
  supportedLocales: readonly TLocale[],
  timeZone: string | undefined,
  setTimeZone: (timeZone: string | null) => void,
  is24HourFormat: boolean | undefined,
  setIs24HourFormat: (is24HourFormat: boolean | null) => void,
}

export const LocalizationContext = createContext<LocalizationContextValue<string> | null>(null)
