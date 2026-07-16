import type { PropsWithChildren } from 'react'
import {
  LocalizationProvider as LocalizationProviderBase,
  type LocalizationProviderProps as LocalizationProviderPropsBase
} from '@helpwave/hightide-utils/context/localization'
import type { SimpleValueStore } from '@helpwave/hightide-utils/hooks'
import { useNativeKeyValueStore } from '../../hooks/useNativeKeyValueStore'
import { HightideConfigUtils } from '../hightide-config/HightideConfigUtils'

export type LocalizationProviderProps = PropsWithChildren
  & Omit<LocalizationProviderPropsBase, 'store' | 'fallbackLocale' | 'supportedLocales'>
  & Partial<Pick<LocalizationProviderPropsBase, 'fallbackLocale' | 'supportedLocales'>>
  & {
    store?: SimpleValueStore,
  }

export const LocalizationProvider = ({
  children,
  store: storeProp,
  fallbackLocale = 'de-DE',
  supportedLocales = HightideConfigUtils.defaultSupportedLocales,
  ...rest
}: LocalizationProviderProps) => {
  const nativeStore = useNativeKeyValueStore()
  const store = storeProp ?? nativeStore
  const isHydrated = storeProp ? true : nativeStore.isHydrated

  if (!isHydrated) return null

  return (
    <LocalizationProviderBase
      store={store}
      fallbackLocale={fallbackLocale}
      supportedLocales={supportedLocales}
      {...rest}
    >
      {children}
    </LocalizationProviderBase>
  )
}
