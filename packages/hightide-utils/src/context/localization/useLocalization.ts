import { useContext } from 'react'
import type { LocalizationContextValue } from './LocalizationContext'
import { LocalizationContext } from './LocalizationContext'

export const useLocalization = (): LocalizationContextValue => {
  const context = useContext(LocalizationContext)
  if (!context) {
    throw new Error(
      'useLocalization must be used within LocalizationContext. Try adding a LocalizationProvider around your app.'
    )
  }

  return context
}
