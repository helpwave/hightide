import type { PropsWithChildren } from 'react'
import {
  LocalizationProvider as LocalizationProviderBase,
  type LocalizationProviderProps as LocalizationProviderPropsBase
} from '@helpwave/hightide-utils/context/localization'
import { useNativeKeyValueStore } from '../../hooks/useNativeKeyValueStore'
import { HightideConfigUtils } from '../hightide-config/HightideConfigUtils'

export type LocalizationProviderProps = PropsWithChildren
  & Omit<LocalizationProviderPropsBase, 'store' | 'fallbackLocale' | 'supportedLocales'>
  & Partial<Pick<LocalizationProviderPropsBase, 'fallbackLocale' | 'supportedLocales'>>

export const LocalizationProvider = ({
  children,
  fallbackLocale = 'de-DE',
  supportedLocales = HightideConfigUtils.defaultSupportedLocales,
  ...rest
}: LocalizationProviderProps) => {
  const store = useNativeKeyValueStore()

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
