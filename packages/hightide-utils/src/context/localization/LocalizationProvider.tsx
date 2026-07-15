import type { PropsWithChildren } from 'react'
import type { LocalizationContextValue } from './LocalizationContext'
import { LocalizationContext } from './LocalizationContext'
import type { UseCreateLocalizationContextProps } from './useCreateLocalizationContext'
import { useCreateLocalizationContext } from './useCreateLocalizationContext'
import { StringUnionUtils } from '@/src/utils'

export type LocalizationProviderProps<TLocale extends string> =
  PropsWithChildren & UseCreateLocalizationContextProps<TLocale>

export const LocalizationProvider = <TLocale extends string>({
  children,
  onChangedLocale,
  ...localizationProps
}: LocalizationProviderProps<TLocale>) => {
  const value: LocalizationContextValue<string> = useCreateLocalizationContext<string>({
    ...localizationProps,
    onChangedLocale: () => {
      if(StringUnionUtils.isUnionValue(value, localizationProps.supportedLocales)) onChangedLocale?.(value)
    }
  })

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  )
}
