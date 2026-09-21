import type { PropsWithChildren } from 'react'
import {
  LocalizationProvider as LocalizationProviderBase,
  type SupportedLocalesConfig,
  type LocalizationProviderProps as LocalizationProviderPropsBase
} from '@helpwave/hightide-utils/context/localization'
import { useBrowserKeyValueStore } from '@helpwave/hightide-utils/hooks'
import { LocalizationUtils } from '@helpwave/hightide-utils/utils'
import { useEffect, useState } from 'react'
import { useHightideConfig } from '../hightide-config/HightideConfigContext'
import { SafeGlobals } from '../../utils/safeGlobals'

export type LocalizationProviderProps = PropsWithChildren
  & Omit<LocalizationProviderPropsBase, 'store' | 'systemLocale' | 'fallbackLocale' | 'supportedLocales'>
  & Partial<Pick<LocalizationProviderPropsBase, 'fallbackLocale' | 'supportedLocales' | 'store'>>

const detectWebSystemLocale = (supportedLocales: SupportedLocalesConfig): string | undefined => {
  const win = SafeGlobals.window('useWebSystemLocale.detect')
  if (!win) return undefined
  return LocalizationUtils.matchBrowserLocales(
    win.navigator.languages,
    Object.keys(supportedLocales),
    LocalizationUtils.isoLocaleToLanguageShort
  )
}

const useWebSystemLocale = (supportedLocales: SupportedLocalesConfig) => {
  const [systemLocale, setSystemLocale] = useState<string | undefined>(undefined)

  useEffect(() => {
    const updateSystemLocale = () => {
      setSystemLocale(detectWebSystemLocale(supportedLocales))
    }

    updateSystemLocale()

    const win = SafeGlobals.window('useWebSystemLocale')
    if (!win) return

    win.addEventListener('languagechange', updateSystemLocale)
    return () => win.removeEventListener('languagechange', updateSystemLocale)
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
