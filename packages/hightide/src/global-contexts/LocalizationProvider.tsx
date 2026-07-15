import type { PropsWithChildren } from 'react'
import { useEffect, useState } from 'react'
import type {
  KeyValueStore } from '@helpwave/hightide-utils'
import {
  LocalizationContext,
  LocalizationProvider as LocalizationProviderBase,
  matchBrowserLocales,
  useBrowserKeyValueStore,
  useDateTimeFormat,
  useLocalization,
  useTimeZone,
  type LocalizationContextValue as LocalizationContextValueBase,
  type LocalizationProviderProps as LocalizationProviderPropsBase
} from '@helpwave/hightide-utils'
import { LocalizationUtil } from '../i18n/util'
import type { HightideTranslationLocales } from '@/src/i18n/translations'

export type HightideLocales<T extends string = string> = T | HightideTranslationLocales

export type LocalizationContextValue<T extends string = string> = LocalizationContextValueBase<HightideLocales<T>>

export {
  LocalizationContext,
  useLocalization,
  useTimeZone,
  useDateTimeFormat,
}

export type LocalizationProviderProps<T extends string = string> = PropsWithChildren
  & Omit<LocalizationProviderPropsBase<HightideLocales<T>>, 'store'>

const detectWebSystemLocale = (): HightideTranslationLocales | undefined => {
  if (typeof window === 'undefined') return undefined
  return matchBrowserLocales(
    window.navigator.languages,
    LocalizationUtil.locals,
    LocalizationUtil.localToLanguage
  )
}

const useWebSystemLocale = <T extends string>() => {
  const [systemLocale, setSystemLocale] = useState<HightideLocales<T> | undefined>(() =>
    detectWebSystemLocale())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateSystemLocale = () => {
      setSystemLocale(detectWebSystemLocale())
    }

    window.addEventListener('languagechange', updateSystemLocale)
    return () => window.removeEventListener('languagechange', updateSystemLocale)
  }, [])

  return systemLocale
}

export const LocalizationProvider = <T extends string = string>({
  children,
  fallbackLocale = 'de-DE' as HightideLocales<T>,
  systemLocale: systemLocaleOverride,
  ...rest
}: LocalizationProviderProps<T>) => {
  const store: KeyValueStore<string> = useBrowserKeyValueStore<string>()
  const detectedSystemLocale = useWebSystemLocale<T>()
  const systemLocale = systemLocaleOverride ?? detectedSystemLocale

  return (
    <LocalizationProviderBase<HightideLocales<T>>
      store={store as KeyValueStore<unknown>}
      fallbackLocale={fallbackLocale}
      systemLocale={systemLocale}
      {...rest}
    >
      {children}
    </LocalizationProviderBase>
  )
}
