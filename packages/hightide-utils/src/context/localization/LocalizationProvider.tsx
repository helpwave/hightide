import type { PropsWithChildren } from 'react'
import { LocalizationContext } from './LocalizationContext'
import { useCreateLocalizationContext } from './useCreateLocalizationContext'
import type { LocalizationContextValue, UseCreateLocalizationContextProps } from './types'

export type LocalizationProviderProps<TLocale extends string> =
  PropsWithChildren & UseCreateLocalizationContextProps<TLocale>

export const LocalizationProvider = <TLocale extends string>({
  children,
  ...localizationProps
}: LocalizationProviderProps<TLocale>) => {
  const value: LocalizationContextValue<TLocale> = useCreateLocalizationContext<TLocale>(localizationProps)

  return (
    <LocalizationContext.Provider value={value as unknown as LocalizationContextValue<string>}>
      {children}
    </LocalizationContext.Provider>
  )
}
