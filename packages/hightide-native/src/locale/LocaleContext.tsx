import type { PropsWithChildren } from 'react'
import {
  LocalizationContext,
  LocalizationProvider,
  useDateTimeFormat,
  useLanguage as useLocalizationLanguage,
  useLocalization,
  useMemoryKeyValueStore,
  useTimeZone,
  type LocaleWithSystem,
  type LocalizationContextValue,
} from '@helpwave/hightide-utils'

export type NativeTranslationLocales = 'de-DE' | 'en-US'

export type LocaleContextValue = LocalizationContextValue<NativeTranslationLocales>

export {
  LocalizationContext as LocaleContext,
  useTimeZone,
  useDateTimeFormat,
}

export const useLocale = (): LocaleContextValue => useLocalization<NativeTranslationLocales>()

export const useLanguage = () => (
  useLocalizationLanguage<NativeTranslationLocales>((locale) => locale.split('-')[0])
)

export type LocaleProviderProps = PropsWithChildren & {
  fallbackLocale?: NativeTranslationLocales,
  locale?: LocaleWithSystem<NativeTranslationLocales>,
  systemLocale?: NativeTranslationLocales,
  onChangedLocale?: (locale: NativeTranslationLocales) => void,
  timeZone?: string,
  onChangedTimeZone?: (timeZone: string | undefined) => void,
  is24HourFormat?: boolean,
  onChangedIs24HourFormat?: (is24HourFormat: boolean) => void,
  fallbackTimeZone?: string,
  fallbackIs24HourFormat?: boolean,
}

export const LocaleProvider = ({
  children,
  fallbackLocale = 'de-DE',
  ...rest
}: LocaleProviderProps) => {
  const store = useMemoryKeyValueStore()

  return (
    <LocalizationProvider
      store={store}
      fallbackLocale={fallbackLocale}
      {...rest}
    >
      {children}
    </LocalizationProvider>
  )
}
