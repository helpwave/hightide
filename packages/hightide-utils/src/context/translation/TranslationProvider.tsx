import type { PropsWithChildren } from 'react'
import { TranslationContext } from './TranslationContext'
import type { UseCreateTranslationContextProps } from './useCreateTranslationContext'
import { useCreateTranslationContext } from './useCreateTranslationContext'

export type TranslationProviderProps = PropsWithChildren & UseCreateTranslationContextProps

export const TranslationProvider = ({
  children,
  translation,
  locale,
}: TranslationProviderProps) => {
  const value = useCreateTranslationContext({ translation, locale })

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}
