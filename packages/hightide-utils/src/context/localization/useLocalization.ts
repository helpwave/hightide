import { useContext } from 'react'
import type { LocalizationContextValue } from './LocalizationContext'
import { LocalizationContext } from './LocalizationContext'

export const useLocalization = <TLocale extends string = string>(): LocalizationContextValue<TLocale> => {
  const context = useContext(LocalizationContext)
  if (!context) {
    throw new Error(
      'useLocalization must be used within LocalizationContext. Try adding a LocalizationProvider around your app.'
    )
  }

  // This assertion might become invalid if the provider and the user of the useLocalization hook
  // use different defintions of TLocale
  return context as unknown as LocalizationContextValue<TLocale>
}
