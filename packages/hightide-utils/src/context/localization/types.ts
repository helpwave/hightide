import type { KeyValueStore } from '../../hooks/useSingleValueStore'

export type LocaleWithSystem<TLocale extends string> = TLocale | 'system'

export type LocalizationContextValue<TLocale extends string = string> = {
  locale: TLocale,
  setLocale: (locale: LocaleWithSystem<TLocale>) => void,
  timeZone?: string,
  setTimeZone?: (timeZone: string | null) => void,
  is24HourFormat?: boolean,
  setIs24HourFormat?: (is24HourFormat: boolean | null) => void,
}

export type UseCreateLocalizationContextProps<TLocale extends string> = {
  store: KeyValueStore<unknown>,
  fallbackLocale: TLocale,
  fallbackTimeZone?: string,
  fallbackIs24HourFormat?: boolean,
  locale?: LocaleWithSystem<TLocale>,
  systemLocale?: TLocale,
  timeZone?: string,
  is24HourFormat?: boolean,
  onChangedLocale?: (locale: TLocale) => void,
  onChangedTimeZone?: (timeZone: string | undefined) => void,
  onChangedIs24HourFormat?: (is24HourFormat: boolean) => void,
}
