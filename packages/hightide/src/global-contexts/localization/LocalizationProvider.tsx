import type { PropsWithChildren } from 'react'
import {
  LocalizationProvider as LocalizationProviderBase,
  type SupportedLocalesConfig,
  type LocalizationProviderProps as LocalizationProviderPropsBase
} from '@helpwave/hightide-utils/context/localization'
import { useBrowserKeyValueStore } from '@helpwave/hightide-utils/hooks'
import { LocalizationUtils } from '@helpwave/hightide-utils/utils'
import { useEffect, useState } from 'react'
import { useHightideConfig } from '../hightide-config'

export type LocalizationProviderProps = PropsWithChildren
  & Omit<LocalizationProviderPropsBase, 'store' | 'systemLocale' | 'fallbackLocale' | 'supportedLocales'>
  & Partial<Pick<LocalizationProviderPropsBase, 'fallbackLocale' | 'supportedLocales' | 'store'>>

const detectWebSystemLocale = (supportedLocales: SupportedLocalesConfig): string | undefined => {
  if (typeof window === 'undefined') return undefined
  return LocalizationUtils.matchBrowserLocales(
    window.navigator.languages,
    Object.keys(supportedLocales),
    LocalizationUtils.isoLocaleToLanguageShort
  )
}

const useWebSystemLocale = (supportedLocales: SupportedLocalesConfig) => {
  const [systemLocale, setSystemLocale] = useState<string | undefined>(() =>
    detectWebSystemLocale(supportedLocales))

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateSystemLocale = () => {
      setSystemLocale(detectWebSystemLocale(supportedLocales))
    }

    window.addEventListener('languagechange', updateSystemLocale)
    return () => window.removeEventListener('languagechange', updateSystemLocale)
  }, [supportedLocales])

  return systemLocale
}

export const LocalizationProvider = ({
  children,
  fallbackLocale,
  supportedLocales,
  store: storeOverride,
  ...rest
}: LocalizationProviderProps) => {
  const browserStore = useBrowserKeyValueStore()
  const store = storeOverride ?? browserStore
  const { config } = useHightideConfig()
  const resolvedSupportedLocales = supportedLocales ?? config.localization.supportedLocales
  const detectedSystemLocale = useWebSystemLocale(resolvedSupportedLocales)

  return (
    <LocalizationProviderBase
      store={store}
      fallbackLocale={fallbackLocale ?? config.localization.fallbackLocale}
      supportedLocales={resolvedSupportedLocales}
      systemLocale={detectedSystemLocale}
      {...rest}
    >
      {children}
    </LocalizationProviderBase>
  )
}
