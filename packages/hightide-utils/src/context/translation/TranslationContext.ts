import type { TranslationEntries } from '@helpwave/internationalization'
import type { combineTranslation } from '@helpwave/internationalization'
import { createContext } from 'react'

export type TranslationContextValue<
  L extends string,
  T extends TranslationEntries
> = ReturnType<typeof combineTranslation<L, T>>

export const TranslationContext = createContext<
TranslationContextValue<string, TranslationEntries> | null
>(null)
