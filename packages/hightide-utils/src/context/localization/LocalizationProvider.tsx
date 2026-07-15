import type { PropsWithChildren } from 'react'
import { LocalizationContext } from './LocalizationContext'
import type { UseCreateLocalizationContextProps } from './useCreateLocalizationContext'
import { useCreateLocalizationContext } from './useCreateLocalizationContext'

export type LocalizationProviderProps =
  PropsWithChildren & UseCreateLocalizationContextProps

export const LocalizationProvider = ({
  children,
  ...localizationProps
}: LocalizationProviderProps) => {
  const value = useCreateLocalizationContext(localizationProps)

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  )
}
