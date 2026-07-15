import type { TranslationEntries } from '@helpwave/internationalization'
import { useContext } from 'react'
import type { TranslationContextValue } from './TranslationContext'
import { TranslationContext } from './TranslationContext'

export const useTranslation = <
  L extends string,
  T extends TranslationEntries
>(): TranslationContextValue<L, T> => {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error(
      'useTranslation must be used within TranslationContext. Try adding a TranslationProvider around your app.'
    )
  }

  return context as TranslationContextValue<L, T>
}
