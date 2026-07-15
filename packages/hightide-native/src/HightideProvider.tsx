import { useMemo, type PropsWithChildren } from 'react'
import type { TranslationProviderProps } from '@helpwave/hightide-utils'
import { ArrayUtil, hightideTranslation, TranslationProvider } from '@helpwave/hightide-utils'
import { useNativeKeyValueStore } from './hooks/useNativeKeyValueStore'
import type { LocaleProviderProps } from './locale/LocaleContext'
import { LocaleProvider } from './locale/LocaleContext'
import type { ThemeProviderProps } from './theme/ThemeContext'
import { ThemeProvider } from './theme/ThemeContext'

export type HightideProviderProps = PropsWithChildren & {
  theme?: Omit<ThemeProviderProps, 'children' | 'store'>,
  locale?: Omit<LocaleProviderProps, 'children' | 'store'>,
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
    <LocaleProvider {...locale} store={store}>
      <TranslationProvider {...translation} translation={resolvedTranslations}>
        <ThemeProvider {...theme} store={store}>
          {children}
        </ThemeProvider>
      </TranslationProvider>
    </LocaleProvider>
  )
}
