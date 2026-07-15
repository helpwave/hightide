import { useContext } from 'react'
import { LocalizationContext } from './LocalizationContext'
import type { LocalizationContextValue } from './types'

export const useLocalization = <TLocale extends string = string>(): LocalizationContextValue<TLocale> => {
  const context = useContext(LocalizationContext)
  if (!context) {
    throw new Error(
      'useLocalization must be used within LocalizationContext. Try adding a LocalizationProvider around your app.',
    )
  }
  return context as LocalizationContextValue<TLocale>
}
