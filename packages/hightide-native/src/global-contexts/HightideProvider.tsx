import { useMemo, type PropsWithChildren } from 'react'
import { ArrayUtil } from '@helpwave/hightide-utils/utils'
import { hightideTranslation } from '@helpwave/hightide-utils/i18n'
import { useNativeKeyValueStore } from '../hooks/useNativeKeyValueStore'
import type { LocalizationProviderProps } from './localization'
import { LocalizationProvider } from './localization'
import type { ThemeProviderProps } from './theme'
import { ThemeProvider } from './theme'
import type { TranslationProviderProps } from './translation'
import { TranslationProvider } from './translation'

export type HightideProviderProps = PropsWithChildren & {
  theme?: Omit<ThemeProviderProps, 'children' | 'store'>,
  locale?: Omit<LocalizationProviderProps, 'children' | 'store'>,
  translation?: Omit<TranslationProviderProps, 'children' | 'locale'>,
}

export const HightideProvider = ({
  children,
  theme,
  locale,
  translation,
}: HightideProviderProps) => {
  const store = useNativeKeyValueStore()
  const resolvedTranslations = useMemo(() => [
    ...ArrayUtil.resolveSingleOrArray(translation?.translation ?? []),
    hightideTranslation,
  ], [translation?.translation])

  if (!store.isHydrated) return null

  return (
    <LocalizationProvider {...locale} store={store}>
      <TranslationProvider {...translation} translation={resolvedTranslations}>
        <ThemeProvider {...theme} store={store}>
          {children}
        </ThemeProvider>
      </TranslationProvider>
    </LocalizationProvider>
  )
}
