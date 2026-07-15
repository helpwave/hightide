import type { PropsWithChildren } from 'react'
import {
  LocalizationContext,
  LocalizationProvider,
  useDateTimeFormat,
  useLocalization,
  useTimeZone,
  type LocaleInformation,
  type LocalizationContextValue,
  type SimpleValueStore,
} from '@helpwave/hightide-utils'
import { useNativeKeyValueStore } from '../hooks/useNativeKeyValueStore'

export type NativeTranslationLocales = 'de-DE' | 'en-US'

export const nativeSupportedLocales: readonly LocaleInformation[] = [
  { locale: 'de-DE', localName: 'Deutsch' },
  { locale: 'en-US', localName: 'English (US)' },
]

export type LocaleContextValue = LocalizationContextValue

export {
  LocalizationContext as LocaleContext,
  useTimeZone,
  useDateTimeFormat,
}

export const useLocale = (): LocaleContextValue => useLocalization()

export type LocaleProviderProps = PropsWithChildren & {
  store?: SimpleValueStore,
  fallbackLocale?: NativeTranslationLocales,
  locale?: string,
  systemLocale?: NativeTranslationLocales,
  onChangedLocale?: (locale: string) => void,
  timeZone?: string,
  onChangedTimeZone?: (timeZone: string | undefined) => void,
  is24HourFormat?: boolean,
  onChangedIs24HourFormat?: (is24HourFormat: boolean) => void,
  fallbackTimeZone?: string,
  fallbackIs24HourFormat?: boolean,
  supportedLocales?: readonly LocaleInformation[],
}

export const LocaleProvider = ({
  children,
  store: storeProp,
  fallbackLocale = 'de-DE',
  supportedLocales = nativeSupportedLocales,
  ...rest
}: LocaleProviderProps) => {
  const nativeStore = useNativeKeyValueStore()
  const store = storeProp ?? nativeStore
  const isHydrated = storeProp ? true : nativeStore.isHydrated

  if (!isHydrated) return null

  return (
    <LocalizationProvider
      store={store}
      fallbackLocale={fallbackLocale}
      supportedLocales={supportedLocales}
      {...rest}
    >
      {children}
    </LocalizationProvider>
  )
}
